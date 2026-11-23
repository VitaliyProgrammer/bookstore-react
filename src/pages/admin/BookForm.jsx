import { useState } from "react";
import ErrorList from "../../components/ErrorList.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { createBook } from "../../api/books.js";
import { userMessage } from "../../utils/errors.js";

const EMPTY_BOOK = { title: "", author: "", isbn: "", price: "", coverImage: "", description: "", categoryIds: [] };

// Перетворює стан форми на CreateBookRequestDto: ISBN без дефісів, ціна числом, порожні поля → null.
function toDto(form) {
  return {
    title: form.title.trim(),
    author: form.author.trim(),
    description: form.description.trim(),
    isbn: form.isbn.replace(/[-\s]/g, ""),
    price: form.price === "" ? null : Number(form.price),
    coverImage: form.coverImage.trim() || null,
    categoryIds: form.categoryIds
  };
}

// BookForm — форма «Нова книга». Валідацію робить бекенд (@Valid), його помилки показуємо через ErrorList.
// Чекбокси категорій керовані: у стані зберігається масив вибраних id.
export default function BookForm({ categories, onCreated }) {
  const showToast = useToast();
  const [form, setForm] = useState(EMPTY_BOOK);
  const [errors, setErrors] = useState([]);

  function handleChange(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function toggleCategory(id) {
    setForm(current => ({
      ...current,
      categoryIds: current.categoryIds.includes(id)
        ? current.categoryIds.filter(x => x !== id)
        : [...current.categoryIds, id]
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const book = await createBook(toDto(form));
      setErrors([]);
      setForm(EMPTY_BOOK);
      showToast(`Книгу «${book.title}» додано`);
      onCreated();
    } catch (error) {
      setErrors(error.messages ?? [userMessage(error)]);
    }
  }

  return (
    <form className="panel" aria-labelledby="book-form-title" noValidate onSubmit={handleSubmit}>
      <h2 className="panel__title" id="book-form-title">Нова книга</h2>
      <ErrorList messages={errors} />
      <div className="form__grid">
        <div className="field">
          <label className="field__label" htmlFor="b-title">Назва</label>
          <input className="field__input" id="b-title" name="title" required value={form.title} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="b-author">Автор</label>
          <input className="field__input" id="b-author" name="author" required value={form.author} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="b-isbn">ISBN (13 цифр)</label>
          <input className="field__input" id="b-isbn" name="isbn" required inputMode="numeric"
            value={form.isbn} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="b-price">Ціна, грн</label>
          <input className="field__input" id="b-price" name="price" type="number" min="0.01" step="0.01" required
            value={form.price} onChange={handleChange} />
        </div>
        <div className="field field--full">
          <label className="field__label" htmlFor="b-cover">Посилання на обкладинку</label>
          <input className="field__input" id="b-cover" name="coverImage" type="url" placeholder="https://…"
            value={form.coverImage} onChange={handleChange} />
        </div>
        <div className="field field--full">
          <label className="field__label" htmlFor="b-desc">Опис</label>
          <textarea className="field__input" id="b-desc" name="description" rows="4" required
            value={form.description} onChange={handleChange} />
        </div>
        <fieldset className="field field--full checks">
          <legend className="field__label">Категорії</legend>
          {categories.map(category => (
            <label key={category.id}>
              <input type="checkbox" checked={form.categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)} />
              {" "}{category.name}
            </label>
          ))}
        </fieldset>
      </div>
      <div className="panel__actions">
        <button className="btn btn--primary" type="submit">Зберегти</button>
      </div>
    </form>
  );
}
