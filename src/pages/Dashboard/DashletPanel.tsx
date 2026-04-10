/**
 * DashletPanel Component
 * Dashlet 选择面板 - 分类展示可用 Dashlet，支持拖拽添加
 */

import * as React from 'react'
import {
  Search,
  TrendingUp,
  Users,
  Headphones,
  Megaphone,
  Activity,
  DollarSign,
  Brain,
  Layout,
  Filter,
  Award,
  PieChart,
  Zap,
  Target,
  Layers,
  Building,
  AlertTriangle,
  Ticket,
  Star,
  Clock,
  CreditCard,
  BarChart2,
  UserPlus,
  Calendar,
  CheckSquare,
  Mail,
  Phone,
  Plus,
  X,
  GripVertical,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ALL_DASHLETS, DASHLET_CATEGORIES } from '@/mock/dashboardData'
import { DashletType, DashletConfig } from '@/types/dashboard'

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Users,
  Headphones,
  Megaphone,
  Activity,
  DollarSign,
  Brain,
  Layout,
  Filter,
  Award,
  PieChart,
  Zap,
  Target,
  Layers,
  Building,
  AlertTriangle,
  Ticket,
  Star,
  Clock,
  CreditCard,
  BarChart2,
  UserPlus,
  Calendar,
  CheckSquare,
  Mail,
  Phone,
  Plus,
}

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  sales: 'TrendingUp',
  customer: 'Users',
  service: 'Headphones',
  marketing: 'Megaphone',
  activity: 'Activity',
  finance: 'DollarSign',
  ai: 'Brain',
  general: 'Layout',
}

// ============================================================
// DashletCard Component
// ============================================================

interface DashletCardProps {
  dashlet: (typeof ALL_DASHLETS)[number]
  onAdd: (type: DashletType) => void
  isAdded?: boolean
}

function DashletCard({ dashlet, onAdd, isAdded }: DashletCardProps) {
  const Icon = ICON_MAP[dashlet.icon] || Layout

  return (
    <div
      className={`
        group relative flex items-start gap-3 p-3 rounded-lg border bg-card
        hover:bg-accent hover:border-primary/50 transition-all cursor-pointer
        ${isAdded ? 'opacity-50' : ''}
      `}
      onClick={() => !isAdded && onAdd(dashlet.type)}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{dashlet.label}</span>
          {isAdded && (
            <Badge variant="secondary" className="text-xs">
              已添加
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {dashlet.description}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
          <span className="bg-muted px-1.5 py-0.5 rounded">
            {dashlet.defaultSize.w}×{dashlet.defaultSize.h}
          </span>
        </div>
      </div>

      {!isAdded && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// DashletPanel Component
// ============================================================

interface DashletPanelProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onAddDashlet: (dashlet: DashletConfig) => void
  addedDashletTypes?: DashletType[]
  trigger?: React.ReactNode
}

export function DashletPanel({
  open,
  onOpenChange,
  onAddDashlet,
  addedDashletTypes = [],
  trigger,
}: DashletPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const filteredDashlets = React.useMemo(() => {
    let result = ALL_DASHLETS

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((d) => d.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.label.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  const handleAddDashlet = (type: DashletType) => {
    const dashletInfo = ALL_DASHLETS.find((d) => d.type === type)
    if (!dashletInfo) return

    const newDashlet: DashletConfig = {
      id: `dashlet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: dashletInfo.label,
      x: 0,
      y: Infinity, // Will be placed at the bottom
      w: dashletInfo.defaultSize.w,
      h: dashletInfo.defaultSize.h,
    }

    onAddDashlet(newDashlet)
  }

  const categories = [
    { key: 'all', label: '全部' },
    ...Object.values(DASHLET_CATEGORIES),
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent className="w-[400px] sm:w-[480px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            添加 Dashlet
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="px-6 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索 Dashlet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-2 border-b">
          <ScrollArea className="whitespace-nowrap">
            <div className="flex gap-1">
              {categories.map((cat) => (
                <Button
                  key={cat.key}
                  variant={selectedCategory === cat.key ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.key)}
                  className="text-xs"
                >
                  {cat.key !== 'all' && (
                    { sales: '📈', customer: '👥', service: '🎧', marketing: '📣', activity: '📊', finance: '💰', ai: '🤖', general: '📋' }[cat.key] ||
                    ''
                  )}
                  {cat.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Dashlet List */}
        <ScrollArea className="flex-1 px-6 py-4">
          {filteredDashlets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>没有找到匹配的 Dashlet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedCategory === 'all' ? (
                // Group by category
                Object.entries(DASHLET_CATEGORIES).map(([key, cat]) => {
                  const catDashlets = filteredDashlets.filter(
                    (d) => d.category === key
                  )
                  if (catDashlets.length === 0) return null

                  const CatIcon = ICON_MAP[CATEGORY_ICONS[key]] || Layout

                  return (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-2">
                        <CatIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{cat.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {catDashlets.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {catDashlets.map((dashlet) => (
                          <DashletCard
                            key={dashlet.type}
                            dashlet={dashlet}
                            onAdd={handleAddDashlet}
                            isAdded={addedDashletTypes.includes(dashlet.type)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                // Flat list for selected category
                <div className="space-y-2">
                  {filteredDashlets.map((dashlet) => (
                    <DashletCard
                      key={dashlet.type}
                      dashlet={dashlet}
                      onAdd={handleAddDashlet}
                      isAdded={addedDashletTypes.includes(dashlet.type)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            共 {ALL_DASHLETS.length} 个可用 Dashlet
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { DashletCard }
