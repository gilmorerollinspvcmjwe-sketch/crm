/**
 * 销售漏斗 Dashlet 组件
 */

import React from 'react';
import { Card } from 'antd';
import { FunnelChart } from '../Charts/FunnelChart';
import { FunnelData } from '../../types/dashboard';

interface FunnelDashletProps {
  data: FunnelData[];
}

export const FunnelDashlet: React.FC<FunnelDashletProps> = ({ data }) => {
  return (
    <Card
      title="销售漏斗概览"
      bordered={false}
      size="small"
      style={{ height: '100%' }}
    >
      <FunnelChart data={data} />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', marginRight: 24 }}>
          <div style={{ fontSize: 12, color: '#999' }}>总商机数</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
            {data.reduce((sum, item) => sum + item.count, 0)}
          </div>
        </div>
        <div style={{ display: 'inline-block' }}>
          <div style={{ fontSize: 12, color: '#999' }}>总金额</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
            ¥{(data.reduce((sum, item) => sum + item.amount, 0) / 10000).toFixed(0)}万
          </div>
        </div>
      </div>
    </Card>
  );
};
