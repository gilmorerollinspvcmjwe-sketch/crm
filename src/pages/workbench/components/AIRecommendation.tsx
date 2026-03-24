/**
 * AI 推荐组件
 * 包含赢单预测和重点客户
 */
import React, { useState } from 'react';
import { Card, Space, Typography, Row, Col, Button, Divider } from 'antd';
import { ThunderboltOutlined, StarOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { WinPredictionCard } from './WinPredictionCard';
import type { WinPrediction, KeyCustomer } from '../../../mock/workbench';

const { Title, Text, Paragraph } = Typography;

interface AIRecommendationProps {
  winPredictions: WinPrediction[];
  keyCustomers: KeyCustomer[];
  onPredictionClick?: (prediction: WinPrediction) => void;
  onCustomerClick?: (customer: KeyCustomer) => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  winPredictions,
  keyCustomers,
  onPredictionClick,
  onCustomerClick,
}) => {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<WinPrediction[]>(winPredictions);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  const handleRefresh = () => {
    const shuffled = [...predictions].sort(() => Math.random() - 0.5);
    setPredictions(shuffled);
    console.log(t('workbench.ai.refreshRecommendation'));
  };

  const handleKeyCustomerClick = (customer: KeyCustomer) => {
    if (onCustomerClick) {
      onCustomerClick(customer);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    setExpandedCustomerId(expandedCustomerId === customerId ? null : customerId);
  };

  const handleKeyCustomerAction = (e: React.MouseEvent, action: string, customer: KeyCustomer) => {
    e.stopPropagation();
    console.log(`${action}:`, customer);
    if (action === t('workbench.ai.viewDetail')) {
      handleKeyCustomerClick(customer);
    }
  };

  return (
    <Card
      title={
        <Space>
          <span>💡</span>
          <span>{t('workbench.ai.intelligentRecommendation')}</span>
        </Space>
      }
      bordered={false}
      extra={
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          style={{ padding: '4px 8px' }}
        >
          {t('workbench.ai.refresh')}
        </Button>
      }
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div>
          <Space style={{ marginBottom: 8 }}>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            <Title level={5} style={{ margin: 0 }}>
              📊 {t('workbench.ai.winPrediction')}
            </Title>
          </Space>
          <Row gutter={[8, 8]}>
            {predictions.map((prediction) => (
              <Col xs={12} sm={8} md={6} key={prediction.opportunityId}>
                <WinPredictionCard
                  prediction={prediction}
                  onClick={onPredictionClick}
                />
              </Col>
            ))}
          </Row>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Space style={{ marginBottom: 8 }}>
            <StarOutlined style={{ color: '#f5222d' }} />
            <Title level={5} style={{ margin: 0 }}>
              🎯 {t('workbench.ai.keyCustomers')}
            </Title>
          </Space>
          {keyCustomers.map((customer) => {
            const isExpanded = expandedCustomerId === customer.customerId;
            return (
              <Card
                key={customer.customerId}
                size="small"
                hoverable
                onClick={() => handleKeyCustomerClick(customer)}
                style={{ borderColor: '#ff4d4f', borderWidth: 1, cursor: 'pointer', marginBottom: 8 }}
                bodyStyle={{ padding: '12px' }}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 14 }}>{customer.name}</Text>
                    <Button
                      type="text"
                      size="small"
                      icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                      onClick={(e) => handleToggleExpand(e, customer.customerId)}
                      style={{ padding: '0 4px' }}
                    />
                  </Space>
                  <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }} ellipsis={!isExpanded ? { rows: 1 } : false}>
                    {t('workbench.ai.reason')}：{customer.reason}
                  </Paragraph>
                  {isExpanded && (
                    <>
                      <Paragraph type="secondary" style={{ fontSize: 12, margin: '4px 0' }}>
                        {t('workbench.ai.suggestedAction')}：{customer.suggestedAction}
                      </Paragraph>
                      <Space size="small" style={{ marginTop: 4 }}>
                        <Button type="primary" size="small" onClick={(e) => handleKeyCustomerAction(e, '一键拨号', customer)}>
                          📞 {t('workbench.ai.call')}
                        </Button>
                        <Button size="small" onClick={(e) => handleKeyCustomerAction(e, '创建报价', customer)}>
                          📄 {t('workbench.ai.quote')}
                        </Button>
                      </Space>
                    </>
                  )}
                </Space>
              </Card>
            );
          })}
        </div>
      </Space>
    </Card>
  );
};

export default AIRecommendation;