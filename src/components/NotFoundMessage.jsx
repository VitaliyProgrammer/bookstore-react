import { Link } from "react-router";

// NotFoundMessage — блок «404»: використовується на сторінці неіснуючої книги і на загальній сторінці 404.
// Тексти приходять пропсами, тому один компонент обслуговує обидва випадки.
export default function NotFoundMessage({ title, text, linkText }) {
  return (
    <section className="not-found" aria-labelledby="nf-title">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1 className="not-found__title" id="nf-title">{title}</h1>
      <p className="not-found__text">{text}</p>
      <Link className="btn btn--primary" to="/">{linkText}</Link>
    </section>
  );
}
