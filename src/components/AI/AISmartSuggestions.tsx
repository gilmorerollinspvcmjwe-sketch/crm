/**
 * AISmartSuggestions Component
 * AI 智能建议组件（P0/P1/P2 优先级）
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Lightbulb,
  Zap,
  Clock,
  ChevronRight,
  X,
  Check,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: string;
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  description: string;
  impact: string;
  action: string;
  dismissed?: boolean;
  completed?: boolean;
}

interface SmartSuggestionsAIProps {
  customerId?: string;
  onAction?: (suggestionId: string, action: string) => void;
}

// Mock suggestions
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    priority: 'P0',
    title: '安排跟进会议',
    description: '客户已超过 45 天未联系。安排一次回访电话以维护关系。',
    impact: '防止客户流失，保持互动',
    action: '安排会议',
  },
  {
    id: '2',
    priority: 'P0',
    title: '审查停滞商机',
    description: '"企业 ERP" 商机已在同一阶段停留 32 天。考虑升级处理。',
    impact: '推动商机进展',
    action: '审查商机',
  },
  {
    id: '3',
    priority: 'P1',
    title: '发送产品更新',
    description: '新功能发布与客户需求高度匹配。分享产品公告。',
    impact: '展示价值，提升参与度',
    action: '发送邮件',
  },
  {
    id: '4',
    priority: 'P1',
    title: '邀请参加网络研讨会',
    description: '客户符合即将举办的"数字化转型"网络研讨会的目标受众。',
    impact: '参与机会，品牌曝光',
    action: '发送邀请',
  },
  {
    id: '5',
    priority: 'P2',
    title: '更新联系信息',
    description: '部分联系人记录已超过 90 天未更新。验证准确性。',
    impact: '数据质量，更好的外联',
    action: '更新联系人',
  },
];

const priorityConfig = {
  P0: {
    label: 'P0',
    icon: Zap,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  P1: {
    label: 'P1',
    icon: Clock,
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  P2: {
    label: 'P2',
    icon: Lightbulb,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
};

export const AISmartSuggestions: React.FC<SmartSuggestionsAIProps> = ({
  customerId,
  onAction,
}) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 400);
  }, [customerId]);

  const handleDismiss = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleComplete = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: true } : s))
    );
  };

  const handleAction = (suggestion: Suggestion) => {
    onAction?.(suggestion.id, suggestion.action);
    handleComplete(suggestion.id);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const visibleSuggestions = suggestions.filter((s) => !s.dismissed && !s.completed);

  if (visibleSuggestions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI 智能建议</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Check className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="text-muted-foreground">所有建议已完成！</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI 智能建议</CardTitle>
          </div>
          <Badge variant="secondary">{visibleSuggestions.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {visibleSuggestions.map((suggestion, index) => {
            const config = priorityConfig[suggestion.priority];
            const Icon = config.icon;
            return (
              <div
                key={suggestion.id}
                className={cn(
                  'p-4 space-y-3',
                  index < visibleSuggestions.length - 1 && 'border-b'
                )}
              >
                <div className="flex items-start gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(config.bg, config.text, config.border, 'font-medium')}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      影响：{suggestion.impact}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDismiss(suggestion.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => handleAction(suggestion)}
                      >
                        {suggestion.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISmartSuggestions;
