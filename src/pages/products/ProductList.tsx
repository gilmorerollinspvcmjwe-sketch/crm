"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Package, Download, Trash2, MoreHorizontal, ToggleLeft, ToggleRight, Edit, DollarSign } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "@/forms/ProductForm"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
// import { useProducts, useDeleteProduct, useToggleProductActive } from "@/hooks/api"
import type { Product, ProductCategory } from "@/types/product"
import { cn } from "@/lib/utils"

// ============ Category Badge ============

const categoryConfig: Record<ProductCategory, { label: string; className: string }> = {
  "软件": { label: "软件", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "硬件": { label: "硬件", className: "bg-orange-100 text-orange-800 border-orange-200" },
  "服务": { label: "服务", className: "bg-green-100 text-green-800 border-green-200" },
  "解决方案": { label: "解决方案", className: "bg-purple-100 text-purple-800 border-purple-200" },
}

function CategoryBadge({ category }: { category: ProductCategory }) {
  const config = categoryConfig[category]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

// ============ Active Badge ============

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant="outline" className={cn("font-medium", isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200")}>
      {isActive ? "上架" : "下架"}
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

const mockProducts: Product[] = [
  { id: "P001", name: "服务器A1", category: "硬件", code: "PROD-A1", description: "高性能企业服务器", price: 15000, cost: 10000, unit: "台", stock: 50, isActive: true, createdAt: "2024-01-15", updatedAt: "2024-03-28" },
  { id: "P002", name: "交换机B2", category: "硬件", code: "PROD-B2", description: "千兆网络交换机", price: 5000, cost: 3000, unit: "台", stock: 100, isActive: true, createdAt: "2024-02-20", updatedAt: "2024-03-25" },
  { id: "P003", name: "ERP管理系统", category: "软件", code: "PROD-ERP", description: "企业资源规划系统", price: 80000, cost: 20000, unit: "套", stock: 999, isActive: true, createdAt: "2024-01-08", updatedAt: "2024-03-29" },
  { id: "P004", name: "技术支持服务", category: "服务", code: "PROD-TS", description: "年度技术支持", price: 20000, cost: 8000, unit: "年", stock: 999, isActive: true, createdAt: "2024-03-12", updatedAt: "2024-03-20" },
  { id: "P005", name: "数据中心解决方案", category: "解决方案", code: "PROD-DC", description: "完整数据中心解决方案", price: 500000, cost: 300000, unit: "套", stock: 10, isActive: true, createdAt: "2024-02-28", updatedAt: "2024-03-29" },
  { id: "P006", name: "路由器C3", category: "硬件", code: "PROD-C3", description: "企业级路由器", price: 8000, cost: 5000, unit: "台", stock: 30, isActive: false, createdAt: "2024-01-22", updatedAt: "2024-02-15" },
  { id: "P007", name: "CRM系统", category: "软件", code: "PROD-CRM", description: "客户关系管理系统", price: 60000, cost: 15000, unit: "套", stock: 999, isActive: true, createdAt: "2024-04-05", updatedAt: "2024-04-05" },
  { id: "P008", name: "培训服务", category: "服务", code: "PROD-TR", description: "产品培训服务", price: 5000, cost: 2000, unit: "次", stock: 999, isActive: true, createdAt: "2024-05-05", updatedAt: "2024-05-05" },
]

// ============ Filter Configuration ============

const productFilters: FilterItem[] = [
  {
    name: "name",
    label: "产品名称",
    type: "text",
    placeholder: "搜索产品名称",
  },
  {
    name: "category",
    label: "分类",
    type: "select",
    placeholder: "选择分类",
    options: [
      { label: "软件", value: "软件" },
      { label: "硬件", value: "硬件" },
      { label: "服务", value: "服务" },
      { label: "解决方案", value: "解决方案" },
    ],
  },
  {
    name: "isActive",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "上架", value: "true" },
      { label: "下架", value: "false" },
    ],
  },
  {
    name: "code",
    label: "产品编码",
    type: "text",
    placeholder: "搜索产品编码",
  },
]

// ============ Advanced Filter Fields Configuration ============

const productAdvancedFilterFields: FilterField[] = [
  {
    name: "name",
    label: "产品名称",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入产品名称",
  },
  {
    name: "code",
    label: "产品编码",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入产品编码",
  },
  {
    name: "category",
    label: "分类",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "软件", value: "软件" },
      { label: "硬件", value: "硬件" },
      { label: "服务", value: "服务" },
      { label: "解决方案", value: "解决方案" },
    ],
  },
  {
    name: "price",
    label: "售价",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入价格",
  },
  {
    name: "cost",
    label: "成本价",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入成本",
  },
  {
    name: "stock",
    label: "库存",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入库存",
  },
  {
    name: "isActive",
    label: "上架状态",
    type: "select",
    operators: ["eq", "neq"],
    options: [
      { label: "上架", value: "true" },
      { label: "下架", value: "false" },
    ],
  },
]

// ============ Columns ============

function getColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<Product, string>[] {
  return [
    {
      accessorKey: "code",
      header: "产品编码",
      meta: { width: 120, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
    },
    {
      accessorKey: "name",
      header: "产品名称",
      meta: { width: 180, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
    },
    {
      accessorKey: "category",
      header: "分类",
      meta: {
        width: 80,
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { label: "软件", value: "软件" },
          { label: "硬件", value: "硬件" },
          { label: "服务", value: "服务" },
          { label: "解决方案", value: "解决方案" },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => <CategoryBadge category={row.getValue("category") as ProductCategory} />,
    },
    {
      accessorKey: "price",
      header: "售价",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => formatCurrency(row.getValue("price") as number),
    },
    {
      accessorKey: "cost",
      header: "成本价",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => formatCurrency(row.getValue("cost") as number),
    },
    {
      accessorKey: "unit",
      header: "单位",
      meta: { width: 60 } as DataTableColumnMeta,
    },
    {
      accessorKey: "stock",
      header: "库存",
      meta: { width: 80, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number
        const lowStock = stock < 20
        return (
          <span className={cn("font-medium", lowStock && "text-yellow-600")}>
            {stock}
            {lowStock && " ⚠️"}
          </span>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "状态",
      meta: {
        width: 80,
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { label: "上架", value: "true" },
          { label: "下架", value: "false" },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => <ActiveBadge isActive={row.getValue("isActive") as boolean} />,
    },
    {
      accessorKey: "createdAt",
      header: "创建日期",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
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
            <DropdownMenuItem onClick={() => navigate(`/products/${row.original.id}`)}>
              <Package className="h-4 w-4 mr-2" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/products/${row.original.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("切换状态", row.original.id)}>
              {row.original.isActive ? (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  下架
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  上架
                </>
              )}
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

export function ProductList() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)

  const columns = React.useMemo(() => getColumns(navigate), [navigate])

  // const { data, isLoading } = useProducts()
  // const deleteMutation = useDeleteProduct()
  // const toggleMutation = useToggleProductActive()

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(mockProducts, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return mockProducts

    return mockProducts.filter((product: Product) => {
      // Name filter
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!product.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      // Code filter
      if (filterValues.code && typeof filterValues.code === 'string') {
        if (!product.code.toLowerCase().includes(filterValues.code.toLowerCase())) return false
      }
      // Category filter
      if (filterValues.category && filterValues.category !== '') {
        if (product.category !== filterValues.category) return false
      }
      // IsActive filter
      if (filterValues.isActive !== undefined && filterValues.isActive !== '') {
        const isActive = filterValues.isActive === 'true' || filterValues.isActive === true
        if (product.isActive !== isActive) return false
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
    console.log("创建产品:", values)
    setShowCreateModal(false)
  }

  // Selected rows count
  const selectedCount = React.useMemo(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key as keyof typeof rowSelection]).length
  }, [rowSelection])

  // Stats
  const stats = React.useMemo(() => {
    const total = mockProducts.length
    const activeCount = mockProducts.filter(p => p.isActive).length
    const inactiveCount = total - activeCount
    const totalValue = mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
    return { total, activeCount, inactiveCount, totalValue }
  }, [])

  const batchActions = [
    {
      label: t("product.batch.export", "导出"),
      icon: <Download className="h-3 w-3" />,
      onClick: (rows: Product[]) => {
        console.log("导出:", rows.map(r => r.id))
        toast({
          title: t("product.exportSuccess", `已准备导出 ${rows.length} 个产品`),
        })
      },
    },
    {
      label: t("product.batch.active", "批量上架"),
      icon: <ToggleRight className="h-3 w-3" />,
      onClick: (rows: Product[]) => {
        console.log("上架:", rows.map(r => r.id))
        toast({
          title: t("product.batchActiveSuccess", `已上架 ${rows.length} 个产品`),
        })
      },
    },
    {
      label: t("product.batch.inactive", "批量下架"),
      icon: <ToggleLeft className="h-3 w-3" />,
      onClick: (rows: Product[]) => {
        console.log("下架:", rows.map(r => r.id))
        toast({
          title: t("product.batchInactiveSuccess", `已下架 ${rows.length} 个产品`),
        })
      },
    },
    {
      label: t("product.batch.delete", "删除"),
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: (rows: Product[]) => {
        console.log("删除:", rows.map(r => r.id))
        toast({
          title: t("product.deleteSuccess", `已删除 ${rows.length} 个产品`),
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
            <h1 className="text-2xl font-bold tracking-tight">{t("product.title", "产品管理")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("product.description", "管理所有产品，包括定价、库存和上架状态")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("product.create", "新建产品")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t("product.total", "共")} <strong className="text-foreground">{filteredData.length}</strong> {t("product.records", "条记录")}</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t("product.selected", "已选择")} {selectedCount} {t("product.items", "项")}
            </Badge>
          )}
        </div>

        {/* FilterBar - HubSpot 风格筛选栏 */}
        <FilterBar
          filters={productFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_product_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={productAdvancedFilterFields}
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
          emptyText={t("product.empty", "暂无产品数据")}
          loading={isFilterLoading}
          className="border rounded-lg"
        />

        {/* Create Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新建产品</DialogTitle>
            </DialogHeader>
            <ProductForm
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

export default ProductList