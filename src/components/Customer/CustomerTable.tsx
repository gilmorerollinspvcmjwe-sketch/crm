/**
 * 客户表格组件
 * 展示客户列表数据，支持批量操作
 */
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
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
const statusColorMap: Record<CustomerStatus, string> = {
  '潜在': 'default',
  '意向': 'processing',
  '成交': 'success',
  '流失': 'error',
  '冻结': 'warning',
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
      message.warning('请选择要分配的客户');
      return;
    }
    onBatchAssign?.(selectedRowKeys as string[]);
  };

  /** 处理批量删除 */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的客户');
      return;
    }
    onBatchDelete?.(selectedRowKeys as string[]);
  };

  /** 表格列配置 */
  const columns: ColumnsType<Customer> = [
    {
      title: '客户名称',
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
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 150,
      ellipsis: true,
    },
    {
      title: '规模',
      dataIndex: 'companySize',
      key: 'companySize',
      width: 120,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: CustomerLevel) => (
        <Tag color={levelColorMap[level]}>{level}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: CustomerStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
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
            详情
          </Button>
          {onEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            >
              编辑
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="确定要删除该客户吗？"
              onConfirm={() => onDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                删除
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
            <span>已选择 {selectedRowKeys.length} 项</span>
            {onBatchAssign && (
              <Button size="small" onClick={handleBatchAssign}>
                批量分配
              </Button>
            )}
            {onBatchDelete && (
              <Button size="small" danger onClick={handleBatchDelete}>
                批量删除
              </Button>
            )}
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              取消选择
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
