/**
 * KnowledgeSearch - 知识库
 * Knowledge Base Search Page
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Book,
  Search,
  Plus,
  FileText,
  Folder,
  Tag,
  Clock,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  RefreshCw,
  Download,
} from 'lucide-react'

// Mock knowledge articles
interface KnowledgeArticle {
  id: string
  title: string
  category: string
  tags: string[]
  author: string
  updateTime: string
  views: number
  helpful: number
}

const articles: KnowledgeArticle[] = [
  {
    id: 'KB001',
    title: '如何创建新的客户记录',
    category: '客户管理',
    tags: ['客户', '创建', '基础操作'],
    author: '张三',
    updateTime: '2024-01-15',
    views: 256,
    helpful: 89,
  },
  {
    id: 'KB002',
    title: '商机跟进流程说明',
    category: '销售流程',
    tags: ['商机', '跟进', '流程'],
    author: '李四',
    updateTime: '2024-01-12',
    views: 189,
    helpful: 75,
  },
  {
    id: 'KB003',
    title: '合同审批步骤详解',
    category: '订单管理',
    tags: ['合同', '审批', '流程'],
    author: '王五',
    updateTime: '2024-01-10',
    views: 145,
    helpful: 62,
  },
  {
    id: 'KB004',
    title: '报表生成与导出',
    category: '数据分析',
    tags: ['报表', '导出', '数据'],
    author: '赵六',
    updateTime: '2024-01-08',
    views: 178,
    helpful: 81,
  },
  {
    id: 'KB005',
    title: '常见问题排查指南',
    category: '技术支持',
    tags: ['问题', '排查', 'FAQ'],
    author: '技术团队',
    updateTime: '2024-01-05',
    views: 512,
    helpful: 95,
  },
]

const categories = [
  { name: '客户管理', count: 25, color: 'bg-blue-500' },
  { name: '销售流程', count: 18, color: 'bg-green-500' },
  { name: '订单管理', count: 15, color: 'bg-yellow-500' },
  { name: '数据分析', count: 12, color: 'bg-purple-500' },
  { name: '技术支持', count: 20, color: 'bg-orange-500' },
  { name: '系统配置', count: 10, color: 'bg-pink-500' },
]

const popularSearches = ['客户创建', '合同审批', '报表导出', '跟进流程', '权限设置']

const stats = {
  totalArticles: 100,
  totalCategories: 6,
  totalViews: 15689,
  avgHelpful: 85,
}

export function KnowledgeSearchPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewType, setViewType] = React.useState('search')

  const filteredArticles = searchQuery
    ? articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : articles

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Book className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">知识库</h1>
            <p className="text-muted-foreground">产品使用文档与常见问题解答</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建文档
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">文档总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalArticles}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Folder className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">分类数</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.totalCategories}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">总浏览量</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均好评率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.avgHelpful}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList>
          <TabsTrigger value="search">搜索</TabsTrigger>
          <TabsTrigger value="categories">分类浏览</TabsTrigger>
          <TabsTrigger value="recent">最近更新</TabsTrigger>
          <TabsTrigger value="popular">热门文档</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                搜索知识库
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="输入关键词搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  搜索
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-muted-foreground">热门搜索:</span>
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{article.id}</Badge>
                        <span className="font-medium">{article.title}</span>
                      </div>
                      <Badge variant="secondary">{article.category}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>
                        <span>作者: {article.author}</span>
                        <span className="ml-4">更新: {article.updateTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                        <Star className="h-4 w-4 ml-2" />
                        <span>{article.helpful}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                分类浏览
              </CardTitle>
              <CardDescription>按类别浏览知识库文档</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div key={category.name} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{category.count} 篇文档</span>
                      <Button size="sm" variant="outline">
                        查看
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                最近更新
              </CardTitle>
              <CardDescription>近期更新或新增的文档</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{article.title}</span>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{article.updateTime}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                热门文档
              </CardTitle>
              <CardDescription>浏览量最高的文档</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.sort((a, b) => b.views - a.views).map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant={index < 3 ? 'default' : 'outline'}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{article.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{article.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default KnowledgeSearchPage