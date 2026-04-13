"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Mail, UserPlus, Trash2, ArrowRight, Eye, Edit, MoreHorizontal, FileDown, Loader2, Download, Activity } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { LeadForm } from "@/forms/LeadForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BulkAssignDialog, BulkDeleteDialog } from "@/components/bulk"
import { useToast } from "@/hooks/use-toast"
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useConvertLead,
  useBulkAssignLeads,
  useBulkDeleteLeads,
  useBulkExportLeads,
} from "@/hooks/api/useLeads"
import type { Lead, LeadStatus, LeadSource } from "@/types/api"
import type { LeadFormValues } from "@/schemas"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// ============ Status Badge ============
// 同步 CustomerList 风格：新建(蓝)、跟进中(绿)、已转化(青)、已放弃(灰)
const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  "新建": { label: "新建", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "跟进中": { label: "跟进中", className: "bg-green-100 text-green-800 border-green-200" },
  "已转化": { label: "已转化", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  "已放弃": { label: "已放弃", className: "bg-gray-100 text-gray-800 border-gray-200" },
}

function StatusBadge({ status }: { status: LeadStatus }) {
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

// ============ Source Badge ============

const sourceConfig: Record<LeadSource, { label: string; icon: string }> = {
  "官网": { label: "官网", icon: "🌐" },
  "展会": { label: "展会", icon: "🎤" },
  "推荐": { label: "推荐", icon: "👥" },
  "广告": { label: "广告", icon: "📢" },
  "其他": { label: "其他", icon: "📋" },
}

function SourceBadge({ source }: { source: LeadSource }) {
  const config = sourceConfig[source]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 transition-colors duration-200">
      <span className="text-[10px]">{config.icon}</span>
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

// ============ Level Badge ============
// 同步 CustomerList 风格：高(红)、中(黄)、低(蓝)

type LeadLevel = "高" | "中" | "低"

const levelConfig: Record<LeadLevel, { label: string; className: string }> = {
  "高": { label: "高", className: "bg-red-100 text-red-800 border-red-200" },
  "中": { label: "中", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "低": { label: "低", className: "bg-blue-100 text-blue-800 border-blue-200" },
}

function LevelBadge({ level }: { level: LeadLevel }) {
  const config = levelConfig[level]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}

// ============ Batch Action Item ============

interface BatchActionItem {
  label: string
  icon: React.ReactNode
  variant?: "default" | "destructive"
  onClick: (rows: Lead[]) => void
}

// ============ Filter Configuration ============

const leadFilters: FilterItem[] = [
  {
    name: "name",
    label: "线索姓名",
    type: "text",
    placeholder: "搜索线索姓名",
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    placeholder: "选择状态",
    options: [
      { label: "新建", value: "新建" },
      { label: "跟进中", value: "跟进中" },
      { label: "已转化", value: "已转化" },
      { label: "已放弃", value: "已放弃" },
    ],
  },
  {
    name: "source",
    label: "来源",
    type: "select",
    placeholder: "选择来源",
    options: [
      { label: "官网", value: "官网" },
      { label: "展会", value: "展会" },
      { label: "推荐", value: "推荐" },
      { label: "广告", value: "广告" },
      { label: "其他", value: "其他" },
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
]

// ============ Advanced Filter Fields Configuration ============

const leadAdvancedFilterFields: FilterField[] = [
  {
    name: "name",
    label: "线索姓名",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入姓名",
  },
  {
    name: "company",
    label: "公司",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入公司名",
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
      { label: "新建", value: "新建" },
      { label: "跟进中", value: "跟进中" },
      { label: "已转化", value: "已转化" },
      { label: "已放弃", value: "已放弃" },
    ],
  },
  {
    name: "source",
    label: "来源",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "官网", value: "官网" },
      { label: "展会", value: "展会" },
      { label: "推荐", value: "推荐" },
      { label: "广告", value: "广告" },
      { label: "其他", value: "其他" },
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
    name: "createdAt",
    label: "创建时间",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
  },
]

// ============ Column Definitions ============

const columns: ColumnDef<Lead, string>[] = [
  {
    accessorKey: "id",
    header: "线索ID",
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
    cell: ({ row }) => (
      <span className="font-medium hover:text-primary transition-colors duration-200">
        {row.getValue("name") as string}
      </span>
    ),
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
    cell: ({ row }) => (
      <span className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
        {row.getValue("email") as string}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "电话",
    meta: { width: 140 } as DataTableColumnMeta,
  },
  {
    accessorKey: "source",
    header: "来源",
    meta: {
      width: 80,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "官网", value: "官网" },
        { label: "展会", value: "展会" },
        { label: "推荐", value: "推荐" },
        { label: "广告", value: "广告" },
        { label: "其他", value: "其他" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <SourceBadge source={row.getValue("source") as LeadSource} />
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
        { label: "新建", value: "新建" },
        { label: "跟进中", value: "跟进中" },
        { label: "已转化", value: "已转化" },
        { label: "已放弃", value: "已放弃" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("status") as LeadStatus} />
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
    header: "级别",
    meta: { width: 70, sortable: true, filterable: true, filterType: "select", filterOptions: [
      { label: "高", value: "高" },
      { label: "中", value: "中" },
      { label: "低", value: "低" },
    ] } as DataTableColumnMeta,
    cell: ({ row }) => {
      const level = row.getValue("level") as LeadLevel
      if (!level) return <span className="text-muted-foreground">-</span>
      return <LevelBadge level={level} />
    },
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
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium items-center justify-center">
          {(row.getValue("assignee") as string)?.charAt(0) || "-"}
        </span>
        <span>{row.getValue("assignee") as string}</span>
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.getValue("createdAt") as string}
      </span>
    ),
  },
]

// ============ LeadList Page ============

export function LeadList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [convertConfirmOpen, setConvertConfirmOpen] = React.useState(false)
  const [convertingId, setConvertingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  
  // Bulk operation dialogs
  const [bulkAssignOpen, setBulkAssignOpen] = React.useState(false)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)
  
  // Export Modal State - 同步 CustomerList 风格
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<"xlsx" | "csv">("xlsx")
  const [selectedRowsForExport, setSelectedRowsForExport] = React.useState<Lead[]>([])

  // API Hooks
  const { data, isLoading } = useLeads()
  const createMutation = useCreateLead()
  const updateMutation = useUpdateLead()
  const deleteMutation = useDeleteLead()
  const convertMutation = useConvertLead()
  const bulkAssignMutation = useBulkAssignLeads()
  const bulkDeleteMutation = useBulkDeleteLeads()
  const bulkExportMutation = useBulkExportLeads()

  // Get selected rows
  const selectedRows = React.useMemo(() => {
    const leads = data?.data || []
    const selection = rowSelection as Record<string, boolean>
    return leads.filter((lead: Lead) => selection[lead.id])
  }, [data?.data, rowSelection])

  const selectedCount = selectedRows.length

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    const leads = data?.data || []
    
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(leads, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return leads

    return leads.filter((lead: Lead) => {
      // Name filter
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!lead.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      // Status filter
      if (filterValues.status && filterValues.status !== '') {
        if (lead.status !== filterValues.status) return false
      }
      // Source filter
      if (filterValues.source && filterValues.source !== '') {
        if (lead.source !== filterValues.source) return false
      }
      // Assignee filter
      if (filterValues.assignee && filterValues.assignee !== '') {
        if (lead.assignee !== filterValues.assignee) return false
      }
      // CreatedAt date range filter
      if (filterValues.createdAt && Array.isArray(filterValues.createdAt)) {
        const [startDate, endDate] = filterValues.createdAt as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const leadDate = new Date(lead.createdAt)
          if (startDate && leadDate < startDate) return false
          if (endDate && leadDate > endDate) return false
        }
      }
      return true
    })
  }, [data?.data, filterValues, advancedFilterGroup])

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

  // Columns with actions
  const columnsWithActions = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: Lead } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/lead/${row.original.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedLead(row.original)
                setEditModalOpen(true)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`mailto:${row.original.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                发送邮件
              </DropdownMenuItem>
              {row.original.status !== "已转化" && (
                <DropdownMenuItem onClick={() => {
                  setConvertingId(row.original.id)
                  setConvertConfirmOpen(true)
                }}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  转化为客户
                </DropdownMenuItem>
              )}
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

  // Handlers
  const handleCreate = async (values: LeadFormValues) => {
    try {
      await createMutation.mutateAsync(values as Omit<Lead, "id" | "createdAt">)
      setCreateModalOpen(false)
      toast({
        title: "线索创建成功",
        duration: 2000,
      })
    } catch (error) {
      console.error("创建失败:", error)
      toast({
        title: "创建失败",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (values: LeadFormValues) => {
    if (!selectedLead) return
    try {
      await updateMutation.mutateAsync({
        id: selectedLead.id,
        ...values,
      })
      setEditModalOpen(false)
      setSelectedLead(null)
      toast({
        title: "线索更新成功",
        duration: 2000,
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: "更新失败",
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
        title: "线索已删除",
        duration: 2000,
      })
    } catch (error) {
      console.error("删除失败:", error)
      toast({
        title: "删除失败",
        variant: "destructive",
      })
    }
  }

  const handleConvert = async () => {
    if (!convertingId) return
    try {
      await convertMutation.mutateAsync(convertingId)
      setConvertConfirmOpen(false)
      setConvertingId(null)
      toast({
        title: "线索转化成功",
        description: `已创建客户记录`,
        duration: 3000,
      })
    } catch (error) {
      console.error("转化失败:", error)
      toast({
        title: "转化失败",
        variant: "destructive",
      })
    }
  }

  // Bulk handlers
  const handleBulkAssign = async (assignee: string) => {
    try {
      const ids = selectedRows.map(r => r.id)
      const result = await bulkAssignMutation.mutateAsync({ ids, assignee })
      setBulkAssignOpen(false)
      setRowSelection({})
      toast({
        title: "批量分配成功",
        description: `成功分配 ${result.success} 条线索给 ${assignee}`,
        duration: 3000,
      })
    } catch (error) {
      console.error("批量分配失败:", error)
      toast({
        title: "批量分配失败",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      const ids = selectedRows.map(r => r.id)
      const result = await bulkDeleteMutation.mutateAsync({ ids })
      setBulkDeleteOpen(false)
      setRowSelection({})
      toast({
        title: "批量删除成功",
        description: `成功删除 ${result.success} 条线索`,
        duration: 3000,
      })
    } catch (error) {
      console.error("批量删除失败:", error)
      toast({
        title: "批量删除失败",
        variant: "destructive",
      })
    }
  }

  // Export handlers - 同步 CustomerList 风格
  const handleExport = (rows: Lead[]) => {
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
      
      await bulkExportMutation.mutateAsync({ 
        ids, 
        format: exportFormat
      })
      
      setExportModalOpen(false)
      toast({
        title: "导出成功",
        description: `已导出 ${selectedRowsForExport.length || filteredData.length} 个线索`,
        duration: 2000,
      })
    } catch (error) {
      console.error("导出失败:", error)
      toast({
        title: "导出失败",
        variant: "destructive",
      })
    }
  }

  const handleBulkExport = async () => {
    try {
      const ids = selectedRows.map(r => r.id)
      await bulkExportMutation.mutateAsync({ ids, format: 'xlsx' })
      // Note: In real app, this would download a file
      toast({
        title: "导出成功",
        description: `已导出 ${ids.length} 条线索`,
        duration: 2000,
      })
    } catch (error) {
      console.error("导出失败:", error)
      toast({
        title: "导出失败",
        variant: "destructive",
      })
    }
  }

  // Batch actions - 同步 CustomerList 风格
  const batchActions: BatchActionItem[] = [
    {
      label: "发送邮件",
      icon: <Mail className="h-3 w-3" />,
      onClick: () => {
        const emails = selectedRows.map((r) => r.email).filter(Boolean)
        if (emails.length > 0) {
          window.open(`mailto:${emails.join(',')}`)
        }
        toast({
          title: `准备发送邮件给 ${emails.length} 个线索`,
        })
      },
    },
    {
      label: "分配负责人",
      icon: <UserPlus className="h-3 w-3" />,
      onClick: () => setBulkAssignOpen(true),
    },
    {
      label: "导出",
      icon: <Download className="h-3 w-3" />,
      onClick: () => handleExport(selectedRows),
    },
    {
      label: "删除",
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: () => setBulkDeleteOpen(true),
    },
  ]

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between animate-slide-in-down">
          <div className="max-w-3xl space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              Lead workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight">线索管理</h1>
            <p className="text-sm text-muted-foreground">
              管理所有潜在客户线索，支持转化为客户，同时保留完整筛选、批量操作和转化路径。
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="mr-2 h-4 w-4" />
              导出全部
            </Button>
            <Button onClick={() => setCreateModalOpen(true)} className="animate-scale-in shadow-sm hover:shadow-md transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              新增线索
            </Button>
          </div>
        </div>

        {/* Stats Bar - 同步 CustomerList 风格 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>共 <strong className="text-foreground">{filteredData.length}</strong> 条记录</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              已选择 {selectedCount} 项
            </Badge>
          )}
        </div>

        {/* FilterBar - HubSpot 风格筛选栏 */}
        <FilterBar
          filters={leadFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_lead_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={leadAdvancedFilterFields}
          className="animate-slide-in-up"
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
          emptyText="暂无线索数据"
          loading={isLoading || isFilterLoading}
          className="rounded-[1.25rem] border-none animate-slide-in-up"
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title="新增线索"
          width={600}
        >
          <LeadForm
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
            if (!open) setSelectedLead(null)
          }}
          title="编辑线索"
          width={600}
        >
          {selectedLead && (
            <LeadForm
              mode="edit"
              initialValues={selectedLead as Partial<LeadFormValues>}
              onSubmit={handleEdit}
              onCancel={() => {
                setEditModalOpen(false)
                setSelectedLead(null)
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
          title="确认删除"
          content="删除后数据将无法恢复，确定要删除该线索吗？"
          okType="danger"
          okText="删除"
          onOk={handleDelete}
          confirmLoading={deleteMutation.isPending}
        />

        {/* Convert Confirm */}
        <ConfirmDialog
          open={convertConfirmOpen}
          onOpenChange={(open) => {
            setConvertConfirmOpen(open)
            if (!open) setConvertingId(null)
          }}
          title="转化为客户"
          content="确定要将此线索转化为客户吗？转化后线索状态将变更为「已转化」。"
          okText="转化"
          onOk={handleConvert}
          confirmLoading={convertMutation.isPending}
        />

        {/* Bulk Assign Dialog */}
        <BulkAssignDialog
          open={bulkAssignOpen}
          onOpenChange={setBulkAssignOpen}
          selectedCount={selectedCount}
          onConfirm={handleBulkAssign}
          loading={bulkAssignMutation.isPending}
        />

        {/* Bulk Delete Dialog */}
        <BulkDeleteDialog
          open={bulkDeleteOpen}
          onOpenChange={setBulkDeleteOpen}
          selectedCount={selectedCount}
          onConfirm={handleBulkDelete}
          loading={bulkDeleteMutation.isPending}
          itemName="线索"
        />

        {/* Export Modal - 同步 CustomerList 风格 */}
        <Modal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title="导出线索数据"
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedRowsForExport.length > 0 
                ? `将导出选中的 ${selectedRowsForExport.length} 个线索数据`
                : `将导出全部 ${filteredData.length} 个线索数据`}
            </p>
            
            <div className="space-y-2">
              <Label>导出格式</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={(val) => setExportFormat(val as "xlsx" | "csv")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xlsx" id="format-xlsx" />
                  <Label htmlFor="format-xlsx" className="cursor-pointer">Excel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label htmlFor="format-csv" className="cursor-pointer">CSV</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportModalOpen(false)}>
                取消
              </Button>
              <Button onClick={handleExportConfirm} disabled={bulkExportMutation.isPending}>
                {bulkExportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    导出中...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    确认导出
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

export default LeadList
