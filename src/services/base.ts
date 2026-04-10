/**
 * Base Service Configuration
 * Provides common utilities for all service modules
 */
import { http } from '@/lib/axios'
import type { ApiResponse, PaginatedResponse, ApiError } from '@/types/api'

// ============================================================
// Types
// ============================================================

export interface ServiceOptions {
  timeout?: number
  headers?: Record<string, string>
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ============================================================
// Error Handling
// ============================================================

export class ServiceError extends Error {
  constructor(
    message: string,
    public code?: string | number,
    public status?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ServiceError'
  }

  static fromApiError(apiError: ApiError): ServiceError {
    return new ServiceError(
      apiError.message,
      apiError.code,
      apiError.status
    )
  }
}

/**
 * Handle API error uniformly
 */
export function handleApiError(error: unknown): ServiceError {
  if (error instanceof ServiceError) {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError
    return ServiceError.fromApiError(apiError)
  }

  return new ServiceError(
    error instanceof Error ? error.message : 'Unknown error occurred'
  )
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Build query string from params
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

/**
 * Generic GET request with pagination
 */
export async function getPaginated<T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> {
  try {
    const queryString = params ? buildQueryString(params) : ''
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    const { data } = await http.get<PaginatedResponse<T>>(url)
    return data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Generic GET request for single item
 */
export async function getItem<T>(
  endpoint: string,
  id: string
): Promise<T> {
  try {
    const { data } = await http.get<ApiResponse<T>>(`${endpoint}/${id}`)
    return data.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Generic POST request
 */
export async function createItem<T, D>(
  endpoint: string,
  data: D
): Promise<T> {
  try {
    const { data: response } = await http.post<ApiResponse<T>>(endpoint, data)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Generic PATCH request
 */
export async function updateItem<T, D>(
  endpoint: string,
  id: string,
  data: D
): Promise<T> {
  try {
    const { data: response } = await http.patch<ApiResponse<T>>(`${endpoint}/${id}`, data)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Generic DELETE request
 */
export async function deleteItem(
  endpoint: string,
  id: string
): Promise<void> {
  try {
    await http.delete(`${endpoint}/${id}`)
  } catch (error) {
    throw handleApiError(error)
  }
}

// ============================================================
// Export HTTP client for direct use
// ============================================================

export { http }