// Єдине місце з налаштуваннями фронтенду (як js/config.js у JS-лабораторній).
// import.meta.env — змінні з файлу .env, Vite підставляє їх під час збірки.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
export const TOKEN_KEY = "bookstore:token";
