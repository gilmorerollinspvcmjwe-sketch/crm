/**
 * 价格表条目表单组件
 * 用于添加/编辑价格表中的产品条目，支持阶梯定价
 */
import React, { useEffect, useState } from 'react';
import { Form, Select, InputNumber, Button, Space, Divider, Table, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
      message.warning('至少需要保留一个价格阶梯');
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
      console.error('表单验证失败:', error);
    }
  };

  const tierColumns = [
    {
      title: '最小数量',
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
      title: '最大数量',
      dataIndex: 'maxQuantity',
      key: 'maxQuantity',
      width: 120,
      render: (_: any, record: PriceTier) => record.maxQuantity || '不限',
    },
    {
      title: '单价',
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
      title: '折扣率',
      key: 'discount',
      width: 100,
      render: (_: any, record: PriceTier, index: number) => {
        const basePrice = tiers[0]?.unitPrice || 0;
        const discount = basePrice > 0 ? ((basePrice - record.unitPrice) / basePrice * 100).toFixed(1) : 0;
        return `${discount}%`;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Popconfirm
          title="确定删除此价格阶梯？"
          onConfirm={() => handleRemoveTier(index)}
          okText="确定"
          cancelText="取消"
          disabled={tiers.length <= 1}
        >
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            disabled={tiers.length <= 1}
          >
            删除
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
        <Divider orientation="left" orientationMargin="0">产品信息</Divider>

        <Form.Item
          name="productId"
          label="选择产品"
          rules={[{ required: true, message: '请选择产品' }]}
        >
          <Select
            placeholder="请选择产品"
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
              label="基准价格"
              rules={[{ required: true, message: '请输入基准价格' }]}
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
              label="币种"
              rules={[{ required: true, message: '请选择币种' }]}
            >
              <Select disabled>
                <Option value="CNY">人民币 (CNY)</Option>
                <Option value="USD">美元 (USD)</Option>
                <Option value="EUR">欧元 (EUR)</Option>
              </Select>
            </Form.Item>

            <Divider orientation="left" orientationMargin="0">阶梯定价</Divider>

            <div style={{ marginBottom: 16 }}>
              <Space style={{ marginBottom: 8 }}>
                <span style={{ color: '#666', fontSize: 14 }}>
                  设置不同数量区间的价格，数量越大折扣越多
                </span>
                <Button type="dashed" onClick={handleAddTier} icon={<PlusOutlined />}>
                  添加阶梯
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

            <Divider orientation="left" orientationMargin="0">有效期</Divider>

            <Form.Item name="effectiveDate" label="生效日期">
              <Input type="date" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="expirationDate" label="失效日期">
              <Input type="date" style={{ width: '100%' }} placeholder="留空表示长期有效" />
            </Form.Item>
          </>
        )}
      </Form>

      <Divider />

      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading} disabled={!selectedProductId}>
          {isEdit ? '保存' : '添加'}
        </Button>
      </Space>
    </>
  );
};

export default PricebookEntryForm;
