/**
 * AIAgents - AI 智能体
 * AI Agents Page
 * Features: 智能体列表管理、智能体配置、智能体对话测试、使用统计
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Brain,
  Bot,
  Zap,
  Play,
  Pause,
  Trash2,
  Plus,
  RefreshCw,
  Activity,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Edit,
  Eye,
  Copy,
  Search,
  Star,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for agent creation
const agentCreateSchema = z.object({
  name: z.string().min(1, '智能体名称必填'),
  type: z.enum(['conversation', 'task', 'analysis', 'automation']),
  description: z.string().optional(),
  model: z.string().min(1, '请选择基础模型'),
  role: z.string().min(1, '请选择角色'),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(100).max(4000),
})

type AgentCreateForm = z.infer<typeof agentCreateSchema>

// Mock AI agents
const agents = [
  {
    id: 'agent-1',
    name: '客服助手',
    type: 'conversation',
    status: 'active',
    description: '自动回复客户咨询，处理常见问题',
    capabilities: ['智能问答', '问题分类', '转接人工', '情绪识别'],
    model: 'GPT-4',
    role: '客服专员',
    temperature: 0.7,
    maxTokens: 2000,
    stats: { conversations: 1256, successRate: 85, avgResponse: 2.3, satisfaction: 4.5 },
    color: '#3B82F6',
    createdAt: '2024-01-01',
    lastActive: '刚刚',
  },
  {
    id: 'agent-2',
    name: '销售助手',
    type: 'task',
    status: 'active',
    description: '辅助销售跟进，提供智能建议',
    capabilities: ['跟进提醒', '方案推荐', '商机评估', '报价生成'],
    model: 'GPT-4',
    role: '销售顾问',
    temperature: 0.8,
    maxTokens: 3000,
    stats: { tasksCompleted: 456, successRate: 78, avgTime: 5, satisfaction: 4.2 },
    color: '#10B981',
    createdAt: '2024-01-05',
    lastActive: '5分钟前',
  },
  {
    id: 'agent-3',
    name: '数据分析师',
    type: 'analysis',
    status: 'active',
    description: '自动分析业务数据，生成报告',
    capabilities: ['数据汇总', '趋势分析', '异常预警', '报告生成'],
    model: 'GPT-4',
    role: '数据分析师',
    temperature: 0.5,
    maxTokens: 4000,
    stats: { reports: 128, accuracy: 92, avgTime: 3, satisfaction: 4.7 },
    color: '#8B5CF6',
    createdAt: '2024-01-10',
    lastActive: '10分钟前',
  },
  {
    id: 'agent-4',
    name: '流程机器人',
    type: 'automation',
    status: 'paused',
    description: '执行自动化业务流程',
    capabilities: ['批量处理', '定时任务', '审批流转', '数据同步'],
    model: 'GPT-3.5',
    role: '流程自动化专家',
    temperature: 0.3,
    maxTokens: 1500,
    stats: { tasks: 0, successRate: 0, avgTime: 0, satisfaction: 0 },
    color: '#F59E0B',
    createdAt: '2024-01-15',
    lastActive: '已暂停',
  },
]

// Agent templates
const agentTemplates = [
  { 
    name: '客服智能体', 
    type: 'conversation', 
    capabilities: ['问答', '分类', '转接'], 
    setupTime: '30分钟',
    icon: MessageSquare,
    color: '#3B82F6',
  },
  { 
    name: '销售助手', 
    type: 'task', 
    capabilities: ['跟进', '建议', '评估'], 
    setupTime: '45分钟',
    icon: Target,
    color: '#10B981',
  },
  { 
    name: '数据分析', 
    type: 'analysis', 
    capabilities: ['汇总', '分析', '报告'], 
    setupTime: '60分钟',
    icon: BarChart3,
    color: '#8B5CF6',
  },
  { 
    name: '自动化流程', 
    type: 'automation', 
    capabilities: ['批量', '定时', '审批'], 
    setupTime: '15分钟',
    icon: Zap,
    color: '#F59E0B',
  },
]

// Recent conversations
const recentConversations = [
  { id: '1', agent: '客服助手', agentId: 'agent-1', customer: '科技公司A', topic: '产品咨询', status: '已完成', time: '10分钟前', messages: 8 },
  { id: '2', agent: '销售助手', agentId: 'agent-2', user: '张三', topic: '商机跟进', status: '进行中', time: '5分钟前', messages: 5 },
  { id: '3', agent: '客服助手', agentId: 'agent-1', customer: '金融公司B', topic: '服务问题', status: '已完成', time: '15分钟前', messages: 12 },
  { id: '4', agent: '数据分析师', agentId: 'agent-3', user: '李四', topic: '销售报告', status: '已完成', time: '30分钟前', messages: 3 },
]

// Usage statistics
const usageStats = {
  totalAgents: 4,
  activeAgents: 3,
  totalConversations: 1256,
  avgSuccessRate: 85,
  totalMessages: 8562,
  avgResponseTime: 2.5,
}

// Weekly usage data
const weeklyUsage = [
  { day: '周一', conversations: 180, messages: 1250, avgTime: 2.3 },
  { day: '周二', conversations: 195, messages: 1380, avgTime: 2.5 },
  { day: '周三', conversations: 175, messages: 1200, avgTime: 2.2 },
  { day: '周四', conversations: 210, messages: 1450, avgTime: 2.4 },
  { day: '周五', conversations: 185, messages: 1280, avgTime: 2.1 },
  { day: '周六', conversations: 120, messages: 850, avgTime: 2.8 },
  { day: '周日', conversations: 85, messages: 600, avgTime: 3.0 },
]

// Agent type distribution
const agentTypeDistribution = [
  { name: '对话型', value: 45, color: '#3B82F6' },
  { name: '任务型', value: 30, color: '#10B981' },
  { name: '分析型', value: 15, color: '#8B5CF6' },
  { name: '自动化', value: 10, color: '#F59E0B' },
]

// Capability options
const capabilityOptions = [
  { id: 'qa', name: '智能问答', category: '基础', enabled: true },
  { id: 'classify', name: '问题分类', category: '基础', enabled: true },
  { id: 'transfer', name: '转接人工', category: '基础', enabled: true },
  { id: 'emotion', name: '情绪识别', category: '高级', enabled: false },
  { id: 'multi-turn', name: '多轮对话', category: '高级', enabled: false },
  { id: 'knowledge', name: '知识检索', category: '高级', enabled: false },
  { id: 'voice', name: '语音交互', category: '扩展', enabled: false },
  { id: 'vision', name: '图像识别', category: '扩展', enabled: false },
]

// Model options
const modelOptions = [
  { id: 'gpt-4', name: 'GPT-4', description: '最强大的模型，适合复杂任务' },
  { id: 'gpt-35', name: 'GPT-3.5', description: '平衡性能与成本' },
  { id: 'claude-3', name: 'Claude 3', description: '擅长长文本分析' },
  { id: 'custom', name: '自定义模型', description: '使用自有模型' },
]

// Role options
const roleOptions = [
  { id: 'cs', name: '客服专员', description: '处理客户咨询与服务' },
  { id: 'sales', name: '销售顾问', description: '辅助销售跟进与建议' },
  { id: 'analyst', name: '数据分析师', description: '数据分析与报告生成' },
  { id: 'automation', name: '流程自动化专家', description: '自动化任务执行' },
]

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

export function AIAgentsPage() {
  const [viewType, setViewType] = React.useState('agents')
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [selectedAgent, setSelectedAgent] = React.useState<typeof agents[0] | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  const form = useForm<AgentCreateForm>({
    resolver: zodResolver(agentCreateSchema),
    defaultValues: {
      name: '',
      type: 'conversation',
      description: '',
      model: 'gpt-4',
      role: 'cs',
      temperature: 0.7,
      maxTokens: 2000,
    },
  })

  const onCreateAgent = (data: AgentCreateForm) => {
    console.log('创建智能体:', data)
    setShowCreateDialog(false)
    form.reset()
  }

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI 智能体</h1>
            <p className="text-muted-foreground">创建和管理自定义AI智能体</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                创建智能体
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>创建AI智能体</DialogTitle>
                <DialogDescription>配置智能体的基本信息和能力</DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onCreateAgent)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">智能体名称</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="例如：客服助手"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>智能体类型</Label>
                    <Select 
                      value={form.watch('type')} 
                      onValueChange={(v) => form.setValue('type', v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversation">对话型</SelectItem>
                        <SelectItem value="task">任务型</SelectItem>
                        <SelectItem value="analysis">分析型</SelectItem>
                        <SelectItem value="automation">自动化</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="描述智能体的功能和用途"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>基础模型</Label>
                    <Select 
                      value={form.watch('model')} 
                      onValueChange={(v) => form.setValue('model', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.model && (
                      <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>角色设定</Label>
                    <Select 
                      value={form.watch('role')} 
                      onValueChange={(v) => form.setValue('role', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.role && (
                      <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>能力配置</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {capabilityOptions.map((cap) => (
                      <div key={cap.id} className="flex items-center gap-2 p-2 border rounded">
                        <Checkbox checked={cap.enabled} />
                        <div>
                          <span className="text-sm">{cap.name}</span>
                          <Badge variant="outline" className="ml-1 text-xs">{cap.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>温度参数 ({form.watch('temperature')})</Label>
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
                    <p className="text-xs text-muted-foreground">控制回复的创造性程度</p>
                  </div>
                  <div>
                    <Label>最大Token ({form.watch('maxTokens')})</Label>
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
                    <p className="text-xs text-muted-foreground">单次回复的最大长度</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    创建智能体
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">智能体总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{usageStats.totalAgents}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">活跃智能体</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{usageStats.activeAgents}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">对话总数</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{usageStats.totalConversations}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">成功率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{usageStats.avgSuccessRate}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">平均响应</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">{usageStats.avgResponseTime}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">智能体列表</TabsTrigger>
          <TabsTrigger value="templates">创建模板</TabsTrigger>
          <TabsTrigger value="conversations">对话记录</TabsTrigger>
          <TabsTrigger value="analytics">使用统计</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    我的智能体
                  </CardTitle>
                  <CardDescription>已创建的AI智能体列表</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="搜索智能体..." 
                      className="pl-9 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">运行中</SelectItem>
                      <SelectItem value="paused">已暂停</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: agent.color + '20' }}
                        >
                          <Bot className="h-5 w-5" style={{ color: agent.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{agent.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {agent.type === 'conversation' ? '对话型' : 
                               agent.type === 'task' ? '任务型' : 
                               agent.type === 'analysis' ? '分析型' : '自动化'}
                            </Badge>
                            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                              {agent.status === 'active' ? '运行中' : '已暂停'}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            创建于 {agent.createdAt} · {agent.lastActive}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/ai/agents/${agent.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            详情
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          {agent.status === 'active' ? (
                            <><Pause className="h-4 w-4 mr-1" />暂停</>
                          ) : (
                            <><Play className="h-4 w-4 mr-1" />启动</>
                          )}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {agent.capabilities.map((cap) => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                    {(agent.stats.conversations ?? 0) > 0 && (
                      <div className="grid grid-cols-4 gap-4 text-sm p-3 bg-muted rounded-md">
                        <div>
                          <span className="text-muted-foreground">对话: </span>
                          <span className="font-medium">{agent.stats.conversations}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">成功率: </span>
                          <span className="font-medium text-green-600">{agent.stats.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">响应: </span>
                          <span className="font-medium">{agent.stats.avgResponse}s</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">满意度: </span>
                          <span className="font-medium">{agent.stats.satisfaction}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>智能体模板</CardTitle>
              <CardDescription>预设的智能体创建模板</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {agentTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <div key={template.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: template.color + '20' }}
                          >
                            <Icon className="h-5 w-5" style={{ color: template.color }} />
                          </div>
                          <div>
                            <span className="font-medium">{template.name}</span>
                            <div className="text-xs text-muted-foreground">预计 {template.setupTime} 配置完成</div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {template.type === 'conversation' ? '对话型' : 
                           template.type === 'task' ? '任务型' : 
                           template.type === 'analysis' ? '分析型' : '自动化'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.capabilities.map((cap) => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        使用模板创建
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    对话记录
                  </CardTitle>
                  <CardDescription>智能体的近期对话</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部智能体</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>智能体</TableHead>
                    <TableHead>用户/客户</TableHead>
                    <TableHead>主题</TableHead>
                    <TableHead>消息数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentConversations.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell>
                        <Badge variant="outline">{conv.agent}</Badge>
                      </TableCell>
                      <TableCell>{conv.customer || conv.user}</TableCell>
                      <TableCell>{conv.topic}</TableCell>
                      <TableCell>{conv.messages}</TableCell>
                      <TableCell>
                        <Badge variant={conv.status === '已完成' ? 'default' : 'secondary'}>
                          {conv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{conv.time}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  每日使用统计
                </CardTitle>
                <CardDescription>近7天对话量与消息数</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversations" name="对话数" fill="#3B82F6" />
                    <Bar dataKey="messages" name="消息数" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>智能体类型分布</CardTitle>
                <CardDescription>各类型智能体使用占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={agentTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {agentTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  响应时间趋势
                </CardTitle>
                <CardDescription>近7天平均响应时间变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => `${value}s`} />
                    <Line 
                      type="monotone" 
                      dataKey="avgTime" 
                      name="平均响应时间" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AIAgentsPage