/**
 * ObjectRelationships - Object Relationship Manager
 * Define and manage relationships between custom objects
 */
"use client"

import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Check,
  X,
  Database,
  ArrowRight,
  Settings,
  Link2,
  ArrowUpRight,
  ArrowDownRight,
  Merge,
  RefreshCw,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// ============ Types ============

type RelationType = "one_to_many" | "many_to_one" | "many_to_many" | "self"
type CascadeDeleteType = "none" | "cascade" | "clear" | "restricted"
type DisplayType = "card" | "list" | "count"

interface ObjectRelation {
  id: string
  name: string
  label: string
  sourceObject: string
  targetObject: string
  relationType: RelationType
  foreignKeyField?: string
  junctionObject?: string
  cascadeDelete: CascadeDeleteType
  displayType: DisplayType
  fields?: { name: string; label: string }[]
  enabled: boolean
}

// ============ Mock Data ============

const AVAILABLE_OBJECTS = [
  { id: "contacts", name: "联系人", pluralName: "联系人" },
  { id: "accounts", name: "客户", pluralName: "客户" },
  { id: "deals", name: "交易", pluralName: "交易" },
  { id: "tasks", name: "任务", pluralName: "任务" },
  { id: "events", name: "事件", pluralName: "事件" },
]

const RELATION_TYPE_LABELS: Record<RelationType, { label: string; icon: React.ReactNode; color: string }> = {
  one_to_many: { label: "一对多", icon: <ArrowDownRight className="h-3.5 w-3.5" />, color: "text-blue-600 bg-blue-50 border-blue-200" },
  many_to_one: { label: "多对一", icon: <ArrowUpRight className="h-3.5 w-3.5" />, color: "text-green-600 bg-green-50 border-green-200" },
  many_to_many: { label: "多对多", icon: <Merge className="h-3.5 w-3.5" />, color: "text-purple-600 bg-purple-50 border-purple-200" },
  self: { label: "自引用", icon: <RefreshCw className="h-3.5 w-3.5" />, color: "text-amber-600 bg-amber-50 border-amber-200" },
}

const CASCADE_LABELS: Record<CascadeDeleteType, string> = {
  none: "无操作",
  cascade: "级联删除",
  clear: "清除关联",
  restricted: "限制删除",
}

const DISPLAY_LABELS: Record<DisplayType, string> = {
  card: "卡片列表",
  list: "简单列表",
  count: "仅计数",
}

// ============ Default Relations ============

const DEFAULT_RELATIONS: ObjectRelation[] = [
  {
    id: "rel_1",
    name: "account_contacts",
    label: "客户联系人",
    sourceObject: "accounts",
    targetObject: "contacts",
    relationType: "one_to_many",
    foreignKeyField: "account_id",
    cascadeDelete: "clear",
    displayType: "card",
    enabled: true,
  },
  {
    id: "rel_2",
    name: "contact_deals",
    label: "联系人交易",
    sourceObject: "contacts",
    targetObject: "deals",
    relationType: "one_to_many",
    foreignKeyField: "contact_id",
    cascadeDelete: "restricted",
    displayType: "list",
    enabled: true,
  },
  {
    id: "rel_3",
    name: "deal_tasks",
    label: "交易任务",
    sourceObject: "deals",
    targetObject: "tasks",
    relationType: "one_to_many",
    foreignKeyField: "deal_id",
    cascadeDelete: "cascade",
    displayType: "card",
    enabled: true,
  },
]

// ============ Main Component ============

export default function ObjectRelationshipsPage() {
  const { objectId } = useParams<{ objectId: string }>()
  const { toast } = useToast()

  const [relations, setRelations] = useState<ObjectRelation[]>(DEFAULT_RELATIONS)
  const [showModal, setShowModal] = useState(false)
  const [editingRelation, setEditingRelation] = useState<ObjectRelation | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState({
    name: "",
    label: "",
    sourceObject: "",
    targetObject: "",
    relationType: "one_to_many" as RelationType,
    foreignKeyField: "",
    junctionObject: "",
    cascadeDelete: "none" as CascadeDeleteType,
    displayType: "card" as DisplayType,
    enabled: true,
  })

  const openCreate = () => {
    setEditingRelation(null)
    setForm({
      name: "",
      label: "",
      sourceObject: objectId || "",
      targetObject: "",
      relationType: "one_to_many",
      foreignKeyField: "",
      junctionObject: "",
      cascadeDelete: "none",
      displayType: "card",
      enabled: true,
    })
    setShowModal(true)
  }

  const openEdit = (rel: ObjectRelation) => {
    setEditingRelation(rel)
    setForm({
      name: rel.name,
      label: rel.label,
      sourceObject: rel.sourceObject,
      targetObject: rel.targetObject,
      relationType: rel.relationType,
      foreignKeyField: rel.foreignKeyField || "",
      junctionObject: rel.junctionObject || "",
      cascadeDelete: rel.cascadeDelete,
      displayType: rel.displayType,
      enabled: rel.enabled,
    })
    setShowModal(true)
  }

  const handleSaveRelation = () => {
    if (!form.name || !form.label || !form.sourceObject || !form.targetObject) {
      toast({ title: "请填写必填字段", variant: "destructive" })
      return
    }

    if (editingRelation) {
      setRelations((prev) =>
        prev.map((r) => (r.id === editingRelation.id ? { ...r, ...form } : r))
      )
      toast({ title: "已更新", description: `关系 "${form.label}" 已更新` })
    } else {
      const newRel: ObjectRelation = {
        id: `rel_${Date.now()}`,
        ...form,
      }
      setRelations((prev) => [...prev, newRel])
      toast({ title: "已创建", description: `关系 "${form.label}" 已创建` })
    }
    setShowModal(false)
  }

  const deleteRelation = (id: string) => {
    const rel = relations.find((r) => r.id === id)
    setRelations((prev) => prev.filter((r) => r.id !== id))
    toast({ title: "已删除", description: `关系 "${rel?.label}" 已删除`, variant: "destructive" })
  }

  const toggleEnabled = (id: string) => {
    setRelations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast({ title: "已保存", description: "对象关系配置已保存" })
  }

  const getObjectName = (id: string) =>
    AVAILABLE_OBJECTS.find((o) => o.id === id)?.name || id

  const currentObjectRelations = relations.filter((r) => r.sourceObject === objectId || r.targetObject === objectId)

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
          <h1 className="text-sm font-semibold">对象关联管理</h1>
          <p className="text-xs text-muted-foreground">
            自定义对象 / {objectId} / 对象关联管理
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          保存
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">对象关系</h2>
                <Badge variant="secondary">{relations.length} 个关系</Badge>
              </div>
              <Button size="sm" className="gap-1.5" onClick={openCreate}>
                <Plus className="h-3.5 w-3.5" />
                新建关系
              </Button>
            </div>

            {/* Relation Cards */}
            <div className="space-y-3">
              {currentObjectRelations.map((rel) => {
                const typeInfo = RELATION_TYPE_LABELS[rel.relationType]
                const needsJunction = rel.relationType === "many_to_many"
                return (
                  <Card key={rel.id} className={cn(!rel.enabled && "opacity-60")}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Type Badge */}
                        <div className={cn("flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium shrink-0 mt-0.5", typeInfo.color)}>
                          {typeInfo.icon}
                          {typeInfo.label}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{rel.label}</span>
                            <Badge variant="outline" className="text-xs">{rel.name}</Badge>
                            {!rel.enabled && <Badge variant="secondary" className="text-xs">已禁用</Badge>}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{getObjectName(rel.sourceObject)}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{getObjectName(rel.targetObject)}</span>
                            {rel.foreignKeyField && (
                              <>
                                <span className="text-muted-foreground/50">·</span>
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">{rel.foreignKeyField}</code>
                              </>
                            )}
                            {needsJunction && rel.junctionObject && (
                              <>
                                <span className="text-muted-foreground/50">·</span>
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">via {rel.junctionObject}</code>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Settings className="h-3 w-3" />
                              删除: {CASCADE_LABELS[rel.cascadeDelete]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              显示: {DISPLAY_LABELS[rel.displayType]}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Switch checked={rel.enabled} onCheckedChange={() => toggleEnabled(rel.id)} />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(rel)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => deleteRelation(rel.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {currentObjectRelations.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <Database className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">暂无关联关系</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={openCreate}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    创建第一个关系
                  </Button>
                </div>
              )}
            </div>

            {/* All Relations Overview */}
            {relations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    所有关系 ({relations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relations.map((rel) => {
                      const typeInfo = RELATION_TYPE_LABELS[rel.relationType]
                      return (
                        <div key={rel.id} className="flex items-center gap-2 text-xs">
                          <span className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded border", typeInfo.color)}>
                            {typeInfo.icon}
                          </span>
                          <span className="font-medium">{rel.label}</span>
                          <span className="text-muted-foreground">
                            {getObjectName(rel.sourceObject)} → {getObjectName(rel.targetObject)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRelation ? "编辑关系" : "新建关系"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">API 名称 <span className="text-red-500">*</span></Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.replace(/\s+/g, "_") }))}
                  placeholder="relationship_name"
                  className="h-8 text-xs"
                  disabled={!!editingRelation}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">显示标签 <span className="text-red-500">*</span></Label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="关系名称"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">源对象 <span className="text-red-500">*</span></Label>
                <Select value={form.sourceObject} onValueChange={(v) => setForm((f) => ({ ...f, sourceObject: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择对象" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_OBJECTS.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>{obj.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">目标对象 <span className="text-red-500">*</span></Label>
                <Select value={form.targetObject} onValueChange={(v) => setForm((f) => ({ ...f, targetObject: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择对象" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_OBJECTS.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>{obj.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">关系类型</Label>
              <Select
                value={form.relationType}
                onValueChange={(v) => setForm((f) => ({ ...f, relationType: v as RelationType }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_to_many">一对多 (One-to-Many)</SelectItem>
                  <SelectItem value="many_to_one">多对一 (Many-to-One)</SelectItem>
                  <SelectItem value="many_to_many">多对多 (Many-to-Many)</SelectItem>
                  <SelectItem value="self">自引用 (Self-Reference)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.relationType !== "many_to_many" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">外键字段名</Label>
                <Input
                  value={form.foreignKeyField}
                  onChange={(e) => setForm((f) => ({ ...f, foreignKeyField: e.target.value }))}
                  placeholder="如: account_id"
                  className="h-8 text-xs"
                />
              </div>
            )}

            {form.relationType === "many_to_many" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">中间对象名</Label>
                <Input
                  value={form.junctionObject}
                  onChange={(e) => setForm((f) => ({ ...f, junctionObject: e.target.value }))}
                  placeholder="如: account_contact"
                  className="h-8 text-xs"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">级联删除</Label>
                <Select
                  value={form.cascadeDelete}
                  onValueChange={(v) => setForm((f) => ({ ...f, cascadeDelete: v as CascadeDeleteType }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CASCADE_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">显示方式</Label>
                <Select
                  value={form.displayType}
                  onValueChange={(v) => setForm((f) => ({ ...f, displayType: v as DisplayType }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DISPLAY_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.enabled} onCheckedChange={(checked) => setForm((f) => ({ ...f, enabled: checked }))} />
              <Label className="text-xs font-medium">启用此关系</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button size="sm" onClick={handleSaveRelation}>
              {editingRelation ? "保存修改" : "创建关系"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
