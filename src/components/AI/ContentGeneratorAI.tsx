/**
 * ContentGeneratorAI Component
 * Simulates AI content generation with typewriter effect
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  Card,
  Select,
  Button,
  Space,
  Typography,
  Skeleton,
  message,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  CopyOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

const { Text, Paragraph } = Typography;

type Scenario = 'followUp' | 'meetingRequest' | 'thankYou' | 'proposal';

// Mock content templates
const mockContents: Record<Scenario, string> = {
  followUp: `Hi Sarah,

I hope this email finds you well. I wanted to follow up on our last conversation about the Enterprise ERP implementation project.

Based on our discussion, I understand that scalability and integration capabilities are top priorities for your team. I've prepared a detailed technical specification document that addresses these concerns directly.

Would you be available for a 30-minute call this week to walk through the specification and address any questions? I'm flexible and can work around your schedule.

Looking forward to hearing from you.

Best regards,
[Your Name]`,

  meetingRequest: `Hi Sarah,

I hope you're having a great week.

Following our recent product demo, I'd like to schedule a follow-up meeting to discuss the implementation timeline and address any remaining questions from your technical team.

I have a few time slots available:
- Tuesday, Mar 26: 2:00 PM - 3:00 PM EST
- Wednesday, Mar 27: 10:00 AM - 11:00 AM EST
- Thursday, Mar 28: 3:00 PM - 4:00 PM EST

Please let me know which time works best for you, or suggest an alternative that fits your schedule.

Best regards,
[Your Name]`,

  thankYou: `Hi Sarah,

Thank you for taking the time to meet with us yesterday. It was great to learn more about Acme Corp's digital transformation initiatives.

I particularly appreciated your insights on the challenges with your current systems and how we might be able to help streamline your operations.

As discussed, I'll be sending over:
1. The revised proposal with adjusted pricing
2. Case studies from similar implementations
3. Technical documentation for your engineering team

Please don't hesitate to reach out if you have any questions in the meantime.

Looking forward to our next conversation.

Best regards,
[Your Name]`,

  proposal: `Hi Sarah,

Thank you for the opportunity to present our solution for Acme Corp's ERP modernization project.

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

I'm confident this solution will deliver significant value to Acme Corp. I'm available to discuss any aspects of this proposal at your convenience.

Best regards,
[Your Name]`,
};

interface ContentGeneratorAIProps {
  customerId?: string;
  customerName?: string;
  contactName?: string;
  onContentGenerated?: (content: string) => void;
}

export const ContentGeneratorAI: React.FC<ContentGeneratorAIProps> = ({
  customerId,
  customerName = 'Acme Corp',
  contactName = 'Sarah',
  onContentGenerated,
}) => {
  const { t } = useTranslation();
  const [scenario, setScenario] = useState<Scenario>('followUp');
  const [displayedContent, setDisplayedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [generated, setGenerated] = useState(false);

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
      const content = mockContents[scenario].replace(/\[Customer\]/g, customerName).replace(/Sarah/g, contactName);
      setIsGenerating(false);
      typeContent(content);
    }, 800);
  };

  // Copy content
  const handleCopy = () => {
    navigator.clipboard.writeText(displayedContent);
    message.success('Content copied to clipboard');
  };

  // Regenerate
  const handleRegenerate = () => {
    handleGenerate();
  };

  const scenarios = [
    { value: 'followUp', label: t('ai.contentGenerator.scenarios.followUp') },
    { value: 'meetingRequest', label: t('ai.contentGenerator.scenarios.meetingRequest') },
    { value: 'thankYou', label: t('ai.contentGenerator.scenarios.thankYou') },
    { value: 'proposal', label: t('ai.contentGenerator.scenarios.proposal') },
  ];

  return (
    <Card
      size="small"
      title={
        <Space>
          <SendOutlined style={{ color: colors.primary }} />
          <span>{t('ai.contentGenerator.title')}</span>
        </Space>
      }
      styles={{ body: { padding: 16 } }}
    >
      {/* Scenario Selector */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          {t('ai.contentGenerator.selectScenario')}
        </Text>
        <Space.Compact style={{ width: '100%' }}>
          <Select
            value={scenario}
            onChange={setScenario}
            style={{ width: 'calc(100% - 100px)' }}
            options={scenarios}
          />
          <Button
            type="primary"
            onClick={handleGenerate}
            loading={isGenerating || isTyping}
          >
            {t('ai.contentGenerator.generate')}
          </Button>
        </Space.Compact>
      </div>

      {/* Generated Content */}
      {(displayedContent || isGenerating) && (
        <div
          style={{
            background: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            borderRadius: 6,
            padding: 16,
            marginBottom: 16,
          }}
        >
          {isGenerating && !displayedContent ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <Paragraph
              style={{
                fontSize: 13,
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                fontFamily: "'Inter', sans-serif",
                margin: 0,
                minHeight: 200,
              }}
            >
              {displayedContent}
              {isTyping && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
            </Paragraph>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {generated && (
        <Space>
          <Button icon={<CopyOutlined />} onClick={handleCopy}>
            {t('ai.contentGenerator.copy')}
          </Button>
          <Button icon={<EditOutlined />}>{t('ai.contentGenerator.edit')}</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRegenerate}>
            {t('ai.contentGenerator.regenerate')}
          </Button>
        </Space>
      )}

      {/* Empty State */}
      {!displayedContent && !isGenerating && (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: colors.text.tertiary,
          }}
        >
          <SendOutlined style={{ fontSize: 32, marginBottom: 8 }} />
          <Text type="secondary" style={{ display: 'block' }}>
            Select a scenario and click Generate to create content
          </Text>
        </div>
      )}
    </Card>
  );
};

export default ContentGeneratorAI;