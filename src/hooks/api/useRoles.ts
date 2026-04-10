import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import type { Role, Permission } from '@/types/role';

// 获取角色列表
export function useRoles(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => apiService.get<Role[]>('/roles', { params }),
  });
}

// 获取单个角色
export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => apiService.get<Role>(`/roles/${id}`),
    enabled: !!id,
  });
}

// 创建角色
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Role>) => apiService.post<Role>('/roles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// 更新角色
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
      apiService.put<Role>(`/roles/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
    },
  });
}

// 删除角色
export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// 获取角色权限
export function useRolePermissions(roleId: string) {
  return useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: () => apiService.get<Permission[]>(`/roles/${roleId}/permissions`),
    enabled: !!roleId,
  });
}

// 更新角色权限
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: string[] }) =>
      apiService.put(`/roles/${roleId}/permissions`, { permissions }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] });
    },
  });
}

// 获取所有权限
export function useAllPermissions() {
  return useQuery({
    queryKey: ['all-permissions'],
    queryFn: () => apiService.get<Permission[]>('/permissions'),
  });
}