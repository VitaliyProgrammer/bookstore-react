import { TOKEN_KEY } from "../config.js";

// Робота з JWT у localStorage (js/auth/session.js з JS-лабораторної).
// Нове порівняно з лабораторною: після кожної зміни токена файл розсилає подію AUTH_EVENT,
// щоб React (AuthContext) дізнався про логін чи логаут і перемалював інтерфейс.
const AUTH_EVENT = "bookstore:auth-change";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

// Підписка на зміни токена: у цій вкладці (AUTH_EVENT) і в інших вкладках (storage).
// Повертає функцію відписки — такий контракт очікує useSyncExternalStore.
export function onAuthChange(listener) {
  window.addEventListener(AUTH_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(AUTH_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

// Розбирає payload JWT: { sub: email, roles: ["USER", "ADMIN"], exp: ... }.
// Підпис тут НЕ перевіряється: це робить лише Spring. Фронтенд читає дані тільки для інтерфейсу.
export function readPayload(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
