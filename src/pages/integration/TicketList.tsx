/**
 * TicketList - 工单系统
 * Ticket System Page
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
  Ticket,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  MessageSquare,
  ArrowUpRight,
  Filter,
  Calendar,
} from 'lucide-react'

// Mock tickets
interface TicketItem {
  id: string
  title: string
  customer: string
  type: 'issue' | 'request' | 'complaint'
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'pending' | 'resolved' | 'closed'
  assignee: string
  createdTime: string
  updateTime: string
}

const tickets: TicketItem[] = [
  {
    id: 'TK001',
    title: '系统登录异常',
    customer: '科技公司A',
    type: 'issue',
    priority: 'high',
    status: 'open',
    assignee: '技术支持-张三',
    createdTime: '2024-01-20 14:30',
    updateTime: '2024-01-20 15:00',
  },
  {
    id: 'TK002',
    title: '功能开通申请',
    customer: '金融公司B',
    type: 'request',
    priority: 'medium',
    status: 'pending',
    assignee: '客服-李四',
    createdTime: '2024-01-20 10:15',
    updateTime: '2024-01-20 11:30',
  },
  {
    id: 'TK003',
    title: '服务响应慢',
    customer: '教育机构C',
    type: 'complaint',
    priority: 'high',
    status: 'open',
    assignee: '技术支持-王五',
    createdTime: '2024-01-20 09:00',
    updateTime: '2024-01-20 10:00',
  },
  {
    id: 'TK004',
    title: '发票开具问题',
    customer: '制造业D',
    type: 'request',
    priority: 'low',
    status: 'resolved',
    assignee: '财务-赵六',
    createdTime: '2024-01-19 16:00',
    updateTime: '2024-01-19 18:00',
  },
  {
    id: 'TK005',
    title: '数据导出失败',
    customer: '零售企业E',
    type: 'issue',
    priority: 'medium',
    status: 'closed',
    assignee: '技术支持-张三',
    createdTime: '2024-01-18 11:00',
    updateTime: '2024-01-18 14:00',
  },
]

const stats = {
  total: 125,
  open: 45,
  pending: 30,
  resolved: 35,
  closed: 15,
  avgResponse: '2.5小时',
}

export function TicketListPage() {
  const [statusFilter, setStatusFilter] = React.useState('all')

  const columns: ColumnDef<TicketItem>[] = [
    {
      accessorKey: 'id',
      header: '工单号',
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{row.original.id}</code>
      ),
    },
    {
      accessorKey: 'title',
      header: '标题',
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[200px]">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'customer',
      header: '客户',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.customer}</Badge>
      ),
    },
    {
      accessorKey: 'type',
      header: '类型',
      cell: ({ row }) => {
        const typeColors = {
          issue: 'bg-red-100 text-red-700',
          request: 'bg-blue-100 text-blue-700',
          complaint: 'bg-orange-100 text-orange-700',
        }
        const typeLabels = {
          issue: '问题',
          request: '请求',
          complaint: '投诉',
        }
        return (
          <Badge className={typeColors[row.original.type]}>
            {typeLabels[row.original.type]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: '优先级',
      cell: ({ row }) => {
        const priorityColors = {
          high: 'bg-red-500',
          medium: 'bg-yellow-500',
          low: 'bg-green-500',
        }
        return (
          <Badge className={priorityColors[row.original.priority]}>
            {row.original.priority === 'high' ? '高' :
             row.original.priority === 'medium' ? '中' : '低'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const statusColors = {
          open: 'bg-red-100 text-red-700',
          pending: 'bg-yellow-100 text-yellow-700',
          resolved: 'bg-green-100 text-green-700',
          closed: 'bg-gray-100 text-gray-700',
        }
        const statusLabels = {
          open: '待处理',
          pending: '处理中',
          resolved: '已解决',
          closed: '已关闭',
        }
        return (
          <Badge className={statusColors[row.original.status]}>
            {statusLabels[row.original.status]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'assignee',
      header: '处理人',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.assignee}</span>
      ),
    },
    {
      accessorKey: 'updateTime',
      header: '更新时间',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.updateTime}</span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            查看
          </Button>
          <Button size="sm" variant="ghost">
            <MessageSquare className="h-4 w-4" />
          </Button>
          {row.original.status === 'open' && (
            <Button size="sm" variant="ghost">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === statusFilter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">工单系统</h1>
            <p className="text-muted-foreground">客户服务工单管理与处理</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="open">待处理</SelectItem>
              <SelectItem value="pending">处理中</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
              <SelectItem value="closed">已关闭</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建工单
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">工单总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">待处理</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">处理中</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">已解决</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">平均响应</span>
            </div>
            <div className="text-xl font-bold text-purple-600">{stats.avgResponse}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>工单列表</CardTitle>
          <CardDescription>所有客户服务工单</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTickets}
            showSearch
            searchPlaceholder="搜索工单..."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TicketListPage