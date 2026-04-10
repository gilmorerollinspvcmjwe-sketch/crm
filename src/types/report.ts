/**
 * Report Types for CRM System
 */

export type ReportCategory = 'sales' | 'customer' | 'activity' | 'product' | 'finance'
export type ReportType = 'summary' | 'detail' | 'trend' | 'comparison'
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface Report {
  id: string
  name: string
  description?: string
  category: ReportCategory
  type: ReportType
  period: ReportPeriod
  createdAt: string
  updatedAt: string
  createdBy: string
  isPublic: boolean
  scheduled?: boolean
  schedule?: string
}

export interface ReportData {
  id: string
  reportId: string
  generatedAt: string
  data: Record<string, unknown>
  charts?: ChartConfig[]
  tables?: TableConfig[]
}

export interface ChartConfig {
  id: string
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'funnel'
  title: string
  dataSource: string
  xAxis?: string
  yAxis?: string
  colors?: string[]
}

export interface TableConfig {
  id: string
  title: string
  columns: { key: string; label: string; width?: number }[]
  dataSource: string
}

export interface ReportListParams {
  page?: number
  pageSize?: number
  search?: string
  category?: ReportCategory
  type?: ReportType
}