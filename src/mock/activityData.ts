/**
 * Activity/Timeline 模块 Mock 数据
 * Activity & Timeline Mock Data
 */

import type { Activity, ActivityType, ActivityStatus, ActivityListParams, ActivityStats } from '@/types/activity'

// ============================================
// 活动类型常量
// ============================================
export const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: string }[] = [
  { value: 'call', label: '通话记录', icon: 'Phone' },
  { value: 'meeting', label: '会议', icon: 'Users' },
  { value: 'email', label: '邮件', icon: 'Mail' },
  { value: 'task', label: '任务', icon: 'CheckSquare' },
  { value: 'note', label: '备注', icon: 'FileText' },
  { value: 'visit', label: '拜访', icon: 'MapPin' },
]

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: '计划中',
  completed: '已完成',
  cancelled: '已取消',
  overdue: '已逾期',
}

// ============================================
// Mock 活动数据（30条）
// ============================================
export const mockActivities: Activity[] = [
  // 通话记录
  {
    id: 'act-001',
    type: 'call',
    subject: '初次电话沟通',
    description: '与客户初次电话沟通，了解对方需求，介绍了我们的CRM产品功能',
    status: 'completed',
    startTime: '2024-06-01T09:00:00Z',
    endTime: '2024-06-01T09:25:00Z',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-001',
    contactName: '张总',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-01T08:30:00Z',
    updatedAt: '2024-06-01T09:30:00Z',
    reminder: true,
    reminderTime: '2024-06-01T08:45:00Z',
  },
  {
    id: 'act-002',
    type: 'call',
    subject: '产品演示预约确认',
    description: '确认产品演示时间，发送演示邀请链接',
    status: 'completed',
    startTime: '2024-06-03T14:00:00Z',
    endTime: '2024-06-03T14:10:00Z',
    customerId: 'cust-002',
    customerName: '上海商贸公司',
    contactId: 'contact-003',
    contactName: '李经理',
    assignee: '李华',
    priority: 'medium',
    createdAt: '2024-06-03T13:00:00Z',
    updatedAt: '2024-06-03T14:15:00Z',
    reminder: false,
  },
  {
    id: 'act-003',
    type: 'call',
    subject: '跟进需求细节',
    description: '深入了解客户的技术栈和部署需求',
    status: 'completed',
    startTime: '2024-06-05T10:00:00Z',
    endTime: '2024-06-05T10:40:00Z',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-001',
    contactName: '张总',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-05T09:30:00Z',
    updatedAt: '2024-06-05T10:45:00Z',
    reminder: true,
    reminderTime: '2024-06-05T09:45:00Z',
  },
  {
    id: 'act-004',
    type: 'call',
    subject: '报价方案讨论',
    description: '讨论报价方案细节，针对VIP客户给予15%折扣优惠',
    status: 'completed',
    startTime: '2024-06-08T15:00:00Z',
    endTime: '2024-06-08T15:30:00Z',
    customerId: 'cust-003',
    customerName: '广州贸易进出口',
    contactId: 'contact-005',
    contactName: '王总监',
    assignee: '王芳',
    priority: 'medium',
    createdAt: '2024-06-08T14:00:00Z',
    updatedAt: '2024-06-08T15:35:00Z',
    reminder: false,
  },
  {
    id: 'act-005',
    type: 'call',
    subject: '合同条款协商',
    description: '协商合同付款条款和实施周期',
    status: 'completed',
    startTime: '2024-06-10T11:00:00Z',
    endTime: '2024-06-10T11:20:00Z',
    customerId: 'cust-006',
    customerName: '深圳科技集团',
    contactId: 'contact-008',
    contactName: '刘总',
    assignee: '赵敏',
    priority: 'high',
    createdAt: '2024-06-10T10:30:00Z',
    updatedAt: '2024-06-10T11:25:00Z',
    reminder: true,
    reminderTime: '2024-06-10T10:45:00Z',
  },

  // 会议
  {
    id: 'act-006',
    type: 'meeting',
    subject: '产品功能演示会议',
    description: '向客户演示CRM核心功能，包括客户管理、商机跟踪、报表分析等',
    status: 'completed',
    startTime: '2024-06-02T14:00:00Z',
    endTime: '2024-06-02T15:30:00Z',
    location: '线上会议（腾讯会议）',
    customerId: 'cust-002',
    customerName: '上海商贸公司',
    contactId: 'contact-003',
    contactName: '李经理',
    assignee: '李华',
    priority: 'high',
    createdAt: '2024-06-01T16:00:00Z',
    updatedAt: '2024-06-02T15:35:00Z',
    reminder: true,
    reminderTime: '2024-06-02T13:45:00Z',
  },
  {
    id: 'act-007',
    type: 'meeting',
    subject: '技术方案评审会',
    description: '与客户技术团队评审集成方案，确认API对接细节',
    status: 'completed',
    startTime: '2024-06-04T09:00:00Z',
    endTime: '2024-06-04T11:00:00Z',
    location: '客户办公室 - 会议室B',
    customerId: 'cust-003',
    customerName: '广州贸易进出口',
    contactId: 'contact-005',
    contactName: '王总监',
    assignee: '王芳',
    priority: 'high',
    createdAt: '2024-06-03T10:00:00Z',
    updatedAt: '2024-06-04T11:05:00Z',
    reminder: true,
    reminderTime: '2024-06-04T08:45:00Z',
  },
  {
    id: 'act-008',
    type: 'meeting',
    subject: '项目启动会',
    description: 'CRM实施项目正式启动，明确双方项目团队和里程碑',
    status: 'completed',
    startTime: '2024-06-12T10:00:00Z',
    endTime: '2024-06-12T12:00:00Z',
    location: '客户会议室',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-001',
    contactName: '张总',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-10T09:00:00Z',
    updatedAt: '2024-06-12T12:10:00Z',
    reminder: true,
    reminderTime: '2024-06-12T09:30:00Z',
  },
  {
    id: 'act-009',
    type: 'meeting',
    subject: '需求调研会议',
    description: '调研客户业务流程和定制化需求',
    status: 'planned',
    startTime: '2024-06-20T14:00:00Z',
    endTime: '2024-06-20T16:00:00Z',
    location: '线上会议',
    customerId: 'cust-007',
    customerName: '成都实业有限公司',
    contactId: 'contact-010',
    contactName: '陈经理',
    assignee: '刘强',
    priority: 'medium',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
    reminder: true,
    reminderTime: '2024-06-20T13:30:00Z',
  },
  {
    id: 'act-010',
    type: 'meeting',
    subject: '月度业务回顾',
    description: '与客户进行月度业务回顾，讨论使用效果和改进建议',
    status: 'planned',
    startTime: '2024-06-25T15:00:00Z',
    endTime: '2024-06-25T16:00:00Z',
    location: '线上会议',
    customerId: 'cust-004',
    customerName: '杭州进出口公司',
    contactId: 'contact-007',
    contactName: '赵总监',
    assignee: '李娜',
    priority: 'medium',
    createdAt: '2024-06-18T09:00:00Z',
    updatedAt: '2024-06-18T09:00:00Z',
    reminder: true,
    reminderTime: '2024-06-25T14:30:00Z',
  },

  // 邮件
  {
    id: 'act-011',
    type: 'email',
    subject: '发送产品介绍资料',
    description: '发送CRM产品手册、功能对比表、成功案例集',
    status: 'completed',
    startTime: '2024-06-01T10:00:00Z',
    customerId: 'cust-005',
    customerName: '南京贸易集团',
    contactId: 'contact-006',
    contactName: '孙总',
    assignee: '周杰',
    priority: 'medium',
    createdAt: '2024-06-01T09:30:00Z',
    updatedAt: '2024-06-01T10:05:00Z',
    reminder: false,
  },
  {
    id: 'act-012',
    type: 'email',
    subject: '发送报价方案V2',
    description: '根据客户反馈修改后的报价方案，包含三年期优惠',
    status: 'completed',
    startTime: '2024-06-07T11:00:00Z',
    customerId: 'cust-003',
    customerName: '广州贸易进出口',
    contactId: 'contact-005',
    contactName: '王总监',
    assignee: '王芳',
    priority: 'high',
    createdAt: '2024-06-07T10:00:00Z',
    updatedAt: '2024-06-07T11:05:00Z',
    reminder: false,
  },
  {
    id: 'act-013',
    type: 'email',
    subject: '合同初稿发送',
    description: '发送CRM采购合同初稿供法务审核',
    status: 'completed',
    startTime: '2024-06-11T09:00:00Z',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-002',
    contactName: '法务李经理',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-11T08:30:00Z',
    updatedAt: '2024-06-11T09:05:00Z',
    reminder: false,
  },
  {
    id: 'act-014',
    type: 'email',
    subject: '实施计划确认',
    description: '确认CRM实施时间表和资源安排',
    status: 'completed',
    startTime: '2024-06-13T14:00:00Z',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-001',
    contactName: '张总',
    assignee: '张明',
    priority: 'medium',
    createdAt: '2024-06-13T13:00:00Z',
    updatedAt: '2024-06-13T14:05:00Z',
    reminder: false,
  },
  {
    id: 'act-015',
    type: 'email',
    subject: '客户案例分享',
    description: '发送同行业成功案例供客户参考',
    status: 'completed',
    startTime: '2024-06-15T10:00:00Z',
    customerId: 'cust-008',
    customerName: '武汉商贸公司',
    contactId: 'contact-011',
    contactName: '黄经理',
    assignee: '吴涛',
    priority: 'low',
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-06-15T10:05:00Z',
    reminder: false,
  },

  // 任务
  {
    id: 'act-016',
    type: 'task',
    subject: '准备产品演示环境',
    description: '搭建演示环境，预置测试数据',
    status: 'completed',
    startTime: '2024-06-01T14:00:00Z',
    endTime: '2024-06-01T18:00:00Z',
    assignee: '李华',
    priority: 'high',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T18:05:00Z',
    reminder: true,
    reminderTime: '2024-06-01T13:30:00Z',
  },
  {
    id: 'act-017',
    type: 'task',
    subject: '制作定制化方案PPT',
    description: '根据客户需求制作个性化解决方案PPT',
    status: 'completed',
    startTime: '2024-06-06T09:00:00Z',
    endTime: '2024-06-06T17:00:00Z',
    assignee: '王芳',
    priority: 'high',
    createdAt: '2024-06-05T16:00:00Z',
    updatedAt: '2024-06-06T17:05:00Z',
    reminder: true,
    reminderTime: '2024-06-06T08:30:00Z',
  },
  {
    id: 'act-018',
    type: 'task',
    subject: '完成合同盖章',
    description: '协调内部流程完成合同盖章寄送',
    status: 'completed',
    startTime: '2024-06-14T09:00:00Z',
    endTime: '2024-06-14T12:00:00Z',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-12T10:00:00Z',
    updatedAt: '2024-06-14T12:05:00Z',
    reminder: true,
    reminderTime: '2024-06-14T08:30:00Z',
  },
  {
    id: 'act-019',
    type: 'task',
    subject: '安排实施培训',
    description: '协调培训时间和内容，准备培训材料',
    status: 'planned',
    startTime: '2024-06-22T09:00:00Z',
    endTime: '2024-06-22T17:00:00Z',
    assignee: '李娜',
    priority: 'medium',
    createdAt: '2024-06-18T10:00:00Z',
    updatedAt: '2024-06-18T10:00:00Z',
    reminder: true,
    reminderTime: '2024-06-22T08:00:00Z',
  },
  {
    id: 'act-020',
    type: 'task',
    subject: '跟进回款',
    description: '跟进客户付款进度，确认到账',
    status: 'overdue',
    startTime: '2024-06-15T09:00:00Z',
    endTime: '2024-06-15T18:00:00Z',
    assignee: '刘芳',
    priority: 'high',
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-06-15T18:05:00Z',
    reminder: true,
    reminderTime: '2024-06-15T08:30:00Z',
  },

  // 备注
  {
    id: 'act-021',
    type: 'note',
    subject: '客户需求纪要',
    description: '客户主要关注：1.多分支机构管理 2.移动端支持 3.与现有ERP集成 4.数据安全保障',
    status: 'completed',
    startTime: '2024-06-04T11:30:00Z',
    customerId: 'cust-003',
    customerName: '广州贸易进出口',
    contactId: 'contact-005',
    contactName: '王总监',
    assignee: '王芳',
    priority: 'medium',
    createdAt: '2024-06-04T12:00:00Z',
    updatedAt: '2024-06-04T12:00:00Z',
    reminder: false,
  },
  {
    id: 'act-022',
    type: 'note',
    subject: '竞争对手分析',
    description: '客户同时在评估Salesforce和微软Dynamics，我方优势：本地化支持、价格优势、响应速度快',
    status: 'completed',
    startTime: '2024-06-05T15:00:00Z',
    customerId: 'cust-002',
    customerName: '上海商贸公司',
    assignee: '李华',
    priority: 'medium',
    createdAt: '2024-06-05T15:30:00Z',
    updatedAt: '2024-06-05T15:30:00Z',
    reminder: false,
  },
  {
    id: 'act-023',
    type: 'note',
    subject: '决策链分析',
    description: '项目决策人：张总（最终拍板）、IT负责人王工（技术评估）、财务李经理（预算审批）',
    status: 'completed',
    startTime: '2024-06-06T10:00:00Z',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-06T10:30:00Z',
    updatedAt: '2024-06-06T10:30:00Z',
    reminder: false,
  },
  {
    id: 'act-024',
    type: 'note',
    subject: '客户反馈记录',
    description: '客户对UI体验提出改进建议，希望支持深色模式和多语言切换',
    status: 'completed',
    startTime: '2024-06-16T14:00:00Z',
    customerId: 'cust-004',
    customerName: '杭州进出口公司',
    contactId: 'contact-007',
    contactName: '赵总监',
    assignee: '李娜',
    priority: 'low',
    createdAt: '2024-06-16T14:30:00Z',
    updatedAt: '2024-06-16T14:30:00Z',
    reminder: false,
  },
  {
    id: 'act-025',
    type: 'note',
    subject: '项目风险记录',
    description: '客户内部IT资源有限，可能影响实施进度，需要提前安排更多远程支持',
    status: 'completed',
    startTime: '2024-06-18T11:00:00Z',
    customerId: 'cust-006',
    customerName: '深圳科技集团',
    assignee: '赵敏',
    priority: 'medium',
    createdAt: '2024-06-18T11:30:00Z',
    updatedAt: '2024-06-18T11:30:00Z',
    reminder: false,
  },

  // 拜访
  {
    id: 'act-026',
    type: 'visit',
    subject: '客户现场调研',
    description: '到访客户办公地点，了解实际工作场景和员工使用习惯',
    status: 'completed',
    startTime: '2024-06-09T09:00:00Z',
    endTime: '2024-06-09T17:00:00Z',
    location: '广州市天河区珠江新城',
    customerId: 'cust-003',
    customerName: '广州贸易进出口',
    contactId: 'contact-005',
    contactName: '王总监',
    assignee: '王芳',
    priority: 'high',
    createdAt: '2024-06-07T10:00:00Z',
    updatedAt: '2024-06-09T17:05:00Z',
    reminder: true,
    reminderTime: '2024-06-09T08:00:00Z',
  },
  {
    id: 'act-027',
    type: 'visit',
    subject: '项目启动拜访',
    description: '正式启动CRM实施项目，介绍双方项目团队成员',
    status: 'completed',
    startTime: '2024-06-12T08:30:00Z',
    endTime: '2024-06-12T09:30:00Z',
    location: '北京市朝阳区建国路',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-001',
    contactName: '张总',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-10T09:00:00Z',
    updatedAt: '2024-06-12T09:35:00Z',
    reminder: true,
    reminderTime: '2024-06-12T08:00:00Z',
  },
  {
    id: 'act-028',
    type: 'visit',
    subject: '签约拜访',
    description: '客户正式签约，庆祝成功合作',
    status: 'completed',
    startTime: '2024-06-14T10:00:00Z',
    endTime: '2024-06-14T11:00:00Z',
    location: '北京市朝阳区建国路',
    customerId: 'cust-001',
    customerName: '北京华联集团',
    contactId: 'contact-001',
    contactName: '张总',
    assignee: '张明',
    priority: 'high',
    createdAt: '2024-06-13T10:00:00Z',
    updatedAt: '2024-06-14T11:05:00Z',
    reminder: false,
  },
  {
    id: 'act-029',
    type: 'visit',
    subject: '需求深度调研',
    description: '深入了解各部门业务流程和特殊需求',
    status: 'planned',
    startTime: '2024-06-21T09:00:00Z',
    endTime: '2024-06-21T18:00:00Z',
    location: '成都市高新区天府大道',
    customerId: 'cust-007',
    customerName: '成都实业有限公司',
    contactId: 'contact-010',
    contactName: '陈经理',
    assignee: '刘强',
    priority: 'medium',
    createdAt: '2024-06-17T10:00:00Z',
    updatedAt: '2024-06-17T10:00:00Z',
    reminder: true,
    reminderTime: '2024-06-21T08:00:00Z',
  },
  {
    id: 'act-030',
    type: 'visit',
    subject: '客户培训',
    description: '对客户关键用户进行系统操作培训',
    status: 'planned',
    startTime: '2024-06-24T09:00:00Z',
    endTime: '2024-06-24T17:00:00Z',
    location: '深圳市南山区科技园',
    customerId: 'cust-006',
    customerName: '深圳科技集团',
    contactId: 'contact-009',
    contactName: 'IT负责人',
    assignee: '赵敏',
    priority: 'medium',
    createdAt: '2024-06-19T10:00:00Z',
    updatedAt: '2024-06-19T10:00:00Z',
    reminder: true,
    reminderTime: '2024-06-24T08:00:00Z',
  },
]

// ============================================
// 辅助函数
// ============================================

/** 获取所有活动 */
export function getActivityList(): Activity[] {
  return [...mockActivities].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )
}

/** 根据ID获取活动 */
export function getActivityById(id: string): Activity | undefined {
  return mockActivities.find((a) => a.id === id)
}

/** 根据筛选条件获取活动 */
export function getActivityByFilter(filter: ActivityListParams): Activity[] {
  let result = [...mockActivities]

  if (filter.search) {
    const search = filter.search.toLowerCase()
    result = result.filter(
      (a) =>
        a.subject.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search) ||
        a.customerName?.toLowerCase().includes(search)
    )
  }

  if (filter.type) {
    result = result.filter((a) => a.type === filter.type)
  }

  if (filter.status) {
    result = result.filter((a) => a.status === filter.status)
  }

  if (filter.assignee) {
    result = result.filter((a) => a.assignee === filter.assignee)
  }

  if (filter.customerId) {
    result = result.filter((a) => a.customerId === filter.customerId)
  }

  if (filter.startDate) {
    result = result.filter((a) => new Date(a.startTime) >= new Date(filter.startDate!))
  }

  if (filter.endDate) {
    result = result.filter((a) => new Date(a.startTime) <= new Date(filter.endDate!))
  }

  // 分页
  const page = filter.page ?? 1
  const pageSize = filter.pageSize ?? 20
  const start = (page - 1) * pageSize

  return result.slice(start, start + pageSize)
}

/** 获取活动统计 */
export function getActivityStats(): ActivityStats {
  const stats: ActivityStats = {
    total: mockActivities.length,
    planned: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    byType: { call: 0, meeting: 0, email: 0, task: 0, note: 0, visit: 0 },
    byAssignee: {},
  }

  for (const activity of mockActivities) {
    switch (activity.status) {
      case 'planned':
        stats.planned++
        break
      case 'completed':
        stats.completed++
        break
      case 'cancelled':
        stats.cancelled++
        break
      case 'overdue':
        stats.overdue++
        break
    }

    stats.byType[activity.type]++
    stats.byAssignee[activity.assignee] = (stats.byAssignee[activity.assignee] || 0) + 1
  }

  return stats
}

/** 根据关联对象获取活动 */
export function getActivitiesByRelatedId(
  relatedType: 'customerId' | 'contactId',
  relatedId: string
): Activity[] {
  return mockActivities.filter((a) => a[relatedType] === relatedId)
}

/** 获取用户的活动列表 */
export function getActivitiesByAssignee(assignee: string): Activity[] {
  return mockActivities.filter((a) => a.assignee === assignee)
}

/** 获取今日活动 */
export function getTodayActivities(): Activity[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return mockActivities.filter((a) => {
    const activityDate = new Date(a.startTime)
    return activityDate >= today && activityDate < tomorrow
  })
}

/** 获取即将到期的活动（未来7天） */
export function getUpcomingActivities(): Activity[] {
  const now = new Date()
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  return mockActivities.filter((a) => {
    if (a.status !== 'planned') return false
    const activityDate = new Date(a.startTime)
    return activityDate >= now && activityDate <= nextWeek
  })
}
