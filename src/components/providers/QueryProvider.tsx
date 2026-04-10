import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

interface QueryProviderProps {
  children: ReactNode
  /**
   * Enable React Query devtools in development
   * @default true
   */
  enableDevtools?: boolean
}

/**
 * QueryProvider - Wraps the application with React Query context
 *
 * This should be placed near the root of your application.
 * Place it inside your router provider if you use one.
 *
 * @example
 * ```tsx
 * // In main.tsx or App.tsx
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({
  children,
  enableDevtools = import.meta.env.DEV,
}: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default QueryProvider
