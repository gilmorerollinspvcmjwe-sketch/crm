/**
 * 产品详情页面
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, message, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Product, ProductCategory } from '../../types/cpq';
import { getProductById } from '../../services/productService';

/**
 * 产品详情页面组件
 */
export const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
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
        message.error(t('product.detail.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <Spin tip={t('common.loading')} style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!product) {
    return <Card>{t('product.detail.notExist')}</Card>;
  }

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/product/list')}>
            {t('product.detail.back')}
          </Button>
          <Button type="primary" icon={<EditOutlined />}>
            {t('product.detail.edit')}
          </Button>
        </Space>

        {/* 产品基本信息 */}
        <Descriptions title={t('product.detail.basicInfo')} bordered column={2}>
          <Descriptions.Item label={t('product.detail.productNumber')}>{product.sku}</Descriptions.Item>
          <Descriptions.Item label={t('product.detail.productName')}>{product.name}</Descriptions.Item>
          <Descriptions.Item label={t('product.detail.productCategory')}>
            <Tag color="blue">{product.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('product.detail.unitPrice')}>¥{product.unitPrice.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label={t('product.detail.unit')}>{product.unit}</Descriptions.Item>
          <Descriptions.Item label={t('product.detail.stockStatus')}>
            <Tag color={product.inStock ? 'green' : 'red'}>
              {product.inStock ? t('product.list.inStock') : t('product.list.outOfStock')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('product.detail.description')} span={2}>
            {product.description}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">{t('product.detail.specs')}</Divider>

        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('product.detail.createdAt')}>2026-01-01</Descriptions.Item>
          <Descriptions.Item label={t('product.detail.updatedAt')}>2026-03-01</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProductDetail;