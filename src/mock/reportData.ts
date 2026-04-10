/**
 * Report 报表模块 Mock 数据
 * Report & Analytics Mock Data
 */

import type {
  Report,
  ReportCategory,
  ReportType,
  ReportPeriod,
  ReportData,
  ReportListParams,
  ChartConfig,
  TableConfig,
} from '@/types/report'

// ============================================
// 报表类型常量
// ============================================
export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  sales: '销售报表',
  customer: '客户报表',
  activity: '行为报表',
  product: '产品报表',
  finance: '财务报表',
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  summary: '汇总报表',
  detail: '明细报表',
  trend: '趋势报表',
  comparison: '对比报表',
}

export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  daily: '日报',
  weekly: '周报',
  monthly: '月报',
  quarterly: '季报',
  yearly: '年报',
  custom: '自定义',
}

// ============================================
// Mock 报表定义数据（20条）
// ============================================
export const mockReports: Report[] = [
  // 销售报表
  {
    id: 'rpt-001',
    name: '销售业绩汇总',
    description: '按月汇总各销售人员销售额、订单数、完成率',
    category: 'sales',
    type: 'summary',
    period: 'monthly',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
    createdBy: '张明',
    isPublic: true,
    scheduled: true,
    schedule: '0 8 1 * *', // 每月1日8点
  },
  {
    id: 'rpt-002',
    name: '销售漏斗分析',
    description: '分析各阶段商机转化率，识别销售瓶颈',
    category: 'sales',
    type: 'trend',
    period: 'monthly',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-20T14:00:00Z',
    createdBy: '李华',
    isPublic: true,
    scheduled: false,
  },
  {
    id: 'rpt-003',
    name: '销售目标完成率',
    description: '各团队/个人销售目标完成情况排名',
    category: 'sales',
    type: 'comparison',
    period: 'quarterly',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
    createdBy: '王芳',
    isPublic: true,
    scheduled: true,
    schedule: '0 9 * * 1', // 每周一9点
  },
  {
    id: 'rpt-004',
    name: '新签合同明细',
    description: '本月新签合同详细清单，含金额、客户、负责人',
    category: 'sales',
    type: 'detail',
    period: 'monthly',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-06-28T16:00:00Z',
    createdBy: '张明',
    isPublic: true,
    scheduled: true,
    schedule: '0 8 1 * *',
  },

  // 客户报表
  {
    id: 'rpt-005',
    name: '客户全景分析',
    description: '客户基础信息、交易历史、互动记录综合视图',
    category: 'customer',
    type: 'summary',
    period: 'monthly',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
    createdBy: '李华',
    isPublic: true,
    scheduled: false,
  },
  {
    id: 'rpt-006',
    name: '客户流失预警',
    description: '识别沉默客户和流失风险客户',
    category: 'customer',
    type: 'detail',
    period: 'weekly',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-25T10:00:00Z',
    createdBy: '王芳',
    isPublic: true,
    scheduled: true,
    schedule: '0 9 * * 5', // 每周五9点
  },
  {
    id: 'rpt-007',
    name: '客户行业分布',
    description: '客户行业构成分析，支持业务策略调整',
    category: 'customer',
    type: 'summary',
    period: 'quarterly',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-04-15T14:00:00Z',
    createdBy: '刘强',
    isPublic: true,
    scheduled: false,
  },
  {
    id: 'rpt-008',
    name: '客户价值分层',
    description: '基于消费金额和活跃度的客户价值分层模型',
    category: 'customer',
    type: 'comparison',
    period: 'monthly',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
    createdBy: '赵敏',
    isPublic: true,
    scheduled: false,
  },

  // 行为报表
  {
    id: 'rpt-009',
    name: '销售活动统计',
    description: '各销售人员的通话、会议、拜访等activities统计',
    category: 'activity',
    type: 'summary',
    period: 'weekly',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-06-24T09:00:00Z',
    createdBy: '张明',
    isPublic: true,
    scheduled: true,
    schedule: '0 9 * * 1',
  },
  {
    id: 'rpt-010',
    name: '跟进及时率',
    description: '新线索分配后首次跟进时间统计',
    category: 'activity',
    type: 'comparison',
    period: 'monthly',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-06-15T15:00:00Z',
    createdBy: '李娜',
    isPublic: true,
    scheduled: false,
  },
  {
    id: 'rpt-011',
    name: '商机跟进轨迹',
    description: '商机从创建到成交的完整跟进时间线',
    category: 'activity',
    type: 'detail',
    period: 'custom',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-06-18T11:00:00Z',
    createdBy: '周杰',
    isPublic: false,
    scheduled: false,
  },

  // 产品报表
  {
    id: 'rpt-012',
    name: '产品销售排行',
    description: '各产品销售额/数量排名分析',
    category: 'product',
    type: 'summary',
    period: 'monthly',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-06-20T10:00:00Z',
    createdBy: '张明',
    isPublic: true,
    scheduled: true,
    schedule: '0 8 1 * *',
  },
  {
    id: 'rpt-013',
    name: '产品类别分析',
    description: '各产品类别的销售贡献占比分析',
    category: 'product',
    type: 'comparison',
    period: 'quarterly',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-04-20T14:00:00Z',
    createdBy: '吴涛',
    isPublic: true,
    scheduled: false,
  },
  {
    id: 'rpt-014',
    name: '产品折扣分析',
    description: '各产品/客户的折扣使用情况分析',
    category: 'product',
    type: 'detail',
    period: 'monthly',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-06-10T16:00:00Z',
    createdBy: '刘芳',
    isPublic: true,
    scheduled: false,
  },

  // 财务报表
  {
    id: 'rpt-015',
    name: '应收账款明细',
    description: '各客户应收账款账龄分析',
    category: 'finance',
    type: 'detail',
    period: 'weekly',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-06-26T10:00:00Z',
    createdBy: '张明',
    isPublic: false,
    scheduled: true,
    schedule: '0 9 * * 1',
  },
  {
    id: 'rpt-016',
    name: '回款统计',
    description: '月度/季度回款金额统计与分析',
    category: 'finance',
    type: 'summary',
    period: 'monthly',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-28T11:00:00Z',
    createdBy: '王芳',
    isPublic: true,
    scheduled: true,
    schedule: '0 8 1 * *',
  },
  {
    id: 'rpt-017',
    name: '收入趋势分析',
    description: '按月/季度/年度的收入变化趋势',
    category: 'finance',
    type: 'trend',
    period: 'yearly',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-06-15T09:00:00Z',
    createdBy: '刘强',
    isPublic: true,
    scheduled: false,
  },
  {
    id: 'rpt-018',
    name: '毛利率分析',
    description: '各产品/客户的毛利率分析',
    category: 'finance',
    type: 'comparison',
    period: 'quarterly',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z',
    createdBy: '赵敏',
    isPublic: false,
    scheduled: false,
  },

  // 综合报表
  {
    id: 'rpt-019',
    name: '销售月报综合',
    description: '整合销售、客户、产品、财务的月度综合分析报告',
    category: 'sales',
    type: 'summary',
    period: 'monthly',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
    createdBy: '张明',
    isPublic: true,
    scheduled: true,
    schedule: '0 9 1 * *',
  },
  {
    id: 'rpt-020',
    name: '团队绩效看板',
    description: '实时更新的销售团队核心指标看板',
    category: 'sales',
    type: 'summary',
    period: 'daily',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-06-28T08:00:00Z',
    createdBy: '李华',
    isPublic: true,
    scheduled: false,
  },
]

// ============================================
// Mock 报表数据（预生成的报表结果）
// ============================================
export const mockReportData: ReportData[] = [
  {
    id: 'rptdata-001',
    reportId: 'rpt-001',
    generatedAt: '2024-06-01T08:05:00Z',
    data: {
      totalSales: 12800000,
      orderCount: 156,
      completionRate: 92.5,
      avgDealSize: 82051,
      bySalesperson: [
        { name: '张明', sales: 2800000, orders: 32, completion: 98 },
        { name: '李华', sales: 2400000, orders: 28, completion: 95 },
        { name: '王芳', sales: 2100000, orders: 25, completion: 88 },
        { name: '赵敏', sales: 1900000, orders: 22, completion: 91 },
        { name: '刘强', sales: 1800000, orders: 21, completion: 90 },
        { name: '其他', sales: 1800000, orders: 28, completion: 89 },
      ],
    },
    charts: [
      {
        id: 'chart-001',
        type: 'bar',
        title: '各销售业绩对比',
        dataSource: 'bySalesperson',
        xAxis: 'name',
        yAxis: 'sales',
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'],
      },
    ],
    tables: [
      {
        id: 'table-001',
        title: '销售业绩明细',
        columns: [
          { key: 'name', label: '销售人员', width: 120 },
          { key: 'sales', label: '销售额', width: 120 },
          { key: 'orders', label: '订单数', width: 100 },
          { key: 'completion', label: '完成率', width: 100 },
        ],
        dataSource: 'bySalesperson',
      },
    ],
  },
  {
    id: 'rptdata-002',
    reportId: 'rpt-002',
    generatedAt: '2024-06-20T14:10:00Z',
    data: {
      funnel: [
        { stage: '线索', count: 1250, amount: null, conversion: 100 },
        { stage: '商机', count: 420, amount: 28000000, conversion: 33.6 },
        { stage: '方案', count: 180, amount: 18000000, conversion: 42.9 },
        { stage: '报价', count: 120, amount: 12000000, conversion: 66.7 },
        { stage: '签约', count: 85, amount: 8500000, conversion: 70.8 },
      ],
      avgCycleDays: 45,
      winRate: 20.2,
    },
    charts: [
      {
        id: 'chart-002',
        type: 'funnel',
        title: '销售漏斗',
        dataSource: 'funnel',
        xAxis: 'stage',
        yAxis: 'count',
      },
      {
        id: 'chart-003',
        type: 'line',
        title: '转化率趋势',
        dataSource: 'funnel',
        xAxis: 'stage',
        yAxis: 'conversion',
      },
    ],
  },
  {
    id: 'rptdata-003',
    reportId: 'rpt-009',
    generatedAt: '2024-06-24T09:05:00Z',
    data: {
      totalActivities: 456,
      byType: [
        { type: '通话', count: 185, avgDuration: 18 },
        { type: '会议', count: 78, avgDuration: 62 },
        { type: '拜访', count: 45, avgDuration: 240 },
        { type: '邮件', count: 120, avgDuration: 5 },
        { type: '任务', count: 28, avgDuration: null },
      ],
      bySalesperson: [
        { name: '张明', activities: 78, calls: 32, meetings: 15, visits: 8 },
        { name: '李华', activities: 72, calls: 28, meetings: 14, visits: 6 },
        { name: '王芳', activities: 68, calls: 25, meetings: 12, visits: 10 },
        { name: '赵敏', activities: 65, calls: 30, meetings: 10, visits: 5 },
        { name: '刘强', activities: 58, calls: 22, meetings: 9, visits: 6 },
        { name: '其他', activities: 115, calls: 48, meetings: 18, visits: 10 },
      ],
    },
    charts: [
      {
        id: 'chart-004',
        type: 'pie',
        title: '活动类型分布',
        dataSource: 'byType',
        xAxis: 'type',
        yAxis: 'count',
      },
      {
        id: 'chart-005',
        type: 'bar',
        title: '各销售活动数量',
        dataSource: 'bySalesperson',
        xAxis: 'name',
        yAxis: 'activities',
      },
    ],
  },
  {
    id: 'rptdata-004',
    reportId: 'rpt-012',
    generatedAt: '2024-06-20T10:05:00Z',
    data: {
      totalRevenue: 12800000,
      products: [
        { name: 'CRM企业版', sales: 5200000, quantity: 42, revenue: 5200000 },
        { name: 'CRM专业版', sales: 3800000, quantity: 68, revenue: 3800000 },
        { name: 'CRM标准版', sales: 2400000, quantity: 120, revenue: 2400000 },
        { name: '营销模块', sales: 960000, quantity: 28, revenue: 960000 },
        { name: '服务模块', sales: 440000, quantity: 22, revenue: 440000 },
        { name: '其他', sales: 0, quantity: 0, revenue: 0 },
      ],
    },
    charts: [
      {
        id: 'chart-006',
        type: 'bar',
        title: '产品销售排行',
        dataSource: 'products',
        xAxis: 'name',
        yAxis: 'sales',
      },
      {
        id: 'chart-007',
        type: 'pie',
        title: '产品收入占比',
        dataSource: 'products',
        xAxis: 'name',
        yAxis: 'revenue',
      },
    ],
  },
  {
    id: 'rptdata-005',
    reportId: 'rpt-016',
    generatedAt: '2024-06-28T11:05:00Z',
    data: {
      totalReceived: 11500000,
      totalPending: 3800000,
      byCustomer: [
        { name: '北京华联', received: 2800000, pending: 1200000 },
        { name: '上海商贸', received: 1800000, pending: 600000 },
        { name: '广州贸易', received: 2200000, pending: 800000 },
        { name: '深圳科技', received: 1900000, pending: 400000 },
        { name: '其他', received: 2800000, pending: 800000 },
      ],
      overdue: 520000,
      overdueDays: 15,
    },
    charts: [
      {
        id: 'chart-008',
        type: 'bar',
        title: '客户回款情况',
        dataSource: 'byCustomer',
        xAxis: 'name',
        yAxis: 'received',
      },
    ],
    tables: [
      {
        id: 'table-002',
        title: '回款明细',
        columns: [
          { key: 'name', label: '客户', width: 150 },
          { key: 'received', label: '已回款', width: 120 },
          { key: 'pending', label: '待回款', width: 120 },
        ],
        dataSource: 'byCustomer',
      },
    ],
  },
]

// ============================================
// 预设报表模板
// ============================================
export interface ReportTemplate {
  id: string
  name: string
  description: string
  category: ReportCategory
  recommendedPeriod: ReportPeriod
  widgets: {
    type: 'chart' | 'table' | 'kpi' | 'funnel'
    title: string
    chartType?: ChartConfig['type']
    dataSource?: string
  }[]
}

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'tpl-001',
    name: '销售经理驾驶舱',
    description: '面向销售管理者的核心指标看板',
    category: 'sales',
    recommendedPeriod: 'daily',
    widgets: [
      { type: 'kpi', title: '本月销售额' },
      { type: 'kpi', title: '目标完成率' },
      { type: 'kpi', title: '新签合同数' },
      { type: 'kpi', title: '在跟商机数' },
      { type: 'chart', title: '销售趋势', chartType: 'line' },
      { type: 'chart', title: '产品占比', chartType: 'pie' },
      { type: 'table', title: 'TOP排行' },
    ],
  },
  {
    id: 'tpl-002',
    name: '客户分析仪表盘',
    description: '客户全维度分析报表',
    category: 'customer',
    recommendedPeriod: 'monthly',
    widgets: [
      { type: 'kpi', title: '客户总数' },
      { type: 'kpi', title: '本月新增' },
      { type: 'kpi', title: '流失客户' },
      { type: 'chart', title: '行业分布', chartType: 'pie' },
      { type: 'chart', title: '客户趋势', chartType: 'line' },
      { type: 'table', title: '重点客户' },
    ],
  },
  {
    id: 'tpl-003',
    name: '营销效果分析',
    description: '市场活动ROI分析报表',
    category: 'activity',
    recommendedPeriod: 'monthly',
    widgets: [
      { type: 'kpi', title: '活动总数' },
      { type: 'kpi', title: '线索转化数' },
      { type: 'kpi', title: '平均获客成本' },
      { type: 'chart', title: '渠道效果对比', chartType: 'bar' },
      { type: 'chart', title: '转化漏斗', chartType: 'funnel' },
    ],
  },
  {
    id: 'tpl-004',
    name: '财务概览',
    description: '收入与回款核心财务指标',
    category: 'finance',
    recommendedPeriod: 'monthly',
    widgets: [
      { type: 'kpi', title: '本月收入' },
      { type: 'kpi', title: '本月回款' },
      { type: 'kpi', title: '应收账款' },
      { type: 'kpi', title: '逾期账款' },
      { type: 'chart', title: '收入趋势', chartType: 'line' },
      { type: 'chart', title: '回款占比', chartType: 'bar' },
    ],
  },
]

// ============================================
// 辅助函数
// ============================================

/** 获取所有报表 */
export function getReportList(): Report[] {
  return [...mockReports].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

/** 根据ID获取报表 */
export function getReportById(id: string): Report | undefined {
  return mockReports.find((r) => r.id === id)
}

/** 根据筛选条件获取报表 */
export function getReportByFilter(filter: ReportListParams): Report[] {
  let result = [...mockReports]

  if (filter.search) {
    const search = filter.search.toLowerCase()
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(search) ||
        r.description?.toLowerCase().includes(search)
    )
  }

  if (filter.category) {
    result = result.filter((r) => r.category === filter.category)
  }

  if (filter.type) {
    result = result.filter((r) => r.type === filter.type)
  }

  // 分页
  const page = filter.page ?? 1
  const pageSize = filter.pageSize ?? 20
  const start = (page - 1) * pageSize

  return result.slice(start, start + pageSize)
}

/** 获取报表数据 */
export function getReportDataById(reportId: string): ReportData | undefined {
  return mockReportData.find((rd) => rd.reportId === reportId)
}

/** 根据分类获取报表 */
export function getReportsByCategory(category: ReportCategory): Report[] {
  return mockReports.filter((r) => r.category === category)
}

/** 获取预设模板 */
export function getReportTemplates(): ReportTemplate[] {
  return mockReportTemplates
}

/** 根据ID获取模板 */
export function getTemplateById(id: string): ReportTemplate | undefined {
  return mockReportTemplates.find((t) => t.id === id)
}

/** 按模板生成新报表 */
export function createReportFromTemplate(
  template: ReportTemplate,
  name: string,
  createdBy: string
): Report {
  const now = new Date().toISOString()
  return {
    id: `rpt-${Date.now()}`,
    name,
    description: template.description,
    category: template.category,
    type: 'summary',
    period: template.recommendedPeriod,
    createdAt: now,
    updatedAt: now,
    createdBy,
    isPublic: false,
    scheduled: false,
  }
}
