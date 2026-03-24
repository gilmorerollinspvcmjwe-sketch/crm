/**
 * 线索转化分析报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Row, Col, Table, Statistic, Progress } from 'antd';
import { LineChart } from '../components/Charts/LineChart';
import { PieChart } from '../components/Charts/PieChart';
import { BarChart } from '../components/Charts/BarChart';
import { TimeRange } from '../types/report';

const { Option } = Select;

// Mock 数据
const leadConversionReport = {
  totalLeads: 2458,
  converted: 786,
  conversionRate: 32.0,
  avgConvertDays: 12.5,
  channelDist: [
    { channel: '官网咨询', count: 685, converted: 245, rate: 35.8 },
    { channel: '市场活动', count: 520, converted: 198, rate: 38.1 },
    { channel: '电话咨询', count: 445, converted: 125, rate: 28.1 },
    { channel: '转介绍', count: 380, converted: 142, rate: 37.4 },
    { channel: '线上广告', count: 285, converted: 56, rate: 19.6 },
    { channel: '其他', count: 143, converted: 20, rate: 14.0 },
  ],
  conversionTrend: [
    { month: '2025-04', leads: 185, converted: 52, rate: 28.1 },
    { month: '2025-05', leads: 198, converted: 61, rate: 30.8 },
    { month: '2025-06', leads: 210, converted: 68, rate: 32.4 },
    { month: '2025-07', leads: 195, converted: 58, rate: 29.7 },
    { month: '2025-08', leads: 225, converted: 75, rate: 33.3 },
    { month: '2025-09', leads: 240, converted: 82, rate: 34.2 },
    { month: '2025-10', leads: 218, converted: 72, rate: 33.0 },
    { month: '2025-11', leads: 205, converted: 65, rate: 31.7 },
    { month: '2025-12', leads: 192, converted: 58, rate: 30.2 },
    { month: '2026-01', leads: 178, converted: 52, rate: 29.2 },
    { month: '2026-02', leads: 185, converted: 58, rate: 31.4 },
    { month: '2026-03', leads: 227, converted: 87, rate: 38.3 },
  ],
  timeDist: [
    { days: '0-3 天', count: 125, percentage: 15.9 },
    { days: '4-7 天', count: 245, percentage: 31.2 },
    { days: '8-15 天', count: 268, percentage: 34.1 },
    { days: '16-30 天', count: 108, percentage: 13.7 },
    { days: '30 天以上', count: 40, percentage: 5.1 },
  ],
};

const LeadConversionReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const channelColumns = [
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: '线索数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: '转化数',
      dataIndex: 'converted',
      key: 'converted',
      render: (count: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>{count}</span>
      ),
      sorter: (a: any, b: any) => a.converted - b.converted,
    },
    {
      title: '转化率',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 35 ? '#52c41a' : rate >= 25 ? '#faad14' : '#f5222d'}
          format={() => `${rate.toFixed(1)}%`}
        />
      ),
      sorter: (a: any, b: any) => a.rate - b.rate,
    },
  ];

  const timeColumns = [
    {
      title: '转化周期',
      dataIndex: 'days',
      key: 'days',
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: '占比',
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
  ];

  const channelPieData = leadConversionReport.channelDist.map((item) => ({
    name: item.channel,
    value: item.count,
    percentage: item.rate,
  }));

  const trendChartData = leadConversionReport.conversionTrend.map((item) => ({
    month: item.month.slice(5),
    leads: item.leads,
    converted: item.converted,
    rate: item.rate,
  }));

  const timeBarData = leadConversionReport.timeDist.map((item) => ({
    name: item.days,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>🔄 线索转化分析</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              查看线索转化率、渠道效果和转化周期
            </p>
          </div>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 120 }}
          >
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="quarter">本季度</Option>
            <Option value="year">本年</Option>
          </Select>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总线索数"
              value={leadConversionReport.totalLeads}
              suffix="条"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已转化"
              value={leadConversionReport.converted}
              suffix="条"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="转化率"
              value={leadConversionReport.conversionRate}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均转化天数"
              value={leadConversionReport.avgConvertDays}
              suffix="天"
              precision={1}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="📈 转化趋势分析" style={{ marginBottom: 16 }}>
        <LineChart
          data={trendChartData}
          dataKeys={[
            { key: 'leads', name: '线索数', color: '#1890ff' },
            { key: 'converted', name: '转化数', color: '#52c41a' },
          ]}
          height={300}
          yAxisFormatter={(value) => value.toFixed(0)}
        />
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="📊 渠道效果分析">
            <PieChart
              data={channelPieData}
              height={300}
              innerRadius={50}
              outerRadius={90}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="⏱️ 转化时间分布">
            <BarChart
              data={timeBarData}
              height={300}
              valueFormatter={(value) => value.toString()}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="📋 渠道详情" size="small">
            <Table
              columns={channelColumns}
              dataSource={leadConversionReport.channelDist}
              rowKey="channel"
              pagination={false}
              size="small"
              scroll={{ y: 350 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="转化周期详情" size="small">
            <Table
              columns={timeColumns}
              dataSource={leadConversionReport.timeDist}
              rowKey="days"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeadConversionReport;
