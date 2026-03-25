import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Tag, Space, Button, Typography, Divider, message, Modal,
  Table, Timeline, Progress
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PaymentPlan, PaymentStatus, PaymentMethod } from '../types/payment';
import { paymentPlanData, paymentRecordData } from '../mock/paymentData';
import { PaymentProgress } from '../components/Payment/PaymentProgress';

const { Title, Text } = Typography;

// 状态颜色配置
const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'default',
  [PaymentStatus.PARTIAL]: 'orange',
  [PaymentStatus.COMPLETED]: 'green',
  [PaymentStatus.OVERDUE]: 'red'
};

// 付款方式颜色
const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  [PaymentMethod.BANK_TRANSFER]: 'blue',
  [PaymentMethod.ALIPAY]: 'cyan',
  [PaymentMethod.WECHAT_PAY]: 'green',
  [PaymentMethod.CASH]: 'orange',
  [PaymentMethod.CHECK]: 'purple',
  [PaymentMethod.OTHER]: 'default'
};

/**
 * 回款详情页
 * 功能：
 * - 回款计划详情
 * - 回款记录
 * - 回款进度
 * - 操作按钮
 */
export const PaymentDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 查找回款计划数据
  const paymentPlan = useMemo(() => {
    return paymentPlanData.find(p => p.id === id);
  }, [id]);

  // 查找相关回款记录
  const relatedRecords = useMemo(() => {
    if (!paymentPlan) return [];
    return paymentRecordData.filter(record =>
      record.contractId === paymentPlan.contractId
    );
  }, [id, paymentPlan]);

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
    navigate('/payment/list');
  };

  // 处理编辑
  const handleEdit = () => {
    message.info(`${t('common.actions.edit')}：${id}`);
    // TODO: 打开编辑表单
  };

  // 处理核销
  const handleVerify = () => {
    Modal.confirm({
      title: t('payment.detail.verifyConfirm'),
      content: t('payment.detail.verifyContent'),
      okText: t('common.actions.confirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('common.messages.operationSuccess'));
        // TODO: 调用核销 API
      }
    });
  };

  // 处理驳回
  const handleReject = () => {
    Modal.confirm({
      title: t('payment.detail.rejectConfirm'),
      content: t('payment.detail.rejectContent'),
      okText: t('common.actions.confirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.info(t('common.messages.operationSuccess'));
        // TODO: 调用驳回 API
      }
    });
  };

  // 如果没有找到回款计划
  if (!paymentPlan) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={3}>{t('payment.detail.notFound')}</Title>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            {t('payment.detail.back')}
          </Button>
        </Card>
      </div>
    );
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: t('payment.status.pending'),
      PARTIAL: t('payment.status.partial'),
      COMPLETED: t('payment.status.completed'),
      OVERDUE: t('payment.status.overdue')
    };
    return statusMap[status] || status;
  };

  // 获取记录状态文本
  const getRecordStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      VERIFIED: t('payment.recordStatus.verified'),
      PENDING_VERIFY: t('payment.recordStatus.pendingVerify'),
      REJECTED: t('payment.recordStatus.rejected')
    };
    return statusMap[status] || status;
  };

  // 回款记录表格列
  const recordColumns = [
    {
      title: t('payment.detail.planInfo').replace('📋 ', ''),
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      render: (date: string) => formatDate(date)
    },
    {
      title: t('payment.detail.actualAmount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>{formatAmount(amount)}</Text>
      )
    },
    {
      title: t('payment.detail.paymentMethod'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: PaymentMethod) => (
        <Tag color={PAYMENT_METHOD_COLORS[method]}>{method}</Tag>
      )
    },
    {
      title: t('payment.detail.paymentAccount'),
      dataIndex: 'paymentAccount',
      key: 'paymentAccount',
      ellipsis: true
    },
    {
      title: t('payment.detail.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { text: string; color: string }> = {
          VERIFIED: { text: getRecordStatusText('VERIFIED'), color: 'green' },
          PENDING_VERIFY: { text: getRecordStatusText('PENDING_VERIFY'), color: 'orange' },
          REJECTED: { text: getRecordStatusText('REJECTED'), color: 'red' }
        };
        const config = statusConfig[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: t('payment.detail.verifiedByName'),
      dataIndex: 'verifiedByName',
      key: 'verifiedByName',
      width: 100,
      render: (name?: string) => name || '-'
    },
    {
      title: t('payment.detail.remarks'),
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <Space>
            <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
              {t('payment.detail.back')}
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              {t('payment.detail.title')}：{paymentPlan.contractNumber} - {t('payment.detail.installmentFormat', { num: paymentPlan.installmentNumber })}
            </Title>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              {t('payment.detail.edit')}
            </Button>
            {paymentPlan.actualAmount && paymentPlan.status !== PaymentStatus.COMPLETED && (
              <>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleVerify}
                  style={{ color: '#52c41a' }}
                >
                  {t('payment.detail.verify')}
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleReject}
                >
                  {t('payment.detail.reject')}
                </Button>
              </>
            )}
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title={t('payment.detail.planInfo')} style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label={t('payment.detail.contractNumber')}>
            <Text code>{paymentPlan.contractNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.contractName')}>{paymentPlan.contractName}</Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.customerName')}>{paymentPlan.customerName}</Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.installmentNumber')}>{t('payment.detail.installmentFormat', { num: paymentPlan.installmentNumber })}</Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.plannedAmount')}>
            <Text strong>{formatAmount(paymentPlan.plannedAmount)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.actualAmount')}>
            {paymentPlan.actualAmount ? (
              <Text strong style={{ color: '#52c41a' }}>{formatAmount(paymentPlan.actualAmount)}</Text>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.plannedDate')}>{formatDate(paymentPlan.plannedDate)}</Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.actualDate')}>
            {paymentPlan.actualDate ? formatDate(paymentPlan.actualDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.paymentMethod')}>
            {paymentPlan.paymentMethod ? (
              <Tag color={PAYMENT_METHOD_COLORS[paymentPlan.paymentMethod]}>
                {paymentPlan.paymentMethod}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.status')}>
            <Tag color={STATUS_COLORS[paymentPlan.status]}>{getStatusText(paymentPlan.status)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.overdueDays')}>
            {paymentPlan.overdueDays && paymentPlan.overdueDays > 0 ? (
              <Text type="danger">{paymentPlan.overdueDays}{t('payment.detail.daysUnit')}</Text>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.paymentCondition')} span={2}>
            {paymentPlan.paymentCondition || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('payment.detail.remarks')} span={3}>
            {paymentPlan.remarks || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 回款进度 */}
      <Card title={t('payment.detail.paymentProgress')} style={{ marginBottom: 16 }}>
        <PaymentProgress
          paymentPlans={[paymentPlan]}
          totalAmount={paymentPlan.plannedAmount}
          showDetail={false}
        />
      </Card>

      {/* 关联回款记录 */}
      <Card title={t('payment.detail.records')} style={{ marginBottom: 16 }}>
        {relatedRecords.length > 0 ? (
          <Table
            columns={recordColumns}
            dataSource={relatedRecords}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            {t('payment.detail.noRecords')}
          </div>
        )}
      </Card>

      {/* 时间线 */}
      <Card title={t('payment.detail.timeline')}>
        <Timeline
          items={[
            {
              color: 'green',
              children: (
                <div>
                  <div>{t('payment.detail.planCreated')}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(paymentPlan.createdAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
              )
            },
            paymentPlan.actualDate && {
              color: 'blue',
              children: (
                <div>
                  <div>{t('payment.detail.paymentReceived')}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(paymentPlan.actualDate).toLocaleString('zh-CN')}
                  </Text>
                  <div>{t('payment.detail.actualAmount')}：{formatAmount(paymentPlan.actualAmount!)}</div>
                </div>
              )
            },
            paymentPlan.status === PaymentStatus.COMPLETED && {
              color: 'green',
              children: (
                <div>
                  <div>{t('payment.detail.paymentVerified')}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(paymentPlan.updatedAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
              )
            },
            paymentPlan.overdueDays && paymentPlan.overdueDays > 0 && {
              color: 'red',
              children: (
                <div>
                  <div style={{ color: '#ff4d4f' }}>{t('payment.detail.paymentOverdue')}</div>
                  <Text type="danger" style={{ fontSize: 12 }}>
                    {t('payment.detail.overdueDaysFormat', { days: paymentPlan.overdueDays })}
                  </Text>
                </div>
              )
            }
          ].filter(Boolean)}
        />
      </Card>
    </div>
  );
};

export default PaymentDetail;