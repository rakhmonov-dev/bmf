import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </div>
  );
}
