import React, { useState, useMemo } from 'react';
import { Card, Space, Button, message, Row, Col, Statistic, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, DollarOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
      message.success('搜索完成');
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
      title: '确认删除',
      content: '确定要删除该合同吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除合同成功');
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
      title: '确认归档',
      content: '确定要归档该合同吗？归档后将不可修改。',
      okText: '确认归档',
      cancelText: '取消',
      onOk: () => {
        message.success('合同已归档');
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
    message.success('新建合同成功');
    setCreateModalVisible(false);
  };

  // 处理编辑提交
  const handleEditSubmit = (values: any) => {
    console.log('编辑合同:', values);
    message.success('编辑合同成功');
    setEditModalVisible(false);
  };

  // 处理审批提交
  const handleApprovalSubmit = (values: any) => {
    console.log('提交审批:', values);
    message.success('合同已提交审批');
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
              title="合同总数"
              value={stats.totalCount}
              suffix="个"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="合同总金额"
              value={formatAmount(stats.totalAmount)}
              suffix="万元"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="本月签订金额"
              value={formatAmount(stats.monthlyAmount)}
              suffix="万元"
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
            <h1 style={{ margin: 0, fontSize: 24 }}>合同管理</h1>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              当前共 {filteredData.length} 个合同
            </p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建合同
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
      <Card title="合同状态分布" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <Col span={4} key={status}>
              <Statistic
                title={status}
                value={count}
                suffix="个"
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
        title="新建合同"
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
            name="name"
            label="合同名称"
            rules={[{ required: true, message: '请输入合同名称' }]}
          >
            <Input placeholder="请输入合同名称" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="amount" label="合同金额 (元)">
            <InputNumber style={{ width: '100%' }} placeholder="请输入金额" min={0} />
          </Form.Item>
          <Form.Item name="type" label="合同类型">
            <Select placeholder="请选择合同类型">
              <Select.Option value="销售合同">销售合同</Select.Option>
              <Select.Option value="采购合同">采购合同</Select.Option>
              <Select.Option value="服务合同">服务合同</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑合同弹窗 */}
      <Modal
        title="编辑合同"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="合同名称"
            rules={[{ required: true, message: '请输入合同名称' }]}
          >
            <Input placeholder="请输入合同名称" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="amount" label="合同金额 (元)">
            <InputNumber style={{ width: '100%' }} placeholder="请输入金额" min={0} />
          </Form.Item>
          <Form.Item name="status" label="合同状态">
            <Select placeholder="请选择合同状态">
              <Select.Option value="草稿">草稿</Select.Option>
              <Select.Option value="审批中">审批中</Select.Option>
              <Select.Option value="已生效">已生效</Select.Option>
              <Select.Option value="已归档">已归档</Select.Option>
              <Select.Option value="已终止">已终止</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 合同审批弹窗 */}
      <Modal
        title="提交审批"
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApprovalSubmit}
        >
          <Form.Item name="approver" label="审批人">
            <Select placeholder="请选择审批人">
              <Select.Option value="1">张经理</Select.Option>
              <Select.Option value="2">李总监</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="审批说明">
            <Input.TextArea rows={3} placeholder="请输入审批说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractList;
