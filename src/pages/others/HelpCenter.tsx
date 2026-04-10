/**
 * Help Center Page - 帮助中心
 * Features: Search, FAQ categories, Quick links
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  ChevronRight,
  FileText,
  Video,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Clock,
  Users,
  Lightbulb,
} from 'lucide-react'

// ============================================================
// FAQ Data
// ============================================================
interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  popularity: number
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: '如何创建新的客户记录？',
    answer: '进入客户列表页面，点击右上角"新建客户"按钮，填写客户基本信息（名称、联系人、电话等），保存后即可创建成功。您也可以从线索转化自动创建客户。',
    category: '客户管理',
    tags: ['客户', '新建', '基础操作'],
    popularity: 95,
  },
  {
    id: '2',
    question: '如何设置销售管道的阶段？',
    answer: '进入设置 > 系统设置 > 销售管道，可以自定义商机阶段的名称、顺序、概率等。每个阶段可以设置自动任务和提醒规则。',
    category: '商机管理',
    tags: ['商机', '管道', '阶段'],
    popularity: 88,
  },
  {
    id: '3',
    question: '如何导入批量客户数据？',
    answer: '支持 Excel/CSV 格式导入。进入客户列表 > 导入按钮 > 选择文件 > 字段映射 > 硓认导入。系统会自动检测重复数据并提供处理选项。',
    category: '数据管理',
    tags: ['导入', '批量', 'Excel'],
    popularity: 82,
  },
  {
    id: '4',
    question: '如何配置邮件通知规则？',
    answer: '进入设置 > 通知设置，可以配置各类事件的通知规则，包括商机状态变更、任务提醒、合同到期等。支持邮件和站内通知两种方式。',
    category: '系统设置',
    tags: ['通知', '邮件', '提醒'],
    popularity: 75,
  },
  {
    id: '5',
    question: '如何使用AI助手生成销售话术？',
    answer: '在AI助手页面选择"话术生成"功能，输入客户行业、痛点和产品信息，AI会根据最佳实践生成个性化销售话术，支持多轮优化调整。',
    category: 'AI功能',
    tags: ['AI', '话术', '智能'],
    popularity: 90,
  },
  {
    id: '6',
    question: '如何导出报表数据？',
    answer: '在报表页面点击"导出"按钮，选择导出格式（PDF/Excel/CSV）和数据范围。支持定时自动导出和邮件发送。',
    category: '报表分析',
    tags: ['报表', '导出', '数据'],
    popularity: 78,
  },
  {
    id: '7',
    question: '如何设置用户权限和角色？',
    answer: '进入管理 > 用户管理，创建角色并分配权限模块。支持细粒度的字段级权限控制，如查看、编辑、删除等操作权限。',
    category: '系统管理',
    tags: ['权限', '角色', '用户'],
    popularity: 85,
  },
  {
    id: '8',
    question: '如何关联客户与商机？',
    answer: '在商机详情页面，客户字段会自动关联。新建商机时可选择已有客户，或直接创建新客户。一个客户可关联多个商机。',
    category: '商机管理',
    tags: ['关联', '客户', '商机'],
    popularity: 72,
  },
]

const categories = ['全部', '客户管理', '商机管理', '数据管理', '系统设置', 'AI功能', '报表分析', '系统管理']

const quickLinks = [
  { title: '新手入门', icon: Lightbulb, path: '/docs/getting-started', count: 12 },
  { title: '视频教程', icon: Video, path: '/docs/videos', count: 8 },
  { title: '功能文档', icon: FileText, path: '/docs/features', count: 45 },
  { title: 'API文档', icon: BookOpen, path: '/docs/api', count: 30 },
]

const popularTopics = [
  { title: '客户管理完整指南', views: 12500, path: '/docs/customer-guide' },
  { title: '销售管道最佳实践', views: 9800, path: '/docs/sales-pipeline' },
  { title: 'AI助手使用技巧', views: 8500, path: '/docs/ai-tips' },
  { title: '报表分析入门', views: 7200, path: '/docs/reports-intro' },
]

// ============================================================
// FAQ Card Component
// ============================================================
interface FAQCardProps {
  item: FAQItem
  onClick: () => void
}

function FAQCard({ item, onClick }: FAQCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="font-medium">{item.question}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
              {item.tags.slice(0, 2).map(tag => (
                <Badge variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            {item.popularity}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Help Center Page Component
// ============================================================
export function HelpCenter() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    return faqData.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Popular FAQs
  const popularFAQs = useMemo(() => {
    return [...faqData].sort((a, b) => b.popularity - a.popularity).slice(0, 3)
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">帮助中心</h1>
          <p className="text-muted-foreground">快速找到您需要的答案和帮助</p>
          
          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="搜索问题、关键词或文档..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                清除
              </Button>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(link => (
            <Card
              key={link.title}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(link.path)}
            >
              <CardContent className="pt-4 flex items-center gap-3">
                <link.icon className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{link.title}</p>
                  <p className="text-sm text-muted-foreground">{link.count} 篇文档</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">常见问题</TabsTrigger>
            <TabsTrigger value="popular">热门话题</TabsTrigger>
            <TabsTrigger value="contact">联系我们</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4 mt-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map(item => (
                  <div key={item.id}>
                    <FAQCard
                      item={item}
                      onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                    />
                    {expandedFAQ === item.id && (
                      <Card className="mt-2 bg-muted/50">
                        <CardContent className="pt-4">
                          <p className="text-sm leading-relaxed">{item.answer}</p>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              反馈
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              详细文档
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">未找到相关问题</p>
                    <p className="text-sm text-muted-foreground mt-1">尝试其他关键词或查看全部问题</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4 mt-4">
            {/* Popular FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  热门问题
                </CardTitle>
                <CardDescription>用户最常查阅的问题</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularFAQs.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setExpandedFAQ(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium">{item.question}</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" />
                      {item.popularity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  热门文档
                </CardTitle>
                <CardDescription>最受欢迎的帮助文档</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularTopics.map(topic => (
                  <div
                    key={topic.title}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(topic.path)}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{topic.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {topic.views.toLocaleString()} 阅读
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <Phone className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="font-medium">电话支持</p>
                  <p className="text-lg font-bold mt-2">400-888-9999</p>
                  <p className="text-sm text-muted-foreground mt-1">工作日 9:00-18:00</p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="font-medium">邮件支持</p>
                  <p className="text-lg font-bold mt-2">support@crm.com</p>
                  <p className="text-sm text-muted-foreground mt-1">24小时内回复</p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <MessageCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="font-medium">在线客服</p>
                  <Button className="mt-3">
                    开始对话
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">即时响应</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>提交反馈</CardTitle>
                <CardDescription>告诉我们您的问题或建议</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate('/feedback')}>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  前往反馈页面
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default HelpCenter