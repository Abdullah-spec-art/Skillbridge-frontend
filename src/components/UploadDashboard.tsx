import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AnalyzerLoading from './AnalyzerLoading';
import SEO from './SEO';

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
  
  // State for Scans (Defaults to 3 until the API loads)
  const [scansRemaining, setScansRemaining] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Check if the user is currently logged in
  const isAuthenticated = !!localStorage.getItem('token');

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
    if (e.target.files && e.target.files.length > 0) setSelectedFile(e.target.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !jobDescription) return;

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

    } catch (error: any) {
      console.error("Analysis failed:", error);
      
      // Catches the specific 403 Out of Scans error from the FastAPI Gatekeeper
      if (error.response && error.response.status === 403) {
        alert("You are out of scans! Your account will be replenished next week.");
        setScansRemaining(0); // Force sync UI to 0
      }
      else if (error.response && error.response.status === 429) {
        alert("The AI engine is currently at maximum capacity. Please wait 1 minute and try again.");
      } 
      else if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } 
      else {
        alert("Analysis failed. The server might be busy or unreachable. Please try again.");
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
                  scansRemaining > 0 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <span>⚡</span>
                  <span>{scansRemaining} Scans Left</span>
                </div>
              )}
            </div>

            <p className="text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed mt-1">
              Upload your resume and paste the target job description. The AI engine will calculate your match score and uncover critical skill gaps.
            </p>
          </div>
        </div>
      </div>

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
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <AnalyzerLoading 
          isAnalyzing={isAnalyzing}
          isSuccess={isSuccess}
          // Button is disabled if form is empty, OR if logged in with 0 scans.
          // Guests can still click it to get redirected to the signup page.
          isDisabled={!selectedFile || jobDescription.length === 0 || (isAuthenticated && scansRemaining <= 0)}
          onAnalyze={handleAnalyze}
        />
      </div>

    </div>
    </>
  );
}