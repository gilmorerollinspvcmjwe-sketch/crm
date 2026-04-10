/**
 * 通知下拉组件 (NotificationDropdown)
 * 显示未读数量徽章，支持标记已读、筛选类型
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
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
  FileText,
  UserPlus,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications, type NotificationType } from '@/hooks/useNotifications'

// 通知类型图标配置
const typeIconConfig: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  system: Info,
  task: Clock,
  approval: FileText,
  assignment: UserPlus,
}

// 通知类型颜色配置
const typeColorConfig: Record<
  NotificationType,
  { color: string; bg: string; label: string }
> = {
  system: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: '系统' },
  task: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: '待办' },
  approval: { color: 'text-red-500', bg: 'bg-red-500/10', label: '审批' },
  assignment: { color: 'text-purple-500', bg: 'bg-purple-500/10', label: '分配' },
}

// 优先级配置
const priorityConfig: Record<'low' | 'medium' | 'high' | 'urgent', { color: string; label: string }> = {
  low: { color: 'text-gray-500', label: '低' },
  medium: { color: 'text-blue-500', label: '中' },
  high: { color: 'text-orange-500', label: '高' },
  urgent: { color: 'text-red-500', label: '紧急' },
}

export function NotificationDropdown() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'unread'>('all')
  const [selectedType, setSelectedType] = React.useState<NotificationType | 'all'>('all')

  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    deleteAll,
    typeConfig,
  } = useNotifications()

  const unreadCount = stats.unread

  // 筛选通知
  const filteredNotifications = notifications.filter((n) => {
    if (selectedTab === 'unread' && n.read) return false
    if (selectedType !== 'all' && n.type !== selectedType) return false
    return true
  })

  // 排序（最新的在前）
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const now = Date.now()
    const time = new Date(timestamp).getTime()
    const diff = now - time
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  // 处理通知点击
  const handleNotificationClick = (url?: string) => {
    if (url) {
      navigate(url)
    }
    setIsOpen(false)
  }

  // 渲染单个通知
  const renderNotification = (notification: typeof notifications[0]) => {
    const typeInfo = typeColorConfig[notification.type]
    const priorityInfo = priorityConfig[notification.priority]
    const Icon = typeIconConfig[notification.type]

    return (
      <div
        key={notification.id}
        className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
          !notification.read ? 'bg-muted/30' : ''
        }`}
        onClick={() => {
          if (!notification.read) {
            markAsRead([notification.id])
          }
          handleNotificationClick(notification.action?.url)
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
                    handleNotificationClick(notification.action?.url)
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
                  markAsRead([notification.id])
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
                deleteNotification([notification.id])
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      {/* 触发按钮 */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* 下拉内容 */}
      <DropdownMenuContent align="end" className="w-96">
        {/* 头部 */}
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
              onClick={() => markAllAsRead()}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              全部已读
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => deleteAll()}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* 全部/未读 Tab */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'all' | 'unread')}>
          <div className="px-3 py-2 border-b">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="unread">未读</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* 类型筛选 */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center gap-1 flex-wrap">
            <Badge
              variant={selectedType === 'all' ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedType('all')}
            >
              全部
            </Badge>
            {(Object.keys(typeColorConfig) as NotificationType[]).map((type) => {
              const config = typeColorConfig[type]
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

        {/* 通知列表 */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sortedNotifications.length > 0 ? (
            sortedNotifications.map(renderNotification)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无通知</p>
            </div>
          )}
        </ScrollArea>

        {/* 底部链接 */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className="w-full text-xs"
            size="sm"
            onClick={() => handleNotificationClick('/notifications')}
          >
            查看全部通知
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
