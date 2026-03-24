/**
 * 报价配置器页面
 * 功能：可视化产品选择、实时价格计算、报价单预览
 */
import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Space, message, Divider, Row, Col } from 'antd';
import { SaveOutlined, FilePdfOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QuoteProduct, Product } from '../../types/cpq';
import { ProductSelector } from '../../components/CPQ/ProductSelector';
import { QuoteCalculator } from '../../components/CPQ/QuoteCalculator';
import { QuotePreview } from '../../components/CPQ/QuotePreview';

/**
 * 报价配置器页面组件
 */
export const QuoteBuilder: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteProducts, setQuoteProducts] = useState<QuoteProduct[]>([]);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerId: 'CUST001',
    customerName: '北京科技创新有限公司',
    contactName: '张经理',
    quoteNumber: '',
    validUntil: '',
    notes: '',
    terms: '',
  });

  /** 处理产品选择 */
  const handleProductSelected = (products: Product[]) => {
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
    message.success(t('quote.builder.productAdded', { count: products.length }));
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
    message.info(t('quote.builder.pdfExporting'));
  };

  /** 保存报价单 */
  const handleSave = () => {
    if (quoteProducts.length === 0) {
      message.error(t('quote.builder.addProductFirst'));
      return;
    }
    message.success(t('quote.builder.saveSuccess'));
    navigate('/quote/list');
  };

  const steps = [
    { title: t('quote.builder.step1Title'), description: t('quote.builder.step1Desc') },
    { title: t('quote.builder.step2Title'), description: t('quote.builder.step2Desc') },
    { title: t('quote.builder.step3Title'), description: t('quote.builder.step3Desc') },
  ];

  const totals = calculateTotals();

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/quote/list')}>
              {t('quote.builder.back')}
            </Button>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {id ? t('quote.builder.edit') : t('quote.builder.new')}
            </span>
          </Space>
        </div>

        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {currentStep === 0 && (
          <Card title={t('quote.builder.customerInfo')} type="inner">
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>{t('quote.builder.quoteNumber')}：</strong>
                  <span>QT-2026-{String(Date.now()).slice(-6)}</span>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>{t('quote.builder.validUntil')}：</strong>
                  <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>{t('quote.builder.customer')}：</strong>
                  <span>{t('quote.builder.selectCustomer')}</span>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>{t('quote.builder.contact')}：</strong>
                  <span>{t('quote.builder.selectContact')}</span>
                </div>
              </Col>
            </Row>
            <Divider />
            <p style={{ color: '#999', textAlign: 'center' }}>
              {t('quote.builder.mockDataNote')}
            </p>
          </Card>
        )}

        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => setProductSelectorVisible(true)}>
                {t('quote.builder.selectProduct')}
              </Button>
              <span style={{ marginLeft: 16, color: '#666' }}>
                {t('quote.builder.selectedProducts', { count: quoteProducts.length })}
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

        {currentStep === 2 && (
          <QuotePreview
            quoteNumber={customerInfo.quoteNumber || 'QT-2026-XXX'}
            customerName={customerInfo.customerName || t('quote.builder.noCustomer')}
            contactName={customerInfo.contactName || t('quote.builder.noContact')}
            validUntil={customerInfo.validUntil || t('quote.builder.notSet')}
            products={quoteProducts}
            subtotal={totals.subtotal}
            totalDiscount={totals.totalDiscount}
            totalTax={totals.totalTax}
            grandTotal={totals.grandTotal}
            notes={customerInfo.notes}
            terms={customerInfo.terms}
          />
        )}

        <Divider />
        <div style={{ textAlign: 'right' }}>
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>{t('quote.builder.previous')}</Button>
            )}
            {currentStep < 2 ? (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && quoteProducts.length === 0}
              >
                {t('quote.builder.next')}
              </Button>
            ) : (
              <>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  {t('quote.builder.saveQuote')}
                </Button>
                <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
                  {t('quote.builder.exportPDF')}
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