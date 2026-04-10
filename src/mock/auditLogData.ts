/**
 * 审计日志 Mock 数据
 * Audit Log Mock Data
 */

import type { AuditLogEntry, AuditStats } from '@/types/auditLog'
import { AuditAction, AuditModule } from '@/types/auditLog'

// 用户列表
const users = [
  { id: 'user-001', name: '张明' },
  { id: 'user-002', name: '李华' },
  { id: 'user-003', name: '王芳' },
  { id: 'user-004', name: '赵强' },
  { id: 'user-005', name: '刘洋' },
  { id: 'user-006', name: '陈静' },
  { id: 'user-007', name: '杨帆' },
  { id: 'user-008', name: '周涛' },
]

// IP地址
const ipAddresses = [
  '192.168.1.100',
  '192.168.1.101',
  '10.0.0.50',
  '172.16.0.25',
  '192.168.2.88',
  '10.10.10.10',
  '172.20.0.15',
]

// UserAgents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) Mobile/15E148',
]

// 客户名称
const customerNames = [
  '北京华联集团',
  '上海商贸公司',
  '广州贸易有限公',
  '深圳科技股份',
  '杭州互联网公司',
  '成都实业集团',
  '武汉商贸有限公',
  '西安电子科技',
]

// 商机名称
const opportunityNames = [
  'CRM系统采购项目',
  'ERP系统实施',
  'OA办公自动化',
  '数据中心建设',
  '网络安全改造',
  '云计算迁移',
]

// 生成随机日期
function randomDate(daysBack: number = 30): string {
  const now = new Date()
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000)
  return past.toISOString()
}

// 生成随机变更详情
function generateDetails(action: AuditAction): { field: string; fieldLabel: string; oldValue: string | null; newValue: string | null }[] {
  if (action === AuditAction.CREATE || action === AuditAction.DELETE) {
    return []
  }

  const fieldChanges = [
    { field: 'status', fieldLabel: '状态', oldValue: '跟进中', newValue: '已成交' },
    { field: 'owner', fieldLabel: '负责人', oldValue: '张明', newValue: '李华' },
    { field: 'amount', fieldLabel: '金额', oldValue: '50000', newValue: '80000' },
    { field: 'priority', fieldLabel: '优先级', oldValue: '低', newValue: '高' },
    { field: 'deadline', fieldLabel: '截止日期', oldValue: '2024-06-01', newValue: '2024-07-01' },
    { field: 'description', fieldLabel: '描述', oldValue: '初步接触', newValue: '深入洽谈' },
    { field: 'phone', fieldLabel: '电话', oldValue: '010-12345678', newValue: '010-87654321' },
    { field: 'email', fieldLabel: '邮箱', oldValue: 'old@example.com', newValue: 'new@example.com' },
  ]

  // 随机选择1-3个字段变更
  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...fieldChanges].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(f => ({ ...f, oldValue: f.oldValue || null, newValue: f.newValue || null }))
}

// 生成单条日志
function generateLog(index: number): AuditLogEntry {
  const user = users[Math.floor(Math.random() * users.length)]
  const action = Object.values(AuditAction)[Math.floor(Math.random() * Object.values(AuditAction).length)]
  const module = Object.values(AuditModule)[Math.floor(Math.random() * Object.values(AuditModule).length)]
  const ip = ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
  const ua = userAgents[Math.floor(Math.random() * userAgents.length)]

  const baseLog: AuditLogEntry = {
    id: `log-${String(index + 1).padStart(4, '0')}`,
    action,
    module,
    description: `${action} - ${module}`,
    userId: user.id,
    userName: user.name,
    operator: user.name, // 别名
    ipAddress: ip,
    userAgent: ua,
    result: Math.random() > 0.05 ? 'success' : 'failure', // 95% 成功率
    timestamp: randomDate(30),
    details: generateDetails(action),
  }

  // 根据模块设置相关字段
  switch (module) {
    case AuditModule.CUSTOMER:
      baseLog.recordName = customerNames[Math.floor(Math.random() * customerNames.length)]
      baseLog.objectType = 'Customer'
      break
    case AuditModule.OPPORTUNITY:
      baseLog.recordName = opportunityNames[Math.floor(Math.random() * opportunityNames.length)]
      baseLog.objectType = 'Opportunity'
      break
    case AuditModule.CONTACT:
      baseLog.recordName = `${['张', '李', '王', '赵'][Math.floor(Math.random() * 4)]}${['三', '四', '五', '六'][Math.floor(Math.random() * 4)]}`
      baseLog.objectType = 'Contact'
      break
    case AuditModule.LEAD:
      baseLog.recordName = `${['刘', '陈', '杨', '周'][Math.floor(Math.random() * 4)]}公司`
      baseLog.objectType = 'Lead'
      break
    case AuditModule.CONTRACT:
      baseLog.recordName = `合同-${2024}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      baseLog.objectType = 'Contract'
      break
    case AuditModule.PRODUCT:
      baseLog.recordName = `产品-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`
      baseLog.objectType = 'Product'
      break
    case AuditModule.USER:
      baseLog.recordName = users[Math.floor(Math.random() * users.length)].name
      baseLog.objectType = 'User'
      break
    case AuditModule.SETTINGS:
      baseLog.recordName = '系统配置'
      baseLog.objectType = 'Settings'
      break
    default:
      baseLog.recordName = `${module}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`
      baseLog.objectType = module
  }

  // 生成描述
  const actionLabels: Record<AuditAction, string> = {
    [AuditAction.CREATE]: '创建',
    [AuditAction.UPDATE]: '更新',
    [AuditAction.DELETE]: '删除',
    [AuditAction.VIEW]: '查看',
    [AuditAction.LOGIN]: '登录系统',
    [AuditAction.LOGOUT]: '退出系统',
    [AuditAction.EXPORT]: '导出',
    [AuditAction.IMPORT]: '导入',
    [AuditAction.ASSIGN]: '分配',
    [AuditAction.STATUS_CHANGE]: '变更状态',
  }

  baseLog.description = `${user.name}${actionLabels[action]}${baseLog.recordName}`

  return baseLog
}

// 生成100条日志
export const mockAuditLogs: AuditLogEntry[] = Array.from({ length: 100 }, (_, i) => generateLog(i))
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // 按时间倒序

// 计算统计数据
export function calculateAuditStats(logs: AuditLogEntry[]): AuditStats {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const byAction: Record<AuditAction, number> = {} as any
  const byModule: Record<AuditModule, number> = {} as any

  let todayTotal = 0
  let total = logs.length

  for (const log of logs) {
    // 按操作类型统计
    byAction[log.action] = (byAction[log.action] || 0) + 1

    // 按模块统计
    byModule[log.module] = (byModule[log.module] || 0) + 1

    // 今日统计
    if (new Date(log.timestamp) >= todayStart) {
      todayTotal++
    }
  }

  return {
    total,
    todayTotal,
    byAction,
    byModule,
    recentActivity: logs.slice(0, 10),
  }
}

// 筛选日志
export function filterAuditLogs(
  logs: AuditLogEntry[],
  filters: {
    action?: AuditAction
    module?: AuditModule
    userId?: string
    operator?: string
    startDate?: string
    endDate?: string
    search?: string
    result?: 'success' | 'failure'
    page?: number
    pageSize?: number
  }
): { data: AuditLogEntry[]; total: number } {
  let filtered = [...logs]

  if (filters.action) {
    filtered = filtered.filter(log => log.action === filters.action)
  }

  if (filters.module) {
    filtered = filtered.filter(log => log.module === filters.module)
  }

  if (filters.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId)
  }

  if (filters.operator) {
    const op = filters.operator.toLowerCase()
    filtered = filtered.filter(log => log.userName.toLowerCase().includes(op) || log.operator?.toLowerCase().includes(op))
  }

  if (filters.startDate) {
    filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate!))
  }

  if (filters.endDate) {
    filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate!))
  }

  if (filters.search) {
    const s = filters.search.toLowerCase()
    filtered = filtered.filter(log =>
      log.description.toLowerCase().includes(s) ||
      log.recordName?.toLowerCase().includes(s) ||
      log.userName.toLowerCase().includes(s)
    )
  }

  if (filters.result) {
    filtered = filtered.filter(log => log.result === filters.result)
  }

  const total = filtered.length
  const page = filters.page || 1
  const pageSize = filters.pageSize || 20

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total }
}

// 导出日志为CSV格式
export function exportAuditLogsToCsv(logs: AuditLogEntry[]): string {
  const headers = ['时间', '用户', '操作', '模块', '对象', 'IP地址', '结果', '描述']
  const rows = logs.map(log => [
    new Date(log.timestamp).toLocaleString('zh-CN'),
    log.userName,
    log.action,
    log.module,
    log.recordName || '',
    log.ipAddress,
    log.result || '',
    log.description,
  ])

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}
