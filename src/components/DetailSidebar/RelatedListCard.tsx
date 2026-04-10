/**
 * RelatedListCard - Related Items Card Component
 * 
 * Displays related records with:
 * - Expandable/collapsible content
 * - Item count badge
 * - Quick preview cards
 * - View all link
 */

import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ChevronDown,
  ChevronRight,
  Users,
  Lightbulb,
  CheckCircle,
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react'

/** Related item configuration */
export interface RelatedItem {
  /** Item unique ID */
  id: string
  /** Item title/name */
  title: string
  /** Item subtitle/description */
  subtitle?: string
  /** Item status/tag */
  status?: string
  /** Item status variant */
  statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  /** Additional metadata */
  metadata?: string | number
  /** Avatar initials (for contacts) */
  avatarInitials?: string
  /** Click handler */
  onClick?: () => void
  /** Priority/highlight flag */
  isPrimary?: boolean
}

export interface RelatedListCardProps {
  /** Card title (i18n key) */
  title: string
  /** Icon for card header */
  icon?: React.ReactNode
  /** Related items list */
  items?: RelatedItem[]
  /** Total count (if different from items.length) */
  totalCount?: number
  /** Maximum items to show before "View All" */
  maxItems?: number
  /** View all callback */
  onViewAll?: () => void
  /** View all label (i18n key) */
  viewAllLabel?: string
  /** Empty state message */
  emptyMessage?: string
  /** Custom class name */
  className?: string
  /** Initially expanded */
  defaultExpanded?: boolean
  /** Show item count badge */
  showCount?: boolean
  /** Card variant */
  variant?: 'default' | 'compact'
}

/** Default icon mapping for related types */
const typeIconMap: Record<string, React.ReactNode> = {
  contacts: <Users className="w-4 h-4" />,
  deals: <Lightbulb className="w-4 h-4" />,
  opportunities: <Lightbulb className="w-4 h-4" />,
  tickets: <CheckCircle className="w-4 h-4" />,
  activities: <Calendar className="w-4 h-4" />,
  notes: <FileText className="w-4 h-4" />,
}

/**
 * RelatedListCard Component
 * 
 * Displays a collapsible card with related items:
 * - Header with icon, title, and count badge
 * - Expandable content area
 * - Item cards with status badges
 * - View all link for overflow
 */
export function RelatedListCard({
  title,
  icon,
  items,
  totalCount,
  maxItems = 5,
  onViewAll,
  viewAllLabel = 'common.viewAll',
  emptyMessage = 'common.noData',
  className,
  defaultExpanded = true,
  showCount = true,
  variant = 'default',
}: RelatedListCardProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(defaultExpanded)

  const count = totalCount ?? (items?.length ?? 0)
  const visibleItems = items?.slice(0, maxItems) ?? []
  const hasOverflow = items && items.length > maxItems

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {icon || typeIconMap[title.toLowerCase()] || <Users className="w-4 h-4" />}
                </span>
                <CardTitle className="text-sm font-medium">
                  {t(title, title)}
                </CardTitle>
                {showCount && (
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className={cn('p-0', variant === 'compact' && 'p-2')}>
            {visibleItems.length > 0 ? (
              <div className="divide-y">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className={cn(
                      'p-3 hover:bg-muted/50 cursor-pointer transition-colors',
                      item.isPrimary && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {/* Avatar for contacts */}
                      {item.avatarInitials && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-muted">
                            {item.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-medium text-sm truncate">
                            {item.title}
                          </span>
                          {item.status && (
                            <Badge
                              variant={item.statusVariant || 'secondary'}
                              className="text-xs flex-shrink-0"
                            >
                              {item.status}
                            </Badge>
                          )}
                        </div>
                        
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                        
                        {item.metadata !== undefined && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {typeof item.metadata === 'number' 
                              ? `${item.metadata}` 
                              : item.metadata}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* View All Link */}
                {hasOverflow && onViewAll && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onViewAll}
                      className="w-full justify-center text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {t(viewAllLabel, `View All ${count}`)}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t(emptyMessage, emptyMessage)}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default RelatedListCard