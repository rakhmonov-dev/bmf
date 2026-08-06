import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Admin sahifalarini himoya qiladi. Token yo'q bo'lsa /admin/login'ga
 * yo'naltiradi. Bu faqat frontend darajasidagi himoya — haqiqiy
 * xavfsizlik backend'dagi requireAuth middleware orqali ta'minlanadi.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
