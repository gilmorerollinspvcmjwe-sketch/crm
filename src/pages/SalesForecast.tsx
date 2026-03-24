/**
 * 销售预测 AI 页面
 * 展示月度/季度/年度销售预测，预测 vs 实际对比
 */
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Select,
  Statistic,
  Progress,
  Tag,
  Row,
  Col,
} from 'antd';
import {
  RobotOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SalesForecastData } from '../types/ai';
import { salesForecast } from '../mock/aiData';

const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'];

const SalesForecast: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const data: SalesForecastData = salesForecast;

  // 计算预测准确率
  const calculateAccuracy = () => {
    const itemsWithData = data.actuals.filter((item) => item.actual !== null && item.actual !== undefined);
    if (itemsWithData.length === 0) return 0;

    const totalError = itemsWithData.reduce((sum, item) => {
      const error = Math.abs(item.predicted - (item.actual || 0)) / (item.actual || 1);
      return sum + error;
    }, 0);

    return Math.round((1 - totalError / itemsWithData.length) * 100);
  };

  // 趋势图标
  const TrendIcon = data.trend === 'up' ? RiseOutlined : data.trend === 'down' ? FallOutlined : undefined;
  const trendColor = data.trend === 'up' ? '#52c41a' : data.trend === 'down' ? '#ff4d4f' : '#faad14';

  // 获取趋势文本
  const getTrendText = (trend: string) => {
    const trendMap: Record<string, string> = {
      up: t('ai.salesForecast.trendUp'),
      down: t('ai.salesForecast.trendDown'),
      stable: t('ai.salesForecast.trendStable'),
    };
    return trendMap[trend] || trend;
  };

  // 格式化金额
  const formatMoney = (value: number) => {
    if (value >= 1000000) {
      return `¥${(value / 1000000).toFixed(1)}M`;
    }
    return `¥${(value / 1000).toFixed(0)}K`;
  };

  // 获取达成状态文本
  const getAttainmentText = (attainment: number) => {
    if (attainment >= 100) return t('ai.salesForecast.exceeded');
    if (attainment >= 80) return t('ai.salesForecast.normal');
    return t('ai.salesForecast.behind');
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              <RobotOutlined /> {t('ai.salesForecast.title')}
            </Title>
            <Text type="secondary">
              {t('ai.salesForecast.subtitle')}
            </Text>
          </div>
          <Select
            value={period}
            onChange={(value) => setPeriod(value)}
            style={{ width: 150 }}
          >
            <Option value="monthly">{t('ai.salesForecast.monthly')}</Option>
            <Option value="quarterly">{t('ai.salesForecast.quarterly')}</Option>
            <Option value="yearly">{t('ai.salesForecast.yearly')}</Option>
          </Select>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.salesForecast.predictionAccuracy')}
              value={calculateAccuracy()}
              suffix={t('common.unit.percent')}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ThunderboltOutlined />}
            />
            <Progress
              percent={calculateAccuracy()}
              strokeColor="#52c41a"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.salesForecast.thisMonthPrediction')}
              value={data.predictions[data.predictions.length - 1]?.predicted || 0}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {data.predictions[data.predictions.length - 1]?.period}
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.salesForecast.trend')}
              value={getTrendText(data.trend)}
              valueStyle={{ color: trendColor }}
              prefix={TrendIcon && <TrendIcon />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('ai.salesForecast.vsLastPeriod')}
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.salesForecast.avgAttainment')}
              value={Math.round(
                data.breakdownBySales.reduce((sum, s) => sum + s.attainment, 0) /
                  data.breakdownBySales.length
              )}
              suffix={t('common.unit.percent')}
              valueStyle={{ color: '#faad14' }}
            />
            <Progress
              percent={Math.round(
                data.breakdownBySales.reduce((sum, s) => sum + s.attainment, 0) /
                  data.breakdownBySales.length
              )}
              strokeColor="#faad14"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 预测趋势图 */}
      <Card title={t('ai.salesForecast.predictionVsActual')} style={{ marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis
              tickFormatter={(value) => formatMoney(value)}
              style={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`¥${value.toLocaleString()}`, t('ai.salesForecast.amount')]}
              labelFormatter={(label) => `${t('ai.salesForecast.period')}：${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#1890ff"
              strokeWidth={3}
              name={t('ai.salesForecast.predicted')}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#52c41a"
              strokeWidth={3}
              name={t('ai.salesForecast.actual')}
              dot={{ r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 预测拆分 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title={t('ai.salesForecast.byProduct')} style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.breakdownByProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis
                  tickFormatter={(value) => formatMoney(value)}
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, t('ai.salesForecast.predictedAmount')]}
                  labelFormatter={(label) => `${t('ai.salesForecast.product')}：${label}`}
                />
                <Bar dataKey="predicted" fill="#1890ff" name={t('ai.salesForecast.predictedAmount')}>
                  {data.breakdownByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('ai.salesForecast.byRegion')} style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.breakdownByRegion}
                  dataKey="predicted"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.region} (${entry.percentage}%)`}
                >
                  {data.breakdownByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`¥${value.toLocaleString()}`, t('ai.salesForecast.predictedAmount')]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 区域预测详情 */}
      <Card title={t('ai.salesForecast.regionDetails')} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {data.breakdownByRegion.map((region, idx) => (
            <Col span={4} key={idx}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <Tag color={COLORS[idx % COLORS.length]} style={{ marginBottom: 8 }}>
                    {region.region}
                  </Tag>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {formatMoney(region.predicted)}
                  </Title>
                  <Text type="secondary">{region.percentage}%</Text>
                  <br />
                  <Tag
                    color={region.growth > 0 ? 'green' : 'red'}
                    style={{ marginTop: 8 }}
                  >
                    {region.growth > 0 ? '+' : ''}{region.growth}% {t('ai.salesForecast.growth')}
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 销售预测详情 */}
      <Card title={t('ai.salesForecast.salesPrediction')}>
        <Row gutter={16}>
          {data.breakdownBySales.map((sales, idx) => (
            <Col span={4} key={idx}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <Title level={5} style={{ margin: '8px 0' }}>{sales.salesName}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('ai.salesForecast.predicted')}：{formatMoney(sales.predicted)}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('ai.salesForecast.quota')}：{formatMoney(sales.quota)}
                  </Text>
                  <Progress
                    percent={Math.round(sales.attainment)}
                    strokeColor={sales.attainment >= 100 ? '#52c41a' : sales.attainment >= 80 ? '#faad14' : '#ff4d4f'}
                    size="small"
                    style={{ marginTop: 8 }}
                    format={() => `${sales.attainment}%`}
                  />
                  <Tag
                    color={sales.attainment >= 100 ? 'success' : sales.attainment >= 80 ? 'processing' : 'error'}
                    style={{ marginTop: 8 }}
                  >
                    {getAttainmentText(sales.attainment)}
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default SalesForecast;