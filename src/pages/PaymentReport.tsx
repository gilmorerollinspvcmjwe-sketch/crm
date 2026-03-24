/**
 * 回款分析报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Row, Col, Table, Statistic, Progress, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { LineChart } from '../components/Charts/LineChart';
import { PieChart } from '../components/Charts/PieChart';
import { BarChart } from '../components/Charts/BarChart';
import { formatAmount } from '../mock/reportData';
import { TimeRange } from '../types/report';

const { Option } = Select;

// Mock 数据
const paymentReport = {
  totalReceivable: 12500000,
  collected: 9800000,
  collectionRate: 78.4,
  overdue: 850000,
  overdueRate: 6.8,
  collectionTrend: [
    { month: '2025-04', planned: 850000, actual: 820000, rate: 96.5 },
    { month: '2025-05', planned: 920000, actual: 895000, rate: 97.3 },
    { month: '2025-06', planned: 980000, actual: 945000, rate: 96.4 },
    { month: '2025-07', planned: 1050000, actual: 985000, rate: 93.8 },
    { month: '2025-08', planned: 1100000, actual: 1056000, rate: 96.0 },
    { month: '2025-09', planned: 1150000, actual: 1127000, rate: 98.0 },
    { month: '2025-10', planned: 1200000, actual: 1164000, rate: 97.0 },
    { month: '2025-11', planned: 1250000, actual: 1187500, rate: 95.0 },
    { month: '2025-12', planned: 1300000, actual: 1235000, rate: 95.0 },
    { month: '2026-01', planned: 1100000, actual: 1012000, rate: 92.0 },
    { month: '2026-02', planned: 950000, actual: 874000, rate: 92.0 },
    { month: '2026-03', planned: 650000, actual: 500000, rate: 76.9 },
  ],
  agingDist: [
    { range: '0-30 天', amount: 1850000, percentage: 68.5, risk: 'low' },
    { range: '31-60 天', amount: 485000, percentage: 18.0, risk: 'medium' },
    { range: '61-90 天', amount: 215000, percentage: 8.0, risk: 'high' },
    { range: '90 天以上', amount: 150000, percentage: 5.5, risk: 'critical' },
  ],
  customerRanking: [
    { rank: 1, customerName: 'XX 科技有限公司', amount: 1250000, rate: 100, status: 'normal' },
    { rank: 2, customerName: 'YY 制造集团', amount: 980000, rate: 95, status: 'normal' },
    { rank: 3, customerName: 'ZZ 贸易公司', amount: 850000, rate: 85, status: 'warning' },
    { rank: 4, customerName: 'AA 股份有限', amount: 720000, rate: 70, status: 'warning' },
    { rank: 5, customerName: 'BB 实业', amount: 650000, rate: 50, status: 'overdue' },
  ],
};

const PaymentReport: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // 获取风险文本
  const getRiskText = (risk: string) => {
    const riskMap: Record<string, string> = {
      low: t('report.payment.riskLow'),
      medium: t('report.payment.riskMedium'),
      high: t('report.payment.riskHigh'),
      critical: t('report.payment.riskCritical'),
    };
    return riskMap[risk] || risk;
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      normal: t('report.payment.statusNormal'),
      warning: t('report.payment.statusWarning'),
      overdue: t('report.payment.statusOverdue'),
    };
    return statusMap[status] || status;
  };

  const agingColumns = [
    {
      title: t('report.payment.aging'),
      dataIndex: 'range',
      key: 'range',
    },
    {
      title: t('report.payment.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 500 }}>{formatAmount(amount)}</span>
      ),
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: t('report.activity.percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Progress
          percent={percentage}
          size="small"
          strokeColor="#1890ff"
          format={() => `${percentage.toFixed(1)}%`}
        />
      ),
    },
    {
      title: t('report.payment.riskLevel'),
      dataIndex: 'risk',
      key: 'risk',
      render: (risk: string) => {
        const colorMap: Record<string, string> = {
          low: '#52c41a',
          medium: '#faad14',
          high: '#f5222d',
          critical: '#722ed1',
        };
        return <Tag color={colorMap[risk]}>{getRiskText(risk)}</Tag>;
      },
    },
  ];

  const customerColumns = [
    {
      title: t('report.performance.rank'),
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <span style={{
          fontWeight: 'bold',
          color: rank === 1 ? '#faad14' : rank === 2 ? '#bfbfbf' : rank === 3 ? '#d48806' : '#666',
        }}>
          {rank <= 3 ? `🏆 ${rank}` : rank}
        </span>
      ),
    },
    {
      title: t('report.payment.customer'),
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: t('report.payment.receivableAmount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatAmount(amount),
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: t('report.payment.collectionRate'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 90 ? '#52c41a' : rate >= 70 ? '#faad14' : '#f5222d'}
          format={() => `${rate}%`}
        />
      ),
      sorter: (a: any, b: any) => a.rate - b.rate,
    },
    {
      title: t('report.payment.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          normal: '#52c41a',
          warning: '#faad14',
          overdue: '#f5222d',
        };
        return <Tag color={colorMap[status]}>{getStatusText(status)}</Tag>;
      },
    },
  ];

  const trendChartData = paymentReport.collectionTrend.map((item) => ({
    month: item.month.slice(5),
    planned: item.planned / 10000,
    actual: item.actual / 10000,
  }));

  const agingPieData = paymentReport.agingDist.map((item) => ({
    name: item.range,
    value: item.amount,
    percentage: item.percentage,
  }));

  const totalReceivable = paymentReport.agingDist.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>{t('report.payment.title')}</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              {t('report.payment.subtitle')}
            </p>
          </div>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 120 }}
          >
            <Option value="week">{t('report.timeRange.week')}</Option>
            <Option value="month">{t('report.timeRange.month')}</Option>
            <Option value="quarter">{t('report.timeRange.quarter')}</Option>
            <Option value="year">{t('report.timeRange.year')}</Option>
          </Select>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('report.payment.totalReceivable')}
              value={paymentReport.totalReceivable / 10000}
              suffix={t('common.unit.tenThousand')}
              precision={1}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('report.payment.collected')}
              value={paymentReport.collected / 10000}
              suffix={t('common.unit.tenThousand')}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('report.payment.collectionRate')}
              value={paymentReport.collectionRate}
              suffix={t('common.unit.percent')}
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('report.payment.overdueAmount')}
              value={paymentReport.overdue / 10000}
              suffix={t('common.unit.tenThousand')}
              precision={1}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={`📈 ${t('report.payment.trendAnalysis')}`} style={{ marginBottom: 16 }}>
        <LineChart
          data={trendChartData}
          dataKeys={[
            { key: 'planned', name: `${t('report.payment.plannedCollection')} (${t('common.unit.tenThousand')})`, color: '#1890ff' },
            { key: 'actual', name: `${t('report.payment.actualCollection')} (${t('common.unit.tenThousand')})`, color: '#52c41a' },
          ]}
          height={300}
          yAxisFormatter={(value) => `${value.toFixed(0)}${t('common.unit.tenThousand')}`}
        />
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title={`📊 ${t('report.payment.agingAnalysis')}`}>
            <PieChart
              data={agingPieData}
              height={300}
              innerRadius={50}
              outerRadius={90}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('report.payment.overdueRateTrend')}>
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 'bold', color: paymentReport.overdueRate >= 10 ? '#f5222d' : '#faad14' }}>
                {paymentReport.overdueRate}%
              </div>
              <div style={{ color: '#999', marginTop: 8 }}>{t('report.payment.currentOverdueRate')}</div>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {paymentReport.agingDist.filter(i => i.risk === 'low').reduce((sum, i) => sum + i.amount, 0) / 10000}{t('common.unit.tenThousand')}
                  </div>
                  <div style={{ color: '#999', fontSize: 12 }}>{t('report.payment.normalDays')}</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                    {paymentReport.agingDist.filter(i => i.risk === 'medium').reduce((sum, i) => sum + i.amount, 0) / 10000}{t('common.unit.tenThousand')}
                  </div>
                  <div style={{ color: '#999', fontSize: 12 }}>{t('report.payment.attentionDays')}</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                    {(paymentReport.agingDist.filter(i => i.risk === 'high').reduce((sum, i) => sum + i.amount, 0) + 
                      paymentReport.agingDist.filter(i => i.risk === 'critical').reduce((sum, i) => sum + i.amount, 0)) / 10000}{t('common.unit.tenThousand')}
                  </div>
                  <div style={{ color: '#999', fontSize: 12 }}>{t('report.payment.riskDays')}</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={`📋 ${t('report.payment.agingDetails')}`} size="small">
            <Table
              columns={agingColumns}
              dataSource={paymentReport.agingDist}
              rowKey="range"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={`🏆 ${t('report.payment.customerRanking')}`} size="small">
            <Table
              columns={customerColumns}
              dataSource={paymentReport.customerRanking}
              rowKey="customerName"
              pagination={false}
              size="small"
              scroll={{ y: 350 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentReport;