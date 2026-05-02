import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Check if the user is logged in via the localStorage flag
  const isLoggedIn = !!localStorage.getItem('is_logged_in');

  // If no token, instantly redirect them to the login page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // If they have a token, let them see the page!
  return <>{children}</>;
}