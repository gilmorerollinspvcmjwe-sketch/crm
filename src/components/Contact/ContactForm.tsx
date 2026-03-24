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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        console.error(t('contactForm.loadCustomFieldsFailed'), error);
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
      message.success(isEdit ? t('contactForm.updateSuccess') : t('contactForm.createSuccess'));
    } catch (error) {
      message.error(isEdit ? t('contactForm.updateFailed') : t('contactForm.createFailed'));
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
      <Divider orientation="left" orientationMargin="0">{t('contactForm.basicInfo')}</Divider>
      
      <Form.Item
        name="name"
        label={t('contactForm.name')}
        rules={[{ required: true, message: t('contactForm.nameRequired') }]}
      >
        <Input placeholder={t('contactForm.namePlaceholder')} />
      </Form.Item>

      <Form.Item name="gender" label={t('contactForm.gender')}>
        <Radio.Group options={genderOptions} />
      </Form.Item>

      <Form.Item name="position" label={t('contactForm.position')}>
        <Input placeholder={t('contactForm.positionPlaceholder')} />
      </Form.Item>

      <Form.Item name="department" label={t('contactForm.department')}>
        <Input placeholder={t('contactForm.departmentPlaceholder')} />
      </Form.Item>

      <Form.Item name="education" label={t('contactForm.education')}>
        <Select placeholder={t('contactForm.educationPlaceholder')} options={educationOptions} />
      </Form.Item>

      <Form.Item name="mobile" label={t('contactForm.mobile')}>
        <Input placeholder={t('contactForm.mobilePlaceholder')} />
      </Form.Item>

      <Form.Item name="officePhone" label={t('contactForm.officePhone')}>
        <Input placeholder={t('contactForm.officePhonePlaceholder')} />
      </Form.Item>

      <Form.Item name="email" label={t('contactForm.email')}>
        <Input placeholder={t('contactForm.emailPlaceholder')} />
      </Form.Item>

      <Form.Item name="wechat" label={t('contactForm.wechat')}>
        <Input placeholder={t('contactForm.wechatPlaceholder')} />
      </Form.Item>

      <Form.Item name="address" label={t('contactForm.address')}>
        <TextArea rows={2} placeholder={t('contactForm.addressPlaceholder')} />
      </Form.Item>

      <Form.Item name="birthday" label={t('contactForm.birthday')}>
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item name="school" label={t('contactForm.school')}>
        <Input placeholder={t('contactForm.schoolPlaceholder')} />
      </Form.Item>

      <Form.Item name="major" label={t('contactForm.major')}>
        <Input placeholder={t('contactForm.majorPlaceholder')} />
      </Form.Item>

      {/* 自定义字段 */}
      {customFields.length > 0 && (
        <>
          <Divider orientation="left" orientationMargin="0">{t('contactForm.customFields')}</Divider>
          <DynamicCustomFields
            module="contact"
            fields={customFields}
            values={form.getFieldValue('customFields')}
            onChange={handleCustomFieldChange}
          />
        </>
      )}

      {/* 备注 */}
      <Divider orientation="left" orientationMargin="0">{t('contactForm.remark')}</Divider>
      
      <Form.Item name="remark" label={t('contactForm.remark')}>
        <TextArea rows={3} placeholder={t('contactForm.remarkPlaceholder')} />
      </Form.Item>
    </Form>
  );
};

export default ContactForm;