import { API_BASE_URL } from "../config.js";
import { getToken, clearToken } from "../auth/session.js";

// Помилка відповіді сервера: статус + список повідомлень з тіла (як віддає твій CustomGlobalExceptionHandler).
export class ApiError extends Error {
  constructor(status, messages) {
    super(messages.join("; "));
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

// Єдина точка спілкування з бекендом (js/api/http.js з лабораторної, без змін у логіці):
// додає JWT і Content-Type, розбирає JSON, кидає ApiError на будь-який не-2xx статус.
export async function request(path, { method = "GET", body, signal } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(API_BASE_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal
  });
  const isJson = (res.headers.get("Content-Type") ?? "").includes("json");
  const data = res.status === 204 ? null : isJson ? await res.json() : await res.text();
  if (res.status === 401) clearToken();
  if (!res.ok) {
    const messages = data?.errors ?? (data?.error ? [data.error] : [`HTTP ${res.status}`]);
    throw new ApiError(res.status, messages);
  }
  return data;
}
