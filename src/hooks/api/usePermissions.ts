import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import type { Permission } from '@/types/role';

// Permission category for grouping permissions
export interface PermissionCategory {
  id: string;
  name: string;
  code: string;
}

// 获取权限列表
export function usePermissions(params?: {
  category?: string;
  module?: string;
}) {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => apiService.get<Permission[]>('/permissions', { params }),
  });
}

// 获取权限分类
export function usePermissionCategories() {
  return useQuery({
    queryKey: ['permission-categories'],
    queryFn: () => apiService.get<PermissionCategory[]>('/permissions/categories'),
  });
}

// 获取用户权限
export function useUserPermissions(userId: string) {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => apiService.get<Permission[]>(`/users/${userId}/permissions`),
    enabled: !!userId,
  });
}

// 检查权限
export function useCheckPermission(permission: string) {
  return useQuery({
    queryKey: ['check-permission', permission],
    queryFn: () => apiService.get<boolean>(`/permissions/check`, { params: { permission } }),
    enabled: !!permission,
  });
}

// 批量检查权限
export function useCheckPermissions(permissions: string[]) {
  return useQuery({
    queryKey: ['check-permissions', permissions],
    queryFn: () =>
      apiService.post<Record<string, boolean>>('/permissions/check-batch', { permissions }),
    enabled: permissions.length > 0,
  });
}

// 获取角色权限矩阵
export function usePermissionMatrix() {
  return useQuery({
    queryKey: ['permission-matrix'],
    queryFn: () =>
      apiService.get<{
        roles: { id: string; name: string }[];
        permissions: Permission[];
        matrix: Record<string, string[]>;
      }>('/permissions/matrix'),
  });
}

// 更新权限矩阵
export function useUpdatePermissionMatrix() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matrix: Record<string, string[]>) =>
      apiService.put('/permissions/matrix', { matrix }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permission-matrix'] });
    },
  });
}

// 获取模块列表
export function usePermissionModules() {
  return useQuery({
    queryKey: ['permission-modules'],
    queryFn: () => apiService.get<string[]>('/permissions/modules'),
  });
}

// 创建权限
export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Permission>) => apiService.post<Permission>('/permissions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}

// 更新权限
export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Permission> }) =>
      apiService.put<Permission>(`/permissions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}

// 删除权限
export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/permissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}