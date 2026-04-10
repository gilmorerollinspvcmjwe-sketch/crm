/**
 * Dashlet Types - Dashboard Widget System
 */

export enum DashletType {
  CHART = 'chart',
  TABLE = 'table',
  KPI = 'kpi',
  LIST = 'list',
  CALENDAR = 'calendar',
  NEWS = 'news',
  ANNOUNCEMENT = 'announcement',
}

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'column' | 'funnel' | 'scatter'

export interface GridPosition {
  x: number
  y: number
  w: number
  h: number
}

export interface DashletConfig {
  id: string
  type: DashletType
  title: string
  gridPosition: GridPosition
  config: Record<string, any>
  dataSource?: string
  refreshInterval?: number
  description?: string
  icon?: string
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  dashlets: DashletConfig[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// KPI specific types
export interface KPIData {
  value: string | number
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  format?: 'number' | 'currency' | 'percent'
  prefix?: string
  suffix?: string
}

// Chart specific types
export interface ChartDataPoint {
  [key: string]: string | number
}

export interface ChartConfig {
  chartType: ChartType
  data: ChartDataPoint[]
  xKey: string
  yKeys: string[]
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
}

// Table specific types
export interface TableColumn {
  key: string
  label: string
  width?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

export interface TableConfig {
  columns: TableColumn[]
  data: Record<string, any>[]
  pageSize?: number
  showPagination?: boolean
  striped?: boolean
  hoverable?: boolean
}

// List specific types
export interface ListItem {
  id: string
  title: string
  description?: string
  metadata?: Record<string, string>
  timestamp?: string
  status?: 'success' | 'warning' | 'error' | 'info'
  icon?: string
}

export interface ListConfig {
  items: ListItem[]
  showAvatar?: boolean
  showTimestamp?: boolean
  showStatus?: boolean
  maxItems?: number
}

// Calendar specific types
export interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  type?: 'meeting' | 'task' | 'deadline' | 'reminder'
  color?: string
}

export interface CalendarConfig {
  events: CalendarEvent[]
  view?: 'month' | 'week' | 'day'
}

// News/Announcement specific types
export interface NewsItem {
  id: string
  title: string
  content: string
  author?: string
  publishedAt: string
  category?: string
  priority?: 'high' | 'medium' | 'low'
}

export interface NewsConfig {
  items: NewsItem[]
  maxItems?: number
  showCategory?: boolean
}
