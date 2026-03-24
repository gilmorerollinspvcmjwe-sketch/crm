/**
 * 个人业绩组件
 */

import React from 'react';
import { Card, Progress, Space, Typography, Button } from 'antd';
import {
  TrophyOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { PerformanceData } from '../../../mock/workbench';

const { Title, Text } = Typography;

interface PerformanceProps {
  performance: PerformanceData;
  onViewDetail?: () => void;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount.toFixed(0)}`;
};

export const Performance: React.FC<PerformanceProps> = ({ 
  performance,
  onViewDetail,
}) => {
  const monthProgress =
    (performance.thisMonth.amount / performance.thisMonth.target) * 100;
  const weekProgress =
    (performance.thisWeek.amount / performance.thisWeek.target) * 100;
  const todayProgress =
    (performance.today.amount / performance.today.target) * 100;

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return '#52c41a';
    if (percent >= 80) return '#faad14';
    return '#1890ff';
  };

  return (
    <Card
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <span>📈</span>
            <span>我的业绩</span>
          </Space>
          <Button 
            type="link" 
            size="small" 
            onClick={onViewDetail}
            style={{ padding: '0 4px', fontSize: 12 }}
          >
            详情 <RightOutlined />
          </Button>
        </Space>
      }
      bordered={false}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {/* 本月业绩 - 主要指标 */}
        <div>
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 4,
            }}
          >
            <Text strong style={{ fontSize: 13 }}>本月</Text>
            <Text strong style={{ color: '#faad14', fontSize: 13 }}>
              <TrophyOutlined /> 第{performance.thisMonth.rank}名
            </Text>
          </Space>
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              {formatCurrency(performance.thisMonth.amount)}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              目标：{formatCurrency(performance.thisMonth.target)}
            </Text>
          </Space>
          <Progress
            percent={Math.round(monthProgress)}
            strokeColor={getProgressColor(monthProgress)}
            size={[null, 10]}
            format={(percent) => `${percent}%`}
          />
        </div>

        {/* 本周业绩 */}
        <div>
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 4,
            }}
          >
            <Text strong style={{ fontSize: 12 }}>本周</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatCurrency(performance.thisWeek.amount)} /{' '}
              {formatCurrency(performance.thisWeek.target)}
            </Text>
          </Space>
          <Progress
            percent={Math.round(weekProgress)}
            strokeColor={getProgressColor(weekProgress)}
            size={[null, 6]}
            format={(percent) => `${percent}%`}
          />
        </div>

        {/* 今日业绩 */}
        <div>
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 4,
            }}
          >
            <Text strong style={{ fontSize: 12 }}>今日</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatCurrency(performance.today.amount)} /{' '}
              {formatCurrency(performance.today.target)}
            </Text>
          </Space>
          <Progress
            percent={Math.round(todayProgress)}
            strokeColor={getProgressColor(todayProgress)}
            size={[null, 6]}
            format={(percent) => `${percent}%`}
          />
        </div>
      </Space>
    </Card>
  );
};
