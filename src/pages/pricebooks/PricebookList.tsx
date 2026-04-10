"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Download, Trash2, MoreHorizontal, Star, Edit, Eye, FileDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { applyFilterGroup, createEmptyFilterGroup } from "@/components/FilterBar/filterUtils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PricebookForm } from "@/forms/PricebookForm"
import { useToast } from "@/hooks/use-toast"
// import { usePricebooks, useDeletePricebook, useSetDefaultPricebook } from "@/hooks/api"
import type { Pricebook } from "@/types/pricebook"
import { cn } from "@/lib/utils"

// ============ Status Badge ============

type PricebookStatus = "活跃" | "归档" | "草稿"

const statusConfig: Record<PricebookStatus, { label: string; className: string }> = {
  "活跃": { label: "活跃", className: "bg-green-100 text-green-800 border-green-200" },
  "归档": { label: "归档", className: "bg-gray-100 text-gray-800 border-gray-200" },
  "草稿": { label: "草稿", className: "bg-blue-100 text-blue-800 border-blue-200" },
}

function StatusBadge({ status }: { status: PricebookStatus }) {
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

// ============ Filter Configuration ============

const pricebookFilters: FilterItem[] = [
  {
    name: "name",
    label: "价格表名称",
    type: "text",
    placeholder: "搜索价格表名称",
  },
  {
    name: "code",
    label: "编码",
    type: "text",
    placeholder: "搜索编码",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "活跃", value: "活跃" },
      { label: "归档", value: "归档" },
      { label: "草稿", value: "草稿" },
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
  {
    name: "dateRange",
    label: "日期范围",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
]

// ============ Advanced Filter Fields Configuration ============

const pricebookAdvancedFilterFields: FilterField[] = [
  {
    name: "name",
    label: "价格表名称",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入价格表名称",
  },
  {
    name: "code",
    label: "编码",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入编码",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "活跃", value: "活跃" },
      { label: "归档", value: "归档" },
      { label: "草稿", value: "草稿" },
    ],
  },
  {
    name: "currency",
    label: "币种",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "CNY", value: "CNY" },
      { label: "USD", value: "USD" },
      { label: "EUR", value: "EUR" },
    ],
  },
  {
    name: "discountType",
    label: "折扣类型",
    type: "select",
    operators: ["eq", "neq"],
    options: [
      { label: "百分比", value: "percentage" },
      { label: "固定金额", value: "fixed" },
    ],
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

const mockPricebooks: Pricebook[] = [
  { id: "PB-001", name: "2024年标准价格手册", code: "PRICE-STD-2024", isDefault: true, isActive: true, currency: "CNY", discountType: "percentage", defaultDiscount: 0.95, startDate: "2024-01-01", endDate: "2024-12-31", createdAt: "2024-01-01", updatedAt: "2024-03-28", entries: [] },
  { id: "PB-002", name: "VIP客户价格手册", code: "PRICE-VIP-2024", isDefault: false, isActive: true, currency: "CNY", discountType: "percentage", defaultDiscount: 0.85, applicableLevels: ["A", "B"], createdAt: "2024-01-15", updatedAt: "2024-02-20", entries: [] },
  { id: "PB-003", name: "促销活动价格手册", code: "PRICE-PROMO-2024", isDefault: false, isActive: true, currency: "CNY", discountType: "fixed", startDate: "2024-03-01", endDate: "2024-03-31", createdAt: "2024-02-28", updatedAt: "2024-03-01", entries: [] },
  { id: "PB-004", name: "新客户优惠价格手册", code: "PRICE-NEW-2024", isDefault: false, isActive: true, currency: "CNY", discountType: "percentage", defaultDiscount: 0.9, createdAt: "2024-03-10", updatedAt: "2024-03-10", entries: [] },
  { id: "PB-005", name: "2023年标准价格手册", code: "PRICE-STD-2023", isDefault: false, isActive: false, currency: "CNY", discountType: "percentage", createdAt: "2023-01-01", updatedAt: "2024-01-01", entries: [] },
]

// ============ Columns ============

function getColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<Pricebook, string>[] {
  return [
    {
      accessorKey: "code",
      header: "编码",
      meta: { width: 150, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
    },
    {
      accessorKey: "name",
      header: "名称",
      meta: { width: 200, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isDefault && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          <span>{row.getValue("name") as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "currency",
      header: "货币",
      meta: { width: 60 } as DataTableColumnMeta,
    },
    {
      accessorKey: "discountType",
      header: "折扣类型",
      meta: { width: 80, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const type = row.getValue("discountType") as string
        return type === "percentage" ? "百分比" : "固定金额"
      },
    },
    {
      accessorKey: "defaultDiscount",
      header: "默认折扣",
      meta: { width: 80, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const discount = row.getValue("defaultDiscount") as number | undefined
        const type = row.original.discountType
        if (!discount) return "-"
        return type === "percentage" ? `${(discount * 100).toFixed(0)}%` : `¥${discount.toFixed(2)}`
      },
    },
    {
      accessorKey: "startDate",
      header: "生效日期",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const date = row.getValue("startDate") as string | undefined
        return date || "-"
      },
    },
    {
      accessorKey: "endDate",
      header: "失效日期",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const date = row.getValue("endDate") as string | undefined
        return date || "-"
      },
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
          { label: "活跃", value: "活跃" },
          { label: "归档", value: "归档" },
          { label: "草稿", value: "草稿" },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => {
        // Determine status based on isActive and date
        const isActive = row.original.isActive
        const endDate = row.original.endDate
        let status: PricebookStatus = "活跃"
        if (!isActive) {
          status = "归档"
        } else if (endDate && new Date(endDate) < new Date()) {
          status = "归档"
        } else if (row.original.isDefault && isActive) {
          status = "活跃"
        }
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: "createdAt",
      header: "创建日期",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
    },
    {
      id: "actions",
      header: "操作",
      meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/pricebooks/${row.original.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/pricebooks/${row.original.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </DropdownMenuItem>
            {!row.original.isDefault && (
              <DropdownMenuItem onClick={() => console.log("设为默认", row.original.id)}>
                <Star className="h-4 w-4 mr-2" />
                设为默认
              </DropdownMenuItem>
            )}
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
}

// ============ Component ============

export function PricebookList() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // UI State
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  
  // Advanced Filter State
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))

  const columns = React.useMemo(() => getColumns(navigate), [navigate])

  // const { data, isLoading } = usePricebooks()
  // const deleteMutation = useDeletePricebook()
  // const setDefaultMutation = useSetDefaultPricebook()

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = mockPricebooks.length
    const active = mockPricebooks.filter(p => p.isActive).length
    const archived = total - active
    return { total, active, archived }
  }, [])

  // Filtered data
  const filteredData = React.useMemo(() => {
    // Use advanced filter if there are valid conditions
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(mockPricebooks, advancedFilterGroup)
    }
    
    // Use simple filter
    if (Object.keys(filterValues).length === 0) return mockPricebooks

    return mockPricebooks.filter((pricebook: Pricebook) => {
      // Name filter
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!pricebook.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      // Code filter
      if (filterValues.code && typeof filterValues.code === 'string') {
        if (!pricebook.code?.toLowerCase().includes(filterValues.code.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        const status: PricebookStatus = filterValues.status as PricebookStatus
        const isActive = pricebook.isActive
        let currentStatus: PricebookStatus = "活跃"
        if (!isActive) {
          currentStatus = "归档"
        } else if (pricebook.endDate && new Date(pricebook.endDate) < new Date()) {
          currentStatus = "归档"
        }
        if (currentStatus !== status) return false
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

  // Batch actions
  const batchActions = [
    {
      label: t("pricebook.batch.export", "导出"),
      icon: <Download className="h-3 w-3" />,
      onClick: (rows: Pricebook[]) => console.log("导出:", rows.map(r => r.id)),
    },
    {
      label: t("pricebook.batch.delete", "删除"),
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: (rows: Pricebook[]) => console.log("删除:", rows.map(r => r.id)),
    },
  ]

  const handleCreate = async (values: any) => {
    console.log("创建价格手册:", values)
    setCreateModalOpen(false)
    toast({
      title: t("pricebook.createSuccess", "价格手册创建成功"),
      description: t("pricebook.createSuccessDesc", `价格手册「${values.name}」已成功创建`),
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{t("pricebook.title", "价格表管理")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("pricebook.description", "管理产品价格策略，支持多价格表、折扣规则")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => console.log("导出全部")}>
              <FileDown className="mr-2 h-4 w-4" />
              {t("pricebook.exportAll", "导出全部")}
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("pricebook.create", "新建价格表")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t("pricebook.total", "共")} <strong className="text-foreground">{filteredData.length}</strong> {t("pricebook.records", "条记录")}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {t("pricebook.active", "活跃")} <strong className="text-foreground">{stats.active}</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            {t("pricebook.archived", "归档")} <strong className="text-foreground">{stats.archived}</strong>
          </span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t("pricebook.selected", "已选择")} {selectedCount} {t("pricebook.items", "项")}
            </Badge>
          )}
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={pricebookFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_pricebook_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={pricebookAdvancedFilterFields}
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
          emptyText={t("pricebook.empty", "暂无价格表数据")}
          loading={isFilterLoading}
          className="border rounded-lg"
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title={t("pricebook.createTitle", "新建价格表")}
          width={600}
        >
          <PricebookForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  )
}

export default PricebookList
