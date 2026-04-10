import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import type { ApiError } from '@/types/api'

// ============================================================
// Environment Configuration
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

// ============================================================
// Token Management
// ============================================================
// These are placeholder functions - replace with your actual auth implementation
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
}

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// ============================================================
// Axios Instance Creation
// ============================================================
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Track if we're currently refreshing a token to prevent concurrent refresh attempts
  let isRefreshing = false
  let failedQueue: Array<{
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  const processQueue = (error: Error | null, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    failedQueue = []
  }

  // ============================================================
  // Request Interceptor
  // ============================================================
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // ============================================================
  // Response Interceptor
  // ============================================================
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error: AxiosError<{ message?: string; code?: string | number }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue this request while a refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return instance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = getRefreshToken()
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          // Call your refresh endpoint
          const response = await axios.post<{ accessToken: string; refreshToken?: string }>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            { timeout: API_TIMEOUT }
          )

          const { accessToken, refreshToken: newRefreshToken } = response.data
          setTokens(accessToken, newRefreshToken || refreshToken)

          processQueue(null as unknown as Error, accessToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return instance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as Error)
          clearTokens()
          // Redirect to login - adjust based on your routing
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Format error for consistent error handling
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'An error occurred',
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
      }

      return Promise.reject(apiError)
    }
  )

  return instance
}

// ============================================================
// Export Singleton Instance
// ============================================================
export const axiosInstance = createAxiosInstance()

// ============================================================
// Convenience HTTP Methods
// ============================================================
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
}

export default axiosInstance
