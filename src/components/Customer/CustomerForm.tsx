import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Radio, 
  message,
  Divider,
} from 'antd';
import { CustomField, ModuleType } from '../../types/customField';
import { customFieldService } from '../../services/customFieldService';
import DynamicCustomFields from '../CustomField/DynamicCustomFields';

const { TextArea } = Input;

/** 行业选项 */
const industryOptions = [
  { label: '互联网/软件/IT 服务', value: '互联网/软件/IT 服务' },
  { label: '制造业', value: '制造业' },
  { label: '金融业', value: '金融业' },
  { label: '零售业', value: '零售业' },
  { label: '医疗健康', value: '医疗健康' },
  { label: '教育培训', value: '教育培训' },
  { label: '房地产', value: '房地产' },
  { label: '能源/化工', value: '能源/化工' },
  { label: '物流/运输', value: '物流/运输' },
  { label: '其他', value: '其他' },
];

/** 企业规模选项 */
const companySizeOptions = [
  { label: '微型 (1-20 人)', value: '微型' },
  { label: '小型 (21-100 人)', value: '小型' },
  { label: '中型 (101-500 人)', value: '中型' },
  { label: '大型 (501-2000 人)', value: '大型' },
  { label: '超大型 (2000 人以上)', value: '超大型' },
];

/** 客户等级选项 */
const levelOptions = [
  { label: 'A - 重点客户', value: 'A' },
  { label: 'B - 普通客户', value: 'B' },
  { label: 'C - 一般客户', value: 'C' },
  { label: 'D - 潜在客户', value: 'D' },
];

/** 客户来源选项 */
const sourceOptions = [
  { label: '市场活动', value: '市场活动' },
  { label: '官网', value: '官网' },
  { label: '转介绍', value: '转介绍' },
  { label: '陌拜', value: '陌拜' },
  { label: '广告', value: '广告' },
  { label: '其他', value: '其他' },
];

interface CustomerFormProps {
  /** 初始值 */
  initialValues?: any;
  /** 提交处理 */
  onSubmit: (values: any) => Promise<void>;
  /** 取消处理 */
  onCancel: () => void;
  /** 是否编辑模式 */
  isEdit?: boolean;
}

/**
 * 客户表单组件（支持自定义字段）
 */
const CustomerForm: React.FC<CustomerFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载自定义字段
  useEffect(() => {
    const loadCustomFields = async () => {
      try {
        const fields = await customFieldService.getCustomFields(ModuleType.CUSTOMER);
        setCustomFields(fields);
      } catch (error) {
        console.error('加载自定义字段失败:', error);
      }
    };
    loadCustomFields();
  }, []);

  // 自定义字段值变化处理
  const handleCustomFieldChange = (fieldName: string, value: any) => {
    const currentValues = form.getFieldValue('customFields') || {};
    form.setFieldValue('customFields', {
      ...currentValues,
      [fieldName]: value,
    });
  };

  // 提交处理
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
      message.success(isEdit ? '更新客户成功' : '创建客户成功');
    } catch (error) {
      message.error(isEdit ? '更新客户失败' : '创建客户失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        level: 'B',
        status: '意向',
        source: '官网',
        ...initialValues,
      }}
    >
      {/* 基本信息 */}
      <Divider orientation="left" orientationMargin="0">基本信息</Divider>
      
      <Form.Item
        name="name"
        label="客户名称"
        rules={[{ required: true, message: '请输入客户名称' }]}
      >
        <Input placeholder="请输入客户名称" />
      </Form.Item>

      <Form.Item
        name="industry"
        label="所属行业"
        rules={[{ required: true, message: '请选择行业' }]}
      >
        <Select placeholder="请选择行业" options={industryOptions} />
      </Form.Item>

      <Form.Item name="companySize" label="企业规模">
        <Select placeholder="请选择企业规模" options={companySizeOptions} />
      </Form.Item>

      <Form.Item name="level" label="客户等级">
        <Radio.Group options={levelOptions} />
      </Form.Item>

      <Form.Item name="source" label="客户来源">
        <Select placeholder="请选择客户来源" options={sourceOptions} />
      </Form.Item>

      <Form.Item name="address" label="公司地址">
        <TextArea rows={2} placeholder="请输入公司地址" />
      </Form.Item>

      <Form.Item name="contactPerson" label="联系人">
        <Input placeholder="请输入联系人姓名" />
      </Form.Item>

      <Form.Item name="phone" label="联系电话">
        <Input placeholder="请输入联系电话" />
      </Form.Item>

      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item name="website" label="公司官网">
        <Input placeholder="请输入公司官网" />
      </Form.Item>

      {/* 自定义字段 */}
      {customFields.length > 0 && (
        <>
          <Divider orientation="left" orientationMargin="0">自定义字段</Divider>
          <DynamicCustomFields
            module="customer"
            fields={customFields}
            values={form.getFieldValue('customFields')}
            onChange={handleCustomFieldChange}
          />
        </>
      )}

      {/* 备注 */}
      <Divider orientation="left" orientationMargin="0">备注</Divider>
      
      <Form.Item name="remark" label="备注">
        <TextArea rows={3} placeholder="请输入备注信息" />
      </Form.Item>
    </Form>
  );
};

export default CustomerForm;
