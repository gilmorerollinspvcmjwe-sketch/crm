/**
 * 新增线索趋势 Dashlet 组件
 */
import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { LineChart } from '../Charts/LineChart';
import { LeadTrendData } from '../../types/dashboard';

interface LeadTrendDashletProps {
  data: LeadTrendData[];
}

export const LeadTrendDashlet: React.FC<LeadTrendDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    month: item.month.slice(5),
    count: item.count,
    converted: item.converted,
  }));

  const totalLeads = data.reduce((sum, item) => sum + item.count, 0);
  const totalConverted = data.reduce((sum, item) => sum + item.converted, 0);
  const conversionRate = ((totalConverted / totalLeads) * 100).toFixed(1);

  return (
    <Card title={t('dashboard.leadTrend.title')} bordered={false} size="small" style={{ height: '100%' }}>
      <LineChart data={chartData} dataKeys={[{ key: 'count', name: t('dashboard.leadTrend.newLeads'), color: '#1890ff' }, { key: 'converted', name: t('dashboard.leadTrend.converted'), color: '#52c41a' }]} height={200} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>{t('dashboard.leadTrend.total12Months')}</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>{totalLeads}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>{t('dashboard.leadTrend.totalConverted')}</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>{totalConverted}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#999' }}>{t('dashboard.leadTrend.conversionRate')}</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#faad14' }}>{conversionRate}%</div>
        </div>
      </div>
    </Card>
  );
};

export default LeadTrendDashlet;