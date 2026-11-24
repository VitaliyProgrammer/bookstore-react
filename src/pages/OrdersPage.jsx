import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import OrderCard from "../components/OrderCard.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getOrders } from "../api/orders.js";
import { getBook } from "../api/books.js";
import { userMessage } from "../utils/errors.js";

// OrderItemResponseDto не містить автора, тому довантажуємо кожну книгу один раз (без дублів).
// Якщо книгу вже видалили з каталогу — просто показуємо назву без автора.
async function loadAuthors(orders) {
  const ids = [...new Set(orders.flatMap(order => order.orderItems.map(item => item.bookId)))];
  const books = await Promise.all(ids.map(id => getBook(id).catch(() => null)));
  return Object.fromEntries(ids.map((id, i) => [id, books[i]?.author ?? null]));
}

// OrdersPage — історія замовлень (orders.html + js/pages/orders.js).
// ?created=ID приходить з кошика після оформлення: таке замовлення підсвічуємо й показуємо toast.
export default function OrdersPage() {
  const showToast = useToast();
  const [params] = useSearchParams();
  const createdId = Number(params.get("created")) || null;

  const [orders, setOrders] = useState([]);
  const [authors, setAuthors] = useState({});
  const [status, setStatus] = useState("loading");
  const [errorText, setErrorText] = useState("");
  // У режимі розробки StrictMode запускає ефекти двічі; ref гарантує, що toast покажеться один раз.
  const toastShown = useRef(false);

  useEffect(() => {
    let ignore = false;
    getOrders()
      .then(async data => {
        const authorsById = await loadAuthors(data);
        if (ignore) return;
        setOrders(data.toSorted((a, b) => b.id - a.id));
        setAuthors(authorsById);
        setStatus("ready");
      })
      .catch(error => {
        if (ignore) return;
        setErrorText(userMessage(error));
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "ready" || !createdId || toastShown.current) return;
    if (orders.some(order => order.id === createdId)) {
      toastShown.current = true;
      showToast(`Замовлення #${createdId} оформлено`);
    }
  }, [status, orders, createdId, showToast]);

  return (
    <>
      <title>Мої замовлення — Твоя книгарня</title>
      <h1 className="page__title">Мої замовлення</h1>
      {status === "loading" && <p className="status-line" role="status">Завантаження…</p>}
      {status === "error" && <div className="alert alert--error" role="alert">{errorText}</div>}

      {status === "ready" && orders.length > 0 && (
        <ul className="orders">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} authors={authors} isNew={order.id === createdId} />
          ))}
        </ul>
      )}

      {status === "ready" && orders.length === 0 && (
        <section className="empty" aria-labelledby="empty-title">
          <h2 className="empty__title" id="empty-title">Замовлень ще немає</h2>
          <p className="empty__text">Оформіть перше замовлення в кошику.</p>
          <Link className="btn btn--primary" to="/">До каталогу</Link>
        </section>
      )}
    </>
  );
}
