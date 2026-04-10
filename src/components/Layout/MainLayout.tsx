/**
 * 主布局组件
 * Main Layout Component
 * 
 * 使用 Outlet 渲染子路由
 * 使用 Zustand useUIStore 管理侧边栏状态
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
  X,
  ChevronDown,
  User,
  Plus,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { GlobalSearchDialog } from '@/components/GlobalSearchDialog'
import { NotificationDropdown } from '@/components/NotificationDropdown'

// 侧边栏宽度常量
const SIDEBAR_EXPANDED_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64

// 菜单配置
const menuItems = [
  {
    key: 'workplace',
    label: '工作台',
    icon: Home,
    children: [
      { key: '/workbench', label: '销售工作台' },
      { key: '/dashboard', label: '仪表盘' },
    ],
  },
  {
    key: 'customer',
    label: '客户管理',
    icon: Users,
    children: [
      { key: '/customers', label: '客户列表' },
      { key: '/contacts', label: '联系人列表' },
    ],
  },
  {
    key: 'sales',
    label: '销售管理',
    icon: Lightbulb,
    children: [
      { key: '/leads', label: '线索管理' },
      { key: '/opportunities', label: '商机管理' },
      { key: '/activities', label: '跟进记录' },
    ],
  },
  {
    key: 'order',
    label: '订单管理',
    icon: FileText,
    children: [
      { key: '/orders', label: '订单列表' },
      { key: '/quotes', label: '报价管理' },
      { key: '/contracts', label: '合同管理' },
      { key: '/payments', label: '回款管理' },
    ],
  },
  {
    key: 'product',
    label: '产品与定价',
    icon: Package,
    children: [
      { key: '/products', label: '产品库' },
      { key: '/pricebooks', label: '价格表' },
    ],
  },
  {
    key: 'report',
    label: '报表中心',
    icon: BarChart3,
    children: [
      { key: '/reports', label: '报表中心' },
      { key: '/reports/funnel', label: '销售漏斗' },
      { key: '/reports/performance', label: '业绩统计' },
      { key: '/reports/customer', label: '客户分析' },
      { key: '/report/activity', label: '活动报表' },
      { key: '/report/lead-conversion', label: '线索转化' },
      { key: '/report/payment', label: '付款报表' },
    ],
  },
  {
    key: 'ai',
    label: '智能 AI',
    icon: Bot,
    children: [
      { key: '/ai/lead-assignment', label: '智能线索分配' },
      { key: '/ai/lead-scoring', label: '线索评分 AI' },
      { key: '/ai/sales-forecast', label: '销售预测 AI' },
      { key: '/ai/customer-segmentation', label: '客户细分 AI' },
      { key: '/ai/churn-warning', label: '流失预警' },
      { key: '/ai/meeting-assistant', label: '会议助手' },
      { key: '/ai/predictive', label: '预测性 AI' },
      { key: '/ai/agents', label: 'AI 代理' },
    ],
  },
  {
    key: 'automation',
    label: '自动化',
    icon: Zap,
    children: [
      { key: '/automation/workflows', label: '工作流' },
      { key: '/automation/logs', label: '执行日志' },
    ],
  },
  {
    key: 'marketing',
    label: '营销自动化',
    icon: Mail,
    children: [
      { key: '/marketing/campaigns', label: '营销活动' },
      { key: '/marketing/email-templates', label: '邮件模板' },
      { key: '/marketing/target-lists', label: '目标列表' },
    ],
  },
  {
    key: 'integration',
    label: '系统集成',
    icon: Headphones,
    children: [
      { key: '/integration/tickets', label: '工单系统' },
      { key: '/integration/knowledge', label: '知识库' },
      { key: '/integration/callcenter', label: '呼叫中心' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: Settings,
    children: [
      { key: '/settings/profile', label: '个人资料' },
      { key: '/settings/security', label: '安全设置' },
      { key: '/settings/preferences', label: '偏好设置' },
      { key: '/settings/notifications', label: '通知设置' },
      { key: '/settings/email', label: '邮件设置' },
      { key: '/settings/integrations', label: '集成设置' },
      { key: '/settings/workflows', label: '工作流设置' },
      { key: '/settings/fields', label: '字段设置' },
      { key: '/settings/layout', label: '布局设置' },
      { key: '/settings/theme', label: '主题设置' },
      { key: '/settings/data-backup', label: '数据备份' },
      { key: '/settings/import-export', label: '导入导出' },
      { key: '/settings/api', label: 'API 设置' },
      { key: '/settings/webhook', label: 'Webhook' },
      { key: '/settings/audit-log', label: '审计日志' },
      { key: '/settings/login-log', label: '登录日志' },
      { key: '/settings/license', label: '许可证' },
      { key: '/settings/users', label: '用户管理' },
      { key: '/settings/roles', label: '角色管理' },
      { key: '/settings/permissions', label: '权限管理' },
      { key: '/settings/system-info', label: '系统信息' },
      { key: '/settings/customization', label: '自定义设置' },
      { key: '/settings/mobile', label: '移动端设置' },
      { key: '/settings/advanced', label: '高级设置' },
    ],
  },
]

// 侧边栏菜单项组件
interface MenuItemProps {
  item: typeof menuItems[0]
  collapsed: boolean
  currentPath: string
  onNavigate: (path: string) => void
}

function MenuItem({ item, collapsed, currentPath, onNavigate }: MenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const Icon = item.icon
  const isActive = item.children?.some(child => currentPath === child.key || currentPath.startsWith(child.key + '/'))
  
  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])
  
  if (collapsed) {
    return (
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-center h-10 px-2 text-slate-300 hover:text-white hover:bg-slate-800',
          isActive && 'bg-slate-800 text-white'
        )}
        onClick={() => {
          if (item.children?.[0]) {
            onNavigate(item.children[0].key)
          }
        }}
      >
        <Icon className="h-4 w-4" />
      </Button>
    )
  }
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between h-10 px-3 text-slate-300 hover:text-white hover:bg-slate-800',
            isActive && 'bg-slate-800 text-white'
          )}
        >
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </span>
          <ChevronDown className={cn(
            'h-4 w-4 transition-transform text-slate-400',
            isOpen && 'rotate-180'
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 py-2 space-y-1">
        {item.children?.map(child => (
          <Button
            key={child.key}
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-start h-9 px-3 ml-2 text-slate-400 hover:text-white hover:bg-slate-800',
              (currentPath === child.key || currentPath.startsWith(child.key + '/')) 
                && 'bg-slate-800 text-white font-medium border-l-2 border-primary'
            )}
            onClick={() => onNavigate(child.key)}
          >
            {child.label}
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// 主布局组件 - 使用 Outlet 渲染子路由，使用 Zustand 管理侧边栏状态
export function MainLayout() {
  // 使用 Zustand store 管理侧边栏状态（自动持久化）
  const { sidebarState, toggleSidebar } = useUIStore()
  const collapsed = sidebarState === 'collapsed'
  
  // 移动端侧边栏状态（本地状态，不需要持久化）
  const [mobileOpen, setMobileOpen] = React.useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleNavigate = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }
  
  // 侧边栏内容
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center h-14 px-4 border-b border-slate-700',
        collapsed ? 'justify-center' : 'gap-2'
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold">
          {collapsed ? 'C' : 'CRM'}
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg text-white">CRM 系统</span>
        )}
      </div>
      
      {/* 菜单 */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {menuItems.map(item => (
            <MenuItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              currentPath={location.pathname}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </ScrollArea>
      
      {/* 底部：折叠按钮 */}
      <Separator className="bg-slate-700" />
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-center text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={toggleSidebar}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-background">
      {/* 桌面端侧边栏 */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-40 border-r bg-slate-900 border-slate-800 transition-all duration-200',
          'hidden md:flex md:flex-col'
        )}
        style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      >
        {sidebarContent}
      </aside>
      
      {/* 移动端侧边栏 */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed left-0 top-0 bottom-0 z-40 w-[240px] border-r bg-slate-900 border-slate-800 md:hidden"
          >
            {sidebarContent}
          </aside>
        </>
      )}
      
      {/* 主内容区 */}
      <main
        className={cn(
          'transition-all duration-200',
          'md:ml-[240px]',
          collapsed && 'md:ml-[64px]'
        )}
      >
        {/* 顶部栏 */}
        <header className="sticky top-0 z-20 h-14 border-b bg-background flex items-center px-4 gap-4">
          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* 页面标题 */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center gap-2">
            {/* 全局搜索 */}
            <div className="w-48 hidden md:block">
              <GlobalSearchDialog />
            </div>
            
            {/* 通知中心 */}
            <NotificationDropdown />
            
            {/* 新建按钮 */}
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Plus className="mr-2 h-4 w-4" />
              新建
            </Button>
            
            {/* 用户菜单 */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* 页面内容 - Outlet 渲染子路由 */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

// 根据路径获取页面标题
function getPageTitle(path: string): string {
  const segments = path.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  
  const titleMap: Record<string, string> = {
    'workbench': '销售工作台',
    'dashboard': '仪表盘',
    'list': '列表',
    'profile': '个人资料',
    'security': '安全设置',
    'preferences': '偏好设置',
    'config': 'AI 配置',
    'history': '历史记录',
    'prompts': '提示词模板',
    'campaigns': '营销活动',
    'email-templates': '邮件模板',
  }
  
  return titleMap[lastSegment] ?? 'CRM 系统'
}

export default MainLayout