/**
 * 角色表单组件
 * 用于创建和编辑角色
 */
import React, { useEffect } from 'react';
import { Form, Input, Select, Radio, Space, Button, Divider } from 'antd';
import { DataScope } from '../../types/permission';

const { TextArea } = Input;

interface RoleFormProps {
  initialValues?: {
    id?: string;
    name: string;
    code: string;
    description?: string;
    dataScope: DataScope;
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const dataScopeOptions = [
  { label: '全部数据', value: DataScope.ALL },
  { label: '部门数据', value: DataScope.DEPARTMENT },
  { label: '团队数据', value: DataScope.TEAM },
  { label: '个人数据', value: DataScope.SELF },
];

/**
 * 角色表单组件
 */
export const RoleForm: React.FC<RoleFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        dataScope: DataScope.SELF,
        ...initialValues,
      }}
    >
      <Form.Item
        name="name"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input placeholder="例如：销售经理" disabled={isEdit && initialValues?.id === 'ROLE001'} />
      </Form.Item>

      <Form.Item
        name="code"
        label="角色代码"
        rules={[
          { required: true, message: '请输入角色代码' },
          { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线' },
        ]}
      >
        <Input placeholder="例如：sales_manager" disabled={isEdit} />
      </Form.Item>

      <Form.Item name="description" label="角色描述">
        <TextArea rows={3} placeholder="描述角色的职责和权限范围" />
      </Form.Item>

      <Divider orientation="left">数据权限</Divider>

      <Form.Item
        name="dataScope"
        label="数据范围"
        rules={[{ required: true, message: '请选择数据范围' }]}
      >
        <Radio.Group options={dataScopeOptions} />
      </Form.Item>

      <Form.Item
        name="dataScope"
        label="数据范围说明"
        tooltip="不同数据范围决定用户能看到的数据"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio value={DataScope.ALL}>全部数据 - 可查看所有数据</Radio>
          <Radio value={DataScope.DEPARTMENT}>部门数据 - 仅查看本部门数据</Radio>
          <Radio value={DataScope.TEAM}>团队数据 - 仅查看本团队数据</Radio>
          <Radio value={DataScope.SELF}>个人数据 - 仅查看自己创建的数据</Radio>
        </Space>
      </Form.Item>

      <Divider />

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? '保存' : '创建'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
