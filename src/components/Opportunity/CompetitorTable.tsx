import React from 'react';
import { Table, Tag, Space, Button, Typography, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Competitor } from '../../types/opportunity';

const { Text, Paragraph } = Typography;

// 竞争对手表格属性
interface CompetitorTableProps {
  // 竞争对手数据
  competitors: Competitor[];
  // 是否可编辑
  editable?: boolean;
  // 添加竞争对手回调
  onAdd?: () => void;
  // 编辑竞争对手回调
  onEdit?: (competitor: Competitor) => void;
  // 删除竞争对手回调
  onDelete?: (id: string) => void;
}

/**
 * 竞争对手表格组件
 * 展示和管理商机的竞争对手信息
 */
export const CompetitorTable: React.FC<CompetitorTableProps> = ({
  competitors,
  editable = false,
  onAdd,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();

  // 表格列定义
  const columns = [
    {
      title: t('competitor.column.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => (
        <Text strong>{name}</Text>
      )
    },
    {
      title: t('competitor.column.advantage'),
      dataIndex: 'advantage',
      key: 'advantage',
      render: (text: string) => (
        <Paragraph
          type="success"
          style={{ marginBottom: 0, fontSize: 13 }}
          ellipsis={{ rows: 2, expandable: true }}
        >
          {text}
        </Paragraph>
      )
    },
    {
      title: t('competitor.column.disadvantage'),
      dataIndex: 'disadvantage',
      key: 'disadvantage',
      render: (text: string) => (
        <Paragraph
          type="danger"
          style={{ marginBottom: 0, fontSize: 13 }}
          ellipsis={{ rows: 2, expandable: true }}
        >
          {text}
        </Paragraph>
      )
    },
    {
      title: t('competitor.column.action'),
      key: 'action',
      width: 120,
      render: (_: any, record: Competitor) => (
        editable ? (
          <Space size="small">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
              size="small"
            >
              {t('competitor.action.edit')}
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete?.(record.id)}
              size="small"
            >
              {t('competitor.action.delete')}
            </Button>
          </Space>
        ) : null
      )
    }
  ];

  return (
    <div>
      {editable && onAdd && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ marginBottom: 16 }}
          size="small"
        >
          {t('competitor.action.add')}
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={competitors}
        rowKey="id"
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default CompetitorTable;