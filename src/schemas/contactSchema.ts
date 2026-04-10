import { z } from "zod"

// ============ Contact Schema ============

export const contactSchema = z.object({
  /** 姓名 */
  name: z
    .string()
    .min(1, "姓名不能为空")
    .max(100, "姓名不能超过100个字符"),

  /** 手机号 */
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^1[3-9]\d{9}$/.test(val),
      "请输入有效的手机号码"
    ),

  /** 邮箱 */
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "请输入有效的邮箱地址"
    ),

  /** 职位 */
  title: z
    .string()
    .max(100, "职位不能超过100个字符")
    .optional(),

  /** 所属部门 */
  department: z
    .string()
    .max(100, "部门名称不能超过100个字符")
    .optional(),

  /** 客户ID（关联客户） */
  customerId: z
    .string()
    .min(1, "请选择关联客户")
    .optional(),

  /** 是否主要联系人 */
  isPrimary: z
    .boolean()
    .default(false),

  /** 备注 */
  remark: z
    .string()
    .max(500, "备注不能超过500个字符")
    .optional(),

  /** 固定电话 */
  telephone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^0\d{2,3}-?\d{7,8}$/.test(val),
      "请输入有效的电话号码"
    ),

  /** 微信号 */
  wechat: z
    .string()
    .max(50, "微信号不能超过50个字符")
    .optional(),

  /** QQ号 */
  qq: z
    .string()
    .max(20, "QQ号不能超过20个字符")
    .optional(),

  /** 地址 */
  address: z
    .string()
    .max(200, "地址不能超过200个字符")
    .optional(),

  /** 生日 */
  birthday: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),
})

export type ContactFormValues = z.infer<typeof contactSchema>

// ============ Contact Create Schema (all required fields) ============

export const contactCreateSchema = contactSchema.extend({
  name: z.string().min(1, "姓名不能为空"),
  customerId: z.string().min(1, "请选择关联客户"),
})

export type ContactCreateFormValues = z.infer<typeof contactCreateSchema>

// ============ Contact Update Schema (partial) ============

export const contactUpdateSchema = contactSchema.partial()

export type ContactUpdateFormValues = z.infer<typeof contactUpdateSchema>
