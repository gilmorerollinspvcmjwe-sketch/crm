/**
 * CustomerSegmentation - 客户细分 AI
 * Customer Segmentation AI Page
 * Features: RFM模型配置、分群维度、散点图/饼图、分群列表、分群应用
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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from 'recharts'
import {
  Brain,
  Users,
  PieChart as PieChartIcon,
  Target,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Download,
  Settings,
  Zap,
  Layers,
  Grid3X3,
  Filter,
  Save,
  CheckCircle,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for RFM config
const rfmConfigSchema = z.object({
  rScoreLower: z.number().min(0).max(365),
  rScoreUpper: z.number().min(0).max(365),
  fScoreLower: z.number().min(0).max(100),
  fScoreUpper: z.number().min(0).max(100),
  mScoreLower: z.number().min(0),
  mScoreUpper: z.number().min(0),
  segmentationMethod: z.enum(['rfm', 'kmeans', 'hierarchical', 'custom']),
})

type RFMConfigForm = z.infer<typeof rfmConfigSchema>

// Mock customer segments with RFM scores
const customerSegments = [
  {
    id: 'vip',
    name: 'VIP客户',
    description: '高价值、高忠诚度客户',
    count: 85,
    revenue: 12500000,
    percentage: 15,
    color: '#10B981',
    avgR: 15,
    avgF: 25,
    avgM: 150000,
    traits: ['高消费', '频繁互动', '长期合作'],
    strategy: '专属服务、定制方案',
    priority: 1,
  },
  {
    id: 'growth',
    name: '成长型客户',
    description: '潜力大、增长快的客户',
    count: 170,
    revenue: 8500000,
    percentage: 30,
    color: '#3B82F6',
    avgR: 30,
    avgF: 12,
    avgM: 50000,
    traits: ['消费增长', '活跃度高', '新客户'],
    strategy: '重点培育、促进转化',
    priority: 2,
  },
  {
    id: 'stable',
    name: '稳定型客户',
    description: '价值稳定、合作良好',
    count: 198,
    revenue: 4200000,
    percentage: 35,
    color: '#F59E0B',
    avgR: 45,
    avgF: 8,
    avgM: 22000,
    traits: ['稳定消费', '定期采购', '长期客户'],
    strategy: '维持关系、提升服务',
    priority: 3,
  },
  {
    id: 'inactive',
    name: '待激活客户',
    description: '近期活跃度下降',
    count: 113,
    revenue: 560000,
    percentage: 20,
    color: '#EF4444',
    avgR: 90,
    avgF: 3,
    avgM: 5000,
    traits: ['活跃度低', '消费减少', '潜在流失'],
    strategy: '主动激活、挽回策略',
    priority: 4,
  },
]

// Scatter data for RFM visualization
const scatterData = [
  { x: 15, y: 25, value: 150000, segment: 'vip', name: 'VIP客户' },
  { x: 30, y: 12, value: 50000, segment: 'growth', name: '成长型' },
  { x: 45, y: 8, value: 22000, segment: 'stable', name: '稳定型' },
  { x: 90, y: 3, value: 5000, segment: 'inactive', name: '待激活' },
  { x: 20, y: 30, value: 180000, segment: 'vip', name: 'VIP客户' },
  { x: 25, y: 15, value: 45000, segment: 'growth', name: '成长型' },
  { x: 50, y: 6, value: 18000, segment: 'stable', name: '稳定型' },
  { x: 120, y: 2, value: 3000, segment: 'inactive', name: '待激活' },
]

// Segment factors
const segmentFactors = [
  { factor: '消费金额', weight: 35, description: '历史累计消费额', enabled: true },
  { factor: '购买频率', weight: 25, description: '平均采购周期', enabled: true },
  { factor: '活跃度', weight: 20, description: '近三个月互动次数', enabled: true },
  { factor: '合作时长', weight: 15, description: '成为客户的时间', enabled: true },
  { factor: '满意度', weight: 5, description: '客户满意度评分', enabled: false },
]

// RFM thresholds
const rfmThresholds = [
  { score: 'R', name: '最近购买时间', low: 90, medium: 45, high: 15 },
  { score: 'F', name: '购买频率', low: 3, medium: 10, high: 20 },
  { score: 'M', name: '消费金额', low: 5000, medium: 50000, high: 100000 },
]

// AI recommendations
const aiRecommendations = [
  { segment: 'VIP客户', action: '升级服务等级', expected: '+12%续费率', priority: 'high' },
  { segment: '成长型', action: '推出激励计划', expected: '+25%转化', priority: 'high' },
  { segment: '稳定型', action: '交叉销售', expected: '+8%客单价', priority: 'medium' },
  { segment: '待激活', action: '定向优惠', expected: '30%激活率', priority: 'medium' },
]

// Segment application records
const applicationRecords = [
  { id: '1', segment: 'VIP客户', action: '升级服务', affected: 85, result: '成功', time: '1小时前' },
  { id: '2', segment: '成长型', action: '营销推送', affected: 170, result: '进行中', time: '3小时前' },
  { id: '3', segment: '待激活', action: '挽回邮件', affected: 113, result: '成功', time: '1天前' },
]

// Treemap data
const treemapData = customerSegments.map(s => ({
  name: s.name,
  value: s.revenue,
  count: s.count,
}))

// Radar data for segment comparison
const radarData = [
  { dimension: '忠诚度', vip: 95, growth: 70, stable: 60, inactive: 20 },
  { dimension: '价值度', vip: 90, growth: 65, stable: 50, inactive: 30 },
  { dimension: '活跃度', vip: 85, growth: 80, stable: 55, inactive: 15 },
  { dimension: '增长潜力', vip: 40, growth: 90, stable: 30, inactive: 50 },
  { dimension: '满意度', vip: 92, growth: 75, stable: 68, inactive: 35 },
]

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

export function CustomerSegmentationPage() {
  const [viewType, setViewType] = React.useState('segments')
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)
  const [selectedSegment, setSelectedSegment] = React.useState<typeof customerSegments[0] | null>(null)

  const form = useForm<RFMConfigForm>({
    resolver: zodResolver(rfmConfigSchema),
    defaultValues: {
      rScoreLower: 90,
      rScoreUpper: 15,
      fScoreLower: 3,
      fScoreUpper: 20,
      mScoreLower: 5000,
      mScoreUpper: 100000,
      segmentationMethod: 'rfm',
    },
  })

  const onSubmitConfig = (data: RFMConfigForm) => {
    console.log('更新RFM配置:', data)
    setShowConfigDialog(false)
  }

  const totalCustomers = customerSegments.reduce((sum, s) => sum + s.count, 0)
  const totalRevenue = customerSegments.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">客户细分 AI</h1>
            <p className="text-muted-foreground">基于AI的客户智能分群与策略推荐</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出分析报告
          </Button>
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                RFM配置
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>RFM模型配置</DialogTitle>
                <DialogDescription>配置RFM评分阈值与分群方法</DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitConfig)} className="space-y-6">
                <div>
                  <Label>分群方法</Label>
                  <Select 
                    value={form.watch('segmentationMethod')} 
                    onValueChange={(v) => form.setValue('segmentationMethod', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfm">RFM模型</SelectItem>
                      <SelectItem value="kmeans">K-Means聚类</SelectItem>
                      <SelectItem value="hierarchical">层次聚类</SelectItem>
                      <SelectItem value="custom">自定义规则</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>R值阈值 (天数)</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">高:</span>
                        <Input 
                          type="number" 
                          value={form.watch('rScoreUpper')}
                          onChange={(e) => form.setValue('rScoreUpper', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">低:</span>
                        <Input 
                          type="number" 
                          value={form.watch('rScoreLower')}
                          onChange={(e) => form.setValue('rScoreLower', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>F值阈值 (次数)</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">高:</span>
                        <Input 
                          type="number" 
                          value={form.watch('fScoreUpper')}
                          onChange={(e) => form.setValue('fScoreUpper', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">低:</span>
                        <Input 
                          type="number" 
                          value={form.watch('fScoreLower')}
                          onChange={(e) => form.setValue('fScoreLower', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>M值阈值 (金额)</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">高:</span>
                        <Input 
                          type="number" 
                          value={form.watch('mScoreUpper')}
                          onChange={(e) => form.setValue('mScoreUpper', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">低:</span>
                        <Input 
                          type="number" 
                          value={form.watch('mScoreLower')}
                          onChange={(e) => form.setValue('mScoreLower', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
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

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">细分群组</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{customerSegments.length}个</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">总客户数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{totalCustomers}家</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">总营收</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">¥{(totalRevenue / 10000).toFixed(0)}万</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">细分准确度</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">95.2%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">待执行策略</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">4项</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="segments">客户分群</TabsTrigger>
          <TabsTrigger value="rfm">RFM分析</TabsTrigger>
          <TabsTrigger value="visualization">可视化</TabsTrigger>
          <TabsTrigger value="recommendations">策略推荐</TabsTrigger>
          <TabsTrigger value="applications">分群应用</TabsTrigger>
        </TabsList>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                客户细分结果
              </CardTitle>
              <CardDescription>AI自动识别的客户群组</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {customerSegments.map((segment) => (
                  <div 
                    key={segment.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSegment?.id === segment.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedSegment(segment)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }} />
                        <span className="font-medium">{segment.name}</span>
                        <Badge variant="outline">优先级 {segment.priority}</Badge>
                      </div>
                      <Badge>{segment.count}家</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">营收贡献</span>
                        <span className="font-medium">¥{(segment.revenue / 10000).toFixed(0)}万</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">占比</span>
                        <span className="font-medium">{segment.percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{ width: `${segment.percentage}%`, backgroundColor: segment.color }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">特征标签</div>
                      <div className="flex flex-wrap gap-1">
                        {segment.traits.map((trait) => (
                          <Badge key={trait} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">推荐策略</div>
                        <p className="text-sm font-medium text-blue-600">{segment.strategy}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RFM Tab */}
        <TabsContent value="rfm" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  RFM评分阈值
                </CardTitle>
                <CardDescription>Recency、Frequency、Monetary评分标准</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>维度</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>低分</TableHead>
                      <TableHead>中分</TableHead>
                      <TableHead>高分</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfmThresholds.map((item) => (
                      <TableRow key={item.score}>
                        <TableCell className="font-medium">{item.score}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{item.low}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.medium}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{item.high}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>分群RFM均值</CardTitle>
                <CardDescription>各分群的平均RFM指标</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>分群</TableHead>
                      <TableHead>R均值(天)</TableHead>
                      <TableHead>F均值(次)</TableHead>
                      <TableHead>M均值(元)</TableHead>
                      <TableHead>RFM评分</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerSegments.map((segment) => (
                      <TableRow key={segment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: segment.color }} />
                            {segment.name}
                          </div>
                        </TableCell>
                        <TableCell>{segment.avgR}</TableCell>
                        <TableCell>{segment.avgF}</TableCell>
                        <TableCell>¥{(segment.avgM / 1000).toFixed(1)}k</TableCell>
                        <TableCell>
                          <Badge variant={segment.avgR < 30 ? 'default' : 'secondary'}>
                            {segment.avgR < 30 && segment.avgF > 10 && segment.avgM > 50000 ? '高价值' : 
                             segment.avgR < 60 ? '中价值' : '低价值'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>分群因子权重</CardTitle>
              <CardDescription>影响客户分群的关键因素</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {segmentFactors.map((item) => (
                  <div key={item.factor} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={item.enabled} />
                        <span className="font-medium">{item.factor}</span>
                      </div>
                      <Badge variant="outline">{item.weight}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                        style={{ width: `${item.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                <Save className="h-4 w-4 mr-2" />
                保存因子配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualization Tab */}
        <TabsContent value="visualization" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Scatter Plot */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  RFM散点图
                </CardTitle>
                <CardDescription>R(最近购买) vs F(购买频率) 分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="R值" 
                      unit="天"
                      domain={[0, 150]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="F值" 
                      unit="次"
                      domain={[0, 35]}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {customerSegments.map((segment) => (
                      <Scatter 
                        key={segment.id}
                        name={segment.name}
                        data={scatterData.filter(d => d.segment === segment.id)}
                        fill={segment.color}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  分群占比
                </CardTitle>
                <CardDescription>各分群客户数量占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="percentage"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Treemap */}
            <Card>
              <CardHeader>
                <CardTitle>营收贡献分布</CardTitle>
                <CardDescription>各分群营收贡献可视化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <Treemap
                    data={treemapData}
                    dataKey="value"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="#8884d8"
                  >
                    {treemapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={customerSegments[index].color} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>分群特征对比</CardTitle>
                <CardDescription>各分群多维度特征对比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    {customerSegments.map((segment) => (
                      <Radar
                        key={segment.id}
                        name={segment.name}
                        dataKey={segment.id as any}
                        stroke={segment.color}
                        fill={segment.color}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI 策略推荐
              </CardTitle>
              <CardDescription>针对各细分群组的优化策略</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <div key={rec.segment} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {customerSegments.find(s => s.name === rec.segment) && (
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: customerSegments.find(s => s.name === rec.segment)?.color }}
                          />
                        )}
                        <Badge variant="outline">{rec.segment}</Badge>
                        <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                          {rec.priority === 'high' ? '高优先级' : '中优先级'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                        <Button size="sm">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          执行
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">推荐策略: </span>
                        <span className="font-medium">{rec.action}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">预期效果</span>
                        <div className="font-bold text-green-600">{rec.expected}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                <Zap className="h-4 w-4 mr-2" />
                执行全部推荐策略
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    分群应用记录
                  </CardTitle>
                  <CardDescription>基于分群执行的营销与服务策略</CardDescription>
                </div>
                <Button>
                  <Filter className="h-4 w-4 mr-2" />
                  新建应用
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>分群</TableHead>
                    <TableHead>执行动作</TableHead>
                    <TableHead>影响客户</TableHead>
                    <TableHead>结果</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{record.segment}</Badge>
                      </TableCell>
                      <TableCell>{record.action}</TableCell>
                      <TableCell>{record.affected}家</TableCell>
                      <TableCell>
                        <Badge variant={record.result === '成功' ? 'default' : 'secondary'} 
                          className={record.result === '成功' ? 'bg-green-500' : ''}>
                          {record.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomerSegmentationPage