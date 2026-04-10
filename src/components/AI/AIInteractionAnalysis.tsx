/**
 * AIInteractionAnalysis Component
 * AI 交互分析组件（情感分析/渠道统计）
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InteractionData {
  sentimentScore: number;
  keyTopics: { name: string; count: number }[];
  frequency: { week: string; count: number }[];
  channelBreakdown: { channel: string; count: number }[];
}

interface InteractionAnalysisAIProps {
  customerId?: string;
}

// Mock data for interaction analysis
const mockInteractionData: InteractionData = {
  sentimentScore: 72,
  keyTopics: [
    { name: '价格', count: 8 },
    { name: '集成', count: 6 },
    { name: '支持', count: 5 },
    { name: '时间线', count: 4 },
    { name: '功能', count: 3 },
    { name: '合同', count: 3 },
    { name: '演示', count: 2 },
  ],
  frequency: [
    { week: '第 1 周', count: 5 },
    { week: '第 2 周', count: 8 },
    { week: '第 3 周', count: 4 },
    { week: '第 4 周', count: 6 },
  ],
  channelBreakdown: [
    { channel: '邮件', count: 12 },
    { channel: '电话', count: 8 },
    { channel: '会议', count: 5 },
    { channel: '聊天', count: 3 },
  ],
};

const channelIcons: Record<string, React.ReactNode> = {
  邮件: <Mail className="h-4 w-4" />,
  电话: <Phone className="h-4 w-4" />,
  会议: <Calendar className="h-4 w-4" />,
  聊天: <MessageSquare className="h-4 w-4" />,
};

export const AIInteractionAnalysis: React.FC<InteractionAnalysisAIProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InteractionData | null>(null);
  const [filter, setFilter] = useState<'all' | 'email' | 'phone' | 'meeting'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockInteractionData);
      setLoading(false);
    }, 600);
  }, [customerId]);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentBg = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return '正面';
    if (score >= 50) return '中性';
    return '负面';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-4" />
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
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI 交互分析</CardTitle>
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="email">邮件</SelectItem>
              <SelectItem value="phone">电话</SelectItem>
              <SelectItem value="meeting">会议</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sentiment Score */}
        <div className="space-y-3">
          <label className="text-sm font-medium">情感分析</label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center">
                <span className={cn('text-2xl font-bold', getSentimentColor(data?.sentimentScore || 0))}>
                  {data?.sentimentScore}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Badge className={cn(getSentimentBg(data?.sentimentScore || 0), getSentimentColor(data?.sentimentScore || 0))}>
                {getSentimentLabel(data?.sentimentScore || 0)}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {data?.sentimentScore && data.sentimentScore >= 70 ? (
                  <>
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span>客户响应积极，参与度高</span>
                  </>
                ) : (
                  <>
                    <ThumbsDown className="h-4 w-4 text-yellow-600" />
                    <span>可能需要更多关注</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Topics */}
        <div className="space-y-3">
          <label className="text-sm font-medium">关键话题</label>
          <div className="flex flex-wrap gap-2">
            {data?.keyTopics.map((topic, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1"
              >
                {topic.name}
                <span className="ml-1 text-xs opacity-70">({topic.count})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="space-y-3">
          <label className="text-sm font-medium">渠道分布</label>
          <div className="grid grid-cols-2 gap-3">
            {data?.channelBreakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-md border bg-muted/50 p-3"
              >
                <div className="text-primary">{channelIcons[item.channel] || <MessageSquare className="h-4 w-4" />}</div>
                <span className="text-sm flex-1">{item.channel}</span>
                <span className="text-sm font-semibold text-primary">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Frequency */}
        <div className="space-y-3">
          <label className="text-sm font-medium">沟通频率</label>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.frequency} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data?.frequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInteractionAnalysis;
