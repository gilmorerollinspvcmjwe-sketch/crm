/**
 * RiskAlertAI Component
 * Simulates AI-powered risk alerts and warnings
 */
import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Tag, Button, Skeleton, Alert, Collapse } from 'antd';
import {
  WarningOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

const { Text, Paragraph } = Typography;

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
    title: 'Customer Churn Risk',
    reason:
      'No engagement in the last 45 days. Primary contact Sarah Chen has not responded to 3 follow-up emails.',
    suggestedAction:
      'Immediate outreach required. Consider executive escalation or alternative contact strategy.',
    details:
      'Last activity: Feb 8, 2026. Email open rate dropped from 65% to 12%. Previous similar cases resulted in 78% churn.',
  },
  {
    id: '2',
    level: 'high',
    title: 'Deal Stagnation Alert',
    reason:
      'Opportunity "Enterprise ERP System" has been stuck in Negotiation stage for 32 days without progress.',
    suggestedAction:
      'Schedule deal review meeting. Investigate potential blockers with customer procurement team.',
    details: 'Expected close date: Mar 31, 2026. Probability: 75%. Deal value: $800K.',
  },
  {
    id: '3',
    level: 'medium',
    title: 'Budget Cycle Risk',
    reason:
      'Customer fiscal year ends in 60 days. Budget allocation may shift if deal is not closed in time.',
    suggestedAction:
      'Accelerate proposal timeline. Offer Q1 incentives to encourage early commitment.',
  },
];

interface RiskAlertAIProps {
  customerId?: string;
  onAction?: (riskId: string) => void;
}

export const RiskAlertAI: React.FC<RiskAlertAIProps> = ({ customerId, onAction }) => {
  const { t } = useTranslation();
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
          color: colors.danger,
          bg: '#FFEBEE',
          icon: <ExclamationCircleOutlined />,
          label: t('ai.riskAlert.level.high'),
        };
      case 'medium':
        return {
          color: colors.warning,
          bg: '#FFF3E0',
          icon: <WarningOutlined />,
          label: t('ai.riskAlert.level.medium'),
        };
      default:
        return {
          color: colors.info,
          bg: '#E1F5FE',
          icon: <InfoCircleOutlined />,
          label: t('ai.riskAlert.level.low'),
        };
    }
  };

  const handleAction = (riskId: string) => {
    onAction?.(riskId);
  };

  if (loading) {
    return (
      <Card size="small" styles={{ body: { padding: 16 } }}>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  const highRisks = risks.filter((r) => r.level === 'high');
  const otherRisks = risks.filter((r) => r.level !== 'high');

  return (
    <Card
      size="small"
      title={
        <Space>
          <WarningOutlined style={{ color: colors.danger }} />
          <span>{t('ai.riskAlert.title')}</span>
          {highRisks.length > 0 && (
            <Tag color={colors.danger}>{highRisks.length} Critical</Tag>
          )}
        </Space>
      }
      styles={{ body: { padding: '8px 0' } }}
    >
      {risks.map((risk, index) => {
        const config = getRiskConfig(risk.level);
        return (
          <div
            key={risk.id}
            style={{
              padding: '12px 16px',
              borderBottom:
                index < risks.length - 1 ? `1px solid ${colors.border.light}` : 'none',
            }}
          >
            {/* Risk Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Tag
                style={{
                  background: config.bg,
                  color: config.color,
                  border: 'none',
                  fontWeight: 500,
                }}
              >
                {config.icon} {config.label}
              </Tag>
            </div>

            {/* Risk Title */}
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
              {risk.title}
            </Text>

            {/* Risk Reason */}
            <Paragraph
              style={{
                fontSize: 13,
                color: colors.text.secondary,
                marginBottom: 8,
              }}
            >
              {risk.reason}
            </Paragraph>

            {/* Suggested Action */}
            <div
              style={{
                background: colors.primarySubtle,
                padding: '8px 12px',
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <Space>
                <BulbOutlined style={{ color: colors.primary }} />
                <Text style={{ fontSize: 13 }}>
                  <strong>{t('ai.riskAlert.suggestedAction')}:</strong>{' '}
                  {risk.suggestedAction}
                </Text>
              </Space>
            </div>

            {/* Action Button */}
            <Button type="primary" size="small" onClick={() => handleAction(risk.id)}>
              Take Action <RightOutlined style={{ marginLeft: 4, fontSize: 10 }} />
            </Button>
          </div>
        );
      })}
    </Card>
  );
};

export default RiskAlertAI;