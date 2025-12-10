import React, { useRef, useEffect } from 'react';
import { useTracking } from '../contexts/TrackingContext';
import { Activity, MousePointer, Eye, AlertCircle, DollarSign, Terminal } from 'lucide-react';
import { EventType } from '../types';

const EventIcon: React.FC<{ type: EventType }> = ({ type }) => {
    switch (type) {
        case 'page_view': return <Eye size={14} className="text-blue-500" />;
        case 'click': return <MousePointer size={14} className="text-amber-500" />;
        case 'conversion': return <DollarSign size={14} className="text-green-500" />;
        case 'error': return <AlertCircle size={14} className="text-red-500" />;
        case 'custom': return <Terminal size={14} className="text-purple-500" />;
        default: return <Activity size={14} className="text-slate-500" />;
    }
};

export const EventLog: React.FC = () => {
  const { events, clearEvents } = useTracking();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top (newest) or bottom? Usually logs show newest at top.
  // We will simply display the list.

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" />
            Live Event Stream
        </h3>
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{events.length} events</span>
            <button 
                onClick={clearEvents}
                className="text-xs hover:text-white transition text-slate-500"
            >
                Clear
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
        {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <Activity size={32} className="mb-2" />
                <p className="text-sm">Waiting for events...</p>
            </div>
        ) : (
            events.map((evt) => (
                <div key={evt.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition group animate-in slide-in-from-left-2 duration-300">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                             <div className={`p-1 rounded bg-slate-800 border border-slate-700`}>
                                <EventIcon type={evt.type} />
                             </div>
                             <span className="font-mono text-xs text-indigo-300 font-bold">{evt.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString().split(' ')[0]}
                        </span>
                    </div>
                    
                    <div className="pl-8">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                            <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">path</span>
                            {evt.path}
                        </div>
                        {evt.properties && Object.keys(evt.properties).length > 0 && (
                             <div className="mt-2 bg-black/30 p-2 rounded border border-white/5 text-[10px] font-mono text-slate-400 break-all">
                                {JSON.stringify(evt.properties)}
                             </div>
                        )}
                    </div>
                </div>
            ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
