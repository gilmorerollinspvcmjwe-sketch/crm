/**
 * Opportunity Detail Page - Three Column Layout with Stage Progress
 * 
 * Layout:
 * - Left Sidebar (240px): Opportunity info + Stage progress + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Activity/Products/AI Insights
 * - Right Sidebar (320px): Related customer/contacts/quotes/contracts
 */
import React, { useState, useEffect, useMemo } from 'react';
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
  Steps,
  Progress,
  Descriptions,
  Result,
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
  TrophyOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  SwapOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { opportunityData } from '../mock/opportunityData';
import { activityData } from '../mock/activityData';
import { Opportunity, OpportunityStage, Competitor } from '../types/opportunity';
import { ActivityType } from '../types/activity';
import { colors } from '../styles/tokens';
import {
  CustomerSummaryAI,
  InteractionAnalysisAI,
  RelationshipChangeAI,
  SmartSuggestionsAI,
} from '../components/AI';

const { Text, Title, Paragraph } = Typography;

/** Stage colors */
const STAGE_COLORS: Record<OpportunityStage, { bg: string; color: string }> = {
  [OpportunityStage.LEAD_CONFIRMATION]: { bg: '#E3F2FD', color: '#1565C0' },
  [OpportunityStage.INITIAL_CONTACT]: { bg: '#E1F5FE', color: '#0277BD' },
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: { bg: '#E0F7FA', color: '#00838F' },
  [OpportunityStage.PROPOSAL_QUOTATION]: { bg: '#E8F5E9', color: '#2E7D32' },
  [OpportunityStage.NEGOTIATION_APPROVAL]: { bg: '#FFF3E0', color: '#EF6C00' },
  [OpportunityStage.CLOSED_WON]: { bg: '#C8E6C9', color: '#1B5E20' },
  [OpportunityStage.CLOSED_LOST]: { bg: '#FFEBEE', color: '#C62828' },
};

/** Stage order */
const STAGE_ORDER: OpportunityStage[] = [
  OpportunityStage.LEAD_CONFIRMATION,
  OpportunityStage.INITIAL_CONTACT,
  OpportunityStage.REQUIREMENT_CONFIRMATION,
  OpportunityStage.PROPOSAL_QUOTATION,
  OpportunityStage.NEGOTIATION_APPROVAL,
  OpportunityStage.CLOSED_WON,
];

/** Stage labels */
const STAGE_LABELS: Record<OpportunityStage, string> = {
  [OpportunityStage.LEAD_CONFIRMATION]: 'Lead Confirmation',
  [OpportunityStage.INITIAL_CONTACT]: 'Initial Contact',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: 'Requirement',
  [OpportunityStage.PROPOSAL_QUOTATION]: 'Proposal',
  [OpportunityStage.NEGOTIATION_APPROVAL]: 'Negotiation',
  [OpportunityStage.CLOSED_WON]: 'Won',
  [OpportunityStage.CLOSED_LOST]: 'Lost',
};

/** Stage probabilities */
const STAGE_PROBABILITY: Record<OpportunityStage, number> = {
  [OpportunityStage.LEAD_CONFIRMATION]: 10,
  [OpportunityStage.INITIAL_CONTACT]: 20,
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: 40,
  [OpportunityStage.PROPOSAL_QUOTATION]: 60,
  [OpportunityStage.NEGOTIATION_APPROVAL]: 80,
  [OpportunityStage.CLOSED_WON]: 100,
  [OpportunityStage.CLOSED_LOST]: 0,
};

/**
 * Opportunity Detail Page Component
 */
export const OpportunityDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stageChangeModal, setStageChangeModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<OpportunityStage | null>(null);
  const [form] = Form.useForm();

  /** Find opportunity */
  const opportunityRecord = useMemo(() => {
    return opportunityData.find(opp => opp.id === id);
  }, [id]);

  /** Find related activities */
  const relatedActivities = useMemo(() => {
    if (!opportunityRecord) return [];
    return activityData.filter(activity => activity.opportunityId === id);
  }, [id, opportunityRecord]);

  /** Load opportunity detail */
  useEffect(() => {
    if (opportunityRecord) {
      setOpportunity(opportunityRecord);
    }
  }, [opportunityRecord]);

  /** Back to list */
  const handleBack = () => {
    navigate('/opportunity/list');
  };

  /** Edit opportunity */
  const handleEdit = () => {
    if (opportunity) {
      form.setFieldsValue(opportunity);
      setEditModalVisible(true);
    }
  };

  /** Delete opportunity */
  const handleDelete = () => {
    Modal.confirm({
      title: t('common.confirm') + ' ' + t('common.delete'),
      content: `Are you sure you want to delete "${opportunity?.name}"? This action cannot be undone.`,
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('common.deleteSuccess'));
        navigate('/opportunity/list');
      },
    });
  };

  /** Change stage */
  const handleChangeStage = (stage: OpportunityStage) => {
    setSelectedStage(stage);
    setStageChangeModal(true);
  };

  /** Confirm stage change */
  const handleConfirmStageChange = () => {
    message.success(t('opportunity.detail.stageChanged'));
    setStageChangeModal(false);
  };

  /** Create quote */
  const handleCreateQuote = () => {
    navigate('/quote/create', { state: { opportunityId: id } });
  };

  /** Mark as won */
  const handleMarkWon = () => {
    Modal.confirm({
      title: t('opportunity.detail.markWon'),
      content: t('opportunity.detail.markWonContent'),
      onOk: () => {
        message.success(t('common.success'));
      },
    });
  };

  /** Mark as lost */
  const handleMarkLost = () => {
    Modal.confirm({
      title: t('opportunity.detail.markLost'),
      content: t('opportunity.detail.markLostContent'),
      onOk: () => {
        message.success(t('common.success'));
      },
    });
  };

  if (!opportunity) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Result
          status="404"
          title={t('opportunity.detail.notFound')}
          extra={<Button type="primary" onClick={handleBack}>{t('common.back')}</Button>}
        />
      </div>
    );
  }

  /** Current stage index */
  const currentStageIndex = STAGE_ORDER.indexOf(opportunity.stage);

  /** Action buttons */
  const actionButtons = [
    { key: 'edit', icon: <EditOutlined />, label: t('common.edit'), onClick: handleEdit },
    { key: 'delete', icon: <DeleteOutlined />, label: t('common.delete'), onClick: handleDelete, danger: true },
    { divider: true },
    { key: 'changeStage', icon: <SwapOutlined />, label: t('opportunity.detail.changeStage'), onClick: () => setStageChangeModal(true) },
    { key: 'createQuote', icon: <FileTextOutlined />, label: t('opportunity.detail.createQuote'), onClick: handleCreateQuote },
    { divider: true },
    { key: 'markWon', icon: <TrophyOutlined />, label: t('opportunity.detail.markWon'), onClick: handleMarkWon },
    { key: 'markLost', icon: <CloseCircleOutlined />, label: t('opportunity.detail.markLost'), onClick: handleMarkLost, danger: true },
  ];

  /** Related contacts mock data */
  const relatedContacts = [
    { id: '1', name: '张伟', position: '技术总监', role: '决策者' },
    { id: '2', name: '李娜', position: '采购经理', role: '影响者' },
  ];

  /** Related quotes mock data */
  const relatedQuotes = [
    { id: '1', number: 'QT-2026-00001', amount: 850000, status: 'Sent' },
    { id: '2', number: 'QT-2026-00002', amount: 780000, status: 'Draft' },
  ];

  /** Related contracts mock data */
  const relatedContracts = [
    { id: '1', number: 'CONT-2026-00001', amount: 800000, status: 'Active' },
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
            defaultActiveKey={['basic', 'detail']}
            ghost
            expandIconPosition="end"
            items={[
              {
                key: 'basic',
                label: <Text strong>{t('opportunity.detail.basicInfo')}</Text>,
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Opportunity ID</Text>
                      <div><Text>{opportunity.id}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Opportunity Name</Text>
                      <div><Text strong>{opportunity.name}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Amount</Text>
                      <div>
                        <Text strong style={{ color: colors.primary, fontSize: 16 }}>
                          ¥{(opportunity.amount / 10000).toFixed(1)}万
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Current Stage</Text>
                      <div>
                        <Tag style={{
                          background: STAGE_COLORS[opportunity.stage]?.bg,
                          color: STAGE_COLORS[opportunity.stage]?.color,
                          border: 'none',
                        }}>
                          {STAGE_LABELS[opportunity.stage]}
                        </Tag>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Win Probability</Text>
                      <div><Text strong>{opportunity.probability}%</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Expected Close Date</Text>
                      <div><Text>{new Date(opportunity.estimatedCloseDate).toLocaleDateString('zh-CN')}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Customer</Text>
                      <div>
                        <a onClick={() => navigate(`/customer/${opportunity.customerId}`)}>
                          {opportunity.customerName}
                        </a>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Owner</Text>
                      <div><Text>{opportunity.ownerName}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Source</Text>
                      <div><Tag>{opportunity.source}</Tag></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Created At</Text>
                      <div><Text>{new Date(opportunity.createdAt).toLocaleDateString('zh-CN')}</Text></div>
                    </div>
                    {opportunity.description && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Customer Needs</Text>
                        <div><Text>{opportunity.description}</Text></div>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'detail',
                label: <Text strong>{t('opportunity.detail.detailInfo')}</Text>,
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Budget</Text>
                      <div><Text>{opportunity.budget || '-'}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Next Follow-up</Text>
                      <div><Text>{opportunity.nextFollowupTime ? new Date(opportunity.nextFollowupTime).toLocaleDateString('zh-CN') : '-'}</Text></div>
                    </div>
                    {opportunity.decisionProcess && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Decision Process</Text>
                        <div><Text>{opportunity.decisionProcess}</Text></div>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />

          {/* Competitors */}
          {opportunity.competitors && opportunity.competitors.length > 0 && (
            <>
              <Divider />
              <Text strong style={{ display: 'block', marginBottom: 12 }}>{t('opportunity.detail.competitors')}</Text>
              <Table
                rowKey="id"
                size="small"
                columns={[
                  { title: t('opportunity.detail.competitorName'), dataIndex: 'name', key: 'name', width: 120 },
                  { title: t('opportunity.detail.productOrSolution'), dataIndex: 'product', key: 'product', width: 120 },
                  { title: t('opportunity.detail.competitiveAdvantage'), dataIndex: 'advantage', key: 'advantage', render: (text) => <Text type="success">{text}</Text> },
                  { title: t('opportunity.detail.competitiveDisadvantage'), dataIndex: 'disadvantage', key: 'disadvantage', render: (text) => <Text type="danger">{text}</Text> },
                ]}
                dataSource={opportunity.competitors}
                pagination={false}
              />
            </>
          )}
        </div>
      ),
    },
    {
      key: 'activity',
      label: t('customer.detail.tabs.activity'),
      children: (
        <div style={{ padding: '16px 0' }}>
          {relatedActivities.length > 0 ? (
            relatedActivities.map((item, index) => {
              const typeIcons: Record<string, React.ReactNode> = {
                email: <MailOutlined style={{ color: colors.primary }} />,
                call: <PhoneOutlined style={{ color: colors.success }} />,
                meeting: <CalendarOutlined style={{ color: colors.warning }} />,
                note: <FileTextOutlined style={{ color: colors.info }} />,
              };
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: index < relatedActivities.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.background.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {typeIcons[item.type] || <FileTextOutlined style={{ color: colors.info }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong>{item.type}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{new Date(item.activityTime).toLocaleDateString('zh-CN')}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {item.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>by {item.createdByName}</Text>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Text type="secondary">{t('opportunity.detail.noFollowUpRecords')}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'products',
      label: t('opportunity.detail.products'),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Table
            rowKey="id"
            size="small"
            columns={[
              { title: 'Product Name', dataIndex: 'name', key: 'name', width: 200 },
              { title: 'Unit Price', dataIndex: 'price', key: 'price', width: 120, render: (p) => `¥${p?.toLocaleString() || 0}` },
              { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 80 },
              { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (s) => <Text strong>¥{s?.toLocaleString() || 0}</Text> },
            ]}
            dataSource={[
              { id: '1', name: 'ERP Enterprise Edition', price: 500000, quantity: 1, subtotal: 500000 },
              { id: '2', name: 'Implementation Service', price: 200000, quantity: 1, subtotal: 200000 },
              { id: '3', name: 'Annual Maintenance', price: 100000, quantity: 1, subtotal: 100000 },
            ]}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} align="right">
                  <Text strong>Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ color: colors.primary }}>¥800,000</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
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
            <Card size="small" title={<><BulbOutlined style={{ marginRight: 4 }} />{t('opportunity.detail.predictionAnalysis')}</>}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('opportunity.detail.winProbability')}</Text>
                <Progress
                  percent={opportunity.probability}
                  strokeColor={
                    opportunity.probability >= 80 ? '#52c41a' :
                    opportunity.probability >= 50 ? '#faad14' : '#ff4d4f'
                  }
                  format={(percent) => `${percent}%`}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('opportunity.detail.recommendedAction')}</Text>
                <div style={{ marginTop: 4 }}>
                  <Text type="success" style={{ fontSize: 13 }}>
                    {opportunity.probability >= 80 ? t('opportunity.detail.recommendHigh') :
                     opportunity.probability >= 50 ? t('opportunity.detail.recommendMedium') :
                     t('opportunity.detail.recommendLow')}
                  </Text>
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('opportunity.detail.trendAnalysis')}</Text>
                <div style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 13 }}>
                    {t('opportunity.detail.weeklyFollowUps')} <Text strong>2</Text> {t('opportunity.detail.times')}，
                    {t('opportunity.detail.customerIntention')} <Text type="success">{t('opportunity.detail.rising')}</Text>
                  </Text>
                </div>
              </div>
            </Card>
            <CustomerSummaryAI customerId={id} customerName={opportunity.name} />
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
          {t('opportunity.detail.back')}
        </Button>
      </div>

      {/* Main Content - Three Column Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Stage Progress & Actions (240px) */}
        <div
          style={{
            width: 240,
            borderRight: `1px solid ${colors.border.default}`,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Opportunity Info */}
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.border.light}` }}>
            <Text strong style={{ display: 'block', fontSize: 15, marginBottom: 8 }}>
              {opportunity.name}
            </Text>
            <Text strong style={{ fontSize: 18, color: colors.primary, display: 'block', marginBottom: 8 }}>
              ¥{(opportunity.amount / 10000).toFixed(1)}万
            </Text>
            <Tag
              style={{
                background: STAGE_COLORS[opportunity.stage]?.bg,
                color: STAGE_COLORS[opportunity.stage]?.color,
                border: 'none',
              }}
            >
              {STAGE_LABELS[opportunity.stage]}
            </Tag>
          </div>

          {/* Stage Progress Indicator */}
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.border.light}` }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
              {t('opportunity.detail.stageProgress')}
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={currentStageIndex}
              items={STAGE_ORDER.slice(0, -1).map((stage, index) => ({
                title: STAGE_LABELS[stage],
                description: `${STAGE_PROBABILITY[stage]}%`,
                status: index < currentStageIndex ? 'finish' : index === currentStageIndex ? 'process' : 'wait',
              }))}
            />
            {/* Quick stage change */}
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
                {t('opportunity.detail.quickChange')}
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {STAGE_ORDER.slice(0, -1).map((stage, index) => (
                  <Button
                    key={stage}
                    size="small"
                    type={stage === opportunity.stage ? 'primary' : 'default'}
                    onClick={() => handleChangeStage(stage)}
                    style={{ fontSize: 11 }}
                  >
                    {STAGE_LABELS[stage]}
                  </Button>
                ))}
              </div>
            </div>
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
            className="opportunity-detail-tabs"
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
                <span>{t('opportunity.detail.relatedCustomer')}</span>
              </Space>
            }
            styles={{ body: { padding: 12 } }}
            style={{ marginBottom: 12 }}
          >
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Customer</Text>
              <div>
                <a onClick={() => navigate(`/customer/${opportunity.customerId}`)}>
                  <Text strong>{opportunity.customerName}</Text>
                </a>
              </div>
            </div>
          </Card>

          {/* Contacts Card */}
          <Card
            size="small"
            title={
              <Space>
                <UserOutlined style={{ color: colors.warning }} />
                <span>{t('opportunity.detail.contacts')} ({relatedContacts.length})</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
            style={{ marginBottom: 12 }}
          >
            {relatedContacts.map((contact, index) => (
              <div
                key={contact.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < relatedContacts.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text strong style={{ fontSize: 13 }}>{contact.name}</Text>
                  <Tag color={decisionRoleColorMap[contact.role] || 'default'} style={{ margin: 0, fontSize: 11 }}>
                    {contact.role}
                  </Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{contact.position}</Text>
              </div>
            ))}
          </Card>

          {/* Quotes Card */}
          <Card
            size="small"
            title={
              <Space>
                <FileTextOutlined style={{ color: colors.info }} />
                <span>{t('opportunity.detail.quotes')} ({relatedQuotes.length})</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
            style={{ marginBottom: 12 }}
          >
            {relatedQuotes.map((quote, index) => (
              <div
                key={quote.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < relatedQuotes.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 13 }}>{quote.number}</Text>
                  <Text strong style={{ color: colors.primary, fontSize: 13 }}>
                    ¥{quote.amount.toLocaleString()}
                  </Text>
                </div>
                <Tag style={{ margin: 0, fontSize: 11 }}>{quote.status}</Tag>
              </div>
            ))}
          </Card>

          {/* Contracts Card */}
          <Card
            size="small"
            title={
              <Space>
                <CheckCircleOutlined style={{ color: colors.success }} />
                <span>{t('opportunity.detail.contracts')} ({relatedContracts.length})</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
          >
            {relatedContracts.map((contract, index) => (
              <div
                key={contract.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < relatedContracts.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 13 }}>{contract.number}</Text>
                  <Text strong style={{ color: colors.primary, fontSize: 13 }}>
                    ¥{contract.amount.toLocaleString()}
                  </Text>
                </div>
                <Tag color="green" style={{ margin: 0, fontSize: 11 }}>{contract.status}</Tag>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Stage Change Modal */}
      <Modal
        title={t('opportunity.detail.changeStage')}
        open={stageChangeModal}
        onCancel={() => setStageChangeModal(false)}
        onOk={handleConfirmStageChange}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <Form layout="vertical">
          <Form.Item label={t('opportunity.detail.selectStage')}>
            <Select
              value={selectedStage || opportunity.stage}
              onChange={(value) => setSelectedStage(value)}
              options={STAGE_ORDER.slice(0, -1).map(stage => ({
                label: `${STAGE_LABELS[stage]} (${STAGE_PROBABILITY[stage]}%)`,
                value: stage,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* CSS */}
      <style>{`
        .opportunity-detail-tabs .ant-tabs-content {
          height: 100%;
          overflow: auto;
          padding: 0 16px;
        }
        .opportunity-detail-tabs .ant-tabs-tabpane {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

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

export default OpportunityDetail;