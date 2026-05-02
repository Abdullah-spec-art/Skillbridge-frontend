import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [scansRemaining, setScansRemaining] = useState(0);
  
  // Stats state
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // A single, clean request. The backend handles the math.
    api.get('/auth/me/profile')
      .then(response => {
        const userData = response.data.user_data;
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setScansRemaining(userData.scans_remaining ?? 0);
        
        // Grab the new SQL-aggregated stats straight from your backend
        setTotalAnalyses(userData.total_analyses ?? 0);
        setAverageScore(userData.average_score ?? 0);

        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load profile data", error);
        setIsLoading(false);
      });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/auth/me/profile', { username });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem('is_logged_in');
    navigate('/login');
  };

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const scansUsed = Math.max(0, 3 - scansRemaining);
  const usagePercentage = (scansUsed / 3) * 100;

  if (isLoading) {
    return <div className="min-h-screen bg-white flex justify-center pt-20"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans pb-20">
      
      {/* Main Wide Container */}
      <div className="max-w-6xl w-full mx-auto bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-slate-200 py-6 shadow-sm z-10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-6 mb-3">Account</div>
          
          <div className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 border-l-2 border-indigo-600 cursor-pointer mb-1">
            <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Profile
          </div>
          
          <div className="h-px bg-slate-100 my-4 mx-6"></div>
          
          <div onClick={handleLogout} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 border-l-2 border-transparent cursor-pointer transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none"><path d="M5 2H2.5a.5.5 0 00-.5.5v9c0 .3.2.5.5.5H5M9 10l3-3-3-3M5.5 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Log out
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-8">
          
          <div>
            <h1 className="text-xl font-bold text-slate-800">Profile Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account and view statistics</p>
          </div>

          {/* Profile Hero & Stats Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Profile Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-lg font-bold text-indigo-600 shrink-0">
                {getInitials(username)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-0.5">{username}</h2>
                <p className="text-sm text-slate-500 mb-2">{email}</p>
                <span className="text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                  Free Plan
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center flex flex-col justify-center shadow-sm">
                <div className="text-2xl font-black text-indigo-600 mb-1">{totalAnalyses}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Scans</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center flex flex-col justify-center shadow-sm">
                <div className="text-2xl font-black text-indigo-600 mb-1">{averageScore}%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Match</div>
              </div>
            </div>
          </div>

          {/* Account Info Form */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Account information</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full name</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-sm text-slate-800 px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email address</label>
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="text-sm text-slate-400 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed shadow-sm"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="text-xs font-bold bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-70 shadow-sm"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>

          {/* Weekly Scan Usage */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Weekly scan usage</h3>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-600">Scans used this week</span>
                <span className="text-sm font-bold text-slate-800">{scansUsed} of 3</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${usagePercentage}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-500">Limits reset automatically every 7 days.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}