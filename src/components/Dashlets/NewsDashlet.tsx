'use client'

import * as React from 'react'
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { DashletContainer } from './DashletContainer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashletConfig, NewsConfig, NewsItem } from '@/types/dashlet'

interface NewsDashletProps {
  config: DashletConfig
  newsConfig: NewsConfig
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
  onItemClick?: (item: NewsItem) => void
}

// Mock news data
const MOCK_NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    title: '系统升级通知',
    content: 'CRM系统将于本周六凌晨2:00-6:00进行版本升级，届时系统将暂时无法访问。',
    author: '系统管理员',
    publishedAt: '2026-04-08 10:00',
    category: '系统公告',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Q2销售目标已更新',
    content: '各区域Q2销售目标已下发，请各位销售及时查看并制定跟进计划。',
    author: '销售部',
    publishedAt: '2026-04-07 15:30',
    category: '业务通知',
    priority: 'medium',
  },
  {
    id: '3',
    title: '新产品上线培训通知',
    content: '新产品线将于下周一正式上线，届时将组织线上培训，请相关人员准时参加。',
    author: '产品部',
    publishedAt: '2026-04-06 09:00',
    category: '培训通知',
    priority: 'medium',
  },
  {
    id: '4',
    title: '清明节假期安排',
    content: '根据公司安排，清明节放假时间为4月4日-4月6日，共3天。',
    author: '人力资源部',
    publishedAt: '2026-04-01 10:00',
    category: '行政通知',
    priority: 'low',
  },
]

export function NewsDashlet({
  config,
  newsConfig,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
  onItemClick,
}: NewsDashletProps) {
  const items = newsConfig.items?.length ? newsConfig.items : MOCK_NEWS_DATA
  const maxItems = newsConfig.maxItems || items.length
  const displayItems = items.slice(0, maxItems)

  const PriorityIcon = ({ priority }: { priority?: string }) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <Bell className="h-4 w-4 text-blue-500" />
      default:
        return <Megaphone className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityColors = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900'
      case 'low':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900'
      default:
        return 'bg-muted/30 border-muted'
    }
  }

  const getCategoryBadge = (category?: string) => {
    if (!newsConfig.showCategory || !category) return null
    const colors: Record<string, string> = {
      '系统公告': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      '业务通知': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      '培训通知': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      '行政通知': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    }
    return (
      <Badge className={colors[category] || ''} variant="secondary">
        {category}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date(2026, 3, 8)
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diff < 1) return '刚刚'
    if (diff < 60) return `${diff}分钟前`
    if (diff < 24) return `${Math.floor(diff / 60)}小时前`
    if (diff < 48) return '昨天'
    return dateStr
  }

  return (
    <DashletContainer
      config={config}
      isEditing={isEditing}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={onRefresh}
    >
      <div className="space-y-3">
        {displayItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className={`
              p-3 rounded-lg border cursor-pointer
              transition-all hover:shadow-md
              ${getPriorityColors(item.priority)}
            `}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <PriorityIcon priority={item.priority} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  {getCategoryBadge(item.category)}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.content}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {item.author && (
                    <span className="text-xs text-muted-foreground">
                      {item.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.publishedAt)}
                  </span>
                </div>
              </div>
              {onItemClick && (
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
              )}
            </div>
          </div>
        ))}

        {items.length > maxItems && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-xs">
              查看全部 {items.length} 条公告
            </Button>
          </div>
        )}
      </div>
    </DashletContainer>
  )
}

export default NewsDashlet
