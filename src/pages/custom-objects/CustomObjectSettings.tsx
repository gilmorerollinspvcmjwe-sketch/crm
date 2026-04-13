"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Settings,
  Layout,
  Shield,
  History,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  GripVertical,
  CheckSquare,
  X,
  FileText,
  Link2,
  Workflow,
  TableProperties,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { useToast } from "@/hooks/use-toast"
import { mockCustomObjectDefinitions } from "@/mock/customObjectData"
import type { CustomObject, ObjectProperty } from "@/types/customObject"
import { cn } from "@/lib/utils"

function ToolEntryCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-border/70 bg-card p-4 text-left shadow-[var(--shadow-sm)] transition-colors hover:bg-accent/45"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-muted/50 text-foreground/78">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}

// ============ Field Visibility Config ============

interface FieldVisibilityEditorProps {
  properties: ObjectProperty[]
  onChange: (properties: ObjectProperty[]) => void
}

function FieldVisibilityEditor({ properties, onChange }: FieldVisibilityEditorProps) {
  const toggleField = (fieldId: string, key: keyof Pick<ObjectProperty, "listVisible" | "detailVisible" | "searchable" | "sortable" | "bulkEditable">) => {
    onChange(
      properties.map(p =>
        p.id === fieldId ? { ...p, [key]: !p[key] } : p
      )
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">字段</th>
            <th className="text-center px-3 py-2.5 font-medium w-20">列表</th>
            <th className="text-center px-3 py-2.5 font-medium w-20">详情</th>
            <th className="text-center px-3 py-2.5 font-medium w-20">搜索</th>
            <th className="text-center px-3 py-2.5 font-medium w-20">排序</th>
            <th className="text-center px-3 py-2.5 font-medium w-20">批量</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(prop => (
            <tr key={prop.id} className="border-t">
              <td className="px-4 py-2.5">
                <div>
                  <span className="font-medium text-sm">{prop.label}</span>
                  <p className="text-xs text-muted-foreground font-mono">{prop.name}</p>
                </div>
              </td>
              {(["listVisible", "detailVisible", "searchable", "sortable", "bulkEditable"] as const).map(key => (
                <td key={key} className="text-center px-3 py-2.5">
                  <Checkbox
                    checked={prop[key]}
                    onCheckedChange={() => toggleField(prop.id, key)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============ Layout Config ============

interface LayoutSection {
  id: string
  title: string
  fields: string[]
  collapsed: boolean
}

function LayoutConfig({ properties }: { properties: ObjectProperty[] }) {
  const [sections, setSections] = React.useState<LayoutSection[]>([
    {
      id: "section_1",
      title: "基本信息",
      fields: properties.slice(0, 4).map(p => p.id),
      collapsed: false,
    },
    {
      id: "section_2",
      title: "详细信息",
      fields: properties.slice(4).map(p => p.id),
      collapsed: true,
    },
  ])

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-3">
        将字段分组到不同的表单区块中，提升表单的结构性和可用性。
      </p>
      {sections.map((section, si) => (
        <Card key={section.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <Input
                value={section.title}
                onChange={e => {
                  const updated = [...sections]
                  updated[si].title = e.target.value
                  setSections(updated)
                }}
                className="font-semibold h-8"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const updated = [...sections]
                  updated[si].collapsed = !updated[si].collapsed
                  setSections(updated)
                }}
              >
                {section.collapsed ? <Plus className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {!section.collapsed && (
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {section.fields.map(fieldId => {
                  const prop = properties.find(p => p.id === fieldId)
                  if (!prop) return null
                  return (
                    <Badge key={fieldId} variant="secondary" className="flex items-center gap-1 pr-1">
                      {prop.label}
                      <button
                        onClick={() => {
                          const updated = [...sections]
                          updated[si].fields = updated[si].fields.filter(f => f !== fieldId)
                          setSections(updated)
                        }}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
                <div className="w-full mt-2">
                  <Select onValueChange={fieldId => {
                    const updated = [...sections]
                    if (!updated[si].fields.includes(fieldId)) {
                      updated[si].fields.push(fieldId)
                      setSections(updated)
                    }
                  }}>
                    <SelectTrigger className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> 添加字段
                    </SelectTrigger>
                    <SelectContent>
                      {properties
                        .filter(p => !sections.some(s => s.fields.includes(p.id)))
                        .map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={() => {
        setSections(prev => [...prev, {
          id: `section_${Date.now()}`,
          title: `区块 ${prev.length + 1}`,
          fields: [],
          collapsed: false,
        }])
      }}>
        <Plus className="h-3.5 w-3.5 mr-1" /> 添加区块
      </Button>
    </div>
  )
}

// ============ Audit Log Placeholder ============

function AuditLog() {
  const logs = [
    { time: "2024-06-10 14:30", user: "张明", action: "修改", target: "对象设置", detail: "启用状态变更为 true" },
    { time: "2024-06-08 10:15", user: "李华", action: "添加", target: "字段", detail: "添加字段：负责人 (owner)" },
    { time: "2024-06-05 09:00", user: "张明", action: "创建", target: "对象", detail: "创建自定义对象：项目" },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        记录对象的所有变更历史，便于审计追踪。
      </p>
      <div className="space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border text-sm">
            <History className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{log.action}</Badge>
                <span className="font-medium">{log.target}</span>
                <span className="text-muted-foreground">by {log.user}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{log.detail}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ Permission Placeholder ============

function PermissionSettings() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        配置不同角色对此自定义对象的访问权限。
      </p>
      {[
        { role: "管理员", desc: "完全控制权限" },
        { role: "销售经理", desc: "可读写，无法删除" },
        { role: "普通员工", desc: "只读访问" },
      ].map(item => (
        <div key={item.role} className="flex items-center justify-between p-3 rounded-lg border">
          <div>
            <p className="font-medium text-sm">{item.role}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Button variant="outline" size="sm">配置</Button>
        </div>
      ))}
      <p className="text-xs text-muted-foreground italic pt-2">
        * 权限管理功能开发中，敬请期待
      </p>
    </div>
  )
}

// ============ Main Settings Component ============

export function CustomObjectSettings() {
  const { objectId } = useParams<{ objectId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [objectDef, setObjectDef] = React.useState<CustomObject | null>(null)
  const [properties, setProperties] = React.useState<ObjectProperty[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("info")
  const [form, setForm] = React.useState({
    singularName: "",
    pluralName: "",
    description: "",
    icon: "FolderKanban",
    iconColor: "#3b82f6",
    enabled: true,
    showInNavigation: true,
    isSystem: false,
  })

  React.useEffect(() => {
    if (!objectId) return
    const def = mockCustomObjectDefinitions.find(d => d.id === objectId)
    if (def) {
      setObjectDef(def)
      setProperties(def.fields)
      setForm({
        singularName: def.singularName || "",
        pluralName: def.pluralName || "",
        description: def.description || "",
        icon: def.icon || "FolderKanban",
        iconColor: def.iconColor || "#3b82f6",
        enabled: def.enabled ?? true,
        showInNavigation: def.showInNavigation ?? true,
        isSystem: def.isSystem ?? false,
      })
    }
    setLoading(false)
  }, [objectId])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    toast({ title: "已保存", description: "设置已更新" })
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
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/custom-objects/${objectId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Settings className="h-3.5 w-3.5" />
              Object settings workspace
            </div>
            <h1 className="text-2xl font-bold">{objectDef.singularName} 设置</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              管理对象的基本信息、字段和显示配置
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          保存
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 rounded-2xl bg-muted/45">
          <TabsTrigger value="info" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" /> 对象信息
          </TabsTrigger>
          <TabsTrigger value="fields" className="gap-1.5">
            <CheckSquare className="h-3.5 w-3.5" /> 字段管理
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-1.5">
            <Layout className="h-3.5 w-3.5" /> 布局配置
          </TabsTrigger>
          <TabsTrigger value="permission" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" /> 权限设置
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5">
            <History className="h-3.5 w-3.5" /> 审计日志
          </TabsTrigger>
        </TabsList>

        {/* Object Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>定义对象的基本属性和显示设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="singularName">单数名称</Label>
                  <Input
                    id="singularName"
                    value={form.singularName}
                    onChange={e => setForm(f => ({ ...f, singularName: e.target.value }))}
                    disabled={form.isSystem}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pluralName">复数名称</Label>
                  <Input
                    id="pluralName"
                    value={form.pluralName}
                    onChange={e => setForm(f => ({ ...f, pluralName: e.target.value }))}
                    disabled={form.isSystem}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">对象标识</Label>
                <Input
                  id="name"
                  value={objectDef.name}
                  disabled
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">对象标识创建后不可修改</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>图标颜色</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={form.iconColor}
                      onChange={e => setForm(f => ({ ...f, iconColor: e.target.value }))}
                      className="w-12 h-9 p-1 cursor-pointer"
                    />
                    <Input
                      value={form.iconColor}
                      onChange={e => setForm(f => ({ ...f, iconColor: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm font-medium">显示选项</Label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.enabled}
                      onCheckedChange={c => setForm(f => ({ ...f, enabled: !!c }))}
                    />
                    <span className="text-sm">启用对象</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.showInNavigation}
                      onCheckedChange={c => setForm(f => ({ ...f, showInNavigation: !!c }))}
                    />
                    <span className="text-sm">显示在导航菜单</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-[var(--shadow-sm)] mt-4">
            <CardHeader>
              <CardTitle>对象扩展能力</CardTitle>
              <CardDescription>按文档要求，从这里进入对象属性、表单、页面、关系、阶段与视图配置。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <ToolEntryCard
                  title="自定义属性"
                  description="进入对象构建器，系统字段保持稳定，可新增更多业务属性。"
                  icon={<CheckSquare className="h-4 w-4" />}
                  onClick={() => navigate(`/custom-objects/${objectId}/builder`)}
                />
                <ToolEntryCard
                  title="编辑表单"
                  description="配置对象表单结构和字段展示，让录入流程更符合业务场景。"
                  icon={<FileText className="h-4 w-4" />}
                  onClick={() => navigate(`/custom-objects/${objectId}/form-designer`)}
                />
                <ToolEntryCard
                  title="对象关系"
                  description="设置对象之间的自定义关联，让详情页展示相关对象数据。"
                  icon={<Link2 className="h-4 w-4" />}
                  onClick={() => navigate(`/custom-objects/${objectId}/object-relationships`)}
                />
                <ToolEntryCard
                  title="阶段管理"
                  description="针对交易、订单等需要阶段流转的对象，配置阶段和规则。"
                  icon={<Workflow className="h-4 w-4" />}
                  onClick={() => navigate(`/custom-objects/${objectId}/pipeline-manager`)}
                />
                <ToolEntryCard
                  title="自定义页面"
                  description="配置详情页左中右区域的页面与卡片展示方式。"
                  icon={<Layout className="h-4 w-4" />}
                  onClick={() => navigate(`/custom-objects/${objectId}/page-builder`)}
                />
                <ToolEntryCard
                  title="视图管理"
                  description="保存多个列表、看板或甘特视图，满足不同角色的查看方式。"
                  icon={<TableProperties className="h-4 w-4" />}
                  onClick={() => navigate(`/custom-objects/${objectId}/view-manager`)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 mt-4">
            <CardHeader>
              <CardTitle className="text-base text-red-600">危险区域</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">删除此对象</p>
                  <p className="text-xs text-muted-foreground">
                    删除后所有相关数据将被永久清除，且无法恢复
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled={form.isSystem}>
                  删除对象
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fields Tab */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>字段可见性配置</CardTitle>
              <CardDescription>控制各字段在列表、详情、搜索等功能中的显示行为</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                系统自带属性应保持稳定，新增业务属性请通过“对象扩展能力”里的“自定义属性”进入对象构建器完成。
              </div>
              <FieldVisibilityEditor
                properties={properties}
                onChange={setProperties}
              />
            </CardContent>
          </Card>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              保存更改
            </Button>
          </div>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>表单布局配置</CardTitle>
              <CardDescription>组织字段在新建和编辑表单中的分组和排列方式</CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutConfig properties={properties} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permission Tab */}
        <TabsContent value="permission">
          <Card>
            <CardHeader>
              <CardTitle>权限设置</CardTitle>
              <CardDescription>配置不同角色对对象数据的访问控制</CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionSettings />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>审计日志</CardTitle>
              <CardDescription>记录对象的所有关键变更操作</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLog />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomObjectSettings
