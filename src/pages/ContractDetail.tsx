/**
 * Contract Detail Page - HubSpot Style Three-Column Layout
 * 
 * Layout:
 * - Left Sidebar (240px): Contract info + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Payment Plans/Attachments
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
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Collapse,
  Progress,
  Empty,
  List,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  RightOutlined,
  FilePdfOutlined,
  FileOutlined,
  UploadOutlined,
  BankOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { getContractById, contractStatusColors, contractStatusLabels } from '../mock/contractData';
import { Contract, ContractStatus, PaymentPlan } from '../types/contract';
import { colors } from '../styles/tokens';
import { formatDate, formatCurrency } from '../utils/format';
import './ContractDetail.css';

const { Text, Title, Paragraph } = Typography;

/** Contract status badge color */
const getStatusBadgeColor = (status: ContractStatus): 'brand' | 'success' | 'warning' | 'danger' | 'neutral' => {
  const colorMap: Record<ContractStatus, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    [ContractStatus.DRAFT]: 'neutral',
    [ContractStatus.PENDING_APPROVAL]: 'warning',
    [ContractStatus.ACTIVE]: 'success',
    [ContractStatus.ARCHIVED]: 'neutral',
    [ContractStatus.TERMINATED]: 'danger',
  };
  return colorMap[status] || 'neutral';
};

/** Payment plan status badge color */
const getPaymentStatusBadgeColor = (status: string): 'brand' | 'success' | 'warning' | 'danger' | 'neutral' => {
  const colorMap: Record<string, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    'PENDING': 'neutral',
    'PARTIAL': 'warning',
    'COMPLETED': 'success',
    'OVERDUE': 'danger',
  };
  return colorMap[status] || 'neutral';
};

/**
 * Contract Detail Page Component
 */
export const ContractDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  /** Load contract detail */
  const loadContractDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = getContractById(id);
      if (data) {
        setContract(data);
      } else {
        message.error('Contract not found');
      }
    } catch (error) {
      message.error('Failed to load contract details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    loadContractDetail();
  }, [id]);

  /** Back to list */
  const handleBack = () => {
    navigate('/contract/list');
  };

  /** Edit contract */
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  /** Calculate payment progress */
  const getPaymentProgress = () => {
    if (!contract || !contract.paymentPlans) return 0;
    const totalPlanned = contract.paymentPlans.reduce((sum, p) => sum + p.plannedAmount, 0);
    const totalPaid = contract.paymentPlans.reduce((sum, p) => sum + (p.actualAmount || 0), 0);
    return totalPlanned > 0 ? Math.round((totalPaid / totalPlanned) * 100) : 0;
  };

  /** Payment plan columns */
  const paymentColumns = [
    {
      title: t('contract.installmentNumber'),
      dataIndex: 'installmentNumber',
      key: 'installmentNumber',
      width: 80,
      render: (num: number) => `第 ${num} 期`,
    },
    {
      title: t('contract.plannedAmount'),
      dataIndex: 'plannedAmount',
      key: 'plannedAmount',
      width: 120,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: t('contract.plannedDate'),
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: t('contract.paymentCondition'),
      dataIndex: 'paymentCondition',
      key: 'paymentCondition',
      ellipsis: true,
    },
    {
      title: t('contract.actualAmount'),
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      render: (amount?: number) => amount ? formatCurrency(amount) : '-',
    },
    {
      title: t('contract.actualDate'),
      dataIndex: 'actualDate',
      key: 'actualDate',
      width: 120,
      render: (date?: string) => date ? formatDate(date) : '-',
    },
    {
      title: t('contract.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge color={getPaymentStatusBadgeColor(status)}>
          {status === 'PENDING' ? '待付款' : 
           status === 'PARTIAL' ? '部分付款' :
           status === 'COMPLETED' ? '已完成' : '已逾期'}
        </Badge>
      ),
    },
  ];

  if (!contract) {
    return (
      <div className="contract-detail-page">
        <div className="contract-detail-empty">
          <Empty description={t('contract.notFound')} />
        </div>
      </div>
    );
  }

  return (
    <div className="contract-detail-page">
      {/* Header */}
      <div className="detail-header">
        <div className="back-button" onClick={handleBack}>
          <ArrowLeftOutlined />
          <span>{t('contract.backToList')}</span>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="detail-main">
        {/* Left Sidebar - Contract Info */}
        <div className="detail-sidebar-left">
          <div className="sidebar-header">
            <div className="contract-avatar-container">
              <Avatar size={48} icon={<FileTextOutlined />} className="contract-avatar" />
              <div className="contract-info">
                <span className="contract-name">{contract.name}</span>
                <div className="contract-tags">
                  <Badge color={getStatusBadgeColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
              </div>
            </div>
            <Text className="contract-subtitle" type="secondary">
              {contract.contractNumber}
            </Text>
          </div>

          {/* Action Buttons */}
          <div className="sidebar-actions">
            <Divider className="action-divider" />
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="action-btn"
            >
              {t('common.edit')}
            </Button>
            <Button
              type="secondary"
              icon={<DownloadOutlined />}
              className="action-btn"
            >
              {t('contract.download')}
            </Button>
            <Divider className="action-divider" />
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className="action-btn"
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>

        {/* Middle Content */}
        <div className="detail-content">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="contract-detail-tabs"
            items={[
              {
                key: 'overview',
                label: t('contract.overview'),
                children: (
                  <div className="tab-content">
                    {/* Basic Info */}
                    <Card title={t('contract.basicInfo')} className="info-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <Text className="info-label">{t('contract.customer')}</Text>
                          <Text className="info-value link" onClick={() => navigate(`/customer/detail/${contract.customerId}`)}>
                            {contract.customerName}
                          </Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.opportunity')}</Text>
                          <Text className="info-value">
                            {contract.opportunityName || '-'}
                          </Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.type')}</Text>
                          <Text className="info-value">{contract.type}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.amount')}</Text>
                          <Text className="info-value" strong>{formatCurrency(contract.amount)}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.signingDate')}</Text>
                          <Text className="info-value">{formatDate(contract.signingDate)}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.effectiveDate')}</Text>
                          <Text className="info-value">{formatDate(contract.effectiveDate)}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.expirationDate')}</Text>
                          <Text className="info-value">
                            {contract.expirationDate ? formatDate(contract.expirationDate) : '-'}
                          </Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.contractPeriod')}</Text>
                          <Text className="info-value">
                            {contract.contractPeriod ? `${contract.contractPeriod} 个月` : '-'}
                          </Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.owner')}</Text>
                          <Text className="info-value">{contract.ownerName}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.signerOurSide')}</Text>
                          <Text className="info-value">{contract.signerOurSide}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.signerCustomerSide')}</Text>
                          <Text className="info-value">{contract.signerCustomerSide || '-'}</Text>
                        </div>
                      </div>
                    </Card>

                    {/* Contract Terms */}
                    <Card title={t('contract.terms')} className="info-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <Text className="info-label">{t('contract.paymentMethod')}</Text>
                          <Text className="info-value">{contract.terms.paymentMethod}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.paymentTerms')}</Text>
                          <Text className="info-value">{contract.terms.paymentTerms}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.deliveryTerms')}</Text>
                          <Text className="info-value">{contract.terms.deliveryTerms}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.warrantyPeriod')}</Text>
                          <Text className="info-value">{contract.terms.warrantyPeriod} 个月</Text>
                        </div>
                        <div className="info-item-full">
                          <Text className="info-label">{t('contract.liabilityForBreach')}</Text>
                          <Text className="info-value">{contract.terms.liabilityForBreach}</Text>
                        </div>
                      </div>
                    </Card>

                    {/* Delivery Info */}
                    <Card title={t('contract.deliveryInfo')} className="info-card">
                      <div className="info-grid">
                        <div className="info-item-full">
                          <Text className="info-label">{t('contract.deliveryContent')}</Text>
                          <Text className="info-value">{contract.deliveryContent}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">{t('contract.deliveryDate')}</Text>
                          <Text className="info-value">
                            {contract.deliveryDate ? formatDate(contract.deliveryDate) : '-'}
                          </Text>
                        </div>
                      </div>
                    </Card>

                    {/* Remarks */}
                    {contract.remarks && (
                      <Card title={t('contract.remarks')} className="info-card">
                        <Paragraph>{contract.remarks}</Paragraph>
                      </Card>
                    )}
                  </div>
                ),
              },
              {
                key: 'payment',
                label: t('contract.paymentPlans'),
                children: (
                  <div className="tab-content">
                    {/* Payment Progress */}
                    <Card className="info-card">
                      <div className="payment-progress-header">
                        <Text strong>{t('contract.paymentProgress')}</Text>
                        <Text type="secondary">{getPaymentProgress()}%</Text>
                      </div>
                      <Progress percent={getPaymentProgress()} status={getPaymentProgress() === 100 ? 'success' : 'active'} />
                    </Card>

                    {/* Payment Plans Table */}
                    <Card title={t('contract.paymentPlanList')} className="info-card">
                      <Table
                        rowKey="id"
                        columns={paymentColumns}
                        dataSource={contract.paymentPlans}
                        pagination={false}
                        size="small"
                      />
                    </Card>
                  </div>
                ),
              },
              {
                key: 'attachments',
                label: t('contract.attachments'),
                children: (
                  <div className="tab-content">
                    <Card className="info-card">
                      <List
                        dataSource={contract.attachments}
                        renderItem={(item: string) => (
                          <List.Item
                            actions={[
                              <Button type="text" size="sm" icon={<DownloadOutlined />}>
                                {t('common.download')}
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<FilePdfOutlined style={{ fontSize: 24, color: colors.primary }} />}
                              title={item.split('/').pop()}
                              description={t('contract.contractFile')}
                            />
                          </List.Item>
                        )}
                        locale={{ emptyText: t('contract.noAttachments') }}
                      />
                    </Card>
                    <Button type="secondary" icon={<UploadOutlined />} block>
                      {t('contract.uploadAttachment')}
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Right Sidebar - Related Info */}
        <div className="detail-sidebar-right">
          {/* Payment Summary Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <DollarOutlined className="sidebar-card-icon-primary" />
              <span>{t('contract.paymentSummary')}</span>
            </div>
            <Divider />
            <div className="card-info-item">
              <Text className="card-info-label" type="secondary">{t('contract.totalAmount')}</Text>
              <Text strong>{formatCurrency(contract.amount)}</Text>
            </div>
            <div className="card-info-item">
              <Text className="card-info-label" type="secondary">{t('contract.paidAmount')}</Text>
              <Text strong style={{ color: colors.success }}>
                {formatCurrency(contract.paymentPlans.reduce((sum, p) => sum + (p.actualAmount || 0), 0))}
              </Text>
            </div>
            <div className="card-info-item">
              <Text className="card-info-label" type="secondary">{t('contract.pendingAmount')}</Text>
              <Text strong style={{ color: colors.warning }}>
                {formatCurrency(contract.amount - contract.paymentPlans.reduce((sum, p) => sum + (p.actualAmount || 0), 0))}
              </Text>
            </div>
          </div>

          {/* Contract Period Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <CalendarOutlined className="sidebar-card-icon-info" />
              <span>{t('contract.contractPeriodInfo')}</span>
            </div>
            <Divider />
            <div className="card-info-item">
              <Text className="card-info-label" type="secondary">{t('contract.effectiveDate')}</Text>
              <Text>{formatDate(contract.effectiveDate)}</Text>
            </div>
            <div className="card-info-item">
              <Text className="card-info-label" type="secondary">{t('contract.expirationDate')}</Text>
              <Text>{contract.expirationDate ? formatDate(contract.expirationDate) : '-'}</Text>
            </div>
            <div className="card-info-item">
              <Text className="card-info-label" type="secondary">{t('contract.daysRemaining')}</Text>
              {contract.expirationDate ? (
                <Text style={{ color: colors.success }}>
                  {Math.ceil((new Date(contract.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 天
                </Text>
              ) : (
                <Text>-</Text>
              )}
            </div>
          </div>

          {/* Customer Link Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <UserOutlined className="sidebar-card-icon-success" />
              <span>{t('contract.relatedCustomer')}</span>
            </div>
            <Divider />
            <div className="related-item" onClick={() => navigate(`/customer/detail/${contract.customerId}`)}>
              <div className="related-header">
                <Text strong>{contract.customerName}</Text>
                <RightOutlined className="related-arrow" />
              </div>
              <Text type="secondary" className="related-subtitle">{t('contract.viewCustomerDetail')}</Text>
            </div>
          </div>

          {/* Opportunity Link Card */}
          {contract.opportunityId && (
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <SafetyOutlined className="sidebar-card-icon-warning" />
                <span>{t('contract.relatedOpportunity')}</span>
              </div>
              <Divider />
              <div className="related-item" onClick={() => navigate(`/opportunity/detail/${contract.opportunityId}`)}>
                <div className="related-header">
                  <Text strong>{contract.opportunityName}</Text>
                  <RightOutlined className="related-arrow" />
                </div>
                <Text type="secondary" className="related-subtitle">{t('contract.viewOpportunityDetail')}</Text>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title={t('contract.editContract')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        className="contract-modal"
        footer={[
          <Button type="secondary" onClick={() => setEditModalVisible(false)}>
            {t('common.cancel')}
          </Button>,
          <Button type="primary" onClick={() => setEditModalVisible(false)}>
            {t('common.save')}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label={t('contract.name')}>
            <Input value={contract.name} />
          </Form.Item>
          <Form.Item label={t('contract.status')}>
            <Select
              value={contract.status}
              options={[
                { value: ContractStatus.DRAFT, label: contractStatusLabels.draft },
                { value: ContractStatus.PENDING_APPROVAL, label: contractStatusLabels.pendingApproval },
                { value: ContractStatus.ACTIVE, label: contractStatusLabels.active },
                { value: ContractStatus.ARCHIVED, label: contractStatusLabels.archived },
                { value: ContractStatus.TERMINATED, label: contractStatusLabels.terminated },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractDetail;