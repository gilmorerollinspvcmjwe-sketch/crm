/**
 * MeetingAssistant - 会议助手
 * Meeting Assistant Page
 * Features: 会议记录上传、AI分析结果、关键信息提取、会议纪要生成、跟进任务创建
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Brain,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  RefreshCw,
  Download,
  Zap,
  Mic,
  Sparkles,
  Send,
  Plus,
  Upload,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Target,
  MessageSquare,
  ListTodo,
  Copy,
  Share2,
  Edit,
  Trash2,
  Eye,
  User,
  Clock3,
  BarChart3,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for meeting creation
const meetingCreateSchema = z.object({
  title: z.string().min(1, '会议标题必填'),
  customer: z.string().min(1, '客户名称必填'),
  participants: z.string().optional(),
  scheduledTime: z.string().optional(),
  meetingType: z.enum(['customer', 'internal', 'demo', 'negotiation']),
  notes: z.string().optional(),
})

type MeetingCreateForm = z.infer<typeof meetingCreateSchema>

// Schema for task creation
const taskCreateSchema = z.object({
  taskName: z.string().min(1, '任务名称必填'),
  assignee: z.string().min(1, '负责人必填'),
  dueDate: z.string().min(1, '截止日期必填'),
  priority: z.enum(['high', 'medium', 'low']),
  description: z.string().optional(),
})

type TaskCreateForm = z.infer<typeof taskCreateSchema>

// Mock upcoming meetings
const upcomingMeetings = [
  {
    id: '1',
    title: '客户方案讨论',
    customer: '科技公司A',
    time: '14:00',
    date: '今天',
    duration: 60,
    participants: ['张三', '李四', '客户方2人'],
    preparation: ['方案文档', '报价单', '案例'],
    aiSuggestions: ['重点关注预算问题', '准备竞品对比', '确认决策流程'],
    meetingType: 'customer',
    status: 'scheduled',
  },
  {
    id: '2',
    title: '合同签约会议',
    customer: '金融公司B',
    time: '15:30',
    date: '今天',
    duration: 30,
    participants: ['王五', '法务1人', '客户方3人'],
    preparation: ['合同文本', '附件材料', '签章准备'],
    aiSuggestions: ['确认付款条款', '准备签署流程', '核对合同细节'],
    meetingType: 'negotiation',
    status: 'scheduled',
  },
  {
    id: '3',
    title: '产品演示',
    customer: '教育机构C',
    time: '16:00',
    date: '今天',
    duration: 45,
    participants: ['赵六', '技术1人', '客户方4人'],
    preparation: ['演示环境', '操作手册', '演示账号'],
    aiSuggestions: ['突出核心功能', '准备答疑', '收集反馈问题'],
    meetingType: 'demo',
    status: 'scheduled',
  },
]

// Mock meeting history with AI analysis
const meetingHistory = [
  {
    id: '1',
    title: '客户需求调研',
    customer: '科技公司D',
    date: '2024-01-15',
    duration: 45,
    summary: '会议讨论了客户的核心需求，包括CRM系统集成、数据迁移方案、培训计划等关键议题。',
    keyPoints: [
      '客户需要迁移5年历史数据',
      '要求支持移动端访问',
      '预算范围: 50-80万',
      '决策周期: 约3个月',
    ],
    actionItems: [
      { task: '准备数据迁移方案', assignee: '技术部', status: 'completed' },
      { task: '发送移动端演示视频', assignee: '张三', status: 'completed' },
      { task: '制定培训计划', assignee: '李四', status: 'pending' },
    ],
    followUps: 3,
    sentiment: 'positive',
    riskLevel: 'low',
  },
  {
    id: '2',
    title: '方案评审',
    customer: '金融公司E',
    date: '2024-01-14',
    duration: 60,
    summary: '客户对方案整体满意，但在定价方面存在分歧，需要进一步商务谈判。',
    keyPoints: [
      '客户认可方案技术架构',
      '对价格有异议，期望20%折扣',
      '竞品价格更低但功能不足',
      '最终决策人下周回国',
    ],
    actionItems: [
      { task: '准备折扣申请', assignee: '王五', status: 'completed' },
      { task: '对比竞品功能', assignee: '产品部', status: 'completed' },
      { task: '安排最终演示', assignee: '张三', status: 'processing' },
    ],
    followUps: 5,
    sentiment: 'neutral',
    riskLevel: 'medium',
  },
  {
    id: '3',
    title: '合同谈判',
    customer: '教育机构F',
    date: '2024-01-13',
    duration: 30,
    summary: '合同主要条款已确认，仅剩付款方式需要进一步协商。',
    keyPoints: [
      '合同金额: 35万',
      '付款方式: 需协商分期',
      '实施周期: 2个月',
      '培训要求: 2场现场培训',
    ],
    actionItems: [
      { task: '确认付款方案', assignee: '财务部', status: 'processing' },
      { task: '准备实施计划', assignee: '实施部', status: 'pending' },
    ],
    followUps: 2,
    sentiment: 'positive',
    riskLevel: 'low',
  },
]

// Meeting templates
const meetingTemplates = [
  { 
    name: '客户拜访', 
    duration: 60, 
    phases: ['开场寒暄', '需求确认', '方案介绍', '答疑讨论', '结束总结'],
    icon: Users,
  },
  { 
    name: '产品演示', 
    duration: 45, 
    phases: ['背景介绍', '功能演示', '案例分析', '互动答疑'],
    icon: Video,
  },
  { 
    name: '签约会议', 
    duration: 30, 
    phases: ['条款确认', '问题解决', '签署流程', '后续安排'],
    icon: FileText,
  },
  { 
    name: '回访沟通', 
    duration: 20, 
    phases: ['满意度询问', '问题收集', '改进建议', '续约探讨'],
    icon: MessageSquare,
  },
]

// AI assistant features
const aiFeatures = [
  { name: '实时转录', description: '自动将会议内容转录为文字', enabled: true, icon: Mic },
  { name: '智能摘要', description: 'AI自动生成会议要点摘要', enabled: true, icon: Sparkles },
  { name: '待办提取', description: '自动识别并创建待办事项', enabled: true, icon: ListTodo },
  { name: '情感分析', description: '分析会议氛围和客户情绪', enabled: false, icon: Brain },
  { name: '关键词标记', description: '自动标记重要关键词', enabled: true, icon: Target },
  { name: '智能提醒', description: '关键信息实时提醒', enabled: false, icon: Zap },
]

// Meeting stats
const meetingStats = {
  todayMeetings: 8,
  totalParticipants: 24,
  aiSuggestionsGenerated: 15,
  avgDuration: 45,
  transcriptionHours: 12.5,
  summaryGenerated: 156,
  actionItemsCreated: 89,
  followUpRate: 85,
}

// Sample transcription
const sampleTranscription = `
[14:00] 张三: 各位好，今天我们来讨论一下科技公司A的CRM系统需求。

[14:02] 客户: 我们主要是想了解系统的数据迁移功能，因为我们有5年的历史数据需要迁移。

[14:05] 李四: 好的，我们的系统支持多种数据格式导入，包括Excel、CSV和数据库直连。请问你们目前使用的是什么系统？

[14:08] 客户: 我们现在用的是某国际品牌的CRM，数据量大概有50万条记录。

[14:10] 张三: 这个数据量我们的系统完全可以处理。关于预算方面，您方便透露一下范围吗？

[14:12] 客户: 我们的预算大概在50到80万之间，具体要看方案的完整性。

[14:15] 李四: 好的，我们会根据您的需求准备详细方案。另外想确认一下，你们需要移动端支持吗？

[14:17] 客户: 是的，我们的销售团队经常外出，移动端是必须的。

[14:20] 张三: 明白了。总结一下：数据迁移50万条、预算50-80万、需要移动端支持。我们会在本周内提交初步方案。
`

export function MeetingAssistantPage() {
  const [viewType, setViewType] = React.useState('upcoming')
  const [showMeetingDialog, setShowMeetingDialog] = React.useState(false)
  const [showTaskDialog, setShowTaskDialog] = React.useState(false)
  const [selectedMeeting, setSelectedMeeting] = React.useState<typeof meetingHistory[0] | null>(null)
  const [isRecording, setIsRecording] = React.useState(false)
  const [transcription, setTranscription] = React.useState('')

  const meetingForm = useForm<MeetingCreateForm>({
    resolver: zodResolver(meetingCreateSchema),
    defaultValues: {
      title: '',
      customer: '',
      participants: '',
      scheduledTime: '',
      meetingType: 'customer',
      notes: '',
    },
  })

  const taskForm = useForm<TaskCreateForm>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      taskName: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      description: '',
    },
  })

  const onCreateMeeting = (data: MeetingCreateForm) => {
    console.log('创建会议:', data)
    setShowMeetingDialog(false)
    meetingForm.reset()
  }

  const onCreateTask = (data: TaskCreateForm) => {
    console.log('创建任务:', data)
    setShowTaskDialog(false)
    taskForm.reset()
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTranscription(sampleTranscription)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">会议助手</h1>
            <p className="text-muted-foreground">AI辅助会议准备、记录与跟进</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            上传录音
          </Button>
          <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建会议
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>创建新会议</DialogTitle>
                <DialogDescription>安排新的客户会议</DialogDescription>
              </DialogHeader>
              <form onSubmit={meetingForm.handleSubmit(onCreateMeeting)} className="space-y-4">
                <div>
                  <Label htmlFor="title">会议标题</Label>
                  <Input
                    id="title"
                    {...meetingForm.register('title')}
                    placeholder="例如：客户方案讨论"
                  />
                  {meetingForm.formState.errors.title && (
                    <p className="text-sm text-red-500">{meetingForm.formState.errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customer">客户名称</Label>
                  <Input
                    id="customer"
                    {...meetingForm.register('customer')}
                    placeholder="客户公司名称"
                  />
                  {meetingForm.formState.errors.customer && (
                    <p className="text-sm text-red-500">{meetingForm.formState.errors.customer.message}</p>
                  )}
                </div>
                <div>
                  <Label>会议类型</Label>
                  <Select 
                    value={meetingForm.watch('meetingType')} 
                    onValueChange={(v) => meetingForm.setValue('meetingType', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">客户拜访</SelectItem>
                      <SelectItem value="demo">产品演示</SelectItem>
                      <SelectItem value="negotiation">商务谈判</SelectItem>
                      <SelectItem value="internal">内部会议</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledTime">计划时间</Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    {...meetingForm.register('scheduledTime')}
                  />
                </div>
                <div>
                  <Label htmlFor="participants">参会人员</Label>
                  <Input
                    id="participants"
                    {...meetingForm.register('participants')}
                    placeholder="多人用逗号分隔"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">备注</Label>
                  <Textarea
                    id="notes"
                    {...meetingForm.register('notes')}
                    placeholder="会议相关备注"
                    rows={2}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowMeetingDialog(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    创建会议
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
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">今日会议</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{meetingStats.todayMeetings}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">参会人员</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{meetingStats.totalParticipants}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">AI建议</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{meetingStats.aiSuggestionsGenerated}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均时长</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{meetingStats.avgDuration}分钟</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <ListTodo className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">待办创建</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">{meetingStats.actionItemsCreated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upcoming">即将开始</TabsTrigger>
          <TabsTrigger value="history">历史会议</TabsTrigger>
          <TabsTrigger value="recording">实时记录</TabsTrigger>
          <TabsTrigger value="templates">会议模板</TabsTrigger>
          <TabsTrigger value="assistant">AI助手</TabsTrigger>
        </TabsList>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                今日会议日程
              </CardTitle>
              <CardDescription>即将开始的会议及AI准备建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="default">{meeting.time}</Badge>
                        <span className="font-medium">{meeting.title}</span>
                        <span className="text-sm text-muted-foreground">- {meeting.customer}</span>
                        <Badge variant="outline">{meeting.duration}分钟</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          开始会议
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-muted-foreground">参会人员: </span>
                        <span className="text-sm">{meeting.participants.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">准备材料: </span>
                        <span className="text-sm">{meeting.preparation.join(', ')}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">AI建议</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meeting.aiSuggestions.map((suggestion) => (
                          <Badge key={suggestion} variant="outline" className="text-xs bg-white">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5" />
                    历史会议
                  </CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部会议</SelectItem>
                      <SelectItem value="week">本周</SelectItem>
                      <SelectItem value="month">本月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>已完成的会议记录与AI生成的摘要</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetingHistory.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMeeting?.id === meeting.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{meeting.title}</span>
                          <Badge variant="outline">{meeting.customer}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{meeting.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{meeting.summary}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={meeting.sentiment === 'positive' ? 'default' : 'secondary'}
                          className={meeting.sentiment === 'positive' ? 'bg-green-500' : ''}>
                          {meeting.sentiment === 'positive' ? '积极' : meeting.sentiment === 'neutral' ? '中性' : '消极'}
                        </Badge>
                        <Badge variant="default">
                          <FileText className="h-3 w-3 mr-1" />
                          已生成摘要
                        </Badge>
                        <Badge variant="outline">
                          {meeting.followUps} 待跟进
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  导出全部会议记录
                </Button>
              </CardContent>
            </Card>

            {/* Meeting Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  会议详情
                </CardTitle>
                <CardDescription>
                  {selectedMeeting ? selectedMeeting.title : '选择会议查看详情'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMeeting ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-1">会议摘要</div>
                      <p className="text-sm text-muted-foreground">{selectedMeeting.summary}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">关键要点</div>
                      <div className="space-y-2">
                        {selectedMeeting.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">待办事项</div>
                      <div className="space-y-2">
                        {selectedMeeting.actionItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                            <span>{item.task}</span>
                            <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}
                              className={item.status === 'completed' ? 'bg-green-500' : ''}>
                              {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '进行中' : '待处理'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Copy className="h-4 w-4 mr-1" />
                        复制摘要
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-1" />
                        分享
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>点击左侧会议查看详情</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recording Tab */}
        <TabsContent value="recording" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                实时会议记录
              </CardTitle>
              <CardDescription>AI实时转录与智能分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recording Controls */}
                <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
                  <Button
                    size="lg"
                    variant={isRecording ? 'destructive' : 'default'}
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-5 w-5 mr-2" />
                        停止录音
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        开始录音
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="font-medium">录音中...</span>
                    </div>
                  )}
                </div>

                {/* Transcription Area */}
                <div className="border rounded-lg p-4 min-h-[300px] bg-white">
                  {transcription ? (
                    <pre className="text-sm whitespace-pre-wrap font-sans">{transcription}</pre>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Mic className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>点击开始录音后，转录内容将在此显示</p>
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                {transcription && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">AI实时分析</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>检测到客户预算需求: 50-80万</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>数据迁移需求已记录</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span>待确认: 移动端功能需求</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <ListTodo className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-600">自动识别待办</span>
                      </div>
                      <div className="space-y-2">
                        {['提交初步方案', '确认移动端需求', '安排下次会议'].map((task, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded text-sm">
                            <Checkbox />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>会议模板</CardTitle>
              <CardDescription>预设的会议流程模板</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {meetingTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <div key={template.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{template.name}</span>
                        </div>
                        <Badge variant="outline">{template.duration}分钟</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">流程阶段:</div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.phases.map((phase, idx) => (
                          <Badge key={phase} variant="secondary" className="text-xs">
                            {idx + 1}. {phase}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        使用模板
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI 会议助手配置
              </CardTitle>
              <CardDescription>配置会议辅助功能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <span className="font-medium">{feature.name}</span>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <Switch checked={feature.enabled} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">已生成摘要</span>
                    <div className="text-2xl font-bold">{meetingStats.summaryGenerated}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">转录时长</span>
                    <div className="text-2xl font-bold">{meetingStats.transcriptionHours}小时</div>
                  </div>
                </div>
              </div>
              <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    创建跟进任务
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>创建跟进任务</DialogTitle>
                    <DialogDescription>为会议创建后续跟进任务</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={taskForm.handleSubmit(onCreateTask)} className="space-y-4">
                    <div>
                      <Label htmlFor="taskName">任务名称</Label>
                      <Input
                        id="taskName"
                        {...taskForm.register('taskName')}
                        placeholder="任务描述"
                      />
                      {taskForm.formState.errors.taskName && (
                        <p className="text-sm text-red-500">{taskForm.formState.errors.taskName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="assignee">负责人</Label>
                      <Input
                        id="assignee"
                        {...taskForm.register('assignee')}
                        placeholder="负责人姓名"
                      />
                      {taskForm.formState.errors.assignee && (
                        <p className="text-sm text-red-500">{taskForm.formState.errors.assignee.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dueDate">截止日期</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        {...taskForm.register('dueDate')}
                      />
                      {taskForm.formState.errors.dueDate && (
                        <p className="text-sm text-red-500">{taskForm.formState.errors.dueDate.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>优先级</Label>
                      <Select 
                        value={taskForm.watch('priority')} 
                        onValueChange={(v) => taskForm.setValue('priority', v as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">高优先级</SelectItem>
                          <SelectItem value="medium">中优先级</SelectItem>
                          <SelectItem value="low">低优先级</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">任务描述</Label>
                      <Textarea
                        id="description"
                        {...taskForm.register('description')}
                        placeholder="详细描述"
                        rows={2}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowTaskDialog(false)}>
                        取消
                      </Button>
                      <Button type="submit">
                        创建任务
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MeetingAssistantPage