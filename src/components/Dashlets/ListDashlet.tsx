'use client'

import * as React from 'react'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  ChevronRight,
  User,
} from 'lucide-react'
import { DashletContainer } from './DashletContainer'
import { DashletConfig, ListConfig, ListItem } from '@/types/dashlet'

interface ListDashletProps {
  config: DashletConfig
  listConfig: ListConfig
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
  onItemClick?: (item: ListItem) => void
}

// Mock list data
const MOCK_LIST_DATA: ListItem[] = [
  {
    id: '1',
    title: '李明 - 商机跟进',
    description: '华腾科技项目进入合同签订阶段',
    timestamp: '10分钟前',
    status: 'warning',
  },
  {
    id: '2',
    title: '王芳 - 新签客户',
    description: '盛世集团正式签约，首单50万',
    timestamp: '30分钟前',
    status: 'success',
  },
  {
    id: '3',
    title: '陈静 - 任务完成',
    description: '完成Q2销售报告撰写',
    timestamp: '1小时前',
    status: 'success',
  },
  {
    id: '4',
    title: '系统通知',
    description: '本月目标完成度：83%',
    timestamp: '2小时前',
    status: 'info',
  },
  {
    id: '5',
    title: '张伟 - 逾期提醒',
    description: '智联科技项目已逾期3天',
    timestamp: '3小时前',
    status: 'error',
  },
]

export function ListDashlet({
  config,
  listConfig,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
  onItemClick,
}: ListDashletProps) {
  const items = listConfig.items?.length ? listConfig.items : MOCK_LIST_DATA
  const maxItems = listConfig.maxItems || items.length
  const displayItems = items.slice(0, maxItems)

  const StatusIcon = ({ status }: { status?: string }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
    }
  }

  const getStatusBgColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      case 'info':
      default:
        return 'border-l-blue-500'
    }
  }

  return (
    <DashletContainer
      config={config}
      isEditing={isEditing}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={onRefresh}
    >
      <div className="space-y-2">
        {displayItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className={`
              flex items-start gap-3 p-3 rounded-lg
              border-l-4 ${getStatusBgColor(item.status)}
              bg-muted/30 hover:bg-muted/50
              transition-colors cursor-pointer
              ${onItemClick ? '' : ''}
            `}
          >
            {listConfig.showAvatar && (
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {listConfig.showStatus && (
                  <StatusIcon status={item.status} />
                )}
                <p className="font-medium text-sm truncate">{item.title}</p>
              </div>
              
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}

              {item.metadata && (
                <div className="flex items-center gap-2 mt-2">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <span key={key} className="text-xs bg-muted px-2 py-0.5 rounded">
                      {value}
                    </span>
                  ))}
                </div>
              )}

              {listConfig.showTimestamp && item.timestamp && (
                <p className="text-xs text-muted-foreground mt-2">
                  {item.timestamp}
                </p>
              )}
            </div>

            {onItemClick && (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
            )}
          </div>
        ))}

        {items.length > maxItems && (
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">
              还有 {items.length - maxItems} 条未显示
            </span>
          </div>
        )}
      </div>
    </DashletContainer>
  )
}

export default ListDashlet
