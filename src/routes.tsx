import { Routes, Route } from 'react-router-dom';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanelComplete as AdminPanel } from './components/admin/AdminPanelComplete';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import UserLogin from './pages/UserLogin';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}