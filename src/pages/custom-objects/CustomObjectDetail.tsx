"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowLeft,
  Plus,
  Download,
  Upload,
  Settings,
  Trash2,
  Edit,
  MoreHorizontal,
  Eye,
  Filter,
  Columns3,
  Search,
  X,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/DataTable"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { Modal } from "@/components/modal/Dialog"
import { useToast } from "@/hooks/use-toast"
import {
  getCustomObjectById,
  getMockRecords,
} from "@/mock/customObjectData"
import type { CustomObject, CustomObjectDefinition, ObjectProperty, ObjectRecord, PropertyType } from "@/types/customObject"
import { cn } from "@/lib/utils"
import { CustomObjectRecordForm } from "./CustomObjectRecordForm"

// ============ Field Type Renderer ============

function FieldValue({ property, value }: { property: ObjectProperty; value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">-</span>
  }

  switch (property.internalType) {
    case "select":
    case "radio": {
      const opt = property.options?.find(o => o.value === value)
      return (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: opt?.color ? `${opt.color}20` : "#f3f4f6",
            color: opt?.color || "#374151",
          }}
        >
          {opt?.label ?? String(value)}
        </span>
      )
    }
    case "multiselect": {
      const vals = Array.isArray(value) ? value : [value]
      return (
        <div className="flex flex-wrap gap-1">
          {vals.map((v, i) => {
            const opt = property.options?.find(o => o.value === v)
            return (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: opt?.color ? `${opt.color}20` : "#f3f4f6",
                  color: opt?.color || "#374151",
                }}
              >
                {opt?.label ?? String(v)}
              </span>
            )
          })}
        </div>
      )
    }
    case "switch":
      return (
        <Badge variant={value ? "default" : "secondary"} className="text-xs">
          {value ? "是" : "否"}
        </Badge>
      )
    case "currency":
      return (
        <span className="text-sm font-medium">
          ¥{Number(value).toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
        </span>
      )
    case "percent":
      return <span className="text-sm">{Number(value)}%</span>
    case "date":
    case "datetime":
      return <span className="text-sm">{String(value)}</span>
    case "checkbox":
      return (
        <Badge variant={value ? "default" : "secondary"} className="text-xs">
          {value ? "是" : "否"}
        </Badge>
      )
    default:
      return <span className="text-sm">{String(value)}</span>
  }
}

// ============ Status Badge for Records ============

function RecordStatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const configs: Record<string, { label: string; className: string }> = {
    active: { label: "正常", className: "bg-green-100 text-green-800 border-green-200" },
    planning: { label: "筹备中", className: "bg-blue-100 text-blue-800 border-blue-200" },
    in_progress: { label: "进行中", className: "bg-amber-100 text-amber-800 border-amber-200" },
    open: { label: "待处理", className: "bg-blue-100 text-blue-800 border-blue-200" },
    waiting: { label: "等待中", className: "bg-purple-100 text-purple-800 border-purple-200" },
    resolved: { label: "已解决", className: "bg-green-100 text-green-800 border-green-200" },
    closed: { label: "已关闭", className: "bg-gray-100 text-gray-800 border-gray-200" },
    paused: { label: "已暂停", className: "bg-amber-100 text-amber-800 border-amber-200" },
    completed: { label: "已完成", className: "bg-gray-100 text-gray-800 border-gray-200" },
    cancelled: { label: "已取消", className: "bg-red-100 text-red-800 border-red-200" },
    draft: { label: "起草中", className: "bg-gray-100 text-gray-800 border-gray-200" },
    pending: { label: "审批中", className: "bg-amber-100 text-amber-800 border-amber-200" },
    expired: { label: "已到期", className: "bg-red-100 text-red-800 border-red-200" },
    terminated: { label: "已终止", className: "bg-red-100 text-red-800 border-red-200" },
    maintenance: { label: "维修中", className: "bg-amber-100 text-amber-800 border-amber-200" },
    retired: { label: "已报废", className: "bg-gray-100 text-gray-800 border-gray-200" },
    urgent: { label: "紧急", className: "bg-red-100 text-red-800 border-red-200" },
    high: { label: "高", className: "bg-amber-100 text-amber-800 border-amber-200" },
    medium: { label: "中", className: "bg-blue-100 text-blue-800 border-blue-200" },
    low: { label: "低", className: "bg-gray-100 text-gray-800 border-gray-200" },
  }
  const config = configs[status] ?? { label: status, className: "bg-gray-100 text-gray-800 border-gray-200" }
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  )
}

// ============ Record Table ============

interface RecordTableProps {
  objectDef: CustomObject
  properties: ObjectProperty[]
  records: ObjectRecord[]
  onEdit: (record: ObjectRecord) => void
  onDelete: (record: ObjectRecord) => void
}

function RecordTable({ objectDef, properties, records, onEdit, onDelete }: RecordTableProps) {
  const visibleProps = properties.filter(p => p.listVisible && !p.isPrimary)

  const columns: ColumnDef<ObjectRecord>[] = React.useMemo(() => {
    const cols: ColumnDef<ObjectRecord>[] = [
      {
        id: "primary",
        accessorFn: row => row.data[objectDef.name] ?? row.data.name ?? row.data.title ?? row.id,
        header: objectDef.singularName,
        cell: ({ row }) => {
          const val = row.original.data[objectDef.name] ?? row.original.data.name ?? row.original.data.title
          return <span className="font-medium">{String(val ?? "-")}</span>
        },
      },
      ...visibleProps.slice(0, 5).map(prop => ({
        id: prop.name,
        accessorFn: (row: ObjectRecord) => row.data[prop.name],
        header: prop.label,
        cell: ({ row }: { row: { original: ObjectRecord } }) => (
          <FieldValue property={prop} value={row.original.data[prop.name]} />
        ),
      })),
      {
        id: "createdAt",
        accessorFn: row => row.createdAt,
        header: "创建时间",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString("zh-CN")}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: { row: { original: ObjectRecord } }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-4 w-4" /> 编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4" /> 删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ]
    return cols
  }, [objectDef, visibleProps, onEdit, onDelete])

  return (
    <DataTable
      columns={columns}
      data={records}
      showSearch
      searchPlaceholder={`搜索 ${objectDef.singularName}...`}
      showPagination
    />
  )
}

// ============ Main Component ============

export function CustomObjectDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { objectId } = useParams<{ objectId: string }>()

  const [records, setRecords] = React.useState<ObjectRecord[]>([])
  const [objectDef, setObjectDef] = React.useState<CustomObjectDefinition | null>(null)
  const [properties, setProperties] = React.useState<ObjectProperty[]>([])
  const [loading, setLoading] = React.useState(true)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingRecord, setEditingRecord] = React.useState<ObjectRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<ObjectRecord | null>(null)

  React.useEffect(() => {
    if (!objectId) return
    const definition = getCustomObjectById(objectId)
    if (definition) {
      setObjectDef(definition)
      setProperties(definition.fields)
      setRecords(getMockRecords(definition.name))
    }
    setLoading(false)
  }, [objectId])

  const handleNew = () => {
    setEditingRecord(null)
    setFormOpen(true)
  }

  const handleEdit = (record: ObjectRecord) => {
    setEditingRecord(record)
    setFormOpen(true)
  }

  const handleFormSave = (data: Record<string, unknown>) => {
    if (editingRecord) {
      setRecords(prev =>
        prev.map(r =>
          r.id === editingRecord.id
            ? { ...r, data, updatedAt: new Date().toISOString(), updatedBy: "user_001" }
            : r
        )
      )
      toast({ title: "已保存", description: "记录已更新" })
    } else {
      const newRecord: ObjectRecord = {
        id: `rec_${Date.now()}`,
        objectName: objectId || "",
        data,
        createdBy: "user_001",
        createdAt: new Date().toISOString(),
      }
      setRecords(prev => [newRecord, ...prev])
      toast({ title: "已创建", description: "新记录已创建" })
    }
    setFormOpen(false)
    setEditingRecord(null)
  }

  const handleDelete = (record: ObjectRecord) => {
    setDeleteTarget(record)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      setRecords(prev => prev.filter(r => r.id !== deleteTarget.id))
      toast({ title: "已删除", description: "记录已删除", variant: "destructive" })
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
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
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/custom-objects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Custom object workspace
            </div>
            <h1 className="mt-3 text-2xl font-bold">{objectDef.singularName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {objectDef.description || `${objectDef.pluralName} 记录管理`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-3.5 w-3.5 mr-1" /> 导入
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1" /> 导出
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/custom-objects/${objectId}/builder`)}>
            <Edit className="h-3.5 w-3.5 mr-1" /> 编辑对象
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/custom-objects/${objectId}/settings`)}>
            <Settings className="h-3.5 w-3.5 mr-1" /> 设置
          </Button>
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-3.5 w-3.5 mr-1" /> 新建
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="flex items-center gap-4 rounded-[1.25rem] border border-border/70 bg-card p-5 shadow-[var(--shadow-sm)]">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">对象标识</p>
            <p className="font-medium font-mono">{objectDef.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">字段数量</p>
            <p className="font-medium">{properties.length} 个</p>
          </div>
          <div>
            <p className="text-muted-foreground">记录数量</p>
            <p className="font-medium">{records.length} 条</p>
          </div>
          <div>
            <p className="text-muted-foreground">状态</p>
            <Badge variant={objectDef.enabled ? "default" : "secondary"}>
              {objectDef.enabled ? "已启用" : "已禁用"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="rounded-[1.25rem] border border-border/70 bg-card p-4 shadow-[var(--shadow-sm)]">
        <RecordTable
          objectDef={objectDef}
          properties={properties}
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Record Form Modal */}
      {objectDef && properties.length > 0 && (
        <CustomObjectRecordForm
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditingRecord(null) }}
          onSave={handleFormSave}
          objectDef={objectDef}
          properties={properties}
          record={editingRecord}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        title="确认删除"
        content="确定要删除这条记录吗？此操作不可恢复。"
        okType="danger"
      />
    </div>
  )
}

export default CustomObjectDetail
