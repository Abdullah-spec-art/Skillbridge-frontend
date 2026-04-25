import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import UploadDashboard from './components/UploadDashboard';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryPage';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Profile from './components/Profile';
import VerifyOtp from './components/VerifyOtp';


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            
            {/* 1. PUBLIC ROUTES (Anyone can view) */}
            <Route path="/" element={<UploadDashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            
            {/* 2. AUTH ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            
            {/* 3. PROTECTED ROUTES (Must be logged in) */}
            
            <Route path="/me/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryView />
              </ProtectedRoute>
            } />

            <Route path="/results/:id" element={
              <ProtectedRoute>
                <ResultsView />
              </ProtectedRoute>
            } />

          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}