/**
 * PredictiveAI - 预测性 AI
 * Predictive AI Page
 * Features: 预测分析配置、多维度预测模型、预测结果可视化、趋势分析
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
  ComposedChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  RefreshCw,
  Download,
  Zap,
  Sparkles,
  LineChart as LineChartIcon,
  Activity,
  Settings,
  Save,
  Play,
  Pause,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Shield,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for prediction config
const predictionConfigSchema = z.object({
  predictionHorizon: z.number().min(1).max(12),
  confidenceInterval: z.number().min(80).max(99),
  includeExternalFactors: z.boolean(),
  enableAutoRefresh: z.boolean(),
  refreshInterval: z.number().min(1).max(24),
})

type PredictionConfigForm = z.infer<typeof predictionConfigSchema>

// Mock prediction data
const salesPredictions = [
  { period: '本月', predicted: 9200000, lower: 8500000, upper: 10000000, actual: 8500000, confidence: 92 },
  { period: '下月', predicted: 10500000, lower: 9500000, upper: 11500000, actual: 0, confidence: 85 },
  { period: '第三月', predicted: 11800000, lower: 10000000, upper: 13600000, actual: 0, confidence: 78 },
  { period: '第四月', predicted: 12500000, lower: 10500000, upper: 14500000, actual: 0, confidence: 72 },
  { period: '第五月', predicted: 13200000, lower: 11000000, upper: 15400000, actual: 0, confidence: 68 },
  { period: '第六月', predicted: 14500000, lower: 12000000, upper: 17000000, actual: 0, confidence: 65 },
]

const customerPredictions = [
  { category: '新客户获取', predicted: 68, current: 52, trend: 'up', confidence: 88, color: '#3B82F6' },
  { category: '客户流失', predicted: 23, current: 28, trend: 'down', confidence: 82, color: '#EF4444' },
  { category: '续约率', predicted: '85%', current: '82%', trend: 'up', confidence: 91, color: '#10B981' },
  { category: '增购潜力', predicted: 156, current: 120, trend: 'up', confidence: 75, color: '#F59E0B' },
  { category: '活跃度', predicted: '72%', current: '68%', trend: 'up', confidence: 86, color: '#8B5CF6' },
]

const marketTrends = [
  { month: '1月', industryGrowth: 8, competition: 65, demandIndex: 72 },
  { month: '2月', industryGrowth: 10, competition: 68, demandIndex: 75 },
  { month: '3月', industryGrowth: 12, competition: 70, demandIndex: 78 },
  { month: '4月', industryGrowth: 11, competition: 72, demandIndex: 80 },
  { month: '5月', industryGrowth: 13, competition: 75, demandIndex: 82 },
  { month: '6月', industryGrowth: 15, competition: 78, demandIndex: 85 },
]

const modelPerformance = [
  { model: '销售预测模型', accuracy: 89.5, precision: 85.2, recall: 91.3, status: 'active', lastTrained: '2天前', predictions: 1256 },
  { model: '客户流失模型', accuracy: 85.2, precision: 82.1, recall: 88.5, status: 'active', lastTrained: '3天前', predictions: 892 },
  { model: '商机转化模型', accuracy: 91.3, precision: 88.7, recall: 93.1, status: 'active', lastTrained: '1天前', predictions: 1567 },
  { model: '市场趋势模型', accuracy: 78.6, precision: 75.4, recall: 80.2, status: 'training', lastTrained: '7天前', predictions: 456 },
  { model: '需求预测模型', accuracy: 82.3, precision: 79.8, recall: 84.5, status: 'active', lastTrained: '5天前', predictions: 678 },
]

const aiInsights = [
  { 
    type: 'success', 
    title: '销售增长机会',
    message: '预测本月将超额完成目标8%，建议加大投入', 
    confidence: 92,
    impact: 'high',
    category: 'sales',
  },
  { 
    type: 'warning', 
    title: '市场波动预警',
    message: '下月市场可能出现波动，建议提前准备', 
    confidence: 75,
    impact: 'medium',
    category: 'market',
  },
  { 
    type: 'insight', 
    title: '客户特征发现',
    message: '发现高价值客户群特征，可用于精准营销', 
    confidence: 88,
    impact: 'high',
    category: 'customer',
  },
  { 
    type: 'action', 
    title: '流失挽回建议',
    message: '建议对23家流失预警客户立即采取挽回措施', 
    confidence: 85,
    impact: 'high',
    category: 'churn',
  },
  { 
    type: 'trend', 
    title: '行业趋势分析',
    message: '行业增长率预计达15%，可适当扩大市场投入', 
    confidence: 82,
    impact: 'medium',
    category: 'market',
  },
]

const predictionFactors = [
  { factor: '历史数据', weight: 30, accuracy: 92, status: 'active' },
  { factor: '季节因素', weight: 20, accuracy: 85, status: 'active' },
  { factor: '市场趋势', weight: 15, accuracy: 78, status: 'active' },
  { factor: '竞争对手', weight: 15, accuracy: 72, status: 'active' },
  { factor: '经济环境', weight: 10, accuracy: 68, status: 'inactive' },
  { factor: '政策影响', weight: 10, accuracy: 65, status: 'inactive' },
]

const historicalAccuracy = [
  { month: '1月', sales: 85, churn: 82, conversion: 88, market: 75 },
  { month: '2月', sales: 88, churn: 84, conversion: 90, market: 78 },
  { month: '3月', sales: 87, churn: 83, conversion: 89, market: 76 },
  { month: '4月', sales: 90, churn: 85, conversion: 91, market: 80 },
  { month: '5月', sales: 92, churn: 87, conversion: 93, market: 82 },
  { month: '6月', sales: 91, churn: 85, conversion: 92, market: 81 },
]

const predictionScenarios = [
  { scenario: '乐观', sales: 10500000, customers: 75, churn: 18 },
  { scenario: '基准', sales: 9200000, customers: 68, churn: 23 },
  { scenario: '悲观', sales: 8000000, customers: 55, churn: 35 },
]

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

export function PredictiveAIPage() {
  const [timeRange, setTimeRange] = React.useState('month')
  const [viewType, setViewType] = React.useState('predictions')
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)

  const form = useForm<PredictionConfigForm>({
    resolver: zodResolver(predictionConfigSchema),
    defaultValues: {
      predictionHorizon: 6,
      confidenceInterval: 85,
      includeExternalFactors: true,
      enableAutoRefresh: true,
      refreshInterval: 6,
    },
  })

  const onSubmitConfig = (data: PredictionConfigForm) => {
    console.log('更新预测配置:', data)
    setShowConfigDialog(false)
  }

  const avgAccuracy = modelPerformance.reduce((sum, m) => sum + m.accuracy, 0) / modelPerformance.length
  const activeModels = modelPerformance.filter(m => m.status === 'active').length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">预测性 AI</h1>
            <p className="text-muted-foreground">多维度预测分析与智能洞察</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="选择周期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出预测报告
          </Button>
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                预测配置
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>预测分析配置</DialogTitle>
                <DialogDescription>调整预测模型的参数设置</DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitConfig)} className="space-y-6">
                <div>
                  <Label>预测周期 ({form.watch('predictionHorizon')}个月)</Label>
                  <Controller
                    name="predictionHorizon"
                    control={form.control}
                    render={({ field }) => (
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        min={1}
                        max={12}
                        step={1}
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">预测未来的时间范围</p>
                </div>
                <div>
                  <Label>置信区间 ({form.watch('confidenceInterval')}%)</Label>
                  <Controller
                    name="confidenceInterval"
                    control={form.control}
                    render={({ field }) => (
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        min={80}
                        max={99}
                        step={1}
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">预测结果的置信度阈值</p>
                </div>
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">包含外部因素</span>
                      <p className="text-sm text-muted-foreground">考虑市场、经济等外部数据</p>
                    </div>
                    <Controller
                      name="includeExternalFactors"
                      control={form.control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">自动刷新</span>
                      <p className="text-sm text-muted-foreground">定期更新预测结果</p>
                    </div>
                    <Controller
                      name="enableAutoRefresh"
                      control={form.control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Label>刷新间隔 ({form.watch('refreshInterval')}小时)</Label>
                  <Controller
                    name="refreshInterval"
                    control={form.control}
                    render={({ field }) => (
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        min={1}
                        max={24}
                        step={1}
                      />
                    )}
                  />
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

      {/* Model Performance */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">平均准确率</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{avgAccuracy.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">持续提升</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">预测项目</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{modelPerformance.reduce((s, m) => s + m.predictions, 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">总预测次数</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">AI洞察</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{aiInsights.length}</div>
            <div className="text-xs text-muted-foreground mt-1">待处理洞察</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">活跃模型</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{activeModels}</div>
            <div className="text-xs text-muted-foreground mt-1">共 {modelPerformance.length} 个模型</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">预测周期</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">6个月</div>
            <div className="text-xs text-muted-foreground mt-1">最长预测范围</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictions">预测结果</TabsTrigger>
          <TabsTrigger value="models">模型状态</TabsTrigger>
          <TabsTrigger value="insights">AI洞察</TabsTrigger>
          <TabsTrigger value="scenarios">情景分析</TabsTrigger>
          <TabsTrigger value="history">历史准确率</TabsTrigger>
        </TabsList>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Sales Prediction */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  销售预测
                </CardTitle>
                <CardDescription>未来6个月销售金额预测</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={salesPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                    <Tooltip formatter={(value) => `¥${(Number(value) / 10000).toFixed(0)}万`} />
                    <Legend />
                    <Area type="monotone" dataKey="upper" name="上限" fill="#10B981" fillOpacity={0.1} stroke="none" />
                    <Area type="monotone" dataKey="lower" name="下限" fill="#3B82F6" fillOpacity={0.1} stroke="none" />
                    <Bar dataKey="actual" name="实际" fill="#3B82F6" barSize={20} />
                    <Line type="monotone" dataKey="predicted" name="预测" stroke="#10B981" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {salesPredictions.slice(0, 3).map((item) => (
                    <div key={item.period} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.period}</Badge>
                        <Badge variant={item.confidence >= 85 ? 'default' : 'secondary'}>
                          {item.confidence}%
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ¥{(item.predicted / 10000).toFixed(0)}万
                      </div>
                      <div className="text-xs text-muted-foreground">
                        区间: {((item.lower) / 10000).toFixed(0)}-{((item.upper) / 10000).toFixed(0)}万
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  客户预测
                </CardTitle>
                <CardDescription>客户相关的预测指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerPredictions.map((item) => (
                    <div key={item.category} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          {item.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <Badge variant="outline">{item.confidence}%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">预测: </span>
                          <span className="text-xl font-bold">{item.predicted}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">当前: </span>
                          <span className="font-medium">{item.current}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full"
                          style={{ width: `${item.confidence}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  市场趋势预测
                </CardTitle>
                <CardDescription>市场环境指标变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="industryGrowth" name="行业增长率(%)" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="competition" name="竞争指数" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="demandIndex" name="需求指数" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    预测模型状态
                  </CardTitle>
                  <CardDescription>各预测模型运行情况与性能指标</CardDescription>
                </div>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重新训练全部
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelPerformance.map((model) => (
                  <div key={model.model} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{model.model}</span>
                        <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                          {model.status === 'active' ? '运行中' : '训练中'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                        {model.status === 'active' ? (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-1" />
                            暂停
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Activity className="h-4 w-4 mr-1" />
                            查看进度
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">准确率: </span>
                        <span className="font-medium text-green-600">{model.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">精确度: </span>
                        <span className="font-medium">{model.precision}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">召回率: </span>
                        <span className="font-medium">{model.recall}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">上次训练: </span>
                        <span className="font-medium">{model.lastTrained}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">预测次数: </span>
                        <span className="font-medium">{model.predictions}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${model.accuracy >= 85 ? 'bg-green-500' : model.accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prediction Factors */}
          <Card>
            <CardHeader>
              <CardTitle>预测因子配置</CardTitle>
              <CardDescription>影响预测结果的关键因素</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {predictionFactors.map((item) => (
                  <div key={item.factor} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={item.status === 'active'} />
                        <span className="font-medium">{item.factor}</span>
                      </div>
                      <Badge variant="outline">{item.weight}%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">准确度</span>
                      <span className={`font-medium ${item.accuracy >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                        {item.accuracy}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'}`}
                        style={{ width: `${item.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                <Settings className="h-4 w-4 mr-2" />
                配置因子权重
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI 智能洞察
              </CardTitle>
              <CardDescription>基于预测结果的建议与洞察</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'success' ? 'border-green-200 bg-green-50' :
                      insight.type === 'warning' ? 'border-orange-200 bg-orange-50' :
                      insight.type === 'action' ? 'border-blue-200 bg-blue-50' :
                      insight.type === 'trend' ? 'border-purple-200 bg-purple-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {insight.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : insight.type === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        ) : insight.type === 'action' ? (
                          <Target className="h-5 w-5 text-blue-600" />
                        ) : insight.type === 'trend' ? (
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{insight.title}</span>
                            <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                              {insight.impact === 'high' ? '高影响' : '中影响'}
                            </Badge>
                          </div>
                          <p className="text-sm">{insight.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              置信度 {insight.confidence}%
                            </Badge>
                            <Badge variant="outline">
                              {insight.category === 'sales' ? '销售' : 
                               insight.category === 'customer' ? '客户' : 
                               insight.category === 'churn' ? '流失' : '市场'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                情景分析
              </CardTitle>
              <CardDescription>不同情景下的预测结果对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {predictionScenarios.map((scenario) => (
                  <div 
                    key={scenario.scenario}
                    className={`p-4 border rounded-lg ${
                      scenario.scenario === '乐观' ? 'border-green-200 bg-green-50' :
                      scenario.scenario === '基准' ? 'border-blue-200 bg-blue-50' :
                      'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={scenario.scenario === '乐观' ? 'default' : scenario.scenario === '基准' ? 'secondary' : 'destructive'}
                        className={scenario.scenario === '乐观' ? 'bg-green-500' : scenario.scenario === '基准' ? 'bg-blue-500' : ''}>
                        {scenario.scenario}情景
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">销售预测</span>
                        <div className="text-xl font-bold">¥{(scenario.sales / 10000).toFixed(0)}万</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">新客户数</span>
                        <div className="text-xl font-bold">{scenario.customers}家</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">流失客户</span>
                        <div className="text-xl font-bold">{scenario.churn}家</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      查看详情
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                历史准确率趋势
              </CardTitle>
              <CardDescription>各模型预测准确率变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={85} stroke="#F59E0B" strokeDasharray="3 3" label="目标线" />
                  <Line type="monotone" dataKey="sales" name="销售预测" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="churn" name="流失预测" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversion" name="转化预测" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="market" name="市场预测" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {['销售', '流失', '转化', '市场'].map((name, idx) => {
                  const data = historicalAccuracy[historicalAccuracy.length - 1]
                  const keys = ['sales', 'churn', 'conversion', 'market'] as const
                  const accuracy = data[keys[idx]]
                  return (
                    <div key={name} className="p-3 border rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">{name}预测准确率</div>
                      <div className={`text-xl font-bold ${accuracy >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                        {accuracy}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PredictiveAIPage