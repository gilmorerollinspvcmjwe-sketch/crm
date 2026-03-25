import React, { useState, useMemo } from 'react';
import { Card, Space, Button, message, Row, Col, Statistic, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, DollarOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Contract, ContractStatus, ContractFilter } from '../types/contract';
import { contractData, generateContractStats, filterContracts } from '../mock/contractData';
import { ContractTable } from '../components/Opportunity/ContractTable';
import { SearchFilter } from '../components/Opportunity/SearchFilter';

/**
 * 合同列表页
 * 功能：
 * - 表格展示合同列表
 * - 状态筛选：草稿、审批中、已生效、已归档、已终止
 * - 统计卡片：合同总数、总金额、本月签订金额
 */
export const ContractList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<ContractFilter>({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 筛选后的合同数据
  const filteredData = useMemo(() => {
    return filterContracts(contractData, filter);
  }, [filter]);

  // 合同统计数据
  const stats = useMemo(() => {
    return generateContractStats();
  }, []);

  // 处理搜索
  const handleSearch = (values: ContractFilter) => {
    setLoading(true);
    setFilter(values);
    // 模拟异步加载
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
    navigate(`/contract/${id}`);
  };

  // 处理编辑
  const handleEdit = (id: string) => {
    setEditModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('contract.list.deleteConfirm'),
      content: t('contract.list.deleteContent'),
      okText: t('contract.list.deleteConfirm'),
      cancelText: t('common.actions.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('common.messages.deleteSuccess'));
      },
    });
  };

  // 处理提交审批
  const handleSubmitApproval = (id: string) => {
    setApprovalModalVisible(true);
  };

  // 处理归档
  const handleArchive = (id: string) => {
    Modal.confirm({
      title: t('contract.list.archiveConfirm'),
      content: t('contract.list.archiveContent'),
      okText: t('contract.list.archiveConfirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('contract.list.archiveSuccess'));
      },
    });
  };

  // 处理新建合同
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 处理新建提交
  const handleCreateSubmit = (values: any) => {
    console.log('新建合同:', values);
    message.success(t('common.messages.createSuccess'));
    setCreateModalVisible(false);
  };

  // 处理编辑提交
  const handleEditSubmit = (values: any) => {
    console.log('编辑合同:', values);
    message.success(t('common.messages.updateSuccess'));
    setEditModalVisible(false);
  };

  // 处理审批提交
  const handleApprovalSubmit = (values: any) => {
    console.log('提交审批:', values);
    message.success(t('common.messages.operationSuccess'));
    setApprovalModalVisible(false);
  };

  // 状态选项
  const statusOptions = Object.values(ContractStatus).map(status => ({
    value: status,
    label: status
  }));

  // 负责人选项
  const ownerOptions = Array.from(new Set(contractData.map(item => item.ownerName))).map(name => ({
    value: name,
    label: name
  }));

  // 格式化金额
  const formatAmount = (amount: number) => {
    return (amount / 10000).toFixed(0);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('contract.list.totalCount')}
              value={stats.totalCount}
              suffix={t('common.unit.count')}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('contract.list.totalAmount')}
              value={formatAmount(stats.totalAmount)}
              suffix={t('common.unit.tenThousand')}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={t('contract.list.monthlyAmount')}
              value={formatAmount(stats.monthlyAmount)}
              suffix={t('common.unit.tenThousand')}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>{t('contract.list.title')}</h1>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              {t('contract.list.currentCount', { count: filteredData.length })}
            </p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('contract.list.newContract')}
          </Button>
        </Space>
      </Card>

      {/* 搜索筛选区 */}
      <Card style={{ marginBottom: 16 }}>
        <SearchFilter
          filters={{ name: true, customerName: true, status: true, owner: true, contractNumber: true }}
          statusOptions={statusOptions}
          ownerOptions={ownerOptions}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
      </Card>

      {/* 合同表格 */}
      <Card>
        <ContractTable
          data={filteredData}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubmitApproval={handleSubmitApproval}
          onArchive={handleArchive}
          loading={loading}
        />
      </Card>

      {/* 状态分布 */}
      <Card title={t('contract.list.statusDistribution')} style={{ marginTop: 16 }}>
        <Row gutter={16}>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <Col span={4} key={status}>
              <Statistic
                title={status}
                value={count}
                suffix={t('common.unit.count')}
                valueStyle={{
                  color: status === '已生效' ? '#52c41a' : status === '审批中' ? '#1890ff' : status === '已归档' ? '#722ed1' : status === '已终止' ? '#ff4d4f' : '#666'
                }}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* 新建合同弹窗 */}
      <Modal
        title={t('contract.list.createModal.title')}
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
            name="name"
            label={t('contract.list.createModal.name')}
            rules={[{ required: true, message: t('contract.list.createModal.namePlaceholder') }]}
          >
            <Input placeholder={t('contract.list.createModal.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="customerName" label={t('contract.list.createModal.customerName')}>
            <Input placeholder={t('contract.list.createModal.customerNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="amount" label={t('contract.list.createModal.amount')}>
            <InputNumber style={{ width: '100%' }} placeholder={t('contract.list.createModal.amountPlaceholder')} min={0} />
          </Form.Item>
          <Form.Item name="type" label={t('contract.list.createModal.type')}>
            <Select placeholder={t('contract.list.createModal.typePlaceholder')}>
              <Select.Option value="销售合同">{t('contract.list.createModal.typeSales')}</Select.Option>
              <Select.Option value="采购合同">{t('contract.list.createModal.typePurchase')}</Select.Option>
              <Select.Option value="服务合同">{t('contract.list.createModal.typeService')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('contract.list.createModal.remark')}>
            <Input.TextArea rows={3} placeholder={t('contract.list.createModal.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑合同弹窗 */}
      <Modal
        title={t('contract.list.editModal.title')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('common.actions.confirm')}
        cancelText={t('common.actions.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label={t('contract.list.createModal.name')}
            rules={[{ required: true, message: t('contract.list.createModal.namePlaceholder') }]}
          >
            <Input placeholder={t('contract.list.createModal.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="customerName" label={t('contract.list.createModal.customerName')}>
            <Input placeholder={t('contract.list.createModal.customerNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="amount" label={t('contract.list.createModal.amount')}>
            <InputNumber style={{ width: '100%' }} placeholder={t('contract.list.createModal.amountPlaceholder')} min={0} />
          </Form.Item>
          <Form.Item name="status" label={t('contract.list.editModal.status')}>
            <Select placeholder={t('contract.list.editModal.statusPlaceholder')}>
              <Select.Option value="草稿">{t('contract.status.draft')}</Select.Option>
              <Select.Option value="审批中">{t('contract.status.pendingApproval')}</Select.Option>
              <Select.Option value="已生效">{t('contract.status.active')}</Select.Option>
              <Select.Option value="已归档">{t('contract.status.archived')}</Select.Option>
              <Select.Option value="已终止">{t('contract.status.terminated')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('contract.list.createModal.remark')}>
            <Input.TextArea rows={3} placeholder={t('contract.list.createModal.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 合同审批弹窗 */}
      <Modal
        title={t('contract.list.approvalModal.title')}
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('common.actions.confirm')}
        cancelText={t('common.actions.cancel')}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApprovalSubmit}
        >
          <Form.Item name="approver" label={t('contract.list.approvalModal.approver')}>
            <Select placeholder={t('contract.list.approvalModal.approverPlaceholder')}>
              <Select.Option value="1">{t('contract.list.approvalModal.approver1')}</Select.Option>
              <Select.Option value="2">{t('contract.list.approvalModal.approver2')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('contract.list.approvalModal.remark')}>
            <Input.TextArea rows={3} placeholder={t('contract.list.approvalModal.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractList;
