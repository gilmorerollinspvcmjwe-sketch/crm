/**
 * 联系人 Mock 数据
 * 包含联系人数据，覆盖不同客户、职位和联系方式
 * 数据结构已对齐 src/types/contactPerson.ts
 */

import type { ContactPersonGender, ContactPersonJobLevel, ContactPersonDecisionRole, ContactPersonEducation, ContactPersonSource } from '@/types/contactPerson'

export interface MockContact {
  id: string
  name: string
  position: string
  gender?: ContactPersonGender
  jobLevel?: ContactPersonJobLevel
  decisionRole?: ContactPersonDecisionRole
  customerId: string
  customerName?: string
  phone: string
  email: string
  wechat?: string
  isPrimary: boolean
  department?: string
  mobile?: string
  officePhone?: string
  address?: string
  birthday?: string
  joinDate?: string
  school?: string
  education?: ContactPersonEducation
  major?: string
  hobbies?: string
  preference?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  ownerId: string
  ownerName?: string
  assignee: string
  lastContactDate?: string
  lastContactType?: string
  notes?: string
  status?: '正常' | '离职' | '无效'
  source?: ContactPersonSource
  remark?: string
}

export const mockContacts: MockContact[] = [
  {
    id: 'CONT-001',
    name: '张伟',
    position: '总经理',
    gender: '男',
    jobLevel: '高管',
    decisionRole: '决策者',
    customerId: 'CUST-001',
    customerName: '北京科技创新有限公司',
    phone: '010-88888888',
    mobile: '13800138001',
    officePhone: '010-88888888',
    email: 'zhangwei@bjtech.com',
    wechat: 'zhangwei_bj',
    isPrimary: true,
    department: '总经办',
    address: '北京市海淀区中关村大街 1 号',
    birthday: '1980-05-15',
    joinDate: '2010-03-01',
    school: '北京大学',
    education: '硕士',
    major: '计算机科学',
    hobbies: '读书、登山',
    preference: '电话沟通',
    tags: ['决策人', 'VIP'],
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    createdBy: '张三',
    ownerId: 'USR-001',
    ownerName: '张三',
    assignee: '张三',
    lastContactDate: '2024-03-20T14:30:00Z',
    lastContactType: '电话',
    notes: '公司决策人，偏好直接沟通',
    status: '正常',
    source: '客户导入',
  },
  {
    id: 'CONT-002',
    name: '李娜',
    position: '采购总监',
    gender: '女',
    jobLevel: '高管',
    decisionRole: '决策者',
    customerId: 'CUST-002',
    customerName: '上海贸易发展集团',
    phone: '021-66666666',
    mobile: '13900139002',
    officePhone: '021-66666666',
    email: 'lina@shtrade.com',
    wechat: 'lina_sh',
    isPrimary: true,
    department: '采购部',
    address: '上海市浦东新区陆家嘴环路 100 号',
    birthday: '1985-08-20',
    joinDate: '2015-06-15',
    school: '复旦大学',
    education: '本科',
    major: '国际贸易',
    hobbies: '瑜伽、旅行',
    preference: '邮件沟通',
    tags: ['关键联系人', '采购决策'],
    createdAt: '2023-07-20T09:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z',
    createdBy: '李四',
    ownerId: 'USR-002',
    ownerName: '李四',
    assignee: '李四',
    lastContactDate: '2024-03-21T10:00:00Z',
    lastContactType: '邮件',
    notes: '负责采购决策，注重性价比',
    status: '正常',
    source: '客户导入',
  },
  {
    id: 'CONT-003',
    name: '王强',
    position: '生产经理',
    gender: '男',
    jobLevel: '中层',
    decisionRole: '使用者',
    customerId: 'CUST-003',
    customerName: '广州智能制造厂',
    phone: '020-88889999',
    mobile: '13700137003',
    officePhone: '020-88889999',
    email: 'wangqiang@gzmanufacturing.com',
    wechat: 'wangqiang_gz',
    isPrimary: true,
    department: '生产部',
    address: '广州市天河区工业园路 88 号',
    birthday: '1982-03-10',
    joinDate: '2012-08-20',
    school: '华南理工大学',
    education: '本科',
    major: '机械工程',
    hobbies: '摄影、跑步',
    preference: '微信沟通',
    tags: ['技术负责人'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-19T16:00:00Z',
    createdBy: '张三',
    ownerId: 'USR-001',
    ownerName: '张三',
    assignee: '张三',
    lastContactDate: '2024-03-19T16:00:00Z',
    lastContactType: '微信',
    notes: '负责生产系统技术评估',
    status: '正常',
    source: '活动收集',
  },
]

// ============ 辅助函数 ============

export function getContactById(id: string): MockContact | undefined {
  return mockContacts.find((c) => c.id === id)
}

export function getAllContacts(): MockContact[] {
  return [...mockContacts]
}

export function getContactsByCustomerId(customerId: string): MockContact[] {
  return mockContacts.filter((c) => c.customerId === customerId)
}

export function getPrimaryContacts(): MockContact[] {
  return mockContacts.filter((c) => c.isPrimary)
}

export function getContactsByStatus(status: string): MockContact[] {
  return mockContacts.filter((c) => c.status === status)
}

export function getContactsByAssignee(assignee: string): MockContact[] {
  return mockContacts.filter((c) => c.assignee === assignee)
}

export function getContactStats() {
  const total = mockContacts.length
  const primary = mockContacts.filter((c) => c.isPrimary).length
  const secondary = total - primary
  
  const byGender = {
    '男': mockContacts.filter((c) => c.gender === '男').length,
    '女': mockContacts.filter((c) => c.gender === '女').length,
    '未知': mockContacts.filter((c) => !c.gender || c.gender === '未知').length,
  }
  
  const byJobLevel = {
    '高管': mockContacts.filter((c) => c.jobLevel === '高管').length,
    '中层': mockContacts.filter((c) => c.jobLevel === '中层').length,
    '基层': mockContacts.filter((c) => c.jobLevel === '基层').length,
    '其他': mockContacts.filter((c) => !c.jobLevel || c.jobLevel === '其他').length,
  }
  
  return {
    total,
    primary,
    secondary,
    byGender,
    byJobLevel,
  }
}
