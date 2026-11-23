# Bookstore — React-фронтенд

React-версія фронтенду для бекенду [Bookstore](https://github.com/VitaliyProgrammer/bookstore) (Spring Boot + JWT).
Логіка повторює JS-лабораторну «Bookstore оживає»; шар `config`, `utils`, `auth/session`, `api` перенесено майже без змін.

## Стек

| Що | Навіщо |
|---|---|
| React 19 | Компоненти та стан замість ручної роботи з DOM |
| React Router 7 | Навігація між сторінками без перезавантаження |
| Vite 6 | Dev-сервер з миттєвим оновленням і proxy до Spring, production-збірка |

## Запуск

```bash
npm install        # один раз: встановити залежності
npm run dev        # dev-сервер: http://localhost:5173
npm run build      # production-збірка в папку dist/
```

Бекенд має працювати на `http://localhost:8080`. Під час розробки Vite пересилає запити `/api/*` на Spring
(див. `vite.config.js`), тому CORS для локальної роботи не потрібен.

## Структура

```
src/
├── main.jsx            точка входу: провайдери + роутер
├── App.jsx             маршрути: URL → сторінка
├── styles.css          стилі з CSS-лабораторної
├── config.js           адреса API, ключ токена
├── utils/              чисті функції: гроші, дати, помилки, заглушка обкладинки
├── auth/session.js     JWT у localStorage
├── api/                усі запити до бекенду (по файлу на контролер)
├── context/            глобальний стан: користувач, toast-повідомлення, лічильник кошика
├── hooks/              власні хуки (debounce пошуку)
├── components/         спільні компоненти: Layout, Header, BookCard, CartItem…
└── pages/              по компоненту на сторінку; admin/ розбита на дрібніші частини
```
