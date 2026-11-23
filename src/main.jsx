import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import App from "./App.jsx";
import "./styles.css";

// Точка входу: знаходить <div id="root"> в index.html і монтує туди застосунок.
// Порядок обгорток важливий: CartProvider використовує useAuth, тому він всередині AuthProvider.
// StrictMode у режимі розробки навмисно запускає ефекти двічі, щоб виявити забуте «прибирання».
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
