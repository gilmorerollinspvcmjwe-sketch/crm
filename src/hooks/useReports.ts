/**
 * useReports - 报表数据 Hooks
 * Report Data Hooks using TanStack Query
 */

import { useQuery } from '@tanstack/react-query'
import { useState, useCallback } from 'react'

// Types
export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'custom'

export interface SalesFunnelData {
  stages: Array<{
    stage: string
    stageKey: string
    count: number
    value: number
    conversionRate: number
    color: string
  }>
  metrics: {
    totalLeads: number
    conversionRate: number
    avgDealCycle: number
    forecastAmount: number
  }
  predictions: {
    predictedDeals: number
    predictedAmount: number
    targetProbability: number
  }
}

export interface PerformanceData {
  personal: Array<{
    rank: number
    name: string
    team: string
    target: number
    actual: number
    rate: number
  }>
  teams: Array<{
    team: string
    members: number
    target: number
    actual: number
    rate: number
  }>
  metrics: {
    totalSales: number
    targetCompletion: number
    avgDealSize: number
    activeSalespeople: number
  }
  trend: Array<{
    month: string
    value: number
  }>
}

export interface CustomerData {
  segments: Array<{
    segment: string
    segmentKey: string
    count: number
    percentage: number
    revenue: number
    color: string
  }>
  industries: Array<{
    industry: string
    count: number
    percentage: number
    color: string
  }>
  trends: Array<{
    month: string
    newCustomers: number
    activeCustomers: number
    churned: number
  }>
  metrics: {
    totalCustomers: number
    newCustomers: number
    activeCustomers: number
    churnRate: number
  }
}

export interface ActivityData {
  types: Array<{
    type: string
    typeKey: string
    count: number
    icon: string
    color: string
  }>
  weekly: Array<{
    day: string
    calls: number
    emails: number
    meetings: number
    visits: number
  }>
  performers: Array<{
    name: string
    activities: number
    calls: number
    emails: number
    meetings: number
  }>
  metrics: {
    totalActivities: number
    dailyAvg: number
    avgResponseTime: number
    conversionRate: number
  }
}

export interface LeadConversionData {
  stages: Array<{
    stage: string
    stageKey: string
    count: number
    rate: number
    avgDays: number
  }>
  sources: Array<{
    source: string
    sourceKey: string
    leads: number
    converted: number
    rate: number
  }>
  trends: Array<{
    month: string
    leads: number
    converted: number
    rate: number
  }>
  metrics: {
    totalLeads: number
    convertedLeads: number
    conversionRate: number
    avgConversionCycle: number
  }
}

export interface PaymentData {
  status: Array<{
    status: string
    statusKey: string
    amount: number
    count: number
    percentage: number
    color: string
  }>
  trends: Array<{
    month: string
    plan: number
    actual: number
    rate: number
  }>
  overdue: Array<{
    customer: string
    contract: string
    amount: number
    overdueDays: number
    status: string
    statusKey: string
  }>
  metrics: {
    totalPayment: number
    completionRate: number
    avgCycle: number
    overdueAmount: number
  }
}

// Mock data generators
const generateSalesFunnelData = (timeRange: TimeRange): SalesFunnelData => {
  const multiplier = timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 6
  return {
    stages: [
      { stage: '线索', stageKey: 'lead', count: Math.round(1000 * multiplier), value: Math.round(5000000 * multiplier), conversionRate: 100, color: '#3b82f6' },
      { stage: '商机', stageKey: 'opportunity', count: Math.round(450 * multiplier), value: Math.round(2250000 * multiplier), conversionRate: 45, color: '#6366f1' },
      { stage: '方案', stageKey: 'proposal', count: Math.round(200 * multiplier), value: Math.round(1000000 * multiplier), conversionRate: 20, color: '#8b5cf6' },
      { stage: '谈判', stageKey: 'negotiation', count: Math.round(80 * multiplier), value: Math.round(400000 * multiplier), conversionRate: 8, color: '#a855f7' },
      { stage: '成交', stageKey: 'closed', count: Math.round(35 * multiplier), value: Math.round(175000 * multiplier), conversionRate: 3.5, color: '#22c55e' },
    ],
    metrics: {
      totalLeads: Math.round(1000 * multiplier),
      conversionRate: 3.5,
      avgDealCycle: 28,
      forecastAmount: Math.round(175000 * multiplier),
    },
    predictions: {
      predictedDeals: Math.round(35 * multiplier),
      predictedAmount: Math.round(175000 * multiplier),
      targetProbability: 78,
    },
  }
}

const generatePerformanceData = (timeRange: TimeRange): PerformanceData => {
  const multiplier = timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 6
  return {
    personal: [
      { rank: 1, name: '张三', team: '华东一队', target: Math.round(500000 * multiplier), actual: Math.round(680000 * multiplier), rate: 136 },
      { rank: 2, name: '李四', team: '华东二队', target: Math.round(500000 * multiplier), actual: Math.round(620000 * multiplier), rate: 124 },
      { rank: 3, name: '王五', team: '华南一队', target: Math.round(500000 * multiplier), actual: Math.round(580000 * multiplier), rate: 116 },
      { rank: 4, name: '赵六', team: '华北一队', target: Math.round(500000 * multiplier), actual: Math.round(540000 * multiplier), rate: 108 },
      { rank: 5, name: '钱七', team: '华东三队', target: Math.round(500000 * multiplier), actual: Math.round(490000 * multiplier), rate: 98 },
      { rank: 6, name: '孙八', team: '华南二队', target: Math.round(500000 * multiplier), actual: Math.round(450000 * multiplier), rate: 90 },
      { rank: 7, name: '周九', team: '华北二队', target: Math.round(500000 * multiplier), actual: Math.round(420000 * multiplier), rate: 84 },
      { rank: 8, name: '吴十', team: '华东四队', target: Math.round(500000 * multiplier), actual: Math.round(380000 * multiplier), rate: 76 },
    ],
    teams: [
      { team: '华东区', members: 15, target: Math.round(7500000 * multiplier), actual: Math.round(8250000 * multiplier), rate: 110 },
      { team: '华南区', members: 12, target: Math.round(6000000 * multiplier), actual: Math.round(5520000 * multiplier), rate: 92 },
      { team: '华北区', members: 10, target: Math.round(5000000 * multiplier), actual: Math.round(4650000 * multiplier), rate: 93 },
      { team: '西南区', members: 8, target: Math.round(4000000 * multiplier), actual: Math.round(3200000 * multiplier), rate: 80 },
    ],
    metrics: {
      totalSales: Math.round(21620000 * multiplier),
      targetCompletion: 92.3,
      avgDealSize: Math.round(58000 * multiplier),
      activeSalespeople: 45,
    },
    trend: [
      { month: '1月', value: Math.round(1500000 * multiplier) },
      { month: '2月', value: Math.round(1800000 * multiplier) },
      { month: '3月', value: Math.round(2100000 * multiplier) },
      { month: '4月', value: Math.round(2400000 * multiplier) },
      { month: '5月', value: Math.round(2700000 * multiplier) },
      { month: '6月', value: Math.round(3000000 * multiplier) },
    ],
  }
}

const generateCustomerData = (timeRange: TimeRange): CustomerData => {
  const multiplier = timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 6
  return {
    segments: [
      { segment: '高价值客户', segmentKey: 'highValue', count: Math.round(85 * multiplier), percentage: 15, revenue: Math.round(12500000 * multiplier), color: '#22c55e' },
      { segment: '成长型客户', segmentKey: 'growing', count: Math.round(170 * multiplier), percentage: 30, revenue: Math.round(8500000 * multiplier), color: '#3b82f6' },
      { segment: '普通客户', segmentKey: 'regular', count: Math.round(198 * multiplier), percentage: 35, revenue: Math.round(4200000 * multiplier), color: '#eab308' },
      { segment: '待激活客户', segmentKey: 'inactive', count: Math.round(113 * multiplier), percentage: 20, revenue: Math.round(560000 * multiplier), color: '#9ca3af' },
    ],
    industries: [
      { industry: '互联网', count: Math.round(156 * multiplier), percentage: 28, color: '#3b82f6' },
      { industry: '金融', count: Math.round(98 * multiplier), percentage: 18, color: '#22c55e' },
      { industry: '制造业', count: Math.round(85 * multiplier), percentage: 15, color: '#eab308' },
      { industry: '教育', count: Math.round(67 * multiplier), percentage: 12, color: '#8b5cf6' },
      { industry: '医疗', count: Math.round(52 * multiplier), percentage: 9, color: '#ec4899' },
      { industry: '其他', count: Math.round(98 * multiplier), percentage: 18, color: '#6b7280' },
    ],
    trends: [
      { month: '1月', newCustomers: Math.round(45 * multiplier), activeCustomers: Math.round(320 * multiplier), churned: Math.round(8 * multiplier) },
      { month: '2月', newCustomers: Math.round(52 * multiplier), activeCustomers: Math.round(335 * multiplier), churned: Math.round(6 * multiplier) },
      { month: '3月', newCustomers: Math.round(48 * multiplier), activeCustomers: Math.round(348 * multiplier), churned: Math.round(10 * multiplier) },
      { month: '4月', newCustomers: Math.round(61 * multiplier), activeCustomers: Math.round(365 * multiplier), churned: Math.round(7 * multiplier) },
      { month: '5月', newCustomers: Math.round(55 * multiplier), activeCustomers: Math.round(378 * multiplier), churned: Math.round(9 * multiplier) },
      { month: '6月', newCustomers: Math.round(68 * multiplier), activeCustomers: Math.round(402 * multiplier), churned: Math.round(5 * multiplier) },
    ],
    metrics: {
      totalCustomers: Math.round(556 * multiplier),
      newCustomers: Math.round(68 * multiplier),
      activeCustomers: Math.round(402 * multiplier),
      churnRate: 1.2,
    },
  }
}

const generateActivityData = (timeRange: TimeRange): ActivityData => {
  const multiplier = timeRange === 'week' ? 1 : timeRange === 'month' ? 4 : timeRange === 'quarter' ? 12 : 48
  return {
    types: [
      { type: '电话', typeKey: 'call', count: Math.round(1256 * multiplier), icon: 'Phone', color: '#3b82f6' },
      { type: '邮件', typeKey: 'email', count: Math.round(892 * multiplier), icon: 'Mail', color: '#22c55e' },
      { type: '会议', typeKey: 'meeting', count: Math.round(234 * multiplier), icon: 'Video', color: '#8b5cf6' },
      { type: '拜访', typeKey: 'visit', count: Math.round(156 * multiplier), icon: 'Users', color: '#f97316' },
      { type: '消息', typeKey: 'message', count: Math.round(567 * multiplier), icon: 'MessageSquare', color: '#ec4899' },
    ],
    weekly: [
      { day: '周一', calls: 45, emails: 32, meetings: 8, visits: 5 },
      { day: '周二', calls: 52, emails: 28, meetings: 12, visits: 3 },
      { day: '周三', calls: 38, emails: 41, meetings: 6, visits: 8 },
      { day: '周四', calls: 61, emails: 35, meetings: 10, visits: 6 },
      { day: '周五', calls: 48, emails: 29, meetings: 7, visits: 4 },
    ],
    performers: [
      { name: '张三', activities: 156, calls: 78, emails: 52, meetings: 26 },
      { name: '李四', activities: 142, calls: 65, emails: 48, meetings: 29 },
      { name: '王五', activities: 138, calls: 72, emails: 44, meetings: 22 },
      { name: '赵六', activities: 125, calls: 58, emails: 41, meetings: 26 },
      { name: '钱七', activities: 118, calls: 55, emails: 38, meetings: 25 },
    ],
    metrics: {
      totalActivities: Math.round(3105 * multiplier),
      dailyAvg: 62,
      avgResponseTime: 2.5,
      conversionRate: 34.5,
    },
  }
}

const generateLeadConversionData = (timeRange: TimeRange): LeadConversionData => {
  const multiplier = timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 6
  return {
    stages: [
      { stage: '新线索', stageKey: 'new', count: Math.round(450 * multiplier), rate: 100, avgDays: 0 },
      { stage: '已联系', stageKey: 'contacted', count: Math.round(280 * multiplier), rate: 62.2, avgDays: 2.5 },
      { stage: '已验证', stageKey: 'qualified', count: Math.round(156 * multiplier), rate: 34.7, avgDays: 5.8 },
      { stage: '已转化', stageKey: 'converted', count: Math.round(89 * multiplier), rate: 19.8, avgDays: 12.3 },
    ],
    sources: [
      { source: '官网', sourceKey: 'website', leads: Math.round(180 * multiplier), converted: Math.round(45 * multiplier), rate: 25 },
      { source: '营销活动', sourceKey: 'campaign', leads: Math.round(120 * multiplier), converted: Math.round(32 * multiplier), rate: 26.7 },
      { source: '推荐', sourceKey: 'referral', leads: Math.round(85 * multiplier), converted: Math.round(28 * multiplier), rate: 32.9 },
      { source: '社交媒体', sourceKey: 'social', leads: Math.round(65 * multiplier), converted: Math.round(12 * multiplier), rate: 18.5 },
      { source: '其他', sourceKey: 'other', leads: Math.round(100 * multiplier), converted: Math.round(22 * multiplier), rate: 22 },
    ],
    trends: [
      { month: '1月', leads: Math.round(380 * multiplier), converted: Math.round(68 * multiplier), rate: 17.9 },
      { month: '2月', leads: Math.round(420 * multiplier), converted: Math.round(78 * multiplier), rate: 18.6 },
      { month: '3月', leads: Math.round(450 * multiplier), converted: Math.round(85 * multiplier), rate: 18.9 },
      { month: '4月', leads: Math.round(480 * multiplier), converted: Math.round(92 * multiplier), rate: 19.2 },
      { month: '5月', leads: Math.round(520 * multiplier), converted: Math.round(105 * multiplier), rate: 20.2 },
      { month: '6月', leads: Math.round(550 * multiplier), converted: Math.round(115 * multiplier), rate: 20.9 },
    ],
    metrics: {
      totalLeads: Math.round(550 * multiplier),
      convertedLeads: Math.round(89 * multiplier),
      conversionRate: 19.8,
      avgConversionCycle: 12.3,
    },
  }
}

const generatePaymentData = (timeRange: TimeRange): PaymentData => {
  const multiplier = timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 6
  return {
    status: [
      { status: '已回款', statusKey: 'paid', amount: Math.round(8500000 * multiplier), count: Math.round(125 * multiplier), percentage: 68, color: '#22c55e' },
      { status: '部分回款', statusKey: 'partial', amount: Math.round(2200000 * multiplier), count: Math.round(32 * multiplier), percentage: 17.6, color: '#3b82f6' },
      { status: '待回款', statusKey: 'pending', amount: Math.round(1800000 * multiplier), count: Math.round(28 * multiplier), percentage: 14.4, color: '#ef4444' },
    ],
    trends: [
      { month: '1月', plan: Math.round(1200000 * multiplier), actual: Math.round(1150000 * multiplier), rate: 95.8 },
      { month: '2月', plan: Math.round(1300000 * multiplier), actual: Math.round(1280000 * multiplier), rate: 98.5 },
      { month: '3月', plan: Math.round(1400000 * multiplier), actual: Math.round(1320000 * multiplier), rate: 94.3 },
      { month: '4月', plan: Math.round(1500000 * multiplier), actual: Math.round(1480000 * multiplier), rate: 98.7 },
      { month: '5月', plan: Math.round(1600000 * multiplier), actual: Math.round(1550000 * multiplier), rate: 96.9 },
      { month: '6月', plan: Math.round(1800000 * multiplier), actual: Math.round(1720000 * multiplier), rate: 95.6 },
    ],
    overdue: [
      { customer: '客户A', contract: 'HT-2024-001', amount: 150000, overdueDays: 45, status: '严重', statusKey: 'severe' },
      { customer: '客户B', contract: 'HT-2024-015', amount: 80000, overdueDays: 30, status: '中等', statusKey: 'medium' },
      { customer: '客户C', contract: 'HT-2024-022', amount: 52000, overdueDays: 15, status: '轻微', statusKey: 'minor' },
      { customer: '客户D', contract: 'HT-2024-031', amount: 30000, overdueDays: 7, status: '轻微', statusKey: 'minor' },
    ],
    metrics: {
      totalPayment: Math.round(8500000 * multiplier),
      completionRate: 95.6,
      avgCycle: 35,
      overdueAmount: Math.round(150000 * multiplier),
    },
  }
}

// Query hooks
export function useSalesFunnelReport(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['salesFunnelReport', timeRange],
    queryFn: () => generateSalesFunnelData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePerformanceReport(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['performanceReport', timeRange],
    queryFn: () => generatePerformanceData(timeRange),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCustomerReport(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['customerReport', timeRange],
    queryFn: () => generateCustomerData(timeRange),
    staleTime: 5 * 60 * 1000,
  })
}

export function useActivityReport(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['activityReport', timeRange],
    queryFn: () => generateActivityData(timeRange),
    staleTime: 5 * 60 * 1000,
  })
}

export function useLeadConversionReport(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['leadConversionReport', timeRange],
    queryFn: () => generateLeadConversionData(timeRange),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePaymentReport(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['paymentReport', timeRange],
    queryFn: () => generatePaymentData(timeRange),
    staleTime: 5 * 60 * 1000,
  })
}

// Time range state hook
export function useReportTimeRange(initialRange: TimeRange = 'month') {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange)
  return { timeRange, setTimeRange }
}

// Export utilities
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

export function useExportReport() {
  const exportCSV = useCallback((data: Record<string, unknown>[], filename: string) => {
    exportToCSV(data, filename)
  }, [])

  return { exportCSV }
}