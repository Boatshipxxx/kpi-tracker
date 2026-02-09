// Common type definitions for KPI Tracker

export interface KPI {
  id: string;
  name: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPICategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface DataPoint {
  id: string;
  kpiId: string;
  value: number;
  timestamp: Date;
  note?: string;
}

// Daily Log tracking
export interface DailyLog {
  date: string; // YYYY-MM-DD format
  boundaryCount: number;
  authenticCount: number;
  prohibitedActions: {
    action1: boolean;
    action2: boolean;
    action3: boolean;
    action4: boolean;
  };
  discomfortLevel: number; // 1-10 scale
  energyState: number; // 1-10 scale
  selfAlignment: number; // 1-10 scale
  soloTimeHours: number;
  notes: string;
}

// Weekly Review
export interface WeeklyReview {
  weekStart: string; // YYYY-MM-DD format
  weekEnd: string; // YYYY-MM-DD format
  insights: string;
  changes: string;
  challenges: string;
  kpiSummary: {
    boundaryTotal: number;
    authenticTotal: number;
    avgDiscomfort: number;
    avgEnergy: number;
    avgAlignment: number;
    totalSoloTime: number;
  };
}

// Monthly Guide structure
export interface MonthlyKPI {
  name: string;
  target: string;
  unit: string;
}

export interface MonthlyAction {
  action: string;
  frequency: string;
}

export interface MonthlyGuide {
  month: number; // 1-12
  phase: string; // Japanese phase name
  theme: string; // Japanese theme
  kpis: MonthlyKPI[];
  actions: MonthlyAction[];
  checkpoint: string; // Japanese checkpoint description
  specialNote?: string; // Optional Japanese special note
}
