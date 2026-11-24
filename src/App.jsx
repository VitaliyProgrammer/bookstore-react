import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import BookPage from "./pages/BookPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";

// App — карта сайту: яка адреса → яка сторінка. Замінює 8 окремих HTML-файлів.
// Layout обгортає всі сторінки (шапка + футер), ProtectedRoute пускає лише залогінених.
//   /            → каталог            (index.html)
//   /books/:id   → сторінка книги     (book.html?id=...)
//   /login       → вхід               (login.html)
//   /register    → реєстрація         (register.html)
//   /cart        → кошик              (cart.html)
//   /orders      → замовлення         (orders.html)
//   /admin       → адмінка            (admin.html)
//   /contacts    → контакти           (публічна, без входу)
//   *            → 404                (404.html)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<CatalogPage />} />
          <Route path="books/:id" element={<BookPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
