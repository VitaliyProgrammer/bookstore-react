import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

// ToastProvider — спливаючі повідомлення («Книгу додано в кошик», помилки).
// Замінює js/ui/toast.js: там ми руками створювали <div> і видаляли його по таймеру,
// а тут тримаємо масив повідомлень у стані, і React сам додає та прибирає елементи.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback((text, type = "info", ms = 3000) => {
    const id = ++nextId.current;
    setToasts(current => [...current, { id, text, type }]);
    setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), ms);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={toast.type === "error" ? "toast toast--error" : "toast"}>
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// useToast — повертає функцію showToast(text, type?, ms?).
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast має використовуватись всередині <ToastProvider>");
  return context;
}
