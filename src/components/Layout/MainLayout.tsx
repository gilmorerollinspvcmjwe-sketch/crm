/**
 * 主布局组件
 *
 * 重构为工业级双层工作框架：
 * - 左侧是稳定主导航
 * - 顶部是页面上下文条
 * - 中间是统一工作画布
 */

import * as React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useUIStore } from '@/store'
import {
  Home,
  Users,
  Lightbulb,
  FileText,
  Package,
  BarChart3,
  Bot,
  Zap,
  Mail,
  Headphones,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  User,
  Command,
  LayoutGrid,
  Building2,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { GlobalSearchDialog } from '@/components/GlobalSearchDialog'
import { NotificationDropdown } from '@/components/NotificationDropdown'

const SIDEBAR_EXPANDED_WIDTH = 304
const SIDEBAR_COLLAPSED_WIDTH = 92

interface NavigationChild {
  key: string
  label: string
  description: string
}

interface NavigationItem {
  key: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  children: NavigationChild[]
}

interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

const navigationGroups: NavigationGroup[] = [
  {
    label: 'Workspace',
    items: [
      {
        key: 'workplace',
        label: '工作台',
        description: '总览团队节奏与关键任务',
        icon: Home,
        children: [
          { key: '/workbench', label: '销售工作台', description: '查看跟进、待办和重点客户动态' },
          { key: '/dashboard', label: '仪表盘', description: '组合查看业务指标与模块概况' },
        ],
      },
    ],
  },
  {
    label: 'Revenue',
    items: [
      {
        key: 'customer',
        label: '客户管理',
        description: '客户、联系人与关系经营',
        icon: Users,
        children: [
          { key: '/customers', label: '客户列表', description: '统一查看客户资产、状态与负责人' },
          { key: '/contacts', label: '联系人列表', description: '聚焦关键联系人与决策链路' },
        ],
      },
      {
        key: 'sales',
        label: '销售管理',
        description: '线索到成交的核心销售流程',
        icon: Lightbulb,
        children: [
          { key: '/leads', label: '线索管理', description: '筛选新机会并推进线索分配' },
          { key: '/opportunities', label: '商机管理', description: '跟踪阶段、金额和成交概率' },
          { key: '/activities', label: '跟进记录', description: '沉淀每次触达、会议和任务执行' },
        ],
      },
      {
        key: 'order',
        label: '订单管理',
        description: '报价、合同、订单与回款协同',
        icon: FileText,
        children: [
          { key: '/orders', label: '订单列表', description: '查看订单进度和履约状态' },
          { key: '/quotes', label: '报价管理', description: '输出可追踪的报价与审批链路' },
          { key: '/contracts', label: '合同管理', description: '管理合同审批、执行与归档' },
          { key: '/payments', label: '回款管理', description: '掌握回款节点与财务进展' },
        ],
      },
      {
        key: 'product',
        label: '产品与定价',
        description: '产品库、价格表和交易配置',
        icon: Package,
        children: [
          { key: '/products', label: '产品库', description: '管理产品信息与销售可见项' },
          { key: '/pricebooks', label: '价格表', description: '统一维护报价与渠道价格策略' },
        ],
      },
      {
        key: 'report',
        label: '报表中心',
        description: '追踪营收、漏斗与团队表现',
        icon: BarChart3,
        children: [
          { key: '/reports', label: '报表中心', description: '集中查看已建立的报表资产' },
          { key: '/reports/dashboard', label: '报表仪表盘', description: '总览报表使用和关键统计' },
          { key: '/reports/builder', label: '报表构建器', description: '创建并维护报表结构' },
          { key: '/reports/schedule', label: '报表调度', description: '管理定时任务和报表发送' },
          { key: '/reports/export', label: '报表导出', description: '查看报表导出和历史记录' },
          { key: '/report/funnel', label: '销售漏斗', description: '观察阶段流转和转化效率' },
          { key: '/report/performance', label: '业绩统计', description: '追踪目标完成和团队表现' },
          { key: '/report/customer', label: '客户分析', description: '查看客户结构和价值分层' },
          { key: '/report/activity', label: '活动报表', description: '查看活动过程和执行结果' },
          { key: '/report/lead-conversion', label: '线索转化', description: '分析转化路径和效率变化' },
          { key: '/report/payment', label: '付款报表', description: '追踪付款、回款与账期状态' },
        ],
      },
    ],
  },
  {
    label: 'Growth',
    items: [
      {
        key: 'ai',
        label: '智能 AI',
        description: '增强洞察、预测与自动建议',
        icon: Bot,
        children: [
          { key: '/ai/config', label: 'AI 配置', description: '管理 AI 基础配置和接入策略' },
          { key: '/ai/dashboard', label: 'AI 仪表盘', description: '总览 AI 使用和关键表现' },
          { key: '/ai/analytics', label: 'AI 分析', description: '查看 AI 产生的分析洞察' },
          { key: '/ai/history', label: '历史记录', description: '查看 AI 生成历史和调用轨迹' },
          { key: '/ai/prompts', label: '提示词模板', description: '管理常用提示词和模版' },
          { key: '/ai/assistant', label: 'AI 助手', description: '通过助手完成辅助操作' },
          { key: '/ai/models', label: '模型管理', description: '查看模型配置和能力信息' },
          { key: '/ai/usage', label: '使用统计', description: '分析 AI 调用量和使用趋势' },
          { key: '/ai/lead-assignment', label: '智能线索分配', description: '按规则与模型自动分配线索' },
          { key: '/ai/lead-scoring', label: '线索评分 AI', description: '聚焦优先级更高的机会' },
          { key: '/ai/sales-forecast', label: '销售预测 AI', description: '预测营收趋势与阶段风险' },
          { key: '/ai/customer-segmentation', label: '客户细分 AI', description: '按客群价值和特征进行分层' },
          { key: '/ai/churn-warning', label: '流失预警', description: '识别关系降温和客户流失风险' },
          { key: '/ai/meeting-assistant', label: '会议助手', description: '辅助会议纪要和行动整理' },
          { key: '/ai/predictive', label: '预测性 AI', description: '生成趋势判断和风险提示' },
          { key: '/ai/agents', label: 'AI 代理', description: '查看自动执行任务与代理状态' },
        ],
      },
      {
        key: 'automation',
        label: '自动化',
        description: '流程执行、日志与规则追踪',
        icon: Zap,
        children: [
          { key: '/automation/workflows', label: '工作流', description: '搭建和管理自动化流程' },
          { key: '/automation/logs', label: '执行日志', description: '排查自动化执行结果与异常' },
          { key: '/workflows', label: '流程引擎', description: '管理高级工作流引擎' },
          { key: '/workflows/builder', label: '流程构建器', description: '可视化编辑复杂流程' },
          { key: '/workflows/executions', label: '执行监控', description: '查看流程引擎执行结果' },
        ],
      },
      {
        key: 'marketing',
        label: '营销自动化',
        description: '活动、邮件与目标名单管理',
        icon: Mail,
        children: [
          { key: '/marketing/campaigns', label: '营销活动', description: '规划活动节奏与目标转化' },
          { key: '/marketing/email-templates', label: '邮件模板', description: '统一邮件资产与内容模板' },
          { key: '/marketing/target-lists', label: '目标列表', description: '管理名单、分组与推送对象' },
        ],
      },
      {
        key: 'integration',
        label: '系统集成',
        description: '工单、知识与外部协同入口',
        icon: Headphones,
        children: [
          { key: '/integration/tickets', label: '工单系统', description: '追踪客户支持工单与处理状态' },
          { key: '/integration/knowledge', label: '知识库', description: '搜索产品和服务相关知识资产' },
          { key: '/integration/callcenter', label: '呼叫中心', description: '管理外呼任务与通话协同' },
        ],
      },
    ],
  },
  {
    label: 'Platform',
    items: [
      {
        key: 'custom-objects',
        label: '自定义对象',
        description: '扩展业务对象与字段模型',
        icon: LayoutGrid,
        children: [
          { key: '/custom-objects', label: '对象列表', description: '查看已建对象和业务扩展结构' },
        ],
      },
      {
        key: 'settings',
        label: '系统设置',
        description: '权限、配置与平台管理',
        icon: Settings,
        children: [
          { key: '/settings/profile', label: '个人资料', description: '查看个人信息与偏好设置' },
          { key: '/settings/security', label: '安全设置', description: '调整密码、登录和安全策略' },
          { key: '/settings/preferences', label: '偏好设置', description: '设置个人显示和使用偏好' },
          { key: '/settings/notifications', label: '通知设置', description: '配置消息通知和提醒规则' },
          { key: '/settings/email', label: '邮件设置', description: '配置邮件服务和模板策略' },
          { key: '/settings/integrations', label: '集成设置', description: '管理外部服务与系统连接' },
          { key: '/settings/workflows', label: '工作流设置', description: '维护流程和自动化配置' },
          { key: '/settings/fields', label: '字段设置', description: '配置字段模型与显示规则' },
          { key: '/settings/layout', label: '布局设置', description: '调整页面布局与表单结构' },
          { key: '/settings/theme', label: '主题设置', description: '管理视觉主题与品牌风格' },
          { key: '/settings/data-backup', label: '数据备份', description: '处理备份、恢复和归档' },
          { key: '/settings/import-export', label: '导入导出', description: '统一管理数据交换流程' },
          { key: '/settings/api', label: 'API 设置', description: '查看接口能力和访问配置' },
          { key: '/settings/webhook', label: 'Webhook', description: '配置事件回调与通知目标' },
          { key: '/settings/audit-log', label: '审计日志', description: '检查关键操作留痕和记录' },
          { key: '/settings/login-log', label: '登录日志', description: '查看登录历史和异常行为' },
          { key: '/settings/users', label: '用户管理', description: '管理成员、角色与访问边界' },
          { key: '/settings/roles', label: '角色管理', description: '统一维护角色权限模型' },
          { key: '/settings/permissions', label: '权限管理', description: '配置页面和功能授权范围' },
          { key: '/settings/license', label: '许可证', description: '查看授权信息和版本状态' },
          { key: '/settings/system-info', label: '系统信息', description: '查看运行环境和系统状态' },
          { key: '/settings/customization', label: '自定义设置', description: '管理个性化扩展和配置' },
          { key: '/settings/mobile', label: '移动端设置', description: '配置移动使用场景与规则' },
          { key: '/settings/advanced', label: '高级设置', description: '查看平台级的高级配置项' },
        ],
      },
    ],
  },
]

interface ActiveContext {
  groupLabel: string
  module: NavigationItem
  page: NavigationChild
}

function matchesPath(currentPath: string, target: string) {
  return currentPath === target || currentPath.startsWith(`${target}/`)
}

function resolveActiveContext(currentPath: string): ActiveContext | null {
  for (const group of navigationGroups) {
    for (const item of group.items) {
      for (const child of item.children) {
        if (matchesPath(currentPath, child.key)) {
          return {
            groupLabel: group.label,
            module: item,
            page: child,
          }
        }
      }
    }
  }
  return null
}

interface MenuItemProps {
  item: NavigationItem
  collapsed: boolean
  currentPath: string
  onNavigate: (path: string) => void
}

function MenuItem({ item, collapsed, currentPath, onNavigate }: MenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const Icon = item.icon
  const isActive = item.children.some((child) => matchesPath(currentPath, child.key))

  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])

  if (collapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={item.label}
        className={cn(
          'mx-auto h-12 w-12 rounded-2xl border border-transparent text-[oklch(var(--shell-nav-muted))] hover:border-white/6 hover:bg-white/6 hover:text-[oklch(var(--shell-nav-foreground))]',
          isActive && 'border-white/8 bg-[oklch(var(--shell-nav-active))] text-[oklch(var(--shell-nav-active-foreground))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
        )}
        onClick={() => onNavigate(item.children[0].key)}
      >
        <Icon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            'group flex w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition-all duration-200',
            isActive
              ? 'border-white/8 bg-[oklch(var(--shell-nav-active))] text-[oklch(var(--shell-nav-active-foreground))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
              : 'border-transparent bg-transparent text-[oklch(var(--shell-nav-foreground))] hover:border-white/5 hover:bg-white/5'
          )}
        >
          <span className="flex items-start gap-3">
            <span
              className={cn(
                'mt-0.5 rounded-xl border p-2',
                isActive
                  ? 'border-white/10 bg-white/7 text-[oklch(var(--shell-nav-active-foreground))]'
                  : 'border-white/6 bg-white/4 text-[oklch(var(--shell-nav-muted))] group-hover:text-[oklch(var(--shell-nav-foreground))]'
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.label}</span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              'mt-1 h-4 w-4 flex-shrink-0 text-white/45 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <div className="mt-2 space-y-1.5 pl-4">
          {item.children.map((child) => {
            const childActive = matchesPath(currentPath, child.key)
            return (
              <button
                key={child.key}
                type="button"
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors duration-200',
                  childActive
                    ? 'bg-white/7 text-[oklch(var(--shell-nav-active-foreground))]'
                    : 'text-white/70 hover:bg-white/4 hover:text-[oklch(var(--shell-nav-foreground))]'
                )}
                onClick={() => onNavigate(child.key)}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{child.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function MainLayout() {
  const { sidebarState, toggleSidebar } = useUIStore()
  const collapsed = sidebarState === 'collapsed'
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const activeContext = React.useMemo(() => resolveActiveContext(location.pathname), [location.pathname])

  const handleNavigate = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

  const searchTrigger = (
    <button
      type="button"
      className="group flex h-11 min-w-[320px] items-center justify-between rounded-2xl border border-border/70 bg-card px-4 text-left shadow-[var(--shadow-sm)] transition-colors hover:border-border hover:bg-accent/65"
      aria-label="打开全局搜索"
    >
      <span className="flex items-center gap-3 text-sm text-muted-foreground">
        <Command className="h-4 w-4 text-primary" />
        搜索客户、商机、订单或合同
      </span>
      <span className="rounded-lg border border-border/80 bg-muted px-2 py-1 text-[11px] text-muted-foreground">⌘K</span>
    </button>
  )

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[oklch(var(--shell-nav))] text-[oklch(var(--shell-nav-foreground))]">
      <div
        className={cn(
          'flex min-h-[88px] items-center border-b border-[oklch(var(--shell-nav-border))] px-5',
          collapsed ? 'justify-center px-3' : 'justify-between'
        )}
      >
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Building2 className="h-5 w-5 text-[oklch(var(--shell-nav-active-foreground))]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/42">Enterprise Workspace</p>
              <h1 className="mt-1 text-base font-semibold tracking-[-0.02em]">CRM Control Surface</h1>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="折叠侧边栏"
            className="text-white/55 hover:bg-white/6 hover:text-white"
            onClick={toggleSidebar}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-5">
        <div className="space-y-6">
          {navigationGroups.map((group) => (
            <section key={group.label} className="space-y-2">
              {!collapsed && (
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">{group.label}</p>
              )}
              <div className="space-y-2">
                {group.items.map((item) => (
                  <MenuItem
                    key={item.key}
                    item={item}
                    collapsed={collapsed}
                    currentPath={location.pathname}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-[oklch(var(--shell-nav-border))] px-3 py-4">
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="展开侧边栏"
            className="mx-auto h-12 w-12 rounded-2xl text-white/60 hover:bg-white/6 hover:text-white"
            onClick={toggleSidebar}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            aria-label="折叠侧边栏"
            className="h-12 w-full justify-center rounded-2xl border border-white/6 bg-white/4 text-white/65 hover:bg-white/6 hover:text-white"
            onClick={toggleSidebar}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  const contextTitle = activeContext?.page.label ?? 'CRM 系统'
  const contextDescription = activeContext?.page.description ?? '统一管理销售、客户、自动化与平台配置。'
  const moduleLabel = activeContext?.module.label ?? 'Workspace'
  const groupLabel = activeContext?.groupLabel ?? 'Overview'

  return (
    <div className="min-h-screen bg-[oklch(var(--background))] text-foreground">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-[oklch(var(--shell-nav-border))] md:flex md:flex-col',
          'transition-[width] duration-200 ease-out'
        )}
        style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-[rgba(16,20,28,0.52)] md:hidden"
            aria-label="关闭侧边栏"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[304px] border-r border-[oklch(var(--shell-nav-border))] md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}

      <main
        className="ml-0 min-h-screen transition-[margin-left] duration-200 ease-out md:ml-[var(--sidebar-width)]"
        style={{ ['--sidebar-width' as string]: `${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH}px` }}
      >
        <div className="sticky top-0 z-30 border-b border-border/70 bg-[oklch(var(--shell-panel-elevated)/0.94)] backdrop-blur-xl">
          <div className="flex min-h-[88px] items-center justify-between gap-6 px-5 md:px-7 xl:px-9">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="打开侧边栏"
                className="mt-0.5 md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>{groupLabel}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{moduleLabel}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h2 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">{contextTitle}</h2>
                  <span className="rounded-md border border-border/70 bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Active module
                  </span>
                </div>
                <p className="mt-2 max-w-[72ch] text-sm text-muted-foreground">{contextDescription}</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              <GlobalSearchDialog trigger={searchTrigger} />
              <NotificationDropdown />
              <button
                type="button"
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-3 py-2 shadow-[var(--shadow-sm)] transition-colors hover:border-border hover:bg-accent/60"
                aria-label="账户菜单"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(var(--foreground))] text-[oklch(var(--background))]">
                  <User className="h-4 w-4" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-medium text-foreground">管理员</span>
                  <span className="block text-xs text-muted-foreground">System control</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <GlobalSearchDialog
                trigger={
                  <Button variant="outline" size="icon" aria-label="打开全局搜索">
                    <Command className="h-4 w-4" />
                  </Button>
                }
              />
              <NotificationDropdown />
              <Button variant="outline" size="icon" aria-label="账户菜单">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[oklch(var(--shell-panel))] px-4 py-5 md:px-7 md:py-7 xl:px-9 xl:py-8">
          <div className="min-h-[calc(100vh-8rem)] rounded-[1.5rem] border border-border/70 bg-card shadow-[var(--shadow-sm)]">
            <div className="p-4 md:p-6 xl:p-7">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MainLayout
