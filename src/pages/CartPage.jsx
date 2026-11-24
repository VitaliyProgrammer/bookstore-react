import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import CartItem from "../components/CartItem.jsx";
import CheckoutForm from "../components/CheckoutForm.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getCart, updateQuantity, removeItem } from "../api/cart.js";
import { getBook } from "../api/books.js";
import { createOrder } from "../api/orders.js";
import { formatPrice } from "../utils/money.js";
import { userMessage } from "../utils/errors.js";

// CartPage — кошик і оформлення замовлення (cart.html + js/pages/cart.js).
// Розкладка: ліворуч список книг і форма оформлення, праворуч липкий підсумок з кнопкою.
// CartItemResponseDto не містить ціни й обкладинки, тому для кожної позиції догружаємо книгу (як у лабораторній).
// Підсумок (кількість і сума) не зберігається в стані, а рахується з items при кожному рендері.
export default function CartPage() {
  const showToast = useToast();
  const { setCount, refresh } = useCart();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorText, setErrorText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const cart = await getCart();
        const books = await Promise.all(cart.cartItems.map(item => getBook(item.bookId)));
        if (ignore) return;
        setItems(cart.cartItems.map((item, i) => ({ ...item, price: books[i].price, coverImage: books[i].coverImage })));
        setStatus("ready");
      } catch (error) {
        if (ignore) return;
        setErrorText(userMessage(error));
        setStatus("error");
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  // Рахуємо в копійках, щоб уникнути похибок дробових чисел (0.1 + 0.2 !== 0.3).
  const total = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100;

  // Шапка показує те саме число, що й підсумок кошика.
  useEffect(() => {
    if (status === "ready") setCount(count);
  }, [status, count, setCount]);

  // Повертає true, якщо кількість збережено; false → CartItem поверне в поле старе значення.
  async function handleQuantityChange(item, value) {
    const quantity = Number(value);
    if (quantity === item.quantity) return true;
    if (!Number.isInteger(quantity) || quantity < 1) {
      showToast("Кількість має бути цілим числом від 1", "error");
      return false;
    }
    try {
      await updateQuantity(item.id, quantity);
      setItems(current => current.map(i => (i.id === item.id ? { ...i, quantity } : i)));
      return true;
    } catch (error) {
      showToast(userMessage(error), "error");
      return false;
    }
  }

  async function handleRemove(item) {
    try {
      await removeItem(item.id);
      setItems(current => current.filter(i => i.id !== item.id));
      showToast("Книгу прибрано з кошика");
    } catch (error) {
      showToast(userMessage(error), "error");
    }
  }

  // CheckoutForm вже перевірив поля і зібрав їх в один рядок shippingAddress.
  async function handleCheckout(shippingAddress) {
    setSubmitting(true);
    try {
      const order = await createOrder(shippingAddress);
      refresh();
      navigate(`/orders?created=${order.id}`);
    } catch (error) {
      showToast(userMessage(error), "error");
      setSubmitting(false);
    }
  }

  return (
    <>
      <title>Кошик — Твоя книгарня</title>
      <h1 className="page__title">Кошик</h1>
      {status === "loading" && <p className="status-line" role="status">Завантаження…</p>}
      {status === "error" && <div className="alert alert--error" role="alert">{errorText}</div>}

      {status === "ready" && items.length > 0 && (
        <div className="cart">
          <ul className="cart__list">
            {items.map(item => (
              <CartItem key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
            ))}
          </ul>
          <CheckoutForm onSubmit={handleCheckout} />
          <aside className="summary" aria-labelledby="summary-title">
            <h2 className="summary__title" id="summary-title">Разом</h2>
            <dl className="summary__list">
              <div className="summary__row"><dt>Книжок</dt><dd>{count} шт.</dd></div>
              <div className="summary__row summary__row--total"><dt>До сплати</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            {/* Кнопка поза формою, але відправляє її завдяки атрибуту form */}
            <button className="btn btn--primary btn--block" type="submit" form="checkout-form" disabled={submitting}>
              {submitting ? "Оформлюємо…" : "Оформити замовлення"}
            </button>
          </aside>
        </div>
      )}

      {status === "ready" && items.length === 0 && (
        <section className="empty" aria-labelledby="empty-title">
          <h2 className="empty__title" id="empty-title">Кошик порожній</h2>
          <p className="empty__text">Додайте книжки з каталогу, і вони з'являться тут.</p>
          <Link className="btn btn--primary" to="/">До каталогу</Link>
        </section>
      )}
    </>
  );
}
