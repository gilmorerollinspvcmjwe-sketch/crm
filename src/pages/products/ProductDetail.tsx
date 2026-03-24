/**
 * 产品详情页面
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, message, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Product, ProductCategory } from '../../types/cpq';
import { getProductById } from '../../services/productService';

/**
 * 产品详情页面组件
 */
export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data || null);
      } catch (error) {
        message.error('加载产品详情失败');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <Spin tip="加载中..." style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!product) {
    return <Card>产品不存在</Card>;
  }

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/product/list')}>
            返回
          </Button>
          <Button type="primary" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>

        {/* 产品基本信息 */}
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="产品编号">{product.sku}</Descriptions.Item>
          <Descriptions.Item label="产品名称">{product.name}</Descriptions.Item>
          <Descriptions.Item label="产品类别">
            <Tag color="blue">{product.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="单价">¥{product.unitPrice.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="单位">{product.unit}</Descriptions.Item>
          <Descriptions.Item label="库存状态">
            <Tag color={product.inStock ? 'green' : 'red'}>
              {product.inStock ? '有货' : '缺货'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {product.description}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">规格参数</Divider>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="创建时间">2026-01-01</Descriptions.Item>
          <Descriptions.Item label="更新时间">2026-03-01</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProductDetail;
