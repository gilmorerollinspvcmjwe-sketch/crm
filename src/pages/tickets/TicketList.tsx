/**
 * 工单列表页面 - 工单系统对接 Demo
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Tag, Spin, Modal, Typography, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Ticket, TicketStatus, TicketPriority } from '../../types/ticket';
import { getTicketList, getTicketById, getTicketActivities } from '../../services/ticketService';
import { TicketCard } from '../../components/Integration/TicketCard';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/**
 * 工单列表页面组件
 */
export const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  /** 加载工单列表 */
  const loadTickets = async () => {
    setLoading(true);
    try {
      const result = await getTicketList({
        page,
        pageSize,
      });
      setTickets(result.list);
      setTotal(result.total);
    } catch (error) {
      console.error('加载工单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [page, pageSize]);

  /** 查看工单详情 */
  const handleViewDetail = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailModalVisible(true);
  };

  /** 状态标签颜色 */
  const statusColorMap: Record<TicketStatus, string> = {
    [TicketStatus.OPEN]: 'red',
    [TicketStatus.IN_PROGRESS]: 'blue',
    [TicketStatus.PENDING]: 'orange',
    [TicketStatus.RESOLVED]: 'green',
    [TicketStatus.CLOSED]: 'default',
  };

  /** 优先级标签颜色 */
  const priorityColorMap: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: 'default',
    [TicketPriority.MEDIUM]: 'blue',
    [TicketPriority.HIGH]: 'orange',
    [TicketPriority.URGENT]: 'red',
  };

  /** 表格列定义 */
  const columns: ColumnsType<Ticket> = [
    {
      title: '工单号',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 140,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TicketStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (priority: TicketPriority) => (
        <Tag color={priorityColorMap[priority]}>{priority}</Tag>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      render: (name?: string) => name || '-',
    },
    {
      title: '处理人',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 100,
      render: (name?: string) => name || '未分配',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Ticket) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索工单"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              allowClear
            >
              <Option value={TicketStatus.OPEN}>待处理</Option>
              <Option value={TicketStatus.IN_PROGRESS}>处理中</Option>
              <Option value={TicketStatus.PENDING}>待反馈</Option>
              <Option value={TicketStatus.RESOLVED}>已解决</Option>
              <Option value={TicketStatus.CLOSED}>已关闭</Option>
            </Select>
            <Select
              placeholder="优先级"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: 100 }}
              allowClear
            >
              <Option value={TicketPriority.LOW}>低</Option>
              <Option value={TicketPriority.MEDIUM}>中</Option>
              <Option value={TicketPriority.HIGH}>高</Option>
              <Option value={TicketPriority.URGENT}>紧急</Option>
            </Select>
            <Button onClick={loadTickets}>查询</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新建工单
          </Button>
        </Space>

        {/* 工单表格 */}
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个工单`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 工单详情弹窗 */}
      <Modal
        title="工单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTicket && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Tag color={statusColorMap[selectedTicket.status]}>{selectedTicket.status}</Tag>
              <Tag color={priorityColorMap[selectedTicket.priority]}>{selectedTicket.priority}</Tag>
            </Space>

            <Title level={4}>{selectedTicket.title}</Title>

            <Divider orientation="left">基本信息</Divider>
            <Paragraph>
              <Text strong>工单号：</Text>{selectedTicket.ticketNumber}<br />
              <Text strong>客户：</Text>{selectedTicket.customerName || '-'}<br />
              <Text strong>联系人：</Text>{selectedTicket.contactName || '-'}<br />
              <Text strong>处理人：</Text>{selectedTicket.assigneeName || '未分配'}<br />
              <Text strong>分类：</Text>{selectedTicket.categoryName}<br />
              <Text strong>来源：</Text>{selectedTicket.source}<br />
              <Text strong>创建时间：</Text>{selectedTicket.createdAt}<br />
              <Text strong>截止时间：</Text>{selectedTicket.dueDate || '无'}
            </Paragraph>

            <Divider orientation="left">描述</Divider>
            <Paragraph>{selectedTicket.description}</Paragraph>

            {selectedTicket.tags.length > 0 && (
              <>
                <Divider orientation="left">标签</Divider>
                <Space wrap>
                  {selectedTicket.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TicketList;
