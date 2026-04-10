/**
 * Toaster 组件
 * Toast 消息容器
 */

import * as React from 'react'
import {
  ToastProvider,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}

export default Toaster