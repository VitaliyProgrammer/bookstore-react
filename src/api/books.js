import { request } from "./http.js";

// BookController: сторінки книг, пошук (BookSearchParametersDto), одна книга, створення, видалення.
export const getBooks = ({ page = 0, size = 12 } = {}, signal) =>
  request(`/books?page=${page}&size=${size}`, { signal });

export function searchBooks({ title, author, page = 0, size = 12 }, signal) {
  const params = new URLSearchParams({ page, size });
  if (title) params.append("title", title);
  if (author) params.append("author", author);
  return request(`/books/search?${params}`, { signal });
}

export const getBook = id => request(`/books/${id}`);

export const createBook = dto => request("/books", { method: "POST", body: dto });

export const deleteBook = id => request(`/books/${id}`, { method: "DELETE" });
