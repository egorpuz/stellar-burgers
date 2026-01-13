import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactElement;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true
}: ProtectedRouteProps): ReactElement {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
}
