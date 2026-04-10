/**
 * 用户管理 Mock API Hooks
 * 提供用户列表、详情、创建、更新、删除的 React Query hooks
 * 
 * 基于 mocks/users.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserStatus } from '@/mocks/users'
import type { MockUser } from '@/mocks/users'
import type { Role } from '@/types/role'
import { 
  mockUsers, 
  mockRoles,
  getUserById, 
  getUserByUsername,
  getAllUsers,
  getUsersByDepartment,
  getUsersByStatus,
  getActiveUsers,
  getUserStats,
  getAllRoles,
  getRoleById,
} from '@/mocks/users'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let usersStore: MockUser[] = [...mockUsers]

function resetStore() {
  usersStore = [...mockUsers]
}

// ============ CRUD 操作 ============

const userCrud = {
  /**
   * 获取用户列表
   */
  async list(params?: {
    department?: string
    status?: UserStatus
    search?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: MockUser[]; total: number }> {
    await delay(300 + Math.random() * 200)
    
    let result = [...usersStore]
    
    if (params?.department) {
      result = result.filter(u => u.department === params.department)
    }
    
    if (params?.status) {
      result = result.filter(u => u.status === params.status)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.username.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.phone.includes(searchLower)
      )
    }
    
    // 排序
    if (params?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = params
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof MockUser]
        const bVal = b[sortBy as keyof MockUser]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return sortOrder === 'asc' ? 1 : -1
        if (bVal == null) return sortOrder === 'asc' ? -1 : 1
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    
    const total = result.length
    
    // 分页
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      result = result.slice(start, end)
    }
    
    return { data: result, total }
  },

  /**
   * 获取单个用户
   */
  async getById(id: string): Promise<MockUser | null> {
    await delay(200 + Math.random() * 100)
    return getUserById(id) ?? null
  },

  /**
   * 创建用户
   */
  async create(user: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockUser> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newUser: MockUser = {
      ...user,
      id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    }
    
    usersStore.push(newUser)
    return newUser
  },

  /**
   * 更新用户
   */
  async update(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    await delay(300 + Math.random() * 200)
    
    const index = usersStore.findIndex(u => u.id === id)
    if (index === -1) return null
    
    usersStore[index] = {
      ...usersStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    return usersStore[index]
  },

  /**
   * 删除用户
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = usersStore.findIndex(u => u.id === id)
    if (index === -1) return false
    
    usersStore.splice(index, 1)
    return true
  },

  /**
   * 批量删除用户
   */
  async batchDelete(ids: string[]): Promise<number> {
    await delay(400 + Math.random() * 200)
    
    let count = 0
    for (const id of ids) {
      const index = usersStore.findIndex(u => u.id === id)
      if (index !== -1) {
        usersStore.splice(index, 1)
        count++
      }
    }
    
    return count
  },

  /**
   * 激活用户
   */
  async activate(id: string): Promise<MockUser | null> {
    return this.update(id, { status: 'active' })
  },

  /**
   * 停用用户
   */
  async deactivate(id: string): Promise<MockUser | null> {
    return this.update(id, { status: 'inactive' })
  },

  /**
   * 冻结用户
   */
  async freeze(id: string, reason?: string): Promise<MockUser | null> {
    await delay(300)
    
    const index = usersStore.findIndex(u => u.id === id)
    if (index === -1) return null
    
    usersStore[index] = {
      ...usersStore[index],
      status: 'frozen',
      notes: reason || usersStore[index].notes,
      updatedAt: new Date().toISOString(),
    }
    
    return usersStore[index]
  },

  /**
   * 重置密码
   */
  async resetPassword(id: string, newPassword: string): Promise<boolean> {
    await delay(300)
    // Mock: 密码重置成功
    return true
  },

  /**
   * 获取用户统计
   */
  async getStats() {
    await delay(200)
    return getUserStats()
  },

  /**
   * 获取所有角色
   */
  async getRoles(): Promise<Role[]> {
    await delay(200)
    return getAllRoles()
  },

  /**
   * 分配角色
   */
  async assignRoles(id: string, roleIds: string[]): Promise<MockUser | null> {
    await delay(300)
    
    const index = usersStore.findIndex(u => u.id === id)
    if (index === -1) return null
    
    const roles = roleIds.map(rid => getRoleById(rid)).filter((r): r is Role => r !== undefined)
    
    usersStore[index] = {
      ...usersStore[index],
      roleIds,
      roles,
      updatedAt: new Date().toISOString(),
    }
    
    return usersStore[index]
  },

  /**
   * 记录登录
   */
  async recordLogin(id: string, ip: string): Promise<MockUser | null> {
    await delay(100)
    
    const index = usersStore.findIndex(u => u.id === id)
    if (index === -1) return null
    
    usersStore[index] = {
      ...usersStore[index],
      lastLoginAt: new Date().toISOString(),
      lastLoginIp: ip,
      updatedAt: new Date().toISOString(),
    }
    
    return usersStore[index]
  },
}

// ============ React Query Keys ============

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  roles: () => [...userKeys.all, 'roles'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取用户列表
 */
export function useUsers(params?: {
  department?: string
  status?: UserStatus
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userCrud.list(params),
  })
}

/**
 * 获取单个用户
 */
export function useUser(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id || ''),
    queryFn: () => userCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取活跃用户
 */
export function useActiveUsers() {
  return useQuery({
    queryKey: [...userKeys.all, 'active'],
    queryFn: () => ({ data: getActiveUsers(), total: getActiveUsers().length }),
  })
}

/**
 * 获取用户统计
 */
export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userCrud.getStats(),
  })
}

/**
 * 获取所有角色
 */
export function useRoles() {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: () => userCrud.getRoles(),
  })
}

/**
 * 创建用户
 */
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (user: Parameters<typeof userCrud.create>[0]) => 
      userCrud.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

/**
 * 更新用户
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockUser>) =>
      userCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * 删除用户
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => userCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

/**
 * 批量删除用户
 */
export function useBatchDeleteUsers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => userCrud.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

/**
 * 激活用户
 */
export function useActivateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => userCrud.activate(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * 停用用户
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => userCrud.deactivate(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * 冻结用户
 */
export function useFreezeUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      userCrud.freeze(id, reason),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * 重置密码
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      userCrud.resetPassword(id, newPassword),
  })
}

/**
 * 分配角色
 */
export function useAssignRoles() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) =>
      userCrud.assignRoles(id, roleIds),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.detail(data.id), data)
      }
    },
  })
}

/**
 * 记录登录
 */
export function useRecordLogin() {
  return useMutation({
    mutationFn: ({ id, ip }: { id: string; ip: string }) =>
      userCrud.recordLogin(id, ip),
  })
}

// ============ 导出配置 ============

export { departments, positions, UserGender } from '@/mocks/users'
export type { MockUser, UserStatus } from '@/mocks/users'
export type { Role } from '@/types/role'
