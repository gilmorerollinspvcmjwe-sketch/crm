/**
 * 线索表格组件
 * 展示线索列表数据，支持批量操作
 */
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Lead, LeadStatus, LeadLevel, LeadSource } from '../../types/lead';

interface LeadTableProps {
  /** 线索列表数据 */
  dataSource: Lead[];
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
  /** 分配回调 */
  onAssign?: (id: string) => void;
  /** 转化回调 */
  onConvert?: (id: string) => void;
  /** 删除回调 */
  onDelete?: (id: string) => void;
  /** 批量分配回调 */
  onBatchAssign?: (ids: string[]) => void;
  /** 批量转化回调 */
  onBatchConvert?: (ids: string[]) => void;
}

/** 线索状态标签颜色映射 */
const statusColorMap: Record<LeadStatus, string> = {
  '待跟进': 'default',
  '跟进中': 'processing',
  '已转化': 'success',
  '已关闭': 'error',
};

/** 线索等级标签颜色映射 */
const levelColorMap: Record<LeadLevel, string> = {
  'A': 'red',
  'B': 'orange',
  'C': 'blue',
  'D': 'gray',
};

/** 线索来源标签颜色映射 */
const sourceColorMap: Record<LeadSource, string> = {
  '市场活动': 'purple',
  '官网': 'blue',
  '转介绍': 'green',
  '陌拜': 'orange',
  '广告': 'cyan',
  '其他': 'default',
};

/**
 * 线索表格组件
 */
export const LeadTable: React.FC<LeadTableProps> = ({
  dataSource,
  loading = false,
  pagination,
  onViewDetail,
  onEdit,
  onAssign,
  onConvert,
  onDelete,
  onBatchAssign,
  onBatchConvert,
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
      message.warning('请选择要分配的线索');
      return;
    }
    onBatchAssign?.(selectedRowKeys as string[]);
  };

  /** 处理批量转化 */
  const handleBatchConvert = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要转化的线索');
      return;
    }
    onBatchConvert?.(selectedRowKeys as string[]);
  };

  /** 表格列配置 */
  const columns: ColumnsType<Lead> = [
    {
      title: '线索名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <a onClick={() => onViewDetail(record.id)}>{text}</a>
          <span style={{ fontSize: 12, color: '#999' }}>
            <ThunderboltOutlined /> {record.contactName}
            {record.position && ` · ${record.position}`}
          </span>
        </Space>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: LeadSource) => (
        <Tag color={sourceColorMap[source]}>{source}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: LeadStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 70,
      render: (level?: LeadLevel) => (
        level ? <Tag color={levelColorMap[level]}>{level}</Tag> : '-'
      ),
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score?: number) => (
        score !== undefined ? (
          <Progress
            percent={score}
            size="small"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={() => score}
          />
        ) : (
          '-'
        )
      ),
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 130,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button
              type="link"
              size="small"
              onClick={() => onViewDetail(record.id)}
            >
              详情
            </Button>
            {onEdit && record.status !== '已转化' && record.status !== '已关闭' && (
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record.id)}
              >
                编辑
              </Button>
            )}
            {onAssign && record.status !== '已转化' && record.status !== '已关闭' && (
              <Button
                type="link"
                size="small"
                onClick={() => onAssign(record.id)}
              >
                分配
              </Button>
            )}
          </Space>
          <Space size="small">
            {onConvert && record.status === '跟进中' && (
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => onConvert(record.id)}
              >
                转化
              </Button>
            )}
            {onDelete && record.status !== '已转化' && (
              <Popconfirm
                title="确定要删除该线索吗？"
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
            {onBatchConvert && (
              <Button size="small" type="primary" onClick={handleBatchConvert}>
                批量转化
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

      {/* 线索表格 */}
      <Table<Lead>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        scroll={{ x: 1400 }}
      />
    </div>
  );
};
