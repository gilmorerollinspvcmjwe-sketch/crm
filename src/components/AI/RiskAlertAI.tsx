/**
 * RiskAlertAI Component
 * AI-powered risk alerts and warnings
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, AlertCircle, Info, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Risk {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  reason: string;
  suggestedAction: string;
  details?: string;
}

// Mock risk data
const mockRisks: Risk[] = [
  {
    id: '1',
    level: 'high',
    title: '客户流失风险',
    reason:
      '最近 45 天无互动。主要联系人 Sarah Chen 未回复 3 封跟进邮件。',
    suggestedAction:
      '需要立即联系。考虑升级至高管或采用替代联系策略。',
    details:
      '最后活动：2026 年 2 月 8 日。邮件打开率从 65% 降至 12%。之前类似案例 78% 流失。',
  },
  {
    id: '2',
    level: 'high',
    title: '商机停滞预警',
    reason:
      '商机"企业 ERP 系统"在谈判阶段停留 32 天无进展。',
    suggestedAction:
      '安排商机评审会议。调查客户采购团队的潜在阻碍。',
    details: '预计成交日期：2026 年 3 月 31 日。成功率：75%。商机金额：¥800K。',
  },
  {
    id: '3',
    level: 'medium',
    title: '预算周期风险',
    reason:
      '客户财年将在 60 天后结束。如未及时成交，预算分配可能变化。',
    suggestedAction:
      '加快提案进度。提供 Q1 激励措施鼓励提前签约。',
  },
];

interface RiskAlertAIProps {
  customerId?: string;
  onAction?: (riskId: string) => void;
}

export const RiskAlertAI: React.FC<RiskAlertAIProps> = ({ customerId, onAction }) => {
  const [loading, setLoading] = useState(true);
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRisks(mockRisks);
      setLoading(false);
    }, 450);
  }, [customerId]);

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'high':
        return {
          variant: 'destructive' as const,
          bg: 'bg-red-50',
          icon: <AlertCircle className="h-4 w-4" />,
          label: '高风险',
        };
      case 'medium':
        return {
          variant: 'warning' as const,
          bg: 'bg-orange-50',
          icon: <AlertTriangle className="h-4 w-4" />,
          label: '中风险',
        };
      default:
        return {
          variant: 'secondary' as const,
          bg: 'bg-blue-50',
          icon: <Info className="h-4 w-4" />,
          label: '低风险',
        };
    }
  };

  const handleAction = (riskId: string) => {
    onAction?.(riskId);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const highRisks = risks.filter((r) => r.level === 'high');
  const otherRisks = risks.filter((r) => r.level !== 'high');

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="font-semibold">AI 风险预警</span>
          {highRisks.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {highRisks.length} 个高风险
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {risks.map((risk, index) => {
            const config = getRiskConfig(risk.level);
            return (
              <div
                key={risk.id}
                className={cn(
                  "p-4 transition-colors",
                  index < risks.length - 1 && "border-b"
                )}
              >
                {/* Risk Header */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={config.variant}
                    className={cn("flex items-center gap-1", config.bg)}
                  >
                    {config.icon}
                    {config.label}
                  </Badge>
                </div>

                {/* Risk Title */}
                <div className="font-semibold text-sm mb-2">{risk.title}</div>

                {/* Risk Reason */}
                <p className="text-sm text-muted-foreground mb-3">
                  {risk.reason}
                </p>

                {/* Suggested Action */}
                <div className={cn("p-3 rounded-lg mb-3", config.bg)}>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                    <div className="text-sm">
                      <span className="font-semibold">建议行动：</span>
                      {risk.suggestedAction}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  size="sm"
                  onClick={() => handleAction(risk.id)}
                  className="h-8"
                >
                  立即处理
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAlertAI;
