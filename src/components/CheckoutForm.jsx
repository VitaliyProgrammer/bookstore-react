import { useState } from "react";
import ErrorList from "./ErrorList.jsx";

// Служби доставки і способи, які кожна з них підтримує (в Укрпошти немає поштоматів).
const CARRIERS = [
  { id: "nova", label: "Нова Пошта", methods: ["branch", "locker", "courier"] },
  { id: "ukr", label: "Укрпошта", methods: ["branch", "courier"] },
  { id: "meest", label: "Meest Group", methods: ["branch", "locker", "courier"] }
];

const METHODS = {
  branch: {
    label: "У відділення",
    hint: "Заберете у зручному відділенні",
    addressLabel: "Номер або адреса відділення",
    placeholder: "Відділення №12, вул. Сагайдачного, 5"
  },
  locker: {
    label: "У поштомат",
    hint: "Цілодобово і без черг",
    addressLabel: "Номер поштомату",
    placeholder: "Поштомат №3456"
  },
  courier: {
    label: "Кур'єром",
    hint: "Привеземо до дверей",
    addressLabel: "Адреса доставки",
    placeholder: "вул. Хрещатик, 1, кв. 10"
  }
};

// Іконки для карток способу доставки (декоративні, тому aria-hidden).
const ICONS = {
  branch: "M3 10 12 4l9 6v10H3zM9 20v-6h6v6",
  locker: "M4 4h16v16H4zM4 10h16M12 4v16M8 7h1M15 7h1M8 14h1M15 14h1",
  courier: "M3 6h11v10H3zM14 9h4l3 3v4h-7M6.5 19a1.5 1.5 0 1 0 0-.01M17.5 19a1.5 1.5 0 1 0 0-.01"
};

// shipping_address у БД — VARCHAR(255), тому весь текст замовлення має вміститися в цей ліміт.
const MAX_LENGTH = 255;

const EMPTY = { firstName: "", lastName: "", city: "", carrier: "nova", method: "branch", address: "", comment: "" };

// Збирає дані форми в один рядок для поля shippingAddress (OrderRequestDto на бекенді).
function composeShippingAddress(form) {
  const carrier = CARRIERS.find(c => c.id === form.carrier).label;
  const method = METHODS[form.method].label.toLowerCase();
  const parts = [
    `${form.lastName.trim()} ${form.firstName.trim()}`,
    `м. ${form.city.trim()}`,
    `${carrier}, ${method}: ${form.address.trim()}`
  ];
  if (form.comment.trim()) parts.push(`Коментар: ${form.comment.trim()}`);
  return parts.join("; ");
}

function validate(form) {
  const errors = [];
  if (!form.firstName.trim()) errors.push("Вкажіть ім'я");
  if (!form.lastName.trim()) errors.push("Вкажіть прізвище");
  if (!form.city.trim()) errors.push("Вкажіть місто");
  if (!form.address.trim()) errors.push(`Вкажіть: ${METHODS[form.method].addressLabel.toLowerCase()}`);
  if (composeShippingAddress(form).length > MAX_LENGTH) errors.push("Задовгі дані доставки: скоротіть адресу або коментар");
  return errors;
}

// CheckoutForm — дані отримувача: ім'я, прізвище, місто, служба доставки (список),
// спосіб доставки (картки-радіокнопки), адреса і коментар.
// Кнопка відправки живе в підсумку кошика і прив'язана до форми атрибутом form="checkout-form".
export default function CheckoutForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);

  const carrier = CARRIERS.find(c => c.id === form.carrier);
  const method = METHODS[form.method];
  const left = MAX_LENGTH - composeShippingAddress(form).length;

  function handleChange(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  // Якщо нова служба не підтримує вибраний спосіб (поштомат в Укрпошти) — повертаємо «у відділення».
  function handleCarrierChange(event) {
    const next = CARRIERS.find(c => c.id === event.target.value);
    setForm(current => ({
      ...current,
      carrier: next.id,
      method: next.methods.includes(current.method) ? current.method : "branch"
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (validationErrors.length === 0) onSubmit(composeShippingAddress(form));
  }

  return (
    <form className="checkout" id="checkout-form" noValidate onSubmit={handleSubmit} aria-labelledby="checkout-title">
      <h2 className="checkout__title" id="checkout-title">Оформлення замовлення</h2>
      <ErrorList messages={errors} />

      <fieldset className="checkout__group">
        <legend className="checkout__legend">Отримувач</legend>
        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor="co-first">Ім'я</label>
            <input className="field__input" id="co-first" name="firstName" autoComplete="given-name" maxLength={50}
              value={form.firstName} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="co-last">Прізвище</label>
            <input className="field__input" id="co-last" name="lastName" autoComplete="family-name" maxLength={50}
              value={form.lastName} onChange={handleChange} />
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="co-city">Місто</label>
          <input className="field__input" id="co-city" name="city" autoComplete="address-level2" maxLength={50}
            placeholder="Київ" value={form.city} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset className="checkout__group">
        <legend className="checkout__legend">Доставка</legend>
        <div className="field">
          <label className="field__label" htmlFor="co-carrier">Служба доставки</label>
          <select className="field__input field__select" id="co-carrier" name="carrier"
            value={form.carrier} onChange={handleCarrierChange}>
            {CARRIERS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        <div className="radio-cards" role="radiogroup" aria-label="Спосіб доставки">
          {carrier.methods.map(id => (
            <label key={id} className="radio-card">
              <input className="radio-card__input" type="radio" name="method" value={id}
                checked={form.method === id} onChange={handleChange} />
              <svg className="radio-card__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d={ICONS[id]} />
              </svg>
              <span className="radio-card__text">
                <b>{METHODS[id].label}</b>
                <small>{METHODS[id].hint}</small>
              </span>
              <span className="radio-card__dot" aria-hidden="true" />
            </label>
          ))}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="co-address">{method.addressLabel}</label>
          <input className="field__input" id="co-address" name="address" maxLength={120}
            autoComplete={form.method === "courier" ? "street-address" : "off"}
            placeholder={method.placeholder} value={form.address} onChange={handleChange} />
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="co-comment">
          Коментар до замовлення <span className="field__optional">(необов'язково)</span>
        </label>
        <textarea className="field__input" id="co-comment" name="comment" rows="3" maxLength={150}
          placeholder="Наприклад: зателефонуйте перед доставкою" value={form.comment} onChange={handleChange} />
        <p className={left < 0 ? "field__error" : "field__hint"}>
          {left < 0 ? `Перевищено ліміт на ${-left} симв.` : `Залишилось символів: ${left}`}
        </p>
      </div>
    </form>
  );
}
