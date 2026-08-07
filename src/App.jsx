import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public sahifalar
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TestPage from './pages/TestPage';

// Admin sahifalar
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import CoursesAdminPage from './pages/admin/CoursesAdminPage';
import TeachersAdminPage from './pages/admin/TeachersAdminPage';
import QuestionsAdminPage from './pages/admin/QuestionsAdminPage';
import TestimonialsAdminPage from './pages/admin/TestimonialsAdminPage';
import FaqsAdminPage from './pages/admin/FaqsAdminPage';
import MessagesAdminPage from './pages/admin/MessagesAdminPage';
import AiSupportAdminPage from './pages/admin/AiSupportAdminPage';
import SettingsAdminPage from './pages/admin/SettingsAdminPage';
import GalleryAdminPage from './pages/admin/GalleryAdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { ADMIN_LOGIN_PATH } from './config/adminPath';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------------- PUBLIC SAYT ---------------------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/kurslar" element={<CoursesPage />} />
          <Route path="/kurslar/:slug" element={<CourseDetailPage />} />
          <Route path="/biz-haqimizda" element={<AboutPage />} />
          <Route path="/aloqa" element={<ContactPage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>

        {/* ---------------------- ADMIN LOGIN (layout'siz, maxfiy yo'l) ---------------------- */}
        <Route path={ADMIN_LOGIN_PATH} element={<AdminLoginPage />} />

        {/* ---------------------- ADMIN PANEL (himoyalangan) ---------------------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="courses" element={<CoursesAdminPage />} />
            <Route path="teachers" element={<TeachersAdminPage />} />
            <Route path="questions" element={<QuestionsAdminPage />} />
            <Route path="testimonials" element={<TestimonialsAdminPage />} />
            <Route path="faqs" element={<FaqsAdminPage />} />
            <Route path="messages" element={<MessagesAdminPage />} />
            <Route path="ai-support" element={<AiSupportAdminPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="settings" element={<SettingsAdminPage />} />
          </Route>
        </Route>

        {/* ---------------------- 404 ---------------------- */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
