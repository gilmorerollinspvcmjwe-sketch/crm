"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Mail, Trash2, Eye, Edit, MoreHorizontal, FileDown, Phone, UserPlus, Download, Loader2, CheckCircle2, Star, Users, User } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ContactPersonForm } from "@/forms/ContactPersonForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { BulkAssignDialog, BulkDeleteDialog } from "@/components/bulk"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"
import {
  useContactPersons,
  useCreateContactPerson,
  useUpdateContactPerson,
  useDeleteContactPerson,
  useBulkAssignContactPersons,
  useBulkDeleteContactPersons,
} from "@/hooks/api/useContactPersons"
import type { ContactPerson, ContactPersonDecisionRole, ContactPersonJobLevel } from "@/types/contactPerson"
import type { ContactPersonFormValues } from "@/schemas/contactPerson"
import { cn } from "@/lib/utils"

// Export format type
type ExportFormat = "excel" | "csv" | "json"

// ============================================================
// Decision Role Badge
// ============================================================

const decisionRoleConfig: Record<ContactPersonDecisionRole, { className: string; dotColor: string }> = {
  "决策者": { className: "bg-red-100 text-red-800 border-red-200", dotColor: "bg-red-500" },
  "影响者": { className: "bg-orange-100 text-orange-800 border-orange-200", dotColor: "bg-orange-500" },
  "使用者": { className: "bg-green-100 text-green-800 border-green-200", dotColor: "bg-green-500" },
  "把关者": { className: "bg-blue-100 text-blue-800 border-blue-200", dotColor: "bg-blue-500" },
  "其他": { className: "bg-gray-100 text-gray-800 border-gray-200", dotColor: "bg-gray-400" },
}

function DecisionRoleBadge({ role }: { role: ContactPersonDecisionRole }) {
  const config = decisionRoleConfig[role]
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
      config.className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {role}
    </span>
  )
}

// ============================================================
// Job Level Badge
// ============================================================

const jobLevelConfig: Record<ContactPersonJobLevel, { className: string }> = {
  "高管": { className: "bg-purple-100 text-purple-800 border-purple-200" },
  "中层": { className: "bg-blue-100 text-blue-800 border-blue-200" },
  "基层": { className: "bg-gray-100 text-gray-800 border-gray-200" },
  "其他": { className: "bg-gray-50 text-gray-600 border-gray-100" },
}

function JobLevelBadge({ level }: { level: ContactPersonJobLevel }) {
  const config = jobLevelConfig[level]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {level}
    </span>
  )
}

// ============================================================
// Primary Badge
// ============================================================

function PrimaryBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-yellow-500">
      <Star className="h-3 w-3 fill-yellow-500" />
      <span className="text-xs text-yellow-600">主要</span>
    </span>
  )
}

// ============================================================
// Filter Configuration
// ============================================================

const contactPersonFilters: FilterItem[] = [
  {
    name: "name",
    label: "姓名",
    type: "text",
    placeholder: "搜索联系人姓名",
  },
  {
    name: "customerName",
    label: "客户",
    type: "text",
    placeholder: "搜索客户名称",
  },
  {
    name: "position",
    label: "职位",
    type: "text",
    placeholder: "搜索职位",
  },
  {
    name: "decisionRole",
    label: "决策角色",
    type: "select",
    placeholder: "选择决策角色",
    options: [
      { label: "决策者", value: "决策者" },
      { label: "影响者", value: "影响者" },
      { label: "使用者", value: "使用者" },
      { label: "把关者", value: "把关者" },
      { label: "其他", value: "其他" },
    ],
  },
  {
    name: "mobile",
    label: "手机号",
    type: "text",
    placeholder: "搜索手机号",
  },
  {
    name: "email",
    label: "邮箱",
    type: "text",
    placeholder: "搜索邮箱",
  },
]

// ============================================================
// Advanced Filter Fields Configuration
// ============================================================

const contactPersonAdvancedFilterFields: FilterField[] = [
  {
    name: "name",
    label: "姓名",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入姓名",
  },
  {
    name: "customerName",
    label: "客户名称",
    type: "text",
    operators: ["eq", "neq", "contains"],
    placeholder: "输入客户名称",
  },
  {
    name: "position",
    label: "职位",
    type: "text",
    operators: ["eq", "neq", "contains"],
    placeholder: "输入职位",
  },
  {
    name: "jobLevel",
    label: "职级",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "高管", value: "高管" },
      { label: "中层", value: "中层" },
      { label: "基层", value: "基层" },
      { label: "其他", value: "其他" },
    ],
  },
  {
    name: "decisionRole",
    label: "决策角色",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "决策者", value: "决策者" },
      { label: "影响者", value: "影响者" },
      { label: "使用者", value: "使用者" },
      { label: "把关者", value: "把关者" },
      { label: "其他", value: "其他" },
    ],
  },
  {
    name: "mobile",
    label: "手机号",
    type: "text",
    operators: ["eq", "neq", "contains"],
    placeholder: "输入手机号",
  },
  {
    name: "email",
    label: "邮箱",
    type: "text",
    operators: ["eq", "neq", "contains"],
    placeholder: "输入邮箱",
  },
  {
    name: "wechat",
    label: "微信",
    type: "text",
    operators: ["eq", "neq", "contains"],
    placeholder: "输入微信号",
  },
]

// ============================================================
// Column Definitions
// ============================================================

const createColumns = (navigate: (path: string) => void): ColumnDef<ContactPerson, string>[] => [
  {
    accessorKey: "name",
    header: "姓名",
    meta: {
      width: 120,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium hover:text-primary transition-colors cursor-pointer"
              onClick={() => navigate(`/contacts/${row.original.id}`)}>
          {row.getValue("name") as string}
        </span>
        {row.original.isPrimary && <PrimaryBadge />}
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "职位",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("position") as string || "-"}
      </span>
    ),
  },
  {
    accessorKey: "jobLevel",
    header: "职级",
    meta: { width: 80 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const level = row.getValue("jobLevel") as ContactPersonJobLevel
      return level ? <JobLevelBadge level={level} /> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "decisionRole",
    header: "决策角色",
    meta: {
      width: 100,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "决策者", value: "决策者" },
        { label: "影响者", value: "影响者" },
        { label: "使用者", value: "使用者" },
        { label: "把关者", value: "把关者" },
        { label: "其他", value: "其他" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => {
      const role = row.getValue("decisionRole") as ContactPersonDecisionRole
      return role ? <DecisionRoleBadge role={role} /> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "customerName",
    header: "客户",
    meta: {
      width: 180,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm hover:text-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/customers/${row.original.customerId}`)}>
        {row.getValue("customerName") as string || "-"}
      </span>
    ),
  },
  {
    accessorKey: "mobile",
    header: "手机",
    meta: { width: 130 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("mobile") as string || "-"}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "邮箱",
    meta: { width: 180 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate block max-w-[160px]">
        {row.getValue("email") as string || "-"}
      </span>
    ),
  },
  {
    accessorKey: "ownerName",
    header: "负责人",
    meta: { width: 100 } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium items-center justify-center">
          {(row.getValue("ownerName") as string)?.charAt(0) || "-"}
        </span>
        <span className="text-sm">{row.getValue("ownerName") as string || "-"}</span>
      </span>
    ),
  },
]

// ============================================================
// ContactPersonList Page
// ============================================================

export function ContactPersonList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedContact, setSelectedContact] = React.useState<ContactPerson | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  
  // Bulk operation dialogs
  const [bulkAssignOpen, setBulkAssignOpen] = React.useState(false)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)
  
  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = React.useState(false)
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("excel")
  const [selectedRowsForExport, setSelectedRowsForExport] = React.useState<ContactPerson[]>([])

  // API Hooks
  const { data, isLoading } = useContactPersons()
  const createMutation = useCreateContactPerson()
  const updateMutation = useUpdateContactPerson()
  const deleteMutation = useDeleteContactPerson()
  const bulkAssignMutation = useBulkAssignContactPersons()
  const bulkDeleteMutation = useBulkDeleteContactPersons()

  // Get selected rows
  const selectedRows = React.useMemo(() => {
    const contacts = data?.data || []
    const selection = rowSelection as Record<string, boolean>
    return contacts.filter((contact: ContactPerson) => selection[contact.id])
  }, [data?.data, rowSelection])

  const selectedCount = selectedRows.length

  // Filtered data
  const filteredData = React.useMemo(() => {
    const contacts = data?.data || []
    
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(contacts, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return contacts

    return contacts.filter((contact: ContactPerson) => {
      if (filterValues.name && typeof filterValues.name === 'string') {
        if (!contact.name.toLowerCase().includes(filterValues.name.toLowerCase())) return false
      }
      if (filterValues.customerName && typeof filterValues.customerName === 'string') {
        if (!contact.customerName?.toLowerCase().includes(filterValues.customerName.toLowerCase())) return false
      }
      if (filterValues.position && typeof filterValues.position === 'string') {
        if (!contact.position?.toLowerCase().includes(filterValues.position.toLowerCase())) return false
      }
      if (filterValues.decisionRole && filterValues.decisionRole !== '') {
        if (contact.decisionRole !== filterValues.decisionRole) return false
      }
      if (filterValues.mobile && typeof filterValues.mobile === 'string') {
        if (!contact.mobile?.includes(filterValues.mobile as string)) return false
      }
      if (filterValues.email && typeof filterValues.email === 'string') {
        if (!contact.email?.toLowerCase().includes(filterValues.email.toLowerCase())) return false
      }
      return true
    })
  }, [data?.data, filterValues, advancedFilterGroup])

  // Filter handlers
  const handleFilterChange = React.useCallback(async (values: Record<string, unknown>) => {
    setIsFilterLoading(true)
    setFilterValues(values)
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }, [])

  const handleAdvancedFilterChange = React.useCallback(async (group: FilterGroupLegacy) => {
    setIsFilterLoading(true)
    setAdvancedFilterGroup(group)
    setFilterValues({})
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsFilterLoading(false)
  }, [])

  const handleFilterReset = () => {
    setFilterValues({})
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'))
  }

  // Columns with actions
  const columnsWithActions = React.useMemo(() => {
    const columns = createColumns(navigate)
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: ContactPerson } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/contacts/${row.original.id}`)} className="gap-2">
                  <Eye className="h-4 w-4" />
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSelectedContact(row.original)
                  setEditModalOpen(true)
                }} className="gap-2">
                  <Edit className="h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/customers/${row.original.customerId}`)} className="gap-2">
                  <Eye className="h-4 w-4" />
                  查看客户
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`tel:${row.original.mobile}`)} className="gap-2">
                  <Phone className="h-4 w-4" />
                  拨打电话
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`mailto:${row.original.email}`)} className="gap-2">
                  <Mail className="h-4 w-4" />
                  发送邮件
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setDeletingId(row.original.id)
                    setDeleteConfirmOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        ),
      },
    ]
  }, [navigate])

  // Handlers
  const handleCreate = async (values: ContactPersonFormValues) => {
    try {
      await createMutation.mutateAsync(values as unknown as Omit<ContactPerson, "id" | "createdAt" | "createdBy">)
      setCreateModalOpen(false)
      toast({
        title: "联系人创建成功",
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

  const handleEdit = async (values: ContactPersonFormValues) => {
    if (!selectedContact) return
    try {
      await updateMutation.mutateAsync({
        id: selectedContact.id,
        data: values as Partial<ContactPerson>,
      })
      setEditModalOpen(false)
      setSelectedContact(null)
      toast({
        title: "联系人更新成功",
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
        title: "联系人已删除",
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

  // Bulk handlers
  const handleBulkAssign = async (assignee: string) => {
    try {
      const ids = selectedRows.map(r => r.id)
      const result = await bulkAssignMutation.mutateAsync({ ids, assignee })
      setBulkAssignOpen(false)
      setRowSelection({})
      toast({
        title: "批量分配成功",
        description: `成功分配 ${result.success} 条记录给 ${assignee}`,
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
      const result = await bulkDeleteMutation.mutateAsync(ids)
      setBulkDeleteOpen(false)
      setRowSelection({})
      toast({
        title: "批量删除成功",
        description: `成功删除 ${result.success} 条记录`,
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

  // Export handlers
  const handleExport = (rows: ContactPerson[]) => {
    setSelectedRowsForExport(rows)
    setExportModalOpen(true)
  }

  const handleExportAll = () => {
    setSelectedRowsForExport([])
    setExportModalOpen(true)
  }

  // Batch actions
  const batchActions = [
    {
      label: t("contactPerson.batch.assign", "批量分配"),
      icon: <UserPlus className="h-3 w-3" />,
      onClick: () => setBulkAssignOpen(true),
    },
    {
      label: t("contactPerson.batch.export", "导出"),
      icon: <Download className="h-3 w-3" />,
      onClick: handleExport,
    },
    {
      label: t("contactPerson.batch.delete", "批量删除"),
      icon: <Trash2 className="h-3 w-3" />,
      variant: "destructive" as const,
      onClick: () => setBulkDeleteOpen(true),
    },
  ]

  const handleExportConfirm = async () => {
    try {
      const ids = selectedRowsForExport.length > 0
        ? selectedRowsForExport.map(r => r.id)
        : undefined
      
      // Mock export - in real app this would call the API
      toast({
        title: t("contactPerson.exportSuccess", "导出成功"),
        description: t("contactPerson.exportSuccessDesc", `已导出 ${selectedRowsForExport.length || filteredData.length} 个联系人数据`),
      })
      setExportModalOpen(false)
    } catch (error) {
      console.error("导出失败:", error)
      toast({
        title: t("contactPerson.exportFailed", "导出失败"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{t("contactPerson.title", "联系人管理")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("contactPerson.description", "管理所有联系人信息，支持筛选、排序、批量操作")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="mr-2 h-4 w-4" />
              {t("contactPerson.exportAll", "导出全部")}
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("contactPerson.create", "新增联系人")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>{t("contactPerson.total", "共")} <strong className="text-foreground">{filteredData.length}</strong> {t("contactPerson.records", "条记录")}</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="animate-in fade-in">
              {t("contactPerson.selected", "已选择")} {selectedCount} {t("contactPerson.items", "项")}
            </Badge>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">总联系人数</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{filteredData.length}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="text-sm text-muted-foreground">决策者</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {filteredData.filter(c => c.decisionRole === '决策者').length}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">高管</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {filteredData.filter(c => c.jobLevel === '高管').length}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-muted-foreground">主要联系人</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredData.filter(c => c.isPrimary).length}
            </div>
          </div>
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={contactPersonFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={4}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_contact_person_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={contactPersonAdvancedFilterFields}
        />

        {/* DataTable */}
        <DataTable
          columns={columnsWithActions}
          data={filteredData as ContactPerson[]}
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
          emptyText="暂无联系人数据"
          loading={isLoading || isFilterLoading}
          className="border rounded-lg"
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title="新增联系人"
          width={700}
        >
          <ContactPersonForm
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
            if (!open) setSelectedContact(null)
          }}
          title="编辑联系人"
          width={700}
        >
          {selectedContact && (
            <ContactPersonForm
              mode="edit"
              initialValues={selectedContact as Partial<ContactPersonFormValues>}
              onSubmit={handleEdit}
              onCancel={() => {
                setEditModalOpen(false)
                setSelectedContact(null)
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
          content="删除后数据将无法恢复，确定要删除该联系人吗？"
          okType="danger"
          okText="删除"
          onOk={handleDelete}
          confirmLoading={deleteMutation.isPending}
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
          itemName="联系人"
        />

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title={t("contactPerson.exportTitle", "导出联系人数据")}
          width={400}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedRowsForExport.length > 0
                ? t("contactPerson.exportSelectedDesc", `将导出选中的 ${selectedRowsForExport.length} 个联系人数据`)
                : t("contactPerson.exportAllDesc", `将导出全部 ${filteredData.length} 个联系人数据`)}
            </p>
            
            <div className="space-y-2">
              <Label>{t("contactPerson.exportFormat", "导出格式")}</Label>
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
                <FileDown className="mr-2 h-4 w-4" />
                {t("contactPerson.exportConfirm", "确认导出")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ContactPersonList
