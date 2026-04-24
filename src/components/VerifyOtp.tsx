import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract the email passed from the Signup page
  const email = location.state?.email;

  // If a user navigates directly to /verify-otp without an email, kick them to signup
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Adjust this URL to match your FastAPI OTP verification route
      const response = await api.post('/auth/verify-otp', { email, otp });

      // Assuming successful verification returns the JWT token
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        navigate('/'); // Take them straight to the dashboard!
      } else {
        // Fallback if your API requires them to log in separately after verifying
        navigate('/login');
      }

    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(err.response?.data?.detail || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // Adjust this URL to match your FastAPI resend route
      await api.post('/auth/resend-otp', { email });
      alert("A new code has been sent to your email.");
    } catch (err: any) {
      alert("Failed to resend code. Please try again later.");
    }
  };

  // Prevent rendering if useEffect is about to redirect
  if (!email) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">

        {/* Envelope Icon Header */}
        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Check your email</h2>
        <p className="text-sm text-slate-500 mb-8">
          We sent a 6-digit verification code to <span className="font-semibold text-slate-800">{email}</span>.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input 
              type="text" 
              maxLength={6}
              required 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="000000"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || otp.length < 6}
            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="mt-8 text-sm text-slate-500">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend}
            type="button" 
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Click to resend
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link to="/signup" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            &larr; Back to sign up
          </Link>
        </div>

      </div>
    </div>
  );
}