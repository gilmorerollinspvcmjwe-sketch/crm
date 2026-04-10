/**
 * 客户管理 Mock 数据
 * 包含客户数据
 */

import type { Customer, CustomerStatus, CustomerScale, CustomerSource } from '@/types/api'

// Re-export for use in other modules
export type { CustomerSource }

export type CustomerType = '企业' | '个人' | '政府' | '非营利组织'

export type CustomerIndustry = 
  | '互联网/软件'
  | '制造业'
  | '金融/保险'
  | '零售/批发'
  | '医疗/健康'
  | '教育/培训'
  | '房地产/建筑'
  | '物流/运输'
  | '能源/化工'
  | '文化/传媒'
  | '咨询/服务'
  | '其他'

export const customerTypeConfig: Record<CustomerType, { label: string; color: string }> = {
  '企业': { label: '企业', color: 'bg-blue-500' },
  '个人': { label: '个人', color: 'bg-green-500' },
  '政府': { label: '政府', color: 'bg-red-500' },
  '非营利组织': { label: '非营利组织', color: 'bg-purple-500' },
}

export const customerIndustryConfig: Record<CustomerIndustry, { label: string }> = {
  '互联网/软件': { label: '互联网/软件' },
  '制造业': { label: '制造业' },
  '金融/保险': { label: '金融/保险' },
  '零售/批发': { label: '零售/批发' },
  '医疗/健康': { label: '医疗/健康' },
  '教育/培训': { label: '教育/培训' },
  '房地产/建筑': { label: '房地产/建筑' },
  '物流/运输': { label: '物流/运输' },
  '能源/化工': { label: '能源/化工' },
  '文化/传媒': { label: '文化/传媒' },
  '咨询/服务': { label: '咨询/服务' },
  '其他': { label: '其他' },
}

export const customerScaleConfig: Record<CustomerScale, { label: string }> = {
  'small': { label: '微型 (1-20 人)' },
  'medium': { label: '小型 (21-100 人)' },
  'large': { label: '中型 (101-500 人)' },
  'enterprise': { label: '大型 (501-2000 人)' },
}

export const customerStatusConfig: Record<CustomerStatus, { label: string; color: string }> = {
  '潜在': { label: '潜在客户', color: 'bg-yellow-500' },
  '活跃': { label: '正式客户', color: 'bg-green-500' },
  '沉默': { label: '沉默客户', color: 'bg-gray-400' },
  '流失': { label: '流失客户', color: 'bg-red-500' },
}

export const customerSourceConfig: Record<CustomerSource | string, { label: string }> = {
  'marketing': { label: '市场' },
  'referral': { label: '推荐' },
  'partner': { label: '合作伙伴' },
  'other': { label: '其他' },
}

export interface MockCustomer extends Omit<Customer, 'industry' | 'scale' | 'source'> {
  type: CustomerType
  industry: CustomerIndustry
  scale: CustomerScale
  source: CustomerSource | string
  creditCode?: string
  legalPerson?: string
  address?: string
  website?: string
  fax?: string
  tags?: string[]
  rating?: number
}

export const mockCustomers: MockCustomer[] = [
  {
    id: 'CUST-001',
    name: '张伟',
    company: '北京科技创新有限公司',
    email: 'zhangwei@bjtech.com',
    phone: '13800138001',
    status: '活跃',
    score: 95,
    createdAt: '2023-06-15T08:00:00Z',
    lastContact: '2024-03-20T14:30:00Z',
    assignee: '张三',
    type: '企业',
    industry: '互联网/软件',
    scale: 'large',
    source: 'marketing',
    creditCode: '91110108MA01ABCD12',
    legalPerson: '张伟',
    address: '北京市海淀区中关村大街 1 号',
    website: 'www.bjtech.com',
    tags: ['VIP', '重点客户'],
    rating: 5,
  },
  {
    id: 'CUST-002',
    name: '李娜',
    company: '上海贸易发展集团',
    email: 'lina@shtrade.com',
    phone: '13900139002',
    status: '活跃',
    score: 88,
    createdAt: '2023-07-20T09:00:00Z',
    lastContact: '2024-03-21T10:00:00Z',
    assignee: '李四',
    type: '企业',
    industry: '零售/批发',
    scale: 'enterprise',
    source: 'referral',
    creditCode: '91310101MA02EFGH34',
    legalPerson: '李娜',
    address: '上海市浦东新区陆家嘴环路 100 号',
    website: 'www.shtrade.com',
    tags: ['长期合作'],
    rating: 5,
  },
  {
    id: 'CUST-003',
    name: '王强',
    company: '广州智能制造厂',
    email: 'wangqiang@gzmanufacturing.com',
    phone: '13700137003',
    status: '潜在',
    score: 72,
    createdAt: '2024-01-10T10:00:00Z',
    lastContact: '2024-03-19T16:00:00Z',
    assignee: '张三',
    type: '企业',
    industry: '制造业',
    scale: 'medium',
    source: 'other',
    tags: ['新客户'],
    rating: 4,
  },
  {
    id: 'CUST-004',
    name: '赵敏',
    company: '深圳金融服务公司',
    email: 'zhaomin@szfinance.com',
    phone: '13600136004',
    status: '活跃',
    score: 90,
    createdAt: '2023-05-10T08:30:00Z',
    lastContact: '2024-03-18T09:00:00Z',
    assignee: '王五',
    type: '企业',
    industry: '金融/保险',
    scale: 'large',
    source: 'marketing',
    tags: ['金融行业'],
    rating: 5,
  },
  {
    id: 'CUST-005',
    name: '刘洋',
    company: '杭州电子商务集团',
    email: 'liuyang@hzecommerce.com',
    phone: '13500135005',
    status: '沉默',
    score: 65,
    createdAt: '2023-08-15T11:00:00Z',
    lastContact: '2024-01-10T15:30:00Z',
    assignee: '赵六',
    type: '企业',
    industry: '互联网/软件',
    scale: 'enterprise',
    source: 'marketing',
    tags: ['电商'],
    rating: 3,
  },
]

// ============ 辅助函数 ============

export function getCustomerById(id: string): MockCustomer | undefined {
  return mockCustomers.find((c) => c.id === id)
}

export function getAllCustomers(): MockCustomer[] {
  return [...mockCustomers]
}

export function getCustomersByStatus(status: CustomerStatus): MockCustomer[] {
  return mockCustomers.filter((c) => c.status === status)
}

export function getCustomersByType(type: CustomerType): MockCustomer[] {
  return mockCustomers.filter((c) => c.type === type)
}

export function getCustomersByIndustry(industry: CustomerIndustry): MockCustomer[] {
  return mockCustomers.filter((c) => c.industry === industry)
}

export function getActiveCustomers(): MockCustomer[] {
  return mockCustomers.filter((c) => c.status === '活跃')
}

export function getCustomerStats() {
  const total = mockCustomers.length
  const active = mockCustomers.filter((c) => c.status === '活跃').length
  const potential = mockCustomers.filter((c) => c.status === '潜在').length
  const silent = mockCustomers.filter((c) => c.status === '沉默').length
  const lost = mockCustomers.filter((c) => c.status === '流失').length
  
  const avgScore = mockCustomers.reduce((sum, c) => sum + c.score, 0) / total
  
  const byType = {
    '企业': mockCustomers.filter((c) => c.type === '企业').length,
    '个人': mockCustomers.filter((c) => c.type === '个人').length,
    '政府': mockCustomers.filter((c) => c.type === '政府').length,
    '非营利组织': mockCustomers.filter((c) => c.type === '非营利组织').length,
  }
  
  const byIndustry = {
    '互联网/软件': mockCustomers.filter((c) => c.industry === '互联网/软件').length,
    '制造业': mockCustomers.filter((c) => c.industry === '制造业').length,
    '金融/保险': mockCustomers.filter((c) => c.industry === '金融/保险').length,
    '零售/批发': mockCustomers.filter((c) => c.industry === '零售/批发').length,
    '其他': mockCustomers.filter((c) => !c.industry || !['互联网/软件', '制造业', '金融/保险', '零售/批发'].includes(c.industry)).length,
  }
  
  return {
    total,
    active,
    potential,
    silent,
    lost,
    avgScore: Math.round(avgScore),
    byType,
    byIndustry,
  }
}
