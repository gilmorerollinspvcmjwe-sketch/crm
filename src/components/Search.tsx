/**
 * 全局搜索组件 (Search)
 * 功能：搜索框、搜索结果展示、支持多种数据类型
 */

import * as React from 'react'
import {
  Search as SearchIcon,
  X,
  Users,
  Briefcase,
  FileText,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ChevronRight,
  Clock,
  Command,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type SearchResultType =
  | 'customer'
  | 'opportunity'
  | 'contact'
  | 'activity'
  | 'document'
  | 'email'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description?: string
  metadata?: Record<string, string>
  avatar?: string
  url?: string
  score?: number
}

export interface SearchCategory {
  type: SearchResultType
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface SearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onSelect?: (result: SearchResult) => void
  className?: string
}

const searchCategories: SearchCategory[] = [
  { type: 'customer', label: '客户', icon: Users, color: 'text-blue-500' },
  { type: 'opportunity', label: '商机', icon: Briefcase, color: 'text-green-500' },
  { type: 'contact', label: '联系人', icon: Users, color: 'text-purple-500' },
  { type: 'activity', label: '活动', icon: Calendar, color: 'text-orange-500' },
  { type: 'document', label: '文档', icon: FileText, color: 'text-gray-500' },
  { type: 'email', label: '邮件', icon: Mail, color: 'text-indigo-500' },
]

// Mock 搜索数据
const mockSearchResults: SearchResult[] = [
  {
    id: 'cust-001',
    type: 'customer',
    title: '北京科技创新有限公司',
    description: '客户编号：CUST2026001',
    metadata: { industry: '互联网', level: 'A 类', owner: '李明' },
    url: '/customer/cust-001',
  },
  {
    id: 'cust-002',
    type: 'customer',
    title: '上海智能制造有限公司',
    description: '客户编号：CUST2026002',
    metadata: { industry: '制造业', level: 'A 类', owner: '王芳' },
    url: '/customer/cust-002',
  },
  {
    id: 'opp-001',
    type: 'opportunity',
    title: 'ERP 系统升级项目',
    description: '预计金额：¥580,000',
    metadata: { stage: '商务谈判', customer: '北京科技创新', owner: '李明' },
    url: '/opportunity/opp-001',
  },
  {
    id: 'contact-001',
    type: 'contact',
    title: '张总',
    description: '北京科技创新 - CEO',
    metadata: { phone: '138****1234', email: 'zhang@bjtech.com' },
    avatar: '',
    url: '/contact/contact-001',
  },
  {
    id: 'activity-001',
    type: 'activity',
    title: '产品演示会议',
    description: '2026-04-10 14:00',
    metadata: { type: '会议', customer: '上海智能制造', owner: '王芳' },
    url: '/activity/activity-001',
  },
  {
    id: 'doc-001',
    type: 'document',
    title: '2026 Q1 销售报告.pdf',
    description: '上传时间：2026-04-01',
    metadata: { size: '2.5MB', owner: '李明' },
    url: '/documents/doc-001',
  },
  {
    id: 'email-001',
    type: 'email',
    title: 'Re: 合作意向沟通',
    description: '来自：zhang@bjtech.com',
    metadata: { date: '2026-04-08', customer: '北京科技创新' },
    url: '/email/email-001',
  },
]

export function Search({
  placeholder = '搜索客户、商机、联系人...',
  onSearch,
  onSelect,
  className,
}: SearchProps) {
  const [query, setQuery] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // 键盘快捷键打开搜索
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // 搜索防抖
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    // 模拟搜索延迟
    await new Promise((resolve) => setTimeout(resolve, 200))

    // 简单的 mock 搜索逻辑
    const filtered = mockSearchResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(filtered)
    setIsLoading(false)
    onSearch?.(searchQuery)
  }

  const handleSelect = (result: SearchResult) => {
    onSelect?.(result)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

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

  const getCategoryInfo = (type: SearchResultType) => {
    return searchCategories.find((c) => c.type === type)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderResultItem = (result: SearchResult, index: number) => {
    const category = getCategoryInfo(result.type)
    if (!category) return null

    const Icon = category.icon

    return (
      <button
        key={result.id}
        className={`w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left ${
          index === selectedIndex ? 'bg-muted' : ''
        }`}
        onClick={() => handleSelect(result)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        {/* 图标/头像 */}
        <div className="flex-shrink-0">
          {result.avatar ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={result.avatar} />
              <AvatarFallback>{getInitials(result.title)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${category.color}`} />
            </div>
          )}
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
            <div className="flex items-center gap-2 mt-1">
              {Object.entries(result.metadata).slice(0, 3).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-[10px] h-4">
                  {value}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 类型标签 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className="text-xs">
            {category.label}
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>
    )
  }

  return (
    <>
      {/* 搜索触发按钮 */}
      <div className={className}>
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground"
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
        >
          <span className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            {placeholder}
          </span>
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* 搜索对话框 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索客户、商机、联系人、文档..."
                className="border-0 focus-visible:ring-0 px-0 text-base"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setQuery('')
                    setResults([])
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
                {Object.entries(groupedResults).map(([type, items]) => {
                  const category = getCategoryInfo(type as SearchResultType)
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
                        {items.map((result, index) => renderResultItem(result, index))}
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
                <p className="text-xs text-muted-foreground mb-3">最近搜索</p>
                <div className="space-y-1">
                  {mockSearchResults.slice(0, 5).map((result, index) =>
                    renderResultItem(result, index)
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* 底部提示 */}
          <div className="border-t px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
                导航
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
                选择
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd>
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

export default Search
