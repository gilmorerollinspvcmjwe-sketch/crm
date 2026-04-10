"use client"

import * as React from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  GripVertical,
  Settings,
  Save,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  Copy,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Type,
  Hash,
  Calendar,
  ListOrdered,
  ToggleLeft,
  DollarSign,
  Mail,
  Phone,
  Link as LinkIcon,
  User,
  Building,
  File,
  Image,
  AlignLeft,
  Percent,
  Clock,
  Star,
  CheckSquare,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { Modal } from "@/components/modal/Dialog"
import { useToast } from "@/hooks/use-toast"
import { mockCustomObjectDefinitions } from "@/mock/customObjectData"
import type { CustomField, FieldType, CustomObject, CustomObjectDefinition } from "@/types/customObject"
import { cn } from "@/lib/utils"

// ============ Field Type Config ============

interface FieldTypeOption {
  value: FieldType
  label: string
  icon: React.ElementType
  category: "text" | "number" | "date" | "select" | "special" | "relation"
}

const fieldTypes: FieldTypeOption[] = [
  { value: "text", label: "单行文本", icon: Type, category: "text" },
  { value: "textarea", label: "多行文本", icon: AlignLeft, category: "text" },
  { value: "number", label: "整数", icon: Hash, category: "number" },
  { value: "decimal", label: "小数", icon: Hash, category: "number" },
  { value: "currency", label: "货币", icon: DollarSign, category: "number" },
  { value: "percent", label: "百分比", icon: Percent, category: "number" },
  { value: "date", label: "日期", icon: Calendar, category: "date" },
  { value: "datetime", label: "日期时间", icon: Clock, category: "date" },
  { value: "time", label: "时间", icon: Clock, category: "date" },
  { value: "select", label: "下拉单选", icon: ListOrdered, category: "select" },
  { value: "multiselect", label: "下拉多选", icon: ListOrdered, category: "select" },
  { value: "radio", label: "单选按钮", icon: CheckSquare, category: "select" },
  { value: "switch", label: "开关", icon: ToggleLeft, category: "special" },
  { value: "checkbox", label: "复选框", icon: CheckSquare, category: "special" },
  { value: "email", label: "邮箱", icon: Mail, category: "text" },
  { value: "phone", label: "电话", icon: Phone, category: "text" },
  { value: "url", label: "网址", icon: LinkIcon, category: "text" },
  { value: "user", label: "用户", icon: User, category: "relation" },
  { value: "department", label: "部门", icon: Building, category: "relation" },
  { value: "file", label: "文件", icon: File, category: "special" },
  { value: "image", label: "图片", icon: Image, category: "special" },
  { value: "rating", label: "评分", icon: Star, category: "special" },
]

// ============ Option Editor ============

interface OptionEditorProps {
  options: { label: string; value: string; color: string; sortOrder: number; enabled: boolean }[]
  onChange: (options: { label: string; value: string; color: string; sortOrder: number; enabled: boolean }[]) => void
}

function OptionEditor({ options, onChange }: OptionEditorProps) {
  const addOption = () => {
    const newOpt = {
      label: `选项${options.length + 1}`,
      value: `option_${options.length + 1}`,
      color: "#6b7280",
      sortOrder: options.length,
      enabled: true,
    }
    onChange([...options, newOpt])
  }

  const updateOption = (index: number, updates: Partial<typeof options[0]>) => {
    const newOpts = [...options]
    newOpts[index] = { ...newOpts[index], ...updates }
    onChange(newOpts)
  }

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label>选项</Label>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            className="w-8 h-8 p-1 text-center"
            value={opt.sortOrder + 1}
            readOnly
          />
          <Input
            value={opt.label}
            onChange={e => updateOption(i, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
            placeholder="选项标签"
            className="flex-1"
          />
          <Input
            type="color"
            value={opt.color}
            onChange={e => updateOption(i, { color: e.target.value })}
            className="w-10 h-8 p-1 cursor-pointer"
          />
          <Checkbox
            checked={opt.enabled}
            onCheckedChange={checked => updateOption(i, { enabled: !!checked })}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500"
            onClick={() => removeOption(i)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addOption} className="mt-1">
        <Plus className="h-3.5 w-3.5 mr-1" /> 添加选项
      </Button>
    </div>
  )
}

// ============ Field Editor Modal ============

interface FieldFormValues {
  name: string
  label: string
  type: FieldType
  required: boolean
  listVisible: boolean
  detailVisible: boolean
  searchable: boolean
  sortable: boolean
  bulkEditable: boolean
  enabled: boolean
  placeholder: string
  description: string
  defaultValue: string
  options: { label: string; value: string; color: string; sortOrder: number; enabled: boolean }[]
}

interface FieldEditorModalProps {
  open: boolean
  onClose: () => void
  onSave: (values: FieldFormValues, originalName?: string) => void
  editing?: CustomField | null
  existingNames: string[]
}

function FieldEditorModal({ open, onClose, onSave, editing, existingNames }: FieldEditorModalProps) {
  const [form, setForm] = React.useState<FieldFormValues>({
    name: "",
    label: "",
    type: "text" as FieldType,
    required: false,
    listVisible: true,
    detailVisible: true,
    searchable: true,
    sortable: true,
    bulkEditable: false,
    enabled: true,
    placeholder: "",
    description: "",
    defaultValue: "",
    options: [],
  })

  const selectedType = fieldTypes.find(t => t.value === form.type)
  const needsOptions = ["select", "multiselect", "radio"].includes(form.type)

  React.useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        label: editing.label,
        type: editing.type,
        required: editing.required,
        listVisible: editing.listVisible,
        detailVisible: editing.detailVisible,
        searchable: editing.searchable,
        sortable: editing.sortable,
        bulkEditable: editing.bulkEditable,
        enabled: editing.enabled,
        placeholder: editing.placeholder || "",
        description: editing.description || "",
        defaultValue: String(editing.defaultValue ?? ""),
        options: editing.options?.map(o => ({
          label: o.label,
          value: o.value,
          color: o.color || "#6b7280",
          sortOrder: o.sortOrder,
          enabled: o.enabled,
        })) ?? [],
      })
    } else {
      setForm({
        name: "",
        label: "",
        type: "text" as FieldType,
        required: false,
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: false,
        enabled: true,
        placeholder: "",
        description: "",
        defaultValue: "",
        options: [],
      })
    }
  }, [editing, open])

  const handleSave = () => {
    if (!form.label || !form.name) return
    if (existingNames.includes(form.name) && (!editing || editing.name !== form.name)) return
    onSave(form, editing?.name)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "编辑字段" : "添加字段"}
      description="配置字段属性"
      className="max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-4 py-2">
        {/* Field Type Selection */}
        <div className="space-y-1.5">
          <Label>字段类型</Label>
          <Select
            value={form.type}
            onValueChange={v => setForm(f => ({ ...f, type: v as FieldType }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["text", "number", "date", "select", "special", "relation"] as const).map(cat => (
                <div key={cat}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    {cat === "text" ? "文本" : cat === "number" ? "数字" : cat === "date" ? "日期" : cat === "select" ? "选择" : cat === "special" ? "特殊" : "关联"}
                  </div>
                  {fieldTypes.filter(t => t.category === cat).map(ft => {
                    const Icon = ft.icon
                    return (
                      <SelectItem key={ft.value} value={ft.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {ft.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Label & Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="label">显示名称 *</Label>
            <Input
              id="label"
              value={form.label}
              onChange={e => {
                const label = e.target.value
                const name = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
                setForm(f => ({ ...f, label, name: f.name || name }))
              }}
              placeholder="字段显示名称"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">字段标识 *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                }))
              }
              placeholder="field_name"
              className={existingNames.includes(form.name) && (!editing || editing.name !== form.name) ? "border-red-500" : ""}
            />
            {existingNames.includes(form.name) && (!editing || editing.name !== form.name) && (
              <p className="text-xs text-red-500">字段标识已存在</p>
            )}
          </div>
        </div>

        {/* Options for select types */}
        {needsOptions && (
          <OptionEditor
            options={form.options}
            onChange={opts => setForm(f => ({ ...f, options: opts }))}
          />
        )}

        {/* Placeholder & Description */}
        <div className="space-y-1.5">
          <Label htmlFor="placeholder">占位文本</Label>
          <Input
            id="placeholder"
            value={form.placeholder}
            onChange={e => setForm(f => ({ ...f, placeholder: e.target.value }))}
            placeholder="输入框占位提示"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">帮助文本</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="字段使用说明"
            rows={2}
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <Label>字段行为</Label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.required}
                onCheckedChange={c => setForm(f => ({ ...f, required: !!c }))}
              />
              <span className="text-sm">必填</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.listVisible}
                onCheckedChange={c => setForm(f => ({ ...f, listVisible: !!c }))}
              />
              <span className="text-sm">列表显示</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.detailVisible}
                onCheckedChange={c => setForm(f => ({ ...f, detailVisible: !!c }))}
              />
              <span className="text-sm">详情显示</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.searchable}
                onCheckedChange={c => setForm(f => ({ ...f, searchable: !!c }))}
              />
              <span className="text-sm">可搜索</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.sortable}
                onCheckedChange={c => setForm(f => ({ ...f, sortable: !!c }))}
              />
              <span className="text-sm">可排序</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.bulkEditable}
                onCheckedChange={c => setForm(f => ({ ...f, bulkEditable: !!c }))}
              />
              <span className="text-sm">批量编辑</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={handleSave} disabled={!form.label || !form.name || (existingNames.includes(form.name) && (!editing || editing.name !== form.name))}>
          {editing ? "保存修改" : "添加字段"}
        </Button>
      </div>
    </Modal>
  )
}

// ============ Preview Panel ============

interface PreviewPanelProps {
  fields: CustomField[]
}

function PreviewPanel({ fields }: PreviewPanelProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="h-4 w-4" /> 实时预览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.slice(0, 6).map(prop => {
          const Icon = fieldTypes.find(t => t.value === prop.type)?.icon || Type
          return (
            <div key={prop.id} className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                {prop.required && <span className="text-red-500">*</span>}
                {prop.label}
              </Label>
              {prop.type === "select" ? (
                <div className="h-9 rounded-md border bg-muted/30 flex items-center px-3 text-sm text-muted-foreground">
                  请选择
                </div>
              ) : prop.type === "switch" ? (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-5 rounded-full bg-muted" />
                  <span className="text-xs text-muted-foreground">开关</span>
                </div>
              ) : prop.type === "radio" ? (
                <div className="flex gap-3">
                  {prop.options?.slice(0, 3).map(o => (
                    <label key={o.value} className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full border" />
                      {o.label}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="h-9 rounded-md border bg-muted/30 flex items-center px-3 text-sm text-muted-foreground">
                  {prop.placeholder || prop.label}
                </div>
              )}
            </div>
          )
        })}
        {fields.length > 6 && (
          <p className="text-xs text-muted-foreground">还有 {fields.length - 6} 个字段...</p>
        )}
      </CardContent>
    </Card>
  )
}

// ============ Main Builder Component ============

export function CustomObjectBuilder() {
  const { objectId } = useParams<{ objectId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [objectDef, setObjectDef] = React.useState<CustomObjectDefinition | null>(null)
  const [fields, setFields] = React.useState<CustomField[]>([])
  const [loading, setLoading] = React.useState(true)
  const [fieldModalOpen, setFieldModalOpen] = React.useState(false)
  const [editingField, setEditingField] = React.useState<CustomField | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<CustomField | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"basic" | "fields">("basic")
  const [basicForm, setBasicForm] = React.useState({
    singularName: "",
    pluralName: "",
    description: "",
    icon: "FolderKanban",
    iconColor: "#3b82f6",
    enabled: true,
    showInNavigation: true,
  })

  React.useEffect(() => {
    if (!objectId) return
    const def = mockCustomObjectDefinitions.find(d => d.id === objectId)
    if (def) {
      setObjectDef(def)
      setFields(def.fields)
      setBasicForm({
        singularName: def.singularName || "",
        pluralName: def.pluralName || "",
        description: def.description || "",
        icon: def.icon || "FolderKanban",
        iconColor: def.iconColor || "#3b82f6",
        enabled: def.enabled ?? true,
        showInNavigation: def.showInNavigation ?? true,
      })
    }
    setLoading(false)
  }, [objectId])

  const existingFieldNames = fields.map(f => f.name)

  const handleAddField = () => {
    setEditingField(null)
    setFieldModalOpen(true)
  }

  const handleEditField = (field: CustomField) => {
    setEditingField(field)
    setFieldModalOpen(true)
  }

  const handleSaveField = (values: FieldFormValues, originalName?: string) => {
    if (editingField && originalName) {
      // Edit existing
      setFields(prev =>
        prev.map(p =>
          p.name === originalName
            ? {
                ...p,
                name: values.name,
                label: values.label,
                type: values.type,
                required: values.required,
                unique: p.unique ?? false,
                listVisible: values.listVisible,
                detailVisible: values.detailVisible,
                searchable: values.searchable,
                sortable: values.sortable,
                bulkEditable: values.bulkEditable,
                enabled: values.enabled,
                placeholder: values.placeholder || "",
                description: values.description || "",
                defaultValue: values.defaultValue,
                options: values.options.map((o, i) => ({ ...o, sortOrder: i })),
              }
            : p
        )
      )
      toast({ title: "已保存", description: `字段 "${values.label}" 已更新` })
    } else {
      // Add new
      const newField: CustomField = {
        id: `prop_${objectId}_${values.name}_${Date.now()}`,
        objectId: objectId || "",
        name: values.name,
        label: values.label,
        type: values.type,
        internalType: values.type,
        unique: false,
        isPrimary: fields.length === 0,
        isSecondary: false,
        required: values.required,
        listVisible: values.listVisible,
        detailVisible: values.detailVisible,
        searchable: values.searchable,
        sortable: values.sortable,
        bulkEditable: values.bulkEditable,
        enabled: values.enabled,
        placeholder: values.placeholder || "",
        description: values.description || "",
        defaultValue: values.defaultValue,
        options: values.options.map((o, i) => ({ ...o, sortOrder: i, value: o.value || `opt_${i}` })),
        sortOrder: fields.length,
        createdAt: new Date().toISOString(),
      }
      setFields(prev => [...prev, newField])
      toast({ title: "已添加", description: `字段 "${values.label}" 已添加` })
    }
  }

  const handleDeleteField = (field: CustomField) => {
    setDeleteTarget(field)
  }

  const confirmDeleteField = () => {
    if (deleteTarget) {
      setFields(prev => prev.filter(p => p.id !== deleteTarget.id))
      toast({ title: "已删除", description: `字段 "${deleteTarget.label}" 已删除`, variant: "destructive" })
      setDeleteTarget(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    toast({ title: "已保存", description: "对象结构已保存" })
    navigate(`/custom-objects/${objectId}`)
  }

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newFields.length) return
    ;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
    newFields.forEach((p, i) => { p.sortOrder = i })
    setFields(newFields)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!objectDef) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-semibold">对象不存在</h3>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/custom-objects")}>
          返回列表
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/custom-objects/${objectId}`}>
              <span className="flex items-center">
                <ArrowLeft className="h-4 w-4" />
              </span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">编辑对象</h1>
            <p className="text-sm text-muted-foreground">
              {objectDef.singularName} - 对象构建器
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          保存
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Builder Panel */}
        <div className="col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b">
            <button
              onClick={() => setActiveTab("basic")}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer",
                activeTab === "basic"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab("fields")}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer",
                activeTab === "fields"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              字段 ({fields.length})
            </button>
          </div>

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="singularName">单数名称</Label>
                    <Input
                      id="singularName"
                      value={basicForm.singularName}
                      onChange={e => setBasicForm(f => ({ ...f, singularName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pluralName">复数名称</Label>
                    <Input
                      id="pluralName"
                      value={basicForm.pluralName}
                      onChange={e => setBasicForm(f => ({ ...f, pluralName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={basicForm.description}
                    onChange={e => setBasicForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={basicForm.enabled}
                      onCheckedChange={c => setBasicForm(f => ({ ...f, enabled: !!c }))}
                    />
                    <span className="text-sm">启用对象</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={basicForm.showInNavigation}
                      onCheckedChange={c => setBasicForm(f => ({ ...f, showInNavigation: !!c }))}
                    />
                    <span className="text-sm">显示在导航</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fields Tab */}
          {activeTab === "fields" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">对象字段</CardTitle>
                <Button size="sm" onClick={handleAddField}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> 添加字段
                </Button>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Type className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <p className="font-medium mb-1">暂无字段</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      添加字段来定义对象的结构
                    </p>
                    <Button size="sm" onClick={handleAddField}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> 添加第一个字段
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {fields.map((prop, index) => {
                      const Icon = fieldTypes.find(t => t.value === prop.type)?.icon || Type
                      return (
                        <div
                          key={prop.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors group"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${prop.type === "select" || prop.type === "radio" ? "#8b5cf620" : "#3b82f620"}` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: prop.type === "select" || prop.type === "radio" ? "#8b5cf6" : "#3b82f6" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{prop.label}</span>
                              {prop.required && <span className="text-red-500 text-xs">*</span>}
                              {prop.isPrimary && <Badge variant="outline" className="text-xs">主字段</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {prop.name} · {fieldTypes.find(t => t.value === prop.type)?.label || prop.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => moveField(index, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => moveField(index, "down")}
                              disabled={index === fields.length - 1}
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEditField(prop)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => handleDeleteField(prop)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <PreviewPanel fields={fields} />

          {/* Field Type Legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">字段类型</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-1.5">
              {fieldTypes.slice(0, 12).map(ft => {
                const Icon = ft.icon
                return (
                  <div key={ft.value} className="flex items-center gap-1.5 text-xs">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{ft.label}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Field Editor Modal */}
      <FieldEditorModal
        open={fieldModalOpen}
        onClose={() => setFieldModalOpen(false)}
        onSave={handleSaveField}
        editing={editingField}
        existingNames={existingFieldNames.filter(n => n !== editingField?.name)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDeleteField}
        title="确认删除字段"
        content={`确定要删除字段 "${deleteTarget?.label}" 吗？此操作不可恢复。`}
        okType="danger"
      />
    </div>
  )
}

export default CustomObjectBuilder
