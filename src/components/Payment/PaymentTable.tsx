import React from 'react';
import { Table, Tag, Space, Button, Typography, Tooltip, Progress, Popconfirm } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { PaymentPlan, PaymentStatus, PaymentMethod } from '../../types/payment';

const { Text } = Typography;

// 回款表格属性
interface PaymentTableProps {
  // 回款计划数据
  data: PaymentPlan[];
  // 查看详情回调
  onViewDetail: (id: string) => void;
  // 核销回调
  onVerify?: (id: string) => void;
  // 驳回回调
  onReject?: (id: string) => void;
  // 加载状态
  loading?: boolean;
}

// 状态颜色配置
const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'default',
  [PaymentStatus.PARTIAL]: 'orange',
  [PaymentStatus.COMPLETED]: 'green',
  [PaymentStatus.OVERDUE]: 'red'
};

// 付款方式颜色
const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  [PaymentMethod.BANK_TRANSFER]: 'blue',
  [PaymentMethod.ALIPAY]: 'cyan',
  [PaymentMethod.WECHAT_PAY]: 'green',
  [PaymentMethod.CASH]: 'orange',
  [PaymentMethod.CHECK]: 'purple',
  [PaymentMethod.OTHER]: 'default'
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
 * 回款表格组件
 * 展示回款计划列表数据
 */
export const PaymentTable: React.FC<PaymentTableProps> = ({
  data,
  onViewDetail,
  onVerify,
  onReject,
  loading = false
}) => {
  // 表格列定义
  const columns = [
    {
      title: '合同信息',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 250,
      fixed: 'left' as const,
      render: (name: string, record: PaymentPlan) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.contractNumber}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.customerName}</Text>
        </Space>
      )
    },
    {
      title: '期数',
      dataIndex: 'installmentNumber',
      key: 'installmentNumber',
      width: 80,
      render: (num: number) => `第${num}期`
    },
    {
      title: '计划金额',
      dataIndex: 'plannedAmount',
      key: 'plannedAmount',
      width: 100,
      sorter: (a: PaymentPlan, b: PaymentPlan) => a.plannedAmount - b.plannedAmount,
      render: (amount: number) => (
        <Text strong>{formatAmount(amount)}</Text>
      )
    },
    {
      title: '实际金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 100,
      sorter: (a: PaymentPlan, b: PaymentPlan) => (a.actualAmount || 0) - (b.actualAmount || 0),
      render: (amount?: number) => (
        amount ? <Text strong style={{ color: '#52c41a' }}>{formatAmount(amount)}</Text> : '-'
      )
    },
    {
      title: '计划日期',
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      width: 100,
      sorter: (a: PaymentPlan, b: PaymentPlan) =>
        new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime(),
      render: (date: string) => formatDate(date)
    },
    {
      title: '实际日期',
      dataIndex: 'actualDate',
      key: 'actualDate',
      width: 100,
      render: (date?: string) => (date ? formatDate(date) : '-')
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method?: PaymentMethod) => (
        method ? <Tag color={PAYMENT_METHOD_COLORS[method]}>{method}</Tag> : '-'
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: Object.values(PaymentStatus).map(status => ({
        text: status,
        value: status
      })),
      onFilter: (value: any, record: PaymentPlan) => record.status === value,
      render: (status: PaymentStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status}</Tag>
      )
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 80,
      sorter: (a: PaymentPlan, b: PaymentPlan) => (a.overdueDays || 0) - (b.overdueDays || 0),
      render: (days?: number) => (
        days && days > 0 ? <Text type="danger">{days}天</Text> : '-'
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: PaymentPlan) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record.id)}
              size="small"
            />
          </Tooltip>
          {record.actualAmount && record.status !== PaymentStatus.COMPLETED && (
            <>
              {onVerify && (
                <Tooltip title="核销">
                  <Button
                    type="link"
                    icon={<CheckOutlined />}
                    onClick={() => onVerify(record.id)}
                    size="small"
                    style={{ color: '#52c41a' }}
                  />
                </Tooltip>
              )}
              {onReject && (
                <Tooltip title="驳回">
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => onReject(record.id)}
                    size="small"
                    danger
                  />
                </Tooltip>
              )}
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1300 }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      size="middle"
    />
  );
};

export default PaymentTable;
