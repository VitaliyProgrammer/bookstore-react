import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const navClass = ({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link");

// Header — шапка: логотип, меню, лічильник кошика, email і кнопка «Вийти».
// Замінює js/ui/header.js: замість hidden = true/false ми просто не рендеримо зайві елементи.
// NavLink сам додає aria-current="page" активному пункту меню.
export default function Header() {
  const { isLoggedIn, isAdmin, email, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header__inner container">
        <Link className="header__logo" to="/">Сторінка</Link>
        <nav className="nav" aria-label="Головна навігація">
          <NavLink className={navClass} to="/" end>Каталог</NavLink>
          {isLoggedIn && <NavLink className={navClass} to="/orders">Замовлення</NavLink>}
          {isAdmin && <NavLink className={navClass} to="/admin">Адмінка</NavLink>}
        </nav>
        <div className="header__actions">
          {isLoggedIn ? (
            <>
              <Link className="header__cart" to="/cart">
                Кошик <span className="header__count">{count}</span>
              </Link>
              <span className="header__user">{email}</span>
              <button className="btn btn--ghost btn--sm" type="button" onClick={handleLogout}>Вийти</button>
            </>
          ) : (
            <Link className="btn btn--ghost btn--sm" to="/login">Увійти</Link>
          )}
        </div>
      </div>
    </header>
  );
}
