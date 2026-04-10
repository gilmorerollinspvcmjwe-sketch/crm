import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-service';
import type { User } from '@/types';

// 获取用户列表
export function useUsers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiService.get<User[]>('/users', { params }),
  });
}

// 获取单个用户
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiService.get<User>(`/users/${id}`),
    enabled: !!id,
  });
}

// 创建用户
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => apiService.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// 更新用户
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      apiService.put<User>(`/users/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

// 删除用户
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// 重置用户密码
export function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => apiService.post(`/users/${id}/reset-password`),
  });
}

// 更新用户状态
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) =>
      apiService.put(`/users/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// 获取用户角色
export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: () => apiService.get<string[]>(`/users/${userId}/roles`),
    enabled: !!userId,
  });
}

// 分配用户角色
export function useAssignUserRoles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      apiService.put(`/users/${userId}/roles`, { roleIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
    },
  });
}

// 获取当前用户信息
export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => apiService.get<User>('/users/me'),
  });
}

// 更新当前用户信息
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => apiService.put<User>('/users/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}