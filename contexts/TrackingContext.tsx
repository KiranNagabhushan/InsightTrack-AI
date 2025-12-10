import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TrackedEvent, EventType, EventProperties } from '../types';

interface TrackingContextType {
  events: TrackedEvent[];
  track: (type: EventType, name: string, properties?: EventProperties) => void;
  clearEvents: () => void;
  sessionId: string;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const TrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [sessionId] = useState(`sess_${Math.random().toString(36).substr(2, 9)}`);

  const track = useCallback((type: EventType, name: string, properties?: EventProperties) => {
    const newEvent: TrackedEvent = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      path: window.location.hash.replace('#', '') || '/', // Simple hash path detection
      timestamp: Date.now(),
      properties,
      sessionId
    };

    setEvents(prev => [newEvent, ...prev]);
    console.log(`[InsightTrack] ${type}: ${name}`, properties);
  }, [sessionId]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return (
    <TrackingContext.Provider value={{ events, track, clearEvents, sessionId }}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
