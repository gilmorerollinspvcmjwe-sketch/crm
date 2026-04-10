"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft, Mail, Phone, Building, Calendar, User, Star, Globe,
  CheckCircle, ArrowRight, Activity, Building2, TrendingUp, Clock,
  Lightbulb, Users, FileText, MessageSquare, Edit, Share2, MoreHorizontal,
  Copy, Download, AlertCircle, PhoneCall, Video, ChevronDown, ChevronUp,
  LayoutDashboard as LayoutDashboardIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { LeadForm } from "@/forms/LeadForm"
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

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"

import {
  useLead,
  useUpdateLead,
  useDeleteLead,
  useConvertLead,
} from "@/hooks/api/useLeads"
import type { LeadStatus, LeadSource, Lead } from "@/types/api"
import type { LeadFormValues } from "@/schemas"

// ============ Status Config ============
// 同步 CustomerDetail 风格：新建(蓝)、跟进中(绿)、已转化(青)、已放弃(灰)

const statusConfig: Record<LeadStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "新建": { label: "新建", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "跟进中": { label: "跟进中", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "已转化": { label: "已转化", className: "bg-cyan-100 text-cyan-800 border-cyan-200", variant: "info" },
  "已放弃": { label: "已放弃", className: "bg-gray-100 text-gray-800 border-gray-200", variant: "secondary" },
}

// ============ Source Config ============

const sourceConfig: Record<LeadSource, { label: string }> = {
  "官网": { label: "官网" },
  "展会": { label: "展会" },
  "推荐": { label: "推荐" },
  "广告": { label: "广告" },
  "其他": { label: "其他" },
}

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

// ============ LeadDetail Page ============

export function LeadDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const params = useParams()
  const navigate = useNavigate()
  const leadId = params.id || ""

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [convertConfirmOpen, setConvertConfirmOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [activitiesExpanded, setActivitiesExpanded] = React.useState(true)
  const [tasksExpanded, setTasksExpanded] = React.useState(true)

  // API Hooks
  const { data: lead, isLoading, refetch } = useLead(leadId)
  const updateMutation = useUpdateLead()
  const deleteMutation = useDeleteLead()
  const convertMutation = useConvertLead()

  // Mock activity data for timeline
  const activities: ActivityItem[] = React.useMemo(() => [
    {
      id: "1",
      type: "call",
      title: "电话沟通",
      description: "与线索初步沟通，了解需求",
      date: "2024-01-15 14:30",
      assignee: "李明",
      color: "blue",
      icon: <Phone className="w-3 h-3 text-white" />,
    },
    {
      id: "2",
      type: "email",
      title: "发送资料",
      description: "发送产品介绍及报价单",
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
  ], [])

  // Mock tasks data
  const tasks = React.useMemo(() => [
    { id: "1", title: "跟进合同审批", dueDate: "2024-01-20", priority: "high", completed: false },
    { id: "2", title: "安排产品演示", dueDate: "2024-01-18", priority: "medium", completed: false },
    { id: "3", title: "发送报价单", dueDate: "2024-01-16", priority: "high", completed: true },
  ], [])

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Lead, value: string) => {
    try {
      await updateMutation.mutateAsync({
        id: leadId,
        [field]: value,
      })
      toast({
        title: t("lead.inlineEditSuccess", "已更新"),
        duration: 2000,
      })
      refetch()
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("lead.inlineEditFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  // Handlers
  const handleEdit = async (values: LeadFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: leadId,
        ...values,
      })
      setEditModalOpen(false)
      toast({
        title: t("lead.updateSuccess", "线索更新成功"),
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("lead.updateFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(leadId)
      toast({
        title: t("lead.deleteSuccess", "线索已删除"),
      })
      navigate("/leads")
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: t("lead.deleteFailed", "删除失败"),
        variant: "destructive",
      })
    }
  }

  const handleConvert = async () => {
    try {
      const result = await convertMutation.mutateAsync(leadId)
      toast({
        title: t("lead.convertSuccess", "线索转化成功"),
      })
      navigate(`/customers/${result.customerId}`)
    } catch (error) {
      console.error("转化失败:", error)
      toast({
        title: t("lead.convertFailed", "转化失败"),
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    navigate("/leads")
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("lead.detail.notFound", "线索不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  // 已转化的线索不能再次转化
  const canConvert = lead.status !== "已转化" && lead.status !== "已放弃"
  const canEdit = lead.status !== "已转化"

  // Calculate metrics
  const healthScore = lead.score || 0
  const isReadyToConvert = lead.score >= 60

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{lead.name}</span>}
            actions={
              <div className="flex items-center gap-2">
                {canConvert && (
                  <Button size="sm" onClick={() => setConvertConfirmOpen(true)}>
                    <ArrowRight className="mr-1 h-4 w-4" />
                    {t("lead.detail.actions.convert", "转化为客户")}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  {t("common.edit", "编辑")}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出线索</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">{t("common.delete", "删除")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Enhanced Lead Info Card - 同步 CustomerDetail 风格 */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header with Avatar */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-md">
                    <AvatarImage src={(lead as any).avatarUrl} alt={lead.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-xl font-bold">
                      {lead.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-slate-900 truncate">{lead.name}</h2>
                      <Badge
                        variant={statusConfig[lead.status]?.variant}
                        className={cn("text-xs font-medium", statusConfig[lead.status]?.className)}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm truncate">{lead.company || "未填写公司"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Lead Score */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">线索评分</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-slate-900">{healthScore}</span>
                      <span className="text-xs text-slate-500 mb-1">/100</span>
                    </div>
                    <Progress value={healthScore} className="h-1.5 mt-2" />
                  </div>

                  {/* Conversion Status */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">转化状态</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-600">
                      {lead.status === "已转化" ? "已转化" : isReadyToConvert ? "可转化" : "待跟进"}
                    </div>
                  </div>

                  {/* Source */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">线索来源</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {sourceConfig[lead.source]?.label || lead.source}
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">负责人</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 truncate">
                      {lead.assignee || "未分配"}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Detailed Information */}
                <div className="space-y-3">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">联系信息</h4>
                    <div className="space-y-2">
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{lead.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">公司信息</h4>
                    <div className="space-y-2">
                      {lead.company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{lead.company}</span>
                        </div>
                      )}
                      {lead.createdAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{lead.createdAt}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {lead.remark && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">备注</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{lead.remark}</p>
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
                    {canConvert && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setConvertConfirmOpen(true)}>
                        <ArrowRight className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">转化</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <PhoneCall className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">拨打电话</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <Mail className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">发送邮件</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Related Activities */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={activitiesExpanded} onOpenChange={setActivitiesExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">活动记录</span>
                        <Badge variant="secondary" className="text-xs">{activities.length}</Badge>
                      </div>
                      {activitiesExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4">
                    <Timeline>
                      {activities.map((activity, index) => (
                        <TimelineItem
                          key={activity.id}
                          label={activity.date}
                          color={activity.color}
                          dot={activity.icon}
                          isLast={index === activities.length - 1}
                        >
                          <div className="font-medium text-slate-900">{activity.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{activity.description}</div>
                          {activity.assignee && (
                            <div className="text-xs text-slate-400 mt-0.5">负责人: {activity.assignee}</div>
                          )}
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Tasks */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={tasksExpanded} onOpenChange={setTasksExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-slate-900">待办任务</span>
                        <Badge variant="secondary" className="text-xs">{tasks.filter(t => !t.completed).length}</Badge>
                      </div>
                      {tasksExpanded ? (
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
                                  task.completed ? "line-through text-slate-500" : "text-slate-900"
                                )}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className={cn("text-xs flex-shrink-0", priorityColors[task.priority])}>
                                    {priorityLabel[task.priority]}
                                  </Badge>
                                  <span className="text-xs text-slate-500 truncate">截止：{new Date(task.dueDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}</span>
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
            <TabsList className="w-full justify-start bg-white border-b border-slate-200 rounded-none h-auto p-0 gap-1 px-4 py-2">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <LayoutDashboardIcon className="w-4 h-4" />
                <span>概览</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <Activity className="w-4 h-4" />
                <span>活动记录</span>
                {activities.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{activities.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <CheckCircle className="w-4 h-4" />
                <span>任务</span>
                {tasks.filter(t => !t.completed).length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{tasks.filter(t => !t.completed).length}</Badge>
                )}
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
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Star className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">线索评分</p>
                          <p className="text-xl font-bold text-slate-900">{healthScore}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">转化状态</p>
                          <p className="text-xl font-bold text-emerald-600">
                            {lead.status === "已转化" ? "已转化" : isReadyToConvert ? "可转化" : "待跟进"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">活动数量</p>
                          <p className="text-xl font-bold text-purple-600">{activities.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">待办任务</p>
                          <p className="text-xl font-bold text-amber-600">{tasks.filter(t => !t.completed).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Conversion Panel */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">转化信息</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    {lead.status === "已转化" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">已成功转化为客户</span>
                        </div>
                        {lead.convertedToCustomerId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/customers/${lead.convertedToCustomerId}`)}
                          >
                            查看客户详情
                          </Button>
                        )}
                      </div>
                    ) : lead.status === "已放弃" ? (
                      <p className="text-sm text-muted-foreground">
                        该线索已被标记为放弃，无法转化。
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          线索评分达到 60 分以上可转化为正式客户。
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">当前评分：</span>
                            <div className="flex items-center gap-1">
                              <Star className={cn("h-4 w-4", healthScore >= 60 ? "text-green-500" : "text-yellow-500")} />
                              <span className="font-semibold">{healthScore}</span>
                            </div>
                          </div>
                          <Progress value={healthScore} className="h-2 w-32" />
                          <span className="text-xs text-slate-500">60分达标</span>
                        </div>
                        {isReadyToConvert && canConvert && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">评分达标，可以转化为客户</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Activity Timeline */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">最近活动</h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("activity")}>
                        查看全部
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Timeline>
                      {activities.slice(0, 3).map((activity, index) => (
                        <TimelineItem
                          key={activity.id}
                          label={activity.date}
                          color={activity.color}
                          dot={activity.icon}
                          isLast={index === Math.min(2, activities.length - 1)}
                        >
                          <div className="font-medium text-slate-900">{activity.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{activity.description}</div>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 p-6 m-0 overflow-y-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">全部活动记录</h3>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      记录活动
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Timeline>
                    {activities.map((activity, index) => (
                      <TimelineItem
                        key={activity.id}
                        label={activity.date}
                        color={activity.color}
                        dot={activity.icon}
                        isLast={index === activities.length - 1}
                      >
                        <div className="font-medium text-slate-900">{activity.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{activity.description}</div>
                        {activity.assignee && (
                          <div className="text-xs text-slate-400 mt-0.5">负责人: {activity.assignee}</div>
                        )}
                      </TimelineItem>
                    ))}
                  </Timeline>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="flex-1 p-6 m-0 overflow-y-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">待办任务</h3>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      新建任务
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const priorityColors: Record<string, string> = {
                        high: "text-red-600 bg-red-50 border-red-200",
                        medium: "text-amber-600 bg-amber-50 border-amber-200",
                        low: "text-slate-600 bg-slate-50 border-slate-200",
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
                            "flex items-start gap-3 p-3 rounded-lg border",
                            task.completed ? "bg-muted/30 opacity-60" : "bg-white"
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
                              "text-sm font-medium",
                              task.completed ? "line-through text-slate-500" : "text-slate-900"
                            )}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className={cn("text-xs flex-shrink-0", priorityColors[task.priority])}>
                                {priorityLabel[task.priority]}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                截止：{new Date(task.dueDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {tasks.length === 0 && (
                      <div className="p-8 text-center text-sm text-slate-500">
                        暂无待办任务
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={t("lead.detail.editTitle", "编辑线索")}
        width={600}
      >
        <LeadForm
          mode="edit"
          initialValues={lead as Partial<LeadFormValues>}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("lead.detail.deleteTitle", "确认删除")}
        content={t("lead.detail.deleteContent", `删除后数据将无法恢复，确定要删除线索「${lead.name}」吗？`)}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />

      {/* Convert Confirm */}
      <ConfirmDialog
        open={convertConfirmOpen}
        onOpenChange={setConvertConfirmOpen}
        title={t("lead.detail.convertTitle", "转化为客户")}
        content={t("lead.detail.convertContent", "确定要将此线索转化为客户吗？转化后线索状态将变更为「已转化」，并自动创建客户记录。")}
        okText={t("lead.detail.actions.convert", "转化")}
        onOk={handleConvert}
        confirmLoading={convertMutation.isPending}
      />
    </div>
  )
}

export default LeadDetail
