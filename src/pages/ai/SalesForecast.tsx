/**
 * SalesForecast - 销售预测 AI
 * Sales Forecast AI Page
 * Features: 预测模型配置、时间范围选择、预测vs实际对比图表、准确性分析
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
  ComposedChart,
  Area,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  Settings,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Save,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for forecast config
const forecastConfigSchema = z.object({
  confidenceLevel: z.number().min(50).max(99),
  forecastHorizon: z.enum(['week', 'month', 'quarter', 'year']),
  includeSeasonality: z.boolean(),
  smoothingFactor: z.number().min(0).max(1),
})

type ForecastConfigForm = z.infer<typeof forecastConfigSchema>

// Mock forecast data
const monthlyForecast = [
  { month: '1月', actual: 7200000, forecast: 7500000, lower: 6800000, upper: 8200000, confidence: 92 },
  { month: '2月', actual: 8500000, forecast: 8200000, lower: 7500000, upper: 8900000, confidence: 88 },
  { month: '3月', actual: 9200000, forecast: 9000000, lower: 8200000, upper: 9800000, confidence: 85 },
  { month: '4月', actual: 0, forecast: 9500000, lower: 8500000, upper: 10500000, confidence: 82 },
  { month: '5月', actual: 0, forecast: 10800000, lower: 9500000, upper: 12100000, confidence: 78 },
  { month: '6月', actual: 0, forecast: 11500000, lower: 10000000, upper: 13000000, confidence: 75 },
]

const pipelineForecast = [
  { stage: '线索', count: 450, value: 22500000, probability: 10, weighted: 2250000, velocity: 30 },
  { stage: '商机', count: 200, value: 40000000, probability: 30, weighted: 12000000, velocity: 45 },
  { stage: '方案', count: 80, value: 16000000, probability: 50, weighted: 8000000, velocity: 20 },
  { stage: '谈判', count: 35, value: 8750000, probability: 70, weighted: 6125000, velocity: 15 },
  { stage: '即将成交', count: 15, value: 3750000, probability: 90, weighted: 3375000, velocity: 7 },
]

const teamForecast = [
  { team: '华东区', forecast: 38000000, actual: 32000000, gap: -6000000, achievement: 84, trend: 'up', color: '#3B82F6' },
  { team: '华南区', forecast: 29000000, actual: 25000000, gap: -4000000, achievement: 86, trend: 'up', color: '#10B981' },
  { team: '华北区', forecast: 22000000, actual: 18000000, gap: -4000000, achievement: 82, trend: 'down', color: '#F59E0B' },
  { team: '西南区', forecast: 13000000, actual: 10000000, gap: -3000000, achievement: 77, trend: 'up', color: '#EF4444' },
]

const productForecast = [
  { product: '基础版', forecast: 15000000, actual: 12000000, share: 25 },
  { product: '专业版', forecast: 28000000, actual: 23000000, share: 35 },
  { product: '企业版', forecast: 42000000, actual: 35000000, share: 40 },
]

const accuracyHistory = [
  { month: '1月', accuracy: 85, error: 15 },
  { month: '2月', accuracy: 88, error: 12 },
  { month: '3月', accuracy: 87, error: 13 },
  { month: '4月', accuracy: 90, error: 10 },
  { month: '5月', accuracy: 92, error: 8 },
  { month: '6月', accuracy: 91, error: 9 },
]

const forecastFactors = [
  { factor: '历史趋势', weight: 30, accuracy: 92 },
  { factor: '漏斗分析', weight: 25, accuracy: 88 },
  { factor: '季节因素', weight: 15, accuracy: 85 },
  { factor: '市场条件', weight: 15, accuracy: 78 },
  { factor: '团队产能', weight: 10, accuracy: 90 },
  { factor: '产品周期', weight: 5, accuracy: 82 },
]

const aiInsights = [
  { type: 'opportunity', message: '本月预计超额完成目标8%，建议加大投入', confidence: 92, impact: 'high' },
  { type: 'risk', message: '华北区业绩有下降风险，建议重点关注', confidence: 78, impact: 'medium' },
  { type: 'insight', message: '大客户转化率提升15%，策略有效', confidence: 95, impact: 'high' },
  { type: 'action', message: '建议对23个即将过期商机加快跟进', confidence: 88, impact: 'medium' },
  { type: 'trend', message: '下季度预计市场增长12%，建议提前准备', confidence: 85, impact: 'high' },
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function SalesForecastPage() {
  const [timeRange, setTimeRange] = React.useState('month')
  const [viewType, setViewType] = React.useState('overview')
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)

  const form = useForm<ForecastConfigForm>({
    resolver: zodResolver(forecastConfigSchema),
    defaultValues: {
      confidenceLevel: 85,
      forecastHorizon: 'month',
      includeSeasonality: true,
      smoothingFactor: 0.3,
    },
  })

  const onSubmitConfig = (data: ForecastConfigForm) => {
    console.log('更新预测配置:', data)
    setShowConfigDialog(false)
  }

  // Calculate totals
  const totalForecast = teamForecast.reduce((sum, t) => sum + t.forecast, 0)
  const totalActual = teamForecast.reduce((sum, t) => sum + t.actual, 0)
  const totalWeighted = pipelineForecast.reduce((sum, p) => sum + p.weighted, 0)
  const avgAccuracy = accuracyHistory.reduce((sum, a) => sum + a.accuracy, 0) / accuracyHistory.length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">销售预测 AI</h1>
            <p className="text-muted-foreground">基于AI的业绩预测与商机分析</p>
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
                <DialogTitle>预测模型配置</DialogTitle>
                <DialogDescription>调整预测模型的参数设置</DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitConfig)} className="space-y-6">
                <div>
                  <Label>置信水平 ({form.watch('confidenceLevel')}%)</Label>
                  <Controller
                    name="confidenceLevel"
                    control={form.control}
                    render={({ field }) => (
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        min={50}
                        max={99}
                        step={1}
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">预测区间置信度</p>
                </div>
                <div>
                  <Label>预测周期</Label>
                  <Select 
                    value={form.watch('forecastHorizon')} 
                    onValueChange={(v) => form.setValue('forecastHorizon', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">一周</SelectItem>
                      <SelectItem value="month">一个月</SelectItem>
                      <SelectItem value="quarter">一季度</SelectItem>
                      <SelectItem value="year">一年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">包含季节因素</span>
                      <p className="text-sm text-muted-foreground">考虑季节性波动影响</p>
                    </div>
                    <Controller
                      name="includeSeasonality"
                      control={form.control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Label>平滑因子 ({form.watch('smoothingFactor')})</Label>
                  <Controller
                    name="smoothingFactor"
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
                  <p className="text-xs text-muted-foreground">历史数据平滑程度</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowConfigDialog(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    保存配置
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Forecast Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">预测金额</span>
            </div>
            <div className="text-3xl font-bold text-green-600">¥{(totalForecast / 10000).toFixed(0)}万</div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">置信度 85%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">当前完成</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">¥{(totalActual / 10000).toFixed(0)}万</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">完成率 {(totalActual / totalForecast * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">加权预测</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">¥{(totalWeighted / 10000).toFixed(0)}万</div>
            <div className="flex items-center gap-1 mt-1">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-600">基于漏斗计算</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">预测准确率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{avgAccuracy.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">持续提升</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">预测概览</TabsTrigger>
          <TabsTrigger value="pipeline">漏斗分析</TabsTrigger>
          <TabsTrigger value="team">团队预测</TabsTrigger>
          <TabsTrigger value="accuracy">准确性分析</TabsTrigger>
          <TabsTrigger value="insights">AI洞察</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                月度预测对比
              </CardTitle>
              <CardDescription>预测值与实际值的对比分析</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                  <Tooltip formatter={(value) => `¥${(Number(value) / 10000).toFixed(0)}万`} />
                  <Legend />
                  <Area type="monotone" dataKey="upper" name="上限" fill="#10B981" fillOpacity={0.1} stroke="none" />
                  <Area type="monotone" dataKey="lower" name="下限" fill="#3B82F6" fillOpacity={0.1} stroke="none" />
                  <Bar dataKey="actual" name="实际" fill="#3B82F6" barSize={20} />
                  <Line type="monotone" dataKey="forecast" name="预测" stroke="#10B981" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {monthlyForecast.slice(0, 3).map((item) => (
                  <div key={item.month} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{item.month}</Badge>
                      <Badge variant={item.actual > 0 ? 'default' : 'secondary'}>
                        {item.actual > 0 ? '已完成' : '预测'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">预测: </span>
                        <span className="font-medium">¥{(item.forecast / 10000).toFixed(0)}万</span>
                      </div>
                      {item.actual > 0 && (
                        <div>
                          <span className="text-muted-foreground">实际: </span>
                          <span className={`font-medium ${item.actual >= item.forecast ? 'text-green-600' : 'text-red-600'}`}>
                            ¥{(item.actual / 10000).toFixed(0)}万
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">置信度: </span>
                      <Badge variant="outline">{item.confidence}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>漏斗加权预测</CardTitle>
                <CardDescription>按阶段计算加权预测值</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineForecast} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                    <YAxis dataKey="stage" type="category" width={80} />
                    <Tooltip formatter={(value) => `¥${(Number(value) / 10000).toFixed(0)}万`} />
                    <Legend />
                    <Bar dataKey="value" name="商机金额" fill="#3B82F6" />
                    <Bar dataKey="weighted" name="加权预测" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>阶段转化分析</CardTitle>
                <CardDescription>各阶段转化概率与速度</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>阶段</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>概率</TableHead>
                      <TableHead>加权</TableHead>
                      <TableHead>周期</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pipelineForecast.map((item) => (
                      <TableRow key={item.stage}>
                        <TableCell className="font-medium">{item.stage}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>¥{(item.value / 10000).toFixed(0)}万</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.probability}%</Badge>
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          ¥{(item.weighted / 10000).toFixed(0)}万
                        </TableCell>
                        <TableCell>{item.velocity}天</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>产品预测分布</CardTitle>
              <CardDescription>各产品线的预测贡献</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={productForecast}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="share"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {productForecast.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                团队预测对比
              </CardTitle>
              <CardDescription>各团队业绩预测与完成情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  {teamForecast.map((team) => (
                    <div key={team.team} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                          <span className="font-medium">{team.team}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {team.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : team.trend === 'down' ? (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-400" />
                          )}
                          <Badge variant={team.achievement >= 85 ? 'default' : 'destructive'} 
                            className={team.achievement >= 85 ? 'bg-green-500' : ''}>
                            {team.achievement}%
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">预测: </span>
                          <span className="font-medium">¥{(team.forecast / 10000).toFixed(0)}万</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">实际: </span>
                          <span className="font-medium">¥{(team.actual / 10000).toFixed(0)}万</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">差距: </span>
                          <span className={`font-medium ${team.gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ¥{(Math.abs(team.gap) / 10000).toFixed(0)}万
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${team.achievement >= 85 ? 'bg-green-500' : team.achievement >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${team.achievement}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" />
                    <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                    <Tooltip formatter={(value) => `¥${(Number(value) / 10000).toFixed(0)}万`} />
                    <Legend />
                    <Bar dataKey="forecast" name="预测" fill="#3B82F6" />
                    <Bar dataKey="actual" name="实际" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accuracy Tab */}
        <TabsContent value="accuracy" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  预测准确率趋势
                </CardTitle>
                <CardDescription>近6个月预测准确率变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={accuracyHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <ReferenceLine y={85} stroke="#F59E0B" strokeDasharray="3 3" label="目标线" />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="准确率" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>预测因子权重</CardTitle>
                <CardDescription>各因素对预测的贡献度</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={forecastFactors}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="权重" dataKey="weight" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                    <Radar name="准确度" dataKey="accuracy" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>因子权重配置</CardTitle>
                <CardDescription>调整预测模型中各因素的权重</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {forecastFactors.map((factor) => (
                    <div key={factor.factor} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{factor.factor}</span>
                        <Badge variant="outline">{factor.weight}%</Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${factor.weight}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">准确度:</span>
                        <span className={`font-medium ${factor.accuracy >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                          {factor.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  调整权重配置
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI 智能洞察
              </CardTitle>
              <CardDescription>基于数据分析的智能建议与预警</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'opportunity' ? 'border-green-200 bg-green-50' :
                      insight.type === 'risk' ? 'border-red-200 bg-red-50' :
                      insight.type === 'action' ? 'border-blue-200 bg-blue-50' :
                      insight.type === 'trend' ? 'border-purple-200 bg-purple-50' :
                      'border-orange-200 bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {insight.type === 'opportunity' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : insight.type === 'risk' ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : insight.type === 'action' ? (
                          <Target className="h-5 w-5 text-blue-600" />
                        ) : insight.type === 'trend' ? (
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Zap className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <p className="font-medium">{insight.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              置信度 {insight.confidence}%
                            </Badge>
                            <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                              {insight.impact === 'high' ? '高影响' : '中影响'}
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
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">AI洞察统计</span>
                    <p className="text-xs text-muted-foreground">本月共生成 5 条洞察，采纳率 80%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">4</div>
                      <div className="text-xs text-muted-foreground">已采纳</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">1</div>
                      <div className="text-xs text-muted-foreground">待决策</div>
                    </div>
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

export default SalesForecastPage