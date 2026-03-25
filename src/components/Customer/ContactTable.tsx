/**
 * 联系人表格组件
 * 展示联系人列表数据
 */
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { Contact, Gender, DecisionRole } from '../../types/contact';

interface ContactTableProps {
  /** 联系人列表数据 */
  dataSource: Contact[];
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
}

/** 性别标签颜色映射 */
const genderColorMap: Record<string, string> = {
  '男': 'blue',
  '女': 'pink',
  '未知': 'default',
  'male': 'blue',
  'female': 'pink',
  'unknown': 'default',
};

/** 决策角色标签颜色映射 */
const roleColorMap: Record<string, string> = {
  '决策者': 'red',
  '影响者': 'orange',
  '使用者': 'green',
  '把关者': 'purple',
  '其他': 'default',
  'decision_maker': 'red',
  'influencer': 'orange',
  'user': 'green',
  'gatekeeper': 'purple',
  'other': 'default',
};

/**
 * 联系人表格组件
 */
export const ContactTable: React.FC<ContactTableProps> = ({
  dataSource,
  loading = false,
  pagination,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  /** 表格列配置 */
  const columns: ColumnsType<Contact> = [
    {
      title: t('contact.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <Tag color={genderColorMap[record.gender || '未知']}>
            {text}
          </Tag>
        </Space>
      ),
    },
    {
      title: t('contact.table.position'),
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: t('contact.table.jobLevel'),
      dataIndex: 'jobLevel',
      key: 'jobLevel',
      width: 80,
      filters: [
        { text: t('contact.jobLevel.executive'), value: '高管' },
        { text: t('contact.jobLevel.middle'), value: '中层' },
        { text: t('contact.jobLevel.junior'), value: '基层' },
        { text: t('contact.jobLevel.other'), value: '其他' },
      ],
      onFilter: (value, record) => record.jobLevel === value,
    },
    {
      title: t('contact.table.decisionRole'),
      dataIndex: 'decisionRole',
      key: 'decisionRole',
      width: 100,
      render: (role?: DecisionRole) => {
        const roleKeyMap: Record<string, string> = {
          '决策者': 'decision_maker',
          '影响者': 'influencer',
          '使用者': 'user',
          '把关者': 'gatekeeper',
          '其他': 'other',
        };
        return role ? (
          <Tag color={roleColorMap[role]}>
            {t(`contact.table.decisionRole_${roleKeyMap[role] || role}`, { defaultValue: role })}
          </Tag>
        ) : '-';
      },
    },
    {
      title: t('contact.table.customerName'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: t('contact.table.mobile'),
      dataIndex: 'mobile',
      key: 'mobile',
      width: 130,
    },
    {
      title: t('contact.table.email'),
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: t('contact.table.wechat'),
      dataIndex: 'wechat',
      key: 'wechat',
      width: 120,
    },
    {
      title: t('contact.table.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('contact.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t('contact.table.actions'),
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => onViewDetail(record.id)}
          >
            {t('contact.table.viewDetail')}
          </Button>
          {onEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            >
              {t('contact.table.edit')}
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title={t('contact.table.confirmDelete')}
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
                {t('contact.table.delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table<Contact>
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      scroll={{ x: 1400 }}
    />
  );
};