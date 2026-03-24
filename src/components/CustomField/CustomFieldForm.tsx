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
import { CustomField, FieldType, ModuleType, FieldValidation } from '../../types/customField';

const { TextArea } = Input;

/**
 * 模块选项
 */
const MODULE_OPTIONS = [
  { label: '客户管理', value: ModuleType.CUSTOMER },
  { label: '联系人', value: ModuleType.CONTACT },
  { label: '线索管理', value: ModuleType.LEAD },
  { label: '商机管理', value: ModuleType.OPPORTUNITY },
  { label: '合同管理', value: ModuleType.CONTRACT },
  { label: '产品库', value: ModuleType.PRODUCT },
  { label: '报价单', value: ModuleType.QUOTE },
  { label: '工单系统', value: ModuleType.TICKET },
  { label: '活动管理', value: ModuleType.CAMPAIGN },
];

/**
 * 字段类型选项
 */
const FIELD_TYPE_OPTIONS = [
  { label: '文本', value: FieldType.TEXT },
  { label: '多行文本', value: FieldType.TEXTAREA },
  { label: '数字', value: FieldType.NUMBER },
  { label: '日期', value: FieldType.DATE },
  { label: '日期时间', value: FieldType.DATETIME },
  { label: '单选', value: FieldType.SELECT },
  { label: '多选', value: FieldType.MULTISELECT },
  { label: '开关', value: FieldType.SWITCH },
  { label: '人员', value: FieldType.USER },
  { label: '部门', value: FieldType.DEPARTMENT },
  { label: '关联', value: FieldType.RELATION },
  { label: '附件', value: FieldType.FILE },
];

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
  const [form] = Form.useForm();
  const [fieldType, setFieldType] = useState<FieldType>(
    initialValues?.type || FieldType.TEXT
  );
  const [options, setOptions] = useState<string[]>(
    initialValues?.options || []
  );

  // 字段类型变化时重置选项
  useEffect(() => {
    if (fieldType !== FieldType.SELECT && fieldType !== FieldType.MULTISELECT) {
      form.setFieldsValue({ options: undefined });
      setOptions([]);
    }
  }, [fieldType, form]);

  // 添加选项
  const handleAddOption = () => {
    setOptions([...options, `选项${options.length + 1}`]);
    form.setFieldsValue({
      options: [...options, `选项${options.length + 1}`],
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
      message.error('保存失败，请检查表单数据');
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
        title="基本信息" 
        size="small" 
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="modules"
          label="绑定模块"
          rules={[{ required: true, message: '请至少选择一个模块' }]}
        >
          <Select
            mode="multiple"
            placeholder="选择绑定模块"
            options={MODULE_OPTIONS}
            maxTagCount="responsive"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="字段名称"
              rules={[
                { required: true, message: '请输入字段名称' },
                { 
                  pattern: /^[a-z_][a-z0-9_]*$/,
                  message: '只能包含小写字母、数字和下划线，且不能以数字开头'
                },
              ]}
              extra="用于 API 和数据库，如：customer_type"
            >
              <Input placeholder="customer_type" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="label"
              label="显示标签"
              rules={[{ required: true, message: '请输入显示标签' }]}
              extra="用于 UI 展示，如：客户类型"
            >
              <Input placeholder="客户类型" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="字段类型"
              rules={[{ required: true, message: '请选择字段类型' }]}
            >
              <Select
                placeholder="选择字段类型"
                options={FIELD_TYPE_OPTIONS}
                onChange={(value) => setFieldType(value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sortOrder"
              label="排序"
              initialValue={0}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="数字越小越靠前"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="placeholder"
          label="占位符"
        >
          <Input placeholder="输入框提示文字" />
        </Form.Item>

        <Form.Item
          name="defaultValue"
          label="默认值"
        >
          <Input placeholder="字段默认值" />
        </Form.Item>
      </Card>

      {/* 选项配置 */}
      {showOptionsConfig && (
        <Card 
          title="选项配置" 
          size="small" 
          style={{ marginBottom: '16px' }}
        >
          <Form.Item
            name="options"
            label="选项列表"
            rules={[
              { 
                required: true,
                message: '请至少添加一个选项',
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
                    placeholder={`选项${index + 1}`}
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
                添加选项
              </Button>
            </div>
          </Form.Item>
        </Card>
      )}

      {/* 验证规则 */}
      <Card 
        title="验证规则" 
        size="small" 
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="required"
          label="必填"
          valuePropName="checked"
        >
          <Checkbox>该字段为必填项</Checkbox>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unique"
              label="唯一性"
              valuePropName="checked"
            >
              <Checkbox>字段值必须唯一</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="minLength"
              label="最小长度"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maxLength"
              label="最大长度"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="pattern"
              label="正则表达式"
            >
              <Input placeholder="^[0-9]+$" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="min"
              label="最小值"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="max"
              label="最大值"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="errorMessage"
          label="自定义错误消息"
        >
          <TextArea 
            rows={2} 
            placeholder="验证失败时显示的提示文字"
          />
        </Form.Item>
      </Card>

      {/* 显示设置 */}
      <Card 
        title="显示设置" 
        size="small" 
        style={{ marginBottom: '16px' }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="listVisible"
              label="列表显示"
              valuePropName="checked"
            >
              <Checkbox>在列表中显示该字段</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="detailVisible"
              label="详情显示"
              valuePropName="checked"
            >
              <Checkbox>在详情页显示该字段</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="enabled"
              label="启用"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>启用该字段</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 提交按钮 */}
      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CustomFieldForm;
