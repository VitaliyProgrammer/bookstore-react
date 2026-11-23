import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { getToken, clearToken, onAuthChange, readPayload } from "../auth/session.js";
import { login as apiLogin } from "../api/auth.js";

const AuthContext = createContext(null);

// AuthProvider — «хто зараз залогінений» для всього застосунку.
// Замінює виклики isLoggedIn()/hasRole() з JS-лабораторної: там кожна сторінка питала localStorage сама,
// а тут токен читається в одному місці, і при його зміні React сам перемальовує все, що від нього залежить.
// useSyncExternalStore — офіційний спосіб підписати React на зовнішнє сховище (у нас localStorage).
export function AuthProvider({ children }) {
  const token = useSyncExternalStore(onAuthChange, getToken);

  const value = useMemo(() => {
    const payload = readPayload(token);
    const isLoggedIn = Boolean(payload) && payload.exp * 1000 > Date.now();
    const roles = isLoggedIn ? payload.roles ?? [] : [];
    return {
      isLoggedIn,
      email: isLoggedIn ? payload.sub : null,
      isAdmin: roles.includes("ADMIN"),
      login: apiLogin,
      logout: clearToken
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth — хук, через який будь-який компонент отримує дані про користувача.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth має використовуватись всередині <AuthProvider>");
  return context;
}
