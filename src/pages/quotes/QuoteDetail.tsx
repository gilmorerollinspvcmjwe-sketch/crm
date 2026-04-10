'use client'

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { mockQuotes } from '@/mock/cpqData'
import { mockCustomers } from '@/mock/customerData'
import { QuoteToContractButton } from '@/components/quotes/QuoteToContractButton'

// Format helpers
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
import {
  ArrowLeft,
  Building2,
  Calendar as CalendarIcon,
  Clock,
  Copy,
  Download,
  Edit,
  Mail,
  MoreHorizontal,
  Send,
  Trash2,
  User,
  XCircle,
} from 'lucide-react'
import { CalendarIcon as CalendarIconLucide } from 'lucide-react'

const QUOTE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500',
  sent: 'bg-blue-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
  expired: 'bg-yellow-500',
  revised: 'bg-purple-500',
}

export default function QuoteDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const quoteId = params.id as string

  // 模拟数据
  const quote = mockQuotes.find((q) => q.id === quoteId) || mockQuotes[0]
  const customer = mockCustomers.find((c) => c.id === quote.customerId) || mockCustomers[0]

  const [isEditing, setIsEditing] = useState(false)

  const handleSend = () => {
    toast({ title: '发送成功', description: '报价单已发送' })
  }

  const handleClone = () => {
    toast({ title: '已复制', description: '报价单已复制为草稿' })
    navigate('/quote/new')
  }

  const handleExport = () => {
    toast({ title: '导出成功', description: 'PDF 正在生成' })
  }

  const handleCancel = () => {
    toast({ title: '已作废', description: '报价单已标记为作废' })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">报价单详情</h1>
              <Badge className={cn('text-white', QUOTE_STATUS_COLORS[quote.status])}>
                {quote.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {quote.quoteNumber} | 创建于 {formatDate(quote.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quote.status === 'draft' && (
            <>
              <Button variant="outline" onClick={handleClone}>
                <Copy className="h-4 w-4 mr-2" />
                复制
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Button>
              <Button onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                发送
              </Button>
            </>
          )}
          {quote.status === 'sent' && (
            <>
              <Button variant="outline" onClick={handleClone}>
                <Copy className="h-4 w-4 mr-2" />
                新建版本
              </Button>
              <QuoteToContractButton quote={quote} variant="outline" />
              <Button variant="destructive" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                作废
              </Button>
            </>
          )}
          {quote.status === 'accepted' && (
            <>
              <QuoteToContractButton quote={quote} />
              <Button variant="outline" onClick={handleClone}>
                <Copy className="h-4 w-4 mr-2" />
                新建版本
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                导出PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                发送邮件
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧 - 主要信息 */}
        <div className="col-span-2 space-y-6">
          {/* 客户信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                客户信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">客户名称</Label>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">联系人</Label>
                  <p className="font-medium">{customer.contactName || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">联系电话</Label>
                  <p className="font-medium">{customer.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">邮箱</Label>
                  <p className="font-medium">{customer.email || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 产品明细 */}
          <Card>
            <CardHeader>
              <CardTitle>产品明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">产品名称</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">数量</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">单价</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">折扣</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">金额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {quote.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">{item.productName}</td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right">
                          {item.discount ? `${item.discount}%` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(item.amount || 0)}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          暂无产品
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧 - 汇总信息 */}
        <div className="space-y-6">
          {/* 金额汇总 */}
          <Card>
            <CardHeader>
              <CardTitle>金额汇总</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">产品金额</span>
                <span>{formatCurrency(quote.subtotal || 0)}</span>
              </div>
              {quote.discountAmount && quote.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">折扣</span>
                  <span className="text-red-500">-{formatCurrency(quote.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">税率 ({quote.taxRate || 0}%)</span>
                <span>{formatCurrency(quote.taxAmount || 0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>总计</span>
                <span className="text-primary">{formatCurrency(quote.total || 0)}</span>
              </div>
            </CardContent>
          </Card>

          {/* 有效期 */}
          <Card>
            <CardHeader>
              <CardTitle>有效期</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">报价日期</Label>
                <p className="font-medium">{formatDate(quote.validFrom || quote.createdAt)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">有效期至</Label>
                <p className="font-medium">{formatDate(quote.validUntil)}</p>
              </div>
            </CardContent>
          </Card>

          {/* 备注 */}
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle>备注</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {quote.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
