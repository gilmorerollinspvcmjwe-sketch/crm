/**
 * LeadScoring - 纯索评分 AI
 * Lead Scoring AI Page
 * Features: 评分模型配置、评分维度、权重调整、历史记录、分布图表
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import {
  Brain,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Settings,
  RefreshCw,
  Download,
  Gauge,
  Zap,
  Save,
  RotateCcw,
  History,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for scoring factor weights
const scoringWeightsSchema = z.object({
  demographic: z.number().min(0).max(100),
  behavioral: z.number().min(0).max(100),
  engagement: z.number().min(0).max(100),
  companyFit: z.number().min(0).max(100),
  timing: z.number().min(0).max(100),
})

type ScoringWeightsForm = z.infer<typeof scoringWeightsSchema>

// Mock lead scores with detailed metrics
const scoredLeads = [
  { 
    id: '1', 
    name: '科技公司A', 
    score: 92, 
    grade: 'A+', 
    demographic: 90, 
    behavioral: 95, 
    engagement: 88,
    companyFit: 92,
    timing: 85,
    factors: ['高意向', '预算充足', '决策快'], 
    recommendation: '优先跟进',
    trend: 'up',
    lastUpdated: '2小时前'
  },
  { 
    id: '2', 
    name: '金融公司B', 
    score: 85, 
    grade: 'A', 
    demographic: 85, 
    behavioral: 82, 
    engagement: 90,
    companyFit: 80,
    timing: 88,
    factors: ['多次互动', '符合画像'], 
    recommendation: '重点跟进',
    trend: 'up',
    lastUpdated: '5小时前'
  },
  { 
    id: '3', 
    name: '教育机构C', 
    score: 68, 
    grade: 'B', 
    demographic: 70, 
    behavioral: 65, 
    engagement: 72,
    companyFit: 68,
    timing: 70,
    factors: ['中等意向', '预算待确认'], 
    recommendation: '常规跟进',
    trend: 'stable',
    lastUpdated: '1天前'
  },
  { 
    id: '4', 
    name: '制造业D', 
    score: 45, 
    grade: 'C', 
    demographic: 40, 
    behavioral: 50, 
    engagement: 45,
    companyFit: 48,
    timing: 42,
    factors: ['意向不明', '信息不足'], 
    recommendation: '培育阶段',
    trend: 'down',
    lastUpdated: '2天前'
  },
  { 
    id: '5', 
    name: '零售企业E', 
    score: 28, 
    grade: 'D', 
    demographic: 25, 
    behavioral: 30, 
    engagement: 28,
    companyFit: 32,
    timing: 25,
    factors: ['低匹配度', '竞争激烈'], 
    recommendation: '暂时搁置',
    trend: 'down',
    lastUpdated: '3天前'
  },
]

// Scoring dimensions with sub-factors
const scoringDimensions = [
  {
    dimension: 'demographic',
    name: '人口统计维度',
    weight: 25,
    factors: [
      { name: '公司规模', weight: 35 },
      { name: '行业匹配', weight: 25 },
      { name: '地理位置', weight: 20 },
      { name: '决策者级别', weight: 20 },
    ],
  },
  {
    dimension: 'behavioral',
    name: '行为维度',
    weight: 20,
    factors: [
      { name: '网站访问频率', weight: 30 },
      { name: '内容互动', weight: 25 },
      { name: '下载行为', weight: 25 },
      { name: '搜索关键词', weight: 20 },
    ],
  },
  {
    dimension: 'engagement',
    name: '互动维度',
    weight: 15,
    factors: [
      { name: '邮件响应率', weight: 35 },
      { name: '会议参与', weight: 30 },
      { name: '社媒互动', weight: 20 },
      { name: '咨询频率', weight: 15 },
    ],
  },
  {
    dimension: 'companyFit',
    name: '公司匹配度',
    weight: 15,
    factors: [
      { name: '产品契合度', weight: 40 },
      { name: '预算水平', weight: 30 },
      { name: '采购周期', weight: 20 },
      { name: '竞品情况', weight: 10 },
    ],
  },
  {
    dimension: 'timing',
    name: '时机维度',
    weight: 10,
    factors: [
      { name: '需求紧迫度', weight: 40 },
      { name: '采购窗口期', weight: 30 },
      { name: '预算周期', weight: 20 },
      { name: '决策时机', weight: 10 },
    ],
  },
]

const scoringHistory = [
  { leadName: '科技公司A', oldScore: 85, newScore: 92, change: 7, reason: '新增互动记录', time: '2小时前' },
  { leadName: '金融公司B', oldScore: 80, newScore: 85, change: 5, reason: '预算确认', time: '5小时前' },
  { leadName: '教育机构C', oldScore: 72, newScore: 68, change: -4, reason: '响应延迟', time: '1天前' },
  { leadName: '制造业D', oldScore: 50, newScore: 45, change: -5, reason: '竞品接触', time: '2天前' },
]

const modelStats = {
  accuracy: 89.5,
  precision: 85.2,
  recall: 91.3,
  f1Score: 88.1,
  totalScored: 1256,
  highConversion: 156,
  avgScore: 62.5,
  scoreUpdates: 45,
}

const gradeDistribution = [
  { name: 'A+ (>90)', count: 45, color: '#10B981' },
  { name: 'A (80-90)', count: 89, color: '#3B82F6' },
  { name: 'B (60-80)', count: 156, color: '#F59E0B' },
  { name: 'C (40-60)', count: 234, color: '#EF4444' },
  { name: 'D (<40)', count: 78, color: '#6B7280' },
]

const scoreDistributionData = [
  { range: '0-20', count: 25 },
  { range: '20-40', count: 53 },
  { range: '40-60', count: 234 },
  { range: '60-80', count: 156 },
  { range: '80-90', count: 89 },
  { range: '90-100', count: 45 },
]

const conversionByGrade = [
  { grade: 'A+', conversionRate: 65 },
  { grade: 'A', conversionRate: 45 },
  { grade: 'B', conversionRate: 25 },
  { grade: 'C', conversionRate: 12 },
  { grade: 'D', conversionRate: 5 },
]

const weeklyScores = [
  { week: '第1周', avgScore: 58, highScore: 95, lowScore: 15 },
  { week: '第2周', avgScore: 60, highScore: 92, lowScore: 18 },
  { week: '第3周', avgScore: 62, highScore: 88, lowScore: 20 },
  { week: '第4周', avgScore: 65, highScore: 96, lowScore: 22 },
  { week: '第5周', avgScore: 62, highScore: 94, lowScore: 28 },
  { week: '第6周', avgScore: 62.5, highScore: 92, lowScore: 28 },
]

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280']

const gradeColors = {
  'A+': 'bg-green-500',
  'A': 'bg-green-400',
  'B': 'bg-blue-500',
  'C': 'bg-yellow-500',
  'D': 'bg-orange-500',
  'F': 'bg-red-500',
}

export function LeadScoringPage() {
  const [aiScoringEnabled, setAiScoringEnabled] = React.useState(true)
  const [viewType, setViewType] = React.useState('scores')
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)
  const [selectedLead, setSelectedLead] = React.useState<typeof scoredLeads[0] | null>(null)

  const form = useForm<ScoringWeightsForm>({
    resolver: zodResolver(scoringWeightsSchema),
    defaultValues: {
      demographic: 25,
      behavioral: 20,
      engagement: 15,
      companyFit: 15,
      timing: 10,
    },
  })

  const onSubmitWeights = (data: ScoringWeightsForm) => {
    console.log('更新权重:', data)
    setShowConfigDialog(false)
  }

  // Prepare radar data for selected lead
  const radarData = selectedLead ? [
    { dimension: '人口统计', value: selectedLead.demographic, fullMark: 100 },
    { dimension: '行为', value: selectedLead.behavioral, fullMark: 100 },
    { dimension: '互动', value: selectedLead.engagement, fullMark: 100 },
    { dimension: '匹配度', value: selectedLead.companyFit, fullMark: 100 },
    { dimension: '时机', value: selectedLead.timing, fullMark: 100 },
  ] : []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">纯索评分 AI</h1>
            <p className="text-muted-foreground">基于机器学习的纯索质量评估与分级</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={aiScoringEnabled}
              onCheckedChange={setAiScoringEnabled}
            />
            <Label className="text-sm">
              {aiScoringEnabled ? 'AI评分已开启' : 'AI评分已关闭'}
            </Label>
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            批量评分
          </Button>
        </div>
      </div>

      {/* Model Performance */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">模型准确率</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{modelStats.accuracy}%</div>
            <div className="text-xs text-muted-foreground mt-1">F1 Score: {modelStats.f1Score}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">精确度</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{modelStats.precision}%</div>
            <div className="text-xs text-muted-foreground mt-1">召回率: {modelStats.recall}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">已评分</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{modelStats.totalScored}</div>
            <div className="text-xs text-muted-foreground mt-1">今日更新 {modelStats.scoreUpdates}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">高转化纯索</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{modelStats.highConversion}</div>
            <div className="text-xs text-muted-foreground mt-1">评分 A 级以上</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">平均评分</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">{modelStats.avgScore}</div>
            <div className="text-xs text-muted-foreground mt-1">满分 100</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="scores">评分结果</TabsTrigger>
          <TabsTrigger value="dimensions">评分维度</TabsTrigger>
          <TabsTrigger value="distribution">分布分析</TabsTrigger>
          <TabsTrigger value="history">评分历史</TabsTrigger>
          <TabsTrigger value="settings">模型配置</TabsTrigger>
        </TabsList>

        {/* Scores Tab */}
        <TabsContent value="scores" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Lead List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>纯索评分列表</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部等级</SelectItem>
                        <SelectItem value="a">A 级</SelectItem>
                        <SelectItem value="b">B 级</SelectItem>
                        <SelectItem value="c">C 级</SelectItem>
                        <SelectItem value="d">D 级</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>近期评分的纯索及其分级</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scoredLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge className={gradeColors[lead.grade as keyof typeof gradeColors]}>
                            {lead.grade}
                          </Badge>
                          <span className="font-medium">{lead.name}</span>
                          {lead.trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
                          {lead.trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
                          {lead.trend === 'stable' && <Minus className="h-4 w-4 text-gray-400" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">{lead.score}</span>
                          </div>
                          <Badge variant="outline">{lead.recommendation}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {lead.factors.map((factor) => (
                          <Badge key={factor} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        更新于 {lead.lastUpdated}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lead Detail Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  评分详情
                </CardTitle>
                <CardDescription>
                  {selectedLead ? selectedLead.name : '请选择纯索查看详情'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedLead ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge className={`${gradeColors[selectedLead.grade as keyof typeof gradeColors]} text-lg px-4 py-2`}>
                        {selectedLead.grade}
                      </Badge>
                      <div className="text-3xl font-bold mt-2">{selectedLead.score}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="评分"
                          dataKey="value"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">人口统计: </span>
                        <span className="font-medium">{selectedLead.demographic}</span>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">行为: </span>
                        <span className="font-medium">{selectedLead.behavioral}</span>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">互动: </span>
                        <span className="font-medium">{selectedLead.engagement}</span>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">匹配度: </span>
                        <span className="font-medium">{selectedLead.companyFit}</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      查看完整分析
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>点击左侧纯索查看详细评分</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dimensions Tab */}
        <TabsContent value="dimensions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    评分维度配置
                  </CardTitle>
                  <CardDescription>影响纯索评分的关键维度及其权重</CardDescription>
                </div>
                <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      调整权重
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>调整评分权重</DialogTitle>
                      <DialogDescription>设置各维度的评分权重（总和应为100）</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmitWeights)} className="space-y-6">
                      <div>
                        <Label>人口统计维度 ({form.watch('demographic')}%)</Label>
                        <Controller
                          name="demographic"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={(v) => field.onChange(v[0])}
                              max={100}
                              step={5}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>行为维度 ({form.watch('behavioral')}%)</Label>
                        <Controller
                          name="behavioral"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={(v) => field.onChange(v[0])}
                              max={100}
                              step={5}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>互动维度 ({form.watch('engagement')}%)</Label>
                        <Controller
                          name="engagement"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={(v) => field.onChange(v[0])}
                              max={100}
                              step={5}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>公司匹配度 ({form.watch('companyFit')}%)</Label>
                        <Controller
                          name="companyFit"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={(v) => field.onChange(v[0])}
                              max={100}
                              step={5}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>时机维度 ({form.watch('timing')}%)</Label>
                        <Controller
                          name="timing"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={(v) => field.onChange(v[0])}
                              max={100}
                              step={5}
                            />
                          )}
                        />
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">当前总和:</span>
                          <span className="font-bold">
                            {form.watch('demographic') + form.watch('behavioral') + form.watch('engagement') + form.watch('companyFit') + form.watch('timing')}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowConfigDialog(false)}>
                          取消
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          保存权重
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                {scoringDimensions.map((dim) => (
                  <div key={dim.dimension} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{dim.name}</span>
                      <Badge variant="outline">{dim.weight}%</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${dim.weight}%` }}
                      />
                    </div>
                    <div className="space-y-2">
                      {dim.factors.map((factor) => (
                        <div key={factor.name} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{factor.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${factor.weight}%` }}
                              />
                            </div>
                            <span className="font-medium">{factor.weight}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Grade Distribution Pie */}
            <Card>
              <CardHeader>
                <CardTitle>等级分布</CardTitle>
                <CardDescription>各评分等级的纯索数量占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Distribution Bar */}
            <Card>
              <CardHeader>
                <CardTitle>评分分布</CardTitle>
                <CardDescription>评分区间分布统计</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="数量" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion by Grade */}
            <Card>
              <CardHeader>
                <CardTitle>各等级转化率</CardTitle>
                <CardDescription>不同评分等级的实际转化率</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={conversionByGrade} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="grade" type="category" width={60} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="conversionRate" name="转化率" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle>评分趋势</CardTitle>
                <CardDescription>近6周平均评分变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklyScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="avgScore" name="平均分" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Line type="monotone" dataKey="highScore" name="最高分" stroke="#10B981" dot={false} />
                    <Line type="monotone" dataKey="lowScore" name="最低分" stroke="#EF4444" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                评分变更历史
              </CardTitle>
              <CardDescription>近期评分变化的记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>纯索名称</TableHead>
                    <TableHead>原评分</TableHead>
                    <TableHead>新评分</TableHead>
                    <TableHead>变化</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scoringHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.leadName}</TableCell>
                      <TableCell>{record.oldScore}</TableCell>
                      <TableCell>{record.newScore}</TableCell>
                      <TableCell>
                        <Badge variant={record.change > 0 ? 'default' : 'destructive'} className={record.change > 0 ? 'bg-green-500' : ''}>
                          {record.change > 0 ? '+' : ''}{record.change}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.reason}</TableCell>
                      <TableCell>{record.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                模型设置
              </CardTitle>
              <CardDescription>配置评分模型的运行参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">自动评分</span>
                      <p className="text-sm text-muted-foreground">新纯索自动触发评分</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">实时更新</span>
                      <p className="text-sm text-muted-foreground">纯索信息变化时更新评分</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">阈值提醒</span>
                      <p className="text-sm text-muted-foreground">高评分纯索自动提醒</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">评分日志</span>
                      <p className="text-sm text-muted-foreground">记录评分变更历史</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <Label>评分阈值设置</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <span className="text-xs text-muted-foreground">A+</span>
                      <Input defaultValue="90" className="h-8 text-center mt-1" />
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <span className="text-xs text-muted-foreground">A</span>
                      <Input defaultValue="80" className="h-8 text-center mt-1" />
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <span className="text-xs text-muted-foreground">B</span>
                      <Input defaultValue="60" className="h-8 text-center mt-1" />
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <span className="text-xs text-muted-foreground">C</span>
                      <Input defaultValue="40" className="h-8 text-center mt-1" />
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <span className="text-xs text-muted-foreground">D</span>
                      <Input defaultValue="0" className="h-8 text-center mt-1" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新训练模型
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    重置默认设置
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LeadScoringPage