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
