/**
 * InteractionAnalysisAI Component
 * Simulates AI analysis of recent interactions with visualizations
 */
import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Tag, Progress, Row, Col, Skeleton, Select } from 'antd';
import {
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

const { Text, Title } = Typography;

interface InteractionData {
  sentimentScore: number;
  keyTopics: { name: string; count: number }[];
  frequency: { week: string; count: number }[];
  channelBreakdown: { channel: string; count: number }[];
}

// Mock data for interaction analysis
const mockInteractionData: InteractionData = {
  sentimentScore: 72,
  keyTopics: [
    { name: 'Pricing', count: 8 },
    { name: 'Integration', count: 6 },
    { name: 'Support', count: 5 },
    { name: 'Timeline', count: 4 },
    { name: 'Features', count: 3 },
    { name: 'Contract', count: 3 },
    { name: 'Demo', count: 2 },
  ],
  frequency: [
    { week: 'Week 1', count: 5 },
    { week: 'Week 2', count: 8 },
    { week: 'Week 3', count: 4 },
    { week: 'Week 4', count: 6 },
  ],
  channelBreakdown: [
    { channel: 'Email', count: 12 },
    { channel: 'Phone', count: 8 },
    { channel: 'Meeting', count: 5 },
    { channel: 'Chat', count: 3 },
  ],
};

interface InteractionAnalysisAIProps {
  customerId?: string;
}

export const InteractionAnalysisAI: React.FC<InteractionAnalysisAIProps> = ({ customerId }) => {
  const { t } = useTranslation();
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

  if (loading) {
    return (
      <Card size="small" styles={{ body: { padding: 16 } }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  const getSentimentColor = (score: number) => {
    if (score >= 70) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.danger;
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Positive';
    if (score >= 50) return 'Neutral';
    return 'Negative';
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <MessageOutlined style={{ color: colors.primary }} />
          <span>{t('ai.interactionAnalysis.title')}</span>
        </Space>
      }
      extra={
        <Select
          value={filter}
          onChange={setFilter}
          size="small"
          style={{ width: 100 }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'meeting', label: 'Meeting' },
          ]}
        />
      }
      styles={{ body: { padding: 16 } }}
    >
      {/* Sentiment Score */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          {t('ai.interactionAnalysis.sentimentScore')}
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Progress
            type="dashboard"
            percent={data?.sentimentScore || 0}
            size={80}
            strokeColor={getSentimentColor(data?.sentimentScore || 0)}
            format={(percent) => (
              <span style={{ fontSize: 20, fontWeight: 600 }}>{percent}</span>
            )}
          />
          <div>
            <Tag color={getSentimentColor(data?.sentimentScore || 0)}>
              {getSentimentLabel(data?.sentimentScore || 0)}
            </Tag>
            <div style={{ marginTop: 4 }}>
              {data?.sentimentScore && data.sentimentScore >= 70 ? (
                <Space size={4}>
                  <LikeOutlined style={{ color: colors.success }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Customer is responsive and engaged
                  </Text>
                </Space>
              ) : (
                <Space size={4}>
                  <DislikeOutlined style={{ color: colors.warning }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    May need more attention
                  </Text>
                </Space>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Topics */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          {t('ai.interactionAnalysis.keyTopics')}
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data?.keyTopics.map((topic, index) => {
            const size = Math.max(12, Math.min(16, 12 + topic.count));
            return (
              <Tag
                key={index}
                style={{
                  fontSize: size,
                  padding: '2px 8px',
                  background: colors.primarySubtle,
                  border: 'none',
                }}
              >
                {topic.name}
                <span style={{ marginLeft: 4, color: colors.text.tertiary }}>
                  ({topic.count})
                </span>
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Channel Breakdown */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          Channel Breakdown
        </Text>
        <Row gutter={[8, 8]}>
          {data?.channelBreakdown.map((item, index) => {
            const icon =
              item.channel === 'Email' ? (
                <MailOutlined />
              ) : item.channel === 'Phone' ? (
                <PhoneOutlined />
              ) : item.channel === 'Meeting' ? (
                <CalendarOutlined />
              ) : (
                <MessageOutlined />
              );
            return (
              <Col span={12} key={index}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: colors.background.default,
                    borderRadius: 6,
                  }}
                >
                  <span style={{ color: colors.primary }}>{icon}</span>
                  <Text style={{ fontSize: 13 }}>{item.channel}</Text>
                  <Text strong style={{ marginLeft: 'auto', color: colors.primary }}>
                    {item.count}
                  </Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Communication Frequency */}
      <div>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
          {t('ai.interactionAnalysis.frequency')}
        </Text>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60 }}>
          {data?.frequency.map((item, index) => {
            const maxCount = Math.max(...(data?.frequency.map((f) => f.count) || []));
            const height = (item.count / maxCount) * 100;
            return (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, ${colors.primary}, ${colors.primary}cc)`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 8,
                    transition: 'height 0.3s ease',
                  }}
                />
                <Text
                  type="secondary"
                  style={{ fontSize: 11, display: 'block', marginTop: 4 }}
                >
                  {item.week}
                </Text>
                <Text style={{ fontSize: 12 }}>{item.count}</Text>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InteractionAnalysisAI;