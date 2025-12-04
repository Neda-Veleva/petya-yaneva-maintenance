import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, adminUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user || !adminUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
