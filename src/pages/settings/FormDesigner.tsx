/**
 * FormDesigner - Visual Form Layout Designer
 * Allows drag-and-drop arrangement of fields into form sections
 */
"use client"

import React, { useState, useCallback, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  ChevronDown,
  ChevronRight,
  Copy,
  Loader2,
  FormInput,
  LayoutGrid,
  Columns,
  Hash,
  Calendar,
  ListOrdered,
  ToggleLeft,
  Mail,
  Phone,
  Type,
  AlignLeft,
  Star,
  Search,
  FileText,
  Calculator,
  MapPin,
  Layers,
  Workflow,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// ============ Types ============

interface FormSection {
  id: string
  title: string
  description?: string
  fields: string[] // field IDs in order
  columns: 1 | 2 | 3
  collapsible: boolean
  collapsed: boolean
}

interface FormLayoutDesign {
  sections: FormSection[]
  fieldAssignments: Record<string, { sectionId: string; visible: boolean; readonly: boolean }>
}

// ============ Field Palette ============

const fieldPaletteItems = [
  { id: "text", label: "单行文本", icon: Type, color: "bg-blue-50 border-blue-200" },
  { id: "textarea", label: "多行文本", icon: AlignLeft, color: "bg-blue-50 border-blue-200" },
  { id: "richtext", label: "富文本", icon: FileText, color: "bg-indigo-50 border-indigo-200" },
  { id: "number", label: "数字", icon: Hash, color: "bg-green-50 border-green-200" },
  { id: "currency", label: "货币", icon: Hash, color: "bg-green-50 border-green-200" },
  { id: "date", label: "日期", icon: Calendar, color: "bg-amber-50 border-amber-200" },
  { id: "datetime", label: "日期时间", icon: Calendar, color: "bg-amber-50 border-amber-200" },
  { id: "select", label: "下拉单选", icon: ListOrdered, color: "bg-purple-50 border-purple-200" },
  { id: "multiselect", label: "下拉多选", icon: ListOrdered, color: "bg-purple-50 border-purple-200" },
  { id: "switch", label: "开关", icon: ToggleLeft, color: "bg-pink-50 border-pink-200" },
  { id: "checkbox", label: "复选框", icon: ToggleLeft, color: "bg-pink-50 border-pink-200" },
  { id: "email", label: "邮箱", icon: Mail, color: "bg-cyan-50 border-cyan-200" },
  { id: "phone", label: "电话", icon: Phone, color: "bg-cyan-50 border-cyan-200" },
  { id: "url", label: "网址", icon: Phone, color: "bg-cyan-50 border-cyan-200" },
  { id: "rating", label: "评分", icon: Star, color: "bg-orange-50 border-orange-200" },
  { id: "address", label: "地址", icon: MapPin, color: "bg-teal-50 border-teal-200" },
  { id: "formula", label: "公式", icon: Calculator, color: "bg-rose-50 border-rose-200" },
  { id: "rollup", label: "汇总", icon: Layers, color: "bg-violet-50 border-violet-200" },
]

// ============ Default Layout ============

const defaultLayout: FormLayoutDesign = {
  sections: [
    {
      id: "section_1",
      title: "基本信息",
      description: "主要信息",
      fields: [],
      columns: 2,
      collapsible: false,
      collapsed: false,
    },
  ],
  fieldAssignments: {},
}

// ============ Sortable Field Item ============

interface SortableFieldItemProps {
  field: { id: string; label: string; type: string }
  icon: React.ElementType
  palette?: { color: string }
  isAssigned: boolean
  onAdd: () => void
}

function SortableFieldItem({ field, icon: Icon, palette, isAssigned, onAdd }: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all hover:shadow-sm",
          palette?.color || "bg-gray-50 border-gray-200",
          isAssigned && "opacity-50"
        )}
        onClick={onAdd}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-grab" />
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium">{field.label}</span>
          <p className="text-xs text-muted-foreground">{field.id}</p>
        </div>
        {isAssigned ? (
          <Badge variant="secondary" className="text-xs">已添加</Badge>
        ) : (
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

// ============ Main Component ============

export default function FormDesignerPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { objectId } = useParams<{ objectId: string }>()
  const { toast } = useToast()

  const [layout, setLayout] = useState<FormLayoutDesign>(defaultLayout)
  const [selectedSection, setSelectedSection] = useState<string | null>("section_1")
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [fieldSearchQuery, setFieldSearchQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Filter fields by search query
  const filteredFields = useMemo(() => {
    if (!fieldSearchQuery.trim()) return availableFields
    const query = fieldSearchQuery.toLowerCase()
    return availableFields.filter(
      (f) =>
        f.label.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query) ||
        f.type.toLowerCase().includes(query)
    )
  }, [availableFields, fieldSearchQuery])

  // Mock fields
  const [availableFields] = useState([
    { id: "name", label: "名称", type: "text" },
    { id: "owner", label: "负责人", type: "user" },
    { id: "status", label: "状态", type: "select" },
    { id: "priority", label: "优先级", type: "select" },
    { id: "created_date", label: "创建日期", type: "date" },
    { id: "description", label: "描述", type: "textarea" },
    { id: "phone", label: "电话", type: "phone" },
    { id: "email", label: "邮箱", type: "email" },
    { id: "amount", label: "金额", type: "number" },
    { id: "rating", label: "评分", type: "rating" },
  ])

  const selectedSectionData = layout.sections.find((s) => s.id === selectedSection)

  // Add section
  const addSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: `区块 ${layout.sections.length + 1}`,
      fields: [],
      columns: 1,
      collapsible: true,
      collapsed: false,
    }
    setLayout((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
    setSelectedSection(newSection.id)
  }

  // Delete section
  const deleteSection = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
      fieldAssignments: Object.fromEntries(
        Object.entries(prev.fieldAssignments).filter(([_, a]) => a.sectionId !== id)
      ),
    }))
    if (selectedSection === id) setSelectedSection(null)
  }

  // Add field to section
  const addFieldToSection = (sectionId: string, fieldId: string) => {
    setLayout((prev) => {
      const section = prev.sections.find((s) => s.id === sectionId)
      if (!section || section.fields.includes(fieldId)) return prev
      const newFields = [...section.fields, fieldId]
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, fields: newFields } : s
        ),
        fieldAssignments: {
          ...prev.fieldAssignments,
          [fieldId]: { sectionId, visible: true, readonly: false },
        },
      }
    })
  }

  // Remove field from section
  const removeFieldFromSection = (sectionId: string, fieldId: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, fields: s.fields.filter((f) => f !== fieldId) } : s
      ),
    }))
  }

  // Move field within section
  const moveField = (sectionId: string, fromIndex: number, toIndex: number) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId) return s
        const fields = [...s.fields]
        const [moved] = fields.splice(fromIndex, 1)
        fields.splice(toIndex, 0, moved)
        return { ...s, fields }
      }),
    }))
  }

  // Update section
  const updateSection = (id: string, updates: Partial<FormSection>) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }

  // Save layout
  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast({ title: "已保存", description: "表单布局已保存" })
  }

  // Preview render
  const renderPreview = () => (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
      {layout.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{section.title}</span>
            {section.description && (
              <span className="text-xs text-muted-foreground">— {section.description}</span>
            )}
          </div>
          <div
            className={cn(
              "grid gap-3",
              section.columns === 1 && "grid-cols-1",
              section.columns === 2 && "grid-cols-2",
              section.columns === 3 && "grid-cols-3"
            )}
          >
            {section.fields.map((fieldId) => {
              const field = availableFields.find((f) => f.id === fieldId)
              const assignment = layout.fieldAssignments[fieldId]
              if (!field || !assignment?.visible) return null
              return (
                <div key={fieldId} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  {field.type === "textarea" ? (
                    <div className="h-16 border rounded-md bg-background" />
                  ) : field.type === "select" ? (
                    <div className="h-9 border rounded-md bg-background flex items-center px-3">
                      <span className="text-sm text-muted-foreground">请选择</span>
                    </div>
                  ) : field.type === "date" ? (
                    <div className="h-9 border rounded-md bg-background flex items-center px-3">
                      <span className="text-sm text-muted-foreground">选择日期</span>
                    </div>
                  ) : field.type === "switch" ? (
                    <div className="h-5 w-9 rounded-full bg-muted" />
                  ) : (
                    <div className="h-9 border rounded-md bg-background" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  const assignedFieldIds = new Set(Object.keys(layout.fieldAssignments))

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || !selectedSection) return

    // Dragging from palette to section
    const activeFieldId = active.id as string
    const overFieldId = over.id as string

    if (!assignedFieldIds.has(activeFieldId) && availableFields.some((f) => f.id === overFieldId)) {
      // Adding a new field to section
      addFieldToSection(selectedSection, activeFieldId)
    }
  }

  const handlePaletteDragEnd = (fieldId: string) => {
    if (!selectedSection || assignedFieldIds.has(fieldId)) return
    addFieldToSection(selectedSection, fieldId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border/70 bg-[oklch(var(--shell-panel-elevated)/0.94)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/custom-objects/${objectId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <Workflow className="h-3.5 w-3.5" />
                Form designer workspace
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight">表单设计器</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                围绕对象录入流程配置字段分组、区块层级和可见性，保持表单结构清晰可维护。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-3.5 w-3.5" />
              {previewMode ? "编辑" : "预览"}
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              保存
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Field Palette */}
        {!previewMode && (
          <div className="w-56 border-r bg-sidebar flex flex-col">
            <div className="px-4 py-3">
              <h3 className="text-sm font-semibold text-sidebar-foreground mb-3 flex items-center gap-2">
                <FormInput className="h-4 w-4" />
                字段库
              </h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索字段..."
                  className="h-8 text-xs pl-8"
                  value={fieldSearchQuery}
                  onChange={(e) => setFieldSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Separator />
            <ScrollArea className="flex-1 px-3 py-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={filteredFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {filteredFields.map((field) => {
                      const Icon = fieldPaletteItems.find((p) => p.id === field.type)?.icon || Type
                      const palette = fieldPaletteItems.find((p) => p.id === field.type)
                      const isAssigned = assignedFieldIds.has(field.id)
                      return (
                        <SortableFieldItem
                          key={field.id}
                          field={field}
                          icon={Icon}
                          palette={palette}
                          isAssigned={isAssigned}
                          onAdd={() => {
                            if (selectedSection && !isAssigned) {
                              addFieldToSection(selectedSection, field.id)
                            }
                          }}
                        />
                      )
                    })}
                    {filteredFields.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">未找到匹配的字段</p>
                    )}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div className="p-2 rounded-md border bg-background shadow-lg opacity-80">
                      <span className="text-xs font-medium">
                        {availableFields.find((f) => f.id === activeId)?.label || activeId}
                      </span>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </ScrollArea>
          </div>
        )}

        {/* Center: Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-muted/10">
          {previewMode ? (
            renderPreview()
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {layout.sections.map((section) => (
                <Card
                  key={section.id}
                  className={cn(
                    "transition-all cursor-pointer",
                    selectedSection === section.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {section.collapsible ? (
                        section.collapsed ? (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )
                      ) : (
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                      )}
                      <CardTitle className="text-sm">{section.title}</CardTitle>
                      {section.description && (
                        <span className="text-xs text-muted-foreground">— {section.description}</span>
                      )}
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {section.fields.length} 字段
                      </Badge>
                    </div>
                    {selectedSection === section.id && (
                      <div className="flex gap-2 mt-2 pt-2 border-t">
                        <Select
                          value={String(section.columns)}
                          onValueChange={(v) => updateSection(section.id, { columns: Number(v) as 1 | 2 | 3 })}
                        >
                          <SelectTrigger className="h-7 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">单列布局</SelectItem>
                            <SelectItem value="2">双列布局</SelectItem>
                            <SelectItem value="3">三列布局</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateSection(section.id, { collapsible: !section.collapsible })
                          }}
                        >
                          {section.collapsible ? "取消折叠" : "可折叠"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-red-500 gap-1 ml-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSection(section.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          删除区块
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!section.collapsed && (
                      <div
                        className={cn(
                          "grid gap-3",
                          section.columns === 1 && "grid-cols-1",
                          section.columns === 2 && "grid-cols-2",
                          section.columns === 3 && "grid-cols-3"
                        )}
                      >
                        {section.fields.map((fieldId, idx) => {
                          const field = availableFields.find((f) => f.id === fieldId)
                          if (!field) return null
                          return (
                            <div
                              key={fieldId}
                              className="flex items-center gap-2 p-2.5 rounded-md border border-dashed bg-background hover:border-primary/50 transition-colors group"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100" />
                              <span className="text-sm font-medium flex-1">{field.label}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (idx > 0) moveField(section.id, idx, idx - 1)
                                }}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ↑
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (idx < section.fields.length - 1) moveField(section.id, idx, idx + 1)
                                }}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ↓
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFieldFromSection(section.id, fieldId)
                                }}
                                className="text-xs text-red-400 hover:text-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          )
                        })}
                        {section.fields.length === 0 && (
                          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                            从左侧字段库拖拽字段到这里
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Add Section */}
              <Button variant="outline" className="w-full h-10" onClick={addSection}>
                <Plus className="h-4 w-4 mr-1.5" />
                添加区块
              </Button>
            </div>
          )}
        </div>

        {/* Right: Section Settings */}
        {!previewMode && selectedSectionData && (
          <div className="w-64 border-l bg-sidebar">
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-sidebar-foreground">区块设置</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">区块标题</Label>
                <Input
                  value={selectedSectionData.title}
                  onChange={(e) => updateSection(selectedSection!, { title: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">区块描述</Label>
                <Input
                  value={selectedSectionData.description || ""}
                  onChange={(e) => updateSection(selectedSection!, { description: e.target.value })}
                  className="h-8 text-xs"
                  placeholder="可选描述"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">列数</Label>
                <Select
                  value={String(selectedSectionData.columns)}
                  onValueChange={(v) => updateSection(selectedSection!, { columns: Number(v) as 1 | 2 | 3 })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">单列</SelectItem>
                    <SelectItem value="2">双列</SelectItem>
                    <SelectItem value="3">三列</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">可折叠</Label>
                <Switch
                  checked={selectedSectionData.collapsible}
                  onCheckedChange={(checked) => updateSection(selectedSection!, { collapsible: checked })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
