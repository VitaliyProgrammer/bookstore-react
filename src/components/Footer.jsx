import { Link } from "react-router";

// Footer — нижня частина сторінки. Статичний, без стану.
// <Link> замість <a>: перехід без перезавантаження сторінки (React Router).
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <p>© 2026 Сторінка. Українські книжки з доставкою.</p>
        <nav className="footer__nav" aria-label="Інформація">
          <Link to="/">Каталог</Link>
          <Link to="/cart">Кошик</Link>
          <Link to="/orders">Замовлення</Link>
        </nav>
      </div>
    </footer>
  );
}
