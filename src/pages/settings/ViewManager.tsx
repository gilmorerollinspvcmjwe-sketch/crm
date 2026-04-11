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
  LayoutGrid,
  GanttChart,
  Table,
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
  viewType?: "list" | "kanban" | "gantt"
}

type ViewDisplayType = "list" | "kanban" | "gantt"

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
  const [displayType, setDisplayType] = useState<ViewDisplayType>("list")

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
      viewType: displayType,
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
          {/* View Type Selector */}
          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <button
                onClick={() => setDisplayType("list")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-colors",
                  displayType === "list" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutList className="h-3.5 w-3.5" />
                列表
              </button>
              <button
                onClick={() => setDisplayType("kanban")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-colors",
                  displayType === "kanban" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                看板
              </button>
              <button
                onClick={() => setDisplayType("gantt")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-colors",
                  displayType === "gantt" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <GanttChart className="h-3.5 w-3.5" />
                甘特
              </button>
            </div>
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
                <Badge variant="outline" className="ml-auto">{displayType === "list" ? "列表视图" : displayType === "kanban" ? "看板视图" : "甘特视图"}</Badge>
              </div>

              {/* View Type Preview */}
              {displayType === "kanban" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4" />
                      看板视图预览
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {/* Mock Kanban Columns */}
                      {["待处理", "进行中", "已完成"].map((stage, idx) => (
                        <div key={stage} className="flex-shrink-0 w-64">
                          <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-sm font-medium">{stage}</span>
                            <Badge variant="secondary" className="text-xs">{idx * 3 + 2}</Badge>
                          </div>
                          <div className="space-y-2 min-h-[200px] rounded-lg bg-muted/50 p-2">
                            {[1, 2].map((item) => (
                              <div key={item} className="p-3 rounded-md border bg-background shadow-sm">
                                <p className="text-sm font-medium truncate">记录 {item + idx * 3}</p>
                                <p className="text-xs text-muted-foreground mt-1">负责人：张三</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">高优先级</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {displayType === "gantt" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GanttChart className="h-4 w-4" />
                      甘特图视图预览
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="min-w-[600px]">
                        {/* Timeline Header */}
                        <div className="flex border-b pb-2 mb-2">
                          <div className="w-40 shrink-0 text-xs font-medium">任务名称</div>
                          {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => (
                            <div key={day} className="flex-1 text-center text-xs text-muted-foreground">{day}</div>
                          ))}
                        </div>
                        {/* Gantt Rows */}
                        {["需求分析", "UI设计", "开发", "测试"].map((task, idx) => (
                          <div key={task} className="flex items-center py-2 border-b border-dashed">
                            <div className="w-40 shrink-0 text-xs">{task}</div>
                            <div className="flex-1 relative h-6 bg-muted/50 rounded">
                              {/* Mock Gantt Bar */}
                              <div
                                className={cn(
                                  "absolute top-1 h-4 rounded",
                                  idx === 0 ? "bg-blue-400" : idx === 1 ? "bg-purple-400" : idx === 2 ? "bg-green-400" : "bg-amber-400"
                                )}
                                style={{
                                  left: `${(idx * 15 + 10)}%`,
                                  width: `${25 + idx * 5}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
