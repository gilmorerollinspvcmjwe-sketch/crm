"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Download, Trash2, TrendingUp, LayoutGrid, List, Funnel, ChevronRight, CheckCircle, CheckCircle2, XCircle, ArrowRight, Eye, Edit, MoreHorizontal, User, FileDown, Loader2 } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/modal/Dialog"
import { OpportunityForm } from "@/forms/OpportunityForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { applyFilterGroup, createEmptyFilterGroup } from "@/components/FilterBar/filterUtils"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  useOpportunities,
  useCreateOpportunity,
  useUpdateOpportunity,
  useDeleteOpportunity,
  useAdvanceOpportunityStage,
  useCloseOpportunityWon,
  useCloseOpportunityLost,
  useStageStats,
} from "@/hooks/api/useOpportunities"
import type { Opportunity, OpportunityStage, OpportunityPriority } from "@/types/api"
import type { OpportunityFormValues } from "@/schemas"
import { cn } from "@/lib/utils"

// ============ Stage Badge ============

const stageConfig: Record<OpportunityStage, { label: string; className: string; progress: number; color: string }> = {
  "初步接触": { label: "初步接触", className: "bg-blue-100 text-blue-800 border-blue-200", progress: 10, color: "#3B82F6" },
  "需求确认": { label: "需求确认", className: "bg-green-100 text-green-800 border-green-200", progress: 30, color: "#10B981" },
  "方案报价": { label: "方案报价", className: "bg-cyan-100 text-cyan-800 border-cyan-200", progress: 50, color: "#06B6D4" },
  "合同谈判": { label: "合同谈判", className: "bg-yellow-100 text-yellow-800 border-yellow-200", progress: 75, color: "#F59E0B" },
  "成交": { label: "成交", className: "bg-green-100 text-green-800 border-green-200", progress: 100, color: "#10B981" },
  "失败": { label: "失败", className: "bg-red-100 text-red-800 border-red-200", progress: 0, color: "#EF4444" },
}

function StageBadge({ stage }: { stage: OpportunityStage }) {
  const config = stageConfig[stage]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}

// ============ Priority Badge ============

const priorityConfig: Record<OpportunityPriority, { label: string; className: string }> = {
  "低": { label: "低", className: "bg-gray-100 text-gray-600" },
  "中": { label: "中", className: "bg-blue-100 text-blue-600" },
  "高": { label: "高", className: "bg-red-100 text-red-600" },
}

function PriorityBadge({ priority }: { priority: OpportunityPriority }) {
  const config = priorityConfig[priority]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
      config.className
    )}>
      {config.label}
    </span>
  )
}

// ============ Amount Display ============

function AmountDisplay({ amount }: { amount: number }) {
  const formatted = new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return (
    <span className="text-sm font-medium">{formatted}</span>
  )
}

// ============ Filter Configuration ============

const opportunityFilters: FilterItem[] = [
  {
    name: "name",
    label: "商机名称",
    type: "text",
    placeholder: "搜索商机名称",
  },
  {
    name: "stage",
    label: "阶段",
    type: "select",
    placeholder: "选择阶段",
    options: [
      { label: "初步接触", value: "初步接触" },
      { label: "需求确认", value: "需求确认" },
      { label: "方案报价", value: "方案报价" },
      { label: "合同谈判", value: "合同谈判" },
      { label: "成交", value: "成交" },
      { label: "失败", value: "失败" },
    ],
  },
  {
    name: "priority",
    label: "优先级",
    type: "select",
    placeholder: "选择优先级",
    options: [
      { label: "高", value: "高" },
      { label: "中", value: "中" },
      { label: "低", value: "低" },
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
    name: "expectedCloseDate",
    label: "预计成交时间",
    type: "dateRange",
    placeholder: "选择日期范围",
  },
  {
    name: "assignee",
    label: "负责人",
    type: "text",
    placeholder: "搜索负责人",
  },
]

// ============ Advanced Filter Fields Configuration ============

const opportunityAdvancedFilterFields: FilterField[] = [
  {
    name: "name",
    label: "商机名称",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入商机名称",
  },
  {
    name: "customerName",
    label: "客户名称",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入客户名称",
  },
  {
    name: "stage",
    label: "阶段",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "初步接触", value: "初步接触" },
      { label: "需求确认", value: "需求确认" },
      { label: "方案报价", value: "方案报价" },
      { label: "合同谈判", value: "合同谈判" },
      { label: "成交", value: "成交" },
      { label: "失败", value: "失败" },
    ],
  },
  {
    name: "priority",
    label: "优先级",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "高", value: "高" },
      { label: "中", value: "中" },
      { label: "低", value: "低" },
    ],
  },
  {
    name: "amount",
    label: "金额",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入金额",
  },
  {
    name: "probability",
    label: "成交概率",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    max: 100,
    placeholder: "输入概率百分比",
  },
  {
    name: "expectedCloseDate",
    label: "预计成交日期",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
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

const columns: ColumnDef<Opportunity, string>[] = [
  {
    accessorKey: "name",
    header: "商机名称",
    meta: {
      width: 180,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "customerName",
    header: "客户",
    meta: {
      width: 150,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "stage",
    header: "阶段",
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "初步接触", value: "初步接触" },
        { label: "需求确认", value: "需求确认" },
        { label: "方案报价", value: "方案报价" },
        { label: "合同谈判", value: "合同谈判" },
        { label: "成交", value: "成交" },
        { label: "失败", value: "失败" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <StageBadge stage={row.getValue("stage") as OpportunityStage} />
    ),
  },
  {
    accessorKey: "priority",
    header: "优先级",
    meta: {
      width: 80,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "低", value: "低" },
        { label: "中", value: "中" },
        { label: "高", value: "高" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <PriorityBadge priority={row.getValue("priority") as OpportunityPriority} />
    ),
  },
  {
    accessorKey: "amount",
    header: "金额",
    meta: {
      width: 120,
      sortable: true,
      filterable: true,
      filterType: "number",
    } as DataTableColumnMeta,
    cell: ({ row }) => <AmountDisplay amount={Number(row.getValue("amount"))} />,
  },
  {
    accessorKey: "probability",
    header: "概率",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const probability = Number(row.getValue("probability"))
      return (
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "h-2 w-16 rounded-full bg-gray-200 overflow-hidden"
            )}
          >
            <div
              className={cn(
                "h-full rounded-full",
                probability >= 81 ? "bg-green-500" :
                probability >= 61 ? "bg-blue-500" :
                probability >= 31 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${probability}%` }}
            />
          </div>
          <span className="text-xs">{probability}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "expectedCloseDate",
    header: "预计成交",
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
  {
    accessorKey: "createdAt",
    header: "创建时间",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
  },
]

// ============ Funnel View Component ============

interface FunnelViewProps {
  opportunities: Opportunity[]
  onOpportunityClick: (id: string) => void
  onAdvanceStage: (id: string) => void
  onCloseWon: (id: string) => void
  onCloseLost: (id: string) => void
}

function FunnelView({ opportunities, onOpportunityClick, onAdvanceStage, onCloseWon, onCloseLost }: FunnelViewProps) {
  const stages: OpportunityStage[] = ["初步接触", "需求确认", "方案报价", "合同谈判", "成交"]
  const stageStats = opportunities.reduce((acc, opp) => {
    if (opp.stage !== "失败") {
      acc[opp.stage] = (acc[opp.stage] || { count: 0, amount: 0 })
      acc[opp.stage].count++
      acc[opp.stage].amount += opp.amount
    }
    return acc
  }, {} as Record<OpportunityStage, { count: number; amount: number }>)

  const maxAmount = Math.max(...Object.values(stageStats).map(s => s.amount), 1)
  const totalOpps = opportunities.filter(o => o.stage !== "失败").length

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">销售漏斗</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">总商机: <strong>{totalOpps}</strong></span>
          <span className="text-muted-foreground">
            总金额: <strong>
              {new Intl.NumberFormat("zh-CN", {
                style: "currency",
                currency: "CNY",
                minimumFractionDigits: 0,
              }).format(Object.values(stageStats).reduce((sum, s) => sum + s.amount, 0))}
            </strong>
          </span>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const stats = stageStats[stage] || { count: 0, amount: 0 }
          const widthPercent = (stats.amount / maxAmount) * 100
          const config = stageConfig[stage]
          const stageOpps = opportunities.filter(o => o.stage === stage)

          return (
            <div key={stage} className="relative">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full")} style={{ backgroundColor: config.color }} />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{stats.count} 个</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("zh-CN", {
                      style: "currency",
                      currency: "CNY",
                      minimumFractionDigits: 0,
                    }).format(stats.amount)}
                  </span>
                </div>
              </div>

              {/* Funnel Bar */}
              <div
                className="relative h-10 rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  width: `${Math.max(widthPercent, 10)}%`,
                  backgroundColor: config.color,
                  marginLeft: `${(100 - Math.max(widthPercent, 10)) / 2}%`,
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />

                {/* Progress indicators */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {stats.count > 0 ? `${stats.count}` : ""}
                  </span>
                </div>
              </div>

              {/* Opportunities in this stage */}
              {stageOpps.length > 0 && (
                <div className="mt-2 pl-4 space-y-1">
                  {stageOpps.slice(0, 3).map((opp) => (
                    <div
                      key={opp.id}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded hover:bg-muted/50 cursor-pointer transition-colors group"
                      onClick={() => onOpportunityClick(opp.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{opp.name}</span>
                        <Badge variant="outline" className="text-xs">{opp.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat("zh-CN", {
                            style: "currency",
                            currency: "CNY",
                            minimumFractionDigits: 0,
                          }).format(opp.amount)}
                        </span>
                        {/* Action buttons */}
                        {index < stages.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              onAdvanceStage(opp.id)
                            }}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageOpps.length > 3 && (
                    <p className="text-xs text-muted-foreground pl-2">
                      还有 {stageOpps.length - 3} 个商机...
                    </p>
                  )}
                </div>
              )}

              {/* Arrow connector */}
              {index < stages.length - 1 && (
                <div className="flex justify-center mt-1">
                  <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Failed Opportunities */}
      {opportunities.filter(o => o.stage === "失败").length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">失败商机</span>
            <span className="text-sm text-muted-foreground">
              {opportunities.filter(o => o.stage === "失败").length} 个
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ Assignees List (for bulk assign) ============

const assignees = [
  { id: "李明", name: "李明" },
  { id: "王芳", name: "王芳" },
  { id: "陈静", name: "陈静" },
]

// ============ OpportunityList Page ============

export function OpportunityList() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<Opportunity | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<"list" | "funnel" | "kanban">("list")
  const [stageActionModal, setStageActionModal] = React.useState<{
    open: boolean
    type: "advance" | "won" | "lost" | null
    opportunity: Opportunity | null
  }>({ open: false, type: null, opportunity: null })
  
  // Advanced Filter State
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  
  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<"excel" | "csv" | "json">("excel")
  const [selectedRowsForExport, setSelectedRowsForExport] = React.useState<Opportunity[]>([])
  
  // Bulk Assign Modal State
  const [assignModalOpen, setAssignModalOpen] = React.useState(false)
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("")
  const [selectedRowsForAssign, setSelectedRowsForAssign] = React.useState<Opportunity[]>([])

  // API Hooks
  const { data, isLoading } = useOpportunities()
  const createMutation = useCreateOpportunity()
  const updateMutation = useUpdateOpportunity()
  const deleteMutation = useDeleteOpportunity()
  const advanceMutation = useAdvanceOpportunityStage()
  const closeWonMutation = useCloseOpportunityWon()
  const closeLostMutation = useCloseOpportunityLost()
  const stageStats = useStageStats(data?.data)

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    const opportunities = data?.data || []
    
    // Use advanced filter if there are valid conditions
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(opportunities, advancedFilterGroup)
    }
    
    // Use simple filter
    if (Object.keys(filterValues).length === 0) return opportunities

    return opportunities.filter((opportunity: Opportunity) => {
      // Name filter
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!opportunity.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      // Stage filter
      if (filterValues.stage && filterValues.stage !== '') {
        if (opportunity.stage !== filterValues.stage) return false
      }
      // Priority filter
      if (filterValues.priority && filterValues.priority !== '') {
        if (opportunity.priority !== filterValues.priority) return false
      }
      // Amount min filter
      if (filterValues.amountMin && typeof filterValues.amountMin === 'number') {
        if (opportunity.amount < filterValues.amountMin) return false
      }
      // Amount max filter
      if (filterValues.amountMax && typeof filterValues.amountMax === 'number') {
        if (opportunity.amount > filterValues.amountMax) return false
      }
      // Assignee filter
      if (filterValues.assignee && typeof filterValues.assignee === 'string') {
        if (!opportunity.assignee.toLowerCase().includes(filterValues.assignee.toLowerCase())) return false
      }
      // ExpectedCloseDate date range filter
      if (filterValues.expectedCloseDate && Array.isArray(filterValues.expectedCloseDate)) {
        const [startDate, endDate] = filterValues.expectedCloseDate as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const opportunityDate = new Date(opportunity.expectedCloseDate)
          if (startDate && opportunityDate < startDate) return false
          if (endDate && opportunityDate > endDate) return false
        }
      }
      return true
    })
  }, [data?.data, filterValues, advancedFilterGroup])

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

  // Handlers (defined before columnsWithActions to avoid "used before declaration" error)
  const handleAdvanceStage = React.useCallback(async (id: string) => {
    try {
      await advanceMutation.mutateAsync(id)
    } catch (error) {
      console.error("推进阶段失败:", error)
    }
  }, [advanceMutation])

  // Columns with actions
  const columnsWithActions = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: Opportunity } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/opportunity/${row.original.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedOpportunity(row.original)
                setEditModalOpen(true)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              {row.original.stage !== "成交" && row.original.stage !== "失败" && (
                <>
                  <DropdownMenuItem onClick={() => handleAdvanceStage(row.original.id)}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    推进阶段
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStageActionModal({ open: true, type: "won", opportunity: row.original })}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    确认成交
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStageActionModal({ open: true, type: "lost", opportunity: row.original })}>
                    <XCircle className="h-4 w-4 mr-2" />
                    确认失败
                  </DropdownMenuItem>
                </>
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
  }, [navigate, handleAdvanceStage])

  const handleCreate = async (values: OpportunityFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        customerId: values.customerId || "temp-customer",
        customerName: "待关联客户",
      } as Omit<Opportunity, "id" | "createdAt" | "updatedAt">)
      setCreateModalOpen(false)
    } catch (error) {
      console.error("创建失败:", error)
    }
  }

  const handleEdit = async (values: OpportunityFormValues) => {
    if (!selectedOpportunity) return
    try {
      await updateMutation.mutateAsync({
        id: selectedOpportunity.id,
        ...values,
      })
      setEditModalOpen(false)
      setSelectedOpportunity(null)
    } catch (error) {
      console.error("更新失败:", error)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteMutation.mutateAsync(deletingId)
      setDeleteConfirmOpen(false)
      setDeletingId(null)
    } catch (error) {
      console.error("删除失败:", error)
    }
  }

  const handleCloseWon = async (id: string) => {
    try {
      await closeWonMutation.mutateAsync({ id })
      setStageActionModal({ open: false, type: null, opportunity: null })
    } catch (error) {
      console.error("成交失败:", error)
    }
  }

  const handleCloseLost = async (id: string, reason?: string) => {
    try {
      await closeLostMutation.mutateAsync({ id, reason })
      setStageActionModal({ open: false, type: null, opportunity: null })
    } catch (error) {
      console.error("失败处理失败:", error)
    }
  }

  const handleRowClick = (row: Opportunity) => {
    navigate(`/opportunity/${row.id}`)
  }

  // Export handlers
  const handleExport = (rows: Opportunity[]) => {
    setSelectedRowsForExport(rows)
    setExportModalOpen(true)
  }

  const handleExportAll = () => {
    setSelectedRowsForExport([])
    setExportModalOpen(true)
  }

  const handleExportConfirm = async () => {
    // TODO: Implement actual export logic
    setExportModalOpen(false)
    toast({
      title: "导出成功",
      description: `已导出 ${selectedRowsForExport.length || filteredData.length} 个商机数据`,
    })
  }

  // Bulk assign handlers
  const handleBulkAssign = (rows: Opportunity[]) => {
    setSelectedRowsForAssign(rows)
    setSelectedAssignee("")
    setAssignModalOpen(true)
  }

  const handleBulkAssignConfirm = async () => {
    if (!selectedAssignee || selectedRowsForAssign.length === 0) return
    // TODO: Implement actual bulk assign logic
    setAssignModalOpen(false)
    setRowSelection({})
    toast({
      title: "分配成功",
      description: `已将 ${selectedRowsForAssign.length} 个商机分配给 ${selectedAssignee}`,
    })
  }

  // Batch actions
  const batchActions = [
    {
      label: "分配负责人",
      icon: <User className="h-3 w-3" />,
      onClick: handleBulkAssign,
    },
    {
      label: "导出",
      icon: <Download className="h-3 w-3" />,
      onClick: handleExport,
    },
    {
      label: "批量推进阶段",
      icon: <TrendingUp className="h-3 w-3" />,
      onClick: (rows: Opportunity[]) => {
        rows.forEach((row) => {
          if (row.stage !== "成交" && row.stage !== "失败") {
            advanceMutation.mutate(row.id)
          }
        })
        setRowSelection({})
      },
    },
    {
      label: "删除",
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: (rows: Opportunity[]) => {
        const ids = rows.map((r) => r.id)
        ids.forEach((id) => deleteMutation.mutate(id))
        setRowSelection({})
      },
    },
  ]

  // Calculate total amount
  const totalAmount = data?.data?.reduce((sum, o) => sum + (o.stage !== "失败" ? o.amount : 0), 0) || 0
  const weightedAmount = data?.data?.reduce((sum, o) => sum + (o.stage !== "失败" ? o.amount * o.probability / 100 : 0), 0) || 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">商机管理</h1>
            <p className="text-muted-foreground text-sm">
              管理所有商机，跟踪销售进度
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="mr-2 h-4 w-4" />
              导出全部
            </Button>
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "funnel" ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setViewMode("funnel")}
              >
                <Funnel className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => navigate(`/opportunity/kanban`)}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增商机
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stageStats.filter(s => s.stage !== "失败").map((stat) => (
            <Card key={stat.stage} className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                  <p className="text-sm text-muted-foreground">{stageConfig[stat.stage].label}</p>
                </div>
                <p className="text-xl font-bold">{stat.count}</p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat("zh-CN", {
                    style: "currency",
                    currency: "CNY",
                    minimumFractionDigits: 0,
                  }).format(stat.amount)}
                </p>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-sm text-muted-foreground">成交</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                {data?.data?.filter(o => o.stage === "成交").length || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                成交率: {data?.data?.length 
                  ? Math.round((data?.data?.filter(o => o.stage === "成交").length / data.data.length) * 100) 
                  : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Total Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">活跃商机总额</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat("zh-CN", {
                  style: "currency",
                  currency: "CNY",
                  minimumFractionDigits: 0,
                }).format(totalAmount)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">加权金额</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat("zh-CN", {
                  style: "currency",
                  currency: "CNY",
                  minimumFractionDigits: 0,
                }).format(weightedAmount)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">商机总数</p>
              <p className="text-2xl font-bold">{data?.data?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={opportunityFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_opportunity_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={opportunityAdvancedFilterFields}
        />

        {/* View Content */}
        {viewMode === "list" && (
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
            emptyText="暂无商机数据"
            loading={isLoading || isFilterLoading}
            className="border rounded-lg"
            onRowClick={handleRowClick}
          />
        )}

        {viewMode === "funnel" && (
          <FunnelView
            opportunities={filteredData}
            onOpportunityClick={(id) => navigate(`/opportunity/${id}`)}
            onAdvanceStage={handleAdvanceStage}
            onCloseWon={handleCloseWon}
            onCloseLost={handleCloseLost}
          />
        )}

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title="新增商机"
          width={600}
        >
          <OpportunityForm
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
            if (!open) setSelectedOpportunity(null)
          }}
          title="编辑商机"
          width={600}
        >
          {selectedOpportunity && (
            <OpportunityForm
              mode="edit"
              initialValues={selectedOpportunity as Partial<OpportunityFormValues>}
              onSubmit={handleEdit}
              onCancel={() => {
                setEditModalOpen(false)
                setSelectedOpportunity(null)
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
          content="删除后数据将无法恢复，确定要删除该商机吗？"
          okType="danger"
          okText="删除"
          onOk={handleDelete}
          confirmLoading={deleteMutation.isPending}
        />

        {/* Stage Action Modal */}
        <Modal
          open={stageActionModal.open}
          onOpenChange={(open) => setStageActionModal({ ...stageActionModal, open })}
          title={stageActionModal.type === "won" ? "确认成交" : stageActionModal.type === "lost" ? "确认失败" : "推进阶段"}
          width={400}
        >
          {stageActionModal.opportunity && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                商机: <strong>{stageActionModal.opportunity.name}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                金额: <strong>
                  {new Intl.NumberFormat("zh-CN", {
                    style: "currency",
                    currency: "CNY",
                    minimumFractionDigits: 0,
                  }).format(stageActionModal.opportunity.amount)}
                </strong>
              </p>
              
              {stageActionModal.type === "won" && (
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setStageActionModal({ open: false, type: null, opportunity: null })}>
                    取消
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleCloseWon(stageActionModal.opportunity!.id)}>
                    <CheckCircle className="mr-2 w-4 h-4" />
                    确认成交
                  </Button>
                </div>
              )}

              {stageActionModal.type === "lost" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">失败原因</p>
                    <Select defaultValue="其他">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="价格因素">价格因素</SelectItem>
                        <SelectItem value="竞争对手">竞争对手</SelectItem>
                        <SelectItem value="客户需求变更">客户需求变更</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setStageActionModal({ open: false, type: null, opportunity: null })}>
                      取消
                    </Button>
                    <Button variant="destructive" onClick={() => handleCloseLost(stageActionModal.opportunity!.id)}>
                      <XCircle className="mr-2 w-4 h-4" />
                      确认失败
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title="导出商机数据"
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedRowsForExport.length > 0 
                ? `将导出选中的 ${selectedRowsForExport.length} 个商机数据`
                : `将导出全部 ${filteredData.length} 个商机数据`}
            </p>
            
            <div className="space-y-2">
              <Label>导出格式</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={(val) => setExportFormat(val as "excel" | "csv" | "json")}
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
                取消
              </Button>
              <Button onClick={handleExportConfirm} disabled={false}>
                <FileDown className="mr-2 h-4 w-4" />
                确认导出
              </Button>
            </div>
          </div>
        </Modal>

        {/* Bulk Assign Modal */}
        <Modal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          title="批量分配负责人"
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              将 {selectedRowsForAssign.length} 个商机分配给新负责人
            </p>
            
            <div className="space-y-2">
              <Label>选择负责人</Label>
              <Select
                value={selectedAssignee}
                onValueChange={setSelectedAssignee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择负责人" />
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
                取消
              </Button>
              <Button 
                onClick={handleBulkAssignConfirm} 
                disabled={!selectedAssignee}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                确认分配
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default OpportunityList