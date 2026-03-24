/**
 * 产品库列表页面
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Tag, Modal, Form, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Product, ProductCategory } from '../../types/cpq';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../services/productService';
import { ProductForm } from '../../components/Product/ProductForm';

const { Option } = Select;

/**
 * 产品库列表页面组件
 */
export const ProductList: React.FC = () => {
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
      message.error('加载产品列表失败');
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
      message.success('删除成功');
      loadProducts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  /** 处理表单提交 */
  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success('产品更新成功');
      } else {
        await createProduct(values);
        message.success('产品创建成功');
      }
      setModalVisible(false);
      loadProducts();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setFormLoading(false);
    }
  };

  /** 表格列定义 */
  const columns: ColumnsType<Product> = [
    {
      title: '产品编码',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: ProductCategory) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 100,
      render: (spec?: string) => spec || '-',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 100,
      render: (model?: string) => model || '-',
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 100,
      render: (price?: number) => price ? `¥${price.toLocaleString()}` : '-',
    },
    {
      title: '库存',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 80,
      render: (qty?: number) => qty ?? '-',
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: Product) => (
        <Space>
          <Tag color={record.status === 'active' ? 'green' : 'default'}>
            {record.status === 'active' ? '上架' : '下架'}
          </Tag>
          <Tag color={record.inStock ? 'green' : 'red'}>
            {record.inStock ? '有货' : '缺货'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此产品吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
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
              placeholder="搜索产品"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
              onPressEnter={loadProducts}
            />
            <Select
              placeholder="产品类别"
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
            <Button onClick={loadProducts}>查询</Button>
          </Space>
          <Space>
            <Button icon={<ImportOutlined />}>导入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建产品
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
            showTotal: (total) => `共 ${total} 个产品`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 新建/编辑产品弹窗 */}
      <Modal
        title={editingProduct ? '编辑产品' : '新建产品'}
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
