import { useState } from "react";
import { formatPrice } from "../utils/money.js";
import { NO_COVER } from "../utils/cover.js";

// CartItem — один рядок кошика: обкладинка, назва, ціна, поле кількості, кнопка «✕».
// Поле кількості має свій локальний стан draft: людина може спокійно стерти і ввести число,
// а запит на сервер іде лише коли поле втратило фокус або натиснули Enter (як подія change у лабораторній).
export default function CartItem({ item, onQuantityChange, onRemove }) {
  const [draft, setDraft] = useState(String(item.quantity));
  const inputId = `qty-${item.id}`;

  async function commit() {
    const ok = await onQuantityChange(item, draft);
    if (!ok) setDraft(String(item.quantity));
  }

  return (
    <li className="cart-item">
      <img className="cart-item__cover" src={item.coverImage ?? NO_COVER} alt="" />
      <h2 className="cart-item__title">{item.bookTitle}</h2>
      <p className="cart-item__price">{formatPrice(item.price)}</p>
      <label className="visually-hidden" htmlFor={inputId}>Кількість «{item.bookTitle}»</label>
      <input
        className="field__input cart-item__qty"
        id={inputId}
        type="number"
        min="1"
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={event => event.key === "Enter" && event.currentTarget.blur()}
      />
      <button
        className="cart-item__remove"
        type="button"
        aria-label={`Видалити «${item.bookTitle}» з кошика`}
        onClick={() => onRemove(item)}
      >
        ✕
      </button>
    </li>
  );
}
