import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Space, Typography } from 'antd';
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { PaymentStats as PaymentStatsType } from '../../types/payment';
import { PaymentStatus, PaymentMethod } from '../../types/payment';

const { Title, Text } = Typography;

// 回款统计卡片属性
interface PaymentStatsCardProps {
  // 统计数据
  stats: PaymentStatsType;
  // 标题
  title?: string;
}

// 状态颜色配置
const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: '#1890ff',
  [PaymentStatus.PARTIAL]: '#faad14',
  [PaymentStatus.COMPLETED]: '#52c41a',
  [PaymentStatus.OVERDUE]: '#ff4d4f'
};

// 格式化金额
const formatAmount = (amount: number) => {
  return (amount / 10000).toFixed(0);
};

/**
 * 回款统计卡片组件
 * 展示回款统计概览
 */
export const PaymentStatsCard: React.FC<PaymentStatsCardProps> = ({ stats, title = '回款统计' }) => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>
      
      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="计划回款总额"
              value={formatAmount(stats.totalPlanned)}
              suffix="万元"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="实际回款总额"
              value={formatAmount(stats.totalActual)}
              suffix="万元"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="回款完成率"
              value={stats.completionRate}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{
                color: stats.completionRate >= 80 ? '#52c41a' : stats.completionRate >= 50 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress
              percent={stats.completionRate}
              size="small"
              strokeColor={stats.completionRate >= 80 ? '#52c41a' : stats.completionRate >= 50 ? '#faad14' : '#ff4d4f'}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期金额"
              value={formatAmount(stats.overdueAmount)}
              suffix="万元"
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.overdueAmount > 0 ? '#ff4d4f' : '#52c41a' }}
              precision={0}
            />
            {stats.overdueCount > 0 && (
              <Text type="danger" style={{ fontSize: 12 }}>
                逾期笔数：{stats.overdueCount}
              </Text>
            )}
          </Card>
        </Col>
      </Row>
      
      {/* 本月回款 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title={<CalendarOutlined />}>
            <Space size="large">
              <div>
                <Text type="secondary">本月计划</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                  ¥{formatAmount(stats.thisMonthPlanned)}万
                </div>
              </div>
              <div>
                <Text type="secondary">本月实际</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                  ¥{formatAmount(stats.thisMonthActual)}万
                </div>
              </div>
              <div>
                <Text type="secondary">本月完成率</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {stats.thisMonthPlanned > 0
                    ? Math.round((stats.thisMonthActual / stats.thisMonthPlanned) * 100)
                    : 0}%
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        
        {/* 按状态分布 */}
        <Col span={12}>
          <Card title={<ClockCircleOutlined />}>
            <Space size="middle" wrap>
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} style={{ textAlign: 'center' }}>
                  <Tag color={STATUS_COLORS[status as PaymentStatus]} style={{ marginBottom: 4 }}>
                    {status}
                  </Tag>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>{count}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>笔</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
      
      {/* 按付款方式分布 */}
      <Card title="💳 付款方式分布">
        <Row gutter={16}>
          {Object.entries(stats.byPaymentMethod)
            .filter(([_, amount]) => amount > 0)
            .map(([method, amount]) => (
              <Col span={4} key={method}>
                <div style={{ textAlign: 'center' }}>
                  <Tag color="blue" style={{ marginBottom: 4 }}>{method}</Tag>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                    ¥{formatAmount(amount)}万
                  </div>
                </div>
              </Col>
            ))}
          {Object.values(stats.byPaymentMethod).every(amount => amount === 0) && (
            <Col span={24}>
              <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                暂无回款数据
              </Text>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default PaymentStatsCard;
