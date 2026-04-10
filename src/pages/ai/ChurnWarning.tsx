/**
 * ChurnWarning - 客户流失预警
 * Customer Churn Warning Page
 * Features: 流失风险模型、风险等级划分、高风险客户列表、挽留策略建议、流失趋势图表
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from 'recharts'
import {
  Brain,
  AlertTriangle,
  AlertCircle,
  Clock,
  Users,
  TrendingDown,
  RefreshCw,
  Download,
  Shield,
  Zap,
  CheckCircle,
  Phone,
  Mail,
  Gift,
  Settings,
  Save,
  ArrowRight,
  Eye,
  Filter,
  Heart,
  Timer,
  BarChart3,
  Target,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for churn model config
const churnModelConfigSchema = z.object({
  riskThreshold: z.number().min(0).max(100),
  warningLevel: z.enum(['low', 'medium', 'high']),
  autoAlert: z.boolean(),
  preventionEnabled: z.boolean(),
})

type ChurnModelConfigForm = z.infer<typeof churnModelConfigSchema>

// Schema for retention strategy
const retentionStrategySchema = z.object({
  strategyName: z.string().min(1, '策略名称必填'),
  strategyType: z.enum(['call', 'email', 'gift', 'upgrade', 'custom']),
  targetSegment: z.string().min(1),
  description: z.string().optional(),
})

type RetentionStrategyForm = z.infer<typeof retentionStrategySchema>

// Mock churn warnings with detailed data
const churnWarnings = [
  {
    id: '1',
    customer: '科技公司X',
    customerId: 'C001',
    riskLevel: '高',
    score: 85,
    factors: ['活跃度下降45%', '投诉增加3次', '竞品接触记录'],
    lastContact: '15天前',
    contractValue: 250000,
    contractEndDate: '2024-03-15',
    suggestion: '立即安排客户经理回访',
    assignedTo: '张三',
    status: 'pending',
  },
  {
    id: '2',
    customer: '金融公司Y',
    customerId: 'C002',
    riskLevel: '高',
    score: 78,
    factors: ['消费减少30%', '续约犹豫', '服务满意度下降'],
    lastContact: '10天前',
    contractValue: 180000,
    contractEndDate: '2024-02-28',
    suggestion: '提供优惠方案挽回',
    assignedTo: '李四',
    status: 'pending',
  },
  {
    id: '3',
    customer: '教育机构Z',
    customerId: 'C003',
    riskLevel: '中',
    score: 65,
    factors: ['活跃度下降20%', '响应延迟', '预算调整'],
    lastContact: '7天前',
    contractValue: 95000,
    contractEndDate: '2024-06-30',
    suggestion: '增加互动频率',
    assignedTo: '王五',
    status: 'processing',
  },
  {
    id: '4',
    customer: '制造业W',
    customerId: 'C004',
    riskLevel: '中',
    score: 52,
    factors: ['预算调整', '需求变化', '新管理层'],
    lastContact: '5天前',
    contractValue: 120000,
    contractEndDate: '2024-04-15',
    suggestion: '重新评估需求',
    assignedTo: '赵六',
    status: 'processing',
  },
  {
    id: '5',
    customer: '零售企业V',
    customerId: 'C005',
    riskLevel: '低',
    score: 35,
    factors: ['季节性波动', '市场调整'],
    lastContact: '3天前',
    contractValue: 45000,
    contractEndDate: '2024-12-31',
    suggestion: '正常跟进',
    assignedTo: '钱七',
    status: 'monitoring',
  },
]

// Churn factors with weights
const churnFactors = [
  { factor: '活跃度下降', weight: 30, avgDays: 14, threshold: 30, description: '最近互动频率显著降低' },
  { factor: '消费减少', weight: 25, avgDays: 30, threshold: 20, description: '采购金额持续下降' },
  { factor: '投诉增加', weight: 20, avgDays: 7, threshold: 2, description: '近期投诉次数上升' },
  { factor: '竞品接触', weight: 15, avgDays: 0, threshold: 1, description: '有接触竞争对手迹象' },
  { factor: '续约犹豫', weight: 10, avgDays: 90, threshold: 60, description: '合同到期前无续约意向' },
]

// Prevention actions with stats
const preventionActions = [
  { action: '客户回访', type: 'call', successRate: 45, count: 156, avgCost: 500, avgTime: 3 },
  { action: '优惠方案', type: 'gift', successRate: 35, count: 89, avgCost: 2000, avgTime: 7 },
  { action: '服务升级', type: 'upgrade', successRate: 55, count: 67, avgCost: 3000, avgTime: 14 },
  { action: '需求重评', type: 'custom', successRate: 40, count: 45, avgCost: 800, avgTime: 5 },
  { action: '邮件关怀', type: 'email', successRate: 20, count: 234, avgCost: 50, avgTime: 1 },
]

// Monthly churn trend
const churnTrend = [
  { month: '1月', newChurn: 8, prevented: 12, rate: 2.5 },
  { month: '2月', newChurn: 5, prevented: 15, rate: 2.1 },
  { month: '3月', newChurn: 7, prevented: 18, rate: 2.3 },
  { month: '4月', newChurn: 4, prevented: 22, rate: 1.8 },
  { month: '5月', newChurn: 3, prevented: 25, rate: 1.5 },
  { month: '6月', newChurn: 6, prevented: 28, rate: 1.9 },
]

// Risk level distribution
const riskDistribution = [
  { level: '高风险', count: 12, color: '#EF4444', value: 12 },
  { level: '中风险', count: 25, color: '#F59E0B', value: 25 },
  { level: '低风险', count: 56, color: '#10B981', value: 56 },
  { level: '正常', count: 463, color: '#3B82F6', value: 463 },
]

// Factor radar data for a customer
const factorRadarData = [
  { factor: '活跃度', value: 30, fullMark: 100 },
  { factor: '消费', value: 25, fullMark: 100 },
  { factor: '投诉', value: 20, fullMark: 100 },
  { factor: '竞品', value: 15, fullMark: 100 },
  { factor: '续约', value: 10, fullMark: 100 },
]

// Retention success by strategy
const retentionSuccess = [
  { strategy: '电话回访', success: 45, fail: 55 },
  { strategy: '优惠折扣', success: 35, fail: 65 },
  { strategy: '服务升级', success: 55, fail: 45 },
  { strategy: '需求重评', success: 40, fail: 60 },
  { strategy: '邮件关怀', success: 20, fail: 80 },
]

const stats = {
  totalWarnings: 23,
  highRisk: 12,
  mediumRisk: 25,
  lowRisk: 56,
  prevented: 156,
  preventionRate: 68,
  atRiskValue: 455000,
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6']

export function ChurnWarningPage() {
  const [viewType, setViewType] = React.useState('warnings')
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)
  const [showStrategyDialog, setShowStrategyDialog] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<typeof churnWarnings[0] | null>(null)

  const configForm = useForm<ChurnModelConfigForm>({
    resolver: zodResolver(churnModelConfigSchema),
    defaultValues: {
      riskThreshold: 50,
      warningLevel: 'medium',
      autoAlert: true,
      preventionEnabled: true,
    },
  })

  const strategyForm = useForm<RetentionStrategyForm>({
    resolver: zodResolver(retentionStrategySchema),
    defaultValues: {
      strategyName: '',
      strategyType: 'call',
      targetSegment: '',
      description: '',
    },
  })

  const onSubmitConfig = (data: ChurnModelConfigForm) => {
    console.log('更新流失模型配置:', data)
    setShowConfigDialog(false)
  }

  const onSubmitStrategy = (data: RetentionStrategyForm) => {
    console.log('创建挽留策略:', data)
    setShowStrategyDialog(false)
    strategyForm.reset()
  }

  const riskColors = {
    '高': 'bg-red-500',
    '中': 'bg-orange-500',
    '低': 'bg-green-500',
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">客户流失预警</h1>
            <p className="text-muted-foreground">AI识别潜在流失客户并提供挽回建议</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出预警报告
          </Button>
          <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
            <DialogTrigger asChild>
              <Button>
                <Heart className="h-4 w-4 mr-2" />
                创建挽留策略
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>创建挽留策略</DialogTitle>
                <DialogDescription>为高风险客户制定挽留方案</DialogDescription>
              </DialogHeader>
              <form onSubmit={strategyForm.handleSubmit(onSubmitStrategy)} className="space-y-4">
                <div>
                  <Label htmlFor="strategyName">策略名称</Label>
                  <Input
                    id="strategyName"
                    {...strategyForm.register('strategyName')}
                    placeholder="例如：VIP客户挽回计划"
                  />
                  {strategyForm.formState.errors.strategyName && (
                    <p className="text-sm text-red-500">{strategyForm.formState.errors.strategyName.message}</p>
                  )}
                </div>
                <div>
                  <Label>策略类型</Label>
                  <Select 
                    value={strategyForm.watch('strategyType')} 
                    onValueChange={(v) => strategyForm.setValue('strategyType', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">电话回访</SelectItem>
                      <SelectItem value="email">邮件关怀</SelectItem>
                      <SelectItem value="gift">优惠折扣</SelectItem>
                      <SelectItem value="upgrade">服务升级</SelectItem>
                      <SelectItem value="custom">自定义方案</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetSegment">目标客户群</Label>
                  <Select 
                    value={strategyForm.watch('targetSegment')} 
                    onValueChange={(v) => strategyForm.setValue('targetSegment', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择目标客户群" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高风险客户 (12家)</SelectItem>
                      <SelectItem value="medium">中风险客户 (25家)</SelectItem>
                      <SelectItem value="expiring">即将到期客户 (8家)</SelectItem>
                      <SelectItem value="inactive">低活跃客户 (56家)</SelectItem>
                    </SelectContent>
                  </Select>
                  {strategyForm.formState.errors.targetSegment && (
                    <p className="text-sm text-red-500">{strategyForm.formState.errors.targetSegment.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">策略描述</Label>
                  <Textarea
                    id="description"
                    {...strategyForm.register('description')}
                    placeholder="描述具体挽留措施"
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowStrategyDialog(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    创建策略
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                模型配置
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>流失预警模型配置</DialogTitle>
                <DialogDescription>调整预警模型的参数设置</DialogDescription>
              </DialogHeader>
              <form onSubmit={configForm.handleSubmit(onSubmitConfig)} className="space-y-4">
                <div>
                  <Label>风险阈值 ({configForm.watch('riskThreshold')}分)</Label>
                  <Controller
                    name="riskThreshold"
                    control={configForm.control}
                    render={({ field }) => (
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        min={0}
                        max={100}
                        step={5}
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">超过此分数触发预警</p>
                </div>
                <div>
                  <Label>默认预警级别</Label>
                  <Select 
                    value={configForm.watch('warningLevel')} 
                    onValueChange={(v) => configForm.setValue('warningLevel', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低 - 仅记录</SelectItem>
                      <SelectItem value="medium">中 - 发送通知</SelectItem>
                      <SelectItem value="high">高 - 自动创建任务</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">自动预警</span>
                      <p className="text-sm text-muted-foreground">高风险客户自动发送提醒</p>
                    </div>
                    <Controller
                      name="autoAlert"
                      control={configForm.control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">自动挽留</span>
                      <p className="text-sm text-muted-foreground">触发预设挽留策略</p>
                    </div>
                    <Controller
                      name="preventionEnabled"
                      control={configForm.control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowConfigDialog(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    保存配置
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">预警总数</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.totalWarnings}</div>
            <div className="text-xs text-muted-foreground mt-1">需关注客户</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">高风险客户</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.highRisk}</div>
            <div className="text-xs text-muted-foreground mt-1">需立即行动</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">成功挽回</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.prevented}</div>
            <div className="text-xs text-muted-foreground mt-1">本月挽回数</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">挽回率</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.preventionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">挽留成功率</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">风险金额</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">¥{(stats.atRiskValue / 10000).toFixed(0)}万</div>
            <div className="text-xs text-muted-foreground mt-1">潜在损失</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="warnings">流失预警</TabsTrigger>
          <TabsTrigger value="factors">预警因子</TabsTrigger>
          <TabsTrigger value="actions">挽回措施</TabsTrigger>
          <TabsTrigger value="trend">流失趋势</TabsTrigger>
          <TabsTrigger value="analysis">效果分析</TabsTrigger>
        </TabsList>

        {/* Warnings Tab */}
        <TabsContent value="warnings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  潜在流失客户
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部风险</SelectItem>
                      <SelectItem value="high">高风险</SelectItem>
                      <SelectItem value="medium">中风险</SelectItem>
                      <SelectItem value="low">低风险</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>AI识别的流失风险客户列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnWarnings.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCustomer?.id === item.id ? 'bg-blue-50 border-blue-300' :
                      item.riskLevel === '高' ? 'border-red-200 bg-red-50 hover:bg-red-100' :
                      item.riskLevel === '中' ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' :
                      'border-green-200 bg-green-50 hover:bg-green-100'
                    }`}
                    onClick={() => setSelectedCustomer(item)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={riskColors[item.riskLevel as keyof typeof riskColors]}>
                          {item.riskLevel}风险
                        </Badge>
                        <span className="font-medium">{item.customer}</span>
                        <span className="text-sm text-muted-foreground">评分: {item.score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === 'pending' ? 'destructive' : item.status === 'processing' ? 'default' : 'secondary'}>
                          {item.status === 'pending' ? '待处理' : item.status === 'processing' ? '处理中' : '监控中'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.factors.map((factor) => (
                        <Badge key={factor} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">合同金额: </span>
                        <span className="font-medium">¥{(item.contractValue / 1000).toFixed(0)}k</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">到期时间: </span>
                        <span className="font-medium">{item.contractEndDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">负责人: </span>
                        <span className="font-medium">{item.assignedTo}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">最近联系: </span>
                        <span className="font-medium">{item.lastContact}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">{item.suggestion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                        <Button size="sm">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          立即跟进
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Factors Tab */}
        <TabsContent value="factors" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  预警因子分析
                </CardTitle>
                <CardDescription>导致客户流失的关键因素</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {churnFactors.map((item) => (
                    <div key={item.factor} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={true} />
                          <span className="font-medium">{item.factor}</span>
                        </div>
                        <Badge variant="outline">{item.weight}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">权重: </span>
                          <span className="font-medium">{item.weight}%</span>
                        </div>
                        {item.avgDays > 0 && (
                          <div>
                            <span className="text-muted-foreground">预警周期: </span>
                            <span className="font-medium">{item.avgDays}天</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">阈值: </span>
                          <span className="font-medium">{item.threshold}</span>
                        </div>
                      </div>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${item.weight}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  配置预警因子
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>因子权重雷达图</CardTitle>
                <CardDescription>各预警因子的权重分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={factorRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="权重"
                      dataKey="value"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.5}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                挽回措施效果
              </CardTitle>
              <CardDescription>各类挽回措施的成功率与成本统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preventionActions.map((item) => (
                  <div key={item.action} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {item.type === 'call' && <Phone className="h-5 w-5 text-blue-600" />}
                        {item.type === 'email' && <Mail className="h-5 w-5 text-green-600" />}
                        {item.type === 'gift' && <Gift className="h-5 w-5 text-orange-600" />}
                        {item.type === 'upgrade' && <Zap className="h-5 w-5 text-purple-600" />}
                        {item.type === 'custom' && <Settings className="h-5 w-5 text-gray-600" />}
                        <span className="font-medium">{item.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.successRate >= 45 ? 'default' : 'secondary'}
                          className={item.successRate >= 45 ? 'bg-green-500' : ''}>
                          {item.successRate}% 成功
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.count}次</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">平均成本: </span>
                        <span className="font-medium">¥{item.avgCost}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">平均周期: </span>
                        <span className="font-medium">{item.avgTime}天</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">执行次数: </span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.successRate >= 45 ? 'bg-green-500' : item.successRate >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.successRate}%` }}
                      />
                    </div>
                    <Button size="sm" className="w-full mt-3" variant="outline">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      执行此策略
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                <Zap className="h-4 w-4 mr-2" />
                自动执行挽回策略
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Tab */}
        <TabsContent value="trend" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  月度流失趋势
                </CardTitle>
                <CardDescription>新增流失与挽回数量对比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={churnTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="newChurn" name="新增流失" stroke="#EF4444" fill="#EF4444" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="prevented" name="成功挽回" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  流失率趋势
                </CardTitle>
                <CardDescription>月度客户流失率变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={churnTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <ReferenceLine y={2} stroke="#F59E0B" strokeDasharray="3 3" label="目标线" />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="流失率" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      流失率持续下降，本月较上月降低 0.4%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>风险等级分布</CardTitle>
                <CardDescription>当前客户风险等级占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>挽回成功率对比</CardTitle>
                <CardDescription>各策略挽回成功率分析</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={retentionSuccess} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="strategy" type="category" width={80} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="success" name="成功" fill="#10B981" />
                    <Bar dataKey="fail" name="失败" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                挽留效果分析
              </CardTitle>
              <CardDescription>挽留策略的效果评估与ROI计算</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>策略类型</TableHead>
                    <TableHead>执行次数</TableHead>
                    <TableHead>成功率</TableHead>
                    <TableHead>平均成本</TableHead>
                    <TableHead>挽回金额</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preventionActions.map((item) => {
                    const savedValue = item.count * item.successRate / 100 * stats.atRiskValue / stats.totalWarnings
                    const roi = ((savedValue - item.avgCost * item.count) / (item.avgCost * item.count) * 100).toFixed(0)
                    return (
                      <TableRow key={item.action}>
                        <TableCell className="font-medium">{item.action}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>
                          <Badge variant={item.successRate >= 45 ? 'default' : 'secondary'}
                            className={item.successRate >= 45 ? 'bg-green-500' : ''}>
                            {item.successRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>¥{item.avgCost}</TableCell>
                        <TableCell>¥{(savedValue / 10000).toFixed(1)}万</TableCell>
                        <TableCell>
                          <Badge variant={Number(roi) >= 100 ? 'default' : 'secondary'}
                            className={Number(roi) >= 100 ? 'bg-green-500' : ''}>
                            {roi}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">总挽回金额</span>
                    <div className="text-2xl font-bold text-green-600">¥285万</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">总投入成本</span>
                    <div className="text-2xl font-bold">¥{preventionActions.reduce((s, i) => s + i.avgCost * i.count, 0).toFixed(0)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">平均ROI</span>
                    <div className="text-2xl font-bold text-green-600">185%</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">推荐策略</span>
                    <div className="text-lg font-bold text-purple-600">服务升级</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import DollarSign at top
import { DollarSign } from 'lucide-react'
import { ReferenceLine } from 'recharts'

export default ChurnWarningPage