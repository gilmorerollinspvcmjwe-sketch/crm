/**
 * 产品库列表页面
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Tag, Modal, Form, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Product, ProductCategory } from '../../types/cpq';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../services/productService';
import { ProductForm } from '../../components/Product/ProductForm';

const { Option } = Select;

/**
 * 产品库列表页面组件
 */
export const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  /** 加载产品列表 */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts({
        search: searchText || undefined,
        category: categoryFilter || undefined,
        page,
        pageSize,
      });
      setProducts(result.list);
      setTotal(result.total);
    } catch (error) {
      message.error(t('product.list.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, pageSize, searchText, categoryFilter]);

  /** 打开新建产品弹窗 */
  const handleCreate = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  /** 打开编辑产品弹窗 */
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  /** 处理删除 */
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success(t('product.list.deleteSuccess'));
      loadProducts();
    } catch (error) {
      message.error(t('product.list.deleteFailed'));
    }
  };

  /** 处理表单提交 */
  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success(t('product.form.updateSuccess'));
      } else {
        await createProduct(values);
        message.success(t('product.form.createSuccess'));
      }
      setModalVisible(false);
      loadProducts();
    } catch (error) {
      message.error(t('common.operationFailed'));
    } finally {
      setFormLoading(false);
    }
  };

  /** 表格列定义 */
  const columns: ColumnsType<Product> = [
    {
      title: t('product.list.columnSku'),
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
    },
    {
      title: t('product.list.columnName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: t('product.list.columnCategory'),
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: ProductCategory) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: t('product.list.columnSpec'),
      dataIndex: 'specification',
      key: 'specification',
      width: 100,
      render: (spec?: string) => spec || '-',
    },
    {
      title: t('product.list.columnModel'),
      dataIndex: 'model',
      key: 'model',
      width: 100,
      render: (model?: string) => model || '-',
    },
    {
      title: t('product.list.columnUnitPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: t('product.list.columnCostPrice'),
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 100,
      render: (price?: number) => price ? `¥${price.toLocaleString()}` : '-',
    },
    {
      title: t('product.list.columnStock'),
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 80,
      render: (qty?: number) => qty ?? '-',
    },
    {
      title: t('product.list.columnStatus'),
      key: 'status',
      width: 100,
      render: (_: any, record: Product) => (
        <Space>
          <Tag color={record.status === 'active' ? 'green' : 'default'}>
            {record.status === 'active' ? t('product.list.statusActive') : t('product.list.statusInactive')}
          </Tag>
          <Tag color={record.inStock ? 'green' : 'red'}>
            {record.inStock ? t('product.list.inStock') : t('product.list.outOfStock')}
          </Tag>
        </Space>
      ),
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {t('product.list.edit')}
          </Button>
          <Popconfirm
            title={t('product.list.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              {t('product.list.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder={t('product.list.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
              onPressEnter={loadProducts}
            />
            <Select
              placeholder={t('product.list.categoryFilter')}
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 150 }}
              allowClear
            >
              <Option value={ProductCategory.SOFTWARE}>软件</Option>
              <Option value={ProductCategory.HARDWARE}>硬件</Option>
              <Option value={ProductCategory.SERVICE}>服务</Option>
              <Option value={ProductCategory.TRAINING}>培训</Option>
              <Option value={ProductCategory.MAINTENANCE}>维护</Option>
            </Select>
            <Button onClick={loadProducts}>{t('common.query')}</Button>
          </Space>
          <Space>
            <Button icon={<ImportOutlined />}>{t('product.list.import')}</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              {t('product.list.newProduct')}
            </Button>
          </Space>
        </Space>

        {/* 产品表格 */}
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `${t('common.total')} ${total} ${t('marketing.campaigns.unit')}`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 新建/编辑产品弹窗 */}
      <Modal
        title={editingProduct ? t('product.form.basicInfo') : t('product.list.newProduct')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <ProductForm
          initialValues={editingProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
          loading={formLoading}
          isEdit={!!editingProduct}
        />
      </Modal>
    </div>
  );
};

export default ProductList;