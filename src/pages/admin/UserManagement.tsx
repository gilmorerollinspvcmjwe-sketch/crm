"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Pencil, Trash2, Users as UsersIcon, Shield, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { Role, User } from "@/types/role"
import { cn } from "@/lib/utils"

// ============ Mock Data ============

const mockRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '系统最高权限角色',
    permissions: [],
    dataScope: DataScope.ALL,
    isSystem: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '2',
    name: '销售总监',
    code: 'sales_director',
    description: '销售团队管理者',
    permissions: [],
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
    permissions: [],
    dataScope: DataScope.TEAM,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '4',
    name: '销售代表',
    code: 'sales_rep',
    description: '一线销售人员',
    permissions: [],
    dataScope: DataScope.SELF,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    email: 'admin@crm.com',
    department: '总经办',
    position: '管理员',
    roleIds: ['1'],
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    username: 'zhangsan',
    name: '张三',
    email: 'zhangsan@crm.com',
    department: '销售部',
    position: '销售总监',
    roleIds: ['2'],
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    username: 'lisi',
    name: '李四',
    email: 'lisi@crm.com',
    department: '销售部',
    position: '销售经理',
    roleIds: ['3'],
    status: 'active',
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    username: 'wangwu',
    name: '王五',
    email: 'wangwu@crm.com',
    department: '销售部',
    position: '销售代表',
    roleIds: ['4'],
    status: 'active',
    createdAt: '2026-02-15',
  },
  {
    id: '5',
    username: 'zhaoliu',
    name: '赵六',
    email: 'zhaoliu@crm.com',
    department: '销售部',
    position: '销售代表',
    roleIds: ['4'],
    status: 'active',
    createdAt: '2026-03-01',
  },
  {
    id: '6',
    username: 'qianqi',
    name: '钱七',
    email: 'qianqi@crm.com',
    department: '市场部',
    position: '销售代表',
    roleIds: ['4'],
    status: 'inactive',
    createdAt: '2026-03-01',
  },
]

const departments = ['总经办', '销售部', '市场部', '客服部', '财务部', '技术部']

// ============ Form Schema ============

const userFormSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  name: z.string().min(1, "请输入真实姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  phone: z.string().optional(),
  department: z.string().min(1, "请选择部门"),
  position: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type UserFormValues = z.infer<typeof userFormSchema>

// ============ UserManagement Page ============

export function UserManagementPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [roleModalOpen, setRoleModalOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [selectedUserForRole, setSelectedUserForRole] = React.useState<User | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      status: "active",
    },
    mode: "onBlur",
  })

  // Load user data when editing
  React.useEffect(() => {
    if (editingUser && editModalOpen) {
      form.reset({
        username: editingUser.username,
        name: editingUser.name,
        email: editingUser.email,
        phone: "",
        department: editingUser.department,
        position: editingUser.position,
        status: editingUser.status === 'frozen' ? 'inactive' : editingUser.status,
      })
    } else if (!editModalOpen) {
      form.reset({
        username: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        status: "active",
      })
    }
  }, [editingUser, editModalOpen, form])

  // ============ Table Columns ============

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "用户",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.username}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "邮箱",
    },
    {
      accessorKey: "department",
      header: "部门",
    },
    {
      accessorKey: "position",
      header: "职位",
    },
    {
      id: "roles",
      header: "角色",
      cell: ({ row }) => {
        const user = row.original
        const colors = ["default", "secondary", "outline", "destructive"]
        return (
          <div className="flex flex-wrap gap-1">
            {user.roleIds.map((roleId, index) => {
              const role = mockRoles.find(r => r.id === roleId)
              return role ? (
                <Badge key={roleId} variant={colors[index % colors.length] as "default" | "secondary" | "outline" | "destructive"}>
                  {role.name}
                </Badge>
              ) : null
            })}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === 'active' ? "default" : "secondary"}>
            {status === 'active' ? '启用' : '禁用'}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAssignRole(user)}
            >
              <Shield className="h-4 w-4 mr-1" />
              分配角色
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(user)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              编辑
            </Button>
            <ConfirmPopover
              title="确认删除"
              description={`确定要删除用户 "${user.name}" 吗？`}
              onConfirm={() => handleDelete(user.id)}
            >
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                删除
              </Button>
            </ConfirmPopover>
          </div>
        )
      },
    },
  ]

  // ============ Handlers ============

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setEditModalOpen(true)
  }

  const handleAssignRole = (user: User) => {
    setSelectedUserForRole(user)
    setSelectedRoleIds(user.roleIds)
    setRoleModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const handleSubmit = async (values: UserFormValues) => {
    setLoading(true)
    try {
      if (editingUser) {
        // Edit existing user
        setUsers(users.map(u =>
          u.id === editingUser.id
            ? { ...u, ...values }
            : u
        ))
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          roleIds: [],
          createdAt: new Date().toISOString().split('T')[0],
        }
        setUsers([...users, newUser])
      }
      setEditModalOpen(false)
      setEditingUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleAssign = async () => {
    if (!selectedUserForRole) return
    setLoading(true)
    try {
      setUsers(users.map(u =>
        u.id === selectedUserForRole.id
          ? { ...u, roleIds: selectedRoleIds }
          : u
      ))
      setRoleModalOpen(false)
      setSelectedUserForRole(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <UsersIcon className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
            <p className="text-muted-foreground text-sm">管理系统用户，分配角色和权限</p>
          </div>
        </div>
        <Button onClick={() => { setEditingUser(null); setEditModalOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          新建用户
        </Button>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>所有系统用户及其角色配置</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            showSearch
            searchPlaceholder="搜索用户..."
            showPagination
            defaultPageSize={10}
          />
        </CardContent>
      </Card>

      {/* Edit/Create User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? '编辑用户' : '新建用户'}</DialogTitle>
            <DialogDescription>
              {editingUser ? '修改用户基本信息' : '创建新的系统用户'}
            </DialogDescription>
          </DialogHeader>
          <FormProvider form={form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                label="用户名"
                required
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="请输入用户名"
                    disabled={!!editingUser}
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="name"
                label="真实姓名"
                required
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="请输入真实姓名"
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="email"
                label="邮箱"
                required
              >
                {({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="请输入邮箱地址"
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="phone"
                label="手机号"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="请输入手机号码"
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="department"
                label="部门"
                required
              >
                {({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>

              <FormField
                control={form.control}
                name="position"
                label="职位"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="请输入职位"
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="status"
                label="状态"
              >
                {({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">启用</SelectItem>
                      <SelectItem value="inactive">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormField>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingUser ? '保存' : '创建'}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* Role Assignment Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>分配角色 - {selectedUserForRole?.name}</DialogTitle>
            <DialogDescription>
              为用户选择合适的角色
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {mockRoles.map(role => (
                <div
                  key={role.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedRoleIds.includes(role.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => {
                    setSelectedRoleIds(prev =>
                      prev.includes(role.id)
                        ? prev.filter(id => id !== role.id)
                        : [...prev, role.id]
                    )
                  }}
                >
                  <div className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center",
                    selectedRoleIds.includes(role.id)
                      ? "border-primary bg-primary"
                      : "border-border"
                  )}>
                    {selectedRoleIds.includes(role.id) && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {role.name}
                      {role.isSystem && (
                        <Badge variant="outline" className="text-xs">系统</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleModalOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleRoleAssign}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              确认分配
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagementPage