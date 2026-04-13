"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, FileText, Download, Trash2, MoreHorizontal, Clock, CheckCircle, PlayCircle, Activity } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContractForm } from "@/forms/ContractForm"
import { FilterBar } from "@/components/FilterBar"
import { Card, CardContent } from "@/components/ui/card"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
// import { useContracts, useDeleteContract, useUpdateContractStatus } from "@/hooks/api"
import type { Contract, ContractStatus } from "@/types/api"
import { cn } from "@/lib/utils"

// ============ Status Badge ============

const statusConfig: Record<ContractStatus, { label: string; className: string }> = {
  "草稿": { label: "草稿", className: "bg-gray-100 text-gray-800 border-gray-200" },
  "待审批": { label: "待审批", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "已审批": { label: "已审批", className: "bg-green-100 text-green-800 border-green-200" },
  "执行中": { label: "执行中", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  "已完成": { label: "已完成", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "已取消": { label: "已取消", className: "bg-red-100 text-red-800 border-red-200" },
}

function StatusBadge({ status }: { status: ContractStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
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

const mockContracts: Contract[] = [
  { id: "CT-001", name: "2024年度服务合同", code: "CONTRACT-2024-001", customerId: "C001", customerName: "北京科技有限公司", status: "执行中", amount: 120000, startDate: "2024-01-01", endDate: "2024-12-31", assignee: "李明", createdAt: "2024-01-15", updatedAt: "2024-03-28" },
  { id: "CT-002", name: "软件开发合同", code: "CONTRACT-2024-002", customerId: "C002", customerName: "上海贸易集团", status: "待审批", amount: 85000, startDate: "2024-02-01", endDate: "2024-06-30", assignee: "王芳", createdAt: "2024-02-20", updatedAt: "2024-02-20" },
  { id: "CT-003", name: "设备采购合同", code: "CONTRACT-2024-003", customerId: "C003", customerName: "深圳创新科技", status: "已完成", amount: 50000, signedAmount: 50000, startDate: "2024-01-08", endDate: "2024-03-31", signedDate: "2024-01-10", assignee: "李明", createdAt: "2024-01-08", updatedAt: "2024-04-01" },
  { id: "CT-004", name: "运维服务合同", code: "CONTRACT-2024-004", customerId: "C004", customerName: "广州制造业", status: "草稿", amount: 35000, startDate: "2024-04-01", endDate: "2024-09-30", assignee: "陈静", createdAt: "2024-03-20", updatedAt: "2024-03-20" },
  { id: "CT-005", name: "咨询顾问合同", code: "CONTRACT-2024-005", customerId: "C005", customerName: "成都软件园", status: "已取消", amount: 20000, startDate: "2024-02-01", endDate: "2024-05-31", assignee: "王芳", createdAt: "2024-01-28", updatedAt: "2024-02-15" },
]

// ============ Filter Configuration ============

const contractFilters: FilterItem[] = [
  {
    name: "code",
    label: "合同编码",
    type: "text",
    placeholder: "搜索合同编码",
  },
  {
    name: "name",
    label: "合同名称",
    type: "text",
    placeholder: "搜索合同名称",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "草稿", value: "草稿" },
      { label: "待审批", value: "待审批" },
      { label: "已审批", value: "已审批" },
      { label: "执行中", value: "执行中" },
      { label: "已完成", value: "已完成" },
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
    name: "createdAt",
    label: "创建时间",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
]

// ============ Advanced Filter Fields Configuration ============

const contractAdvancedFilterFields: FilterField[] = [
  {
    name: "code",
    label: "合同编码",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入合同编码",
  },
  {
    name: "name",
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
    name: "status",
    label: "状态",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "草稿", value: "草稿" },
      { label: "待审批", value: "待审批" },
      { label: "已审批", value: "已审批" },
      { label: "执行中", value: "执行中" },
      { label: "已完成", value: "已完成" },
      { label: "已取消", value: "已取消" },
    ],
  },
  {
    name: "amount",
    label: "合同金额",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入金额",
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
    name: "startDate",
    label: "开始日期",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
  {
    name: "endDate",
    label: "结束日期",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
]

// ============ Columns ============

const columns: ColumnDef<Contract, string>[] = [
  {
    accessorKey: "code",
    header: "合同编码",
    meta: { width: 150, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "name",
    header: "合同名称",
    meta: { width: 200, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
  },
  {
    accessorKey: "customerName",
    header: "客户",
    meta: { width: 180, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
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
        { label: "草稿", value: "草稿" },
        { label: "待审批", value: "待审批" },
        { label: "已审批", value: "已审批" },
        { label: "执行中", value: "执行中" },
        { label: "已完成", value: "已完成" },
        { label: "已取消", value: "已取消" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <StatusBadge status={row.getValue("status") as ContractStatus} />,
  },
  {
    accessorKey: "amount",
    header: "合同金额",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => formatCurrency(row.getValue("amount") as number),
  },
  {
    accessorKey: "signedAmount",
    header: "已签署金额",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const signed = row.getValue("signedAmount") as number | undefined
      return signed ? formatCurrency(signed) : "-"
    },
  },
  {
    accessorKey: "startDate",
    header: "开始日期",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "endDate",
    header: "结束日期",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
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
            <FileText className="h-4 w-4 mr-2" />
            查看详情
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("编辑", row.original.id)}>
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("下载", row.original.id)}>
            <Download className="h-4 w-4 mr-2" />
            导出PDF
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

// ============ Component ============

export function ContractList() {
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)

  // const { data, isLoading } = useContracts()
  // const deleteMutation = useDeleteContract()

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(mockContracts, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return mockContracts

    return mockContracts.filter((contract: Contract) => {
      // Code filter
      if (filterValues.code && typeof filterValues.code === 'string') {
        if (!contract.code.toLowerCase().includes(filterValues.code.toLowerCase())) return false
      }
      // Name filter
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!contract.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (contract.status !== filterValues.status) return false
      }
      // CustomerName filter
      if (filterValues.customerName && typeof filterValues.customerName === 'string') {
        if (!contract.customerName?.toLowerCase().includes(filterValues.customerName.toLowerCase())) return false
      }
      // CreatedAt date range filter
      if (filterValues.createdAt && Array.isArray(filterValues.createdAt)) {
        const [startDate, endDate] = filterValues.createdAt as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const contractDate = new Date(contract.createdAt)
          if (startDate && contractDate < startDate) return false
          if (endDate && contractDate > endDate) return false
        }
      }
      return true
    })
  }, [filterValues, advancedFilterGroup])

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
    console.log("创建合同:", values)
    setShowCreateModal(false)
  }

  const batchActions = [
    {
      label: "导出",
      icon: <Download className="h-3 w-3" />,
      onClick: (rows: Contract[]) => console.log("导出:", rows.map(r => r.id)),
    },
    {
      label: "删除",
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: (rows: Contract[]) => console.log("删除:", rows.map(r => r.id)),
    },
  ]

  // Stats data
  const stats = React.useMemo(() => {
    const total = filteredData.length
    const pending = filteredData.filter(c => c.status === "待审批").length
    const executing = filteredData.filter(c => c.status === "执行中").length
    const completed = filteredData.filter(c => c.status === "已完成").length
    const totalAmount = filteredData.reduce((sum, c) => sum + (c.amount || 0), 0)
    return { total, pending, executing, completed, totalAmount }
  }, [filteredData])

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-1 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              Contract workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight">合同管理</h1>
            <p className="text-sm text-muted-foreground">管理所有合同，包括创建、审批、执行跟踪，并保留完整筛选和批量操作。</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新建合同
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="border-border/70 shadow-[var(--shadow-sm)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">合同总数</p>
                  <p className="text-xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-[var(--shadow-sm)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">待审批</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-[var(--shadow-sm)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-50 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">执行中</p>
                  <p className="text-xl font-bold text-cyan-600">{stats.executing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-[var(--shadow-sm)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">已完成</p>
                  <p className="text-xl font-bold text-emerald-600">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>共 <strong className="text-foreground">{filteredData.length}</strong> 条记录</span>
          {Object.keys(rowSelection).length > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              已选择 {Object.keys(rowSelection).filter(k => rowSelection[k as keyof typeof rowSelection]).length} 项
            </Badge>
          )}
        </div>

        {/* FilterBar - HubSpot 风格筛选栏 */}
        <FilterBar
          filters={contractFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_contract_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={contractAdvancedFilterFields}
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
          emptyText="暂无合同数据"
          loading={isFilterLoading}
          className="rounded-[1.25rem] border-none"
        />

        {/* Create Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新建合同</DialogTitle>
            </DialogHeader>
            <ContractForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ContractList
