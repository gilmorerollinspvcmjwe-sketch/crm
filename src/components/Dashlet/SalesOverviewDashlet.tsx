/**
 * 销售数据概览 Dashlet 组件
 */
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface SalesOverviewData {
  todayLeads: number;
  conversionRate: number;
  pendingFollowUps: number;
  closedAmount: number;
  leadsTrend?: number;
  conversionTrend?: number;
  followUpTrend?: number;
  amountTrend?: number;
}

interface SalesOverviewDashletProps {
  data: SalesOverviewData;
}

export const SalesOverviewDashlet: React.FC<SalesOverviewDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Card title={t('dashboard.salesOverview.title')} bordered={false} size="small" style={{ height: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic title={t('dashboard.salesOverview.todayLeads')} value={data.todayLeads} suffix={t('dashboard.salesOverview.items')} valueStyle={{ fontSize: 24, color: '#1890ff' }} valueRender={(num) => (
            <span>
              {num}
              {data.leadsTrend !== undefined && (
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  {data.leadsTrend >= 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#f5222d' }} />}
                  {Math.abs(data.leadsTrend)}%
                </span>
              )}
            </span>
          )} />
        </Col>
        <Col span={12}>
          <Statistic title={t('dashboard.salesOverview.conversionRate')} value={data.conversionRate} suffix="%" precision={1} valueStyle={{ fontSize: 24, color: '#52c41a' }} valueRender={(num) => (
            <span>
              {num}
              {data.conversionTrend !== undefined && (
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  {data.conversionTrend >= 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#f5222d' }} />}
                  {Math.abs(data.conversionTrend)}%
                </span>
              )}
            </span>
          )} />
        </Col>
        <Col span={12}>
          <Statistic title={t('dashboard.salesOverview.pendingFollowUps')} value={data.pendingFollowUps} suffix={t('dashboard.salesOverview.items')} valueStyle={{ fontSize: 24, color: '#faad14' }} valueRender={(num) => (
            <span>
              {num}
              {data.followUpTrend !== undefined && (
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  {data.followUpTrend >= 0 ? <ArrowUpOutlined style={{ color: '#f5222d' }} /> : <ArrowDownOutlined style={{ color: '#52c41a' }} />}
                  {Math.abs(data.followUpTrend)}%
                </span>
              )}
            </span>
          )} />
        </Col>
        <Col span={12}>
          <Statistic title={t('dashboard.salesOverview.closedAmount')} value={data.closedAmount / 10000} suffix={t('dashboard.salesOverview.wan')} precision={1} valueStyle={{ fontSize: 24, color: '#722ed1' }} valueRender={(num) => (
            <span>
              {num}
              {data.amountTrend !== undefined && (
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  {data.amountTrend >= 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#f5222d' }} />}
                  {Math.abs(data.amountTrend)}%
                </span>
              )}
            </span>
          )} />
        </Col>
      </Row>
    </Card>
  );
};

export default SalesOverviewDashlet;