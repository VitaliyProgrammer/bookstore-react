import { SHOP } from "../shop.js";

// ContactsPage — адреса магазину (самовивіз), графік, телефон, email і служби доставки.
// Публічна сторінка: доступна без входу.
export default function ContactsPage() {
  return (
    <>
      <title>Контакти — Твоя книгарня</title>
      <h1 className="page__title">Контакти</h1>

      <div className="contacts">
        <section className="contact-card" aria-labelledby="c-shop">
          <h2 className="contact-card__title" id="c-shop">Магазин і самовивіз</h2>
          <p className="contact-card__big">м. {SHOP.city}, {SHOP.address}</p>
          <p className="contact-card__text">Замовлення можна забрати самостійно, коли отримаєте повідомлення, що воно готове.</p>
          <dl className="contact-hours">
            {SHOP.hours.map(([days, time]) => (
              <div key={days} className="contact-hours__row"><dt>{days}</dt><dd>{time}</dd></div>
            ))}
          </dl>
          <a className="btn btn--ghost" href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer">
            Відкрити на мапі
          </a>
        </section>

        <section className="contact-card" aria-labelledby="c-call">
          <h2 className="contact-card__title" id="c-call">Зв'язатися з нами</h2>
          <p className="contact-card__label">Телефон</p>
          <a className="contact-card__big" href={`tel:${SHOP.phone.replace(/\s/g, "")}`}>{SHOP.phone}</a>
          <p className="contact-card__label">Email</p>
          <a className="contact-card__big" href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
        </section>

        <section className="contact-card" aria-labelledby="c-delivery">
          <h2 className="contact-card__title" id="c-delivery">Доставка по всій Україні</h2>
          <ul className="contact-list">
            <li><b>Нова Пошта</b> — у відділення, поштомат або кур'єром</li>
            <li><b>Укрпошта</b> — у відділення або кур'єром</li>
            <li><b>Meest Group</b> — у відділення, поштомат або кур'єром</li>
            <li><b>Самовивіз</b> — з магазину в Києві</li>
          </ul>
        </section>
      </div>

      <p className="contacts__note">Це навчальний проєкт: замовлення на сайті не відправляються, а контакти наведено для прикладу.</p>
    </>
  );
}
