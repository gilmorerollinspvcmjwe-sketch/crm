/**
 * DashboardPage - Enhanced Dashboard with Dashlet System
 * 支持网格布局、添加/移除 Dashlet、刷新、全屏模式
 */

import * as React from 'react'
import {
  Plus,
  RefreshCw,
  Maximize2,
  Minimize2,
  Trash2,
  MoreVertical,
  Download,
  Layout,
  Settings,
  ChevronDown,
  Calendar,
  Edit3,
  Copy,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  GripVertical,
  CheckSquare,
  Mail,
  Phone,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts'
import { DashletPanel } from './DashletPanel'
import { DashletType, DashletConfig, DashboardTemplate } from '@/types/dashboard'
import { fetchDashletData, refreshDashlet } from '@/services/dashletService'
import {
  mockDashletData,
  ALL_DASHLETS,
  PRESET_DASHBOARD_TEMPLATES,
  getDashletInfo,
  createEmptyDashboard,
} from '@/mock/dashboardData'

// ============================================================
// Types
// ============================================================

interface DashboardState {
  name: string
  dashlets: DashletConfig[]
  isFullscreen: boolean
}

// ============================================================
// Icon Helper
// ============================================================

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, TrendingDown, Users, DollarSign, Target, Activity,
  CheckCircle, Clock, AlertCircle, Layout, BarChart2: Layout,
}

function DashletIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Layout
  return <Icon className={className} />
}

// ============================================================
// Empty State
// ============================================================

function EmptyDashboard({ onAddDashlet }: { onAddDashlet: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Layout className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">开始构建你的仪表板</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        从预设模板选择一个，或点击下方按钮添加你需要的 Dashlet
      </p>
      <Button onClick={onAddDashlet} className="gap-2">
        <Plus className="h-4 w-4" />
        添加第一个 Dashlet
      </Button>
    </div>
  )
}

// ============================================================
// Individual Dashlet Renderers
// ============================================================

interface DashletRendererProps {
  dashlet: DashletConfig
  data: Record<string, unknown>
  isLoading: boolean
  onRemove: (id: string) => void
  onRefresh: (id: string) => void
}

function KPISummaryDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const kpis = (data.kpis as Array<{ label: string; value: string; change: number; target: number; unit: string }>) || []

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      {kpis.map((kpi, i) => (
        <div key={i} className="flex flex-col justify-center p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="text-xl font-bold">{kpi.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {kpi.change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${kpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {kpi.change >= 0 ? '+' : ''}{kpi.change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function RevenueTrendDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const chartData = (data.data as Array<{ month: string; revenue: number; target: number }>) || []

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <RechartsTooltip />
        <Legend />
        <Area type="monotone" dataKey="revenue" name="实际营收" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
        <Line type="monotone" dataKey="target" name="目标" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function SalesFunnelDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const stages = (data.stages as Array<{ stage: string; count: number; color: string }>) || []
  const maxCount = Math.max(...stages.map((s) => s.count), 1)

  return (
    <div className="flex flex-col justify-center h-full gap-2 px-4">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs w-12 text-muted-foreground">{stage.stage}</span>
          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
              style={{
                width: `${(stage.count / maxCount) * 100}%`,
                backgroundColor: stage.color,
              }}
            >
              <span className="text-xs font-medium text-white">{stage.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SalesRankingDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const performers = (data.performers as Array<{ name: string; revenue: number; deals: number; trend: number }>) || []

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={performers} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" />
        <YAxis dataKey="name" type="category" width={60} className="text-xs" />
        <RechartsTooltip />
        <Bar dataKey="revenue" name="营收" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SalesBySourceDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const sources = (data.sources as Array<{ name: string; value: number; color: string }>) || []

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie
            data={sources}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={60}
            dataKey="value"
            label={({ name, value }) => `${value}%`}
          >
            {sources.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5">
        {sources.map((source, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
            <span>{source.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomerGrowthDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const trends = (data.trends as Array<{ month: string; new: number; active: number }>) || []

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={trends}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <RechartsTooltip />
        <Legend />
        <Line type="monotone" dataKey="new" name="新客户" stroke="#22c55e" strokeWidth={2} />
        <Line type="monotone" dataKey="active" name="活跃客户" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ActivityStatsDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const stats = data as { total?: number; completed?: number; planned?: number; overdue?: number; completionRate?: number }

  return (
    <div className="grid grid-cols-4 gap-3 h-full">
      <div className="flex flex-col justify-center items-center bg-green-500/10 rounded-lg p-2">
        <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
        <p className="text-lg font-bold">{stats.completed || 0}</p>
        <p className="text-xs text-muted-foreground">已完成</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-yellow-500/10 rounded-lg p-2">
        <Clock className="h-5 w-5 text-yellow-500 mb-1" />
        <p className="text-lg font-bold">{stats.planned || 0}</p>
        <p className="text-xs text-muted-foreground">计划中</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-red-500/10 rounded-lg p-2">
        <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
        <p className="text-lg font-bold">{stats.overdue || 0}</p>
        <p className="text-xs text-muted-foreground">已逾期</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-primary/10 rounded-lg p-2">
        <Activity className="h-5 w-5 text-primary mb-1" />
        <p className="text-lg font-bold">{stats.total || 0}</p>
        <p className="text-xs text-muted-foreground">总计</p>
      </div>
    </div>
  )
}

function TicketStatsDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const stats = data as { total?: number; open?: number; pending?: number; resolved?: number }

  return (
    <div className="grid grid-cols-4 gap-3 h-full">
      <div className="flex flex-col justify-center items-center bg-blue-500/10 rounded-lg p-2">
        <p className="text-lg font-bold">{stats.total || 0}</p>
        <p className="text-xs text-muted-foreground">总计</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-yellow-500/10 rounded-lg p-2">
        <p className="text-lg font-bold text-yellow-600">{stats.open || 0}</p>
        <p className="text-xs text-muted-foreground">待处理</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-orange-500/10 rounded-lg p-2">
        <p className="text-lg font-bold text-orange-600">{stats.pending || 0}</p>
        <p className="text-xs text-muted-foreground">进行中</p>
      </div>
      <div className="flex flex-col justify-center items-center bg-green-500/10 rounded-lg p-2">
        <p className="text-lg font-bold text-green-600">{stats.resolved || 0}</p>
        <p className="text-xs text-muted-foreground">已解决</p>
      </div>
    </div>
  )
}

function QuickActionsDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const actions = (data.actions as Array<{ label: string; icon: string; action: string }>) || []

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Plus, FileText: Layout, CheckSquare, Mail, Calendar, Phone,
  }

  return (
    <div className="grid grid-cols-2 gap-2 h-full">
      {actions.map((action, i) => {
        const Icon = iconMap[action.icon] || Plus
        return (
          <button
            key={i}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function RecentActivitiesDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const activities = (data.activities as Array<{ id: number; type: string; title: string; user: string; time: string }>) || []

  return (
    <div className="space-y-2 h-full overflow-auto">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-2 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
          <div className="flex-1 min-w-0">
            <p className="truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.user} · {activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function UpcomingTasksDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const tasks = (data.tasks as Array<{ id: number; title: string; due: string; priority: string }>) || []

  const priorityColors: Record<string, string> = {
    high: 'text-red-500 bg-red-500/10',
    medium: 'text-yellow-500 bg-yellow-500/10',
    low: 'text-green-500 bg-green-500/10',
  }

  return (
    <div className="space-y-2 h-full overflow-auto">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2">
          <div className={`px-1.5 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
          </div>
          <span className="flex-1 text-sm truncate">{task.title}</span>
          <span className="text-xs text-muted-foreground">{task.due}</span>
        </div>
      ))}
    </div>
  )
}

function AINextActionsDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const actions = (data.actions as Array<{ priority: string; action: string; reason: string; deadline: string }>) || []

  const priorityColors: Record<string, string> = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
  }

  return (
    <div className="space-y-2 h-full overflow-auto">
      {actions.map((action, i) => (
        <div key={i} className={`border-l-2 pl-3 py-1 ${priorityColors[action.priority]}`}>
          <p className="text-sm font-medium">{action.action}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{action.reason}</p>
          <p className="text-xs text-muted-foreground mt-0.5">截止: {action.deadline}</p>
        </div>
      ))}
    </div>
  )
}

function AIInsightsDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const insights = (data.insights as Array<{ type: string; title: string; description: string; confidence: number }>) || []

  return (
    <div className="space-y-3 h-full overflow-auto">
      {insights.map((insight, i) => (
        <div key={i} className="p-2 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">{insight.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 bg-primary/20 rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CustomerSegmentDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const segments = (data.segments as Array<{ segment: string; count: number; percentage: number; color: string }>) || []

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie
            data={segments}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={50}
            dataKey="count"
          >
            {segments.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span>{seg.segment}</span>
            <span className="text-muted-foreground">{seg.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentStatusDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  const status = data as { total?: number; paid?: number; partial?: number; pending?: number; completionRate?: number }

  const chartData = [
    { name: '已回款', value: status.paid || 0, color: '#22c55e' },
    { name: '部分回款', value: status.partial || 0, color: '#3b82f6' },
    { name: '待回款', value: status.pending || 0, color: '#ef4444' },
  ]

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <ResponsiveContainer width="40%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={50}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
        ))}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">回款率</p>
          <p className="text-lg font-bold text-green-600">{status.completionRate || 0}%</p>
        </div>
      </div>
    </div>
  )
}

function GenericChartDashlet({ dashlet, data }: { dashlet: DashletConfig; data: Record<string, unknown> }) {
  // Generic fallback for other chart types
  const chartKey = Object.keys(data).find((k) => Array.isArray(data[k]))
  if (!chartKey) return <div className="flex items-center justify-center h-full text-muted-foreground">暂无数据</div>

  const chartData = data[chartKey] as Array<Record<string, unknown>>
  const numericKeys = Object.keys(chartData[0] || {}).filter((k) => typeof chartData[0][k] === 'number')

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey={Object.keys(chartData[0] || {})[0]} className="text-xs" />
        <YAxis className="text-xs" />
        <RechartsTooltip />
        <Legend />
        {numericKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 4]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Dashlet Renderer Registry
// ============================================================

function renderDashletContent(dashlet: DashletConfig, data: Record<string, unknown>) {
  switch (dashlet.type) {
    case 'kpi-summary':
      return <KPISummaryDashlet dashlet={dashlet} data={data} />
    case 'revenue-trend':
      return <RevenueTrendDashlet dashlet={dashlet} data={data} />
    case 'sales-funnel':
      return <SalesFunnelDashlet dashlet={dashlet} data={data} />
    case 'sales-ranking':
      return <SalesRankingDashlet dashlet={dashlet} data={data} />
    case 'sales-by-source':
      return <SalesBySourceDashlet dashlet={dashlet} data={data} />
    case 'customer-growth':
      return <CustomerGrowthDashlet dashlet={dashlet} data={data} />
    case 'customer-segment':
      return <CustomerSegmentDashlet dashlet={dashlet} data={data} />
    case 'activity-stats':
      return <ActivityStatsDashlet dashlet={dashlet} data={data} />
    case 'ticket-stats':
      return <TicketStatsDashlet dashlet={dashlet} data={data} />
    case 'payment-status':
      return <PaymentStatusDashlet dashlet={dashlet} data={data} />
    case 'quick-actions':
      return <QuickActionsDashlet dashlet={dashlet} data={data} />
    case 'recent-activities':
      return <RecentActivitiesDashlet dashlet={dashlet} data={data} />
    case 'upcoming-tasks':
      return <UpcomingTasksDashlet dashlet={dashlet} data={data} />
    case 'ai-next-actions':
      return <AINextActionsDashlet dashlet={dashlet} data={data} />
    case 'ai-insights':
      return <AIInsightsDashlet dashlet={dashlet} data={data} />
    default:
      return <GenericChartDashlet dashlet={dashlet} data={data} />
  }
}

// ============================================================
// Single Dashlet Wrapper
// ============================================================

interface DashletWrapperProps {
  dashlet: DashletConfig
  onRemove: (id: string) => void
  onRefresh: (id: string) => void
  data: Record<string, unknown>
  isLoading: boolean
}

function DashletWrapper({ dashlet, onRemove, onRefresh, data, isLoading }: DashletWrapperProps) {
  const dashletInfo = getDashletInfo(dashlet.type)
  const Icon = ICON_MAP[dashletInfo?.icon || 'Layout'] || Layout

  return (
    <Card className="h-full flex flex-col overflow-hidden group relative">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{dashlet.title}</CardTitle>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onRefresh(dashlet.id)}
                disabled={isLoading}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>刷新</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                onClick={() => onRemove(dashlet.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>移除</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          renderDashletContent(dashlet, data)
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================
// Main Dashboard Grid
// ============================================================

interface DashboardGridProps {
  dashlets: DashletConfig[]
  dashletData: Record<string, Record<string, unknown>>
  loadingDashlets: Set<string>
  onRemoveDashlet: (id: string) => void
  onRefreshDashlet: (id: string) => void
}

function DashboardGrid({
  dashlets,
  dashletData,
  loadingDashlets,
  onRemoveDashlet,
  onRefreshDashlet,
}: DashboardGridProps) {
  // Calculate grid dimensions
  const cols = 8
  const rowHeight = 100

  // Simple grid layout (not using react-grid-layout, just CSS grid)
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {dashlets.map((dashlet) => {
        const dashletData_ = dashletData[dashlet.type] || {}
        const isLoading = loadingDashlets.has(dashlet.id)

        return (
          <div
            key={dashlet.id}
            className="relative"
            style={{
              gridColumn: `span ${Math.min(dashlet.w, cols)}`,
              gridRow: `span ${dashlet.h}`,
              minHeight: dashlet.h * rowHeight,
            }}
          >
            <DashletWrapper
              dashlet={dashlet}
              onRemove={onRemoveDashlet}
              onRefresh={onRefreshDashlet}
              data={dashletData_}
              isLoading={isLoading}
            />
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// Template Selector Dialog
// ============================================================

interface TemplateSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: DashboardTemplate) => void
  onCreateBlank: () => void
}

function TemplateSelector({
  open,
  onOpenChange,
  onSelectTemplate,
  onCreateBlank,
}: TemplateSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>选择仪表板模板</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Blank option */}
          <button
            onClick={onCreateBlank}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-accent transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="font-medium">空白仪表板</span>
            <span className="text-xs text-muted-foreground mt-1">从零开始创建</span>
          </button>

          {/* Preset templates */}
          {PRESET_DASHBOARD_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="flex flex-col items-start p-4 border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Layout className="h-5 w-5 text-primary" />
                <span className="font-medium">{template.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.dashlets.slice(0, 4).map((d) => (
                  <Badge key={d.id} variant="secondary" className="text-xs">
                    {d.title}
                  </Badge>
                ))}
                {template.dashlets.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.dashlets.length - 4}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// Rename Dialog
// ============================================================

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onRename: (name: string) => void
}

function RenameDialog({ open, onOpenChange, currentName, onRename }: RenameDialogProps) {
  const [name, setName] = React.useState(currentName)

  React.useEffect(() => {
    setName(currentName)
  }, [currentName])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重命名仪表板</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入仪表板名称"
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => { onRename(name); onOpenChange(false) }} disabled={!name.trim()}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// Main DashboardPage Component
// ============================================================

export function DashboardPage() {
  // State
  const [state, setState] = React.useState<DashboardState>({
    name: '我的仪表板',
    dashlets: [],
    isFullscreen: false,
  })
  const [dashletData, setDashletData] = React.useState<Record<string, Record<string, unknown>>>({})
  const [loadingDashlets, setLoadingDashlets] = React.useState<Set<string>>(new Set())
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)

  // Load dashlet data when dashlets change
  React.useEffect(() => {
    const loadDashletData = async () => {
      const dashletsToLoad = state.dashlets.filter(
        (dashlet) => !dashletData[dashlet.type] && !loadingDashlets.has(dashlet.id)
      )
      
      for (const dashlet of dashletsToLoad) {
        setLoadingDashlets((prev) => new Set([...prev, dashlet.id]))
        try {
          const data = await fetchDashletData(dashlet.type)
          setDashletData((prev) => ({ ...prev, [dashlet.type]: data }))
        } finally {
          setLoadingDashlets((prev) => {
            const next = new Set(prev)
            next.delete(dashlet.id)
            return next
          })
        }
      }
    }
    loadDashletData()
  }, [state.dashlets, dashletData, loadingDashlets])

  // Handlers
  const handleAddDashlet = (dashlet: DashletConfig) => {
    setState((prev) => ({
      ...prev,
      dashlets: [...prev.dashlets, dashlet],
    }))
    setPanelOpen(false)
  }

  const handleRemoveDashlet = (id: string) => {
    setState((prev) => ({
      ...prev,
      dashlets: prev.dashlets.filter((d) => d.id !== id),
    }))
  }

  const handleRefreshDashlet = async (id: string) => {
    const dashlet = state.dashlets.find((d) => d.id === id)
    if (!dashlet) return

    setLoadingDashlets((prev) => new Set([...prev, id]))
    try {
      const data = await refreshDashlet(dashlet.type)
      setDashletData((prev) => ({ ...prev, [dashlet.type]: data }))
    } finally {
      setLoadingDashlets((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleRefreshAll = async () => {
    // Refresh all dashlets
    for (const dashlet of state.dashlets) {
      setLoadingDashlets((prev) => new Set([...prev, dashlet.id]))
    }
    // In parallel
    await Promise.all(state.dashlets.map(async (dashlet) => {
      const data = await refreshDashlet(dashlet.type)
      setDashletData((prev) => ({ ...prev, [dashlet.type]: data }))
      setLoadingDashlets((prev) => {
        const next = new Set(prev)
        next.delete(dashlet.id)
        return next
      })
    }))
  }

  const handleSelectTemplate = (template: DashboardTemplate) => {
    setState((prev) => ({
      ...prev,
      name: template.name,
      dashlets: template.dashlets.map((d) => ({ ...d })),
    }))
    setDashletData({})
    setTemplateDialogOpen(false)
  }

  const handleCreateBlank = () => {
    setState((prev) => ({
      ...prev,
      name: '我的仪表板',
      dashlets: [],
    }))
    setDashletData({})
    setTemplateDialogOpen(false)
  }

  const handleRename = (name: string) => {
    setState((prev) => ({ ...prev, name }))
  }

  const toggleFullscreen = () => {
    setState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }))
  }

  const addedDashletTypes = state.dashlets.map((d) => d.type)

  // Fullscreen wrapper
  const containerClass = state.isFullscreen
    ? 'fixed inset-0 z-50 bg-background'
    : 'min-h-screen'

  return (
    <div className={containerClass}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{state.name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  重命名
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTemplateDialogOpen(true)}>
                  <Copy className="h-4 w-4 mr-2" />
                  更换模板
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  导出数据
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={loadingDashlets.size > 0}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${loadingDashlets.size > 0 ? 'animate-spin' : ''}`} />
              刷新全部
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="gap-1"
            >
              {state.isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              {state.isFullscreen ? '退出全屏' : '全屏'}
            </Button>
            <DashletPanel
              open={panelOpen}
              onOpenChange={setPanelOpen}
              onAddDashlet={handleAddDashlet}
              addedDashletTypes={addedDashletTypes}
              trigger={
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  添加 Dashlet
                </Button>
              }
            />
          </div>
        </div>

        {/* Dashboard Content */}
        {state.dashlets.length === 0 ? (
          <EmptyDashboard onAddDashlet={() => setPanelOpen(true)} />
        ) : (
          <DashboardGrid
            dashlets={state.dashlets}
            dashletData={dashletData}
            loadingDashlets={loadingDashlets}
            onRemoveDashlet={handleRemoveDashlet}
            onRefreshDashlet={handleRefreshDashlet}
          />
        )}
      </div>

      {/* Dialogs */}
      <TemplateSelector
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelectTemplate={handleSelectTemplate}
        onCreateBlank={handleCreateBlank}
      />
      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={state.name}
        onRename={handleRename}
      />
    </div>
  )
}

export default DashboardPage
