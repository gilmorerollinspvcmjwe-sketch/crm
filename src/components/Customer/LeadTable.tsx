/**
 * 线索表格组件
 * 展示线索列表数据，支持批量操作
 */
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  /** 线索状态标签颜色映射 */
  const statusColorMap: Record<string, string> = {
    [t('lead.status.pending')]: 'default',
    [t('lead.status.following')]: 'processing',
    [t('lead.status.converted')]: 'success',
    [t('lead.status.closed')]: 'error',
  };

  /** 线索等级标签颜色映射 */
  const levelColorMap: Record<string, string> = {
    'A': 'red',
    'B': 'orange',
    'C': 'blue',
    'D': 'gray',
  };

  /** 线索来源标签颜色映射 */
  const sourceColorMap: Record<string, string> = {
    [t('lead.source.campaign')]: 'purple',
    [t('lead.source.website')]: 'blue',
    [t('lead.source.referral')]: 'green',
    [t('lead.source.coldCall')]: 'orange',
    [t('lead.source.ad')]: 'cyan',
    [t('lead.source.other')]: 'default',
  };

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
      message.warning(t('lead.batch.selectAssign'));
      return;
    }
    onBatchAssign?.(selectedRowKeys as string[]);
  };

  /** 处理批量转化 */
  const handleBatchConvert = () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t('lead.batch.selectConvert'));
      return;
    }
    onBatchConvert?.(selectedRowKeys as string[]);
  };

  /** 表格列配置 */
  const columns: ColumnsType<Lead> = [
    {
      title: t('lead.column.name'),
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
      title: t('lead.column.source'),
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: LeadSource) => (
        <Tag color={sourceColorMap[source]}>{source}</Tag>
      ),
    },
    {
      title: t('lead.column.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: LeadStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: t('lead.column.level'),
      dataIndex: 'level',
      key: 'level',
      width: 70,
      render: (level?: LeadLevel) => (
        level ? <Tag color={levelColorMap[level]}>{level}</Tag> : '-'
      ),
    },
    {
      title: t('lead.column.score'),
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
      title: t('lead.column.company'),
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
      ellipsis: true,
    },
    {
      title: t('lead.column.mobile'),
      dataIndex: 'mobile',
      key: 'mobile',
      width: 130,
    },
    {
      title: t('lead.column.budget'),
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
    },
    {
      title: t('lead.column.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('lead.column.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t('lead.column.action'),
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
              {t('lead.action.detail')}
            </Button>
            {onEdit && record.status !== t('lead.status.converted') && record.status !== t('lead.status.closed') && (
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record.id)}
              >
                {t('lead.action.edit')}
              </Button>
            )}
            {onAssign && record.status !== t('lead.status.converted') && record.status !== t('lead.status.closed') && (
              <Button
                type="link"
                size="small"
                onClick={() => onAssign(record.id)}
              >
                {t('lead.action.assign')}
              </Button>
            )}
          </Space>
          <Space size="small">
            {onConvert && record.status === t('lead.status.following') && (
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => onConvert(record.id)}
              >
                {t('lead.action.convert')}
              </Button>
            )}
            {onDelete && record.status !== t('lead.status.converted') && (
              <Popconfirm
                title={t('lead.delete.confirm')}
                onConfirm={() => onDelete(record.id)}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  {t('lead.action.delete')}
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
            <span>{t('lead.batch.selected', { count: selectedRowKeys.length })}</span>
            {onBatchAssign && (
              <Button size="small" onClick={handleBatchAssign}>
                {t('lead.batch.assign')}
              </Button>
            )}
            {onBatchConvert && (
              <Button size="small" type="primary" onClick={handleBatchConvert}>
                {t('lead.batch.convert')}
              </Button>
            )}
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              {t('lead.batch.cancel')}
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

export default LeadTable;