/**
 * PaymentStatistics Component
 * 回款统计卡片组件
 * 展示计划总额、实际总额、完成率、逾期金额四个关键指标
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaymentStatisticsData {
  plannedTotal: number;      // 计划总额
  actualTotal: number;       // 实际总额
  completionRate: number;    // 完成率 (%)
  overdueAmount: number;     // 逾期金额
}

interface PaymentStatisticsProps {
  data: PaymentStatisticsData;
  className?: string;
  onStatClick?: (stat: keyof PaymentStatisticsData) => void;
}

/**
 * 格式化金额为万元
 */
const formatAmount = (amount: number): string => {
  return (amount / 10000).toFixed(1);
};

/**
 * 获取完成率的文本标签和颜色
 */
const getCompletionRateConfig = (rate: number) => {
  if (rate >= 100) {
    return { text: '超额完成', color: 'text-green-600', bgColor: 'bg-green-100' };
  } else if (rate >= 90) {
    return { text: '表现优秀', color: 'text-green-600', bgColor: 'bg-green-100' };
  } else if (rate >= 75) {
    return { text: '表现良好', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  } else if (rate >= 60) {
    return { text: '需要关注', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  } else {
    return { text: '需要改进', color: 'text-red-600', bgColor: 'bg-red-100' };
  }
};

export const PaymentStatistics: React.FC<PaymentStatisticsProps> = ({
  data,
  className,
  onStatClick,
}) => {
  const stats = [
    {
      key: 'plannedTotal' as keyof PaymentStatisticsData,
      title: '计划总额',
      value: formatAmount(data.plannedTotal),
      unit: '万元',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: '本期计划回款金额',
    },
    {
      key: 'actualTotal' as keyof PaymentStatisticsData,
      title: '实际总额',
      value: formatAmount(data.actualTotal),
      unit: '万元',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: '本期实际回款金额',
    },
    {
      key: 'completionRate' as keyof PaymentStatisticsData,
      title: '完成率',
      value: data.completionRate.toFixed(1),
      unit: '%',
      icon: CheckCircle,
      ...getCompletionRateConfig(data.completionRate),
      description: '实际回款占计划比例',
    },
    {
      key: 'overdueAmount' as keyof PaymentStatisticsData,
      title: '逾期金额',
      value: formatAmount(data.overdueAmount),
      unit: '万元',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: '逾期未回款金额',
    },
  ];

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.key}
            className={cn(
              'transition-all duration-200 hover:shadow-md cursor-pointer',
              'border-l-4',
              stat.key === 'plannedTotal' && 'border-l-blue-500',
              stat.key === 'actualTotal' && 'border-l-green-500',
              stat.key === 'completionRate' && 'border-l-blue-500',
              stat.key === 'overdueAmount' && 'border-l-red-500'
            )}
            onClick={() => onStatClick?.(stat.key)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn('p-2 rounded-full', stat.bgColor)}>
                <Icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {stat.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.key === 'completionRate' && (
                <p className={cn('text-xs mt-1 font-medium', stat.color)}>
                  {getCompletionRateConfig(data.completionRate).text}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PaymentStatistics;
