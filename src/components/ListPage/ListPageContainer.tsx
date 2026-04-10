/**
 * 统一列表页容器组件
 * Unified List Page Container
 * 
 * 提供统一的列表页布局、样式、操作区域
 * 参考工业级 SaaS 设计（Salesforce、HubSpot）
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface ListPageAction {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  disabled?: boolean
}

export interface ListPageContainerProps {
  title: string
  subtitle?: string
  actions?: ListPageAction[]
  stats?: React.ReactNode
  filters?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
  loading?: boolean
  empty?: boolean
  emptyContent?: React.ReactNode
  selectedCount?: number
  totalCount?: number
}

export function ListPageContainer({
  title,
  subtitle,
  actions,
  stats,
  filters,
  children,
  className,
  contentClassName,
  loading = false,
  empty = false,
  emptyContent,
  selectedCount,
  totalCount,
}: ListPageContainerProps) {
  return (
    <div className={cn('min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300', className)}>
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
          </div>
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <a href={action.href} className="flex items-center gap-2">
                      {action.icon && <action.icon className="h-4 w-4" />}
                      <span className="hidden sm:inline">{action.label}</span>
                    </a>
                  ) : (
                    <>
                      {action.icon && <action.icon className="h-4 w-4" />}
                      <span className="hidden sm:inline">{action.label}</span>
                    </>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {stats}
            {selectedCount !== undefined && selectedCount > 0 && (
              <Badge variant="secondary" className="animate-in fade-in">
                已选择 {selectedCount} 项
              </Badge>
            )}
          </div>
        )}

        {/* Filters */}
        {filters && <div className="space-y-2">{filters}</div>}

        {/* Content */}
        <div
          className={cn(
            'rounded-lg border bg-card shadow-sm',
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
    </div>
  )
}

export default ListPageContainer
