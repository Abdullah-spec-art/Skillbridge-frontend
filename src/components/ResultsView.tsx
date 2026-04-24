import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

// --- Interfaces ---
interface MissingSkill {
  skill: string;
  reason: string;
}

interface AnalysisData {
  id: string;
  created_at: string;
  resume_filename: string;
  match_percentage: number;
  executive_summary: string;
  job_title: string;
  company: string;
  missing_skills: MissingSkill[];
  matched_skills: string[];
  partial_skills: string[];
}

export default function ResultsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/analysis/${id}`);
        setAnalysis(response.data.analysis);
      } catch (err) {
        setError("Could not load analysis results.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading your results...
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="text-indigo-600 underline">Go back home</button>
        </div>
      </div>
    );
  }

  // --- Dynamic Ring Math ---
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.match_percentage / 100) * circumference;

  const isGoodFit = analysis.match_percentage >= 70;
  const isMediumFit = analysis.match_percentage >= 40 && analysis.match_percentage < 70;
  
  const ringColor = isGoodFit ? "#22C55E" : isMediumFit ? "#EAB308" : "#F43F5E";
  const verdictBg = isGoodFit ? "bg-green-50 text-green-800" : isMediumFit ? "bg-yellow-50 text-yellow-800" : "bg-rose-50 text-rose-800";
  const verdictText = isGoodFit ? "Strong fit" : isMediumFit ? "Partial fit" : "Weak fit";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-20">
      
      {/* CHANGE 1: Width adjusted! 
        w-[95%] ensures it takes up most of the screen, max-w-7xl caps it on massive monitors 
      */}
      <div className="max-w-7xl w-[95%] mx-auto bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
       <div className="bg-white border-b border-slate-200 px-5 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left Side: Icon & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">AI Analysis Report</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">SkillBridge Engine</p>
            </div>
          </div>

          {/* Right Side: Status Badge */}
          <div className="flex items-center">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Scan Complete
            </span>
          </div>
          
        </div>

        <div className="p-5 md:p-8">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                {analysis.job_title} 
                {/* CHANGE 4: Hide company if it equals "Unknown Company" */}
                {analysis.company && analysis.company !== "Unknown Company" && (
                  <span className="text-slate-400 font-normal">— {analysis.company}</span>
                )}
              </h1>
              {/* CHANGE 2: Removed the ID from this line */}
              <div className="text-sm text-slate-400 mt-1">
                Analyzed on {new Date(analysis.created_at).toLocaleDateString()} &nbsp;·&nbsp; {analysis.resume_filename}
              </div>
            </div>
            <button 
              onClick={() => navigate('/history')}
              className="text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M6.5 2L3 5.5l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to history
            </button>
          </div>

          {/* Top Row: Score + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 gap-2 shadow-sm">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 80 80" className="transform -rotate-90 w-full h-full">
                  <circle cx="40" cy="40" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="7" />
                  <circle 
                    cx="40" cy="40" r={radius} fill="none" 
                    stroke={ringColor} strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold" style={{ color: ringColor }}>{analysis.match_percentage}%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Match</span>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-2">Profile match</div>
              <div className={`text-xs px-3 py-1 rounded-full font-medium ${verdictBg}`}>
                {verdictText}
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.1"/><path d="M3.5 4.5h5M3.5 6.5h5M3.5 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                AI Executive Summary
              </div>
              <div className="text-base text-slate-600 leading-relaxed">
                {analysis.executive_summary}
              </div>
            </div>
          </div>

          {/* Missing Skills Section */}
          {analysis.missing_skills && analysis.missing_skills.length > 0 && (
            <>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#F43F5E" strokeWidth="1.1"/><path d="M6 3.5v3M6 8v.5" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round"/></svg>
                Missing Skills
                {/* CHANGE 3: Now says "X major gaps" */}
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-md tracking-normal font-medium ml-1">
                  {analysis.missing_skills.length} major gaps
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {analysis.missing_skills.map((item, idx) => (
                  <div key={idx} className="bg-white border border-rose-200 border-l-4 border-l-rose-500 rounded-r-xl rounded-l-sm p-5 shadow-sm flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-7 h-7 rounded bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M6 1v5M6 9v1" stroke="#F43F5E" strokeWidth="1.3" strokeLinecap="round"/><circle cx="6" cy="6" r="5" stroke="#FECDD3" strokeWidth="1"/></svg>
                      </div>
                      <div className="text-sm font-bold text-rose-700 leading-snug">{item.skill}</div>
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed border-t border-rose-50 pt-3 mt-auto">
                      {item.reason}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* What You Have Section */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 mt-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#22C55E" strokeWidth="1.1"/><path d="M3.5 6l2 2 3-3.5" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              What you already have
            </div>
            
            {/* CHANGE 4: The Color Legend */}
            <div className="flex gap-4 text-xs font-medium text-slate-500 md:ml-auto bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Full Match
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Partial Match
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            {analysis.matched_skills?.map((skill, idx) => (
              <span key={`match-${idx}`} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 text-green-800 border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {skill}
              </span>
            ))}
            {analysis.partial_skills?.map((skill, idx) => (
              <span key={`partial-${idx}`} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                {skill}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-200">
            <button onClick={() => navigate('/')} className="text-sm bg-indigo-600 text-white border border-transparent px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
              New analysis
            </button>
            <button onClick={() => navigate('/history')} className="text-sm bg-white text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-lg hover:bg-indigo-50 font-medium transition-colors">
              View history
            </button>
            <button className="text-sm bg-white text-rose-600 border border-rose-200 px-5 py-2.5 rounded-lg hover:bg-rose-50 font-medium ml-auto transition-colors">
              Delete this scan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}