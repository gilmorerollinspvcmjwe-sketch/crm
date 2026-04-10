/**
 * ViewManager - List View Configuration Manager
 * Manage saved views, filters, columns, and sorting for list views
 */
"use client"

import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Settings,
  ChevronDown,
  ChevronRight,
  Loader2,
  Filter,
  Columns,
  ArrowUpDown,
  Star,
  Check,
  LayoutList,
} from "lucide-react"

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// ============ Types ============

interface ViewColumn {
  field: string
  label: string
  width: number
  sortable: boolean
  visible: boolean
}

interface ViewFilter {
  field: string
  operator: string
  value: string
}

interface SavedView {
  id: string
  name: string
  isDefault: boolean
  isPublic: boolean
  columns: ViewColumn[]
  filters: ViewFilter[]
  sortField?: string
  sortDirection?: "asc" | "desc"
  groupByField?: string
}

// ============ Mock Data ============

const MOCK_COLUMNS: ViewColumn[] = [
  { field: "name", label: "名称", width: 200, sortable: true, visible: true },
  { field: "owner", label: "负责人", width: 120, sortable: true, visible: true },
  { field: "status", label: "状态", width: 100, sortable: true, visible: true },
  { field: "amount", label: "金额", width: 120, sortable: true, visible: true },
  { field: "created_at", label: "创建时间", width: 150, sortable: true, visible: false },
  { field: "updated_at", label: "更新时间", width: 150, sortable: false, visible: false },
]

const MOCK_FILTER_OPTIONS = [
  { field: "status", label: "状态", operators: [{ value: "equals", label: "等于" }, { value: "not_equals", label: "不等于" }] },
  { field: "owner", label: "负责人", operators: [{ value: "equals", label: "等于" }, { value: "not_equals", label: "不等于" }] },
  { field: "amount", label: "金额", operators: [{ value: "gt", label: "大于" }, { value: "lt", label: "小于" }] },
]

const MOCK_VIEWS: SavedView[] = [
  {
    id: "view_all",
    name: "全部",
    isDefault: true,
    isPublic: true,
    columns: MOCK_COLUMNS,
    filters: [],
  },
  {
    id: "view_active",
    name: "进行中",
    isDefault: false,
    isPublic: true,
    columns: MOCK_COLUMNS.filter((c) => ["name", "owner", "status", "amount"].includes(c.field)),
    filters: [{ field: "status", operator: "equals", value: "active" }],
    sortField: "updated_at",
    sortDirection: "desc",
  },
  {
    id: "view_mine",
    name: "我的",
    isDefault: false,
    isPublic: false,
    columns: MOCK_COLUMNS,
    filters: [{ field: "owner", operator: "equals", value: "current_user" }],
  },
]

// ============ Main Component ============

export default function ViewManagerPage() {
  const { objectId } = useParams<{ objectId: string }>()
  const { toast } = useToast()

  const [views, setViews] = useState<SavedView[]>(MOCK_VIEWS)
  const [selectedViewId, setSelectedViewId] = useState<string>("view_all")
  const [editingView, setEditingView] = useState<SavedView | null>(null)
  const [saving, setSaving] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [showNewView, setShowNewView] = useState(false)

  const selectedView = views.find((v) => v.id === selectedViewId)

  const createView = () => {
    if (!newViewName.trim()) return
    const newView: SavedView = {
      id: `view_${Date.now()}`,
      name: newViewName.trim(),
      isDefault: false,
      isPublic: false,
      columns: MOCK_COLUMNS,
      filters: [],
    }
    setViews((prev) => [...prev, newView])
    setSelectedViewId(newView.id)
    setNewViewName("")
    setShowNewView(false)
    toast({ title: "已创建", description: `视图 "${newView.name}" 已创建` })
  }

  const deleteView = (id: string) => {
    const view = views.find((v) => v.id === id)
    setViews((prev) => prev.filter((v) => v.id !== id))
    if (selectedViewId === id) setSelectedViewId("view_all")
    toast({ title: "已删除", description: `视图 "${view?.name}" 已删除`, variant: "destructive" })
  }

  const toggleDefault = (id: string) => {
    setViews((prev) =>
      prev.map((v) => ({ ...v, isDefault: v.id === id ? !v.isDefault : v.isDefault }))
    )
  }

  const togglePublic = (id: string) => {
    setViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isPublic: !v.isPublic } : v))
    )
  }

  const toggleColumnVisible = (viewId: string, field: string) => {
    setViews((prev) =>
      prev.map((v) => {
        if (v.id !== viewId) return v
        return {
          ...v,
          columns: v.columns.map((c) => (c.field === field ? { ...c, visible: !c.visible } : c)),
        }
      })
    )
  }

  const moveColumn = (viewId: string, fromIdx: number, toIdx: number) => {
    setViews((prev) =>
      prev.map((v) => {
        if (v.id !== viewId) return v
        const cols = [...v.columns]
        const [moved] = cols.splice(fromIdx, 1)
        cols.splice(toIdx, 0, moved)
        return { ...v, columns: cols }
      })
    )
  }

  const addFilter = (viewId: string) => {
    setViews((prev) =>
      prev.map((v) => {
        if (v.id !== viewId) return v
        return { ...v, filters: [...v.filters, { field: "status", operator: "equals", value: "" }] }
      })
    )
  }

  const updateFilter = (viewId: string, idx: number, updates: Partial<ViewFilter>) => {
    setViews((prev) =>
      prev.map((v) => {
        if (v.id !== viewId) return v
        const filters = [...v.filters]
        filters[idx] = { ...filters[idx], ...updates }
        return { ...v, filters }
      })
    )
  }

  const removeFilter = (viewId: string, idx: number) => {
    setViews((prev) =>
      prev.map((v) => {
        if (v.id !== viewId) return v
        return { ...v, filters: v.filters.filter((_, i) => i !== idx) }
      })
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast({ title: "已保存", description: "视图配置已保存" })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-background">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/custom-objects/${objectId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold">视图管理器</h1>
          <p className="text-xs text-muted-foreground">
            自定义对象 / {objectId} / 视图管理器
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          保存
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: View List */}
        <div className="w-64 border-r bg-sidebar flex flex-col">
          <div className="px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-sidebar-foreground flex items-center gap-2">
              <LayoutList className="h-4 w-4" />
              视图列表
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowNewView(true)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="px-2 py-2">
              {views.map((view) => (
                <div
                  key={view.id}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm transition-all group",
                    selectedViewId === view.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                  onClick={() => setSelectedViewId(view.id)}
                >
                  <Star className={cn("h-3.5 w-3.5 shrink-0", view.isDefault ? "fill-amber-400 text-amber-400" : "text-muted-foreground opacity-0 group-hover:opacity-100")} />
                  <span className="flex-1 truncate">{view.name}</span>
                  {view.filters.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 shrink-0">
                      <Filter className="h-2.5 w-2.5 mr-0.5" />
                      {view.filters.length}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedViewId(view.id) }}>
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" /> 编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleDefault(view.id) }}>
                        <Star className="h-3.5 w-3.5 mr-1.5" /> {view.isDefault ? "取消默认" : "设为默认"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePublic(view.id) }}>
                        {view.isPublic ? <EyeOff className="h-3.5 w-3.5 mr-1.5" /> : <Eye className="h-3.5 w-3.5 mr-1.5" />}
                        {view.isPublic ? "设为私有" : "设为公开"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); deleteView(view.id) }} className="text-red-500">
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> 删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {/* New View Input */}
              {showNewView && (
                <div className="flex items-center gap-1 px-2 py-2 mt-1">
                  <Input
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="视图名称"
                    className="h-7 text-xs"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && createView()}
                  />
                  <Button size="sm" className="h-7 text-xs" onClick={createView}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowNewView(false)}>
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Center: View Config */}
        {selectedView && (
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* View Header */}
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{selectedView.name}</h2>
                {selectedView.isDefault && <Badge className="bg-amber-100 text-amber-700 border-amber-200">默认</Badge>}
                {!selectedView.isPublic && <Badge variant="secondary">私有</Badge>}
              </div>

              {/* Columns Config */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Columns className="h-4 w-4" />
                    列配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {selectedView.columns.map((col, idx) => (
                      <div
                        key={col.field}
                        className="flex items-center gap-2 p-2 rounded-md border bg-background hover:border-primary/30 transition-colors"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <span className="text-sm font-medium flex-1">{col.label}</span>
                        <span className="text-xs text-muted-foreground">{col.width}px</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={idx === 0}
                          onClick={() => moveColumn(selectedView.id, idx, idx - 1)}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={idx === selectedView.columns.length - 1}
                          onClick={() => moveColumn(selectedView.id, idx, idx + 1)}
                        >
                          ↓
                        </Button>
                        <Switch
                          checked={col.visible}
                          onCheckedChange={() => toggleColumnVisible(selectedView.id, col.field)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Filters Config */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    筛选条件
                    <Badge variant="secondary" className="ml-auto">{selectedView.filters.length} 个</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedView.filters.map((filter, idx) => {
                      const fieldOpt = MOCK_FILTER_OPTIONS.find((f) => f.field === filter.field)
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <Select
                            value={filter.field}
                            onValueChange={(v) => updateFilter(selectedView.id, idx, { field: v })}
                          >
                            <SelectTrigger className="h-8 w-32 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MOCK_FILTER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.field} value={opt.field}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={filter.operator}
                            onValueChange={(v) => updateFilter(selectedView.id, idx, { operator: v })}
                          >
                            <SelectTrigger className="h-8 w-28 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldOpt?.operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={filter.value}
                            onChange={(e) => updateFilter(selectedView.id, idx, { value: e.target.value })}
                            className="h-8 flex-1 text-xs"
                            placeholder="值"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeFilter(selectedView.id, idx)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button variant="outline" size="sm" className="mt-2 gap-1.5" onClick={() => addFilter(selectedView.id)}>
                      <Plus className="h-3.5 w-3.5" />
                      添加条件
                    </Button>
                    {selectedView.filters.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">暂无筛选条件</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sort & Group Config */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    排序与分组
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium w-20">排序字段</Label>
                    <Select
                      value={selectedView.sortField || ""}
                      onValueChange={(v) =>
                        setViews((prev) => prev.map((vw) => vw.id === selectedView.id ? { ...vw, sortField: v || undefined } : vw))
                      }
                    >
                      <SelectTrigger className="h-8 flex-1 text-xs">
                        <SelectValue placeholder="选择排序字段" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedView.columns.filter((c) => c.sortable).map((c) => (
                          <SelectItem key={c.field} value={c.field}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedView.sortDirection || "asc"}
                      onValueChange={(v) =>
                        setViews((prev) => prev.map((vw) => vw.id === selectedView.id ? { ...vw, sortDirection: v as "asc" | "desc" } : vw))
                      }
                    >
                      <SelectTrigger className="h-8 w-20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">升序</SelectItem>
                        <SelectItem value="desc">降序</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium w-20">分组字段</Label>
                    <Select
                      value={selectedView.groupByField || ""}
                      onValueChange={(v) =>
                        setViews((prev) => prev.map((vw) => vw.id === selectedView.id ? { ...vw, groupByField: v || undefined } : vw))
                      }
                    >
                      <SelectTrigger className="h-8 flex-1 text-xs">
                        <SelectValue placeholder="无分组" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedView.columns.map((c) => (
                          <SelectItem key={c.field} value={c.field}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
