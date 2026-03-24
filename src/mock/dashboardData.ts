/**
 * 仪表盘 Mock 数据
 * 数据设计符合业务逻辑，真实可信
 */

import { 
  FunnelData, 
  PerformanceData, 
  TaskItem, 
  ContractItem, 
  LeadTrendData, 
  CustomerDistData,
  DashletConfig 
} from '../types/dashboard';

/** 销售漏斗概览数据 */
export const funnelData: FunnelData[] = [
  { stage: '初步接洽', count: 156, amount: 4680000, conversionRate: 100 },
  { stage: '需求分析', count: 98, amount: 3920000, conversionRate: 62.8 },
  { stage: '方案报价', count: 67, amount: 3350000, conversionRate: 68.4 },
  { stage: '商务谈判', count: 42, amount: 2520000, conversionRate: 62.7 },
  { stage: '合同签订', count: 28, amount: 1960000, conversionRate: 66.7 },
];

/** 本月业绩完成情况 */
export const performanceData: PerformanceData = {
  target: 5000000,
  actual: 3250000,
  rate: 65,
  remaining: 1750000,
};

/** 待跟进客户列表 */
export const taskData: TaskItem[] = [
  {
    id: 'TASK001',
    customerName: '北京科技创新有限公司',
    contactPerson: '张总',
    phone: '138****1234',
    followUpType: '电话',
    plannedDate: '2026-03-12',
    priority: 'high',
  },
  {
    id: 'TASK002',
    customerName: '上海智能制造有限公司',
    contactPerson: '李经理',
    phone: '139****5678',
    followUpType: '拜访',
    plannedDate: '2026-03-12',
    priority: 'high',
  },
  {
    id: 'TASK003',
    customerName: '广州数字科技有限公司',
    contactPerson: '王总',
    phone: '137****9012',
    followUpType: '微信',
    plannedDate: '2026-03-13',
    priority: 'medium',
  },
  {
    id: 'TASK004',
    customerName: '深圳未来科技有限公司',
    contactPerson: '陈总监',
    phone: '136****3456',
    followUpType: '会议',
    plannedDate: '2026-03-13',
    priority: 'medium',
  },
  {
    id: 'TASK005',
    customerName: '杭州云服务有限公司',
    contactPerson: '赵经理',
    phone: '135****7890',
    followUpType: '邮件',
    plannedDate: '2026-03-14',
    priority: 'low',
  },
];

/** 即将到期合同列表 */
export const contractData: ContractItem[] = [
  {
    id: 'CONT2026001',
    contractName: '年度软件服务合同',
    customerName: '北京科技创新有限公司',
    amount: 580000,
    endDate: '2026-03-25',
    daysRemaining: 13,
    status: 'pending',
  },
  {
    id: 'CONT2026002',
    contractName: '系统维护服务合同',
    customerName: '上海智能制造有限公司',
    amount: 320000,
    endDate: '2026-03-30',
    daysRemaining: 18,
    status: 'renewing',
  },
  {
    id: 'CONT2026003',
    contractName: '技术支持服务合同',
    customerName: '广州数字科技有限公司',
    amount: 150000,
    endDate: '2026-04-05',
    daysRemaining: 24,
    status: 'pending',
  },
  {
    id: 'CONT2026004',
    contractName: '云平台服务合同',
    customerName: '深圳未来科技有限公司',
    amount: 890000,
    endDate: '2026-04-15',
    daysRemaining: 34,
    status: 'renewing',
  },
];

/** 新增线索趋势数据（12 个月） */
export const leadTrendData: LeadTrendData[] = [
  { month: '2025-04', count: 120, converted: 45 },
  { month: '2025-05', count: 135, converted: 52 },
  { month: '2025-06', count: 148, converted: 58 },
  { month: '2025-07', count: 132, converted: 49 },
  { month: '2025-08', count: 156, converted: 61 },
  { month: '2025-09', count: 168, converted: 67 },
  { month: '2025-10', count: 175, converted: 72 },
  { month: '2025-11', count: 162, converted: 65 },
  { month: '2025-12', count: 145, converted: 55 },
  { month: '2026-01', count: 138, converted: 51 },
  { month: '2026-02', count: 152, converted: 59 },
  { month: '2026-03', count: 165, converted: 48 }, // 本月数据（未完成）
];

/** 客户行业分布数据 */
export const customerDistData: CustomerDistData[] = [
  { industry: '互联网/软件', count: 245, percentage: 28.5 },
  { industry: '制造业', count: 186, percentage: 21.6 },
  { industry: '金融/保险', count: 142, percentage: 16.5 },
  { industry: '零售/电商', count: 118, percentage: 13.7 },
  { industry: '医疗/健康', count: 85, percentage: 9.9 },
  { industry: '教育/培训', count: 52, percentage: 6.0 },
  { industry: '其他', count: 33, percentage: 3.8 },
];

/** 默认 Dashlet 配置 */
export const defaultDashlets: DashletConfig[] = [
  { id: 'salesOverview', type: 'salesOverview', title: '销售数据概览', visible: true, position: 0 },
  { id: 'funnel', type: 'funnel', title: '销售漏斗概览', visible: true, position: 1 },
  { id: 'performance', type: 'performance', title: '本月业绩', visible: true, position: 2 },
  { id: 'todo', type: 'todo', title: '待办事项', visible: true, position: 3 },
  { id: 'task', type: 'task', title: '待跟进客户', visible: true, position: 4 },
  { id: 'paymentWarning', type: 'paymentWarning', title: '回款预警', visible: true, position: 5 },
  { id: 'contract', type: 'contract', title: '即将到期合同', visible: true, position: 6 },
  { id: 'leadTrend', type: 'leadTrend', title: '新增线索趋势', visible: true, position: 7 },
  { id: 'customerDist', type: 'customerDist', title: '客户行业分布', visible: true, position: 8 },
];

/** 格式化金额 */
export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `¥${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount}`;
};
