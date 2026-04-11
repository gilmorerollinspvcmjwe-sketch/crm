/**
 * 通知下拉组件
 *
 * 调整为与新主框架一致的顶部入口与通知面板。
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Info,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications, type NotificationType } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

const typeIconConfig: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  system: Info,
  task: Clock,
  approval: FileText,
  assignment: UserPlus,
}

const typeColorConfig: Record<NotificationType, { color: string; bg: string; label: string }> = {
  system: { color: 'text-primary', bg: 'bg-primary/10', label: '系统' },
  task: { color: 'text-warning-foreground', bg: 'bg-warning/12', label: '待办' },
  approval: { color: 'text-destructive', bg: 'bg-destructive/10', label: '审批' },
  assignment: { color: 'text-foreground/75', bg: 'bg-muted', label: '分配' },
}

const priorityConfig: Record<'low' | 'medium' | 'high' | 'urgent', { color: string; label: string }> = {
  low: { color: 'text-muted-foreground', label: '低' },
  medium: { color: 'text-primary', label: '中' },
  high: { color: 'text-warning-foreground', label: '高' },
  urgent: { color: 'text-destructive', label: '紧急' },
}

interface NotificationDropdownProps {
  triggerClassName?: string
  contentClassName?: string
}

export function NotificationDropdown({ triggerClassName, contentClassName }: NotificationDropdownProps) {
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
  } = useNotifications()

  const unreadCount = stats.unread

  const filteredNotifications = notifications.filter((item) => {
    if (selectedTab === 'unread' && item.read) return false
    if (selectedType !== 'all' && item.type !== selectedType) return false
    return true
  })

  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

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

  const handleNotificationClick = (url?: string) => {
    if (url) {
      navigate(url)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'relative rounded-2xl border-border/70 bg-card shadow-[var(--shadow-sm)] hover:bg-accent/65',
            triggerClassName
          )}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-[25rem] overflow-hidden rounded-[1.25rem] border border-border/70 bg-[oklch(var(--shell-panel-elevated)/0.98)] p-0 shadow-[var(--shadow-xl)]',
          contentClassName
        )}
      >
        <div className="flex items-center justify-between border-b border-border/70 p-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold tracking-[-0.01em]">通知中心</h4>
            {unreadCount > 0 && <Badge variant="secondary">{unreadCount} 未读</Badge>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => markAllAsRead()}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              全部已读
            </Button>
            <Button variant="ghost" size="iconSm" aria-label="清空通知" onClick={() => deleteAll()}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | 'unread')}>
          <div className="border-b border-border/70 px-4 py-3">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted/55">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="unread">未读</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className="border-b border-border/70 px-4 py-3">
          <div className="flex flex-wrap items-center gap-1">
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
                  className={cn('cursor-pointer text-xs', selectedType === type && config.bg)}
                  onClick={() => setSelectedType(type)}
                >
                  {config.label}
                </Badge>
              )
            })}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Clock className="h-5 w-5 animate-spin" />
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">暂无通知</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => {
              const typeInfo = typeColorConfig[notification.type]
              const priorityInfo = priorityConfig[notification.priority]
              const Icon = typeIconConfig[notification.type]

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'group cursor-pointer border-b border-border/60 p-3 transition-colors last:border-b-0 hover:bg-accent/45',
                    !notification.read && 'bg-muted/30'
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead([notification.id])
                    }
                    handleNotificationClick(notification.action?.url)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl', typeInfo.bg)}>
                      <Icon className={cn('h-4 w-4', typeInfo.color)} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-sm font-medium', notification.read ? 'text-muted-foreground' : 'text-foreground')}>
                            {notification.title}
                          </p>
                          {!notification.read && <Badge className="h-4 text-[10px]">未读</Badge>}
                        </div>
                        <span className="flex-shrink-0 text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                      </div>

                      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn('text-xs', priorityInfo.color)}>{priorityInfo.label}</span>
                          {notification.metadata &&
                            Object.entries(notification.metadata)
                              .slice(0, 2)
                              .map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="h-4 text-[10px]">
                                  {value}
                                </Badge>
                              ))}
                        </div>
                        {notification.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleNotificationClick(notification.action?.url)
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="iconSm"
                          aria-label="标记已读"
                          onClick={(event) => {
                            event.stopPropagation()
                            markAsRead([notification.id])
                          }}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="iconSm"
                        aria-label="删除通知"
                        className="hover:text-destructive"
                        onClick={(event) => {
                          event.stopPropagation()
                          deleteNotification([notification.id])
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </ScrollArea>

        <div className="border-t border-border/70 p-3">
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => handleNotificationClick('/notifications')}>
            查看全部通知
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
