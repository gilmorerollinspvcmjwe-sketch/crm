/**
 * 价格表表单组件
 * 用于创建和编辑价格表
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Switch, Divider, Button, Space, message, InputNumber, Card, Spin } from 'antd';
import { Pricebook, PricebookType, PricebookStatus } from '../../types/pricebook';
import { getPricebookById, createPricebook, updatePricebook } from '../../services/pricebookService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface PricebookFormProps {
  initialValues?: Partial<Pricebook>;
  onSubmit?: (values: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
  /** 是否作为独立页面使用 */
  standalone?: boolean;
}

/**
 * 价格表表单组件
 */
export const PricebookForm: React.FC<PricebookFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  standalone = false,
}) => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [pricebookType, setPricebookType] = useState<PricebookType | undefined>(
    initialValues?.type
  );
  const [isCustomerPricebook, setIsCustomerPricebook] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // 独立页面模式下，自动加载数据
  useEffect(() => {
    if (standalone && params.id && !initialValues) {
      const loadPricebook = async () => {
        setInitialLoading(true);
        try {
          const data = await getPricebookById(params.id);
          if (data) {
            form.setFieldsValue({
              ...data,
              validFrom: data.validFrom ? dayjs(data.validFrom) : undefined,
              validTo: data.validTo ? dayjs(data.validTo) : undefined,
              status: data.status ?? PricebookStatus.DRAFT,
            });
            setPricebookType(data.type);
            setIsCustomerPricebook(data.type === PricebookType.CUSTOMER);
          }
        } catch (error) {
          message.error('加载价格表数据失败');
        } finally {
          setInitialLoading(false);
        }
      };
      loadPricebook();
    } else if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        validFrom: initialValues.validFrom ? dayjs(initialValues.validFrom) : undefined,
        validTo: initialValues.validTo ? dayjs(initialValues.validTo) : undefined,
        status: initialValues.status ?? PricebookStatus.DRAFT,
      });
      setPricebookType(initialValues.type);
      setIsCustomerPricebook(initialValues.type === PricebookType.CUSTOMER);
    }
  }, [initialValues, form, standalone, params.id]);

  const handleTypeChange = (value: PricebookType) => {
    setPricebookType(value);
    setIsCustomerPricebook(value === PricebookType.CUSTOMER);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitValues = {
        ...values,
        validFrom: values.validFrom ? values.validFrom.format('YYYY-MM-DD') : undefined,
        validTo: values.validTo ? values.validTo.format('YYYY-MM-DD') : undefined,
      };
      
      if (onSubmit) {
        await onSubmit(submitValues);
      } else if (standalone) {
        // 独立页面模式下自己处理提交
        setInternalLoading(true);
        try {
          if (isEdit && params.id) {
            await updatePricebook(params.id, submitValues);
            message.success('价格表更新成功');
          } else {
            await createPricebook(submitValues);
            message.success('价格表创建成功');
          }
          navigate('/pricebooks/list');
        } catch (error) {
          message.error(isEdit ? '更新价格表失败' : '创建价格表失败');
        } finally {
          setInternalLoading(false);
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (standalone) {
      navigate('/pricebooks/list');
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: PricebookStatus.DRAFT,
          currency: 'CNY',
          ...initialValues,
        }}
      >
        <Divider orientation="left" orientationMargin="0">基本信息</Divider>

        <Form.Item
          name="name"
          label="价格表名称"
          rules={[{ required: true, message: '请输入价格表名称' }]}
        >
          <Input placeholder="例如：2026 年标准价格表" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="type"
          label="价格表类型"
          rules={[{ required: true, message: '请选择价格表类型' }]}
        >
          <Select 
            placeholder="请选择价格表类型" 
            onChange={handleTypeChange}
            disabled={isEdit}
          >
            <Option value={PricebookType.STANDARD}>标准价格表</Option>
            <Option value={PricebookType.CUSTOMER}>客户专属价格表</Option>
            <Option value={PricebookType.PARTNER}>合作伙伴价格表</Option>
            <Option value={PricebookType.PROMOTION}>促销价格表</Option>
          </Select>
        </Form.Item>

        {isCustomerPricebook && (
          <Form.Item
            name="customerId"
            label="关联客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户" showSearch allowClear>
              <Option value="CUST001">北京科技创新有限公司</Option>
              <Option value="CUST002">上海智能制造有限公司</Option>
              <Option value="CUST003">广州金融服务有限公司</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name="description" label="价格表描述">
          <TextArea rows={3} placeholder="请输入价格表描述" />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">有效期</Divider>

        <Form.Item
          name="validFrom"
          label="生效日期"
          rules={[{ required: true, message: '请选择生效日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="请选择生效日期" disabled={isEdit} />
        </Form.Item>

        <Form.Item name="validTo" label="失效日期">
          <DatePicker style={{ width: '100%' }} placeholder="请选择失效日期（留空表示长期有效）" />
        </Form.Item>

        <Form.Item
          name="currency"
          label="币种"
          rules={[{ required: true, message: '请选择币种' }]}
        >
          <Select placeholder="请选择币种" disabled>
            <Option value="CNY">人民币 (CNY)</Option>
            <Option value="USD">美元 (USD)</Option>
            <Option value="EUR">欧元 (EUR)</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">状态设置</Divider>

        <Form.Item
          name="status"
          label="价格表状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Option value={PricebookStatus.DRAFT}>草稿</Option>
            <Option value={PricebookStatus.ACTIVE}>启用</Option>
            <Option value={PricebookStatus.INACTIVE}>停用</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="isSystem"
          label="系统价格表"
          valuePropName="checked"
          tooltip="系统价格表不可删除"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" disabled={isEdit} />
        </Form.Item>
      </Form>

      <Divider />

      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading || internalLoading}>
          {isEdit ? '保存' : '创建'}
        </Button>
      </Space>
    </>
  );
};

export default PricebookForm;
