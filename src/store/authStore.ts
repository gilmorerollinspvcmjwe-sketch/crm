/**
 * 认证状态管理 - 使用 Zustand 管理用户认证状态
 * 从 AuthContext 迁移而来
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 用户信息类型
interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

// 认证状态类型
interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  
  // Actions
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 初始状态 - 默认已认证（占位实现）
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        name: '管理员',
        email: 'admin@example.com',
        roles: ['admin'],
      },
      
      // 登录
      login: (user) => set({
        isAuthenticated: true,
        user,
        isLoading: false,
      }),
      
      // 登出
      logout: () => set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      }),
      
      // 设置加载状态
      setLoading: (loading) => set({ isLoading: loading }),
      
      // 更新用户信息
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
)

// 权限检查辅助函数
export function checkPermission(_permission: string, roles: string[]): boolean {
  // admin 角色拥有所有权限
  if (roles.includes('admin')) return true
  // 后续集成实际权限系统
  return false
}

// 导出类型
export type { User, AuthState }