/**
 * 报价计算器组件
 * Quote Calculator Component - 用于计算和展示报价单的价格明细
 */
import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Calculator, Trash2, Plus, AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

import { QuoteItem, Product, DiscountType } from '@/types/cpq'
import { getProductPrice, PriceResult } from '@/services/pricebookService'

interface QuoteCalculatorProps {
  products?: QuoteItem[]
  items?: QuoteItem[]  // 兼容旧代码
  onChange: (products: QuoteItem[]) => void
  readonly?: boolean
}

/** 计算单个报价项 */
const calculateQuoteItem = (
  item: QuoteItem,
  priceInfo?: PriceResult
): QuoteItem => {
  const unitPrice = priceInfo?.unitPrice || item.unitPrice
  const subtotal = unitPrice * item.quantity
  const discountAmount = subtotal * (item.discount / 100)
  const taxableAmount = subtotal - discountAmount
  const tax = taxableAmount * (item.taxRate / 100)
  const total = taxableAmount + tax

  return {
    ...item,
    unitPrice,
    subtotal: Math.round(subtotal - discountAmount),
    discountAmount: Math.round(discountAmount),
    tax: Math.round(tax),
    total: Math.round(total),
  }
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  products,
  items,
  onChange,
  readonly = false,
}) => {
  const { t } = useTranslation()
  // 兼容 items 和 products props
  const itemsData = items || products || []
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(itemsData)
  const [priceCache, setPriceCache] = useState<Record<string, PriceResult>>({})

  /** 同步外部产品变化 */
  useEffect(() => {
    setQuoteItems(itemsData)
  }, [itemsData])

  /** 加载产品阶梯定价信息 */
  useEffect(() => {
    const loadPrices = async () => {
      const prices: Record<string, PriceResult> = {}
      for (const item of quoteItems) {
        try {
          const priceInfo = await getProductPrice(item.productId, item.quantity)
          if (priceInfo) {
            prices[item.productId] = priceInfo
          }
        } catch {
          // ignore
        }
      }
      setPriceCache(prices)
    }
    loadPrices()
  }, [quoteItems])

  /** 更新产品数量 */
  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) return

      const updated = quoteItems.map((item) => {
        if (item.id === id) {
          // 异步获取新数量对应的价格
          getProductPrice(item.productId, quantity).then((priceInfo) => {
            if (priceInfo) {
              setPriceCache((prev) => ({
                ...prev,
                [item.productId]: priceInfo,
              }))
            }
          })

          return calculateQuoteItem({ ...item, quantity }, priceCache[item.productId])
        }
        return item
      })

      setQuoteItems(updated)
      onChange(updated)
    },
    [quoteItems, onChange, priceCache]
  )

  /** 更新产品折扣 */
  const handleDiscountChange = useCallback(
    (id: string, discount: number) => {
      if (discount < 0 || discount > 100) return

      const updated = quoteItems.map((item) => {
        if (item.id === id) {
          return calculateQuoteItem({ ...item, discount }, priceCache[item.productId])
        }
        return item
      })

      setQuoteItems(updated)
      onChange(updated)
    },
    [quoteItems, onChange, priceCache]
  )

  /** 删除产品 */
  const handleDelete = useCallback(
    (id: string) => {
      const updated = quoteItems.filter((item) => item.id !== id)
      setQuoteItems(updated)
      onChange(updated)
      toast({ title: '产品已删除', variant: 'success' })
    },
    [quoteItems, onChange]
  )

  /** 添加产品（从外部传入） */
  const addProducts = useCallback(
    (newProducts: Product[]) => {
      const newQuoteItems: QuoteItem[] = newProducts.map((p, index) => {
        const baseItem: QuoteItem = {
          id: `QI${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          quoteId: '',
          productId: p.id,
          productName: p.name,
          productSku: p.sku,
          quantity: 1,
          unit: p.unit,
          unitPrice: p.unitPrice,
          discount: 0,
          discountType: DiscountType.PERCENTAGE,
          discountAmount: 0,
          subtotal: 0,
          taxRate: 13,
          tax: 0,
          total: 0,
          sortOrder: quoteItems.length + index,
        }

        // 异步获取价格
        getProductPrice(p.id, 1).then((priceInfo) => {
          if (priceInfo) {
            setPriceCache((prev) => ({
              ...prev,
              [p.id]: priceInfo,
            }))
          }
        })

        return calculateQuoteItem(baseItem)
      })

      const updated = [...quoteItems, ...newQuoteItems]
      setQuoteItems(updated)
      onChange(updated)
      toast({ title: `已添加 ${newProducts.length} 个产品`, variant: 'success' })
    },
    [quoteItems, onChange]
  )

  /** 计算总计 */
  const totals = useMemo(() => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.subtotal, 0)
    const totalDiscount = quoteItems.reduce((sum, item) => sum + item.discountAmount, 0)
    const totalTax = quoteItems.reduce((sum, item) => sum + item.tax, 0)
    const grandTotal = quoteItems.reduce((sum, item) => sum + item.total, 0)

    return {
      subtotal: Math.round(subtotal),
      totalDiscount: Math.round(totalDiscount),
      totalTax: Math.round(totalTax),
      grandTotal: Math.round(grandTotal),
    }
  }, [quoteItems])

  /** 检查是否有阶梯定价 */
  const hasTieredPricing = useMemo(() => {
    return Object.values(priceCache).some((p) => p.hasTieredPricing)
  }, [priceCache])

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            价格明细
          </CardTitle>
          {!readonly && (
            <Badge variant="secondary">
              {quoteItems.length} 项产品
            </Badge>
          )}
        </div>
        {hasTieredPricing && (
          <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>部分产品支持阶梯定价，数量越多单价越低</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px] sticky left-0 bg-muted/50">产品名称</TableHead>
                <TableHead className="w-[120px] text-right">单价</TableHead>
                <TableHead className="w-[100px]">数量</TableHead>
                <TableHead className="w-[100px]">折扣</TableHead>
                <TableHead className="w-[120px] text-right">小计</TableHead>
                <TableHead className="w-[100px] text-right">税费</TableHead>
                <TableHead className="w-[120px] text-right">合计</TableHead>
                {!readonly && <TableHead className="w-[60px] sticky right-0 bg-muted/50">操作</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {quoteItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={readonly ? 7 : 8} className="h-24 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6 opacity-50" />
                      <span>暂无产品，请点击"添加产品"按钮</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                quoteItems.map((item) => {
                  const priceInfo = priceCache[item.productId]
                  const hasDiscount = item.discount > 0 || (priceInfo && priceInfo.unitPrice < priceInfo.basePrice)

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="sticky left-0 bg-card">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.productName}</span>
                          {item.productSku && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {item.productSku}
                            </span>
                          )}
                          {priceInfo?.hasTieredPricing && (
                            <span className="text-xs text-blue-600 mt-1">
                              阶梯定价
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className={cn(hasDiscount && 'text-red-600 font-medium')}>
                            ¥{item.unitPrice.toLocaleString()}
                          </span>
                          {priceInfo && priceInfo.unitPrice < priceInfo.basePrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ¥{priceInfo.basePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {readonly ? (
                          <span className="font-medium">{item.quantity}</span>
                        ) : (
                          <Input
                            type="number"
                            min={1}
                            max={9999}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-[80px] h-8 text-center"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {readonly ? (
                          <span>{item.discount}%</span>
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={item.discount}
                            onChange={(e) =>
                              handleDiscountChange(item.id, parseInt(e.target.value) || 0)
                            }
                            className="w-[80px] h-8 text-center"
                            placeholder="0%"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{item.subtotal.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ¥{item.tax.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ¥{item.total.toLocaleString()}
                      </TableCell>
                      {!readonly && (
                        <TableCell className="sticky right-0 bg-card">
                          <Popover>
                            <PopoverTrigger asChild>
                              <div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-4" align="end">
                              <div className="flex flex-col gap-3">
                                <p className="text-sm">确认删除该产品？</p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    确认删除
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* 总计区域 */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">小计：</span>
            <span className="font-medium">¥{totals.subtotal.toLocaleString()}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">折扣：</span>
            <span className="text-red-600 font-medium">
              -¥{totals.totalDiscount.toLocaleString()}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">税费 (13%)：</span>
            <span className="font-medium">¥{totals.totalTax.toLocaleString()}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold">总计：</span>
            <span className="text-xl font-bold text-primary">
              ¥{totals.grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/** 导出添加产品方法供外部调用 */
export type QuoteCalculatorRef = {
  addProducts: (products: Product[]) => void
}

export default QuoteCalculator