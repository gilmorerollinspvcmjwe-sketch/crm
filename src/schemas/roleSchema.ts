import { z } from 'zod';

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, '角色名称至少2个字符')
    .max(50, '角色名称最多50个字符'),
  code: z
    .string()
    .min(2, '角色代码至少2个字符')
    .max(30, '角色代码最多30个字符')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '角色代码必须以字母开头，只能包含字母、数字和下划线'),
  description: z.string().max(200, '描述最多200个字符').optional(),
  type: z.enum(['system', 'custom']).default('custom'),
  status: z.enum(['active', 'inactive']).default('active'),
  permissionIds: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
});

export type RoleFormData = z.infer<typeof roleSchema>;

// 角色权限配置 schema
export const rolePermissionSchema = z.object({
  roleId: z.string(),
  permissions: z.array(
    z.object({
      module: z.string(),
      actions: z.array(z.string()),
    })
  ),
});

export type RolePermissionFormData = z.infer<typeof rolePermissionSchema>;

// 批量分配角色 schema
export const batchAssignRolesSchema = z.object({
  userIds: z.array(z.string()).min(1, '请选择至少一个用户'),
  roleIds: z.array(z.string()).min(1, '请选择至少一个角色'),
});

export type BatchAssignRolesFormData = z.infer<typeof batchAssignRolesSchema>;