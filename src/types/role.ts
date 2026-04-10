/**
 * 角色管理类型定义
 * 与 @/types/permission 的 Permission / DataScope 配合使用
 */

import type { DataScope } from "./permission"
export { PERMISSION_MODULES, PERMISSION_ACTIONS, PermissionType as ActionPermissionType } from "./permission"

// ============ 角色状态 ============

export enum RoleStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  FROZEN = "frozen",
}

// ============ 权限定义 ============

export interface Permission {
  id: string
  name: string
  code: string
  type: PermissionElementType
  sort: number
  children?: Permission[]
}

/** 权限元素类型（菜单、按钮、列、API） */
export enum PermissionElementType {
  MENU = "menu",
  BUTTON = "button",
  COLUMN = "column",
  API = "api",
}

// Permission modules are now exported from ./permission to avoid duplication
export type { PermissionModuleId } from "./permission"

// ============ 用户类型 ============

export type UserStatus = 'active' | 'inactive' | 'frozen'

export interface User {
  id: string
  username: string
  name: string
  email: string
  department?: string
  position?: string
  roleIds: string[]
  status: UserStatus
  createdAt: string
  updatedAt?: string
  avatar?: string
  phone?: string
}

// ============ 角色成员 ============

export interface RoleMember {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  department?: string
  roleId: string
  assignedAt: string
  assignedBy?: string
}

// ============ 角色 ============

export interface Role {
  id: string
  name: string
  code: string
  description?: string
  /** 权限 ID 列表，支持菜单级和按钮级混合 */
  permissions: string[]
  /** 数据权限范围 */
  dataScope: DataScope
  /** 是否系统内置角色（不可删除） */
  isSystem: boolean
  /** 是否启用 */
  isActive?: boolean
  /** 排序值，数字越小越靠前 */
  sort?: number
  /** 备注 */
  remark?: string
  createdAt: string
  updatedAt: string
  members?: RoleMember[]
}

// ============ 创建角色请求 ============

export interface CreateRoleRequest {
  name: string
  code: string
  description?: string
  permissions: string[]
  dataScope: DataScope
  isActive?: boolean
  sort?: number
  remark?: string
}

// ============ 更新角色请求 ============

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string
}
