/**
 * Spinner 加载指示器组件
 * Loading Spinner Component
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ 
  className, 
  size = 'default',
  ...props 
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export default Spinner