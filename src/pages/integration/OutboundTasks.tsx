/**
 * OutboundTasks - 呼叫中心外呼任务
 * Call Center Outbound Tasks Page
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
  Phone,
  Plus,
  Play,
  Pause,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  PhoneCall,
  PhoneMissed,
  RefreshCw,
  Eye,
  MessageSquare,
  Calendar,
  Activity,
  BarChart3,
} from 'lucide-react'

// Mock outbound tasks
interface OutboundTask {
  id: string
  name: string
  type: 'sales' | 'service' | 'survey' | 'reminder'
  status: 'running' | 'paused' | 'completed' | 'draft'
  targetList: string
  totalCalls: number
  completedCalls: number
  connectedCalls: number
  successRate: number
  startTime: string
  estimatedTime: string
}

const outboundTasks: OutboundTask[] = [
  {
    id: 'OT001',
    name: '新产品推广',
    type: 'sales',
    status: 'running',
    targetList: 'VIP客户群',
    totalCalls: 85,
    completedCalls: 45,
    connectedCalls: 38,
    successRate: 84,
    startTime: '2024-01-20 09:00',
    estimatedTime: '4小时',
  },
  {
    id: 'OT002',
    name: '续约提醒',
    type: 'reminder',
    status: 'running',
    targetList: '即将到期客户',
    totalCalls: 45,
    completedCalls: 20,
    connectedCalls: 18,
    successRate: 90,
    startTime: '2024-01-20 10:00',
    estimatedTime: '2小时',
  },
  {
    id: 'OT003',
    name: '满意度调研',
    type: 'survey',
    status: 'paused',
    targetList: '近期签约客户',
    totalCalls: 50,
    completedCalls: 25,
    connectedCalls: 20,
    successRate: 80,
    startTime: '2024-01-20 14:00',
    estimatedTime: '3小时',
  },
  {
    id: 'OT004',
    name: '服务回访',
    type: 'service',
    status: 'completed',
    targetList: '投诉处理客户',
    totalCalls: 23,
    completedCalls: 23,
    connectedCalls: 21,
    successRate: 91,
    startTime: '2024-01-19 10:00',
    estimatedTime: '已完成',
  },
  {
    id: 'OT005',
    name: '活动邀请',
    type: 'sales',
    status: 'draft',
    targetList: '行业推广-互联网',
    totalCalls: 98,
    completedCalls: 0,
    connectedCalls: 0,
    successRate: 0,
    startTime: '-',
    estimatedTime: '待安排',
  },
]

const stats = {
  totalTasks: 5,
  activeTasks: 2,
  totalCalls: 156,
  connectRate: 85,
  avgDuration: '3分钟',
}

export function OutboundTasksPage() {
  const [statusFilter, setStatusFilter] = React.useState('all')

  const columns: ColumnDef<OutboundTask>[] = [
    {
      accessorKey: 'name',
      header: '任务名称',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: '任务类型',
      cell: ({ row }) => {
        const typeLabels = {
          sales: '销售推广',
          service: '服务回访',
          survey: '满意度调研',
          reminder: '续约提醒',
        }
        const typeColors = {
          sales: 'bg-blue-100 text-blue-700',
          service: 'bg-green-100 text-green-700',
          survey: 'bg-purple-100 text-purple-700',
          reminder: 'bg-yellow-100 text-yellow-700',
        }
        return (
          <Badge className={typeColors[row.original.type]}>
            {typeLabels[row.original.type]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'targetList',
      header: '目标列表',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.targetList}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const statusColors = {
          running: 'bg-green-500',
          paused: 'bg-yellow-500',
          completed: 'bg-blue-500',
          draft: 'bg-gray-400',
        }
        const statusLabels = {
          running: '运行中',
          paused: '已暂停',
          completed: '已完成',
          draft: '草稿',
        }
        return (
          <Badge className={statusColors[row.original.status]}>
            {statusLabels[row.original.status]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'progress',
      header: '进度',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.completedCalls}/{row.original.totalCalls}</span>
          <div className="h-2 bg-muted rounded-full overflow-hidden w-[80px]">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(row.original.completedCalls / row.original.totalCalls) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'successRate',
      header: '接通率',
      cell: ({ row }) => (
        <Badge variant="outline">
          <PhoneCall className="h-3 w-3 mr-1" />
          {row.original.successRate}%
        </Badge>
      ),
    },
    {
      accessorKey: 'startTime',
      header: '开始时间',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.startTime}</span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === 'draft' ? (
            <Button size="sm" variant="outline">
              <Play className="h-4 w-4 mr-1" />
              启动
            </Button>
          ) : row.original.status === 'running' ? (
            <Button size="sm" variant="outline">
              <Pause className="h-4 w-4 mr-1" />
              暂停
            </Button>
          ) : row.original.status === 'paused' ? (
            <Button size="sm" variant="outline">
              <Play className="h-4 w-4 mr-1" />
              继续
            </Button>
          ) : (
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-1" />
              详情
            </Button>
          )}
          <Button size="sm" variant="ghost">
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredTasks = statusFilter === 'all'
    ? outboundTasks
    : outboundTasks.filter(task => task.status === statusFilter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Phone className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">呼叫中心</h1>
            <p className="text-muted-foreground">外呼任务管理与执行监控</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="running">运行中</SelectItem>
              <SelectItem value="paused">已暂停</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建任务
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">任务总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalTasks}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">运行中</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.activeTasks}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <PhoneCall className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">总通话数</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalCalls}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均接通率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.connectRate}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-pink-600" />
              <span className="text-sm font-medium">平均时长</span>
            </div>
            <div className="text-2xl font-bold text-pink-600">{stats.avgDuration}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>外呼任务列表</CardTitle>
          <CardDescription>所有外呼任务及其执行状态</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTasks}
            showSearch
            searchPlaceholder="搜索任务..."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default OutboundTasksPage