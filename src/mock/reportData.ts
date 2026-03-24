/**
 * 报表中心 Mock 数据
 * 包含完整的 12 个月趋势数据，符合业务逻辑
 */

import { SalesFunnelReport, PerformanceReport, CustomerReport, TimeRange } from '../types/report';

/** 销售漏斗报表数据 */
export const getSalesFunnelReport = (timeRange: TimeRange): SalesFunnelReport => {
  // 根据时间范围调整数据
  const multipliers: Record<TimeRange, number> = {
    week: 0.25,
    month: 1,
    quarter: 3,
    year: 12,
  };
  const mult = multipliers[timeRange];

  return {
    timeRange,
    funnelData: [
      {
        stage: '初步接洽',
        stageOrder: 1,
        opportunityCount: Math.round(156 * mult),
        totalAmount: Math.round(4680000 * mult),
        winRate: 100,
      },
      {
        stage: '需求分析',
        stageOrder: 2,
        opportunityCount: Math.round(98 * mult),
        totalAmount: Math.round(3920000 * mult),
        winRate: 62.8,
      },
      {
        stage: '方案报价',
        stageOrder: 3,
        opportunityCount: Math.round(67 * mult),
        totalAmount: Math.round(3350000 * mult),
        winRate: 68.4,
      },
      {
        stage: '商务谈判',
        stageOrder: 4,
        opportunityCount: Math.round(42 * mult),
        totalAmount: Math.round(2520000 * mult),
        winRate: 62.7,
      },
      {
        stage: '合同签订',
        stageOrder: 5,
        opportunityCount: Math.round(28 * mult),
        totalAmount: Math.round(1960000 * mult),
        winRate: 66.7,
      },
    ],
    conversionRates: [
      { fromStage: '初步接洽', toStage: '需求分析', rate: 62.8 },
      { fromStage: '需求分析', toStage: '方案报价', rate: 68.4 },
      { fromStage: '方案报价', toStage: '商务谈判', rate: 62.7 },
      { fromStage: '商务谈判', toStage: '合同签订', rate: 66.7 },
    ],
  };
};

/** 业绩统计报表数据 */
export const performanceReport: PerformanceReport = {
  personalPerformance: [
    { userId: 'U001', userName: '张三', target: 800000, actual: 680000, rate: 85, rank: 1 },
    { userId: 'U002', userName: '李四', target: 800000, actual: 620000, rate: 77.5, rank: 2 },
    { userId: 'U003', userName: '王五', target: 800000, actual: 560000, rate: 70, rank: 3 },
    { userId: 'U004', userName: '赵六', target: 800000, actual: 520000, rate: 65, rank: 4 },
    { userId: 'U005', userName: '钱七', target: 800000, actual: 480000, rate: 60, rank: 5 },
    { userId: 'U006', userName: '孙八', target: 800000, actual: 440000, rate: 55, rank: 6 },
  ],
  teamPerformance: [
    {
      teamId: 'T001',
      teamName: '销售一部',
      target: 2400000,
      actual: 1860000,
      rate: 77.5,
      rank: 1,
      members: [],
    },
    {
      teamId: 'T002',
      teamName: '销售二部',
      target: 2400000,
      actual: 1560000,
      rate: 65,
      rank: 2,
      members: [],
    },
    {
      teamId: 'T003',
      teamName: '销售三部',
      target: 2400000,
      actual: 1400000,
      rate: 58.3,
      rank: 3,
      members: [],
    },
  ],
  monthlyTrend: [
    { month: '2025-04', target: 4500000, actual: 3820000, rate: 84.9 },
    { month: '2025-05', target: 4500000, actual: 4150000, rate: 92.2 },
    { month: '2025-06', target: 4800000, actual: 4560000, rate: 95.0 },
    { month: '2025-07', target: 4800000, actual: 4320000, rate: 90.0 },
    { month: '2025-08', target: 5000000, actual: 4750000, rate: 95.0 },
    { month: '2025-09', target: 5000000, actual: 5100000, rate: 102.0 },
    { month: '2025-10', target: 5200000, actual: 5460000, rate: 105.0 },
    { month: '2025-11', target: 5200000, actual: 5096000, rate: 98.0 },
    { month: '2025-12', target: 5500000, actual: 5225000, rate: 95.0 },
    { month: '2026-01', target: 5500000, actual: 4950000, rate: 90.0 },
    { month: '2026-02', target: 5000000, actual: 4600000, rate: 92.0 },
    { month: '2026-03', target: 5000000, actual: 3250000, rate: 65.0 }, // 本月未完成
  ],
};

/** 客户分析报表数据 */
export const customerReport: CustomerReport = {
  growthData: [
    { month: '2025-04', newCustomers: 45, totalCustomers: 520, growthRate: 9.5 },
    { month: '2025-05', newCustomers: 52, totalCustomers: 568, growthRate: 9.2 },
    { month: '2025-06', newCustomers: 48, totalCustomers: 612, growthRate: 7.7 },
    { month: '2025-07', newCustomers: 38, totalCustomers: 645, growthRate: 5.4 },
    { month: '2025-08', newCustomers: 55, totalCustomers: 695, growthRate: 7.8 },
    { month: '2025-09', newCustomers: 62, totalCustomers: 752, growthRate: 8.2 },
    { month: '2025-10', newCustomers: 58, totalCustomers: 805, growthRate: 7.0 },
    { month: '2025-11', newCustomers: 42, totalCustomers: 842, growthRate: 4.6 },
    { month: '2025-12', newCustomers: 35, totalCustomers: 872, growthRate: 3.6 },
    { month: '2026-01', newCustomers: 28, totalCustomers: 895, growthRate: 2.6 },
    { month: '2026-02', newCustomers: 32, totalCustomers: 922, growthRate: 3.0 },
    { month: '2026-03', newCustomers: 38, totalCustomers: 960, growthRate: 4.1 },
  ],
  industryDist: [
    { industry: '互联网/软件', count: 274, percentage: 28.5 },
    { industry: '制造业', count: 207, percentage: 21.6 },
    { industry: '金融/保险', count: 158, percentage: 16.5 },
    { industry: '零售/电商', count: 132, percentage: 13.7 },
    { industry: '医疗/健康', count: 95, percentage: 9.9 },
    { industry: '教育/培训', count: 58, percentage: 6.0 },
    { industry: '其他', count: 36, percentage: 3.8 },
  ],
  levelDist: [
    { level: 'A', label: '重点客户', count: 96, percentage: 10.0 },
    { level: 'B', label: '重要客户', count: 288, percentage: 30.0 },
    { level: 'C', label: '普通客户', count: 432, percentage: 45.0 },
    { level: 'D', label: '潜在客户', count: 144, percentage: 15.0 },
  ],
};

/** 格式化金额 */
export const formatAmount = (amount: number): string => {
  if (amount >= 10000000) {
    return `¥${(amount / 10000000).toFixed(2)}千万`;
  }
  if (amount >= 1000000) {
    return `¥${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount}`;
};
