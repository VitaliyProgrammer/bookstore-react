import { Outlet } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

// Layout — спільний «каркас» кожної сторінки: посилання для клавіатури, шапка, вміст, футер.
// У JS-лабораторній ця розмітка повторювалась у 8 HTML-файлах, тут вона одна.
// <Outlet /> — місце, куди React Router підставляє поточну сторінку.
export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Перейти до вмісту</a>
      <Header />
      <main className="page container" id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
