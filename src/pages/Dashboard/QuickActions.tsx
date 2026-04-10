/**
 * 快捷操作面板组件 (QuickActions)
 * 功能：常用操作按钮、新建客户、新建商机等
 */

import * as React from 'react'
import {
  Plus,
  UserPlus,
  Briefcase,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  MessageSquare,
  Upload,
  BarChart3,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  description?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger'
  shortcut?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
  onActionClick?: (action: QuickAction) => void
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-customer',
    label: '新建客户',
    icon: UserPlus,
    action: () => console.log('新建客户'),
    description: '添加新客户信息',
    color: 'primary',
  },
  {
    id: 'new-opportunity',
    label: '新建商机',
    icon: Briefcase,
    action: () => console.log('新建商机'),
    description: '创建新的销售商机',
    color: 'success',
  },
  {
    id: 'new-quote',
    label: '创建报价',
    icon: FileText,
    action: () => console.log('创建报价'),
    description: '生成客户报价单',
    color: 'secondary',
  },
  {
    id: 'new-task',
    label: '添加任务',
    icon: CheckSquare,
    action: () => console.log('添加任务'),
    description: '创建待办任务',
    color: 'primary',
  },
  {
    id: 'send-email',
    label: '发送邮件',
    icon: Mail,
    action: () => console.log('发送邮件'),
    description: '群发邮件给客户',
    color: 'secondary',
  },
  {
    id: 'make-call',
    label: '拨打电话',
    icon: Phone,
    action: () => console.log('拨打电话'),
    description: '呼叫客户电话',
    color: 'success',
  },
  {
    id: 'schedule-meeting',
    label: '安排会议',
    icon: Calendar,
    action: () => console.log('安排会议'),
    description: '预约客户会议',
    color: 'primary',
  },
  {
    id: 'send-message',
    label: '发送消息',
    icon: MessageSquare,
    action: () => console.log('发送消息'),
    description: '发送即时消息',
    color: 'secondary',
  },
]

const colorConfig = {
  primary: {
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  secondary: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
  },
  success: {
    bg: 'bg-green-500/10 hover:bg-green-500/20',
    text: 'text-green-500',
    border: 'border-green-500/20',
  },
  danger: {
    bg: 'bg-red-500/10 hover:bg-red-500/20',
    text: 'text-red-500',
    border: 'border-red-500/20',
  },
}

export function QuickActions({
  actions = defaultActions,
  onActionClick,
  className,
}: QuickActionsProps) {
  const [moreActionsOpen, setMoreActionsOpen] = React.useState(false)

  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action)
    } else {
      action.action()
    }
  }

  // 显示前 6 个主要操作，其余放在更多菜单中
  const mainActions = actions.slice(0, 6)
  const moreActions = actions.slice(6)

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">快捷操作</CardTitle>
        </div>
        {moreActions.length > 0 && (
          <DropdownMenu open={moreActionsOpen} onOpenChange={setMoreActionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                更多
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {moreActions.map((action) => {
                const Icon = action.icon
                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => {
                      handleActionClick(action)
                      setMoreActionsOpen(false)
                    }}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                自定义操作
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mainActions.map((action) => {
            const Icon = action.icon
            const colors = colorConfig[action.color || 'primary']

            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all hover:scale-105 active:scale-95`}
              >
                <Icon className={`h-6 w-6 mb-2 ${colors.text}`} />
                <span className="text-xs font-medium text-center">{action.label}</span>
                {action.description && (
                  <span className="text-[10px] text-muted-foreground mt-0.5 hidden lg:block">
                    {action.description}
                  </span>
                )}
                {action.shortcut && (
                  <kbd className="mt-1 px-1.5 py-0.5 text-[9px] bg-background border rounded text-muted-foreground">
                    {action.shortcut}
                  </kbd>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
