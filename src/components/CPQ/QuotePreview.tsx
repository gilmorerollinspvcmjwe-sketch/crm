/**
 * 报价预览组件
 * 用于实时预览报价单内容和格式
 */
import React from 'react';
import { Card, Table, Typography, Divider, Row, Col, Tag } from 'antd';
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
  const productColumns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 250,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      key: 'discount',
      width: 80,
      align: 'right' as const,
      render: (discount: number) => `${discount}%`,
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '税费',
      dataIndex: 'tax',
      key: 'tax',
      width: 100,
      align: 'right' as const,
      render: (tax: number) => `¥${tax.toLocaleString()}`,
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right' as const,
      render: (total: number) => `¥${total.toLocaleString()}`,
    },
  ];

  return (
    <Card title="报价单预览" bordered={false}>
      {/* 报价单头部 */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>报价单号：</Text>
            <Text>{quoteNumber || '待生成'}</Text>
          </Col>
          <Col span={12}>
            <Text strong>有效期：</Text>
            <Text>{validUntil || '未设置'}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={12}>
            <Text strong>客户：</Text>
            <Text>{customerName || '未选择'}</Text>
          </Col>
          <Col span={12}>
            <Text strong>联系人：</Text>
            <Text>{contactName || '未选择'}</Text>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 产品明细表格 */}
      <Title level={5}>产品明细</Title>
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
                <Text>小计：</Text>
                <Text strong>¥{subtotal.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text>折扣：</Text>
                <Text type="danger">-¥{totalDiscount.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text>税费 (13%)：</Text>
                <Text>¥{totalTax.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row justify="end" gutter={[24, 8]}>
              <Col span={6}>
                <Text strong style={{ fontSize: 16 }}>总计：</Text>
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
          <Title level={5}>备注</Title>
          <Text type="secondary">{notes || '无'}</Text>
        </Col>
        <Col span={12}>
          <Title level={5}>条款</Title>
          <Text type="secondary">{terms || '无'}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default QuotePreview;
