import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Space, Button, Typography, Divider, Table, message, Modal, Progress, Timeline } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CiOutlined as ArchiveOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Contract, ContractStatus, PaymentPlan } from '../types/contract';
import { contractData } from '../mock/contractData';

const { Title, Text, Paragraph } = Typography;

// 状态颜色配置
const STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: 'default',
  [ContractStatus.PENDING_APPROVAL]: 'processing',
  [ContractStatus.ACTIVE]: 'success',
  [ContractStatus.ARCHIVED]: 'blue',
  [ContractStatus.TERMINATED]: 'red'
};

// 回款计划状态颜色
const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: 'default',
  PARTIAL: 'orange',
  COMPLETED: 'green',
  OVERDUE: 'red'
};

/**
 * 合同详情页
 * 功能：
 * - 基本信息展示
 * - 合同条款展示
 * - 关联信息：关联商机、回款计划
 * - 操作按钮：编辑、提交审批、归档、删除
 */
export const ContractDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 查找合同数据
  const contract = useMemo(() => {
    return contractData.find(c => c.id === id);
  }, [id]);

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  // 处理返回
  const handleBack = () => {
    navigate('/contract/list');
  };

  // 处理编辑
  const handleEdit = () => {
    message.info(`${t('common.actions.edit')}：${id}`);
    // TODO: 打开编辑表单
  };

  // 处理提交审批
  const handleSubmitApproval = () => {
    Modal.confirm({
      title: t('contract.detail.submitApprovalConfirm'),
      content: t('contract.detail.submitApprovalContent'),
      okText: t('common.actions.confirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('common.messages.operationSuccess'));
        // TODO: 调用审批 API
      }
    });
  };

  // 处理归档
  const handleArchive = () => {
    Modal.confirm({
      title: t('contract.detail.archiveConfirm'),
      content: t('contract.detail.archiveContent'),
      okText: t('common.actions.confirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('contract.list.archiveSuccess'));
        // TODO: 调用归档 API
      }
    });
  };

  // 处理删除
  const handleDelete = () => {
    Modal.confirm({
      title: t('contract.detail.deleteConfirm'),
      content: t('contract.detail.deleteContent'),
      okText: t('common.actions.confirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('common.messages.deleteSuccess'));
        // TODO: 调用删除 API
      }
    });
  };

  // 如果没有找到合同
  if (!contract) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={3}>{t('contract.detail.notFound')}</Title>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            {t('contract.detail.back')}
          </Button>
        </Card>
      </div>
    );
  }

  // 回款计划状态文本
  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: t('contract.paymentPlan.pending'),
      PARTIAL: t('contract.paymentPlan.partial'),
      COMPLETED: t('contract.paymentPlan.completed'),
      OVERDUE: t('contract.paymentPlan.overdue')
    };
    return statusMap[status] || status;
  };

  // 回款计划表格列
  const paymentPlanColumns = [
    {
      title: t('contract.paymentPlan.installment'),
      dataIndex: 'installmentNumber',
      key: 'installmentNumber',
      width: 80,
      render: (num: number) => t('contract.paymentPlan.installmentFormat', { num })
    },
    {
      title: t('contract.paymentPlan.plannedAmount'),
      dataIndex: 'plannedAmount',
      key: 'plannedAmount',
      width: 120,
      render: (amount: number) => formatAmount(amount)
    },
    {
      title: t('contract.paymentPlan.plannedDate'),
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      width: 120,
      render: (date: string) => formatDate(date)
    },
    {
      title: t('contract.paymentPlan.actualAmount'),
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      render: (amount?: number) => amount ? formatAmount(amount) : '-'
    },
    {
      title: t('contract.paymentPlan.actualDate'),
      dataIndex: 'actualDate',
      key: 'actualDate',
      width: 120,
      render: (date?: string) => date ? formatDate(date) : '-'
    },
    {
      title: t('contract.paymentPlan.paymentCondition'),
      dataIndex: 'paymentCondition',
      key: 'paymentCondition',
      ellipsis: true
    },
    {
      title: t('contract.paymentPlan.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={PAYMENT_STATUS_COLORS[status]}>
          {getPaymentStatusText(status)}
        </Tag>
      )
    }
  ];

  // 计算回款进度
  const completedPayments = contract.paymentPlans.filter(p => p.status === 'COMPLETED').length;
  const totalPayments = contract.paymentPlans.length;
  const paymentProgress = totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0;
  const paidAmount = contract.paymentPlans
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.actualAmount || p.plannedAmount), 0);

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <Space>
            <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
              {t('contract.detail.back')}
            </Button>
            <Title level={3} style={{ margin: 0 }}>{contract.name}</Title>
          </Space>
          <Space>
            {contract.status === ContractStatus.DRAFT && (
              <>
                <Button icon={<EditOutlined />} onClick={handleEdit}>
                  {t('contract.detail.edit')}
                </Button>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmitApproval}>
                  {t('contract.detail.submitApproval')}
                </Button>
              </>
            )}
            {contract.status === ContractStatus.ACTIVE && (
              <Button icon={<ArchiveOutlined />} onClick={handleArchive}>
                {t('contract.detail.archive')}
              </Button>
            )}
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              {t('contract.detail.delete')}
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title={t('contract.detail.basicInfo')} style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label={t('contract.detail.contractName')}>{contract.name}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.contractNumber')}>
            <Text code>{contract.contractNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.contractType')}>
            <Tag>{contract.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.customerName')}>{contract.customerName}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.opportunityName')}>
            {contract.opportunityName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.amount')}>
            <Text strong style={{ color: '#faad14' }}>{formatAmount(contract.amount)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.currency')}>{contract.currency}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.signingDate')}>{formatDate(contract.signingDate)}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.effectiveDate')}>{formatDate(contract.effectiveDate)}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.expirationDate')}>{contract.expirationDate ? formatDate(contract.expirationDate) : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.contractPeriod')}>{contract.contractPeriod ? `${contract.contractPeriod}${t('common.unit.months')}` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.status')}>
            <Tag color={STATUS_COLORS[contract.status]}>{contract.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.ownerName')}>{contract.ownerName}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.signerOurSide')}>{contract.signerOurSide}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.signerCustomerSide')}>{contract.signerCustomerSide || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.createdAt')}>{formatDate(contract.createdAt)}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.updatedAt')}>{formatDate(contract.updatedAt)}</Descriptions.Item>
          {contract.archivedAt && (
            <Descriptions.Item label={t('contract.detail.archivedAt')}>{formatDate(contract.archivedAt)}</Descriptions.Item>
          )}
          {contract.archivedBy && (
            <Descriptions.Item label={t('contract.detail.archivedBy')}>{contract.archivedBy}</Descriptions.Item>
          )}
          <Descriptions.Item label={t('contract.detail.remarks')} span={3}>
            {contract.remarks || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 回款进度 */}
      <Card title={t('contract.detail.paymentProgress')} style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Progress
            type="circle"
            percent={paymentProgress}
            strokeColor={paymentProgress === 100 ? '#52c41a' : '#1890ff'}
            format={() => `${paymentProgress}%`}
          />
          <div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>
              {t('contract.detail.paidAmount')}：<Text strong style={{ color: '#52c41a' }}>{formatAmount(paidAmount)}</Text>
              {' / '}
              {t('contract.detail.totalAmount')}：<Text strong>{formatAmount(contract.amount)}</Text>
            </div>
            <div style={{ color: '#666' }}>
              {t('contract.detail.paymentPeriods')}：{completedPayments} / {totalPayments} 期
            </div>
          </div>
        </Space>
      </Card>

      {/* 合同条款 */}
      <Card title={t('contract.detail.terms')} style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label={t('contract.detail.paymentMethod')}>{contract.terms.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.warrantyPeriod')}>{contract.terms.warrantyPeriod}个月</Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.paymentTerms')} span={2}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.terms.paymentTerms}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.deliveryTerms')} span={2}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.terms.deliveryTerms}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.deliveryContent')} span={2}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.deliveryContent}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.deliveryDate')} span={2}>
            {contract.deliveryDate ? formatDate(contract.deliveryDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('contract.detail.liabilityForBreach')} span={3}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.terms.liabilityForBreach}</Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 回款计划 */}
      <Card title={t('contract.detail.paymentPlan')} style={{ marginBottom: 16 }}>
        <Table
          columns={paymentPlanColumns}
          dataSource={contract.paymentPlans}
          rowKey="id"
          pagination={false}
          size="middle"
          summary={(pageData) => {
            const totalPlanned = pageData.reduce((sum, p) => sum + p.plannedAmount, 0);
            const totalActual = pageData.reduce((sum, p) => sum + (p.actualAmount || 0), 0);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>{t('contract.paymentPlan.total')}</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{formatAmount(totalPlanned)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong>{formatAmount(totalActual)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>-</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      {/* 附件 */}
      {contract.attachments.length > 0 && (
        <Card title={t('contract.detail.attachments')}>
          <Space>
            {contract.attachments.map((url, index) => (
              <Tag key={index} color="blue" style={{ cursor: 'pointer' }}>
                📄 {t('contract.detail.attachmentFile')} {index + 1}
              </Tag>
            ))}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default ContractDetail;