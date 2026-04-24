import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface HistoryItem {
  id: string;
  match_percentage: number;
  job_title: string;
  company: string;
  created_at: string;
  resume_filename: string;
  missing_skills_preview: string[];
}

export default function HistoryView() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/analysis');
      setHistory(response.data.analyses);
    } catch (err) {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stops the row click from triggering navigation
    if (!window.confirm("Are you sure you want to delete this scan?")) return;

    try {
      await api.delete(`/analysis/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete the analysis.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  };

  // Helper for the score badge colors
  const getScoreBadge = (score: number) => {
    if (score >= 70) return "bg-green-50 text-green-700";
    if (score >= 40) return "bg-yellow-50 text-yellow-700";
    return "bg-rose-50 text-rose-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse">Loading history vault...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-6xl w-full mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-5 md:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Analysis history</h1>
              <div className="text-xs text-slate-400 mt-1">{history.length} scans total</div>
            </div>
            
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && history.length === 0 && !error && (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-sm font-medium text-slate-800 mb-1">No history yet</h3>
              <p className="text-slate-500 text-xs mb-4">Run an analysis to see your past scans here.</p>
            </div>
          )}

          {/* The Data Table */}
          {history.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pb-3 pr-4 pl-2">Job Title & Company</th>
                    <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pb-3 px-4">Resume</th>
                    <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pb-3 px-4">Match</th>
                    <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pb-3 px-4">Missing Skills</th>
                    <th className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pb-3 px-4">Date</th>
                    <th className="pb-3 pl-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => navigate(`/results/${item.id}`)}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pr-4 pl-2">
                        <div className="text-xs font-semibold text-slate-800">{item.job_title}</div>
                        {item.company !== "Unknown Company" && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.company}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {item.resume_filename || "resume.pdf"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${getScoreBadge(item.match_percentage)}`}>
                          {item.match_percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {item.missing_skills_preview?.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                              {skill}
                            </span>
                          ))}
                          {item.missing_skills_preview && item.missing_skills_preview.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                              +{item.missing_skills_preview.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[10px] text-indigo-600 border border-indigo-200 bg-white px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
                            View
                          </button>
                          <button 
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-[10px] text-rose-600 border border-rose-200 bg-white px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}