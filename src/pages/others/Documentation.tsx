/**
 * Documentation Center Page - 文档中心
 * Features: Document navigation, Categories, Search
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Video,
  Code,
  Lightbulb,
  Settings,
  Users,
  BarChart,
  Zap,
  Folder,
  ArrowLeft,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react'

// ============================================================
// Document Data Structure
// ============================================================
interface DocItem {
  id: string
  title: string
  description: string
  path: string
  type: 'doc' | 'video' | 'api'
  tags: string[]
  updateTime: string
  readTime: number
}

interface DocCategory {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  items: DocItem[]
  children?: DocCategory[]
}

// ============================================================
// Mock Documentation Data
// ============================================================
const documentationData: DocCategory[] = [
  {
    id: 'getting-started',
    title: '新手入门',
    icon: <Lightbulb className="h-5 w-5" />,
    description: '快速了解CRM系统的基础功能',
    items: [
      {
        id: 'intro',
        title: '系统介绍',
        description: '了解CRM系统的核心功能和价值',
        path: '/docs/intro',
        type: 'doc',
        tags: ['基础', '介绍'],
        updateTime: '2026-03-15',
        readTime: 5,
      },
      {
        id: 'quick-start',
        title: '快速上手指南',
        description: '10分钟快速掌握基本操作',
        path: '/docs/quick-start',
        type: 'doc',
        tags: ['入门', '教程'],
        updateTime: '2026-03-20',
        readTime: 10,
      },
      {
        id: 'first-customer',
        title: '创建第一个客户',
        description: '学习如何录入和管理客户信息',
        path: '/docs/first-customer',
        type: 'video',
        tags: ['客户', '视频'],
        updateTime: '2026-03-18',
        readTime: 8,
      },
    ],
  },
  {
    id: 'customer-management',
    title: '客户管理',
    icon: <Users className="h-5 w-5" />,
    description: '客户信息录入、分类和维护',
    items: [
      {
        id: 'customer-create',
        title: '客户创建与编辑',
        description: '详细的客户信息录入指南',
        path: '/docs/customer-create',
        type: 'doc',
        tags: ['客户', '编辑'],
        updateTime: '2026-03-25',
        readTime: 15,
      },
      {
        id: 'customer-import',
        title: '批量导入客户',
        description: 'Excel/CSV批量导入操作说明',
        path: '/docs/customer-import',
        type: 'doc',
        tags: ['导入', '批量'],
        updateTime: '2026-03-22',
        readTime: 12,
      },
      {
        id: 'customer-segment',
        title: '客户分类与标签',
        description: '如何高效管理客户分类',
        path: '/docs/customer-segment',
        type: 'doc',
        tags: ['分类', '标签'],
        updateTime: '2026-03-28',
        readTime: 10,
      },
    ],
  },
  {
    id: 'sales-management',
    title: '销售管理',
    icon: <BarChart className="h-5 w-5" />,
    description: '商机、销售管道和业绩管理',
    items: [
      {
        id: 'opportunity-guide',
        title: '商机管理指南',
        description: '从线索到成交的完整流程',
        path: '/docs/opportunity-guide',
        type: 'doc',
        tags: ['商机', '销售'],
        updateTime: '2026-04-01',
        readTime: 20,
      },
      {
        id: 'pipeline-config',
        title: '销售管道配置',
        description: '自定义销售阶段和概率',
        path: '/docs/pipeline-config',
        type: 'doc',
        tags: ['管道', '配置'],
        updateTime: '2026-03-30',
        readTime: 15,
      },
      {
        id: 'forecast',
        title: '销售预测与分析',
        description: '使用数据进行销售预测',
        path: '/docs/forecast',
        type: 'video',
        tags: ['预测', '分析'],
        updateTime: '2026-04-02',
        readTime: 25,
      },
    ],
  },
  {
    id: 'ai-features',
    title: 'AI 功能',
    icon: <Zap className="h-5 w-5" />,
    description: '智能助手和自动化功能',
    items: [
      {
        id: 'ai-assistant',
        title: 'AI助手使用指南',
        description: '如何利用AI提升工作效率',
        path: '/docs/ai-assistant',
        type: 'doc',
        tags: ['AI', '助手'],
        updateTime: '2026-04-03',
        readTime: 18,
      },
      {
        id: 'ai-script',
        title: '智能话术生成',
        description: 'AI生成个性化销售话术',
        path: '/docs/ai-script',
        type: 'video',
        tags: ['话术', 'AI'],
        updateTime: '2026-04-02',
        readTime: 12,
      },
      {
        id: 'workflow-auto',
        title: '自动化工作流',
        description: '配置自动化任务和提醒',
        path: '/docs/workflow-auto',
        type: 'doc',
        tags: ['自动化', '工作流'],
        updateTime: '2026-03-28',
        readTime: 20,
      },
    ],
  },
  {
    id: 'settings',
    title: '系统设置',
    icon: <Settings className="h-5 w-5" />,
    description: '系统配置和个人设置',
    items: [
      {
        id: 'user-settings',
        title: '用户与权限设置',
        description: '用户管理和权限配置',
        path: '/docs/user-settings',
        type: 'doc',
        tags: ['用户', '权限'],
        updateTime: '2026-03-20',
        readTime: 15,
      },
      {
        id: 'notification',
        title: '通知与提醒设置',
        description: '配置系统通知规则',
        path: '/docs/notification',
        type: 'doc',
        tags: ['通知', '提醒'],
        updateTime: '2026-03-25',
        readTime: 10,
      },
      {
        id: 'custom-fields',
        title: '自定义字段',
        description: '添加和管理自定义字段',
        path: '/docs/custom-fields',
        type: 'doc',
        tags: ['自定义', '字段'],
        updateTime: '2026-03-30',
        readTime: 12,
      },
    ],
  },
  {
    id: 'api',
    title: 'API 文档',
    icon: <Code className="h-5 w-5" />,
    description: '开发者接口文档',
    items: [
      {
        id: 'api-intro',
        title: 'API 接口概述',
        description: 'REST API基本介绍',
        path: '/docs/api-intro',
        type: 'api',
        tags: ['API', '开发'],
        updateTime: '2026-04-01',
        readTime: 30,
      },
      {
        id: 'api-auth',
        title: '认证与授权',
        description: 'API访问认证方式',
        path: '/docs/api-auth',
        type: 'api',
        tags: ['认证', '安全'],
        updateTime: '2026-03-28',
        readTime: 15,
      },
      {
        id: 'api-endpoints',
        title: '接口列表',
        description: '完整的API端点文档',
        path: '/docs/api-endpoints',
        type: 'api',
        tags: ['接口', '文档'],
        updateTime: '2026-04-03',
        readTime: 60,
      },
    ],
  },
]

// ============================================================
// Doc Item Card Component
// ============================================================
interface DocItemCardProps {
  item: DocItem
}

function DocItemCard({ item }: DocItemCardProps) {
  const navigate = useNavigate()
  
  const typeIcon = {
    doc: <FileText className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    api: <Code className="h-4 w-4" />,
  }
  
  const typeColor = {
    doc: 'text-blue-500',
    video: 'text-green-500',
    api: 'text-purple-500',
  }
  
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
      onClick={() => navigate(item.path)}
    >
      <div className="flex items-center gap-3">
        <div className={typeColor[item.type]}>
          {typeIcon[item.type]}
        </div>
        <div className="flex-1">
          <p className="font-medium group-hover:text-primary transition-colors">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {item.readTime}分钟
        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

// ============================================================
// Category Section Component
// ============================================================
interface CategorySectionProps {
  category: DocCategory
  expanded: boolean
  onToggle: () => void
}

function CategorySection({ category, expanded, onToggle }: CategorySectionProps) {
  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {category.icon}
            </div>
            <div>
              <CardTitle className="text-base">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{category.items.length}</Badge>
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <Separator className="mb-3" />
          <div className="space-y-2">
            {category.items.map(item => (
              <DocItemCard key={item.id} item={item} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// ============================================================
// Documentation Page Component
// ============================================================
export function Documentation() {
  const navigate = useNavigate()
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['getting-started'])

  // Current doc (if viewing a specific doc)
  const currentDocId = params.docId

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    
    const results: DocItem[] = []
    documentationData.forEach(category => {
      category.items.forEach(item => {
        if (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          results.push(item)
        }
      })
    })
    return results
  }, [searchQuery])

  // Flatten all items for recent docs
  const allDocs = useMemo(() => {
    return documentationData.flatMap(cat => cat.items)
      .sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
      .slice(0, 5)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-muted/30 p-4 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => navigate('/help-center')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回帮助中心
            </Button>

            <Separator />

            {/* Navigation Tree */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground px-2">文档目录</p>
              {documentationData.map(category => (
                <div
                  key={category.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                    expandedCategories.includes(category.id) ? 'bg-muted' : ''
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.icon}
                  <span className="flex-1 text-sm">{category.title}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${
                    expandedCategories.includes(category.id) ? 'rotate-180' : ''
                  }`} />
                </div>
              ))}
            </div>

            <Separator />

            {/* Quick Links */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground px-2">快捷入口</p>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/changelog')}>
                <FileText className="h-4 w-4 mr-2" />
                更新日志
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/feedback')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                提交反馈
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight">文档中心</h1>
              
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文档..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">搜索结果 ({searchResults.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {searchResults.length > 0 ? (
                    searchResults.map(item => (
                      <DocItemCard key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      未找到相关文档
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Updates */}
            {!searchQuery && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    最近更新
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {allDocs.map(item => (
                    <DocItemCard key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            {!searchQuery && (
              <div className="space-y-4">
                {documentationData.map(category => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    expanded={expandedCategories.includes(category.id)}
                    onToggle={() => toggleCategory(category.id)}
                  />
                ))}
              </div>
            )}

            {/* Footer */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">文档持续更新中</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/feedback')}>
                  反馈文档问题
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Documentation