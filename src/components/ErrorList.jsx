// ErrorList — список помилок форми (валідація на фронті або повідомлення з бекенду).
// Замінює showErrors() з js/ui/forms.js. Порожній масив → нічого не рендеримо.
export default function ErrorList({ messages }) {
  if (messages.length === 0) return null;
  return (
    <ul className="error-list" role="alert">
      {messages.map(message => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}
