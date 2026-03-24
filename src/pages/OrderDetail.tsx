/**
 * Order Detail Page - Three Column Layout
 * 
 * Layout:
 * - Left Sidebar (240px): Order status progress + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Products/Delivery/Activity
 * - Right Sidebar (320px): Related customer/contract/payment cards
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Tabs,
  Tag,
  Table,
  Timeline,
  message,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Descriptions,
  Steps,
  Result,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrderById, orderStatusColors, orderStatusLabels, orderStatusFlow, Order, OrderItem } from '../mock/orderData';
import { colors } from '../styles/tokens';
import { formatCurrency } from '../utils/format';
import dayjs from 'dayjs';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

/** Step status type */
type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/**
 * Order Detail Page Component
 */
export const OrderDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusChangeModal, setStatusChangeModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  /** Load order detail */
  const loadOrderDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = getOrderById(id);
      if (data) {
        setOrder(data);
      } else {
        message.error(t('order.notFound'));
      }
    } catch (error) {
      message.error(t('common.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    loadOrderDetail();
  }, [id]);

  /** Back to list */
  const handleBack = () => {
    navigate('/order/list');
  };

  /** Handle status change */
  const handleStatusChange = (status: Order['status']) => {
    setSelectedStatus(status);
    if (status === 'cancelled') {
      setStatusChangeModal(true);
    } else {
      Modal.confirm({
        title: t('order.changeStatus'),
        content: t('order.changeStatusContent', { status: orderStatusLabels[status] }),
        onOk: () => {
          message.success(t('common.success'));
          loadOrderDetail();
        },
      });
    }
  };

  /** Handle cancel order */
  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      message.warning(t('order.cancelReasonRequired'));
      return;
    }
    message.success(t('common.success'));
    setStatusChangeModal(false);
    setCancelReason('');
    loadOrderDetail();
  };

  if (!order) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Result
          status="404"
          title={t('order.notFound')}
          extra={<Button type="primary" onClick={handleBack}>{t('common.back')}</Button>}
        />
      </div>
    );
  }

  /** Get current step index */
  const getCurrentStepIndex = (): number => {
    if (order.status === 'cancelled') return -1;
    return orderStatusFlow.indexOf(order.status);
  };

  /** Get step status */
  const getStepStatus = (index: number): StepStatus => {
    const current = getCurrentStepIndex();
    if (current === -1) return 'error';
    if (index < current) return 'finish';
    if (index === current) return 'process';
    return 'wait';
  };

  /** Action buttons */
  const actionButtons = [
    { key: 'edit', icon: <EditOutlined />, label: t('common.edit'), onClick: () => message.info(t('common.edit')) },
    { key: 'delete', icon: <DeleteOutlined />, label: t('common.delete'), onClick: () => {
      Modal.confirm({
        title: t('common.deleteConfirm'),
        content: t('order.deleteContent'),
        okType: 'danger',
        onOk: () => {
          message.success(t('common.deleteSuccess'));
          navigate('/order/list');
        },
      });
    }, danger: true },
    { divider: true },
    ...(order.status === 'draft' ? [
      { key: 'confirm', icon: <CheckCircleOutlined />, label: t('order.confirmOrder'), onClick: () => handleStatusChange('confirmed') },
    ] : []),
    ...(order.status === 'confirmed' || order.status === 'processing' ? [
      { key: 'ship', icon: <CarOutlined />, label: t('order.shipOrder'), onClick: () => handleStatusChange('shipped') },
    ] : []),
    ...(order.status === 'shipped' ? [
      { key: 'deliver', icon: <CheckCircleOutlined />, label: t('order.deliverOrder'), onClick: () => handleStatusChange('delivered') },
    ] : []),
    ...(order.status === 'delivered' ? [
      { key: 'complete', icon: <FileTextOutlined />, label: t('order.completeOrder'), onClick: () => handleStatusChange('completed') },
    ] : []),
    ...(!['completed', 'cancelled'].includes(order.status) ? [
      { key: 'cancel', icon: <CloseCircleOutlined />, label: t('order.cancelOrder'), onClick: () => handleStatusChange('cancelled'), danger: true },
    ] : []),
  ];

  /** Product table columns */
  const productColumns = [
    {
      title: t('order.productName'),
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: t('order.productSku'),
      dataIndex: 'productSku',
      key: 'productSku',
      width: 120,
    },
    {
      title: t('order.unitPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: t('order.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center' as const,
    },
    {
      title: t('order.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => <Text strong>¥{amount.toLocaleString()}</Text>,
    },
  ];

  /** Activity timeline */
  const activityTimeline = [
    { time: order.createdAt, action: t('order.activityCreated'), user: order.createdBy },
    ...(order.shippedAt ? [{ time: order.shippedAt, action: t('order.activityShipped'), user: order.ownerName }] : []),
    ...(order.deliveredAt ? [{ time: order.deliveredAt, action: t('order.activityDelivered'), user: order.ownerName }] : []),
    ...(order.completedAt ? [{ time: order.completedAt, action: t('order.activityCompleted'), user: order.ownerName }] : []),
    ...(order.cancelledAt ? [{ time: order.cancelledAt, action: t('order.activityCancelled'), user: order.ownerName, extra: order.cancelReason }] : []),
  ];

  /** Tab items */
  const tabItems = [
    {
      key: 'overview',
      label: t('order.tabOverview'),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label={t('order.orderNumber')}>{order.orderNumber}</Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              <Tag style={{ background: orderStatusColors[order.status].bg, color: orderStatusColors[order.status].color, border: 'none' }}>
                {orderStatusLabels[order.status]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('order.customer')}>{order.customerName}</Descriptions.Item>
            <Descriptions.Item label={t('order.amount')}>
              <Text strong style={{ color: colors.primary }}>¥{order.amount.toLocaleString()}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t('order.orderDate')}>{order.orderDate}</Descriptions.Item>
            <Descriptions.Item label={t('order.deliveryDate')}>{order.deliveryDate || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('order.owner')}>{order.ownerName}</Descriptions.Item>
            <Descriptions.Item label={t('order.createdAt')}>{order.createdAt}</Descriptions.Item>
            {order.deliveryAddress && (
              <Descriptions.Item label={t('order.deliveryAddress')} span={2}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {order.deliveryAddress}
              </Descriptions.Item>
            )}
            {order.notes && (
              <Descriptions.Item label={t('order.notes')} span={2}>{order.notes}</Descriptions.Item>
            )}
          </Descriptions>

          {/* Order Items Summary */}
          <Divider />
          <Title level={5}>{t('order.productList')}</Title>
          <Table
            rowKey="id"
            columns={productColumns}
            dataSource={order.items}
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  <Text strong>{t('order.total')}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ color: colors.primary, fontSize: 16 }}>
                    ¥{order.amount.toLocaleString()}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      ),
    },
    {
      key: 'products',
      label: t('order.tabProducts'),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Table
            rowKey="id"
            columns={productColumns}
            dataSource={order.items}
            pagination={false}
            size="middle"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  <Text strong>{t('order.total')}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ color: colors.primary, fontSize: 16 }}>
                    ¥{order.amount.toLocaleString()}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      ),
    },
    {
      key: 'delivery',
      label: t('order.tabDelivery'),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label={t('order.deliveryAddress')} span={2}>
              {order.deliveryAddress || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('order.logisticsCompany')}>
              {order.logisticsCompany || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('order.trackingNumber')}>
              {order.trackingNumber || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('order.shippedAt')}>
              {order.shippedAt || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('order.deliveredAt')}>
              {order.deliveredAt || '-'}
            </Descriptions.Item>
          </Descriptions>

          {/* Delivery Progress */}
          <Divider />
          <Title level={5}>{t('order.deliveryProgress')}</Title>
          <Steps
            current={order.status === 'cancelled' ? -1 : orderStatusFlow.slice(0, -1).indexOf(order.status)}
            status={order.status === 'cancelled' ? 'error' : undefined}
            items={[
              { title: t('order.statusDraft'), description: order.createdAt },
              { title: t('order.statusConfirmed'), description: order.status !== 'draft' ? '已完成' : '' },
              { title: t('order.statusProcessing'), description: '' },
              { title: t('order.statusShipped'), description: order.shippedAt },
              { title: t('order.statusDelivered'), description: order.deliveredAt },
            ]}
          />
        </div>
      ),
    },
    {
      key: 'activity',
      label: t('order.tabActivity'),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Timeline
            items={activityTimeline.map(item => ({
              color: item.action.includes(t('order.activityCancelled')) ? 'red' : 'blue',
              children: (
                <div>
                  <Text strong>{item.action}</Text>
                  <br />
                  <Text type="secondary">{item.time}</Text>
                  <br />
                  <Text type="secondary">{t('order.by')} {item.user}</Text>
                  {item.extra && (
                    <>
                      <br />
                      <Text type="danger">{t('order.cancelReason')}: {item.extra}</Text>
                    </>
                  )}
                </div>
              ),
            }))}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border.default}`, background: '#fff' }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          {t('order.backToList')}
        </Button>
      </div>

      {/* Main Content - Three Column Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Status Progress & Actions (240px) */}
        <div
          style={{
            width: 240,
            borderRight: `1px solid ${colors.border.default}`,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Order Info */}
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.border.light}` }}>
            <Text strong style={{ display: 'block', fontSize: 15, marginBottom: 8 }}>
              {order.orderNumber}
            </Text>
            <Space size={4} wrap>
              <Tag
                style={{
                  background: orderStatusColors[order.status].bg,
                  color: orderStatusColors[order.status].color,
                  border: 'none',
                }}
              >
                {orderStatusLabels[order.status]}
              </Tag>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: 18, color: colors.primary }}>
                ¥{order.amount.toLocaleString()}
              </Text>
            </div>
          </div>

          {/* Status Progress */}
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.border.light}` }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
              {t('order.statusProgress')}
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={getCurrentStepIndex()}
              status={order.status === 'cancelled' ? 'error' : undefined}
              items={orderStatusFlow.slice(0, -1).map((status, index) => ({
                title: orderStatusLabels[status],
                status: getStepStatus(index),
              }))}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ padding: 12, flex: 1, overflow: 'auto' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              {actionButtons.map((btn, index) => {
                if ('divider' in btn && btn.divider) {
                  return <Divider key={`divider-${index}`} style={{ margin: '8px 0' }} />;
                }
                return (
                  <Button
                    key={btn.key}
                    type="text"
                    icon={btn.icon}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      color: btn.danger ? colors.danger : undefined,
                    }}
                    onClick={btn.onClick}
                  >
                    {btn.label}
                  </Button>
                );
              })}
            </Space>
          </div>
        </div>

        {/* Middle Content - Tabs (flex: 1) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ flex: 1, overflow: 'hidden' }}
            tabBarStyle={{ padding: '0 16px', marginBottom: 0 }}
            className="order-detail-tabs"
          />
        </div>

        {/* Right Sidebar - Related Info (320px) */}
        <div
          style={{
            width: 320,
            borderLeft: `1px solid ${colors.border.default}`,
            background: '#fff',
            overflow: 'auto',
            padding: 16,
          }}
        >
          {/* Customer Card */}
          <Card
            size="small"
            title={
              <Space>
                <TeamOutlined style={{ color: colors.primary }} />
                <span>{t('order.relatedCustomer')}</span>
              </Space>
            }
            styles={{ body: { padding: 12 } }}
            style={{ marginBottom: 12 }}
          >
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>{t('order.customer')}</Text>
              <div>
                <a onClick={() => navigate(`/customer/${order.customerId}`)}>
                  <Text strong>{order.customerName}</Text>
                </a>
              </div>
            </div>
          </Card>

          {/* Contract Card */}
          {order.contractId && (
            <Card
              size="small"
              title={
                <Space>
                  <FileTextOutlined style={{ color: colors.warning }} />
                  <span>{t('order.relatedContract')}</span>
                </Space>
              }
              styles={{ body: { padding: 12 } }}
              style={{ marginBottom: 12 }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('order.contractNumber')}</Text>
                <div>
                  <a onClick={() => navigate(`/contract/${order.contractId}`)}>
                    <Text>{order.contractNumber}</Text>
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Owner Card */}
          <Card
            size="small"
            title={
              <Space>
                <UserOutlined style={{ color: colors.success }} />
                <span>{t('order.ownerInfo')}</span>
              </Space>
            }
            styles={{ body: { padding: 12 } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <div>
                <Text strong>{order.ownerName}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{t('order.sales')}</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        title={t('order.cancelOrder')}
        open={statusChangeModal}
        onCancel={() => setStatusChangeModal(false)}
        onOk={handleCancelOrder}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        okButtonProps={{ danger: true }}
      >
        <Form layout="vertical">
          <Form.Item label={t('order.cancelReason')} required>
            <TextArea
              rows={4}
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder={t('order.cancelReasonPlaceholder')}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* CSS */}
      <style>{`
        .order-detail-tabs .ant-tabs-content {
          height: 100%;
          overflow: auto;
          padding: 0 16px;
        }
        .order-detail-tabs .ant-tabs-tabpane {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;