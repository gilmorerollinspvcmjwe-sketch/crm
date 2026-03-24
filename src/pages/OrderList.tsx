/**
 * Order List Page
 * 
 * Features:
 * - Filter by status, customer, date range, amount range
 * - Table with order information
 * - Batch operations
 * - Create new order
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  Dropdown,
  Menu,
  Modal,
  message,
  Typography,
  Tooltip,
  Badge,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrders, filterOrders, orderStatusColors, orderStatusLabels, Order } from '../mock/orderData';
import { colors } from '../styles/tokens';
import { formatCurrency } from '../utils/format';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

/**
 * Order List Page Component
 */
export const OrderList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    amountMin: undefined as number | undefined,
    amountMax: undefined as number | undefined,
  });

  /** Load orders */
  const loadOrders = () => {
    setLoading(true);
    try {
      const data = getOrders();
      setOrders(data);
    } catch (error) {
      message.error(t('common.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    loadOrders();
  }, []);

  /** Filtered orders */
  const filteredOrders = useMemo(() => {
    return filterOrders({
      search: filters.search,
      status: filters.status || undefined,
      dateFrom: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
      dateTo: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
      amountMin: filters.amountMin,
      amountMax: filters.amountMax,
    });
  }, [orders, filters]);

  /** Statistics */
  const statistics = useMemo(() => {
    const total = filteredOrders.length;
    const totalAmount = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
    const pending = filteredOrders.filter(o => ['draft', 'confirmed', 'processing'].includes(o.status)).length;
    const completed = filteredOrders.filter(o => o.status === 'completed').length;
    return { total, totalAmount, pending, completed };
  }, [filteredOrders]);

  /** Handle search */
  const handleSearch = () => {
    // Filtering is handled by useMemo
  };

  /** Handle reset */
  const handleReset = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: null,
      amountMin: undefined,
      amountMax: undefined,
    });
  };

  /** Handle view detail */
  const handleViewDetail = (order: Order) => {
    navigate(`/order/${order.id}`);
  };

  /** Handle batch delete */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t('order.selectOrders'));
      return;
    }
    Modal.confirm({
      title: t('common.deleteConfirm'),
      content: t('order.batchDeleteConfirm', { count: selectedRowKeys.length }),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: () => {
        message.success(t('common.deleteSuccess'));
        setSelectedRowKeys([]);
        loadOrders();
      },
    });
  };

  /** Status tag render */
  const renderStatusTag = (status: Order['status']) => {
    const colorConfig = orderStatusColors[status];
    return (
      <Tag
        style={{
          background: colorConfig.bg,
          color: colorConfig.color,
          border: 'none',
        }}
      >
        {orderStatusLabels[status]}
      </Tag>
    );
  };

  /** Table columns */
  const columns = [
    {
      title: t('order.orderNumber'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text: string, record: Order) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
    },
    {
      title: t('order.customer'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: t('order.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => (
        <Text strong style={{ color: colors.primary }}>
          ¥{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Order['status']) => renderStatusTag(status),
    },
    {
      title: t('order.orderDate'),
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
      render: (date: string) => <Text>{date}</Text>,
    },
    {
      title: t('order.deliveryDate'),
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 120,
      render: (date: string) => <Text type={date ? undefined : 'secondary'}>{date || '-'}</Text>,
    },
    {
      title: t('order.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: Order) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: t('common.details') },
              { key: 'edit', icon: <EditOutlined />, label: t('common.edit') },
              { type: 'divider' },
              { key: 'confirm', icon: <CheckCircleOutlined />, label: t('order.confirmOrder'), disabled: record.status !== 'draft' },
              { key: 'ship', icon: <CarOutlined />, label: t('order.shipOrder'), disabled: !['confirmed', 'processing'].includes(record.status) },
              { key: 'complete', icon: <FileTextOutlined />, label: t('order.completeOrder'), disabled: record.status !== 'delivered' },
              { type: 'divider' },
              { key: 'cancel', icon: <CloseCircleOutlined />, label: t('order.cancelOrder'), danger: true, disabled: ['completed', 'cancelled'].includes(record.status) },
            ],
            onClick: ({ key }) => {
              if (key === 'view') {
                handleViewDetail(record);
              } else if (key === 'edit') {
                message.info(t('common.edit') + ' - ' + record.orderNumber);
              } else if (key === 'confirm') {
                Modal.confirm({
                  title: t('order.confirmOrder'),
                  content: t('order.confirmOrderContent'),
                  onOk: () => message.success(t('common.success')),
                });
              } else if (key === 'ship') {
                Modal.confirm({
                  title: t('order.shipOrder'),
                  content: t('order.shipOrderContent'),
                  onOk: () => message.success(t('common.success')),
                });
              } else if (key === 'complete') {
                Modal.confirm({
                  title: t('order.completeOrder'),
                  content: t('order.completeOrderContent'),
                  onOk: () => message.success(t('common.success')),
                });
              } else if (key === 'cancel') {
                Modal.confirm({
                  title: t('order.cancelOrder'),
                  content: t('order.cancelOrderContent'),
                  okType: 'danger',
                  onOk: () => message.success(t('common.success')),
                });
              }
            },
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  /** Row selection */
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ padding: 16, background: colors.background.default, minHeight: '100%' }}>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('order.totalOrders')}
              value={statistics.total}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('order.totalAmount')}
              value={statistics.totalAmount}
              precision={0}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('order.pendingOrders')}
              value={statistics.pending}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('order.completedOrders')}
              value={statistics.completed}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Card */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Form layout="inline">
          <Form.Item style={{ marginBottom: 8 }}>
            <Input
              placeholder={t('order.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 220 }}
              allowClear
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Select
              placeholder={t('order.statusPlaceholder')}
              value={filters.status || undefined}
              onChange={status => setFilters({ ...filters, status: status || '' })}
              style={{ width: 140 }}
              allowClear
              options={[
                { label: orderStatusLabels.draft, value: 'draft' },
                { label: orderStatusLabels.confirmed, value: 'confirmed' },
                { label: orderStatusLabels.processing, value: 'processing' },
                { label: orderStatusLabels.shipped, value: 'shipped' },
                { label: orderStatusLabels.delivered, value: 'delivered' },
                { label: orderStatusLabels.completed, value: 'completed' },
                { label: orderStatusLabels.cancelled, value: 'cancelled' },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | null })}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                {t('common.search')}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                {t('common.reset')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Actions Bar */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/order/create')}
              >
                {t('order.createOrder')}
              </Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button icon={<DeleteOutlined />} danger onClick={handleBatchDelete}>
                    {t('common.delete')} ({selectedRowKeys.length})
                  </Button>
                </>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<DownloadOutlined />}>
                {t('common.export')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card size="small">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredOrders}
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('common.total') + ` ${total} ` + t('common.items'),
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default OrderList;