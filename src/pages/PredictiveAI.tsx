/**
 * 预测性 AI 页面
 * 展示销售预测、趋势分析、准确率统计
 */
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Table,
  Tabs,
  Progress,
  Tooltip,
  Divider,
  Select,
} from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { PredictiveTrend, PredictionAccuracy } from '../types/ai-agents';
import { predictiveTrends, predictionAccuracy } from '../mock/aiAgentsData';

const { Title, Text } = Typography;
const { Option } = Select;

const PredictiveAI: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'6months' | '12months'>('6months');

  // 计算汇总统计
  const avgAccuracy = predictionAccuracy.reduce((sum, p) => sum + p.accuracy, 0) / predictionAccuracy.length;
  const totalPredictions = predictionAccuracy.reduce((sum, p) => sum + p.totalPredictions, 0);
  const correctPredictions = predictionAccuracy.reduce((sum, p) => sum + p.correctPredictions, 0);

  // 趋势数据
  const trendData: PredictiveTrend[] = timeRange === '6months' 
    ? predictiveTrends.slice(-6) 
    : predictiveTrends;

  // 准确率表格列
  const accuracyColumns = [
    {
      title: '预测指标',
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy: number) => (
        <Space>
          <Progress
            type="circle"
            percent={accuracy}
            size={40}
            strokeColor={accuracy >= 90 ? '#52c41a' : accuracy >= 80 ? '#1890ff' : '#faad14'}
            format={(percent: number) => `${percent}%`}
          />
        </Space>
      ),
    },
    {
      title: '总预测数',
      dataIndex: 'totalPredictions',
      key: 'totalPredictions',
      render: (count: number) => `${count}次`,
    },
    {
      title: '正确预测',
      dataIndex: 'correctPredictions',
      key: 'correctPredictions',
      render: (correct: number, record: PredictionAccuracy) => (
        <Text type="success">{correct}次 ({((correct / record.totalPredictions) * 100).toFixed(1)}%)</Text>
      ),
    },
    {
      title: '平均绝对误差',
      dataIndex: 'meanAbsoluteError',
      key: 'meanAbsoluteError',
      render: (mae: number) => `${mae}%`,
    },
    {
      title: '均方根误差',
      dataIndex: 'rootMeanSquareError',
      key: 'rootMeanSquareError',
      render: (rmse: number) => `${rmse}%`,
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Space>
          <Title level={2} style={{ margin: 0 }}>
            <ThunderboltOutlined /> 预测性 AI
          </Title>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 150 }}
          >
            <Option value="6months">近 6 个月</Option>
            <Option value="12months">近 12 个月</Option>
          </Select>
        </Space>
        <Text type="secondary">
          基于机器学习的销售预测、趋势分析和准确率统计
        </Text>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均预测准确率"
              value={avgAccuracy.toFixed(1)}
              suffix="%"
              prefix={avgAccuracy >= 85 ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: avgAccuracy >= 85 ? '#52c41a' : '#faad14' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">所有预测模型的平均准确率</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预测次数"
              value={totalPredictions}
              suffix="次"
              prefix={<LineChartOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">累计执行预测分析次数</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正确预测"
              value={correctPredictions}
              suffix="次"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">预测准确的次数</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预测模型数"
              value={predictionAccuracy.length}
              suffix="个"
              prefix={<BarChartOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">正在运行的预测模型</Text>
          </Card>
        </Col>
      </Row>

      {/* 预测趋势图表 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                销售预测趋势
              </Space>
            }
            extra={
              <Tag color="blue">单位：万元</Tag>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  name="预测值"
                  stroke="#1890ff"
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="实际值"
                  stroke="#52c41a"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                预测置信度
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={trendData.filter(t => t.actual === null)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 1]} />
                <RechartsTooltip 
                  formatter={(value: number) => [(value * 100).toFixed(1) + '%', '置信度']}
                />
                <Bar 
                  dataKey="confidence" 
                  name="置信度" 
                  fill="#722ed1"
                  radius={[4, 4, 0, 0]}
                  label={{ 
                    position: 'top', 
                    formatter: (value: number) => `${(value * 100).toFixed(0)}%` 
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 预测准确率分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <RiseOutlined />
                各维度预测准确率
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={predictionAccuracy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="metric" type="category" width={100} />
                <RechartsTooltip formatter={(value: number) => [value + '%', '准确率']} />
                <Bar 
                  dataKey="accuracy" 
                  name="准确率"
                  fill="#1890ff"
                  radius={[0, 4, 4, 0]}
                  label={{ 
                    position: 'right', 
                    formatter: (value: number) => `${value}%` 
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <Space>
                <WarningOutlined />
                预测误差分析
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionAccuracy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} interval={0} />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="meanAbsoluteError"
                  name="平均绝对误差 (MAE)"
                  stroke="#faad14"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="rootMeanSquareError"
                  name="均方根误差 (RMSE)"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 准确率详情表格 */}
      <Card
        title={
          <Space>
            <CheckCircleOutlined />
            预测准确率详情
          </Space>
        }
      >
        <Table
          columns={accuracyColumns}
          dataSource={predictionAccuracy}
          rowKey="metric"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default PredictiveAI;
