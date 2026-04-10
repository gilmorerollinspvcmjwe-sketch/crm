/**
 * Call Center TanStack Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { callcenterApi } from '@/services/callcenterService'
import { queryKeys } from '@/lib/query-client'
import type {
  OutboundTaskListParams,
  CallScript,
  CreateOutboundTaskData,
  UpdateOutboundTaskData,
} from '@/services/callcenterService'

// ============================================================
// Hooks - Outbound Tasks
// ============================================================

/**
 * Fetch outbound task list
 */
export function useOutboundTasks(params?: OutboundTaskListParams) {
  return useQuery({
    queryKey: queryKeys.callcenter.tasks.list(params || {}),
    queryFn: () => callcenterApi.getTaskList(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single outbound task by ID
 */
export function useOutboundTask(id: string | null) {
  return useQuery({
    queryKey: queryKeys.callcenter.tasks.detail(id || ''),
    queryFn: () => callcenterApi.getTaskById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new outbound task
 */
export function useCreateOutboundTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOutboundTaskData) => callcenterApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.stats() })
    },
  })
}

/**
 * Update an existing outbound task
 */
export function useUpdateOutboundTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateOutboundTaskData) =>
      callcenterApi.updateTask(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.callcenter.tasks.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.stats() })
    },
  })
}

/**
 * Delete an outbound task
 */
export function useDeleteOutboundTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => callcenterApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.stats() })
    },
  })
}

/**
 * Get task status options
 */
export function useOutboundTaskStatusOptions() {
  return useQuery({
    queryKey: [...queryKeys.callcenter.tasks.all, 'statusOptions'],
    queryFn: () => callcenterApi.getTaskStatusOptions(),
    staleTime: Infinity,
  })
}

// ============================================================
// Hooks - Call Records
// ============================================================

/**
 * Fetch call records by task
 */
export function useCallRecords(taskId: string | null) {
  return useQuery({
    queryKey: queryKeys.callcenter.records(taskId || ''),
    queryFn: () => callcenterApi.getCallRecordsByTask(taskId!),
    enabled: !!taskId,
  })
}

// ============================================================
// Hooks - Call Scripts
// ============================================================

/**
 * Fetch all call scripts
 */
export function useCallScripts() {
  return useQuery({
    queryKey: queryKeys.callcenter.scripts.lists(),
    queryFn: () => callcenterApi.getScripts(),
  })
}

/**
 * Fetch a single call script by ID
 */
export function useCallScript(id: string | null) {
  return useQuery({
    queryKey: queryKeys.callcenter.scripts.detail(id || ''),
    queryFn: () => callcenterApi.getScriptById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new call script
 */
export function useCreateCallScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<CallScript, 'id' | 'version' | 'createdAt' | 'updatedAt'>) =>
      callcenterApi.createScript(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.scripts.lists() })
    },
  })
}

/**
 * Update an existing call script
 */
export function useUpdateCallScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CallScript>) =>
      callcenterApi.updateScript(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.callcenter.scripts.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.scripts.lists() })
    },
  })
}

/**
 * Delete a call script
 */
export function useDeleteCallScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => callcenterApi.deleteScript(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callcenter.scripts.lists() })
    },
  })
}

// ============================================================
// Hooks - Statistics
// ============================================================

/**
 * Fetch call center statistics
 */
export function useCallCenterStats() {
  return useQuery({
    queryKey: queryKeys.callcenter.stats(),
    queryFn: () => callcenterApi.getStats(),
  })
}

// Export API for direct usage
export { callcenterApi }