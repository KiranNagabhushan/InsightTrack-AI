import React from 'react';
import { TrackingProvider } from './contexts/TrackingContext';
import { Sandbox } from './components/Sandbox';
import { EventLog } from './components/EventLog';
import { Dashboard } from './components/Dashboard';
import { GeminiPanel } from './components/GeminiPanel';
import { LayoutDashboard, Store, Terminal, Sparkles } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'sandbox'>('sandbox');

  return (
    <TrackingProvider>
      <div className="h-screen w-screen bg-slate-100 text-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <LayoutDashboard size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">InsightTrack AI</h1>
                <p className="text-xs text-slate-500">Real-time Behavioral Analytics & Event Simulation</p>
             </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
             <button 
                onClick={() => setActiveTab('sandbox')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${activeTab === 'sandbox' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Store size={16} /> Simulator
             </button>
             <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Sparkles size={16} /> Analytics
             </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-1 p-6 overflow-hidden">
            <div className="grid grid-cols-12 gap-6 h-full">
                
                {/* Left Column: Primary Interaction Area */}
                <div className="col-span-12 lg:col-span-8 h-full flex flex-col min-h-0">
                    {activeTab === 'sandbox' ? (
                        <div className="h-full flex flex-col gap-4">
                            <div className="flex items-center justify-between text-slate-500 px-1">
                                <span className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                                    <Store size={16} /> Target Application
                                </span>
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                                    Instrumentation Active
                                </span>
                            </div>
                            <div className="flex-1 min-h-0">
                                <Sandbox />
                            </div>
                        </div>
                    ) : (
                         <div className="h-full flex flex-col gap-4">
                             <div className="flex items-center justify-between text-slate-500 px-1">
                                <span className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles size={16} /> Performance & Insights
                                </span>
                             </div>
                             <div className="flex-1 min-h-0 grid grid-rows-2 gap-6">
                                 <div className="row-span-1">
                                     <Dashboard />
                                 </div>
                                 <div className="row-span-1 min-h-0">
                                     <GeminiPanel />
                                 </div>
                             </div>
                         </div>
                    )}
                </div>

                {/* Right Column: Event Log (Always Visible) */}
                <div className="col-span-12 lg:col-span-4 h-full flex flex-col min-h-0">
                    <div className="flex items-center justify-between text-slate-500 px-1 mb-4">
                         <span className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                            <Terminal size={16} /> Data Stream
                         </span>
                         <span className="text-[10px] font-mono text-slate-400">WS: Connected</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <EventLog />
                    </div>
                    
                    {/* Helper Box */}
                    <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-500">
                        <p className="font-semibold text-slate-700 mb-1">How it works:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Interact with the <strong>Simulator</strong> to generate events.</li>
                            <li>Watch the <strong>Data Stream</strong> capture actions in real-time.</li>
                            <li>Switch to <strong>Analytics</strong> to see charts & AI insights.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </main>
      </div>
    </TrackingProvider>
  );
};

export default App;
