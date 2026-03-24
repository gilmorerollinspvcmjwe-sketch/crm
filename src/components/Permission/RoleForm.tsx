/**
 * 角色表单组件
 * 用于创建和编辑角色
 */
import React, { useEffect } from 'react';
import { Form, Input, Select, Radio, Space, Button, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

  const dataScopeOptions = [
    { label: t('permission.settings.allData'), value: DataScope.ALL },
    { label: t('permission.settings.departmentData'), value: DataScope.DEPARTMENT },
    { label: t('permission.settings.teamData'), value: DataScope.TEAM },
    { label: t('permission.settings.selfData'), value: DataScope.SELF },
  ];

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
        label={t('permission.roleForm.roleName')}
        rules={[{ required: true, message: t('permission.roleForm.enterRoleName') }]}
      >
        <Input placeholder={t('permission.roleForm.enterRoleName')} disabled={isEdit && initialValues?.id === 'ROLE001'} />
      </Form.Item>

      <Form.Item
        name="code"
        label={t('permission.roleForm.roleCode')}
        rules={[
          { required: true, message: t('permission.roleForm.enterRoleCode') },
          { pattern: /^[a-z_]+$/, message: t('permission.roleForm.codePatternError') },
        ]}
      >
        <Input placeholder={t('permission.roleForm.enterRoleCode')} disabled={isEdit} />
      </Form.Item>

      <Form.Item name="description" label={t('permission.roleForm.roleDescription')}>
        <TextArea rows={3} placeholder={t('permission.roleForm.enterDescription')} />
      </Form.Item>

      <Divider orientation="left">{t('permission.roleForm.dataScope')}</Divider>

      <Form.Item
        name="dataScope"
        label={t('permission.roleForm.dataScopeLabel')}
        tooltip={t('permission.roleForm.dataScopeTooltip')}
      >
        <Radio.Group options={dataScopeOptions} />
      </Form.Item>

      <Form.Item
        name="dataScope"
        label={t('permission.roleForm.dataScopeLabel')}
        tooltip={t('permission.roleForm.dataScopeTooltip')}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio value={DataScope.ALL}>{t('permission.settings.allData')} - {t('permission.settings.allDataDesc')}</Radio>
          <Radio value={DataScope.DEPARTMENT}>{t('permission.settings.departmentData')} - {t('permission.settings.departmentDataDesc')}</Radio>
          <Radio value={DataScope.TEAM}>{t('permission.settings.teamData')} - {t('permission.settings.teamDataDesc')}</Radio>
          <Radio value={DataScope.SELF}>{t('permission.settings.selfData')} - {t('permission.settings.selfDataDesc')}</Radio>
        </Space>
      </Form.Item>

      <Divider />

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>{t('permission.roleForm.cancel')}</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? t('permission.roleForm.save') : t('permission.roleForm.create')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;