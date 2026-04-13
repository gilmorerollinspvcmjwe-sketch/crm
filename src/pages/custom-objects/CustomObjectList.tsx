"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  FolderKanban,
  Laptop,
  FileText,
  TicketCheck,
  Megaphone,
  BookOpen,
  Users,
  Plus,
  Search,
  Settings,
  Trash2,
  Copy,
  MoreHorizontal,
  Eye,
  Edit,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { Modal } from "@/components/modal/Dialog"
import { useToast } from "@/hooks/use-toast"
import { mockCustomObjects } from "@/mock/customObjectData"
import type { CustomObject, CustomObjectStatus } from "@/types/customObject"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"

// ============ Icon Map ============

const iconMap: Record<string, React.ElementType> = {
  FolderKanban,
  Laptop,
  FileText,
  TicketCheck,
  Megaphone,
  BookOpen,
  Users,
}

function ObjectIcon({ icon, color, className }: { icon?: string; color?: string; className?: string }) {
  const Icon = (icon && iconMap[icon]) || FolderKanban
  return (
    <div
      className={cn("w-10 h-10 rounded-lg flex items-center justify-center", className)}
      style={{ backgroundColor: color ? `${color}20` : "#3b82f620" }}
    >
      <Icon className="w-5 h-5" style={{ color: color || "#3b82f6" }} />
    </div>
  )
}

// ============ Status Badge ============

function EnabledBadge({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      已启用
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
      已禁用
    </Badge>
  )
}

// ============ Object Card ============

interface ObjectCardProps {
  obj: CustomObject
  onEdit: (obj: CustomObject) => void
  onDelete: (obj: CustomObject) => void
  onDuplicate: (obj: CustomObject) => void
}

function ObjectCard({ obj, onEdit, onDelete, onDuplicate }: ObjectCardProps) {
  const fieldCount = ((obj.secondaryProperties || []).length || 0) + 1

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ObjectIcon icon={obj.icon} color={obj.iconColor} />
            <div>
              <CardTitle className="text-base font-semibold">{obj.singularName || obj.label}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {obj.name} · {fieldCount} 个字段
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EnabledBadge enabled={obj.enabled ?? true} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/custom-objects/${obj.id}`)} className="flex items-center gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" /> 查看详情
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(obj)} className="flex items-center gap-2 cursor-pointer">
                  <Edit className="h-4 w-4" /> 编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(obj)} className="flex items-center gap-2 cursor-pointer">
                  <Copy className="h-4 w-4" /> 复制
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(obj)}
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4" /> 删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {obj.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{obj.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {obj.showInNavigation ? "导航显示" : "未显示"}
          </Badge>
          {obj.isSystem && (
            <Badge variant="outline" className="text-xs">
              系统对象
            </Badge>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/custom-objects/${obj.id}`)}>
            <Eye className="h-3.5 w-3.5 mr-1" /> 打开
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/custom-objects/${obj.id}/settings`)}>
            <Settings className="h-3.5 w-3.5 mr-1" /> 设置
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============ Edit/Create Modal ============

interface ObjectFormValues {
  name: string
  singularName: string
  pluralName: string
  description: string
  icon: string
  iconColor: string
  enabled: boolean
  showInNavigation: boolean
}

interface ObjectModalProps {
  open: boolean
  onClose: () => void
  onSave: (values: ObjectFormValues) => void
  editing?: CustomObject | null
}

function ObjectModal({ open, onClose, onSave, editing }: ObjectModalProps) {
  const { t } = useTranslation()
  const [form, setForm] = React.useState<ObjectFormValues>({
    name: "",
    singularName: "",
    pluralName: "",
    description: "",
    icon: "FolderKanban",
    iconColor: "#3b82f6",
    enabled: true,
    showInNavigation: true,
  })

  React.useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        singularName: editing.singularName || editing.label,
        pluralName: editing.pluralName || editing.pluralLabel,
        description: editing.description || "",
        icon: editing.icon || "FolderKanban",
        iconColor: editing.iconColor || "#3b82f6",
        enabled: editing.enabled ?? true,
        showInNavigation: editing.showInNavigation,
      })
    } else {
      setForm({
        name: "",
        singularName: "",
        pluralName: "",
        description: "",
        icon: "FolderKanban",
        iconColor: "#3b82f6",
        enabled: true,
        showInNavigation: true,
      })
    }
  }, [editing, open])

  const handleSave = () => {
    if (!form.name || !form.singularName || !form.pluralName) return
    onSave(form)
    onClose()
  }

  const iconOptions = [
    { value: "FolderKanban", label: "📁 项目" },
    { value: "Laptop", label: "💻 设备" },
    { value: "FileText", label: "📄 合同" },
    { value: "TicketCheck", label: "🎫 工单" },
    { value: "Megaphone", label: "📢 营销" },
  ]

  const colorOptions = [
    { value: "#3b82f6", label: "蓝色" },
    { value: "#10b981", label: "绿色" },
    { value: "#8b5cf6", label: "紫色" },
    { value: "#f59e0b", label: "橙色" },
    { value: "#ec4899", label: "粉色" },
    { value: "#ef4444", label: "红色" },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "编辑自定义对象" : "新建自定义对象"}
      description="填写对象基本信息"
      className="max-w-lg"
    >
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="singularName">单数名称 *</Label>
            <Input
              id="singularName"
              value={form.singularName}
              onChange={e => setForm(f => ({ ...f, singularName: e.target.value }))}
              placeholder="如：项目"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pluralName">复数名称 *</Label>
            <Input
              id="pluralName"
              value={form.pluralName}
              onChange={e => setForm(f => ({ ...f, pluralName: e.target.value }))}
              placeholder="如：项目"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">对象标识 *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value.toLowerCase().replace(/[^a-z_]/g, "") }))}
            placeholder="如：project（仅小写字母和下划线）"
          />
          <p className="text-xs text-muted-foreground">用于 API 调用，只能包含小写字母和下划线</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">描述</Label>
          <Input
            id="description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="简要描述此对象的用途"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>图标</Label>
            <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>颜色</Label>
            <Select value={form.iconColor} onValueChange={v => setForm(f => ({ ...f, iconColor: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: opt.value }} />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">启用对象</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showInNavigation}
              onChange={e => setForm(f => ({ ...f, showInNavigation: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">显示在导航</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button
          onClick={handleSave}
          disabled={!form.name || !form.singularName || !form.pluralName}
        >
          {editing ? "保存修改" : "创建对象"}
        </Button>
      </div>
    </Modal>
  )
}

// ============ Main Component ============

export function CustomObjectList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "enabled" | "disabled">("all")
  const [objects, setObjects] = React.useState<CustomObject[]>(mockCustomObjects || [])
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editingObj, setEditingObj] = React.useState<CustomObject | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<CustomObject | null>(null)

  const filtered = React.useMemo(() => {
    return (objects || []).filter(obj => {
      const matchesSearch =
        !search ||
        obj.name.includes(search.toLowerCase()) ||
        obj.singularName?.includes(search) ||
        obj.label.includes(search) ||
        obj.description?.includes(search)
      const matchesFilter =
        filter === "all" ||
        (filter === "enabled" && obj.enabled) ||
        (filter === "disabled" && !obj.enabled)
      return matchesSearch && matchesFilter
    })
  }, [objects, search, filter])

  const handleCreate = () => {
    setEditingObj(null)
    setModalOpen(true)
  }

  const handleEdit = (obj: CustomObject) => {
    setEditingObj(obj)
    setModalOpen(true)
  }

  const handleSave = (values: ObjectFormValues) => {
    if (editingObj) {
      setObjects(prev =>
        prev.map(o =>
          o.id === editingObj.id
            ? {
                ...o,
                ...values,
                updatedAt: new Date().toISOString(),
              }
            : o
        )
      )
      toast({ title: "已保存", description: `对象 "${values.singularName || values.name}" 已更新` })
    } else {
      const newObj: CustomObject = {
        id: `obj_${values.name}_${Date.now()}`,
        name: values.name,
        singularName: values.singularName,
        pluralName: values.pluralName,
        label: values.singularName,
        pluralLabel: values.pluralName,
        description: values.description,
        icon: values.icon,
        iconColor: values.iconColor,
        status: values.enabled ? 'active' as CustomObjectStatus : 'draft' as CustomObjectStatus,
        enabled: values.enabled,
        isSystem: false,
        sortOrder: (objects || []).length + 1,
        showInNavigation: values.showInNavigation,
        createdBy: "user_001",
        createdAt: new Date().toISOString(),
      }
      setObjects(prev => [...prev, newObj])
      toast({ title: "已创建", description: `对象 "${values.singularName || values.name}" 已创建` })
    }
  }

  const handleDelete = (obj: CustomObject) => {
    setDeleteTarget(obj)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      setObjects(prev => prev.filter(o => o.id !== deleteTarget.id))
      toast({ title: "已删除", description: `对象 "${deleteTarget.singularName || deleteTarget.label || deleteTarget.name}" 已删除`, variant: "destructive" })
      setDeleteTarget(null)
    }
  }

  const handleDuplicate = (obj: CustomObject) => {
    const newObj: CustomObject = {
      ...obj,
      id: `${obj.id}_copy_${Date.now()}`,
      name: `${obj.name}_copy`,
      singularName: `${obj.singularName || obj.label} (副本)`,
      label: `${obj.label} (副本)`,
      pluralName: `${obj.pluralName || obj.pluralLabel} (副本)`,
      pluralLabel: `${obj.pluralLabel || obj.pluralName} (副本)`,
      enabled: false,
      isSystem: false,
      sortOrder: (objects || []).length + 1,
      showInNavigation: false,
      createdAt: new Date().toISOString(),
    }
    setObjects(prev => [...prev, newObj])
    toast({ title: "已复制", description: `对象 "${obj.singularName || obj.label}" 副本已创建` })
  }

  return (
    <div className="w-full mx-auto space-y-5 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <FolderKanban className="h-3.5 w-3.5" />
            Custom object workspace
          </div>
          <h1 className="text-2xl font-bold">自定义对象</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            管理和配置业务自定义对象
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" /> 新建对象
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索对象..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={filter} onValueChange={v => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="enabled">已启用</SelectItem>
            <SelectItem value="disabled">已禁用</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {(filtered || []).length === 0 && (
        <EmptyState
          variant={search ? "search" : "noData"}
          title={search ? "没有找到匹配对象" : "暂无自定义对象"}
          description={search ? "试试更短的关键词，或者切换筛选状态。" : "创建一个新的自定义对象开始使用。"}
          action={!search ? { label: "新建第一个对象", onClick: handleCreate, icon: <Plus className="h-4 w-4" /> } : undefined}
          className="py-16"
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(obj => (
          <ObjectCard
            key={obj.id}
            obj={obj}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      <ObjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editing={editingObj}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        title="确认删除"
        content={`确定要删除对象 "${deleteTarget?.singularName || deleteTarget?.label}" 吗？此操作不可恢复。`}
        okType="danger"
      />
    </div>
  )
}

export default CustomObjectList
