import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import NotFoundMessage from "../components/NotFoundMessage.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getBook } from "../api/books.js";
import { getCategories } from "../api/categories.js";
import { addToCart, countItems } from "../api/cart.js";
import { formatPrice } from "../utils/money.js";
import { NO_COVER } from "../utils/cover.js";
import { userMessage } from "../utils/errors.js";

// BookPage — сторінка однієї книги (book.html + js/pages/book.js).
// id береться з URL /books/:id через useParams (у лабораторній — з ?id= у рядку запиту).
// status: "loading" → "ready" | "not-found" | "error". Одна змінна замість кількох hidden-прапорців.
export default function BookPage() {
  const { id } = useParams();
  const bookId = Number(id);
  const showToast = useToast();
  const { setCount } = useCart();

  const [status, setStatus] = useState("loading");
  const [errorText, setErrorText] = useState("");
  const [book, setBook] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    if (!Number.isInteger(bookId) || bookId < 1) {
      setStatus("not-found");
      return;
    }
    // ignore: якщо людина перейшла на іншу книгу до відповіді, стару відповідь не показуємо.
    let ignore = false;
    setStatus("loading");
    Promise.all([getBook(bookId), getCategories()])
      .then(([loadedBook, categories]) => {
        if (ignore) return;
        setBook(loadedBook);
        setCategoryNames(categories.content.filter(c => loadedBook.categoryIds.includes(c.id)).map(c => c.name));
        setStatus("ready");
      })
      .catch(error => {
        if (ignore) return;
        if (error.status === 404) {
          setStatus("not-found");
        } else {
          setErrorText(userMessage(error));
          setStatus("error");
        }
      });
    return () => {
      ignore = true;
    };
  }, [bookId]);

  async function handleBuy(event) {
    event.preventDefault();
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount < 1) {
      showToast("Кількість має бути цілим числом від 1", "error");
      return;
    }
    try {
      const cart = await addToCart(bookId, amount);
      setCount(countItems(cart));
      showToast(`Додано в кошик: ${amount} шт`);
    } catch (error) {
      showToast(userMessage(error), "error");
    }
  }

  if (status === "not-found") {
    return (
      <NotFoundMessage
        title="Такої книги немає"
        text="Можливо, посилання застаріло або книжку вже прибрали з каталогу."
        linkText="До каталогу"
      />
    );
  }

  return (
    <>
      <title>{book ? `${book.title} — Сторінка` : "Книга — Сторінка"}</title>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumbs__list">
          <li><Link to="/">Каталог</Link></li>
          <li aria-current="page">{book?.title ?? "Книга"}</li>
        </ol>
      </nav>

      {status === "loading" && <p className="status-line" role="status">Завантаження…</p>}
      {status === "error" && <p className="status-line" role="status">{errorText}</p>}

      {status === "ready" && (
        <article className="book">
          <img className="book__cover" src={book.coverImage ?? NO_COVER} alt={`Обкладинка «${book.title}»`} />
          <div className="book__info">
            <h1 className="book__title">{book.title}</h1>
            <p className="book__author">{book.author}</p>
            <ul className="book__categories" aria-label="Категорії">
              {categoryNames.map(name => <li key={name} className="chip">{name}</li>)}
            </ul>
            <p className="book__price">{formatPrice(book.price)}</p>
            <form className="buy" onSubmit={handleBuy}>
              <label className="field__label" htmlFor="qty">Кількість</label>
              <div className="buy__row">
                <input className="field__input buy__qty" id="qty" name="quantity" type="number" min="1" required
                  value={quantity} onChange={event => setQuantity(event.target.value)} />
                <button className="btn btn--primary" type="submit">Додати в кошик</button>
              </div>
            </form>
            <dl className="specs">
              <div className="specs__row"><dt>Автор</dt><dd>{book.author}</dd></div>
              <div className="specs__row"><dt>ISBN</dt><dd>{book.isbn}</dd></div>
            </dl>
            <section className="book__description">
              <h2 className="book__subtitle">Опис</h2>
              <p>{book.description}</p>
            </section>
          </div>
        </article>
      )}
    </>
  );
}
