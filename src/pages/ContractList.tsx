import React, { useState, useMemo } from 'react';
import { Card, Space, message, Row, Col, Statistic, Modal, Form, Input as AntInput, InputNumber, Typography, Tag } from 'antd';
import { PlusOutlined, DollarOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/DataTable';
import { FilterBar, FilterItem } from '../components/FilterBar';
import { Contract, ContractStatus, ContractFilter } from '../types/contract';
import { contractData, generateContractStats, filterContracts } from '../mock/contractData';
import type { ColumnsType } from 'antd/es/table';
import './ContractList.css';

const { Text } = Typography;

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
    <div className="crm-page contract-list-page">
      {/* 1. 标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('contract.list.title')}</h1>
          <span className="page-stats">
            {t('contract.list.currentCount', { count: filteredData.length })}
          </span>
        </div>
        <div className="page-header-right">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('contract.list.newContract')}
          </Button>
        </div>
      </div>

      {/* 2. 统计卡片 */}
      <Row gutter={16} className="stats-row">
        <Col span={8}>
          <Card className="stats-card">
            <Statistic
              title={t('contract.list.totalCount')}
              value={stats.totalCount}
              suffix={t('common.unit.count')}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: 'var(--brand-600)' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stats-card">
            <Statistic
              title={t('contract.list.totalAmount')}
              value={formatAmount(stats.totalAmount)}
              suffix={t('common.unit.tenThousand')}
              prefix={<DollarOutlined />}
              valueStyle={{ color: 'var(--warning-600)' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stats-card">
            <Statistic
              title={t('contract.list.monthlyAmount')}
              value={formatAmount(stats.monthlyAmount)}
              suffix={t('common.unit.tenThousand')}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: 'var(--success-600)' }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* 3. 筛选栏 */}
      <Card className="filter-card" styles={{ body: { padding: '12px 16px' } }}>
        <FilterBar
          filters={[
            { name: 'name', label: t('contract.filter.name'), type: 'text', placeholder: '合同名称' },
            { name: 'contractNumber', label: t('contract.filter.number'), type: 'text', placeholder: '合同编号' },
            { name: 'customerName', label: t('contract.filter.customer'), type: 'text', placeholder: '客户名称' },
            { name: 'status', label: t('contract.filter.status'), type: 'select', placeholder: '状态', options: statusOptions },
            { name: 'ownerName', label: t('contract.filter.owner'), type: 'select', placeholder: '负责人', options: ownerOptions },
          ]}
          onFilterChange={(values) => setFilter(values)}
          onReset={() => setFilter({})}
          loading={loading}
          defaultShowCount={4}
        />
      </Card>

      {/* 4. 表格 */}
      <Card className="table-card" styles={{ body: { padding: 16 } }}>
        <DataTable<Contract>
          tableKey="contract-list"
          columns={[
            {
              title: t('contract.table.number'),
              dataIndex: 'contractNumber',
              key: 'contractNumber',
              width: 140,
              render: (text, record) => (
                <a onClick={() => handleViewDetail(record.id)} className="contract-link">{text}</a>
              ),
            },
            {
              title: t('contract.table.name'),
              dataIndex: 'name',
              key: 'name',
              width: 180,
            },
            {
              title: t('contract.table.customer'),
              dataIndex: 'customerName',
              key: 'customerName',
              width: 150,
            },
            {
              title: t('contract.table.amount'),
              dataIndex: 'amount',
              key: 'amount',
              width: 100,
              render: (amount: number) => (
                <Text strong className="amount-text">
                  ¥{(amount / 10000).toFixed(0)}万
                </Text>
              ),
              sorter: (a, b) => a.amount - b.amount,
            },
            {
              title: t('contract.table.status'),
              dataIndex: 'status',
              key: 'status',
              width: 80,
              render: (status: ContractStatus) => (
                <Badge 
                  color={status === ContractStatus.ACTIVE ? 'success' : 
                         status === ContractStatus.PENDING_APPROVAL ? 'brand' : 
                         status === ContractStatus.ARCHIVED ? 'neutral' : 'danger'} 
                  variant="soft" 
                  size="sm"
                >
                  {status}
                </Badge>
              ),
            },
            {
              title: t('contract.table.startDate'),
              dataIndex: 'startDate',
              key: 'startDate',
              width: 100,
            },
            {
              title: t('contract.table.endDate'),
              dataIndex: 'endDate',
              key: 'endDate',
              width: 100,
            },
            {
              title: t('contract.table.owner'),
              dataIndex: 'ownerName',
              key: 'ownerName',
              width: 90,
            },
            {
              title: t('contract.table.actions'),
              key: 'action',
              width: 120,
              render: (_, record) => (
                <Space size="small">
                  <Button type="text" size="sm" onClick={() => handleViewDetail(record.id)}>
                    查看
                  </Button>
                  <Button type="text" size="sm" onClick={() => handleEdit(record.id)}>
                    编辑
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{ defaultPageSize: 20 }}
        />
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
            <Select placeholder={t('contract.list.createModal.typePlaceholder')} options={[
              { value: '销售合同', label: t('contract.list.createModal.typeSales') },
              { value: '采购合同', label: t('contract.list.createModal.typePurchase') },
              { value: '服务合同', label: t('contract.list.createModal.typeService') },
            ]} />
          </Form.Item>
          <Form.Item name="remark" label={t('contract.list.createModal.remark')}>
            <AntInput.TextArea rows={3} placeholder={t('contract.list.createModal.remarkPlaceholder')} />
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
            <Select placeholder={t('contract.list.editModal.statusPlaceholder')} options={[
              { value: '草稿', label: t('contract.status.draft') },
              { value: '审批中', label: t('contract.status.pendingApproval') },
              { value: '已生效', label: t('contract.status.active') },
              { value: '已归档', label: t('contract.status.archived') },
              { value: '已终止', label: t('contract.status.terminated') },
            ]} />
          </Form.Item>
          <Form.Item name="remark" label={t('contract.list.createModal.remark')}>
            <AntInput.TextArea rows={3} placeholder={t('contract.list.createModal.remarkPlaceholder')} />
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
            <Select placeholder={t('contract.list.approvalModal.approverPlaceholder')} options={[
              { value: '1', label: t('contract.list.approvalModal.approver1') },
              { value: '2', label: t('contract.list.approvalModal.approver2') },
            ]} />
          </Form.Item>
          <Form.Item name="remark" label={t('contract.list.approvalModal.remark')}>
            <AntInput.TextArea rows={3} placeholder={t('contract.list.approvalModal.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractList;
