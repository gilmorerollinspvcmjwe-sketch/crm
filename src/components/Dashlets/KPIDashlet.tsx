'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'
import { DashletContainer } from './DashletContainer'
import { DashletConfig, KPIData } from '@/types/dashlet'

interface KPIDashletProps {
  config: DashletConfig
  data: KPIData
  icon?: React.ReactNode
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
}

export function KPIDashlet({
  config,
  data,
  icon,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
}: KPIDashletProps) {
  const trend = data.trend || (data.change !== undefined ? (data.change >= 0 ? 'up' : 'down') : 'neutral')
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  const TrendIcon: LucideIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      if (data.format === 'currency') {
        return `${data.prefix || '¥'}${value.toLocaleString()}`
      }
      if (data.format === 'percent') {
        return `${value}${data.suffix || '%'}`
      }
      return value.toLocaleString()
    }
    return value
  }

  return (
    <DashletContainer
      config={config}
      isEditing={isEditing}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={onRefresh}
    >
      <div className="flex items-center justify-between h-full min-h-[100px]">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{config.description}</p>
          <p className="text-3xl font-bold tracking-tight">
            {formatValue(data.value)}
          </p>
          
          {data.change !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`
                  flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${isNegative ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                  ${trend === 'neutral' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' : ''}
                `}
              >
                <TrendIcon className="h-3 w-3" />
                <span>
                  {isPositive ? '+' : ''}{data.change}%
                </span>
              </div>
              {data.changeLabel && (
                <span className="text-xs text-muted-foreground">
                  {data.changeLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="p-4 rounded-xl bg-primary/10">
            {icon}
          </div>
        )}
      </div>
    </DashletContainer>
  )
}

export default KPIDashlet
