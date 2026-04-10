/**
 * 设置页面布局组件
 * Settings Layout Component
 * 
 * 使用 Outlet 渲染子路由
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Database,
  Upload,
  Key,
  Webhook,
  FileText,
  FileCheck,
  Info,
  Smartphone,
  Zap,
  Mail,
  Link2,
  Workflow,
  LayoutGrid,
  Brush
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 设置页面菜单项分组（全量合并版）
const settingsMenuGroups = [
  {
    title: '个人设置',
    items: [
      { key: '/settings/profile', label: '个人资料', icon: User },
      { key: '/settings/security', label: '安全设置', icon: Shield },
      { key: '/settings/preferences', label: '偏好设置', icon: Settings },
      { key: '/settings/notifications', label: '通知设置', icon: Bell },
    ],
  },
  {
    title: '系统配置',
    items: [
      { key: '/settings/email', label: '邮件设置', icon: Mail },
      { key: '/settings/integrations', label: '集成设置', icon: Link2 },
      { key: '/settings/workflows', label: '工作流设置', icon: Workflow },
      { key: '/settings/fields', label: '字段设置', icon: LayoutGrid },
      { key: '/settings/layout', label: '布局设置', icon: LayoutGrid },
      { key: '/settings/theme', label: '主题设置', icon: Brush },
    ],
  },
  {
    title: '数据管理',
    items: [
      { key: '/settings/data-backup', label: '数据备份', icon: Database },
      { key: '/settings/import-export', label: '导入导出', icon: Upload },
    ],
  },
  {
    title: 'API & 集成',
    items: [
      { key: '/settings/api', label: 'API 设置', icon: Key },
      { key: '/settings/webhook', label: 'Webhook', icon: Webhook },
    ],
  },
  {
    title: '安全与审计',
    items: [
      { key: '/settings/audit-log', label: '审计日志', icon: FileText },
      { key: '/settings/login-log', label: '登录日志', icon: FileCheck },
      { key: '/settings/license', label: '许可证', icon: FileCheck },
    ],
  },
  {
    title: '系统管理',
    items: [
      { key: '/settings/users', label: '用户管理', icon: User },
      { key: '/settings/roles', label: '角色管理', icon: Shield },
      { key: '/settings/permissions', label: '权限管理', icon: Shield },
    ],
  },
  {
    title: '高级设置',
    items: [
      { key: '/settings/system-info', label: '系统信息', icon: Info },
      { key: '/settings/customization', label: '自定义设置', icon: Palette },
      { key: '/settings/mobile', label: '移动端设置', icon: Smartphone },
      { key: '/settings/advanced', label: '高级设置', icon: Zap },
    ],
  },
]

// 设置布局组件 - 使用侧边栏导航
export function SettingsLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 当前选中的菜单项
  const currentPath = location.pathname
  
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* 左侧侧边栏 */}
      <aside className="w-64 border-r bg-muted/30 p-4">
        <div className="space-y-6">
          {settingsMenuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={cn(
                      "flex items-center gap-3 w-full px-2 py-2 text-sm rounded-lg transition-colors",
                      currentPath === item.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </aside>
      
      {/* 右侧内容区 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default SettingsLayout