import { STATUS_LABELS } from "../api/orders.js";
import { formatPrice } from "../utils/money.js";
import { formatOrderDate } from "../utils/dates.js";

// CheckoutForm зберігає дані доставки одним рядком: «Прізвище Ім'я; м. Місто; Служба, спосіб: адреса; Коментар: …».
// Розбираємо його назад на підписані рядки. Старі замовлення з довільною адресою показуємо як є.
function parseDelivery(text) {
  const parts = text.split("; ");
  if (parts.length < 3 || !parts[1].startsWith("м. ")) return [["Адреса", text]];
  const rows = [
    ["Отримувач", parts[0]],
    ["Місто", parts[1].slice(3)],
    ["Доставка", parts[2]]
  ];
  const comment = parts.slice(3).join("; ");
  if (comment) rows.push(["Коментар", comment.replace(/^Коментар: /, "")]);
  return rows;
}

// OrderCard — одне замовлення: номер, статус, дата, блок доставки, таблиця книг (назва + автор) і сума.
// authors — словник bookId → автор, який завантажує OrdersPage.
export default function OrderCard({ order, authors, isNew }) {
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
      </p>

      <dl className="order__delivery">
        {parseDelivery(order.shippingAddress).map(([label, value]) => (
          <div key={label} className="order__delivery-row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <table className="items">
        <thead>
          <tr>
            <th scope="col">Книга</th>
            <th scope="col" className="items__qty">К-сть</th>
            <th scope="col">Ціна</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map(item => (
            <tr key={item.id}>
              <td>
                {item.bookTitle}
                {authors[item.bookId] && <span className="items__author">, {authors[item.bookId]}</span>}
              </td>
              <td className="items__qty">{item.quantity}</td>
              <td>{formatPrice(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="order__total">Разом: <strong>{formatPrice(order.total)}</strong></p>
    </li>
  );
}
