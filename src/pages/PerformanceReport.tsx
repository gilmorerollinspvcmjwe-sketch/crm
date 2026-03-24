/**
 * 业绩统计报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Row, Col, Table, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { LineChart } from '../components/Charts/LineChart';
import { BarChart } from '../components/Charts/BarChart';
import { performanceReport, formatAmount } from '../mock/reportData';

const { Option } = Select;

const PerformanceReport: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const personalColumns = [
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
      title: t('report.performance.sales'),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: t('report.performance.target'),
      dataIndex: 'target',
      key: 'target',
      render: (target: number) => formatAmount(target),
    },
    {
      title: t('report.performance.actual'),
      dataIndex: 'actual',
      key: 'actual',
      render: (actual: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {formatAmount(actual)}
        </span>
      ),
    },
    {
      title: t('report.performance.completionRate'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#f5222d'}
          format={() => `${rate}%`}
        />
      ),
    },
  ];

  const teamColumns = [
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
      title: t('report.performance.team'),
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: t('report.performance.target'),
      dataIndex: 'target',
      key: 'target',
      render: (target: number) => formatAmount(target),
    },
    {
      title: t('report.performance.actual'),
      dataIndex: 'actual',
      key: 'actual',
      render: (actual: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {formatAmount(actual)}
        </span>
      ),
    },
    {
      title: t('report.performance.completionRate'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#f5222d'}
          format={() => `${rate.toFixed(1)}%`}
        />
      ),
    },
  ];

  const teamBarData = performanceReport.teamPerformance.map((team) => ({
    name: team.teamName,
    value: team.actual,
    target: team.target,
    rate: team.rate,
  }));

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>🎯 {t('report.performance.title')}</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              {t('report.performance.subtitle')}
            </p>
          </div>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 120 }}
          >
            <Option value="month">{t('report.timeRange.month')}</Option>
            <Option value="quarter">{t('report.timeRange.quarter')}</Option>
            <Option value="year">{t('report.timeRange.year')}</Option>
          </Select>
        </div>
      </Card>

      <Card title={`📈 ${t('report.performance.monthlyTrend')}`} style={{ marginBottom: 16 }}>
        <LineChart
          data={performanceReport.monthlyTrend.map((item) => ({
            month: item.month.slice(5),
            target: item.target / 10000,
            actual: item.actual / 10000,
            rate: item.rate,
          }))}
          dataKeys={[
            { key: 'target', name: `${t('report.performance.targetChart')} (${t('common.unit.tenThousand')})`, color: '#1890ff' },
            { key: 'actual', name: `${t('report.performance.actualChart')} (${t('common.unit.tenThousand')})`, color: '#52c41a' },
          ]}
          height={300}
          yAxisFormatter={(value) => `${value.toFixed(0)}${t('common.unit.tenThousand')}`}
        />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={`👥 ${t('report.performance.personalRanking')}`} size="small">
            <Table
              columns={personalColumns}
              dataSource={performanceReport.personalPerformance}
              rowKey="userId"
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={`🏢 ${t('report.performance.teamRanking')}`} size="small">
            <div style={{ height: 250, marginBottom: 16 }}>
              <BarChart
                data={teamBarData}
                height={250}
                valueFormatter={(value) => `${(value / 10000).toFixed(0)}${t('common.unit.tenThousand')}`}
              />
            </div>
            <Table
              columns={teamColumns}
              dataSource={performanceReport.teamPerformance}
              rowKey="teamId"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceReport;