/**
 * WorkflowList - 工作流列表
 * Workflow List Page
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Settings,
  Trash2,
  Copy,
  History,
  RefreshCw,
  Zap,
  Clock,
  Activity,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react'

// Mock workflows
interface WorkflowItem {
  id: string
  name: string
  description: string
  triggers: string[]
  actions: string[]
  status: 'active' | 'inactive' | 'draft'
  executions: number
  lastRun: string
  successRate: number
}

const workflows: WorkflowItem[] = [
  {
    id: '1',
    name: '新线索自动分配',
    description: '当新线索创建时自动分配给对应的销售团队',
    triggers: ['新线索创建'],
    actions: ['分配线索', '发送通知'],
    status: 'active',
    executions: 1256,
    lastRun: '5分钟前',
    successRate: 98,
  },
  {
    id: '2',
    name: '合同到期提醒',
    description: '合同到期前30天自动发送提醒通知',
    triggers: ['定时触发', '合同状态'],
    actions: ['创建任务', '发送邮件', '通知销售'],
    status: 'active',
    executions: 456,
    lastRun: '1小时前',
    successRate: 95,
  },
  {
    id: '3',
    name: '客户生日关怀',
    description: '客户生日当天发送祝福邮件和优惠信息',
    triggers: ['定时触发'],
    actions: ['发送邮件', '创建优惠'],
    status: 'active',
    executions: 89,
    lastRun: '今天',
    successRate: 100,
  },
  {
    id: '4',
    name: '商机跟进提醒',
    description: '商机超过7天未跟进时发送提醒',
    triggers: ['商机状态', '时间条件'],
    actions: ['创建任务', '发送通知'],
    status: 'inactive',
    executions: 234,
    lastRun: '3天前',
    successRate: 85,
  },
  {
    id: '5',
    name: '客户流失预警',
    description: '检测客户活跃度下降并发送预警',
    triggers: ['客户活跃度'],
    actions: ['标记预警', '创建任务', '通知管理层'],
    status: 'draft',
    executions: 0,
    lastRun: '-',
    successRate: 0,
  },
]

const stats = {
  total: 5,
  active: 3,
  executions: 2035,
  avgSuccess: 93,
}

export function WorkflowListPage() {
  const navigate = useNavigate()
  
  const columns: ColumnDef<WorkflowItem>[] = [
    {
      accessorKey: 'name',
      header: '工作流名称',
      cell: ({ row }) => (
        <div onClick={() => navigate(`/workflows/${row.original.id}`)} className="cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const statusColors = {
          active: 'bg-green-500',
          inactive: 'bg-gray-400',
          draft: 'bg-yellow-500',
        }
        return (
          <Badge className={statusColors[row.original.status]}>
            {row.original.status === 'active' ? '运行中' :
             row.original.status === 'inactive' ? '已暂停' : '草稿'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'executions',
      header: '执行次数',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.executions}</span>
      ),
    },
    {
      accessorKey: 'successRate',
      header: '成功率',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.successRate}%
        </Badge>
      ),
    },
    {
      accessorKey: 'lastRun',
      header: '最近执行',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.lastRun}</span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      meta: { width: 80, fixed: 'right' } as any,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.original.status === 'draft' ? (
              <DropdownMenuItem onClick={() => navigate(`/workflows/builder`)}>
                <Play className="h-4 w-4 mr-2" />
                启动
              </DropdownMenuItem>
            ) : row.original.status === 'active' ? (
              <DropdownMenuItem onClick={() => {/* TODO: Implement pause */}}>
                <Pause className="h-4 w-4 mr-2" />
                暂停
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => {/* TODO: Implement start */}}>
                <Play className="h-4 w-4 mr-2" />
                启动
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate(`/workflows/${row.original.id}/edit`)}>
              <Settings className="h-4 w-4 mr-2" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {/* TODO: Implement duplicate */}}>
              <Copy className="h-4 w-4 mr-2" />
              复制
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => {/* TODO: Implement delete */}}>
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Workflow className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">工作流管理</h1>
            <p className="text-muted-foreground text-sm">自动化业务流程配置与管理</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/workflows/builder')}>
            <Plus className="h-4 w-4 mr-2" />
            创建工作流
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">工作流总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">运行中</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">执行总数</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.executions}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均成功率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.avgSuccess}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle>工作流列表</CardTitle>
          <CardDescription>所有已配置的工作流</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={workflows}
            showSearch
            searchPlaceholder="搜索工作流..."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkflowListPage