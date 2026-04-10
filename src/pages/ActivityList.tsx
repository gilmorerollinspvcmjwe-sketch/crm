/**
 * ActivityList Page - CRM Activity Management
 * Migrated from Ant Design to shadcn/ui + Tailwind CSS
 */

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import type { DataTableColumnMeta } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Phone,
  Mail,
  Users,
  Calendar,
  MapPin,
  ClipboardList,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Trash2,
  MoreHorizontal,
  Edit,
  Eye,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { FilterBar } from '@/components/FilterBar'
import type { FilterItem, FilterField, FilterGroupLegacy } from '@/components/FilterBar'
import { createEmptyFilterGroup, applyFilterGroup } from '@/components/FilterBar'
import { useActivities, useActivityStats, useDeleteActivity } from '@/hooks/api/useActivities'
import type { Activity, ActivityType, ActivityStatus } from '@/types/activity'

// ============================================================
// Type Icons Mapping
// ============================================================
const typeIcons: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  meeting: <Users className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  task: <ClipboardList className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  visit: <MapPin className="h-4 w-4" />,
}

const typeColors: Record<ActivityType, string> = {
  call: 'bg-blue-100 text-blue-700 border-blue-200',
  meeting: 'bg-purple-100 text-purple-700 border-purple-200',
  email: 'bg-green-100 text-green-700 border-green-200',
  task: 'bg-orange-100 text-orange-700 border-orange-200',
  note: 'bg-gray-100 text-gray-700 border-gray-200',
  visit: 'bg-teal-100 text-teal-700 border-teal-200',
}

const statusColors: Record<ActivityStatus, string> = {
  planned: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-100',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  low: 'bg-green-50 text-green-600 border-green-100',
}

// ============================================================
// Activity Type Badge
// ============================================================
function ActivityTypeBadge({ type }: { type: ActivityType }) {
  const labels: Record<ActivityType, string> = {
    call: '电话',
    meeting: '会议',
    email: '邮件',
    task: '任务',
    note: '备注',
    visit: '拜访',
  }

  return (
    <Badge variant="outline" className={`gap-1 ${typeColors[type]}`}>
      {typeIcons[type]}
      {labels[type]}
    </Badge>
  )
}

// ============================================================
// Activity Status Badge
// ============================================================
function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  const labels: Record<ActivityStatus, string> = {
    planned: '计划中',
    completed: '已完成',
    cancelled: '已取消',
    overdue: '已逾期',
  }

  return (
    <Badge variant="outline" className={statusColors[status]}>
      {labels[status]}
    </Badge>
  )
}

// ============================================================
// Filter Configuration
// ============================================================

const activityFilters: FilterItem[] = [
  {
    name: 'subject',
    label: '活动主题',
    type: 'text',
    placeholder: '搜索活动主题',
  },
  {
    name: 'customerName',
    label: '客户',
    type: 'text',
    placeholder: '搜索客户名称',
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    placeholder: '选择状态',
    options: [
      { label: '计划中', value: 'planned' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' },
      { label: '已逾期', value: 'overdue' },
    ],
  },
  {
    name: 'type',
    label: '类型',
    type: 'select',
    placeholder: '选择类型',
    options: [
      { label: '电话', value: 'call' },
      { label: '会议', value: 'meeting' },
      { label: '邮件', value: 'email' },
      { label: '任务', value: 'task' },
      { label: '备注', value: 'note' },
      { label: '拜访', value: 'visit' },
    ],
  },
  {
    name: 'assignee',
    label: '负责人',
    type: 'select',
    placeholder: '选择负责人',
    options: [
      { label: '李明', value: '李明' },
      { label: '王芳', value: '王芳' },
      { label: '陈静', value: '陈静' },
    ],
  },
]

// ============================================================
// Advanced Filter Fields Configuration
// ============================================================

const activityAdvancedFilterFields: FilterField[] = [
  {
    name: 'subject',
    label: '活动主题',
    type: 'text',
    operators: ['eq', 'neq', 'contains', 'startsWith', 'endsWith'],
    placeholder: '输入活动主题',
  },
  {
    name: 'customerName',
    label: '客户',
    type: 'text',
    operators: ['eq', 'neq', 'contains', 'startsWith', 'endsWith'],
    placeholder: '输入客户名称',
  },
  {
    name: 'type',
    label: '类型',
    type: 'select',
    operators: ['eq', 'neq', 'in', 'notIn'],
    options: [
      { label: '电话', value: 'call' },
      { label: '会议', value: 'meeting' },
      { label: '邮件', value: 'email' },
      { label: '任务', value: 'task' },
      { label: '备注', value: 'note' },
      { label: '拜访', value: 'visit' },
    ],
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    operators: ['eq', 'neq', 'in', 'notIn'],
    options: [
      { label: '计划中', value: 'planned' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' },
      { label: '已逾期', value: 'overdue' },
    ],
  },
  {
    name: 'priority',
    label: '优先级',
    type: 'select',
    operators: ['eq', 'neq', 'in', 'notIn'],
    options: [
      { label: '高', value: 'high' },
      { label: '中', value: 'medium' },
      { label: '低', value: 'low' },
    ],
  },
  {
    name: 'assignee',
    label: '负责人',
    type: 'select',
    operators: ['eq', 'neq', 'in', 'notIn'],
    options: [
      { label: '李明', value: '李明' },
      { label: '王芳', value: '王芳' },
      { label: '陈静', value: '陈静' },
    ],
  },
  {
    name: 'startTime',
    label: '开始时间',
    type: 'date',
    operators: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between'],
    placeholder: '选择日期',
  },
]

// ============================================================
// Column Definitions
// ============================================================

function getColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<Activity, string>[] {
  return [
    {
      accessorKey: 'type',
      header: '类型',
      meta: {
        width: 100,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: '电话', value: 'call' },
          { label: '会议', value: 'meeting' },
          { label: '邮件', value: 'email' },
          { label: '任务', value: 'task' },
          { label: '备注', value: 'note' },
          { label: '拜访', value: 'visit' },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => <ActivityTypeBadge type={row.getValue('type')} />,
    },
    {
      accessorKey: 'subject',
      header: '主题',
      meta: { width: 200, sortable: true, filterable: true, filterType: 'text' } as DataTableColumnMeta,
    },
    {
      accessorKey: 'customerName',
      header: '客户',
      meta: { width: 150, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => row.getValue('customerName') || <span className="text-muted-foreground">-</span>,
    },
    {
      accessorKey: 'startTime',
      header: '开始时间',
      meta: { width: 150, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.getValue('startTime')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      meta: {
        width: 100,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: '计划中', value: 'planned' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
          { label: '已逾期', value: 'overdue' },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => <ActivityStatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'priority',
      header: '优先级',
      meta: {
        width: 80,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: '高', value: 'high' },
          { label: '中', value: 'medium' },
          { label: '低', value: 'low' },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string
        const labels: Record<string, string> = { high: '高', medium: '中', low: '低' }
        return (
          <Badge variant="outline" className={priorityColors[priority]}>
            {labels[priority]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'assignee',
      header: '负责人',
      meta: {
        width: 80,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: '李明', value: '李明' },
          { label: '王芳', value: '王芳' },
          { label: '陈静', value: '陈静' },
        ],
      } as DataTableColumnMeta,
    },
    {
      id: 'actions',
      header: '操作',
      meta: { width: 80, fixed: 'right' } as DataTableColumnMeta,
      cell: ({ row }: { row: { original: Activity } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              navigate(`/activities/${row.original.id}`)
            }}>
              <Eye className="h-4 w-4 mr-2" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              // setEditModalOpen(true)
            }}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                // setDeletingId(row.original.id)
                // setDeleteConfirmOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

// ============================================================
// ActivityList Page Component
// ============================================================
export function ActivityList() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [density, setDensity] = React.useState<'compact' | 'default' | 'comfortable'>('default')
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)

  const { data, isLoading } = useActivities({
    status: activeTab !== 'all' ? activeTab as ActivityStatus : undefined,
  })
  const deleteMutation = useDeleteActivity()

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    const activities = data?.data || []
    
    // Use advanced filter if there are valid conditions
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(activities, advancedFilterGroup)
    }
    
    // Use simple filter
    if (Object.keys(filterValues).length === 0) return activities

    return activities.filter((activity: Activity) => {
      // Subject filter
      if (filterValues.subject && typeof filterValues.subject === 'string') {
        if (!activity.subject.toLowerCase().includes(filterValues.subject.toLowerCase())) return false
      }
      // CustomerName filter
      if (filterValues.customerName && typeof filterValues.customerName === 'string') {
        if (!activity.customerName?.toLowerCase().includes(filterValues.customerName.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (activity.status !== filterValues.status) return false
      }
      // Type filter
      if (filterValues.type && filterValues.type !== '') {
        if (activity.type !== filterValues.type) return false
      }
      // Assignee filter
      if (filterValues.assignee && filterValues.assignee !== '') {
        if (activity.assignee !== filterValues.assignee) return false
      }
      return true
    })
  }, [data?.data, filterValues, advancedFilterGroup])

  // Selected rows count
  const selectedCount = React.useMemo(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key as keyof typeof rowSelection]).length
  }, [rowSelection])

  // Filter handlers
  const handleFilterChange = async (values: Record<string, unknown>) => {
    setIsFilterLoading(true)
    setFilterValues(values)
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }

  const handleAdvancedFilterChange = async (group: FilterGroupLegacy) => {
    setIsFilterLoading(true)
    setAdvancedFilterGroup(group)
    setFilterValues({})
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }

  const handleFilterReset = () => {
    setFilterValues({})
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
  }

  const columns = React.useMemo(() => getColumns(navigate), [navigate])

  const batchActions = [
    {
      label: '批量完成',
      icon: <CheckCircle className="h-3 w-3" />,
      onClick: (rows: Activity[]) => {
        console.log('批量完成:', rows.map(r => r.id))
        toast({
          title: `已标记 ${rows.length} 个活动为完成`,
        })
      },
    },
    {
      label: '批量取消',
      icon: <Clock className="h-3 w-3" />,
      onClick: (rows: Activity[]) => {
        console.log('批量取消:', rows.map(r => r.id))
        toast({
          title: `已取消 ${rows.length} 个活动`,
        })
      },
    },
    {
      label: '删除',
      icon: <Trash2 className="h-3 w-3" />,
      variant: 'destructive' as const,
      onClick: (rows: Activity[]) => {
        const ids = rows.map(r => r.id)
        deleteMutation.mutate(ids)
        setRowSelection({})
        toast({
          title: `已删除 ${ids.length} 个活动`,
        })
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{t('activity.title', '活动管理')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('activity.description', '管理所有客户跟进活动，支持筛选、排序、批量操作')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('activity.create', '新建活动')}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t('activity.total', '共')} <strong className="text-foreground">{filteredData.length}</strong> {t('activity.records', '条记录')}</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t('activity.selected', '已选择')} {selectedCount} {t('activity.items', '项')}
            </Badge>
          )}
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={activityFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_activity_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={activityAdvancedFilterFields}
        />

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredData}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          density={density}
          onDensityChange={setDensity}
          showBatchActions
          batchActions={batchActions}
          showSearch={false}
          showDensityToggle={false}
          showPagination
          pageSizeOptions={[10, 20, 50]}
          defaultPageSize={10}
          loading={isLoading || isFilterLoading}
          emptyText={t('activity.empty', '暂无活动数据')}
          className="border rounded-lg"
        />
      </div>
    </div>
  )
}

export default ActivityList