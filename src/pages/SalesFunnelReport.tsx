/**
 * 销售漏斗报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Space, Row, Col, Statistic, Progress, Table } from 'antd';
import { FunnelChart } from '../components/Charts/FunnelChart';
import { BarChart } from '../components/Charts/BarChart';
import { getSalesFunnelReport, formatAmount } from '../mock/reportData';
import { TimeRange } from '../types/report';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const SalesFunnelReport: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const report = getSalesFunnelReport(timeRange);

  const funnelTableColumns = [
    {
      title: t('report.funnel.columns.stage'),
      dataIndex: 'stage',
      key: 'stage',
      render: (_: any, record: any) => (
        <span>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: record.stageOrder === 1 ? '#1890ff' :
                record.stageOrder === 2 ? '#52c41a' :
                record.stageOrder === 3 ? '#faad14' :
                record.stageOrder === 4 ? '#f5222d' : '#722ed1',
              marginRight: 8,
            }}
          />
          {record.stage}
        </span>
      ),
    },
    {
      title: t('report.funnel.columns.opportunityCount'),
      dataIndex: 'opportunityCount',
      key: 'opportunityCount',
      sorter: (a: any, b: any) => a.opportunityCount - b.opportunityCount,
    },
    {
      title: t('report.funnel.columns.opportunityAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatAmount(amount),
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: t('report.funnel.columns.conversionRate'),
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 70 ? '#52c41a' : rate >= 50 ? '#faad14' : '#f5222d'}
          format={() => `${rate.toFixed(1)}%`}
        />
      ),
    },
  ];

  const conversionColumns = [
    {
      title: t('report.funnel.conversionColumns.fromStage'),
      dataIndex: 'fromStage',
      key: 'fromStage',
    },
    {
      title: t('report.funnel.conversionColumns.toStage'),
      dataIndex: 'toStage',
      key: 'toStage',
    },
    {
      title: t('report.funnel.conversionColumns.rate'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <span style={{
          fontWeight: 'bold',
          color: rate >= 70 ? '#52c41a' : rate >= 50 ? '#faad14' : '#f5222d',
        }}>
          {rate.toFixed(1)}%
        </span>
      ),
    },
  ];

  const totalAmount = report.funnelData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalCount = report.funnelData[0]?.opportunityCount || 0;
  const avgConversion = report.conversionRates.reduce((sum, item) => sum + item.rate, 0) / report.conversionRates.length;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>{t('report.funnel.title')}</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              {t('report.funnel.subtitle')}
            </p>
          </div>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 120 }}
          >
            <Option value="week">{t('report.funnel.timeRange.week')}</Option>
            <Option value="month">{t('report.funnel.timeRange.month')}</Option>
            <Option value="quarter">{t('report.funnel.timeRange.quarter')}</Option>
            <Option value="year">{t('report.funnel.timeRange.year')}</Option>
          </Select>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('report.funnel.totalOpportunities')}
              value={totalCount}
              suffix={t('common.unit.count')}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('report.funnel.totalAmount')}
              value={totalAmount / 10000}
              suffix={t('common.unit.tenThousand')}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('report.funnel.avgConversionRate')}
              value={avgConversion}
              suffix={t('common.unit.percent')}
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('report.funnel.funnelChart')} style={{ marginBottom: 16 }}>
        <FunnelChart data={report.funnelData} />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={t('report.funnel.stageDetails')} size="small">
            <Table
              columns={funnelTableColumns}
              dataSource={report.funnelData}
              rowKey="stage"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('report.funnel.stageConversion')} size="small">
            <Table
              columns={conversionColumns}
              dataSource={report.conversionRates}
              rowKey={(record) => `${record.fromStage}-${record.toStage}`}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesFunnelReport;
