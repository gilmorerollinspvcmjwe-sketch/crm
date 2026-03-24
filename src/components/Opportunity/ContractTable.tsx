import React from 'react';
import { Table, Tag, Space, Button, Typography, Popconfirm, Tooltip, Progress } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, CheckCircleOutlined, FolderOutlined, CiOutlined as ArchiveOutlined } from '@ant-design/icons';
import { Contract, ContractStatus, ContractType, PaymentPlan } from '../../types/contract';

const { Text } = Typography;

// 合同表格属性
interface ContractTableProps {
  // 合同数据
  data: Contract[];
  // 查看详情回调
  onViewDetail: (id: string) => void;
  // 编辑回调
  onEdit: (id: string) => void;
  // 删除回调
  onDelete: (id: string) => void;
  // 提交审批回调
  onSubmitApproval?: (id: string) => void;
  // 归档回调
  onArchive?: (id: string) => void;
  // 加载状态
  loading?: boolean;
}

// 状态颜色配置
const STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: 'default',
  [ContractStatus.PENDING_APPROVAL]: 'processing',
  [ContractStatus.ACTIVE]: 'success',
  [ContractStatus.ARCHIVED]: 'blue',
  [ContractStatus.TERMINATED]: 'red'
};

// 类型颜色配置
const TYPE_COLORS: Record<ContractType, string> = {
  [ContractType.SALES]: 'green',
  [ContractType.PURCHASE]: 'orange',
  [ContractType.SERVICE]: 'cyan',
  [ContractType.OTHER]: 'default'
};

// 格式化金额
const formatAmount = (amount: number) => {
  return `¥${(amount / 10000).toFixed(1)}万`;
};

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

// 计算回款进度
const calculatePaymentProgress = (paymentPlans: PaymentPlan[]) => {
  if (!paymentPlans || paymentPlans.length === 0) return 0;
  const completed = paymentPlans.filter(p => p.status === 'COMPLETED').length;
  return Math.round((completed / paymentPlans.length) * 100);
};

/**
 * 合同表格组件
 * 展示合同列表数据
 */
export const ContractTable: React.FC<ContractTableProps> = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  onSubmitApproval,
  onArchive,
  loading = false
}) => {
  // 表格列定义
  const columns = [
    {
      title: '合同名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left' as const,
      render: (name: string, record: Contract) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.contractNumber}</Text>
        </Space>
      )
    },
    {
      title: '合同编号',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      width: 120,
      render: (number: string) => (
        <Text code>{number}</Text>
      )
    },
    {
      title: '所属客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      filters: Array.from(new Set(data.map(item => item.customerName))).map(name => ({
        text: name,
        value: name
      })),
      onFilter: (value: any, record: Contract) => record.customerName === value
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: (a: Contract, b: Contract) => a.amount - b.amount,
      render: (amount: number) => (
        <Text strong style={{ color: '#faad14' }}>
          {formatAmount(amount)}
        </Text>
      )
    },
    {
      title: '签订日期',
      dataIndex: 'signingDate',
      key: 'signingDate',
      width: 100,
      sorter: (a: Contract, b: Contract) =>
        new Date(a.signingDate).getTime() - new Date(b.signingDate).getTime(),
      render: (date: string) => formatDate(date)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: Object.values(ContractStatus).map(status => ({
        text: status,
        value: status
      })),
      onFilter: (value: any, record: Contract) => record.status === value,
      render: (status: ContractStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status}</Tag>
      )
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
      filters: Array.from(new Set(data.map(item => item.ownerName))).map(name => ({
        text: name,
        value: name
      })),
      onFilter: (value: any, record: Contract) => record.ownerName === value
    },
    {
      title: '回款进度',
      key: 'paymentProgress',
      width: 120,
      render: (_: any, record: Contract) => {
        const progress = calculatePaymentProgress(record.paymentPlans);
        return (
          <Tooltip title={`已回款 ${record.paymentPlans.filter(p => p.status === 'COMPLETED').length}/${record.paymentPlans.length} 期`}>
            <Progress
              percent={progress}
              size="small"
              strokeColor={progress === 100 ? '#52c41a' : progress >= 50 ? '#1890ff' : '#faad14'}
            />
          </Tooltip>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right' as const,
      render: (_: any, record: Contract) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record.id)}
              size="small"
            />
          </Tooltip>
          {record.status === ContractStatus.DRAFT && (
            <>
              <Tooltip title="编辑">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record.id)}
                  size="small"
                />
              </Tooltip>
              {onSubmitApproval && (
                <Tooltip title="提交审批">
                  <Button
                    type="link"
                    icon={<CheckCircleOutlined />}
                    onClick={() => onSubmitApproval(record.id)}
                    size="small"
                    style={{ color: '#52c41a' }}
                  />
                </Tooltip>
              )}
            </>
          )}
          {record.status === ContractStatus.ACTIVE && onArchive && (
            <Tooltip title="归档">
              <Button
                type="link"
                icon={<ArchiveOutlined />}
                onClick={() => onArchive(record.id)}
                size="small"
              />
            </Tooltip>
          )}
          <Popconfirm
            title="确定要删除这个合同吗？"
            onConfirm={() => onDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
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
      scroll={{ x: 1400 }}
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

export default ContractTable;
