/**
 * 报价计算器组件
 * 用于计算和展示报价单的价格明细
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, InputNumber, Button, Space, Popconfirm, message, Tag } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { QuoteProduct, Product } from '../../types/cpq';

interface QuoteCalculatorProps {
  products: QuoteProduct[];
  onChange: (products: QuoteProduct[]) => void;
  readonly?: boolean;
}

/**
 * 报价计算器组件
 */
export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  products,
  onChange,
  readonly = false,
}) => {
  const [quoteProducts, setQuoteProducts] = useState<QuoteProduct[]>(products);

  /** 同步外部产品变化 */
  useEffect(() => {
    setQuoteProducts(products);
  }, [products]);

  /** 计算产品明细 */
  const calculateProduct = (product: QuoteProduct): QuoteProduct => {
    const subtotal = product.unitPrice * product.quantity;
    const discountAmount = subtotal * (product.discount / 100);
    const tax = (subtotal - discountAmount) * 0.13; // 13% 增值税
    const total = subtotal - discountAmount + tax;

    return {
      ...product,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      total: Math.round(total),
    };
  };

  /** 更新产品数量 */
  const handleQuantityChange = (id: string, quantity: number) => {
    const updated = quoteProducts.map(p => {
      if (p.id === id) {
        return calculateProduct({ ...p, quantity });
      }
      return p;
    });
    setQuoteProducts(updated);
    onChange(updated);
  };

  /** 更新产品折扣 */
  const handleDiscountChange = (id: string, discount: number) => {
    const updated = quoteProducts.map(p => {
      if (p.id === id) {
        return calculateProduct({ ...p, discount });
      }
      return p;
    });
    setQuoteProducts(updated);
    onChange(updated);
  };

  /** 删除产品 */
  const handleDelete = (id: string) => {
    const updated = quoteProducts.filter(p => p.id !== id);
    setQuoteProducts(updated);
    onChange(updated);
    message.success('产品已删除');
  };

  /** 添加产品（从外部传入） */
  const addProducts = (newProducts: Product[]) => {
    const newQuoteProducts: QuoteProduct[] = newProducts.map(p => {
      const baseProduct: QuoteProduct = {
        id: `QP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        productId: p.id,
        productName: p.name,
        quantity: 1,
        unitPrice: p.unitPrice,
        discount: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
      };
      return calculateProduct(baseProduct);
    });

    const updated = [...quoteProducts, ...newQuoteProducts];
    setQuoteProducts(updated);
    onChange(updated);
    message.success(`已添加 ${newProducts.length} 个产品`);
  };

  /** 计算总计 */
  const calculateTotals = () => {
    const subtotal = quoteProducts.reduce((sum, p) => sum + p.subtotal, 0);
    const totalDiscount = quoteProducts.reduce(
      (sum, p) => sum + (p.subtotal * p.discount / 100),
      0
    );
    const totalTax = quoteProducts.reduce((sum, p) => sum + p.tax, 0);
    const grandTotal = quoteProducts.reduce((sum, p) => sum + p.total, 0);

    return {
      subtotal: Math.round(subtotal),
      totalDiscount: Math.round(totalDiscount),
      totalTax: Math.round(totalTax),
      grandTotal: Math.round(grandTotal),
    };
  };

  const totals = calculateTotals();

  /** 表格列定义 */
  const columns: ColumnsType<QuoteProduct> = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 250,
      fixed: 'left',
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (quantity: number, record: QuoteProduct) => {
        if (readonly) {
          return quantity;
        }
        return (
          <InputNumber
            min={1}
            max={9999}
            value={quantity}
            onChange={(val) => handleQuantityChange(record.id, val || 1)}
            style={{ width: '100%' }}
          />
        );
      },
    },
    {
      title: '折扣 (%)',
      dataIndex: 'discount',
      key: 'discount',
      width: 120,
      render: (discount: number, record: QuoteProduct) => {
        if (readonly) {
          return `${discount}%`;
        }
        return (
          <InputNumber
            min={0}
            max={100}
            value={discount}
            onChange={(val) => handleDiscountChange(record.id, val || 0)}
            style={{ width: '100%' }}
            formatter={(value) => `${value}%`}
            parser={(value) => Number(value?.replace('%', ''))}
          />
        );
      },
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      render: (subtotal: number) => `¥${subtotal.toLocaleString()}`,
    },
    {
      title: '税费 (13%)',
      dataIndex: 'tax',
      key: 'tax',
      width: 120,
      render: (tax: number) => `¥${tax.toLocaleString()}`,
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total: number) => (
        <strong style={{ color: '#1890ff' }}>¥{total.toLocaleString()}</strong>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_: any, record: QuoteProduct) => {
        if (readonly) {
          return null;
        }
        return (
          <Popconfirm
            title="确定要删除该产品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <Space>
          <CalculatorOutlined />
          <span>报价明细</span>
        </Space>
      }
      extra={
        !readonly && (
          <Tag color="blue">共 {quoteProducts.length} 个产品</Tag>
        )
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={quoteProducts}
        pagination={false}
        scroll={{ x: 1000 }}
        size="middle"
        footer={() => (
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            <Space size="large">
              <span>
                小计：¥{totals.subtotal.toLocaleString()}
              </span>
              <span style={{ color: '#ff4d4f' }}>
                折扣：-¥{totals.totalDiscount.toLocaleString()}
              </span>
              <span>
                税费：¥{totals.totalTax.toLocaleString()}
              </span>
              <span style={{ color: '#52c41a', fontSize: 16 }}>
                总计：¥{totals.grandTotal.toLocaleString()}
              </span>
            </Space>
          </div>
        )}
      />
    </Card>
  );
};

export default QuoteCalculator;
