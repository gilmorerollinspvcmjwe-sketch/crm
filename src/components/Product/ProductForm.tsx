/**
 * 产品表单组件
 * 用于创建和编辑产品
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, InputNumber, Switch, Divider, Button, Space, message, Spin, Card } from 'antd';
import { Product, ProductCategory } from '../../types/cpq';
import { getProductById, createProduct, updateProduct } from '../../services/productService';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit?: (values: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
  /** 是否作为独立页面使用 */
  standalone?: boolean;
}

/**
 * 产品表单组件
 */
export const ProductForm: React.FC<ProductFormProps> = ({
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
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false);

  // 独立页面模式下，自动加载数据
  React.useEffect(() => {
    if (standalone && params.id && !initialValues) {
      const loadProduct = async () => {
        setInitialLoading(true);
        try {
          const data = await getProductById(params.id);
          if (data) {
            form.setFieldsValue({
              ...data,
              status: data.status ?? 'active',
            });
          }
        } catch (error) {
          message.error('加载产品数据失败');
        } finally {
          setInitialLoading(false);
        }
      };
      loadProduct();
    } else if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status ?? 'active',
      });
    }
  }, [initialValues, form, standalone, params.id]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (onSubmit) {
        await onSubmit(values);
      } else if (standalone) {
        // 独立页面模式下自己处理提交
        setInternalLoading(true);
        try {
          if (isEdit && params.id) {
            await updateProduct(params.id, values);
            message.success('产品更新成功');
          } else {
            await createProduct(values);
            message.success('产品创建成功');
          }
          navigate('/products/list');
        } catch (error) {
          message.error(isEdit ? '更新产品失败' : '创建产品失败');
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
      navigate('/products/list');
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'active',
          inStock: true,
          ...initialValues,
        }}
      >
        <Divider orientation="left" orientationMargin="0">基本信息</Divider>

        <Form.Item
          name="name"
          label="产品名称"
          rules={[{ required: true, message: '请输入产品名称' }]}
        >
          <Input placeholder="请输入产品名称" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="sku"
          label="产品编码"
          rules={[
            { required: true, message: '请输入产品编码' },
            { pattern: /^[A-Z0-9-]+$/, message: '只能包含大写字母、数字和短横线' },
          ]}
        >
          <Input placeholder="例如：CRM-ENT-001" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="category"
          label="产品分类"
          rules={[{ required: true, message: '请选择产品分类' }]}
        >
          <Select placeholder="请选择产品分类" disabled={isEdit}>
            <Option value={ProductCategory.SOFTWARE}>软件</Option>
            <Option value={ProductCategory.HARDWARE}>硬件</Option>
            <Option value={ProductCategory.SERVICE}>服务</Option>
            <Option value={ProductCategory.TRAINING}>培训</Option>
            <Option value={ProductCategory.MAINTENANCE}>维护</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="产品描述">
          <TextArea rows={3} placeholder="请输入产品描述" />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">规格参数</Divider>

        <Form.Item name="specification" label="规格">
          <Input placeholder="例如：企业版/专业版/标准版" />
        </Form.Item>

        <Form.Item name="model" label="型号">
          <Input placeholder="例如：V2026.1" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="单位"
          rules={[{ required: true, message: '请选择单位' }]}
        >
          <Select placeholder="请选择单位">
            <Option value="套">套</Option>
            <Option value="台">台</Option>
            <Option value="个">个</Option>
            <Option value="项目">项目</Option>
            <Option value="人天">人天</Option>
            <Option value="场">场</Option>
            <Option value="账号">账号</Option>
            <Option value="人次">人次</Option>
            <Option value="年">年</Option>
            <Option value="次">次</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">价格信息</Divider>

        <Form.Item
          name="unitPrice"
          label="标准价格"
          rules={[{ required: true, message: '请输入标准价格' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入标准价格"
            min={0}
            precision={2}
            prefix="¥"
          />
        </Form.Item>

        <Form.Item name="costPrice" label="成本价">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入成本价"
            min={0}
            precision={2}
            prefix="¥"
          />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">库存信息</Divider>

        <Form.Item name="stockQuantity" label="库存数量">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入库存数量"
            min={0}
          />
        </Form.Item>

        <Form.Item name="stockWarning" label="库存预警阈值">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="库存低于此值时发出预警"
            min={0}
          />
        </Form.Item>

        <Form.Item name="inStock" label="库存状态" valuePropName="checked">
          <Switch checkedChildren="有货" unCheckedChildren="缺货" />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">销售状态</Divider>

        <Form.Item
          name="status"
          label="上架状态"
          valuePropName="checked"
          rules={[{ required: true }]}
        >
          <Switch checkedChildren="上架" unCheckedChildren="下架" />
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

export default ProductForm;
