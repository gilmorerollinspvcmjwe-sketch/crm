/**
 * Contact Detail Page - Three Column Layout
 * 
 * Layout:
 * - Left Sidebar (240px): Contact info + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Activity/AI Insights
 * - Right Sidebar (320px): Related company/deals/tickets/recent activities
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
  Collapse,
  Badge,
  Drawer,
  List,
  Descriptions,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CalendarOutlined,
  FileTextOutlined,
  RightOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getContactById } from '../mock/contactData';
import { getCustomerById } from '../mock/customerData';
import { Contact } from '../types/contact';
import { Customer } from '../types/customer';
import { colors } from '../styles/tokens';
import {
  CustomerSummaryAI,
  InteractionAnalysisAI,
  RelationshipChangeAI,
  SmartSuggestionsAI,
} from '../components/AI';

const { Text, Title, Paragraph } = Typography;

/** Decision role color mapping */
const decisionRoleColorMap: Record<string, string> = {
  '决策者': 'red',
  '影响者': 'orange',
  '使用者': 'green',
  '技术评估人': 'purple',
  'Decision Maker': 'red',
  'Influencer': 'orange',
  'User': 'green',
  'Evaluator': 'purple',
};

/**
 * Contact Detail Page Component
 */
export const ContactDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [form] = Form.useForm();

  /** Load contact detail */
  const loadContactDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = getContactById(id);
      if (data) {
        setContact(data);
        if (data.customerId) {
          const customerData = getCustomerById(data.customerId);
          setCustomer(customerData || null);
        }
      } else {
        message.error(t('contact.detail.notFound'));
      }
    } catch (error) {
      message.error(t('contact.detail.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    loadContactDetail();
  }, [id]);

  /** Back to list */
  const handleBack = () => {
    if (location.state?.from === 'customer') {
      navigate(-1);
    } else {
      navigate('/contact/list');
    }
  };

  /** Edit contact */
  const handleEdit = () => {
    if (contact) {
      form.setFieldsValue(contact);
      setEditModalVisible(true);
    }
  };

  /** Delete contact */
  const handleDelete = () => {
    Modal.confirm({
      title: t('common.confirm') + ' ' + t('common.delete'),
      content: `Are you sure you want to delete "${contact?.name}"? This action cannot be undone.`,
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('common.deleteSuccess'));
        navigate('/contact/list');
      },
    });
  };

  /** Send email */
  const handleSendEmail = () => {
    if (contact?.email) {
      window.location.href = `mailto:${contact.email}`;
    } else {
      message.warning(t('contact.noEmail'));
    }
  };

  /** Call phone */
  const handleCall = () => {
    if (contact?.mobile) {
      message.info(`${t('contact.calling')} ${contact.mobile}`);
    } else {
      message.warning(t('contact.noPhone'));
    }
  };

  /** Create deal */
  const handleCreateDeal = () => {
    navigate('/opportunity/create', { state: { contactId: id, customerId: contact?.customerId } });
  };

  /** Create ticket */
  const handleCreateTicket = () => {
    navigate('/ticket/create', { state: { contactId: id, customerId: contact?.customerId } });
  };

  if (!contact) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Text type="secondary">{t('contact.detail.notFound')}</Text>
      </div>
    );
  }

  /** Action buttons configuration */
  const actionButtons = [
    { key: 'edit', icon: <EditOutlined />, label: t('common.edit'), onClick: handleEdit },
    { key: 'delete', icon: <DeleteOutlined />, label: t('common.delete'), onClick: handleDelete, danger: true },
    { divider: true },
    { key: 'email', icon: <MailOutlined />, label: t('contact.sendEmail'), onClick: handleSendEmail },
    { key: 'call', icon: <PhoneOutlined />, label: t('contact.call'), onClick: handleCall },
    { divider: true },
    { key: 'createDeal', icon: <BulbOutlined />, label: t('contact.createDeal'), onClick: handleCreateDeal },
    { key: 'createTicket', icon: <CheckCircleOutlined />, label: t('contact.createTicket'), onClick: handleCreateTicket },
  ];

  /** Related deals mock data */
  const relatedDeals = [
    { id: '1', name: 'Enterprise ERP System', amount: 800000, stage: 'Negotiation', probability: 75 },
    { id: '2', name: 'Smart Office System', amount: 450000, stage: 'Proposal', probability: 50 },
  ];

  /** Related tickets mock data */
  const relatedTickets = [
    { id: '1', title: 'Technical Support Request', status: 'Open', priority: 'High' },
    { id: '2', title: 'Feature Inquiry', status: 'Pending', priority: 'Medium' },
  ];

  /** Activity timeline data */
  const activityTimeline = [
    { date: '2026-03-20', type: 'email', title: 'Email Sent', user: 'John Smith', description: 'Sent product demo invitation' },
    { date: '2026-03-15', type: 'call', title: 'Phone Call', user: 'John Smith', description: 'Discussed project timeline' },
    { date: '2026-03-10', type: 'meeting', title: 'Meeting', user: 'John Smith', description: 'Initial product presentation' },
    { date: '2026-03-01', type: 'note', title: 'Note Added', user: 'John Smith', description: 'Contact is key decision maker' },
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
                label: <Text strong>{t('contact.detail.basicInfo')}</Text>,
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Contact ID</Text>
                      <div><Text>{contact.id}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Name</Text>
                      <div>
                        <Text strong>{contact.name}</Text>
                        {contact.gender && (
                          <Tag color={contact.gender === '男' ? 'blue' : 'pink'} style={{ marginLeft: 8 }}>
                            {contact.gender}
                          </Tag>
                        )}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Position</Text>
                      <div><Text>{contact.position || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Job Level</Text>
                      <div>{contact.jobLevel ? <Tag>{contact.jobLevel}</Tag> : <Text>-</Text>}</div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Decision Role</Text>
                      <div>
                        {contact.decisionRole ? (
                          <Tag color={decisionRoleColorMap[contact.decisionRole] || 'default'}>
                            {contact.decisionRole}
                          </Tag>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Owner</Text>
                      <div><Text>{contact.ownerName || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Created At</Text>
                      <div><Text>{contact.createdAt}</Text></div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'contact',
                label: <Text strong>{t('customer.detail.sections.contactInfo')}</Text>,
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Mobile</Text>
                      <div>
                        {contact.mobile ? (
                          <a href={`tel:${contact.mobile}`}>
                            <PhoneOutlined style={{ marginRight: 4 }} />
                            {contact.mobile}
                          </a>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Office Phone</Text>
                      <div><Text>{contact.officePhone || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Email</Text>
                      <div>
                        {contact.email ? (
                          <a href={`mailto:${contact.email}`}>
                            <MailOutlined style={{ marginRight: 4 }} />
                            {contact.email}
                          </a>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>WeChat</Text>
                      <div><Text>{contact.wechat || '-'}</Text></div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Address</Text>
                      <div>
                        {contact.address ? (
                          <span>
                            <EnvironmentOutlined style={{ marginRight: 4 }} />
                            {contact.address}
                          </span>
                        ) : <Text>-</Text>}
                      </div>
                    </div>
                    {contact.remark && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Remarks</Text>
                        <div><Text>{contact.remark}</Text></div>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
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
            <CustomerSummaryAI customerId={id} customerName={contact.name} />
            <InteractionAnalysisAI customerId={id} />
            <RelationshipChangeAI customerId={id} />
            <SmartSuggestionsAI customerId={id} />
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
          {t('contact.detail.back')}
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
          {/* Contact Avatar & Name */}
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.border.light}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Avatar
                size={48}
                style={{ background: colors.primary }}
              >
                {contact.name.charAt(0)}
              </Avatar>
              <div>
                <Text strong style={{ display: 'block', fontSize: 15 }}>{contact.name}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{contact.position || '-'}</Text>
              </div>
            </div>
            {contact.decisionRole && (
              <Tag color={decisionRoleColorMap[contact.decisionRole] || 'default'} style={{ marginTop: 8 }}>
                {contact.decisionRole}
              </Tag>
            )}
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
            className="contact-detail-tabs"
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
          {/* Company Card */}
          {customer && (
            <Card
              size="small"
              title={
                <Space>
                  <TeamOutlined style={{ color: colors.primary }} />
                  <span>{t('contact.relatedCompany')}</span>
                </Space>
              }
              styles={{ body: { padding: 12 } }}
              style={{ marginBottom: 12 }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Company</Text>
                <div>
                  <a onClick={() => navigate(`/customer/${customer.id}`)}>
                    <Text strong>{customer.name}</Text>
                  </a>
                </div>
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
          )}

          {/* Deals Card */}
          <Card
            size="small"
            title={
              <Space>
                <BulbOutlined style={{ color: colors.warning }} />
                <span>{t('contact.relatedDeals')} ({relatedDeals.length})</span>
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
                    ¥{deal.amount.toLocaleString()}
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
                <span>{t('contact.relatedTickets')} ({relatedTickets.length})</span>
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

          {/* Recent Activities Card */}
          <Card
            size="small"
            title={
              <Space>
                <ClockCircleOutlined style={{ color: colors.success }} />
                <span>{t('contact.recentActivities')}</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
          >
            {activityTimeline.slice(0, 3).map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < 2 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13 }}>{item.title}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.date}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* CSS for tabs */}
      <style>{`
        .contact-detail-tabs .ant-tabs-content {
          height: 100%;
          overflow: auto;
          padding: 0 16px;
        }
        .contact-detail-tabs .ant-tabs-tabpane {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default ContactDetail;