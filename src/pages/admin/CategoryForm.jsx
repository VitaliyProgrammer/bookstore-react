import { useState } from "react";
import ErrorList from "../../components/ErrorList.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { createCategory } from "../../api/categories.js";
import { userMessage } from "../../utils/errors.js";

const EMPTY_CATEGORY = { name: "", description: "" };

// CategoryForm — форма «Нова категорія» (CategoryRequestDto).
// Після створення викликає onCreated, і AdminPage перезавантажує категорії: нові чекбокси одразу з'являються в BookForm.
export default function CategoryForm({ onCreated }) {
  const showToast = useToast();
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [errors, setErrors] = useState([]);

  function handleChange(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const category = await createCategory({ name: form.name.trim(), description: form.description.trim() || null });
      setErrors([]);
      setForm(EMPTY_CATEGORY);
      showToast(`Категорію «${category.name}» створено`);
      onCreated();
    } catch (error) {
      setErrors(error.messages ?? [userMessage(error)]);
    }
  }

  return (
    <form className="panel" aria-labelledby="cat-form-title" noValidate onSubmit={handleSubmit}>
      <h2 className="panel__title" id="cat-form-title">Нова категорія</h2>
      <ErrorList messages={errors} />
      <div className="form__grid">
        <div className="field">
          <label className="field__label" htmlFor="c-name">Назва</label>
          <input className="field__input" id="c-name" name="name" required value={form.name} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="c-desc">Опис</label>
          <input className="field__input" id="c-desc" name="description" maxLength={255}
            value={form.description} onChange={handleChange} />
        </div>
      </div>
      <div className="panel__actions">
        <button className="btn btn--primary" type="submit">Створити</button>
      </div>
    </form>
  );
}
