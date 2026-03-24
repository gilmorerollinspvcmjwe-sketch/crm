/**
 * 新增线索趋势 Dashlet 组件
 */

import React from 'react';
import { Card } from 'antd';
import { LineChart } from '../Charts/LineChart';
import { LeadTrendData } from '../../types/dashboard';

interface LeadTrendDashletProps {
  data: LeadTrendData[];
}

export const LeadTrendDashlet: React.FC<LeadTrendDashletProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    month: item.month.slice(5), // 只显示月份
    count: item.count,
    converted: item.converted,
  }));

  const totalLeads = data.reduce((sum, item) => sum + item.count, 0);
  const totalConverted = data.reduce((sum, item) => sum + item.converted, 0);
  const conversionRate = ((totalConverted / totalLeads) * 100).toFixed(1);

  return (
    <Card
      title="新增线索趋势"
      bordered={false}
      size="small"
      style={{ height: '100%' }}
    >
      <LineChart
        data={chartData}
        dataKeys={[
          { key: 'count', name: '新增线索', color: '#1890ff' },
          { key: 'converted', name: '转化线索', color: '#52c41a' },
        ]}
        height={200}
      />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>12 月总计</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
            {totalLeads}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>转化总数</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
            {totalConverted}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>转化率</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#faad14' }}>
            {conversionRate}%
          </div>
        </div>
      </div>
    </Card>
  );
};
