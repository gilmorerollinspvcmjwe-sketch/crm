import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { apiService } from '@/lib/api-service'
import type {
  CustomObject,
  CustomObjectDefinition,
  ObjectProperty,
  ObjectRecord,
  CustomObjectListParams,
  ObjectRecordListParams,
} from '@/types/customObject'

// ============================================================
// Custom Objects Hooks
// ============================================================

/**
 * Fetch custom objects list
 */
export function useCustomObjects(params?: CustomObjectListParams) {
  return useQuery({
    queryKey: queryKeys.customObjects.list(params || {}),
    queryFn: () => apiService.customObjects.list(params),
  })
}

/**
 * Fetch a single custom object definition by ID
 */
export function useCustomObject(id: string | null) {
  return useQuery({
    queryKey: queryKeys.customObjects.detail(id || ''),
    queryFn: () => apiService.customObjects.getById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch a custom object definition by name
 */
export function useCustomObjectByName(name: string | null) {
  return useQuery({
    queryKey: queryKeys.customObjects.byname(name || ''),
    queryFn: () => apiService.customObjects.getByname(name!),
    enabled: !!name,
  })
}

/**
 * Create a new custom object
 */
export function useCreateCustomObject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (object: Omit<CustomObject, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiService.customObjects.create(object),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customObjects.lists() })
    },
  })
}

/**
 * Update a custom object
 */
export function useUpdateCustomObject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CustomObject>) =>
      apiService.customObjects.update(id, data),
    onSuccess: (updatedObject) => {
      queryClient.setQueryData(
        queryKeys.customObjects.detail(updatedObject.id),
        (oldData: CustomObjectDefinition | undefined) =>
          oldData ? { ...oldData, ...updatedObject } : undefined
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.customObjects.lists() })
    },
  })
}

/**
 * Delete a custom object
 */
export function useDeleteCustomObject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.customObjects.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.customObjects.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.customObjects.lists() })
    },
  })
}

// ============================================================
// Object Properties Hooks
// ============================================================

/**
 * Fetch object properties
 */
export function useObjectProperties(objectId: string | null) {
  return useQuery({
    queryKey: queryKeys.customObjects.properties(objectId || ''),
    queryFn: () => apiService.customObjects.getProperties(objectId!),
    enabled: !!objectId,
  })
}

/**
 * Create a new property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objectId,
      property,
    }: {
      objectId: string
      property: Omit<ObjectProperty, 'id' | 'objectId' | 'createdAt'>
    }) => apiService.customObjects.createProperty(objectId, property),
    onSuccess: (_, { objectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.properties(objectId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.detail(objectId),
      })
    },
  })
}

/**
 * Update a property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objectId,
      propertyId,
      updates,
    }: {
      objectId: string
      propertyId: string
      updates: Partial<ObjectProperty>
    }) => apiService.customObjects.updateProperty(objectId, propertyId, updates),
    onSuccess: (_, { objectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.properties(objectId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.detail(objectId),
      })
    },
  })
}

/**
 * Delete a property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objectId,
      propertyId,
    }: {
      objectId: string
      propertyId: string
    }) => apiService.customObjects.deleteProperty(objectId, propertyId),
    onSuccess: (_, { objectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.properties(objectId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.detail(objectId),
      })
    },
  })
}

// ============================================================
// Object Records Hooks
// ============================================================

/**
 * Fetch object records list
 */
export function useObjectRecords(params: ObjectRecordListParams) {
  return useQuery({
    queryKey: queryKeys.customObjects.recordList(params.objectId, {
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
    }),
    queryFn: () => apiService.customObjects.getRecords(params),
    enabled: !!params.objectId,
  })
}

/**
 * Fetch a single object record
 */
export function useObjectRecord(objectId: string | null, recordId: string | null) {
  return useQuery({
    queryKey: queryKeys.customObjects.recordDetail(objectId || '', recordId || ''),
    queryFn: () => apiService.customObjects.getRecordById(objectId!, recordId!),
    enabled: !!objectId && !!recordId,
  })
}

/**
 * Create a new object record
 */
export function useCreateObjectRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objectId,
      data,
    }: {
      objectId: string
      data: Record<string, unknown>
    }) => apiService.customObjects.createRecord(objectId, data),
    onSuccess: (_, { objectId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.records(objectId),
      })
    },
  })
}

/**
 * Update an object record
 */
export function useUpdateObjectRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objectId,
      recordId,
      data,
    }: {
      objectId: string
      recordId: string
      data: Record<string, unknown>
    }) => apiService.customObjects.updateRecord(objectId, recordId, data),
    onSuccess: (updatedRecord, { objectId, recordId }) => {
      queryClient.setQueryData(
        queryKeys.customObjects.recordDetail(objectId, recordId),
        updatedRecord
      )
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.records(objectId),
      })
    },
  })
}

/**
 * Delete an object record
 */
export function useDeleteObjectRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      objectId,
      recordId,
    }: {
      objectId: string
      recordId: string
    }) => apiService.customObjects.deleteRecord(objectId, recordId),
    onSuccess: (_, { objectId, recordId }) => {
      queryClient.removeQueries({
        queryKey: queryKeys.customObjects.recordDetail(objectId, recordId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.customObjects.records(objectId),
      })
    },
  })
}

// ============================================================
// Export API for direct usage
// ============================================================
export const customObjectApi = apiService.customObjects