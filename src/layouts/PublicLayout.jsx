import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AiChatWidget from '../components/shared/AiChatWidget';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AiChatWidget />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0F1B3D',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
