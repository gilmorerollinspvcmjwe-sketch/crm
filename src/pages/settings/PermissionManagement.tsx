"use client"

import * as React from 'react'
import { Save, Settings, AlertCircle, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

import { PermissionMatrix } from '@/components/PermissionMatrix'
import {
  DataScope,
  DATA_SCOPE_OPTIONS,
  FieldPermission,
  ModuleFieldPermission,
  PermissionMatrix as PermissionMatrixType,
  PERMISSION_MODULES,
  PermissionType,
  RoleBasic,
} from '@/types/permission'
import {
  mockDataScopeConfig,
  mockFieldPermissions,
  mockPermissionMatrix,
  mockRoles,
} from '@/mock/permissionData'

// ============ 工具函数 ============

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function countEnabledPermissions(matrix: PermissionMatrixType): number {
  return matrix.permissions.reduce((total, perm) => {
    return total + perm.permissions.filter(p => p.allowed).length
  }, 0)
}

// ============ 主组件 ============

export function PermissionManagementPage() {
  // 状态
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(mockRoles[0].id)
  const [permissionMatrix, setPermissionMatrix] = React.useState<PermissionMatrixType>(
    deepClone(mockPermissionMatrix[0])
  )
  const [dataScope, setDataScope] = React.useState<Record<string, DataScope>>({})
  const [fieldPermissions, setFieldPermissions] = React.useState<ModuleFieldPermission[]>([])
  const [isModified, setIsModified] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // 原始数据（用于比较是否修改）
  const [originalMatrix, setOriginalMatrix] = React.useState<PermissionMatrixType | null>(null)

  // 选中的角色
  const selectedRole = mockRoles.find(r => r.id === selectedRoleId)

  // 加载角色数据
  const loadRoleData = React.useCallback((roleId: string) => {
    const roleIndex = mockRoles.findIndex(r => r.id === roleId)
    if (roleIndex === -1) return

    // 加载权限矩阵
    const matrix = deepClone(mockPermissionMatrix[roleIndex])
    setPermissionMatrix(matrix)
    setOriginalMatrix(deepClone(matrix))

    // 加载数据范围
    setDataScope(deepClone(mockDataScopeConfig[roleId] || {}))

    // 加载字段权限
    setFieldPermissions(deepClone(mockFieldPermissions[roleId] || []))

    setIsModified(false)
  }, [])

  // 初始化和角色切换
  React.useEffect(() => {
    loadRoleData(selectedRoleId)
  }, [selectedRoleId, loadRoleData])

  // 监听权限变更
  const handleMatrixChange = (newMatrix: PermissionMatrixType) => {
    setPermissionMatrix(newMatrix)
    setIsModified(true)
  }

  // 监听数据范围变更
  const handleDataScopeChange = (module: string, scope: DataScope) => {
    setDataScope(prev => ({ ...prev, [module]: scope }))
    setIsModified(true)
  }

  // 监听字段权限变更
  const handleFieldPermissionChange = (
    moduleIndex: number,
    fieldIndex: number,
    type: 'visible' | 'editable',
    value: boolean
  ) => {
    setFieldPermissions(prev => {
      const newPerms = deepClone(prev)
      if (newPerms[moduleIndex]?.fields[fieldIndex]) {
        newPerms[moduleIndex].fields[fieldIndex][type] = value
      }
      return newPerms
    })
    setIsModified(true)
  }

  // 保存所有更改
  const handleSave = async () => {
    if (!selectedRole) return

    setIsSaving(true)

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 保存到 mock 数据（实际项目中会调用 API）
      const roleIndex = mockRoles.findIndex(r => r.id === selectedRoleId)
      if (roleIndex !== -1) {
        mockPermissionMatrix[roleIndex] = deepClone(permissionMatrix)
        mockDataScopeConfig[selectedRoleId] = deepClone(dataScope)
        mockFieldPermissions[selectedRoleId] = deepClone(fieldPermissions)
      }

      setOriginalMatrix(deepClone(permissionMatrix))
      setIsModified(false)

      toast({
        title: '保存成功',
        description: `角色「${selectedRole.name}」的权限配置已保存`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: '保存失败',
        description: '权限配置保存失败，请重试',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 角色选择处理
  const handleRoleSelect = (role: RoleBasic) => {
    if (isModified) {
      // 确认切换
      if (confirm('您有未保存的更改，确定要切换角色吗？')) {
        setSelectedRoleId(role.id)
      }
    } else {
      setSelectedRoleId(role.id)
    }
  }

  // 需要配置数据范围的模块
  const modulesWithDataScope = PERMISSION_MODULES.filter(m =>
    ['customer', 'contact', 'lead', 'opportunity', 'contract', 'order', 'payment'].includes(m.id)
  )

  return (
    <TooltipProvider>
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">权限管理</h1>
            <p className="text-muted-foreground">集中管理角色权限、数据范围和字段级权限</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isModified && (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              有未保存的更改
            </Badge>
          )}
          <Button onClick={handleSave} disabled={!isModified || isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Role List */}
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>角色列表</CardTitle>
              <CardDescription>选择角色进行权限配置</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {mockRoles.map(role => (
                    <div
                      key={role.id}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                        selectedRoleId === role.id
                          ? 'bg-primary/10 border border-primary'
                          : 'hover:bg-muted border border-transparent'
                      )}
                      onClick={() => handleRoleSelect(role)}
                    >
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {role.name}
                          {role.isSystem && (
                            <Badge variant="outline" className="text-xs">
                              系统
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {role.code}
                        </div>
                        {role.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {role.description}
                          </div>
                        )}
                      </div>
                      {selectedRoleId === role.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tabs */}
        <div className="col-span-8">
          {selectedRole ? (
            <Tabs defaultValue="matrix" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="matrix">权限矩阵</TabsTrigger>
                <TabsTrigger value="datascope">数据范围</TabsTrigger>
                <TabsTrigger value="fields">字段权限</TabsTrigger>
              </TabsList>

              {/* Tab 1: Permission Matrix */}
              <TabsContent value="matrix" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle>权限矩阵</CardTitle>
                      <Badge variant="secondary">
                        {selectedRole.name} · {countEnabledPermissions(permissionMatrix)} 个权限
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PermissionMatrix
                      matrix={permissionMatrix}
                      onChange={handleMatrixChange}
                      isModified={isModified}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: Data Scope */}
              <TabsContent value="datascope" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>数据范围配置</CardTitle>
                    <CardDescription>
                      设置角色在各模块的数据可见范围
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {modulesWithDataScope.map(module => (
                        <div key={module.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium w-[120px]">{module.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {module.id}
                            </span>
                          </div>
                          <Select
                            value={dataScope[module.id] || DataScope.SELF}
                            onValueChange={(value: DataScope) =>
                              handleDataScopeChange(module.id, value)
                            }
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DATA_SCOPE_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.desc}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: Field Permissions */}
              <TabsContent value="fields" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>字段级权限</CardTitle>
                    <CardDescription>
                      控制角色对各模块字段的可见性和可编辑性
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {fieldPermissions.map((modulePerm, moduleIndex) => (
                        <div key={modulePerm.module}>
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-medium">{modulePerm.moduleName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {modulePerm.module}
                            </Badge>
                          </div>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="p-2 text-left font-medium text-sm w-[150px]">
                                    字段
                                  </th>
                                  <th className="p-2 text-center font-medium text-sm">
                                    可见
                                  </th>
                                  <th className="p-2 text-center font-medium text-sm">
                                    可编辑
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {modulePerm.fields.map((field, fieldIndex) => (
                                  <tr key={field.field} className="border-t">
                                    <td className="p-2">
                                      <div className="flex flex-col">
                                        <span className="text-sm">{field.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {field.field}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="p-2 text-center">
                                      <Switch
                                        checked={field.visible}
                                        onCheckedChange={(checked) =>
                                          handleFieldPermissionChange(
                                            moduleIndex,
                                            fieldIndex,
                                            'visible',
                                            checked
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="p-2 text-center">
                                      <Switch
                                        checked={field.editable}
                                        onCheckedChange={(checked) =>
                                          handleFieldPermissionChange(
                                            moduleIndex,
                                            fieldIndex,
                                            'editable',
                                            checked
                                          )
                                        }
                                        disabled={!field.visible}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
                请从左侧选择一个角色
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

export default PermissionManagementPage
