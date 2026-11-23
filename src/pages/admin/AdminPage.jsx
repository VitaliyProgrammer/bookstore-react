import { useCallback, useEffect, useState } from "react";
import BooksTable from "./BooksTable.jsx";
import BookForm from "./BookForm.jsx";
import CategoryForm from "./CategoryForm.jsx";
import OrderStatusForm from "./OrderStatusForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getBooks, deleteBook } from "../../api/books.js";
import { getCategories } from "../../api/categories.js";
import { userMessage } from "../../utils/errors.js";

// AdminPage — адмінка (admin.html + js/pages/admin.js). Лише для ролі ADMIN.
// Тут живе спільний стан: список книг (таблиця + форма книги) і список категорій (чекбокси + форма категорії).
// Дочірні компоненти отримують дані пропсами й повідомляють про зміни колбеками onCreated / onDelete.
// Це «підняття стану» (lifting state up), один з головних патернів React.
export default function AdminPage() {
  const { isAdmin } = useAuth();
  const showToast = useToast();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadBooks = useCallback(() => {
    getBooks({ page: 0, size: 100 })
      .then(page => setBooks(page.content))
      .catch(error => showToast(userMessage(error), "error"));
  }, [showToast]);

  const loadCategories = useCallback(() => {
    getCategories()
      .then(page => setCategories(page.content))
      .catch(error => showToast(userMessage(error), "error"));
  }, [showToast]);

  useEffect(() => {
    if (!isAdmin) return;
    loadBooks();
    loadCategories();
  }, [isAdmin, loadBooks, loadCategories]);

  async function handleDelete(book) {
    try {
      await deleteBook(book.id);
      setBooks(current => current.filter(b => b.id !== book.id));
      showToast(`Книгу «${book.title}» видалено`);
    } catch (error) {
      showToast(userMessage(error), "error");
    }
  }

  if (!isAdmin) {
    return (
      <div className="alert alert--error" role="alert">
        Недостатньо прав. Ця сторінка лише для адміністраторів.
      </div>
    );
  }

  return (
    <div className="admin">
      <title>Адмінка — Сторінка</title>
      <div className="admin__content">
        <div className="toolbar">
          <h1 className="page__title">Книги</h1>
        </div>
        <BooksTable books={books} onDelete={handleDelete} />
        <BookForm categories={categories} onCreated={loadBooks} />
        <CategoryForm onCreated={loadCategories} />
        <OrderStatusForm />
      </div>
    </div>
  );
}
