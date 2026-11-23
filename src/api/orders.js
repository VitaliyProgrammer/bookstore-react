import { request } from "./http.js";

// OrderController: замовлення користувача, оформлення, зміна статусу (адмін).
export const getOrders = () => request("/orders");

export const createOrder = shippingAddress =>
  request("/orders", { method: "POST", body: { shippingAddress } });

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}`, { method: "PATCH", body: { status } });

// Підписи для enum Status з бекенду.
export const STATUS_LABELS = {
  PENDING: "Очікує",
  COMPLETED: "Виконано",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано"
};
