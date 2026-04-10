/**
 * 全局搜索 Hook (useGlobalSearch)
 * 支持搜索：客户/联系人/商机/产品/报价/合同等
 * 支持模糊搜索，返回分类结果
 */

import { useQuery } from '@tanstack/react-query'
import { useCustomers } from './useCustomers'
import { useContacts } from './useContacts'
import { useOpportunities } from './useOpportunities'
import { useProducts } from './useProducts'
import { useQuotes } from './useQuotes'
import { useContracts } from './api/useContracts'

export type SearchResultType =
  | 'customer'
  | 'contact'
  | 'opportunity'
  | 'product'
  | 'quote'
  | 'contract'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description?: string
  metadata?: Record<string, string>
  url: string
}

export interface SearchCategory {
  type: SearchResultType
  label: string
  count: number
}

export interface UseGlobalSearchProps {
  query: string
  enabled?: boolean
  debounceMs?: number
}

/**
 * 全局搜索 Hook
 * @param query 搜索关键词
 * @param enabled 是否启用搜索
 * @param debounceMs 防抖时间（毫秒）
 */
export function useGlobalSearch({ query, enabled = true, debounceMs = 300 }: UseGlobalSearchProps) {
  // 并行搜索所有实体
  const customersQuery = useCustomers({
    search: query,
    pageSize: 10,
  })

  const contactsQuery = useContacts({
    search: query,
    pageSize: 10,
  })

  const opportunitiesQuery = useOpportunities({
    search: query,
    pageSize: 10,
  })

  const productsQuery = useProducts({
    search: query,
    pageSize: 10,
  })

  const quotesQuery = useQuotes({
    search: query,
    pageSize: 10,
  })

  const contractsQuery = useContracts({
    search: query,
    pageSize: 10,
  })

  // 合并所有结果
  const results: SearchResult[] = []

  // 客户结果
  if (customersQuery.data?.data) {
    customersQuery.data.data.forEach((customer) => {
      results.push({
        id: customer.id,
        type: 'customer',
        title: customer.name,
        description: `${customer.industry || '未知行业'} · ${customer.type || '未知类型'}`,
        metadata: {
          level: customer.level || '未评级',
          owner: customer.assignee || '未分配',
          status: customer.status,
        },
        url: `/customers/${customer.id}`,
      })
    })
  }

  // 联系人结果
  if (contactsQuery.data?.data) {
    contactsQuery.data.data.forEach((contact) => {
      results.push({
        id: contact.id,
        type: 'contact',
        title: contact.name,
        description: `${contact.customerName || '未知客户'} · ${contact.position}`,
        metadata: {
          phone: contact.phone,
          email: contact.email,
          owner: contact.ownerName || '未分配',
        },
        url: `/contacts/${contact.id}`,
      })
    })
  }

  // 商机结果
  if (opportunitiesQuery.data?.data) {
    opportunitiesQuery.data.data.forEach((opp) => {
      results.push({
        id: opp.id,
        type: 'opportunity',
        title: opp.name,
        description: `预计金额：${opp.amount || '待确定'} · ${opp.stage}`,
        metadata: {
          customer: opp.customerName || '未知客户',
          owner: opp.assignee || '未分配',
          probability: `${opp.probability || 0}%`,
        },
        url: `/opportunities/${opp.id}`,
      })
    })
  }

  // 产品结果
  if (productsQuery.data?.data) {
    productsQuery.data.data.forEach((product) => {
      results.push({
        id: product.id,
        type: 'product',
        title: product.name,
        description: `产品编码：${product.code}`,
        metadata: {
          price: `¥${product.price}`,
          category: product.category,
        },
        url: `/products/${product.id}`,
      })
    })
  }

  // 报价结果
  if (quotesQuery.data?.data) {
    quotesQuery.data.data.forEach((quote) => {
      results.push({
        id: quote.id,
        type: 'quote',
        title: quote.quoteNo || `报价-${quote.id}`,
        description: `总金额：¥${quote.total || 0}`,
        metadata: {
          customer: quote.customerName,
          status: quote.status,
        },
        url: `/quotes/${quote.id}`,
      })
    })
  }

  // 合同结果
  if (contractsQuery.data?.data) {
    contractsQuery.data.data.forEach((contract: any) => {
      results.push({
        id: contract.id,
        type: 'contract',
        title: contract.name || `合同-${contract.id}`,
        description: `合同金额：${contract.amount || '待确定'}`,
        metadata: {
          customer: contract.customerName || '未知客户',
          status: contract.status || '草稿',
        },
        url: `/contracts/${contract.id}`,
      })
    })
  }

  // 计算分类统计
  const categories: SearchCategory[] = [
    { type: 'customer', label: '客户', count: customersQuery.data?.data?.length || 0 },
    { type: 'contact', label: '联系人', count: contactsQuery.data?.data?.length || 0 },
    { type: 'opportunity', label: '商机', count: opportunitiesQuery.data?.data?.length || 0 },
    { type: 'product', label: '产品', count: productsQuery.data?.data?.length || 0 },
    { type: 'quote', label: '报价', count: quotesQuery.data?.data?.length || 0 },
    { type: 'contract', label: '合同', count: contractsQuery.data?.data?.length || 0 },
  ]

  const isLoading =
    customersQuery.isLoading ||
    contactsQuery.isLoading ||
    opportunitiesQuery.isLoading ||
    productsQuery.isLoading ||
    quotesQuery.isLoading ||
    contractsQuery.isLoading

  const isError =
    customersQuery.isError ||
    contactsQuery.isError ||
    opportunitiesQuery.isError ||
    productsQuery.isError ||
    quotesQuery.isError ||
    contractsQuery.isError

  return {
    results,
    categories,
    isLoading,
    isError,
    total: results.length,
  }
}
