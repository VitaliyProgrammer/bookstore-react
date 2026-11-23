import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ErrorList from "../components/ErrorList.jsx";
import { register } from "../api/auth.js";
import { userMessage } from "../utils/errors.js";

const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "", repeatPassword: "", shippingAddress: "" };

// Ті самі правила, що в UserRegistrationRequestDto на бекенді: перевіряємо до запиту, щоб не чекати сервер.
function validate(dto) {
  const errors = [];
  if (!dto.firstName) errors.push("Вкажіть ім’я");
  if (!dto.lastName) errors.push("Вкажіть прізвище");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) errors.push("Невірний формат email");
  if (dto.password.length < 6 || dto.password.length > 20) errors.push("Пароль має містити від 6 до 20 символів");
  if (dto.password !== dto.repeatPassword) errors.push("Паролі не збігаються");
  return errors;
}

// RegisterPage — реєстрація (register.html + js/pages/register.js).
// Після успіху веде на /login?registered=1, де LoginPage покаже «Акаунт створено».
export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);

  function handleChange(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const dto = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      repeatPassword: form.repeatPassword,
      shippingAddress: form.shippingAddress.trim() || null
    };
    const validationErrors = validate(dto);
    setErrors(validationErrors);
    if (validationErrors.length) return;
    try {
      await register(dto);
      navigate("/login?registered=1");
    } catch (error) {
      setErrors([userMessage(error)]);
    }
  }

  return (
    <div className="auth">
      <title>Реєстрація — Сторінка</title>
      <section className="auth__card" aria-labelledby="reg-title">
        <h1 className="auth__title" id="reg-title">Реєстрація</h1>
        <ErrorList messages={errors} />
        <form className="form" noValidate onSubmit={handleSubmit}>
          <div className="form__row">
            <div className="field">
              <label className="field__label" htmlFor="reg-first">Ім'я</label>
              <input className="field__input" id="reg-first" name="firstName" required autoComplete="given-name"
                value={form.firstName} onChange={handleChange} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="reg-last">Прізвище</label>
              <input className="field__input" id="reg-last" name="lastName" required autoComplete="family-name"
                value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="reg-email">Email</label>
            <input className="field__input" id="reg-email" name="email" type="email" required autoComplete="email"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="reg-password">Пароль</label>
            <input className="field__input" id="reg-password" name="password" type="password" minLength={6} maxLength={20}
              required aria-describedby="reg-password-hint" autoComplete="new-password"
              value={form.password} onChange={handleChange} />
            <p className="field__hint" id="reg-password-hint">Від 6 до 20 символів</p>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="reg-repeat">Повторіть пароль</label>
            <input className="field__input" id="reg-repeat" name="repeatPassword" type="password" required
              autoComplete="new-password" value={form.repeatPassword} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="reg-address">
              Адреса доставки <span className="field__optional">(необов'язково)</span>
            </label>
            <input className="field__input" id="reg-address" name="shippingAddress" autoComplete="street-address"
              value={form.shippingAddress} onChange={handleChange} />
          </div>
          <button className="btn btn--primary btn--block" type="submit">Створити акаунт</button>
        </form>
        <p>Уже є акаунт? <Link to="/login">Увійти</Link></p>
      </section>
    </div>
  );
}
