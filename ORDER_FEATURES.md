# 订单商品明细和状态流转功能实现

## 概述

本次实现完成了订单商品明细管理和订单状态流转操作功能，包含完整的 TypeScript 类型定义和 UI 组件。

## 创建的文件

### 1. 类型定义

#### `src/types/orderItem.ts`
订单商品明细类型定义，包含：

- **OrderItem**: 订单商品项接口
  - 基础字段：id, orderId, productId, productName, productCode
  - 扩展字段：productImage, specification, unit, discount, discountAmount
  - 金额字段：quantity, unitPrice, amount
  - 元数据：remark, createdAt, updatedAt

- **OrderItemEditable**: 可编辑状态的商品项接口
- **AddOrderItemRequest**: 添加商品请求
- **UpdateOrderItemRequest**: 更新商品请求
- **OrderItemStats**: 商品统计信息
  - itemCount: 商品种类数
  - totalQuantity: 总数量
  - totalAmount: 总金额
  - totalDiscountAmount: 总折扣金额
  - totalAmountAfterDiscount: 折后总金额

- **ORDER_STATUS_TRANSITIONS**: 订单状态流转配置
  - 定义每个状态可执行的操作
  - 包含操作标签、描述、确认要求、按钮样式等

- **OrderStatusLabels**: 状态标签映射
- **OrderStatusColors**: 状态颜色配置（用于 Badge 组件）

- **工具函数**:
  - `calculateItemAmount()`: 计算商品项金额
  - `calculateOrderItemStats()`: 计算订单商品统计信息

#### `src/types/order.ts`
增强版订单类型定义，包含：

- **Order**: 增强版订单接口
  - 继承自 api.ts 的 OrderBase
  - 扩展字段：orderItems, receiverName, receiverPhone, shippingAddressDetail
  - 物流字段：trackingNumber, logisticsCompany
  - 财务字段：paymentStatus, paidAmount, invoiceType, invoiceNumber
  - 计算字段：calculatedTotalAmount

- **CreateOrderRequest**: 订单创建请求
- **UpdateOrderRequest**: 订单更新请求
- **OrderStatusTransitionRequest**: 状态流转操作请求
- **OrderListParams**: 订单查询参数
- **OrderListResponse**: 订单列表响应
- **OrderDetailResponse**: 订单详情响应
- **OrderStats**: 订单统计信息
- **OrderStatusHistory**: 订单状态流转历史

### 2. UI 组件

#### `src/components/OrderItemList.tsx`
订单商品列表组件，功能包括：

- **展示功能**:
  - 表格形式展示商品列表
  - 显示商品名称、编码、规格、数量、单价、折扣、金额
  - 自动计算并显示统计信息（种类、数量、总金额、折扣、折后总计）

- **操作功能**:
  - 添加商品（带编辑对话框）
  - 编辑商品（内联编辑对话框）
  - 删除商品（带确认提示）

- **编辑对话框**:
  - 商品名称、编码、规格型号
  - 数量、单位、单价
  - 折扣率（自动计算折扣金额）
  - 实时预览商品金额
  - 表单验证（必填字段）

- **Props**:
  - `items`: OrderItem[] - 商品列表
  - `readOnly`: boolean - 只读模式
  - `onAdd`: (item) => void - 添加回调
  - `onEdit`: (item) => void - 编辑回调
  - `onDelete`: (itemId) => void - 删除回调

- **使用的 shadcn/ui 组件**:
  - Table, Button, Input, Dialog, Badge, Card, Label, Popconfirm

#### `src/components/OrderStatusActions.tsx`
订单状态操作组件，功能包括：

- **状态展示**:
  - 显示当前订单状态（使用 Badge 组件）
  - 根据状态应用不同的颜色样式

- **状态流转**:
  - 根据当前状态动态显示可用操作
  - 支持的操作：
    - 确认订单（待确认 → 已确认）
    - 开始生产（已确认 → 生产中）
    - 确认发货（生产中 → 已发货）
    - 完成订单（已发货 → 已完成）
    - 取消订单（任意状态 → 已取消）

- **操作确认**:
  - 支持需要确认的操作（带对话框）
  - 支持需要备注的操作（必填验证）
  - 支持不同样式的按钮（default, destructive）

- **导出组件**:
  - `OrderStatusActions`: 完整版（带卡片容器）
  - `OrderStatusButtonGroup`: 简化版（仅按钮组）

- **Props**:
  - `currentStatus`: OrderStatus - 当前状态
  - `readOnly`: boolean - 只读模式
  - `onStatusChange`: (newStatus, remark) => void - 状态变更回调
  - `layout`: 'horizontal' | 'vertical' | 'dropdown' - 布局方式

### 3. 类型导出

#### `src/types/index.ts`
更新了类型导出，新增：

```typescript
// Order types
export type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatusTransitionRequest,
  OrderListParams,
  OrderListResponse,
  OrderDetailResponse,
  OrderStats,
  OrderStatusHistory,
} from "./order"

// Order item types
export type {
  OrderItem,
  OrderItemEditable,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
  OrderItemStats,
  OrderStatusTransition,
} from "./orderItem"

// Order item constants and utilities
export {
  ORDER_STATUS_TRANSITIONS,
  OrderStatusLabels,
  OrderStatusColors,
  calculateItemAmount,
  calculateOrderItemStats,
} from "./orderItem"

// Re-export OrderStatus
export type { OrderStatus } from "./api"
```

## 订单状态流转图

```
待确认
  ├─→ 已确认（确认订单）
  └─→ 已取消（取消订单）

已确认
  ├─→ 生产中（开始生产）
  └─→ 已取消（取消订单）

生产中
  ├─→ 已发货（确认发货）
  └─→ 已取消（取消订单）

已发货
  └─→ 已完成（完成订单）

已完成 (终态)
已取消 (终态)
```

## 使用示例

### 订单商品列表

```tsx
import { OrderItemList } from '@/components/OrderItemList'
import type { OrderItem } from '@/types'

function OrderDetailPage({ order }) {
  const handleAddItem = (itemData) => {
    // API call to add item
  }

  const handleEditItem = (item) => {
    // API call to update item
  }

  const handleDeleteItem = (itemId) => {
    // API call to delete item
  }

  return (
    <OrderItemList
      items={order.orderItems}
      onAdd={handleAddItem}
      onEdit={handleEditItem}
      onDelete={handleDeleteItem}
    />
  )
}
```

### 订单状态操作

```tsx
import { OrderStatusActions } from '@/components/OrderStatusActions'
import type { OrderStatus } from '@/types'

function OrderDetailPage({ order }) {
  const handleStatusChange = async (newStatus: OrderStatus, remark?: string) => {
    await api.updateOrderStatus({
      orderId: order.id,
      targetStatus: newStatus,
      remark,
    })
  }

  return (
    <OrderStatusActions
      currentStatus={order.status}
      onStatusChange={handleStatusChange}
    />
  )
}
```

### 组合使用

```tsx
import { OrderItemList } from '@/components/OrderItemList'
import { OrderStatusActions } from '@/components/OrderStatusActions'
import { Card, CardContent } from '@/components/ui/card'

function OrderDetailView({ order }) {
  return (
    <div className="space-y-4">
      <OrderStatusActions
        currentStatus={order.status}
        onStatusChange={handleStatusChange}
      />
      
      <OrderItemList
        items={order.orderItems}
        readOnly={order.status === '已完成' || order.status === '已取消'}
        onAdd={handleAddItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
    </div>
  )
}
```

## 技术特点

1. **完整的 TypeScript 类型**: 所有组件和函数都有完整的类型定义
2. **shadcn/ui 组件**: 使用项目现有的 UI 组件库
3. **自动计算**: 商品金额、订单统计自动计算
4. **状态流转配置化**: 状态流转规则配置在常量中，易于扩展
5. **用户体验**: 
   - 操作确认对话框
   - 必填字段验证
   - 实时金额计算
   - 响应式布局

## 后续扩展建议

1. **商品选择器**: 添加商品时从产品库选择
2. **批量操作**: 支持批量添加、删除商品
3. **状态流转历史**: 记录和展示状态变更历史
4. **权限控制**: 根据用户权限控制可执行的操作
5. **日志记录**: 记录所有操作日志
6. **通知功能**: 状态变更时通知相关人员
