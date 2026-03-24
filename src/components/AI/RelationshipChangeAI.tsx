/**
 * RelationshipChangeAI Component
 * Simulates AI detection of relationship changes with health score
 */
import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Tag, Timeline, Progress, Badge, Skeleton } from 'antd';
import {
  HeartOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

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

// Mock data
const mockRelationshipData: RelationshipData = {
  healthScore: 72,
  trend: 'declining',
  changeIndicators: [
    { type: 'decline', metric: 'Response Rate', value: '-23%', trend: 'down' },
    { type: 'decline', metric: 'Meeting Frequency', value: '-15%', trend: 'down' },
    { type: 'stagnant', metric: 'Deal Progress', value: 'No change', trend: 'stable' },
    { type: 'improvement', metric: 'Email Opens', value: '+8%', trend: 'up' },
  ],
  alertTimeline: [
    { date: '2026-03-20', type: 'warning', message: 'No response from primary contact in 7 days' },
    { date: '2026-03-15', type: 'warning', message: 'Meeting rescheduled twice by customer' },
    { date: '2026-03-10', type: 'info', message: 'New stakeholder joined the evaluation team' },
    { date: '2026-03-01', type: 'success', message: 'Product demo completed successfully' },
  ],
};

interface RelationshipChangeAIProps {
  customerId?: string;
}

export const RelationshipChangeAI: React.FC<RelationshipChangeAIProps> = ({ customerId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RelationshipData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setData(mockRelationshipData);
      setLoading(false);
    }, 500);
  }, [customerId]);

  if (loading) {
    return (
      <Card size="small" styles={{ body: { padding: 16 } }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.danger;
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Needs Attention';
    return 'At Risk';
  };

  const getIndicatorIcon = (trend: string) => {
    if (trend === 'down') return <ArrowDownOutlined style={{ color: colors.danger }} />;
    if (trend === 'up') return <ArrowUpOutlined style={{ color: colors.success }} />;
    return <CheckCircleOutlined style={{ color: colors.text.tertiary }} />;
  };

  const getIndicatorColor = (type: string) => {
    if (type === 'decline') return colors.danger;
    if (type === 'improvement') return colors.success;
    return colors.text.tertiary;
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <HeartOutlined style={{ color: colors.danger }} />
          <span>{t('ai.relationshipChange.title')}</span>
          {data?.trend === 'declining' && (
            <Badge status="warning" text={<Text type="warning">Declining</Text>} />
          )}
        </Space>
      }
      styles={{ body: { padding: 16 } }}
    >
      {/* Health Score Gauge */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
          {t('ai.relationshipChange.healthScore')}
        </Text>
        <Progress
          type="dashboard"
          percent={data?.healthScore || 0}
          size={100}
          strokeColor={getHealthColor(data?.healthScore || 0)}
          format={(percent) => (
            <div>
              <span style={{ fontSize: 24, fontWeight: 600 }}>{percent}</span>
              <span style={{ fontSize: 12 }}>/100</span>
            </div>
          )}
        />
        <div style={{ marginTop: 8 }}>
          <Tag color={getHealthColor(data?.healthScore || 0)}>
            {getHealthLabel(data?.healthScore || 0)}
          </Tag>
          {data?.trend === 'declining' && (
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
              <ArrowDownOutlined /> Down 8 points from last month
            </Text>
          )}
        </div>
      </div>

      {/* Change Indicators */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          {t('ai.relationshipChange.changeIndicators')}
        </Text>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          {data?.changeIndicators.map((indicator, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: colors.background.default,
                borderRadius: 6,
              }}
            >
              <Space>
                {getIndicatorIcon(indicator.trend)}
                <Text style={{ fontSize: 13 }}>{indicator.metric}</Text>
              </Space>
              <Text
                strong
                style={{
                  fontSize: 13,
                  color: getIndicatorColor(indicator.type),
                }}
              >
                {indicator.value}
              </Text>
            </div>
          ))}
        </Space>
      </div>

      {/* Alert Timeline */}
      <div>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          {t('ai.relationshipChange.alertTimeline')}
        </Text>
        <Timeline
          items={data?.alertTimeline.map((event) => ({
            color:
              event.type === 'warning'
                ? colors.warning
                : event.type === 'success'
                  ? colors.success
                  : colors.info,
            children: (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(event.date).format('MMM DD')}
                </Text>
                <br />
                <Text style={{ fontSize: 13 }}>{event.message}</Text>
              </div>
            ),
          }))}
        />
      </div>
    </Card>
  );
};

export default RelationshipChangeAI;