import { Navigate, Outlet } from 'react-router-dom';
import { useAdminSession } from '../../hooks/useAdminSession';

export default function ProtectedRoute() {
  const { session, loading } = useAdminSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#110D1A]">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
