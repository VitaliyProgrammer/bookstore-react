import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

// ProtectedRoute — «охоронець» сторінок, куди можна лише після входу (js/auth/guard.js).
// Не залогінений → перенаправляє на /login?returnTo=..., щоб після входу повернути людину назад.
// Залогінений → рендерить вкладену сторінку через <Outlet />.
export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
