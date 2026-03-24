/**
 * 客户分群 AI 页面
 * RFM 模型分析，客户分群可视化
 */
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Table,
  Modal,
  Badge,
  Statistic,
  Row,
  Col,
  Tabs,
} from 'antd';
import {
  RobotOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { CustomerSegment, SegmentedCustomer, CustomerScatterPoint } from '../types/ai';
import { customerSegments, segmentedCustomers, customerScatterData } from '../mock/aiData';

const { Title, Text } = Typography;

const COLORS = ['#52c41a', '#1890ff', '#faad14', '#ff4d4f'];

const CustomerSegmentation: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<CustomerSegment | null>(null);
  const [segmentCustomers, setSegmentCustomers] = useState<SegmentedCustomer[]>([]);

  // 打开群体详情
  const handleViewSegment = (segment: CustomerSegment) => {
    setCurrentSegment(segment);
    const customers = segmentedCustomers.filter((c) => c.segmentId === segment.id);
    setSegmentCustomers(customers);
    setIsModalVisible(true);
  };

  // 散点图数据
  const scatterData = customerScatterData.map((item) => ({
    x: item.x,
    y: item.y,
    z: item.size,
    segmentName: item.segmentName,
    customerName: item.customerName,
    fill: COLORS[customerSegments.findIndex((s) => s.id === item.segmentId)],
  }));

  // 饼图数据
  const pieData = customerSegments.map((segment) => ({
    name: segment.name,
    value: segment.count,
    percentage: segment.percentage,
  }));

  // 雷达图数据
  const radarData = customerSegments.map((segment) => ({
    subject: segment.name,
    A: segment.characteristics.recency,
    B: segment.characteristics.frequency,
    C: segment.characteristics.monetary / 10000,
    fullMark: 150,
  }));

  const columns: ColumnsType<SegmentedCustomer> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: '最近消费 (天)',
      dataIndex: 'recency',
      key: 'recency',
      width: 120,
      sorter: (a, b) => a.recency - b.recency,
    },
    {
      title: '消费频率 (次/年)',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 130,
      sorter: (a, b) => a.frequency - b.frequency,
    },
    {
      title: '消费金额 (元)',
      dataIndex: 'monetary',
      key: 'monetary',
      width: 130,
      sorter: (a, b) => a.monetary - b.monetary,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '总价值 (元)',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 130,
      sorter: (a, b) => a.totalValue - b.totalValue,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '最后购买',
      dataIndex: 'lastPurchase',
      key: 'lastPurchase',
      width: 120,
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined /> 客户分群 AI
        </Title>
        <Text type="secondary">
          基于 RFM 模型（最近消费、消费频率、消费金额）自动分群，识别高价值客户和需关注客户
        </Text>
      </div>

      {/* 分群统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {customerSegments.map((segment, idx) => (
          <Col span={6} key={segment.id}>
            <Card
              hoverable
              onClick={() => handleViewSegment(segment)}
              style={{ borderColor: segment.color }}
            >
              <div style={{ textAlign: 'center' }}>
                <Tag color={segment.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {segment.name}
                </Tag>
                <Title level={2} style={{ margin: '16px 0', color: segment.color }}>
                  {segment.count}
                </Title>
                <Text type="secondary">{segment.percentage}%</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {segment.description}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表展示 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="客户分布散点图" style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              X 轴：消费频率 | Y 轴：消费金额 | 气泡大小：最近消费
            </Text>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="消费频率"
                  unit="次/年"
                  label={{ value: '消费频率 (次/年)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="消费金额"
                  unit="千元"
                  label={{ value: '消费金额 (千元)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="最近消费" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: any) => {
                    if (name === '消费频率') return [`${value}次/年`, name];
                    if (name === '消费金额') return [`¥${value * 1000}`, name];
                    return [`${value}天`, name];
                  }}
                />
                <Legend />
                <Scatter name="客户" data={scatterData} fill="#8884d8">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="客户群体占比" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} (${entry.percentage}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}个客户`, '数量']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* RFM 雷达图 */}
      <Card title="RFM 特征雷达图" style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          展示各群体的 RFM 特征对比
        </Text>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Radar name="最近消费 (天)" dataKey="A" stroke="#52c41a" fill="#52c41a" fillOpacity={0.3} />
            <Radar name="消费频率 (次)" dataKey="B" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
            <Radar name="消费金额 (万元)" dataKey="C" stroke="#faad14" fill="#faad14" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* 群体特征详情 */}
      <Card title="各群体特征详情">
        <Row gutter={16}>
          {customerSegments.map((segment, idx) => (
            <Col span={6} key={segment.id}>
              <Card
                size="small"
                title={
                  <Tag color={segment.color}>{segment.name}</Tag>
                }
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>平均客单价</Text>
                    <br />
                    <Text strong>¥{(segment.features.avgDealSize / 10000).toFixed(1)}万</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>平均成交周期</Text>
                    <br />
                    <Text strong>{segment.features.avgCycle}天</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>留存率</Text>
                    <br />
                    <Text strong style={{ color: segment.features.retentionRate >= 80 ? '#52c41a' : '#faad14' }}>
                      {segment.features.retentionRate}%
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>满意度</Text>
                    <br />
                    <Text strong>{'★'.repeat(Math.round(segment.features.satisfaction))}{'☆'.repeat(5 - Math.round(segment.features.satisfaction))}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 群体详情弹窗 */}
      <Modal
        title={
          <Space>
            <TeamOutlined />
            {currentSegment?.name} - 客户列表
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
      >
        {currentSegment && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space>
                <Tag color={currentSegment.color}>{currentSegment.name}</Tag>
                <Text>共 {currentSegment.count} 个客户</Text>
                <Text type="secondary">{currentSegment.description}</Text>
              </Space>
            </Card>

            <Table
              columns={columns}
              dataSource={segmentCustomers}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerSegmentation;
