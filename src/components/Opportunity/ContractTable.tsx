import React from 'react';
import { Table, Tag, Space, Button, Typography, Popconfirm, Tooltip, Progress } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, CheckCircleOutlined, FolderOutlined, CiOutlined as ArchiveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
    return `¥${(amount / 10000).toFixed(1)}${t('common.unit.tenThousand')}`;
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

  // 表格列定义
  const columns = [
    {
      title: t('contract.column.name'),
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
      title: t('contract.column.number'),
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      width: 120,
      render: (number: string) => (
        <Text code>{number}</Text>
      )
    },
    {
      title: t('contract.column.customer'),
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
      title: t('contract.column.amount'),
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
      title: t('contract.column.signDate'),
      dataIndex: 'signingDate',
      key: 'signingDate',
      width: 100,
      sorter: (a: Contract, b: Contract) =>
        new Date(a.signingDate).getTime() - new Date(b.signingDate).getTime(),
      render: (date: string) => formatDate(date)
    },
    {
      title: t('contract.column.status'),
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
      title: t('contract.column.owner'),
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
      title: t('contract.column.paymentProgress'),
      key: 'paymentProgress',
      width: 120,
      render: (_: any, record: Contract) => {
        const progress = calculatePaymentProgress(record.paymentPlans);
        return (
          <Tooltip title={t('contract.paymentProgress.tooltip', { completed: record.paymentPlans.filter(p => p.status === 'COMPLETED').length, total: record.paymentPlans.length })}>
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
      title: t('contract.column.action'),
      key: 'action',
      width: 250,
      fixed: 'right' as const,
      render: (_: any, record: Contract) => (
        <Space size="small">
          <Tooltip title={t('contract.action.viewDetail')}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record.id)}
              size="small"
            />
          </Tooltip>
          {record.status === ContractStatus.DRAFT && (
            <>
              <Tooltip title={t('contract.action.edit')}>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record.id)}
                  size="small"
                />
              </Tooltip>
              {onSubmitApproval && (
                <Tooltip title={t('contract.action.submitApproval')}>
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
            <Tooltip title={t('contract.action.archive')}>
              <Button
                type="link"
                icon={<ArchiveOutlined />}
                onClick={() => onArchive(record.id)}
                size="small"
              />
            </Tooltip>
          )}
          <Popconfirm
            title={t('contract.delete.confirm')}
            onConfirm={() => onDelete(record.id)}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
          >
            <Tooltip title={t('contract.action.delete')}>
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
        showTotal: (total) => t('contract.pagination.total', { count: total }),
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      size="middle"
    />
  );
};

export default ContractTable;