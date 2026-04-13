"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  ArrowLeft, Mail, Phone, Building, Calendar, User, Users, Lightbulb, Activity,
  Edit, Star, DollarSign, TrendingUp, Clock, MapPin, Globe, Building2,
  MessageSquare, FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  MoreHorizontal, Share2, Copy, Download, PhoneCall, Video, MapPin as MapPinIcon,
  LayoutDashboard as LayoutDashboardIcon
} from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { CustomerForm } from "@/forms/CustomerForm"
import { DataTable } from "@/components/DataTable"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
import { Timeline, TimelineItem } from "@/components/timeline/Timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CustomerSummaryAI, AIInteractionAnalysis, AIRelationshipChange, AISmartSuggestions } from "@/components/AI"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"

import {
  useCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/api/useCustomers"
import { useContactsByCustomer } from "@/hooks/api/useContacts"
import { useOpportunities } from "@/hooks/api/useOpportunities"
import type { CustomerStatus, Contact, Opportunity, Customer } from "@/types/api"
import type { CustomerFormValues } from "@/schemas"

// ============ Status Config ============

const statusConfig: Record<CustomerStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "潜在": { label: "潜在", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "活跃": { label: "活跃", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "沉默": { label: "沉默", className: "bg-yellow-100 text-yellow-800 border-yellow-200", variant: "warning" },
  "流失": { label: "流失", className: "bg-red-100 text-red-800 border-red-200", variant: "destructive" },
}

// ============ Contact Columns ============

const contactColumns: ColumnDef<Contact>[] = [
  { accessorKey: "customerName", header: "客户" },
  { accessorKey: "type", header: "类型" },
  { accessorKey: "contactDate", header: "联系日期" },
  { accessorKey: "duration", header: "时长" },
  { accessorKey: "assignee", header: "负责人" },
]

// ============ Opportunity Columns ============

const opportunityColumns: ColumnDef<Opportunity>[] = [
  { accessorKey: "name", header: "商机名称" },
  { accessorKey: "stage", header: "阶段" },
  { accessorKey: "amount", header: "金额" },
  { accessorKey: "probability", header: "概率" },
  { accessorKey: "expectedCloseDate", header: "预计成交" },
  { accessorKey: "assignee", header: "负责人" },
]

// ============ Activity Timeline Data ============

interface ActivityItem {
  id: string
  type: "call" | "email" | "meeting" | "task" | "note"
  title: string
  description: string
  date: string
  assignee?: string
  color: "blue" | "green" | "red" | "yellow" | "purple" | "gray"
  icon: React.ReactNode
}

// ============ CustomerDetail Page ============

export function CustomerDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const params = useParams()
  const navigate = useNavigate()
  const customerId = params.id || ""

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [inlineEditLoading, setInlineEditLoading] = React.useState<string | null>(null)
  const [contactsExpanded, setContactsExpanded] = React.useState(true)
  const [opportunitiesExpanded, setOpportunitiesExpanded] = React.useState(true)
  const [tasksExpanded, setTasksExpanded] = React.useState(true)

  // API Hooks
  const { data: customer, isLoading, refetch } = useCustomer(customerId)
  const { data: contactsData } = useContactsByCustomer(customerId)
  const { data: opportunitiesData } = useOpportunities({ customerId })
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()

  // Mock activity data for timeline (should come from API)
  const activities: ActivityItem[] = React.useMemo(() => [
    {
      id: "1",
      type: "call",
      title: "电话沟通",
      description: "与客户讨论 Q2 合作计划",
      date: "2024-01-15 14:30",
      assignee: "李明",
      color: "blue",
      icon: <Phone className="w-3 h-3 text-white" />,
    },
    {
      id: "2",
      type: "email",
      title: "发送方案书",
      description: "发送产品方案及报价单",
      date: "2024-01-14 09:15",
      assignee: "王芳",
      color: "green",
      icon: <Mail className="w-3 h-3 text-white" />,
    },
    {
      id: "3",
      type: "meeting",
      title: "需求调研会议",
      description: "线上会议了解客户具体需求",
      date: "2024-01-12 16:00",
      assignee: "李明",
      color: "purple",
      icon: <Video className="w-3 h-3 text-white" />,
    },
    {
      id: "4",
      type: "task",
      title: "准备演示材料",
      description: "完成产品演示 PPT",
      date: "2024-01-10 11:00",
      assignee: "陈静",
      color: "yellow",
      icon: <FileText className="w-3 h-3 text-white" />,
    },
  ], [])

  // Mock tasks data
  const tasks = React.useMemo(() => [
    { id: "1", title: "跟进合同审批", dueDate: "2024-01-20", priority: "high", completed: false },
    { id: "2", title: "安排产品演示", dueDate: "2024-01-18", priority: "medium", completed: false },
    { id: "3", title: "发送报价单", dueDate: "2024-01-16", priority: "high", completed: true },
  ], [])

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Customer, value: string) => {
    if (!customer) return
    setInlineEditLoading(field)
    try {
      await updateMutation.mutateAsync({
        id: customerId,
        [field]: value,
      })
      toast({
        title: t("customer.inlineEditSuccess", "已更新"),
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("customer.inlineEditFailed", "更新失败"),
        variant: "destructive",
      })
    } finally {
      setInlineEditLoading(null)
    }
  }

  // Full form edit handler
  const handleEdit = async (values: CustomerFormValues) => {
    if (!customer) return
    try {
      await updateMutation.mutateAsync({
        id: customerId,
        name: values.name,
        company: values.contactName || customer.company,
        email: values.contactEmail || customer.email,
        phone: values.contactPhone || customer.phone,
        status: customer.status,
        score: customer.score,
        assignee: customer.assignee,
      })
      setEditModalOpen(false)
      toast({
        title: t("customer.updateSuccess", "客户更新成功"),
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("customer.updateFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(customerId)
      toast({
        title: t("customer.deleteSuccess", "客户已删除"),
      })
      navigate("/customers")
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: t("customer.deleteFailed", "删除失败"),
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    navigate("/customers")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background p-6 animate-in fade-in duration-300">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("customer.detail.notFound", "客户不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const relatedOpportunities = opportunitiesData?.data?.filter((o) => o.customerId === customerId) || []
  const relatedContacts = contactsData?.data || []
  const totalOpportunityAmount = relatedOpportunities.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const activeOpportunitiesCount = relatedOpportunities.filter(o => o.stage !== "成交" && o.stage !== "失败").length
  const healthScore = customer.score || 0
  const lastContactDate = customer.lastContact || "暂无记录"

  // Contact decision role badge
  const getDecisionRoleBadge = (contact: Contact) => {
    const roles: Record<string, { label: string; className: string }> = {
      "决策者": { label: "决策者", className: "bg-red-100 text-red-700 border-red-200" },
      "影响者": { label: "影响者", className: "bg-orange-100 text-orange-700 border-orange-200" },
      "使用者": { label: "使用者", className: "bg-blue-100 text-blue-700 border-blue-200" },
      "把关者": { label: "把关者", className: "bg-gray-100 text-gray-700 border-gray-200" },
    }
    const role = contact.type || "使用者"
    const config = roles[role] || roles["使用者"]
    return (
      <Badge variant="outline" className={cn("text-xs", config.className)}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{customer.name}</span>}
            actions={
              <div className="flex items-center gap-2">
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
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出客户</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Edit className="w-4 h-4 mr-2" />退回公海</DropdownMenuItem>
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
            {/* Enhanced Customer Info Card */}
            <Card className="overflow-hidden border-border/70 shadow-[var(--shadow-sm)]">
              {/* Header with Avatar */}
              <div className="border-b border-border/70 bg-muted/35 p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border border-border/70 shadow-[var(--shadow-sm)]">
                    <AvatarImage src={(customer as any).avatarUrl} alt={customer.name} />
                    <AvatarFallback className="bg-foreground text-background text-xl font-bold">
                      {customer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-foreground truncate">{customer.name}</h2>
                      <Badge
                        variant={statusConfig[customer.status]?.variant}
                        className={cn("text-xs font-medium", statusConfig[customer.status]?.className)}
                      >
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm truncate">{customer.company || "未填写公司"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer Score */}
                  <div className="bg-muted/35 rounded-lg p-3.5 border border-border/70 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-foreground/70 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">客户评分</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-foreground">{healthScore}</span>
                      <span className="text-xs text-muted-foreground mb-1">/100</span>
                    </div>
                    <Progress value={healthScore} className="h-1.5 mt-2" />
                  </div>

                  {/* Contract Amount */}
                  <div className="bg-muted/35 rounded-lg p-3.5 border border-border/70 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-foreground/70 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">合同金额</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      ¥{(totalOpportunityAmount / 10000).toFixed(1)}万
                    </div>
                  </div>

                  {/* Active Opportunities */}
                  <div className="bg-muted/35 rounded-lg p-3.5 border border-border/70 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-foreground/70 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">活跃商机</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{activeOpportunitiesCount}</div>
                  </div>

                  {/* Last Contact */}
                  <div className="bg-muted/35 rounded-lg p-3.5 border border-border/70 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-foreground/70 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">最近联系</span>
                    </div>
                    <div className="text-xs font-semibold text-foreground/80 truncate">
                      {lastContactDate !== "暂无记录" ? new Date(lastContactDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) : "-"}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Detailed Information */}
                <div className="space-y-3">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">联系信息</h4>
                    <div className="space-y-2">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground/80">{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground/80">{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">公司信息</h4>
                    <div className="space-y-2">
                      {customer.industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground/80">{customer.industry}</span>
                        </div>
                      )}
                      {customer.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {customer.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  {customer.address && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">地址</h4>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPinIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-foreground/80">{customer.address}</span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {customer.description && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">客户描述</h4>
                      <p className="text-sm text-foreground/72 leading-relaxed">{customer.description}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setEditModalOpen(true)}>
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <User className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">分配</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <Lightbulb className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">新建商机</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <PhoneCall className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">跟进</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Related Contacts */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={contactsExpanded} onOpenChange={setContactsExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-muted/35 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">相关联系人</span>
                        <Badge variant="secondary" className="text-xs">{relatedContacts.length}</Badge>
                      </div>
                      {contactsExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {relatedContacts.slice(0, 5).map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => navigate(`/contacts/${contact.id}`)}
                            className="p-3 hover:bg-muted/35 cursor-pointer transition-colors overflow-hidden"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback className="text-xs bg-muted text-foreground/72">
                                  {(contact.customerName || "C").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="font-medium text-sm text-foreground truncate flex-1">
                                    {contact.customerName || "未知"}
                                  </span>
                                  {getDecisionRoleBadge(contact)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                    <Phone className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                    <Mail className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {relatedContacts.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无联系人
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    {relatedContacts.length > 5 && (
                      <div className="p-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("contacts")}
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

            {/* Related Opportunities */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={opportunitiesExpanded} onOpenChange={setOpportunitiesExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-muted/35 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">相关商机</span>
                        <Badge variant="secondary" className="text-xs">{relatedOpportunities.length}</Badge>
                      </div>
                      {opportunitiesExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {relatedOpportunities.slice(0, 5).map((opp) => {
                          const stageColors: Record<string, string> = {
                            "初步接触": "bg-blue-500",
                            "需求分析": "bg-indigo-500",
                            "方案报价": "bg-purple-500",
                            "谈判审批": "bg-orange-500",
                            "成交": "bg-emerald-500",
                            "失败": "bg-red-500",
                          }
                          const stageColor = stageColors[opp.stage] || "bg-slate-400"
                          
                          return (
                            <div
                              key={opp.id}
                              onClick={() => navigate(`/opportunities/${opp.id}`)}
                            className="p-3 hover:bg-muted/35 cursor-pointer transition-colors"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-medium text-sm text-foreground truncate flex-1">
                                    {opp.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs flex-shrink-0",
                                      opp.stage === "成交" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                      opp.stage === "失败" ? "bg-red-50 text-red-700 border-red-200" :
                                      "bg-slate-50 text-slate-700 border-slate-200"
                                    )}
                                  >
                                    {opp.stage}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-foreground">¥{Number(opp.amount).toLocaleString()}</span>
                                  <span className="text-muted-foreground">{opp.probability}%</span>
                                </div>
                                <Progress value={Number(opp.probability) || 0} className="h-1.5" />
                              </div>
                            </div>
                          )
                        })}
                        {relatedOpportunities.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无商机
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    {relatedOpportunities.length > 5 && (
                      <div className="p-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("opportunities")}
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

            {/* Tasks */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={tasksExpanded} onOpenChange={setTasksExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-muted/35 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">待办任务</span>
                        <Badge variant="secondary" className="text-xs">{tasks.filter(t => !t.completed).length}</Badge>
                      </div>
                      {tasksExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {tasks.map((task) => {
                          const priorityColors: Record<string, string> = {
                            high: "text-red-600 bg-red-50",
                            medium: "text-amber-600 bg-amber-50",
                            low: "text-slate-600 bg-slate-50",
                          }
                          const priorityLabel: Record<string, string> = {
                            high: "高",
                            medium: "中",
                            low: "低",
                          }
                          
                          return (
                            <div
                              key={task.id}
                              className={cn(
                                "p-3 flex items-start gap-3",
                                task.completed && "opacity-60"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                readOnly
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm",
                                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                )}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className={cn("text-xs flex-shrink-0", priorityColors[task.priority])}>
                                    {priorityLabel[task.priority]}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground truncate">截止：{new Date(task.dueDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {tasks.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无待办
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
            <TabsList className="w-full justify-start bg-transparent border-b border-border/70 rounded-none h-auto p-0 gap-1 px-6 py-3">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
              >
                <LayoutDashboardIcon className="w-4 h-4" />
                <span>360概览</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai-insights"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
              >
                <Star className="w-4 h-4" />
                <span>AI 洞察</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
              >
                <Activity className="w-4 h-4" />
                <span>活动记录</span>
                {relatedContacts.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{relatedContacts.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="communication"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
              >
                <MessageSquare className="w-4 h-4" />
                <span>沟通记录</span>
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
              >
                <Lightbulb className="w-4 h-4" />
                <span>商机</span>
                {relatedOpportunities.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{relatedOpportunities.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                <Card className="border-border/70 shadow-[var(--shadow-sm)]">
                  <CardContent className="p-5">
                    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">客户关系摘要</p>
                          <p className="mt-2 text-base font-semibold text-foreground">
                            {customer.name} 当前处于{customer.status}状态，最近一次互动时间为 {lastContactDate === "暂无记录" ? "未记录" : new Date(lastContactDate).toLocaleDateString('zh-CN')}。
                          </p>
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {customer.description || "当前客户档案尚未补充完整经营描述，建议补齐客户背景、合作目标、当前阻力和下一步计划，以便团队统一判断。"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">当前重点</p>
                        <div className="mt-4 space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-foreground">关系状态</p>
                            <p className="mt-1 text-muted-foreground">{statusConfig[customer.status].label}，需要结合最近互动和商机推进节奏持续判断。</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">下一步动作</p>
                            <p className="mt-1 text-muted-foreground">
                              {activeOpportunitiesCount > 0 ? "优先围绕当前商机推进决策节点和下一次关键触达。" : "先恢复互动频率，再识别新的业务机会或协同需求。"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-border/70 shadow-[var(--shadow-sm)]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Star className="w-5 h-5 text-foreground/72" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">客户评分</p>
                          <p className="text-xl font-bold text-foreground">{healthScore}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/70 shadow-[var(--shadow-sm)]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <DollarSign className="w-5 h-5 text-foreground/72" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">总商机金额</p>
                          <p className="text-xl font-bold text-foreground">¥{(totalOpportunityAmount / 10000).toFixed(1)}万</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/70 shadow-[var(--shadow-sm)]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <TrendingUp className="w-5 h-5 text-foreground/72" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">活跃商机</p>
                          <p className="text-xl font-bold text-foreground">{activeOpportunitiesCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/70 shadow-[var(--shadow-sm)]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Users className="w-5 h-5 text-foreground/72" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">联系人</p>
                          <p className="text-xl font-bold text-foreground">{relatedContacts.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity Timeline */}
                <Card className="border-border/70 shadow-[var(--shadow-sm)]">
                  <CardHeader className="p-4 border-b border-border/70">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">最近活动</h3>
                      <Button variant="outline" size="sm">
                        <Clock className="w-4 h-4 mr-1" />
                        添加活动
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Timeline>
                      {activities.map((activity) => (
                        <TimelineItem
                          key={activity.id}
                          color={activity.color}
                          label={activity.date}
                          dot={
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", activity.color === "blue" ? "bg-blue-500" : activity.color === "green" ? "bg-green-500" : activity.color === "purple" ? "bg-purple-500" : "bg-yellow-500")}>
                              {activity.icon}
                            </div>
                          }
                        >
                          <div className="space-y-1">
                            <p className="font-medium text-slate-900">{activity.title}</p>
                            <p className="text-sm text-slate-600">{activity.description}</p>
                            {activity.assignee && (
                              <p className="text-xs text-slate-500">负责人：{activity.assignee}</p>
                            )}
                          </div>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <CustomerSummaryAI customerId={customerId} customerName={customer.name} />
                  <AISmartSuggestions customerId={customerId} />
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  <AIInteractionAnalysis customerId={customerId} />
                  <AIRelationshipChange customerId={customerId} />
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">活动记录</h3>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-1" />
                  添加活动
                </Button>
              </div>
              <DataTable
                columns={contactColumns}
                data={contactsData?.data || []}
                showPagination={false}
                showSearch={false}
                showDensityToggle={false}
                emptyText={t("common.noData", "暂无数据")}
                className="text-sm"
              />
            </TabsContent>

            {/* Communication Tab */}
            <TabsContent value="communication" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">沟通记录</h3>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  记录沟通
                </Button>
              </div>
              <div className="space-y-4">
                {relatedContacts.length > 0 ? (
                  relatedContacts.map((contact, index) => (
                    <Card key={contact.id} className="border-slate-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-slate-100 text-slate-600">
                              {(contact.customerName || "C").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-slate-900">{contact.customerName || "未知"}</p>
                                <p className="text-sm text-slate-500">{contact.type}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {contact.contactDate}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                              {contact.duration ? `通话时长：${contact.duration}` : "暂无详细信息"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">暂无沟通记录</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">商机列表</h3>
                <Button variant="outline" size="sm">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  新建商机
                </Button>
              </div>
              <DataTable
                columns={opportunityColumns}
                data={relatedOpportunities}
                showPagination={false}
                showSearch={false}
                showDensityToggle={false}
                emptyText={t("common.noData", "暂无商机")}
                className="text-sm"
              />
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={t("customer.detail.editTitle", "编辑客户")}
        width={600}
      >
        <CustomerForm
          mode="edit"
          initialValues={{
            name: customer.name,
            type: "enterprise",
            status: "active",
            contactName: customer.company,
            contactEmail: customer.email,
            contactPhone: customer.phone,
          }}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("customer.detail.deleteTitle", "确认删除")}
        content={t("customer.detail.deleteContent", `删除后数据将无法恢复，确定要删除客户「${customer.name}」吗？`)}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />
    </div>
  )
}

// Icon component for tabs
function LayoutDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

export default CustomerDetail
