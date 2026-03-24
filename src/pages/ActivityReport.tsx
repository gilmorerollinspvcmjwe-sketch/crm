/**
 * 跟进活动统计报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Row, Col, Table, Statistic, Progress } from 'antd';
import { BarChart } from '../components/Charts/BarChart';
import { PieChart } from '../components/Charts/PieChart';
import { getSalesFunnelReport, formatAmount } from '../mock/reportData';
import { TimeRange } from '../types/report';

const { Option } = Select;

// Mock 数据
const activityReport = {
  totalActivities: 1286,
  thisWeek: 156,
  avgPerSales: 42.9,
  typeDist: [
    { type: '电话拜访', count: 520, percentage: 40.4 },
    { type: '现场拜访', count: 385, percentage: 30.0 },
    { type: '邮件联系', count: 257, percentage: 20.0 },
    { type: '微信沟通', count: 124, percentage: 9.6 },
  ],
  salesRanking: [
    { rank: 1, userName: '张三', count: 89, completionRate: 98 },
    { rank: 2, userName: '李四', count: 76, completionRate: 95 },
    { rank: 3, userName: '王五', count: 68, completionRate: 92 },
    { rank: 4, userName: '赵六', count: 62, completionRate: 88 },
    { rank: 5, userName: '钱七', count: 55, completionRate: 85 },
    { rank: 6, userName: '孙八', count: 48, completionRate: 80 },
  ],
  weeklyTrend: [
    { week: '第 1 周', count: 285 },
    { week: '第 2 周', count: 312 },
    { week: '第 3 周', count: 298 },
    { week: '第 4 周', count: 391 },
  ],
};

const ActivityReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const typeColumns = [
    {
      title: '跟进类型',
      dataIndex: 'type',
      key: 'type',
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

  const rankingColumns = [
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
          {rank <= 3 ? rank : rank}
        </span>
      ),
    },
    {
      title: '销售',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '跟进数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 90 ? '#52c41a' : rate >= 80 ? '#faad14' : '#f5222d'}
          format={() => `${rate}%`}
        />
      ),
    },
  ];

  const typePieData = activityReport.typeDist.map((item) => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage,
  }));

  const weeklyBarData = activityReport.weeklyTrend.map((item) => ({
    name: item.week,
    value: item.count,
  }));

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>📞 跟进活动统计</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              查看跟进数量、类型分布和销售排行
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
        <Col span={8}>
          <Card>
            <Statistic
              title="总跟进数"
              value={activityReport.totalActivities}
              suffix="次"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="本周跟进"
              value={activityReport.thisWeek}
              suffix="次"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="人均跟进"
              value={activityReport.avgPerSales}
              suffix="次"
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="📊 跟进类型分布">
            <PieChart
              data={typePieData}
              height={300}
              innerRadius={50}
              outerRadius={90}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="📈 周跟进趋势">
            <BarChart
              data={weeklyBarData}
              height={300}
              valueFormatter={(value) => value.toString()}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="📋 跟进类型详情" size="small">
            <Table
              columns={typeColumns}
              dataSource={activityReport.typeDist}
              rowKey="type"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="销售跟进排行" size="small">
            <Table
              columns={rankingColumns}
              dataSource={activityReport.salesRanking}
              rowKey="userName"
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

export default ActivityReport;
