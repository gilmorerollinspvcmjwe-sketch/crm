"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft, Edit, FileCheck, Printer, Copy, Send, Trash2, MoreHorizontal,
  Building, User, Calendar, FileText, Clock, CheckCircle, XCircle,
  AlertCircle, Share2, Download, DollarSign, ChevronDown, ChevronUp,
  LayoutDashboard as LayoutDashboardIcon, MessageSquare, Receipt
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"

// ============ Types ============

type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'revised'

interface QuoteItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  customerName: string
  contactName: string
  title: string
  status: QuoteStatus
  validUntil: string
  opportunityName: string
  createdByName: string
  createdAt: string
  updatedAt: string
  subtotal: number
  totalDiscount: number
  totalTax: number
  grandTotal: number
  notes: string
  terms: string
  items: QuoteItem[]
  convertedToContractId?: string
}

// ============ Status Config ============

const statusConfig: Record<QuoteStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "draft": { label: "草稿", className: "bg-gray-100 text-gray-800 border-gray-200", variant: "secondary" },
  "sent": { label: "已发送", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "accepted": { label: "已接受", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "rejected": { label: "已拒绝", className: "bg-red-100 text-red-800 border-red-200", variant: "destructive" },
  "expired": { label: "已过期", className: "bg-orange-100 text-orange-800 border-orange-200", variant: "warning" },
  "revised": { label: "已修订", className: "bg-purple-100 text-purple-800 border-purple-200", variant: "secondary" },
}

// ============ Status Badge ============

function StatusBadge({ status }: { status: QuoteStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}

// ============ Format Currency ============

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount)
}

// ============ Mock Data ============

const mockQuote: Quote = {
  id: "Q001",
  quoteNumber: "QT-2024-001",
  customerId: "C001",
  customerName: "北京科技有限公司",
  contactName: "张经理",
  title: "企业版年度订阅报价",
  status: "sent",
  validUntil: "2024-02-20",
  opportunityName: "2024年度合作项目",
  createdByName: "张三",
  createdAt: "2024-01-15 10:30",
  updatedAt: "2024-01-16 14:20",
  subtotal: 128000,
  totalDiscount: 12800,
  totalTax: 11520,
  grandTotal: 126720,
  notes: "此报价为年度订阅费用，包含所有功能模块和技术支持服务。",
  terms: "1. 付款方式：预付年费\n2. 交付周期：合同签订后5个工作日内完成部署\n3. 售后服务：7x24小时技术支持",
  items: [
    { id: "1", name: "企业版年度订阅", quantity: 1, unitPrice: 100000, discount: 10, subtotal: 90000 },
    { id: "2", name: "定制开发服务", quantity: 1, unitPrice: 30000, discount: 10, subtotal: 27000 },
    { id: "3", name: "培训服务", quantity: 2, unitPrice: 5500, discount: 0, subtotal: 11000 },
  ],
}

// ============ QuoteDetail Page ============

export function QuoteDetailPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [quote, setQuote] = React.useState<Quote>(mockQuote)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [itemsExpanded, setItemsExpanded] = React.useState(true)
  const [customerExpanded, setCustomerExpanded] = React.useState(true)
  const [historyExpanded, setHistoryExpanded] = React.useState(true)

  // Mock customer data
  const customerData = {
    id: "C001",
    name: "北京科技有限公司",
    industry: "互联网",
    contact: "张经理",
    phone: "010-12345678",
    email: "zhang@crm-example.com",
  }

  // Mock history data
  const historyData = [
    { id: "1", action: "创建报价单", user: "张三", time: "2024-01-15 10:30", detail: "创建报价单 QT-2024-001" },
    { id: "2", action: "修改报价", user: "张三", time: "2024-01-16 14:20", detail: "调整报价金额" },
    { id: "3", action: "发送报价", user: "张三", time: "2024-01-16 15:00", detail: "发送报价单给客户" },
  ]

  // Handlers
  const handleBack = () => {
    navigate("/quotes")
  }

  const handleEdit = () => {
    navigate(`/quotes/${quote.id}/edit`)
  }

  const handleSend = () => {
    setQuote(prev => ({ ...prev, status: "sent" }))
    toast({
      title: t("quote.sentSuccess", "报价单已发送"),
      description: `报价单 ${quote.quoteNumber} 已发送给客户`,
    })
  }

  const handleCopy = () => {
    toast({
      title: t("quote.copied", "报价单已复制"),
      description: `新的报价单已基于 ${quote.quoteNumber} 创建`,
    })
    navigate("/quotes/new?copy=" + quote.id)
  }

  const handleConvertToContract = () => {
    toast({
      title: t("quote.toContract", "正在转换为合同"),
      description: "报价单正在转换为合同，请稍候...",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleVoid = () => {
    toast({
      title: t("quote.voided", "报价单已作废"),
      description: `报价单 ${quote.quoteNumber} 已作废`,
    })
    navigate("/quotes")
  }

  const handleDelete = () => {
    toast({
      title: t("quote.deleted", "报价单已删除"),
    })
    navigate("/quotes")
  }

  // Check if quote is still valid
  const isExpired = new Date(quote.validUntil) < new Date() && quote.status !== 'accepted' && quote.status !== 'rejected'

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{quote.quoteNumber}</span>}
            actions={
              <div className="flex items-center gap-2">
                <StatusBadge status={quote.status} />
                {isExpired && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    已过期
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-1" />
                  {t("common.edit", "编辑")}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  分享
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopy}><Copy className="w-4 h-4 mr-2" />复制</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出</DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint}><Printer className="w-4 h-4 mr-2" />打印</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                  {t("common.delete", "删除")}
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Quote Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-slate-900 truncate">{quote.quoteNumber}</h2>
                    </div>
                    <div className="text-sm text-slate-600 truncate">{quote.title}</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Grand Total */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">报价总额</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      {formatCurrency(quote.grandTotal)}
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">小计</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(quote.subtotal)}
                    </div>
                  </div>

                  {/* Valid Until */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">有效期至</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {quote.validUntil}
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">创建人</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {quote.createdByName}
                    </div>
                  </div>
                </div>

                {/* Discount & Tax Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">折扣</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(quote.totalDiscount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">税费</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(quote.totalTax)}</span>
                  </div>
                </div>

                <Separator />

                {/* Detailed Information */}
                <div className="space-y-3">
                  {/* Customer */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">客户</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{quote.customerName}</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">联系人</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{quote.contactName}</span>
                    </div>
                  </div>

                  {/* Opportunity */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">关联商机</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{quote.opportunityName || "-"}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {quote.notes && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">备注</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{quote.notes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {quote.status === 'draft' && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleSend}>
                        <Send className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-blue-500" />
                        <span className="truncate">发送报价</span>
                      </Button>
                    )}
                    {(quote.status === 'sent' || quote.status === 'accepted') && !quote.convertedToContractId && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleConvertToContract}>
                        <FileCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-green-500" />
                        <span className="truncate">转合同</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleCopy}>
                      <Copy className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">复制</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handlePrint}>
                      <Printer className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">打印</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Customer Info */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={customerExpanded} onOpenChange={setCustomerExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">客户信息</span>
                      </div>
                      {customerExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                              {customerData.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{customerData.name}</p>
                            <p className="text-xs text-slate-500">{customerData.industry}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="text-slate-600">联系人</span>
                            <span className="font-medium text-slate-900">{customerData.contact}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="text-slate-600">电话</span>
                            <span className="font-medium text-slate-900">{customerData.phone}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="text-slate-600">邮箱</span>
                            <span className="font-medium text-slate-900">{customerData.email}</span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="p-2 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/customers/${customerData.id}`)}
                        className="w-full justify-center text-slate-600"
                      >
                        查看客户详情
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Quote Items Summary */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={itemsExpanded} onOpenChange={setItemsExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900">报价明细</span>
                        <Badge variant="secondary" className="text-xs">{quote.items.length}</Badge>
                      </div>
                      {itemsExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {quote.items.map((item) => (
                          <div key={item.id} className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-medium text-sm text-slate-900 truncate flex-1">
                                {item.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs flex-shrink-0 bg-slate-50 text-slate-700 border-slate-200"
                              >
                                x{item.quantity}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">单价: {formatCurrency(item.unitPrice)}</span>
                              <span className="font-semibold text-emerald-600">{formatCurrency(item.subtotal)}</span>
                            </div>
                            {item.discount > 0 && (
                              <div className="text-xs text-red-500 mt-0.5">折扣: {item.discount}%</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* History */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={historyExpanded} onOpenChange={setHistoryExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold text-slate-900">操作历史</span>
                        <Badge variant="secondary" className="text-xs">{historyData.length}</Badge>
                      </div>
                      {historyExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {historyData.map((item) => (
                          <div key={item.id} className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-medium text-sm text-slate-900">{item.action}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{item.detail}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <User className="w-3 h-3" />
                              <span>{item.user}</span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{item.time}</span>
                            </div>
                          </div>
                        ))}
                        {historyData.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无操作记录
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </>
        }
      >
        {/* Main Content Area with Professional Tabs */}
        <div className="h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start bg-white border-b border-slate-200 rounded-none h-auto p-0 gap-1 px-6 py-3">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <LayoutDashboardIcon className="w-4 h-4" />
                <span>概览</span>
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <FileText className="w-4 h-4" />
                <span>报价明细</span>
                <Badge variant="secondary" className="ml-1 text-xs">{quote.items.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <FileCheck className="w-4 h-4" />
                <span>条款与备注</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">报价总额</p>
                          <p className="text-xl font-bold text-emerald-600">{formatCurrency(quote.grandTotal)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Receipt className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">小计</p>
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(quote.subtotal)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">折扣</p>
                          <p className="text-xl font-bold text-red-600">-{formatCurrency(quote.totalDiscount)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">有效期至</p>
                          <p className="text-xl font-bold text-purple-600">{quote.validUntil}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quote Summary Card */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">报价摘要</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">报价单号</p>
                          <p className="font-medium text-slate-900">{quote.quoteNumber}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">状态</p>
                          <StatusBadge status={quote.status} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">客户</p>
                          <p className="font-medium text-slate-900">{quote.customerName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">联系人</p>
                          <p className="font-medium text-slate-900">{quote.contactName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">关联商机</p>
                          <p className="font-medium text-slate-900">{quote.opportunityName || "-"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">创建人</p>
                          <p className="font-medium text-slate-900">{quote.createdByName}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">报价明细</h3>
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">序号</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">名称</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">数量</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">单价</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">折扣</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">小计</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {quote.items.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-600 text-right">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-slate-600 text-right">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-3 text-sm text-red-600 text-right">
                                {item.discount > 0 ? `-${item.discount}%` : "-"}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-emerald-600 text-right">
                                {formatCurrency(item.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200">
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">小计</td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">{formatCurrency(quote.subtotal)}</td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">折扣</td>
                            <td className="px-4 py-3 text-sm font-semibold text-red-600 text-right">-{formatCurrency(quote.totalDiscount)}</td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">税费</td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">{formatCurrency(quote.totalTax)}</td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-lg font-bold text-slate-900 text-right">总计</td>
                            <td className="px-4 py-3 text-lg font-bold text-emerald-600 text-right">{formatCurrency(quote.grandTotal)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Terms Tab */}
            <TabsContent value="terms" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">备注</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {quote.notes || "无备注"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">条款</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {quote.terms || "无条款"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("quote.deleteTitle", "确认删除")}
        content={t("quote.deleteContent", "删除后数据将无法恢复，确定要删除该报价单吗？")}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
      />
    </div>
  )
}

export default QuoteDetailPage
