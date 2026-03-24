/**
 * 产品选择器组件
 * 用于在创建报价单时选择产品
 */
import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Select, Space, Button, Tag, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Product, ProductCategory } from '../../types/cpq';
import { getProductList } from '../../mock/cpqData';
import { getProductPrice } from '../../services/pricebookService';

const { Option } = Select;

interface ProductSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelected: (products: Product[]) => void;
  selectedProducts?: Product[];
  customerId?: string; // 客户 ID，用于查询客户专属价格
}

/** 产品类别选项 */
const categoryOptions = [
  { label: '全部', value: '' },
  { label: ProductCategory.SOFTWARE, value: ProductCategory.SOFTWARE },
  { label: ProductCategory.HARDWARE, value: ProductCategory.HARDWARE },
  { label: ProductCategory.SERVICE, value: ProductCategory.SERVICE },
  { label: ProductCategory.TRAINING, value: ProductCategory.TRAINING },
  { label: ProductCategory.MAINTENANCE, value: ProductCategory.MAINTENANCE },
];

/** 库存状态标签 */
const StockTag: React.FC<{ inStock: boolean }> = ({ inStock }) => {
  return inStock ? (
    <Tag color="green">有货</Tag>
  ) : (
    <Tag color="red">缺货</Tag>
  );
};

/**
 * 产品选择器组件
 */
export const ProductSelector: React.FC<ProductSelectorProps> = ({
  open,
  onClose,
  onSelected,
  selectedProducts = [],
  customerId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});

  /** 加载产品列表和价格 */
  useEffect(() => {
    if (open) {
      const productList = getProductList();
      setProducts(productList);
      setFilteredProducts(productList);
      
      // 设置已选产品的选中状态
      const keys = selectedProducts.map(p => p.id);
      setSelectedRowKeys(keys);
      
      // 加载产品价格（从价格表）
      const loadPrices = async () => {
        const prices: Record<string, number> = {};
        for (const product of productList) {
          try {
            const priceInfo = await getProductPrice(customerId, product.id, 1);
            if (priceInfo) {
              prices[product.id] = priceInfo.unitPrice;
            } else {
              prices[product.id] = product.unitPrice; //  fallback 到产品默认价格
            }
          } catch (e) {
            prices[product.id] = product.unitPrice;
          }
        }
        setProductPrices(prices);
      };
      loadPrices();
    }
  }, [open, selectedProducts, customerId]);

  /** 筛选产品 */
  useEffect(() => {
    let filtered = [...products];
    
    if (searchText) {
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchText.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchText.toLowerCase()) ||
          p.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [searchText, categoryFilter, products]);

  /** 处理确认选择 */
  const handleConfirm = () => {
    const selected = products.map(p => {
      if (selectedRowKeys.includes(p.id)) {
        // 使用价格表中的价格
        const priceFromPricebook = productPrices[p.id];
        if (priceFromPricebook !== undefined && priceFromPricebook !== p.unitPrice) {
          return { ...p, unitPrice: priceFromPricebook };
        }
        return p;
      }
      return null;
    }).filter((p): p is Product => p !== null);
    
    onSelected(selected);
    onClose();
    message.success(`已选择 ${selected.length} 个产品`);
  };

  /** 表格列定义 */
  const columns: ColumnsType<Product> = [
    {
      title: '产品编号',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: ProductCategory) => {
        const colorMap: Record<ProductCategory, string> = {
          [ProductCategory.SOFTWARE]: 'blue',
          [ProductCategory.HARDWARE]: 'orange',
          [ProductCategory.SERVICE]: 'purple',
          [ProductCategory.TRAINING]: 'cyan',
          [ProductCategory.MAINTENANCE]: 'green',
        };
        return <Tag color={colorMap[category]}>{category}</Tag>;
      },
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      sorter: (a, b) => (productPrices[a.id] || a.unitPrice) - (productPrices[b.id] || b.unitPrice),
      render: (_: number, record: Product) => {
        const price = productPrices[record.id] || record.unitPrice;
        const originalPrice = record.unitPrice;
        const hasDiscount = price < originalPrice;
        return (
          <div>
            <div style={{ fontWeight: hasDiscount ? 'bold' : 'normal', color: hasDiscount ? '#ff4d4f' : 'inherit' }}>
              ¥{price.toLocaleString()}
            </div>
            {hasDiscount && (
              <div style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
                ¥{originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '库存',
      dataIndex: 'inStock',
      key: 'inStock',
      width: 80,
      render: (_: boolean, record: Product) => <StockTag inStock={record.inStock} />,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  /** 行选择配置 */
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Modal
      title="选择产品"
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      width={1200}
      okText="确认选择"
      cancelText="取消"
    >
      <Space style={{ marginBottom: 16, width: '100%', display: 'flex' }}>
        <Input
          placeholder="搜索产品名称、编号或描述"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="产品类别"
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: 150 }}
          allowClear
        >
          {categoryOptions.map(opt => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#666' }}>
          已选择 {selectedRowKeys.length} 个产品
        </span>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredProducts}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个产品`,
        }}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ProductSelector;
