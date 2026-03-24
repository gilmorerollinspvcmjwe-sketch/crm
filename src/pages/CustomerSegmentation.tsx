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
} from 'antd';
import {
  RobotOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      title: t('ai.customerSegmentation.customerName'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: t('ai.customerSegmentation.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('ai.customerSegmentation.recencyDays'),
      dataIndex: 'recency',
      key: 'recency',
      width: 120,
      sorter: (a, b) => a.recency - b.recency,
    },
    {
      title: t('ai.customerSegmentation.frequency'),
      dataIndex: 'frequency',
      key: 'frequency',
      width: 130,
      sorter: (a, b) => a.frequency - b.frequency,
    },
    {
      title: t('ai.customerSegmentation.monetary'),
      dataIndex: 'monetary',
      key: 'monetary',
      width: 130,
      sorter: (a, b) => a.monetary - b.monetary,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: t('ai.customerSegmentation.totalValue'),
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 130,
      sorter: (a, b) => a.totalValue - b.totalValue,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: t('ai.customerSegmentation.lastPurchase'),
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
          <RobotOutlined /> {t('ai.customerSegmentation.title')}
        </Title>
        <Text type="secondary">
          {t('ai.customerSegmentation.subtitle')}
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
          <Card title={t('ai.customerSegmentation.scatterChart')} style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('ai.customerSegmentation.scatterChartDesc')}
            </Text>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={t('ai.customerSegmentation.frequencyChart')}
                  unit={t('ai.customerSegmentation.frequencyUnit')}
                  label={{ value: t('ai.customerSegmentation.frequencyChart'), position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={t('ai.customerSegmentation.monetaryChart')}
                  unit={t('ai.customerSegmentation.monetaryUnit')}
                  label={{ value: t('ai.customerSegmentation.monetaryChart'), angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name={t('ai.customerSegmentation.recencyDays')} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: any) => {
                    if (name === t('ai.customerSegmentation.frequencyChart')) return [`${value}${t('ai.customerSegmentation.frequencyUnit')}`, name];
                    if (name === t('ai.customerSegmentation.monetaryChart')) return [`¥${value * 1000}`, name];
                    return [`${value}${t('ai.customerSegmentation.daysUnit')}`, name];
                  }}
                />
                <Legend />
                <Scatter name={t('ai.customerSegmentation.customer')} data={scatterData} fill="#8884d8">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('ai.customerSegmentation.segmentPieChart')} style={{ marginBottom: 16 }}>
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
                <Tooltip formatter={(value: number) => [`${value}${t('ai.customerSegmentation.customers')}`, t('ai.customerSegmentation.quantity')]} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* RFM 雷达图 */}
      <Card title={t('ai.customerSegmentation.rfmRadar')} style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('ai.customerSegmentation.rfmRadarDesc')}
        </Text>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Radar name={t('ai.customerSegmentation.recencyDays')} dataKey="A" stroke="#52c41a" fill="#52c41a" fillOpacity={0.3} />
            <Radar name={t('ai.customerSegmentation.frequency')} dataKey="B" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
            <Radar name={t('ai.customerSegmentation.monetaryUnit')} dataKey="C" stroke="#faad14" fill="#faad14" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* 群体特征详情 */}
      <Card title={t('ai.customerSegmentation.segmentFeatures')}>
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
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('ai.customerSegmentation.avgDealSize')}</Text>
                    <br />
                    <Text strong>¥{(segment.features.avgDealSize / 10000).toFixed(1)}{t('common.unit.tenThousand')}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('ai.customerSegmentation.avgCycle')}</Text>
                    <br />
                    <Text strong>{segment.features.avgCycle}{t('ai.customerSegmentation.daysUnit')}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('ai.customerSegmentation.retentionRate')}</Text>
                    <br />
                    <Text strong style={{ color: segment.features.retentionRate >= 80 ? '#52c41a' : '#faad14' }}>
                      {segment.features.retentionRate}%
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('ai.customerSegmentation.satisfaction')}</Text>
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
            {currentSegment?.name} - {t('ai.customerSegmentation.customerList')}
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
                <Text>{t('ai.customerSegmentation.totalCustomers')} {currentSegment.count}</Text>
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