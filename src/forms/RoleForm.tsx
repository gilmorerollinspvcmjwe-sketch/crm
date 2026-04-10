"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import { cn } from "@/lib/utils"

// ============ Permission Type ============

export interface Permission {
  id: string
  name: string
  action: string
  resource: string
}

// ============ Role Schema ============

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "角色名称不能为空")
    .max(50, "角色名称不能超过50个字符"),

  code: z
    .string()
    .min(1, "角色标识不能为空")
    .max(50, "角色标识不能超过50个字符")
    .regex(/^[A-Z_][A-Z0-9_]*$/, "角色标识必须以大写字母开头，只能包含大写字母、数字和下划线"),

  description: z
    .string()
    .max(200, "描述不能超过200个字符")
    .optional(),

  isActive: z.boolean().default(true),

  isSystem: z.boolean().default(false),

  sort: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  permissions: z
    .array(z.string())
    .default([]),

  remark: z
    .string()
    .max(500)
    .optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>

// ============ RoleForm Props ============

export interface RoleFormProps {
  initialValues?: Partial<RoleFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  permissionGroups?: { label: string; permissions: Permission[] }[]
  onSubmit: (values: RoleFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Permission Groups ============

const defaultPermissionGroups = [
  {
    label: "客户管理",
    permissions: [
      { id: "customer:view", name: "查看客户", action: "view", resource: "customer" },
      { id: "customer:create", name: "创建客户", action: "create", resource: "customer" },
      { id: "customer:edit", name: "编辑客户", action: "edit", resource: "customer" },
      { id: "customer:delete", name: "删除客户", action: "delete", resource: "customer" },
      { id: "customer:export", name: "导出客户", action: "export", resource: "customer" },
    ],
  },
  {
    label: "联系人管理",
    permissions: [
      { id: "contact:view", name: "查看联系人", action: "view", resource: "contact" },
      { id: "contact:create", name: "创建联系人", action: "create", resource: "contact" },
      { id: "contact:edit", name: "编辑联系人", action: "edit", resource: "contact" },
      { id: "contact:delete", name: "删除联系人", action: "delete", resource: "contact" },
    ],
  },
  {
    label: "产品管理",
    permissions: [
      { id: "product:view", name: "查看产品", action: "view", resource: "product" },
      { id: "product:create", name: "创建产品", action: "create", resource: "product" },
      { id: "product:edit", name: "编辑产品", action: "edit", resource: "product" },
      { id: "product:delete", name: "删除产品", action: "delete", resource: "product" },
    ],
  },
  {
    label: "报价管理",
    permissions: [
      { id: "quote:view", name: "查看报价", action: "view", resource: "quote" },
      { id: "quote:create", name: "创建报价", action: "create", resource: "quote" },
      { id: "quote:edit", name: "编辑报价", action: "edit", resource: "quote" },
      { id: "quote:delete", name: "删除报价", action: "delete", resource: "quote" },
      { id: "quote:approve", name: "审批报价", action: "approve", resource: "quote" },
    ],
  },
  {
    label: "系统管理",
    permissions: [
      { id: "user:view", name: "查看用户", action: "view", resource: "user" },
      { id: "user:create", name: "创建用户", action: "create", resource: "user" },
      { id: "user:edit", name: "编辑用户", action: "edit", resource: "user" },
      { id: "user:delete", name: "删除用户", action: "delete", resource: "user" },
      { id: "role:view", name: "查看角色", action: "view", resource: "role" },
      { id: "role:create", name: "创建角色", action: "create", resource: "role" },
      { id: "role:edit", name: "编辑角色", action: "edit", resource: "role" },
      { id: "role:delete", name: "删除角色", action: "delete", resource: "role" },
    ],
  },
]

// ============ Default Values ============

const defaultValues: Partial<RoleFormValues> = {
  isActive: true,
  isSystem: false,
  sort: 0,
  permissions: [],
}

// ============ RoleForm Component ============

export function RoleForm({
  initialValues,
  mode = "create",
  loading = false,
  permissionGroups = defaultPermissionGroups,
  onSubmit,
  onCancel,
  className,
}: RoleFormProps) {
  const form = useForm<RoleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(roleSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as RoleFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as RoleFormValues)
    }
  }, [initialValues, form])

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const selectedPermissions = watch("permissions") || []
  const isSystem = watch("isSystem")

  const togglePermission = (permissionId: string) => {
    const current = form.getValues("permissions") || []
    if (current.includes(permissionId)) {
      setValue(
        "permissions",
        current.filter((p) => p !== permissionId)
      )
    } else {
      setValue("permissions", [...current, permissionId])
    }
  }

  const toggleGroup = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map((p) => p.id)
    const allSelected = groupIds.every((id) => selectedPermissions.includes(id))
    const current = form.getValues("permissions") || []

    if (allSelected) {
      setValue(
        "permissions",
        current.filter((id) => !groupIds.includes(id))
      )
    } else {
      const newPerms = [...new Set([...current, ...groupIds])]
      setValue("permissions", newPerms)
    }
  }

  const isGroupAllSelected = (groupPermissions: Permission[]) => {
    return groupPermissions.every((p) => selectedPermissions.includes(p.id))
  }

  const isGroupPartialSelected = (groupPermissions: Permission[]) => {
    const selected = groupPermissions.filter((p) => selectedPermissions.includes(p.id))
    return selected.length > 0 && selected.length < groupPermissions.length
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Basic Info */}
      <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="name"
            label="角色名称"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：销售经理"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="code"
            label="角色标识"
            required
            containerClassName="col-span-1"
            description="用于程序识别，建议大写下划线命名"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：SALES_MANAGER"
                error={!!errors.code}
                onChange={(e) => {
                  field.onChange(e.target.value.toUpperCase())
                }}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="description"
            label="角色描述"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入角色描述"
                error={!!errors.description}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="sort"
            label="排序"
            containerClassName="col-span-1"
            description="数字越小排序越靠前"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="0"
                error={!!errors.sort}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Permissions */}
      <FormSection title="权限配置">
        <div className="space-y-4">
          {permissionGroups.map((group) => (
            <div key={group.label} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={isGroupAllSelected(group.permissions)}
                  onCheckedChange={() => toggleGroup(group.permissions)}
                  disabled={isSubmitting || loading || isSystem}
                />
                <span className="font-medium text-sm">{group.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({group.permissions.filter((p) => selectedPermissions.includes(p.id)).length}/{group.permissions.length})
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
                {group.permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                      disabled={isSubmitting || loading || isSystem}
                    />
                    <span className="text-muted-foreground">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      {/* Status */}
      <FormSection title="状态设置">
        <FormGrid cols={2}>
          <div className="col-span-2 space-y-3">
            <FormField
              control={form.control}
              name="isActive"
              label="启用状态"
            >
              {({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting || loading || isSystem}
                    id="isActive"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    启用后此角色可被分配给用户
                  </label>
                </div>
              )}
            </FormField>

            <FormField
              control={form.control}
              name="isSystem"
              label="系统角色"
            >
              {({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting || loading || mode === "create"}
                    id="isSystem"
                  />
                  <label
                    htmlFor="isSystem"
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    系统角色不可删除，通常用于管理员
                  </label>
                </div>
              )}
            </FormField>
          </div>
        </FormGrid>
      </FormSection>

      {/* Remark */}
      <FormSection title="备注">
        <FormField
          control={form.control}
          name="remark"
          label="备注"
          containerClassName="col-span-2"
        >
          {({ field }) => (
            <Input
              {...field}
              placeholder="内部备注信息"
              error={!!errors.remark}
            />
          )}
        </FormField>
      </FormSection>

      {/* Actions */}
      <FormActions>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            取消
          </Button>
        )}
        <Button type="submit" variant="default" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提交中...
            </>
          ) : mode === "create" ? (
            "创建"
          ) : (
            "保存"
          )}
        </Button>
      </FormActions>
    </form>
  )
}
