/**
 * 最近活动流组件 (RecentActivity)
 * 功能：时间线展示、活动类型图标、用户头像 + 描述
 */

import * as React from 'react'
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  MessageSquare,
  DollarSign,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export interface ActivityItem {
  id: string
  type:
    | 'call'
    | 'meeting'
    | 'email'
    | 'task'
    | 'deal'
    | 'note'
    | 'payment'
    | 'customer'
    | 'opportunity'
  title: string
  description?: string
  user: {
    name: string
    avatar?: string
  }
  customer?: string
  time: string
  timestamp: number
  metadata?: Record<string, unknown>
}

interface RecentActivityProps {
  activities?: ActivityItem[]
  onActivityClick?: (activity: ActivityItem) => void
  maxItems?: number
  className?: string
}

const activityConfig: Record<
  ActivityItem['type'],
  {
    icon: React.ComponentType<{ className?: string }>
    color: string
    bg: string
    label: string
  }
> = {
  call: {
    icon: Phone,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: '电话',
  },
  meeting: {
    icon: Calendar,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: '会议',
  },
  email: {
    icon: Mail,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: '邮件',
  },
  task: {
    icon: CheckCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: '任务',
  },
  deal: {
    icon: DollarSign,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: '成交',
  },
  note: {
    icon: FileText,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    label: '备注',
  },
  payment: {
    icon: DollarSign,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: '回款',
  },
  customer: {
    icon: User,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: '客户',
  },
  opportunity: {
    icon: Briefcase,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    label: '商机',
  },
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'deal',
    title: '北京科技创新签约完成',
    description: '合同金额：¥580,000',
    user: { name: '李明', avatar: '' },
    customer: '北京科技创新有限公司',
    time: '10 分钟前',
    timestamp: Date.now() - 10 * 60 * 1000,
  },
  {
    id: '2',
    type: 'meeting',
    title: '上海贸易需求会议',
    description: '讨论了 Q2 采购计划',
    user: { name: '王芳', avatar: '' },
    customer: '上海贸易集团',
    time: '30 分钟前',
    timestamp: Date.now() - 30 * 60 * 1000,
  },
  {
    id: '3',
    type: 'call',
    title: '广州制造电话跟进',
    description: '确认了产品规格需求',
    user: { name: '陈静', avatar: '' },
    customer: '广州制造有限公司',
    time: '1 小时前',
    timestamp: Date.now() - 60 * 60 * 1000,
  },
  {
    id: '4',
    type: 'email',
    title: '深圳互联网报价发送',
    description: '发送了正式报价单',
    user: { name: '张伟', avatar: '' },
    customer: '深圳互联网公司',
    time: '2 小时前',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: '5',
    type: 'task',
    title: '杭州电商合同审批',
    description: '已完成合同审批流程',
    user: { name: '赵敏', avatar: '' },
    customer: '杭州电商公司',
    time: '3 小时前',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: '6',
    type: 'opportunity',
    title: '新增商机 - 南京信息',
    description: '预计金额：¥320,000',
    user: { name: '李明', avatar: '' },
    customer: '南京信息技术',
    time: '4 小时前',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: '7',
    type: 'payment',
    title: '收到回款',
    description: '武汉商贸回款 ¥150,000',
    user: { name: '王芳', avatar: '' },
    customer: '武汉商贸集团',
    time: '5 小时前',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: '8',
    type: 'customer',
    title: '新增客户',
    description: '成都科技录入系统',
    user: { name: '陈静', avatar: '' },
    customer: '成都科技公司',
    time: '昨天',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
]

export function RecentActivity({
  activities = defaultActivities,
  onActivityClick,
  maxItems = 10,
  className,
}: RecentActivityProps) {
  const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp)

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">最近活动</CardTitle>
        </div>
        <Badge variant="outline">{activities.length} 条</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-4 py-2">
            {sortedActivities.slice(0, maxItems).map((activity, index) => {
              const config = activityConfig[activity.type]
              const Icon = config.icon

              return (
                <div key={activity.id} className="relative">
                  {/* 时间线 */}
                  {index < sortedActivities.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-px bg-border" />
                  )}

                  <div
                    className="flex gap-3 py-3 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                    onClick={() => onActivityClick?.(activity)}
                  >
                    {/* 图标 */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center relative z-10`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {activity.description}
                            </p>
                          )}
                          {activity.customer && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {activity.customer}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>

                      {/* 用户信息 */}
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(activity.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {activity.user.name}
                        </span>
                        <Badge variant="secondary" className="text-[10px] h-4">
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {sortedActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无活动记录</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
