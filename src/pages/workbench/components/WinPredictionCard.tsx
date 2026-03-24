/**
 * 赢单预测卡片组件
 */
import React from 'react';
import { Card, Progress, Tag, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { WinPrediction } from '../../../mock/workbench';

const { Text } = Typography;

interface WinPredictionCardProps {
  prediction: WinPrediction;
  onClick?: (prediction: WinPrediction) => void;
}

const stageColors: Record<string, string> = {
  lead: '#d9d9d9',
  qualify: '#1890ff',
  proposal: '#faad14',
  negotiation: '#f5222d',
  closed: '#52c41a',
};

const stageTexts: Record<string, string> = {
  lead: '初步接触',
  qualify: '需求确认',
  proposal: '方案报价',
  negotiation: '谈判审批',
  closed: '已成交',
};

export const WinPredictionCard: React.FC<WinPredictionCardProps> = ({ prediction, onClick }) => {
  const { t } = useTranslation();

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return '#52c41a';
    if (probability >= 0.5) return '#faad14';
    return '#f5222d';
  };

  const handleClick = () => {
    if (onClick) onClick(prediction);
  };

  return (
    <Card hoverable onClick={handleClick} style={{ width: '100%', height: '100%', cursor: 'pointer', transition: 'transform 0.3s' }} bodyStyle={{ padding: '12px' }}>
      <Space direction="vertical" size={4} style={{ width: '100%' }} align="center">
        <Text strong ellipsis style={{ fontSize: 13, width: '100%', textAlign: 'center' }} title={prediction.customerName}>
          {prediction.customerName}
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4px 0' }}>
          <Progress type="circle" percent={Math.round(prediction.winProbability * 100)} strokeColor={getProbabilityColor(prediction.winProbability)} size={48} strokeWidth={12} format={(percent) => <span style={{ fontSize: 12, fontWeight: 'bold' }}>{percent}</span>} />
        </div>
        <Tag color={stageColors[prediction.stage]} style={{ fontSize: 11, margin: 0, padding: '0 6px', lineHeight: '16px', height: 16 }}>
          {stageTexts[prediction.stage]}
        </Tag>
        <Text type="secondary" style={{ fontSize: 11 }}>
          ¥{(prediction.amount / 10000).toFixed(0)}万
        </Text>
        <Tag color={prediction.winProbability >= 0.7 ? 'success' : prediction.winProbability >= 0.5 ? 'processing' : 'warning'} style={{ fontSize: 11, marginTop: 4, width: '100%', textAlign: 'center', padding: '0 6px', lineHeight: '16px', height: 16 }}>
          {prediction.recommendation}
        </Tag>
      </Space>
    </Card>
  );
};

export default WinPredictionCard;