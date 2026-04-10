/**
 * Payment Mock Data
 * 回款模块模拟数据
 */

import { PaymentStatisticsData } from '@/components/PaymentStatistics';
import { PaymentTrendData } from '@/components/PaymentTrendChart';
import { AgingRangeData } from '@/components/ReceivablesAging';
import { PaymentStatusData, PaymentMethodData } from '@/components/PaymentAnalysis';

/**
 * 统计卡片数据
 */
export const paymentStatisticsData: PaymentStatisticsData = {
  plannedTotal: 12500000,    // 1250 万元
  actualTotal: 9800000,      // 980 万元
  completionRate: 78.4,      // 78.4%
  overdueAmount: 850000,     // 85 万元
};

/**
 * 回款趋势数据 (12 个月)
 */
export const paymentTrendData: PaymentTrendData[] = [
  { month: '2025-04', planned: 850000, actual: 820000, rate: 96.5 },
  { month: '2025-05', planned: 920000, actual: 895000, rate: 97.3 },
  { month: '2025-06', planned: 980000, actual: 945000, rate: 96.4 },
  { month: '2025-07', planned: 1050000, actual: 985000, rate: 93.8 },
  { month: '2025-08', planned: 1100000, actual: 1056000, rate: 96.0 },
  { month: '2025-09', planned: 1150000, actual: 1127000, rate: 98.0 },
  { month: '2025-10', planned: 1200000, actual: 1164000, rate: 97.0 },
  { month: '2025-11', planned: 1250000, actual: 1187500, rate: 95.0 },
  { month: '2025-12', planned: 1300000, actual: 1235000, rate: 95.0 },
  { month: '2026-01', planned: 1100000, actual: 1012000, rate: 92.0 },
  { month: '2026-02', planned: 950000, actual: 874000, rate: 92.0 },
  { month: '2026-03', planned: 650000, actual: 500000, rate: 76.9 },
];

/**
 * 应收账款账龄数据
 */
export const receivablesAgingData: AgingRangeData[] = [
  {
    range: '0-30 天',
    amount: 1850000,
    percentage: 68.5,
    risk: 'low',
    count: 45,
  },
  {
    range: '31-60 天',
    amount: 485000,
    percentage: 18.0,
    risk: 'medium',
    count: 12,
  },
  {
    range: '61-90 天',
    amount: 215000,
    percentage: 8.0,
    risk: 'high',
    count: 5,
  },
  {
    range: '91-180 天',
    amount: 100000,
    percentage: 3.7,
    risk: 'critical',
    count: 2,
  },
  {
    range: '180+ 天',
    amount: 50000,
    percentage: 1.8,
    risk: 'critical',
    count: 1,
  },
];

/**
 * 按状态统计数据
 */
export const paymentStatusData: PaymentStatusData[] = [
  {
    status: 'paid',
    count: 156,
    amount: 9800000,
    color: '#52c41a',
  },
  {
    status: 'unpaid',
    count: 48,
    amount: 1850000,
    color: '#1890ff',
  },
  {
    status: 'partial',
    count: 15,
    amount: 485000,
    color: '#faad14',
  },
  {
    status: 'overdue',
    count: 8,
    amount: 365000,
    color: '#f5222d',
  },
];

/**
 * 按支付方式统计数据
 */
export const paymentMethodData: PaymentMethodData[] = [
  {
    method: 'bank_transfer',
    count: 145,
    amount: 7500000,
    color: '#1890ff',
  },
  {
    method: 'check',
    count: 35,
    amount: 2000000,
    color: '#52c41a',
  },
  {
    method: 'online_payment',
    count: 28,
    amount: 850000,
    color: '#13c2c2',
  },
  {
    method: 'credit_card',
    count: 12,
    amount: 350000,
    color: '#722ed1',
  },
  {
    method: 'cash',
    count: 7,
    amount: 100000,
    color: '#faad14',
  },
];

/**
 * 获取指定月份范围的趋势数据
 */
export const getTrendDataByRange = (range: 'week' | 'month' | 'quarter' | 'year'): PaymentTrendData[] => {
  switch (range) {
    case 'week':
      // 返回最近 7 条数据
      return paymentTrendData.slice(-7);
    case 'month':
      // 返回所有月度数据
      return paymentTrendData;
    case 'quarter':
      // 按季度聚合
      return [
        { month: 'Q2', planned: 2750000, actual: 2660000, rate: 96.7 },
        { month: 'Q3', planned: 3300000, actual: 3168000, rate: 96.0 },
        { month: 'Q4', planned: 3750000, actual: 3586500, rate: 95.6 },
        { month: 'Q1', planned: 2700000, actual: 2386000, rate: 88.4 },
      ];
    case 'year':
      // 按年度聚合
      return [
        { month: '2025', planned: 10000000, actual: 9577500, rate: 95.8 },
        { month: '2026', planned: 2700000, actual: 2386000, rate: 88.4 },
      ];
    default:
      return paymentTrendData;
  }
};

export default {
  paymentStatisticsData,
  paymentTrendData,
  receivablesAgingData,
  paymentStatusData,
  paymentMethodData,
  getTrendDataByRange,
};
