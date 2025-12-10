import React, { useState } from 'react';
import { useTracking } from '../contexts/TrackingContext';
import { analyzeEvents } from '../services/geminiService';
import { Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming we can use simple rendering or just simple text for now if lib not available, but I'll implement a simple text display to be safe or use a hypothetical markdown component. 
// Note: Since I cannot install new packages like react-markdown dynamically, I will render the text with basic whitespace formatting or dangerouslySetInnerHTML if needed, 
// but for safety in this strict environment, I will use a simple whitespace-pre-wrap div.

export const GeminiPanel: React.FC = () => {
  const { events } = useTracking();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeEvents(events);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Error analyzing data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-full">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
                <Sparkles size={20} className="text-yellow-300" />
                <h3 className="font-bold">AI Insight Analyst</h3>
            </div>
            <button 
                onClick={handleAnalyze}
                disabled={loading || events.length === 0}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition
                    ${loading 
                        ? 'bg-white/20 text-white/50 cursor-wait' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm'
                    }
                    ${events.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {loading ? <RefreshCw className="animate-spin" size={14}/> : <MessageSquare size={14}/>}
                {loading ? 'Analyzing...' : 'Generate Report'}
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {!analysis ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center max-w-xs mx-auto">
                    <Sparkles size={48} className="mb-4 text-slate-300" />
                    <h4 className="font-semibold text-slate-600 mb-2">Unlock Behavioral Insights</h4>
                    <p className="text-sm">
                        Generate some events in the sandbox, then click "Generate Report" to let Gemini analyze user patterns and friction points.
                    </p>
                </div>
            ) : (
                <div className="prose prose-sm prose-slate max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                        {analysis}
                    </div>
                </div>
            )}
        </div>
        
        {/* Footer with model info */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>Refreshes on demand</span>
        </div>
    </div>
  );
};
