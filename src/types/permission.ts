/**
 * 权限管理类型定义
 * 用于权限矩阵、数据范围、字段级权限配置
 */

// ============ 权限模块与动作 ============

/** 权限类型 */
export enum PermissionType {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  EXPORT = 'export',
}

/** 权限模块配置 */
export const PERMISSION_MODULES = [
  { id: 'customer', name: '客户管理', icon: 'Building2' },
  { id: 'contact', name: '联系人', icon: 'User' },
  { id: 'lead', name: '线索管理', icon: 'Users' },
  { id: 'opportunity', name: '商机管理', icon: 'TrendingUp' },
  { id: 'contract', name: '合同管理', icon: 'FileText' },
  { id: 'order', name: '订单管理', icon: 'ShoppingCart' },
  { id: 'payment', name: '回款管理', icon: 'CreditCard' },
  { id: 'product', name: '产品管理', icon: 'Package' },
  { id: 'quote', name: '报价管理', icon: 'FileCode' },
  { id: 'report', name: '报表中心', icon: 'BarChart3' },
  { id: 'dashboard', name: '仪表盘', icon: 'LayoutDashboard' },
  { id: 'workflow', name: '工作流', icon: 'GitBranch' },
  { id: 'automation', name: '自动化', icon: 'Zap' },
  { id: 'ai', name: 'AI 功能', icon: 'Brain' },
  { id: 'system', name: '系统设置', icon: 'Settings' },
] as const

export type PermissionModuleId = typeof PERMISSION_MODULES[number]['id']

/** 权限动作配置 */
export const PERMISSION_ACTIONS = [
  { id: PermissionType.VIEW, name: '查看', shortName: '查' },
  { id: PermissionType.CREATE, name: '创建', shortName: '建' },
  { id: PermissionType.EDIT, name: '编辑', shortName: '改' },
  { id: PermissionType.DELETE, name: '删除', shortName: '删' },
  { id: PermissionType.EXPORT, name: '导出', shortName: '导' },
] as const

// ============ 权限配置 ============

/** 单个权限配置 */
export interface PermissionConfig {
  module: string
  permissions: {
    action: PermissionType
    allowed: boolean
  }[]
}

/** 权限矩阵 */
export interface PermissionMatrix {
  roleId: string
  roleName: string
  permissions: PermissionConfig[]
}

// ============ 数据范围配置 ============

export enum DataScope {
  ALL = 'all', // 全部数据
  DEPARTMENT = 'department', // 本部门数据
  SELF = 'self', // 仅自己的数据
  TEAM = 'team', // 团队数据
  CUSTOM = 'custom', // 自定义
}

/** 数据范围选项 */
export const DATA_SCOPE_OPTIONS = [
  { value: DataScope.ALL, label: '全部数据', desc: '可查看所有数据' },
  { value: DataScope.DEPARTMENT, label: '本部门数据', desc: '可查看本部门及下级部门数据' },
  { value: DataScope.TEAM, label: '团队数据', desc: '可查看本团队及下级团队数据' },
  { value: DataScope.SELF, label: '仅自己的数据', desc: '只能查看自己创建的数据' },
  { value: DataScope.CUSTOM, label: '自定义', desc: '根据自定义规则配置' },
]

// ============ 字段级权限 ============

/** 字段权限 */
export interface FieldPermission {
  field: string
  label: string
  visible: boolean
  editable: boolean
}

/** 模块字段权限 */
export interface ModuleFieldPermission {
  module: string
  moduleName: string
  fields: FieldPermission[]
}

/** 权限设置 */
export interface PermissionSettings {
  roleId: string
  dataScope: Record<string, DataScope> // 模块 -> 数据范围
  fieldPermissions: ModuleFieldPermission[]
}

// ============ 辅助类型 ============

/** 角色基本信息 */
export interface RoleBasic {
  id: string
  name: string
  code: string
  description?: string
  isSystem: boolean
}

/** 权限变更记录 */
export interface PermissionChange {
  roleId: string
  module: string
  action: PermissionType
  oldValue: boolean
  newValue: boolean
}

/** 保存权限请求 */
export interface SavePermissionRequest {
  roleId: string
  matrix: PermissionMatrix
  dataScope: Record<string, DataScope>
  fieldPermissions: ModuleFieldPermission[]
}
