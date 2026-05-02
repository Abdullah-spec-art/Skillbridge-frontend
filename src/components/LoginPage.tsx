import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../api'; // <-- Changed: Using your new centralized API instance
import SEO from './SEO';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError('');

        // Changed: using api.post and removed the hardcoded URL
        await api.post('/auth/google', {
          google_token: tokenResponse.access_token
        });

        localStorage.setItem('is_logged_in', 'true');
        navigate('/'); // Teleport to dashboard
      } catch (err: any) {
        setError(err.response?.data?.detail || "Google Login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Failed to connect to Google."),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Changed: using api.post and removed the hardcoded URL
      const response = await api.post('/auth/login', {
        email,
        password
      });
      if (response.data.message === "Email not verified. A new OTP has been sent to your email.") {
        navigate('/verify-otp', { state: { email: email } });
        return; // Stop running this function
      }

      localStorage.setItem('is_logged_in', 'true');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login"
        description="Sign in to SkillBridge AI to analyze your resume and find your perfect job match."
      />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            type="button"
            className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm flex justify-center items-center gap-3 mb-6"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-500">Or log in with email</span></div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input id="email" name="email" autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input id="password" name="password" autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-indigo-700 transition-all mt-2">
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up here</Link>
          </div>
        </div>
      </div>
    </>
  );
}