/**
 * 全局搜索对话框组件 (GlobalSearchDialog)
 * 支持 Cmd+K / Ctrl+K 快捷键打开
 * 显示搜索结果分类，点击跳转到对应详情页
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search as SearchIcon,
  X,
  Users,
  Briefcase,
  Package,
  FileText,
  DollarSign,
  ClipboardList,
  Clock,
  Command,
  ChevronRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGlobalSearch, type SearchResult, type SearchResultType } from '@/hooks/useGlobalSearch'

// 搜索类别配置
const searchCategoryConfig: Record<
  SearchResultType,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
  }
> = {
  customer: { label: '客户', icon: Users, color: 'text-blue-500' },
  contact: { label: '联系人', icon: Users, color: 'text-purple-500' },
  opportunity: { label: '商机', icon: Briefcase, color: 'text-green-500' },
  product: { label: '产品', icon: Package, color: 'text-cyan-500' },
  quote: { label: '报价', icon: DollarSign, color: 'text-yellow-500' },
  contract: { label: '合同', icon: FileText, color: 'text-orange-500' },
}

interface GlobalSearchDialogProps {
  trigger?: React.ReactNode
}

export function GlobalSearchDialog({ trigger }: GlobalSearchDialogProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  // 使用全局搜索 Hook
  const { results, categories, isLoading, total } = useGlobalSearch({
    query,
    enabled: isOpen && query.trim().length > 0,
  })

  // 键盘快捷键打开搜索
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K 或 Ctrl+K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      // Escape 关闭搜索
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // 聚焦输入框
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // 处理选择
  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    navigate(result.url)
  }

  // 获取首字母缩写
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // 渲染结果项
  const renderResultItem = (result: SearchResult) => {
    const category = searchCategoryConfig[result.type]
    const Icon = category.icon

    return (
      <button
        key={result.id}
        className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left group"
        onClick={() => handleSelect(result)}
      >
        {/* 图标/头像 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Icon className={`h-5 w-5 ${category.color}`} />
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{result.title}</p>
          {result.description && (
            <p className="text-xs text-muted-foreground truncate">
              {result.description}
            </p>
          )}
          {result.metadata && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {Object.entries(result.metadata).slice(0, 3).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-[10px] h-4">
                  {value}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 类型标签和箭头 */}
        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="outline" className="text-xs">
            {category.label}
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>
    )
  }

  // 按类型分组结果
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach((result) => {
      if (!groups[result.type]) {
        groups[result.type] = []
      }
      groups[result.type].push(result)
    })
    return groups
  }, [results])

  return (
    <>
      {/* 触发按钮 */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground hidden md:flex"
          onClick={() => setIsOpen(true)}
        >
          <span className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            搜索...
          </span>
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      {/* 搜索对话框 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索客户、联系人、商机、产品、报价、合同..."
                className="border-0 focus-visible:ring-0 px-0 text-base"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4 pb-4">
                {/* 分类统计 */}
                {query.trim() && (
                  <div className="flex items-center gap-2 flex-wrap pb-2 border-b">
                    {categories
                      .filter((c) => c.count > 0)
                      .map((category) => {
                        const config = searchCategoryConfig[category.type]
                        const Icon = config.icon
                        return (
                          <Badge
                            key={category.type}
                            variant="secondary"
                            className="text-xs gap-1"
                          >
                            <Icon className={`h-3 w-3 ${config.color}`} />
                            {config.label}
                            <span className="text-muted-foreground">({category.count})</span>
                          </Badge>
                        )
                      })}
                  </div>
                )}

                {/* 分组结果 */}
                {Object.entries(groupedResults).map(([type, items]) => {
                  const category = searchCategoryConfig[type as SearchResultType]
                  if (!category) return null

                  const Icon = category.icon

                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <Icon className={`h-3 w-3 ${category.color}`} />
                        <span>{category.label}</span>
                        <span>({items.length})</span>
                      </div>
                      <div className="space-y-1">
                        {items.map(renderResultItem)}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : query.trim() ? (
              <div className="text-center py-8 text-muted-foreground">
                <SearchIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">未找到相关结果</p>
                <p className="text-xs mt-1">尝试其他关键词</p>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-xs text-muted-foreground mb-3">热门搜索</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {categories
                    .filter((c) => c.count > 0)
                    .slice(0, 5)
                    .map((category) => {
                      const config = searchCategoryConfig[category.type]
                      const Icon = config.icon
                      return (
                        <Badge
                          key={category.type}
                          variant="outline"
                          className="gap-1 cursor-pointer hover:bg-muted"
                        >
                          <Icon className={`h-3 w-3 ${config.color}`} />
                          {config.label}
                        </Badge>
                      )
                    })}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* 底部提示 */}
          <div className="border-t px-6 py-3 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">↑↓</kbd>
                导航
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
                选择
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">esc</kbd>
                关闭
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>全局搜索</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GlobalSearchDialog
