/**
 * AIRelationshipChange Component
 * AI 关系变化检测（健康度评分）
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChangeIndicator {
  type: 'decline' | 'improvement' | 'stagnant';
  metric: string;
  value: string;
  trend: 'down' | 'up' | 'stable';
}

interface AlertEvent {
  date: string;
  type: 'warning' | 'info' | 'success';
  message: string;
}

interface RelationshipData {
  healthScore: number;
  trend: 'declining' | 'stable' | 'improving';
  changeIndicators: ChangeIndicator[];
  alertTimeline: AlertEvent[];
}

interface RelationshipChangeAIProps {
  customerId?: string;
}

// Mock data
const mockRelationshipData: RelationshipData = {
  healthScore: 72,
  trend: 'declining',
  changeIndicators: [
    { type: 'decline', metric: '响应率', value: '-23%', trend: 'down' },
    { type: 'decline', metric: '会议频率', value: '-15%', trend: 'down' },
    { type: 'stagnant', metric: '商机进展', value: '无变化', trend: 'stable' },
    { type: 'improvement', metric: '邮件打开率', value: '+8%', trend: 'up' },
  ],
  alertTimeline: [
    { date: '2026-03-20', type: 'warning', message: '主要联系人 7 天未回复' },
    { date: '2026-03-15', type: 'warning', message: '客户两次推迟会议' },
    { date: '2026-03-10', type: 'info', message: '新决策者加入评估团队' },
    { date: '2026-03-01', type: 'success', message: '产品演示顺利完成' },
  ],
};

export const AIRelationshipChange: React.FC<RelationshipChangeAIProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RelationshipData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setData(mockRelationshipData);
      setLoading(false);
    }, 500);
  }, [customerId]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return '健康';
    if (score >= 60) return '需关注';
    return '有风险';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getAlertIcon = (type: string) => {
    if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    if (type === 'success') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    return <Info className="h-4 w-4 text-blue-600" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base">AI 关系变化检测</CardTitle>
          </div>
          {data?.trend === 'declining' && (
            <Badge variant="destructive" className="text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              下降
            </Badge>
          )}
          {data?.trend === 'improving' && (
            <Badge className="bg-green-100 text-green-700 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              提升
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score */}
        <div className="space-y-3 text-center">
          <label className="text-sm font-medium">关系健康度评分</label>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(data?.healthScore || 0) * 2.51} 251`}
                  className={cn('transition-all', getHealthColor(data?.healthScore || 0))}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className={cn('text-2xl font-bold', getHealthColor(data?.healthScore || 0))}>
                    {data?.healthScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
            <Badge className={cn(getHealthBg(data?.healthScore || 0), getHealthColor(data?.healthScore || 0))}>
              {getHealthLabel(data?.healthScore || 0)}
            </Badge>
            {data?.trend === 'declining' && (
              <p className="text-xs text-muted-foreground">
                <ArrowDownRight className="h-3 w-3 inline mr-1" />
                较上月下降 8 分
              </p>
            )}
          </div>
        </div>

        {/* Change Indicators */}
        <div className="space-y-3">
          <label className="text-sm font-medium">变化指标</label>
          <div className="space-y-2">
            {data?.changeIndicators.map((indicator, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between rounded-md border p-3',
                  indicator.type === 'decline' && 'bg-red-50',
                  indicator.type === 'improvement' && 'bg-green-50',
                  indicator.type === 'stagnant' && 'bg-muted/50'
                )}
              >
                <div className="flex items-center gap-2">
                  {getTrendIcon(indicator.trend)}
                  <span className="text-sm">{indicator.metric}</span>
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    indicator.type === 'decline' && 'text-red-600',
                    indicator.type === 'improvement' && 'text-green-600',
                    indicator.type === 'stagnant' && 'text-muted-foreground'
                  )}
                >
                  {indicator.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Timeline */}
        <div className="space-y-3">
          <label className="text-sm font-medium">预警时间线</label>
          <div className="space-y-3">
            {data?.alertTimeline.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-1 bg-muted">
                    {getAlertIcon(event.type)}
                  </div>
                  {index < data.alertTimeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-muted my-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.date), 'MMM dd')}
                  </p>
                  <p className="text-sm">{event.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRelationshipChange;
