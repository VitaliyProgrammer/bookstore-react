import { ApiError } from "../api/http.js";

// Перетворює будь-яку помилку на зрозумілий користувачу текст (userMessage з js/ui/forms.js).
// Повертає null для AbortError: запит скасували ми самі, показувати нічого не треба.
export function userMessage(error) {
  if (error.name === "AbortError") return null;
  if (error instanceof TypeError) return "Немає з’єднання з сервером";
  if (error instanceof ApiError) {
    if (error.status === 401) return "Сесія завершилась, увійдіть знову";
    if (error.status === 403) return "Недостатньо прав або потрібно увійти";
    if (error.status === 404) return "Не знайдено";
    return error.messages.join("; ");
  }
  return "Щось пішло не так";
}
