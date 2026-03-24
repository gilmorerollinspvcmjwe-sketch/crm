/**
 * CustomerSummaryAI Component
 * Simulates AI-generated customer summary with typewriter effect
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Space, Spin, Typography, Divider, Tag, Skeleton } from 'antd';
import {
  ReloadOutlined,
  BulbOutlined,
  WarningOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

const { Text, Paragraph } = Typography;

interface CustomerSummary {
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
  const { t } = useTranslation();
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
      <Card
        size="small"
        title={
          <Space>
            <BulbOutlined style={{ color: colors.primary }} />
            <span>{t('ai.customerSummary.title')}</span>
          </Space>
        }
        styles={{ body: { padding: 16 } }}
      >
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  return (
    <Card
      size="small"
      title={
        <Space>
          <BulbOutlined style={{ color: colors.primary }} />
          <span>{t('ai.customerSummary.title')}</span>
        </Space>
      }
      extra={
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined spin={isTyping} />}
          onClick={handleRefresh}
          disabled={isTyping}
        >
          {t('ai.customerSummary.refresh')}
        </Button>
      }
      styles={{ body: { padding: 16 } }}
    >
      {/* Main summary with typewriter effect */}
      <Paragraph
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: colors.text.primary,
          marginBottom: 16,
          minHeight: 60,
        }}
      >
        {displayedText}
        {isTyping && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
      </Paragraph>

      <Divider style={{ margin: '12px 0' }} />

      {/* Key Highlights */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ color: colors.success, fontSize: 13 }}>
          <TrophyOutlined style={{ marginRight: 4 }} />
          {t('ai.customerSummary.sections.highlights')}
        </Text>
        <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
          {summary?.highlights.map((item, index) => (
            <li key={index} style={{ fontSize: 13, color: colors.text.secondary, marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Factors */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ color: colors.danger, fontSize: 13 }}>
          <WarningOutlined style={{ marginRight: 4 }} />
          {t('ai.customerSummary.sections.risks')}
        </Text>
        <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
          {summary?.risks.map((item, index) => (
            <li key={index} style={{ fontSize: 13, color: colors.text.secondary, marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ color: colors.info, fontSize: 13 }}>
          <BulbOutlined style={{ marginRight: 4 }} />
          {t('ai.customerSummary.sections.opportunities')}
        </Text>
        <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
          {summary?.opportunities.map((item, index) => (
            <li key={index} style={{ fontSize: 13, color: colors.text.secondary, marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Actions */}
      <div>
        <Text strong style={{ color: colors.primary, fontSize: 13 }}>
          <ThunderboltOutlined style={{ marginRight: 4 }} />
          {t('ai.customerSummary.sections.actions')}
        </Text>
        <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
          {summary?.actions.map((item, index) => (
            <li key={index} style={{ fontSize: 13, color: colors.text.secondary, marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default CustomerSummaryAI;