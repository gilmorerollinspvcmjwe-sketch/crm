/**
 * 用户管理 Mock 数据
 * 包含 15 条用户数据，覆盖不同角色、部门和状态
 */

import type { Role } from '@/types/role'
import { DataScope } from '@/types/permission'

// ============ 用户接口 ============

export type UserStatus = 'active' | 'inactive' | 'frozen'
export type UserGender = 'male' | 'female'

export interface MockUser {
  id: string
  username: string
  email: string
  phone: string
  name: string
  avatar?: string
  gender?: UserGender
  department: string
  position: string
  roleIds: string[]
  roles?: Role[]
  status: UserStatus
  dataScope: DataScope
  managerId?: string
  managerName?: string
  hireDate?: string
  lastLoginAt?: string
  lastLoginIp?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  tags?: string[]
  notes?: string
}

// ============ 角色 Mock 数据 ============

export const mockRoles: Role[] = [
  {
    id: 'ROLE-001',
    name: '系统管理员',
    code: 'admin',
    description: '系统超级管理员，拥有所有权限',
    permissions: ['*'],
    dataScope: DataScope.ALL,
    isSystem: true,
    isActive: true,
    sort: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-002',
    name: '销售总监',
    code: 'sales_director',
    description: '销售部门负责人，管理全部销售数据',
    permissions: ['customer:*', 'opportunity:*', 'quote:*', 'contact:*', 'report:sales'],
    dataScope: DataScope.ALL,
    isSystem: false,
    isActive: true,
    sort: 2,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-003',
    name: '销售经理',
    code: 'sales_manager',
    description: '销售经理，管理本团队销售数据',
    permissions: ['customer:*', 'opportunity:*', 'quote:*', 'contact:*'],
    dataScope: DataScope.DEPARTMENT,
    isSystem: false,
    isActive: true,
    sort: 3,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-004',
    name: '销售代表',
    code: 'sales_rep',
    description: '销售代表，只能管理自己的客户和商机',
    permissions: ['customer:own', 'opportunity:own', 'quote:own', 'contact:own'],
    dataScope: DataScope.SELF,
    isSystem: false,
    isActive: true,
    sort: 4,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-005',
    name: '产品经理',
    code: 'product_manager',
    description: '产品经理，管理产品和报价',
    permissions: ['product:*', 'quote:*', 'report:product'],
    dataScope: DataScope.ALL,
    isSystem: false,
    isActive: true,
    sort: 5,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-006',
    name: '客服专员',
    code: 'service_rep',
    description: '客服专员，管理客户服务',
    permissions: ['customer:view', 'contact:view', 'service:*'],
    dataScope: DataScope.SELF,
    isSystem: false,
    isActive: true,
    sort: 6,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-007',
    name: '财务专员',
    code: 'finance_rep',
    description: '财务专员，管理合同和回款',
    permissions: ['contract:*', 'payment:*', 'report:finance'],
    dataScope: DataScope.ALL,
    isSystem: false,
    isActive: true,
    sort: 7,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-008',
    name: '普通用户',
    code: 'user',
    description: '普通用户，只读权限',
    permissions: ['customer:view', 'opportunity:view', 'product:view'],
    dataScope: DataScope.SELF,
    isSystem: true,
    isActive: true,
    sort: 8,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// ============ 部门配置 ============

export const departments = [
  '总经办',
  '销售部',
  '市场部',
  '产品部',
  '技术部',
  '客服部',
  '财务部',
  '人力资源部',
  '运营部',
]

export const positions = [
  '总经理',
  '副总经理',
  '总监',
  '经理',
  '主管',
  '专员',
  '助理',
]

// ============ Mock 数据 ============

export const mockUsers: MockUser[] = [
  {
    id: 'USER-001',
    username: 'admin',
    email: 'admin@crm.com',
    phone: '13800000001',
    name: '系统管理员',
    avatar: '/avatars/admin.png',
    gender: 'male',
    department: '总经办',
    position: '总经理',
    roleIds: ['ROLE-001'],
    roles: [mockRoles[0]],
    status: 'active',
    dataScope: DataScope.ALL,
    hireDate: '2020-01-01',
    lastLoginAt: '2024-03-22T09:00:00Z',
    lastLoginIp: '192.168.1.100',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-03-22T09:00:00Z',
    createdBy: 'system',
    tags: ['管理员', '超级用户'],
  },
  {
    id: 'USER-002',
    username: 'zhangsan',
    email: 'zhangsan@crm.com',
    phone: '13800000002',
    name: '张三',
    avatar: '/avatars/zhangsan.png',
    gender: 'male',
    department: '销售部',
    position: '总监',
    roleIds: ['ROLE-002'],
    roles: [mockRoles[1]],
    status: 'active',
    dataScope: DataScope.ALL,
    managerId: 'USER-001',
    managerName: '系统管理员',
    hireDate: '2020-03-01',
    lastLoginAt: '2024-03-22T08:30:00Z',
    lastLoginIp: '192.168.1.101',
    createdAt: '2020-03-01T00:00:00Z',
    updatedAt: '2024-03-22T08:30:00Z',
    createdBy: 'USER-001',
    tags: ['销售', '管理层'],
  },
  {
    id: 'USER-003',
    username: 'lisi',
    email: 'lisi@crm.com',
    phone: '13800000003',
    name: '李四',
    avatar: '/avatars/lisi.png',
    gender: 'female',
    department: '销售部',
    position: '经理',
    roleIds: ['ROLE-003'],
    roles: [mockRoles[2]],
    status: 'active',
    dataScope: DataScope.DEPARTMENT,
    managerId: 'USER-002',
    managerName: '张三',
    hireDate: '2020-06-01',
    lastLoginAt: '2024-03-22T08:00:00Z',
    lastLoginIp: '192.168.1.102',
    createdAt: '2020-06-01T00:00:00Z',
    updatedAt: '2024-03-22T08:00:00Z',
    createdBy: 'USER-002',
    tags: ['销售', '经理'],
  },
  {
    id: 'USER-004',
    username: 'wangwu',
    email: 'wangwu@crm.com',
    phone: '13800000004',
    name: '王五',
    avatar: '/avatars/wangwu.png',
    gender: 'male',
    department: '销售部',
    position: '主管',
    roleIds: ['ROLE-003'],
    roles: [mockRoles[2]],
    status: 'active',
    dataScope: DataScope.DEPARTMENT,
    managerId: 'USER-003',
    managerName: '李四',
    hireDate: '2021-01-01',
    lastLoginAt: '2024-03-21T18:00:00Z',
    lastLoginIp: '192.168.1.103',
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2024-03-21T18:00:00Z',
    createdBy: 'USER-003',
    tags: ['销售', '主管'],
  },
  {
    id: 'USER-005',
    username: 'zhaoliu',
    email: 'zhaoliu@crm.com',
    phone: '13800000005',
    name: '赵六',
    avatar: '/avatars/zhaoliu.png',
    gender: 'female',
    department: '销售部',
    position: '专员',
    roleIds: ['ROLE-004'],
    roles: [mockRoles[3]],
    status: 'active',
    dataScope: DataScope.SELF,
    managerId: 'USER-004',
    managerName: '王五',
    hireDate: '2021-06-01',
    lastLoginAt: '2024-03-22T09:00:00Z',
    lastLoginIp: '192.168.1.104',
    createdAt: '2021-06-01T00:00:00Z',
    updatedAt: '2024-03-22T09:00:00Z',
    createdBy: 'USER-004',
    tags: ['销售', '销售代表'],
  },
  {
    id: 'USER-006',
    username: 'sunqi',
    email: 'sunqi@crm.com',
    phone: '13800000006',
    name: '孙七',
    avatar: '/avatars/sunqi.png',
    gender: 'male',
    department: '销售部',
    position: '专员',
    roleIds: ['ROLE-004'],
    roles: [mockRoles[3]],
    status: 'active',
    dataScope: DataScope.SELF,
    managerId: 'USER-004',
    managerName: '王五',
    hireDate: '2022-01-01',
    lastLoginAt: '2024-03-21T17:30:00Z',
    lastLoginIp: '192.168.1.105',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2024-03-21T17:30:00Z',
    createdBy: 'USER-004',
    tags: ['销售', '销售代表'],
  },
  {
    id: 'USER-007',
    username: 'zhouba',
    email: 'zhouba@crm.com',
    phone: '13800000007',
    name: '周八',
    avatar: '/avatars/zhouba.png',
    gender: 'female',
    department: '产品部',
    position: '经理',
    roleIds: ['ROLE-005'],
    roles: [mockRoles[4]],
    status: 'active',
    dataScope: DataScope.ALL,
    managerId: 'USER-001',
    managerName: '系统管理员',
    hireDate: '2020-09-01',
    lastLoginAt: '2024-03-22T08:45:00Z',
    lastLoginIp: '192.168.1.106',
    createdAt: '2020-09-01T00:00:00Z',
    updatedAt: '2024-03-22T08:45:00Z',
    createdBy: 'USER-001',
    tags: ['产品', '经理'],
  },
  {
    id: 'USER-008',
    username: 'wujiu',
    email: 'wujiu@crm.com',
    phone: '13800000008',
    name: '吴九',
    avatar: '/avatars/wujiu.png',
    gender: 'male',
    department: '产品部',
    position: '专员',
    roleIds: ['ROLE-005'],
    roles: [mockRoles[4]],
    status: 'active',
    dataScope: DataScope.ALL,
    managerId: 'USER-007',
    managerName: '周八',
    hireDate: '2021-03-01',
    lastLoginAt: '2024-03-21T18:30:00Z',
    lastLoginIp: '192.168.1.107',
    createdAt: '2021-03-01T00:00:00Z',
    updatedAt: '2024-03-21T18:30:00Z',
    createdBy: 'USER-007',
    tags: ['产品', '产品专员'],
  },
  {
    id: 'USER-009',
    username: 'zhengshi',
    email: 'zhengshi@crm.com',
    phone: '13800000009',
    name: '郑十',
    avatar: '/avatars/zhengshi.png',
    gender: 'female',
    department: '客服部',
    position: '主管',
    roleIds: ['ROLE-006'],
    roles: [mockRoles[5]],
    status: 'active',
    dataScope: DataScope.SELF,
    managerId: 'USER-001',
    managerName: '系统管理员',
    hireDate: '2021-06-01',
    lastLoginAt: '2024-03-22T09:15:00Z',
    lastLoginIp: '192.168.1.108',
    createdAt: '2021-06-01T00:00:00Z',
    updatedAt: '2024-03-22T09:15:00Z',
    createdBy: 'USER-001',
    tags: ['客服', '主管'],
  },
  {
    id: 'USER-010',
    username: 'wangyi',
    email: 'wangyi@crm.com',
    phone: '13800000010',
    name: '王十一',
    avatar: '/avatars/wangyi.png',
    gender: 'male',
    department: '客服部',
    position: '专员',
    roleIds: ['ROLE-006'],
    roles: [mockRoles[5]],
    status: 'active',
    dataScope: DataScope.SELF,
    managerId: 'USER-009',
    managerName: '郑十',
    hireDate: '2022-03-01',
    lastLoginAt: '2024-03-21T17:00:00Z',
    lastLoginIp: '192.168.1.109',
    createdAt: '2022-03-01T00:00:00Z',
    updatedAt: '2024-03-21T17:00:00Z',
    createdBy: 'USER-009',
    tags: ['客服', '客服专员'],
  },
  {
    id: 'USER-011',
    username: 'linger',
    email: 'linger@crm.com',
    phone: '13800000011',
    name: '凌十二',
    avatar: '/avatars/linger.png',
    gender: 'female',
    department: '财务部',
    position: '经理',
    roleIds: ['ROLE-007'],
    roles: [mockRoles[6]],
    status: 'active',
    dataScope: DataScope.ALL,
    managerId: 'USER-001',
    managerName: '系统管理员',
    hireDate: '2020-06-01',
    lastLoginAt: '2024-03-22T08:15:00Z',
    lastLoginIp: '192.168.1.110',
    createdAt: '2020-06-01T00:00:00Z',
    updatedAt: '2024-03-22T08:15:00Z',
    createdBy: 'USER-001',
    tags: ['财务', '经理'],
  },
  {
    id: 'USER-012',
    username: 'qisan',
    email: 'qisan@crm.com',
    phone: '13800000012',
    name: '戚十三',
    avatar: '/avatars/qisan.png',
    gender: 'male',
    department: '财务部',
    position: '专员',
    roleIds: ['ROLE-007'],
    roles: [mockRoles[6]],
    status: 'active',
    dataScope: DataScope.ALL,
    managerId: 'USER-011',
    managerName: '凌十二',
    hireDate: '2021-09-01',
    lastLoginAt: '2024-03-21T16:30:00Z',
    lastLoginIp: '192.168.1.111',
    createdAt: '2021-09-01T00:00:00Z',
    updatedAt: '2024-03-21T16:30:00Z',
    createdBy: 'USER-011',
    tags: ['财务', '财务专员'],
  },
  {
    id: 'USER-013',
    username: 'lisi_inactive',
    email: 'lisi.inactive@crm.com',
    phone: '13800000013',
    name: '李四（离职）',
    avatar: '/avatars/default.png',
    gender: 'male',
    department: '销售部',
    position: '专员',
    roleIds: ['ROLE-004'],
    roles: [mockRoles[3]],
    status: 'inactive',
    dataScope: DataScope.SELF,
    hireDate: '2021-01-01',
    lastLoginAt: '2023-12-31T18:00:00Z',
    lastLoginIp: '192.168.1.112',
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'USER-003',
    tags: ['离职'],
    notes: '已离职，账号已禁用',
  },
  {
    id: 'USER-014',
    username: 'test_user',
    email: 'test@crm.com',
    phone: '13800000014',
    name: '测试用户',
    avatar: '/avatars/default.png',
    gender: 'male',
    department: '技术部',
    position: '专员',
    roleIds: ['ROLE-008'],
    roles: [mockRoles[7]],
    status: 'active',
    dataScope: DataScope.SELF,
    hireDate: '2023-01-01',
    lastLoginAt: '2024-03-20T10:00:00Z',
    lastLoginIp: '192.168.1.113',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    createdBy: 'USER-001',
    tags: ['测试'],
    notes: '测试用途账号',
  },
  {
    id: 'USER-015',
    username: 'frozen_user',
    email: 'frozen@crm.com',
    phone: '13800000015',
    name: '冻结用户',
    avatar: '/avatars/default.png',
    gender: 'female',
    department: '市场部',
    position: '专员',
    roleIds: ['ROLE-008'],
    roles: [mockRoles[7]],
    status: 'frozen',
    dataScope: DataScope.SELF,
    hireDate: '2022-06-01',
    lastLoginAt: '2024-02-01T10:00:00Z',
    lastLoginIp: '192.168.1.114',
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2024-02-01T12:00:00Z',
    createdBy: 'USER-001',
    tags: ['冻结'],
    notes: '违规操作，账号已冻结',
  },
]

// ============ 辅助函数 ============

export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getUserByUsername(username: string): MockUser | undefined {
  return mockUsers.find((u) => u.username === username)
}

export function getAllUsers(): MockUser[] {
  return [...mockUsers]
}

export function getUsersByDepartment(department: string): MockUser[] {
  return mockUsers.filter((u) => u.department === department)
}

export function getUsersByStatus(status: UserStatus): MockUser[] {
  return mockUsers.filter((u) => u.status === status)
}

export function getActiveUsers(): MockUser[] {
  return mockUsers.filter((u) => u.status === 'active')
}

export function getUserStats() {
  const total = mockUsers.length
  const active = mockUsers.filter((u) => u.status === 'active').length
  const inactive = mockUsers.filter((u) => u.status === 'inactive').length
  const frozen = mockUsers.filter((u) => u.status === 'frozen').length
  
  const deptStats: Record<string, number> = {}
  mockUsers.forEach(u => {
    deptStats[u.department] = (deptStats[u.department] || 0) + 1
  })
  
  return {
    total,
    active,
    inactive,
    frozen,
    departments: deptStats,
  }
}

export function getAllRoles(): Role[] {
  return [...mockRoles]
}

export function getRoleById(id: string): Role | undefined {
  return mockRoles.find((r) => r.id === id)
}
