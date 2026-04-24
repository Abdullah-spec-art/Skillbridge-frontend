import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

interface UserProfile {
  name: string;
  email: string;
  scans_remaining: number;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
      api.get('/auth/me/profile')
      .then(response => {
        const userData = response.data.user_data;
        setUserProfile({
          name: userData.username, 
          email: userData.email,
          scans_remaining: userData.scans_remaining !== undefined ? userData.scans_remaining : 0 
        });
      })
      .catch(error => {
        console.error("Failed to fetch user profile", error);
        handleLogout(); 
      });
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  }, [location]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsDropdownOpen(false); 
    navigate('/login'); 
  };

  const getInitials = (name: string) => {
    if (!name) return "U"; 
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-sm font-medium py-5 transition-colors border-b-2 ${
      isActive 
        ? 'text-indigo-600 border-indigo-600' 
        : 'text-slate-500 border-transparent hover:text-slate-900'
    }`;
  };

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      <nav className="bg-white border-b border-slate-200 w-full shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* LEFT SIDE: Brand Name & Desktop Links */}
            <div className="flex items-center gap-8 h-full">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">SkillBridge</span>
              </Link>

              <div className="hidden md:flex items-center gap-6 h-full">
                {isLoggedIn ? (
                  <>
                    <Link to="/" className={navLinkClass('/')}>Dashboard</Link>
                    <Link to="/history" className={navLinkClass('/history')}>History</Link>
                  </>
                ) : (
                  <>
                    <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>How it Works</Link>
                    <Link to="/about" className={navLinkClass('/about')}>About</Link>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Dynamic Auth Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {isLoggedIn ? (
                <>
                  <div 
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold border shadow-sm transition-colors ${
                      (userProfile?.scans_remaining ?? 0) > 0 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                    title="Remaining weekly scans"
                  >
                    <span>⚡</span>
                    <span>{userProfile?.scans_remaining ?? 0}</span>
                  </div>

                  <Link 
                    to="/" 
                    className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    New scan
                  </Link>

                  <Link 
                    to="/history" 
                    className="md:hidden text-sm font-bold text-slate-600 hover:text-indigo-600 mr-1"
                  >
                    History
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {userProfile ? getInitials(userProfile.name) : "..."}
                    </button>

                    {/* Standard Tailwind Transition Dropdown */}
                    <div className={`absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 transform origin-top-right transition-all duration-200 ease-out ${
                      isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
                    }`}>
                      <div className="px-4 py-3 border-b border-slate-100 mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{userProfile?.name}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{userProfile?.email}</p>
                      </div>

                      <div className="sm:hidden px-4 py-2 text-xs font-bold text-slate-600 border-b border-slate-100 mb-1 flex items-center gap-2">
                        <span>⚡</span> {userProfile?.scans_remaining ?? 0} Scans Left
                      </div>

                      <Link 
                        to="/me/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 10c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        Account Settings
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-slate-100 pt-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M4.5 2H2a.5.5 0 00-.5.5v7c0 .3.2.5.5.5h2.5M8 4l2.5 2L8 8M5 6h5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop Login/Signup */}
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2">
                      Log in
                    </Link>
                    <Link to="/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm inline-block">
                      Sign up free &rarr;
                    </Link>
                  </div>

                  {/* MOBILE: Styled Login Box + Hamburger Button */}
                  <div className="md:hidden flex items-center gap-3">
                    <Link 
                      to="/login" 
                      className="text-[13px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      Log in
                    </Link>
                    <button 
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                      title={isMobileMenuOpen ? "Close menu" : "Open menu"}
                      className="text-slate-500 hover:text-slate-900 focus:outline-none p-1"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU (Animated using standard CSS Transitions) */}
      {!isLoggedIn && (
        <div className={`md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-1 shadow-lg absolute top-16 w-full left-0 z-40 transform origin-top transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
        }`}>
          <Link to="/how-it-works" className="block text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 py-3 px-2 rounded-lg transition-colors">How it Works</Link>
          <Link to="/about" className="block text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 py-3 px-2 rounded-lg transition-colors">About</Link>
          
          <div className="h-px bg-slate-100 my-2 mx-2"></div>
          
          <Link to="/signup" className="block text-sm font-bold text-center bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 mt-2 shadow-sm transition-colors">Sign up free &rarr;</Link>
        </div>
      )}
    </div>
  );
}