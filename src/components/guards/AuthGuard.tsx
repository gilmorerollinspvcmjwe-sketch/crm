/**
 * 路由守卫组件
 * Auth Guard Component
 * 
 * 用于保护需要认证的路由
 * 使用 Zustand authStore 管理认证状态
 */

import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore, checkPermission } from '@/store/authStore'

// 认证 Provider - 使用 Zustand，Provider 仅作为包装器保持 API 兼容
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Zustand store 已经自动初始化，这里只需要渲染 children
  // 保持 Provider 包装是为了向后兼容和未来可能的扩展
  return <>{children}</>
}

// 路由守卫属性
interface AuthGuardProps {
  children: React.ReactNode
  requiredPermission?: string
  fallbackPath?: string
}

/**
 * 路由守卫组件
 * 
 * @param children - 需要保护的内容
 * @param requiredPermission - 需要的权限标识（可选）
 * @param fallbackPath - 未认证时的跳转路径（默认为登录页）
 */
export function AuthGuard({ 
  children, 
  requiredPermission,
  fallbackPath = '/login'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }
  
  // 未认证，跳转到登录页
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }
  
  // 权限检查
  if (requiredPermission && user) {
    const hasPermission = checkPermission(requiredPermission, user.roles)
    
    if (!hasPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold">无访问权限</h2>
            <p className="text-muted-foreground mt-2">
              您没有权限访问此页面
            </p>
          </div>
        </div>
      )
    }
  }
  
  return <>{children}</>
}

export default AuthGuard