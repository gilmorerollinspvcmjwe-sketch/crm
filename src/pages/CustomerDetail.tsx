/**
 * Customer Detail Page - HubSpot Style Three-Column Layout
 * 
 * Layout:
 * - Left Sidebar (240px): Customer info + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Activity/AI Insights
 * - Right Sidebar (320px): Related information cards
 * 
 * Refactored with new UI design system
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Tag,
  Table,
  message,
  Modal,
  Form,
  Radio,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Collapse,
  Badge,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserSwitchOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  BulbOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExportOutlined,
  CloudUploadOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Input as AntInput } from 'antd';
import { Select } from '../components/ui/Select';
import { Badge as UIBadge } from '../components/ui/Badge';
import { getCustomerById } from '../mock/customerData';
import { getContactsByCustomerId } from '../mock/contactData';
import { Customer } from '../types/customer';
import { Contact } from '../types/contact';
import { colors } from '../styles/tokens';
import { formatDate, formatCurrency } from '../utils/format';
import {
  CustomerSummaryAI,
  InteractionAnalysisAI,
  RelationshipChangeAI,
  SmartSuggestionsAI,
  RiskAlertAI,
  ContentGeneratorAI,
} from '../components/AI';
import './CustomerDetail.css';

const { Text, Title, Paragraph } = Typography;

/** Customer level color mapping */
const levelColorMap: Record<string, { bg: string; color: string }> = {
  A: { bg: colors.grade.A.bg, color: colors.grade.A.fg },
  B: { bg: colors.grade.B.bg, color: colors.grade.B.fg },
  C: { bg: colors.grade.C.bg, color: colors.grade.C.fg },
  D: { bg: colors.grade.D.bg, color: colors.grade.D.fg },
};

/** Customer status badge color */
const getStatusBadgeColor = (status: string): 'brand' | 'success' | 'warning' | 'danger' | 'neutral' => {
  const colorMap: Record<string, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    '意向': 'brand',
    '谈判': 'warning',
    '成交': 'success',
    '流失': 'danger',
    '潜在': 'neutral',
  };
  return colorMap[status] || 'neutral';
};

/**
 * Customer Detail Page Component
 */
export const CustomerDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [form] = Form.useForm();

  /** Load customer detail */
  const loadCustomerDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = getCustomerById(id);
      if (data) {
        setCustomer(data);
        const contactList = getContactsByCustomerId(id);
        setContacts(contactList);
      } else {
        message.error('Customer not found');
      }
    } catch (error) {
      message.error('Failed to load customer details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    loadCustomerDetail();
  }, [id]);

  /** Back to list */
  const handleBack = () => {
    navigate('/customer/list');
  };

  /** Edit customer */
  const handleEdit = () => {
    if (customer) {
      form.setFieldsValue(customer);
      setEditModalVisible(true);
    }
  };

  /** Assign customer */
  const handleAssign = () => {
    Modal.info({
      title: t('customer.detail.actions.assign'),
      content: 'Select sales representative to assign to',
      okText: t('common.confirm'),
    });
  };

  /** New deal */
  const handleNewDeal = () => {
    if (customer) {
      navigate(`/opportunity/new?customerId=${customer.id}&customerName=${encodeURIComponent(customer.name)}`);
    }
  };

  /** New contact */
  const handleNewContact = () => {
    if (customer) {
      navigate(`/contact/new?customerId=${customer.id}&customerName=${encodeURIComponent(customer.name)}`);
    }
  };

  /** New follow-up */
  const handleNewFollowUp = () => {
    if (customer) {
      navigate(`/activity/new?customerId=${customer.id}&customerName=${encodeURIComponent(customer.name)}`);
    }
  };

  /** Return to pool */
  const handleReturnToPool = () => {
    Modal.confirm({
      title: t('customer.detail.actions.returnToPool'),
      content: `Are you sure you want to return "${customer?.name}" to the public pool?`,
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: () => {
        message.success('Customer returned to pool');
        navigate('/customer/list');
      },
    });
  };

  /** Export customer */
  const handleExport = () => {
    message.info('Export functionality coming soon');
  };

  /** Delete customer */
  const handleDelete = () => {
    Modal.confirm({
      title: t('common.confirm') + ' ' + t('common.delete'),
      content: `Are you sure you want to delete "${customer?.name}"? This action cannot be undone.`,
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success('Customer deleted successfully');
        navigate('/customer/list');
      },
    });
  };

  /** Handle edit submit */
  const handleEditSubmit = (values: any) => {
    console.log('Edit customer:', values);
    message.success('Customer updated successfully');
    setEditModalVisible(false);
    loadCustomerDetail();
  };

  if (!customer) {
    return (
      <div className="customer-detail-empty">
        <Text type="secondary">Customer not found</Text>
      </div>
    );
  }

  /** Action buttons configuration */
  const actionButtons = [
    { key: 'edit', icon: <EditOutlined />, label: t('customer.detail.actions.edit'), onClick: handleEdit },
    { key: 'assign', icon: <UserSwitchOutlined />, label: t('customer.detail.actions.assign'), onClick: handleAssign },
    { key: 'delete', icon: <DeleteOutlined />, label: t('customer.detail.actions.delete'), onClick: handleDelete, danger: true },
    { divider: true },
    { key: 'newDeal', icon: <BulbOutlined />, label: t('customer.detail.actions.newDeal'), onClick: handleNewDeal },
    { key: 'newContact', icon: <TeamOutlined />, label: t('customer.detail.actions.newContact'), onClick: handleNewContact },
    { key: 'followUp', icon: <ClockCircleOutlined />, label: t('customer.detail.actions.followUp'), onClick: handleNewFollowUp },
    { divider: true },
    { key: 'returnToPool', icon: <CloudUploadOutlined />, label: t('customer.detail.actions.returnToPool'), onClick: handleReturnToPool },
    { key: 'export', icon: <ExportOutlined />, label: t('customer.detail.actions.export'), onClick: handleExport },
  ];

  /** Related deals mock data */
  const relatedDeals = [
    { id: '1', name: 'Enterprise ERP System', amount: 800000, stage: 'Negotiation', probability: 75 },
    { id: '2', name: 'Smart Office System', amount: 450000, stage: 'Proposal', probability: 50 },
    { id: '3', name: 'Customer Service System', amount: 200000, stage: 'Discovery', probability: 30 },
  ];

  /** Related tickets mock data */
  const relatedTickets = [
    { id: '1', title: 'System Integration Issue', status: 'Open', priority: 'High' },
    { id: '2', title: 'Feature Request - Dashboard', status: 'Pending', priority: 'Medium' },
  ];

  /** Activity timeline data */
  const activityTimeline = [
    { date: '2026-03-20', type: 'email', title: 'Follow-up Email Sent', user: 'John Smith', description: 'Sent quarterly review summary' },
    { date: '2026-03-15', type: 'call', title: 'Phone Call', user: 'John Smith', description: 'Discussed implementation timeline' },
    { date: '2026-03-10', type: 'meeting', title: 'Product Demo', user: 'John Smith', description: 'Presented ERP features to technical team' },
    { date: '2026-03-01', type: 'note', title: 'Note Added', user: 'John Smith', description: 'Customer interested in cloud migration' },
    { date: '2026-02-28', type: 'email', title: 'Proposal Sent', user: 'John Smith', description: 'Initial proposal with pricing' },
  ];

  /** Tab items */
  const tabItems = [
    {
      key: 'overview',
      label: t('customer.detail.tabs.overview'),
      children: (
        <div className="tab-content">
          {/* Basic Information */}
          <Collapse
            defaultActiveKey={['basic', 'contact']}
            ghost
            expandIconPosition="end"
            items={[
              {
                key: 'basic',
                label: <Text strong>{t('customer.detail.sections.basicInfo')}</Text>,
                children: (
                  <div className="info-grid">
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Customer ID</Text>
                      <div><Text>{customer.id}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Customer Name</Text>
                      <div><Text strong>{customer.name}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Industry</Text>
                      <div><Tag>{customer.industry}</Tag></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Company Size</Text>
                      <div><Text>{customer.companySize || '-'}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Level</Text>
                      <div>
                        <UIBadge 
                          color={customer.level === 'A' ? 'danger' : customer.level === 'B' ? 'warning' : customer.level === 'C' ? 'info' : 'neutral'} 
                          variant="soft" 
                          size="sm"
                        >
                          {customer.level}
                        </UIBadge>
                      </div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Status</Text>
                      <div>
                        <UIBadge color={getStatusBadgeColor(customer.status)} variant="soft" size="sm">
                          {customer.status}
                        </UIBadge>
                      </div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Source</Text>
                      <div><Tag color="blue">{customer.source}</Tag></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Owner</Text>
                      <div><Text>{customer.ownerName || '-'}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Region</Text>
                      <div><Text>{customer.region || '-'}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Annual Revenue</Text>
                      <div><Text>{customer.annualRevenue || '-'}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Created At</Text>
                      <div><Text>{customer.createdAt}</Text></div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Created By</Text>
                      <div><Text>{customer.createdBy}</Text></div>
                    </div>
                    {customer.remark && (
                      <div className="info-item-full">
                        <Text type="secondary" className="info-label">Remarks</Text>
                        <div><Text>{customer.remark}</Text></div>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'contact',
                label: <Text strong>{t('customer.detail.sections.contactInfo')}</Text>,
                children: (
                  <div className="info-grid">
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Phone</Text>
                      <div>
                        {customer.phone ? (
                          <a href={`tel:${customer.phone}`} className="contact-link">
                            <PhoneOutlined className="contact-icon" />
                            {customer.phone}
                          </a>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">Website</Text>
                      <div>
                        {customer.website ? (
                          <a href={customer.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                            <GlobalOutlined className="contact-icon" />
                            {customer.website}
                          </a>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div className="info-item-full">
                      <Text type="secondary" className="info-label">Address</Text>
                      <div>
                        {customer.address ? (
                          <span>
                            <EnvironmentOutlined className="contact-icon" />
                            {customer.address}
                          </span>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />

          {/* Contacts Table */}
          <Divider />
          <div className="section-header">
            <Text strong>{t('customer.detail.related.contacts')} ({contacts.length})</Text>
            <Button type="text" size="sm" icon={<PlusOutlined />}>
              Add Contact
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={[
              { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
              { title: 'Position', dataIndex: 'position', key: 'position', width: 120 },
              { title: 'Role', dataIndex: 'decisionRole', key: 'decisionRole', width: 100, render: (role) => <Tag color={role === '决策人' ? 'red' : 'default'}>{role}</Tag> },
              { title: 'Phone', dataIndex: 'mobile', key: 'mobile', width: 120 },
              { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
            ]}
            dataSource={contacts}
            pagination={false}
            size="small"
          />
        </div>
      ),
    },
    {
      key: 'activity',
      label: t('customer.detail.tabs.activity'),
      children: (
        <div className="tab-content">
          {activityTimeline.map((item, index) => {
            const typeIcons: Record<string, React.ReactNode> = {
              email: <MailOutlined className="timeline-icon-email" />,
              call: <PhoneOutlined className="timeline-icon-call" />,
              meeting: <CalendarOutlined className="timeline-icon-meeting" />,
              note: <FileTextOutlined className="timeline-icon-note" />,
            };
            return (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">
                  {typeIcons[item.type]}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <Text strong>{item.title}</Text>
                    <Text type="secondary" className="timeline-date">{item.date}</Text>
                  </div>
                  <Text type="secondary" className="timeline-desc">{item.description}</Text>
                  <div className="timeline-meta">
                    <Text type="secondary">by {item.user}</Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: 'ai',
      label: (
        <span>
          {t('customer.detail.tabs.aiInsights')}
          <Badge dot className="ai-badge-dot" />
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="ai-section">
            <CustomerSummaryAI customerId={id} customerName={customer.name} />
            <RelationshipChangeAI customerId={id} />
            <SmartSuggestionsAI customerId={id} />
            <RiskAlertAI customerId={id} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="customer-detail-page">
      {/* Header */}
      <div className="detail-header">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          {t('customer.detail.backToList')}
        </Button>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="detail-main">
        {/* Left Sidebar - Actions (240px) */}
        <div className="detail-sidebar-left">
          {/* Customer Avatar & Name */}
          <div className="sidebar-header">
            <div className="customer-avatar-container">
              <Avatar
                size={48}
                className="customer-avatar"
                style={{ background: levelColorMap[customer.level]?.color }}
              >
                {customer.name.charAt(0)}
              </Avatar>
              <div className="customer-info">
                <Text strong className="customer-name">{customer.name}</Text>
                <div className="customer-tags">
                  <UIBadge 
                    color={customer.level === 'A' ? 'danger' : customer.level === 'B' ? 'warning' : customer.level === 'C' ? 'info' : 'neutral'} 
                    variant="soft" 
                    size="sm"
                  >
                    {customer.level}
                  </UIBadge>
                  <UIBadge color={getStatusBadgeColor(customer.status)} variant="soft" size="sm">
                    {customer.status}
                  </UIBadge>
                </div>
              </div>
            </div>
            <Text type="secondary" className="customer-subtitle">
              {customer.industry} · {customer.companySize || 'Unknown Size'}
            </Text>
          </div>

          {/* Action Buttons */}
          <div className="sidebar-actions">
            {actionButtons.map((btn, index) => {
              if ('divider' in btn && btn.divider) {
                return <Divider key={`divider-${index}`} className="action-divider" />;
              }
              return (
                <Button
                  key={btn.key}
                  type="text"
                  icon={btn.icon}
                  className={`action-btn ${btn.danger ? 'action-btn-danger' : ''}`}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Middle Content - Tabs (flex: 1) */}
        <div className="detail-content">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="customer-detail-tabs"
          />
        </div>

        {/* Right Sidebar - Related Info (320px) */}
        <div className="detail-sidebar-right">
          {/* Company Info Card */}
          <Card
            size="small"
            title={
              <span className="sidebar-card-title">
                <TeamOutlined className="sidebar-card-icon-primary" />
                <span>{t('customer.detail.related.company')}</span>
              </span>
            }
            styles={{ body: { padding: 12 } }}
            className="sidebar-card"
          >
            <div className="card-info-item">
              <Text type="secondary" className="card-info-label">Company</Text>
              <div><Text strong>{customer.name}</Text></div>
            </div>
            <div className="card-info-item">
              <Text type="secondary" className="card-info-label">Industry</Text>
              <div><Tag>{customer.industry}</Tag></div>
            </div>
            <div className="card-info-item">
              <Text type="secondary" className="card-info-label">Size</Text>
              <div><Text>{customer.companySize || '-'}</Text></div>
            </div>
          </Card>

          {/* Deals Card */}
          <Card
            size="small"
            title={
              <span className="sidebar-card-title">
                <BulbOutlined className="sidebar-card-icon-warning" />
                <span>{t('customer.detail.related.deals')} ({relatedDeals.length})</span>
              </span>
            }
            styles={{ body: { padding: 0 } }}
            className="sidebar-card"
          >
            {relatedDeals.map((deal, index) => (
              <div key={deal.id} className="deal-item">
                <div className="deal-header">
                  <Text strong className="deal-name">{deal.name}</Text>
                  <Text strong className="deal-amount">
                    {formatCurrency(deal.amount, 'USD', 'en')}
                  </Text>
                </div>
                <div className="deal-meta">
                  <Tag className="deal-stage">{deal.stage}</Tag>
                  <Text type="secondary">{deal.probability}%</Text>
                </div>
              </div>
            ))}
          </Card>

          {/* Tickets Card */}
          <Card
            size="small"
            title={
              <span className="sidebar-card-title">
                <CheckCircleOutlined className="sidebar-card-icon-info" />
                <span>{t('customer.detail.related.tickets')} ({relatedTickets.length})</span>
              </span>
            }
            styles={{ body: { padding: 0 } }}
            className="sidebar-card"
          >
            {relatedTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-header">
                  <Text>{ticket.title}</Text>
                </div>
                <div className="ticket-meta">
                  <Tag color={ticket.status === 'Open' ? 'processing' : 'default'} className="ticket-status">
                    {ticket.status}
                  </Tag>
                  <Tag color={ticket.priority === 'High' ? 'red' : 'orange'} className="ticket-priority">
                    {ticket.priority}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>

          {/* Contacts Card */}
          <Card
            size="small"
            title={
              <span className="sidebar-card-title">
                <UserOutlined className="sidebar-card-icon-success" />
                <span>{t('customer.detail.related.contacts')} ({contacts.length})</span>
              </span>
            }
            styles={{ body: { padding: 0 } }}
            className="sidebar-card"
          >
            {contacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="contact-item">
                <div className="contact-header">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text strong className="contact-name">{contact.name}</Text>
                  {contact.decisionRole === '决策者' && (
                    <Tag color="red" className="contact-role">Decision Maker</Tag>
                  )}
                </div>
                <Text type="secondary" className="contact-position">{contact.position}</Text>
              </div>
            ))}
            {contacts.length > 3 && (
              <div className="contact-more">
                <Button type="text" size="sm">
                  View All {contacts.length} Contacts
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Customer Modal */}
      <Modal
        title={t('common.edit') + ' ' + t('customer.title')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        width={600}
        destroyOnHidden
        forceRender
        className="customer-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item name="industry" label="Industry" rules={[{ required: true }]}>
            <Select placeholder="Select industry" options={[
              { value: 'Technology/Software/IT Services', label: 'Technology/Software/IT Services' },
              { value: 'Manufacturing', label: 'Manufacturing' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Other', label: 'Other' },
            ]} />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select placeholder="Select company size" options={[
              { value: 'Micro', label: 'Micro (1-20)' },
              { value: 'Small', label: 'Small (21-100)' },
              { value: 'Medium', label: 'Medium (101-500)' },
              { value: 'Large', label: 'Large (501-2000)' },
              { value: 'Enterprise', label: 'Enterprise (2000+)' },
            ]} />
          </Form.Item>
          <Form.Item name="level" label="Customer Level">
            <Radio.Group>
              <Radio value="A">A - Key</Radio>
              <Radio value="B">B - Standard</Radio>
              <Radio value="C">C - General</Radio>
              <Radio value="D">D - Potential</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="status" label="Customer Status">
            <Select placeholder="Select status" options={[
              { value: '意向', label: t('customer.list.statusOptions.interested') },
              { value: '谈判', label: t('customer.list.statusOptions.negotiating') },
              { value: '成交', label: t('customer.list.statusOptions.closed') },
              { value: '流失', label: t('customer.list.statusOptions.churned') },
            ]} />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <AntInput.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>

      {/* CSS for tabs */}
      <style>{`
        .customer-detail-tabs .ant-tabs-content {
          height: 100%;
          overflow: auto;
          padding: 0 16px;
        }
        .customer-detail-tabs .ant-tabs-tabpane {
          height: 100%;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CustomerDetail;