/**
 * 客户表格组件
 * 展示客户列表数据，支持批量操作
 */
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { Customer, CustomerLevel, CustomerStatus } from '../../types/customer';

interface CustomerTableProps {
  /** 客户列表数据 */
  dataSource: Customer[];
  /** 加载状态 */
  loading?: boolean;
  /** 分页配置 */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  /** 查看详情回调 */
  onViewDetail: (id: string) => void;
  /** 编辑回调 */
  onEdit?: (id: string) => void;
  /** 删除回调 */
  onDelete?: (id: string) => void;
  /** 批量分配回调 */
  onBatchAssign?: (ids: string[]) => void;
  /** 批量删除回调 */
  onBatchDelete?: (ids: string[]) => void;
}

/** 客户等级标签颜色映射 */
const levelColorMap: Record<CustomerLevel, string> = {
  'A': 'red',
  'B': 'orange',
  'C': 'blue',
  'D': 'gray',
};

/** 客户状态标签颜色映射 */
const statusColorMap: Record<string, string> = {
  '潜在': 'default',
  '意向': 'processing',
  '成交': 'success',
  '流失': 'error',
  '冻结': 'warning',
  'prospect': 'default',
  'interested': 'processing',
  'closed': 'success',
  'churned': 'error',
  'frozen': 'warning',
};

/**
 * 客户表格组件
 */
export const CustomerTable: React.FC<CustomerTableProps> = ({
  dataSource,
  loading = false,
  pagination,
  onViewDetail,
  onEdit,
  onDelete,
  onBatchAssign,
  onBatchDelete,
}) => {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  /** 处理选择变化 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /** 行选择配置 */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  /** 处理批量分配 */
  const handleBatchAssign = () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t('customerTable.selectToAssign'));
      return;
    }
    onBatchAssign?.(selectedRowKeys as string[]);
  };

  /** 处理批量删除 */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t('customerTable.selectToDelete'));
      return;
    }
    onBatchDelete?.(selectedRowKeys as string[]);
  };

  /** 表格列配置 */
  const columns: ColumnsType<Customer> = [
    {
      title: t('customerTable.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <a onClick={() => onViewDetail(record.id)}>{text}</a>
          {record.shortName && <span style={{ color: '#999' }}>({record.shortName})</span>}
        </Space>
      ),
    },
    {
      title: t('customerTable.industry'),
      dataIndex: 'industry',
      key: 'industry',
      width: 150,
      ellipsis: true,
    },
    {
      title: t('customerTable.size'),
      dataIndex: 'companySize',
      key: 'companySize',
      width: 120,
    },
    {
      title: t('customerTable.source'),
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: t('customerTable.level'),
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: CustomerLevel) => (
        <Tag color={levelColorMap[level]}>
          {t(`customer.list.levelOptions.${level}`, { defaultValue: level })}
        </Tag>
      ),
    },
    {
      title: t('customerTable.status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: CustomerStatus) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {t(`customer.list.statusOptions.${status}`, { defaultValue: status })}
        </Tag>
      ),
    },
    {
      title: t('customerTable.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('customerTable.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t('customerTable.actions'),
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => onViewDetail(record.id)}
          >
            {t('customerTable.viewDetail')}
          </Button>
          {onEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            >
              {t('customerTable.edit')}
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title={t('customerTable.confirmDelete')}
              onConfirm={() => onDelete(record.id)}
              okText={t('commonBatch.confirm')}
              cancelText={t('commonBatch.cancel')}
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                {t('customerTable.delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 批量操作栏 */}
      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '8px 12px', background: '#e6f7ff', borderRadius: 4 }}>
          <Space>
            <span>{t('customerTable.selectedCount', { count: selectedRowKeys.length })}</span>
            {onBatchAssign && (
              <Button size="small" onClick={handleBatchAssign}>
                {t('customerTable.batchAssign')}
              </Button>
            )}
            {onBatchDelete && (
              <Button size="small" danger onClick={handleBatchDelete}>
                {t('customerTable.batchDelete')}
              </Button>
            )}
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              {t('customerTable.cancelSelection')}
            </Button>
          </Space>
        </div>
      )}

      {/* 客户表格 */}
      <Table<Customer>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};