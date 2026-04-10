"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  ArrowLeft, Edit, ToggleLeft, ToggleRight, Package, DollarSign, Tag, Calendar, FileText,
  ChevronDown, ChevronUp, MoreHorizontal, Share2, Copy, Download, LayoutDashboard as LayoutDashboardIcon,
  TrendingUp, AlertCircle, CheckCircle, Warehouse, Users, ClipboardList, Activity, Star, Phone, Mail,
  MapPin as MapPinIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "@/forms/ProductForm"
import { InlineEditableField } from "@/components/InlineEditableField"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// DetailLayout components
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"

// import { useProduct, useUpdateProduct, useToggleProductActive } from "@/hooks/api"
import type { Product, ProductCategory } from "@/types/product"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// ============ Category Badge ============

const categoryConfig: Record<ProductCategory, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "软件": { label: "软件", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "硬件": { label: "硬件", className: "bg-orange-100 text-orange-800 border-orange-200", variant: "warning" },
  "服务": { label: "服务", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "解决方案": { label: "解决方案", className: "bg-purple-100 text-purple-800 border-purple-200", variant: "default" },
}

function CategoryBadge({ category }: { category: ProductCategory }) {
  const config = categoryConfig[category]
  return (
    <Badge variant={config.variant} className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

// ============ Active Badge ============

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "secondary"} className={cn("text-xs font-medium", isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200")}>
      {isActive ? "上架" : "下架"}
    </Badge>
  )
}

// ============ Format Currency ============

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount)
}

// ============ Mock Data ============

const mockProduct: Product = {
  id: "P001",
  name: "服务器A1",
  category: "硬件",
  code: "PROD-A1",
  description: "高性能企业级服务器，适用于数据中心和大型企业。支持虚拟化、高可用性集群部署。",
  price: 15000,
  cost: 10000,
  unit: "台",
  stock: 50,
  isActive: true,
  createdAt: "2024-01-15",
  updatedAt: "2024-03-28",
}

// Mock related data
const relatedQuoteItems = [
  { id: '1', quoteName: 'Q-2024-001', customerName: '阿里巴巴', amount: 150000, status: 'pending' },
  { id: '2', quoteName: 'Q-2024-002', customerName: '腾讯科技', amount: 80000, status: 'approved' },
]

const relatedOrders = [
  { id: '1', orderName: 'SO-2024-001', customerName: '阿里巴巴', amount: 150000, status: 'completed' },
]

// ============ Component ============

export function ProductDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [product, setProduct] = React.useState<Product>(mockProduct)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [pricingExpanded, setPricingExpanded] = React.useState(true)
  const [inventoryExpanded, setInventoryExpanded] = React.useState(true)
  const [relatedExpanded, setRelatedExpanded] = React.useState(true)

  // const { data: product, isLoading } = useProduct(id)
  // const updateMutation = useUpdateProduct()
  // const toggleMutation = useToggleProductActive()

  const handleBack = () => {
    navigate("/products")
  }

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Product, value: string | number | boolean) => {
    try {
      // await updateMutation.mutateAsync({ id: product.id, [field]: value })
      setProduct(prev => ({ ...prev, [field]: value }))
      toast({
        title: "已更新",
        duration: 2000,
      })
    } catch (error) {
      console.error("更新失败:", error)
      toast({
        title: "更新失败",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (values: any) => {
    console.log("更新产品:", values)
    setShowEditModal(false)
    setProduct(prev => ({ ...prev, ...values }))
  }

  const handleToggleActive = () => {
    const newActive = !product.isActive
    setProduct(prev => ({ ...prev, isActive: newActive }))
    toast({ title: newActive ? "产品已上架" : "产品已下架" })
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground">产品不存在</p>
        </div>
      </div>
    )
  }

  const profit = product.price - product.cost
  const profitMargin = ((profit / product.price) * 100).toFixed(1)
  const stockValue = product.price * product.stock

  return (
    <div className="animate-in fade-in duration-300">
      {/* Main Layout */}
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel={t("common.back", "返回列表")}
            breadcrumb={<span className="font-semibold">{product.name}</span>}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowEditModal(true)}>
                  <Edit className="h-4 w-4" />
                  编辑
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  分享
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" />导出产品</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><ToggleLeft className="w-4 h-4 mr-2" />下架</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Product Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header with Avatar */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-md">
                    <AvatarFallback className={cn("text-xl font-bold", categoryConfig[product.category]?.className || 'bg-slate-200 text-slate-700')}>
                      {product.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CategoryBadge category={product.category} />
                      <ActiveBadge isActive={product.isActive} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 truncate">{product.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">{product.code}</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">售价</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      ¥{(product.price / 10000).toFixed(1)}万
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Warehouse className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">库存</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {product.stock}
                      <span className="text-xs font-normal text-slate-500 ml-1">{product.unit}</span>
                    </div>
                  </div>

                  {/* Profit Margin */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">利润率</span>
                    </div>
                    <div className="text-xl font-bold text-purple-600">
                      {profitMargin}%
                    </div>
                  </div>

                  {/* Stock Value */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">库存总值</span>
                    </div>
                    <div className="text-xl font-bold text-amber-600">
                      ¥{(stockValue / 10000).toFixed(1)}万
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">基本信息</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{product.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{product.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{product.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">产品描述</h4>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{product.description}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setShowEditModal(true)}>
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleToggleActive}>
                      {product.isActive ? (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">下架</span>
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">上架</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Pricing Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={pricingExpanded} onOpenChange={setPricingExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-slate-900">定价信息</span>
                      </div>
                      {pricingExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs text-slate-500">售价</label>
                          <InlineEditableField
                            value={product.price}
                            type="number"
                            min={0}
                            placeholder="输入价格"
                            onSave={(v) => handleInlineEdit("price", Number(v))}
                            format={(v) => v ? formatCurrency(Number(v)) : "-"}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-slate-500">成本价</label>
                          <InlineEditableField
                            value={product.cost}
                            type="number"
                            min={0}
                            placeholder="输入成本"
                            onSave={(v) => handleInlineEdit("cost", Number(v))}
                            format={(v) => v ? formatCurrency(Number(v)) : "-"}
                          />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">利润</span>
                          <span className="font-semibold text-emerald-600">{formatCurrency(profit)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">利润率</span>
                          <span className="font-semibold text-purple-600">{profitMargin}%</span>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Inventory Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={inventoryExpanded} onOpenChange={setInventoryExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900">库存信息</span>
                      </div>
                      {inventoryExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs text-slate-500">当前库存</label>
                          <InlineEditableField
                            value={product.stock}
                            type="number"
                            min={0}
                            placeholder="输入库存"
                            onSave={(v) => handleInlineEdit("stock", Number(v))}
                            format={(v) => v ? `${v} ${product.unit}` : "-"}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">库存状态</span>
                          <Badge variant="outline" className={cn(
                            "font-medium",
                            product.stock < 20 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-green-100 text-green-800 border-green-200"
                          )}>
                            {product.stock < 20 ? (
                              <><AlertCircle className="w-3 h-3 mr-1" />库存不足</>
                            ) : (
                              <><CheckCircle className="w-3 h-3 mr-1" />库存充足</>
                            )}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>库存预警线</span>
                            <span>20 {product.unit}</span>
                          </div>
                          <Progress 
                            value={Math.min((product.stock / 100) * 100, 100)} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Related Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={relatedExpanded} onOpenChange={setRelatedExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">关联记录</span>
                        <Badge variant="secondary" className="text-xs">
                          {relatedQuoteItems.length + relatedOrders.length}
                        </Badge>
                      </div>
                      {relatedExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <div className="divide-y divide-slate-100">
                        {/* Quotes */}
                        {relatedQuoteItems.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/quotes/${item.id}`)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 mb-1">报价单</p>
                                <p className="font-medium text-sm text-slate-900 truncate">
                                  {item.quoteName}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{item.customerName}</p>
                                <p className="text-xs text-emerald-600 font-medium">
                                  ¥{Number(item.amount).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Orders */}
                        {relatedOrders.slice(0, 2).map((order) => (
                          <div
                            key={order.id}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-emerald-50 rounded-lg">
                                <Package className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 mb-1">订单</p>
                                <p className="font-medium text-sm text-slate-900 truncate">
                                  {order.orderName}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{order.customerName}</p>
                                <p className="text-xs text-emerald-600 font-medium">
                                  ¥{Number(order.amount).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {relatedQuoteItems.length === 0 && relatedOrders.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无关联记录
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Meta Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-900">创建信息</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">创建时间</span>
                  <span>{product.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">更新时间</span>
                  <span>{product.updatedAt}</span>
                </div>
              </CardContent>
            </Card>
          </>
        }
      >
        {/* Main Content Area with Professional Tabs */}
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
                value="details"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <FileText className="w-4 h-4" />
                <span>详情</span>
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <DollarSign className="w-4 h-4" />
                <span>定价</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Product Summary */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">产品摘要</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${categoryConfig[product.category]?.className || 'bg-slate-100'}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">产品分类</p>
                          <p className="font-semibold text-slate-900">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-emerald-100">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">售价</p>
                          <p className="font-semibold text-emerald-600">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-100">
                          <Warehouse className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">库存</p>
                          <p className="font-semibold text-blue-600">{product.stock} {product.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-purple-100">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">利润率</p>
                          <p className="font-semibold text-purple-600">{profitMargin}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">产品描述</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm leading-relaxed text-slate-600">
                      {product.description || "暂无产品描述"}
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">财务概览</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-2">成本价</p>
                        <p className="text-xl font-bold text-slate-900">{formatCurrency(product.cost)}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-xs text-emerald-600 mb-2">利润 (单件)</p>
                        <p className="text-xl font-bold text-emerald-600">{formatCurrency(profit)}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-xs text-amber-600 mb-2">库存总值</p>
                        <p className="text-xl font-bold text-amber-600">{formatCurrency(stockValue)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Basic Info */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">基本信息</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">产品编码</label>
                        <p className="font-medium">{product.code}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">产品分类</label>
                        <CategoryBadge category={product.category} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">单位</label>
                        <p className="font-medium">{product.unit}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">创建日期</label>
                        <p className="font-medium">{product.createdAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">产品描述</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <InlineEditableField
                      value={product.description}
                      type="text"
                      placeholder="请输入产品描述"
                      onSave={(v) => handleInlineEdit("description", v)}
                      inputWidth={500}
                    />
                  </CardContent>
                </Card>

                {/* Status */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">状态信息</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">上架状态</label>
                        <div className="mt-1">
                          <ActiveBadge isActive={product.isActive} />
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleToggleActive}>
                        {product.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-2" />
                            下架产品
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-2" />
                            上架产品
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="flex-1 p-6 m-0 overflow-y-auto">
              <div className="space-y-6">
                {/* Price Settings */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">价格设置</h3>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-500">售价</label>
                        <InlineEditableField
                          value={product.price}
                          type="number"
                          min={0}
                          placeholder="输入价格"
                          onSave={(v) => handleInlineEdit("price", Number(v))}
                          format={(v) => v ? formatCurrency(Number(v)) : "-"}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-500">成本价</label>
                        <InlineEditableField
                          value={product.cost}
                          type="number"
                          min={0}
                          placeholder="输入成本"
                          onSave={(v) => handleInlineEdit("cost", Number(v))}
                          format={(v) => v ? formatCurrency(Number(v)) : "-"}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profit Analysis */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">利润分析</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-500 mb-2">单件利润</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(profit)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-500 mb-2">利润率</p>
                        <p className="text-2xl font-bold text-purple-600">{profitMargin}%</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-500 mb-2">毛利率</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {((profit / product.cost) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Value */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">库存价值</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-xs text-amber-600 mb-2">当前库存</p>
                        <p className="text-2xl font-bold text-amber-600">{product.stock} {product.unit}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-xs text-emerald-600 mb-2">库存总值</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stockValue)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑产品</DialogTitle>
          </DialogHeader>
          <ProductForm
            mode="edit"
            initialValues={product}
            onSubmit={handleEdit}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductDetail
