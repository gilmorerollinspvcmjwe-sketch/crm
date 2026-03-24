/**
 * 权限系统类型定义
 */

/** 权限类型枚举 */
export enum PermissionType {
  MENU = 'menu',
  BUTTON = 'button',
  DATA = 'data',
}

/** 数据权限范围枚举 */
export enum DataScope {
  ALL = '全部数据',
  DEPARTMENT = '部门数据',
  TEAM = '团队数据',
  SELF = '个人数据',
}

/** 权限项 */
export interface Permission {
  id: string;
  name: string;
  code: string; // 权限代码，用于按钮级控制
  type: PermissionType;
  parentId?: string;
  path?: string; // 菜单路径
  icon?: string;
  sort: number;
  children?: Permission[];
  checked?: boolean; // 用于树形选择
}

/** 角色 */
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[]; // 权限 ID 列表
  dataScope: DataScope;
  isSystem: boolean; // 是否系统预置角色
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

/** 用户角色分配 */
export interface UserRole {
  userId: string;
  userName: string;
  email: string;
  department: string;
  roleIds: string[];
  roleNames: string[];
}

/** 用户信息 */
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  roleIds: string[];
  createdAt: string;
}

/** 角色筛选条件 */
export interface RoleFilter {
  name?: string;
  isSystem?: boolean;
}

/** 用户筛选条件 */
export interface UserFilter {
  name?: string;
  department?: string;
  status?: 'active' | 'inactive';
}
