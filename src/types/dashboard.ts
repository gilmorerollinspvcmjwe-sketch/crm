/**
 * Dashboard & Dashlet Types
 */

export type DashletType =
  // Sales
  | 'revenue-trend'
  | 'sales-funnel'
  | 'sales-ranking'
  | 'sales-by-source'
  | 'sales-forecast'
  | 'deal-status'
  // Customer
  | 'customer-growth'
  | 'customer-segment'
  | 'customer-industry'
  | 'churn-warning'
  // Service
  | 'ticket-stats'
  | 'csat-score'
  | 'response-time'
  | 'ticket-trend'
  // Marketing
  | 'campaign-effectiveness'
  | 'lead-stats'
  | 'lead-conversion'
  | 'roi-analysis'
  // Activity
  | 'activity-stats'
  | 'activity-by-type'
  | 'activity-weekly'
  // Finance
  | 'payment-status'
  | 'revenue-breakdown'
  | 'overdue-payment'
  // AI
  | 'ai-insights'
  | 'ai-next-actions'
  | 'churn-risk'
  // General
  | 'kpi-summary'
  | 'recent-activities'
  | 'upcoming-tasks'
  | 'quick-actions'

export interface DashletConfig {
  id: string
  type: DashletType
  title: string
  x: number
  y: number
  w: number
  h: number
  config?: Record<string, unknown>
}

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  dashlets: DashletConfig[]
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  templateId?: string
  layout: DashboardLayout
  dashlets: DashletConfig[]
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardLayout {
  cols: number
  rowHeight: number
  compactType: 'none' | 'compact' | 'fill'
  margin: [number, number]
  containerPadding: [number, number]
}

export interface DashletDataResponse {
  type: DashletType
  data: Record<string, unknown>
  timestamp: string
  loading?: boolean
  error?: string
}

export interface DashboardStats {
  totalDashboards: number
  defaultDashboard?: string
  lastUpdated: string
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year'

export interface DashletContextValue {
  dashboard: Dashboard
  updateDashlet: (id: string, updates: Partial<DashletConfig>) => void
  removeDashlet: (id: string) => void
  addDashlet: (dashlet: DashletConfig) => void
  refreshDashlet: (id: string) => Promise<void>
  refreshAll: () => Promise<void>
  setLayout: (layout: Partial<DashboardLayout>) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
}
