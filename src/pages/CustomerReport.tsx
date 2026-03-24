/**
 * 客户分析报表页面
 */

import React from 'react';
import { Card, Row, Col, Table, Statistic, Progress } from 'antd';
import { LineChart } from '../components/Charts/LineChart';
import { PieChart } from '../components/Charts/PieChart';
import { BarChart } from '../components/Charts/BarChart';
import { customerReport } from '../mock/reportData';

const CustomerReport: React.FC = () => {
  const industryColumns = [
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: '客户数',
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

  const levelColumns = [
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string, record: any) => (
        <span style={{
          fontWeight: 'bold',
          color: level === 'A' ? '#f5222d' : level === 'B' ? '#faad14' : level === 'C' ? '#1890ff' : '#999',
        }}>
          {level}级 - {record.label}
        </span>
      ),
    },
    {
      title: '客户数',
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
          strokeColor={percentage >= 30 ? '#52c41a' : percentage >= 15 ? '#faad14' : '#1890ff'}
          format={() => `${percentage.toFixed(1)}%`}
        />
      ),
    },
  ];

  const growthChartData = customerReport.growthData.map((item) => ({
    month: item.month.slice(5),
    newCustomers: item.newCustomers,
    totalCustomers: item.totalCustomers,
  }));

  const industryPieData = customerReport.industryDist.map((item) => ({
    name: item.industry,
    value: item.count,
    percentage: item.percentage,
  }));

  const levelBarData = customerReport.levelDist.map((item) => ({
    name: `${item.level}级`,
    value: item.count,
    percentage: item.percentage,
  }));

  const totalCustomers = customerReport.growthData[customerReport.growthData.length - 1].totalCustomers;
  const avgGrowthRate = customerReport.growthData.reduce((sum, item) => sum + item.growthRate, 0) / customerReport.growthData.length;
  const totalNewCustomers = customerReport.growthData.reduce((sum, item) => sum + item.newCustomers, 0);

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>👥 客户分析报表</h2>
          <p style={{ margin: '8px 0 0 0', color: '#999' }}>
            查看客户增长趋势和分布情况
          </p>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="客户总数"
              value={totalCustomers}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="12 月新增"
              value={totalNewCustomers}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均月增长率"
              value={avgGrowthRate}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title="📈 客户增长趋势">
            <LineChart
              data={growthChartData}
              dataKeys={[
                { key: 'newCustomers', name: '新增客户', color: '#1890ff' },
                { key: 'totalCustomers', name: '总客户数', color: '#52c41a' },
              ]}
              height={300}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="客户行业分布">
            <PieChart
              data={industryPieData}
              height={300}
              innerRadius={50}
              outerRadius={90}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="📊 客户等级分布">
            <div style={{ height: 250, marginBottom: 16 }}>
              <BarChart
                data={levelBarData}
                height={250}
                valueFormatter={(value) => value.toString()}
              />
            </div>
            <Table
              columns={levelColumns}
              dataSource={customerReport.levelDist}
              rowKey="level"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="🏭 客户行业详情">
            <Table
              columns={industryColumns}
              dataSource={customerReport.industryDist}
              rowKey="industry"
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

export default CustomerReport;
