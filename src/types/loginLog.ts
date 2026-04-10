/**
 * Login Log Types
 * 登录日志类型定义
 */

// 登录状态
export enum LoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  LOCKED = 'locked',
  PASSWORD_EXPIRED = 'password_expired',
}

// 登录类型
export enum LoginType {
  NORMAL = 'normal',
  SSO = 'sso',
  OAUTH = 'oauth',
  API = 'api',
}

// 登录日志条目
export interface LoginLogEntry {
  id: string
  userId: string
  userName: string
  userDisplayName: string
  userEmail: string
  status: LoginStatus
  loginType: LoginType
  ipAddress: string
  location?: string
  device?: string
  browser?: string
  os?: string
  userAgent?: string
  failureReason?: string
  timestamp: string
}

// 筛选条件
export interface LoginLogFilter {
  status?: LoginStatus
  userId?: string
  loginType?: LoginType
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  pageSize?: number
}

// 统计数据
export interface LoginStats {
  total: number
  success: number
  failed: number
  locked: number
  successRate: number
  todayActiveUsers: number
  byDay: Record<string, { success: number; failed: number }>
  topFailedUsers: Array<{ userId: string; userName: string; count: number }>
  recentFailedLogins: LoginLogEntry[]
}

// 分页数据
export interface LoginLogResponse {
  data: LoginLogEntry[]
  total: number
  page: number
  pageSize: number
}

// 登录方式映射
export const loginMethodMap: Record<string, { label: string; color: string }> = {
  normal: { label: '密码', color: 'blue' },
  sso: { label: 'SSO', color: 'purple' },
  oauth: { label: 'OAuth', color: 'cyan' },
  api: { label: 'API', color: 'orange' },
}

// 状态映射
export const loginStatusMap: Record<LoginStatus, { label: string; color: string }> = {
  [LoginStatus.SUCCESS]: { label: '成功', color: 'success' },
  [LoginStatus.FAILED]: { label: '失败', color: 'destructive' },
  [LoginStatus.LOCKED]: { label: '锁定', color: 'warning' },
  [LoginStatus.PASSWORD_EXPIRED]: { label: '密码过期', color: 'secondary' },
}
