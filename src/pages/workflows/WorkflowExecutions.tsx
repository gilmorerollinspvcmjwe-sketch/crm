/**
 * WorkflowExecutions - 执行记录
 * Workflow Executions Page
 */

import * as React from 'react'
import {
  History,
  Play,
  Pause,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Calendar,
  Activity,
  Zap,
  User,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  ArrowUpDown,
  MoreHorizontal,
  Copy,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

// ============ Types ============

interface Execution {
  id: string
  workflowId: string
  workflowName: string
  trigger: string
  triggerSource: string
  status: 'success' | 'failed' | 'running' | 'cancelled'
  startTime: string
  endTime?: string
  duration?: string
  stepsCompleted: number
  totalSteps: number
  result?: string
  errorMessage?: string
  initiatedBy: string
}

interface WorkflowStepLog {
  stepId: string
  stepName: string
  stepType: 'trigger' | 'action' | 'condition' | 'delay'
  status: 'success' | 'failed' | 'skipped' | 'running'
  duration?: string
  startTime: string
  endTime?: string
  input?: Record<string, string>
  output?: Record<string, string>
  error?: string
}

// ============ Mock Data ============

const executions: Execution[] = [
  {
    id: 'exec_20240120143522',
    workflowId: 'wf_001',
    workflowName: '新线索自动分配',
    trigger: '新线索创建',
    triggerSource: '线索#12345 - 李四 (线上)',
    status: 'success',
    startTime: '2024-01-20 14:35:22',
    endTime: '2024-01-20 14:35:24',
    duration: '2.3s',
    stepsCompleted: 6,
    totalSteps: 6,
    result: '成功分配给华东一队',
    initiatedBy: '系统',
  },
  {
    id: 'exec_20240120122015',
    workflowId: 'wf_001',
    workflowName: '新线索自动分配',
    trigger: '新线索创建',
    triggerSource: '线索#12344 - 王五 (线下)',
    status: 'success',
    startTime: '2024-01-20 12:20:15',
    endTime: '2024-01-20 12:20:18',
    duration: '2.5s',
    stepsCompleted: 6,
    totalSteps: 6,
    result: '成功分配给华西团队',
    initiatedBy: '系统',
  },
  {
    id: 'exec_20240120100533',
    workflowId: 'wf_001',
    workflowName: '新线索自动分配',
    trigger: '新线索创建',
    triggerSource: '线索#12343 - 赵六',
    status: 'failed',
    startTime: '2024-01-20 10:05:33',
    endTime: '2024-01-20 10:06:21',
    duration: '0.8s',
    stepsCompleted: 2,
    totalSteps: 6,
    result: '分配失败',
    errorMessage: '团队容量已满，无法分配',
    initiatedBy: '系统',
  },
  {
    id: 'exec_20240120083000',
    workflowId: 'wf_001',
    workflowName: '新线索自动分配',
    trigger: '新线索创建',
    triggerSource: '线索#12342 - 钱七',
    status: 'success',
    startTime: '2024-01-20 08:30:00',
    endTime: '2024-01-20 08:30:02',
    duration: '1.9s',
    stepsCompleted: 6,
    totalSteps: 6,
    result: '成功分配给华东一队',
    initiatedBy: '系统',
  },
  {
    id: 'exec_20240119230000',
    workflowId: 'wf_002',
    workflowName: '合同到期提醒',
    trigger: '定时触发',
    triggerSource: '每日09:00定时任务',
    status: 'success',
    startTime: '2024-01-19 09:00:12',
    endTime: '2024-01-19 09:00:18',
    duration: '5.8s',
    stepsCompleted: 4,
    totalSteps: 4,
    result: '发送3条提醒邮件',
    initiatedBy: '系统',
  },
  {
    id: 'exec_20240119100000',
    workflowId: 'wf_003',
    workflowName: '客户流失预警',
    trigger: '客户活跃度检测',
    triggerSource: '批量检测任务',
    status: 'success',
    startTime: '2024-01-19 10:00:00',
    endTime: '2024-01-19 10:00:15',
    duration: '15.2s',
    stepsCompleted: 5,
    totalSteps: 5,
    result: '标记2家客户为预警状态',
    initiatedBy: '张三',
  },
  {
    id: 'exec_20240120150000',
    workflowId: 'wf_001',
    workflowName: '新线索自动分配',
    trigger: '新线索创建',
    triggerSource: '线索#12346 - 孙八',
    status: 'running',
    startTime: '2024-01-20 15:00:00',
    stepsCompleted: 3,
    totalSteps: 6,
    initiatedBy: '系统',
  },
  {
    id: 'exec_20240119183000',
    workflowId: 'wf_004',
    workflowName: '商机跟进提醒',
    trigger: '商机状态变更',
    triggerSource: '商机#5678',
    status: 'failed',
    startTime: '2024-01-19 18:30:00',
    endTime: '2024-01-19 18:30:05',
    duration: '5.2s',
    stepsCompleted: 1,
    totalSteps: 3,
    result: '执行失败',
    errorMessage: '未找到商机负责人',
    initiatedBy: '系统',
  },
]

const stats = {
  total: 1256,
  success: 1198,
  failed: 45,
  running: 13,
  avgDuration: '3.5s',
}

// ============ Step Log Detail ============

function ExecutionDetailDialog({
  execution,
  open,
  onOpenChange,
}: {
  execution: Execution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!execution) return null

  const stepLogs: WorkflowStepLog[] = [
    { stepId: 's1', stepName: '检查线索来源', stepType: 'action', status: 'success', duration: '0.3s', startTime: execution.startTime, endTime: '2024-01-20 14:35:22' },
    { stepId: 's2', stepName: '判断是否来自线上', stepType: 'condition', status: execution.stepsCompleted >= 2 ? 'success' : 'running', duration: '0.1s', startTime: '2024-01-20 14:35:22', endTime: '2024-01-20 14:35:22' },
    { stepId: 's3', stepName: '分配给华东一队', stepType: 'action', status: execution.stepsCompleted >= 3 ? 'success' : 'running', duration: '0.8s', startTime: '2024-01-20 14:35:23', endTime: '2024-01-20 14:35:24' },
    { stepId: 's4', stepName: '等待1天', stepType: 'delay', status: execution.stepsCompleted >= 4 ? 'skipped' : 'running', duration: '-', startTime: '-', endTime: '-' },
    { stepId: 's5', stepName: '发送分配通知', stepType: 'action', status: execution.stepsCompleted >= 5 ? 'success' : 'running', duration: '1.1s', startTime: '2024-01-20 14:35:24', endTime: '2024-01-20 14:35:24' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>执行详情</DialogTitle>
          <DialogDescription>
            {execution.workflowName} - {execution.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">状态</div>
              <Badge className={cn(
                execution.status === 'success' ? 'bg-green-500' :
                execution.status === 'failed' ? 'bg-red-500' :
                execution.status === 'running' ? 'bg-blue-500' : 'bg-gray-400'
              )}>
                {execution.status === 'success' ? '成功' :
                 execution.status === 'failed' ? '失败' :
                 execution.status === 'running' ? '运行中' : '已取消'}
              </Badge>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">耗时</div>
              <div className="font-semibold">{execution.duration || '-'}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">执行进度</div>
              <div className="font-semibold">{execution.stepsCompleted}/{execution.totalSteps} 步骤</div>
            </div>
          </div>

          {/* Trigger Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-700 font-medium mb-1">触发源</div>
            <div className="text-sm text-blue-900">{execution.triggerSource}</div>
          </div>

          {/* Error Message */}
          {execution.errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-xs text-red-700 font-medium mb-1">错误信息</div>
              <div className="text-sm text-red-900">{execution.errorMessage}</div>
            </div>
          )}

          {/* Result */}
          {execution.result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-green-700 font-medium mb-1">执行结果</div>
              <div className="text-sm text-green-900">{execution.result}</div>
            </div>
          )}

          {/* Step Logs */}
          <div>
            <h4 className="font-medium text-sm mb-3">执行步骤</h4>
            <div className="space-y-2">
              {stepLogs.map((step, index) => (
                <div key={step.stepId} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      step.status === 'success' ? 'bg-green-100 text-green-600' :
                      step.status === 'failed' ? 'bg-red-100 text-red-600' :
                      step.status === 'running' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {step.status === 'success' ? <CheckCircle className="h-3 w-3" /> :
                       step.status === 'failed' ? <XCircle className="h-3 w-3" /> :
                       step.status === 'running' ? <Activity className="h-3 w-3 animate-pulse" /> :
                       <AlertCircle className="h-3 w-3" />}
                    </div>
                    {index < stepLogs.length - 1 && (
                      <div className="w-px h-6 bg-border mt-1" />
                    )}
                  </div>
                  <div className={cn(
                    'flex-1 rounded-lg border p-2',
                    step.status === 'skipped' ? 'bg-muted/30 opacity-60' : 'bg-card'
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{step.stepName}</span>
                        <Badge variant="outline" className="text-xs">
                          {step.stepType}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{step.duration}</span>
                    </div>
                    {step.error && (
                      <div className="text-xs text-red-600 mt-1">{step.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============ Main Component ============

export function WorkflowExecutionsPage() {
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [workflowFilter, setWorkflowFilter] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('7d')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedExecution, setSelectedExecution] = React.useState<Execution | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const filteredExecutions = executions.filter(exec => {
    if (statusFilter !== 'all' && exec.status !== statusFilter) return false
    if (workflowFilter !== 'all' && exec.workflowId !== workflowFilter) return false
    if (searchQuery && !exec.triggerSource.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !exec.workflowName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleViewDetail = (execution: Execution) => {
    setSelectedExecution(execution)
    setDetailOpen(true)
  }

  const columns: ColumnDef<Execution>[] = [
    {
      accessorKey: 'id',
      header: '执行ID',
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
          {row.original.id.slice(-8)}
        </code>
      ),
    },
    {
      accessorKey: 'workflowName',
      header: '工作流',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-sm">{row.original.workflowName}</div>
          <div className="text-xs text-muted-foreground">{row.original.trigger}</div>
        </div>
      ),
    },
    {
      accessorKey: 'triggerSource',
      header: '触发源',
      cell: ({ row }) => (
        <span className="text-sm truncate max-w-[200px] block" title={row.original.triggerSource}>
          {row.original.triggerSource}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const statusConfig = {
          success: { bg: 'bg-green-100 text-green-700', icon: CheckCircle, label: '成功' },
          failed: { bg: 'bg-red-100 text-red-700', icon: XCircle, label: '失败' },
          running: { bg: 'bg-blue-100 text-blue-700', icon: Activity, label: '运行中' },
          cancelled: { bg: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: '已取消' },
        }
        const config = statusConfig[row.original.status]
        const Icon = config.icon
        return (
          <Badge className={config.bg}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'startTime',
      header: '开始时间',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.startTime}</span>
      ),
    },
    {
      accessorKey: 'duration',
      header: '耗时',
      cell: ({ row }) => (
        <span className={cn(
          'text-sm font-medium',
          row.original.status === 'failed' && 'text-red-600'
        )}>
          {row.original.duration || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'stepsCompleted',
      header: '进度',
      cell: ({ row }) => {
        const progress = (row.original.stepsCompleted / row.original.totalSteps) * 100
        return (
          <div className="w-20">
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">
                {row.original.stepsCompleted}/{row.original.totalSteps}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleViewDetail(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                复制执行ID
              </DropdownMenuItem>
              {row.original.status === 'failed' && (
                <DropdownMenuItem>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  重新执行
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                查看工作流
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">执行记录</h1>
            <p className="text-muted-foreground">工作流执行历史与状态追踪</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <History className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">总执行数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">成功</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.success}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">失败</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">运行中</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.running}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">平均耗时</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.avgDuration}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索触发源..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="工作流" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部工作流</SelectItem>
                <SelectItem value="wf_001">新线索自动分配</SelectItem>
                <SelectItem value="wf_002">合同到期提醒</SelectItem>
                <SelectItem value="wf_003">客户流失预警</SelectItem>
                <SelectItem value="wf_004">商机跟进提醒</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
                <SelectItem value="running">运行中</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="7d">最近7天</SelectItem>
                <SelectItem value="30d">最近30天</SelectItem>
                <SelectItem value="90d">最近90天</SelectItem>
                <SelectItem value="custom">自定义</SelectItem>
              </SelectContent>
            </Select>

            {(statusFilter !== 'all' || workflowFilter !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('all')
                  setWorkflowFilter('all')
                  setSearchQuery('')
                }}
              >
                <X className="h-4 w-4 mr-1" />
                清除筛选
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Executions Table */}
      <Card>
        <CardHeader>
          <CardTitle>执行记录列表</CardTitle>
          <CardDescription>
            共 {filteredExecutions.length} 条记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredExecutions}
            searchPlaceholder="搜索执行记录..."
          />
        </CardContent>
      </Card>

      {/* Execution Detail Dialog */}
      <ExecutionDetailDialog
        execution={selectedExecution}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export default WorkflowExecutionsPage
