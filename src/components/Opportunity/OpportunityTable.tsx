import React from 'react';
import { Table, Tag, Space, Button, Typography, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Opportunity, OpportunityStage, OpportunityStatus } from '../../types/opportunity';

const { Text } = Typography;

// 商机表格属性
interface OpportunityTableProps {
  // 商机数据
  data: Opportunity[];
  // 查看详情回调
  onViewDetail: (id: string) => void;
  // 编辑回调
  onEdit: (id: string) => void;
  // 删除回调
  onDelete: (id: string) => void;
  // 变更阶段回调
  onChangeStage?: (id: string) => void;
  // 加载状态
  loading?: boolean;
}

// 阶段颜色配置
const STAGE_COLORS: Record<OpportunityStage, string> = {
  [OpportunityStage.LEAD_CONFIRMATION]: 'default',
  [OpportunityStage.INITIAL_CONTACT]: 'blue',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: 'cyan',
  [OpportunityStage.PROPOSAL_QUOTATION]: 'geekblue',
  [OpportunityStage.NEGOTIATION_APPROVAL]: 'orange',
  [OpportunityStage.CLOSED_WON]: 'green',
  [OpportunityStage.CLOSED_LOST]: 'red'
};

// 状态颜色配置
const STATUS_COLORS: Record<OpportunityStatus, string> = {
  [OpportunityStatus.IN_PROGRESS]: 'processing',
  [OpportunityStatus.CLOSED_WON]: 'success',
  [OpportunityStatus.CLOSED_LOST]: 'default',
  [OpportunityStatus.CLOSED]: 'default'
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
 * 商机表格组件
 * 展示商机列表数据
 */
export const OpportunityTable: React.FC<OpportunityTableProps> = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  onChangeStage,
  loading = false
}) => {
  // 表格列定义
  const columns = [
    {
      title: '商机名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left' as const,
      render: (name: string, record: Opportunity) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.customerName}</Text>
        </Space>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: (a: Opportunity, b: Opportunity) => a.amount - b.amount,
      render: (amount: number) => (
        <Text strong style={{ color: '#faad14' }}>
          {formatAmount(amount)}
        </Text>
      )
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      width: 100,
      filters: Object.values(OpportunityStage).map(stage => ({
        text: stage,
        value: stage
      })),
      onFilter: (value: any, record: Opportunity) => record.stage === value,
      render: (stage: OpportunityStage) => (
        <Tag color={STAGE_COLORS[stage]}>{stage}</Tag>
      )
    },
    {
      title: '预计成交日期',
      dataIndex: 'estimatedCloseDate',
      key: 'estimatedCloseDate',
      width: 120,
      sorter: (a: Opportunity, b: Opportunity) =>
        new Date(a.estimatedCloseDate).getTime() - new Date(b.estimatedCloseDate).getTime(),
      render: (date: string) => formatDate(date)
    },
    {
      title: '成交概率',
      dataIndex: 'probability',
      key: 'probability',
      width: 100,
      sorter: (a: Opportunity, b: Opportunity) => a.probability - b.probability,
      render: (probability: number, record: Opportunity) => (
        <Tooltip title={`阶段：${record.stage}`}>
          <Tag color={probability >= 80 ? 'green' : probability >= 50 ? 'orange' : 'red'}>
            {probability}%
          </Tag>
        </Tooltip>
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
      onFilter: (value: any, record: Opportunity) => record.ownerName === value
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a: Opportunity, b: Opportunity) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => formatDate(date)
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Opportunity) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record.id)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
              size="small"
            />
          </Tooltip>
          {onChangeStage && record.status === OpportunityStatus.IN_PROGRESS && (
            <Tooltip title="变更阶段">
              <Button
                type="link"
                icon={<ThunderboltOutlined />}
                onClick={() => onChangeStage(record.id)}
                size="small"
              />
            </Tooltip>
          )}
          <Popconfirm
            title="确定要删除这个商机吗？"
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
      scroll={{ x: 1200 }}
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

export default OpportunityTable;
