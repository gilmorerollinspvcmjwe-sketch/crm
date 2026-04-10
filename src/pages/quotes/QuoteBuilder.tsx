/**
 * QuoteBuilder - CPQ 报价构建器页面
 * CPQ Quote Builder Page
 */

import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  FileDown,
  CheckCircle,
  Building,
  User,
  Calendar,
  Package,
  Plus,
  Eye,
} from 'lucide-react';
import {
  QuoteItem,
  Product,
  DiscountType,
  QuoteStatus,
} from '../../types/cpq';
import { getQuoteById, createQuote, updateQuote } from '../../mock/cpqData';
import { QuoteCalculator } from '../../components/CPQ/QuoteCalculator';
import { ProductSelector } from '../../components/CPQ/ProductSelector';
import { QuotePreview } from '../../components/CPQ/QuotePreview';
import { toast } from '@/hooks/use-toast';

/** 客户 Mock 数据 */
const customerOptions = [
  { id: 'CUST001', name: '北京科技创新有限公司' },
  { id: 'CUST002', name: '上海智能制造有限公司' },
  { id: 'CUST003', name: '广州金融服务有限公司' },
  { id: 'CUST004', name: '深圳电子商务有限公司' },
  { id: 'CUST005', name: '杭州网络技术有限公司' },
];

/** 联系人 Mock 数据 */
const contactOptions = [
  { id: 'CONT001', name: '张经理' },
  { id: 'CONT002', name: '王总监' },
  { id: 'CONT003', name: '李总' },
];

/** 计算报价项 */
const calculateItem = (product: Product, quantity: number, discount: number): QuoteItem => {
  const subtotal = product.unitPrice * quantity;
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxRate = 13;
  const tax = afterDiscount * (taxRate / 100);
  const total = afterDiscount + tax;

  return {
    id: `QI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    quoteId: '',
    productId: product.id,
    productName: product.name,
    productSku: product.sku,
    quantity,
    unit: product.unit,
    unitPrice: product.unitPrice,
    discount,
    discountType: DiscountType.PERCENTAGE,
    discountAmount: Math.round(discountAmount),
    subtotal: Math.round(subtotal),
    taxRate,
    tax: Math.round(tax),
    total: Math.round(total),
    sortOrder: 1,
  };
};

export function QuoteBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  
  const [currentStep, setCurrentStep] = React.useState(0);
  const [productSelectorOpen, setProductSelectorOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);
  
  // 基本信息
  const [customerInfo, setCustomerInfo] = React.useState({
    customerId: '',
    customerName: '',
    contactId: '',
    contactName: '',
    quoteNumber: `QT-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    validUntil: '',
    notes: '',
    terms: '',
  });
  
  // 报价项
  const [quoteItems, setQuoteItems] = React.useState<QuoteItem[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);

  /** 加载编辑数据 */
  React.useEffect(() => {
    if (id) {
      const quote = getQuoteById(id);
      if (quote) {
        setCustomerInfo({
          customerId: quote.customerId,
          customerName: quote.customerName,
          contactId: quote.contactId || '',
          contactName: quote.contactName || '',
          quoteNumber: quote.quoteNumber,
          validUntil: quote.validUntil,
          notes: quote.notes || '',
          terms: quote.terms || '',
        });
        setQuoteItems(quote.items);
      } else {
        toast({ title: '报价单不存在', variant: 'destructive' });
        navigate('/quotes');
      }
    }
  }, [id, navigate]);

  const steps = [
    { title: '客户信息', description: '设置客户和基本信息' },
    { title: '产品选择', description: '选择产品配置报价' },
    { title: '预览确认', description: '预览并确认报价单' },
  ];

  /** 客户选择 */
  const handleCustomerChange = (customerId: string) => {
    const customer = customerOptions.find(c => c.id === customerId);
    setCustomerInfo(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
    }));
  };

  /** 联系人选择 */
  const handleContactChange = (contactId: string) => {
    const contact = contactOptions.find(c => c.id === contactId);
    setCustomerInfo(prev => ({
      ...prev,
      contactId,
      contactName: contact?.name || '',
    }));
  };

  /** 产品选择确认 */
  const handleProductSelected = (products: Product[]) => {
    setSelectedProducts(products);
    const newItems = products.map(p => calculateItem(p, 1, 0));
    setQuoteItems(prev => [...prev, ...newItems]);
    setProductSelectorOpen(false);
    toast({ title: `已添加 ${products.length} 个产品`, variant: 'success' });
  };

  /** 报价项变化 */
  const handleItemsChange = (items: QuoteItem[]) => {
    setQuoteItems(items);
  };

  /** 计算总计 */
  const totals = React.useMemo(() => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = quoteItems.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalTax = quoteItems.reduce((sum, item) => sum + item.tax, 0);
    const grandTotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
    return { subtotal, totalDiscount, totalTax, grandTotal };
  }, [quoteItems]);

  /** 下一步 */
  const handleNext = () => {
    if (currentStep === 0) {
      if (!customerInfo.customerId) {
        toast({ title: '请选择客户', variant: 'destructive' });
        return;
      }
      if (!customerInfo.validUntil) {
        toast({ title: '请设置有效期', variant: 'destructive' });
        return;
      }
    }
    
    if (currentStep === 1) {
      if (quoteItems.length === 0) {
        toast({ title: '请添加至少一个产品', variant: 'destructive' });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  /** 上一步 */
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  /** 保存报价单 */
  const handleSave = () => {
    if (!customerInfo.customerId) {
      toast({ title: '请选择客户', variant: 'destructive' });
      return;
    }
    
    if (quoteItems.length === 0) {
      toast({ title: '请添加产品', variant: 'destructive' });
      return;
    }

    const quoteData = {
      customerId: customerInfo.customerId,
      customerName: customerInfo.customerName,
      contactId: customerInfo.contactId,
      contactName: customerInfo.contactName,
      quoteNumber: customerInfo.quoteNumber,
      status: QuoteStatus.DRAFT,
      validUntil: customerInfo.validUntil,
      items: quoteItems,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
      notes: customerInfo.notes,
      terms: customerInfo.terms,
      createdBy: 'USER001',
      createdByName: '当前用户',
    };

    if (isEdit && id) {
      updateQuote(id, quoteData);
      toast({ title: '报价单已更新', variant: 'success' });
    } else {
      createQuote(quoteData);
      toast({ title: '报价单已保存', variant: 'success' });
    }
    
    navigate('/quotes');
  };

  /** 导出 PDF */
  const handleExportPDF = () => {
    toast({ title: '正在生成 PDF...', description: '请稍候' });
    // TODO: 实际 PDF 导出逻辑
  };

  /** 取消 */
  const handleCancel = () => {
    navigate('/quotes');
  };

  return (
    <div className="space-y-6 p-6">
      {/* 顶部操作栏 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-bold">
                  {isEdit ? '编辑报价单' : '新建报价单'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {previewMode ? '关闭预览' : '预览'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 步骤条 */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <Separator orientation="horizontal" className="w-24 mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 gap-6">
        {/* 步骤 1: 客户信息 */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                客户信息
              </CardTitle>
              <CardDescription>
                设置报价单的基本信息和客户信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>报价单号</Label>
                  <Input
                    value={customerInfo.quoteNumber}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, quoteNumber: e.target.value }))}
                    placeholder="系统生成"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>有效期至 *</Label>
                  <Input
                    type="date"
                    value={customerInfo.validUntil}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>状态</Label>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    <Save className="h-3 w-3 mr-1" />
                    草稿
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>客户 *</Label>
                  <Select
                    value={customerInfo.customerId}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择客户" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerOptions.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>联系人</Label>
                  <Select
                    value={customerInfo.contactId}
                    onValueChange={handleContactChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择联系人" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactOptions.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground text-center py-4 border rounded-lg bg-muted/30">
                请选择客户并设置有效期后继续下一步
              </div>
            </CardContent>
          </Card>
        )}

        {/* 步骤 2: 产品选择 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button onClick={() => setProductSelectorOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                添加产品
              </Button>
              <Badge variant="secondary">
                已选择 {quoteItems.length} 项产品
              </Badge>
            </div>

            <QuoteCalculator items={quoteItems} onChange={handleItemsChange} />

            <ProductSelector
              open={productSelectorOpen}
              onClose={() => setProductSelectorOpen(false)}
              onSelected={handleProductSelected}
              selectedProducts={selectedProducts}
              customerId={customerInfo.customerId}
            />
          </div>
        )}

        {/* 步骤 3: 预览确认 */}
        {currentStep === 2 && (
          <QuotePreview
            quoteNumber={customerInfo.quoteNumber}
            customerName={customerInfo.customerName}
            contactName={customerInfo.contactName}
            validUntil={customerInfo.validUntil}
            items={quoteItems}
            subtotal={totals.subtotal}
            totalDiscount={totals.totalDiscount}
            totalTax={totals.totalTax}
            grandTotal={totals.grandTotal}
            notes={customerInfo.notes}
            terms={customerInfo.terms}
          />
        )}
      </div>

      {/* 底部操作按钮 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  上一步
                </Button>
              )}
              
              {currentStep < 2 ? (
                <Button onClick={handleNext}>
                  下一步
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    保存报价单
                  </Button>
                  <Button variant="outline" onClick={handleExportPDF}>
                    <FileDown className="h-4 w-4 mr-1" />
                    导出 PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuoteBuilderPage;