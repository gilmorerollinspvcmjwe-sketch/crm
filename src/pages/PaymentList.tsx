import React, { useState, useMemo } from 'react';
import { Card, Space, Button, message, Row, Col, Statistic, Tabs, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, DollarOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
      message.success('搜索完成');
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
      title: '确认驳回',
      content: '确定要驳回这笔回款吗？请说明驳回原因。',
      okText: '确认驳回',
      cancelText: '取消',
      onOk: () => {
        message.info('回款已驳回');
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
    message.success('新建回款成功');
    setCreateModalVisible(false);
  };

  // 处理核销提交
  const handleVerifySubmit = (values: any) => {
    console.log('核销回款:', values);
    message.success('回款已核销');
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
      label: '回款计划',
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
      label: `回款记录 (${paymentRecordData.length})`,
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
              title="计划回款总额"
              value={formatAmount(stats.totalPlanned)}
              suffix="万元"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="实际回款总额"
              value={formatAmount(stats.totalActual)}
              suffix="万元"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="回款完成率"
              value={stats.completionRate}
              suffix="%"
              valueStyle={{
                color: stats.completionRate >= 80 ? '#52c41a' : stats.completionRate >= 50 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期金额"
              value={formatAmount(stats.overdueAmount)}
              suffix="万元"
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
            <h1 style={{ margin: 0, fontSize: 24 }}>回款管理</h1>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              管理回款计划和回款记录，跟踪回款进度
            </p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建回款
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
        title="新建回款计划"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="contractNumber"
            label="合同编号"
            rules={[{ required: true, message: '请输入合同编号' }]}
          >
            <Input placeholder="请输入合同编号" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item
            name="plannedAmount"
            label="计划金额 (元)"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入金额" min={0} />
          </Form.Item>
          <Form.Item name="installmentNumber" label="期数">
            <InputNumber placeholder="请输入期数" min={1} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 回款核销弹窗 */}
      <Modal
        title="回款核销"
        open={verifyModalVisible}
        onCancel={() => setVerifyModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleVerifySubmit}
        >
          <Form.Item
            name="actualAmount"
            label="实际金额 (元)"
            rules={[{ required: true, message: '请输入实际金额' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入实际金额" min={0} />
          </Form.Item>
          <Form.Item name="paymentMethod" label="付款方式">
            <Select placeholder="请选择付款方式">
              <Select.Option value="银行转账">银行转账</Select.Option>
              <Select.Option value="支付宝">支付宝</Select.Option>
              <Select.Option value="微信">微信</Select.Option>
              <Select.Option value="现金">现金</Select.Option>
              <Select.Option value="支票">支票</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="核销说明">
            <Input.TextArea rows={3} placeholder="请输入核销说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentList;
