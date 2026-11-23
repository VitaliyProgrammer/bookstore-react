import { useState } from "react";
import ErrorList from "../../components/ErrorList.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { updateOrderStatus, STATUS_LABELS } from "../../api/orders.js";
import { userMessage } from "../../utils/errors.js";

// OrderStatusForm — зміна статусу замовлення за його номером (PATCH /orders/{id}, UpdateOrderStatusRequestDto).
// Варіанти select будуються з STATUS_LABELS, тому новий статус достатньо додати в одному місці.
export default function OrderStatusForm() {
  const showToast = useToast();
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!orderId) {
      setErrors(["Вкажіть номер замовлення"]);
      return;
    }
    try {
      const order = await updateOrderStatus(Number(orderId), status);
      setErrors([]);
      showToast(`Статус замовлення #${order.id}: ${STATUS_LABELS[order.status]}`);
    } catch (error) {
      setErrors(error.status === 404 ? [`Замовлення #${orderId} не знайдено`] : error.messages ?? [userMessage(error)]);
    }
  }

  return (
    <form className="panel" aria-labelledby="order-form-title" noValidate onSubmit={handleSubmit}>
      <h2 className="panel__title" id="order-form-title">Статус замовлення</h2>
      <ErrorList messages={errors} />
      <div className="form__grid">
        <div className="field">
          <label className="field__label" htmlFor="o-id">Номер замовлення</label>
          <input className="field__input" id="o-id" name="orderId" type="number" min="1" required
            value={orderId} onChange={event => setOrderId(event.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="o-status">Статус</label>
          <select className="field__input field__select" id="o-status" name="status" required
            value={status} onChange={event => setStatus(event.target.value)}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{value} — {label.toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="panel__actions">
        <button className="btn btn--primary" type="submit">Оновити</button>
      </div>
    </form>
  );
}
