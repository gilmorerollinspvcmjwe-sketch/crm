"use client"

import * as React from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type {
  PermissionConfig,
  PermissionMatrix as PermissionMatrixType,
} from '@/types/permission'
import {
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  PermissionType,
} from '@/types/permission'

interface PermissionMatrixProps {
  matrix: PermissionMatrixType
  onChange: (matrix: PermissionMatrixType) => void
  isModified?: boolean
  className?: string
}

export function PermissionMatrix({
  matrix,
  onChange,
  isModified = false,
  className,
}: PermissionMatrixProps) {
  // 获取某个模块的某个动作是否已授权
  const isAllowed = (moduleId: string, action: PermissionType): boolean => {
    const perm = matrix.permissions.find(p => p.module === moduleId)
    if (!perm) return false
    const actionPerm = perm.permissions.find(p => p.action === action)
    return actionPerm?.allowed || false
  }

  // 切换单个权限
  const togglePermission = (moduleId: string, action: PermissionType) => {
    const newPermissions = matrix.permissions.map(perm => {
      if (perm.module !== moduleId) return perm
      return {
        ...perm,
        permissions: perm.permissions.map(p =>
          p.action === action ? { ...p, allowed: !p.allowed } : p
        ),
      }
    })
    onChange({ ...matrix, permissions: newPermissions })
  }

  // 模块全选/全不选
  const toggleModuleAll = (moduleId: string) => {
    const perm = matrix.permissions.find(p => p.module === moduleId)
    if (!perm) return
    const allAllowed = perm.permissions.every(p => p.allowed)
    const newPermissions = matrix.permissions.map(p => {
      if (p.module !== moduleId) return p
      return {
        ...p,
        permissions: p.permissions.map(permAction => ({
          ...permAction,
          allowed: !allAllowed,
        })),
      }
    })
    onChange({ ...matrix, permissions: newPermissions })
  }

  // 动作全选/全不选（所有模块的某个动作）
  const toggleActionAll = (action: PermissionType) => {
    const allAllowed = matrix.permissions.every(p =>
      p.permissions.find(pa => pa.action === action)?.allowed
    )
    const newPermissions = matrix.permissions.map(perm => ({
      ...perm,
      permissions: perm.permissions.map(p =>
        p.action === action ? { ...p, allowed: !allAllowed } : p
      ),
    }))
    onChange({ ...matrix, permissions: newPermissions })
  }

  // 检查某个模块是否全部授权
  const isModuleAllAllowed = (moduleId: string): boolean => {
    const perm = matrix.permissions.find(p => p.module === moduleId)
    if (!perm) return false
    return perm.permissions.every(p => p.allowed)
  }

  // 检查某个模块是否有部分授权
  const isModulePartiallyAllowed = (moduleId: string): boolean => {
    const perm = matrix.permissions.find(p => p.module === moduleId)
    if (!perm) return false
    const allowed = perm.permissions.filter(p => p.allowed).length
    return allowed > 0 && allowed < perm.permissions.length
  }

  // 检查某个动作是否全部授权
  const isActionAllAllowed = (action: PermissionType): boolean => {
    return matrix.permissions.every(p =>
      p.permissions.find(pa => pa.action === action)?.allowed
    )
  }

  // 检查某个动作是否有部分授权
  const isActionPartiallyAllowed = (action: PermissionType): boolean => {
    const allowed = matrix.permissions.filter(p =>
      p.permissions.find(pa => pa.action === action)?.allowed
    ).length
    return allowed > 0 && allowed < matrix.permissions.length
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Modified indicator */}
      {isModified && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-amber-50 border border-amber-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-800">您有未保存的更改</span>
        </div>
      )}

      {/* Matrix Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3 text-left font-medium w-[200px] border-b">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={matrix.permissions.every(p =>
                        p.permissions.every(pp => pp.allowed)
                      ) ? true : matrix.permissions.some(p =>
                        p.permissions.some(pp => pp.allowed)
                      ) ? 'indeterminate' : false}
                      onCheckedChange={() => {
                        const allAllowed = matrix.permissions.every(p =>
                          p.permissions.every(pp => pp.allowed)
                        )
                        const newPermissions = matrix.permissions.map(perm => ({
                          ...perm,
                          permissions: perm.permissions.map(p => ({
                            ...p,
                            allowed: !allAllowed,
                          })),
                        }))
                        onChange({ ...matrix, permissions: newPermissions })
                      }}
                    />
                    <span>模块 / 操作</span>
                  </div>
                </th>
                {PERMISSION_ACTIONS.map(action => (
                  <th key={action.id} className="p-3 text-center font-medium border-b min-w-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <Checkbox
                        checked={isActionAllAllowed(action.id) ? true : isActionPartiallyAllowed(action.id) ? 'indeterminate' : false}
                        onCheckedChange={() => toggleActionAll(action.id)}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs cursor-help">{action.shortName}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{action.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {PERMISSION_MODULES.map(module => {
                const moduleAllowed = isModuleAllAllowed(module.id)
                const modulePartial = isModulePartiallyAllowed(module.id)
                const currentPerm = matrix.permissions.find(p => p.module === module.id)

                return (
                  <tr key={module.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={moduleAllowed ? true : modulePartial ? 'indeterminate' : false}
                          onCheckedChange={() => toggleModuleAll(module.id)}
                        />
                        <span className="font-medium">{module.name}</span>
                      </div>
                    </td>
                    {PERMISSION_ACTIONS.map(action => (
                      <td key={action.id} className="p-3 text-center border-b">
                        {currentPerm?.permissions.find(p => p.action === action.id) ? (
                          <Checkbox
                            checked={isAllowed(module.id, action.id)}
                            onCheckedChange={() => togglePermission(module.id, action.id)}
                          />
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-muted-foreground">快速操作：</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newPermissions: PermissionConfig[] = PERMISSION_MODULES.map(m => ({
              module: m.id,
              permissions: PERMISSION_ACTIONS.map(a => ({
                action: a.id,
                allowed: true,
              })),
            }))
            onChange({ ...matrix, permissions: newPermissions })
          }}
        >
          全选全部
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newPermissions: PermissionConfig[] = PERMISSION_MODULES.map(m => ({
              module: m.id,
              permissions: PERMISSION_ACTIONS.map(a => ({
                action: a.id,
                allowed: false,
              })),
            }))
            onChange({ ...matrix, permissions: newPermissions })
          }}
        >
          清空全部
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            // 只保留查看权限
            const newPermissions: PermissionConfig[] = PERMISSION_MODULES.map(m => ({
              module: m.id,
              permissions: PERMISSION_ACTIONS.map(a => ({
                action: a.id,
                allowed: a.id === PermissionType.VIEW,
              })),
            }))
            onChange({ ...matrix, permissions: newPermissions })
          }}
        >
          仅查看
        </Button>
      </div>
    </div>
  )
}

export default PermissionMatrix
