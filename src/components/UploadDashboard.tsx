import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AnalyzerLoading from './AnalyzerLoading';
import SEO from './SEO';
import { validateJobDescription } from '../utils/validation';

interface MissingSkill { skill: string; reason: string; }
interface AIFeedback { match_percentage: number; executive_summary: string; missing_skills: MissingSkill[]; }

interface AnalysisResponse { 
  message: string; 
  user: string; 
  id: string; 
  ai_feedback: AIFeedback;
  scans_remaining: number; 
}

export default function UploadDashboard() {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Scans (Defaults to null until the API loads)
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Check if the user is currently logged in via the localStorage flag
  const isAuthenticated = !!localStorage.getItem('is_logged_in');

  // Fetch the user's real scan count when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me/profile'); 
        const userData = response.data.user_data;
        if (userData && userData.scans_remaining !== undefined) {
          setScansRemaining(userData.scans_remaining);
        }
      } catch (error) {
        console.error("Could not fetch user profile details:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }

    // Load any pending job descriptions from before they signed up
    const savedJD = localStorage.getItem('pendingJobDescription');
    if (savedJD) {
      setJobDescription(savedJD);
      localStorage.removeItem('pendingJobDescription');
    }
  }, [isAuthenticated]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) setSelectedFile(e.target.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    setError(null);
    if (!selectedFile || !jobDescription) return;

    // Run Frontend Validation to prevent junk data from costing API credits
    const validation = validateJobDescription(jobDescription);
    if (!validation.isValid) {
      setError(validation.error || "Invalid job description.");
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem('pendingJobDescription', jobDescription);
      navigate('/signup');
      return;
    }

    setIsAnalyzing(true);
    setIsSuccess(false);

    const formData = new FormData();
    formData.append('file', selectedFile); 
    formData.append('job_description', jobDescription);

    try {
      const response = await api.post<AnalysisResponse>('/analysis/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, 
      });

      // Update the scans badge immediately with the new number from FastAPI
      if (response.data.scans_remaining !== undefined) {
        setScansRemaining(response.data.scans_remaining);
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/results/${response.data.id}`);
      }, 1500);

    } catch (err: any) {
      console.error("Analysis failed:", err);
      
      // Catches the specific 403 Out of Scans error from the FastAPI Gatekeeper
      if (err.response && err.response.status === 403) {
        setError("You are out of scans! Your account will be replenished next week.");
        setScansRemaining(0); // Force sync UI to 0
      }
      else if (err.response && err.response.status === 429) {
        setError("The AI engine is currently at maximum capacity. Please wait 1 minute and try again.");
      } 
      else if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } 
      else {
        setError("Analysis failed. The server might be busy or unreachable. Please try again.");
      }

      setIsAnalyzing(false); 
      setIsSuccess(false);
    }
  };

  return (
    <>
    <SEO 
        title="My Analysis" 
        description="SkillBridge AI Dashboard" 
      />
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 pb-20">
      
      <div className="max-w-5xl mx-auto mb-10 mt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">New Analysis</h1>
              
              {/* Only render the badge if they are logged in */}
              {isAuthenticated && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-colors ${
                  scansRemaining === null ? 'bg-slate-50 border-slate-200 text-slate-500' :
                  scansRemaining > 0 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <span>⚡</span>
                  {scansRemaining === null ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3 w-3 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span>{scansRemaining} Scans Left</span>
                  )}
                </div>
              )}
            </div>

            <p className="text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed mt-1">
              Upload your resume and paste the target job description. The AI engine will calculate your match score and uncover critical skill gaps.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-medium flex items-center gap-3 shadow-sm transition-all animate-in fade-in slide-in-from-top-4">
          <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          <p>{error}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Upload Resume */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">1. Upload Resume</h2>
          <div 
            onClick={() => fileInputRef.current?.click()} 
            onDragOver={handleDragOver} onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 rounded-lg p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer min-h-[280px]"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
            <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center mb-4 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <p className="text-sm text-slate-600 text-center font-medium">
              {selectedFile ? selectedFile.name : "Drop PDF here or click to browse"}
            </p>
          </div>
        </div>

        {/* Right Column: Job Description */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">2. Job Description</h2>
          <textarea 
            className="flex-grow w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[280px] transition-all"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => {
              setError(null);
              setJobDescription(e.target.value);
            }}
          ></textarea>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <AnalyzerLoading 
          isAnalyzing={isAnalyzing}
          isSuccess={isSuccess}
          // Button is disabled if form is empty, OR if logged in with 0 scans (but wait until scans are loaded).
          // Guests can still click it to get redirected to the signup page.
          isDisabled={!selectedFile || jobDescription.length === 0 || (isAuthenticated && scansRemaining !== null && scansRemaining <= 0)}
          onAnalyze={handleAnalyze}
        />
      </div>

    </div>
    </>
  );
}