import { request } from "./http.js";

// ShoppingCartController: кошик поточного користувача і його позиції.
export const getCart = () => request("/cart");

export const addToCart = (bookId, quantity = 1) =>
  request("/cart", { method: "POST", body: { bookId, quantity } });

export const updateQuantity = (itemId, quantity) =>
  request(`/cart/cart-items/${itemId}`, { method: "PUT", body: { quantity } });

export const removeItem = itemId => request(`/cart/cart-items/${itemId}`, { method: "DELETE" });

// Загальна кількість книжок у кошику (сума quantity, а не кількість позицій).
export const countItems = cart => cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
