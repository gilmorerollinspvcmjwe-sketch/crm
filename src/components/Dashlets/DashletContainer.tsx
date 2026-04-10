'use client'

import * as React from 'react'
import { GripIcon, MoreHorizontal, RefreshCw, X, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DashletConfig, GridPosition } from '@/types/dashlet'

interface DashletContainerProps {
  config: DashletConfig
  children: React.ReactNode
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
  className?: string
}

export function DashletContainer({
  config,
  children,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
  className = '',
}: DashletContainerProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastRefresh, setLastRefresh] = React.useState<Date>(new Date())

  const handleRefresh = React.useCallback(() => {
    if (onRefresh) {
      setIsRefreshing(true)
      onRefresh(config.id)
      setTimeout(() => {
        setIsRefreshing(false)
        setLastRefresh(new Date())
      }, 1000)
    }
  }, [config.id, onRefresh])

  // Format grid position as Tailwind classes
  const getGridClasses = (pos: GridPosition): string => {
    return `col-span-${Math.min(pos.w, 12)} row-span-${pos.h}`
  }

  const getMinHeight = (h: number): string => {
    // Base height unit ~120px, adjust based on grid height
    return `min-h-[${h * 120}px]`
  }

  return (
    <Card
      className={`
        group relative overflow-hidden
        transition-all duration-200
        ${isEditing ? 'ring-2 ring-primary/50 ring-offset-2' : ''}
        ${className}
      `}
      style={{
        minHeight: config.gridPosition.h * 120,
      }}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          {isEditing && (
            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded">
              <GripIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <CardTitle className="text-base font-medium truncate">
            {config.title}
          </CardTitle>
          {config.description && (
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {config.description}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {config.refreshInterval && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(config.id)}>
                  <Settings className="h-4 w-4 mr-2" />
                  配置
                </DropdownMenuItem>
              )}
              {onRefresh && (
                <DropdownMenuItem onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onRemove && (
                <DropdownMenuItem
                  onClick={() => onRemove(config.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  移除
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-0">
        {children}
      </CardContent>

      {/* Refresh indicator */}
      {config.refreshInterval && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {isRefreshing ? (
            <span className="text-primary">刷新中...</span>
          ) : (
            <span>每 {config.refreshInterval}s 刷新</span>
          )}
        </div>
      )}
    </Card>
  )
}

export default DashletContainer
