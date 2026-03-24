import React from 'react';
import { Table, Tag, Typography, Progress, Tooltip } from 'antd';
import { PaymentPlan } from '../../types/contract';

const { Text } = Typography;

// 回款计划表格属性
interface PaymentPlanTableProps {
  // 回款计划数据
  paymentPlans: PaymentPlan[];
  // 是否显示操作列
  showActions?: boolean;
  // 点击回款计划回调
  onPlanClick?: (plan: PaymentPlan) => void;
}

// 状态颜色配置
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'default',
  PARTIAL: 'orange',
  COMPLETED: 'green',
  OVERDUE: 'red'
};

// 状态文本
const STATUS_TEXT: Record<string, string> = {
  PENDING: '待回款',
  PARTIAL: '部分回款',
  COMPLETED: '已回款',
  OVERDUE: '已逾期'
};

// 格式化金额
const formatAmount = (amount: number) => {
  return `¥${(amount / 10000).toFixed(1)}万`;
};

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

/**
 * 回款计划表格组件
 * 展示合同关联的回款计划
 */
export const PaymentPlanTable: React.FC<PaymentPlanTableProps> = ({
  paymentPlans,
  showActions = false,
  onPlanClick
}) => {
  // 表格列定义
  const columns = [
    {
      title: '期数',
      dataIndex: 'installmentNumber',
      key: 'installmentNumber',
      width: 80,
      render: (num: number) => <Text strong>第{num}期</Text>
    },
    {
      title: '计划金额',
      dataIndex: 'plannedAmount',
      key: 'plannedAmount',
      width: 120,
      render: (amount: number) => (
        <Text strong>{formatAmount(amount)}</Text>
      )
    },
    {
      title: '计划日期',
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      width: 120,
      render: (date: string) => formatDate(date)
    },
    {
      title: '实际金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      render: (amount?: number) => (
        amount ? <Text strong style={{ color: '#52c41a' }}>{formatAmount(amount)}</Text> : '-'
      )
    },
    {
      title: '实际日期',
      dataIndex: 'actualDate',
      key: 'actualDate',
      width: 120,
      render: (date?: string) => (date ? formatDate(date) : '-')
    },
    {
      title: '付款条件',
      dataIndex: 'paymentCondition',
      key: 'paymentCondition',
      ellipsis: true,
      render: (text?: string) => (
        <Tooltip title={text}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {text || '-'}
          </Text>
        </Tooltip>
      )
    },
    {
      title: '回款进度',
      key: 'progress',
      width: 150,
      render: (_: any, record: PaymentPlan) => {
        const progress = record.actualAmount ? 100 : 0;
        return (
          <Progress
            percent={progress}
            size="small"
            strokeColor={record.status === 'OVERDUE' ? '#ff4d4f' : progress === 100 ? '#52c41a' : '#1890ff'}
            format={() => `${progress}%`}
          />
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status]}>
          {STATUS_TEXT[status]}
        </Tag>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={paymentPlans}
      rowKey="id"
      pagination={false}
      size="middle"
      onRow={(record) => ({
        onClick: () => onPlanClick?.(record),
        style: { cursor: onPlanClick ? 'pointer' : 'default' }
      })}
    />
  );
};

export default PaymentPlanTable;
