/**
 * WorkflowLogs - 工作流执行日志
 * Workflow Execution Logs Page
 */

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  History,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Calendar,
  Activity,
  Zap,
} from 'lucide-react'

// Mock log data
interface LogItem {
  id: string
  workflowName: string
  trigger: string
  status: 'success' | 'failed' | 'running'
  startTime: string
  duration: string
  details: string
}

const logs: LogItem[] = [
  {
    id: 'LOG001',
    workflowName: '新线索自动分配',
    trigger: '新线索创建: 线索#12345',
    status: 'success',
    startTime: '2024-01-20 14:35:22',
    duration: '2.3s',
    details: '成功分配给华东一队',
  },
  {
    id: 'LOG002',
    workflowName: '合同到期提醒',
    trigger: '定时触发: 每日09:00',
    status: 'success',
    startTime: '2024-01-20 09:00:15',
    duration: '5.8s',
    details: '发送3条提醒邮件',
  },
  {
    id: 'LOG003',
    workflowName: '客户生日关怀',
    trigger: '定时触发: 每日08:00',
    status: 'success',
    startTime: '2024-01-20 08:00:10',
    duration: '3.2s',
    details: '发送2条生日祝福',
  },
  {
    id: 'LOG004',
    workflowName: '新线索自动分配',
    trigger: '新线索创建: 线索#12346',
    status: 'failed',
    startTime: '2024-01-20 14:40:18',
    duration: '-',
    details: '分配失败: 团队容量不足',
  },
  {
    id: 'LOG005',
    workflowName: '商机跟进提醒',
    trigger: '商机状态变化: 商机#5678',
    status: 'running',
    startTime: '2024-01-20 15:00:00',
    duration: '进行中',
    details: '正在执行...',
  },
  {
    id: 'LOG006',
    workflowName: '合同到期提醒',
    trigger: '定时触发: 每日09:00',
    status: 'success',
    startTime: '2024-01-19 09:00:12',
    duration: '6.1s',
    details: '发送5条提醒邮件',
  },
  {
    id: 'LOG007',
    workflowName: '客户流失预警',
    trigger: '客户活跃度检测',
    status: 'success',
    startTime: '2024-01-19 10:00:00',
    duration: '15.2s',
    details: '标记2家客户为预警状态',
  },
]

const stats = {
  total: 1256,
  success: 1198,
  failed: 45,
  running: 13,
  avgDuration: 3.5,
}

export function WorkflowLogsPage() {
  const [statusFilter, setStatusFilter] = React.useState('all')

  const columns: ColumnDef<LogItem>[] = [
    {
      accessorKey: 'id',
      header: '日志ID',
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{row.original.id}</code>
      ),
    },
    {
      accessorKey: 'workflowName',
      header: '工作流',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.workflowName}</Badge>
      ),
    },
    {
      accessorKey: 'trigger',
      header: '触发源',
      cell: ({ row }) => (
        <span className="text-sm truncate max-w-[200px]">{row.original.trigger}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const statusIcons = {
          success: <CheckCircle className="h-4 w-4 text-green-500" />,
          failed: <XCircle className="h-4 w-4 text-red-500" />,
          running: <Activity className="h-4 w-4 text-blue-500 animate-pulse" />,
        }
        const statusColors = {
          success: 'bg-green-100 text-green-700',
          failed: 'bg-red-100 text-red-700',
          running: 'bg-blue-100 text-blue-700',
        }
        return (
          <Badge className={statusColors[row.original.status]}>
            {statusIcons[row.original.status]}
            <span className="ml-1">
              {row.original.status === 'success' ? '成功' :
               row.original.status === 'failed' ? '失败' : '运行中'}
            </span>
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
        <span className="text-sm font-medium">{row.original.duration}</span>
      ),
    },
    {
      accessorKey: 'details',
      header: '执行详情',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
          {row.original.details}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4 mr-1" />
          详情
        </Button>
      ),
    },
  ]

  const filteredLogs = statusFilter === 'all'
    ? logs
    : logs.filter(log => log.status === statusFilter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">执行日志</h1>
            <p className="text-muted-foreground">工作流执行历史与状态监控</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="success">成功</SelectItem>
              <SelectItem value="failed">失败</SelectItem>
              <SelectItem value="running">运行中</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出日志
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
            <div className="text-3xl font-bold text-purple-600">{stats.avgDuration}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>执行日志列表</CardTitle>
          <CardDescription>工作流执行历史记录</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredLogs}
            showSearch
            searchPlaceholder="搜索日志..."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkflowLogsPage