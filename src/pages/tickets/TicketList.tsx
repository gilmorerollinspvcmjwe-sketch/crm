/**
 * 工单列表页面 - 工单系统对接 Demo
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Tag, Spin, Modal, Typography, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Ticket, TicketStatus, TicketPriority } from '../../types/ticket';
import { getTicketList, getTicketById, getTicketActivities } from '../../services/ticketService';
import { TicketCard } from '../../components/Integration/TicketCard';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/**
 * 工单列表页面组件
 */
export const TicketList: React.FC = () => {
  const { t } = useTranslation();
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
      console.error(t('integration.tickets.loadFailed'), ':', error);
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
      title: t('integration.tickets.columnTicketNumber'),
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 140,
    },
    {
      title: t('integration.tickets.columnTitle'),
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
    },
    {
      title: t('integration.tickets.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TicketStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: t('integration.tickets.columnPriority'),
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (priority: TicketPriority) => (
        <Tag color={priorityColorMap[priority]}>{priority}</Tag>
      ),
    },
    {
      title: t('integration.tickets.columnCustomer'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      render: (name?: string) => name || '-',
    },
    {
      title: t('integration.tickets.columnAssignee'),
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 100,
      render: (name?: string) => name || t('integration.tickets.unassigned'),
    },
    {
      title: t('integration.tickets.columnCreatedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: t('common.detail'),
      key: 'action',
      width: 100,
      render: (_: any, record: Ticket) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          {t('integration.tickets.viewDetail')}
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
              placeholder={t('integration.tickets.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder={t('integration.tickets.statusFilter')}
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              allowClear
            >
              <Option value={TicketStatus.OPEN}>{t('integration.tickets.statusOpen')}</Option>
              <Option value={TicketStatus.IN_PROGRESS}>{t('integration.tickets.statusInProgress')}</Option>
              <Option value={TicketStatus.PENDING}>{t('integration.tickets.statusPending')}</Option>
              <Option value={TicketStatus.RESOLVED}>{t('integration.tickets.statusResolved')}</Option>
              <Option value={TicketStatus.CLOSED}>{t('integration.tickets.statusClosed')}</Option>
            </Select>
            <Select
              placeholder={t('integration.tickets.priorityFilter')}
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: 100 }}
              allowClear
            >
              <Option value={TicketPriority.LOW}>{t('integration.tickets.priorityLow')}</Option>
              <Option value={TicketPriority.MEDIUM}>{t('integration.tickets.priorityMedium')}</Option>
              <Option value={TicketPriority.HIGH}>{t('integration.tickets.priorityHigh')}</Option>
              <Option value={TicketPriority.URGENT}>{t('integration.tickets.priorityUrgent')}</Option>
            </Select>
            <Button onClick={loadTickets}>{t('common.query')}</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            {t('integration.tickets.newTicket')}
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
            showTotal: (total) => `${t('common.total')} ${total} ${t('common.items')}`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 工单详情弹窗 */}
      <Modal
        title={t('integration.tickets.ticketDetail')}
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

            <Divider orientation="left">{t('integration.tickets.basicInfo')}</Divider>
            <Paragraph>
              <Text strong>{t('integration.tickets.columnTicketNumber')}：</Text>{selectedTicket.ticketNumber}<br />
              <Text strong>{t('integration.tickets.columnCustomer')}：</Text>{selectedTicket.customerName || '-'}<br />
              <Text strong>{t('integration.tickets.contact')}：</Text>{selectedTicket.contactName || '-'}<br />
              <Text strong>{t('integration.tickets.columnAssignee')}：</Text>{selectedTicket.assigneeName || t('integration.tickets.unassigned')}<br />
              <Text strong>{t('integration.tickets.category')}：</Text>{selectedTicket.categoryName}<br />
              <Text strong>{t('integration.tickets.source')}：</Text>{selectedTicket.source}<br />
              <Text strong>{t('integration.tickets.columnCreatedAt')}：</Text>{selectedTicket.createdAt}<br />
              <Text strong>{t('integration.tickets.dueDate')}：</Text>{selectedTicket.dueDate || t('common.none')}
            </Paragraph>

            <Divider orientation="left">{t('common.description')}</Divider>
            <Paragraph>{selectedTicket.description}</Paragraph>

            {selectedTicket.tags.length > 0 && (
              <>
                <Divider orientation="left">{t('integration.tickets.tags')}</Divider>
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
