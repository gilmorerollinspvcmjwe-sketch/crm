/**
 * SmartSuggestionsAI Component
 * Simulates AI-generated smart suggestions with priority ranking
 */
import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Tag, Button, Skeleton, Tooltip } from 'antd';
import {
  BulbOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

const { Text, Paragraph } = Typography;

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

// Mock suggestions
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    priority: 'P0',
    title: 'Schedule Follow-up Meeting',
    description:
      'Customer has not been contacted in 45 days. Schedule a check-in call to maintain relationship.',
    impact: 'Prevent customer churn, maintain engagement',
    action: 'Schedule Meeting',
  },
  {
    id: '2',
    priority: 'P0',
    title: 'Review Stalled Opportunity',
    description:
      'The "Enterprise ERP" opportunity has been in the same stage for 32 days. Consider escalation.',
    impact: 'Unblock deal progression',
    action: 'Review Deal',
  },
  {
    id: '3',
    priority: 'P1',
    title: 'Send Product Update',
    description:
      'New feature release aligns with customer\'s expressed needs. Share the announcement.',
    impact: 'Demonstrate value, increase engagement',
    action: 'Send Email',
  },
  {
    id: '4',
    priority: 'P1',
    title: 'Invite to Webinar',
    description:
      'Customer matches target profile for upcoming "Digital Transformation" webinar.',
    impact: 'Engagement opportunity, brand awareness',
    action: 'Send Invite',
  },
  {
    id: '5',
    priority: 'P2',
    title: 'Update Contact Information',
    description:
      'Some contact records haven\'t been updated in 90 days. Verify accuracy.',
    impact: 'Data hygiene, better outreach',
    action: 'Update Contacts',
  },
];

interface SmartSuggestionsAIProps {
  customerId?: string;
  onAction?: (suggestionId: string, action: string) => void;
}

export const SmartSuggestionsAI: React.FC<SmartSuggestionsAIProps> = ({
  customerId,
  onAction,
}) => {
  const { t } = useTranslation();
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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'P0':
        return {
          color: colors.danger,
          bg: '#FFEBEE',
          label: t('ai.smartSuggestions.priority.P0'),
          icon: <ThunderboltOutlined />,
        };
      case 'P1':
        return {
          color: colors.warning,
          bg: '#FFF3E0',
          label: t('ai.smartSuggestions.priority.P1'),
          icon: <ClockCircleOutlined />,
        };
      default:
        return {
          color: colors.info,
          bg: '#E1F5FE',
          label: t('ai.smartSuggestions.priority.P2'),
          icon: <BulbOutlined />,
        };
    }
  };

  if (loading) {
    return (
      <Card size="small" styles={{ body: { padding: 16 } }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  const visibleSuggestions = suggestions.filter((s) => !s.dismissed && !s.completed);

  if (visibleSuggestions.length === 0) {
    return (
      <Card
        size="small"
        title={
          <Space>
            <BulbOutlined style={{ color: colors.primary }} />
            <span>{t('ai.smartSuggestions.title')}</span>
          </Space>
        }
        styles={{ body: { padding: 16, textAlign: 'center' } }}
      >
        <CheckOutlined style={{ fontSize: 32, color: colors.success, marginBottom: 8 }} />
        <Text type="secondary">All suggestions completed!</Text>
      </Card>
    );
  }

  return (
    <Card
      size="small"
      title={
        <Space>
          <BulbOutlined style={{ color: colors.primary }} />
          <span>{t('ai.smartSuggestions.title')}</span>
          <Tag color={colors.primary}>{visibleSuggestions.length}</Tag>
        </Space>
      }
      styles={{ body: { padding: '8px 0' } }}
    >
      {visibleSuggestions.map((suggestion, index) => {
        const priorityConfig = getPriorityConfig(suggestion.priority);
        return (
          <div
            key={suggestion.id}
            style={{
              padding: '12px 16px',
              borderBottom:
                index < visibleSuggestions.length - 1 ? `1px solid ${colors.border.light}` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <Tag
                style={{
                  background: priorityConfig.bg,
                  color: priorityConfig.color,
                  border: 'none',
                  fontWeight: 500,
                }}
              >
                {priorityConfig.icon} {priorityConfig.label}
              </Tag>
            </div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
              {suggestion.title}
            </Text>
            <Paragraph
              style={{
                fontSize: 13,
                color: colors.text.secondary,
                marginBottom: 8,
              }}
            >
              {suggestion.description}
            </Paragraph>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('ai.smartSuggestions.impact')}: {suggestion.impact}
              </Text>
              <Space size={4}>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleDismiss(suggestion.id)}
                />
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleAction(suggestion)}
                >
                  {t('ai.smartSuggestions.takeAction')}
                  <RightOutlined style={{ marginLeft: 4, fontSize: 10 }} />
                </Button>
              </Space>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default SmartSuggestionsAI;