/**
 * 客户行业分布 Dashlet 组件
 */
import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { PieChart } from '../Charts/PieChart';
import { CustomerDistData } from '../../types/dashboard';

interface CustomerDistDashletProps {
  data: CustomerDistData[];
}

export const CustomerDistDashlet: React.FC<CustomerDistDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    name: item.industry,
    value: item.count,
    percentage: item.percentage,
  }));

  const totalCustomers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card title={t('dashboard.customerDist.title')} bordered={false} size="small" style={{ height: '100%' }}>
      <PieChart data={chartData} height={200} innerRadius={50} outerRadius={80} valueFormatter={(value) => value.toString()} />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#999' }}>{t('dashboard.customerDist.totalCustomers')}</div>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>{totalCustomers}</div>
      </div>
    </Card>
  );
};

export default CustomerDistDashlet;