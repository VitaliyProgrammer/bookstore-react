import { STATUS_LABELS } from "../api/orders.js";
import { formatPrice } from "../utils/money.js";
import { formatOrderDate } from "../utils/dates.js";

// OrderCard — одне замовлення: номер, статус, дата, адреса, таблиця книг і сума.
// Замінює <template id="tpl-order"> і createOrderCard(). isNew підсвічує щойно оформлене замовлення.
export default function OrderCard({ order, isNew }) {
  return (
    <li className={isNew ? "order order--new" : "order"}>
      <div className="order__head">
        <h3 className="order__id">Замовлення #{order.id}</h3>
        <span className="status" data-status={order.status}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>
      <p className="order__meta">
        <time dateTime={order.orderDate.replace(" ", "T")}>{formatOrderDate(order.orderDate)}</time>
        {" · "}
        <span className="order__address">{order.shippingAddress}</span>
      </p>
      <table className="items">
        <thead>
          <tr><th scope="col">Книга</th><th scope="col">К-сть</th><th scope="col">Ціна</th></tr>
        </thead>
        <tbody>
          {order.orderItems.map(item => (
            <tr key={item.id}>
              <td>{item.bookTitle}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="order__total">Разом: <strong>{formatPrice(order.total)}</strong></p>
    </li>
  );
}
