/**
 * Report API Hooks
 * TanStack Query hooks for report data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  Report,
  ReportData,
  ReportListParams,
  ReportCategory,
} from '@/types/report'

// ============================================================
// Query Keys
// ============================================================
export const reportKeys = {
  all: ['reports'] as const,
  list: (params?: ReportListParams) => ['reports', 'list', params] as const,
  detail: (id: string) => ['reports', 'detail', id] as const,
  data: (id: string) => ['reports', 'data', id] as const,
}

// ============================================================
// Mock Data (for development)
// ============================================================
const mockReports: Report[] = [
  { id: 'R001', name: '销售业绩月报', description: '月度销售业绩统计分析', category: 'sales', type: 'summary', period: 'monthly', createdAt: '2026-03-01', updatedAt: '2026-04-01', createdBy: '系统管理员', isPublic: true, scheduled: true, schedule: '每月1日' },
  { id: 'R002', name: '客户活跃度分析', description: '客户活跃度趋势分析报告', category: 'customer', type: 'trend', period: 'weekly', createdAt: '2026-03-15', updatedAt: '2026-04-01', createdBy: '李明', isPublic: true },
  { id: 'R003', name: '活动执行统计', description: '团队活动执行情况统计', category: 'activity', type: 'summary', period: 'daily', createdAt: '2026-03-20', updatedAt: '2026-04-02', createdBy: '王芳', isPublic: false },
  { id: 'R004', name: '产品销售排行', description: '产品销售量排行榜', category: 'product', type: 'comparison', period: 'monthly', createdAt: '2026-03-10', updatedAt: '2026-04-01', createdBy: '系统管理员', isPublic: true },
  { id: 'R005', name: '财务收入报表', description: '季度财务收入汇总', category: 'finance', type: 'summary', period: 'quarterly', createdAt: '2026-01-01', updatedAt: '2026-04-01', createdBy: '财务部门', isPublic: false, scheduled: true, schedule: '每季度首日' },
  { id: 'R006', name: '商机转化漏斗', description: '商机转化率分析', category: 'sales', type: 'detail', period: 'monthly', createdAt: '2026-03-05', updatedAt: '2026-04-01', createdBy: '李明', isPublic: true },
  { id: 'R007', name: '客户地域分布', description: '客户地域分布分析', category: 'customer', type: 'summary', period: 'yearly', createdAt: '2026-01-15', updatedAt: '2026-03-15', createdBy: '系统管理员', isPublic: true },
  { id: 'R008', name: '活动类型统计', description: '各类活动数量统计', category: 'activity', type: 'comparison', period: 'monthly', createdAt: '2026-03-25', updatedAt: '2026-04-02', createdBy: '王芳', isPublic: false },
]

// Mock report data
const generateMockReportData = (report: Report): ReportData => {
  const baseData = {
    id: `RD${report.id}`,
    reportId: report.id,
    generatedAt: new Date().toISOString(),
  }

  switch (report.category) {
    case 'sales':
      return {
        ...baseData,
        data: {
          totalRevenue: 1250000,
          targetRevenue: 1500000,
          completionRate: 83.3,
          topPerformers: [
            { name: '李明', revenue: 450000, deals: 15 },
            { name: '王芳', revenue: 380000, deals: 12 },
            { name: '陈静', revenue: 320000, deals: 10 },
          ],
        },
        charts: [
          { id: 'c1', type: 'bar', title: '月度销售额', dataSource: 'monthlySales', xAxis: 'month', yAxis: 'revenue' },
          { id: 'c2', type: 'pie', title: '销售来源分布', dataSource: 'salesSource' },
        ],
      }
    case 'customer':
      return {
        ...baseData,
        data: {
          totalCustomers: 150,
          activeCustomers: 95,
          newCustomers: 25,
          churnRate: 5.2,
          topCustomers: [
            { name: '北京科技有限公司', score: 95, revenue: 120000 },
            { name: '上海贸易集团', score: 88, revenue: 95000 },
            { name: '杭州电商', score: 92, revenue: 110000 },
          ],
        },
        charts: [
          { id: 'c1', type: 'line', title: '客户增长趋势', dataSource: 'customerTrend', xAxis: 'month', yAxis: 'count' },
        ],
      }
    case 'activity':
      return {
        ...baseData,
        data: {
          totalActivities: 120,
          completed: 85,
          planned: 25,
          overdue: 10,
          byType: {
            call: 40,
            meeting: 25,
            email: 30,
            task: 15,
            visit: 10,
          },
        },
        charts: [
          { id: 'c1', type: 'pie', title: '活动类型分布', dataSource: 'activityByType' },
          { id: 'c2', type: 'bar', title: '团队活动量', dataSource: 'activityByAssignee' },
        ],
      }
    case 'product':
      return {
        ...baseData,
        data: {
          totalProducts: 50,
          activeProducts: 42,
          topProducts: [
            { name: 'CRM基础版', sales: 120, revenue: 360000 },
            { name: 'CRM专业版', sales: 45, revenue: 270000 },
            { name: 'CRM企业版', sales: 15, revenue: 150000 },
          ],
        },
        charts: [
          { id: 'c1', type: 'bar', title: '产品销量排行', dataSource: 'productSales', xAxis: 'product', yAxis: 'sales' },
        ],
      }
    case 'finance':
      return {
        ...baseData,
        data: {
          totalRevenue: 1250000,
          totalCost: 750000,
          profit: 500000,
          profitMargin: 40,
          byQuarter: [
            { quarter: 'Q1', revenue: 300000, cost: 180000 },
            { quarter: 'Q2', revenue: 350000, cost: 210000 },
            { quarter: 'Q3', revenue: 320000, cost: 190000 },
            { quarter: 'Q4', revenue: 280000, cost: 170000 },
          ],
        },
        charts: [
          { id: 'c1', type: 'area', title: '季度收入趋势', dataSource: 'quarterlyRevenue', xAxis: 'quarter', yAxis: 'revenue' },
        ],
      }
    default:
      return { ...baseData, data: {} }
  }
}

// ============================================================
// Helper Functions
// ============================================================
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

const paginate = <T>(items: T[], page: number = 1, pageSize: number = 10) => ({
  data: items.slice((page - 1) * pageSize, page * pageSize),
  total: items.length,
  page,
  pageSize,
  totalPages: Math.ceil(items.length / pageSize),
})

// ============================================================
// API Hooks
// ============================================================
export function useReports(params?: ReportListParams) {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: async () => {
      await delay()
      let data = [...mockReports]
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        data = data.filter(r =>
          r.name.toLowerCase().includes(search) ||
          r.description?.toLowerCase().includes(search)
        )
      }
      
      if (params?.category) {
        data = data.filter(r => r.category === params.category)
      }
      
      if (params?.type) {
        data = data.filter(r => r.type === params.type)
      }
      
      return paginate(data, params?.page || 1, params?.pageSize || 10)
    },
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: async () => {
      await delay()
      const report = mockReports.find(r => r.id === id)
      if (!report) throw new Error(`Report ${id} not found`)
      return report
    },
    enabled: !!id,
  })
}

export function useReportData(id: string) {
  return useQuery({
    queryKey: reportKeys.data(id),
    queryFn: async () => {
      await delay()
      const report = mockReports.find(r => r.id === id)
      if (!report) throw new Error(`Report ${id} not found`)
      return generateMockReportData(report)
    },
    enabled: !!id,
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay()
      const newReport: Report = {
        ...data,
        id: `R${String(mockReports.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      mockReports.push(newReport)
      return newReport
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await delay()
      const index = mockReports.findIndex(r => r.id === id)
      if (index !== -1) mockReports.splice(index, 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

// API object
export const reportApi = {
  list: useReports,
  detail: useReport,
  data: useReportData,
  create: useCreateReport,
  delete: useDeleteReport,
}