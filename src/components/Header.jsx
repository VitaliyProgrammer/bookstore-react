import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import logoUrl from "../assets/logo.svg";
import logoDarkUrl from "../assets/logo-dark.svg";
import cartUrl from "../assets/cart.svg";
import cartDarkUrl from "../assets/cart-dark.svg";

// <picture> сам обирає світлу чи темну версію за налаштуванням теми в системі.
const DARK = "(prefers-color-scheme: dark)";

const navClass = ({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link");

// Header — шапка: логотип (посилання на головну), меню, візок з лічильником, email і кнопка «Вийти».
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
        <Link className="header__logo" to="/">
          <picture>
            <source media={DARK} srcSet={logoDarkUrl} />
            <img src={logoUrl} alt="Твоя книгарня" width="117" height="72" />
          </picture>
        </Link>
        <nav className="nav" aria-label="Головна навігація">
          <NavLink className={navClass} to="/" end>Каталог</NavLink>
          {isLoggedIn && <NavLink className={navClass} to="/orders">Замовлення</NavLink>}
          {isAdmin && <NavLink className={navClass} to="/admin">Адмінка</NavLink>}
          <NavLink className={navClass} to="/contacts">Контакти</NavLink>
        </nav>
        <div className="header__actions">
          {isLoggedIn ? (
            <>
              {/* Іконка декоративна (alt=""), назву посиланню дає прихований текст «Кошик» */}
              <Link className="header__cart" to="/cart">
                <picture>
                  <source media={DARK} srcSet={cartDarkUrl} />
                  <img className="header__cart-icon" src={cartUrl} alt="" width="24" height="24" />
                </picture>
                <span className="visually-hidden">Кошик</span>
                <span className="header__count" aria-label={`${count} книг у кошику`}>{count}</span>
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
