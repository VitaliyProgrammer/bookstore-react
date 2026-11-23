import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { getCart, countItems } from "../api/cart.js";

const CartContext = createContext(null);

// CartProvider — лічильник книжок у кошику, який показує шапка.
// Замінює setCartCount() з js/ui/header.js: каталог, сторінка книги й кошик змінюють число тут,
// а Header просто читає його, не знаючи, хто саме змінив.
export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    getCart()
      .then(cart => setCount(countItems(cart)))
      .catch(() => {});
  }, []);

  // Після входу підтягуємо кошик із сервера, після виходу обнуляємо.
  useEffect(() => {
    if (isLoggedIn) refresh();
    else setCount(0);
  }, [isLoggedIn, refresh]);

  const value = useMemo(() => ({ count, setCount, refresh }), [count, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// useCart — { count, setCount, refresh }.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart має використовуватись всередині <CartProvider>");
  return context;
}
