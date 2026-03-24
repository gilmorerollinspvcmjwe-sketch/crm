/**
 * 产品表单组件
 * 用于创建和编辑产品
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, InputNumber, Switch, Divider, Button, Space, message, Spin, Card } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          message.error(t('product.form.loadFailed'));
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
            message.success(t('product.form.updateSuccess'));
          } else {
            await createProduct(values);
            message.success(t('product.form.createSuccess'));
          }
          navigate('/products/list');
        } catch (error) {
          message.error(isEdit ? t('product.form.updateFailed') : t('product.form.createFailed'));
        } finally {
          setInternalLoading(false);
        }
      }
    } catch (error) {
      console.error(t('product.form.validationFailed'), error);
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
        <Divider orientation="left" orientationMargin="0">{t('product.form.basicInfo')}</Divider>

        <Form.Item
          name="name"
          label={t('product.form.name')}
          rules={[{ required: true, message: t('product.form.nameRequired') }]}
        >
          <Input placeholder={t('product.form.namePlaceholder')} disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="sku"
          label={t('product.form.sku')}
          rules={[
            { required: true, message: t('product.form.skuRequired') },
            { pattern: /^[A-Z0-9-]+$/, message: t('product.form.skuPatternError') },
          ]}
        >
          <Input placeholder={t('product.form.skuPlaceholder')} disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="category"
          label={t('product.form.category')}
          rules={[{ required: true, message: t('product.form.categoryRequired') }]}
        >
          <Select placeholder={t('product.form.categoryPlaceholder')} disabled={isEdit}>
            <Option value={ProductCategory.SOFTWARE}>{t('product.category.software')}</Option>
            <Option value={ProductCategory.HARDWARE}>{t('product.category.hardware')}</Option>
            <Option value={ProductCategory.SERVICE}>{t('product.category.service')}</Option>
            <Option value={ProductCategory.TRAINING}>{t('product.category.training')}</Option>
            <Option value={ProductCategory.MAINTENANCE}>{t('product.category.maintenance')}</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label={t('product.form.description')}>
          <TextArea rows={3} placeholder={t('product.form.descriptionPlaceholder')} />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">{t('product.form.specs')}</Divider>

        <Form.Item name="specification" label={t('product.form.specification')}>
          <Input placeholder={t('product.form.specificationPlaceholder')} />
        </Form.Item>

        <Form.Item name="model" label={t('product.form.model')}>
          <Input placeholder={t('product.form.modelPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="unit"
          label={t('product.form.unit')}
          rules={[{ required: true, message: t('product.form.unitRequired') }]}
        >
          <Select placeholder={t('product.form.unitPlaceholder')}>
            <Option value="套">{t('product.unit.set')}</Option>
            <Option value="台">{t('product.unit.device')}</Option>
            <Option value="个">{t('product.unit.piece')}</Option>
            <Option value="项目">{t('product.unit.project')}</Option>
            <Option value="人天">{t('product.unit.manDay')}</Option>
            <Option value="场">{t('product.unit.session')}</Option>
            <Option value="账号">{t('product.unit.account')}</Option>
            <Option value="人次">{t('product.unit.personTime')}</Option>
            <Option value="年">{t('product.unit.year')}</Option>
            <Option value="次">{t('product.unit.time')}</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">{t('product.form.priceInfo')}</Divider>

        <Form.Item
          name="unitPrice"
          label={t('product.form.unitPrice')}
          rules={[{ required: true, message: t('product.form.unitPriceRequired') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('product.form.unitPricePlaceholder')}
            min={0}
            precision={2}
            prefix="¥"
          />
        </Form.Item>

        <Form.Item name="costPrice" label={t('product.form.costPrice')}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('product.form.costPricePlaceholder')}
            min={0}
            precision={2}
            prefix="¥"
          />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">{t('product.form.stockInfo')}</Divider>

        <Form.Item name="stockQuantity" label={t('product.form.stockQuantity')}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('product.form.stockQuantityPlaceholder')}
            min={0}
          />
        </Form.Item>

        <Form.Item name="stockWarning" label={t('product.form.stockWarning')}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('product.form.stockWarningPlaceholder')}
            min={0}
          />
        </Form.Item>

        <Form.Item name="inStock" label={t('product.form.stockStatus')} valuePropName="checked">
          <Switch checkedChildren={t('product.stock.inStock')} unCheckedChildren={t('product.stock.outOfStock')} />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">{t('product.form.salesStatus')}</Divider>

        <Form.Item
          name="status"
          label={t('product.form.listingStatus')}
          valuePropName="checked"
          rules={[{ required: true }]}
        >
          <Switch checkedChildren={t('product.status.onShelf')} unCheckedChildren={t('product.status.offShelf')} />
        </Form.Item>
      </Form>

      <Divider />

      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleCancel}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading || internalLoading}>
          {isEdit ? t('common.save') : t('common.create')}
        </Button>
      </Space>
    </>
  );
};

export default ProductForm;