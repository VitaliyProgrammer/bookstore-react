// ServerWakeBanner — пояснює людині, чому сайт поки «думає», замість порожньої сторінки чи помилки.
// waking: сервер прокидається після простою; down: так і не відповів — пропонуємо оновити сторінку.
export default function ServerWakeBanner({ status }) {
  if (status === "waking") {
    return (
      <div className="wake-banner" role="status">
        <span className="wake-banner__spinner" aria-hidden="true" />
        <p>
          <strong>Сервер прокидається після простою.</strong>{" "}
          Це займе до хвилини — сторінка оновиться сама.
        </p>
      </div>
    );
  }
  if (status === "down") {
    return (
      <div className="wake-banner wake-banner--error" role="alert">
        <p><strong>Сервер не відповідає.</strong> Спробуйте оновити сторінку за кілька хвилин.</p>
        <button className="btn btn--ghost btn--sm" type="button" onClick={() => window.location.reload()}>
          Оновити
        </button>
      </div>
    );
  }
  return null;
}
