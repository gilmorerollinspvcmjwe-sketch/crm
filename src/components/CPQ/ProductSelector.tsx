/**
 * 产品选择器组件
 * 用于在创建报价单时选择产品
 */
import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Select, Space, Button, Tag, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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

// 获取类别文本
const getCategoryText = (category: ProductCategory, t: any) => {
  const categoryMap: Record<ProductCategory, string> = {
    [ProductCategory.SOFTWARE]: t('product.category.software'),
    [ProductCategory.HARDWARE]: t('product.category.hardware'),
    [ProductCategory.SERVICE]: t('product.category.service'),
    [ProductCategory.TRAINING]: t('product.category.training'),
    [ProductCategory.MAINTENANCE]: t('product.category.maintenance'),
  };
  return categoryMap[category] || category;
};

/** 库存状态标签 */
const StockTag: React.FC<{ inStock: boolean; t: any }> = ({ inStock, t }) => {
  return inStock ? (
    <Tag color="green">{t('product.selector.inStock')}</Tag>
  ) : (
    <Tag color="red">{t('product.selector.outOfStock')}</Tag>
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
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});

  /** 产品类别选项 */
  const categoryOptions = [
    { label: t('product.selector.allCategories'), value: '' },
    { label: getCategoryText(ProductCategory.SOFTWARE, t), value: ProductCategory.SOFTWARE },
    { label: getCategoryText(ProductCategory.HARDWARE, t), value: ProductCategory.HARDWARE },
    { label: getCategoryText(ProductCategory.SERVICE, t), value: ProductCategory.SERVICE },
    { label: getCategoryText(ProductCategory.TRAINING, t), value: ProductCategory.TRAINING },
    { label: getCategoryText(ProductCategory.MAINTENANCE, t), value: ProductCategory.MAINTENANCE },
  ];

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
    message.success(t('product.selector.selected', { count: selected.length }));
  };

  /** 表格列定义 */
  const columns: ColumnsType<Product> = [
    {
      title: t('product.selector.sku'),
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: t('product.selector.productName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('product.selector.category'),
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
        return <Tag color={colorMap[category]}>{getCategoryText(category, t)}</Tag>;
      },
    },
    {
      title: t('product.selector.unitPrice'),
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
      title: t('product.selector.unit'),
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: t('product.selector.stock'),
      dataIndex: 'inStock',
      key: 'inStock',
      width: 80,
      render: (_: boolean, record: Product) => <StockTag inStock={record.inStock} t={t} />,
    },
    {
      title: t('product.selector.description'),
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
      title={t('product.selector.title')}
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      width={1200}
      okText={t('product.selector.confirm')}
      cancelText={t('common.actions.cancel')}
    >
      <Space style={{ marginBottom: 16, width: '100%', display: 'flex' }}>
        <Input
          placeholder={t('product.selector.searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder={t('product.selector.categoryFilter')}
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
          {t('product.selector.selectedCount', { count: selectedRowKeys.length })}
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
          showTotal: (total) => t('product.selector.total', { total }),
        }}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ProductSelector;