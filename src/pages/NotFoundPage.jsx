import NotFoundMessage from "../components/NotFoundMessage.jsx";

// NotFoundPage — будь-яка адреса, якої немає в маршрутах App.jsx (404.html).
export default function NotFoundPage() {
  return (
    <>
      <title>Сторінку не знайдено — Сторінка</title>
      <NotFoundMessage title="Такої сторінки немає" text="Можливо, посилання застаріло." linkText="На головну" />
    </>
  );
}
