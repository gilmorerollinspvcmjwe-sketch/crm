"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Download, Trash2, MoreHorizontal, Eye, Edit, FileDown, CheckCircle2, Loader2, CreditCard } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { PaymentForm } from "@/forms/PaymentForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { applyFilterGroup, createEmptyFilterGroup } from "@/components/FilterBar/filterUtils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Payment, PaymentStatus } from "@/types/api"
import { cn } from "@/lib/utils"
import type { ExportFormat } from "@/hooks/api/useCustomers"

// ============ Status Badge ============

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  "待支付": { label: "待支付", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "部分支付": { label: "部分支付", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "已支付": { label: "已支付", className: "bg-green-100 text-green-800 border-green-200" },
  "已退款": { label: "已退款", className: "bg-purple-100 text-purple-800 border-purple-200" },
  "已取消": { label: "已取消", className: "bg-red-100 text-red-800 border-red-200" },
}

function StatusBadge({ status }: { status: PaymentStatus }) {
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
    minimumFractionDigits: 2,
  }).format(amount)
}

// ============ Mock Data ============

const mockPayments: Payment[] = [
  { id: "PAY-001", code: "PAY-2024-001", contractId: "CT-001", contractName: "2024年度服务合同", customerId: "C001", customerName: "北京科技有限公司", amount: 60000, paidAmount: 60000, status: "已支付", method: "银行转账", dueDate: "2024-03-15", paidDate: "2024-03-14", receiptNo: "R-2024-001", assignee: "李明", createdAt: "2024-01-15", updatedAt: "2024-03-14" },
  { id: "PAY-002", code: "PAY-2024-002", contractId: "CT-001", contractName: "2024年度服务合同", customerId: "C001", customerName: "北京科技有限公司", amount: 60000, paidAmount: 0, status: "待支付", method: "银行转账", dueDate: "2024-06-15", assignee: "李明", createdAt: "2024-01-15", updatedAt: "2024-01-15" },
  { id: "PAY-003", code: "PAY-2024-003", contractId: "CT-002", contractName: "软件开发合同", customerId: "C002", customerName: "上海贸易集团", amount: 85000, paidAmount: 30000, status: "部分支付", method: "支付宝", dueDate: "2024-04-01", paidDate: "2024-02-25", assignee: "王芳", createdAt: "2024-02-20", updatedAt: "2024-02-25" },
  { id: "PAY-004", code: "PAY-2024-004", contractId: "CT-003", contractName: "设备采购合同", customerId: "C003", customerName: "深圳创新科技", amount: 50000, paidAmount: 50000, status: "已支付", method: "现金", dueDate: "2024-01-20", paidDate: "2024-01-18", receiptNo: "R-2024-002", assignee: "李明", createdAt: "2024-01-08", updatedAt: "2024-01-18" },
  { id: "PAY-005", code: "PAY-2024-005", contractId: "CT-005", contractName: "咨询顾问合同", customerId: "C005", customerName: "成都软件园", amount: 20000, paidAmount: 5000, status: "已退款", method: "微信", dueDate: "2024-02-15", assignee: "王芳", createdAt: "2024-01-28", updatedAt: "2024-02-20" },
]

// ============ Filter Configuration ============

const paymentFilters: FilterItem[] = [
  {
    name: "code",
    label: "支付编码",
    type: "text",
    placeholder: "搜索支付编码",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "待支付", value: "待支付" },
      { label: "部分支付", value: "部分支付" },
      { label: "已支付", value: "已支付" },
      { label: "已退款", value: "已退款" },
      { label: "已取消", value: "已取消" },
    ],
  },
  {
    name: "customerName",
    label: "客户",
    type: "text",
    placeholder: "搜索客户名称",
  },
  {
    name: "method",
    label: "支付方式",
    type: "select",
    placeholder: "选择方式",
    options: [
      { label: "银行转账", value: "银行转账" },
      { label: "现金", value: "现金" },
      { label: "支票", value: "支票" },
      { label: "支付宝", value: "支付宝" },
      { label: "微信", value: "微信" },
    ],
  },
  {
    name: "createdAt",
    label: "创建时间",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
]

// ============ Advanced Filter Fields Configuration ============

const paymentAdvancedFilterFields: FilterField[] = [
  {
    name: "code",
    label: "支付编码",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入支付编码",
  },
  {
    name: "contractName",
    label: "关联合同",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入合同名称",
  },
  {
    name: "customerName",
    label: "客户名称",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入客户名称",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "待支付", value: "待支付" },
      { label: "部分支付", value: "部分支付" },
      { label: "已支付", value: "已支付" },
      { label: "已退款", value: "已退款" },
      { label: "已取消", value: "已取消" },
    ],
  },
  {
    name: "amount",
    label: "应付金额",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入金额",
  },
  {
    name: "paidAmount",
    label: "已付金额",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入金额",
  },
  {
    name: "method",
    label: "支付方式",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "银行转账", value: "银行转账" },
      { label: "现金", value: "现金" },
      { label: "支票", value: "支票" },
      { label: "支付宝", value: "支付宝" },
      { label: "微信", value: "微信" },
    ],
  },
  {
    name: "assignee",
    label: "负责人",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "李明", value: "李明" },
      { label: "王芳", value: "王芳" },
      { label: "陈静", value: "陈静" },
    ],
  },
  {
    name: "dueDate",
    label: "应付日期",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
]

// ============ Columns ============

const columns: ColumnDef<Payment, string>[] = [
  {
    accessorKey: "code",
    header: "支付编码",
    meta: { width: 130, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "contractName",
    header: "关联合同",
    meta: { width: 180, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "customerName",
    header: "客户",
    meta: { width: 150, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "status",
    header: "状态",
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "待支付", value: "待支付" },
        { label: "部分支付", value: "部分支付" },
        { label: "已支付", value: "已支付" },
        { label: "已退款", value: "已退款" },
        { label: "已取消", value: "已取消" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <StatusBadge status={row.getValue("status") as PaymentStatus} />,
  },
  {
    accessorKey: "amount",
    header: "应付金额",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => formatCurrency(row.getValue("amount") as number),
  },
  {
    accessorKey: "paidAmount",
    header: "已付金额",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => formatCurrency(row.getValue("paidAmount") as number),
  },
  {
    accessorKey: "method",
    header: "支付方式",
    meta: {
      width: 80,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "银行转账", value: "银行转账" },
        { label: "现金", value: "现金" },
        { label: "支票", value: "支票" },
        { label: "支付宝", value: "支付宝" },
        { label: "微信", value: "微信" },
      ],
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "dueDate",
    header: "应付日期",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "paidDate",
    header: "实付日期",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const paidDate = row.getValue("paidDate") as string | undefined
      return paidDate || "-"
    },
  },
  {
    accessorKey: "assignee",
    header: "负责人",
    meta: { width: 80, sortable: true, filterable: true, filterType: "select", filterOptions: [
      { label: "李明", value: "李明" },
      { label: "王芳", value: "王芳" },
      { label: "陈静", value: "陈静" },
    ] } as DataTableColumnMeta,
  },
]

// ============ Batch Action Item ============

interface BatchActionItem {
  label: string
  icon: React.ReactNode
  variant?: "default" | "destructive"
  onClick: (rows: Payment[]) => void
}

// ============ PaymentList Page ============

export function PaymentList() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // UI State
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  
  // Advanced Filter State
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  
  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("excel")
  const [selectedRowsForExport, setSelectedRowsForExport] = React.useState<Payment[]>([])

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(mockPayments, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return mockPayments

    return mockPayments.filter((payment: Payment) => {
      // Code filter
      if (filterValues.code && typeof filterValues.code === 'string') {
        if (!payment.code.toLowerCase().includes(filterValues.code.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (payment.status !== filterValues.status) return false
      }
      // CustomerName filter
      if (filterValues.customerName && typeof filterValues.customerName === 'string') {
        if (!payment.customerName?.toLowerCase().includes(filterValues.customerName.toLowerCase())) return false
      }
      // Method filter
      if (filterValues.method && filterValues.method !== '') {
        if (payment.method !== filterValues.method) return false
      }
      // CreatedAt date range filter
      if (filterValues.createdAt && Array.isArray(filterValues.createdAt)) {
        const [startDate, endDate] = filterValues.createdAt as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const paymentDate = new Date(payment.createdAt)
          if (startDate && paymentDate < startDate) return false
          if (endDate && paymentDate > endDate) return false
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
    console.log("创建支付:", values)
    setCreateModalOpen(false)
    toast({
      title: t("payment.createSuccess", "支付创建成功"),
      description: t("payment.createSuccessDesc", "支付记录已成功创建"),
    })
  }

  const handleEdit = async (values: any) => {
    if (!selectedPayment) return
    console.log("更新支付:", values)
    setEditModalOpen(false)
    setSelectedPayment(null)
    toast({
      title: t("payment.updateSuccess", "支付更新成功"),
    })
  }

  const handleDelete = async () => {
    if (!deletingId) return
    console.log("删除支付:", deletingId)
    setDeleteConfirmOpen(false)
    setDeletingId(null)
    toast({
      title: t("payment.deleteSuccess", "支付已删除"),
    })
  }

  // Export handlers
  const handleExport = (rows: Payment[]) => {
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
      title: t("payment.exportSuccess", "导出成功"),
      description: t("payment.exportSuccessDesc", `已导出 ${selectedRowsForExport.length || filteredData.length} 条支付数据`),
    })
  }

  // Columns with actions (computed inside component to access state)
  const columnsWithActions = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: Payment } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/payments/${row.original.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedPayment(row.original)
                setEditModalOpen(true)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
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
      label: t("payment.batch.export", "导出"),
      icon: <Download className="h-3 w-3" />,
      onClick: handleExport,
    },
    {
      label: t("payment.batch.delete", "删除"),
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive",
      onClick: (rows) => {
        console.log("批量删除:", rows.map(r => r.id))
        setRowSelection({})
        toast({
          title: t("payment.bulkDeleteSuccess", `已删除 ${rows.length} 条支付记录`),
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
            <h1 className="text-2xl font-bold tracking-tight">{t("payment.title", "支付管理")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("payment.description", "管理所有支付记录，包括支付跟踪和退款处理")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="mr-2 h-4 w-4" />
              {t("payment.exportAll", "导出全部")}
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("payment.create", "新建支付")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t("payment.total", "共")} <strong className="text-foreground">{filteredData.length}</strong> {t("payment.records", "条记录")}</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t("payment.selected", "已选择")} {selectedCount} {t("payment.items", "项")}
            </Badge>
          )}
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={paymentFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_payment_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={paymentAdvancedFilterFields}
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
          emptyText={t("payment.empty", "暂无支付数据")}
          loading={isFilterLoading}
          className="border rounded-lg"
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title={t("payment.createTitle", "新建支付")}
          width={600}
        >
          <PaymentForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) setSelectedPayment(null)
          }}
          title={t("payment.editTitle", "编辑支付")}
          width={600}
        >
          {selectedPayment && (
            <PaymentForm
              mode="edit"
              initialValues={selectedPayment}
              onSubmit={handleEdit}
              onCancel={() => {
                setEditModalOpen(false)
                setSelectedPayment(null)
              }}
            />
          )}
        </Modal>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={(open) => {
            setDeleteConfirmOpen(open)
            if (!open) setDeletingId(null)
          }}
          title={t("payment.deleteTitle", "确认删除")}
          content={t("payment.deleteContent", "删除后数据将无法恢复，确定要删除该支付记录吗？")}
          okType="danger"
          okText={t("common.delete", "删除")}
          onOk={handleDelete}
        />

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title={t("payment.exportTitle", "导出支付数据")}
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedRowsForExport.length > 0 
                ? t("payment.exportSelectedDesc", `将导出选中的 ${selectedRowsForExport.length} 条支付数据`)
                : t("payment.exportAllDesc", `将导出全部 ${filteredData.length} 条支付数据`)}
            </p>
            
            <div className="space-y-2">
              <Label>{t("payment.exportFormat", "导出格式")}</Label>
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
                  <RadioGroupItem value="json" id="format-json" />
                  <Label htmlFor="format-json" className="cursor-pointer">JSON</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportModalOpen(false)}>
                {t("common.cancel", "取消")}
              </Button>
              <Button onClick={handleExportConfirm}>
                {t("payment.exportConfirm", "确认导出")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default PaymentList
