import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      
      {/* HERO SECTION */}
      <div className="bg-white border-b border-slate-200 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full mb-4 border border-indigo-200">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1l1 3h3l-2.5 1.8 1 3L5 7 2.5 8.8l1-3L1 4h3z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
            Powered by Google Gemini AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4 leading-tight">
            From resume to reality<br />in under 30 seconds
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg mx-auto mb-6">
            Upload your CV, paste a job description, and get an honest AI-powered breakdown of exactly where you stand — and what to do next.
          </p>
          <Link to="/" className="inline-block bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            Try it now — 3 free weekly scans
          </Link>
          <div className="text-[11px] text-slate-400 mt-3">
            3 free weekly scans · Takes 30 seconds · 100% private
          </div>
        </div>
      </div>

      {/* STEPS SECTION */}
      <div className="py-12 px-4 max-w-5xl mx-auto">
        <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-slate-400 text-center mb-8">
          How it works — 4 simple steps
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative mb-12">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-sm">
            <div className="text-[10px] font-medium text-indigo-700 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center mb-4">1</div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="10" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">Upload your resume</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Drag and drop your CV as a PDF. We extract the text securely — your file is never stored permanently.</p>
            <div className="hidden lg:block absolute -right-3 top-8 text-slate-300 text-lg z-10">&rarr;</div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-sm">
            <div className="text-[10px] font-medium text-indigo-700 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center mb-4">2</div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4 text-emerald-700">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">Paste the job</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Copy the full job posting from LinkedIn, Indeed, or any careers page and paste it into the text box.</p>
            <div className="hidden lg:block absolute -right-3 top-8 text-slate-300 text-lg z-10">&rarr;</div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-sm">
            <div className="text-[10px] font-medium text-indigo-700 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center mb-4">3</div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4 text-amber-700">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5v3.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">AI analyzes the gap</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Gemini reads both documents like a senior recruiter — comparing skills, experience level, and domain knowledge.</p>
            <div className="hidden lg:block absolute -right-3 top-8 text-slate-300 text-lg z-10">&rarr;</div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-medium text-indigo-700 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center mb-4">4</div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4 text-green-700">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">Get your full report</h3>
            <p className="text-xs text-slate-500 leading-relaxed">See your match score, an executive summary, skill badges, and exactly what's holding you back.</p>
          </div>
        </div>

        {/* WHAT YOU GET SECTION */}
        <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-slate-400 text-center mb-6">
          What you get in every report
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              <h4 className="text-sm font-medium text-slate-900">Match score</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">An honest 0–100% score showing how well your profile fits this specific role right now.</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-700"></div>
              <h4 className="text-sm font-medium text-slate-900">Skill breakdown</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Green, amber, and red badges showing matched, partial, and missing skills at a glance.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-700"></div>
              <h4 className="text-sm font-medium text-slate-900">Executive summary</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">A 3–4 sentence AI-written assessment — honest about gaps but focused on what you can do next.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <h4 className="text-sm font-medium text-slate-900">Gap reasons</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Each missing skill comes with a specific reason why it matters for this role — not just a label.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-violet-600"></div>
              <h4 className="text-sm font-medium text-slate-900">History vault</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Every analysis is saved. Compare across multiple jobs to see which roles you're closest to landing.</p>
          </div>

          {/* REPLACED "Roadmap" with "Smart Validation" */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
              <h4 className="text-sm font-medium text-slate-900">Smart validation</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Our AI detects fake or invalid job descriptions before running the engine, protecting your weekly scans.</p>
          </div>
        </div>
      </div>

      {/* CTA STRIP */}
      <div className="bg-indigo-700 py-10 px-4 text-center mx-4 sm:mx-auto max-w-5xl rounded-2xl shadow-sm">
        <h2 className="text-lg font-medium text-white mb-2">Ready to see where you actually stand?</h2>
        <p className="text-indigo-200 text-sm mb-6">Join hundreds of job seekers who stopped guessing and started knowing.</p>
        <Link to="/" className="inline-block bg-white text-indigo-700 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors">
          Analyze my resume &rarr;
        </Link>
      </div>

    </div>
  );
}