/**
 * Customer Detail Page - HubSpot Style Three-Column Layout
 * 
 * Layout:
 * - Left Sidebar (240px): Customer info + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Activity/AI Insights
 * - Right Sidebar (320px): Related information cards
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
  Radio,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Collapse,
  Badge,
  Drawer,
  List,
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

const { Text, Title, Paragraph } = Typography;

/** Customer level color mapping */
const levelColorMap: Record<string, { bg: string; color: string }> = {
  A: { bg: colors.grade.A.bg, color: colors.grade.A.fg },
  B: { bg: colors.grade.B.bg, color: colors.grade.B.fg },
  C: { bg: colors.grade.C.bg, color: colors.grade.C.fg },
  D: { bg: colors.grade.D.bg, color: colors.grade.D.fg },
};

/** Customer status color mapping */
const statusColorMap: Record<string, string> = {
  '意向': 'processing',
  '谈判': 'warning',
  '成交': 'success',
  '流失': 'error',
  '潜在': 'default',
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
      <div style={{ padding: 24, textAlign: 'center' }}>
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
    { key: 'newDeal', icon: <BulbOutlined />, label: t('customer.detail.actions.newDeal') },
    { key: 'newContact', icon: <TeamOutlined />, label: t('customer.detail.actions.newContact') },
    { key: 'followUp', icon: <ClockCircleOutlined />, label: t('customer.detail.actions.followUp') },
    { divider: true },
    { key: 'returnToPool', icon: <CloudUploadOutlined />, label: t('customer.detail.actions.returnToPool') },
    { key: 'export', icon: <ExportOutlined />, label: t('customer.detail.actions.export') },
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
        <div style={{ padding: '16px 0' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Customer ID</Text>
                      <div><Text>{customer.id}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Customer Name</Text>
                      <div><Text strong>{customer.name}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Industry</Text>
                      <div><Tag>{customer.industry}</Tag></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Company Size</Text>
                      <div><Text>{customer.companySize || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Level</Text>
                      <div>
                        <Tag style={{ background: levelColorMap[customer.level]?.bg, color: levelColorMap[customer.level]?.color, border: 'none' }}>
                          {customer.level}
                        </Tag>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Status</Text>
                      <div><Tag color={statusColorMap[customer.status]}>{customer.status}</Tag></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Source</Text>
                      <div><Tag color="blue">{customer.source}</Tag></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Owner</Text>
                      <div><Text>{customer.ownerName || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Region</Text>
                      <div><Text>{customer.region || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Annual Revenue</Text>
                      <div><Text>{customer.annualRevenue || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Created At</Text>
                      <div><Text>{customer.createdAt}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Created By</Text>
                      <div><Text>{customer.createdBy}</Text></div>
                    </div>
                    {customer.remark && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Remarks</Text>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Phone</Text>
                      <div>
                        {customer.phone ? (
                          <a href={`tel:${customer.phone}`}>
                            <PhoneOutlined style={{ marginRight: 4 }} />
                            {customer.phone}
                          </a>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Website</Text>
                      <div>
                        {customer.website ? (
                          <a href={customer.website} target="_blank" rel="noopener noreferrer">
                            <GlobalOutlined style={{ marginRight: 4 }} />
                            {customer.website}
                          </a>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Address</Text>
                      <div>
                        {customer.address ? (
                          <span>
                            <EnvironmentOutlined style={{ marginRight: 4 }} />
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text strong>{t('customer.detail.related.contacts')} ({contacts.length})</Text>
            <Button type="link" icon={<PlusOutlined />} size="small">
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
        <div style={{ padding: '16px 0' }}>
          {activityTimeline.map((item, index) => {
            const typeIcons: Record<string, React.ReactNode> = {
              email: <MailOutlined style={{ color: colors.primary }} />,
              call: <PhoneOutlined style={{ color: colors.success }} />,
              meeting: <CalendarOutlined style={{ color: colors.warning }} />,
              note: <FileTextOutlined style={{ color: colors.info }} />,
            };
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: index < activityTimeline.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.background.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {typeIcons[item.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text strong>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.description}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>by {item.user}</Text>
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
          <Badge dot style={{ marginLeft: 4 }} />
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <CustomerSummaryAI customerId={id} customerName={customer.name} />
            <RelationshipChangeAI customerId={id} />
            <SmartSuggestionsAI customerId={id} />
            <RiskAlertAI customerId={id} />
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border.default}`, background: '#fff' }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          {t('customer.detail.backToList')}
        </Button>
      </div>

      {/* Main Content - Three Column Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Actions (240px) */}
        <div
          style={{
            width: 240,
            borderRight: `1px solid ${colors.border.default}`,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Customer Avatar & Name */}
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.border.light}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Avatar
                size={48}
                style={{ background: levelColorMap[customer.level]?.color }}
              >
                {customer.name.charAt(0)}
              </Avatar>
              <div>
                <Text strong style={{ display: 'block', fontSize: 15 }}>{customer.name}</Text>
                <Space size={4}>
                  <Tag style={{ background: levelColorMap[customer.level]?.bg, color: levelColorMap[customer.level]?.color, border: 'none', margin: 0 }}>
                    {customer.level}
                  </Tag>
                  <Tag color={statusColorMap[customer.status]} style={{ margin: 0 }}>
                    {customer.status}
                  </Tag>
                </Space>
              </div>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {customer.industry} · {customer.companySize || 'Unknown Size'}
            </Text>
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
            className="customer-detail-tabs"
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
          {/* Company Info Card */}
          <Card
            size="small"
            title={
              <Space>
                <TeamOutlined style={{ color: colors.primary }} />
                <span>{t('customer.detail.related.company')}</span>
              </Space>
            }
            styles={{ body: { padding: 12 } }}
            style={{ marginBottom: 12 }}
          >
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Company</Text>
              <div><Text strong>{customer.name}</Text></div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Industry</Text>
              <div><Tag>{customer.industry}</Tag></div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>Size</Text>
              <div><Text>{customer.companySize || '-'}</Text></div>
            </div>
          </Card>

          {/* Deals Card */}
          <Card
            size="small"
            title={
              <Space>
                <BulbOutlined style={{ color: colors.warning }} />
                <span>{t('customer.detail.related.deals')} ({relatedDeals.length})</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
            style={{ marginBottom: 12 }}
          >
            {relatedDeals.map((deal, index) => (
              <div
                key={deal.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < relatedDeals.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 13 }}>{deal.name}</Text>
                  <Text strong style={{ color: colors.primary, fontSize: 13 }}>
                    {formatCurrency(deal.amount, 'USD', 'en')}
                  </Text>
                </div>
                <Space size={8}>
                  <Tag style={{ margin: 0, fontSize: 11 }}>{deal.stage}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>{deal.probability}%</Text>
                </Space>
              </div>
            ))}
          </Card>

          {/* Tickets Card */}
          <Card
            size="small"
            title={
              <Space>
                <CheckCircleOutlined style={{ color: colors.info }} />
                <span>{t('customer.detail.related.tickets')} ({relatedTickets.length})</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
            style={{ marginBottom: 12 }}
          >
            {relatedTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < relatedTickets.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13 }}>{ticket.title}</Text>
                </div>
                <Space size={8}>
                  <Tag color={ticket.status === 'Open' ? 'processing' : 'default'} style={{ margin: 0, fontSize: 11 }}>
                    {ticket.status}
                  </Tag>
                  <Tag color={ticket.priority === 'High' ? 'red' : 'orange'} style={{ margin: 0, fontSize: 11 }}>
                    {ticket.priority}
                  </Tag>
                </Space>
              </div>
            ))}
          </Card>

          {/* Contacts Card */}
          <Card
            size="small"
            title={
              <Space>
                <UserOutlined style={{ color: colors.success }} />
                <span>{t('customer.detail.related.contacts')} ({contacts.length})</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
          >
            {contacts.slice(0, 3).map((contact, index) => (
              <div
                key={contact.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < Math.min(contacts.length, 3) - 1 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text strong style={{ fontSize: 13 }}>{contact.name}</Text>
                  {contact.decisionRole === '决策者' && (
                    <Tag color="red" style={{ margin: 0, fontSize: 11 }}>Decision Maker</Tag>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{contact.position}</Text>
              </div>
            ))}
            {contacts.length > 3 && (
              <div style={{ padding: '8px 12px', textAlign: 'center' }}>
                <Button type="link" size="small">
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
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item name="industry" label="Industry" rules={[{ required: true }]}>
            <Select placeholder="Select industry" options={[
              { label: 'Technology/Software/IT Services', value: 'Technology/Software/IT Services' },
              { label: 'Manufacturing', value: 'Manufacturing' },
              { label: 'Finance', value: 'Finance' },
              { label: 'Other', value: 'Other' },
            ]} />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select placeholder="Select company size">
              <Select.Option value="Micro">Micro (1-20)</Select.Option>
              <Select.Option value="Small">Small (21-100)</Select.Option>
              <Select.Option value="Medium">Medium (101-500)</Select.Option>
              <Select.Option value="Large">Large (501-2000)</Select.Option>
              <Select.Option value="Enterprise">Enterprise (2000+)</Select.Option>
            </Select>
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
            <Select placeholder="Select status">
              <Select.Option value="意向">Interested</Select.Option>
              <Select.Option value="谈判">Negotiating</Select.Option>
              <Select.Option value="成交">Closed</Select.Option>
              <Select.Option value="流失">Churned</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add CSS for tabs */}
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