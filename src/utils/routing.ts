/**
 * 路由工具函数
 * Routing Utility Functions
 * 
 * 提供路由路径生成、参数解析、导航辅助等功能
 */

import { generatePath, matchPath } from 'react-router-dom'
import {
  CUSTOMER,
  CONTACT,
  LEAD,
  OPPORTUNITY,
  ACTIVITY,
  CONTRACT,
  PAYMENT,
  ORDER,
  QUOTE,
  PRODUCT,
  PRICEBOOK,
  CUSTOM_OBJECTS,
  SETTINGS,
  AI,
  AUTOMATION,
  WORKFLOW_ENGINE,
  RouteParams,
} from '@/constants/routes'

// ============================================
// 路径生成函数
// ============================================

/**
 * 生成客户详情路径
 */
export function getCustomerDetailPath(id: string): string {
  return generatePath(CUSTOMER.DETAIL, { id })
}

/**
 * 生成客户编辑路径
 */
export function getCustomerEditPath(id: string): string {
  return generatePath(CUSTOMER.EDIT, { id })
}

/**
 * 生成联系人详情路径
 */
export function getContactDetailPath(id: string): string {
  return generatePath(CONTACT.DETAIL, { id })
}

/**
 * 生成线索详情路径
 */
export function getLeadDetailPath(id: string): string {
  return generatePath(LEAD.DETAIL, { id })
}

/**
 * 生成商机详情路径
 */
export function getOpportunityDetailPath(id: string): string {
  return generatePath(OPPORTUNITY.DETAIL, { id })
}

/**
 * 生成跟进记录编辑路径
 */
export function getActivityEditPath(id: string): string {
  return generatePath(ACTIVITY.EDIT, { id })
}

/**
 * 生成合同详情路径
 */
export function getContractDetailPath(id: string): string {
  return generatePath(CONTRACT.DETAIL, { id })
}

/**
 * 生成回款详情路径
 */
export function getPaymentDetailPath(id: string): string {
  return generatePath(PAYMENT.DETAIL, { id })
}

/**
 * 生成订单详情路径
 */
export function getOrderDetailPath(id: string): string {
  return generatePath(ORDER.DETAIL, { id })
}

/**
 * 生成报价详情路径
 */
export function getQuoteDetailPath(id: string): string {
  return generatePath(QUOTE.DETAIL, { id })
}

/**
 * 生成报价编辑路径
 */
export function getQuoteEditPath(id: string): string {
  return generatePath(QUOTE.EDIT, { id })
}

/**
 * 生成产品详情路径
 */
export function getProductDetailPath(id: string): string {
  return generatePath(PRODUCT.DETAIL, { id })
}

/**
 * 生成价格表详情路径
 */
export function getPricebookDetailPath(id: string): string {
  return generatePath(PRICEBOOK.DETAIL, { id })
}

/**
 * 生成自定义对象配置路径
 */
export function getCustomObjectConfigPath(objectId: string): string {
  return generatePath(CUSTOM_OBJECTS.DETAIL, { objectId })
}

/**
 * 生成自定义对象编辑路径
 */
export function getCustomObjectEditPath(objectId: string): string {
  return generatePath(CUSTOM_OBJECTS.BUILDER, { objectId })
}

/**
 * 生成工作流编辑路径
 */
export function getWorkflowEditPath(workflowId: string, inSettings = false): string {
  if (inSettings) {
    return generatePath(SETTINGS.WORKFLOW_EDIT, { workflowId })
  }
  return generatePath(WORKFLOW_ENGINE.EDIT, { id: workflowId })
}

/**
 * 生成 AI Agent 详情路径
 */
export function getAgentDetailPath(agentId: string): string {
  return generatePath(AI.AGENT_DETAIL, { agentId })
}

// ============================================
// 路径解析函数
// ============================================

/**
 * 从路径中提取 ID 参数
 */
export function extractIdFromPath(path: string, pattern: string): string | null {
  const match = matchPath(pattern, path)
  return match?.params?.id ?? null
}

/**
 * 从路径中提取 objectId 参数
 */
export function extractObjectIdFromPath(path: string, pattern: string): string | null {
  const match = matchPath(pattern, path)
  return match?.params?.objectId ?? null
}

/**
 * 从路径中提取 workflowId 参数
 */
export function extractWorkflowIdFromPath(path: string, pattern: string): string | null {
  const match = matchPath(pattern, path)
  return match?.params?.workflowId ?? null
}

/**
 * 解析当前路径的所有参数
 */
export function parseRouteParams(path: string, patterns: string[]): RouteParams {
  for (const pattern of patterns) {
    const match = matchPath(pattern, path)
    if (match?.params) {
      return match.params as RouteParams
    }
  }
  return {}
}

// ============================================
// 导航辅助函数
// ============================================

/**
 * 判断路径是否匹配指定模式
 */
export function isPathMatch(path: string, pattern: string): boolean {
  return matchPath(pattern, path) !== null
}

/**
 * 判断是否在客户相关页面
 */
export function isCustomerRelatedPath(path: string): boolean {
  return path.startsWith('/customer') || path.startsWith('/contact')
}

/**
 * 判断是否在销售相关页面
 */
export function isSalesRelatedPath(path: string): boolean {
  return path.startsWith('/lead') || 
         path.startsWith('/opportunity') || 
         path.startsWith('/activity')
}

/**
 * 判断是否在订单相关页面
 */
export function isOrderRelatedPath(path: string): boolean {
  return path.startsWith('/order') || 
         path.startsWith('/quote') || 
         path.startsWith('/contract') || 
         path.startsWith('/payment')
}

/**
 * 判断是否在产品相关页面
 */
export function isProductRelatedPath(path: string): boolean {
  return path.startsWith('/products') || path.startsWith('/pricebooks')
}

/**
 * 判断是否在报表页面
 */
export function isReportPath(path: string): boolean {
  return path.startsWith('/report')
}

/**
 * 判断是否在 AI 功能页面
 */
export function isAIPath(path: string): boolean {
  return path.startsWith('/ai')
}

/**
 * 判断是否在营销模块页面
 */
export function isMarketingPath(path: string): boolean {
  return path.startsWith('/marketing')
}

/**
 * 判断是否在自动化模块页面
 */
export function isAutomationPath(path: string): boolean {
  return path.startsWith('/automation')
}

/**
 * 判断是否在设置页面
 */
export function isSettingsPath(path: string): boolean {
  return path.startsWith('/settings')
}

/**
 * 判断是否在集成模块页面
 */
export function isIntegrationPath(path: string): boolean {
  return path.startsWith('/integration')
}

// ============================================
// 面包屑辅助函数
// ============================================

/**
 * 根据路径获取面包屑名称
 */
export function getBreadcrumbName(path: string, names: Record<string, string>): string {
  return names[path] ?? path.split('/').pop() ?? ''
}

/**
 * 生成面包屑路径数组
 */
export function generateBreadcrumbPaths(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((_, index) => 
    '/' + segments.slice(0, index + 1).join('/')
  )
}

// ============================================
// 权限检查辅助函数
// ============================================

/**
 * 获取路径对应的权限标识
 * 用于路由守卫权限检查
 */
export function getRoutePermission(path: string): string | null {
  // 客户管理
  if (path.startsWith('/customer')) return 'customer:view'
  if (path.startsWith('/contact')) return 'contact:view'
  
  // 销售管理
  if (path.startsWith('/lead')) return 'lead:view'
  if (path.startsWith('/opportunity')) return 'opportunity:view'
  if (path.startsWith('/activity')) return 'activity:view'
  
  // 订单管理
  if (path.startsWith('/order')) return 'order:view'
  if (path.startsWith('/quote')) return 'quote:view'
  if (path.startsWith('/contract')) return 'contract:view'
  if (path.startsWith('/payment')) return 'payment:view'
  
  // 产品管理
  if (path.startsWith('/products')) return 'product:view'
  if (path.startsWith('/pricebooks')) return 'pricebook:view'
  
  // 报表
  if (path.startsWith('/report')) return 'report:view'
  
  // AI 功能
  if (path.startsWith('/ai')) return 'ai:view'
  
  // 营销
  if (path.startsWith('/marketing')) return 'marketing:view'
  
  // 自动化
  if (path.startsWith('/automation')) return 'automation:view'
  
  // 集成
  if (path.startsWith('/integration')) return 'integration:view'
  
  // 系统设置
  if (path.startsWith('/settings')) {
    if (path.includes('/roles') || path.includes('/users') || path.includes('/permissions')) {
      return 'settings:admin'
    }
    return 'settings:view'
  }
  
  return null
}

// ============================================
// 默认导出
// ============================================
export default {
  // 路径生成
  getCustomerDetailPath,
  getCustomerEditPath,
  getContactDetailPath,
  getLeadDetailPath,
  getOpportunityDetailPath,
  getActivityEditPath,
  getContractDetailPath,
  getPaymentDetailPath,
  getOrderDetailPath,
  getQuoteDetailPath,
  getQuoteEditPath,
  getProductDetailPath,
  getPricebookDetailPath,
  getCustomObjectConfigPath,
  getCustomObjectEditPath,
  getWorkflowEditPath,
  getAgentDetailPath,
  
  // 路径解析
  extractIdFromPath,
  extractObjectIdFromPath,
  extractWorkflowIdFromPath,
  parseRouteParams,
  
  // 导航辅助
  isPathMatch,
  isCustomerRelatedPath,
  isSalesRelatedPath,
  isOrderRelatedPath,
  isProductRelatedPath,
  isReportPath,
  isAIPath,
  isMarketingPath,
  isAutomationPath,
  isSettingsPath,
  isIntegrationPath,
  
  // 面包屑
  getBreadcrumbName,
  generateBreadcrumbPaths,
  
  // 权限
  getRoutePermission,
}
