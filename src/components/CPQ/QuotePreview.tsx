/**
 * 报价预览组件
 * 用于实时预览报价单内容和格式
 */
import React from 'react';
import { Card, Table, Typography, Divider, Row, Col, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { QuoteProduct } from '../../types/cpq';

const { Title, Text } = Typography;

interface QuotePreviewProps {
  quoteNumber?: string;
  customerName?: string;
  contactName?: string;
  validUntil?: string;
  products: QuoteProduct[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  notes?: string;
  terms?: string;
}

/**
 * 报价预览组件
 */
export const QuotePreview: React.FC<QuotePreviewProps> = ({
  quoteNumber,
  customerName,
  contactName,
  validUntil,
  products,
  subtotal,
  totalDiscount,
  totalTax,
  grandTotal,
  notes,
  terms,
}) => {
  const { t } = useTranslation();

  const productColumns = [
    {
      title: t('quote.preview.productName'),
      dataIndex: 'productName',
      key: 'productName',
      width: 250,
    },
    {
      title: t('quote.preview.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: t('quote.preview.unitPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: t('quote.preview.discount'),
      dataIndex: 'discount',
      key: 'discount',
      width: 80,
      align: 'right' as const,
      render: (discount: number) => `${discount}%`,
    },
    {
      title: t('quote.preview.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: t('quote.preview.tax'),
      dataIndex: 'tax',
      key: 'tax',
      width: 100,
      align: 'right' as const,
      render: (tax: number) => `¥${tax.toLocaleString()}`,
    },
    {
      title: t('quote.preview.total'),
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right' as const,
      render: (total: number) => `¥${total.toLocaleString()}`,
    },
  ];

  return (
    <Card title={t('quote.preview.title')} bordered={false}>
      {/* 报价单头部 */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>{t('quote.preview.quoteNumber')}：</Text>
            <Text>{quoteNumber || t('quote.preview.toBeGenerated')}</Text>
          </Col>
          <Col span={12}>
            <Text strong>{t('quote.preview.validUntil')}：</Text>
            <Text>{validUntil || t('quote.preview.notSet')}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={12}>
            <Text strong>{t('quote.preview.customer')}：</Text>
            <Text>{customerName || t('quote.preview.notSelected')}</Text>
          </Col>
          <Col span={12}>
            <Text strong>{t('quote.preview.contact')}：</Text>
            <Text>{contactName || t('quote.preview.notSelected')}</Text>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 产品明细表格 */}
      <Title level={5}>{t('quote.preview.productDetails')}</Title>
      <Table
        columns={productColumns}
        dataSource={products}
        rowKey="id"
        pagination={false}
        size="small"
        footer={() => (
          <div style={{ textAlign: 'right', padding: '12px 0' }}>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text>{t('quote.preview.subtotal')}：</Text>
                <Text strong>¥{subtotal.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text>{t('quote.preview.discount')}：</Text>
                <Text type="danger">-¥{totalDiscount.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text>{t('quote.preview.tax')}：</Text>
                <Text>¥{totalTax.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text strong style={{ fontSize: 16 }}>{t('quote.preview.total')}：</Text>
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                  ¥{grandTotal.toLocaleString()}
                </Text>
              </Col>
            </Row>
          </div>
        )}
      />

      <Divider />

      {/* 备注和条款 */}
      <Row gutter={16}>
        <Col span={12}>
          <Title level={5}>{t('quote.preview.notes')}</Title>
          <Text type="secondary">{notes || t('quote.preview.none')}</Text>
        </Col>
        <Col span={12}>
          <Title level={5}>{t('quote.preview.terms')}</Title>
          <Text type="secondary">{terms || t('quote.preview.none')}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default QuotePreview;