/**
 * Knowledge Base/RAG 知识库 Service
 * Handles knowledge documents, search, and categories
 */
import { http } from '@/lib/axios'
import { handleApiError } from './base'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

// ============================================================
// Types
// ============================================================

export type KnowledgeDocumentStatus = 'draft' | 'published' | 'archived'

export interface KnowledgeDocument {
  id: string
  title: string
  content?: string
  summary?: string
  categoryId?: string
  categoryName?: string
  tags?: string[]
  status: KnowledgeDocumentStatus
  version: number
  authorId: string
  authorName?: string
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface KnowledgeCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  order: number
  documentCount: number
}

export interface SearchResult {
  documentId: string
  documentTitle: string
  snippet: string
  score: number
  categoryId?: string
  categoryName?: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  took: number // milliseconds
}

export interface SearchRequest {
  query: string
  topK?: number
  categoryId?: string
  tags?: string[]
}

export interface KnowledgeDocumentListParams {
  status?: KnowledgeDocumentStatus
  categoryId?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface CreateKnowledgeDocumentData {
  title: string
  content?: string
  categoryId?: string
  tags?: string[]
  status?: KnowledgeDocumentStatus
}

export interface UpdateKnowledgeDocumentData {
  title?: string
  content?: string
  categoryId?: string
  tags?: string[]
  status?: KnowledgeDocumentStatus
}

// ============================================================
// API Functions
// ============================================================

const knowledgeApi = {
  // ================== Search ==================

  /**
   * Execute knowledge search (RAG)
   */
  search: async (request: SearchRequest): Promise<SearchResponse> => {
    try {
      const { data } = await http.post<ApiResponse<SearchResponse>>('/knowledge/search', request)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Documents ==================

  /**
   * Get document list
   */
  getDocuments: async (params?: KnowledgeDocumentListParams): Promise<PaginatedResponse<KnowledgeDocument>> => {
    try {
      const { data } = await http.get<PaginatedResponse<KnowledgeDocument>>('/knowledge/documents', { params })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get document by ID
   */
  getDocumentById: async (id: string): Promise<KnowledgeDocument> => {
    try {
      const { data } = await http.get<ApiResponse<KnowledgeDocument>>(`/knowledge/documents/${id}`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create document
   */
  createDocument: async (docData: CreateKnowledgeDocumentData): Promise<KnowledgeDocument> => {
    try {
      const { data } = await http.post<ApiResponse<KnowledgeDocument>>('/knowledge/documents', docData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update document
   */
  updateDocument: async (id: string, docData: UpdateKnowledgeDocumentData): Promise<KnowledgeDocument> => {
    try {
      const { data } = await http.patch<ApiResponse<KnowledgeDocument>>(`/knowledge/documents/${id}`, docData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete document
   */
  deleteDocument: async (id: string): Promise<void> => {
    try {
      await http.delete(`/knowledge/documents/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get popular documents
   */
  getPopularDocuments: async (limit: number = 10): Promise<KnowledgeDocument[]> => {
    try {
      const { data } = await http.get<ApiResponse<KnowledgeDocument[]>>('/knowledge/documents/popular', {
        params: { limit }
      })
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Categories ==================

  /**
   * Get all categories
   */
  getCategories: async (): Promise<KnowledgeCategory[]> => {
    try {
      const { data } = await http.get<ApiResponse<KnowledgeCategory[]>>('/knowledge/categories')
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create category
   */
  createCategory: async (categoryData: Omit<KnowledgeCategory, 'id' | 'documentCount'>): Promise<KnowledgeCategory> => {
    try {
      const { data } = await http.post<ApiResponse<KnowledgeCategory>>('/knowledge/categories', categoryData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update category
   */
  updateCategory: async (id: string, categoryData: Partial<KnowledgeCategory>): Promise<KnowledgeCategory> => {
    try {
      const { data } = await http.patch<ApiResponse<KnowledgeCategory>>(`/knowledge/categories/${id}`, categoryData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete category
   */
  deleteCategory: async (id: string): Promise<void> => {
    try {
      await http.delete(`/knowledge/categories/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Options ==================

  /**
   * Get status options
   */
  getStatusOptions: async (): Promise<{ value: KnowledgeDocumentStatus; label: string }[]> => {
    return [
      { value: 'draft', label: '草稿' },
      { value: 'published', label: '已发布' },
      { value: 'archived', label: '已归档' },
    ]
  },
}

// ============================================================
// Export
// ============================================================

export { knowledgeApi }
export default knowledgeApi