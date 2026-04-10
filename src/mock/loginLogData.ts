/**
 * Login Log Mock Data
 * 登录日志模拟数据
 */

import { LoginLogEntry, LoginStatus, LoginType, LoginStats, LoginLogFilter, LoginLogResponse } from '@/types/loginLog'

// 用户列表
const users = [
  { userId: 'user-001', userName: 'zhangwei', userDisplayName: '张伟', userEmail: 'zhangwei@example.com' },
  { userId: 'user-002', userName: 'lisi', userDisplayName: '李思', userEmail: 'lisi@example.com' },
  { userId: 'user-003', userName: 'wangfang', userDisplayName: '王芳', userEmail: 'wangfang@example.com' },
  { userId: 'user-004', userName: 'zhaoliu', userDisplayName: '赵六', userEmail: 'zhaoliu@example.com' },
  { userId: 'user-005', userName: 'sunqi', userDisplayName: '孙琪', userEmail: 'sunqi@example.com' },
  { userId: 'user-006', userName: 'zhouba', userDisplayName: '周八', userEmail: 'zhouba@example.com' },
  { userId: 'user-007', userName: 'wujiu', userDisplayName: '吴九', userEmail: 'wujiu@example.com' },
  { userId: 'user-008', userName: 'zhengshi', userDisplayName: '郑十', userEmail: 'zhengshi@example.com' },
  { userId: 'user-009', userName: 'admin', userDisplayName: '管理员', userEmail: 'admin@example.com' },
  { userId: 'user-010', userName: 'testuser', userDisplayName: '测试用户', userEmail: 'test@example.com' },
]

// IP地址和位置映射
const ipLocations: Array<{ ip: string; location: string }> = [
  { ip: '114.114.114.114', location: '江苏省南京市' },
  { ip: '123.125.115.110', location: '北京市' },
  { ip: '202.96.128.86', location: '广东省广州市' },
  { ip: '61.135.169.125', location: '上海市' },
  { ip: '119.75.217.109', location: '浙江省杭州市' },
  { ip: '180.76.76.76', location: '四川省成都市' },
  { ip: '14.215.177.38', location: '广东省深圳市' },
  { ip: '117.169.75.131', location: '湖北省武汉市' },
  { ip: '183.195.76.234', location: '福建省福州市' },
  { ip: '211.162.78.92', location: '河南省郑州市' },
]

// 设备列表
const devices = [
  'Chrome / Windows 10',
  'Chrome / Windows 11',
  'Safari / macOS',
  'Firefox / Windows 10',
  'Edge / Windows 11',
  'Chrome / macOS',
  'Safari / iOS',
  'Chrome / Android',
  'Firefox / Linux',
  'IE 11 / Windows 7',
]

// 浏览器列表
const browsers = [
  'Chrome 121.0',
  'Chrome 120.0',
  'Safari 17.3',
  'Firefox 122.0',
  'Edge 121.0',
  'Chrome 119.0',
  'Safari 16.6',
  'Firefox 121.0',
  'Chrome 122.0',
  'IE 11.0',
]

// 操作系统列表
const operatingSystems = [
  'Windows 10',
  'Windows 11',
  'macOS Sonoma',
  'macOS Ventura',
  'iOS 17.3',
  'Android 14',
  'Ubuntu 22.04',
  'Windows 7',
]

// 失败原因
const failureReasons = [
  '密码错误',
  '账号已被锁定',
  '密码已过期',
  'IP地址被限制',
  '验证码错误',
  '账号不存在',
  '登录尝试次数过多',
  '认证服务器超时',
  '双因素认证失败',
  '会话已过期',
]

// 登录类型
const loginTypes = [LoginType.NORMAL, LoginType.SSO, LoginType.OAUTH, LoginType.API]

// 生成随机时间（最近30天）
function randomDate(daysBack: number = 30): string {
  const now = new Date()
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000)
  return past.toISOString()
}

// 生成随机IP
function randomIp(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

// 生成随机登录日志条目
function generateLoginLogEntry(id: number, forcedStatus?: LoginStatus): LoginLogEntry {
  const user = users[Math.floor(Math.random() * users.length)]
  const ipInfo = ipLocations[Math.floor(Math.random() * ipLocations.length)]
  const device = devices[Math.floor(Math.random() * devices.length)]
  const browser = browsers[Math.floor(Math.random() * browsers.length)]
  const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)]
  const loginType = loginTypes[Math.floor(Math.random() * loginTypes.length)]

  // 80% 成功率, 20% 失败率
  const isSuccess = forcedStatus ? forcedStatus === LoginStatus.SUCCESS : Math.random() < 0.8
  const status = isSuccess ? LoginStatus.SUCCESS : LoginStatus.FAILED

  return {
    id: `log-${String(id).padStart(4, '0')}`,
    userId: user.userId,
    userName: user.userName,
    userDisplayName: user.userDisplayName,
    userEmail: user.userEmail,
    status,
    loginType,
    ipAddress: ipInfo.ip,
    location: ipInfo.location,
    device,
    browser,
    os,
    userAgent: `Mozilla/5.0 (${device}) AppleWebKit/537.36`,
    failureReason: status === LoginStatus.FAILED ? failureReasons[Math.floor(Math.random() * failureReasons.length)] : undefined,
    timestamp: randomDate(),
  }
}

// 生成100条模拟数据
export const mockLoginLogs: LoginLogEntry[] = Array.from({ length: 100 }, (_, i) => generateLoginLogEntry(i + 1))

// 按日期分组统计数据
function computeByDay(logs: LoginLogEntry[]): Record<string, { success: number; failed: number }> {
  const byDay: Record<string, { success: number; failed: number }> = {}
  logs.forEach(log => {
    const day = log.timestamp.split('T')[0]
    if (!byDay[day]) {
      byDay[day] = { success: 0, failed: 0 }
    }
    if (log.status === LoginStatus.SUCCESS) {
      byDay[day].success++
    } else {
      byDay[day].failed++
    }
  })
  return byDay
}

// 计算统计数据
function computeStats(logs: LoginLogEntry[]): LoginStats {
  const total = logs.length
  const success = logs.filter(l => l.status === LoginStatus.SUCCESS).length
  const failed = logs.filter(l => l.status !== LoginStatus.SUCCESS).length
  const locked = logs.filter(l => l.status === LoginStatus.LOCKED).length
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0

  // 计算今日活跃用户
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter(l => l.timestamp.startsWith(today))
  const todayActiveUsers = new Set(todayLogs.map(l => l.userId)).size || Math.floor(Math.random() * 20) + 5

  const byDay = computeByDay(logs)

  // 计算失败次数最多的用户
  const failedByUser: Record<string, { userId: string; userName: string; count: number }> = {}
  logs.filter(l => l.status === LoginStatus.FAILED).forEach(l => {
    if (!failedByUser[l.userId]) {
      failedByUser[l.userId] = { userId: l.userId, userName: l.userDisplayName, count: 0 }
    }
    failedByUser[l.userId].count++
  })
  const topFailedUsers = Object.values(failedByUser)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 最近的失败登录
  const recentFailedLogins = logs
    .filter(l => l.status === LoginStatus.FAILED)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return {
    total,
    success,
    failed,
    locked,
    successRate,
    todayActiveUsers,
    byDay,
    topFailedUsers,
    recentFailedLogins,
  }
}

// 模拟API延迟
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 登录日志 API
export const loginLogApi = {
  getLoginLogs: async (filter?: Partial<LoginLogFilter>): Promise<LoginLogResponse> => {
    await delay()
    let filtered = [...mockLoginLogs]

    if (filter?.status) {
      filtered = filtered.filter(l => l.status === filter.status)
    }
    if (filter?.loginType) {
      filtered = filtered.filter(l => l.loginType === filter.loginType)
    }
    if (filter?.search) {
      const search = filter.search.toLowerCase()
      filtered = filtered.filter(
        l =>
          l.userName.toLowerCase().includes(search) ||
          l.userDisplayName.toLowerCase().includes(search) ||
          l.userEmail.toLowerCase().includes(search) ||
          l.ipAddress.includes(search)
      )
    }
    if (filter?.startDate) {
      filtered = filtered.filter(l => l.timestamp >= filter.startDate!)
    }
    if (filter?.endDate) {
      filtered = filtered.filter(l => l.timestamp <= filter.endDate!)
    }

    // 排序（最新在前）
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const page = filter?.page || 1
    const pageSize = filter?.pageSize || 20
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return {
      data,
      total: filtered.length,
      page,
      pageSize,
    }
  },

  getLoginStats: async (): Promise<LoginStats> => {
    await delay(200)
    return computeStats(mockLoginLogs)
  },

  exportLoginLogs: async (filter?: Partial<LoginLogFilter>): Promise<{ downloadUrl: string }> => {
    await delay(500)
    console.log('Export login logs with filter:', filter)
    return { downloadUrl: '/downloads/login-logs.xlsx' }
  },
}
