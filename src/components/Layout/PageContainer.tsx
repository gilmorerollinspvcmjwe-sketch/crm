/**
 * 页面容器组件
 * 包含页面标题区域、操作按钮区域、内容区域、返回按钮处理
 */
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PageAction {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  disabled?: boolean
  dropdownItems?: PageAction[]
}

interface PageContainerProps {
  title?: string
  subtitle?: string
  actions?: PageAction[]
  showBackButton?: boolean
  backTo?: string
  backLabel?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  loading?: boolean
  empty?: boolean
  emptyContent?: React.ReactNode
}

export function PageContainer({
  title,
  subtitle,
  actions,
  showBackButton = false,
  backTo,
  backLabel = '返回',
  children,
  className,
  contentClassName,
  loading = false,
  empty = false,
  emptyContent,
}: PageContainerProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  // 渲染操作按钮
  const renderAction = (action: PageAction, index: number) => {
    if (action.dropdownItems) {
      return (
        <DropdownMenu key={index}>
          <DropdownMenuTrigger asChild>
            <Button variant={action.variant || 'outline'} size="sm">
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {action.dropdownItems.map((item, i) => (
              <DropdownMenuItem
                key={i}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    if (action.href) {
      return (
        <Button
          key={index}
          variant={action.variant || 'default'}
          size="sm"
          asChild
          disabled={action.disabled}
        >
          <Link to={action.href}>
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Link>
        </Button>
      )
    }

    return (
      <Button
        key={index}
        variant={action.variant || 'default'}
        size="sm"
        onClick={action.onClick}
        disabled={action.disabled}
      >
        {action.icon && <action.icon className="h-4 w-4 mr-2" />}
        {action.label}
      </Button>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* 页面标题区域 */}
      {(showBackButton || title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* 返回按钮 */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            )}

            {/* 标题 */}
            <div className="flex flex-col">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* 操作按钮区域 */}
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions.map(renderAction)}
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
      <div
        className={cn(
          'flex-1 rounded-lg border bg-card p-4',
          contentClassName
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : empty ? (
          emptyContent || (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">暂无数据</p>
              <p className="text-sm mt-1">点击上方按钮添加新内容</p>
            </div>
          )
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default PageContainer