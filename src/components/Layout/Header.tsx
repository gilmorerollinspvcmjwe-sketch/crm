/**
 * 顶部栏组件
 * 包含面包屑导航、全局搜索框、通知图标、用户头像下拉
 */
import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Bell, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LanguageSwitcher } from './LanguageSwitcher'

// 面包屑路径映射
const breadcrumbMap: Record<string, string> = {
  '/workbench': '销售工作台',
  '/dashboard': '仪表盘',
  '/customer': '客户',
  '/customer/list': '客户列表',
  '/contact': '联系人',
  '/contact/list': '联系人列表',
  '/lead': '线索',
  '/lead/list': '线索列表',
  '/opportunity': '机会',
  '/opportunity/list': '机会列表',
  '/activity': '活动',
  '/activity/list': '活动记录',
  '/order': '订单',
  '/order/list': '订单列表',
  '/quote': '报价',
  '/quote/list': '报价单',
  '/contract': '合同',
  '/contract/list': '合同列表',
  '/payment': '付款',
  '/payment/list': '付款列表',
  '/products': '产品',
  '/products/list': '产品库',
  '/pricebooks': '价格',
  '/pricebooks/list': '价格表',
  '/report': '报表',
  '/report/funnel': '销售漏斗',
  '/report/performance': '业绩统计',
  '/report/customer': '客户分析',
  '/report/activity': '活动报表',
  '/ai': 'AI',
  '/ai/lead-assignment': '智能线索分配',
  '/ai/lead-scoring': '线索评分',
  '/ai/sales-forecast': '销售预测',
  '/ai/customer-segmentation': '客户细分',
  '/automation': '自动化',
  '/automation/workflows': '工作流',
  '/automation/logs': '执行日志',
  '/marketing': '营销',
  '/marketing/campaigns': '营销活动',
  '/marketing/email-templates': '邮件模板',
  '/marketing/target-lists': '目标列表',
  '/integration': '集成',
  '/integration/tickets': '工单系统',
  '/integration/knowledge': '知识库',
  '/integration/callcenter': '呼叫中心',
  '/settings': '设置',
  '/settings/profile': '个人资料',
  '/settings/change-password': '修改密码',
  '/settings/notifications': '通知偏好',
  '/settings/display': '显示偏好',
  '/settings/roles': '角色管理',
  '/settings/users': '用户管理',
}

interface HeaderProps {
  sidebarCollapsed: boolean
  onMobileMenuClick?: () => void
  isMobile?: boolean
  className?: string
}

// 通知项数据
const notifications = [
  {
    id: '1',
    title: '合同审批待处理',
    description: '深圳未来科技 - 合同编号 CONT2026001',
    time: '10分钟前',
    unread: true,
  },
  {
    id: '2',
    title: '机会即将过期',
    description: '北京科技创新 - 预计成交日期：03-31',
    time: '1小时前',
    unread: true,
  },
  {
    id: '3',
    title: '新线索分配',
    description: '上海贸易集团 - 已分配给王芳',
    time: '2小时前',
    unread: false,
  },
]

export function Header({
  sidebarCollapsed,
  onMobileMenuClick,
  isMobile = false,
  className,
}: HeaderProps) {
  const location = useLocation()
  const [searchValue, setSearchValue] = React.useState('')

  // 生成面包屑
  const generateBreadcrumb = () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean)
    const items = pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      const name = breadcrumbMap[url] || snippet
      const isLast = index === pathSnippets.length - 1

      return {
        url,
        name,
        isLast,
      }
    })

    return items
  }

  const breadcrumbItems = generateBreadcrumb()
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header
      className={cn(
        'fixed top-0 z-30 h-14 border-b bg-background transition-all duration-300',
        isMobile ? 'left-0 right-0' : sidebarCollapsed ? 'left-[60px] right-0' : 'left-[240px] right-0',
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4 gap-4">
        {/* 左侧：移动端菜单按钮 + 面包屑 */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuClick}
              className="shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {!isMobile && breadcrumbItems.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.url}>
                    <BreadcrumbItem>
                      {item.isLast ? (
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink>
                          <Link to={item.url}>{item.name}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        {/* 中间：全局搜索 */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索客户、线索、订单..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* 右侧：通知 + 语言 + 用户 */}
        <div className="flex items-center gap-2">
          {/* 语言切换 */}
          <LanguageSwitcher />

          {/* 通知 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                通知
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                  查看全部
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    {notification.unread && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <span className="font-medium text-sm">{notification.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notification.description}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 用户头像 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      管
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && <span className="text-sm font-medium">管理员</span>}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings/profile">个人中心</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">账户设置</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header