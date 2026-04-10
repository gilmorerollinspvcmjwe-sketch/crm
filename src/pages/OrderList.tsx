"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Package, Download, Trash2, MoreHorizontal, Clock, Settings, Truck, CheckCircle } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrderForm } from "@/forms/OrderForm"
import { FilterBar } from "@/components/FilterBar"
import { Card, CardContent } from "@/components/ui/card"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
// import { useOrders, useDeleteOrder } from "@/hooks/api"
import type { Order, OrderStatus } from "@/types/api"
import { cn } from "@/lib/utils"

// ============ Status Badge ============

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  "待确认": { label: "待确认", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "已确认": { label: "已确认", className: "bg-green-100 text-green-800 border-green-200" },
  "生产中": { label: "生产中", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  "已发货": { label: "已发货", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "已完成": { label: "已完成", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "已取消": { label: "已取消", className: "bg-red-100 text-red-800 border-red-200" },
}

function StatusBadge({ status }: { status: OrderStatus }) {
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

// ============ Filter Configuration ============

const orderFilters: FilterItem[] = [
  {
    name: "code",
    label: "订单号",
    type: "text",
    placeholder: "搜索订单号",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "待确认", value: "待确认" },
      { label: "已确认", value: "已确认" },
      { label: "生产中", value: "生产中" },
      { label: "已发货", value: "已发货" },
      { label: "已完成", value: "已完成" },
      { label: "已取消", value: "已取消" },
    ],
  },
  {
    name: "amountMin",
    label: "最低金额",
    type: "number",
    placeholder: "输入最低金额",
    min: 0,
  },
  {
    name: "amountMax",
    label: "最高金额",
    type: "number",
    placeholder: "输入最高金额",
    min: 0,
  },
  {
    name: "createdAt",
    label: "下单时间",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
]

// ============ Advanced Filter Fields Configuration ============

const orderAdvancedFilterFields: FilterField[] = [
  {
    name: "code",
    label: "订单编码",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入订单编码",
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
      { label: "待确认", value: "待确认" },
      { label: "已确认", value: "已确认" },
      { label: "生产中", value: "生产中" },
      { label: "已发货", value: "已发货" },
      { label: "已完成", value: "已完成" },
      { label: "已取消", value: "已取消" },
    ],
  },
  {
    name: "totalAmount",
    label: "订单金额",
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
    name: "shippingAddress",
    label: "收货地址",
    type: "text",
    operators: ["contains"],
    placeholder: "输入地址关键词",
  },
  {
    name: "createdAt",
    label: "创建时间",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
]

// ============ Mock Data ============

const mockOrders: Order[] = [
  { id: "ORD-001", code: "ORDER-2024-001", customerId: "C001", customerName: "北京科技有限公司", status: "已完成", totalAmount: 35000, items: [], assignee: "李明", createdAt: "2024-01-15", updatedAt: "2024-03-01", shippingAddress: "北京市朝阳区建国路88号" },
  { id: "ORD-002", code: "ORDER-2024-002", customerId: "C002", customerName: "上海贸易集团", status: "已发货", totalAmount: 52000, items: [], assignee: "王芳", createdAt: "2024-02-20", updatedAt: "2024-03-15", shippingAddress: "上海市浦东新区陆家嘴环路100号", shippingDate: "2024-03-15" },
  { id: "ORD-003", code: "ORDER-2024-003", customerId: "C003", customerName: "深圳创新科技", status: "生产中", totalAmount: 18000, items: [], assignee: "李明", createdAt: "2024-03-10", updatedAt: "2024-03-20" },
  { id: "ORD-004", code: "ORDER-2024-004", customerId: "C004", customerName: "广州制造业", status: "已确认", totalAmount: 89000, items: [], assignee: "陈静", createdAt: "2024-03-18", updatedAt: "2024-03-25" },
  { id: "ORD-005", code: "ORDER-2024-005", customerId: "C005", customerName: "成都软件园", status: "待确认", totalAmount: 25000, items: [], assignee: "王芳", createdAt: "2024-03-25", updatedAt: "2024-03-25" },
  { id: "ORD-006", code: "ORDER-2024-006", customerId: "C006", customerName: "杭州电商", status: "已取消", totalAmount: 45000, items: [], assignee: "李明", createdAt: "2024-02-10", updatedAt: "2024-02-28" },
]

// ============ Batch Actions ============

const batchActions = [
  {
    label: "导出",
    icon: <Download className="h-3 w-3" />,
    onClick: (rows: Order[]) => console.log("导出:", rows.map((r) => r.id)),
  },
  {
    label: "删除",
    icon: <Trash2 className="h-3 w-3" />,
    variant: "destructive" as const,
    onClick: (rows: Order[]) => console.log("删除:", rows.map((r) => r.id)),
  },
]

// ============ Columns ============

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "code",
    header: "订单编码",
    meta: { width: 150, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
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
        { label: "待确认", value: "待确认" },
        { label: "已确认", value: "已确认" },
        { label: "生产中", value: "生产中" },
        { label: "已发货", value: "已发货" },
        { label: "已完成", value: "已完成" },
        { label: "已取消", value: "已取消" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => <StatusBadge status={row.getValue("status") as OrderStatus} />,
  },
  {
    accessorKey: "totalAmount",
    header: "订单总额",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => formatCurrency(row.getValue("totalAmount") as number),
  },
  {
    accessorKey: "shippingAddress",
    header: "收货地址",
    meta: { width: 200 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const address = row.getValue("shippingAddress") as string | undefined
      return address ? address.substring(0, 30) + (address.length > 30 ? "..." : "") : "-"
    },
  },
  {
    accessorKey: "shippingDate",
    header: "发货日期",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const date = row.getValue("shippingDate") as string | undefined
      return date || "-"
    },
  },
  {
    accessorKey: "createdAt",
    header: "创建日期",
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
          <DropdownMenuItem onClick={() => console.log("查看详情", row.original.id)}>
            <Package className="h-4 w-4 mr-2" />
            查看详情
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("编辑", row.original.id)}>
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("下载", row.original.id)}>
            <Download className="h-4 w-4 mr-2" />
            导出
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

export function OrderList() {
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)

  // const { data, isLoading } = useOrders()
  // const deleteMutation = useDeleteOrder()

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(mockOrders, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return mockOrders

    return mockOrders.filter((order: Order) => {
      // Code filter
      if (filterValues.code && typeof filterValues.code === 'string') {
        if (!order.code.toLowerCase().includes(filterValues.code.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (order.status !== filterValues.status) return false
      }
      // Amount min filter
      if (filterValues.amountMin && typeof filterValues.amountMin === 'number') {
        if (order.totalAmount < filterValues.amountMin) return false
      }
      // Amount max filter
      if (filterValues.amountMax && typeof filterValues.amountMax === 'number') {
        if (order.totalAmount > filterValues.amountMax) return false
      }
      // CreatedAt date range filter
      if (filterValues.createdAt && Array.isArray(filterValues.createdAt)) {
        const [startDate, endDate] = filterValues.createdAt as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const orderDate = new Date(order.createdAt)
          if (startDate && orderDate < startDate) return false
          if (endDate && orderDate > endDate) return false
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

  const handleCreate = async (values: unknown) => {
    console.log("创建订单:", values)
    setShowCreateModal(false)
  }

  // Stats data
  const stats = React.useMemo(() => {
    const total = filteredData.length
    const pending = filteredData.filter(o => o.status === "待确认").length
    const producing = filteredData.filter(o => o.status === "生产中").length
    const shipped = filteredData.filter(o => o.status === "已发货").length
    const completed = filteredData.filter(o => o.status === "已完成").length
    const totalAmount = filteredData.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    return { total, pending, producing, shipped, completed, totalAmount }
  }, [filteredData])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
            <p className="text-muted-foreground text-sm">管理所有订单，包括创建、发货跟踪和状态更新</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新建订单
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">订单总数</p>
                  <p className="text-xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">待确认</p>
                  <p className="text-xl font-bold text-blue-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-50 rounded-lg">
                  <Settings className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">生产中</p>
                  <p className="text-xl font-bold text-cyan-600">{stats.producing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">已发货</p>
                  <p className="text-xl font-bold text-blue-600">{stats.shipped}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
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
          filters={orderFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_order_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={orderAdvancedFilterFields}
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
          emptyText="暂无订单数据"
          loading={isFilterLoading}
          className="border rounded-lg"
        />

        {/* Create Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>新建订单</DialogTitle>
            </DialogHeader>
            <OrderForm
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

export default OrderList