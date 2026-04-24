import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 mb-6">
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
              <path d="M5 1C2.8 1 1 2.8 1 5s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.1c-1.3 0-2.5-.7-3.2-1.7.5-.8 1.8-1.3 3.2-1.3s2.7.5 3.2 1.3c-.7 1-1.9 1.7-3.2 1.7z" fill="currentColor"/>
            </svg>
            Built by a developer, for job seekers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
            We built the tool we wished existed when we were job hunting
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            SkillBridge AI started from a frustrating personal experience — applying to dozens of jobs, getting silence, and never knowing why. We built this to change that.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Founder Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 shrink-0">
            AA
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Abdullah Arshad</h2>
            <p className="text-sm font-medium text-slate-500 mb-4">Founder & Developer · SkillBridge AI</p>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "As a recent IT graduate applying to backend engineering roles, I was getting rejected without any feedback. I'd spend hours on each application with no idea where I was falling short — was it my skills? My resume wording? My experience level? I built SkillBridge AI to answer that question honestly and instantly. If it helps even one person understand their gaps and land the job they're working toward, it's worth it."
            </p>
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">The Problem</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Job rejections with zero feedback are demoralizing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Most applicants never find out why they weren't selected. They apply, wait, and get a form rejection. Without honest feedback, you can't improve — you just apply again and hope. That cycle is exhausting.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Our Solution</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">AI that gives you the honest recruiter perspective</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              SkillBridge AI acts like a senior recruiter who actually tells you the truth — what you have, what you're missing, and why each gap matters for that specific role. No generic advice, just actionable data.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-black text-indigo-600 mb-1">4.5s</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Analysis Time</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-black text-indigo-600 mb-1">3</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Free Weekly Scans</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-black text-indigo-600 mb-1">100%</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Private & Secure</div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-center">What we believe</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="w-8 h-1 bg-indigo-600 rounded-full mb-4"></div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Honesty over comfort</h4>
            <p className="text-xs text-slate-600 leading-relaxed">A 30% match is a 30% match. We don't sugarcoat results — that only wastes your time.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="w-8 h-1 bg-emerald-600 rounded-full mb-4"></div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Reasons, not just labels</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Knowing you lack "AWS" is useless. Knowing why it matters for this specific role is actionable.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="w-8 h-1 bg-amber-600 rounded-full mb-4"></div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Built in public</h4>
            <p className="text-xs text-slate-600 leading-relaxed">We're a small team shipping fast and learning from real users. Your feedback shapes what we build next.</p>
          </div>
        </div>

      </div>

      {/* CTA Strip */}
      <div className="bg-indigo-700 py-16 px-4 text-center mt-8">
        <h2 className="text-2xl font-bold text-white mb-3">See exactly where you stand</h2>
        <p className="text-indigo-200 mb-8 max-w-md mx-auto text-sm">Join hundreds of job seekers who stopped guessing and started knowing.</p>
        <Link to="/" className="inline-block bg-white text-indigo-700 font-bold text-sm px-8 py-3.5 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">
          Analyze my resume &rarr;
        </Link>
      </div>

    </div>
  );
}