"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Download, FileDown, Trash2, MoreHorizontal, Eye, Edit, Send, Copy, CheckCircle, Clock, RefreshCw, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { applyFilterGroup, createEmptyFilterGroup } from "@/components/FilterBar/filterUtils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { ExportFormat } from "@/hooks/api/useCustomers"

// ============ Types ============

interface Quote {
  id: string
  quoteNumber: string
  customer: string
  title: string
  amount: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  validUntil: string
  createdBy: string
  createTime: string
}

// ============ Status Badge ============

const statusConfig: Record<Quote['status'], { label: string; className: string }> = {
  "draft": { label: "草稿", className: "bg-gray-100 text-gray-800 border-gray-200" },
  "sent": { label: "已发送", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "accepted": { label: "已接受", className: "bg-green-100 text-green-800 border-green-200" },
  "rejected": { label: "已拒绝", className: "bg-red-100 text-red-800 border-red-200" },
  "expired": { label: "已过期", className: "bg-orange-100 text-orange-800 border-orange-200" },
}

function StatusBadge({ status }: { status: Quote['status'] }) {
  const config = statusConfig[status]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}

// ============ Format Currency ============

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
  }).format(amount)
}

// ============ Mock Data ============

const mockQuotes: Quote[] = [
  { id: "Q001", quoteNumber: "QT-2024-001", customer: "北京科技有限公司", title: "企业版年度订阅报价", amount: 128000, status: "sent", validUntil: "2024-02-20", createdBy: "张三", createTime: "2024-01-15" },
  { id: "Q002", quoteNumber: "QT-2024-002", customer: "上海贸易集团", title: "定制开发服务报价", amount: 256000, status: "accepted", validUntil: "2024-02-15", createdBy: "李四", createTime: "2024-01-12" },
  { id: "Q003", quoteNumber: "QT-2024-003", customer: "成都软件园", title: "标准版套餐报价", amount: 48000, status: "draft", validUntil: "2024-02-10", createdBy: "王五", createTime: "2024-01-10" },
  { id: "Q004", quoteNumber: "QT-2024-004", customer: "深圳创新科技", title: "增值服务报价", amount: 35000, status: "rejected", validUntil: "2024-01-20", createdBy: "赵六", createTime: "2024-01-08" },
  { id: "Q005", quoteNumber: "QT-2024-005", customer: "广州制造业", title: "基础版报价", amount: 12000, status: "expired", validUntil: "2024-01-15", createdBy: "张三", createTime: "2024-01-01" },
]

// ============ Filter Configuration ============

const quoteFilters: FilterItem[] = [
  {
    name: "quoteNumber",
    label: "报价单号",
    type: "text",
    placeholder: "搜索报价单号",
  },
  {
    name: "customer",
    label: "客户",
    type: "text",
    placeholder: "搜索客户名称",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "草稿", value: "draft" },
      { label: "已发送", value: "sent" },
      { label: "已接受", value: "accepted" },
      { label: "已拒绝", value: "rejected" },
      { label: "已过期", value: "expired" },
    ],
  },
  {
    name: "createdBy",
    label: "创建人",
    type: "select",
    placeholder: "选择创建人",
    options: [
      { label: "张三", value: "张三" },
      { label: "李四", value: "李四" },
      { label: "王五", value: "王五" },
      { label: "赵六", value: "赵六" },
    ],
  },
  {
    name: "createTime",
    label: "创建时间",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
]

// ============ Advanced Filter Fields Configuration ============

const quoteAdvancedFilterFields: FilterField[] = [
  {
    name: "quoteNumber",
    label: "报价单号",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入报价单号",
  },
  {
    name: "customer",
    label: "客户名称",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入客户名称",
  },
  {
    name: "title",
    label: "报价标题",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入报价标题",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "草稿", value: "draft" },
      { label: "已发送", value: "sent" },
      { label: "已接受", value: "accepted" },
      { label: "已拒绝", value: "rejected" },
      { label: "已过期", value: "expired" },
    ],
  },
  {
    name: "amount",
    label: "报价金额",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入金额",
  },
  {
    name: "validUntil",
    label: "有效期至",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
  {
    name: "createdBy",
    label: "创建人",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "张三", value: "张三" },
      { label: "李四", value: "李四" },
      { label: "王五", value: "王五" },
      { label: "赵六", value: "赵六" },
    ],
  },
]

// ============ Columns ============

const columns: ColumnDef<Quote, string>[] = [
  {
    accessorKey: "quoteNumber",
    header: "报价单号",
    meta: { width: 130, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
    cell: ({ row }) => (
      <code className="text-sm bg-muted px-2 py-0.5 rounded">{row.original.quoteNumber}</code>
    ),
  },
  {
    accessorKey: "customer",
    header: "客户",
    meta: { width: 150, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "title",
    header: "报价标题",
    meta: { width: 180, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="truncate max-w-[180px] block">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "报价金额",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="font-medium">¥{(row.original.amount / 10000).toFixed(1)}万</span>
    ),
  },
  {
    accessorKey: "status",
    header: "状态",
    meta: {
      width: 80,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "草稿", value: "draft" },
        { label: "已发送", value: "sent" },
        { label: "已接受", value: "accepted" },
        { label: "已拒绝", value: "rejected" },
        { label: "已过期", value: "expired" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "validUntil",
    header: "有效期至",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "createdBy",
    header: "创建人",
    meta: { width: 80, sortable: true, filterable: true, filterType: "select", filterOptions: [
      { label: "张三", value: "张三" },
      { label: "李四", value: "李四" },
      { label: "王五", value: "王五" },
      { label: "赵六", value: "赵六" },
    ] } as DataTableColumnMeta,
  },
  {
    accessorKey: "createTime",
    header: "创建时间",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
  },
]

// ============ Batch Action Item ============

interface BatchActionItem {
  label: string
  icon: React.ReactNode
  variant?: "default" | "destructive"
  onClick: (rows: Quote[]) => void
}

// ============ QuoteList Page ============

export function QuoteListPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()

  // UI State
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)

  // Advanced Filter State
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))

  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("excel")
  const [selectedRowsForExport, setSelectedRowsForExport] = React.useState<Quote[]>([])

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(mockQuotes, advancedFilterGroup)
    }

    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return mockQuotes

    return mockQuotes.filter((quote: Quote) => {
      // QuoteNumber filter
      if (filterValues.quoteNumber && typeof filterValues.quoteNumber === 'string') {
        if (!quote.quoteNumber.toLowerCase().includes(filterValues.quoteNumber.toLowerCase())) return false
      }
      // Customer filter
      if (filterValues.customer && typeof filterValues.customer === 'string') {
        if (!quote.customer?.toLowerCase().includes(filterValues.customer.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (quote.status !== filterValues.status) return false
      }
      // CreatedBy filter
      if (filterValues.createdBy && filterValues.createdBy !== '') {
        if (quote.createdBy !== filterValues.createdBy) return false
      }
      // CreateTime date range filter
      if (filterValues.createTime && Array.isArray(filterValues.createTime)) {
        const [startDate, endDate] = filterValues.createTime as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const quoteDate = new Date(quote.createTime)
          if (startDate && quoteDate < startDate) return false
          if (endDate && quoteDate > endDate) return false
        }
      }
      return true
    })
  }, [filterValues, advancedFilterGroup])

  // Selected rows count
  const selectedCount = React.useMemo(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key as keyof typeof rowSelection]).length
  }, [rowSelection])

  // Filter handlers
  const handleFilterChange = async (values: Record<string, unknown>) => {
    setIsFilterLoading(true)
    setFilterValues(values)
    // 清空高级筛选
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }

  const handleAdvancedFilterChange = async (group: FilterGroupLegacy) => {
    setIsFilterLoading(true)
    setAdvancedFilterGroup(group)
    // 清空简单筛选
    setFilterValues({})
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }

  const handleFilterReset = () => {
    setFilterValues({})
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
  }

  const handleCreate = async (values: any) => {
    console.log("创建报价:", values)
    setCreateModalOpen(false)
    toast({
      title: t("quote.createSuccess", "报价单创建成功"),
      description: t("quote.createSuccessDesc", "报价单已成功创建"),
    })
  }

  const handleEdit = async (values: any) => {
    if (!selectedQuote) return
    console.log("更新报价:", values)
    setEditModalOpen(false)
    setSelectedQuote(null)
    toast({
      title: t("quote.updateSuccess", "报价单更新成功"),
    })
  }

  const handleDelete = async () => {
    if (!deletingId) return
    console.log("删除报价:", deletingId)
    setDeleteConfirmOpen(false)
    setDeletingId(null)
    toast({
      title: t("quote.deleteSuccess", "报价单已删除"),
    })
  }

  const handleSend = (quote: Quote) => {
    console.log("发送报价:", quote.id)
    toast({
      title: t("quote.sentSuccess", "报价单已发送"),
      description: `报价单 ${quote.quoteNumber} 已发送给客户`,
    })
  }

  // Export handlers
  const handleExport = (rows: Quote[]) => {
    setSelectedRowsForExport(rows)
    setExportModalOpen(true)
  }

  const handleExportAll = () => {
    setSelectedRowsForExport([])
    setExportModalOpen(true)
  }

  const handleExportConfirm = async () => {
    setExportModalOpen(false)
    toast({
      title: t("quote.exportSuccess", "导出成功"),
      description: t("quote.exportSuccessDesc", `已导出 ${selectedRowsForExport.length || filteredData.length} 条报价数据`),
    })
  }

  // Columns with actions
  const columnsWithActions = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: Quote } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/quotes/${row.original.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedQuote(row.original)
                setEditModalOpen(true)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              {row.original.status === 'draft' && (
                <DropdownMenuItem onClick={() => handleSend(row.original)}>
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                复制
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setDeletingId(row.original.id)
                  setDeleteConfirmOpen(true)
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
  }, [navigate])

  // Batch actions config
  const batchActions: BatchActionItem[] = [
    {
      label: t("quote.batch.export", "导出"),
      icon: <Download className="h-3 w-3" />,
      onClick: handleExport,
    },
    {
      label: t("quote.batch.send", "发送"),
      icon: <Send className="h-3 w-3" />,
      onClick: (rows) => {
        rows.forEach(r => {
          if (r.status === 'draft') handleSend(r)
        })
        toast({
          title: t("quote.batchSentSuccess", `已发送 ${rows.filter(r => r.status === 'draft').length} 份报价单`),
        })
      },
    },
    {
      label: t("quote.batch.delete", "删除"),
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive",
      onClick: (rows) => {
        console.log("批量删除:", rows.map(r => r.id))
        setRowSelection({})
        toast({
          title: t("quote.bulkDeleteSuccess", `已删除 ${rows.length} 份报价单`),
        })
      },
    },
  ]

  // Stats calculation
  const stats = React.useMemo(() => {
    const total = filteredData.length
    const draft = filteredData.filter(q => q.status === 'draft').length
    const sent = filteredData.filter(q => q.status === 'sent').length
    const accepted = filteredData.filter(q => q.status === 'accepted').length
    const rejected = filteredData.filter(q => q.status === 'rejected').length
    const expired = filteredData.filter(q => q.status === 'expired').length
    const totalAmount = filteredData.reduce((sum, q) => sum + q.amount, 0)
    return { total, draft, sent, accepted, rejected, expired, totalAmount }
  }, [filteredData])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{t("quote.title", "报价单管理")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("quote.description", "客户报价单创建、发送与管理")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="mr-2 h-4 w-4" />
              {t("quote.exportAll", "导出全部")}
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("quote.create", "创建报价单")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t("quote.total", "共")} <strong className="text-foreground">{filteredData.length}</strong> {t("quote.records", "条记录")}</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t("quote.selected", "已选择")} {selectedCount} {t("quote.items", "项")}
            </Badge>
          )}
        </div>

        {/* Stats Cards Row */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">报价总数</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Edit className="h-4 w-4 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">草稿</span>
              </div>
              <div className="text-2xl font-bold text-gray-700">{stats.draft}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Send className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">已发送</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{stats.sent}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">已接受</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-600 font-medium">已拒绝/过期</span>
              </div>
              <div className="text-2xl font-bold text-red-700">{stats.rejected + stats.expired}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">总报价额</span>
              </div>
              <div className="text-xl font-bold text-purple-700">¥{(stats.totalAmount / 10000).toFixed(0)}万</div>
            </CardContent>
          </Card>
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={quoteFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_quote_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={quoteAdvancedFilterFields}
        />

        {/* DataTable */}
        <DataTable
          columns={columnsWithActions}
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
          emptyText={t("quote.empty", "暂无报价数据")}
          loading={isFilterLoading}
          className="border rounded-lg"
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title={t("quote.createTitle", "创建报价单")}
          width={600}
        >
          <div className="p-4">
            <p className="text-muted-foreground">报价单表单将在这里渲染</p>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) setSelectedQuote(null)
          }}
          title={t("quote.editTitle", "编辑报价单")}
          width={600}
        >
          {selectedQuote && (
            <div className="p-4">
              <p className="text-muted-foreground">编辑报价单 {selectedQuote.quoteNumber}</p>
            </div>
          )}
        </Modal>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={(open) => {
            setDeleteConfirmOpen(open)
            if (!open) setDeletingId(null)
          }}
          title={t("quote.deleteTitle", "确认删除")}
          content={t("quote.deleteContent", "删除后数据将无法恢复，确定要删除该报价单吗？")}
          okType="danger"
          okText={t("common.delete", "删除")}
          onOk={handleDelete}
        />

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title={t("quote.exportTitle", "导出报价数据")}
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedRowsForExport.length > 0
                ? t("quote.exportSelectedDesc", `将导出选中的 ${selectedRowsForExport.length} 条报价数据`)
                : t("quote.exportAllDesc", `将导出全部 ${filteredData.length} 条报价数据`)}
            </p>

            <div className="space-y-2">
              <Label>{t("quote.exportFormat", "导出格式")}</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={(val) => setExportFormat(val as ExportFormat)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="format-excel" />
                  <Label htmlFor="format-excel" className="cursor-pointer">Excel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label htmlFor="format-csv" className="cursor-pointer">CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label htmlFor="format-pdf" className="cursor-pointer">PDF</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportModalOpen(false)}>
                {t("common.cancel", "取消")}
              </Button>
              <Button onClick={handleExportConfirm}>
                {t("quote.exportConfirm", "确认导出")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default QuoteListPage
