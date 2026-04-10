/**
 * Login Log Hooks
 * 登录日志数据钩子
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loginLogApi } from '@/mock/loginLogData'
import type { LoginLogFilter, LoginStats, LoginLogResponse } from '@/types/loginLog'

// Query Keys
export const loginLogQueryKeys = {
  all: ['login-logs'] as const,
  logs: (filter?: LoginLogFilter) => [...loginLogQueryKeys.all, 'logs', filter] as const,
  stats: ['login-logs', 'stats'] as const,
}

// 获取登录日志列表
export function useLoginLogs(filter?: LoginLogFilter) {
  return useQuery<LoginLogResponse>({
    queryKey: loginLogQueryKeys.logs(filter),
    queryFn: () => loginLogApi.getLoginLogs(filter),
  })
}

// 获取登录日志统计
export function useLoginLogStats() {
  return useQuery<LoginStats>({
    queryKey: loginLogQueryKeys.stats,
    queryFn: () => loginLogApi.getLoginStats(),
  })
}

// 导出登录日志
export function useExportLoginLogs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (filter?: LoginLogFilter) => loginLogApi.exportLoginLogs(filter),
    onSuccess: () => {
      console.log('Login logs exported successfully')
    },
  })
}
