"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft, Building, Calendar, Clock,
  User, DollarSign, Target, FileText, TrendingUp, CheckCircle, XCircle,
  Activity, History, ArrowRight, Phone, ChevronRight,
  Edit, Star, Lightbulb, MessageSquare, LayoutDashboard as LayoutDashboardIcon,
  MoreHorizontal, Share2, Copy, Download, PhoneCall, Video, MapPin as MapPinIcon,
  ChevronDown, ChevronUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { OpportunityForm } from "@/forms/OpportunityForm"
import { Timeline, TimelineItem } from "@/components/timeline"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Inline editable field component
import { InlineEditableField } from "@/components/InlineEditableField"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"
import { InfoCard, type InfoField } from "@/components/DetailSidebar/InfoCard"
import { ActionButtons, type ActionButtonConfig } from "@/components/DetailSidebar/ActionButtons"
import { RelatedListCard, type RelatedItem } from "@/components/DetailSidebar/RelatedListCard"
import { DetailTabs, type DetailTabConfig } from "@/components/DetailContent/DetailTabs"

import {
  useOpportunity,
  useUpdateOpportunity,
  useDeleteOpportunity,
  useUpdateOpportunityStage,
  useAdvanceOpportunityStage,
  useCloseOpportunityWon,
  useCloseOpportunityLost,
} from "@/hooks/api/useOpportunities"
import { useCustomer } from "@/hooks/api/useCustomers"
import { useContacts } from "@/hooks/api/useContacts"
import type { OpportunityStage, OpportunityPriority, Opportunity, Contact } from "@/types/api"
import type { OpportunityFormValues } from "@/schemas"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// ============ Stage Config ============

const stageConfig: Record<OpportunityStage, { 
  label: string
  className: string
  progress: number
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
  nextStage?: OpportunityStage
}> = {
  "初步接触": { label: "初步接触", className: "bg-blue-100 text-blue-800 border-blue-200", progress: 10, variant: "info", nextStage: "需求确认" },
  "需求确认": { label: "需求确认", className: "bg-green-100 text-green-800 border-green-200", progress: 30, variant: "success", nextStage: "方案报价" },
  "方案报价": { label: "方案报价", className: "bg-cyan-100 text-cyan-800 border-cyan-200", progress: 50, variant: "info", nextStage: "合同谈判" },
  "合同谈判": { label: "合同谈判", className: "bg-yellow-100 text-yellow-800 border-yellow-200", progress: 75, variant: "warning", nextStage: "成交" },
  "成交": { label: "成交", className: "bg-green-100 text-green-800 border-green-200", progress: 100, variant: "success" },
  "失败": { label: "失败", className: "bg-red-100 text-red-800 border-red-200", progress: 0, variant: "destructive" },
}

const STAGE_ORDER: OpportunityStage[] = ["初步接触", "需求确认", "方案报价", "合同谈判", "成交", "失败"]

// ============ Priority Config ============

const priorityConfig: Record<OpportunityPriority, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "低": { label: "低", variant: "secondary" },
  "中": { label: "中", variant: "info" },
  "高": { label: "高", variant: "destructive" },
}

// ============ Stage Timeline Component ============

interface StageTimelineProps {
  currentStage: OpportunityStage
  isActive: boolean
  onStageChange: (stage: OpportunityStage) => void
  loading?: boolean
}

function StageTimeline({ currentStage, isActive, onStageChange, loading }: StageTimelineProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">阶段进度</h3>
        {isActive && currentIndex < 4 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStageChange(stageConfig[currentStage].nextStage!)}
            disabled={loading}
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            推进到下一阶段
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gray-400 via-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${stageConfig[currentStage].progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          {STAGE_ORDER.slice(0, 5).map((stage) => (
            <span
              key={stage}
              className={cn(
                STAGE_ORDER.indexOf(stage) <= currentIndex ? "text-foreground font-medium" : ""
              )}
            >
              {stageConfig[stage].label}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <Timeline>
        {STAGE_ORDER.map((stage, index) => {
          const config = stageConfig[stage]
          const isCurrent = stage === currentStage
          const isPassed = index < currentIndex
          const isFuture = index > currentIndex && stage !== "失败"

          return (
            <TimelineItem
              key={stage}
              color={isCurrent ? "blue" : isPassed ? "green" : stage === "失败" ? "red" : "gray"}
              dot={isCurrent ? <div className="w-3 h-3 rounded-full bg-primary animate-pulse" /> : undefined}
              label={isCurrent ? "当前阶段" : isPassed ? "已完成" : isFuture ? "待达成" : ""}
              lineColored={isPassed}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  "font-medium",
                  isCurrent && "text-primary",
                  isPassed && "text-green-600",
                  stage === "失败" && currentStage === "失败" && "text-red-600"
                )}>
                  {config.label}
                </span>
                {isCurrent && (
                  <Badge variant="outline" className="text-xs">
                    {config.progress}%
                  </Badge>
                )}
              </div>
            </TimelineItem>
          )
        })}
      </Timeline>
    </div>
  )
}

// ============ OpportunityDetail Page ============

export function OpportunityDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const params = useParams()
  const navigate = useNavigate()
  const opportunityId = params.id || ""

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [closeWonModal, setCloseWonModal] = React.useState(false)
  const [closeLostModal, setCloseLostModal] = React.useState(false)
  const [lostReason, setLostReason] = React.useState("其他")
  const [actualAmount, setActualAmount] = React.useState<number | undefined>()

  // API Hooks
  const { data: opportunity, isLoading, refetch } = useOpportunity(opportunityId)
  const { data: customer } = useCustomer(opportunity?.customerId || null)
  const { data: contactsData } = useContacts({ customerId: opportunity?.customerId })
  const updateMutation = useUpdateOpportunity()
  const deleteMutation = useDeleteOpportunity()
  const stageMutation = useUpdateOpportunityStage()
  const advanceMutation = useAdvanceOpportunityStage()
  const closeWonMutation = useCloseOpportunityWon()
  const closeLostMutation = useCloseOpportunityLost()

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Opportunity, value: string) => {
    try {
      const parsedValue = field === 'amount' || field === 'probability' 
        ? Number(value) 
        : value
      
      await updateMutation.mutateAsync({
        id: opportunityId,
        [field]: parsedValue,
      })
      toast({
        title: t("opportunity.inlineEditSuccess", "已更新"),
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("opportunity.inlineEditFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  // Handlers
  const handleEdit = async (values: OpportunityFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: opportunityId,
        ...values,
      })
      setEditModalOpen(false)
      toast({
        title: t("opportunity.updateSuccess", "商机更新成功"),
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("opportunity.updateFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(opportunityId)
      toast({
        title: t("opportunity.deleteSuccess", "商机已删除"),
      })
      navigate("/opportunities")
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: t("opportunity.deleteFailed", "删除失败"),
        variant: "destructive",
      })
    }
  }

  const handleStageChange = async (stage: OpportunityStage) => {
    try {
      await stageMutation.mutateAsync({ id: opportunityId, stage })
      toast({
        title: t("opportunity.stageChangeSuccess", "阶段已更新"),
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("更新阶段失败:", error)
      toast({
        title: t("opportunity.stageChangeFailed", "阶段更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleAdvanceStage = async () => {
    try {
      await advanceMutation.mutateAsync(opportunityId)
      toast({
        title: t("opportunity.advanceSuccess", "阶段推进成功"),
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("推进阶段失败:", error)
      toast({
        title: t("opportunity.advanceFailed", "阶段推进失败"),
        variant: "destructive",
      })
    }
  }

  const handleCloseWon = async () => {
    try {
      await closeWonMutation.mutateAsync({
        id: opportunityId,
        actualAmount,
        actualCloseDate: new Date().toISOString().split("T")[0],
      })
      setCloseWonModal(false)
      toast({
        title: t("opportunity.closeWonSuccess", "商机成交成功"),
      })
      refetch()
    } catch (error) {
      console.error("成交处理失败:", error)
      toast({
        title: t("opportunity.closeWonFailed", "成交处理失败"),
        variant: "destructive",
      })
    }
  }

  const handleCloseLost = async () => {
    try {
      await closeLostMutation.mutateAsync({
        id: opportunityId,
        reason: lostReason,
      })
      setCloseLostModal(false)
      toast({
        title: t("opportunity.closeLostSuccess", "商机已标记失败"),
      })
      refetch()
    } catch (error) {
      console.error("失败处理失败:", error)
      toast({
        title: t("opportunity.closeLostFailed", "失败处理失败"),
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    navigate("/opportunities")
  }

  const handleViewCustomer = () => {
    if (opportunity?.customerId) {
      navigate(`/customers/${opportunity.customerId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("opportunity.detail.notFound", "商机不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  const isActive = opportunity.stage !== "成交" && opportunity.stage !== "失败"
  const contacts = contactsData?.data || []

  // InfoCard fields with inline editing
  const infoFields: InfoField[] = [
    { 
      key: "stage", 
      label: t("opportunity.detail.fields.stage", "阶段"), 
      value: opportunity.stage, 
      type: "badge", 
      badgeVariant: stageConfig[opportunity.stage]?.variant,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={STAGE_ORDER.map(s => ({ label: stageConfig[s].label, value: s }))}
          onSave={(v: string) => handleInlineEdit("stage", v)}
          disabled={!isActive}
          placeholder="选择阶段"
        />
      ),
    },
    { 
      key: "priority", 
      label: t("opportunity.detail.fields.priority", "优先级"), 
      value: opportunity.priority, 
      type: "badge", 
      badgeVariant: priorityConfig[opportunity.priority]?.variant,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={[
            { label: "高", value: "高" },
            { label: "中", value: "中" },
            { label: "低", value: "低" },
          ]}
          onSave={(v: string) => handleInlineEdit("priority", v)}
          disabled={!isActive}
          placeholder="选择优先级"
        />
      ),
    },
    { 
      key: "amount", 
      label: t("opportunity.detail.fields.amount", "金额"), 
      value: opportunity.amount, 
      icon: <DollarSign className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as number}
          type="number"
          min={0}
          onSave={(v: string) => handleInlineEdit("amount", v)}
          disabled={!isActive}
          placeholder="输入金额"
          format={(v: string | number | null | undefined) => (
            <span className="font-semibold">
              {new Intl.NumberFormat("zh-CN", {
                style: "currency",
                currency: "CNY",
                minimumFractionDigits: 0,
              }).format(Number(v))}
            </span>
          )}
        />
      ),
    },
    { 
      key: "probability", 
      label: t("opportunity.detail.fields.probability", "成交概率"), 
      value: opportunity.probability, 
      icon: <Target className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as number}
          type="number"
          min={0}
          max={100}
          onSave={(v: string) => handleInlineEdit("probability", v)}
          disabled={!isActive}
          placeholder="输入概率"
          format={(v: string | number | null | undefined) => (
            <div className="flex items-center gap-2">
              <Progress value={Number(v)} className="h-2 w-16" />
              <span className="font-semibold">{String(v)}%</span>
            </div>
          )}
        />
      ),
    },
    { 
      key: "customer", 
      label: t("opportunity.detail.fields.customer", "关联客户"), 
      value: customer?.name || opportunity.customerName, 
      icon: <Building className="w-4 h-4" />,
      render: (_val: unknown) => (
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={handleViewCustomer}
        >
          {customer?.name || opportunity.customerName || t("common.unknown", "未知客户")}
        </Button>
      ),
    },
    { 
      key: "assignee", 
      label: t("opportunity.detail.fields.assignee", "负责人"), 
      value: opportunity.assignee, 
      icon: <User className="w-4 h-4" />,
      render: (val: unknown) => (
        <InlineEditableField
          value={val as string}
          type="select"
          options={[
            { label: "李明", value: "李明" },
            { label: "王芳", value: "王芳" },
            { label: "陈静", value: "陈静" },
          ]}
          placeholder="请选择负责人"
          onSave={(v: string) => handleInlineEdit("assignee", v)}
        />
      ),
    },
    { 
      key: "createdAt", 
      label: t("opportunity.detail.fields.createdAt", "创建时间"), 
      value: opportunity.createdAt, 
      icon: <Calendar className="w-4 h-4" />,
      render: (val: unknown) => (
        <span className="text-muted-foreground">{val as string}</span>
      ),
    },
    { 
      key: "updatedAt", 
      label: t("opportunity.detail.fields.updatedAt", "更新时间"), 
      value: opportunity.updatedAt, 
      icon: <Clock className="w-4 h-4" />,
      render: (val: unknown) => (
        <span className="text-muted-foreground">{val as string}</span>
      ),
    },
  ]

  // Action buttons
  const actionButtons: ActionButtonConfig[] = [
    { key: "edit", label: t("common.edit", "编辑"), onClick: () => setEditModalOpen(true) },
    { key: "newActivity", label: t("opportunity.detail.actions.newActivity", "新建活动") },
    { key: "separator", label: "" },
    ...(isActive ? [
      { key: "advance", label: t("opportunity.detail.actions.advance", "推进阶段"), icon: <ArrowRight className="w-4 h-4" />, onClick: handleAdvanceStage } as ActionButtonConfig,
      { key: "separator2", label: "" } as ActionButtonConfig,
      { key: "closeWon", label: t("opportunity.detail.actions.closeWon", "成交"), icon: <CheckCircle className="w-4 h-4 text-green-500" />, onClick: () => setCloseWonModal(true) } as ActionButtonConfig,
      { key: "closeLost", label: t("opportunity.detail.actions.closeLost", "失败"), icon: <XCircle className="w-4 h-4 text-red-500" />, danger: true, onClick: () => setCloseLostModal(true) } as ActionButtonConfig,
    ] : []),
    { key: "separator", label: "" },
    { key: "delete", label: t("common.delete", "删除"), danger: true, onClick: () => setDeleteConfirmOpen(true) },
  ]

  // Contact items for sidebar
  const contactItems: RelatedItem[] = contacts.slice(0, 5).map((contact: Contact) => ({
    id: contact.id,
    title: contact.content,
    subtitle: `${contact.type} - ${contact.contactDate}`,
    onClick: () => navigate(`/contacts/${contact.id}`),
  }))

  // Tabs configuration
  const tabs: DetailTabConfig[] = [
    {
      key: "overview",
      label: t("opportunity.detail.tabs.overview", "概览"),
      icon: <Target className="w-4 h-4" />,
      content: (
        <div className="space-y-6 p-4">
          {/* Sales Forecast */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("opportunity.detail.salesForecast", "销售预测")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{t("opportunity.detail.fields.amount", "商机金额")}</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat("zh-CN", {
                    style: "currency",
                    currency: "CNY",
                    minimumFractionDigits: 0,
                  }).format(opportunity.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("opportunity.detail.weightedAmount", "加权金额")}</p>
                <p className="text-lg font-semibold text-blue-600">
                  {new Intl.NumberFormat("zh-CN", {
                    style: "currency",
                    currency: "CNY",
                    minimumFractionDigits: 0,
                  }).format(opportunity.amount * opportunity.probability / 100)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{t("opportunity.detail.fields.probability", "成交概率")}</span>
                <span className={cn(
                  "font-semibold",
                  opportunity.probability >= 81 ? "text-green-600" :
                  opportunity.probability >= 61 ? "text-blue-600" :
                  opportunity.probability >= 31 ? "text-yellow-600" : "text-red-600"
                )}>{opportunity.probability}%</span>
              </div>
              <Progress 
                value={opportunity.probability} 
                className={cn(
                  "h-2",
                  opportunity.probability >= 81 ? "[&>div]:bg-green-600" :
                  opportunity.probability >= 61 ? "[&>div]:bg-blue-600" :
                  opportunity.probability >= 31 ? "[&>div]:bg-yellow-600" : "[&>div]:bg-red-600"
                )}
              />
            </div>
          </div>

          {/* Notes */}
          {opportunity.notes && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("opportunity.detail.notes", "备注")}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.notes}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "history",
      label: t("opportunity.detail.tabs.history", "阶段历史"),
      icon: <History className="w-4 h-4" />,
      content: (
        <div className="p-4">
          <StageTimeline
            currentStage={opportunity.stage}
            isActive={isActive}
            onStageChange={handleStageChange}
            loading={stageMutation.isPending}
          />

          {/* Quick Stage Change */}
          {isActive && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm font-medium mb-3">快速操作</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleAdvanceStage}
                  disabled={advanceMutation.isPending}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  推进到下一阶段
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setCloseWonModal(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  成交
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setCloseLostModal(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  失败
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "activity",
      label: t("opportunity.detail.tabs.activity", "活动"),
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="p-4 space-y-4">
          {/* Contact History */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              联系记录
            </h3>
            {contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.slice(0, 5).map((contact: Contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-2 bg-white rounded hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{contact.type}</Badge>
                      <span className="text-sm truncate max-w-[200px]">{contact.content}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{contact.contactDate}</span>
                  </div>
                ))}
                {contacts.length > 5 && (
                  <p className="text-xs text-muted-foreground pl-2">
                    还有 {contacts.length - 5} 条记录...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("common.noData", "暂无联系记录")}</p>
            )}
          </div>
        </div>
      ),
    },
  ]

  return (
    <>
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">商机</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{opportunity.name}</span>
              </div>
            }
            actions={
              <div className="flex items-center gap-2">
                {isActive && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleAdvanceStage}>
                      <ArrowRight className="mr-1 h-3 w-3" />
                      推进
                    </Button>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setCloseWonModal(true)}>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      成交
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                  {t("common.edit", "编辑")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                  {t("common.delete", "删除")}
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            <InfoCard
              name={opportunity.name}
              subtitle={customer?.name || opportunity.customerName || t("common.unknown", "未知客户")}
              headerBadges={[
                { label: opportunity.stage, variant: stageConfig[opportunity.stage]?.variant },
                { label: opportunity.priority, variant: priorityConfig[opportunity.priority]?.variant },
              ]}
              fields={infoFields}
              onEdit={() => setEditModalOpen(true)}
              editLabel={t("common.edit", "编辑")}
            />
            <ActionButtons buttons={actionButtons} />
          </>
        }
        rightSidebar={
          <>
            <RelatedListCard
              title={t("opportunity.detail.related.customer", "关联客户")}
              icon={<Building className="w-4 h-4" />}
              items={customer ? [{
                id: customer.id || "customer",
                title: customer.name || t("common.unknown", "未知客户"),
                subtitle: customer.company,
                onClick: handleViewCustomer,
                isPrimary: true,
              }] : []}
              totalCount={customer ? 1 : 0}
              emptyMessage={t("common.noData", "暂无关联客户")}
            />
            <RelatedListCard
              title={t("opportunity.detail.related.contacts", "联系记录")}
              icon={<Phone className="w-4 h-4" />}
              items={contactItems}
              totalCount={contacts.length}
              emptyMessage={t("common.noData", "暂无联系记录")}
            />
            <RelatedListCard
              title={t("opportunity.detail.related.stageHistory", "阶段历史")}
              icon={<History className="w-4 h-4" />}
              items={[]}
              totalCount={0}
              emptyMessage={t("common.noData", "暂无阶段历史")}
              defaultExpanded={false}
            />
          </>
        }
      >
        <DetailTabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          className="h-full"
        />
      </DetailLayout>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={t("opportunity.detail.editTitle", "编辑商机")}
        width={600}
      >
        <OpportunityForm
          mode="edit"
          initialValues={opportunity as Partial<OpportunityFormValues>}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("opportunity.detail.deleteTitle", "确认删除")}
        content={t("opportunity.detail.deleteContent", `删除后数据将无法恢复，确定要删除商机「${opportunity.name}」吗？`)}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />

      {/* Close Won Modal */}
      <Modal
        open={closeWonModal}
        onOpenChange={setCloseWonModal}
        title="确认成交"
        width={400}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            确认将商机「<strong>{opportunity.name}</strong>」标记为成交？
          </p>
          <div>
            <label className="text-sm font-medium mb-2 block">实际成交金额</label>
            <Input
              type="number"
              placeholder={String(opportunity.amount)}
              value={actualAmount}
              onChange={(e) => setActualAmount(Number(e.target.value))}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground mt-1">
              预计金额: {new Intl.NumberFormat("zh-CN", {
                style: "currency",
                currency: "CNY",
                minimumFractionDigits: 0,
              }).format(opportunity.amount)}
            </p>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setCloseWonModal(false)}>
              取消
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleCloseWon} disabled={closeWonMutation.isPending}>
              <CheckCircle className="mr-2 w-4 w-4" />
              确认成交
            </Button>
          </div>
        </div>
      </Modal>

      {/* Close Lost Modal */}
      <Modal
        open={closeLostModal}
        onOpenChange={setCloseLostModal}
        title="确认失败"
        width={400}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            认将商机「<strong>{opportunity.name}</strong>」标记为失败？
          </p>
          <div>
            <label className="text-sm font-medium mb-2 block">失败原因</label>
            <Select value={lostReason} onValueChange={setLostReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="价格因素">价格因素</SelectItem>
                <SelectItem value="竞争对手">竞争对手</SelectItem>
                <SelectItem value="客户需求变更">客户需求变更</SelectItem>
                <SelectItem value="客户预算不足">客户预算不足</SelectItem>
                <SelectItem value="响应不及时">响应不及时</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setCloseLostModal(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleCloseLost} disabled={closeLostMutation.isPending}>
              <XCircle className="mr-2 w-4 h-4" />
              确认失败
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default OpportunityDetail