import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { userMessage } from "../utils/errors.js";

// Приймаємо лише внутрішні шляхи ("/cart"), щоб ?returnTo=https://evil.com не перекинув людину на чужий сайт.
function safeReturnTo(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

// LoginPage — вхід (login.html + js/pages/login.js).
// Керована форма: значення полів живуть у стані form, а не в DOM.
// ?registered=1 → зелене повідомлення після реєстрації; ?returnTo=... → куди повернути після входу.
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    const email = form.email.trim();
    if (!email || !form.password) {
      setError("Введіть email і пароль");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, form.password);
      navigate(safeReturnTo(params.get("returnTo")), { replace: true });
    } catch (err) {
      // Бекенд на будь-які невірні дані відповідає 401 з однаковим текстом (не видає, чи існує email).
      setError(err.status === 401 ? "Невірний email або пароль" : userMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <title>Вхід — Твоя книгарня</title>
      <section className="auth__card" aria-labelledby="login-title">
        <h1 className="auth__title" id="login-title">Вхід</h1>
        {params.has("registered") && (
          <div className="alert alert--success" role="status">Акаунт створено. Тепер увійдіть.</div>
        )}
        {error && <div className="alert alert--error" role="alert">{error}</div>}
        <form className="form" noValidate onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="login-email">Email</label>
            <input className="field__input" id="login-email" name="email" type="email" required autoComplete="email"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="login-password">Пароль</label>
            <input className="field__input" id="login-password" name="password" type="password" required
              autoComplete="current-password" value={form.password} onChange={handleChange} />
          </div>
          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>Увійти</button>
        </form>
        <p>Немає акаунта? <Link to="/register">Зареєструватися</Link></p>
      </section>
    </div>
  );
}
