/**
 * ActivityDetail Page - CRM Activity Detail View
 * Migrated from Ant Design to shadcn/ui + Tailwind CSS
 * Using DetailLayout three-column structure
 */

import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Phone,
  Mail,
  Users,
  MapPin,
  ClipboardList,
  FileText,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Share2,
  Copy,
  Download,
  LayoutDashboard as LayoutDashboardIcon,
  Activity as ActivityIcon,
  MessageSquare,
  Lightbulb,
  Star,
  DollarSign,
  TrendingUp,
  Building2,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from '@/components/Layout/DetailLayout'

import { useActivity, useCompleteActivity, useDeleteActivity } from '@/hooks/api/useActivities'
import type { ActivityType, ActivityStatus } from '@/types/activity'

// ============================================================
// Type Icons & Colors
// ============================================================
const typeIcons: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="h-5 w-5" />,
  meeting: <Users className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  task: <ClipboardList className="h-5 w-5" />,
  note: <FileText className="h-5 w-5" />,
  visit: <MapPin className="h-5 w-5" />,
}

const typeLabels: Record<ActivityType, string> = {
  call: '电话',
  meeting: '会议',
  email: '邮件',
  task: '任务',
  note: '备注',
  visit: '拜访',
}

const typeColors: Record<ActivityType, string> = {
  call: 'bg-blue-100 text-blue-700 border-blue-200',
  meeting: 'bg-purple-100 text-purple-700 border-purple-200',
  email: 'bg-green-100 text-green-700 border-green-200',
  task: 'bg-orange-100 text-orange-700 border-orange-200',
  note: 'bg-gray-100 text-gray-700 border-gray-200',
  visit: 'bg-teal-100 text-teal-700 border-teal-200',
}

const statusConfig: Record<ActivityStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  planned: { label: '计划中', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', variant: 'warning' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-800 border-green-200', variant: 'success' },
  cancelled: { label: '已取消', className: 'bg-gray-100 text-gray-800 border-gray-200', variant: 'secondary' },
  overdue: { label: '已逾期', className: 'bg-red-100 text-red-800 border-red-200', variant: 'destructive' },
}

const statusLabels: Record<ActivityStatus, string> = {
  planned: '计划中',
  completed: '已完成',
  cancelled: '已取消',
  overdue: '已逾期',
}

const priorityLabels: Record<string, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-100',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  low: 'bg-green-50 text-green-600 border-green-100',
}

// ============================================================
// Loading Skeleton
// ============================================================
function ActivitySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 md:col-span-2" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}

// ============================================================
// ActivityDetail Page Component
// ============================================================
export function ActivityDetail() {
  const { t } = useTranslation()
  const params = useParams()
  const navigate = useNavigate()
  const activityId = params.id as string
  const { data: activity, isLoading, error } = useActivity(activityId)

  const [activeTab, setActiveTab] = React.useState("overview")
  const [assigneeExpanded, setAssigneeExpanded] = React.useState(true)
  const [reminderExpanded, setReminderExpanded] = React.useState(true)
  const [relatedExpanded, setRelatedExpanded] = React.useState(true)

  const handleBack = () => {
    navigate("/activities")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-24 mb-6" />
          <ActivitySkeleton />
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="gap-2 mb-6" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">活动不存在或已被删除</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Mock related data
  const relatedContacts = [
    { id: '1', name: '张三', role: '决策者' },
    { id: '2', name: '李四', role: '影响者' },
  ]

  const relatedOpportunities = [
    { id: '1', name: 'Q2服务器采购', stage: '方案报价', amount: 150000, probability: 60 },
    { id: '2', name: '网络升级项目', stage: '需求分析', amount: 80000, probability: 30 },
  ]

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{activity.subject}</span>}
            actions={
              <div className="flex items-center gap-2">
                {activity.status === 'planned' && (
                  <Button variant="default" size="sm" className="gap-1">
                    <CheckCircle className="h-4 w-4" />
                    完成活动
                  </Button>
                )}
                {activity.status !== 'cancelled' && activity.status !== 'completed' && (
                  <Button variant="outline" size="sm" className="gap-1">
                    <XCircle className="h-4 w-4" />
                    取消
                  </Button>
                )}
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出活动</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />删除</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Activity Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header with Type Icon */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${typeColors[activity.type]}`}>
                    {typeIcons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className={typeColors[activity.type]}>
                        {typeLabels[activity.type]}
                      </Badge>
                      <Badge variant={statusConfig[activity.status]?.variant} className={cn("text-xs font-medium", statusConfig[activity.status]?.className)}>
                        {statusConfig[activity.status]?.label}
                      </Badge>
                      <Badge variant="outline" className={priorityColors[activity.priority]}>
                        {priorityLabels[activity.priority]}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 truncate">{activity.subject}</h2>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Duration */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">活动时长</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {activity.duration || 30}分钟
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">优先级</span>
                    </div>
                    <div className={cn(
                      "text-lg font-bold",
                      activity.priority === 'high' ? 'text-red-600' :
                      activity.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    )}>
                      {priorityLabels[activity.priority]}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Time Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">时间信息</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-500">开始: </span>
                        <span className="text-slate-700">{activity.startTime}</span>
                      </div>
                    </div>
                    {activity.endTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="text-slate-500">结束: </span>
                          <span className="text-slate-700">{activity.endTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                {activity.location && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">地点</h4>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <span className="text-slate-700">{activity.location}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Description */}
                {activity.description && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">活动描述</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{activity.description}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    {activity.status === 'planned' && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                        <CheckCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">完成</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Assignee Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={assigneeExpanded} onOpenChange={setAssigneeExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">负责人</span>
                      </div>
                      {assigneeExpanded ? (
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
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {(activity.assignee || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{activity.assignee || "未分配"}</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Reminder Card */}
            {activity.reminder && (
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <Collapsible open={reminderExpanded} onOpenChange={setReminderExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-slate-900">提醒设置</span>
                        </div>
                        {reminderExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <p className="text-sm">
                          {activity.reminderTime ? `提前 ${activity.reminderTime} 提醒` : '已设置提醒'}
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}

            {/* Related Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={relatedExpanded} onOpenChange={setRelatedExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">关联信息</span>
                        <Badge variant="secondary" className="text-xs">
                          {relatedContacts.length + relatedOpportunities.length}
                        </Badge>
                      </div>
                      {relatedExpanded ? (
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
                        {/* Customer */}
                        {activity.customerId && (
                          <div
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/customers/${activity.customerId}`)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Building className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 mb-1">客户</p>
                                <p className="font-medium text-sm text-slate-900 truncate">
                                  {activity.customerName || "未知客户"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Contact */}
                        {activity.contactId && (
                          <div
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/contacts/${activity.contactId}`)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <Users className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 mb-1">联系人</p>
                                <p className="font-medium text-sm text-slate-900 truncate">
                                  {activity.contactName || "未知联系人"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {relatedOpportunities.slice(0, 2).map((opp) => (
                          <div
                            key={opp.id}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/opportunities/${opp.id}`)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-amber-50 rounded-lg">
                                <Lightbulb className="h-4 w-4 text-amber-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 mb-1">商机</p>
                                <p className="font-medium text-sm text-slate-900 truncate">
                                  {opp.name}
                                </p>
                                <p className="text-xs text-emerald-600">¥{Number(opp.amount).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Meta Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-900">创建信息</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">创建时间</span>
                  <span>{activity.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">更新时间</span>
                  <span>{activity.updatedAt}</span>
                </div>
              </CardContent>
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
                value="details"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <FileText className="w-4 h-4" />
                <span>详情</span>
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <ActivityIcon className="w-4 h-4" />
                <span>关联记录</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Activity Summary */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">活动摘要</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${typeColors[activity.type]}`}>
                          {typeIcons[activity.type]}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">活动类型</p>
                          <p className="font-semibold text-slate-900">{typeLabels[activity.type]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${statusConfig[activity.status]?.className || 'bg-slate-100'}`}>
                          {activity.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : activity.status === 'overdue' ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">活动状态</p>
                          <p className="font-semibold text-slate-900">{statusConfig[activity.status]?.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${priorityColors[activity.priority]}`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">优先级</p>
                          <p className="font-semibold text-slate-900">{priorityLabels[activity.priority]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-slate-100">
                          <Clock className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">活动时长</p>
                          <p className="font-semibold text-slate-900">{activity.duration || 30}分钟</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Time & Location */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">时间与地点</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">开始时间</p>
                          <p className="font-semibold text-slate-900">{activity.startTime}</p>
                        </div>
                      </div>
                      {activity.endTime && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">结束时间</p>
                            <p className="font-semibold text-slate-900">{activity.endTime}</p>
                          </div>
                        </div>
                      )}
                      {activity.location && (
                        <div className="flex items-start gap-3 col-span-2">
                          <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">活动地点</p>
                            <p className="font-semibold text-slate-900">{activity.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {activity.description && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="p-4 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-900">活动描述</h3>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-sm leading-relaxed text-slate-600">{activity.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Related Info */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">关联信息</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {activity.customerId && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Building className="w-5 h-5 text-slate-400" />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">客户</p>
                            <Button
                              variant="link"
                              className="h-auto p-0 font-medium text-blue-600"
                              onClick={() => navigate(`/customers/${activity.customerId}`)}
                            >
                              {activity.customerName || "未知客户"}
                            </Button>
                          </div>
                        </div>
                      )}
                      {activity.contactId && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Users className="w-5 h-5 text-slate-400" />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">联系人</p>
                            <Button
                              variant="link"
                              className="h-auto p-0 font-medium text-blue-600"
                              onClick={() => navigate(`/contacts/${activity.contactId}`)}
                            >
                              {activity.contactName || "未知联系人"}
                            </Button>
                          </div>
                        </div>
                      )}
                      {!activity.customerId && !activity.contactId && (
                        <p className="text-sm text-slate-500 text-center py-4">暂无关联信息</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Full Description */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">活动内容</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm leading-relaxed text-slate-600">
                      {activity.description || "暂无活动内容描述"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Related Tab */}
            <TabsContent value="related" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Related Contacts */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">相关联系人</h3>
                      <Badge variant="secondary" className="text-xs">{relatedContacts.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {relatedContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                                {(contact.name || "C").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{contact.name}</p>
                              <Badge variant="outline" className="text-xs mt-1">{contact.role}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      {relatedContacts.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">
                          暂无相关联系人
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Related Opportunities */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">相关商机</h3>
                      <Badge variant="secondary" className="text-xs">{relatedOpportunities.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {relatedOpportunities.map((opp) => (
                        <div
                          key={opp.id}
                          className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/opportunities/${opp.id}`)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-slate-900 truncate">{opp.name}</p>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {opp.stage}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-emerald-600">¥{Number(opp.amount).toLocaleString()}</span>
                              <span className="text-slate-500">{opp.probability}%</span>
                            </div>
                            <Progress value={opp.probability || 0} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                      {relatedOpportunities.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">
                          暂无相关商机
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
    </div>
  )
}

export default ActivityDetail
