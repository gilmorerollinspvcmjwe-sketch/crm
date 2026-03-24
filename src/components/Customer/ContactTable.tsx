/**
 * 联系人表格组件
 * 展示联系人列表数据
 */
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
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
const genderColorMap: Record<Gender, string> = {
  '男': 'blue',
  '女': 'pink',
  '未知': 'default',
};

/** 决策角色标签颜色映射 */
const roleColorMap: Record<DecisionRole, string> = {
  '决策者': 'red',
  '影响者': 'orange',
  '使用者': 'green',
  '把关者': 'purple',
  '其他': 'default',
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
  /** 表格列配置 */
  const columns: ColumnsType<Contact> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <Tag color={genderColorMap[record.gender || '未知']}>{text}</Tag>
        </Space>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '职级',
      dataIndex: 'jobLevel',
      key: 'jobLevel',
      width: 80,
      filters: [
        { text: '高管', value: '高管' },
        { text: '中层', value: '中层' },
        { text: '基层', value: '基层' },
        { text: '其他', value: '其他' },
      ],
      onFilter: (value, record) => record.jobLevel === value,
    },
    {
      title: '决策角色',
      dataIndex: 'decisionRole',
      key: 'decisionRole',
      width: 100,
      render: (role?: DecisionRole) => (
        role ? <Tag color={roleColorMap[role]}>{role}</Tag> : '-'
      ),
    },
    {
      title: '所属客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: '微信',
      dataIndex: 'wechat',
      key: 'wechat',
      width: 120,
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
      width: 150,
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
              title="确定要删除该联系人吗？"
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
