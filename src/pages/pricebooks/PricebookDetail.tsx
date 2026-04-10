"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  ArrowLeft, Edit, Star, Plus, Trash2, MoreHorizontal, Share2, Copy, Download,
  DollarSign, Calendar, Globe, Clock, FileText, LayoutDashboard as LayoutDashboardIcon,
  History, Package
} from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Modal } from "@/components/modal/Dialog"
import { ConfirmDialog } from "@/components/modal/Dialog"
import { DataTable } from "@/components/DataTable"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"

import { PricebookForm, PricebookEntryForm } from "@/forms"
// import { usePricebook, usePricebookEntries, useUpdatePricebook, useSetDefaultPricebook, useAddPricebookEntry, useDeletePricebookEntry } from "@/hooks/api"
import type { Pricebook, PricebookEntry } from "@/types/pricebook"
import type { DataTableColumnMeta } from "@/components/DataTable"

// ============ Types ============

type PricebookStatus = "活跃" | "归档" | "草稿"

const statusConfig: Record<PricebookStatus, { label: string; className: string }> = {
  "活跃": { label: "活跃", className: "bg-green-100 text-green-800 border-green-200" },
  "归档": { label: "归档", className: "bg-gray-100 text-gray-800 border-gray-200" },
  "草稿": { label: "草稿", className: "bg-blue-100 text-blue-800 border-blue-200" },
}

// ============ Format Currency ============

function formatCurrency(amount: number, currency: string = "CNY"): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// ============ Mock Data ============

const mockPricebook: Pricebook = {
  id: "PB-001",
  name: "2024年标准价格手册",
  code: "PRICE-STD-2024",
  description: "适用于所有客户的2024年度标准价格",
  isDefault: true,
  isActive: true,
  currency: "CNY",
  discountType: "percentage",
  defaultDiscount: 0.95,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  createdAt: "2024-01-01",
  updatedAt: "2024-03-28",
  entries: [
    { id: "PE-001", pricebookId: "PB-001", productId: "P001", productName: "服务器A1", productCode: "PROD-A1", unitPrice: 14250, costPrice: 10000, discount: 0.95, isActive: true, priority: 1 },
    { id: "PE-002", pricebookId: "PB-001", productId: "P002", productName: "交换机B2", productCode: "PROD-B2", unitPrice: 4750, costPrice: 3000, discount: 0.95, isActive: true, priority: 1 },
    { id: "PE-003", pricebookId: "PB-001", productId: "P003", productName: "ERP管理系统", productCode: "PROD-ERP", unitPrice: 76000, costPrice: 20000, discount: 0.95, isActive: true, priority: 2 },
    { id: "PE-004", pricebookId: "PB-001", productId: "P004", productName: "防火墙C3", productCode: "PROD-C3", unitPrice: 28500, costPrice: 15000, discount: 0.9, isActive: true, priority: 1 },
    { id: "PE-005", pricebookId: "PB-001", productId: "P005", productName: "存储阵列D4", productCode: "PROD-D4", unitPrice: 95000, costPrice: 50000, discount: 0.85, isActive: false, priority: 2 },
  ],
}

// Mock history data
const mockHistory = [
  { id: "H-001", action: "创建价格表", operator: "李明", time: "2024-01-01 10:30", details: "创建价格表" },
  { id: "H-002", action: "添加价格条目", operator: "王芳", time: "2024-01-15 14:20", details: "添加 3 个价格条目" },
  { id: "H-003", action: "修改价格", operator: "陈静", time: "2024-02-20 09:15", details: "修改服务器A1单价：¥14,000 → ¥14,250" },
  { id: "H-004", action: "启用价格表", operator: "李明", time: "2024-03-01 11:00", details: "设为默认价格表" },
  { id: "H-005", action: "批量更新", operator: "王芳", time: "2024-03-28 16:45", details: "更新折扣率：0.92 → 0.95" },
]

// ============ Price Entry Columns ============

const entryColumns: ColumnDef<PricebookEntry, string>[] = [
  {
    accessorKey: "productCode",
    header: "产品编码",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "productName",
    header: "产品名称",
    meta: { width: 180, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "unitPrice",
    header: "单价",
    meta: { width: 120, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className="font-medium text-emerald-600">
        {formatCurrency(row.original.unitPrice, row.original.pricebookId ? "CNY" : "CNY")}
      </span>
    ),
  },
  {
    accessorKey: "discount",
    header: "折扣",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number | undefined
      return discount ? `${(discount * 100).toFixed(0)}%` : "-"
    },
  },
  {
    accessorKey: "priority",
    header: "优先级",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "isActive",
    header: "状态",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => (
      <span className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        row.getValue("isActive") ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"
      )}>
        {row.getValue("isActive") ? "启用" : "禁用"}
      </span>
    ),
  },
]

// ============ Component ============

export function PricebookDetail() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const params = useParams()
  const navigate = useNavigate()
  const pricebookId = params.id || ""

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [addEntryModalOpen, setAddEntryModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")

  // const { data: pricebook, isLoading } = usePricebook(pricebookId)
  // const { data: entries } = usePricebookEntries(pricebookId)
  // const updateMutation = useUpdatePricebook()
  // const setDefaultMutation = useSetDefaultPricebook()
  // const addEntryMutation = useAddPricebookEntry()
  // const deleteEntryMutation = useDeletePricebookEntry()

  const pricebook = mockPricebook // Mock for demo

  // Determine status
  const getStatus = (): PricebookStatus => {
    if (!pricebook.isActive) return "归档"
    if (pricebook.isDefault) return "活跃"
    return "活跃"
  }

  const currentStatus = getStatus()

  const handleEdit = async (values: any) => {
    console.log("更新价格手册:", values)
    setEditModalOpen(false)
    toast({
      title: t("pricebook.updateSuccess", "价格表更新成功"),
    })
  }

  const handleSetDefault = () => {
    console.log("设为默认:", pricebook.id)
    toast({
      title: t("pricebook.setDefaultSuccess", "已设为默认价格表"),
    })
  }

  const handleDelete = () => {
    console.log("删除:", pricebook.id)
    setDeleteConfirmOpen(false)
    navigate("/pricebooks")
    toast({
      title: t("pricebook.deleteSuccess", "价格表已删除"),
    })
  }

  const handleAddEntry = async (values: any) => {
    console.log("添加价格条目:", values)
    setAddEntryModalOpen(false)
    toast({
      title: t("pricebook.addEntrySuccess", "价格条目添加成功"),
    })
  }

  const handleDeleteEntry = (entryId: string) => {
    console.log("删除价格条目:", entryId)
    toast({
      title: t("pricebook.deleteEntrySuccess", "价格条目已删除"),
    })
  }

  // Calculate stats
  const totalEntries = pricebook.entries?.length || 0
  const activeEntries = pricebook.entries?.filter(e => e.isActive).length || 0
  const totalValue = pricebook.entries?.reduce((sum, e) => sum + (e.unitPrice || 0), 0) || 0

  if (!pricebook) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/pricebooks")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back", "返回列表")}
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{t("pricebook.detail.notFound", "价格表不存在或已被删除")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={() => navigate("/pricebooks")}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{pricebook.name}</span>}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  {t("common.edit", "编辑")}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  分享
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                  {t("common.delete", "删除")}
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Pricebook Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-slate-900 truncate">{pricebook.name}</h2>
                      {pricebook.isDefault && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{pricebook.code}</p>
                    <div className="mt-2">
                      <StatusBadge status={currentStatus} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Entries */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">价格条目</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-slate-900">{totalEntries}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      启用 {activeEntries} 个
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">价格总额</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-600 truncate">
                      ¥{(totalValue / 10000).toFixed(1)}万
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">币种</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{pricebook.currency}</div>
                  </div>

                  {/* Discount Type */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">折扣类型</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {pricebook.discountType === "percentage" ? "百分比" : "固定金额"}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Validity Period */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">有效期</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">生效日期</span>
                      <span className="ml-auto font-medium text-slate-900">{pricebook.startDate || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">失效日期</span>
                      <span className="ml-auto font-medium text-slate-900">{pricebook.endDate || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {pricebook.description && (
                  <>
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">描述</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{pricebook.description}</p>
                    </div>
                  </>
                )}

                {/* Default Discount */}
                {pricebook.defaultDiscount && (
                  <>
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">默认折扣</h4>
                      <div className="text-lg font-bold text-slate-900">
                        {pricebook.discountType === "percentage" 
                          ? `${(pricebook.defaultDiscount * 100).toFixed(0)}%` 
                          : formatCurrency(pricebook.defaultDiscount, pricebook.currency)}
                      </div>
                    </div>
                  </>
                )}

                {/* Applicable Levels */}
                {pricebook.applicableLevels && pricebook.applicableLevels.length > 0 && (
                  <>
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">适用客户等级</h4>
                      <div className="flex flex-wrap gap-2">
                        {pricebook.applicableLevels.map((level) => (
                          <Badge key={level} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            等级 {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Quick Actions */}
                <div className="h-px bg-slate-200" />
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setEditModalOpen(true)}>
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setAddEntryModalOpen(true)}>
                      <Plus className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">添加条目</span>
                    </Button>
                    {!pricebook.isDefault && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleSetDefault}>
                        <Star className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">设为默认</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <Download className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">导出</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Statistics Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">统计概览</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">价格条目总数</span>
                    <span className="font-semibold text-slate-900">{totalEntries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">启用条目</span>
                    <span className="font-semibold text-green-600">{activeEntries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">禁用条目</span>
                    <span className="font-semibold text-gray-500">{totalEntries - activeEntries}</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">价格总额</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(totalValue, pricebook.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">默认折扣</span>
                    <span className="font-semibold text-slate-900">
                      {pricebook.defaultDiscount 
                        ? pricebook.discountType === "percentage" 
                          ? `${(pricebook.defaultDiscount * 100).toFixed(0)}%` 
                          : formatCurrency(pricebook.defaultDiscount, pricebook.currency)
                        : "-"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">最近操作</h3>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-64">
                  <div className="divide-y divide-slate-100">
                    {mockHistory.slice(0, 5).map((item) => (
                      <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-medium text-sm text-slate-900 truncate">{item.action}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{item.operator}</span>
                          <span>·</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        }
      >
        {/* Main Content Area with Tabs */}
        <div className="h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start bg-white border-b border-slate-200 rounded-none h-auto p-0 gap-1 px-6 py-3">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <LayoutDashboardIcon className="w-4 h-4" />
                <span>概览</span>
              </TabsTrigger>
              <TabsTrigger
                value="entries"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <Package className="w-4 h-4" />
                <span>价格条目</span>
                <Badge variant="secondary" className="ml-1 text-xs">{totalEntries}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <History className="w-4 h-4" />
                <span>历史记录</span>
                <Badge variant="secondary" className="ml-1 text-xs">{mockHistory.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">价格条目</p>
                          <p className="text-xl font-bold text-slate-900">{totalEntries}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">价格总额</p>
                          <p className="text-xl font-bold text-emerald-600">¥{(totalValue / 10000).toFixed(1)}万</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Star className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">启用条目</p>
                          <p className="text-xl font-bold text-green-600">{activeEntries}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Globe className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">币种</p>
                          <p className="text-xl font-bold text-purple-600">{pricebook.currency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Price Entries Preview */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                    <h3 className="font-semibold text-slate-900">价格条目预览</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("entries")}>
                      查看全部
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>产品编码</TableHead>
                          <TableHead>产品名称</TableHead>
                          <TableHead className="text-right">单价</TableHead>
                          <TableHead className="text-right">折扣</TableHead>
                          <TableHead>状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pricebook.entries?.slice(0, 5).map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.productCode}</TableCell>
                            <TableCell>{entry.productName}</TableCell>
                            <TableCell className="text-right font-medium text-emerald-600">
                              {formatCurrency(entry.unitPrice, pricebook.currency)}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.discount ? `${(entry.discount * 100).toFixed(0)}%` : "-"}
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                                entry.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"
                              )}>
                                {entry.isActive ? "启用" : "禁用"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Price Entries Tab */}
            <TabsContent value="entries" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">价格条目列表</h3>
                  <Button size="sm" onClick={() => setAddEntryModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加条目
                  </Button>
                </div>

                <DataTable
                  columns={entryColumns}
                  data={pricebook.entries || []}
                  showSearch
                  searchPlaceholder="搜索产品名称、编码..."
                  searchableFields={["productName", "productCode"]}
                  showPagination
                  pageSizeOptions={[10, 20, 50]}
                  defaultPageSize={10}
                  emptyText="暂无价格条目"
                  className="border rounded-lg"
                />
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">操作历史记录</h3>
                
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {mockHistory.map((item, index) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <History className="w-4 h-4 text-slate-500" />
                              </div>
                              {index < mockHistory.length - 1 && (
                                <div className="w-px h-full min-h-[40px] bg-slate-200 mt-2" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-medium text-slate-900">{item.action}</span>
                                <span className="text-xs text-slate-500 flex-shrink-0">{item.time}</span>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">{item.details}</p>
                              <span className="text-xs text-slate-400">操作人：{item.operator}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={t("pricebook.editTitle", "编辑价格表")}
        width={600}
      >
        <PricebookForm
          mode="edit"
          initialValues={pricebook as any}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("pricebook.deleteTitle", "确认删除")}
        content={t("pricebook.deleteContent", "删除后数据将无法恢复，确定要删除该价格表吗？")}
        okType="danger"
        okText={t("common.delete", "删除")}
        onOk={handleDelete}
      />

      {/* Add Entry Modal */}
      <Modal
        open={addEntryModalOpen}
        onOpenChange={setAddEntryModalOpen}
        title={t("pricebook.addEntryTitle", "添加价格条目")}
        width={600}
      >
        <PricebookEntryForm
          mode="create"
          initialValues={{ pricebookId: pricebook.id }}
          onSubmit={handleAddEntry}
          onCancel={() => setAddEntryModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default PricebookDetail

// Helper component
function StatusBadge({ status }: { status: PricebookStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}
