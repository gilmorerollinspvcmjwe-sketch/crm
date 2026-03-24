/**
 * 客户分析报表页面
 */

import React from 'react';
import { Card, Row, Col, Table, Statistic, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { LineChart } from '../components/Charts/LineChart';
import { PieChart } from '../components/Charts/PieChart';
import { BarChart } from '../components/Charts/BarChart';
import { customerReport } from '../mock/reportData';

const CustomerReport: React.FC = () => {
  const { t } = useTranslation();

  const industryColumns = [
    {
      title: t('report.customer.industry'),
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: t('report.customer.customerCount'),
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: t('report.customer.percentage'),
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
      title: t('report.customer.level'),
      dataIndex: 'level',
      key: 'level',
      render: (level: string, record: any) => (
        <span style={{
          fontWeight: 'bold',
          color: level === 'A' ? '#f5222d' : level === 'B' ? '#faad14' : level === 'C' ? '#1890ff' : '#999',
        }}>
          {level}{t('report.customer.levelSuffix')} - {record.label}
        </span>
      ),
    },
    {
      title: t('report.customer.customerCount'),
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: t('report.customer.percentage'),
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
    name: `${item.level}${t('report.customer.levelSuffix')}`,
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
          <h2 style={{ margin: 0 }}>👥 {t('report.customer.title')}</h2>
          <p style={{ margin: '8px 0 0 0', color: '#999' }}>
            {t('report.customer.subtitle')}
          </p>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('report.customer.totalCustomers')}
              value={totalCustomers}
              suffix={t('common.unit.count')}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('report.customer.newIn12Months')}
              value={totalNewCustomers}
              suffix={t('common.unit.count')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('report.customer.avgGrowthRate')}
              value={avgGrowthRate}
              suffix={t('common.unit.percent')}
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title={`📈 ${t('report.customer.growthTrend')}`}>
            <LineChart
              data={growthChartData}
              dataKeys={[
                { key: 'newCustomers', name: t('report.customer.newCustomers'), color: '#1890ff' },
                { key: 'totalCustomers', name: t('report.customer.totalCustomersChart'), color: '#52c41a' },
              ]}
              height={300}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t('report.customer.industryDistribution')}>
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
          <Card title={`📊 ${t('report.customer.levelDistribution')}`}>
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
          <Card title={`🏭 ${t('report.customer.industryDetails')}`}>
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