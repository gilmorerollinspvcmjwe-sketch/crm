/**
 * TargetLists - 目标列表
 * Marketing Target Lists Page
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
  Target,
  Plus,
  Users,
  Mail,
  Phone,
  Building,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  Download,
  Send,
  Eye,
  Filter,
} from 'lucide-react'

// Mock target lists
interface TargetList {
  id: string
  name: string
  description: string
  type: 'email' | 'sms' | 'all'
  segment: string
  count: number
  createdBy: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'inactive'
}

const targetLists: TargetList[] = [
  {
    id: 'TL001',
    name: 'VIP客户群',
    description: '高价值客户群体，用于专属活动推广',
    type: 'email',
    segment: 'VIP客户',
    count: 85,
    createdBy: '张三',
    createdAt: '2024-01-15',
    lastUsed: '2024-01-18',
    status: 'active',
  },
  {
    id: 'TL002',
    name: '新客户跟进',
    description: '近30天新注册客户，用于新客引导',
    type: 'all',
    segment: '新客户',
    count: 156,
    createdBy: '李四',
    createdAt: '2024-01-10',
    lastUsed: '2024-01-20',
    status: 'active',
  },
  {
    id: 'TL003',
    name: '续约提醒',
    description: '即将到期客户，用于续约推广',
    type: 'email',
    segment: '即将到期',
    count: 45,
    createdBy: '王五',
    createdAt: '2024-01-08',
    lastUsed: '2024-01-15',
    status: 'active',
  },
  {
    id: 'TL004',
    name: '流失预警',
    description: '活跃度下降客户，用于挽回营销',
    type: 'sms',
    segment: '预警客户',
    count: 23,
    createdBy: '赵六',
    createdAt: '2024-01-05',
    lastUsed: '2024-01-12',
    status: 'inactive',
  },
  {
    id: 'TL005',
    name: '行业推广-互联网',
    description: '互联网行业客户群',
    type: 'email',
    segment: '互联网行业',
    count: 98,
    createdBy: '张三',
    createdAt: '2024-01-02',
    lastUsed: '2024-01-08',
    status: 'active',
  },
]

const stats = {
  totalLists: 5,
  totalTargets: 407,
  activeCampaigns: 3,
  avgOpenRate: 45,
}

export function TargetListsPage() {
  const [typeFilter, setTypeFilter] = React.useState('all')

  const columns: ColumnDef<TargetList>[] = [
    {
      accessorKey: 'name',
      header: '列表名称',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'segment',
      header: '细分群体',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.segment}</Badge>
      ),
    },
    {
      accessorKey: 'type',
      header: '渠道类型',
      cell: ({ row }) => {
        const typeIcons = {
          email: <Mail className="h-4 w-4" />,
          sms: <Phone className="h-4 w-4" />,
          all: <Users className="h-4 w-4" />,
        }
        const typeLabels = {
          email: '邮件',
          sms: '短信',
          all: '全渠道',
        }
        return (
          <Badge variant="secondary">
            {typeIcons[row.original.type]}
            <span className="ml-1">{typeLabels[row.original.type]}</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: 'count',
      header: '目标数',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.count}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status === 'active' ? '活跃' : '暂停'}
        </Badge>
      ),
    },
    {
      accessorKey: 'lastUsed',
      header: '最近使用',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.lastUsed}</span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Send className="h-4 w-4 mr-1" />
            发送
          </Button>
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredLists = typeFilter === 'all'
    ? targetLists
    : targetLists.filter(list => list.type === typeFilter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">目标列表</h1>
            <p className="text-muted-foreground">营销活动的目标客户群管理</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="类型筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="email">邮件</SelectItem>
              <SelectItem value="sms">短信</SelectItem>
              <SelectItem value="all">全渠道</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建列表
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">列表总数</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalLists}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">目标总数</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.totalTargets}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">活跃活动</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.activeCampaigns}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Building className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均打开率</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.avgOpenRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Target Lists */}
      <Card>
        <CardHeader>
          <CardTitle>目标列表</CardTitle>
          <CardDescription>已创建的营销目标客户群</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredLists}
            showSearch
            searchPlaceholder="搜索目标列表..."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TargetListsPage