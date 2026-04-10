"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Pencil, Trash2, Settings, Copy, Shield, Loader2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { FormField, FormProvider } from "@/components/form"
import { ConfirmPopover } from "@/components/popconfirm"
import type { ColumnDef } from "@tanstack/react-table"
import { DataScope } from "@/types/permission"
import { PermissionElementType, type Permission, type Role } from "@/types/role"
import { cn } from "@/lib/utils"

// ============ Mock Permissions ============

const mockPermissions: Permission[] = [
  {
    id: 'customer',
    name: '客户管理',
    code: 'customer',
    type: PermissionElementType.MENU,
    sort: 1,
    children: [
      { id: 'customer:view', name: '查看客户', code: 'customer:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'customer:create', name: '新建客户', code: 'customer:create', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'customer:edit', name: '编辑客户', code: 'customer:edit', type: PermissionElementType.BUTTON, sort: 3 },
      { id: 'customer:delete', name: '删除客户', code: 'customer:delete', type: PermissionElementType.BUTTON, sort: 4 },
      { id: 'customer:export', name: '导出客户', code: 'customer:export', type: PermissionElementType.BUTTON, sort: 5 },
    ],
  },
  {
    id: 'contact',
    name: '联系人管理',
    code: 'contact',
    type: PermissionElementType.MENU,
    sort: 2,
    children: [
      { id: 'contact:view', name: '查看联系人', code: 'contact:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'contact:create', name: '新建联系人', code: 'contact:create', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'contact:edit', name: '编辑联系人', code: 'contact:edit', type: PermissionElementType.BUTTON, sort: 3 },
      { id: 'contact:delete', name: '删除联系人', code: 'contact:delete', type: PermissionElementType.BUTTON, sort: 4 },
    ],
  },
  {
    id: 'lead',
    name: '线索管理',
    code: 'lead',
    type: PermissionElementType.MENU,
    sort: 3,
    children: [
      { id: 'lead:view', name: '查看线索', code: 'lead:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'lead:create', name: '新建线索', code: 'lead:create', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'lead:edit', name: '编辑线索', code: 'lead:edit', type: PermissionElementType.BUTTON, sort: 3 },
      { id: 'lead:delete', name: '删除线索', code: 'lead:delete', type: PermissionElementType.BUTTON, sort: 4 },
      { id: 'lead:convert', name: '转化线索', code: 'lead:convert', type: PermissionElementType.BUTTON, sort: 5 },
    ],
  },
  {
    id: 'opportunity',
    name: '商机管理',
    code: 'opportunity',
    type: PermissionElementType.MENU,
    sort: 4,
    children: [
      { id: 'opportunity:view', name: '查看商机', code: 'opportunity:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'opportunity:create', name: '新建商机', code: 'opportunity:create', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'opportunity:edit', name: '编辑商机', code: 'opportunity:edit', type: PermissionElementType.BUTTON, sort: 3 },
      { id: 'opportunity:delete', name: '删除商机', code: 'opportunity:delete', type: PermissionElementType.BUTTON, sort: 4 },
      { id: 'opportunity:win', name: '赢单', code: 'opportunity:win', type: PermissionElementType.BUTTON, sort: 5 },
      { id: 'opportunity:lose', name: '输单', code: 'opportunity:lose', type: PermissionElementType.BUTTON, sort: 6 },
    ],
  },
  {
    id: 'contract',
    name: '合同管理',
    code: 'contract',
    type: PermissionElementType.MENU,
    sort: 5,
    children: [
      { id: 'contract:view', name: '查看合同', code: 'contract:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'contract:create', name: '新建合同', code: 'contract:create', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'contract:edit', name: '编辑合同', code: 'contract:edit', type: PermissionElementType.BUTTON, sort: 3 },
      { id: 'contract:delete', name: '删除合同', code: 'contract:delete', type: PermissionElementType.BUTTON, sort: 4 },
    ],
  },
  {
    id: 'payment',
    name: '回款管理',
    code: 'payment',
    type: PermissionElementType.MENU,
    sort: 6,
    children: [
      { id: 'payment:view', name: '查看回款', code: 'payment:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'payment:create', name: '新建回款', code: 'payment:create', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'payment:edit', name: '编辑回款', code: 'payment:edit', type: PermissionElementType.BUTTON, sort: 3 },
    ],
  },
  {
    id: 'report',
    name: '报表中心',
    code: 'report',
    type: PermissionElementType.MENU,
    sort: 7,
    children: [
      { id: 'report:view', name: '查看报表', code: 'report:view', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'report:export', name: '导出报表', code: 'report:export', type: PermissionElementType.BUTTON, sort: 2 },
    ],
  },
  {
    id: 'system',
    name: '系统设置',
    code: 'system',
    type: PermissionElementType.MENU,
    sort: 8,
    children: [
      { id: 'system:user', name: '用户管理', code: 'system:user', type: PermissionElementType.BUTTON, sort: 1 },
      { id: 'system:role', name: '角色管理', code: 'system:role', type: PermissionElementType.BUTTON, sort: 2 },
      { id: 'system:config', name: '系统配置', code: 'system:config', type: PermissionElementType.BUTTON, sort: 3 },
    ],
  },
]

// ============ Mock Roles ============

const mockRoles: Role[] = [
  {
    id: '1',
    name: '系统管理员',
    code: 'admin',
    description: '系统所有权限角色',
    permissions: mockPermissions.flatMap(p => [p.id, ...(p.children?.map(c => c.id) || [])]),
    dataScope: DataScope.ALL,
    isSystem: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '2',
    name: '销售总监',
    code: 'sales_director',
    description: '销售团队管理角色',
    permissions: ['customer', 'contact', 'lead', 'opportunity', 'contract', 'payment', 'report'],
    dataScope: DataScope.DEPARTMENT,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '3',
    name: '销售经理',
    code: 'sales_manager',
    description: '销售团队负责人',
    permissions: ['customer', 'contact', 'lead', 'opportunity', 'contract', 'payment'],
    dataScope: DataScope.TEAM,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '4',
    name: '销售代表',
    code: 'sales_rep',
    description: '一线销售角色',
    permissions: ['customer:view', 'customer:create', 'contact:view', 'contact:create', 'lead:view', 'lead:create', 'opportunity:view', 'opportunity:create'],
    dataScope: DataScope.SELF,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

// ============ Form Schema ============

const roleFormSchema = z.object({
  name: z.string().min(1, "请输入角色名称"),
  code: z.string()
    .min(1, "请输入角色编码")
    .regex(/^[a-z_]+$/, "角色编码只能包含小写字母和下划线"),
  description: z.string().optional(),
  dataScope: z.nativeEnum(DataScope),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

// ============ RoleForm Component ============

function RoleForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}: {
  initialValues?: RoleFormValues
  onSubmit: (values: RoleFormValues) => void
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
}) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: initialValues || {
      name: "",
      code: "",
      description: "",
      dataScope: DataScope.SELF,
    },
    mode: "onBlur",
  })

  React.useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
    }
  }, [initialValues, form])

  const dataScopeOptions = [
    { value: DataScope.ALL, label: '全部数据', desc: '可查看全部数据' },
    { value: DataScope.DEPARTMENT, label: '部门数据', desc: '可查看本部门数据' },
    { value: DataScope.TEAM, label: '团队数据', desc: '可查看团队数据' },
    { value: DataScope.SELF, label: '个人数据', desc: '只能查看自己的数据' },
  ]

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          label="角色名称"
        >
          {({ field }) => (
            <Input
              {...field}
              placeholder="请输入角色名称"
              disabled={isEdit && initialValues?.code === 'admin'}
            />
          )}
        </FormField>

        <FormField
          control={form.control}
          name="code"
          label="角色编码"
          description="只能包含小写字母和下划线"
        >
          {({ field }) => (
            <Input
              {...field}
              placeholder="例：sales_manager"
              disabled={isEdit}
            />
          )}
        </FormField>

        <FormField
          control={form.control}
          name="description"
          label="角色描述"
        >
          {({ field }) => (
            <Input
              {...field}
              placeholder="请输入角色描述"
            />
          )}
        </FormField>

        <Separator className="my-4" />

        <div className="space-y-3">
          <Label>数据权限范围</Label>
          <p className="text-sm text-muted-foreground">
            定义该角色能够查看的数据范围
          </p>
          <RadioGroup value={form.watch("dataScope")}>
            {dataScopeOptions.map(option => (
              <div
                key={option.value}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  form.watch("dataScope") === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => form.setValue("dataScope", option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="my-4" />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  )
}

// ============ PermissionTree Component ============

function PermissionTree({
  permissions,
  checkedKeys,
  onChange,
}: {
  permissions: Permission[]
  checkedKeys: string[]
  onChange: (keys: string[]) => void
}) {
  const togglePermission = (id: string) => {
    const perm = findPermissionById(permissions, id)
    if (!perm) return

    const allIds = perm.children
      ? [id, ...perm.children.map(c => c.id)]
      : [id]

    const newKeys = checkedKeys.includes(id)
      ? checkedKeys.filter(k => !allIds.includes(k))
      : [...checkedKeys, ...allIds]

    onChange(newKeys)
  }

  const findPermissionById = (perms: Permission[], id: string): Permission | undefined => {
    for (const p of perms) {
      if (p.id === id) return p
      if (p.children) {
        const found = findPermissionById(p.children, id)
        if (found) return found
      }
    }
    return undefined
  }

  return (
    <div className="space-y-4">
      {permissions.map(perm => (
        <div key={perm.id} className="border rounded-lg p-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => togglePermission(perm.id)}
          >
            <div className={cn(
              "h-4 w-4 rounded border flex items-center justify-center",
              checkedKeys.includes(perm.id)
                ? "border-primary bg-primary"
                : "border-border"
            )}>
              {checkedKeys.includes(perm.id) && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            <span className="font-medium">{perm.name}</span>
            <Badge variant="outline" className="text-xs">
              {perm.type === PermissionElementType.MENU ? '菜单' : '按钮'}
            </Badge>
            <span className="text-xs text-muted-foreground">[{perm.code}]</span>
          </div>
          {perm.children && (
            <div className="ml-7 mt-3 space-y-2">
              {perm.children.map(child => (
                <div
                  key={child.id}
                  className="flex items-center gap-3 cursor-pointer py-1"
                  onClick={() => togglePermission(child.id)}
                >
                  <div className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center",
                    checkedKeys.includes(child.id)
                      ? "border-primary bg-primary"
                      : "border-border"
                  )}>
                    {checkedKeys.includes(child.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{child.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {child.type === PermissionElementType.MENU ? '菜单' : '按钮'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============ RoleManagement Page ============

export function RoleManagementPage() {
  const [roles, setRoles] = React.useState<Role[]>(mockRoles)
  const [roleModalOpen, setRoleModalOpen] = React.useState(false)
  const [permissionModalOpen, setPermissionModalOpen] = React.useState(false)
  const [editingRole, setEditingRole] = React.useState<Role | null>(null)
  const [checkedPermissionKeys, setCheckedPermissionKeys] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "角色名称",
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{role.name}</span>
            {role.isSystem && (
              <Badge variant="outline">系统</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "code",
      header: "角色编码",
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.getValue("code")}
        </code>
      ),
    },
    {
      accessorKey: "description",
      header: "描述",
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate max-w-[200px]">
          {row.getValue("description") || '-'}
        </span>
      ),
    },
    {
      accessorKey: "dataScope",
      header: "数据范围",
      cell: ({ row }) => {
        const scope = row.getValue("dataScope") as DataScope
        const colorMap: Record<DataScope, "default" | "secondary" | "outline" | "destructive"> = {
          [DataScope.ALL]: "default",
          [DataScope.DEPARTMENT]: "secondary",
          [DataScope.TEAM]: "outline",
          [DataScope.SELF]: "destructive",
          [DataScope.CUSTOM]: "outline",
        }
        return (
          <Badge variant={colorMap[scope]}>
            {scope}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleConfigPermissions(role)}
            >
              <Settings className="h-4 w-4 mr-1" />
              配置权限
            </Button>
            {!role.isSystem && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(role)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(role)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
                <ConfirmPopover
                  title="确认删除"
                  description={`确认要删除角色 "${role.name}" 吗？`}
                  onConfirm={() => handleDelete(role.id)}
                >
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </ConfirmPopover>
              </>
            )}
          </div>
        )
      },
    },
  ]

  const handleConfigPermissions = (role: Role) => {
    setEditingRole(role)
    setCheckedPermissionKeys(role.permissions)
    setPermissionModalOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setRoleModalOpen(true)
  }

  const handleCopy = (_role: Role) => {
    setEditingRole(null)
    setRoleModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id))
  }

  const handleRoleSubmit = async (values: RoleFormValues) => {
    setLoading(true)
    try {
      if (editingRole) {
        setRoles(roles.map(r =>
          r.id === editingRole.id
            ? { ...r, ...values, updatedAt: new Date().toISOString() }
            : r
        ))
      } else {
        const newRole: Role = {
          id: `ROLE${Date.now()}`,
          ...values,
          permissions: [],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setRoles([...roles, newRole])
      }
      setRoleModalOpen(false)
      setEditingRole(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionSubmit = async () => {
    if (!editingRole) return
    setLoading(true)
    try {
      setRoles(roles.map(r =>
        r.id === editingRole.id
          ? { ...r, permissions: checkedPermissionKeys, updatedAt: new Date().toISOString() }
          : r
      ))
      setPermissionModalOpen(false)
      setEditingRole(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Shield className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">角色管理</h1>
            <p className="text-muted-foreground text-sm">管理系统角色、权限和数据范围</p>
          </div>
        </div>
        <Button onClick={() => { setEditingRole(null); setRoleModalOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          新建角色
        </Button>
      </div>

      {/* Role List */}
      <Card>
        <CardHeader>
          <CardTitle>角色列表</CardTitle>
          <CardDescription>管理系统角色和权限配置</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={roles}
            showSearch
            searchPlaceholder="搜索角色..."
            showPagination={false}
          />
        </CardContent>
      </Card>

      {/* Role Form Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? `编辑角色 - ${editingRole.name}` : '新建角色'}
            </DialogTitle>
            <DialogDescription>
              {editingRole ? '修改角色的基本信息' : '创建新的系统角色'}
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            initialValues={editingRole ? {
              name: editingRole.name,
              code: editingRole.code,
              description: editingRole.description || "",
              dataScope: editingRole.dataScope,
            } : undefined}
            onSubmit={handleRoleSubmit}
            onCancel={() => setRoleModalOpen(false)}
            loading={loading}
            isEdit={!!editingRole}
          />
        </DialogContent>
      </Dialog>

      {/* Permission Configuration Modal */}
      <Dialog open={permissionModalOpen} onOpenChange={setPermissionModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              配置权限 - {editingRole?.name}
            </DialogTitle>
            <DialogDescription>
              为该角色选择功能权限
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">
                {editingRole?.dataScope}
              </Badge>
              <span className="text-sm text-muted-foreground">
                当前数据范围
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const allKeys = mockPermissions.flatMap(p => [p.id, ...(p.children?.map(c => c.id) || [])])
                  setCheckedPermissionKeys(allKeys)
                }}
              >
                全选
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const menuKeys = mockPermissions.map(p => p.id)
                  setCheckedPermissionKeys(menuKeys)
                }}
              >
                仅菜单
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCheckedPermissionKeys([])}
              >
                清空
              </Button>
            </div>
            <PermissionTree
              permissions={mockPermissions}
              checkedKeys={checkedPermissionKeys}
              onChange={setCheckedPermissionKeys}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPermissionModalOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handlePermissionSubmit}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              保存权限
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RoleManagementPage
