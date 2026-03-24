/**
 * 价格表条目表单组件
 * 用于添加/编辑价格表中的产品条目，支持阶梯定价
 */
import React, { useEffect, useState } from 'react';
import { Form, Select, InputNumber, Button, Space, Divider, Table, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PricebookItem, PriceTier } from '../../types/pricebook';
import { Product } from '../../types/cpq';

const { Option } = Select;

interface PricebookEntryFormProps {
  products?: Product[];
  initialValues?: Partial<PricebookItem>;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

/**
 * 价格表条目表单组件
 */
export const PricebookEntryForm: React.FC<PricebookEntryFormProps> = ({
  products = [],
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(
    initialValues?.productId
  );
  const [tiers, setTiers] = useState<PriceTier[]>(
    initialValues?.tiers || [{ minQuantity: 1, unitPrice: initialValues?.basePrice || 0 }]
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        productId: initialValues.productId,
        basePrice: initialValues.basePrice,
        currency: initialValues.currency || 'CNY',
        effectiveDate: initialValues.effectiveDate,
        expirationDate: initialValues.expirationDate,
      });
      if (initialValues.tiers && initialValues.tiers.length > 0) {
        setTiers(initialValues.tiers);
      }
      setSelectedProductId(initialValues.productId);
    }
  }, [initialValues, form]);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setFieldsValue({
        basePrice: product.unitPrice,
      });
      setTiers([{ minQuantity: 1, unitPrice: product.unitPrice }]);
    }
  };

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinQuantity = lastTier ? (lastTier.maxQuantity || lastTier.minQuantity) + 1 : 1;
    setTiers([
      ...tiers,
      { minQuantity: newMinQuantity, unitPrice: lastTier?.unitPrice || 0 },
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) {
      message.warning(t('pricebookEntry.tier.minRequired'));
      return;
    }
    const newTiers = tiers.filter((_, i) => i !== index);
    // 重新计算 maxQuantity
    newTiers.forEach((tier, i) => {
      if (i < newTiers.length - 1) {
        tier.maxQuantity = newTiers[i + 1].minQuantity - 1;
      } else {
        delete tier.maxQuantity;
      }
    });
    setTiers(newTiers);
  };

  const handleTierChange = (index: number, field: keyof PriceTier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    
    // 更新前一个阶梯的 maxQuantity
    if (field === 'minQuantity' && index > 0) {
      newTiers[index - 1].maxQuantity = (value as number) - 1;
    }
    
    // 更新后一个阶梯的 maxQuantity（如果不是最后一个）
    if (index < newTiers.length - 1) {
      newTiers[index].maxQuantity = newTiers[index + 1].minQuantity - 1;
    } else {
      delete newTiers[index].maxQuantity;
    }
    
    setTiers(newTiers);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        tiers,
      });
    } catch (error) {
      console.error(t('pricebookEntry.validation.failed'), error);
    }
  };

  const tierColumns = [
    {
      title: t('pricebookEntry.tier.minQuantity'),
      dataIndex: 'minQuantity',
      key: 'minQuantity',
      width: 120,
      render: (_: any, record: PriceTier, index: number) => (
        <InputNumber
          value={record.minQuantity}
          onChange={(value) => handleTierChange(index, 'minQuantity', value)}
          min={1}
          style={{ width: '100%' }}
          disabled={index === 0}
        />
      ),
    },
    {
      title: t('pricebookEntry.tier.maxQuantity'),
      dataIndex: 'maxQuantity',
      key: 'maxQuantity',
      width: 120,
      render: (_: any, record: PriceTier) => record.maxQuantity || t('pricebookEntry.tier.unlimited'),
    },
    {
      title: t('pricebookEntry.tier.unitPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
      render: (_: any, record: PriceTier, index: number) => (
        <InputNumber
          value={record.unitPrice}
          onChange={(value) => handleTierChange(index, 'unitPrice', value)}
          min={0}
          precision={2}
          prefix="¥"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: t('pricebookEntry.tier.discountRate'),
      key: 'discount',
      width: 100,
      render: (_: any, record: PriceTier) => {
        const basePrice = tiers[0]?.unitPrice || 0;
        const discount = basePrice > 0 ? ((basePrice - record.unitPrice) / basePrice * 100).toFixed(1) : 0;
        return `${discount}%`;
      },
    },
    {
      title: t('pricebookEntry.tier.action'),
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Popconfirm
          title={t('pricebookEntry.tier.deleteConfirm')}
          onConfirm={() => handleRemoveTier(index)}
          okText={t('common.confirm')}
          cancelText={t('common.cancel')}
          disabled={tiers.length <= 1}
        >
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            disabled={tiers.length <= 1}
          >
            {t('pricebookEntry.tier.delete')}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          currency: 'CNY',
          ...initialValues,
        }}
      >
        <Divider orientation="left" orientationMargin="0">{t('pricebookEntry.productInfo')}</Divider>

        <Form.Item
          name="productId"
          label={t('pricebookEntry.selectProduct')}
          rules={[{ required: true, message: t('pricebookEntry.selectProductRequired') }]}
        >
          <Select
            placeholder={t('pricebookEntry.selectProductPlaceholder')}
            onChange={handleProductChange}
            disabled={isEdit}
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {products.map(product => (
              <Option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedProductId && (
          <>
            <Form.Item
              name="basePrice"
              label={t('pricebookEntry.basePrice')}
              rules={[{ required: true, message: t('pricebookEntry.basePriceRequired') }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                prefix="¥"
              />
            </Form.Item>

            <Form.Item
              name="currency"
              label={t('pricebookEntry.currency')}
              rules={[{ required: true, message: t('pricebookEntry.currencyRequired') }]}
            >
              <Select disabled>
                <Option value="CNY">{t('pricebookEntry.currencyCNY')}</Option>
                <Option value="USD">{t('pricebookEntry.currencyUSD')}</Option>
                <Option value="EUR">{t('pricebookEntry.currencyEUR')}</Option>
              </Select>
            </Form.Item>

            <Divider orientation="left" orientationMargin="0">{t('pricebookEntry.tieredPricing')}</Divider>

            <div style={{ marginBottom: 16 }}>
              <Space style={{ marginBottom: 8 }}>
                <span style={{ color: '#666', fontSize: 14 }}>
                  {t('pricebookEntry.tierDescription')}
                </span>
                <Button type="dashed" onClick={handleAddTier} icon={<PlusOutlined />}>
                  {t('pricebookEntry.addTier')}
                </Button>
              </Space>
              <Table
                columns={tierColumns}
                dataSource={tiers.map((tier, index) => ({ ...tier, key: index }))}
                pagination={false}
                size="small"
                bordered
              />
            </div>

            <Divider orientation="left" orientationMargin="0">{t('pricebookEntry.validPeriod')}</Divider>

            <Form.Item name="effectiveDate" label={t('pricebookEntry.effectiveDate')}>
              <Input type="date" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="expirationDate" label={t('pricebookEntry.expirationDate')}>
              <Input type="date" style={{ width: '100%' }} placeholder={t('pricebookEntry.expirationDatePlaceholder')} />
            </Form.Item>
          </>
        )}
      </Form>

      <Divider />

      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading} disabled={!selectedProductId}>
          {isEdit ? t('common.save') : t('pricebookEntry.add')}
        </Button>
      </Space>
    </>
  );
};

export default PricebookEntryForm;