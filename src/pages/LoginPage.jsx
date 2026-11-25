import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { userMessage } from "../utils/errors.js";
import { DEMO_ACCOUNT } from "../config.js";

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

  function handleSubmit(event) {
    event.preventDefault();
    const email = form.email.trim();
    if (!email || !form.password) {
      setError("Введіть email і пароль");
      return;
    }
    signIn(email, form.password);
  }

  // Демо-вхід: підставляємо дані в поля (людина бачить, що відбувається) і одразу входимо
  function handleDemoLogin() {
    setForm(DEMO_ACCOUNT);
    signIn(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
  }

  async function signIn(email, password) {
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
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
        <aside className="demo-access" aria-labelledby="demo-title">
          <h2 className="demo-access__title" id="demo-title">Хочете просто подивитися?</h2>
          <p className="demo-access__text">
            Демо-акаунт покупця: <span className="demo-access__creds">{DEMO_ACCOUNT.email}</span>{" "}
            / <span className="demo-access__creds">{DEMO_ACCOUNT.password}</span>
          </p>
          <button className="btn btn--ghost btn--block" type="button" onClick={handleDemoLogin} disabled={submitting}>
            Увійти як демо-покупець
          </button>
        </aside>
        <p>Немає акаунта? <Link to="/register">Зареєструватися</Link></p>
      </section>
    </div>
  );
}
