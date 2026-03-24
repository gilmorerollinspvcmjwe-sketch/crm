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
  Progress,
  Divider,
  Select,
} from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { PredictiveTrend, PredictionAccuracy } from '../types/ai-agents';
import { predictiveTrends, predictionAccuracy } from '../mock/aiAgentsData';

const { Title, Text } = Typography;
const { Option } = Select;

const PredictiveAI: React.FC = () => {
  const { t } = useTranslation();
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
      title: t('ai.predictiveAI.predictionMetric'),
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: t('ai.predictiveAI.accuracy'),
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
      title: t('ai.predictiveAI.totalPredictions'),
      dataIndex: 'totalPredictions',
      key: 'totalPredictions',
      render: (count: number) => `${count}${t('ai.predictiveAI.times')}`,
    },
    {
      title: t('ai.predictiveAI.correctPredictions'),
      dataIndex: 'correctPredictions',
      key: 'correctPredictions',
      render: (correct: number, record: PredictionAccuracy) => (
        <Text type="success">{correct}{t('ai.predictiveAI.times')} ({((correct / record.totalPredictions) * 100).toFixed(1)}%)</Text>
      ),
    },
    {
      title: t('ai.predictiveAI.meanAbsoluteError'),
      dataIndex: 'meanAbsoluteError',
      key: 'meanAbsoluteError',
      render: (mae: number) => `${mae}%`,
    },
    {
      title: t('ai.predictiveAI.rootMeanSquareError'),
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
            <ThunderboltOutlined /> {t('ai.predictiveAI.title')}
          </Title>
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 150 }}
          >
            <Option value="6months">{t('ai.predictiveAI.last6Months')}</Option>
            <Option value="12months">{t('ai.predictiveAI.last12Months')}</Option>
          </Select>
        </Space>
        <Text type="secondary">
          {t('ai.predictiveAI.subtitle')}
        </Text>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.predictiveAI.avgAccuracy')}
              value={avgAccuracy.toFixed(1)}
              suffix={t('common.unit.percent')}
              prefix={avgAccuracy >= 85 ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: avgAccuracy >= 85 ? '#52c41a' : '#faad14' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.predictiveAI.avgAccuracyDesc')}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.predictiveAI.totalPredictions')}
              value={totalPredictions}
              suffix={t('ai.predictiveAI.times')}
              prefix={<LineChartOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.predictiveAI.totalPredictionsDesc')}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.predictiveAI.correctPredictions')}
              value={correctPredictions}
              suffix={t('ai.predictiveAI.times')}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.predictiveAI.correctPredictionsDesc')}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.predictiveAI.modelCount')}
              value={predictionAccuracy.length}
              suffix={t('ai.predictiveAI.models')}
              prefix={<BarChartOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.predictiveAI.modelCountDesc')}</Text>
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
                {t('ai.predictiveAI.salesTrend')}
              </Space>
            }
            extra={
              <Tag color="blue">{t('ai.predictiveAI.unitTenThousand')}</Tag>
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
                  name={t('ai.predictiveAI.predicted')}
                  stroke="#1890ff"
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name={t('ai.predictiveAI.actual')}
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
                {t('ai.predictiveAI.confidence')}
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={trendData.filter(t => t.actual === null)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 1]} />
                <RechartsTooltip 
                  formatter={(value: number) => [(value * 100).toFixed(1) + '%', t('ai.predictiveAI.confidence')]}
                />
                <Bar 
                  dataKey="confidence" 
                  name={t('ai.predictiveAI.confidence')} 
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
                {t('ai.predictiveAI.accuracyByDimension')}
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={predictionAccuracy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="metric" type="category" width={100} />
                <RechartsTooltip formatter={(value: number) => [value + '%', t('ai.predictiveAI.accuracy')]} />
                <Bar 
                  dataKey="accuracy" 
                  name={t('ai.predictiveAI.accuracy')}
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
                {t('ai.predictiveAI.errorAnalysis')}
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
                  name={t('ai.predictiveAI.mae')}
                  stroke="#faad14"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="rootMeanSquareError"
                  name={t('ai.predictiveAI.rmse')}
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
            {t('ai.predictiveAI.accuracyDetails')}
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