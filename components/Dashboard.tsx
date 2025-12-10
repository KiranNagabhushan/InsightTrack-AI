import React, { useMemo } from 'react';
import { useTracking } from '../contexts/TrackingContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { EventType } from '../types';

export const Dashboard: React.FC = () => {
  const { events } = useTracking();

  const stats = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    let conversions = 0;
    
    // Group events by minute for the timeline
    const timelineMap: Record<string, number> = {};

    events.forEach(e => {
        // Count Types
        typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
        if (e.type === 'conversion') conversions++;

        // Timeline (group by minute HH:MM)
        const date = new Date(e.timestamp);
        const key = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        timelineMap[key] = (timelineMap[key] || 0) + 1;
    });

    const chartData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
    
    // Sort timeline
    const timelineData = Object.entries(timelineMap)
        .map(([time, count]) => ({ time, count }))
        .sort((a, b) => a.time.localeCompare(b.time));

    return { typeCounts, conversions, chartData, timelineData };
  }, [events]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Events</p>
              <p className="text-2xl font-bold text-slate-800">{events.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Conversions</p>
              <p className="text-2xl font-bold text-green-600">{stats.conversions}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Top Event Type</p>
              <p className="text-2xl font-bold text-indigo-600 capitalize">
                  {stats.chartData.sort((a,b) => b.value - a.value)[0]?.name || '-'}
              </p>
          </div>
      </div>

      {/* Charts Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-slate-700 mb-4">Event Distribution</h4>
              <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                        />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h4 className="text-sm font-semibold text-slate-700 mb-4">Activity Over Time</h4>
              <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.timelineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                    </LineChart>
                </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
};
