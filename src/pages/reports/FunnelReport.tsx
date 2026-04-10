/**
 * FunnelReport Page
 * 漏斗报表页面
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { SalesFunnel, type SalesFunnelStats } from '@/components/Charts/SalesFunnel';
import { FunnelChart } from './components/FunnelChart';

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

interface FunnelReportData {
  funnelData: SalesFunnelStats[];
  conversionRates: {
    fromStage: string;
    toStage: string;
    rate: number;
  }[];
}

// Mock data
const getMockReport = (timeRange: TimeRange): FunnelReportData => {
  const baseData: SalesFunnelStats[] = [
    { stage: 'lead_confirmation', count: 120, totalAmount: 12000000, probability: 100, stageOrder: 1 },
    { stage: 'initial_contact', count: 85, totalAmount: 8500000, probability: 70, stageOrder: 2 },
    { stage: 'requirement_confirmation', count: 60, totalAmount: 6000000, probability: 50, stageOrder: 3 },
    { stage: 'proposal_quotation', count: 40, totalAmount: 4000000, probability: 33, stageOrder: 4 },
    { stage: 'negotiation_approval', count: 25, totalAmount: 2500000, probability: 21, stageOrder: 5 },
    { stage: 'closed_won', count: 15, totalAmount: 1500000, probability: 12.5, stageOrder: 6 },
    { stage: 'closed_lost', count: 10, totalAmount: 1000000, probability: 8, stageOrder: 7 },
  ];

  // Adjust data based on time range
  const multiplier = timeRange === 'week' ? 0.25 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 3 : 12;
  
  return {
    funnelData: baseData.map((item) => ({
      ...item,
      count: Math.round(item.count * multiplier),
      totalAmount: item.totalAmount * multiplier,
    })),
    conversionRates: [
      { fromStage: '线索确认', toStage: '初步接触', rate: 70.8 },
      { fromStage: '初步接触', toStage: '需求确认', rate: 70.6 },
      { fromStage: '需求确认', toStage: '方案报价', rate: 66.7 },
      { fromStage: '方案报价', toStage: '谈判审批', rate: 62.5 },
      { fromStage: '谈判审批', toStage: '成交', rate: 60.0 },
    ],
  };
};

const timeRangeLabels: Record<TimeRange, string> = {
  week: '本周',
  month: '本月',
  quarter: '本季',
  year: '本年',
};

const FunnelReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const report = getMockReport(timeRange);

  // Calculate totals
  const totalAmount = report.funnelData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalCount = report.funnelData[0]?.count || 0;
  const avgConversion =
    report.conversionRates.reduce((sum, item) => sum + item.rate, 0) / report.conversionRates.length;

  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">销售漏斗报表</h1>
          <p className="text-muted-foreground">分析销售管道各阶段的转化情况和业绩表现</p>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">本周</SelectItem>
            <SelectItem value="month">本月</SelectItem>
            <SelectItem value="quarter">本季</SelectItem>
            <SelectItem value="year">本年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">总商机数</p>
              <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">总金额</p>
              <p className="text-3xl font-bold text-green-600">{formatAmount(totalAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">平均转化率</p>
              <p className="text-3xl font-bold text-yellow-600">{avgConversion.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Chart */}
      <Card>
        <CardHeader>
          <CardTitle>漏斗图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <FunnelChart data={report.funnelData} />
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">阶段详情</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.funnelData.map((item) => (
                <div key={item.stage} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          item.stage === 'closed_won'
                            ? '#52c41a'
                            : item.stage === 'closed_lost'
                            ? '#ff4d4f'
                            : '#1890ff',
                      }}
                    />
                    <span className="text-sm font-medium">
                      {item.stage === 'lead_confirmation' && '线索确认'}
                      {item.stage === 'initial_contact' && '初步接触'}
                      {item.stage === 'requirement_confirmation' && '需求确认'}
                      {item.stage === 'proposal_quotation' && '方案报价'}
                      {item.stage === 'negotiation_approval' && '谈判审批'}
                      {item.stage === 'closed_won' && '成交'}
                      {item.stage === 'closed_lost' && '输单'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{item.count}</span>
                    <span className="text-sm text-muted-foreground w-20 text-right">
                      {formatAmount(item.totalAmount)}
                    </span>
                    <div className="w-24">
                      <Progress value={item.probability} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground w-10">{item.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">阶段转化率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.conversionRates.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md border bg-card"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.fromStage}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm">{item.toStage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.rate >= 70
                            ? 'bg-green-600'
                            : item.rate >= 50
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold w-12 text-right ${
                        item.rate >= 70
                          ? 'text-green-600'
                          : item.rate >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item.rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunnelReport;
