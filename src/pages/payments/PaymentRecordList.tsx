"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, CreditCard, Download, Trash2, MoreHorizontal, FileText, CheckCircle, Clock, XCircle } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterGroupLegacy, FilterField } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
import type { PaymentRecord, ReconciliationStatus } from "@/types/paymentRecord"
import { paymentRecordData } from "@/mock/paymentRecordData"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

// ============ Status Badge ============

const statusConfig: Record<ReconciliationStatus, { label: string; className: string; icon?: React.ReactNode }> = {
  "待核销": { 
    label: "待核销", 
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="h-3 w-3 mr-1" />
  },
  "已核销": { 
    label: "已核销", 
    className: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle className="h-3 w-3 mr-1" />
  },
  "已驳回": { 
    label: "已驳回", 
    className: "bg-red-100 text-red-800 border-red-200",
    icon: <XCircle className="h-3 w-3 mr-1" />
  },
  "部分核销": { 
    label: "部分核销", 
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Clock className="h-3 w-3 mr-1" />
  },
}

function StatusBadge({ status }: { status: ReconciliationStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium flex items-center", config.className)}>
      {config.icon}
      {config.label}
    </Badge>
  )
}

// ============ Format Currency ============

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCurrencyWan(amount: number): string {
  return (amount / 10000).toFixed(1) + "万"
}

// ============ Filter Configuration ============

const paymentRecordFilters: FilterItem[] = [
  {
    name: "contractName",
    label: "合同名称",
    type: "text",
    placeholder: "搜索合同名称",
  },
  {
    name: "customerName",
    label: "客户",
    type: "text",
    placeholder: "搜索客户名称",
  },
  {
    name: "reconciliationStatus",
    label: "核销状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "待核销", value: "待核销" },
      { label: "已核销", value: "已核销" },
      { label: "已驳回", value: "已驳回" },
      { label: "部分核销", value: "部分核销" },
    ],
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
    name: "assignee",
    label: "负责人",
    type: "select",
    placeholder: "选择负责人",
    options: [
      { label: "李明", value: "李明" },
      { label: "王芳", value: "王芳" },
      { label: "陈静", value: "陈静" },
    ],
  },
]

// ============ Advanced Filter Fields Configuration ============

const paymentRecordAdvancedFilterFields: FilterField[] = [
  {
    name: "code",
    label: "回款编号",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入回款编号",
  },
  {
    name: "contractName",
    label: "合同名称",
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
    name: "reconciliationStatus",
    label: "核销状态",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "待核销", value: "待核销" },
      { label: "已核销", value: "已核销" },
      { label: "已驳回", value: "已驳回" },
      { label: "部分核销", value: "部分核销" },
    ],
  },
  {
    name: "amount",
    label: "回款金额",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入金额",
  },
  {
    name: "paidAmount",
    label: "已核销金额",
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
]

// ============ Columns ============

const columns: ColumnDef<PaymentRecord, string>[] = [
  {
    accessorKey: "code",
    header: "回款编号",
    meta: { width: 120, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "contractName",
    header: "合同名称",
    meta: { width: 180, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "customerName",
    header: "客户",
    meta: { width: 150, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "reconciliationStatus",
    header: "核销状态",
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "待核销", value: "待核销" },
        { label: "已核销", value: "已核销" },
        { label: "已驳回", value: "已驳回" },
        { label: "部分核销", value: "部分核销" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => {
      const status = row.original.reconciliationStatus
      return status ? <StatusBadge status={status} /> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "amount",
    header: "计划金额",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => formatCurrency(row.getValue("amount") as number),
  },
  {
    accessorKey: "paidAmount",
    header: "已核销金额",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const value = row.getValue("paidAmount") as number
      return value > 0 ? formatCurrency(value) : "-"
    },
  },
  {
    accessorKey: "method",
    header: "支付方式",
    meta: {
      width: 90,
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
    meta: { 
      width: 80, 
      sortable: true, 
      filterable: true, 
      filterType: "select",
      filterOptions: [
        { label: "李明", value: "李明" },
        { label: "王芳", value: "王芳" },
        { label: "陈静", value: "陈静" },
      ]
    } as DataTableColumnMeta,
  },
  {
    id: "actions",
    header: "",
    meta: { width: 60, fixed: "right" } as DataTableColumnMeta,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log("查看", row.original.id)}>
            <CreditCard className="h-4 w-4 mr-2" />
            查看详情
          </DropdownMenuItem>
          {row.original.reconciliationStatus === "待核销" && (
            <DropdownMenuItem onClick={() => console.log("核销", row.original.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              核销
            </DropdownMenuItem>
          )}
          {row.original.reconciliationStatus === "部分核销" && (
            <DropdownMenuItem onClick={() => console.log("继续核销", row.original.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              继续核销
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => console.log("编辑", row.original.id)}>
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => console.log("删除", row.original.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ============ Stats Card Component ============

function StatsCard() {
  const stats = React.useMemo(() => {
    const data = paymentRecordData
    const totalPlanned = data.reduce((sum, r) => sum + r.amount, 0)
    const totalActual = data.reduce((sum, r) => sum + (r.paidAmount || 0), 0)
    const pending = data.filter(r => r.reconciliationStatus === "待核销")
    const verified = data.filter(r => r.reconciliationStatus === "已核销")
    return {
      totalPlanned,
      totalActual,
      completionRate: totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : "0",
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, r) => sum + r.amount, 0),
      verifiedCount: verified.length,
      verifiedAmount: verified.reduce((sum, r) => sum + r.paidAmount, 0),
    }
  }, [])
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">计划回款总额</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrencyWan(stats.totalPlanned)}</div>
          <p className="text-xs text-muted-foreground">
            共 {paymentRecordData.length} 条记录
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">已核销总额</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrencyWan(stats.totalActual)}</div>
          <p className="text-xs text-muted-foreground">
            完成率 {stats.completionRate}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">待核销金额</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{formatCurrencyWan(stats.pendingAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingCount} 条待处理
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">已核销记录</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.verifiedCount}</div>
          <p className="text-xs text-muted-foreground">
            核销金额 {formatCurrencyWan(stats.verifiedAmount)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============ Component ============

export function PaymentRecordList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)

  // Filtered data
  const filteredData = React.useMemo(() => {
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(paymentRecordData, advancedFilterGroup)
    }
    
    if (Object.keys(filterValues).length === 0) return paymentRecordData

    return paymentRecordData.filter((record: PaymentRecord) => {
      if (filterValues.contractName && typeof filterValues.contractName === 'string') {
        if (!record.contractName?.toLowerCase().includes(filterValues.contractName.toLowerCase())) return false
      }
      if (filterValues.customerName && typeof filterValues.customerName === 'string') {
        if (!record.customerName?.toLowerCase().includes(filterValues.customerName.toLowerCase())) return false
      }
      if (filterValues.reconciliationStatus && filterValues.reconciliationStatus !== '') {
        if (record.reconciliationStatus !== filterValues.reconciliationStatus) return false
      }
      if (filterValues.method && filterValues.method !== '') {
        if (record.method !== filterValues.method) return false
      }
      if (filterValues.assignee && filterValues.assignee !== '') {
        if (record.assignee !== filterValues.assignee) return false
      }
      return true
    })
  }, [filterValues, advancedFilterGroup])

  // Filter handlers
  const handleFilterChange = async (values: Record<string, unknown>) => {
    setIsFilterLoading(true)
    setFilterValues(values)
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
    toast({ title: "筛选已更新", duration: 1500 })
  }

  const handleAdvancedFilterChange = async (group: FilterGroupLegacy) => {
    setIsFilterLoading(true)
    setAdvancedFilterGroup(group)
    setFilterValues({})
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
    toast({ title: "高级筛选已应用", duration: 1500 })
  }

  const handleFilterReset = () => {
    setFilterValues({})
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
    toast({ title: "筛选已重置", duration: 1500 })
  }

  const handleViewDetail = (id: string) => {
    navigate(`/payment-records/${id}`)
  }

  const batchActions = [
    {
      label: "导出",
      icon: <Download className="h-3 w-3" />,
      onClick: (rows: PaymentRecord[]) => {
        console.log("导出:", rows.map(r => r.id))
        toast({ title: "导出功能开发中", description: `选中 ${rows.length} 条记录` })
      },
    },
    {
      label: "删除",
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: (rows: PaymentRecord[]) => {
        console.log("删除:", rows.map(r => r.id))
        toast({ title: "删除功能开发中", description: `选中 ${rows.length} 条记录`, variant: "destructive" })
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">回款记录</h1>
            <p className="text-muted-foreground">管理客户回款记录，包括核销状态和发票信息</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建回款
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCard />

        {/* FilterBar */}
        <FilterBar
          filters={paymentRecordFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_payment_record_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={paymentRecordAdvancedFilterFields}
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
          emptyText="暂无回款记录数据"
          loading={isFilterLoading}
          className="border rounded-lg"
          onRowClick={(row) => handleViewDetail(row.id)}
        />
      </div>

      {/* Create Modal Placeholder */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建回款记录</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">新建回款记录功能开发中...</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>取消</Button>
            <Button onClick={() => setShowCreateModal(false)}>创建</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentRecordList
