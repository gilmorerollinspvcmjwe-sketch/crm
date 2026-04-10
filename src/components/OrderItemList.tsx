/**
 * 订单商品列表组件
 * Order Item List Component
 * 
 * Features:
 * - Display order items in a table
 * - Add, edit, delete items
 * - Calculate totals automatically
 * - Support inline editing
 */

import React, { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { OrderItem, OrderItemEditable, OrderItemStats } from '@/types/orderItem'
import { calculateItemAmount, calculateOrderItemStats } from '@/types/orderItem'

interface OrderItemListProps {
  /** 订单商品列表 */
  items: OrderItem[]
  /** 是否只读模式 */
  readOnly?: boolean
  /** 添加商品回调 */
  onAdd?: (item: Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>) => void
  /** 编辑商品回调 */
  onEdit?: (item: OrderItem) => void
  /** 删除商品回调 */
  onDelete?: (itemId: string) => void
}

/**
 * 商品编辑对话框属性
 */
interface ItemEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: OrderItemEditable
  onSave: (item: OrderItemEditable) => void
  isEdit: boolean
}

/**
 * 商品编辑对话框组件
 */
function ItemEditDialog({ open, onOpenChange, item, onSave, isEdit }: ItemEditDialogProps) {
  const [formData, setFormData] = useState<OrderItemEditable>(
    item || {
      productId: '',
      productName: '',
      productCode: '',
      specification: '',
      quantity: 1,
      unit: '件',
      unitPrice: 0,
      discount: 0,
      amount: 0,
      remark: '',
    }
  )

  // 自动计算金额
  const calculatedAmount = useMemo(() => {
    return calculateItemAmount(formData)
  }, [formData.quantity, formData.unitPrice, formData.discount])

  React.useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        productId: '',
        productName: '',
        productCode: '',
        specification: '',
        quantity: 1,
        unit: '件',
        unitPrice: 0,
        discount: 0,
        amount: 0,
        remark: '',
      })
    }
  }, [item, open])

  const handleSave = () => {
    onSave({
      ...formData,
      amount: calculatedAmount,
      discountAmount: (formData.quantity || 0) * (formData.unitPrice || 0) * ((formData.discount || 0) / 100),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑商品' : '添加商品'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '修改商品信息' : '添加新的商品到订单'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">商品名称 *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="请输入商品名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCode">商品编码</Label>
              <Input
                id="productCode"
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                placeholder="请输入商品编码"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specification">规格型号</Label>
            <Input
              id="specification"
              value={formData.specification}
              onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
              placeholder="请输入规格型号"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">数量 *</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">单位</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="件"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">单价 *</Label>
              <Input
                id="unitPrice"
                type="number"
                min={0}
                step={0.01}
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">折扣率 (%)</Label>
              <Input
                id="discount"
                type="number"
                min={0}
                max={100}
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>商品金额</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                ¥ {calculatedAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Input
              id="remark"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              placeholder="请输入备注信息"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.productName || !formData.quantity || !formData.unitPrice}
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 订单商品列表组件
 */
export function OrderItemList({ 
  items, 
  readOnly = false,
  onAdd, 
  onEdit, 
  onDelete 
}: OrderItemListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<OrderItemEditable | undefined>()
  const [isEditMode, setIsEditMode] = useState(false)

  // 计算统计信息
  const stats: OrderItemStats = useMemo(() => {
    return calculateOrderItemStats(items)
  }, [items])

  // 打开编辑对话框
  const handleEdit = (item: OrderItem) => {
    setEditingItem(item)
    setIsEditMode(true)
    setEditDialogOpen(true)
  }

  // 打开添加对话框
  const handleAdd = () => {
    setEditingItem(undefined)
    setIsEditMode(false)
    setEditDialogOpen(true)
  }

  // 保存商品
  const handleSave = (itemData: OrderItemEditable) => {
    if (isEditMode && onEdit && editingItem?.id) {
      onEdit({ ...itemData, id: editingItem.id, orderId: editingItem.orderId } as OrderItem)
    } else if (onAdd) {
      onAdd(itemData)
    }
    setEditDialogOpen(false)
  }

  // 删除商品
  const handleDelete = (itemId: string) => {
    if (onDelete) {
      onDelete(itemId)
    }
  }

  // 格式化金额
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(value)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">商品明细</CardTitle>
        {!readOnly && onAdd && (
          <Button size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            添加商品
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无商品，请添加
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>商品名称</TableHead>
                  <TableHead>商品编码</TableHead>
                  <TableHead>规格型号</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead className="text-right">单价</TableHead>
                  <TableHead className="text-right">折扣 (%)</TableHead>
                  <TableHead className="text-right">金额</TableHead>
                  {!readOnly && <TableHead className="text-right">操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.productCode || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{item.specification || '-'}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity} {item.unit || '件'}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.discount ? (
                        <Badge variant="secondary">{item.discount}%</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    {!readOnly && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 统计信息 */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">商品种类:</span>
                <span className="font-medium">{stats.itemCount} 种</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">总数量:</span>
                <span className="font-medium">{stats.totalQuantity} {items[0]?.unit || '件'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">总金额:</span>
                <span className="font-medium">{formatCurrency(stats.totalAmount + stats.totalDiscountAmount)}</span>
              </div>
              {stats.totalDiscountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">折扣金额:</span>
                  <span className="font-medium text-destructive">
                    -{formatCurrency(stats.totalDiscountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>折后总计:</span>
                <span className="text-primary">{formatCurrency(stats.totalAmountAfterDiscount)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* 编辑/添加对话框 */}
      <ItemEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={editingItem}
        onSave={handleSave}
        isEdit={isEditMode}
      />
    </Card>
  )
}

export default OrderItemList
