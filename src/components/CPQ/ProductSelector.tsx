/**
 * 产品选择器组件
 * Product Selector Component - 用于在创建报价单时选择产品
 */
import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Package, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'

import { Product, ProductCategory, ProductCategoryLabels } from '@/types/cpq'
import { getProductList } from '@/mock/cpqData'
import { getProductPrice, PriceResult } from '@/services/pricebookService'

interface ProductSelectorProps {
  open: boolean
  onClose: () => void
  onSelected: (products: Product[]) => void
  selectedProducts?: Product[]
  customerId?: string // 客户 ID，用于查询客户专属价格
}

/** 库存状态徽章 */
const StockBadge: React.FC<{ inStock: boolean }> = ({ inStock }) => {
  return inStock ? (
    <Badge variant="outline" className="text-green-600 border-green-600">
      有货
    </Badge>
  ) : (
    <Badge variant="outline" className="text-red-600 border-red-600">
      缺货
    </Badge>
  )
}

/** 类别徽章颜色映射 */
const categoryColorMap: Record<ProductCategory, string> = {
  [ProductCategory.SOFTWARE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ProductCategory.HARDWARE]: 'bg-orange-100 text-orange-700 border-orange-200',
  [ProductCategory.SERVICE]: 'bg-purple-100 text-purple-700 border-purple-200',
  [ProductCategory.TRAINING]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [ProductCategory.MAINTENANCE]: 'bg-green-100 text-green-700 border-green-200',
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  open,
  onClose,
  onSelected,
  selectedProducts = [],
  customerId,
}) => {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [productPrices, setProductPrices] = useState<Record<string, PriceResult>>({})
  const [loading, setLoading] = useState(false)

  /** 加载产品列表和价格 */
  useEffect(() => {
    if (open) {
      setLoading(true)
      const productList = getProductList()
      setProducts(productList)
      setFilteredProducts(productList)

      // 设置已选产品的选中状态
      const ids = new Set(selectedProducts.map((p) => p.id))
      setSelectedIds(ids)

      // 加载产品价格（从价格表）
      const loadPrices = async () => {
        const prices: Record<string, PriceResult> = {}
        for (const product of productList) {
          try {
            const priceInfo = await getProductPrice(product.id, 1)
            if (priceInfo) {
              prices[product.id] = priceInfo
            } else {
              // fallback 到产品默认价格
              prices[product.id] = {
                unitPrice: product.unitPrice,
                basePrice: product.unitPrice,
                hasTieredPricing: false,
              }
            }
          } catch {
            prices[product.id] = {
              unitPrice: product.unitPrice,
              basePrice: product.unitPrice,
              hasTieredPricing: false,
            }
          }
        }
        setProductPrices(prices)
        setLoading(false)
      }
      loadPrices()
    }
  }, [open, selectedProducts, customerId])

  /** 筛选产品 */
  useEffect(() => {
    let filtered = [...products]

    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.sku.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
      )
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }, [searchText, categoryFilter, products])

  /** 切换选中状态 */
  const toggleSelection = useCallback((productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }, [])

  /** 全选/取消全选 */
  const toggleAll = useCallback(() => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }, [selectedIds, filteredProducts])

  /** 处理确认选择 */
  const handleConfirm = () => {
    const selected = products
      .filter((p) => selectedIds.has(p.id))
      .map((p) => {
        // 使用价格表中的价格
        const priceInfo = productPrices[p.id]
        if (priceInfo && priceInfo.unitPrice !== p.unitPrice) {
          return { ...p, unitPrice: priceInfo.unitPrice }
        }
        return p
      })

    onSelected(selected)
    onClose()
    toast({ title: `已选择 ${selected.length} 个产品`, variant: 'success' })
  }

  /** 类别选项 */
  const categoryOptions = [
    { value: 'all', label: '全部类别' },
    { value: ProductCategory.SOFTWARE, label: ProductCategoryLabels[ProductCategory.SOFTWARE] },
    { value: ProductCategory.HARDWARE, label: ProductCategoryLabels[ProductCategory.HARDWARE] },
    { value: ProductCategory.SERVICE, label: ProductCategoryLabels[ProductCategory.SERVICE] },
    { value: ProductCategory.TRAINING, label: ProductCategoryLabels[ProductCategory.TRAINING] },
    { value: ProductCategory.MAINTENANCE, label: ProductCategoryLabels[ProductCategory.MAINTENANCE] },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            选择产品
          </DialogTitle>
          <DialogDescription>
            从产品列表中选择要添加到报价单的产品，支持批量选择和阶梯定价
          </DialogDescription>
        </DialogHeader>

        {/* 搜索和筛选栏 */}
        <div className="flex items-center gap-4 py-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索产品名称、SKU 或描述..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
            {searchText && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchText('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="选择类别" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <span className="text-sm text-muted-foreground">
            已选择 <strong className="text-primary">{selectedIds.size}</strong> 个产品
          </span>
        </div>

        {/* 产品列表表格 */}
        <ScrollArea className="flex-1 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      selectedIds.size === filteredProducts.length && filteredProducts.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="w-[120px]">SKU</TableHead>
                <TableHead className="w-[250px]">产品名称</TableHead>
                <TableHead className="w-[100px]">类别</TableHead>
                <TableHead className="w-[120px] text-right">单价</TableHead>
                <TableHead className="w-[80px]">单位</TableHead>
                <TableHead className="w-[80px]">库存</TableHead>
                <TableHead className="min-w-[200px]">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    暂无匹配的产品
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const priceInfo = productPrices[product.id]
                  const price = priceInfo?.unitPrice || product.unitPrice
                  const basePrice = priceInfo?.basePrice || product.unitPrice
                  const hasDiscount = price < basePrice

                  return (
                    <TableRow
                      key={product.id}
                      data-state={selectedIds.has(product.id) && 'selected'}
                      className={cn(
                        'cursor-pointer',
                        selectedIds.has(product.id) && 'bg-primary/5'
                      )}
                      onClick={() => toggleSelection(product.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelection(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge className={categoryColorMap[product.category]}>
                          {ProductCategoryLabels[product.category]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={cn(
                              'font-medium',
                              hasDiscount && 'text-red-600 font-semibold'
                            )}
                          >
                            ¥{price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                              ¥{basePrice.toLocaleString()}
                            </span>
                          )}
                          {priceInfo?.hasTieredPricing && (
                            <span className="text-xs text-blue-600">阶梯价</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>
                        <StockBadge inStock={product.inStock} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]">
                        {product.description}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* 底部统计 */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-t">
          <span>共 {filteredProducts.length} 个产品</span>
          {selectedIds.size > 0 && (
            <span>
              预估金额：¥
              {products
                .filter((p) => selectedIds.has(p.id))
                .reduce((sum, p) => sum + (productPrices[p.id]?.unitPrice || p.unitPrice), 0)
                .toLocaleString()}
            </span>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
            确认选择
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductSelector