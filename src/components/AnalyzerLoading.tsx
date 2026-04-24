import React, { useState, useEffect, useRef } from 'react';

interface AnalyzerLoadingProps {
  isAnalyzing: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  onAnalyze: () => void;
}

export default function AnalyzerLoading({ isAnalyzing, isSuccess, isDisabled, onAnalyze }: AnalyzerLoadingProps) {
  // Start the loading animation at step 2 ("Gemini runs") because 0 and 1 are already done!
  const [step, setStep] = useState(2); 
  const containerRef = useRef<HTMLDivElement>(null);

  // --- THE AUTO-SCROLL MAGIC ---
  useEffect(() => {
    if (isAnalyzing && containerRef.current) {
      // Smoothly scrolls the loading bar to the center of the user's screen
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isAnalyzing]);

  // --- THE STEP TIMER LOGIC ---
  useEffect(() => {
    let interval: any;
    if (isAnalyzing && !isSuccess) {
      interval = setInterval(() => {
        setStep((prev) => (prev < 3 ? prev + 1 : prev)); // Move to "Auto-saved"
      }, 2500); 
    } else if (isSuccess) {
      setStep(4); // Move to "Redirecting"
    } else {
      setStep(2); // Reset
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, isSuccess]);

  const steps = [
    { label: "Upload + paste" },
    { label: "Click analyze" },
    { label: "Model is running" },
    { label: "Auto-saved" },
    { label: "Redirecting" }
  ];

  // --- STATE 1: IDLE (Just the button) ---
  if (!isAnalyzing && !isSuccess) {
    return (
      <div className="w-full flex justify-end">
        <div className="w-full sm:w-64">
          <button 
            onClick={onAnalyze}
            disabled={isDisabled}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Analyze resume
          </button>
          <div className="mt-2.5 text-[10px] text-slate-400 text-center uppercase tracking-wider font-semibold">
            Both fields required
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2 & 3: LOADING AND SUCCESS (Horizontal Pipeline) ---
  return (
    <div 
      ref={containerRef} 
      className="w-full bg-white border border-slate-200 rounded-xl p-8 md:p-12 shadow-sm flex flex-col items-center justify-center transition-all duration-500"
    >
      <h3 className="text-lg font-extrabold text-slate-800 mb-10 tracking-tight">
        {isSuccess ? "Analysis Complete!" : "Analyzing your profile..."}
      </h3>

      {/* The Horizontal Flow */}
      <div className="flex items-center justify-between w-full max-w-4xl relative">
        {steps.map((s, i) => {
          const isCompleted = i < step || (isSuccess && i <= step);
          const isActive = i === step && !isSuccess;

          return (
            <React.Fragment key={i}>
              {/* Individual Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 shadow-sm ${
                  isCompleted ? 'bg-green-100 text-green-700 border-2 border-green-200' :
                  isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                  'bg-slate-50 text-slate-400 border-2 border-slate-200'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {/* Step Label below circle */}
                <span className={`text-[10px] sm:text-xs font-semibold text-center absolute -bottom-7 w-24 sm:w-32 ${isActive ? 'text-indigo-700' : isCompleted ? 'text-green-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>

              {/* Connecting Line (Arrow) */}
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 transition-all duration-500 mx-2 sm:mx-4 rounded-full ${
                  isCompleted ? 'bg-green-400' : 'bg-slate-200'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Animated Status Pill at the bottom */}
      {!isSuccess ? (
        <div className="mt-16 flex items-center gap-3 text-sm text-indigo-700 font-semibold bg-indigo-50 border border-indigo-100 px-6 py-2.5 rounded-full shadow-sm">
          <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          {step === 2 ? "Model is Extracting skills..." : "Saving to your history..."}
        </div>
      ) : (
        <div className="mt-16 flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 border border-green-200 px-6 py-2.5 rounded-full shadow-sm">
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          Redirecting to your results...
        </div>
      )}
    </div>
  );
}