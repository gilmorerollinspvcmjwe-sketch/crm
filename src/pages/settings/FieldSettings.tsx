"use client"

import React from "react"
import { Loader2, Settings2, Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, GripVertical, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  useFieldSettings,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ FieldSettings Page ============

const fieldTypeLabels: Record<string, { label: string; color: string }> = {
  text: { label: "文本", color: "bg-blue-100 text-blue-700" },
  textarea: { label: "多行文本", color: "bg-blue-100 text-blue-700" },
  number: { label: "数字", color: "bg-green-100 text-green-700" },
  date: { label: "日期", color: "bg-purple-100 text-purple-700" },
  datetime: { label: "日期时间", color: "bg-purple-100 text-purple-700" },
  select: { label: "单选", color: "bg-amber-100 text-amber-700" },
  multiselect: { label: "多选", color: "bg-amber-100 text-amber-700" },
  switch: { label: "开关", color: "bg-cyan-100 text-cyan-700" },
  user: { label: "人员", color: "bg-indigo-100 text-indigo-700" },
  department: { label: "部门", color: "bg-indigo-100 text-indigo-700" },
  relation: { label: "关联", color: "bg-pink-100 text-pink-700" },
  file: { label: "附件", color: "bg-gray-100 text-gray-700" },
}

const moduleLabels: Record<string, string> = {
  Customer: "客户管理",
  Contact: "联系人",
  Lead: "线索管理",
  Opportunity: "商机管理",
  Contract: "合同管理",
  Product: "产品库",
  Quote: "报价单",
  Ticket: "工单系统",
}

export function FieldSettingsPage() {
  const { data: fields, isLoading } = useFieldSettings()
  const createField = useCreateField()
  const updateField = useUpdateField()
  const deleteField = useDeleteField()

  const [searchText, setSearchText] = React.useState("")
  const [filterModule, setFilterModule] = React.useState("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingField, setEditingField] = React.useState<any | null>(null)
  const [draggedField, setDraggedField] = React.useState<any | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [fieldToDelete, setFieldToDelete] = React.useState<any | null>(null)

  // 筛选字段
  const filteredFields = React.useMemo(() => {
    if (!fields) return []
    return fields.filter((field) => {
      if (filterModule !== "all" && !field.modules.includes(filterModule)) return false
      if (searchText) {
        const searchLower = searchText.toLowerCase()
        return (
          field.name.toLowerCase().includes(searchLower) ||
          field.label.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [fields, filterModule, searchText])

  const handleToggleEnabled = async (field: any) => {
    try {
      await updateField.mutateAsync({
        id: field.name,
        data: { enabled: !field.enabled },
      })
    } catch (error) {
      console.error("Failed to toggle field:", error)
    }
  }

  const handleDelete = async (field: any) => {
    // 系统字段保护：禁止删除系统字段
    if (field.isSystem) {
      alert("系统字段无法删除")
      return
    }
    try {
      await deleteField.mutateAsync(field.name)
      setDeleteConfirmOpen(false)
      setFieldToDelete(null)
    } catch (error) {
      console.error("Failed to delete field:", error)
    }
  }

  const confirmDelete = (field: any) => {
    if (field.isSystem) {
      alert("系统字段无法删除")
      return
    }
    setFieldToDelete(field)
    setDeleteConfirmOpen(true)
  }

  // 拖拽排序处理
  const handleDragStart = (e: React.DragEvent, field: any) => {
    if (field.isSystem) {
      e.preventDefault()
      return
    }
    setDraggedField(field)
    e.dataTransfer.setData("fieldIndex", filteredFields.indexOf(field).toString())
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetField: any) => {
    e.preventDefault()
    if (!draggedField || draggedField.isSystem || targetField.isSystem) {
      return
    }

    const draggedIndex = filteredFields.indexOf(draggedField)
    const targetIndex = filteredFields.indexOf(targetField)

    if (draggedIndex !== targetIndex) {
      // TODO: 调用 API 更新字段排序
      console.log("Update sort:", draggedField.name, "from", draggedIndex, "to", targetIndex)
      setDraggedField(null)
    }
  }

  const handleEdit = (field: any) => {
    setEditingField(field)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingField(null)
    setDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings2 className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">字段设置</h1>
            <p className="text-muted-foreground">管理自定义字段和表单配置</p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          新建字段
        </Button>
      </div>

      {/* 筛选工具栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索字段名称或标签..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择模块" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模块</SelectItem>
                {Object.entries(moduleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 字段列表 */}
      <Card>
        <CardHeader>
          <CardTitle>字段列表</CardTitle>
          <CardDescription>
            共 {filteredFields.length} 个自定义字段
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>字段名称</TableHead>
                <TableHead>字段标签</TableHead>
                <TableHead>字段类型</TableHead>
                <TableHead>所属模块</TableHead>
                <TableHead className="w-20">必填</TableHead>
                <TableHead className="w-20">列表显示</TableHead>
                <TableHead className="w-20">详情显示</TableHead>
                <TableHead className="w-20">状态</TableHead>
                <TableHead className="w-12">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map((field, index) => (
                <TableRow
                  key={field.name}
                  draggable={!field.isSystem}
                  onDragStart={(e) => handleDragStart(e, field)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, field)}
                  className={cn(
                    field.isSystem && "bg-slate-50",
                    draggedField?.name === field.name && "opacity-50"
                  )}
                >
                  <TableCell>
                    <GripVertical
                      className={cn(
                        "h-4 w-4",
                        field.isSystem
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : "text-muted-foreground cursor-move"
                      )}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {field.name}
                      {field.isSystem && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">
                          系统
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{field.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(fieldTypeLabels[field.type]?.color)}>
                      {fieldTypeLabels[field.type]?.label || field.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {field.modules.map((mod) => (
                        <Badge key={mod} variant="secondary" className="text-xs">
                          {moduleLabels[mod] || mod}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {field.required ? "✓" : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {field.listVisible ? "✓" : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {field.detailVisible ? "✓" : "-"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={field.enabled}
                      onCheckedChange={() => handleToggleEnabled(field)}
                      className="data-[state=checked]:bg-green-500"
                      disabled={field.isSystem}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(field)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        {field.isSystem && (
                          <DropdownMenuItem disabled>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            系统字段不可删除
                          </DropdownMenuItem>
                        )}
                        {!field.isSystem && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => confirmDelete(field)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredFields.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Settings2 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">暂无自定义字段</p>
                      <Button size="sm" onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        创建第一个字段
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 字段类型说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">字段类型说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {Object.entries(fieldTypeLabels).map(([type, { label, color }]) => (
              <div key={type} className="flex items-center gap-2">
                <Badge variant="outline" className={cn(color, "text-xs")}>
                  {label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 新建/编辑字段弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingField ? "编辑字段" : "新建字段"}
            </DialogTitle>
            <DialogDescription>
              {editingField
                ? "修改自定义字段的配置信息"
                : "创建一个新的自定义字段"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fieldName">字段名称 *</Label>
                <Input
                  id="fieldName"
                  placeholder="例如：customer_level"
                  defaultValue={editingField?.name || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldLabel">字段标签 *</Label>
                <Input
                  id="fieldLabel"
                  placeholder="例如：客户等级"
                  defaultValue={editingField?.label || ""}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fieldType">字段类型 *</Label>
                <Select defaultValue={editingField?.type || "text"}>
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fieldTypeLabels).map(([type, { label }]) => (
                      <SelectItem key={type} value={type}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldModule">所属模块 *</Label>
                <Select defaultValue={editingField?.modules?.[0] || "Customer"}>
                  <SelectTrigger id="fieldModule">
                    <SelectValue placeholder="选择模块" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(moduleLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch id="fieldRequired" defaultChecked={editingField?.required} />
                <Label htmlFor="fieldRequired" className="font-normal">必填字段</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="fieldListVisible" defaultChecked={editingField?.listVisible ?? true} />
                <Label htmlFor="fieldListVisible" className="font-normal">列表显示</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="fieldDetailVisible" defaultChecked={editingField?.detailVisible ?? true} />
                <Label htmlFor="fieldDetailVisible" className="font-normal">详情显示</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button>
              {editingField ? "保存更改" : "创建字段"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              确认删除
            </DialogTitle>
            <DialogDescription>
              确定要删除字段 "{fieldToDelete?.label}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(fieldToDelete)}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FieldSettingsPage