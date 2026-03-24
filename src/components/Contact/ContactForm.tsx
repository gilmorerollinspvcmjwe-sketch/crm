import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Radio, 
  DatePicker, 
  message,
  Divider,
} from 'antd';
import { CustomField, ModuleType } from '../../types/customField';
import { customFieldService } from '../../services/customFieldService';
import DynamicCustomFields from '../CustomField/DynamicCustomFields';

const { TextArea } = Input;

/** 性别选项 */
const genderOptions = [
  { label: '先生', value: '先生' },
  { label: '女士', value: '女士' },
];

/** 学历选项 */
const educationOptions = [
  { label: '高中及以下', value: '高中及以下' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' },
];

interface ContactFormProps {
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
 * 联系人表单组件（支持自定义字段）
 */
const ContactForm: React.FC<ContactFormProps> = ({
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
        const fields = await customFieldService.getCustomFields(ModuleType.CONTACT);
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
      message.success(isEdit ? '更新联系人成功' : '创建联系人成功');
    } catch (error) {
      message.error(isEdit ? '更新联系人失败' : '创建联系人失败');
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
        gender: '先生',
        ...initialValues,
      }}
    >
      {/* 基本信息 */}
      <Divider orientation="left" orientationMargin="0">基本信息</Divider>
      
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>

      <Form.Item name="gender" label="性别">
        <Radio.Group options={genderOptions} />
      </Form.Item>

      <Form.Item name="position" label="职位">
        <Input placeholder="请输入职位" />
      </Form.Item>

      <Form.Item name="department" label="部门">
        <Input placeholder="请输入部门" />
      </Form.Item>

      <Form.Item name="education" label="学历">
        <Select placeholder="请选择学历" options={educationOptions} />
      </Form.Item>

      <Form.Item name="mobile" label="手机号">
        <Input placeholder="请输入手机号" />
      </Form.Item>

      <Form.Item name="officePhone" label="办公电话">
        <Input placeholder="请输入办公电话" />
      </Form.Item>

      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item name="wechat" label="微信">
        <Input placeholder="请输入微信号" />
      </Form.Item>

      <Form.Item name="address" label="地址">
        <TextArea rows={2} placeholder="请输入地址" />
      </Form.Item>

      <Form.Item name="birthday" label="生日">
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item name="school" label="毕业院校">
        <Input placeholder="请输入毕业院校" />
      </Form.Item>

      <Form.Item name="major" label="专业">
        <Input placeholder="请输入专业" />
      </Form.Item>

      {/* 自定义字段 */}
      {customFields.length > 0 && (
        <>
          <Divider orientation="left" orientationMargin="0">自定义字段</Divider>
          <DynamicCustomFields
            module="contact"
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

export default ContactForm;
