/**
 * 价格表服务
 * Pricebook Service - handles pricing calculations and pricebook operations
 */
import {
  getProductPriceByQuantity,
  getProductList,
  pricebookEntries,
} from '@/mock/cpqData'
import type { Product } from '@/types/cpq'

/** 阶梯定价区间 */
export interface PriceTier {
  minQuantity: number
  maxQuantity?: number
  unitPrice: number
}

/** 价格查询结果 */
export interface PriceResult {
  unitPrice: number
  basePrice: number
  hasTieredPricing: boolean
  tier?: PriceTier
  discountPercent?: number
}

/**
 * 根据产品 ID 和数量获取价格（支持阶梯定价）
 * @param productId 产品 ID
 * @param quantity 数量（用于匹配阶梯价格）
 * @returns 价格结果
 */
export const getProductPrice = (
  productId: string,
  quantity: number = 1
): Promise<PriceResult | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 查找价格表条目
      const entry = pricebookEntries.find((e) => e.productId === productId)

      if (!entry) {
        // fallback 到产品默认价格
        const product = getProductList().find((p) => p.id === productId)
        if (product) {
          resolve({
            unitPrice: product.unitPrice,
            basePrice: product.unitPrice,
            hasTieredPricing: false,
          })
        } else {
          resolve(undefined)
        }
        return
      }

      // 匹配阶梯价格
      const tier = entry.tiers.find(
        (t) => t.minQuantity <= quantity && (!t.maxQuantity || quantity <= t.maxQuantity)
      )

      // 如果没有匹配的阶梯，使用最后一个阶梯（最大数量区间）
      const matchedTier = tier || (entry.tiers.length > 0 ? entry.tiers[entry.tiers.length - 1] : undefined)

      // 计算折扣百分比
      const discountPercent = matchedTier && matchedTier.unitPrice < entry.basePrice
        ? Math.round((1 - matchedTier.unitPrice / entry.basePrice) * 100)
        : 0

      resolve({
        unitPrice: matchedTier?.unitPrice || entry.basePrice,
        basePrice: entry.basePrice,
        hasTieredPricing: entry.tiers.length > 1,
        tier: matchedTier,
        discountPercent,
      })
    }, 200)
  })
}

/**
 * 批量获取多个产品的价格
 * @param productIds 产品 ID 列表
 * @param quantity 每个产品的默认数量
 * @returns 价格映射表
 */
export const getBatchProductPrices = (
  productIds: string[],
  quantity: number = 1
): Promise<Record<string, PriceResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: Record<string, PriceResult> = {}

      productIds.forEach((productId) => {
        const price = getProductPriceByQuantity(productId, quantity)
        const entry = pricebookEntries.find((e) => e.productId === productId)
        const product = getProductList().find((p) => p.id === productId)

        result[productId] = {
          unitPrice: price,
          basePrice: entry?.basePrice || product?.unitPrice || price,
          hasTieredPricing: (entry?.tiers?.length ?? 0) > 1,
          discountPercent: entry && entry.basePrice > price
            ? Math.round((1 - price / entry.basePrice) * 100)
            : 0,
        }
      })

      resolve(result)
    }, 300)
  })
}

/**
 * 获取产品的阶梯定价信息
 * @param productId 产品 ID
 * @returns 阶梯定价列表
 */
export const getProductPriceTiers = (
  productId: string
): Promise<PriceTier[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = pricebookEntries.find((e) => e.productId === productId)
      resolve(entry?.tiers || [])
    }, 100)
  })
}

/**
 * 计算报价项总价
 * @param unitPrice 单价
 * @param quantity 数量
 * @param discountPercent 折扣百分比（0-100）
 * @param taxRate 税率百分比（默认13%）
 * @returns 总价计算结果
 */
export const calculateItemTotal = (
  unitPrice: number,
  quantity: number,
  discountPercent: number = 0,
  taxRate: number = 13
): {
  subtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
} => {
  const subtotal = unitPrice * quantity
  const discountAmount = subtotal * (discountPercent / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (taxRate / 100)
  const total = taxableAmount + taxAmount

  return {
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    taxableAmount: Math.round(taxableAmount),
    taxAmount: Math.round(taxAmount),
    total: Math.round(total),
  }
}

/**
 * 获取所有支持阶梯定价的产品
 * @returns 支持阶梯定价的产品列表
 */
export const getTieredPricingProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tieredProductIds = pricebookEntries
        .filter((e) => e.tiers.length > 1)
        .map((e) => e.productId)

      const products = getProductList().filter((p) =>
        tieredProductIds.includes(p.id)
      )

      resolve(products)
    }, 200)
  })
}

/**
 * 验证价格是否在有效范围内
 * @param productId 产品 ID
 * @param proposedPrice 建议价格
 * @returns 是否有效
 */
export const validatePrice = (
  productId: string,
  proposedPrice: number
): Promise<{ valid: boolean; minPrice?: number; maxPrice?: number; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = pricebookEntries.find((e) => e.productId === productId)

      if (!entry) {
        resolve({ valid: true }) // 没有价格表限制，允许任意价格
        return
      }

      // 计算最低和最高阶梯价格
      const prices = entry.tiers.map((t) => t.unitPrice)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      // 允许价格在最低价格的 80% 到最高价格之间
      const allowedMin = Math.round(minPrice * 0.8)
      const allowedMax = maxPrice

      if (proposedPrice < allowedMin) {
        resolve({
          valid: false,
          minPrice: allowedMin,
          maxPrice: allowedMax,
          message: `价格不能低于 ¥${allowedMin.toLocaleString()}`,
        })
      } else if (proposedPrice > allowedMax) {
        resolve({
          valid: false,
          minPrice: allowedMin,
          maxPrice: allowedMax,
          message: `价格不能高于 ¥${allowedMax.toLocaleString()}`,
        })
      } else {
        resolve({
          valid: true,
          minPrice: allowedMin,
          maxPrice: allowedMax,
        })
      }
    }, 100)
  })
}