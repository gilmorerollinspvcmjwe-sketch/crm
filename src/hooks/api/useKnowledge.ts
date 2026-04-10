/**
 * Knowledge Base TanStack Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { knowledgeApi } from '@/services/knowledgeService'
import { queryKeys } from '@/lib/query-client'
import type {
  KnowledgeDocumentListParams,
  KnowledgeCategory,
  SearchRequest,
  CreateKnowledgeDocumentData,
  UpdateKnowledgeDocumentData,
} from '@/services/knowledgeService'

// ============================================================
// Hooks - Search
// ============================================================

/**
 * Execute knowledge search (RAG)
 */
export function useKnowledgeSearch(request: SearchRequest | null) {
  return useQuery({
    queryKey: queryKeys.knowledge.search(request?.query || ''),
    queryFn: () => knowledgeApi.search(request!),
    enabled: !!request?.query,
  })
}

/**
 * Execute search mutation (for one-time searches)
 */
export function useKnowledgeSearchMutation() {
  return useMutation({
    mutationFn: (request: SearchRequest) => knowledgeApi.search(request),
  })
}

// ============================================================
// Hooks - Documents
// ============================================================

/**
 * Fetch paginated document list
 */
export function useKnowledgeDocuments(params?: KnowledgeDocumentListParams) {
  return useQuery({
    queryKey: queryKeys.knowledge.documents.list(params || {}),
    queryFn: () => knowledgeApi.getDocuments(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single document by ID
 */
export function useKnowledgeDocument(id: string | null) {
  return useQuery({
    queryKey: queryKeys.knowledge.documents.detail(id || ''),
    queryFn: () => knowledgeApi.getDocumentById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch popular documents
 */
export function usePopularKnowledgeDocuments(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.knowledge.documents.popular(),
    queryFn: () => knowledgeApi.getPopularDocuments(limit),
  })
}

/**
 * Create a new document
 */
export function useCreateKnowledgeDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateKnowledgeDocumentData) => knowledgeApi.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents.popular() })
    },
  })
}

/**
 * Update an existing document
 */
export function useUpdateKnowledgeDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateKnowledgeDocumentData) =>
      knowledgeApi.updateDocument(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.knowledge.documents.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents.popular() })
    },
  })
}

/**
 * Delete a document
 */
export function useDeleteKnowledgeDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => knowledgeApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents.popular() })
    },
  })
}

// ============================================================
// Hooks - Categories
// ============================================================

/**
 * Fetch all categories
 */
export function useKnowledgeCategories() {
  return useQuery({
    queryKey: queryKeys.knowledge.categories(),
    queryFn: () => knowledgeApi.getCategories(),
  })
}

/**
 * Create a new category
 */
export function useCreateKnowledgeCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<KnowledgeCategory, 'id' | 'documentCount'>) =>
      knowledgeApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.categories() })
    },
  })
}

/**
 * Update an existing category
 */
export function useUpdateKnowledgeCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<KnowledgeCategory>) =>
      knowledgeApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.categories() })
    },
  })
}

/**
 * Delete a category
 */
export function useDeleteKnowledgeCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => knowledgeApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.categories() })
    },
  })
}

/**
 * Get status options
 */
export function useKnowledgeStatusOptions() {
  return useQuery({
    queryKey: [...queryKeys.knowledge.all, 'statusOptions'],
    queryFn: () => knowledgeApi.getStatusOptions(),
    staleTime: Infinity,
  })
}

// Export API for direct usage
export { knowledgeApi }