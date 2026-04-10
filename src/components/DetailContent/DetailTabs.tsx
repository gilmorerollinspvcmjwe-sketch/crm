/**
 * DetailTabs - Tabs Container with Badge Count Support
 * 
 * Provides tab navigation for detail pages:
 * - Overview, Activity, AI Insights tabs
 * - Badge count indicators
 * - Scrollable content area
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  FileText,
  History,
} from 'lucide-react'

/** Tab configuration */
export interface DetailTabConfig {
  /** Tab unique key */
  key: string
  /** Tab label (i18n key) */
  label: string
  /** Tab icon */
  icon?: React.ReactNode
  /** Badge count (number or boolean for dot indicator) */
  badge?: number | boolean
  /** Badge variant */
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  /** Tab content */
  content?: React.ReactNode
  /** Whether tab is disabled */
  disabled?: boolean
  /** Custom class name for tab trigger */
  className?: string
}

export interface DetailTabsProps {
  /** Tab configurations */
  tabs?: DetailTabConfig[]
  /** Active tab key */
  activeKey?: string
  /** Tab change callback */
  onChange?: (key: string) => void
  /** Default active tab */
  defaultActiveKey?: string
  /** Custom class name for tabs container */
  className?: string
  /** Custom class name for tabs list */
  tabsListClassName?: string
  /** Custom class name for tabs content */
  tabsContentClassName?: string
  /** Tabs variant */
  variant?: 'default' | 'enclosed' | 'underline' | 'pills'
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
}

/** Default icon mapping for tab types */
const tabIconMap: Record<string, React.ReactNode> = {
  overview: <LayoutDashboard className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  ai: <Sparkles className="w-4 h-4" />,
  insights: <Sparkles className="w-4 h-4" />,
  notes: <FileText className="w-4 h-4" />,
  history: <History className="w-4 h-4" />,
}

/**
 * DetailTabs Component
 * 
 * Renders a tab container with:
 * - Configurable tabs with icons
 * - Badge count indicators
 * - Content area for each tab
 */
export function DetailTabs({
  tabs,
  activeKey,
  onChange,
  defaultActiveKey = 'overview',
  className,
  tabsListClassName,
  tabsContentClassName,
  variant: _variant = 'default', // Reserved for future styling variants
  orientation = 'horizontal',
}: DetailTabsProps) {
  const { t } = useTranslation()

  if (!tabs || tabs.length === 0) return null

  return (
    <Tabs
      value={activeKey}
      defaultValue={defaultActiveKey}
      onValueChange={onChange}
      className={cn(
        'flex flex-col h-full',
        orientation === 'vertical' && 'flex-row',
        className
      )}
    >
      {/* Tabs List */}
      <TabsList
        className={cn(
          'flex items-center',
          orientation === 'horizontal' && 'w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-4',
          orientation === 'vertical' && 'flex-col w-auto h-full bg-transparent border-r rounded-none p-0 gap-1',
          tabsListClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2',
              orientation === 'horizontal' && 'border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent',
              orientation === 'vertical' && 'border-r-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-muted/50',
              'data-[state=active]:shadow-none',
              tab.className
            )}
          >
            {/* Tab Icon */}
            {tab.icon || tabIconMap[tab.key]}

            {/* Tab Label */}
            <span>{t(tab.label, tab.label)}</span>

            {/* Badge */}
            {tab.badge !== undefined && tab.badge !== false && (
              <Badge
                variant={tab.badgeVariant || 'secondary'}
                className={cn(
                  'ml-1',
                  typeof tab.badge === 'boolean' && 'h-2 w-2 rounded-full p-0'
                )}
              >
                {typeof tab.badge === 'number' ? tab.badge : ''}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tabs Content */}
      <div
        className={cn(
          'flex-1 overflow-y-auto',
          orientation === 'vertical' && 'flex-1',
          tabsContentClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsContent
            key={tab.key}
            value={tab.key}
            className={cn(
              'p-4 m-0',
              'focus-visible:outline-none focus-visible:ring-0',
              tabsContentClassName
            )}
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}

/**
 * Preset tab configurations for common entities
 */
export const customerDetailTabs: DetailTabConfig[] = [
  {
    key: 'overview',
    label: 'customer.detail.tabs.overview',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    key: 'activity',
    label: 'customer.detail.tabs.activity',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    key: 'ai',
    label: 'customer.detail.tabs.aiInsights',
    icon: <Sparkles className="w-4 h-4" />,
    badge: true,
    badgeVariant: 'default',
  },
]

export const opportunityDetailTabs: DetailTabConfig[] = [
  {
    key: 'overview',
    label: 'opportunity.detail.tabs.overview',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    key: 'activity',
    label: 'opportunity.detail.tabs.activity',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    key: 'quotes',
    label: 'opportunity.detail.tabs.quotes',
    icon: <FileText className="w-4 h-4" />,
  },
]

export const contactDetailTabs: DetailTabConfig[] = [
  {
    key: 'overview',
    label: 'contact.detail.tabs.overview',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    key: 'activity',
    label: 'contact.detail.tabs.activity',
    icon: <Activity className="w-4 h-4" />,
  },
]

export default DetailTabs