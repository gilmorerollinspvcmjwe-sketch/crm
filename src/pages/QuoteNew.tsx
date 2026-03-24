/**
 * 新建报价单页面
 * 功能：
 * - 填写报价单基本信息
 * - 选择产品
 * - 计算价格
 * - 提交保存
 */
import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  message,
  Steps,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/zh-cn';
import { QuoteProduct, Product, QuoteStatus } from '../types/cpq';

// 扩展 dayjs 插件
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('zh-cn');
import { QuoteCalculator } from '../components/CPQ/QuoteCalculator';
import { ProductSelector } from '../components/CPQ/ProductSelector';

const { Option } = Select;
const { TextArea } = Input;

/** 客户 Mock 数据（简化版） */
const customerOptions = [
  { id: 'CUST001', name: '北京科技创新有限公司' },
  { id: 'CUST002', name: '上海智能制造有限公司' },
  { id: 'CUST003', name: '广州金融服务有限公司' },
  { id: 'CUST004', name: '深圳电子商务有限公司' },
  { id: 'CUST005', name: '杭州网络技术有限公司' },
  { id: 'CUST006', name: '成都科技有限公司' },
  { id: 'CUST007', name: '武汉智能设备有限公司' },
  { id: 'CUST008', name: '西安软件有限公司' },
];

/** 联系人 Mock 数据 */
const contactOptions = [
  { id: 'CONT001', name: '张经理' },
  { id: 'CONT002', name: '王总监' },
  { id: 'CONT003', name: '李总' },
  { id: 'CONT004', name: '陈经理' },
  { id: 'CONT005', name: '刘经理' },
];

/** 商机 Mock 数据 */
const opportunityOptions = [
  { id: 'OPP001', name: 'CRM 系统采购项目' },
  { id: 'OPP002', name: 'AI 助手模块采购' },
  { id: 'OPP003', name: '系统升级项目' },
  { id: 'OPP004', name: '移动端应用采购' },
  { id: 'OPP005', name: '数据分析模块' },
];

/** 状态选项 */
const statusOptions = [
  { label: QuoteStatus.DRAFT, value: QuoteStatus.DRAFT },
  { label: QuoteStatus.SENT, value: QuoteStatus.SENT },
];

interface QuoteFormValues {
  quoteNumber: string;
  customerId: string;
  customerName: string;
  contactId?: string;
  contactName?: string;
  opportunityId?: string;
  opportunityName?: string;
  status: QuoteStatus;
  validUntil: string;
  notes?: string;
  terms?: string;
}

/**
 * 新建报价单页面组件
 */
export const QuoteNew: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteProducts, setQuoteProducts] = useState<QuoteProduct[]>([]);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  /** 处理产品选择 */
  const handleProductSelected = (products: Product[]) => {
    setSelectedProducts(products);
  };

  /** 添加产品到报价单 */
  const handleAddProducts = () => {
    setProductSelectorVisible(true);
  };

  /** 确认产品选择 */
  const handleConfirmProducts = (products: Product[]) => {
    // QuoteCalculator 组件会处理产品添加
    // 这里通过 props 传递
  };

  /** 处理产品明细变化 */
  const handleProductsChange = (products: QuoteProduct[]) => {
    setQuoteProducts(products);
  };

  /** 上一步 */
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  /** 下一步 */
  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields([
          'quoteNumber',
          'customerId',
          'customerName',
          'status',
          'validUntil',
        ]);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error(t('quote.new.validation.fillRequired'));
    }
  };

  /** 提交保存 */
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      // 验证是否已选择产品
      if (quoteProducts.length === 0) {
        message.error(t('quote.new.validation.selectProduct'));
        setCurrentStep(1);
        return;
      }

      // 模拟保存
      console.log('保存报价单:', {
        ...values,
        products: quoteProducts,
      });

      message.success(t('quote.new.success'));
      navigate('/quote/list');
    } catch (error) {
      message.error(t('quote.new.validation.fillComplete'));
      console.error(error);
    }
  };

  /** 取消 */
  const handleCancel = () => {
    navigate('/quote/list');
  };

  /** 步骤配置 */
  const steps = [
    {
      title: t('quote.new.steps.basicInfo'),
      description: t('quote.new.steps.basicInfoDesc'),
    },
    {
      title: t('quote.new.steps.selectProducts'),
      description: t('quote.new.steps.selectProductsDesc'),
    },
    {
      title: t('quote.new.steps.confirm'),
      description: t('quote.new.steps.confirmDesc'),
    },
  ];

  // 获取状态文本
  const getStatusText = (status: QuoteStatus) => {
    const statusMap: Record<QuoteStatus, string> = {
      [QuoteStatus.DRAFT]: t('quote.status.draft'),
      [QuoteStatus.SENT]: t('quote.status.sent'),
      [QuoteStatus.ACCEPTED]: t('quote.status.accepted'),
      [QuoteStatus.REJECTED]: t('quote.status.rejected'),
      [QuoteStatus.EXPIRED]: t('quote.status.expired'),
    };
    return statusMap[status] || status;
  };

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
              {t('quote.new.back')}
            </Button>
            <span style={{ fontSize: 18, fontWeight: 600 }}>{t('quote.new.title')}</span>
          </Space>
        </div>

        {/* 步骤条 */}
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {/* 步骤 1: 基本信息 */}
        {currentStep === 0 && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: QuoteStatus.DRAFT,
              validUntil: dayjs().add(30, 'day'),
              quoteNumber: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="quoteNumber"
                  label={t('quote.new.form.quoteNumber')}
                  rules={[{ required: true, message: t('quote.new.form.quoteNumberPlaceholder') }]}
                >
                  <Input placeholder={t('quote.new.form.quoteNumberPlaceholder')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label={t('quote.new.form.status')}
                  rules={[{ required: true, message: t('quote.new.form.statusPlaceholder') }]}
                >
                  <Select>
                    {statusOptions.map(opt => (
                      <Option key={opt.value} value={opt.value}>
                        {getStatusText(opt.label)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">{t('quote.new.form.customerInfo')}</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customerId"
                  label={t('quote.new.form.customer')}
                  rules={[{ required: true, message: t('quote.new.form.customerPlaceholder') }]}
                >
                  <Select
                    placeholder={t('quote.new.form.customerPlaceholder')}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value, option) => {
                      form.setFieldsValue({ customerName: (option as { label?: string })?.label });
                    }}
                  >
                    {customerOptions.map(customer => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="customerName" label={t('quote.new.form.customerName')}>
                  <Input placeholder={t('quote.new.form.customerNameAutoFill')} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="contactId" label={t('quote.new.form.contact')}>
                  <Select placeholder={t('quote.new.form.contactPlaceholder')} allowClear>
                    {contactOptions.map(contact => (
                      <Option key={contact.id} value={contact.id}>
                        {contact.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="opportunityId" label={t('quote.new.form.opportunity')}>
                  <Select placeholder={t('quote.new.form.opportunityPlaceholder')} allowClear>
                    {opportunityOptions.map(opp => (
                      <Option key={opp.id} value={opp.id}>
                        {opp.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="validUntil"
                  label={t('quote.new.form.validUntil')}
                  rules={[{ required: true, message: t('quote.new.form.validUntilPlaceholder') }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">{t('quote.new.form.notesAndTerms')}</Divider>

            <Form.Item name="notes" label={t('quote.new.form.notes')}>
              <TextArea rows={3} placeholder={t('quote.new.form.notesPlaceholder')} />
            </Form.Item>

            <Form.Item name="terms" label={t('quote.new.form.terms')}>
              <TextArea rows={3} placeholder={t('quote.new.form.termsPlaceholder')} />
            </Form.Item>
          </Form>
        )}

        {/* 步骤 2: 选择产品 */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleAddProducts}>
                {t('quote.new.products.selectProducts')}
              </Button>
              <span style={{ marginLeft: 16, color: '#666' }}>
                {t('quote.new.products.selected', { count: quoteProducts.length })}
              </span>
            </div>

            <QuoteCalculator
              products={quoteProducts}
              onChange={handleProductsChange}
            />

            <ProductSelector
              open={productSelectorVisible}
              onClose={() => setProductSelectorVisible(false)}
              onSelected={(products) => {
                // 实际添加产品由 QuoteCalculator 内部处理
                // 这里只是关闭弹窗
                setProductSelectorVisible(false);
                message.success(t('quote.calculator.productsAdded', { count: products.length }));
              }}
              selectedProducts={selectedProducts}
            />
          </div>
        )}

        {/* 步骤 3: 确认提交 */}
        {currentStep === 2 && (
          <Card title={t('quote.new.confirm.title')} type="inner">
            <p>{t('quote.new.confirm.title')}：</p>
            <ul>
              <li>{t('quote.new.confirm.quoteNumber')}：{form.getFieldValue('quoteNumber')}</li>
              <li>{t('quote.new.confirm.customerName')}：{form.getFieldValue('customerName')}</li>
              <li>{t('quote.new.confirm.productCount')}：{quoteProducts.length} {t('quote.new.confirm.productCountUnit')}</li>
              <li>
                {t('quote.new.confirm.totalAmount')}：¥
                {quoteProducts.reduce((sum, p) => sum + p.total, 0).toLocaleString()}
              </li>
            </ul>
          </Card>
        )}

        {/* 底部操作按钮 */}
        <Divider />
        <div style={{ textAlign: 'right' }}>
          <Space>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>{t('quote.new.navigation.prev')}</Button>
            )}
            {currentStep < 2 ? (
              <Button type="primary" onClick={handleNext}>
                {t('quote.new.navigation.next')}
              </Button>
            ) : (
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
                {t('quote.new.navigation.submit')}
              </Button>
            )}
            <Button onClick={handleCancel}>{t('quote.new.navigation.cancel')}</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default QuoteNew;