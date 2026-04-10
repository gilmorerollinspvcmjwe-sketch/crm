/**
 * 订单商品明细类型定义
 * Order Item Type Definitions
 */

import { OrderStatus } from './api'

/**
 * 订单商品项接口
 */
export interface OrderItem {
  /** 商品项 ID */
  id: string
  /** 订单 ID */
  orderId: string
  /** 商品 ID */
  productId: string
  /** 商品名称 */
  productName: string
  /** 商品编码 */
  productCode?: string
  /** 商品图片 URL */
  productImage?: string
  /** 商品规格 */
  specification?: string
  /** 数量 */
  quantity: number
  /** 单位 */
  unit?: string
  /** 单价 */
  unitPrice: number
  /** 折扣率 (0-100) */
  discount?: number
  /** 折扣金额 */
  discountAmount?: number
  /** 商品总金额 (quantity * unitPrice - discountAmount) */
  amount: number
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt?: string
}

/**
 * 订单商品项（可编辑状态）
 */
export interface OrderItemEditable extends Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'> {
  id?: string
  orderId?: string
}

/**
 * 添加订单商品请求
 */
export interface AddOrderItemRequest {
  orderId: string
  productId: string
  productName: string
  productCode?: string
  productImage?: string
  specification?: string
  quantity: number
  unit?: string
  unitPrice: number
  discount?: number
  remark?: string
}

/**
 * 更新订单商品请求
 */
export interface UpdateOrderItemRequest {
  id: string
  productId?: string
  productName?: string
  productCode?: string
  productImage?: string
  specification?: string
  quantity?: number
  unit?: string
  unitPrice?: number
  discount?: number
  remark?: string
}

/**
 * 订单商品项统计信息
 */
export interface OrderItemStats {
  /** 商品种类数 */
  itemCount: number
  /** 总数量 */
  totalQuantity: number
  /** 总金额 */
  totalAmount: number
  /** 总折扣金额 */
  totalDiscountAmount: number
  /** 折后总金额 */
  totalAmountAfterDiscount: number
}

/**
 * 订单状态流转配置
 */
export interface OrderStatusTransition {
  /** 目标状态 */
  to: OrderStatus
  /** 操作标签 */
  label: string
  /** 操作描述 */
  description?: string
  /** 是否需要确认 */
  requireConfirmation?: boolean
  /** 确认提示信息 */
  confirmMessage?: string
  /** 是否需要备注 */
  requireRemark?: boolean
  /** 按钮颜色 */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** 按钮图标 */
  icon?: string
}

/**
 * 订单状态流转定义
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatusTransition[]> = {
  '待确认': [
    {
      to: '已确认',
      label: '确认订单',
      description: '确认订单信息无误，开始生产准备',
      requireConfirmation: true,
      confirmMessage: '确认要将此订单标记为"已确认"吗？',
      variant: 'default',
    },
    {
      to: '已取消',
      label: '取消订单',
      description: '取消此订单',
      requireConfirmation: true,
      requireRemark: true,
      confirmMessage: '确认要取消此订单吗？此操作不可恢复。',
      variant: 'destructive',
    },
  ],
  '已确认': [
    {
      to: '生产中',
      label: '开始生产',
      description: '订单已开始生产',
      variant: 'default',
    },
    {
      to: '已取消',
      label: '取消订单',
      description: '取消此订单',
      requireConfirmation: true,
      requireRemark: true,
      confirmMessage: '确认要取消此订单吗？此操作不可恢复。',
      variant: 'destructive',
    },
  ],
  '生产中': [
    {
      to: '已发货',
      label: '确认发货',
      description: '订单已完成生产并发货',
      requireConfirmation: true,
      confirmMessage: '确认要将此订单标记为"已发货"吗？',
      variant: 'default',
    },
    {
      to: '已取消',
      label: '取消订单',
      description: '取消此订单',
      requireConfirmation: true,
      requireRemark: true,
      confirmMessage: '确认要取消此订单吗？此操作不可恢复。',
      variant: 'destructive',
    },
  ],
  '已发货': [
    {
      to: '已完成',
      label: '完成订单',
      description: '客户已收货，订单完成',
      requireConfirmation: true,
      confirmMessage: '确认要将此订单标记为"已完成"吗？',
      variant: 'default',
    },
  ],
  '已完成': [],
  '已取消': [],
}

/**
 * 订单状态标签映射
 */
export const OrderStatusLabels: Record<OrderStatus, string> = {
  '待确认': '待确认',
  '已确认': '已确认',
  '生产中': '生产中',
  '已发货': '已发货',
  '已完成': '已完成',
  '已取消': '已取消',
}

/**
 * 订单状态颜色配置
 */
export const OrderStatusColors: Record<OrderStatus, string> = {
  '待确认': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  '已确认': 'bg-blue-100 text-blue-800 border-blue-200',
  '生产中': 'bg-purple-100 text-purple-800 border-purple-200',
  '已发货': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  '已完成': 'bg-green-100 text-green-800 border-green-200',
  '已取消': 'bg-red-100 text-red-800 border-red-200',
}

/**
 * 计算商品项金额
 */
export function calculateItemAmount(item: Partial<OrderItem>): number {
  const quantity = item.quantity || 0
  const unitPrice = item.unitPrice || 0
  const discount = item.discount || 0
  
  const baseAmount = quantity * unitPrice
  const discountAmount = baseAmount * (discount / 100)
  
  return baseAmount - discountAmount
}

/**
 * 计算订单商品统计信息
 */
export function calculateOrderItemStats(items: OrderItem[]): OrderItemStats {
  const stats: OrderItemStats = {
    itemCount: items.length,
    totalQuantity: 0,
    totalAmount: 0,
    totalDiscountAmount: 0,
    totalAmountAfterDiscount: 0,
  }
  
  for (const item of items) {
    stats.totalQuantity += item.quantity
    stats.totalAmount += item.amount
    stats.totalDiscountAmount += item.discountAmount || 0
    stats.totalAmountAfterDiscount += item.amount
  }
  
  return stats
}
