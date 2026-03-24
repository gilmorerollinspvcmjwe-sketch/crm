import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Button,
  Space,
  Divider,
  Card,
  Row,
  Col,
  message,
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CustomField, FieldType, ModuleType, FieldValidation } from '../../types/customField';

const { TextArea } = Input;

interface CustomFieldFormProps {
  initialValues?: Partial<CustomField>;
  onSave: (values: any) => Promise<void>;
  onCancel: () => void;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fieldType, setFieldType] = useState<FieldType>(
    initialValues?.type || FieldType.TEXT
  );
  const [options, setOptions] = useState<string[]>(
    initialValues?.options || []
  );

  /**
   * 模块选项
   */
  const MODULE_OPTIONS = [
    { label: t('customField.modules.customer'), value: ModuleType.CUSTOMER },
    { label: t('customField.modules.contact'), value: ModuleType.CONTACT },
    { label: t('customField.modules.lead'), value: ModuleType.LEAD },
    { label: t('customField.modules.opportunity'), value: ModuleType.OPPORTUNITY },
    { label: t('customField.modules.contract'), value: ModuleType.CONTRACT },
    { label: t('customField.modules.product'), value: ModuleType.PRODUCT },
    { label: t('customField.modules.quote'), value: ModuleType.QUOTE },
    { label: t('customField.modules.ticket'), value: ModuleType.TICKET },
    { label: t('customField.modules.campaign'), value: ModuleType.CAMPAIGN },
  ];

  /**
   * 字段类型选项
   */
  const FIELD_TYPE_OPTIONS = [
    { label: t('customField.types.text'), value: FieldType.TEXT },
    { label: t('customField.types.textarea'), value: FieldType.TEXTAREA },
    { label: t('customField.types.number'), value: FieldType.NUMBER },
    { label: t('customField.types.date'), value: FieldType.DATE },
    { label: t('customField.types.datetime'), value: FieldType.DATETIME },
    { label: t('customField.types.select'), value: FieldType.SELECT },
    { label: t('customField.types.multiselect'), value: FieldType.MULTISELECT },
    { label: t('customField.types.switch'), value: FieldType.SWITCH },
    { label: t('customField.types.user'), value: FieldType.USER },
    { label: t('customField.types.department'), value: FieldType.DEPARTMENT },
    { label: t('customField.types.relation'), value: FieldType.RELATION },
    { label: t('customField.types.file'), value: FieldType.FILE },
  ];

  // 字段类型变化时重置选项
  useEffect(() => {
    if (fieldType !== FieldType.SELECT && fieldType !== FieldType.MULTISELECT) {
      form.setFieldsValue({ options: undefined });
      setOptions([]);
    }
  }, [fieldType, form]);

  // 添加选项
  const handleAddOption = () => {
    const newOption = t('customField.form.enterOption', { index: options.length + 1 });
    setOptions([...options, newOption]);
    form.setFieldsValue({
      options: [...options, newOption],
    });
  };

  // 删除选项
  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    form.setFieldsValue({ options: newOptions });
  };

  // 更新选项值
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    form.setFieldsValue({ options: newOptions });
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      // 构建验证规则
      const validation: FieldValidation = {};
      if (values.unique) validation.unique = true;
      if (values.minLength !== undefined) validation.minLength = values.minLength;
      if (values.maxLength !== undefined) validation.maxLength = values.maxLength;
      if (values.min !== undefined) validation.min = values.min;
      if (values.max !== undefined) validation.max = values.max;
      if (values.pattern) validation.pattern = values.pattern;
      if (values.errorMessage) validation.errorMessage = values.errorMessage;

      // 过滤空验证规则
      const hasValidation = Object.keys(validation).length > 0;

      const submitData = {
        ...values,
        validation: hasValidation ? validation : undefined,
        options: (fieldType === FieldType.SELECT || fieldType === FieldType.MULTISELECT) 
          ? values.options 
          : undefined,
        listVisible: values.listVisible || false,
        detailVisible: values.detailVisible || false,
        enabled: values.enabled !== undefined ? values.enabled : true,
        sortOrder: values.sortOrder || 0,
      };

      await onSave(submitData);
    } catch (error) {
      message.error(t('common.saveFailed'));
    }
  };

  // 显示选项配置
  const showOptionsConfig = 
    fieldType === FieldType.SELECT || fieldType === FieldType.MULTISELECT;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      {/* 基本信息 */}
      <Card 
        title={t('customField.form.basicInfo')} 
        size="small" 
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="modules"
          label={t('customField.form.bindModule')}
          rules={[{ required: true, message: t('customField.form.selectModule') }]}
        >
          <Select
            mode="multiple"
            placeholder={t('customField.form.selectModule')}
            options={MODULE_OPTIONS}
            maxTagCount="responsive"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t('customField.form.fieldName')}
              rules={[
                { required: true, message: t('customField.form.fieldName') },
                { 
                  pattern: /^[a-z_][a-z0-9_]*$/,
                  message: t('customField.form.fieldNamePatternError')
                },
              ]}
              extra={t('customField.form.fieldNameExtra')}
            >
              <Input placeholder={t('customField.form.enterFieldName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="label"
              label={t('customField.form.displayLabel')}
              rules={[{ required: true, message: t('customField.form.displayLabel') }]}
              extra={t('customField.form.displayLabelExtra')}
            >
              <Input placeholder={t('customField.form.enterDisplayLabel')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label={t('customField.form.fieldType')}
              rules={[{ required: true, message: t('customField.form.selectFieldType') }]}
            >
              <Select
                placeholder={t('customField.form.selectFieldType')}
                options={FIELD_TYPE_OPTIONS}
                onChange={(value) => setFieldType(value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sortOrder"
              label={t('customField.form.sortOrder')}
              initialValue={0}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder={t('customField.form.sortOrderPlaceholder')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="placeholder"
          label={t('customField.form.placeholder')}
        >
          <Input placeholder={t('customField.form.placeholderExtra')} />
        </Form.Item>

        <Form.Item
          name="defaultValue"
          label={t('customField.form.defaultValue')}
        >
          <Input placeholder={t('customField.form.defaultValueExtra')} />
        </Form.Item>
      </Card>

      {/* 选项配置 */}
      {showOptionsConfig && (
        <Card 
          title={t('customField.form.optionsConfig')} 
          size="small" 
          style={{ marginBottom: '16px' }}
        >
          <Form.Item
            name="options"
            label={t('customField.form.optionsList')}
            rules={[
              { 
                required: true,
                message: t('customField.form.atLeastOneOption'),
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject();
                  }
                  return Promise.resolve();
                }
              },
            ]}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {options.map((option, index) => (
                <Space key={index} style={{ width: '100%' }}>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={t('customField.form.enterOption', { index: index + 1 })}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<MinusOutlined />}
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 1}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddOption}
                block
              >
                {t('customField.form.addOption')}
              </Button>
            </div>
          </Form.Item>
        </Card>
      )}

      {/* 验证规则 */}
      <Card 
        title={t('customField.form.validationRules')} 
        size="small" 
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="required"
          label={t('customField.form.required')}
          valuePropName="checked"
        >
          <Checkbox>{t('customField.form.requiredExtra')}</Checkbox>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unique"
              label={t('customField.form.unique')}
              valuePropName="checked"
            >
              <Checkbox>{t('customField.form.uniqueExtra')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="minLength"
              label={t('customField.form.minLength')}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maxLength"
              label={t('customField.form.maxLength')}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="pattern"
              label={t('customField.form.regexPattern')}
            >
              <Input placeholder="^[0-9]+$" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="min"
              label={t('customField.form.minValue')}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="max"
              label={t('customField.form.maxValue')}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="errorMessage"
          label={t('customField.form.customErrorMsg')}
        >
          <TextArea 
            rows={2} 
            placeholder={t('customField.form.errorMsgPlaceholder')}
          />
        </Form.Item>
      </Card>

      {/* 显示设置 */}
      <Card 
        title={t('customField.form.displaySettings')} 
        size="small" 
        style={{ marginBottom: '16px' }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="listVisible"
              label={t('customField.form.listVisible')}
              valuePropName="checked"
            >
              <Checkbox>{t('customField.form.listVisibleExtra')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="detailVisible"
              label={t('customField.form.detailVisible')}
              valuePropName="checked"
            >
              <Checkbox>{t('customField.form.detailVisibleExtra')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="enabled"
              label={t('customField.form.enabled')}
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>{t('customField.form.enabledExtra')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 提交按钮 */}
      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>
            {t('customField.form.cancel')}
          </Button>
          <Button type="primary" htmlType="submit">
            {t('customField.form.save')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CustomFieldForm;