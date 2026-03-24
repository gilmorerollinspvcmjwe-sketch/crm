/**
 * 报表类型定义
 */

/** 时间范围类型 */
export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

/** 销售漏斗报表数据 */
export interface SalesFunnelReport {
  timeRange: TimeRange;
  funnelData: {
    stage: string;
    stageOrder: number;
    opportunityCount: number;
    totalAmount: number;
    winRate: number;
  }[];
  conversionRates: {
    fromStage: string;
    toStage: string;
    rate: number;
  }[];
}

/** 个人业绩数据 */
export interface PersonalPerformance {
  userId: string;
  userName: string;
  target: number;
  actual: number;
  rate: number;
  rank: number;
}

/** 团队业绩排行数据 */
export interface TeamPerformance {
  teamId: string;
  teamName: string;
  target: number;
  actual: number;
  rate: number;
  rank: number;
  members: PersonalPerformance[];
}

/** 月度趋势数据 */
export interface MonthlyTrend {
  month: string;
  target: number;
  actual: number;
  rate: number;
}

/** 业绩统计报表 */
export interface PerformanceReport {
  personalPerformance: PersonalPerformance[];
  teamPerformance: TeamPerformance[];
  monthlyTrend: MonthlyTrend[];
}

/** 客户增长数据 */
export interface CustomerGrowth {
  month: string;
  newCustomers: number;
  totalCustomers: number;
  growthRate: number;
}

/** 客户等级分布 */
export interface CustomerLevelDist {
  level: 'A' | 'B' | 'C' | 'D';
  label: string;
  count: number;
  percentage: number;
}

/** 客户分析报表 */
export interface CustomerReport {
  growthData: CustomerGrowth[];
  industryDist: {
    industry: string;
    count: number;
    percentage: number;
  }[];
  levelDist: CustomerLevelDist[];
}
