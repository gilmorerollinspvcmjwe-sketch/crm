/**
 * 通用创建弹窗组件
 * 支持客户、商机、合同三种类型的创建
 */

import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { UserAddOutlined, AimOutlined, FileOutlined } from '@ant-design/icons';

const { Option } = Select;

export type ModalType = 'customer' | 'opportunity' | 'contract';

interface CreateModalProps {
  visible: boolean;
  type: ModalType;
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

// 客户类型选项
const customerTypes = [
  { value: 'enterprise', label: '企业客户' },
  { value: 'government', label: '政府客户' },
  { value: 'individual', label: '个人客户' },
];

// 商机阶段选项
const opportunityStages = [
  { value: 'lead', label: '线索' },
  { value: 'qualify', label: '初步接触' },
  { value: 'proposal', label: '方案报价' },
  { value: 'negotiation', label: '谈判审批' },
  { value: 'closed', label: '赢单' },
];

// Mock 客户列表（用于商机和合同的客户选择）
const mockCustomers = [
  { id: 'cust-001', name: '北京科技创新有限公司' },
  { id: 'cust-002', name: '上海智能制造集团' },
  { id: 'cust-003', name: '武汉商贸集团' },
  { id: 'cust-004', name: '杭州云服务有限公司' },
  { id: 'cust-005', name: '广州数字科技有限公司' },
];

export const CreateModal: React.FC<CreateModalProps> = ({
  visible,
  type,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 获取弹窗标题和图标
  const getModalConfig = () => {
    switch (type) {
      case 'customer':
        return {
          title: '新建客户',
          icon: <UserAddOutlined />,
          fields: ['name', 'phone', 'type'],
        };
      case 'opportunity':
        return {
          title: '新建商机',
          icon: <AimOutlined />,
          fields: ['customerId', 'name', 'amount', 'stage'],
        };
      case 'contract':
        return {
          title: '新建合同',
          icon: <FileOutlined />,
          fields: ['customerId', 'name', 'amount', 'signDate'],
        };
      default:
        return {
          title: '创建',
          icon: null,
          fields: [],
        };
    }
  };

  const config = getModalConfig();

  // 处理提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 模拟提交延迟
      setTimeout(() => {
        const submitData = {
          ...values,
          id: `${type}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        message.success(`创建${config.title}成功！`);
        
        if (onSubmit) {
          onSubmit(submitData);
        }

        form.resetFields();
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 渲染表单字段
  const renderFields = () => {
    const fields = [];

    // 客户选择字段（商机和合同需要）
    if (config.fields.includes('customerId')) {
      fields.push(
        <Form.Item
          key="customerId"
          name="customerId"
          label="选择客户"
          rules={[{ required: true, message: '请选择客户' }]}
        >
          <Select placeholder="请选择客户" showSearch>
            {mockCustomers.map((customer) => (
              <Option key={customer.id} value={customer.id}>
                {customer.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
    }

    // 名称字段（所有类型都需要）
    if (config.fields.includes('name')) {
      fields.push(
        <Form.Item
          key="name"
          name="name"
          label={type === 'customer' ? '客户名称' : type === 'opportunity' ? '商机名称' : '合同名称'}
          rules={[{ required: true, message: `请输入${type === 'customer' ? '客户' : type === 'opportunity' ? '商机' : '合同'}名称` }]}
        >
          <Input placeholder={`请输入${type === 'customer' ? '客户' : type === 'opportunity' ? '商机' : '合同'}名称`} />
        </Form.Item>
      );
    }

    // 电话字段（仅客户需要）
    if (config.fields.includes('phone')) {
      fields.push(
        <Form.Item
          key="phone"
          name="phone"
          label="联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>
      );
    }

    // 客户类型字段（仅客户需要）
    if (config.fields.includes('type')) {
      fields.push(
        <Form.Item
          key="type"
          name="type"
          label="客户类型"
          rules={[{ required: true, message: '请选择客户类型' }]}
          initialValue="enterprise"
        >
          <Select placeholder="请选择客户类型">
            {customerTypes.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
    }

    // 金额字段（商机和合同需要）
    if (config.fields.includes('amount')) {
      fields.push(
        <Form.Item
          key="amount"
          name="amount"
          label={type === 'opportunity' ? '预计金额' : '合同金额'}
          rules={[{ required: true, message: '请输入金额' }]}
        >
          <InputNumber
            placeholder="请输入金额"
            min={0 as number}
            style={{ width: '100%' }}
            prefix="¥"
            formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => Number(value?.replace(/¥\s?|(,*)/g, ''))}
          />
        </Form.Item>
      );
    }

    // 商机阶段字段（仅商机需要）
    if (config.fields.includes('stage')) {
      fields.push(
        <Form.Item
          key="stage"
          name="stage"
          label="商机阶段"
          rules={[{ required: true, message: '请选择商机阶段' }]}
          initialValue="lead"
        >
          <Select placeholder="请选择商机阶段">
            {opportunityStages.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
    }

    // 签约日期字段（仅合同需要）
    if (config.fields.includes('signDate')) {
      fields.push(
        <Form.Item
          key="signDate"
          name="signDate"
          label="签约日期"
          rules={[{ required: true, message: '请选择签约日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="请选择签约日期" />
        </Form.Item>
      );
    }

    return fields;
  };

  return (
    <Modal
      title={
        <span>
          {config.icon && <span style={{ marginRight: 8 }}>{config.icon}</span>}
          {config.title}
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={520}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {renderFields()}
      </Form>
    </Modal>
  );
};

export default CreateModal;
