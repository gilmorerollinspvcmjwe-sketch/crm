/**
 * CustomerSummaryAI Component
 * AI-generated customer summary with typewriter effect
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Lightbulb, AlertTriangle, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustomerSummary {
  summary: string;
  highlights: string[];
  risks: string[];
  opportunities: string[];
  actions: string[];
}

// Mock data for AI summary
const mockSummary: CustomerSummary = {
  summary:
    "Acme Corp is a high-value enterprise client ($2.4M ARR) in the technology sector. Recent engagement shows declining response rates (-23% over 30 days). The primary contact, Sarah Chen (VP Engineering), has been less responsive since Q4. Recommended: Schedule executive review meeting within 2 weeks.",
  highlights: [
    "Enterprise client with $2.4M annual revenue potential",
    "Strong presence in technology sector",
    "Multiple active opportunities in pipeline",
    "Long-term partnership history (3+ years)",
  ],
  risks: [
    "Response rate declined 23% in last 30 days",
    "Primary contact Sarah Chen less responsive since Q4",
    "Budget review cycle may delay decisions",
  ],
  opportunities: [
    "Expansion potential: Cloud services adoption growing",
    "New department interest: Marketing automation",
    "Upsell opportunity: Premium support package",
  ],
  actions: [
    "Schedule executive review meeting within 2 weeks",
    "Prepare Q1 business review presentation",
    "Identify alternative decision-makers",
  ],
};

interface CustomerSummaryAIProps {
  customerId?: string;
  customerName?: string;
}

export const CustomerSummaryAI: React.FC<CustomerSummaryAIProps> = ({
  customerId,
  customerName = 'Customer',
}) => {
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect
  const typeText = useCallback((text: string, callback?: () => void) => {
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        callback?.();
      }
    }, 15);
    return () => clearInterval(timer);
  }, []);

  // Simulate API call
  const loadSummary = useCallback(() => {
    setLoading(true);
    setDisplayedText('');
    setSummary(null);

    // Simulate API delay
    setTimeout(() => {
      setSummary(mockSummary);
      setLoading(false);
      typeText(mockSummary.summary);
    }, 800);
  }, [typeText]);

  useEffect(() => {
    loadSummary();
  }, [customerId]);

  const handleRefresh = () => {
    loadSummary();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI 客户洞察</span>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
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
            <span className="font-semibold">AI 客户洞察</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isTyping}
            className="h-8"
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isTyping && "animate-spin")} />
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main summary with typewriter effect */}
        <div className="text-sm leading-relaxed text-muted-foreground min-h-[60px]">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </div>

        <div className="border-t pt-3 space-y-3">
          {/* Key Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">核心优势</span>
            </div>
            <ul className="space-y-1 ml-6">
              {summary?.highlights.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factors */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">风险因素</span>
            </div>
            <ul className="space-y-1 ml-6">
              {summary?.risks.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">潜在机会</span>
            </div>
            <ul className="space-y-1 ml-6">
              {summary?.opportunities.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">建议行动</span>
            </div>
            <ul className="space-y-1 ml-6">
              {summary?.actions.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSummaryAI;
