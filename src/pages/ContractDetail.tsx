"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft, Edit, Download, CheckCircle, FileText, User, Calendar,
  DollarSign, Building, PartyPopper, FileCheck, Paperclip, Clock,
  ChevronDown, ChevronUp, MoreHorizontal, Share2, Copy, AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContractForm } from "@/forms/ContractForm"
import { InlineEditableField } from "@/components/InlineEditableField"
import { PaymentPlanList } from "@/components/PaymentPlanList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"
// import { useContract, useUpdateContract, useUpdateContractStatus } from "@/hooks/api"
import type { Contract, ContractStatus } from "@/types/api"
import type { PaymentPlan } from "@/types"

// ============ Status Badge ============

const statusConfig: Record<ContractStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "草稿": { label: "草稿", className: "bg-gray-100 text-gray-800 border-gray-200", variant: "secondary" },
  "待审批": { label: "待审批", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "已审批": { label: "已审批", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "执行中": { label: "执行中", className: "bg-cyan-100 text-cyan-800 border-cyan-200", variant: "info" },
  "已完成": { label: "已完成", className: "bg-emerald-100 text-emerald-800 border-emerald-200", variant: "success" },
  "已取消": { label: "已取消", className: "bg-red-100 text-red-800 border-red-200", variant: "destructive" },
}

function StatusBadge({ status }: { status: ContractStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
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

const mockContract: Contract = {
  id: "CT-001",
  name: "2024 年度服务合同",
  code: "CONTRACT-2024-001",
  customerId: "C001",
  customerName: "北京科技有限公司",
  opportunityId: "OP-001",
  opportunityName: "年度服务续约",
  status: "执行中",
  contractType: "销售",
  paymentMethod: "分期",
  currency: "人民币",
  amount: 120000,
  signedAmount: 120000,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  signedDate: "2024-01-15",
  signatory: "张伟",
  assignee: "李明",
  createdAt: "2024-01-15",
  updatedAt: "2024-03-28",
  remark: "年度技术支持与维护服务合同",
}

const mockPaymentPlans: PaymentPlan[] = [
  {
    id: "PP-001",
    contractId: "CT-001",
    planCode: "PP-2024-001",
    planAmount: 40000,
    planDate: "2024-03-01",
    actualAmount: 40000,
    actualDate: "2024-03-05",
    status: "已完成",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-05",
  },
  {
    id: "PP-002",
    contractId: "CT-001",
    planCode: "PP-2024-002",
    planAmount: 40000,
    planDate: "2024-06-01",
    actualAmount: 20000,
    actualDate: "2024-06-10",
    status: "部分回款",
    createdAt: "2024-01-15",
    updatedAt: "2024-06-10",
  },
  {
    id: "PP-003",
    contractId: "CT-001",
    planCode: "PP-2024-003",
    planAmount: 40000,
    planDate: "2024-09-01",
    status: "待回款",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
]

// Mock approval records
const mockApprovalRecords = [
  { id: "AR-001", action: "提交审批", assignee: "李明", date: "2024-01-16 10:30", remark: "提交合同审批" },
  { id: "AR-002", action: "部门经理审批", assignee: "王芳", date: "2024-01-16 14:20", remark: "同意" },
  { id: "AR-003", action: "财务审批", assignee: "陈静", date: "2024-01-17 09:15", remark: "财务审核通过" },
  { id: "AR-004", action: "总经理审批", assignee: "张总", date: "2024-01-17 16:30", remark: "批准签署" },
]

// ============ Component ============

export function ContractDetail() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [contract, setContract] = React.useState<Contract>(mockContract)
  const [paymentPlans, setPaymentPlans] = React.useState<PaymentPlan[]>(mockPaymentPlans)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [paymentPlansExpanded, setPaymentPlansExpanded] = React.useState(true)
  const [attachmentsExpanded, setAttachmentsExpanded] = React.useState(true)
  const [approvalExpanded, setApprovalExpanded] = React.useState(true)

  // const { data: contract, isLoading } = useContract(id)
  // const updateMutation = useUpdateContract()
  // const statusMutation = useUpdateContractStatus()

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Contract, value: string | number) => {
    try {
      // await updateMutation.mutateAsync({ id: contract.id, [field]: value })
      setContract(prev => ({ ...prev, [field]: value }))
      toast({
        title: "已更新",
        duration: 2000,
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: "更新失败",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (values: any) => {
    console.log("更新合同:", values)
    setShowEditModal(false)
    setContract(prev => ({ ...prev, ...values }))
  }

  const handleStatusChange = (status: ContractStatus) => {
    console.log("更新状态:", status)
    setContract(prev => ({ ...prev, status }))
    toast({ title: `合同状态已更新为：${status}` })
  }

  const handleExport = () => {
    console.log("导出 PDF:", contract.id)
    toast({ title: "正在生成 PDF..." })
  }

  const handleBack = () => {
    navigate("/contracts")
  }

  const handleCreatePaymentPlan = async (plan: Omit<PaymentPlan, "id" | "createdAt" | "updatedAt">) => {
    const newPlan: PaymentPlan = {
      ...plan,
      id: `PP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPaymentPlans(prev => [...prev, newPlan])
  }

  const handleUpdatePaymentPlan = async (plan: PaymentPlan) => {
    setPaymentPlans(prev =>
      prev.map(p => p.id === plan.id ? { ...plan, updatedAt: new Date().toISOString() } : p)
    )
  }

  const handleDeletePaymentPlan = async (planId: string) => {
    setPaymentPlans(prev => prev.filter(p => p.id !== planId))
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">合同不存在或已被删除</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalAmount = contract.amount || 0
  const signedAmount = contract.signedAmount || 0
  const receivedAmount = paymentPlans.filter(p => p.status === "已完成").reduce((sum, p) => sum + (p.actualAmount || 0), 0)
  const pendingAmount = totalAmount - receivedAmount

  return (
    <div className="animate-in fade-in duration-300">
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel="返回列表"
            breadcrumb={<span className="font-semibold">{contract.name}</span>}
            actions={
              <div className="flex items-center gap-2">
                <StatusBadge status={contract.status} />
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
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
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出合同</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><FileText className="w-4 h-4 mr-2" />取消合同</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm">
                  删除
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Contract Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-slate-900 truncate">{contract.name}</h2>
                    </div>
                    <div className="text-sm text-slate-600">{contract.code}</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Contract Amount */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">合同金额</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      ¥{(totalAmount / 10000).toFixed(1)}万
                    </div>
                  </div>

                  {/* Signed Amount */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <PartyPopper className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">已签署金额</span>
                    </div>
                    <div className="text-xl font-bold text-amber-600">
                      ¥{(signedAmount / 10000).toFixed(1)}万
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contract Details */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">签约信息</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{contract.customerName}</span>
                      </div>
                      {contract.signedDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">签约日期: {contract.signedDate}</span>
                        </div>
                      )}
                      {contract.signatory && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">签署人: {contract.signatory}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Period */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">合同期限</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{contract.startDate} ~ {contract.endDate}</span>
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">负责人</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{contract.assignee}</span>
                    </div>
                  </div>

                  {/* Remark */}
                  {contract.remark && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">备注</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{contract.remark}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setShowEditModal(true)}>
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <User className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">分配</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleExport}>
                      <Download className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">导出</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <FileCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">审批</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Payment Plans */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={paymentPlansExpanded} onOpenChange={setPaymentPlansExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-slate-900">回款计划</span>
                        <Badge variant="secondary" className="text-xs">{paymentPlans.length}</Badge>
                      </div>
                      {paymentPlansExpanded ? (
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
                        {paymentPlans.slice(0, 5).map((plan) => (
                          <div key={plan.id} className="p-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm text-slate-900 truncate flex-1">
                                  {plan.planCode}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs flex-shrink-0",
                                    plan.status === "已完成" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    plan.status === "部分回款" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                    "bg-slate-50 text-slate-700 border-slate-200"
                                  )}
                                >
                                  {plan.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-emerald-600">¥{Number(plan.planAmount).toLocaleString()}</span>
                                <span className="text-slate-500">{plan.planDate}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {paymentPlans.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无回款计划
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    {paymentPlans.length > 5 && (
                      <div className="p-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("payment")}
                          className="w-full justify-center text-slate-600"
                        >
                          查看全部
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Attachments */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={attachmentsExpanded} onOpenChange={setAttachmentsExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">附件</span>
                        <Badge variant="secondary" className="text-xs">2</Badge>
                      </div>
                      {attachmentsExpanded ? (
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
                        <div className="p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-700 truncate">合同扫描件.pdf</p>
                              <p className="text-xs text-slate-500">2024-01-15 上传</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-700 truncate">补充协议.pdf</p>
                              <p className="text-xs text-slate-500">2024-02-01 上传</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Approval Records */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={approvalExpanded} onOpenChange={setApprovalExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900">审批记录</span>
                        <Badge variant="secondary" className="text-xs">{mockApprovalRecords.length}</Badge>
                      </div>
                      {approvalExpanded ? (
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
                        {mockApprovalRecords.map((record) => (
                          <div key={record.id} className="p-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm text-slate-900 truncate flex-1">
                                  {record.action}
                                </span>
                                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                  已通过
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <User className="w-3 h-3" />
                                <span>{record.assignee}</span>
                                <span>·</span>
                                <span>{record.date}</span>
                              </div>
                              {record.remark && (
                                <p className="text-xs text-slate-600">{record.remark}</p>
                              )}
                            </div>
                          </div>
                        ))}
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
                <FileText className="w-4 h-4" />
                <span>概览</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <DollarSign className="w-4 h-4" />
                <span>回款计划</span>
                <Badge variant="secondary" className="ml-1 text-xs">{paymentPlans.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <Paperclip className="w-4 h-4" />
                <span>附件</span>
              </TabsTrigger>
              <TabsTrigger
                value="approvals"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <FileCheck className="w-4 h-4" />
                <span>审批记录</span>
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
                          <p className="text-xs text-slate-500">合同金额</p>
                          <p className="text-xl font-bold text-slate-900">¥{totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <PartyPopper className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">已签署金额</p>
                          <p className="text-xl font-bold text-slate-900">¥{signedAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">已回款</p>
                          <p className="text-xl font-bold text-emerald-600">¥{receivedAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">待回款</p>
                          <p className="text-xl font-bold text-yellow-600">¥{pendingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Basic Info Card */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">基本信息</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">合同编码</label>
                        <p className="font-medium">{contract.code}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" /> 客户
                        </label>
                        <p className="font-medium">{contract.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">关联商机</label>
                        <p className="font-medium">{contract.opportunityName || "-"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> 负责人
                        </label>
                        <p className="font-medium">{contract.assignee}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">合同类型</label>
                        <p className="font-medium">{contract.contractType || "-"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">付款方式</label>
                        <p className="font-medium">{contract.paymentMethod || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Actions */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">状态操作</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      {contract.status === "草稿" && (
                        <Button onClick={() => handleStatusChange("待审批")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          提交审批
                        </Button>
                      )}
                      {contract.status === "待审批" && (
                        <Button onClick={() => handleStatusChange("已审批")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          批准
                        </Button>
                      )}
                      {contract.status === "已审批" && (
                        <Button onClick={() => handleStatusChange("执行中")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          开始执行
                        </Button>
                      )}
                      {contract.status === "执行中" && (
                        <Button onClick={() => handleStatusChange("已完成")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          完成
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payment Plans Tab */}
            <TabsContent value="payment" className="flex-1 p-6 m-0 overflow-y-auto">
              <PaymentPlanList
                contractId={contract.id}
                contractAmount={contract.amount}
                paymentPlans={paymentPlans}
                onCreatePlan={handleCreatePaymentPlan}
                onUpdatePlan={handleUpdatePaymentPlan}
                onDeletePlan={handleDeletePaymentPlan}
              />
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="flex-1 p-6 m-0 overflow-y-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">合同附件</h3>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      上传附件
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <FileText className="w-8 h-8 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">合同扫描件.pdf</p>
                        <p className="text-sm text-slate-500">2.4 MB · 2024-01-15 上传</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <FileText className="w-8 h-8 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">补充协议.pdf</p>
                        <p className="text-sm text-slate-500">1.1 MB · 2024-02-01 上传</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="flex-1 p-6 m-0 overflow-y-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">审批记录</h3>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {mockApprovalRecords.map((record, index) => (
                      <div key={record.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          {index < mockApprovalRecords.length - 1 && (
                            <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{record.action}</span>
                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                              已通过
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <User className="w-3 h-3" />
                            <span>{record.assignee}</span>
                            <span>·</span>
                            <Clock className="w-3 h-3" />
                            <span>{record.date}</span>
                          </div>
                          {record.remark && (
                            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{record.remark}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑合同</DialogTitle>
          </DialogHeader>
          <ContractForm
            mode="edit"
            initialValues={contract}
            onSubmit={handleEdit}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ContractDetail
