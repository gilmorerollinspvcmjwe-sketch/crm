/**
 * 销售漏斗报表页面
 */

import React, { useState } from 'react';
import { Card, Select, Space, Row, Col, Statistic, Progress, Table } from 'antd';
import { FunnelChart } from '../components/Charts/FunnelChart';
import { BarChart } from '../components/Charts/BarChart';
import { getSalesFunnelReport, formatAmount } from '../mock/reportData';
import { TimeRange } from '../types/report';

const { Option } = Select;

const SalesFunnelReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const report = getSalesFunnelReport(timeRange);

  const funnelTableColumns = [
    {
      title: '阶段',
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
      title: '商机数量',
      dataIndex: 'opportunityCount',
      key: 'opportunityCount',
      sorter: (a: any, b: any) => a.opportunityCount - b.opportunityCount,
    },
    {
      title: '商机金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatAmount(amount),
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: '转化率',
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
      title: '从阶段',
      dataIndex: 'fromStage',
      key: 'fromStage',
    },
    {
      title: '到阶段',
      dataIndex: 'toStage',
      key: 'toStage',
    },
    {
      title: '转化率',
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
            <h2 style={{ margin: 0 }}>📊 销售漏斗报表</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999' }}>
              查看各阶段商机分布和转化情况
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
              title="总商机数"
              value={totalCount}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总金额"
              value={totalAmount / 10000}
              suffix="万"
              precision={1}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均转化率"
              value={avgConversion}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="📊 漏斗图" style={{ marginBottom: 16 }}>
        <FunnelChart data={report.funnelData} />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="📋 各阶段详情" size="small">
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
          <Card title="📈 阶段转化率" size="small">
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
