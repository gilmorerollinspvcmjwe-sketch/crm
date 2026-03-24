/**
 * 业绩统计报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Row, Col, Table, Progress } from 'antd';
import { LineChart } from '../components/Charts/LineChart';
import { BarChart } from '../components/Charts/BarChart';
import { performanceReport, formatAmount } from '../mock/reportData';

const { Option } = Select;

const PerformanceReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const personalColumns = [
    {
      title: '排名',
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
      title: '销售',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '目标',
      dataIndex: 'target',
      key: 'target',
      render: (target: number) => formatAmount(target),
    },
    {
      title: '实际完成',
      dataIndex: 'actual',
      key: 'actual',
      render: (actual: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {formatAmount(actual)}
        </span>
      ),
    },
    {
      title: '完成率',
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
      title: '排名',
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
      title: '团队',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: '目标',
      dataIndex: 'target',
      key: 'target',
      render: (target: number) => formatAmount(target),
    },
    {
      title: '实际完成',
      dataIndex: 'actual',
      key: 'actual',
      render: (actual: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {formatAmount(actual)}
        </span>
      ),
    },
    {
      title: '完成率',
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
            <h2 style={{ margin: 0 }}>🎯 业绩统计报表</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              查看个人和团队业绩完成情况
            </p>
          </div>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 120 }}
          >
            <Option value="month">本月</Option>
            <Option value="quarter">本季度</Option>
            <Option value="year">本年</Option>
          </Select>
        </div>
      </Card>

      <Card title="📈 月度趋势分析" style={{ marginBottom: 16 }}>
        <LineChart
          data={performanceReport.monthlyTrend.map((item) => ({
            month: item.month.slice(5),
            target: item.target / 10000,
            actual: item.actual / 10000,
            rate: item.rate,
          }))}
          dataKeys={[
            { key: 'target', name: '目标 (万)', color: '#1890ff' },
            { key: 'actual', name: '实际 (万)', color: '#52c41a' },
          ]}
          height={300}
          yAxisFormatter={(value) => `${value.toFixed(0)}万`}
        />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="👥 个人业绩排行" size="small">
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
          <Card title="🏢 团队业绩排行" size="small">
            <div style={{ height: 250, marginBottom: 16 }}>
              <BarChart
                data={teamBarData}
                height={250}
                valueFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
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
