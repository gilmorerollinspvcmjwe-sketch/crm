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
import { useTranslation } from 'react-i18next';
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
export const PaymentStatsCard: React.FC<PaymentStatsCardProps> = ({ stats, title }) => {
  const { t } = useTranslation();
  const cardTitle = title || t('payment.list.stats.title');

  // 获取状态文本
  const getStatusText = (status: PaymentStatus) => {
    const statusMap: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: t('payment.status.pending'),
      [PaymentStatus.PARTIAL]: t('payment.status.partial'),
      [PaymentStatus.COMPLETED]: t('payment.status.completed'),
      [PaymentStatus.OVERDUE]: t('payment.status.overdue')
    };
    return statusMap[status] || status;
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>{cardTitle}</Title>
      
      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.stats.thisMonthPlan')}
              value={formatAmount(stats.thisMonthPlanned)}
              suffix={t('common.unit.tenThousand')}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.stats.thisMonthActual')}
              value={formatAmount(stats.thisMonthActual)}
              suffix={t('common.unit.tenThousand')}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.stats.thisMonthRate')}
              value={stats.thisMonthPlanned > 0 ? Math.round((stats.thisMonthActual / stats.thisMonthPlanned) * 100) : 0}
              suffix={t('common.unit.percent')}
              prefix={<RiseOutlined />}
              valueStyle={{
                color: stats.thisMonthPlanned > 0 && (stats.thisMonthActual / stats.thisMonthPlanned) >= 0.8 ? '#52c41a' : 
                       stats.thisMonthPlanned > 0 && (stats.thisMonthActual / stats.thisMonthPlanned) >= 0.5 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress
              percent={stats.thisMonthPlanned > 0 ? Math.round((stats.thisMonthActual / stats.thisMonthPlanned) * 100) : 0}
              size="small"
              strokeColor={stats.thisMonthPlanned > 0 && (stats.thisMonthActual / stats.thisMonthPlanned) >= 0.8 ? '#52c41a' : 
                           stats.thisMonthPlanned > 0 && (stats.thisMonthActual / stats.thisMonthPlanned) >= 0.5 ? '#faad14' : '#ff4d4f'}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.overdueAmount')}
              value={formatAmount(stats.overdueAmount)}
              suffix={t('common.unit.tenThousand')}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.overdueAmount > 0 ? '#ff4d4f' : '#52c41a' }}
              precision={0}
            />
            {stats.overdueCount > 0 && (
              <Text type="danger" style={{ fontSize: 12 }}>
                {t('payment.list.stats.overdueCount')}：{stats.overdueCount}
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
                <Text type="secondary">{t('payment.list.stats.thisMonthPlan')}</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                  ¥{formatAmount(stats.thisMonthPlanned)}{t('common.unit.tenThousand')}
                </div>
              </div>
              <div>
                <Text type="secondary">{t('payment.list.stats.thisMonthActual')}</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                  ¥{formatAmount(stats.thisMonthActual)}{t('common.unit.tenThousand')}
                </div>
              </div>
              <div>
                <Text type="secondary">{t('payment.list.stats.thisMonthRate')}</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {stats.thisMonthPlanned > 0
                    ? Math.round((stats.thisMonthActual / stats.thisMonthPlanned) * 100)
                    : 0}{t('common.unit.percent')}
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
                    {getStatusText(status as PaymentStatus)}
                  </Tag>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>{count}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{t('common.unit.count')}</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
      
      {/* 按付款方式分布 */}
      <Card title={t('payment.list.stats.paymentMethodDist')}>
        <Row gutter={16}>
          {Object.entries(stats.byPaymentMethod)
            .filter(([_, amount]) => amount > 0)
            .map(([method, amount]) => (
              <Col span={4} key={method}>
                <div style={{ textAlign: 'center' }}>
                  <Tag color="blue" style={{ marginBottom: 4 }}>{method}</Tag>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                    ¥{formatAmount(amount)}{t('common.unit.tenThousand')}
                  </div>
                </div>
              </Col>
            ))}
          {Object.values(stats.byPaymentMethod).every(amount => amount === 0) && (
            <Col span={24}>
              <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                {t('payment.list.stats.noData')}
              </Text>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default PaymentStatsCard;