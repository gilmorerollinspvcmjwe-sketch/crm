/**
 * Workbench Page - CRM Personal Workbench
 * Migrated from Ant Design to shadcn/ui + Tailwind CSS
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  TrendingUp,
  Bell,
  ChevronRight,
  Star,
  MessageSquare,
  FileText,
  Phone,
  Mail,
} from 'lucide-react'
import { useActivityStats } from '@/hooks/api/useActivities'

// ============================================================
// Mock Data for Workbench
// ============================================================
const todaySchedule = [
  { id: 1, time: '09:00', title: '客户拜访 - 北京科技', type: 'visit', status: 'pending' },
  { id: 2, time: '10:30', title: '产品演示会议', type: 'meeting', status: 'pending' },
  { id: 3, time: '14:00', title: '报价单确认', type: 'task', status: 'pending' },
  { id: 4, time: '15:30', title: '电话回访 - 上海贸易', type: 'call', status: 'pending' },
  { id: 5, time: '17:00', title: '周报整理', type: 'task', status: 'pending' },
]

const myTargets = [
  { id: 1, name: '本月销售额', target: 50000, current: 35000, unit: '元' },
  { id: 2, name: '新增客户', target: 10, current: 7, unit: '户' },
  { id: 3, name: '活动完成率', target: 90, current: 75, unit: '%' },
  { id: 4, name: '商机转化', target: 5, current: 3, unit: '个' },
]

const recentCustomers = [
  { id: 'C001', name: '北京科技有限公司', status: '活跃', lastContact: '昨天', score: 95 },
  { id: 'C003', name: '深圳创新科技', status: '活跃', lastContact: '今天', score: 88 },
  { id: 'C006', name: '杭州电商', status: '活跃', lastContact: '2天前', score: 92 },
]

const notifications = [
  { id: 1, type: 'reminder', title: '活动提醒', content: '客户拜访将于30分钟后开始', time: '08:30' },
  { id: 2, type: 'approval', title: '审批待处理', content: '报价申请等待您的审批', time: '08:15' },
  { id: 3, type: 'mention', title: '@提及', content: '王芳在周报中提到了您', time: '昨天' },
  { id: 4, type: 'system', title: '系统通知', content: '本月报表已生成', time: '昨天' },
]

// ============================================================
// Today Schedule Card
// ============================================================
function TodayScheduleCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            今日日程
          </span>
          <Badge variant="secondary">{todaySchedule.length}项</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todaySchedule.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex flex-col items-center min-w-[50px]">
              <span className="text-sm font-medium">{item.time}</span>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <Badge variant="outline" className="mt-1">
                {item.type === 'visit' && '拜访'}
                {item.type === 'meeting' && '会议'}
                {item.type === 'call' && '电话'}
                {item.type === 'task' && '任务'}
              </Badge>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
        <Button variant="ghost" className="w-full justify-between">
          查看全部日程
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================================
// My Targets Card
// ============================================================
function MyTargetsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          我的指标
        </CardTitle>
        <CardDescription>本月目标完成情况</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {myTargets.map((target) => {
          const percentage = Math.min((target.current / target.target) * 100, 100)
          const isComplete = percentage >= 100

          return (
            <div key={target.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{target.name}</span>
                <span className={isComplete ? 'text-green-600' : 'text-muted-foreground'}>
                  {target.current} / {target.target} {target.unit}
                </span>
              </div>
              <Progress
                value={percentage}
                className={isComplete ? 'bg-green-100' : ''}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ============================================================
// Recent Customers Card
// ============================================================
function RecentCustomersCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          最近跟进客户
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentCustomers.map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  最后联系: {customer.lastContact}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                {customer.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{customer.score}分</span>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full justify-between">
          查看全部客户
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Notifications Card
// ============================================================
function NotificationsCard() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="h-4 w-4 text-yellow-500" />
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'mention':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            通知中心
          </span>
          <Badge variant="secondary">{notifications.length}条</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
          >
            <div className="p-1.5 rounded bg-muted">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.content}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {notification.time}
            </span>
          </div>
        ))}
        <Button variant="ghost" className="w-full justify-between">
          查看全部通知
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Quick Actions Card
// ============================================================
function QuickActionsCard() {
  const actions = [
    { icon: <Phone className="h-5 w-5" />, label: '新建电话', color: 'bg-blue-100 text-blue-600' },
    { icon: <Mail className="h-5 w-5" />, label: '发送邮件', color: 'bg-green-100 text-green-600' },
    { icon: <Calendar className="h-5 w-5" />, label: '创建会议', color: 'bg-purple-100 text-purple-600' },
    { icon: <Users className="h-5 w-5" />, label: '新建客户', color: 'bg-orange-100 text-orange-600' },
    { icon: <FileText className="h-5 w-5" />, label: '新建商机', color: 'bg-teal-100 text-teal-600' },
    { icon: <Target className="h-5 w-5" />, label: '创建任务', color: 'bg-pink-100 text-pink-600' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>快捷操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Workbench Page Component
// ============================================================
export function Workbench() {
  const { data: activityStats } = useActivityStats()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">个人工作台</h1>
            <p className="text-muted-foreground">今日工作概览</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              2026年4月3日 周五
            </Badge>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-yellow-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">待办活动</p>
                  <p className="text-2xl font-bold text-yellow-600">{activityStats?.planned || 5}</p>
                </div>
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日完成</p>
                  <p className="text-2xl font-bold text-green-600">3</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">逾期任务</p>
                  <p className="text-2xl font-bold text-red-600">{activityStats?.overdue || 0}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">本月业绩</p>
                  <p className="text-2xl font-bold text-blue-600">¥35,000</p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today Schedule */}
            <TodayScheduleCard />

            {/* Tabs Content */}
            <Tabs defaultValue="targets">
              <TabsList>
                <TabsTrigger value="targets">我的指标</TabsTrigger>
                <TabsTrigger value="customers">跟进客户</TabsTrigger>
              </TabsList>

              <TabsContent value="targets" className="mt-4">
                <MyTargetsCard />
              </TabsContent>

              <TabsContent value="customers" className="mt-4">
                <RecentCustomersCard />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActionsCard />

            {/* Notifications */}
            <NotificationsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workbench