import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import type { AuditLog } from '@/types/auditLog';

// 获取审计日志列表
export function useAuditLogs(params?: {
  page?: number;
  pageSize?: number;
  userId?: string;
  action?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => apiService.get<AuditLog[]>('/audit-logs', { params }),
  });
}

// 获取单个审计日志
export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ['audit-log', id],
    queryFn: () => apiService.get<AuditLog>(`/audit-logs/${id}`),
    enabled: !!id,
  });
}

// 获取审计日志统计
export function useAuditLogStats(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}) {
  return useQuery({
    queryKey: ['audit-log-stats', params],
    queryFn: () =>
      apiService.get<{
        total: number;
        byAction: Record<string, number>;
        byModule: Record<string, number>;
        byUser: { userId: string; userName: string; count: number }[];
        timeline: { date: string; count: number }[];
      }>('/audit-logs/stats', { params }),
  });
}

// 获取用户活动历史
export function useUserActivityHistory(userId: string, params?: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['user-activity-history', userId, params],
    queryFn: () => apiService.get<AuditLog[]>(`/users/${userId}/activity`, { params }),
    enabled: !!userId,
  });
}

// 导出审计日志
export function useExportAuditLogs(params?: {
  userId?: string;
  action?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
  format?: 'csv' | 'xlsx';
}) {
  return useQuery({
    queryKey: ['export-audit-logs', params],
    queryFn: () =>
      apiService.get<Blob>('/audit-logs/export', {
        params,
        responseType: 'blob',
      }),
    enabled: false, // 手动触发
  });
}

// 获取操作类型列表
export function useAuditActionTypes() {
  return useQuery({
    queryKey: ['audit-action-types'],
    queryFn: () =>
      apiService.get<
        { value: string; label: string; category: string }[]
      >('/audit-logs/action-types'),
  });
}

// 获取模块列表
export function useAuditModules() {
  return useQuery({
    queryKey: ['audit-modules'],
    queryFn: () => apiService.get<string[]>('/audit-logs/modules'),
  });
}