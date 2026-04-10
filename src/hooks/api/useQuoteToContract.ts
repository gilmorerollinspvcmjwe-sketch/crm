/**
 * 报价转合同 Hook
 * Quote to Contract Hook
 */

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Quote, QuoteItem } from '@/types/cpq'
import type { Contract } from '@/types/api'

/**
 * 报价到合同的数据映射接口
 */
export interface QuoteToContractMapping {
  quoteId: string
  contractData: Partial<Contract>
  items: QuoteItem[]
}

/**
 * 报价转合同 Hook 返回值
 */
export interface UseQuoteToContractReturn {
  /** 是否正在转换 */
  isConverting: boolean
  /** 转换错误 */
  error: string | null
  /** 执行转换 */
  convertToContract: (quote: Quote) => Promise<QuoteToContractMapping | null>
  /** 重置状态 */
  reset: () => void
}

/**
 * 报价单项映射到合同项（保持 QuoteItem 结构）
 */
function mapQuoteItemToContractItem(quoteItem: QuoteItem, quoteId: string): QuoteItem {
  return {
    ...quoteItem,
    // 更新 quoteId 关联
    quoteId,
  }
}

/**
 * 报价转合同 Hook
 * 将报价单数据映射并转换为合同草稿
 */
export function useQuoteToContract(): UseQuoteToContractReturn {
  const { toast } = useToast()
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 执行报价到合同的转换
   */
  const convertToContract = useCallback(
    async (quote: Quote): Promise<QuoteToContractMapping | null> => {
      setIsConverting(true)
      setError(null)

      try {
        // 模拟 API 调用延迟
        await new Promise((resolve) => setTimeout(resolve, 800))

        // 数据映射：Quote → Contract
        const contractData: Partial<Contract> = {
          // 基本信息
          name: `合同 - ${quote.quoteNumber}`,
          code: `CONTRACT-${quote.quoteNumber.replace('QT', 'CT')}`,
          customerId: quote.customerId,
          customerName: quote.customerName,
          
          // 金额信息
          amount: quote.total || 0,
          
          // 日期信息
          startDate: quote.validFrom || new Date().toISOString().split('T')[0],
          endDate: quote.validUntil,
          
          // 状态
          status: '草稿',
          
          // 备注
          remark: quote.notes,
        }

        // 映射产品项（保持 QuoteItem 结构用于后续处理）
        const items: QuoteItem[] = (quote.items || []).map((item) =>
          mapQuoteItemToContractItem(item, quote.id)
        )

        // 显示成功提示
        toast({
          title: '转换成功',
          description: `报价单 ${quote.quoteNumber} 已转换为合同草稿`,
        })

        return {
          quoteId: quote.id,
          contractData,
          items,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '转换失败，请稍后重试'
        setError(errorMessage)
        toast({
          title: '转换失败',
          description: errorMessage,
          variant: 'destructive',
        })
        return null
      } finally {
        setIsConverting(false)
      }
    },
    [toast]
  )

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setIsConverting(false)
    setError(null)
  }, [])

  return {
    isConverting,
    error,
    convertToContract,
    reset,
  }
}
