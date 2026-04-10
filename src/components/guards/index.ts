/**
 * Guards 组件导出
 */

export { AuthGuard, AuthProvider } from './AuthGuard'

// 从 authStore 导出认证 hooks
export { useAuthStore, checkPermission } from '@/store/authStore'
export type { User, AuthState } from '@/store/authStore'