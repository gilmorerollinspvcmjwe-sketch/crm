import React from 'react';
import { 
  Input, 
  InputNumber, 
  Select, 
  DatePicker, 
  Switch, 
  Upload, 
  UploadFile,
  Row,
  Col,
  Form,
  Button,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { CustomField, FieldType } from '../../types/customField';

const { TextArea } = Input;

interface DynamicCustomFieldsProps {
  /** 模块类型 */
  module: string;
  /** 自定义字段列表 */
  fields: CustomField[];
  /** 字段值 */
  values?: Record<string, any>;
  /** 字段值变化回调 */
  onChange?: (fieldName: string, value: any) => void;
  /** 是否只读 */
  readOnly?: boolean;
  /** 表单名称前缀 */
  formPrefix?: string;
}

/**
 * 动态自定义字段组件
 * @description 根据字段定义动态渲染表单控件
 */
const DynamicCustomFields: React.FC<DynamicCustomFieldsProps> = ({
  fields,
  values = {},
  onChange,
  readOnly = false,
  formPrefix = 'customFields',
}) => {
  const { t } = useTranslation();

  // 字段值变化处理
  const handleChange = (fieldName: string, value: any) => {
    onChange?.(fieldName, value);
  };

  // 渲染不同类型的字段
  const renderField = (field: CustomField) => {
    const fieldName = `${formPrefix}.${field.name}`;
    const fieldValue = values[field.name];

    const commonProps = {
      value: fieldValue,
      onChange: (val: any) => handleChange(field.name, val),
      disabled: readOnly,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case FieldType.TEXT:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('customField.form.placeholder')}${field.label}` },
              field.validation?.minLength && { 
                min: field.validation.minLength, 
                message: `${t('customField.form.minLength')}${field.validation.minLength}` 
              },
              field.validation?.maxLength && { 
                max: field.validation.maxLength, 
                message: `${t('customField.form.maxLength')}${field.validation.maxLength}` 
              },
              field.validation?.pattern && { 
                pattern: new RegExp(field.validation.pattern), 
                message: field.validation.errorMessage || t('common.operationFailed')
              },
            ].filter(Boolean)}
          >
            <Input {...commonProps} />
          </Form.Item>
        );

      case FieldType.TEXTAREA:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('customField.form.placeholder')}${field.label}` },
              field.validation?.minLength && { 
                min: field.validation.minLength, 
                message: `${t('customField.form.minLength')}${field.validation.minLength}` 
              },
              field.validation?.maxLength && { 
                max: field.validation.maxLength, 
                message: `${t('customField.form.maxLength')}${field.validation.maxLength}` 
              },
            ].filter(Boolean)}
          >
            <TextArea {...commonProps} rows={4} />
          </Form.Item>
        );

      case FieldType.NUMBER:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('customField.form.placeholder')}${field.label}` },
              field.validation?.min !== undefined && { 
                type: 'number' as const,
                min: field.validation.min, 
                message: `${t('customField.form.minValue')}${field.validation.min}` 
              },
              field.validation?.max !== undefined && { 
                type: 'number' as const,
                max: field.validation.max, 
                message: `${t('customField.form.maxValue')}${field.validation.max}` 
              },
            ].filter(Boolean)}
          >
            <InputNumber 
              {...commonProps} 
              style={{ width: '100%' }}
              min={field.validation?.min}
              max={field.validation?.max}
              precision={2}
            />
          </Form.Item>
        );

      case FieldType.DATE:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <DatePicker
              {...commonProps}
              value={fieldValue ? dayjs(fieldValue) : undefined}
              onChange={(date) => {
                handleChange(field.name, date ? date.format('YYYY-MM-DD') : null);
              }}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.DATETIME:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <DatePicker
              {...commonProps}
              value={fieldValue ? dayjs(fieldValue) : undefined}
              onChange={(date) => {
                handleChange(field.name, date ? date.toISOString() : null);
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.SELECT:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <Select
              {...commonProps}
              placeholder={`${t('common.select')}${field.label}`}
              allowClear
              options={field.options?.map(opt => ({ label: opt, value: opt }))}
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.MULTISELECT:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <Select
              {...commonProps}
              mode="multiple"
              placeholder={`${t('common.select')}${field.label}`}
              options={field.options?.map(opt => ({ label: opt, value: opt }))}
              disabled={readOnly}
              style={{ width: '100%' }}
            />
          </Form.Item>
        );

      case FieldType.SWITCH:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            valuePropName="checked"
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <Switch 
              {...commonProps}
              checked={fieldValue}
              checkedChildren={t('common.yes')}
              unCheckedChildren={t('common.no')}
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.USER:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <Select
              {...commonProps}
              placeholder={t('customField.types.user')}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[]} // TODO: 从用户服务加载
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.DEPARTMENT:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <Select
              {...commonProps}
              placeholder={t('customField.types.department')}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[]} // TODO: 从部门服务加载
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.RELATION:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('common.select')}${field.label}` },
            ].filter(Boolean)}
          >
            <Select
              {...commonProps}
              placeholder={t('customField.types.relation')}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[]} // TODO: 从关联模块加载
              disabled={readOnly}
            />
          </Form.Item>
        );

      case FieldType.FILE:
        return (
          <Form.Item
            key={field.id}
            name={fieldName}
            label={field.label}
            rules={[
              field.required && { required: true, message: `${t('customField.form.placeholder')}${field.label}` },
            ].filter(Boolean)}
          >
            <Upload
              fileList={(fieldValue || []) as UploadFile[]}
              onChange={({ fileList }) => {
                handleChange(field.name, fileList);
              }}
              disabled={readOnly}
              multiple
            >
              <Button icon={<UploadOutlined />}>{t('customField.form.placeholder')}</Button>
            </Upload>
          </Form.Item>
        );

      default:
        return null;
    }
  };

  if (fields.length === 0) {
    return null;
  }

  return (
    <>
      {fields.map(field => renderField(field))}
    </>
  );
};

export default DynamicCustomFields;