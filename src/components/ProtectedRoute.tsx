import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Check if the user has a token saved in their browser
  const token = localStorage.getItem('token');

  // If no token, instantly redirect them to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, let them see the page!
  return <>{children}</>;
}