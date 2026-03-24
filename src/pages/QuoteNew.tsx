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
      message.error('请填写必填项');
    }
  };

  /** 提交保存 */
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      // 验证是否已选择产品
      if (quoteProducts.length === 0) {
        message.error('请至少选择一个产品');
        setCurrentStep(1);
        return;
      }

      // 模拟保存
      console.log('保存报价单:', {
        ...values,
        products: quoteProducts,
      });

      message.success('报价单创建成功！');
      navigate('/quote/list');
    } catch (error) {
      message.error('请填写完整信息');
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
      title: '基本信息',
      description: '填写报价单基本信息',
    },
    {
      title: '选择产品',
      description: '添加报价产品明细',
    },
    {
      title: '确认提交',
      description: '确认信息并提交',
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
              返回
            </Button>
            <span style={{ fontSize: 18, fontWeight: 600 }}>新建报价单</span>
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
                  label="报价单号"
                  rules={[{ required: true, message: '请输入报价单号' }]}
                >
                  <Input placeholder="请输入报价单号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select>
                    {statusOptions.map(opt => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">客户信息</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customerId"
                  label="客户"
                  rules={[{ required: true, message: '请选择客户' }]}
                >
                  <Select
                    placeholder="请选择客户"
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
                <Form.Item name="customerName" label="客户名称">
                  <Input placeholder="自动填充" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="contactId" label="联系人">
                  <Select placeholder="请选择联系人" allowClear>
                    {contactOptions.map(contact => (
                      <Option key={contact.id} value={contact.id}>
                        {contact.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="opportunityId" label="关联商机">
                  <Select placeholder="请选择商机" allowClear>
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
                  label="有效期至"
                  rules={[{ required: true, message: '请选择有效期' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">备注条款</Divider>

            <Form.Item name="notes" label="备注">
              <TextArea rows={3} placeholder="请输入备注信息" />
            </Form.Item>

            <Form.Item name="terms" label="条款">
              <TextArea rows={3} placeholder="请输入条款信息" />
            </Form.Item>
          </Form>
        )}

        {/* 步骤 2: 选择产品 */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleAddProducts}>
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
              onSelected={(products) => {
                // 实际添加产品由 QuoteCalculator 内部处理
                // 这里只是关闭弹窗
                setProductSelectorVisible(false);
                message.success(`已选择 ${products.length} 个产品`);
              }}
              selectedProducts={selectedProducts}
            />
          </div>
        )}

        {/* 步骤 3: 确认提交 */}
        {currentStep === 2 && (
          <Card title="确认信息" type="inner">
            <p>请确认以下信息：</p>
            <ul>
              <li>报价单号：{form.getFieldValue('quoteNumber')}</li>
              <li>客户名称：{form.getFieldValue('customerName')}</li>
              <li>产品数量：{quoteProducts.length} 个</li>
              <li>
                总金额：¥
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
              <Button onClick={handlePrev}>上一步</Button>
            )}
            {currentStep < 2 ? (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
                提交保存
              </Button>
            )}
            <Button onClick={handleCancel}>取消</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default QuoteNew;
