import React, { useState, useMemo } from 'react';
import { Card, Space, Button, message, Row, Col, Statistic, Tabs, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, DollarOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PaymentPlan, PaymentStatus, PaymentFilter } from '../types/payment';
import {
  paymentPlanData,
  paymentRecordData,
  generatePaymentStats,
  filterPaymentPlans,
  filterPaymentRecords
} from '../mock/paymentData';
import { PaymentTable } from '../components/Payment/PaymentTable';
import { PaymentStatsCard } from '../components/Payment/PaymentStats';
import { SearchFilter } from '../components/Opportunity/SearchFilter';

/**
 * 回款列表页
 * 功能：
 * - 回款计划列表
 * - 回款记录列表
 * - 回款统计
 * - 搜索筛选
 */
export const PaymentList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');
  const [filter, setFilter] = useState<PaymentFilter>({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 回款统计数据
  const stats = useMemo(() => {
    return generatePaymentStats();
  }, []);

  // 筛选后的回款计划数据
  const filteredPlans = useMemo(() => {
    return filterPaymentPlans(paymentPlanData, filter);
  }, [filter]);

  // 筛选后的回款记录数据
  const filteredRecords = useMemo(() => {
    return filterPaymentRecords(paymentRecordData, {
      contractNumber: filter.contractNumber,
      customerName: filter.customerName,
      status: filter.status as any
    });
  }, [filter]);

  // 处理搜索
  const handleSearch = (values: PaymentFilter) => {
    setLoading(true);
    setFilter(values);
    setTimeout(() => {
      setLoading(false);
      message.success(t('common.messages.searchComplete'));
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    setFilter({});
  };

  // 处理查看详情
  const handleViewDetail = (id: string) => {
    navigate(`/payment/${id}`);
  };

  // 处理核销
  const handleVerify = (id: string) => {
    setVerifyModalVisible(true);
  };

  // 处理驳回
  const handleReject = (id: string) => {
    Modal.confirm({
      title: t('payment.list.rejectConfirm'),
      content: t('payment.list.rejectContent'),
      okText: t('payment.list.rejectConfirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.info(t('common.messages.operationSuccess'));
      },
    });
  };

  // 处理新建回款
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 处理新建提交
  const handleCreateSubmit = (values: any) => {
    console.log('新建回款:', values);
    message.success(t('common.messages.createSuccess'));
    setCreateModalVisible(false);
  };

  // 处理核销提交
  const handleVerifySubmit = (values: any) => {
    console.log('核销回款:', values);
    message.success(t('common.messages.operationSuccess'));
    setVerifyModalVisible(false);
  };

  // 状态选项
  const statusOptions = Object.values(PaymentStatus).map(status => ({
    value: status,
    label: status
  }));

  // Tab 页签
  const tabItems = [
    {
      key: 'plan',
      label: t('payment.list.planTab'),
      children: (
        <PaymentTable
          data={filteredPlans}
          onViewDetail={handleViewDetail}
          onVerify={handleVerify}
          onReject={handleReject}
          loading={loading}
        />
      )
    },
    {
      key: 'record',
      label: `${t('payment.list.recordTab')} (${paymentRecordData.length})`,
      children: (
        <PaymentTable
          data={filteredRecords as any}
          onViewDetail={handleViewDetail}
          loading={loading}
        />
      )
    }
  ];

  // 格式化金额
  const formatAmount = (amount: number) => {
    return (amount / 10000).toFixed(0);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.plannedTotal')}
              value={formatAmount(stats.totalPlanned)}
              suffix={t('common.unit.tenThousand')}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.actualTotal')}
              value={formatAmount(stats.totalActual)}
              suffix={t('common.unit.tenThousand')}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.completionRate')}
              value={stats.completionRate}
              suffix={t('common.unit.percent')}
              valueStyle={{
                color: stats.completionRate >= 80 ? '#52c41a' : stats.completionRate >= 50 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('payment.list.overdueAmount')}
              value={formatAmount(stats.overdueAmount)}
              suffix={t('common.unit.tenThousand')}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.overdueAmount > 0 ? '#ff4d4f' : '#52c41a' }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>{t('payment.list.title')}</h1>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              {t('payment.list.subtitle')}
            </p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('payment.list.newPayment')}
          </Button>
        </Space>
      </Card>

      {/* 搜索筛选区 */}
      <Card style={{ marginBottom: 16 }}>
        <SearchFilter
          filters={{ contractNumber: true, customerName: true, status: true }}
          statusOptions={statusOptions}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
      </Card>

      {/* 回款统计 */}
      <Card style={{ marginBottom: 16 }}>
        <PaymentStatsCard stats={stats} />
      </Card>

      {/* 回款列表 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 新建回款弹窗 */}
      <Modal
        title={t('payment.list.createModal.title')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('common.actions.confirm')}
        cancelText={t('common.actions.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="contractNumber"
            label={t('payment.list.createModal.contractNumber')}
            rules={[{ required: true, message: t('payment.list.createModal.contractNumberPlaceholder') }]}
          >
            <Input placeholder={t('payment.list.createModal.contractNumberPlaceholder')} />
          </Form.Item>
          <Form.Item name="customerName" label={t('payment.list.createModal.customerName')}>
            <Input placeholder={t('payment.list.createModal.customerNamePlaceholder')} />
          </Form.Item>
          <Form.Item
            name="plannedAmount"
            label={t('payment.list.createModal.plannedAmount')}
            rules={[{ required: true, message: t('common.validation.pleaseEnter') }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder={t('payment.list.createModal.plannedAmountPlaceholder')} min={0} />
          </Form.Item>
          <Form.Item name="installmentNumber" label={t('payment.list.createModal.installmentNumber')}>
            <InputNumber placeholder={t('payment.list.createModal.installmentNumberPlaceholder')} min={1} />
          </Form.Item>
          <Form.Item name="remark" label={t('payment.list.createModal.remark')}>
            <Input.TextArea rows={3} placeholder={t('payment.list.createModal.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 回款核销弹窗 */}
      <Modal
        title={t('payment.list.verifyModal.title')}
        open={verifyModalVisible}
        onCancel={() => setVerifyModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('common.actions.confirm')}
        cancelText={t('common.actions.cancel')}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleVerifySubmit}
        >
          <Form.Item
            name="actualAmount"
            label={t('payment.list.verifyModal.actualAmount')}
            rules={[{ required: true, message: t('common.validation.pleaseEnter') }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder={t('payment.list.verifyModal.actualAmountPlaceholder')} min={0} />
          </Form.Item>
          <Form.Item name="paymentMethod" label={t('payment.list.verifyModal.paymentMethod')}>
            <Select placeholder={t('payment.list.verifyModal.paymentMethodPlaceholder')}>
              <Select.Option value="银行转账">{t('payment.list.verifyModal.methodBankTransfer')}</Select.Option>
              <Select.Option value="支付宝">{t('payment.list.verifyModal.methodAlipay')}</Select.Option>
              <Select.Option value="微信">{t('payment.list.verifyModal.methodWechat')}</Select.Option>
              <Select.Option value="现金">{t('payment.list.verifyModal.methodCash')}</Select.Option>
              <Select.Option value="支票">{t('payment.list.verifyModal.methodCheck')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('payment.list.verifyModal.verifyNote')}>
            <Input.TextArea rows={3} placeholder={t('payment.list.verifyModal.verifyNotePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentList;