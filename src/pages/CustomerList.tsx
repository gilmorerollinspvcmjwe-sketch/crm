"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Activity, AlertTriangle, ArrowUpRight, Building2, CheckCircle2, Clock3, Download, Eye, Edit, FileDown, Loader2, Mail, MoreHorizontal, Phone, Plus, Sparkles, Trash2, UserPlus } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { CustomerForm } from "@/forms/CustomerForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { applyFilterGroup, createEmptyFilterGroup } from "@/components/FilterBar/filterUtils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useBulkDeleteCustomers,
  useExportCustomers,
  useBulkAssignCustomers,
  type ExportFormat,
} from "@/hooks/api/useCustomers"
import type { Customer, CustomerStatus } from "@/types/api"
import type { CustomerFormValues } from "@/schemas"
import { cn } from "@/lib/utils"

// ============ Status Badge ============

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  "潜在": { label: "潜在", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "活跃": { label: "活跃", className: "bg-green-100 text-green-800 border-green-200" },
  "沉默": { label: "沉默", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "流失": { label: "流失", className: "bg-red-100 text-red-800 border-red-200" },
}

function formatDate(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
}

function getLastTouchMeta(value?: string) {
  if (!value) return { label: "暂无互动", note: "需要建立初始接触", tone: "muted" as const }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { label: value, note: "记录时间格式异常", tone: "muted" as const }
  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000))
  if (diff <= 3) return { label: diff === 0 ? "今天" : `${diff}天前`, note: "关系仍在持续推进", tone: "fresh" as const }
  if (diff <= 14) return { label: `${diff}天前`, note: "保持例行跟进即可", tone: "steady" as const }
  if (diff <= 30) return { label: `${diff}天前`, note: "建议安排重新触达", tone: "watch" as const }
  return { label: `${diff}天前`, note: "关系正在快速降温", tone: "risk" as const }
}

function getHealthMeta(score: number) {
  if (score >= 80) return { label: "核心", width: "100%", className: "bg-green-100 text-green-800 border-green-200" }
  if (score >= 60) return { label: "稳态", width: "78%", className: "bg-blue-100 text-blue-800 border-blue-200" }
  if (score >= 40) return { label: "观察", width: "54%", className: "bg-yellow-100 text-yellow-800 border-yellow-200" }
  return { label: "预警", width: "32%", className: "bg-red-100 text-red-800 border-red-200" }
}

function getNextStep(customer: Customer) {
  if (customer.status === "流失") return "安排挽回动作"
  if (customer.status === "沉默") return "重新激活联系人"
  if ((customer.score || 0) >= 80) return "推进商机机会"
  if (!customer.lastContact) return "完成首次触达"
  return "安排下一次跟进"
}

function SummaryMetric({ label, value, note, icon }: { label: string; value: number; note: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-muted/60 text-foreground/78">{icon}</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: CustomerStatus }) {
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

// ============ Score Badge ============

function ScoreBadge({ score }: { score: number }) {
  let className = "bg-gray-100 text-gray-800 border-gray-200"
  if (score >= 80) className = "bg-green-100 text-green-800 border-green-200"
  else if (score >= 60) className = "bg-blue-100 text-blue-800 border-blue-200"
  else if (score >= 40) className = "bg-yellow-100 text-yellow-800 border-yellow-200"
  else className = "bg-red-100 text-red-800 border-red-200"

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      className
    )}>
      {score}分
    </span>
  )
}

// ============ Filter Configuration ============

const customerFilters: FilterItem[] = [
  {
    name: "name",
    label: "客户姓名",
    type: "text",
    placeholder: "搜索客户姓名",
  },
  {
    name: "company",
    label: "公司",
    type: "text",
    placeholder: "搜索公司名称",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "潜在", value: "潜在" },
      { label: "活跃", value: "活跃" },
      { label: "沉默", value: "沉默" },
      { label: "流失", value: "流失" },
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
    name: "createdAt",
    label: "创建时间",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
  {
    name: "score",
    label: "评分范围",
    type: "number",
    placeholder: "最低评分",
    min: 0,
    max: 100,
  },
]

// ============ Advanced Filter Fields Configuration ============

const customerAdvancedFilterFields: FilterField[] = [
  {
    name: "name",
    label: "客户姓名",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入客户姓名",
  },
  {
    name: "company",
    label: "公司",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入公司名称",
  },
  {
    name: "email",
    label: "邮箱",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入邮箱",
  },
  {
    name: "phone",
    label: "电话",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入电话",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "潜在", value: "潜在" },
      { label: "活跃", value: "活跃" },
      { label: "沉默", value: "沉默" },
      { label: "流失", value: "流失" },
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
    name: "score",
    label: "评分",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    max: 100,
    placeholder: "输入评分",
  },
  {
    name: "createdAt",
    label: "创建时间",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
  {
    name: "lastContact",
    label: "最近联系",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
]

// ============ Column Definitions ============

const columns: ColumnDef<Customer, string>[] = [
  {
    accessorKey: "id",
    header: "客户ID",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "name",
    header: "姓名",
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "company",
    header: "公司",
    meta: {
      width: 180,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "email",
    header: "邮箱",
    meta: { width: 200 } as DataTableColumnMeta,
  },
  {
    accessorKey: "phone",
    header: "电话",
    meta: { width: 140 } as DataTableColumnMeta,
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
        { label: "潜在", value: "潜在" },
        { label: "活跃", value: "活跃" },
        { label: "沉默", value: "沉默" },
        { label: "流失", value: "流失" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("status") as CustomerStatus} />
    ),
  },
  {
    accessorKey: "score",
    header: "评分",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => <ScoreBadge score={Number(row.getValue("score"))} />,
  },
  {
    accessorKey: "level",
    header: "等级",
    meta: { width: 70, sortable: true, filterable: true, filterType: "select", filterOptions: [
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "C", value: "C" },
      { label: "D", value: "D" },
    ] } as DataTableColumnMeta,
    cell: ({ row }) => {
      const level = row.getValue("level") as string
      if (!level) return <span className="text-muted-foreground">-</span>
      const className = level === "A" ? "bg-red-100 text-red-800" : level === "B" ? "bg-orange-100 text-orange-800" : level === "C" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
      return <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", className, level === "A" ? "border-red-200" : level === "B" ? "border-orange-200" : level === "C" ? "border-yellow-200" : "border-gray-200")}>{level}</span>
    },
  },
  {
    accessorKey: "industry",
    header: "行业",
    meta: { width: 120, sortable: true, filterable: true, filterType: "text" } as DataTableColumnMeta,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("industry") as string || "-"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "lastContact",
    header: "最近联系",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "assignee",
    header: "负责人",
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "李明", value: "李明" },
        { label: "王芳", value: "王芳" },
        { label: "陈静", value: "陈静" },
      ],
    } as DataTableColumnMeta,
  },
]

// ============ Assignees List (for bulk assign) ============

const assignees = [
  { id: "李明", name: "李明" },
  { id: "王芳", name: "王芳" },
  { id: "陈静", name: "陈静" },
]

// ============ Batch Action Item ============

interface BatchActionItem {
  label: string
  icon: React.ReactNode
  variant?: "default" | "destructive"
  onClick: (rows: Customer[]) => void
}

// ============ CustomerList Page ============

export function CustomerList() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // UI State
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  
  // Advanced Filter State
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  
  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("excel")
  const [selectedRowsForExport, setSelectedRowsForExport] = React.useState<Customer[]>([])
  
  // Bulk Assign Modal State
  const [assignModalOpen, setAssignModalOpen] = React.useState(false)
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("")
  const [selectedRowsForAssign, setSelectedRowsForAssign] = React.useState<Customer[]>([])

  // API Hooks
  const { data, isLoading } = useCustomers()
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()
  const bulkDeleteMutation = useBulkDeleteCustomers()
  const exportMutation = useExportCustomers()
  const bulkAssignMutation = useBulkAssignCustomers()

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    const customers = data?.data || []
    
    // Use advanced filter if there are valid conditions
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(customers, advancedFilterGroup)
    }
    
    // Use simple filter
    if (Object.keys(filterValues).length === 0) return customers

    return customers.filter((customer: Customer) => {
      // Name filter
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!customer.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      // Company filter
      if (filterValues.company && typeof filterValues.company === 'string') {
        if (!customer.company?.toLowerCase().includes(filterValues.company.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (customer.status !== filterValues.status) return false
      }
      // Assignee filter
      if (filterValues.assignee && filterValues.assignee !== '') {
        if (customer.assignee !== filterValues.assignee) return false
      }
      // Score filter
      if (filterValues.score && typeof filterValues.score === 'number') {
        if (customer.score < filterValues.score) return false
      }
      // CreatedAt date range filter
      if (filterValues.createdAt && Array.isArray(filterValues.createdAt)) {
        const [startDate, endDate] = filterValues.createdAt as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const customerDate = new Date(customer.createdAt)
          if (startDate && customerDate < startDate) return false
          if (endDate && customerDate > endDate) return false
        }
      }
      return true
    })
  }, [data?.data, filterValues, advancedFilterGroup])

  // Selected rows count
  const selectedCount = React.useMemo(() => {
    return Object.keys(rowSelection).filter(key => rowSelection[key as keyof typeof rowSelection]).length
  }, [rowSelection])

  const summary = React.useMemo(() => ({
    active: filteredData.filter((item) => item.status === "活跃").length,
    silent: filteredData.filter((item) => item.status === "沉默").length,
    risk: filteredData.filter((item) => item.status === "流失" || item.score < 40).length,
    keyAccounts: filteredData.filter((item) => item.level === "A" || item.score >= 80).length,
  }), [filteredData])

  // Handlers
  const handleCreate = async (values: CustomerFormValues) => {
    try {
      // Map form values to Customer type
      const customerData: Omit<Customer, "id" | "createdAt"> = {
        name: values.name,
        company: values.contactName || "",
        email: values.contactEmail || "",
        phone: values.contactPhone || "",
        status: "潜在", // Default status
        score: 50, // Default score
        assignee: "李明", // Default assignee
        lastContact: new Date().toISOString().split('T')[0],
      }
      await createMutation.mutateAsync(customerData)
      setCreateModalOpen(false)
      toast({
        title: t("customer.createSuccess", "客户创建成功"),
        description: t("customer.createSuccessDesc", `客户「${values.name}」已成功创建`),
      })
    } catch (error) {
      console.error("创建失败:", error)
      toast({
        title: t("customer.createFailed", "创建失败"),
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (values: CustomerFormValues) => {
    if (!selectedCustomer) return
    try {
      await updateMutation.mutateAsync({
        id: selectedCustomer.id,
        name: values.name,
        company: values.contactName || selectedCustomer.company,
        email: values.contactEmail || selectedCustomer.email,
        phone: values.contactPhone || selectedCustomer.phone,
      })
      setEditModalOpen(false)
      setSelectedCustomer(null)
      toast({
        title: t("customer.updateSuccess", "客户更新成功"),
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: t("customer.updateFailed", "更新失败"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteMutation.mutateAsync(deletingId)
      setDeleteConfirmOpen(false)
      setDeletingId(null)
      toast({
        title: t("customer.deleteSuccess", "客户已删除"),
      })
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: t("customer.deleteFailed", "删除失败"),
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = (rows: Customer[]) => {
    const ids = rows.map((r) => r.id)
    bulkDeleteMutation.mutate(ids)
    setRowSelection({})
    toast({
      title: t("customer.bulkDeleteSuccess", `已删除 ${ids.length} 个客户`),
    })
  }

  // Export handlers
  const handleExport = (rows: Customer[]) => {
    setSelectedRowsForExport(rows)
    setExportModalOpen(true)
  }

  const handleExportAll = () => {
    setSelectedRowsForExport([])
    setExportModalOpen(true)
  }

  const handleExportConfirm = async () => {
    try {
      const ids = selectedRowsForExport.length > 0 
        ? selectedRowsForExport.map(r => r.id) 
        : undefined
      
      await exportMutation.mutateAsync({
        ids,
        options: {
          format: exportFormat,
          fileName: `customers_${new Date().toISOString().split('T')[0]}`,
        },
      })
      
      setExportModalOpen(false)
      toast({
        title: t("customer.exportSuccess", "导出成功"),
        description: t("customer.exportSuccessDesc", `已导出 ${selectedRowsForExport.length || filteredData.length} 个客户数据`),
      })
    } catch (error) {
      console.error("导出失败:", error)
      toast({
        title: t("customer.exportFailed", "导出失败"),
        variant: "destructive",
      })
    }
  }

  // Bulk assign handlers
  const handleBulkAssign = (rows: Customer[]) => {
    setSelectedRowsForAssign(rows)
    setSelectedAssignee("")
    setAssignModalOpen(true)
  }

  const handleBulkAssignConfirm = async () => {
    if (!selectedAssignee || selectedRowsForAssign.length === 0) return
    
    try {
      await bulkAssignMutation.mutateAsync({
        ids: selectedRowsForAssign.map(r => r.id),
        assignee: selectedAssignee,
      })
      
      setAssignModalOpen(false)
      setRowSelection({})
      toast({
        title: t("customer.bulkAssignSuccess", "分配成功"),
        description: t("customer.bulkAssignSuccessDesc", `已将 ${selectedRowsForAssign.length} 个客户分配给 ${selectedAssignee}`),
      })
    } catch (error) {
      console.error("分配失败:", error)
      toast({
        title: t("customer.bulkAssignFailed", "分配失败"),
        variant: "destructive",
      })
    }
  }

  // Filter handlers
  const handleFilterChange = async (values: Record<string, unknown>) => {
    setIsFilterLoading(true)
    setFilterValues(values)
    // Clear advanced filter when using simple filter
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }

  const handleAdvancedFilterChange = async (group: FilterGroupLegacy) => {
    setIsFilterLoading(true)
    setAdvancedFilterGroup(group)
    // Clear simple filter when using advanced filter
    setFilterValues({})
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }

  const handleFilterReset = () => {
    setFilterValues({})
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
  }

  // Columns with actions (computed inside component to access state)
  const columnsWithActions = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: Customer } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                navigate(`/customers/${row.original.id}`)
              }}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                setSelectedCustomer(row.original)
                setEditModalOpen(true)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`mailto:${row.original.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                发送邮件
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
      label: t("customer.batch.sendEmail", "发送邮件"),
      icon: <Mail className="h-3 w-3" />,
      onClick: (rows) => {
        const emails = rows.map((r) => r.email).filter(Boolean)
        if (emails.length > 0) {
          window.open(`mailto:${emails.join(',')}`)
        }
        toast({
          title: t("customer.batch.emailOpened", `准备发送邮件给 ${emails.length} 个客户`),
        })
      },
    },
    {
      label: t("customer.batch.assign", "分配负责人"),
      icon: <UserPlus className="h-3 w-3" />,
      onClick: handleBulkAssign,
    },
    {
      label: t("customer.batch.export", "导出"),
      icon: <Download className="h-3 w-3" />,
      onClick: handleExport,
    },
    {
      label: t("customer.batch.delete", "删除"),
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive",
      onClick: handleBulkDelete,
    },
  ]

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-300">
      <div className="mx-auto w-full space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              Customer relationship workspace
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">{t("customer.title", "客户管理")}</h1>
            <p className="mt-3 max-w-[72ch] text-sm text-muted-foreground">
              管理所有客户信息，支持筛选、排序、批量操作，同时保留客户经营判断所需的全部字段。
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="mr-2 h-4 w-4" />
              {t("customer.exportAll", "导出全部")}
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("customer.create", "新增客户")}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric label="活跃客户" value={summary.active} note="保持稳定互动和推进" icon={<Sparkles className="h-4 w-4" />} />
          <SummaryMetric label="沉默客户" value={summary.silent} note="建议重新安排一次触达" icon={<Clock3 className="h-4 w-4" />} />
          <SummaryMetric label="风险账户" value={summary.risk} note="需要优先修复关系和信号" icon={<AlertTriangle className="h-4 w-4" />} />
          <SummaryMetric label="关键客户" value={summary.keyAccounts} note="重点维护的高价值账户" icon={<Building2 className="h-4 w-4" />} />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t("customer.total", "共")} <strong className="text-foreground">{filteredData.length}</strong> {t("customer.records", "条记录")}</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t("customer.selected", "已选择")} {selectedCount} {t("customer.items", "项")}
            </Badge>
          )}
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={customerFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_customer_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={customerAdvancedFilterFields}
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
          emptyText={t("customer.empty", "暂无客户数据")}
          loading={isLoading || isFilterLoading}
          className="rounded-[1.25rem] border-none"
          onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title={t("customer.createTitle", "新增客户")}
          width={600}
        >
          <CustomerForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
            loading={createMutation.isPending}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open)
            if (!open) setSelectedCustomer(null)
          }}
          title={t("customer.editTitle", "编辑客户")}
          width={600}
        >
          {selectedCustomer && (
            <CustomerForm
              mode="edit"
              initialValues={{
                name: selectedCustomer.name,
                type: "enterprise",
                status: "active",
                contactName: selectedCustomer.company,
                contactEmail: selectedCustomer.email,
                contactPhone: selectedCustomer.phone,
              }}
              onSubmit={handleEdit}
              onCancel={() => {
                setEditModalOpen(false)
                setSelectedCustomer(null)
              }}
              loading={updateMutation.isPending}
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
          title={t("customer.deleteTitle", "确认删除")}
          content={t("customer.deleteContent", "删除后数据将无法恢复，确定要删除该客户吗？")}
          okType="danger"
          okText={t("common.delete", "删除")}
          onOk={handleDelete}
          confirmLoading={deleteMutation.isPending}
        />

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title={t("customer.exportTitle", "导出客户数据")}
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedRowsForExport.length > 0 
                ? t("customer.exportSelectedDesc", `将导出选中的 ${selectedRowsForExport.length} 个客户数据`)
                : t("customer.exportAllDesc", `将导出全部 ${filteredData.length} 个客户数据`)}
            </p>
            
            <div className="space-y-2">
              <Label>{t("customer.exportFormat", "导出格式")}</Label>
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
              <Button onClick={handleExportConfirm} disabled={exportMutation.isPending}>
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("customer.exporting", "导出中...")}
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    {t("customer.exportConfirm", "确认导出")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Bulk Assign Modal */}
        <Modal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          title={t("customer.assignTitle", "批量分配负责人")}
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("customer.assignDesc", `将 ${selectedRowsForAssign.length} 个客户分配给新负责人`)}
            </p>
            
            <div className="space-y-2">
              <Label>{t("customer.selectAssignee", "选择负责人")}</Label>
              <Select
                value={selectedAssignee}
                onValueChange={setSelectedAssignee}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("customer.assigneePlaceholder", "请选择负责人")} />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
                {t("common.cancel", "取消")}
              </Button>
              <Button 
                onClick={handleBulkAssignConfirm} 
                disabled={!selectedAssignee || bulkAssignMutation.isPending}
              >
                {bulkAssignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("customer.assigning", "分配中...")}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("customer.assignConfirm", "确认分配")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default CustomerList









