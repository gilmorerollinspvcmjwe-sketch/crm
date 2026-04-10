import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(30, '用户名最多30个字符')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '用户名必须以字母开头，只能包含字母、数字和下划线'),
  email: z
    .string()
    .email('请输入有效的邮箱地址'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
    .optional()
    .or(z.literal('')),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  roleIds: z.array(z.string()).default([]),
  avatar: z.string().url().optional(),
  sendWelcomeEmail: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;

// 用户创建 schema（包含密码）
export const userCreateSchema = userSchema.extend({
  password: z
    .string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字')
    .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;

// 用户更新 schema
export const userUpdateSchema = userSchema.partial().extend({
  id: z.string(),
});

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

// 修改密码 schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z
    .string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字')
    .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// 重置密码 schema
export const resetPasswordSchema = z.object({
  userId: z.string(),
  newPassword: z
    .string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字')
    .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符'),
  sendNotification: z.boolean().default(true),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;