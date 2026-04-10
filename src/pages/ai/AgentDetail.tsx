/**
 * AgentDetail - AI 智能体详情
 * AI Agent Detail Page
 * Features: 智能体配置、运行表现、对话记录、能力管理
 */

import * as React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import {
  Bot,
  Zap,
  Settings,
  Edit,
  MessageSquare,
  Activity,
  Target,
  Clock,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Database,
  Send,
  Star,
  Users,
  Copy,
  Download,
  TestTube,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for agent config
const agentConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  model: z.string().min(1),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(100).max(4000),
  systemPrompt: z.string().optional(),
})

type AgentConfigForm = z.infer<typeof agentConfigSchema>

// Mock agent detail data
const agentDetail = {
  id: 'agent-1',
  name: '客服助手',
  type: 'conversation',
  status: 'active',
  description: '自动回复客户咨询，处理常见问题，支持智能转接',
  capabilities: [
    { id: 'qa', name: '智能问答', enabled: true, description: '自动回答常见问题' },
    { id: 'classify', name: '问题分类', enabled: true, description: '识别并分类用户问题' },
    { id: 'auto-reply', name: '自动回复', enabled: true, description: '生成智能回复内容' },
    { id: 'transfer', name: '转接人工', enabled: true, description: '复杂问题转人工处理' },
    { id: 'emotion', name: '情绪识别', enabled: true, description: '识别用户情绪状态' },
    { id: 'multi-turn', name: '多轮对话', enabled: false, description: '支持上下文记忆' },
    { id: 'knowledge', name: '知识检索', enabled: false, description: '检索知识库内容' },
    { id: 'voice', name: '语音交互', enabled: false, description: '支持语音输入输出' },
  ],
  model: 'GPT-4',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: '你是一个专业的客服助手，负责回答客户咨询。请保持礼貌、专业的态度，尽量提供准确、有帮助的回答。对于无法处理的问题，请引导用户转接人工客服。',
  knowledgeBases: [
    { id: 'kb-1', name: '产品知识库', documents: 156, lastUpdated: '2天前' },
    { id: 'kb-2', name: '常见问题库', documents: 89, lastUpdated: '5天前' },
  ],
  stats: {
    conversations: 1256,
    successRate: 85,
    avgResponse: 2.3,
    satisfaction: 4.5,
    peakHour: '14:00',
    totalMessages: 8562,
    avgConversationLength: 6.8,
    transferRate: 12,
  },
  performance: [
    { day: '周一', conversations: 180, successRate: 86, avgResponse: 2.2 },
    { day: '周二', conversations: 195, successRate: 88, avgResponse: 2.1 },
    { day: '周三', conversations: 175, successRate: 85, avgResponse: 2.4 },
    { day: '周四', conversations: 210, successRate: 87, avgResponse: 2.3 },
    { day: '周五', conversations: 185, successRate: 84, avgResponse: 2.5 },
    { day: '周六', conversations: 120, successRate: 82, avgResponse: 2.8 },
    { day: '周日', conversations: 85, successRate: 80, avgResponse: 3.0 },
  ],
  recentDialogs: [
    { 
      id: '1', 
      user: '科技公司A', 
      question: '产品价格是多少？', 
      answer: '您好，我们的产品价格根据版本不同有所差异：基础版每月999元，专业版每月2999元，企业版需要联系销售获取报价。请问您对哪个版本感兴趣？', 
      resolved: true, 
      rating: 5,
      time: '10分钟前'
    },
    { 
      id: '2', 
      user: '金融公司B', 
      question: '如何开通新功能？', 
      answer: '您可以通过系统设置中的功能管理模块开通新功能。具体步骤：1. 进入设置 2. 点击功能管理 3. 选择需要开通的功能 4. 确认开通。需要我为您演示吗？', 
      resolved: true, 
      rating: 4,
      time: '25分钟前'
    },
    { 
      id: '3', 
      user: '教育机构C', 
      question: '遇到登录问题', 
      answer: '请确认您的账号密码是否正确，如果忘记密码可以使用找回密码功能。如果问题仍然存在，我可以帮您转接技术支持。', 
      resolved: false, 
      rating: null,
      time: '45分钟前'
    },
  ],
}

// Radar data for performance
const radarData = [
  { dimension: '响应速度', value: 90, fullMark: 100 },
  { dimension: '准确率', value: 85, fullMark: 100 },
  { dimension: '满意度', value: 90, fullMark: 100 },
  { dimension: '覆盖率', value: 75, fullMark: 100 },
  { dimension: '转人工率', value: 88, fullMark: 100 },
]

// Model options
const modelOptions = [
  { id: 'gpt-4', name: 'GPT-4', description: '最强大的模型，适合复杂任务' },
  { id: 'gpt-35', name: 'GPT-3.5', description: '平衡性能与成本' },
  { id: 'claude-3', name: 'Claude 3', description: '擅长长文本分析' },
]

export function AgentDetailPage() {
  const { id } = useParams()
  const [agentStatus, setAgentStatus] = React.useState(agentDetail.status === 'active')
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)
  const [showTestDialog, setShowTestDialog] = React.useState(false)
  const [testMessage, setTestMessage] = React.useState('')
  const [testResponse, setTestResponse] = React.useState('')

  const form = useForm<AgentConfigForm>({
    resolver: zodResolver(agentConfigSchema),
    defaultValues: {
      name: agentDetail.name,
      description: agentDetail.description,
      model: agentDetail.model,
      temperature: agentDetail.temperature,
      maxTokens: agentDetail.maxTokens,
      systemPrompt: agentDetail.systemPrompt,
    },
  })

  const onSaveConfig = (data: AgentConfigForm) => {
    console.log('保存配置:', data)
    setShowConfigDialog(false)
  }

  const handleTest = () => {
    // Simulate AI response
    setTestResponse('您好！我是客服助手，很高兴为您服务。请问有什么可以帮助您的吗？')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/ai/agents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{agentDetail.name}</h1>
              <Badge variant="outline">
                {agentDetail.type === 'conversation' ? '对话型' : 
                 agentDetail.type === 'task' ? '任务型' : 
                 agentDetail.type === 'analysis' ? '分析型' : '自动化'}
              </Badge>
              <Badge variant={agentStatus ? 'default' : 'secondary'}>
                {agentStatus ? '运行中' : '已暂停'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{agentDetail.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pr-4">
            <Switch checked={agentStatus} onCheckedChange={setAgentStatus} />
            <Label>{agentStatus ? '运行' : '暂停'}</Label>
          </div>
          <Button variant="outline" onClick={() => setShowTestDialog(true)}>
            <TestTube className="h-4 w-4 mr-2" />
            测试对话
          </Button>
          <Button variant="outline" onClick={() => setShowConfigDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            编辑配置
          </Button>
          <Button variant="outline" className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">对话总数</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{agentDetail.stats.conversations}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">成功率</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{agentDetail.stats.successRate}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">平均响应</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{agentDetail.stats.avgResponse}s</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">满意度</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{agentDetail.stats.satisfaction}/5</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">高峰时段</span>
            </div>
            <div className="text-2xl font-bold text-pink-600">{agentDetail.stats.peakHour}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-cyan-600" />
              <span className="text-sm font-medium">转人工率</span>
            </div>
            <div className="text-2xl font-bold text-cyan-600">{agentDetail.stats.transferRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">运行表现</TabsTrigger>
          <TabsTrigger value="dialogs">对话记录</TabsTrigger>
          <TabsTrigger value="config">配置设置</TabsTrigger>
          <TabsTrigger value="capabilities">能力管理</TabsTrigger>
          <TabsTrigger value="knowledge">知识库</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  每日表现统计
                </CardTitle>
                <CardDescription>近7天对话量与成功率</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentDetail.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[75, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="conversations" name="对话数" fill="#3B82F6" />
                    <Line yAxisId="right" type="monotone" dataKey="successRate" name="成功率(%)" stroke="#10B981" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>性能雷达图</CardTitle>
                <CardDescription>多维度性能评估</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="性能"
                      dataKey="value"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.5}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>详细统计</CardTitle>
              <CardDescription>智能体运行的关键指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">总消息数</div>
                  <div className="text-2xl font-bold">{agentDetail.stats.totalMessages}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">平均对话长度</div>
                  <div className="text-2xl font-bold">{agentDetail.stats.avgConversationLength}条</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">平均响应时间</div>
                  <div className="text-2xl font-bold">{agentDetail.stats.avgResponse}s</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">转人工率</div>
                  <div className="text-2xl font-bold">{agentDetail.stats.transferRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dialogs Tab */}
        <TabsContent value="dialogs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>近期对话</CardTitle>
                  <CardDescription>智能体的最近对话记录</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="resolved">已解决</SelectItem>
                      <SelectItem value="unresolved">未解决</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    导出记录
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentDetail.recentDialogs.map((dialog) => (
                  <div key={dialog.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{dialog.user}</Badge>
                        <span className="text-sm text-muted-foreground">{dialog.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dialog.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm">{dialog.rating}</span>
                          </div>
                        )}
                        <Badge variant={dialog.resolved ? 'default' : 'secondary'}>
                          {dialog.resolved ? '已解决' : '待处理'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">用户提问</div>
                        <p className="text-sm">{dialog.question}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="text-xs text-green-600 mb-1">智能体回复</div>
                        <p className="text-sm">{dialog.answer}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button size="sm" variant="ghost">
                        <Copy className="h-4 w-4 mr-1" />
                        复制
                      </Button>
                      <Button size="sm" variant="outline">
                        查看详情
                      </Button>
                      {!dialog.resolved && (
                        <Button size="sm">
                          人工处理
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                模型配置
              </CardTitle>
              <CardDescription>智能体的AI模型参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <span className="text-sm text-muted-foreground">基础模型</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default">{agentDetail.model}</Badge>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <div className="text-xl font-bold mt-1">{agentDetail.temperature}</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">最大Tokens</span>
                    <Badge variant="outline">{agentDetail.maxTokens}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">单次回复的最大长度</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">系统提示词</span>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded mt-2">
                    {agentDetail.systemPrompt}
                  </p>
                </div>
              </div>
              <Button className="w-full mt-6">
                <RefreshCw className="h-4 w-4 mr-2" />
                更新配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capabilities Tab */}
        <TabsContent value="capabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                能力管理
              </CardTitle>
              <CardDescription>智能体的功能能力开关</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentDetail.capabilities.map((cap) => (
                  <div key={cap.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{cap.name}</span>
                        <p className="text-sm text-muted-foreground">{cap.description}</p>
                      </div>
                      <Switch 
                        checked={cap.enabled} 
                        onCheckedChange={(checked) => console.log('切换能力:', cap.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6">
                <Plus className="h-4 w-4 mr-2" />
                添加新能力
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    关联知识库
                  </CardTitle>
                  <CardDescription>智能体使用的知识库</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  添加知识库
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentDetail.knowledgeBases.map((kb) => (
                  <div key={kb.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="font-medium">{kb.name}</span>
                          <div className="text-sm text-muted-foreground">
                            {kb.documents} 个文档 · 更新于 {kb.lastUpdated}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          管理
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          移除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>测试对话</DialogTitle>
            <DialogDescription>与智能体进行对话测试</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
              {testResponse ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">你</div>
                    <p className="text-sm">{testMessage}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="text-xs text-green-600 mb-1">{agentDetail.name}</div>
                    <p className="text-sm">{testResponse}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>输入消息开始测试</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="输入测试消息..." 
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTest()}
              />
              <Button onClick={handleTest}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowTestDialog(false); setTestMessage(''); setTestResponse(''); }}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑智能体配置</DialogTitle>
            <DialogDescription>修改智能体的参数设置</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSaveConfig)} className="space-y-4">
            <div>
              <Label htmlFor="name">名称</Label>
              <Input id="name" {...form.register('name')} />
            </div>
            <div>
              <Label htmlFor="description">描述</Label>
              <Textarea id="description" {...form.register('description')} rows={2} />
            </div>
            <div>
              <Label>基础模型</Label>
              <Select 
                value={form.watch('model')} 
                onValueChange={(v) => form.setValue('model', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Temperature ({form.watch('temperature')})</Label>
              <Controller
                name="temperature"
                control={form.control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                )}
              />
            </div>
            <div>
              <Label>最大Tokens ({form.watch('maxTokens')})</Label>
              <Controller
                name="maxTokens"
                control={form.control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    min={100}
                    max={4000}
                    step={100}
                  />
                )}
              />
            </div>
            <div>
              <Label>系统提示词</Label>
              <Textarea 
                {...form.register('systemPrompt')} 
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConfigDialog(false)}>
                取消
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AgentDetailPage