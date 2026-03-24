import React from 'react';
import { Progress, Tooltip, Space, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PaymentPlan, PaymentStatus } from '../../types/payment';

const { Text } = Typography;

// 回款进度组件属性
interface PaymentProgressProps {
  // 回款计划列表
  paymentPlans: PaymentPlan[];
  // 合同总金额
  totalAmount: number;
  // 是否显示详情
  showDetail?: boolean;
}

// 状态图标
const STATUS_ICONS: Record<PaymentStatus, React.ReactNode> = {
  [PaymentStatus.PENDING]: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
  [PaymentStatus.PARTIAL]: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
  [PaymentStatus.COMPLETED]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  [PaymentStatus.OVERDUE]: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
};

// 状态颜色
const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: '#1890ff',
  [PaymentStatus.PARTIAL]: '#faad14',
  [PaymentStatus.COMPLETED]: '#52c41a',
  [PaymentStatus.OVERDUE]: '#ff4d4f'
};

/**
 * 回款进度组件
 * 可视化展示回款进度
 */
export const PaymentProgress: React.FC<PaymentProgressProps> = ({
  paymentPlans,
  totalAmount,
  showDetail = true
}) => {
  // 计算回款进度
  const completedPlans = paymentPlans.filter(p => p.status === PaymentStatus.COMPLETED);
  const totalPlans = paymentPlans.length;
  const completedCount = completedPlans.length;
  
  const paidAmount = paymentPlans
    .filter(p => p.status === PaymentStatus.COMPLETED)
    .reduce((sum, p) => sum + (p.actualAmount || p.plannedAmount), 0);
  
  const progressPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
  
  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };
  
  return (
    <div>
      {/* 进度圆环和汇总 */}
      <Space size="large" style={{ marginBottom: 16 }}>
        <Progress
          type="circle"
          percent={progressPercent}
          strokeColor={progressPercent === 100 ? '#52c41a' : progressPercent >= 50 ? '#1890ff' : '#faad14'}
          format={() => `${progressPercent}%`}
          width={80}
        />
        <div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>
            已回款：<Text strong style={{ color: '#52c41a' }}>{formatAmount(paidAmount)}</Text>
            {' / '}
            合同总额：<Text strong>{formatAmount(totalAmount)}</Text>
          </div>
          <div style={{ color: '#666' }}>
            回款期数：{completedCount} / {totalPlans} 期
            {completedCount === totalPlans && totalPlans > 0 && (
              <Text type="success" style={{ marginLeft: 8 }}>✓ 已全部回款</Text>
            )}
          </div>
        </div>
      </Space>
      
      {/* 详细进度条 */}
      {showDetail && paymentPlans.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>各期回款进度：</div>
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {paymentPlans.map((plan, index) => (
              <div key={plan.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tooltip title={`第${plan.installmentNumber}期：${formatAmount(plan.plannedAmount)}`}>
                  <span style={{ width: 60, flexShrink: 0 }}>
                    {STATUS_ICONS[plan.status]} 第{plan.installmentNumber}期
                  </span>
                </Tooltip>
                <Progress
                  percent={plan.actualAmount ? 100 : 0}
                  size="small"
                  strokeColor={STATUS_COLORS[plan.status]}
                  format={() => (
                    <span style={{ fontSize: 12 }}>
                      {plan.actualAmount ? formatAmount(plan.actualAmount) : formatAmount(plan.plannedAmount)}
                    </span>
                  )}
                  style={{ flex: 1 }}
                />
                <Tooltip title={plan.paymentCondition}>
                  <Text type="secondary" style={{ fontSize: 12, width: 120, textAlign: 'right' }}>
                    {new Date(plan.plannedDate).toLocaleDateString('zh-CN')}
                  </Text>
                </Tooltip>
              </div>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default PaymentProgress;
