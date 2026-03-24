/**
 * 销售漏斗 Dashlet 组件
 */
import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { FunnelChart } from '../Charts/FunnelChart';
import { FunnelData } from '../../types/dashboard';

interface FunnelDashletProps {
  data: FunnelData[];
}

export const FunnelDashlet: React.FC<FunnelDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Card title={t('dashboard.funnel.title')} bordered={false} size="small" style={{ height: '100%' }}>
      <FunnelChart data={data} />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', marginRight: 24 }}>
          <div style={{ fontSize: 12, color: '#999' }}>{t('dashboard.funnel.totalOpportunities')}</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>{data.reduce((sum, item) => sum + item.count, 0)}</div>
        </div>
        <div style={{ display: 'inline-block' }}>
          <div style={{ fontSize: 12, color: '#999' }}>{t('dashboard.funnel.totalAmount')}</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>¥{(data.reduce((sum, item) => sum + item.amount, 0) / 10000).toFixed(0)}{t('dashboard.funnel.wan')}</div>
        </div>
      </div>
    </Card>
  );
};

export default FunnelDashlet;