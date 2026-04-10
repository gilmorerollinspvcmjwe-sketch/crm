/**
 * LeadAssignment - 智能线索分配
 * Intelligent Lead Assignment Page
 * Features: AI分配规则配置、分配策略、分配记录、统计图表
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
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
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  Brain,
  Settings,
  Zap,
  Users,
  Target,
  TrendingUp,
  Play,
  Pause,
  RefreshCw,
  History,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for assignment rule
const assignmentRuleSchema = z.object({
  name: z.string().min(1, '规则名称必填'),
  description: z.string().optional(),
  criteria: z.enum(['region', 'industry', 'performance', 'product', 'scale']),
  strategy: z.enum(['roundRobin', 'loadBalance', 'smartMatch', 'dedicated']),
  assignedTo: z.string().min(1, '请选择分配对象'),
  priority: z.number().min(1).max(10),
})

type AssignmentRuleForm = z.infer<typeof assignmentRuleSchema>

// Mock data
const assignmentRules = [
  {
    id: '1',
    name: '按区域分配',
    description: '根据客户所在地区分配给对应销售团队',
    enabled: true,
    criteria: '地区',
    strategy: '团队轮转',
    assignedTo: '华东团队',
    priority: 8,
    stats: { leads: 156, conversion: 23.5, avgTime: 2.1 },
  },
  {
    id: '2',
    name: '按产品线分配',
    description: '根据客户感兴趣的产品类型分配',
    enabled: true,
    criteria: '产品类型',
    strategy: '专专人',
    assignedTo: '产品专家',
    priority: 7,
    stats: { leads: 89, conversion: 32.8, avgTime: 1.8 },
  },
  {
    id: '3',
    name: '按客户规模分配',
    description: '大客户分配给高级销售',
    enabled: false,
    criteria: '客户规模',
    strategy: '级别匹配',
    assignedTo: '高级销售',
    priority: 9,
    stats: { leads: 0, conversion: 0, avgTime: 0 },
  },
]

const teamCapacity = [
  { team: '华东一队', members: 5, capacity: 80, current: 45, available: 35, color: '#3B82F6' },
  { team: '华东二队', members: 4, capacity: 60, current: 38, available: 22, color: '#10B981' },
  { team: '华南团队', members: 6, capacity: 100, current: 52, available: 48, color: '#F59E0B' },
  { team: '华北团队', members: 4, capacity: 70, current: 35, available: 35, color: '#EF4444' },
]

const assignmentHistory = [
  { id: '1', leadName: '科技公司A', fromPool: '公海池', assignedTo: '张三', rule: '按区域', time: '10分钟前', status: 'success' },
  { id: '2', leadName: '金融公司B', fromPool: '新线索', assignedTo: '李四', rule: '按产品', time: '25分钟前', status: 'success' },
  { id: '3', leadName: '教育机构C', fromPool: '公海池', assignedTo: '王五', rule: '智能匹配', time: '1小时前', status: 'success' },
  { id: '4', leadName: '制造业D', fromPool: '新线索', assignedTo: '赵六', rule: '负载均衡', time: '2小时前', status: 'success' },
]

// Charts data
const weeklyAssignments = [
  { day: '周一', assigned: 35, converted: 8 },
  { day: '周二', assigned: 42, converted: 12 },
  { day: '周三', assigned: 38, converted: 9 },
  { day: '周四', assigned: 45, converted: 11 },
  { day: '周五', assigned: 52, converted: 15 },
  { day: '周六', assigned: 20, converted: 5 },
  { day: '周日', assigned: 15, converted: 3 },
]

const strategyDistribution = [
  { name: '轮询分配', value: 35, color: '#3B82F6' },
  { name: '负载均衡', value: 25, color: '#10B981' },
  { name: '智能匹配', value: 30, color: '#F59E0B' },
  { name: '专人负责', value: 10, color: '#EF4444' },
]

const conversionTrend = [
  { week: '第1周', rate: 18 },
  { week: '第2周', rate: 22 },
  { week: '第3周', rate: 25 },
  { week: '第4周', rate: 28 },
  { week: '第5周', rate: 31 },
  { week: '第6周', rate: 35 },
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function LeadAssignmentPage() {
  const [autoAssignEnabled, setAutoAssignEnabled] = React.useState(true)
  const [showRuleDialog, setShowRuleDialog] = React.useState(false)
  const [editingRule, setEditingRule] = React.useState<typeof assignmentRules[0] | null>(null)

  const form = useForm<AssignmentRuleForm>({
    resolver: zodResolver(assignmentRuleSchema),
    defaultValues: {
      name: '',
      description: '',
      criteria: 'region',
      strategy: 'roundRobin',
      assignedTo: '',
      priority: 5,
    },
  })

  const onSubmit = async (data: AssignmentRuleForm) => {
    console.log('提交规则:', data)
    setShowRuleDialog(false)
    form.reset()
  }

  const handleEditRule = (rule: typeof assignmentRules[0]) => {
    setEditingRule(rule)
    form.setValue('name', rule.name)
    form.setValue('description', rule.description || '')
    form.setValue('criteria', 'region')
    form.setValue('strategy', 'roundRobin')
    form.setValue('assignedTo', rule.assignedTo)
    form.setValue('priority', rule.priority)
    setShowRuleDialog(true)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">智能线索分配</h1>
            <p className="text-muted-foreground">基于规则和AI的自动线索分配系统</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoAssignEnabled}
              onCheckedChange={setAutoAssignEnabled}
            />
            <Label className="text-sm">
              {autoAssignEnabled ? '自动分配已开启' : '自动分配已关闭'}
            </Label>
          </div>
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            分配历史
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新状态
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">分配系统状态</h3>
                <p className="text-sm text-muted-foreground">
                  今日已分配 245 条线索，平均分配时间 2.3 秒
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center px-6 border-l">
                <div className="text-2xl font-bold text-blue-600">245</div>
                <div className="text-xs text-muted-foreground">今日分配</div>
              </div>
              <div className="text-center px-6 border-l">
                <div className="text-2xl font-bold text-green-600">28.5%</div>
                <div className="text-xs text-muted-foreground">转化率</div>
              </div>
              <div className="text-center px-6 border-l">
                <div className="text-2xl font-bold text-purple-600">2.3s</div>
                <div className="text-xs text-muted-foreground">响应时间</div>
              </div>
              <div className="text-center px-6 border-l">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-xs text-muted-foreground">活跃规则</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="rules">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">分配规则</TabsTrigger>
          <TabsTrigger value="capacity">团队容量</TabsTrigger>
          <TabsTrigger value="history">分配记录</TabsTrigger>
          <TabsTrigger value="analytics">效果统计</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    分配规则配置
                  </CardTitle>
                  <CardDescription>配置线索自动分配的业务规则</CardDescription>
                </div>
                <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingRule(null); form.reset(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      新建规则
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingRule ? '编辑分配规则' : '创建分配规则'}</DialogTitle>
                      <DialogDescription>配置线索自动分配规则</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <Label htmlFor="name">规则名称</Label>
                        <Input
                          id="name"
                          {...form.register('name')}
                          placeholder="例如：按区域分配"
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="description">规则描述</Label>
                        <Textarea
                          id="description"
                          {...form.register('description')}
                          placeholder="简要描述规则用途"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>分配条件</Label>
                        <Select 
                          value={form.watch('criteria')} 
                          onValueChange={(v) => form.setValue('criteria', v as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择条件" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="region">按地区</SelectItem>
                            <SelectItem value="industry">按行业</SelectItem>
                            <SelectItem value="performance">按业绩</SelectItem>
                            <SelectItem value="product">按产品</SelectItem>
                            <SelectItem value="scale">按规模</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>分配策略</Label>
                        <Select 
                          value={form.watch('strategy')} 
                          onValueChange={(v) => form.setValue('strategy', v as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择策略" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="roundRobin">轮询分配</SelectItem>
                            <SelectItem value="loadBalance">负载均衡</SelectItem>
                            <SelectItem value="smartMatch">智能匹配</SelectItem>
                            <SelectItem value="dedicated">专人负责</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">分配对象</Label>
                        <Input
                          id="assignedTo"
                          {...form.register('assignedTo')}
                          placeholder="团队或人员名称"
                        />
                        {form.formState.errors.assignedTo && (
                          <p className="text-sm text-red-500">{form.formState.errors.assignedTo.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="priority">优先级 (1-10)</Label>
                        <Input
                          id="priority"
                          type="number"
                          {...form.register('priority', { valueAsNumber: true })}
                          min={1}
                          max={10}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowRuleDialog(false)}>
                          取消
                        </Button>
                        <Button type="submit">
                          {editingRule ? '保存修改' : '创建规则'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={rule.enabled}
                          onCheckedChange={(checked) => console.log('切换规则状态:', rule.id, checked)}
                        />
                        <div>
                          <span className="font-medium">{rule.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {rule.criteria}
                          </Badge>
                          <Badge variant="secondary" className="ml-2">
                            优先级 {rule.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">策略: </span>
                        <Badge variant="outline">{rule.strategy}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">分配给: </span>
                        <span className="font-medium">{rule.assignedTo}</span>
                      </div>
                      {rule.stats.leads > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">已分配: </span>
                            <span className="font-medium">{rule.stats.leads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-muted-foreground">转化率: </span>
                            <span className="font-medium text-green-600">{rule.stats.conversion}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">平均响应: </span>
                            <span className="font-medium">{rule.stats.avgTime}s</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                团队容量监控
              </CardTitle>
              <CardDescription>各销售团队当前负载情况与可用容量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Team Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {teamCapacity.map((team) => (
                    <div key={team.team} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="font-medium">{team.team}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {team.members} 人团队
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>当前负载</span>
                          <span className="font-medium">{team.current}/{team.capacity}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              team.current / team.capacity > 0.8 ? 'bg-red-500' : 
                              team.current / team.capacity > 0.6 ? 'bg-orange-500' : 
                              'bg-blue-500'
                            }`}
                            style={{ width: `${(team.current / team.capacity) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">可用容量</span>
                          <span className={team.available > 20 ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                            {team.available}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-4">团队负载分布</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={teamCapacity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" name="当前负载" fill="#3B82F6" />
                      <Bar dataKey="available" name="可用容量" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                分配记录
              </CardTitle>
              <CardDescription>最近的线索分配记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>线索名称</TableHead>
                    <TableHead>来源</TableHead>
                    <TableHead>分配对象</TableHead>
                    <TableHead>使用规则</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.leadName}</TableCell>
                      <TableCell>{record.fromPool}</TableCell>
                      <TableCell>{record.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.rule}</Badge>
                      </TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          成功
                        </Badge>
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
            {/* Weekly Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  本周分配趋势
                </CardTitle>
                <CardDescription>每日分配数量与转化对比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyAssignments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="assigned" name="分配数" fill="#3B82F6" />
                    <Bar dataKey="converted" name="转化数" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Strategy Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  策略使用分布
                </CardTitle>
                <CardDescription>各分配策略使用占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={strategyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {strategyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  转化率趋势
                </CardTitle>
                <CardDescription>近6周分配转化率变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={conversionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 50]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="转化率" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      转化率持续上升，较上周提升 4%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LeadAssignmentPage