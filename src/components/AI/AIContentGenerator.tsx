/**
 * AIContentGenerator Component
 * AI 内容生成组件（邮件/提案自动生成）
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Send, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Scenario = 'followUp' | 'meetingRequest' | 'thankYou' | 'proposal';

interface ContentGeneratorAIProps {
  customerId?: string;
  customerName?: string;
  contactName?: string;
  onContentGenerated?: (content: string) => void;
}

// Mock content templates
const mockContents: Record<Scenario, string> = {
  followUp: `Hi {contactName},

I hope this email finds you well. I wanted to follow up on our last conversation about the Enterprise ERP implementation project.

Based on our discussion, I understand that scalability and integration capabilities are top priorities for your team. I've prepared a detailed technical specification document that addresses these concerns directly.

Would you be available for a 30-minute call this week to walk through the specification and address any questions? I'm flexible and can work around your schedule.

Looking forward to hearing from you.

Best regards,
[Your Name]`,

  meetingRequest: `Hi {contactName},

I hope you're having a great week.

Following our recent product demo, I'd like to schedule a follow-up meeting to discuss the implementation timeline and address any remaining questions from your technical team.

I have a few time slots available:
- Tuesday, Mar 26: 2:00 PM - 3:00 PM EST
- Wednesday, Mar 27: 10:00 AM - 11:00 AM EST
- Thursday, Mar 28: 3:00 PM - 4:00 PM EST

Please let me know which time works best for you, or suggest an alternative that fits your schedule.

Best regards,
[Your Name]`,

  thankYou: `Hi {contactName},

Thank you for taking the time to meet with us yesterday. It was great to learn more about {customerName}'s digital transformation initiatives.

I particularly appreciated your insights on the challenges with your current systems and how we might be able to help streamline your operations.

As discussed, I'll be sending over:
1. The revised proposal with adjusted pricing
2. Case studies from similar implementations
3. Technical documentation for your engineering team

Please don't hesitate to reach out if you have any questions in the meantime.

Looking forward to our next conversation.

Best regards,
[Your Name]`,

  proposal: `Hi {contactName},

Thank you for the opportunity to present our solution for {customerName}'s ERP modernization project.

As discussed, here's a summary of our proposal:

**Project Scope:**
- Enterprise ERP implementation with 500 user licenses
- Custom integration with existing CRM and inventory systems
- Data migration from legacy systems
- Training and change management support

**Investment:**
- One-time implementation: $120,000
- Annual subscription: $180,000/year
- Optional premium support: $24,000/year

**Timeline:**
- Phase 1 (Core modules): 8 weeks
- Phase 2 (Integrations): 4 weeks
- Phase 3 (Training & Go-live): 2 weeks

I'm confident this solution will deliver significant value to {customerName}. I'm available to discuss any aspects of this proposal at your convenience.

Best regards,
[Your Name]`,
};

const scenarios = [
  { value: 'followUp', label: '跟进邮件' },
  { value: 'meetingRequest', label: '会议邀请' },
  { value: 'thankYou', label: '感谢邮件' },
  { value: 'proposal', label: '方案提案' },
];

export const AIContentGenerator: React.FC<ContentGeneratorAIProps> = ({
  customerId,
  customerName = 'Acme Corp',
  contactName = 'Sarah',
  onContentGenerated,
}) => {
  const { toast } = useToast();
  const [scenario, setScenario] = useState<Scenario>('followUp');
  const [displayedContent, setDisplayedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Typewriter effect
  const typeContent = useCallback((text: string) => {
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedContent(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        setGenerated(true);
        onContentGenerated?.(text);
      }
    }, 8);
    return () => clearInterval(timer);
  }, [onContentGenerated]);

  // Generate content
  const handleGenerate = () => {
    setIsGenerating(true);
    setDisplayedContent('');
    setGenerated(false);

    // Simulate API delay
    setTimeout(() => {
      const content = mockContents[scenario]
        .replace(/\{customerName\}/g, customerName)
        .replace(/\{contactName\}/g, contactName);
      setIsGenerating(false);
      typeContent(content);
    }, 800);
  };

  // Copy content
  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayedContent);
    setCopied(true);
    toast({
      title: '复制成功',
      description: '内容已复制到剪贴板',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Regenerate
  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI 内容生成</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">选择场景</label>
          <div className="flex gap-2">
            <Select value={scenario} onValueChange={(v) => setScenario(v as Scenario)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择场景" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isTyping}
              className="shrink-0"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              生成
            </Button>
          </div>
        </div>

        {/* Generated Content */}
        {(displayedContent || isGenerating) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">生成内容</label>
            <div
              className={cn(
                'min-h-[200px] rounded-md border bg-muted/50 p-4 font-mono text-sm leading-relaxed',
                isGenerating && !displayedContent && 'flex items-center justify-center'
              )}
            >
              {isGenerating && !displayedContent ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="whitespace-pre-wrap">
                  {displayedContent}
                  {isTyping && <span className="animate-pulse">|</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {generated && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? '已复制' : '复制'}
            </Button>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-1" />
              编辑
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenerate}>
              <RefreshCw className="h-4 w-4 mr-1" />
              重新生成
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!displayedContent && !isGenerating && (
          <div className="text-center py-8 text-muted-foreground">
            <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">选择场景并点击生成来创建内容</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIContentGenerator;
