/**
 * 报价单生成对话框组件
 * Quote Generation Dialog - Generate quotes from opportunity data
 */

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Calculator, Package, User, Calendar, Save } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'

import { Product, ProductSelection, QuoteRequest, DiscountType, Quote, QuoteStatus, QuoteItem } from '@/types/cpq'
import { Opportunity } from '@/types/opportunity'
import { ProductSelector } from '@/components/CPQ/ProductSelector'
import { QuoteCalculator } from '@/components/CPQ/QuoteCalculator'
import { QuotePreview } from '@/components/CPQ/QuotePreview'

interface QuoteGenerationDialogProps {
  /** 对话框是否打开 */
  open: boolean
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void
  /** 商机对象 */
  opportunity: Opportunity
  /** 生成成功回调 */
  onSuccess?: (quote: Quote) => void
  /** 取消回调 */
  onCancel?: () => void
}

/** 报价单草稿状态 */
interface QuoteDraft {
  /** 选择的产品列表 */
  products: ProductSelection[]
  /** 整单折扣 */
  discount: number
  /** 折扣类型 */
  discountType: DiscountType
  /** 备注 */
  notes: string
  /** 条款 */
  terms: string
  /** 有效期天数 */
  validDays: number
  /** 模板 ID */
  templateId?: string
}

/** 步骤枚举 */
type GenerationStep = 'select-products' | 'configure' | 'preview'

export const QuoteGenerationDialog: React.FC<QuoteGenerationDialogProps> = ({
  open,
  onOpenChange,
  opportunity,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState<GenerationStep>('select-products')
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // 报价单草稿
  const [draft, setDraft] = useState<QuoteDraft>({
    products: [],
    discount: 0,
    discountType: DiscountType.PERCENTAGE,
    notes: '',
    terms: '',
    validDays: 30,
  })

  // 重置状态
  useEffect(() => {
    if (open) {
      setCurrentStep('select-products')
      setDraft({
        products: [],
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        notes: '',
        terms: '',
        validDays: 30,
      })
    }
  }, [open])

  /** 添加产品 */
  const handleAddProducts = useCallback((products: Product[]) => {
    const newProducts: ProductSelection[] = products.map((p) => ({
      productId: p.id,
      productName: p.name,
      quantity: 1,
      unitPrice: p.unitPrice,
      unit: p.unit,
      discount: 0,
      discountType: DiscountType.PERCENTAGE,
    }))
    
    setDraft((prev) => ({
      ...prev,
      products: [...prev.products, ...newProducts],
    }))
    
    setIsProductSelectorOpen(false)
    toast({
      title: '产品已添加',
      description: `已添加 ${products.length} 个产品到报价单`,
    })
  }, [])

  /** 移除产品 */
  const handleRemoveProduct = useCallback((productId: string) => {
    setDraft((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.productId !== productId),
    }))
  }, [])

  /** 更新产品数量 */
  const handleUpdateProductQuantity = useCallback((productId: string, quantity: number) => {
    setDraft((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      ),
    }))
  }, [])

  /** 更新产品折扣 */
  const handleUpdateProductDiscount = useCallback((productId: string, discount: number) => {
    setDraft((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.productId === productId ? { ...p, discount: Math.min(100, Math.max(0, discount)) } : p
      ),
    }))
  }, [])

  /** 生成报价单 */
  const handleGenerateQuote = useCallback(async () => {
    if (draft.products.length === 0) {
      toast({
        title: '请选择产品',
        description: '至少需要选择一个产品才能生成报价单',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)

    try {
      // 构建报价单请求
      const quoteRequest: QuoteRequest = {
        customerId: opportunity.customerId,
        contactId: opportunity.contactId,
        opportunityId: opportunity.id,
        validUntil: new Date(Date.now() + draft.validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: draft.products,
        notes: draft.notes,
        terms: draft.terms,
        discount: draft.discount > 0 ? draft.discount : undefined,
        discountType: draft.discount > 0 ? draft.discountType : undefined,
      }

      // TODO: 调用 API 创建报价单
      // const response = await createQuote(quoteRequest)
      
      // 模拟创建成功
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const newQuote: Quote = {
        id: `quote_${Date.now()}`,
        quoteNumber: `QT-${Date.now()}`,
        customerId: opportunity.customerId,
        customerName: opportunity.customerName || '',
        contactId: opportunity.contactId,
        contactName: opportunity.contactName,
        opportunityId: opportunity.id,
        opportunityName: opportunity.name,
        status: QuoteStatus.DRAFT,
        validUntil: quoteRequest.validUntil,
        items: draft.products.map((p, index) => ({
          id: `item_${index}`,
          quoteId: `quote_${Date.now()}`,
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantity,
          unit: p.unit || '个',
          unitPrice: p.unitPrice,
          discount: p.discount || 0,
          discountType: p.discountType || DiscountType.PERCENTAGE,
          discountAmount: (p.unitPrice * p.quantity * (p.discount || 0)) / 100,
          subtotal: p.unitPrice * p.quantity * (1 - (p.discount || 0) / 100),
          taxRate: 0.13,
          tax: 0,
          total: 0,
          sortOrder: index,
        })),
        subtotal: draft.products.reduce((sum, p) => sum + p.unitPrice * p.quantity * (1 - (p.discount || 0) / 100), 0),
        totalDiscount: draft.products.reduce((sum, p) => sum + (p.unitPrice * p.quantity * (p.discount || 0)) / 100, 0),
        totalTax: 0,
        grandTotal: 0,
        version: 1,
        createdBy: 'current_user',
        createdByName: '当前用户',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // 计算税费和总计
      newQuote.items = newQuote.items.map((item) => ({
        ...item,
        tax: item.subtotal * item.taxRate,
        total: item.subtotal + item.tax,
      }))
      newQuote.totalTax = newQuote.items.reduce((sum, item) => sum + item.tax, 0)
      newQuote.grandTotal = newQuote.items.reduce((sum, item) => sum + item.total, 0)

      toast({
        title: '报价单已生成',
        description: `报价单号：${newQuote.quoteNumber}`,
      })

      onSuccess?.(newQuote)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: '生成失败',
        description: '创建报价单时出错，请重试',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }, [draft, opportunity, onSuccess, onOpenChange])

  /** 步骤导航 */
  const steps: { key: GenerationStep; label: string; icon: React.ReactNode }[] = [
    { key: 'select-products', label: '选择产品', icon: <Package className="h-4 w-4" /> },
    { key: 'configure', label: '配置报价', icon: <Calculator className="h-4 w-4" /> },
    { key: 'preview', label: '预览', icon: <Save className="h-4 w-4" /> },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              从商机生成报价单
            </DialogTitle>
            <DialogDescription>
              商机：{opportunity.name} | 客户：{opportunity.customerName}
            </DialogDescription>
          </DialogHeader>

          {/* 步骤指示器 */}
          <div className="flex items-center gap-2 py-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <Button
                  variant={currentStep === step.key ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    if (index <= currentStepIndex) {
                      setCurrentStep(step.key)
                    }
                  }}
                  disabled={index > currentStepIndex}
                >
                  <span className="mr-1">{step.icon}</span>
                  {step.label}
                </Button>
                {index < steps.length - 1 && (
                  <Separator orientation="vertical" className="h-8" />
                )}
              </React.Fragment>
            ))}
          </div>

          <ScrollArea className="flex-1 pr-4">
            {/* 步骤 1: 选择产品 */}
            {currentStep === 'select-products' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>已选产品</span>
                      <Button
                        size="sm"
                        onClick={() => setIsProductSelectorOpen(true)}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        添加产品
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {draft.products.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>暂无产品</p>
                        <p className="text-sm">点击"添加产品"按钮选择产品</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {draft.products.map((product) => (
                          <div
                            key={product.productId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{product.productName}</div>
                              <div className="text-sm text-muted-foreground">
                                单价：¥{product.unitPrice.toFixed(2)} | 数量：{product.quantity} {product.unit || '个'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleUpdateProductQuantity(
                                    product.productId,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-20"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(product.productId)}
                              >
                                <span className="text-muted-foreground">×</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 步骤 2: 配置报价 */}
            {currentStep === 'configure' && (
              <div className="space-y-4">
                <QuoteCalculator
                  products={draft.products.map((p, index) => ({
                    id: `item_${index}`,
                    quoteId: '',
                    productId: p.productId,
                    productName: p.productName,
                    quantity: p.quantity,
                    unit: p.unit || '个',
                    unitPrice: p.unitPrice,
                    discount: p.discount || 0,
                    discountType: p.discountType || DiscountType.PERCENTAGE,
                    discountAmount: 0,
                    subtotal: 0,
                    taxRate: 0.13,
                    tax: 0,
                    total: 0,
                    sortOrder: index,
                  }))}
                  onChange={(items: QuoteItem[]) => {
                    setDraft((prev) => ({
                      ...prev,
                      products: items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        unit: item.unit,
                        discount: item.discount,
                        discountType: item.discountType,
                      })),
                    }))
                  }}
                />

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">其他配置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>有效期（天）</Label>
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={draft.validDays}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              validDays: parseInt(e.target.value) || 30,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>报价模板</Label>
                        <Select
                          value={draft.templateId}
                          onValueChange={(value) =>
                            setDraft((prev) => ({ ...prev, templateId: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择模板" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">默认模板</SelectItem>
                            <SelectItem value="simple">简洁模板</SelectItem>
                            <SelectItem value="detailed">详细模板</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={draft.notes}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        placeholder="添加报价单备注..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>条款和条件</Label>
                      <Textarea
                        value={draft.terms}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, terms: e.target.value }))
                        }
                        placeholder="添加付款条款、交付条款等..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 步骤 3: 预览 */}
            {currentStep === 'preview' && (
              <QuotePreview
                quoteNumber="草稿"
                customerName={opportunity.customerName}
                contactName={opportunity.contactName}
                validUntil={new Date(Date.now() + draft.validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                status={QuoteStatus.DRAFT}
                products={draft.products.map((p, index) => ({
                  id: `item_${index}`,
                  quoteId: '',
                  productId: p.productId,
                  productName: p.productName,
                  quantity: p.quantity,
                  unit: p.unit || '个',
                  unitPrice: p.unitPrice,
                  discount: p.discount || 0,
                  discountType: p.discountType || DiscountType.PERCENTAGE,
                  discountAmount: (p.unitPrice * p.quantity * (p.discount || 0)) / 100,
                  subtotal: p.unitPrice * p.quantity * (1 - (p.discount || 0) / 100),
                  taxRate: 0.13,
                  tax: 0,
                  total: 0,
                  sortOrder: index,
                }))}
                subtotal={draft.products.reduce((sum, p) => sum + p.unitPrice * p.quantity * (1 - (p.discount || 0) / 100), 0)}
                totalDiscount={draft.products.reduce((sum, p) => sum + (p.unitPrice * p.quantity * (p.discount || 0)) / 100, 0)}
                totalTax={0}
                grandTotal={draft.products.reduce((sum, p) => sum + p.unitPrice * p.quantity * (1 - (p.discount || 0) / 100), 0)}
                notes={draft.notes}
                terms={draft.terms}
              />
            )}
          </ScrollArea>

          <DialogFooter className="gap-2">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(steps[currentStepIndex - 1].key)}
              >
                上一步
              </Button>
            )}
            {currentStepIndex < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(steps[currentStepIndex + 1].key)}
                disabled={draft.products.length === 0}
              >
                下一步
              </Button>
            ) : (
              <Button onClick={handleGenerateQuote} disabled={isGenerating}>
                {isGenerating ? '生成中...' : '生成报价单'}
              </Button>
            )}
            <Button variant="ghost" onClick={() => { onCancel?.(); onOpenChange(false); }}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 产品选择器对话框 */}
      <ProductSelector
        open={isProductSelectorOpen}
        onClose={() => setIsProductSelectorOpen(false)}
        onSelected={handleAddProducts}
        selectedProducts={draft.products.map((p) => ({
          id: p.productId,
          name: p.productName,
          category: 'software' as any,
          unitPrice: p.unitPrice,
          unit: p.unit || '个',
          description: '',
          sku: '',
          inStock: true,
        }))}
      />
    </>
  )
}

export default QuoteGenerationDialog
