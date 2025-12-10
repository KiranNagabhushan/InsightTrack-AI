export type EventType = 'page_view' | 'click' | 'form_submit' | 'custom' | 'error' | 'conversion';

export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface TrackedEvent {
  id: string;
  type: EventType;
  name: string;
  path: string;
  timestamp: number;
  properties?: EventProperties;
  sessionId: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  eventsByType: Record<EventType, number>;
  activeSessionTime: number; // in seconds
  conversionRate: number;
}
