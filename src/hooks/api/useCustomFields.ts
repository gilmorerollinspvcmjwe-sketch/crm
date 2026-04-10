/**
 * Custom Field TanStack Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customFieldApi } from '@/services/customFieldService'
import { queryKeys } from '@/lib/query-client'
import type {
  ModuleType,
  CreateCustomFieldData,
  UpdateCustomFieldData,
  CreateOptionsSetData,
  UpdateOptionsSetData,
} from '@/services/customFieldService'

// ============================================================
// Hooks - Custom Fields
// ============================================================

/**
 * Fetch all custom fields (optionally filtered by module)
 */
export function useCustomFields(module?: ModuleType) {
  return useQuery({
    queryKey: queryKeys.customFields.list(module),
    queryFn: () => customFieldApi.getFields(module),
  })
}

/**
 * Fetch a single custom field by ID
 */
export function useCustomField(id: string | null) {
  return useQuery({
    queryKey: queryKeys.customFields.detail(id || ''),
    queryFn: () => customFieldApi.getFieldById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new custom field
 */
export function useCreateCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomFieldData) => customFieldApi.createField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.lists() })
    },
  })
}

/**
 * Update an existing custom field
 */
export function useUpdateCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateCustomFieldData) =>
      customFieldApi.updateField(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.customFields.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.lists() })
    },
  })
}

/**
 * Delete a custom field
 */
export function useDeleteCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customFieldApi.deleteField(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.lists() })
    },
  })
}

/**
 * Batch update field order
 */
export function useBatchUpdateFieldOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orders: { id: string; sortOrder: number }[]) =>
      customFieldApi.batchUpdateOrder(orders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.lists() })
    },
  })
}

// ============================================================
// Hooks - Field Values
// ============================================================

/**
 * Fetch field values for a record
 */
export function useCustomFieldValues(module: ModuleType | null, recordId: string | null) {
  return useQuery({
    queryKey: queryKeys.customFields.values(module || '', recordId || ''),
    queryFn: () => customFieldApi.getFieldValues(module!, recordId!),
    enabled: !!module && !!recordId,
  })
}

/**
 * Save field values for a record
 */
export function useSaveCustomFieldValues() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      module,
      recordId,
      values,
    }: {
      module: ModuleType
      recordId: string
      values: Record<string, unknown>
    }) => customFieldApi.saveFieldValues(module, recordId, values),
    onSuccess: (_, { module, recordId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customFields.values(module, recordId)
      })
    },
  })
}

// ============================================================
// Hooks - Options Sets
// ============================================================

/**
 * Fetch all options sets
 */
export function useOptionsSets() {
  return useQuery({
    queryKey: queryKeys.customFields.optionsSets.lists(),
    queryFn: () => customFieldApi.getOptionsSets(),
  })
}

/**
 * Fetch a single options set by ID
 */
export function useOptionsSet(id: string | null) {
  return useQuery({
    queryKey: queryKeys.customFields.optionsSets.detail(id || ''),
    queryFn: () => customFieldApi.getOptionsSetById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new options set
 */
export function useCreateOptionsSet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOptionsSetData) => customFieldApi.createOptionsSet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.optionsSets.lists() })
    },
  })
}

/**
 * Update an existing options set
 */
export function useUpdateOptionsSet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateOptionsSetData) =>
      customFieldApi.updateOptionsSet(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.customFields.optionsSets.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.optionsSets.lists() })
    },
  })
}

/**
 * Delete an options set
 */
export function useDeleteOptionsSet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customFieldApi.deleteOptionsSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customFields.optionsSets.lists() })
    },
  })
}

// ============================================================
// Hooks - Type/Module Options (Static)
// ============================================================

/**
 * Get field type options
 */
export function useFieldTypeOptions() {
  return useQuery({
    queryKey: [...queryKeys.customFields.all, 'typeOptions'],
    queryFn: () => customFieldApi.getTypeOptions(),
    staleTime: Infinity,
  })
}

/**
 * Get module options
 */
export function useFieldModuleOptions() {
  return useQuery({
    queryKey: [...queryKeys.customFields.all, 'moduleOptions'],
    queryFn: () => customFieldApi.getModuleOptions(),
    staleTime: Infinity,
  })
}

// Export API for direct usage
export { customFieldApi }