/**
 * Dashboard Mock Data
 * 预设 Dashboard 模板数据和各 Dashlet 的 Mock 数据
 */

import { DashletType, DashboardTemplate, DashboardLayout } from '@/types/dashboard'

// ============================================================
// Dashlet Types Definition
// ============================================================

export const DASHLET_CATEGORIES = {
  SALES: { key: 'sales', label: '销售', icon: 'TrendingUp' },
  CUSTOMER: { key: 'customer', label: '客户', icon: 'Users' },
  SERVICE: { key: 'service', label: '服务', icon: 'Headphones' },
  MARKETING: { key: 'marketing', label: '营销', icon: 'Megaphone' },
  ACTIVITY: { key: 'activity', label: '活动', icon: 'Activity' },
  FINANCE: { key: 'finance', label: '财务', icon: 'DollarSign' },
  AI: { key: 'ai', label: 'AI 智能', icon: 'Brain' },
  GENERAL: { key: 'general', label: '通用', icon: 'Layout' },
} as const

export const ALL_DASHLETS: Array<{
  type: DashletType
  label: string
  category: string
  icon: string
  defaultSize: { w: number; h: number }
  description: string
}> = [
  // 销售类
  { type: 'revenue-trend', label: '营收趋势', category: 'sales', icon: 'TrendingUp', defaultSize: { w: 4, h: 2 }, description: '月度营收与目标对比' },
  { type: 'sales-funnel', label: '销售漏斗', category: 'sales', icon: 'Filter', defaultSize: { w: 3, h: 2 }, description: '各阶段商机转化' },
  { type: 'sales-ranking', label: '销售排行', category: 'sales', icon: 'Award', defaultSize: { w: 3, h: 2 }, description: '团队业绩排名' },
  { type: 'sales-by-source', label: '销售来源', category: 'sales', icon: 'PieChart', defaultSize: { w: 2, h: 2 }, description: '各渠道销售占比' },
  { type: 'sales-forecast', label: '销售预测', category: 'sales', icon: 'Zap', defaultSize: { w: 4, h: 2 }, description: 'AI 销售预测' },
  { type: 'deal-status', label: '商机状态', category: 'sales', icon: 'Target', defaultSize: { w: 3, h: 1 }, description: '当前商机分布' },

  // 客户类
  { type: 'customer-growth', label: '客户增长', category: 'customer', icon: 'Users', defaultSize: { w: 4, h: 2 }, description: '客户数量变化趋势' },
  { type: 'customer-segment', label: '客户分层', category: 'customer', icon: 'Layers', defaultSize: { w: 2, h: 2 }, description: '客户价值分层' },
  { type: 'customer-industry', label: '行业分布', category: 'customer', icon: 'Building', defaultSize: { w: 2, h: 2 }, description: '客户行业分布' },
  { type: 'churn-warning', label: '流失预警', category: 'customer', icon: 'AlertTriangle', defaultSize: { w: 3, h: 2 }, description: '高流失风险客户' },

  // 服务类
  { type: 'ticket-stats', label: '工单统计', category: 'service', icon: 'Ticket', defaultSize: { w: 3, h: 1 }, description: '服务工单概览' },
  { type: 'csat-score', label: '客户满意度', category: 'service', icon: 'Star', defaultSize: { w: 2, h: 1 }, description: 'CSAT 评分' },
  { type: 'response-time', label: '响应时间', category: 'service', icon: 'Clock', defaultSize: { w: 2, h: 1 }, description: '平均响应时长' },
  { type: 'ticket-trend', label: '工单趋势', category: 'service', icon: 'TrendingUp', defaultSize: { w: 4, h: 2 }, description: '工单数量趋势' },

  // 营销类
  { type: 'campaign-effectiveness', label: '活动效果', category: 'marketing', icon: 'Megaphone', defaultSize: { w: 4, h: 2 }, description: '营销活动 ROI' },
  { type: 'lead-stats', label: '线索统计', category: 'marketing', icon: 'UserPlus', defaultSize: { w: 3, h: 1 }, description: '线索获取情况' },
  { type: 'lead-conversion', label: '线索转化', category: 'marketing', icon: 'Filter', defaultSize: { w: 3, h: 2 }, description: '转化漏斗分析' },
  { type: 'roi-analysis', label: 'ROI 分析', category: 'marketing', icon: 'DollarSign', defaultSize: { w: 2, h: 2 }, description: '营销投资回报' },

  // 活动类
  { type: 'activity-stats', label: '活动统计', category: 'activity', icon: 'Activity', defaultSize: { w: 3, h: 1 }, description: '活动完成情况' },
  { type: 'activity-by-type', label: '活动类型', category: 'activity', icon: 'PieChart', defaultSize: { w: 2, h: 2 }, description: '各类型活动占比' },
  { type: 'activity-weekly', label: '每周活动', category: 'activity', icon: 'Calendar', defaultSize: { w: 4, h: 2 }, description: '每周活动分布' },

  // 财务类
  { type: 'payment-status', label: '回款状态', category: 'finance', icon: 'CreditCard', defaultSize: { w: 3, h: 1 }, description: '回款进度' },
  { type: 'revenue-breakdown', label: '营收构成', category: 'finance', icon: 'PieChart', defaultSize: { w: 2, h: 2 }, description: '营收产品构成' },
  { type: 'overdue-payment', label: '逾期账款', category: 'finance', icon: 'AlertCircle', defaultSize: { w: 3, h: 2 }, description: '逾期未付账款' },

  // AI 类
  { type: 'ai-insights', label: 'AI 洞察', category: 'ai', icon: 'Brain', defaultSize: { w: 4, h: 2 }, description: '智能分析洞察' },
  { type: 'ai-next-actions', label: '智能推荐', category: 'ai', icon: 'Zap', defaultSize: { w: 3, h: 2 }, description: '下一步最佳行动' },
  { type: 'churn-risk', label: '流失风险', category: 'ai', icon: 'AlertTriangle', defaultSize: { w: 2, h: 2 }, description: '流失风险评分' },

  // 通用类
  { type: 'kpi-summary', label: 'KPI 摘要', category: 'general', icon: 'BarChart2', defaultSize: { w: 6, h: 1 }, description: '核心指标一览' },
  { type: 'recent-activities', label: '最近活动', category: 'general', icon: 'Clock', defaultSize: { w: 3, h: 2 }, description: '最新业务动态' },
  { type: 'upcoming-tasks', label: '待办任务', category: 'general', icon: 'CheckSquare', defaultSize: { w: 3, h: 2 }, description: '即将到期的任务' },
  { type: 'quick-actions', label: '快捷操作', category: 'general', icon: 'Zap', defaultSize: { w: 2, h: 2 }, description: '常用操作入口' },
]

// ============================================================
// Mock Data for each Dashlet Type
// ============================================================

export const mockDashletData: Record<DashletType, unknown> = {
  // 营收趋势
  'revenue-trend': {
    data: [
      { month: '1月', revenue: 85000, target: 90000, deals: 12 },
      { month: '2月', revenue: 92000, target: 90000, deals: 15 },
      { month: '3月', revenue: 108000, target: 100000, deals: 18 },
      { month: '4月', revenue: 125000, target: 120000, deals: 22 },
      { month: '5月', revenue: 142000, target: 140000, deals: 25 },
      { month: '6月', revenue: 158000, target: 160000, deals: 28 },
    ],
    summary: { totalRevenue: 720000, targetCompletion: 83.5, growthRate: 12.5 },
  },

  // 销售漏斗
  'sales-funnel': {
    stages: [
      { stage: '线索', count: 500, value: 2500000, color: '#3b82f6' },
      { stage: '商机', count: 225, value: 1125000, color: '#6366f1' },
      { stage: '方案', count: 100, value: 500000, color: '#8b5cf6' },
      { stage: '谈判', count: 40, value: 200000, color: '#a855f7' },
      { stage: '成交', count: 18, value: 87500, color: '#22c55e' },
    ],
    metrics: { conversionRate: 3.6, avgDealCycle: 28, forecastAmount: 87500 },
  },

  // 销售排行
  'sales-ranking': {
    performers: [
      { name: '李明', revenue: 450000, deals: 15, activities: 48, trend: 12.5 },
      { name: '王芳', revenue: 380000, deals: 12, activities: 42, trend: 8.3 },
      { name: '陈静', revenue: 320000, deals: 10, activities: 35, trend: -2.1 },
      { name: '张伟', revenue: 280000, deals: 8, activities: 30, trend: 5.7 },
      { name: '赵敏', revenue: 220000, deals: 6, activities: 25, trend: -5.2 },
    ],
  },

  // 销售来源
  'sales-by-source': {
    sources: [
      { name: '电话销售', value: 35, color: '#3b82f6' },
      { name: '网站转化', value: 25, color: '#10b981' },
      { name: '客户推荐', value: 20, color: '#f59e0b' },
      { name: '渠道合作', value: 15, color: '#8b5cf6' },
      { name: '其他', value: 5, color: '#6b7280' },
    ],
  },

  // 销售预测
  'sales-forecast': {
    current: { revenue: 158000, deals: 28 },
    predicted: { revenue: 185000, deals: 32 },
    confidence: 87,
    factors: [
      { factor: '季节性调整', impact: '+5%' },
      { factor: '团队扩张', impact: '+8%' },
      { factor: '市场竞争', impact: '-3%' },
    ],
    trend: [
      { month: '4月', actual: 125000, predicted: 125000 },
      { month: '5月', actual: 142000, predicted: 140000 },
      { month: '6月', actual: 158000, predicted: 155000 },
      { month: '7月(预测)', actual: null, predicted: 175000 },
      { month: '8月(预测)', actual: null, predicted: 185000 },
      { month: '9月(预测)', actual: null, predicted: 192000 },
    ],
  },

  // 商机状态
  'deal-status': {
    stages: [
      { stage: '初期接触', count: 45, value: 900000, color: '#3b82f6' },
      { stage: '需求确认', count: 32, value: 640000, color: '#6366f1' },
      { stage: '方案提供', count: 18, value: 360000, color: '#8b5cf6' },
      { stage: '商务谈判', count: 8, value: 160000, color: '#a855f7' },
      { stage: '即将成交', count: 3, value: 60000, color: '#22c55e' },
    ],
  },

  // 客户增长
  'customer-growth': {
    trends: [
      { month: '1月', new: 8, active: 85, churn: 2 },
      { month: '2月', new: 12, active: 90, churn: 3 },
      { month: '3月', new: 15, active: 98, churn: 2 },
      { month: '4月', new: 18, active: 105, churn: 4 },
      { month: '5月', new: 20, active: 115, churn: 3 },
      { month: '6月', new: 25, active: 125, churn: 2 },
    ],
  },

  // 客户分层
  'customer-segment': {
    segments: [
      { segment: '高价值', count: 85, percentage: 15, revenue: 12500000, color: '#22c55e' },
      { segment: '成长型', count: 170, percentage: 30, revenue: 8500000, color: '#3b82f6' },
      { segment: '普通', count: 198, percentage: 35, revenue: 4200000, color: '#eab308' },
      { segment: '待激活', count: 113, percentage: 20, revenue: 560000, color: '#9ca3af' },
    ],
  },

  // 行业分布
  'customer-industry': {
    industries: [
      { industry: '互联网', count: 156, percentage: 28, color: '#3b82f6' },
      { industry: '金融', count: 98, percentage: 18, color: '#22c55e' },
      { industry: '制造业', count: 85, percentage: 15, color: '#eab308' },
      { industry: '教育', count: 67, percentage: 12, color: '#8b5cf6' },
      { industry: '医疗', count: 52, percentage: 9, color: '#ec4899' },
      { industry: '其他', count: 98, percentage: 18, color: '#6b7280' },
    ],
  },

  // 流失预警
  'churn-warning': {
    customers: [
      { id: 'cust-001', name: '北京科技有限公司', riskScore: 85, lastActivity: '2026-03-01', trend: 'down' },
      { id: 'cust-002', name: '上海贸易集团', riskScore: 72, lastActivity: '2026-03-05', trend: 'down' },
      { id: 'cust-003', name: '广州制造有限公司', riskScore: 68, lastActivity: '2026-03-08', trend: 'stable' },
      { id: 'cust-004', name: '深圳互联网公司', riskScore: 65, lastActivity: '2026-03-10', trend: 'down' },
      { id: 'cust-005', name: '杭州电商公司', riskScore: 58, lastActivity: '2026-03-12', trend: 'stable' },
    ],
    summary: { highRisk: 12, mediumRisk: 28, lowRisk: 65 },
  },

  // 工单统计
  'ticket-stats': {
    total: 156,
    open: 32,
    pending: 18,
    resolved: 106,
    today: 12,
    s今日解决: 8,
    avgResolutionTime: 4.5,
  },

  // 客户满意度
  'csat-score': {
    score: 4.6,
    totalResponses: 1285,
    distribution: [
      { rating: 5, count: 782, percentage: 60.9 },
      { rating: 4, count: 385, percentage: 30.0 },
      { rating: 3, count: 78, percentage: 6.1 },
      { rating: 2, count: 25, percentage: 1.9 },
      { rating: 1, count: 15, percentage: 1.2 },
    ],
    trend: [
      { month: '1月', score: 4.4 },
      { month: '2月', score: 4.5 },
      { month: '3月', score: 4.5 },
      { month: '4月', score: 4.6 },
    ],
  },

  // 响应时间
  'response-time': {
    avgFirstResponse: 2.5,
    avgResolution: 4.5,
    withinSla: 92,
    benchmark: 4.0,
    trend: [
      { month: '1月', firstResponse: 3.2, resolution: 5.2 },
      { month: '2月', firstResponse: 2.8, resolution: 4.8 },
      { month: '3月', firstResponse: 2.6, resolution: 4.6 },
      { month: '4月', firstResponse: 2.5, resolution: 4.5 },
    ],
  },

  // 工单趋势
  'ticket-trend': {
    weekly: [
      { week: '第1周', created: 45, resolved: 42 },
      { week: '第2周', created: 38, resolved: 40 },
      { week: '第3周', created: 52, resolved: 48 },
      { week: '第4周', created: 35, resolved: 38 },
    ],
  },

  // 活动效果
  'campaign-effectiveness': {
    campaigns: [
      { name: '春季促销', leads: 1250, converted: 85, roi: 3.2, cost: 25000 },
      { name: '产品发布会', leads: 680, converted: 52, roi: 4.5, cost: 50000 },
      { name: '老客回馈', leads: 420, converted: 68, roi: 5.8, cost: 15000 },
      { name: '新客获取', leads: 890, converted: 45, roi: 2.1, cost: 35000 },
    ],
    summary: { totalLeads: 3240, totalConverted: 250, avgRoi: 3.65 },
  },

  // 线索统计
  'lead-stats': {
    total: 550,
    new: 68,
    qualified: 156,
    converted: 89,
    avgScore: 72,
    trend: [
      { month: '1月', leads: 380, converted: 68 },
      { month: '2月', leads: 420, converted: 78 },
      { month: '3月', leads: 450, converted: 85 },
      { month: '4月', leads: 480, converted: 92 },
      { month: '5月', leads: 520, converted: 105 },
      { month: '6月', leads: 550, converted: 115 },
    ],
  },

  // 线索转化
  'lead-conversion': {
    stages: [
      { stage: '新线索', count: 550, rate: 100 },
      { stage: '已联系', count: 342, rate: 62.2 },
      { stage: '已验证', count: 191, rate: 34.7 },
      { stage: '已转化', count: 109, rate: 19.8 },
    ],
  },

  // ROI 分析
  'roi-analysis': {
    channels: [
      { channel: '邮件营销', spend: 50000, revenue: 180000, roi: 260 },
      { channel: '内容营销', spend: 30000, revenue: 95000, roi: 217 },
      { channel: '展会活动', spend: 80000, revenue: 200000, roi: 150 },
      { channel: '付费推广', spend: 60000, revenue: 120000, roi: 100 },
      { channel: '社交媒体', spend: 20000, revenue: 35000, roi: 75 },
    ],
    summary: { totalSpend: 240000, totalRevenue: 630000, avgRoi: 163 },
  },

  // 活动统计
  'activity-stats': {
    total: 120,
    completed: 85,
    planned: 25,
    overdue: 10,
    completionRate: 85,
  },

  // 活动类型
  'activity-by-type': {
    types: [
      { type: '电话', count: 40, color: '#3b82f6' },
      { type: '会议', count: 25, color: '#8b5cf6' },
      { type: '邮件', count: 30, color: '#10b981' },
      { type: '任务', count: 15, color: '#f59e0b' },
      { type: '拜访', count: 10, color: '#ef4444' },
    ],
  },

  // 每周活动
  'activity-weekly': {
    days: [
      { day: '周一', calls: 45, emails: 32, meetings: 8, visits: 5 },
      { day: '周二', calls: 52, emails: 28, meetings: 12, visits: 3 },
      { day: '周三', calls: 38, emails: 41, meetings: 6, visits: 8 },
      { day: '周四', calls: 61, emails: 35, meetings: 10, visits: 6 },
      { day: '周五', calls: 48, emails: 29, meetings: 7, visits: 4 },
    ],
  },

  // 回款状态
  'payment-status': {
    total: 12500000,
    paid: 8500000,
    partial: 2200000,
    pending: 1800000,
    completionRate: 85.6,
  },

  // 营收构成
  'revenue-breakdown': [
    { product: 'CRM 软件', revenue: 6500000, percentage: 52, color: '#3b82f6' },
    { product: '实施服务', revenue: 2800000, percentage: 22, color: '#10b981' },
    { product: '培训服务', revenue: 1500000, percentage: 12, color: '#f59e0b' },
    { product: '硬件设备', revenue: 1200000, percentage: 10, color: '#8b5cf6' },
    { product: '维护服务', revenue: 500000, percentage: 4, color: '#6b7280' },
  ],

  // 逾期账款
  'overdue-payment': {
    items: [
      { customer: '客户A', contract: 'HT-2024-001', amount: 150000, overdueDays: 45, status: '严重' },
      { customer: '客户B', contract: 'HT-2024-015', amount: 80000, overdueDays: 30, status: '中等' },
      { customer: '客户C', contract: 'HT-2024-022', amount: 52000, overdueDays: 15, status: '轻微' },
      { customer: '客户D', contract: 'HT-2024-031', amount: 30000, overdueDays: 7, status: '轻微' },
    ],
    summary: { totalOverdue: 312000, overdueRate: 2.5, avgDays: 24 },
  },

  // AI 洞察
  'ai-insights': {
    insights: [
      { type: 'opportunity', title: '批量采购机会', description: '检测到 5 个客户有批量采购意向，预计增加营收 ¥450,000', confidence: 92, icon: 'TrendingUp' },
      { type: 'risk', title: '商机流失风险', description: '当前有 8 个高价值商机处于停滞状态，建议尽快跟进', confidence: 88, icon: 'AlertTriangle' },
      { type: 'pattern', title: '最佳跟进时间', description: '分析显示周二和周四下午 3-5 点客户响应率最高', confidence: 85, icon: 'Clock' },
      { type: 'upsell', title: '增购建议', description: '15 个客户适合推荐高端版本，预计增加 ARR ¥280,000', confidence: 78, icon: 'DollarSign' },
    ],
  },

  // 智能推荐
  'ai-next-actions': {
    actions: [
      { priority: 'high', action: '跟进北京科技采购项目', reason: '商机即将进入谈判阶段，决策者有空', deadline: '2026-04-09' },
      { priority: 'high', action: '发送季度回顾报告', reason: '本月回款目标还差 ¥35,000', deadline: '2026-04-10' },
      { priority: 'medium', action: '联系流失预警客户', reason: '客户最近 15 天无活动', deadline: '2026-04-12' },
      { priority: 'low', action: '更新客户联系人信息', reason: '检测到 3 个客户关键人变更', deadline: '2026-04-15' },
    ],
  },

  // 流失风险
  'churn-risk': {
    distribution: [
      { risk: '高风险', count: 12, percentage: 10, color: '#ef4444' },
      { risk: '中风险', count: 28, percentage: 23, color: '#f59e0b' },
      { risk: '低风险', count: 81, percentage: 67, color: '#22c55e' },
    ],
    score: 72,
  },

  // KPI 摘要
  'kpi-summary': {
    kpis: [
      { label: '本月营收', value: '¥158,000', change: 12.5, target: 160000, unit: '¥' },
      { label: '新增客户', value: '25', change: 25, target: 20, unit: '个' },
      { label: '商机数量', value: '168', change: 8.3, target: 150, unit: '个' },
      { label: '活动完成', value: '85%', change: 5, target: 80, unit: '%' },
    ],
  },

  // 最近活动
  'recent-activities': {
    activities: [
      { id: 1, type: 'deal', title: '北京科技签约完成', user: '李明', time: '10分钟前' },
      { id: 2, type: 'meeting', title: '上海贸易需求会议', user: '王芳', time: '30分钟前' },
      { id: 3, type: 'call', title: '广州制造电话跟进', user: '陈静', time: '1小时前' },
      { id: 4, type: 'email', title: '深圳互联网报价发送', user: '张伟', time: '2小时前' },
      { id: 5, type: 'task', title: '杭州电商合同审批', user: '赵敏', time: '3小时前' },
    ],
  },

  // 待办任务
  'upcoming-tasks': {
    tasks: [
      { id: 1, title: '发送季度报告', due: '今天', priority: 'high', type: 'report' },
      { id: 2, title: '客户拜访计划', due: '明天', priority: 'medium', type: 'visit' },
      { id: 3, title: '更新报价方案', due: '后天', priority: 'high', type: 'quote' },
      { id: 4, title: '团队周会', due: '周一', priority: 'low', type: 'meeting' },
      { id: 5, title: '培训材料准备', due: '周三', priority: 'medium', type: 'training' },
    ],
  },

  // 快捷操作
  'quick-actions': {
    actions: [
      { label: '新建商机', icon: 'Plus', action: 'create-opportunity' },
      { label: '创建报价', icon: 'FileText', action: 'create-quote' },
      { label: '添加任务', icon: 'CheckSquare', action: 'create-task' },
      { label: '发送邮件', icon: 'Mail', action: 'send-email' },
      { label: '安排会议', icon: 'Calendar', action: 'schedule-meeting' },
      { label: '拨打电话', icon: 'Phone', action: 'make-call' },
    ],
  },
}

// ============================================================
// Preset Dashboard Templates
// ============================================================

export const PRESET_DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'sales-dashboard',
    name: '销售仪表板',
    description: '专注销售业绩和团队表现的仪表板',
    icon: 'TrendingUp',
    category: 'sales',
    dashlets: [
      { id: 'd1', type: 'kpi-summary', title: 'KPI 摘要', x: 0, y: 0, w: 6, h: 1 },
      { id: 'd2', type: 'revenue-trend', title: '营收趋势', x: 0, y: 1, w: 4, h: 2 },
      { id: 'd3', type: 'sales-funnel', title: '销售漏斗', x: 4, y: 1, w: 3, h: 2 },
      { id: 'd4', type: 'sales-ranking', title: '销售排行', x: 0, y: 3, w: 3, h: 2 },
      { id: 'd5', type: 'sales-by-source', title: '销售来源', x: 3, y: 3, w: 2, h: 2 },
      { id: 'd6', type: 'deal-status', title: '商机状态', x: 5, y: 3, w: 3, h: 1 },
      { id: 'd7', type: 'ai-next-actions', title: '智能推荐', x: 5, y: 4, w: 3, h: 2 },
      { id: 'd8', type: 'recent-activities', title: '最近活动', x: 0, y: 5, w: 3, h: 2 },
    ],
    isDefault: true,
  },
  {
    id: 'service-dashboard',
    name: '客户服务仪表板',
    description: '监控客户服务质量和效率的仪表板',
    icon: 'Headphones',
    category: 'service',
    dashlets: [
      { id: 'd1', type: 'kpi-summary', title: 'KPI 摘要', x: 0, y: 0, w: 6, h: 1 },
      { id: 'd2', type: 'ticket-stats', title: '工单统计', x: 0, y: 1, w: 3, h: 1 },
      { id: 'd3', type: 'csat-score', title: '客户满意度', x: 3, y: 1, w: 2, h: 1 },
      { id: 'd4', type: 'response-time', title: '响应时间', x: 5, y: 1, w: 2, h: 1 },
      { id: 'd5', type: 'ticket-trend', title: '工单趋势', x: 0, y: 2, w: 4, h: 2 },
      { id: 'd6', type: 'overdue-payment', title: '逾期账款', x: 4, y: 2, w: 3, h: 2 },
      { id: 'd7', type: 'churn-risk', title: '流失风险', x: 0, y: 4, w: 2, h: 2 },
      { id: 'd8', type: 'upcoming-tasks', title: '待办任务', x: 2, y: 4, w: 3, h: 2 },
      { id: 'd9', type: 'recent-activities', title: '最近活动', x: 5, y: 4, w: 3, h: 2 },
    ],
    isDefault: false,
  },
  {
    id: 'marketing-dashboard',
    name: '营销仪表板',
    description: '跟踪营销活动效果和线索生成的仪表板',
    icon: 'Megaphone',
    category: 'marketing',
    dashlets: [
      { id: 'd1', type: 'kpi-summary', title: 'KPI 摘要', x: 0, y: 0, w: 6, h: 1 },
      { id: 'd2', type: 'campaign-effectiveness', title: '活动效果', x: 0, y: 1, w: 4, h: 2 },
      { id: 'd3', type: 'roi-analysis', title: 'ROI 分析', x: 4, y: 1, w: 2, h: 2 },
      { id: 'd4', type: 'lead-stats', title: '线索统计', x: 0, y: 3, w: 3, h: 1 },
      { id: 'd5', type: 'lead-conversion', title: '线索转化', x: 3, y: 3, w: 3, h: 2 },
      { id: 'd6', type: 'activity-weekly', title: '每周活动', x: 0, y: 4, w: 4, h: 2 },
      { id: 'd7', type: 'ai-insights', title: 'AI 洞察', x: 4, y: 3, w: 4, h: 2 },
    ],
    isDefault: false,
  },
  {
    id: 'executive-dashboard',
    name: '高管仪表板',
    description: '全局业务概览和战略决策支持的仪表板',
    icon: 'BarChart2',
    category: 'executive',
    dashlets: [
      { id: 'd1', type: 'kpi-summary', title: 'KPI 摘要', x: 0, y: 0, w: 6, h: 1 },
      { id: 'd2', type: 'revenue-trend', title: '营收趋势', x: 0, y: 1, w: 4, h: 2 },
      { id: 'd3', type: 'sales-ranking', title: '销售排行', x: 4, y: 1, w: 3, h: 2 },
      { id: 'd4', type: 'customer-growth', title: '客户增长', x: 0, y: 3, w: 4, h: 2 },
      { id: 'd5', type: 'customer-segment', title: '客户分层', x: 4, y: 3, w: 2, h: 2 },
      { id: 'd6', type: 'payment-status', title: '回款状态', x: 0, y: 5, w: 3, h: 1 },
      { id: 'd7', type: 'ai-insights', title: 'AI 洞察', x: 3, y: 5, w: 4, h: 2 },
    ],
    isDefault: false,
  },
]

// ============================================================
// Layout Presets (Grid Configs)
// ============================================================

export const LAYOUT_PRESETS: Record<string, { cols: number; rowHeight: number; compactType: 'none' | 'compact' | 'fill' }> = {
  default: { cols: 6, rowHeight: 120, compactType: 'compact' },
  compact: { cols: 8, rowHeight: 80, compactType: 'compact' },
  spacious: { cols: 4, rowHeight: 180, compactType: 'none' },
}

// ============================================================
// Helper Functions
// ============================================================

export function getDashletInfo(type: DashletType) {
  return ALL_DASHLETS.find((d) => d.type === type)
}

export function getDashletsByCategory(category: string) {
  return ALL_DASHLETS.filter((d) => d.category === category)
}

export function getDashletData(type: DashletType): unknown {
  return mockDashletData[type]
}

export function getDashboardTemplate(id: string): DashboardTemplate | undefined {
  return PRESET_DASHBOARD_TEMPLATES.find((t) => t.id === id)
}

export function createEmptyDashboard(name: string): DashboardTemplate {
  return {
    id: `custom-${Date.now()}`,
    name,
    description: '自定义仪表板',
    icon: 'Layout',
    category: 'custom',
    dashlets: [],
    isDefault: false,
  }
}
