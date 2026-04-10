import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { apiService } from '@/lib/api-service'
import type {
  Workflow,
  WorkflowExecutionLog,
  WorkflowTemplate,
  WorkflowListParams,
  ExecutionLogListParams,
  WorkflowStatus,
} from '@/types/workflow'

// ============================================================
// Workflows Hooks
// ============================================================

/**
 * Fetch workflows list
 */
export function useWorkflows(params?: WorkflowListParams) {
  return useQuery({
    queryKey: queryKeys.workflows.list(params || {}),
    queryFn: () => apiService.workflows.list(params),
  })
}

/**
 * Fetch a single workflow by ID
 */
export function useWorkflow(id: string | null) {
  return useQuery({
    queryKey: queryKeys.workflows.detail(id || ''),
    queryFn: () => apiService.workflows.getById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch workflows for a specific object
 */
export function useWorkflowsByObject(objectId: string | null) {
  return useQuery({
    queryKey: queryKeys.workflows.list({ objectId: objectId || '' }),
    queryFn: () => apiService.workflows.list({ objectId: objectId! }),
    enabled: !!objectId,
  })
}

/**
 * Create a new workflow
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'failedCount'>
    ) => apiService.workflows.create(workflow),
    onSuccess: (newWorkflow) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.lists() })
      // Also invalidate object-specific list
      if (newWorkflow.objectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.workflows.list({ objectId: newWorkflow.objectId }),
        })
      }
    },
  })
}

/**
 * Update a workflow
 */
export function useUpdateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Workflow>) =>
      apiService.workflows.update(id, data),
    onSuccess: (updatedWorkflow) => {
      queryClient.setQueryData(
        queryKeys.workflows.detail(updatedWorkflow.id),
        updatedWorkflow
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.lists() })
    },
  })
}

/**
 * Delete a workflow
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.workflows.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.workflows.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.lists() })
    },
  })
}

/**
 * Activate a workflow
 */
export function useActivateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.workflows.activate(id),
    onSuccess: (updatedWorkflow) => {
      queryClient.setQueryData(
        queryKeys.workflows.detail(updatedWorkflow.id),
        updatedWorkflow
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.lists() })
    },
  })
}

/**
 * Deactivate a workflow
 */
export function useDeactivateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.workflows.deactivate(id),
    onSuccess: (updatedWorkflow) => {
      queryClient.setQueryData(
        queryKeys.workflows.detail(updatedWorkflow.id),
        updatedWorkflow
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.lists() })
    },
  })
}

/**
 * Toggle workflow status
 */
export function useToggleWorkflowStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: WorkflowStatus }) => {
      if (currentStatus === 'active') {
        return apiService.workflows.deactivate(id)
      } else {
        return apiService.workflows.activate(id)
      }
    },
    onSuccess: (updatedWorkflow) => {
      queryClient.setQueryData(
        queryKeys.workflows.detail(updatedWorkflow.id),
        updatedWorkflow
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.lists() })
    },
  })
}

// ============================================================
// Execution Logs Hooks
// ============================================================

/**
 * Fetch workflow execution logs
 */
export function useWorkflowExecutionLogs(params?: ExecutionLogListParams) {
  return useQuery({
    queryKey: queryKeys.workflows.logList(params || {}),
    queryFn: () => apiService.workflows.getExecutionLogs(params),
  })
}

/**
 * Fetch execution logs for a specific workflow
 */
export function useWorkflowLogs(workflowId: string | null) {
  return useQuery({
    queryKey: queryKeys.workflows.logList({ workflowId: workflowId || '' }),
    queryFn: () => apiService.workflows.getExecutionLogs({ workflowId: workflowId! }),
    enabled: !!workflowId,
  })
}

// ============================================================
// Templates Hooks
// ============================================================

/**
 * Fetch workflow templates
 */
export function useWorkflowTemplates() {
  return useQuery({
    queryKey: queryKeys.workflows.templates(),
    queryFn: () => apiService.workflows.getTemplates(),
  })
}

// ============================================================
// Export API for direct usage
// ============================================================
export const workflowApi = apiService.workflows