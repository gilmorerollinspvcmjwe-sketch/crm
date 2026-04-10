'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { mockCustomers } from '@/mock/customerData'
import { mockProducts } from '@/mock/cpqData'

import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react'

// Format helpers
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount)
}

const STEPS = [
  { id: 1, title: '基本信息', description: '填写报价单基本内容' },
  { id: 2, title: '选择产品', description: '选择报价产品和数量' },
  { id: 3, title: '确认提交', description: '确认报价单信息' },
]

interface QuoteItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  amount: number
}

export default function QuoteNew() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    customerId: '',
    validDays: 30,
    notes: '',
    items: [] as QuoteItem[],
  })

  // 计算金额
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount = formData.items.reduce(
    (sum, item) => sum + (item.unitPrice * item.quantity * item.discount) / 100,
    0
  )
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * 0.13
  const total = taxableAmount + taxAmount

  const handleCustomerChange = (customerId: string) => {
    setFormData({ ...formData, customerId })
  }

  const handleAddProduct = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (!product) return

    const existingItem = formData.items.find((i) => i.productId === productId)
    if (existingItem) return

    const newItem: QuoteItem = {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.basePrice || 0,
      discount: 0,
      amount: product.basePrice || 0,
    }
    setFormData({ ...formData, items: [...formData.items, newItem] })
  }

  const handleUpdateItem = (productId: string, updates: Partial<QuoteItem>) => {
    const items = formData.items.map((item) => {
      if (item.productId === productId) {
        const updated = { ...item, ...updates }
        updated.amount = updated.unitPrice * updated.quantity * (1 - updated.discount / 100)
        return updated
      }
      return item
    })
    setFormData({ ...formData, items })
  }

  const handleRemoveItem = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((i) => i.productId !== productId),
    })
  }

  const handleSubmit = () => {
    toast({ title: '提交成功', description: '报价单已创建' })
    navigate('/quote/list')
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="customer">客户 *</Label>
        <Select value={formData.customerId} onValueChange={handleCustomerChange}>
          <SelectTrigger id="customer">
            <SelectValue placeholder="选择客户" />
          </SelectTrigger>
          <SelectContent>
            {mockCustomers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="validDays">有效期（天）</Label>
        <Input
          id="validDays"
          type="number"
          value={formData.validDays}
          onChange={(e) => setFormData({ ...formData, validDays: parseInt(e.target.value) || 30 })}
        />
      </div>

      <div>
        <Label htmlFor="notes">备注</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="添加备注信息..."
          rows={4}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* 添加产品 */}
      <Card>
        <CardHeader>
          <CardTitle>添加产品</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleAddProduct}>
            <SelectTrigger>
              <SelectValue placeholder="选择产品添加到报价单" />
            </SelectTrigger>
            <SelectContent>
              {mockProducts
                .filter((p) => !formData.items.some((i) => i.productId === p.id))
                .map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.basePrice || 0)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 已选产品 */}
      <Card>
        <CardHeader>
          <CardTitle>已选产品</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.items.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              请从上方选择产品
            </p>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item) => (
                <div key={item.productId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        单价: {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">数量</Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.productId, {
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">折扣 (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={item.discount}
                        onChange={(e) =>
                          handleUpdateItem(item.productId, {
                            discount: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">金额</Label>
                      <p className="font-medium py-2">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderStep3 = () => {
    const customer = mockCustomers.find((c) => c.id === formData.customerId)
    const validFrom = new Date()
    const validUntil = new Date(validFrom.getTime() + formData.validDays * 24 * 60 * 60 * 1000)

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">客户</Label>
              <p className="font-medium">{customer?.name || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">有效期</Label>
              <p className="font-medium">{formData.validDays} 天</p>
            </div>
            <div>
              <Label className="text-muted-foreground">报价日期</Label>
              <p className="font-medium">{validFrom.toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">到期日期</Label>
              <p className="font-medium">{validUntil.toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>产品明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">产品</th>
                    <th className="px-4 py-3 text-right text-sm">数量</th>
                    <th className="px-4 py-3 text-right text-sm">单价</th>
                    <th className="px-4 py-3 text-right text-sm">折扣</th>
                    <th className="px-4 py-3 text-right text-sm">金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {formData.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-4 py-3">{item.productName}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-right">
                        {item.discount ? `${item.discount}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>金额汇总</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">产品金额</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">折扣</span>
                <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">税额 (13%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>总计</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>

        {formData.notes && (
          <Card>
            <CardHeader>
              <CardTitle>备注</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{formData.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">新建报价单</h1>
          <p className="text-muted-foreground">创建新的客户报价单</p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-4">
        {STEPS.map((step) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-muted'
              }`}
            >
              {currentStep > step.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="font-medium">{step.id}</span>
              )}
              <span>{step.title}</span>
            </button>
            {step.id < STEPS.length && (
              <div className="w-12 h-0.5 bg-border mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* 步骤内容 */}
      <div className="max-w-3xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-between max-w-3xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          上一步
        </Button>
        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
            disabled={
              (currentStep === 1 && !formData.customerId) ||
              (currentStep === 2 && formData.items.length === 0)
            }
          >
            下一步
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Check className="h-4 w-4 mr-2" />
            提交报价单
          </Button>
        )}
      </div>
    </div>
  )
}
