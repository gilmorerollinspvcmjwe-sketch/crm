/**
 * 订单模块增强类型定义
 * Enhanced Order Type Definitions
 */

import type { Order as OrderBase, OrderStatus } from './api'
import type { OrderItem } from './orderItem'

/**
 * 增强版订单接口
 */
export interface Order extends Omit<OrderBase, 'items'> {
  /** 订单商品明细 */
  orderItems: OrderItem[]
  /** 收货人姓名 */
  receiverName?: string
  /** 收货人电话 */
  receiverPhone?: string
  /** 收货地址详情 */
  shippingAddressDetail?: string
  /** 物流单号 */
  trackingNumber?: string
  /** 物流公司 */
  logisticsCompany?: string
  /** 订单来源 */
  source?: 'manual' | 'import' | 'api' | 'system'
  /** 支付状态 */
  paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'refunded'
  /** 支付金额 */
  paidAmount?: number
  /** 发票类型 */
  invoiceType?: 'none' | 'electronic' | 'paper'
  /** 发票号码 */
  invoiceNumber?: string
  /** 订单总金额（从 orderItems 计算得出） */
  calculatedTotalAmount?: number
}

/**
 * 订单创建请求
 */
export interface CreateOrderRequest {
  contractId?: string
  customerId: string
  orderItems: Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>[]
  shippingAddress?: string
  shippingAddressDetail?: string
  receiverName?: string
  receiverPhone?: string
  remark?: string
  source?: 'manual' | 'import' | 'api' | 'system'
}

/**
 * 订单更新请求
 */
export interface UpdateOrderRequest {
  id: string
  status?: OrderStatus
  orderItems?: OrderItem[]
  shippingAddress?: string
  shippingAddressDetail?: string
  receiverName?: string
  receiverPhone?: string
  shippingDate?: string
  receivedDate?: string
  trackingNumber?: string
  logisticsCompany?: string
  remark?: string
}

/**
 * 订单状态流转操作请求
 */
export interface OrderStatusTransitionRequest {
  orderId: string
  targetStatus: OrderStatus
  remark?: string
  attachmentUrls?: string[]
}

/**
 * 订单查询参数
 */
export interface OrderListParams {
  page?: number
  pageSize?: number
  status?: OrderStatus
  customerId?: string
  contractId?: string
  search?: string
  assignee?: string
  startDate?: string
  endDate?: string
  paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'refunded'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 订单列表响应
 */
export interface OrderListResponse {
  data: Order[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 订单详情响应
 */
export interface OrderDetailResponse {
  data: Order
}

/**
 * 订单统计信息
 */
export interface OrderStats {
  /** 订单总数 */
  totalOrders: number
  /** 订单总金额 */
  totalAmount: number
  /** 已支付金额 */
  totalPaidAmount: number
  /** 待确认订单数 */
  pendingConfirmCount: number
  /** 已确认订单数 */
  confirmedCount: number
  /** 生产中订单数 */
  producingCount: number
  /** 已发货订单数 */
  shippedCount: number
  /** 已完成订单数 */
  completedCount: number
  /** 已取消订单数 */
  cancelledCount: number
}

/**
 * 订单状态流转历史
 */
export interface OrderStatusHistory {
  id: string
  orderId: string
  fromStatus: OrderStatus
  toStatus: OrderStatus
  operatedBy: string
  operatedByName: string
  operatedAt: string
  remark?: string
  attachmentUrls?: string[]
}
