/**
 * 线索模块 Mock 数据
 * Mock data for leads module
 */

import type { Lead, LeadStatus, LeadSource } from '@/types/lead'

// ============================================
// Mock 数据
// ============================================

export const mockLeads: Lead[] = [
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
    remark: '对产品很感兴趣，预算充足',
    content: '需要了解我们的企业版产品',
    budget: '50-100 万',
    purchaseTimeframe: '3 个月内',
    lastContactTime: '2024-01-16T14:30:00Z',
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
    lastContactTime: '2024-01-17T09:00:00Z',
    remark: '需要进一步沟通需求',
  },
  {
    id: 'LEAD-003',
    name: '王五',
    company: '创新科技',
    email: 'wangwu@innovate.com',
    phone: '13700137000',
    source: '推荐',
    status: '新建',
    score: 75,
    level: '高',
    assignee: 'user-1',
    createdAt: '2024-01-17T09:15:00Z',
    budget: '20-50 万',
    purchaseTimeframe: '1 个月内',
  },
  {
    id: 'LEAD-004',
    name: '赵六',
    company: '智能制造公司',
    email: 'zhaoliu@smartmfg.com',
    phone: '13600136000',
    source: '广告',
    status: '已转化',
    score: 90,
    level: '高',
    assignee: 'user-3',
    createdAt: '2024-01-10T08:00:00Z',
    convertedAt: '2024-02-15T10:00:00Z',
    convertedToCustomerId: 'CUST-001',
    convertedCustomerName: '智能制造公司',
    remark: '已转化为客户',
  },
  {
    id: 'LEAD-005',
    name: '孙七',
    company: '医疗健康集团',
    email: 'sunqi@healthcare.com',
    phone: '13500135000',
    source: '其他',
    status: '跟进中',
    score: 65,
    level: '中',
    assignee: 'user-2',
    createdAt: '2024-01-18T11:00:00Z',
    lastContactTime: '2024-01-19T15:00:00Z',
    remark: '对医疗行业解决方案感兴趣',
  },
]
