/**
 * PaymentAnalytics Page
 * 回款分析页面
 * 展示回款统计、趋势图表、账龄分析和多维度统计
 */

import React, { useState } from 'react';
import PaymentStatistics, { PaymentStatisticsData } from '@/components/PaymentStatistics';
import PaymentTrendChart, { PaymentTrendData, TimeRange } from '@/components/PaymentTrendChart';
import ReceivablesAging, { AgingRangeData } from '@/components/ReceivablesAging';
import PaymentAnalysis, { PaymentStatusData, PaymentMethodData } from '@/components/PaymentAnalysis';
import {
  paymentStatisticsData,
  paymentTrendData,
  receivablesAgingData,
  paymentStatusData,
  paymentMethodData,
  getTrendDataByRange,
} from '@/mock/paymentData';

const PaymentAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [trendData, setTrendData] = useState<PaymentTrendData[]>(paymentTrendData);

  // 处理时间范围变化
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setTrendData(getTrendDataByRange(range));
  };

  // 处理统计卡片点击
  const handleStatClick = (stat: keyof PaymentStatisticsData) => {
    console.log('Stat clicked:', stat);
    // 可以在这里添加筛选逻辑
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">💰 回款分析</h1>
          <p className="text-muted-foreground">
            全面监控回款情况，分析回款趋势，识别风险账龄
          </p>
        </div>

        {/* 统计卡片 */}
        <PaymentStatistics
          data={paymentStatisticsData}
          onStatClick={handleStatClick}
        />

        {/* 回款趋势图表 */}
        <PaymentTrendChart
          data={trendData}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          showArea={false}
        />

        {/* 应收账款账龄分析 */}
        <ReceivablesAging
          data={receivablesAgingData}
          showChart="both"
          showTable={true}
        />

        {/* 多维度统计分析 */}
        <PaymentAnalysis
          statusData={paymentStatusData}
          methodData={paymentMethodData}
          defaultTab="status"
        />
      </div>
    </div>
  );
};

export default PaymentAnalytics;
