/**
 * ReportSchedule Page - CRM Report Schedule Management
 * Migrated to shadcn/ui + Tailwind CSS
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import type { DataTableColumnMeta } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Bell,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Trash2,
  Plus,
  ArrowLeft,
  RefreshCw,
  FileText,
  Mail,
  Download,
  Users,
} from 'lucide-react'

// ============================================================
// Types
// ============================================================
interface ScheduleTask {
  id: string
  reportId: string
  reportName: string
  category: 'sales' | 'customer' | 'activity' | 'product' | 'finance'
  scheduleType: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  scheduleDay: string
  scheduleTime: string
  status: 'active' | 'paused' | 'error'
  lastRun: string
  nextRun: string
  recipients: string[]
  exportFormat: 'pdf' | 'excel' | 'email'
  createdAt: string
}

// ============================================================
// Mock Data
// ============================================================
const mockScheduleTasks: ScheduleTask[] = [
  {
    id: 'S001',
    reportId: 'R001',
    reportName: '销售业绩月报',
    category: 'sales',
    scheduleType: 'monthly',
    scheduleDay: '每月1日',
    scheduleTime: '08:00',
    status: 'active',
    lastRun: '2026-04-01 08:00',
    nextRun: '2026-05-01 08:00',
    recipients: ['李明', '王芳'],
    exportFormat: 'pdf',
    createdAt: '2026-01-15',
  },
  {
    id: 'S002',
    reportId: 'R002',
    reportName: '客户活跃度分析',
    category: 'customer',
    scheduleType: 'weekly',
    scheduleDay: '每周一',
    scheduleTime: '09:00',
    status: 'active',
    lastRun: '2026-04-03 09:00',
    nextRun: '2026-04-10 09:00',
    recipients: ['陈静'],
    exportFormat: 'email',
    createdAt: '2026-02-10',
  },
  {
    id: 'S003',
    reportId: 'R005',
    reportName: '财务收入报表',
    category: 'finance',
    scheduleType: 'quarterly',
    scheduleDay: '每季度首日',
    scheduleTime: '07:00',
    status: 'paused',
    lastRun: '2026-01-01 07:00',
    nextRun: '暂停',
    recipients: ['财务部门'],
    exportFormat: 'excel',
    createdAt: '2025-12-20',
  },
  {
    id: 'S004',
    reportId: 'R008',
    reportName: '活动类型统计',
    category: 'activity',
    scheduleType: 'daily',
    scheduleDay: '每天',
    scheduleTime: '18:00',
    status: 'error',
    lastRun: '2026-04-02 18:00',
    nextRun: '待修复',
    recipients: ['张伟'],
    exportFormat: 'pdf',
    createdAt: '2026-03-20',
  },
]

// ============================================================
// Category & Status Config
// ============================================================
const categoryLabels: Record<string, string> = {
  sales: '销售',
  customer: '客户',
  activity: '活动',
  product: '产品',
  finance: '财务',
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: '运行中', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="h-3 w-3" /> },
  paused: { label: '已暂停', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Pause className="h-3 w-3" /> },
  error: { label: '异常', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertCircle className="h-3 w-3" /> },
}

const scheduleTypeLabels: Record<string, string> = {
  daily: '日报',
  weekly: '周报',
  monthly: '月报',
  quarterly: '季报',
}

const exportFormatConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  pdf: { label: 'PDF', icon: <FileText className="h-3 w-3" /> },
  excel: { label: 'Excel', icon: <Download className="h-3 w-3" /> },
  email: { label: '邮件', icon: <Mail className="h-3 w-3" /> },
}

// ============================================================
// Status Badge
// ============================================================
function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={`gap-1 ${config.color}`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}

// ============================================================
// Stats Cards
// ============================================================
function ScheduleStatsCards() {
  const stats = [
    { label: '总任务数', count: 4, icon: Bell, color: 'text-blue-600' },
    { label: '运行中', count: 2, icon: Play, color: 'text-green-600' },
    { label: '已暂停', count: 1, icon: Pause, color: 'text-yellow-600' },
    { label: '异常', count: 1, icon: AlertCircle, color: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(stat => (
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
const columns: ColumnDef<ScheduleTask>[] = [
  {
    accessorKey: 'reportName',
    header: '报表名称',
    meta: { width: 180, sortable: true, filterable: true, filterType: 'text' } as DataTableColumnMeta,
    cell: ({ row }) => (
      <Link
        to={`/report/${row.original.reportId}`}
        className="flex items-center gap-2 hover:text-primary"
      >
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.getValue('reportName')}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: '类别',
    meta: { width: 80 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      return (
        <Badge variant="outline">
          {categoryLabels[category]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'scheduleType',
    header: '周期',
    meta: { width: 80 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const scheduleType = row.getValue('scheduleType') as string
      return (
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          {scheduleTypeLabels[scheduleType]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'scheduleDay',
    header: '执行日期',
    meta: { width: 100 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('scheduleDay')}</span>
    ),
  },
  {
    accessorKey: 'scheduleTime',
    header: '执行时间',
    meta: { width: 80 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Clock className="h-3 w-3 text-muted-foreground" />
        {row.getValue('scheduleTime')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '状态',
    meta: {
      width: 80,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: '运行中', value: 'active' },
        { label: '已暂停', value: 'paused' },
        { label: '异常', value: 'error' },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'lastRun',
    header: '上次执行',
    meta: { width: 120 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('lastRun')}</span>
    ),
  },
  {
    accessorKey: 'nextRun',
    header: '下次执行',
    meta: { width: 120 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('nextRun')}</span>
    ),
  },
  {
    accessorKey: 'exportFormat',
    header: '导出格式',
    meta: { width: 80 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const format = row.getValue('exportFormat') as string
      const config = exportFormatConfig[format]
      return (
        <Badge variant="outline" className="gap-1">
          {config.icon}
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'recipients',
    header: '接收人',
    meta: { width: 100 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{(row.getValue('recipients') as string[]).length} 人</span>
      </div>
    ),
  },
]

// ============================================================
// Create/Edit Dialog
// ============================================================
interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: ScheduleTask
}

function ScheduleDialog({ open, onOpenChange, task }: ScheduleDialogProps) {
  const isEdit = !!task
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑定时任务' : '新建定时任务'}</DialogTitle>
          <DialogDescription>
            配置报表自动生成时间和接收人
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Report Selection */}
          <div className="space-y-2">
            <Label>报表名称</Label>
            {isEdit ? (
              <Input value={task.reportName} disabled />
            ) : (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择报表" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R001">销售业绩月报</SelectItem>
                  <SelectItem value="R002">客户活跃度分析</SelectItem>
                  <SelectItem value="R003">活动执行统计</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Schedule Type */}
          <div className="space-y-2">
            <Label>执行周期</Label>
            <Select defaultValue={task?.scheduleType || 'monthly'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">每天</SelectItem>
                <SelectItem value="weekly">每周</SelectItem>
                <SelectItem value="monthly">每月</SelectItem>
                <SelectItem value="quarterly">每季度</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Day */}
          <div className="space-y-2">
            <Label>执行日期</Label>
            <Select defaultValue={task?.scheduleDay || 'first'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">每天</SelectItem>
                <SelectItem value="monday">每周一</SelectItem>
                <SelectItem value="first">每月1日</SelectItem>
                <SelectItem value="last">每月最后一天</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Time */}
          <div className="space-y-2">
            <Label>执行时间</Label>
            <Input type="time" defaultValue={task?.scheduleTime || '08:00'} />
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label>导出格式</Label>
            <Select defaultValue={task?.exportFormat || 'pdf'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF 文档</SelectItem>
                <SelectItem value="excel">Excel 表格</SelectItem>
                <SelectItem value="email">邮件发送</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <Label>接收人</Label>
            <Input placeholder="输入接收人邮箱或用户名" />
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-sm">启用任务</Label>
            <Switch defaultChecked={task?.status === 'active'} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            {isEdit ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// ReportSchedule Page Component
// ============================================================
export function ReportSchedule() {
  const [density, setDensity] = React.useState<'compact' | 'default' | 'comfortable'>('default')
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<ScheduleTask | undefined>()
  
  // Filter tasks by status
  const filteredTasks = activeTab === 'all' 
    ? mockScheduleTasks 
    : mockScheduleTasks.filter(t => t.status === activeTab)
  
  // Edit task (reserved for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (task: ScheduleTask) => {
    setEditingTask(task)
    setDialogOpen(true)
  }
  
  // Create new task
  const handleCreate = () => {
    setEditingTask(undefined)
    setDialogOpen(true)
  }
  
  const batchActions = [
    {
      label: '批量启用',
      icon: <Play className="h-3 w-3" />,
      onClick: (rows: ScheduleTask[]) => console.log('批量启用:', rows.map(r => r.id)),
    },
    {
      label: '批量暂停',
      icon: <Pause className="h-3 w-3" />,
      onClick: (rows: ScheduleTask[]) => console.log('批量暂停:', rows.map(r => r.id)),
    },
    {
      label: '批量删除',
      icon: <Trash2 className="h-3 w-3 text-red-500" />,
      onClick: (rows: ScheduleTask[]) => console.log('批量删除:', rows.map(r => r.id)),
    },
  ]
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/report/list">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">定时任务管理</h1>
              <p className="text-muted-foreground">配置报表自动生成和发送</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              刷新
            </Button>
            <Button size="sm" className="gap-2" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              新建任务
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <ScheduleStatsCards />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="active" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              运行中
            </TabsTrigger>
            <TabsTrigger value="paused" className="gap-1">
              <Pause className="h-3 w-3" />
              已暂停
            </TabsTrigger>
            <TabsTrigger value="error" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              异常
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* DataTable */}
            <DataTable
              columns={columns}
              data={filteredTasks}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              density={density}
              onDensityChange={setDensity}
              showBatchActions
              batchActions={batchActions}
              showSearch
              searchPlaceholder="搜索报表名称..."
              searchableFields={['reportName']}
              showDensityToggle
              showPagination
              pageSizeOptions={[10, 20, 50]}
              defaultPageSize={10}
              emptyText="暂无定时任务"
              className="border rounded-lg"
            />
          </TabsContent>
        </Tabs>

        {/* Create/Edit Dialog */}
        <ScheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={editingTask}
        />
      </div>
    </div>
  )
}

export default ReportSchedule