/**
 * 业绩完成情况 Dashlet 组件
 */

import React from 'react';
import { Card, Progress, Statistic } from 'antd';
import { PerformanceData } from '../../types/dashboard';

interface PerformanceDashletProps {
  data: PerformanceData;
}

export const PerformanceDashlet: React.FC<PerformanceDashletProps> = ({ data }) => {
  const getStatusColor = (rate: number) => {
    if (rate >= 80) return '#52c41a';
    if (rate >= 60) return '#faad14';
    return '#f5222d';
  };

  const getStatusText = (rate: number) => {
    if (rate >= 80) return '优秀';
    if (rate >= 60) return '良好';
    if (rate >= 40) return '一般';
    return '待提升';
  };

  return (
    <Card
      title="本月业绩完成情况"
      bordered={false}
      size="small"
      style={{ height: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Statistic
          title="完成率"
          value={data.rate}
          suffix="%"
          valueStyle={{
            color: getStatusColor(data.rate),
            fontSize: '36px',
            fontWeight: 'bold',
          }}
        />
        <div style={{ marginTop: 8, color: getStatusColor(data.rate) }}>
          {getStatusText(data.rate)}
        </div>
      </div>

      <Progress
        type="dashboard"
        percent={data.rate}
        strokeColor={getStatusColor(data.rate)}
        format={() => ''}
        style={{ marginBottom: 24 }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>目标</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
            ¥{(data.target / 10000).toFixed(0)}万
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>已完成</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
            ¥{(data.actual / 10000).toFixed(0)}万
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>剩余</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#faad14' }}>
            ¥{(data.remaining / 10000).toFixed(0)}万
          </div>
        </div>
      </div>
    </Card>
  );
};
