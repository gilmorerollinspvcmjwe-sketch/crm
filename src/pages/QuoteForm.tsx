/**
 * QuoteForm - 报价单表单页
 * Quote Form Page (Create / Edit / Clone)
 */

import * as React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Save,
  Send,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Types
import type { QuoteItem } from '@/types/cpq'
import { QuoteStatus, QuoteStatusLabels } from '@/types/cpq'

// CPQ Components
import { QuoteCalculator } from '@/components/CPQ/QuoteCalculator'

// ============ Mock Data ============

const customerOptions = [
  { id: 'C001', name: '北京科技创新有限公司' },
  { id: 'C002', name: '上海智能制造有限公司' },
  { id: 'C003', name: '广州金融服务有限公司' },
  { id: 'C004', name: '深圳电子商务有限公司' },
  { id: 'C005', name: '杭州网络技术有限公司' },
]

const contactOptions = [
  { id: 'CONT001', name: '张经理' },
  { id: 'CONT002', name: '王总监' },
  { id: 'CONT003', name: '李总' },
  { id: 'CONT004', name: '陈经理' },
]

const opportunityOptions = [
  { id: 'OP001', name: 'CRM 系统采购项目' },
  { id: 'OP002', name: 'AI 助手模块采购' },
  { id: 'OP003', name: '系统升级项目' },
]

// ============ Generate Quote Number ============

function generateQuoteNumber(): string {
  const year = new Date().getFullYear()
  const seq = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `QT-${year}-${seq}`
}

// ============ Quote Form Page ============

export function QuoteForm() {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const quoteId = params.id
  const isEditMode = location.pathname.includes('/edit')
  const isCloneMode = location.pathname.includes('/clone')
  const isNewMode = !quoteId || location.pathname === '/quote/new'

  // Form State
  const [formData, setFormData] = React.useState({
    quoteNumber: isNewMode ? generateQuoteNumber() : '',
    customerId: '',
    customerName: '',
    contactId: '',
    opportunityId: '',
    status: QuoteStatus.DRAFT,
    validUntil: '',
    notes: '',
    terms: '',
  })

  const [quoteItems, setQuoteItems] = React.useState<QuoteItem[]>([])

  // Load existing quote data for edit/clone
  React.useEffect(() => {
    if (quoteId && (isEditMode || isCloneMode)) {
      // Mock: Load quote data
      // In real app, fetch from API
      setFormData({
        quoteNumber: isCloneMode ? generateQuoteNumber() : 'QT-2024-001',
        customerId: 'C001',
        customerName: '北京科技创新有限公司',
        contactId: 'CONT001',
        opportunityId: 'OP001',
        status: isCloneMode ? QuoteStatus.DRAFT : QuoteStatus.SENT,
        validUntil: '2024-05-15',
        notes: '首次合作客户，给予一定折扣优惠',
        terms: '付款方式：合同签订后30日内支付50%',
      })
      setQuoteItems([
        {
          id: 'item-001',
          quoteId: quoteId || '',
          productId: 'P001',
          productName: 'CRM 企业版订阅',
          productSku: 'CRM-ENT-001',
          quantity: 1,
          unit: '年',
          unitPrice: 50000,
          discount: 10,
          discountType: CPQDiscountType.PERCENTAGE,
          discountAmount: 5000,
          subtotal: 45000,
          taxRate: 6,
          tax: 2700,
          total: 47700,
          sortOrder: 1,
        },
        {
          id: 'item-002',
          quoteId: quoteId || '',
          productId: 'P002',
          productName: '数据分析模块',
          productSku: 'DATA-ANAL-001',
          quantity: 1,
          unit: '年',
          unitPrice: 20000,
          discount: 0,
          discountType: CPQDiscountType.PERCENTAGE,
          discountAmount: 0,
          subtotal: 20000,
          taxRate: 6,
          tax: 1200,
          total: 21200,
          sortOrder: 2,
        },
      ])
    }
  }, [quoteId, isEditMode, isCloneMode])

  // Handlers
  const handleBack = () => {
    navigate('/quote/list')
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomerChange = (customerId: string) => {
    const customer = customerOptions.find(c => c.id === customerId)
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
    }))
  }

  const handleSave = () => {
    if (!formData.customerId) {
      toast({
        title: '请选择客户',
        variant: 'destructive',
      })
      return
    }
    if (quoteItems.length === 0) {
      toast({
        title: '请添加产品',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: isEditMode ? '报价单已更新' : '报价单已保存',
      description: formData.quoteNumber,
    })
    navigate('/quote/list')
  }

  const handleSaveAndSend = () => {
    handleSave()
    toast({
      title: '报价单已发送至客户',
    })
  }

  // Page title
  const pageTitle = isEditMode 
    ? '编辑报价单' 
    : isCloneMode 
      ? '复制报价单' 
      : '新建报价单'

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <p className="text-muted-foreground">{formData.quoteNumber || '待生成编号'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存草稿
            </Button>
            <Button onClick={handleSaveAndSend}>
              <Send className="h-4 w-4 mr-2" />
              保存并发送
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quoteNumber">报价单号</Label>
                <Input
                  id="quoteNumber"
                  value={formData.quoteNumber}
                  onChange={(e) => handleFieldChange('quoteNumber', e.target.value)}
                  placeholder="自动生成"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleFieldChange('status', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QuoteStatus.DRAFT}>{QuoteStatusLabels[QuoteStatus.DRAFT]}</SelectItem>
                    <SelectItem value={QuoteStatus.SENT}>{QuoteStatusLabels[QuoteStatus.SENT]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">有效期至</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => handleFieldChange('validUntil', e.target.value)}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Customer Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerId">客户 *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactId">联系人</Label>
                <Select
                  value={formData.contactId}
                  onValueChange={(v) => handleFieldChange('contactId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择联系人" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunityId">关联商机</Label>
                <Select
                  value={formData.opportunityId}
                  onValueChange={(v) => handleFieldChange('opportunityId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择商机" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Items - Using QuoteCalculator Component */}
        <QuoteCalculator
          items={quoteItems}
          onChange={(items) => setQuoteItems(items)}
        />

        {/* Notes & Terms */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">备注</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="输入备注信息..."
                rows={4}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">条款与条件</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.terms}
                onChange={(e) => handleFieldChange('terms', e.target.value)}
                placeholder="输入付款条款、交付条件等..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default QuoteForm