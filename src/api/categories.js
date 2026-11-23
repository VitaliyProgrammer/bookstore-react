import { request } from "./http.js";

// CategoryController: список категорій, книги категорії, створення категорії.
export const getCategories = () => request("/categories?size=100");

export const getCategoryBooks = (id, { page = 0, size = 12 } = {}, signal) =>
  request(`/categories/${id}/books?page=${page}&size=${size}`, { signal });

export const createCategory = dto => request("/categories", { method: "POST", body: dto });
