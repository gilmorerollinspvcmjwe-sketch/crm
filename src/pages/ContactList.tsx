"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Mail, Trash2, Eye, Edit, MoreHorizontal, FileDown, Phone, MessageSquare, Clock, Activity } from "lucide-react"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal/Dialog"
import { ContactForm } from "@/forms/ContactForm"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { FilterBar } from "@/components/FilterBar"
import type { FilterItem, FilterField, FilterGroupLegacy } from "@/components/FilterBar"
import { createEmptyFilterGroup, applyFilterGroup } from "@/components/FilterBar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BulkAssignDialog, BulkDeleteDialog } from "@/components/bulk"
import { useToast } from "@/hooks/use-toast"
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useBulkAssignContacts,
  useBulkDeleteContacts,
  useBulkExportContacts,
} from "@/hooks/api/useContacts"
import type { Contact, ContactType } from "@/types/api"
import type { ContactFormValues } from "@/schemas"
import { cn } from "@/lib/utils"

// ============ Contact Type Badge ============

const typeConfig: Record<ContactType, { label: string; className: string; dotColor: string; icon: React.ReactNode }> = {
  "电话": { 
    label: "电话", 
    className: "bg-green-100 text-green-800 border-green-200", 
    dotColor: "bg-green-500",
    icon: <Phone className="h-3 w-3" />
  },
  "邮件": { 
    label: "邮件", 
    className: "bg-blue-100 text-blue-800 border-blue-200", 
    dotColor: "bg-blue-500",
    icon: <Mail className="h-3 w-3" />
  },
  "微信": { 
    label: "微信", 
    className: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    dotColor: "bg-emerald-500",
    icon: <MessageSquare className="h-3 w-3" />
  },
  "短信": { 
    label: "短信", 
    className: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    dotColor: "bg-yellow-500",
    icon: <MessageSquare className="h-3 w-3" />
  },
  "面谈": { 
    label: "面谈", 
    className: "bg-purple-100 text-purple-800 border-purple-200", 
    dotColor: "bg-purple-500",
    icon: <Eye className="h-3 w-3" />
  },
  "其他": { 
    label: "其他", 
    className: "bg-gray-100 text-gray-800 border-gray-200", 
    dotColor: "bg-gray-400",
    icon: <MessageSquare className="h-3 w-3" />
  },
}

function TypeBadge({ type }: { type: ContactType }) {
  const config = typeConfig[type]
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border transition-all duration-200 hover:shadow-sm",
      config.className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  )
}

// ============ Duration Badge ============

function DurationBadge({ duration }: { duration?: number }) {
  if (!duration) return <span className="text-muted-foreground">—</span>
  
  let colorClass = "text-muted-foreground"
  if (duration >= 60) colorClass = "text-green-600 font-medium"
  else if (duration >= 30) colorClass = "text-blue-600"
  else if (duration >= 15) colorClass = "text-yellow-600"
  
  return (
    <span className={cn("inline-flex items-center gap-1", colorClass)}>
      <Clock className="h-3 w-3" />
      {duration}分钟
    </span>
  )
}

// ============ Filter Configuration ============

const contactFilters: FilterItem[] = [
  {
    name: "customerName",
    label: "客户",
    type: "text",
    placeholder: "搜索客户姓名",
  },
  {
    name: "type",
    label: "沟通类型",
    type: "select",
    placeholder: "选择类型",
    options: [
      { label: "电话", value: "电话" },
      { label: "邮件", value: "邮件" },
      { label: "微信", value: "微信" },
      { label: "短信", value: "短信" },
      { label: "面谈", value: "面谈" },
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

const contactAdvancedFilterFields: FilterField[] = [
  {
    name: "customerName",
    label: "客户姓名",
    type: "text",
    operators: ["eq", "neq", "contains", "startsWith", "endsWith"],
    placeholder: "输入客户姓名",
  },
  {
    name: "content",
    label: "沟通内容",
    type: "text",
    operators: ["eq", "neq", "contains"],
    placeholder: "输入内容关键词",
  },
  {
    name: "type",
    label: "沟通类型",
    type: "select",
    operators: ["eq", "neq", "in", "notIn"],
    options: [
      { label: "电话", value: "电话" },
      { label: "邮件", value: "邮件" },
      { label: "微信", value: "微信" },
      { label: "短信", value: "短信" },
      { label: "面谈", value: "面谈" },
      { label: "其他", value: "其他" },
    ],
  },
  {
    name: "duration",
    label: "时长(分钟)",
    type: "number",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    min: 0,
    placeholder: "输入时长",
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
    name: "contactDate",
    label: "联系日期",
    type: "date",
    operators: ["eq", "neq", "gt", "lt", "gte", "lte", "between"],
    placeholder: "选择日期",
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

// Note: navigate function will be passed in the component
const createColumns = (navigate: (path: string) => void): ColumnDef<Contact, string>[] => [
  {
    accessorKey: "id",
    header: "记录ID",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
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
    cell: ({ row }) => (
      <span className="font-medium hover:text-primary transition-colors duration-200 cursor-pointer"
            onClick={() => navigate(`/customers/${row.original.customerId}`)}>
        {row.getValue("customerName") as string}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "类型",
    meta: {
      width: 80,
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "电话", value: "电话" },
        { label: "邮件", value: "邮件" },
        { label: "微信", value: "微信" },
        { label: "短信", value: "短信" },
        { label: "面谈", value: "面谈" },
        { label: "其他", value: "其他" },
      ],
    } as DataTableColumnMeta,
    cell: ({ row }) => (
      <TypeBadge type={row.getValue("type") as ContactType} />
    ),
  },
  {
    accessorKey: "content",
    header: "内容摘要",
    meta: { width: 300 } as DataTableColumnMeta,
    cell: ({ row }) => {
      const content = row.getValue("content") as string
      return (
        <span className="truncate max-w-[280px] block text-muted-foreground hover:text-foreground transition-colors duration-200">
          {content.length > 50 ? `${content.slice(0, 50)}...` : content}
        </span>
      )
    },
  },
  {
    accessorKey: "contactDate",
    header: "联系日期",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.getValue("contactDate") as string}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    header: "时长",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => <DurationBadge duration={row.original.duration} />,
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
      <span className="text-xs text-muted-foreground">
        {row.getValue("createdAt") as string}
      </span>
    ),
  },
]

// ============ ContactList Page ============

export function ContactList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default")
  const [rowSelection, setRowSelection] = React.useState({})
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filterValues, setFilterValues] = React.useState<Record<string, unknown>>({})
  const [advancedFilterGroup, setAdvancedFilterGroup] = React.useState<FilterGroupLegacy>(() => createEmptyFilterGroup('AND'))
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  
  // Bulk operation dialogs
  const [bulkAssignOpen, setBulkAssignOpen] = React.useState(false)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)

  // API Hooks
  const { data, isLoading } = useContacts()
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()
  const deleteMutation = useDeleteContact()
  const bulkAssignMutation = useBulkAssignContacts()
  const bulkDeleteMutation = useBulkDeleteContacts()
  const bulkExportMutation = useBulkExportContacts()

  // Get selected rows
  const selectedRows = React.useMemo(() => {
    const contacts = data?.data || []
    const selection = rowSelection as Record<string, boolean>
    return contacts.filter((contact: Contact) => selection[contact.id])
  }, [data?.data, rowSelection])

  const selectedCount = selectedRows.length

  // Filtered data based on filterValues or advancedFilterGroup
  const filteredData = React.useMemo(() => {
    const contacts = data?.data || []
    
    // 使用高级筛选
    if (advancedFilterGroup.conditions.length > 0) {
      return applyFilterGroup(contacts, advancedFilterGroup)
    }
    
    // 使用简单筛选
    if (Object.keys(filterValues).length === 0) return contacts

    return contacts.filter((contact: Contact) => {
      // CustomerName filter
      if (filterValues.customerName && typeof filterValues.customerName === 'string') {
        if (!contact.customerName?.toLowerCase().includes(filterValues.customerName.toLowerCase())) return false
      }
      // Type filter
      if (filterValues.type && filterValues.type !== '') {
        if (contact.type !== filterValues.type) return false
      }
      // Assignee filter
      if (filterValues.assignee && filterValues.assignee !== '') {
        if (contact.assignee !== filterValues.assignee) return false
      }
      // CreatedAt date range filter
      if (filterValues.createdAt && Array.isArray(filterValues.createdAt)) {
        const [startDate, endDate] = filterValues.createdAt as [Date | undefined, Date | undefined]
        if (startDate || endDate) {
          const contactDate = new Date(contact.createdAt)
          if (startDate && contactDate < startDate) return false
          if (endDate && contactDate > endDate) return false
        }
      }
      return true
    })
  }, [data?.data, filterValues, advancedFilterGroup])

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

  // Columns with actions
  const columnsWithActions = React.useMemo(() => {
    const columns = createColumns(navigate)
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: Contact } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/contact/${row.original.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedContact(row.original)
                setEditModalOpen(true)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/customers/${row.original.customerId}`)}>
                <Eye className="h-4 w-4 mr-2" />
                查看客户
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

  // Handlers
  const handleCreate = async (values: ContactFormValues) => {
    try {
      await createMutation.mutateAsync(values as unknown as Omit<Contact, "id" | "createdAt">)
      setCreateModalOpen(false)
      toast({
        title: "沟通记录创建成功",
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

  const handleEdit = async (values: ContactFormValues) => {
    if (!selectedContact) return
    try {
      await updateMutation.mutateAsync({
        id: selectedContact.id,
        ...values,
      })
      setEditModalOpen(false)
      setSelectedContact(null)
      toast({
        title: "沟通记录更新成功",
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
        title: "沟通记录已删除",
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
      const result = await bulkDeleteMutation.mutateAsync({ ids })
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

  const handleBulkExport = async () => {
    try {
      const ids = selectedRows.map(r => r.id)
      await bulkExportMutation.mutateAsync({ ids, format: 'xlsx' })
      // Note: In real app, this would download a file
      toast({
        title: "导出成功",
        description: `已导出 ${ids.length} 条记录`,
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

  // Batch actions
  const batchActions = [
    {
      label: "批量分配",
      icon: <Mail className="h-3 w-3" />,
      onClick: () => setBulkAssignOpen(true),
    },
    {
      label: "导出",
      icon: <FileDown className="h-3 w-3" />,
      onClick: handleBulkExport,
    },
    {
      label: "批量删除",
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
              Contact activity workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight">沟通记录</h1>
            <p className="text-sm text-muted-foreground">
              管理所有客户沟通记录，支持筛选、排序、批量操作，同时保持完整互动字段。
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} className="animate-scale-in shadow-sm hover:shadow-md transition-all duration-200">
            <Plus className="mr-2 h-4 w-4" />
            新增记录
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-sm)]">
            <div className="text-sm text-muted-foreground">总记录数</div>
            <div className="text-2xl font-bold mt-1">{filteredData.length}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-sm)]">
            <div className="text-sm text-muted-foreground">电话沟通</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {filteredData.filter(c => c.type === "电话").length}
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-sm)]">
            <div className="text-sm text-muted-foreground">邮件沟通</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              {filteredData.filter(c => c.type === "邮件").length}
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-sm)]">
            <div className="text-sm text-muted-foreground">面谈</div>
            <div className="text-2xl font-bold mt-1 text-purple-600">
              {filteredData.filter(c => c.type === "面谈").length}
            </div>
          </div>
        </div>

        {/* FilterBar */}
        <FilterBar
          filters={contactFilters}
          onFilterChange={handleFilterChange}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          onReset={handleFilterReset}
          loading={isFilterLoading}
          showCollapse={true}
          defaultShowCount={3}
          showFilterTags={true}
          enableSave={true}
          storageKey="crm_contact_filters"
          enableAdvancedFilter={true}
          advancedFilterFields={contactAdvancedFilterFields}
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
          emptyText="暂无沟通记录"
          loading={isLoading || isFilterLoading}
          className="rounded-[1.25rem] border-none animate-slide-in-up"
        />

        {/* Create Modal */}
        <Modal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          title="新增沟通记录"
          width={600}
        >
          <ContactForm
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
          title="编辑沟通记录"
          width={600}
        >
          {selectedContact && (
            <ContactForm
              mode="edit"
              initialValues={selectedContact as Partial<ContactFormValues>}
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
          content="删除后数据将无法恢复，确定要删除该沟通记录吗？"
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
          itemName="沟通记录"
        />
      </div>
    </div>
  )
}

export default ContactList
