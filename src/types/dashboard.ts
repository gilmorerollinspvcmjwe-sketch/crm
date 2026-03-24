/**
 * 仪表盘类型定义
 */

/** Dashlet 卡片类型 */
export type DashletType = 
  | 'funnel'
  | 'performance'
  | 'task'
  | 'contract'
  | 'leadTrend'
  | 'customerDist'
  | 'salesOverview'
  | 'todo'
  | 'paymentWarning';

/** Dashlet 卡片配置 */
export interface DashletConfig {
  id: string;
  type: DashletType;
  title: string;
  visible: boolean;
  position: number;
}

/** 销售漏斗数据 */
export interface FunnelData {
  stage: string;
  count: number;
  amount: number;
  conversionRate: number;
}

/** 业绩完成情况 */
export interface PerformanceData {
  target: number;
  actual: number;
  rate: number;
  remaining: number;
}

/** 待跟进任务 */
export interface TaskItem {
  id: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  followUpType: string;
  plannedDate: string;
  priority: 'high' | 'medium' | 'low';
}

/** 即将到期合同 */
export interface ContractItem {
  id: string;
  contractName: string;
  customerName: string;
  amount: number;
  endDate: string;
  daysRemaining: number;
  status: 'pending' | 'renewing' | 'expired';
}

/** 线索趋势数据 */
export interface LeadTrendData {
  month: string;
  count: number;
  converted: number;
}

/** 客户行业分布 */
export interface CustomerDistData {
  industry: string;
  count: number;
  percentage: number;
}

/** 仪表盘布局配置 */
export interface DashboardLayout {
  columns: 3 | 4;
  dashlets: DashletConfig[];
}
