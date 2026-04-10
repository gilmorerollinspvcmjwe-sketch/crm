/**
 * 通知中心组件 (NotificationCenter)
 * 功能：通知列表展示、未读标记、通知分类、批量操作
 */

import * as React from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type NotificationType = 'system' | 'task' | 'message' | 'alert' | 'success'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: {
    label: string
    url?: string
    onClick?: () => void
  }
  avatar?: string
  metadata?: Record<string, string>
}

interface NotificationCenterProps {
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onMarkAsRead?: (ids: string[]) => void
  onMarkAllAsRead?: () => void
  onDelete?: (ids: string[]) => void
  onDeleteAll?: () => void
  className?: string
}

const typeConfig: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ className?: string }>
    color: string
    bg: string
    label: string
  }
> = {
  system: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: '系统',
  },
  task: {
    icon: Clock,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: '任务',
  },
  message: {
    icon: Bell,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: '消息',
  },
  alert: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: '警告',
  },
  success: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: '成功',
  },
}

const priorityConfig: Record<NotificationPriority, { color: string; label: string }> = {
  low: { color: 'text-gray-500', label: '低' },
  medium: { color: 'text-blue-500', label: '中' },
  high: { color: 'text-orange-500', label: '高' },
  urgent: { color: 'text-red-500', label: '紧急' },
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    priority: 'urgent',
    title: '回款逾期提醒',
    message: '北京科技创新有限公司的合同款项已逾期 7 天，金额为 ¥58,000',
    timestamp: Date.now() - 5 * 60 * 1000,
    read: false,
    action: { label: '查看详情', url: '/payment/1' },
    metadata: { customer: '北京科技创新', amount: '¥58,000' },
  },
  {
    id: '2',
    type: 'task',
    priority: 'high',
    title: '待办任务提醒',
    message: '您有 3 个待办任务即将到期，请及时处理',
    timestamp: Date.now() - 30 * 60 * 1000,
    read: false,
    action: { label: '查看任务', url: '/tasks' },
  },
  {
    id: '3',
    type: 'success',
    priority: 'medium',
    title: '合同签署完成',
    message: '上海智能制造的合同已成功签署',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: false,
    action: { label: '查看合同', url: '/contract/2' },
  },
  {
    id: '4',
    type: 'message',
    priority: 'medium',
    title: '新客户分配',
    message: '李明分配给您 2 个新客户，请及时跟进',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    read: true,
    action: { label: '查看客户', url: '/customers' },
  },
  {
    id: '5',
    type: 'system',
    priority: 'low',
    title: '系统更新通知',
    message: 'CRM 系统已更新至 v2.5.0，新增 AI 销售预测功能',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    action: { label: '查看更新', url: '/changelog' },
  },
  {
    id: '6',
    type: 'alert',
    priority: 'high',
    title: '商机流失风险',
    message: '检测到 3 个高价值商机有流失风险，建议尽快跟进',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: true,
    action: { label: '查看商机', url: '/opportunities' },
  },
  {
    id: '7',
    type: 'success',
    priority: 'medium',
    title: '月度目标达成',
    message: '恭喜！您已提前完成本月销售目标',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: '8',
    type: 'task',
    priority: 'medium',
    title: '周报提醒',
    message: '本周工作周报还未提交，请在周五前完成',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    read: true,
    action: { label: '提交周报', url: '/reports/weekly' },
  },
]

export function NotificationCenter({
  notifications = defaultNotifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'unread'>('all')
  const [selectedType, setSelectedType] = React.useState<NotificationType | 'all'>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (selectedTab === 'unread' && n.read) return false
    if (selectedType !== 'all' && n.type !== selectedType) return false
    return true
  })

  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => b.timestamp - a.timestamp
  )

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.([id])
  }

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    onMarkAsRead?.(unreadIds)
    onMarkAllAsRead?.()
  }

  const handleDelete = (id: string) => {
    onDelete?.([id])
  }

  const handleDeleteAll = () => {
    onDeleteAll?.()
  }

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

  const renderNotification = (notification: Notification) => {
    const typeInfo = typeConfig[notification.type]
    const priorityInfo = priorityConfig[notification.priority]
    const Icon = typeInfo.icon

    return (
      <div
        key={notification.id}
        className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
          !notification.read ? 'bg-muted/30' : ''
        }`}
        onClick={() => {
          onNotificationClick?.(notification)
          handleMarkAsRead(notification.id)
        }}
      >
        <div className="flex items-start gap-3">
          {/* 图标 */}
          <div className={`p-2 rounded-lg ${typeInfo.bg} flex-shrink-0`}>
            <Icon className={`h-4 w-4 ${typeInfo.color}`} />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-medium ${
                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {notification.title}
                </p>
                {!notification.read && (
                  <Badge className="h-4 text-[10px] bg-blue-500">未读</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatTime(notification.timestamp)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {notification.message}
            </p>

            {/* 优先级和操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs ${priorityInfo.color}`}>
                  {priorityInfo.label}
                </span>
                {notification.metadata &&
                  Object.entries(notification.metadata).slice(0, 2).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-[10px] h-4">
                      {value}
                    </Badge>
                  ))}
              </div>
              {notification.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    notification.action?.onClick?.()
                  }}
                >
                  {notification.action.label}
                </Button>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleMarkAsRead(notification.id)
                }}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(notification.id)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 通知按钮 */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                variant="destructive"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">通知中心</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} 未读</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                全部已读
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleDeleteAll}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'all' | 'unread')}>
            <div className="px-3 py-2 border-b">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="unread">未读</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-1 flex-wrap">
              <Badge
                variant={selectedType === 'all' ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedType('all')}
              >
                全部
              </Badge>
              {(Object.keys(typeConfig) as NotificationType[]).map((type) => {
                const config = typeConfig[type]
                return (
                  <Badge
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    className={`cursor-pointer text-xs ${
                      selectedType === type ? config.bg : ''
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    {config.label}
                  </Badge>
                )
              })}
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {sortedNotifications.length > 0 ? (
              sortedNotifications.map(renderNotification)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无通知</p>
              </div>
            )}
          </ScrollArea>

          <div className="p-3 border-t">
            <Button variant="ghost" className="w-full text-xs" size="sm">
              查看全部通知
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 通知详情对话框（可选） */}
      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>通知详情</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NotificationCenter
