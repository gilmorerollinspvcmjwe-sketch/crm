"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft, Edit, CheckCircle, Truck, CheckCircle2, Package, Calendar,
  User, MapPin, DollarSign, Clock, MoreHorizontal, Share2, Copy,
  ChevronDown, ChevronUp, LayoutDashboard as LayoutDashboardIcon,
  ClipboardList, Truck as TruckIcon
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrderForm } from "@/forms/OrderForm"
import { InlineEditableField } from "@/components/InlineEditableField"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DetailLayout, DetailLayoutHeader } from "@/components/Layout/DetailLayout"
// import { useOrder, useUpdateOrder, useConfirmOrder, useShipOrder, useReceiveOrder } from "@/hooks/api"
import type { Order, OrderStatus } from "@/types/api"

// ============ Status Badge ============

const statusConfig: Record<OrderStatus, { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  "待确认": { label: "待确认", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "已确认": { label: "已确认", className: "bg-green-100 text-green-800 border-green-200", variant: "success" },
  "生产中": { label: "生产中", className: "bg-cyan-100 text-cyan-800 border-cyan-200", variant: "info" },
  "已发货": { label: "已发货", className: "bg-blue-100 text-blue-800 border-blue-200", variant: "info" },
  "已完成": { label: "已完成", className: "bg-emerald-100 text-emerald-800 border-emerald-200", variant: "success" },
  "已取消": { label: "已取消", className: "bg-red-100 text-red-800 border-red-200", variant: "destructive" },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
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

const mockOrder: Order = {
  id: "ORD-001",
  code: "ORDER-2024-001",
  customerId: "C001",
  customerName: "北京科技有限公司",
  contractId: "CT-001",
  contractName: "2024年度服务合同",
  status: "已完成",
  totalAmount: 35000,
  items: [
    { id: "ITEM-001", orderId: "ORD-001", productId: "P001", productName: "服务器A1", productCode: "PROD-A1", quantity: 2, unitPrice: 15000, discount: 0, amount: 30000 },
    { id: "ITEM-002", orderId: "ORD-001", productId: "P002", productName: "交换机B2", productCode: "PROD-B2", quantity: 1, unitPrice: 5000, discount: 0, amount: 5000 },
  ],
  shippingAddress: "北京市朝阳区建国路88号科技大厦15层",
  shippingDate: "2024-02-15",
  receivedDate: "2024-02-20",
  assignee: "李明",
  createdAt: "2024-01-15",
  updatedAt: "2024-02-20",
  remark: "加急订单，优先发货",
}

// Mock logistics data
const mockLogistics = [
  { id: "L-001", status: "已发货", location: "北京仓库", time: "2024-02-15 09:30", remark: "商品已出库" },
  { id: "L-002", status: "运输中", location: "北京中转站", time: "2024-02-15 14:20", remark: "商品运输中" },
  { id: "L-003", status: "派送中", location: "北京朝阳分部", time: "2024-02-20 08:30", remark: "正在派送" },
  { id: "L-004", status: "已签收", location: "北京市朝阳区", time: "2024-02-20 10:15", remark: "客户已签收" },
]

// ============ Component ============

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [order, setOrder] = React.useState<Order>(mockOrder)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [itemsExpanded, setItemsExpanded] = React.useState(true)
  const [logisticsExpanded, setLogisticsExpanded] = React.useState(true)

  // const { data: order, isLoading } = useOrder(id)
  // const updateMutation = useUpdateOrder()
  // const confirmMutation = useConfirmOrder()
  // const shipMutation = useShipOrder()
  // const receiveMutation = useReceiveOrder()

  // Inline edit handler
  const handleInlineEdit = async (field: keyof Order, value: string | number) => {
    try {
      // await updateMutation.mutateAsync({ id, [field]: value })
      setOrder(prev => ({ ...prev, [field]: value }))
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
    console.log("更新订单:", values)
    setShowEditModal(false)
    setOrder(prev => ({ ...prev, ...values }))
  }

  const handleConfirm = () => {
    console.log("确认订单:", order.id)
    setOrder(prev => ({ ...prev, status: "已确认" }))
    toast({ title: "订单已确认" })
  }

  const handleShip = () => {
    console.log("发货:", order.id)
    setOrder(prev => ({ ...prev, status: "已发货", shippingDate: new Date().toISOString().split('T')[0] }))
    toast({ title: "订单已发货" })
  }

  const handleReceive = () => {
    console.log("收货:", order.id)
    setOrder(prev => ({ ...prev, status: "已完成", receivedDate: new Date().toISOString().split('T')[0] }))
    toast({ title: "订单已完成" })
  }

  const handleBack = () => {
    navigate("/orders")
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">订单不存在或已被删除</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalItems = order.items?.length || 0
  const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

  return (
    <div className="animate-in fade-in duration-300">
      <DetailLayout
        header={
          <DetailLayoutHeader
            onBack={handleBack}
            backLabel="返回列表"
            breadcrumb={<span className="font-semibold">{order.code}</span>}
            actions={
              <div className="flex items-center gap-2">
                <StatusBadge status={order.status} />
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  分享
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />复制链接</DropdownMenuItem>
                    <DropdownMenuItem><Truck className="w-4 h-4 mr-2" />打印订单</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">取消订单</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm">
                  删除
                </Button>
              </div>
            }
          />
        }
        leftSidebar={
          <>
            {/* Order Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-slate-900 truncate">{order.code}</h2>
                    </div>
                    <div className="text-sm text-slate-600">{order.customerName}</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Order Amount */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">订单金额</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      ¥{(order.totalAmount / 10000).toFixed(1)}万
                    </div>
                  </div>

                  {/* Total Items */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">商品数量</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {totalQuantity}件
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-3">
                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">收货地址</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-slate-700">{order.shippingAddress || "-"}</span>
                    </div>
                  </div>

                  {/* Shipping Date */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">发货日期</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{order.shippingDate || "-"}</span>
                    </div>
                  </div>

                  {/* Received Date */}
                  {order.receivedDate && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">收货日期</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{order.receivedDate}</span>
                      </div>
                    </div>
                  )}

                  {/* Assignee */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">负责人</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{order.assignee}</span>
                    </div>
                  </div>

                  {/* Related Contract */}
                  {order.contractName && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">关联合同</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{order.contractName}</span>
                      </div>
                    </div>
                  )}

                  {/* Remark */}
                  {order.remark && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">备注</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{order.remark}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">快速操作</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={() => setShowEditModal(true)}>
                      <Edit className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">编辑</span>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2">
                      <User className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">分配</span>
                    </Button>
                    {order.status === "待确认" && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleConfirm}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">确认</span>
                      </Button>
                    )}
                    {order.status === "已确认" && (
                      <Button variant="outline" size="sm" className="justify-start text-xs h-8 px-2" onClick={handleShip}>
                        <Truck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">发货</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        rightSidebar={
          <>
            {/* Order Items Summary */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={itemsExpanded} onOpenChange={setItemsExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900">商品明细</span>
                        <Badge variant="secondary" className="text-xs">{totalItems}</Badge>
                      </div>
                      {itemsExpanded ? (
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
                        {order.items?.slice(0, 5).map((item) => (
                          <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm text-slate-900 truncate flex-1">
                                  {item.productName}
                                </span>
                                <span className="text-sm font-semibold text-emerald-600">
                                  ¥{item.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{item.productCode}</span>
                                <span>×{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items?.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            暂无商品
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    {order.items && order.items.length > 5 && (
                      <div className="p-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("items")}
                          className="w-full justify-center text-slate-600"
                        >
                          查看全部
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Logistics Info */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <Collapsible open={logisticsExpanded} onOpenChange={setLogisticsExpanded}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-900">物流信息</span>
                        <Badge variant="secondary" className="text-xs">{mockLogistics.length}</Badge>
                      </div>
                      {logisticsExpanded ? (
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
                        {mockLogistics.map((log) => (
                          <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm text-slate-900 truncate flex-1">
                                  {log.status}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs flex-shrink-0",
                                    log.status === "已签收" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    log.status === "派送中" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    log.status === "运输中" ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                                    "bg-slate-50 text-slate-700 border-slate-200"
                                  )}
                                >
                                  {log.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin className="w-3 h-3" />
                                <span>{log.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{log.time}</span>
                              </div>
                              {log.remark && (
                                <p className="text-xs text-slate-600">{log.remark}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
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
                value="items"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <Package className="w-4 h-4" />
                <span>商品明细</span>
                <Badge variant="secondary" className="ml-1 text-xs">{totalItems}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="logistics"
                className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-600 data-[state=active]:text-blue-600"
              >
                <TruckIcon className="w-4 h-4" />
                <span>物流信息</span>
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
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">订单总额</p>
                          <p className="text-xl font-bold text-slate-900">¥{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">商品数量</p>
                          <p className="text-xl font-bold text-slate-900">{totalQuantity}件</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">发货日期</p>
                          <p className="text-xl font-bold text-slate-900">{order.shippingDate || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">收货日期</p>
                          <p className="text-xl font-bold text-slate-900">{order.receivedDate || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Basic Info Card */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">基本信息</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">订单编码</label>
                        <p className="font-medium">{order.code}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">客户</label>
                        <p className="font-medium">{order.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">关联合同</label>
                        <p className="font-medium">{order.contractName || "-"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" /> 负责人
                        </label>
                        <p className="font-medium">{order.assignee}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> 收货地址
                        </label>
                        <p className="font-medium">{order.shippingAddress || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Actions */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">状态操作</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      {order.status === "待确认" && (
                        <Button onClick={handleConfirm}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          确认订单
                        </Button>
                      )}
                      {order.status === "已确认" && (
                        <Button onClick={handleShip}>
                          <Truck className="h-4 w-4 mr-2" />
                          发货
                        </Button>
                      )}
                      {order.status === "已发货" && (
                        <Button onClick={handleReceive}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          确认收货
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="flex-1 p-6 m-0 overflow-y-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">订单明细</h3>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>产品编码</TableHead>
                        <TableHead>产品名称</TableHead>
                        <TableHead className="text-right">数量</TableHead>
                        <TableHead className="text-right">单价</TableHead>
                        <TableHead className="text-right">折扣</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productCode}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{item.discount ? `${(item.discount * 100).toFixed(0)}%` : "-"}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={5} className="text-right font-medium">
                          订单总额
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg text-emerald-600">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logistics Tab */}
            <TabsContent value="logistics" className="flex-1 p-6 m-0 overflow-y-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">物流跟踪</h3>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {mockLogistics.map((log, index) => (
                      <div key={log.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            log.status === "已签收" ? "bg-emerald-100" :
                            log.status === "派送中" ? "bg-blue-100" :
                            log.status === "运输中" ? "bg-cyan-100" :
                            "bg-slate-100"
                          )}>
                            {log.status === "已签收" ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : log.status === "派送中" ? (
                              <Truck className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Package className={cn("w-4 h-4", log.status === "已发货" ? "text-slate-600" : "text-cyan-600")} />
                            )}
                          </div>
                          {index < mockLogistics.length - 1 && (
                            <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{log.status}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                log.status === "已签收" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                log.status === "派送中" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                log.status === "运输中" ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                                "bg-slate-50 text-slate-700 border-slate-200"
                              )}
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span>{log.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{log.time}</span>
                          </div>
                          {log.remark && (
                            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded mt-2">{log.remark}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DetailLayout>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>编辑订单</DialogTitle>
          </DialogHeader>
          <OrderForm
            mode="edit"
            initialValues={order}
            onSubmit={handleEdit}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderDetail
