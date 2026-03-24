/**
 * 报价配置器页面
 * 功能：可视化产品选择、实时价格计算、报价单预览
 */
import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Space, message, Divider, Row, Col } from 'antd';
import { SaveOutlined, FilePdfOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { QuoteProduct, Product } from '../../types/cpq';
import { ProductSelector } from '../../components/CPQ/ProductSelector';
import { QuoteCalculator } from '../../components/CPQ/QuoteCalculator';
import { QuotePreview } from '../../components/CPQ/QuotePreview';

/**
 * 报价配置器页面组件
 */
export const QuoteBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteProducts, setQuoteProducts] = useState<QuoteProduct[]>([]);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerId: 'CUST001', // TODO: 从客户选择器获取
    customerName: '北京科技创新有限公司', // TODO: 从客户选择器获取
    contactName: '张经理', // TODO: 从客户选择器获取
    quoteNumber: '',
    validUntil: '',
    notes: '',
    terms: '',
  });

  /** 处理产品选择 */
  const handleProductSelected = (products: Product[]) => {
    // 将选中的产品添加到报价明细
    const newProducts: QuoteProduct[] = products.map(p => ({
      id: `QP${Date.now()}${Math.random()}`,
      productId: p.id,
      productName: p.name,
      quantity: 1,
      unitPrice: p.unitPrice,
      discount: 0,
      subtotal: p.unitPrice,
      tax: Math.round(p.unitPrice * 0.13),
      total: Math.round(p.unitPrice * 1.13),
    }));
    setQuoteProducts([...quoteProducts, ...newProducts]);
    setProductSelectorVisible(false);
    message.success(`已添加 ${products.length} 个产品`);
  };

  /** 处理产品明细变化 */
  const handleProductsChange = (products: QuoteProduct[]) => {
    setQuoteProducts(products);
  };

  /** 计算总计 */
  const calculateTotals = () => {
    const subtotal = quoteProducts.reduce((sum, p) => sum + p.subtotal, 0);
    const totalDiscount = quoteProducts.reduce((sum, p) => sum + (p.subtotal * p.discount / 100), 0);
    const totalTax = quoteProducts.reduce((sum, p) => sum + p.tax, 0);
    const grandTotal = quoteProducts.reduce((sum, p) => sum + p.total, 0);
    return { subtotal, totalDiscount, totalTax, grandTotal };
  };

  /** 导出 PDF */
  const handleExportPDF = () => {
    message.info('PDF 导出功能开发中...');
    // TODO: 使用 jsPDF 实现 PDF 导出
  };

  /** 保存报价单 */
  const handleSave = () => {
    if (quoteProducts.length === 0) {
      message.error('请至少添加一个产品');
      return;
    }
    message.success('报价单保存成功！');
    navigate('/quote/list');
  };

  const steps = [
    { title: '客户信息', description: '填写报价单基本信息' },
    { title: '选择产品', description: '添加报价产品明细' },
    { title: '预览确认', description: '预览报价单并确认' },
  ];

  const totals = calculateTotals();

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/quote/list')}>
              返回
            </Button>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {id ? '编辑报价单' : '新建报价单'}
            </span>
          </Space>
        </div>

        {/* 步骤条 */}
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {/* 步骤 1: 客户信息 */}
        {currentStep === 0 && (
          <Card title="客户信息" type="inner">
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>报价单号：</strong>
                  <span>QT-2026-{String(Date.now()).slice(-6)}</span>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>有效期至：</strong>
                  <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>客户：</strong>
                  <span>请选择客户</span>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>联系人：</strong>
                  <span>请选择联系人</span>
                </div>
              </Col>
            </Row>
            <Divider />
            <p style={{ color: '#999', textAlign: 'center' }}>
              客户信息表单待完善，当前使用 Mock 数据
            </p>
          </Card>
        )}

        {/* 步骤 2: 选择产品 */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => setProductSelectorVisible(true)}>
                选择产品
              </Button>
              <span style={{ marginLeft: 16, color: '#666' }}>
                已选择 {quoteProducts.length} 个产品
              </span>
            </div>

            <QuoteCalculator
              products={quoteProducts}
              onChange={handleProductsChange}
            />

            <ProductSelector
              open={productSelectorVisible}
              onClose={() => setProductSelectorVisible(false)}
              onSelected={handleProductSelected}
              customerId={customerInfo.customerId}
            />
          </div>
        )}

        {/* 步骤 3: 预览确认 */}
        {currentStep === 2 && (
          <QuotePreview
            quoteNumber={customerInfo.quoteNumber || 'QT-2026-XXX'}
            customerName={customerInfo.customerName || '未选择客户'}
            contactName={customerInfo.contactName || '未选择联系人'}
            validUntil={customerInfo.validUntil || '未设置'}
            products={quoteProducts}
            subtotal={totals.subtotal}
            totalDiscount={totals.totalDiscount}
            totalTax={totals.totalTax}
            grandTotal={totals.grandTotal}
            notes={customerInfo.notes}
            terms={customerInfo.terms}
          />
        )}

        {/* 底部操作按钮 */}
        <Divider />
        <div style={{ textAlign: 'right' }}>
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
            )}
            {currentStep < 2 ? (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && quoteProducts.length === 0}
              >
                下一步
              </Button>
            ) : (
              <>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  保存报价单
                </Button>
                <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                  导出 PDF
                </Button>
              </>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default QuoteBuilder;
