/**
 * ReportList Page - CRM Report Management
 * Migrated from Ant Design to shadcn/ui + Tailwind CSS
 */

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import type { DataTableColumnMeta } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Package,
  Plus,
  Calendar,
  Clock,
  RefreshCw,
  Download,
} from 'lucide-react'
import { useReports } from '@/hooks/api/useReports'
import type { Report, ReportCategory, ReportType } from '@/types/report'

// ============================================================
// Category Icons & Colors
// ============================================================
const categoryIcons: Record<ReportCategory, React.ReactNode> = {
  sales: <DollarSign className="h-4 w-4" />,
  customer: <Users className="h-4 w-4" />,
  activity: <Activity className="h-4 w-4" />,
  product: <Package className="h-4 w-4" />,
  finance: <TrendingUp className="h-4 w-4" />,
}

const categoryColors: Record<ReportCategory, string> = {
  sales: 'bg-blue-100 text-blue-700 border-blue-200',
  customer: 'bg-purple-100 text-purple-700 border-purple-200',
  activity: 'bg-orange-100 text-orange-700 border-orange-200',
  product: 'bg-teal-100 text-teal-700 border-teal-200',
  finance: 'bg-green-100 text-green-700 border-green-200',
}

const categoryLabels: Record<ReportCategory, string> = {
  sales: '销售',
  customer: '客户',
  activity: '活动',
  product: '产品',
  finance: '财务',
}

const typeIcons: Record<ReportType, React.ReactNode> = {
  summary: <FileText className="h-4 w-4" />,
  detail: <BarChart3 className="h-4 w-4" />,
  trend: <LineChart className="h-4 w-4" />,
  comparison: <PieChart className="h-4 w-4" />,
}

const typeLabels: Record<ReportType, string> = {
  summary: '汇总',
  detail: '明细',
  trend: '趋势',
  comparison: '对比',
}

const periodLabels: Record<string, string> = {
  daily: '日报',
  weekly: '周报',
  monthly: '月报',
  quarterly: '季报',
  yearly: '年报',
  custom: '自定义',
}

// ============================================================
// Category Badge
// ============================================================
function CategoryBadge({ category }: { category: ReportCategory }) {
  return (
    <Badge variant="outline" className={`gap-1 ${categoryColors[category]}`}>
      {categoryIcons[category]}
      {categoryLabels[category]}
    </Badge>
  )
}

// ============================================================
// Report Type Badge
// ============================================================
function ReportTypeBadge({ type }: { type: ReportType }) {
  return (
    <Badge variant="outline" className="gap-1">
      {typeIcons[type]}
      {typeLabels[type]}
    </Badge>
  )
}

// ============================================================
// Report Stats Cards
// ============================================================
function ReportStatsCards() {
  const stats = [
    { label: '销售报表', count: 3, icon: DollarSign, color: 'text-blue-600' },
    { label: '客户报表', count: 2, icon: Users, color: 'text-purple-600' },
    { label: '活动报表', count: 2, icon: Activity, color: 'text-orange-600' },
    { label: '其他报表', count: 3, icon: FileText, color: 'text-gray-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xl font-bold">{stat.count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================================
// Column Definitions
// ============================================================
const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'name',
    header: '报表名称',
    meta: { width: 200, sortable: true, filterable: true, filterType: 'text' } as DataTableColumnMeta,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: '类别',
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: '销售', value: 'sales' },
        { label: '客户', value: 'customer' },
        { label: '活动', value: 'activity' },
        { label: '产品', value: 'product' },
        { label: '财务', value: 'finance' },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <CategoryBadge category={row.getValue('category')} />,
  },
  {
    accessorKey: 'type',
    header: '类型',
    meta: {
      width: 80,
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: '汇总', value: 'summary' },
        { label: '明细', value: 'detail' },
        { label: '趋势', value: 'trend' },
        { label: '对比', value: 'comparison' },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <ReportTypeBadge type={row.getValue('type')} />,
  },
  {
    accessorKey: 'period',
    header: '周期',
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const period = row.getValue('period') as string
      return (
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          {periodLabels[period] || period}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdBy',
    header: '创建人',
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: 'updatedAt',
    header: '更新时间',
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-3 w-3" />
        {row.getValue('updatedAt')}
      </div>
    ),
  },
  {
    accessorKey: 'isPublic',
    header: '公开',
    meta: { width: 60 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <Badge variant={row.getValue('isPublic') ? 'default' : 'secondary'}>
        {row.getValue('isPublic') ? '公开' : '私有'}
      </Badge>
    ),
  },
  {
    accessorKey: 'scheduled',
    header: '定时',
    meta: { width: 60 } as DataTableColumnMeta,
    cell: ({ row }) => (
      row.getValue('scheduled') ? (
        <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
          <Clock className="h-3 w-3" />
          定时
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    ),
  },
]

// ============================================================
// ReportList Page Component
// ============================================================
export function ReportList() {
  const [density, setDensity] = React.useState<'compact' | 'default' | 'comfortable'>('default')
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeTab, setActiveTab] = React.useState<string>('all')

  const { data, isLoading } = useReports({
    category: activeTab !== 'all' ? activeTab as ReportCategory : undefined,
  })

  const batchActions = [
    {
      label: '批量导出',
      icon: <Download className="h-3 w-3" />,
      onClick: (rows: Report[]) => console.log('批量导出:', rows.map(r => r.id)),
    },
    {
      label: '刷新数据',
      icon: <RefreshCw className="h-3 w-3" />,
      onClick: (rows: Report[]) => console.log('刷新数据:', rows.map(r => r.id)),
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">报表中心</h1>
            <p className="text-muted-foreground">管理和查看业务报表</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            新建报表
          </Button>
        </div>

        {/* Stats Cards */}
        <ReportStatsCards />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="sales">
              <DollarSign className="h-3 w-3 mr-1" />
              销售
            </TabsTrigger>
            <TabsTrigger value="customer">
              <Users className="h-3 w-3 mr-1" />
              客户
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-3 w-3 mr-1" />
              活动
            </TabsTrigger>
            <TabsTrigger value="finance">
              <TrendingUp className="h-3 w-3 mr-1" />
              财务
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* DataTable */}
            <DataTable
              columns={columns}
              data={data?.data || []}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              density={density}
              onDensityChange={setDensity}
              showBatchActions
              batchActions={batchActions}
              showSearch
              searchPlaceholder="搜索报表名称..."
              searchableFields={['name', 'description']}
              showDensityToggle={false}
              showPagination
              pageSizeOptions={[10, 20, 50]}
              defaultPageSize={10}
              loading={isLoading}
              emptyText="暂无报表数据"
              className="border rounded-lg"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ReportList