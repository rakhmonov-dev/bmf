import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Admin sahifalarini himoya qiladi. Token yo'q bo'lsa 404'ga yo'naltiradi
 * — ataylab /admin/login yoki maxfiy kirish manziliga emas. Agar bu yerda
 * maxfiy manzilga yo'naltirsak, "/admin/dashboard"ni tasodifan yoki
 * qasddan sinab ko'rgan har kim maxfiy login manzilini bilib olardi,
 * bu esa butun "yashirin URL" g'oyasini bekor qilardi.
 *
 * Bu faqat frontend darajasidagi himoya — haqiqiy xavfsizlik backend'dagi
 * requireAuth middleware orqali ta'minlanadi.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
