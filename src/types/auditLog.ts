/**
 * 审计日志类型定义
 * Audit Log Type Definitions
 */

// 操作类型
export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
  ASSIGN = 'assign',
  STATUS_CHANGE = 'statusChange',
}

// 操作类型映射
export const AUDIT_ACTION_MAP: Record<AuditAction, { label: string; color: string }> = {
  [AuditAction.CREATE]: { label: '创建', color: 'green' },
  [AuditAction.UPDATE]: { label: '更新', color: 'blue' },
  [AuditAction.DELETE]: { label: '删除', color: 'red' },
  [AuditAction.VIEW]: { label: '查看', color: 'default' },
  [AuditAction.LOGIN]: { label: '登录', color: 'cyan' },
  [AuditAction.LOGOUT]: { label: '登出', color: 'orange' },
  [AuditAction.EXPORT]: { label: '导出', color: 'purple' },
  [AuditAction.IMPORT]: { label: '导入', color: 'purple' },
  [AuditAction.ASSIGN]: { label: '分配', color: 'geekblue' },
  [AuditAction.STATUS_CHANGE]: { label: '状态变更', color: 'gold' },
}

// 模块类型
export enum AuditModule {
  CUSTOMER = 'customer',
  CONTACT = 'contact',
  LEAD = 'lead',
  OPPORTUNITY = 'opportunity',
  ORDER = 'order',
  CONTRACT = 'contract',
  PRODUCT = 'product',
  PRICEBOOK = 'pricebook',
  QUOTE = 'quote',
  PAYMENT = 'payment',
  ACTIVITY = 'activity',
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  SETTINGS = 'settings',
  WORKFLOW = 'workflow',
  CUSTOM_OBJECT = 'custom_object',
  REPORT = 'report',
  SYSTEM = 'system',
}

// 模块映射
export const AUDIT_MODULE_MAP: Record<AuditModule, string> = {
  [AuditModule.CUSTOMER]: '客户',
  [AuditModule.CONTACT]: '联系人',
  [AuditModule.LEAD]: '线索',
  [AuditModule.OPPORTUNITY]: '商机',
  [AuditModule.ORDER]: '订单',
  [AuditModule.CONTRACT]: '合同',
  [AuditModule.PRODUCT]: '产品',
  [AuditModule.PRICEBOOK]: '价格手册',
  [AuditModule.QUOTE]: '报价',
  [AuditModule.PAYMENT]: '回款',
  [AuditModule.ACTIVITY]: '活动',
  [AuditModule.USER]: '用户',
  [AuditModule.ROLE]: '角色',
  [AuditModule.PERMISSION]: '权限',
  [AuditModule.SETTINGS]: '设置',
  [AuditModule.WORKFLOW]: '工作流',
  [AuditModule.CUSTOM_OBJECT]: '自定义对象',
  [AuditModule.REPORT]: '报表',
  [AuditModule.SYSTEM]: '系统',
}

// 审计日志变更详情
export interface AuditLogChange {
  field: string;
  fieldLabel?: string;
  oldValue?: string | null;
  newValue?: string | null;
}

// 审计日志条目
export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  module: AuditModule;
  recordId?: string;
  recordName?: string;
  objectType?: string;
  description: string;
  userId: string;
  userName: string;
  operator?: string; // 别名 for userName
  ipAddress: string;
  userAgent?: string;
  result?: 'success' | 'failure';
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  details?: AuditLogChange[];
  timestamp: string;
  createdAt?: string;
}

// 筛选条件
export interface AuditLogFilter {
  action?: AuditAction;
  module?: AuditModule;
  userId?: string;
  operator?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  result?: 'success' | 'failure';
  page?: number;
  pageSize?: number;
}

// 统计数据
export interface AuditStats {
  total: number;
  todayTotal: number;
  byAction: Record<AuditAction, number>;
  byModule: Record<AuditModule, number>;
  recentActivity: AuditLogEntry[];
}

// 审计日志响应
export interface AuditLogResponse {
  data: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}

// 审计日志设置
export interface AuditLogSettings {
  logLogin: boolean;
  logOperations: boolean;
  logDataChanges: boolean;
  logExports: boolean;
  retentionDays: number;
  includeDetails: boolean;
  autoArchive: boolean;
  totalLogs?: number;
  logsToday?: number;
  storageUsed?: string;
}
