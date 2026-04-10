/**
 * Dashlet Service
 * 数据源集成 - 获取各类 Dashlet 的数据
 */

import { DashletType, TimeRange } from '@/types/dashboard'
import { mockDashletData } from '@/mock/dashboardData'

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 获取 Dashlet 数据
 * 根据 Dashlet 类型返回对应的 Mock 数据
 */
export async function fetchDashletData(
  dashletType: DashletType,
  config: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  // Simulate API call
  await delay(300 + Math.random() * 200)

  const data = mockDashletData[dashletType]

  if (!data || typeof data !== 'object') {
    return {}
  }

  // Apply any config transformations
  const timeRange = (config.timeRange as TimeRange) || 'month'

  // For time-sensitive data, apply range multiplier
  if (config.timeRange && timeRange !== 'month') {
    return applyTimeRange(data as Record<string, unknown>, timeRange)
  }

  return data as Record<string, unknown>
}

/**
 * 批量获取多个 Dashlet 数据
 */
export async function fetchDashletsData(
  dashlets: Array<{ type: DashletType; config?: Record<string, unknown> }>
): Promise<Record<DashletType, Record<string, unknown>>> {
  const results = await Promise.all(
    dashlets.map(async (d) => ({
      type: d.type,
      data: await fetchDashletData(d.type, d.config || {}),
    }))
  )

  return results.reduce(
    (acc, { type, data }) => {
      acc[type] = data
      return acc
    },
    {} as Record<DashletType, Record<string, unknown>>
  )
}

/**
 * 刷新单个 Dashlet
 */
export async function refreshDashlet(
  dashletType: DashletType,
  config?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  // Add random variation to simulate real data refresh
  await delay(200 + Math.random() * 300)
  return fetchDashletData(dashletType, config)
}

/**
 * 获取预设 Dashboard 数据
 */
export async function fetchDashboardData(
  dashboardId: string
): Promise<{ success: boolean; data?: Record<string, unknown> }> {
  await delay(500)

  return {
    success: true,
    data: {
      dashboardId,
      lastRefreshed: new Date().toISOString(),
    },
  }
}

/**
 * 保存 Dashboard 布局
 */
export async function saveDashboardLayout(
  dashboardId: string,
  layout: unknown
): Promise<{ success: boolean }> {
  await delay(300)

  // In real implementation, this would call the API
  console.log('Saving dashboard layout:', dashboardId, layout)

  return { success: true }
}

/**
 * 应用时间范围缩放
 */
function applyTimeRange(
  data: Record<string, unknown>,
  timeRange: TimeRange
): Record<string, unknown> {
  const multipliers: Record<TimeRange, number> = {
    week: 0.25,
    month: 1,
    quarter: 3,
    year: 12,
  }

  const multiplier = multipliers[timeRange]

  // Deep clone to avoid mutating original
  const transformed = JSON.parse(JSON.stringify(data))

  // Scale numeric values in arrays
  const scaleArray = (arr: unknown[]): unknown[] => {
    return arr.map((item) => {
      if (typeof item === 'object' && item !== null) {
        const scaled: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(item)) {
          if (typeof value === 'number' && key !== 'rate' && key !== 'percentage' && key !== 'score' && key !== 'avgDays' && key !== 'avgDealCycle') {
            scaled[key] = Math.round(Number(value) * multiplier)
          } else {
            scaled[key] = value
          }
        }
        return scaled
      }
      return item
    })
  }

  // Transform known data patterns
  if (Array.isArray(transformed.data)) {
    transformed.data = scaleArray(transformed.data)
  }

  if (Array.isArray(transformed.trends)) {
    transformed.trends = scaleArray(transformed.trends)
  }

  if (Array.isArray(transformed.weekly)) {
    transformed.weekly = scaleArray(transformed.weekly)
  }

  if (Array.isArray(transformed.stages)) {
    transformed.stages = scaleArray(transformed.stages)
  }

  if (Array.isArray(transformed.performers)) {
    transformed.performers = scaleArray(transformed.performers)
  }

  transformed._timeRange = timeRange
  transformed._multiplier = multiplier

  return transformed
}

/**
 * 导出 Dashlet 数据为 CSV
 */
export function exportDashletToCSV(
  dashletType: DashletType,
  data: Record<string, unknown>
): void {
  const jsonData = Array.isArray(data) ? data : [data]

  if (jsonData.length === 0) return

  const headers = Object.keys(jsonData[0])
  const csvContent = [
    headers.join(','),
    ...jsonData.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `dashlet-${dashletType}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

/**
 * 获取 Dashlet 支持的时间范围
 */
export function getSupportedTimeRanges(dashletType: DashletType): TimeRange[] {
  const timeRangeDashlets: DashletType[] = [
    'revenue-trend',
    'customer-growth',
    'lead-stats',
    'lead-conversion',
    'ticket-trend',
    'activity-weekly',
    'roi-analysis',
  ]

  return timeRangeDashlets.includes(dashletType)
    ? ['week', 'month', 'quarter', 'year']
    : []
}

/**
 * 验证 Dashlet 配置
 */
export function validateDashletConfig(
  dashletType: DashletType,
  config: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required config fields based on dashlet type
  const requiredFields: Partial<Record<DashletType, string[]>> = {
    'sales-forecast': ['forecastPeriod'],
    'campaign-effectiveness': ['campaignId'],
  }

  const required = requiredFields[dashletType] || []
  for (const field of required) {
    if (!config[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
