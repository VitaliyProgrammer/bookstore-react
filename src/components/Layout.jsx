import { Outlet } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ServerWakeBanner from "./ServerWakeBanner.jsx";
import { useServerWakeup } from "../hooks/useServerWakeup.js";

// Layout — спільний «каркас» кожної сторінки: посилання для клавіатури, шапка, вміст, футер.
// У JS-лабораторній ця розмітка повторювалась у 8 HTML-файлах, тут вона одна.
// <Outlet /> — місце, куди React Router підставляє поточну сторінку.
// Якщо сервер спав (status "woke"), новий key один раз перемонтовує сторінку — і вона заново завантажує дані.
export default function Layout() {
  const wakeStatus = useServerWakeup();

  return (
    <>
      <a className="skip-link" href="#main">Перейти до вмісту</a>
      <Header />
      <ServerWakeBanner status={wakeStatus} />
      <main className="page container" id="main" key={wakeStatus === "woke" ? "after-wake" : "initial"}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
