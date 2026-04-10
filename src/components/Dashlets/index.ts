/**
 * Dashlets Component Library
 * 
 * A comprehensive dashboard widget system for CRM UI
 * Supports: KPI, Chart, Table, List, Calendar, News/Announcement
 */

export { DashletContainer } from './DashletContainer'
export { KPIDashlet } from './KPIDashlet'
export { ChartDashlet } from './ChartDashlet'
export { TableDashlet } from './TableDashlet'
export { ListDashlet } from './ListDashlet'
export { CalendarDashlet } from './CalendarDashlet'
export { NewsDashlet } from './NewsDashlet'

// Re-export types for convenience
export type {
  DashletConfig,
  Dashboard,
  GridPosition,
  KPIData,
  ChartConfig,
  ChartDataPoint,
  ChartType,
  TableColumn,
  TableConfig,
  ListItem,
  ListConfig,
  CalendarEvent,
  CalendarConfig,
  NewsItem,
  NewsConfig,
} from '@/types/dashlet'

// Re-export enum as value (not type)
export { DashletType } from '@/types/dashlet'
