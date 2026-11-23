import { useEffect, useState } from "react";
import BookCard from "../components/BookCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { getBooks, searchBooks } from "../api/books.js";
import { getCategories, getCategoryBooks } from "../api/categories.js";
import { addToCart, countItems } from "../api/cart.js";
import { userMessage } from "../utils/errors.js";

const PAGE_SIZE = 12;

// Який ендпоінт викликати: категорія → /categories/{id}/books, є текст → /books/search, інакше → /books.
function fetchBooks({ page, title, author, categoryId }, signal) {
  if (categoryId !== null) return getCategoryBooks(categoryId, { page, size: PAGE_SIZE }, signal);
  if (title || author) return searchBooks({ title, author, page, size: PAGE_SIZE }, signal);
  return getBooks({ page, size: PAGE_SIZE }, signal);
}

// CatalogPage — головна сторінка (index.html + js/pages/catalog.js).
// Стан: фільтри пошуку, вибрана категорія, номер сторінки, завантажені книги.
// Будь-яка зміна стану → useEffect робить новий запит; старий запит скасовується через AbortController.
export default function CatalogPage() {
  const showToast = useToast();
  const { setCount } = useCart();

  const [filters, setFilters] = useState({ title: "", author: "" });
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addingId, setAddingId] = useState(null);

  const { title, author } = useDebouncedValue(filters, 300);

  // Категорії завантажуються один раз; якщо не вдалося — просто ховаємо чипси.
  useEffect(() => {
    getCategories()
      .then(data => setCategories(data.content))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchBooks({ page, title: title.trim(), author: author.trim(), categoryId }, controller.signal)
      .then(setResult)
      .catch(err => {
        if (err.name !== "AbortError") setError(userMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    // Прибирання: якщо стан змінився до відповіді, попередній запит скасовується.
    return () => controller.abort();
  }, [page, title, author, categoryId]);

  function handleFilterChange(event) {
    setFilters(current => ({ ...current, [event.target.name]: event.target.value }));
    setCategoryId(null);
    setPage(0);
  }

  function handleCategoryClick(id) {
    setCategoryId(id);
    setPage(0);
  }

  async function handleAddToCart(book) {
    setAddingId(book.id);
    try {
      const cart = await addToCart(book.id);
      setCount(countItems(cart));
      showToast(`«${book.title}» у кошику`);
    } catch (err) {
      showToast(userMessage(err), "error");
    } finally {
      setAddingId(null);
    }
  }

  const books = result?.content ?? [];
  const chips = [{ id: null, name: "Усі" }, ...categories];

  return (
    <>
      <title>Каталог — Твоя книгарня</title>
      <section className="hero">
        <h1 className="hero__title">Українські книжки з доставкою по всій країні</h1>
        <p className="hero__text">Класика, сучасна проза і поезія. Нові надходження щопонеділка.</p>
      </section>

      {/* Пошук працює «на льоту» через debounce, тому submit лише не дає сторінці перезавантажитись */}
      <form className="search" role="search" onSubmit={event => event.preventDefault()}>
        <div className="field">
          <label className="field__label" htmlFor="q-title">Назва</label>
          <input className="field__input" id="q-title" name="title" placeholder="Наприклад, Тигролови"
            autoComplete="off" value={filters.title} onChange={handleFilterChange} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="q-author">Автор</label>
          <input className="field__input" id="q-author" name="author" placeholder="Іван Багряний"
            autoComplete="off" value={filters.author} onChange={handleFilterChange} />
        </div>
        <button className="btn btn--primary" type="submit">Знайти</button>
      </form>

      {categories.length > 0 && (
        <ul className="chips" aria-label="Категорії">
          {chips.map(category => {
            const active = category.id === categoryId;
            return (
              <li key={category.id ?? "all"}>
                <button type="button" className={active ? "chip chip--active" : "chip"} aria-pressed={active}
                  onClick={() => handleCategoryClick(category.id)}>
                  {category.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!error && (
        <p className="status-line" role="status">
          {loading ? "Завантаження…" : `Знайдено книг: ${result?.totalElements ?? 0}`}
        </p>
      )}
      {error && <div className="alert alert--error" role="alert">{error}</div>}

      <ul className="catalog" aria-busy={loading}>
        {books.map(book => (
          <BookCard key={book.id} book={book} busy={addingId === book.id} onAddToCart={handleAddToCart} />
        ))}
      </ul>

      {!loading && !error && books.length === 0 && (
        <section className="empty" aria-labelledby="empty-title">
          <h2 className="empty__title" id="empty-title">Нічого не знайдено</h2>
          <p className="empty__text">Спробуйте змінити запит або обрати іншу категорію.</p>
        </section>
      )}

      <Pagination page={page} totalPages={result?.totalPages ?? 0} onChange={setPage} />
    </>
  );
}
