/**
 * 应用入口组件
 * App Entry Component
 * 
 * 集成路由和全局 Provider
 */

import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { router } from '@/routes'
import { AuthProvider } from '@/components/guards/AuthGuard'
import { Toaster } from '@/components/ui/toaster'

// 创建 Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分钟
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App