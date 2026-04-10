/**
 * ReportExport Page - CRM Report Export History & Management
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Share2,
  Filter,
  TrendingUp,
  Users,
  Activity,
  Package,
  DollarSign,
} from 'lucide-react'

// ============================================================
// Types
// ============================================================
interface ExportRecord {
  id: string
  reportId: string
  reportName: string
  category: 'sales' | 'customer' | 'activity' | 'product' | 'finance'
  format: 'pdf' | 'excel' | 'csv' | 'email'
  status: 'success' | 'failed' | 'pending'
  fileSize?: string
  exportedBy: string
  exportedAt: string
  recipients?: string[]
  downloadUrl?: string
}

// ============================================================
// Mock Data
// ============================================================
const mockExportRecords: ExportRecord[] = [
  {
    id: 'E001',
    reportId: 'R001',
    reportName: '销售业绩月报',
    category: 'sales',
    format: 'pdf',
    status: 'success',
    fileSize: '2.5MB',
    exportedBy: '李明',
    exportedAt: '2026-04-03 14:30',
    downloadUrl: '/exports/R001-202604.pdf',
  },
  {
    id: 'E002',
    reportId: 'R002',
    reportName: '客户活跃度分析',
    category: 'customer',
    format: 'excel',
    status: 'success',
    fileSize: '1.8MB',
    exportedBy: '王芳',
    exportedAt: '2026-04-03 12:15',
    downloadUrl: '/exports/R002-202604.xlsx',
  },
  {
    id: 'E003',
    reportId: 'R003',
    reportName: '活动执行统计',
    category: 'activity',
    format: 'email',
    status: 'success',
    exportedBy: '陈静',
    exportedAt: '2026-04-02 18:00',
    recipients: ['张伟', '赵敏'],
  },
  {
    id: 'E004',
    reportId: 'R004',
    reportName: '产品销售排行',
    category: 'product',
    format: 'pdf',
    status: 'failed',
    exportedBy: '张伟',
    exportedAt: '2026-04-02 15:45',
  },
  {
    id: 'E005',
    reportId: 'R005',
    reportName: '财务收入报表',
    category: 'finance',
    format: 'excel',
    status: 'pending',
    exportedBy: '财务部门',
    exportedAt: '2026-04-03 16:00',
  },
  {
    id: 'E006',
    reportId: 'R001',
    reportName: '销售业绩月报',
    category: 'sales',
    format: 'csv',
    status: 'success',
    fileSize: '0.5MB',
    exportedBy: '李明',
    exportedAt: '2026-04-01 09:00',
    downloadUrl: '/exports/R001-202604.csv',
  },
]

// ============================================================
// Category & Format & Status Config
// ============================================================
const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  sales: { label: '销售', icon: <DollarSign className="h-4 w-4" /> },
  customer: { label: '客户', icon: <Users className="h-4 w-4" /> },
  activity: { label: '活动', icon: <Activity className="h-4 w-4" /> },
  product: { label: '产品', icon: <Package className="h-4 w-4" /> },
  finance: { label: '财务', icon: <TrendingUp className="h-4 w-4" /> },
}

const formatConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pdf: { label: 'PDF', icon: <FileText className="h-4 w-4" />, color: 'bg-red-100 text-red-700 border-red-200' },
  excel: { label: 'Excel', icon: <FileSpreadsheet className="h-4 w-4" />, color: 'bg-green-100 text-green-700 border-green-200' },
  csv: { label: 'CSV', icon: <FileText className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  email: { label: '邮件', icon: <Mail className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  success: { label: '成功', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="h-3 w-3" /> },
  failed: { label: '失败', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertCircle className="h-3 w-3" /> },
  pending: { label: '处理中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Clock className="h-3 w-3" /> },
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
// Format Badge
// ============================================================
function FormatBadge({ format }: { format: string }) {
  const config = formatConfig[format]
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
function ExportStatsCards() {
  const stats = [
    { label: '今日导出', count: 3, icon: Download, color: 'text-blue-600' },
    { label: '本月导出', count: 28, icon: TrendingUp, color: 'text-green-600' },
    { label: '成功率', count: '92%', icon: CheckCircle, color: 'text-green-600' },
    { label: '存储占用', count: '15MB', icon: FileText, color: 'text-orange-600' },
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
const columns: ColumnDef<ExportRecord>[] = [
  {
    accessorKey: 'reportName',
    header: '报表名称',
    meta: { width: 180, sortable: true, filterable: true, filterType: 'text' } as DataTableColumnMeta,
    cell: ({ row }) => (
      <Link
        to={`/report/${row.original.reportId}`}
        className="flex items-center gap-2 hover:text-primary"
      >
        {categoryConfig[row.original.category].icon}
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
          {categoryConfig[category].label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'format',
    header: '导出格式',
    meta: {
      width: 80,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'PDF', value: 'pdf' },
        { label: 'Excel', value: 'excel' },
        { label: 'CSV', value: 'csv' },
        { label: '邮件', value: 'email' },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <FormatBadge format={row.getValue('format')} />,
  },
  {
    accessorKey: 'status',
    header: '状态',
    meta: {
      width: 80,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: '成功', value: 'success' },
        { label: '失败', value: 'failed' },
        { label: '处理中', value: 'pending' },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'fileSize',
    header: '文件大小',
    meta: { width: 80 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('fileSize') || '-'}</span>
    ),
  },
  {
    accessorKey: 'exportedBy',
    header: '导出人',
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: 'exportedAt',
    header: '导出时间',
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-3 w-3" />
        {row.getValue('exportedAt')}
      </div>
    ),
  },
  {
    accessorKey: 'recipients',
    header: '接收人',
    meta: { width: 100 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const recipients = row.getValue('recipients') as string[] | undefined
      return recipients ? (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{recipients.length} 人</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
]

// ============================================================
// Export Dialog
// ============================================================
interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = React.useState('pdf')
  const [selectedReports, setSelectedReports] = React.useState<string[]>([])
  
  const reportOptions = [
    { id: 'R001', name: '销售业绩月报', category: 'sales' },
    { id: 'R002', name: '客户活跃度分析', category: 'customer' },
    { id: 'R003', name: '活动执行统计', category: 'activity' },
    { id: 'R004', name: '产品销售排行', category: 'product' },
    { id: 'R005', name: '财务收入报表', category: 'finance' },
  ]
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>导出报表</DialogTitle>
          <DialogDescription>
            选择报表和导出格式
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Report Selection */}
          <div className="space-y-2">
            <Label>选择报表</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-auto">
              {reportOptions.map(report => (
                <div key={report.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={report.id}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedReports([...selectedReports, report.id])
                      } else {
                        setSelectedReports(selectedReports.filter(r => r !== report.id))
                      }
                    }}
                  />
                  <label htmlFor={report.id} className="text-sm font-medium cursor-pointer">
                    {report.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>导出格式</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(formatConfig).map(([key, config]) => (
                <Button
                  key={key}
                  type="button"
                  variant={selectedFormat === key ? 'default' : 'outline'}
                  className="justify-start gap-2"
                  onClick={() => setSelectedFormat(key)}
                >
                  {config.icon}
                  {config.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          {selectedFormat === 'email' && (
            <div className="space-y-2">
              <Label>接收人邮箱</Label>
              <input
                type="text"
                placeholder="输入邮箱地址，多个用逗号分隔"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onOpenChange(false)} className="gap-2">
            <Download className="h-4 w-4" />
            开始导出
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// ReportExport Page Component
// ============================================================
export function ReportExport() {
  const [density, setDensity] = React.useState<'compact' | 'default' | 'comfortable'>('default')
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false)
  
  // Filter records by status
  const filteredRecords = activeTab === 'all' 
    ? mockExportRecords 
    : mockExportRecords.filter(r => r.status === activeTab)
  
  const batchActions = [
    {
      label: '批量下载',
      icon: <Download className="h-3 w-3" />,
      onClick: (rows: ExportRecord[]) => console.log('批量下载:', rows.map(r => r.id)),
    },
    {
      label: '批量分享',
      icon: <Share2 className="h-3 w-3" />,
      onClick: (rows: ExportRecord[]) => console.log('批量分享:', rows.map(r => r.id)),
    },
    {
      label: '批量删除',
      icon: <Trash2 className="h-3 w-3 text-red-500" />,
      onClick: (rows: ExportRecord[]) => console.log('批量删除:', rows.map(r => r.id)),
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
              <h1 className="text-2xl font-bold tracking-tight">导出记录</h1>
              <p className="text-muted-foreground">报表导出历史和下载管理</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              刷新
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              筛选
            </Button>
            <Button size="sm" className="gap-2" onClick={() => setExportDialogOpen(true)}>
              <Download className="h-4 w-4" />
              新导出
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <ExportStatsCards />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="success" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              成功
            </TabsTrigger>
            <TabsTrigger value="failed" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              失败
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-1">
              <Clock className="h-3 w-3" />
              处理中
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* DataTable */}
            <DataTable
              columns={columns}
              data={filteredRecords}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              density={density}
              onDensityChange={setDensity}
              showBatchActions
              batchActions={batchActions}
              showSearch
              searchPlaceholder="搜索报表名称..."
              searchableFields={['reportName', 'exportedBy']}
              showDensityToggle
              showPagination
              pageSizeOptions={[10, 20, 50]}
              defaultPageSize={10}
              emptyText="暂无导出记录"
              className="border rounded-lg"
            />
          </TabsContent>
        </Tabs>

        {/* Export Dialog */}
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
        />
      </div>
    </div>
  )
}

export default ReportExport