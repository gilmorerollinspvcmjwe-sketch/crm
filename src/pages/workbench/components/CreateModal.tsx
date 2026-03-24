/**
 * 通用创建弹窗组件
 * 支持客户、商机、合同三种类型的创建
 */
import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { UserAddOutlined, AimOutlined, FileOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export type ModalType = 'customer' | 'opportunity' | 'contract';

interface CreateModalProps {
  visible: boolean;
  type: ModalType;
  onCancel: () => void;
  onSubmit?: (data: any) => void;
}

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
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const getModalConfig = () => {
    switch (type) {
      case 'customer':
        return {
          title: t('workbench.create.customer'),
          icon: <UserAddOutlined />,
          fields: ['name', 'phone', 'type'],
        };
      case 'opportunity':
        return {
          title: t('workbench.create.opportunity'),
          icon: <AimOutlined />,
          fields: ['customerId', 'name', 'amount', 'stage'],
        };
      case 'contract':
        return {
          title: t('workbench.create.contract'),
          icon: <FileOutlined />,
          fields: ['customerId', 'name', 'amount', 'signDate'],
        };
      default:
        return { title: t('common.create'), icon: null, fields: [] as string[] };
    }
  };

  const config = getModalConfig();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        const submitData = {
          ...values,
          id: `${type}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        message.success(t('workbench.create.success', { name: config.title }));
        if (onSubmit) {
          onSubmit(submitData);
        }
        form.resetFields();
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(t('workbench.create.validationFailed'), error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const renderFields = () => {
    const fields = [];

    if (config.fields.includes('customerId')) {
      fields.push(
        <Form.Item key="customerId" name="customerId" label={t('workbench.create.selectCustomer')} rules={[{ required: true, message: t('workbench.create.selectCustomer') }]}>
          <Select placeholder={t('workbench.create.selectCustomer')} showSearch>
            {mockCustomers.map((customer) => (
              <Option key={customer.id} value={customer.id}>{customer.name}</Option>
            ))}
          </Select>
        </Form.Item>
      );
    }

    if (config.fields.includes('name')) {
      const label = type === 'customer' ? t('workbench.create.customerName') : type === 'opportunity' ? t('workbench.create.opportunityName') : t('workbench.create.contractName');
      fields.push(
        <Form.Item key="name" name="name" label={label} rules={[{ required: true, message: label }]}>
          <Input placeholder={label} />
        </Form.Item>
      );
    }

    if (config.fields.includes('phone')) {
      fields.push(
        <Form.Item key="phone" name="phone" label={t('workbench.create.phone')} rules={[{ required: true, message: t('workbench.create.enterPhone') }, { pattern: /^1[3-9]\d{9}$/, message: t('workbench.create.invalidPhone') }]}>
          <Input placeholder={t('workbench.create.enterPhone')} maxLength={11} />
        </Form.Item>
      );
    }

    if (config.fields.includes('type')) {
      fields.push(
        <Form.Item key="type" name="type" label={t('workbench.create.customerType')} rules={[{ required: true, message: t('workbench.create.selectCustomerType') }]} initialValue="enterprise">
          <Select placeholder={t('workbench.create.selectCustomerType')}>
            <Option value="enterprise">{t('workbench.create.enterpriseCustomer')}</Option>
            <Option value="government">{t('workbench.create.governmentCustomer')}</Option>
            <Option value="individual">{t('workbench.create.individualCustomer')}</Option>
          </Select>
        </Form.Item>
      );
    }

    if (config.fields.includes('amount')) {
      const label = type === 'opportunity' ? t('workbench.create.expectedAmount') : t('workbench.create.contractAmount');
      fields.push(
        <Form.Item key="amount" name="amount" label={label} rules={[{ required: true, message: t('workbench.create.enterAmount') }]}>
          <InputNumber placeholder={t('workbench.create.enterAmount')} min={0} style={{ width: '100%' }} prefix="¥" />
        </Form.Item>
      );
    }

    if (config.fields.includes('stage')) {
      fields.push(
        <Form.Item key="stage" name="stage" label={t('workbench.create.opportunityStage')} rules={[{ required: true, message: t('workbench.create.selectStage') }]} initialValue="lead">
          <Select placeholder={t('workbench.create.selectStage')}>
            <Option value="lead">{t('workbench.create.stageLead')}</Option>
            <Option value="qualify">{t('workbench.create.stageQualify')}</Option>
            <Option value="proposal">{t('workbench.create.stageProposal')}</Option>
            <Option value="negotiation">{t('workbench.create.stageNegotiation')}</Option>
            <Option value="closed">{t('workbench.create.stageClosed')}</Option>
          </Select>
        </Form.Item>
      );
    }

    if (config.fields.includes('signDate')) {
      fields.push(
        <Form.Item key="signDate" name="signDate" label={t('workbench.create.signDate')} rules={[{ required: true, message: t('workbench.create.selectSignDate') }]}>
          <DatePicker style={{ width: '100%' }} placeholder={t('workbench.create.selectSignDate')} />
        </Form.Item>
      );
    }

    return fields;
  };

  return (
    <Modal
      title={<span>{config.icon && <span style={{ marginRight: 8 }}>{config.icon}</span>}{config.title}</span>}
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