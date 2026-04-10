/**
 * WorkflowList - 工作流列表页
 * 使用 Mock 数据的工作流列表
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  GitBranch,
  Search,
  MoreHorizontal,
} from 'lucide-react'
import { useWorkflows, useWorkflowStats, useToggleWorkflowStatus, useDeleteWorkflow, triggerTypeConfig } from '@/hooks/useWorkflows'
import type { MockWorkflow } from '@/mocks/workflows'
import { statusConfig } from '@/mocks/workflows'

export function WorkflowListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = React.useState('')
  
  // 使用 Mock 数据
  const { data: workflows = [], isLoading, refetch } = useWorkflows({
    search: searchTerm || undefined,
  })
  const { data: stats } = useWorkflowStats()
  
  const toggleStatus = useToggleWorkflowStatus()
  const deleteWorkflow = useDeleteWorkflow()

  const handleToggleStatus = (workflow: MockWorkflow) => {
    toggleStatus.mutate({ id: workflow.id, currentStatus: workflow.status as string })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个工作流吗？')) {
      deleteWorkflow.mutate(id)
    }
  }

  const columns: ColumnDef<MockWorkflow>[] = [
    {
      accessorKey: 'name',
      header: '工作流名称',
      cell: ({ row }) => (
        <div 
          className="cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded"
          onClick={() => navigate(`/workflows/${row.original.id}`)}
        >
          <div className="font-medium hover:text-primary">{row.original.name}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'triggerType',
      header: '触发类型',
      cell: ({ row }) => {
        const config = triggerTypeConfig[row.original.triggerType]
        return (
          <Badge variant="outline" className="flex items-center gap-1 w-fit">
            <span>{config?.icon}</span>
            <span>{config?.label}</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: 'objectType',
      header: '对象类型',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.objectType}</Badge>
      ),
    },
    {
      accessorKey: 'nodes',
      header: '步骤数',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.nodes.length}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status] || { label: row.original.status, className: 'bg-gray-400' }
        return (
          <Badge className={config.className}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'stats.totalExecutions',
      header: '执行次数',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.stats.totalExecutions.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'stats.successRate',
      header: '成功率',
      cell: ({ row }) => {
        const { totalExecutions, successCount } = row.original.stats
        const rate = totalExecutions > 0 ? Math.round((successCount / totalExecutions) * 100) : 0
        return (
          <Badge variant="outline">
            {rate}%
          </Badge>
        )
      },
    },
    {
      accessorKey: 'stats.lastRun',
      header: '最近执行',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.stats.lastRun}</span>
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
              <DropdownMenuItem onClick={() => navigate(`/workflows/${row.original.id}/edit`)}>
                <Settings className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
            ) : row.original.status === 'active' ? (
              <DropdownMenuItem 
                onClick={() => handleToggleStatus(row.original)}
                disabled={toggleStatus.isPending}
              >
                <Pause className="h-4 w-4 mr-2" />
                暂停
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={() => handleToggleStatus(row.original)}
                disabled={toggleStatus.isPending}
              >
                <Play className="h-4 w-4 mr-2" />
                启动
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate(`/workflows/${row.original.id}`)}>
              <ArrowRight className="h-4 w-4 mr-2" />
              查看
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              复制
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteWorkflow.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">工作流引擎</h1>
            <p className="text-muted-foreground">可视化业务流程自动化配置</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/workflows/executions')}>
            <History className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => navigate('/workflows/builder')}>
            <Plus className="h-4 w-4 mr-2" />
            创建工作流
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">工作流总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">运行中</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats?.active ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">执行总数</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{(stats?.totalExecutions ?? 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均成功率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats?.successRate ?? 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索工作流..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle>工作流列表</CardTitle>
          <CardDescription>所有已配置的工作流，点击名称查看详情</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={workflows}
            loading={isLoading}
            showSearch={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkflowListPage
