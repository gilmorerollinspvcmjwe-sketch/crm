/**
 * 线索查重 Hook
 * Provides duplicate check functionality for leads
 */

import { useState, useCallback } from 'react'
import type {
  Lead,
  LeadDuplicateCheckParams,
  DuplicateCheckResult,
  DuplicateCheckItem,
  DuplicateCheckMethod,
} from '@/types/lead'

// ============================================
// 相似度计算工具函数
// ============================================

/**
 * 计算字符串相似度（基于 Levenshtein 距离）
 * @param str1 - 字符串 1
 * @param str2 - 字符串 2
 * @returns 相似度百分比 (0-100)
 */
function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0
  if (str1 === str2) return 100

  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  if (s1 === s2) return 100

  // Levenshtein 距离算法
  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null))

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      )
    }
  }

  const distance = track[s2.length][s1.length]
  const maxLength = Math.max(s1.length, s2.length)
  const similarity = ((maxLength - distance) / maxLength) * 100

  return Math.round(similarity)
}

/**
 * 检查电话是否匹配
 * @param phone1 - 电话 1
 * @param phone2 - 电话 2
 * @returns 是否匹配
 */
function isPhoneMatch(phone1: string, phone2: string): boolean {
  if (!phone1 || !phone2) return false
  // 移除所有非数字字符后比较
  const p1 = phone1.replace(/\D/g, '')
  const p2 = phone2.replace(/\D/g, '')
  return p1 === p2 && p1.length > 0
}

/**
 * 检查邮箱是否匹配
 * @param email1 - 邮箱 1
 * @param email2 - 邮箱 2
 * @returns 是否匹配
 */
function isEmailMatch(email1: string, email2: string): boolean {
  if (!email1 || !email2) return false
  return email1.toLowerCase().trim() === email2.toLowerCase().trim()
}

/**
 * 检查名称是否匹配（模糊匹配）
 * @param name1 - 名称 1
 * @param name2 - 名称 2
 * @param threshold - 相似度阈值（默认 70）
 * @returns 是否匹配
 */
function isNameMatch(name1: string, name2: string, threshold: number = 70): boolean {
  if (!name1 || !name2) return false
  const similarity = calculateSimilarity(name1, name2)
  return similarity >= threshold
}

// ============================================
// Mock 数据
// ============================================

const mockLeads: Lead[] = [
  {
    id: 'LEAD-001',
    name: '张三',
    company: '某某科技公司',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    source: '官网',
    status: '新建',
    score: 80,
    level: '高',
    assignee: 'user-1',
    createdAt: '2024-01-15T10:00:00Z',
    remark: '对产品很感兴趣',
  },
  {
    id: 'LEAD-002',
    name: '李四',
    company: '另一家公司',
    email: 'lisi@another.com',
    phone: '13900139000',
    source: '展会',
    status: '跟进中',
    score: 60,
    level: '中',
    assignee: 'user-2',
    createdAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 'LEAD-003',
    name: '张三丰',
    company: '武当集团',
    email: 'zhangsanfeng@wudang.com',
    phone: '13800138001',
    source: '推荐',
    status: '新建',
    score: 75,
    level: '高',
    assignee: 'user-1',
    createdAt: '2024-01-17T09:15:00Z',
  },
  {
    id: 'LEAD-004',
    name: '张三',
    company: '不同的公司',
    email: 'zhangsan.different@example.com',
    phone: '13800138000',
    source: '广告',
    status: '已转化',
    score: 90,
    level: '高',
    assignee: 'user-3',
    createdAt: '2024-01-10T08:00:00Z',
    convertedAt: '2024-01-20T10:00:00Z',
  },
]

// ============================================
// 查重逻辑
// ============================================

/**
 * 执行查重检查
 * @param params - 查重参数
 * @param allLeads - 所有线索数据
 * @returns 查重结果
 */
function performDuplicateCheck(
  params: LeadDuplicateCheckParams,
  allLeads: Lead[]
): DuplicateCheckResult {
  const duplicates: DuplicateCheckItem[] = []
  const matchStats = {
    phoneMatches: 0,
    emailMatches: 0,
    nameMatches: 0,
  }

  allLeads.forEach((lead) => {
    // 排除自身
    if (params.leadId && lead.id === params.leadId) {
      return
    }

    let matchType: DuplicateCheckMethod | null = null
    let similarity = 0

    // 电话匹配（完全匹配）
    if (params.phone && isPhoneMatch(params.phone, lead.phone)) {
      matchType = 'phone'
      similarity = 100
      matchStats.phoneMatches++
    }
    // 邮箱匹配（完全匹配）
    else if (params.email && isEmailMatch(params.email, lead.email)) {
      matchType = 'email'
      similarity = 100
      matchStats.emailMatches++
    }
    // 名称匹配（模糊匹配）
    else if (params.name && isNameMatch(params.name, lead.name)) {
      matchType = 'name'
      similarity = calculateSimilarity(params.name, lead.name)
      matchStats.nameMatches++
    }

    // 如果有匹配，添加到结果
    if (matchType) {
      duplicates.push({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        email: lead.email,
        status: lead.status,
        assignee: lead.assignee,
        createdAt: lead.createdAt,
        matchType,
        similarity,
      })
    }
  })

  // 按相似度降序排序
  duplicates.sort((a, b) => b.similarity - a.similarity)

  const maxSimilarity = duplicates.length > 0 ? Math.max(...duplicates.map((d) => d.similarity)) : 0

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    maxSimilarity,
    matchStats,
  }
}

// ============================================
// React Hook
// ============================================

interface UseLeadDuplicateCheckReturn {
  /** 查重结果 */
  result: DuplicateCheckResult | null
  /** 是否正在检查 */
  isChecking: boolean
  /** 错误信息 */
  error: Error | null
  /** 执行查重 */
  checkDuplicates: (params: LeadDuplicateCheckParams) => Promise<void>
  /** 重置查重结果 */
  reset: () => void
  /** 模拟 API 调用 */
  checkDuplicatesWithMock: (params: LeadDuplicateCheckParams) => Promise<void>
}

/**
 * 线索查重 Hook
 * 
 * @example
 * ```tsx
 * const { checkDuplicates, result, isChecking } = useLeadDuplicateCheck()
 * 
 * await checkDuplicates({
 *   name: '张三',
 *   phone: '13800138000',
 *   email: 'zhangsan@example.com'
 * })
 * 
 * if (result?.hasDuplicates) {
 *   // 处理重复线索
 * }
 * ```
 */
export function useLeadDuplicateCheck(): UseLeadDuplicateCheckReturn {
  const [result, setResult] = useState<DuplicateCheckResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * 执行查重（实际 API 调用）
   */
  const checkDuplicates = useCallback(async (params: LeadDuplicateCheckParams) => {
    setIsChecking(true)
    setError(null)

    try {
      // TODO: 替换为实际 API 调用
      // const response = await api.post('/leads/duplicate-check', params)
      // setResult(response.data)
      
      // 临时使用 mock 数据
      await checkDuplicatesWithMock(params)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('查重失败'))
      setResult(null)
    } finally {
      setIsChecking(false)
    }
  }, [])

  /**
   * 执行查重（Mock 版本）
   */
  const checkDuplicatesWithMock = useCallback(async (params: LeadDuplicateCheckParams) => {
    setIsChecking(true)
    setError(null)

    try {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      const duplicateResult = performDuplicateCheck(params, mockLeads)
      setResult(duplicateResult)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('查重失败'))
      setResult(null)
    } finally {
      setIsChecking(false)
    }
  }, [])

  /**
   * 重置查重结果
   */
  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setIsChecking(false)
  }, [])

  return {
    result,
    isChecking,
    error,
    checkDuplicates,
    checkDuplicatesWithMock,
    reset,
  }
}

// ============================================
// 导出工具函数
// ============================================

export {
  calculateSimilarity,
  isPhoneMatch,
  isEmailMatch,
  isNameMatch,
  performDuplicateCheck,
}
