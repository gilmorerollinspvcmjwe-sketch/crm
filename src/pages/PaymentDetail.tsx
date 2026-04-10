"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, CheckCircle, RotateCcw, CreditCard, User, Calendar, DollarSign, FileText, Building, ChevronDown, ChevronUp, MoreHorizontal, Share2, Copy, Download, Printer, Clock, Receipt } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Modal } from "@/components/modal/Dialog"
import { PaymentForm } from "@/forms/PaymentForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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

import type { Payment, PaymentStatus } from "@/types/api"

// ============ Status Badge ============

const statusConfig: Record<PaymentStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "待支付": { label: "待支付", className: "bg-yellow-100 text-yellow-800 border-yellow-200", variant: "warning" },
  "部分支付": { label: "部分支付", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "已支付": { label: "已支付", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "已退款": { label: "已退款", className: "bg-purple-100 text-purple-800 border-purple-200", variant: "secondary" },
  "已取消": { label: "已取消", className: "bg-red-100 text-red-800 border-red-200", variant: "destructive" },
}

function StatusBadge({ status }: { status: PaymentStatus }) {
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

const mockPayment: Payment = {
  id: "PAY-001",
  code: "PAY-2024-001",
  contractId: "CT-001",
  contractName: "2024年度服务合同",
  customerId: "C001",
  customerName: "北京科技有限公司",
  amount: 60000,
  paidAmount: 60000,
  status: "已支付",
  method: "银行转账",
  dueDate: "2024-03-15",
  paidDate: "2024-03-14",
  bankAccount: "6225880012345678",
  receiptNo: "R-2024-001",
  assignee: "李明",
  createdAt: "2024-01-15",
  updatedAt: "2024-03-14",
  remark: "第一期付款",
}

// ============ PaymentDetail Page ============

export function PaymentDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [showPayModal, setShowPayModal] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [payment, setPayment] = React.useState<Payment>(mockPayment)
  const [contractExpanded, setContractExpanded] = React.useState(true)
  const [timelineExpanded, setTimelineExpanded] = React.useState(true)
  const [filesExpanded, setFilesExpanded] = React.useState(true)

  // Mock contract data
  const contractData = {
    id: "CT-001",
    code: "CT-2024-001",
    name: "2024年度服务合同",
    customerName: "北京科技有限公司",
    amount: 120000,
    signedDate: "2024-01-10",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
  }

  // Mock payment timeline
  const paymentTimeline = [
    { id: "1", type: "partial", title: "首期支付", amount: 60000, date: "2024-03-14", method: "银行转账" },
    { id: "2", type: "create", title: "创建支付单", amount: 60000, date: "2024-01-15", method: "-" },
  ]

  // Mock files
  const files = [
    { id: "1", name: "银行转账凭证.pdf", size: "1.2MB", date: "2024-03-14" },
    { id: "2", name: "收据_R-2024-001.pdf", size: "0.5MB", date: "2024-03-14" },
  ]

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Payment, value: string | number) => {
    try {
      setPayment(prev => ({ ...prev, [field]: value }))
      toast({
        title: t("payment.inlineEditSuccess", "已更新"),
        duration: 2000,
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("payment.inlineEditFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (values: any) => {
    console.log("更新支付:", values)
    setEditModalOpen(false)
    setPayment(prev => ({ ...prev, ...values }))
    toast({
      title: t("payment.updateSuccess", "支付更新成功"),
    })
  }

  const handleDelete = () => {
    console.log("删除支付:", payment.id)
    toast({
      title: t("payment.deleteSuccess", "支付已删除"),
    })
    navigate("/payments")
  }

  const handlePay = (paidAmount: number) => {
    console.log("记录支付:", paidAmount)
    setPayment(prev => ({ 
      ...prev, 
      paidAmount: prev.paidAmount + paidAmount,
      status: prev.paidAmount + paidAmount >= prev.amount ? "已支付" : "部分支付",
      paidDate: new Date().toISOString().split('T')[0]
    }))
    setShowPayModal(false)
    toast({ title: t("payment.payRecorded", "支付已记录") })
  }

  const handleRefund = () => {
    console.log("退款:", payment.paidAmount)
    setPayment(prev => ({ ...prev, status: "已退款" }))
    toast({ title: t("payment.refundProcessed", "退款已处理") })
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("payment.detail.notFound", "支付记录不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  const remainingAmount = payment.amount - payment.paidAmount
  const paymentProgress = payment.amount > 0 ? (payment.paidAmount / payment.amount) * 100 : 0

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={() => navigate("/payments")}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{payment.code}</span>}
            actions={
              <div className="flex items-center gap-2">
                <StatusBadge status={payment.status} />
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
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
                    <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出记录</DropdownMenuItem>
                    <DropdownMenuItem><Printer className="w-4 h-4 mr-2" />打印</DropdownMenuItem>
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
            {/* Payment Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-slate-900 truncate">{payment.code}</h2>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building className="w-4 h-4" />
                      <span className="text-sm truncate">{payment.contractName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Amount */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">应付金额</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(payment.amount)}
                    </div>
                  </div>

                  {/* Paid Amount */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">已付金额</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(payment.paidAmount)}
                    </div>
                  </div>

                  {/* Remaining Amount */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">待付金额</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(remainingAmount)}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">应付日期</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {payment.dueDate}
                    </div>
                  </div>
                </div>

                {/* Payment Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">付款进度</span>
                    <span className="font-semibold text-slate-700">{paymentProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={paymentProgress} className="h-2" />
                </div>

                <Separator />

                {/* Detailed Information */}
                <div className="space-y-3">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">客户信息</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{payment.customerName}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">支付方式</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{payment.method}</span>
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">负责人</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{payment.assignee}</span>
                    </div>
                  </div>

                  {/* Receipt */}
                  {payment.receiptNo && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">收据编号</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Receipt className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{payment.receiptNo}</span>
                      </div>
                    </div>
                  )}

                  {/* Remark */}
                  {payment.remark && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">备注</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{payment.remark}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(payment.status === "待支付" || payment.status === "部分支付") && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setShowPayModal(true)}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-green-500" />
                        <span className="truncate">记录支付</span>
                      </Button>
                    )}
                    {(payment.status === "已支付" || payment.status === "部分支付") && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleRefund}>
                        <RotateCcw className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-purple-500" />
                        <span className="truncate">退款</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => navigate(`/contracts/${payment.contractId}`)}>
                      <FileText className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">查看合同</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
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
            {/* Contract Info */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={contractExpanded} onOpenChange={setContractExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">关联合同</span>
                      </div>
                      {contractExpanded ? (
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
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-slate-600">合同编号</span>
                          <span className="text-sm font-medium text-slate-900">{contractData.code}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-slate-600">合同名称</span>
                          <span className="text-sm font-medium text-slate-900">{contractData.name}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-slate-600">客户</span>
                          <span className="text-sm font-medium text-slate-900">{contractData.customerName}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-slate-600">合同金额</span>
                          <span className="text-sm font-semibold text-emerald-600">{formatCurrency(contractData.amount)}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-slate-600">签订日期</span>
                          <span className="text-sm font-medium text-slate-900">{contractData.signedDate}</span>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="p-2 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/contracts/${contractData.id}`)}
                        className="w-full justify-center text-slate-600"
                      >
                        查看合同详情
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Payment Timeline */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={timelineExpanded} onOpenChange={setTimelineExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900">付款记录</span>
                        <Badge variant="secondary" className="text-xs">{paymentTimeline.length}</Badge>
                      </div>
                      {timelineExpanded ? (
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
                        {paymentTimeline.map((item) => (
                          <div key={item.id} className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-medium text-sm text-slate-900">{item.title}</span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs flex-shrink-0",
                                  item.type === "partial" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"
                                )}
                              >
                                {item.type === "partial" ? "部分" : "创建"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-emerald-600">{formatCurrency(item.amount)}</span>
                              <span className="text-slate-500">{item.date}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{item.method}</div>
                          </div>
                        ))}
                        {paymentTimeline.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无付款记录
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Files */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={filesExpanded} onOpenChange={setFilesExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-slate-900">附件</span>
                        <Badge variant="secondary" className="text-xs">{files.length}</Badge>
                      </div>
                      {filesExpanded ? (
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
                        {files.map((file) => (
                          <div key={file.id} className="p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded">
                                <FileText className="w-4 h-4 text-slate-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{file.size} · {file.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {files.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无附件
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
                <CreditCard className="w-4 h-4" />
                <span>概览</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment-history"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <Receipt className="w-4 h-4" />
                <span>付款历史</span>
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <FileText className="w-4 h-4" />
                <span>附件</span>
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
                          <p className="text-xs text-slate-500">应付金额</p>
                          <p className="text-xl font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
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
                          <p className="text-xs text-slate-500">已付金额</p>
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(payment.paidAmount)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">待付金额</p>
                          <p className="text-xl font-bold text-yellow-600">{formatCurrency(remainingAmount)}</p>
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
                          <p className="text-xs text-slate-500">付款进度</p>
                          <p className="text-xl font-bold text-purple-600">{paymentProgress.toFixed(0)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Progress Detail */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">付款进度详情</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-700">当前状态</p>
                          <StatusBadge status={payment.status} />
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-sm font-medium text-slate-700">应付日期</p>
                          <p className="text-lg font-semibold text-slate-900">{payment.dueDate}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">完成度</span>
                          <span className="font-semibold text-slate-900">{paymentProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={paymentProgress} className="h-3" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>已付: {formatCurrency(payment.paidAmount)}</span>
                          <span>应付: {formatCurrency(payment.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="payment-history" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">付款历史</h3>
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {paymentTimeline.map((item) => (
                        <div key={item.id} className="p-4 flex items-start gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            item.type === "partial" ? "bg-blue-100" : "bg-slate-100"
                          )}>
                            {item.type === "partial" ? (
                              <Receipt className="w-5 h-5 text-blue-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-900">{item.title}</h4>
                              <span className="text-sm font-semibold text-emerald-600">{formatCurrency(item.amount)}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                              <span>{item.date}</span>
                              <span>{item.method}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {paymentTimeline.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          暂无付款记录
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">附件列表</h3>
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {files.map((file) => (
                        <div key={file.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                          <div className="p-3 bg-slate-100 rounded-lg">
                            <FileText className="w-6 h-6 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{file.name}</h4>
                            <p className="text-sm text-slate-500">{file.size} · {file.date}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            下载
                          </Button>
                        </div>
                      ))}
                      {files.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          暂无附件
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={t("payment.editTitle", "编辑支付")}
        width={600}
      >
        <PaymentForm
          mode="edit"
          initialValues={payment}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("payment.deleteTitle", "确认删除")}
        content={t("payment.deleteContent", "删除后数据将无法恢复，确定要删除该支付记录吗？")}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
      />

      {/* Pay Modal */}
      <Modal
        open={showPayModal}
        onOpenChange={setShowPayModal}
        title={t("payment.recordPay", "记录支付")}
        width={400}
      >
        <div className="space-y-4 p-4">
          <p className="text-sm text-muted-foreground">
            待付金额: <strong className="text-yellow-600">{formatCurrency(remainingAmount)}</strong>
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPayModal(false)}>
              {t("common.cancel", "取消")}
            </Button>
            <Button onClick={() => handlePay(remainingAmount)}>
              <CheckCircle className="w-4 h-4 mr-1" />
              确认支付 {formatCurrency(remainingAmount)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PaymentDetail
