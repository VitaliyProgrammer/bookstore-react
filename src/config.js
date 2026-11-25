// Єдине місце з налаштуваннями фронтенду (як js/config.js у JS-лабораторній).
// import.meta.env — змінні з файлу .env, Vite підставляє їх під час збірки.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
export const TOKEN_KEY = "bookstore:token";

// Демо-покупець для тих, хто відкрив сайт за посиланням з резюме: увійти можна в один клік.
// Це звичайний акаунт без прав адміністратора, тому показувати пароль публічно безпечно.
export const DEMO_ACCOUNT = { email: "demo@tvoya-knyharnia.ua", password: "Demo12345" };
