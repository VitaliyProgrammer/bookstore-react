import { Link } from "react-router";
import { formatPrice } from "../utils/money.js";
import { NO_COVER } from "../utils/cover.js";

// BookCard — картка однієї книги в каталозі.
// Замінює <template id="tpl-book-card"> і createCard(): дані приходять пропсом book,
// а натискання «У кошик» компонент не обробляє сам, а повідомляє батька через onAddToCart.
export default function BookCard({ book, onAddToCart, busy }) {
  return (
    <li className="book-card">
      <Link className="book-card__link" to={`/books/${book.id}`}>
        <img className="book-card__cover" src={book.coverImage ?? NO_COVER} alt={`Обкладинка «${book.title}»`} />
        <h3 className="book-card__title">{book.title}</h3>
      </Link>
      <p className="book-card__author">{book.author}</p>
      <p className="book-card__price">{formatPrice(book.price)}</p>
      <button
        className="btn btn--primary book-card__btn"
        type="button"
        disabled={busy}
        onClick={() => onAddToCart(book)}
      >
        У кошик
      </button>
    </li>
  );
}
