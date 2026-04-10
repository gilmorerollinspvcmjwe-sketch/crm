import { z } from "zod"

// ============ Customer Schema ============

export const customerSchema = z.object({
  /** 客户名称 */
  name: z
    .string()
    .min(1, "客户名称不能为空")
    .max(200, "客户名称不能超过 200 个字符"),

  /** 客户类型：enterprise | individual */
  type: z
    .enum(["enterprise", "individual"])
    .describe("请选择客户类型"),

  /** 客户来源：marketing | referral | partner | other */
  source: z
    .enum(["marketing", "referral", "partner", "other"])
    .optional(),

  /** 行业 */
  industry: z
    .string()
    .max(100, "行业名称不能超过 100 个字符")
    .optional(),

  /** 规模：small | medium | large | enterprise */
  scale: z
    .enum(["small", "medium", "large", "enterprise"])
    .optional(),

  /** 客户等级：A | B | C | D */
  level: z
    .enum(["A", "B", "C", "D"])
    .optional(),

  /** 联系人姓名 */
  contactName: z
    .string()
    .max(100, "联系人姓名不能超过 100 个字符")
    .optional(),

  /** 联系电话 */
  contactPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^1[3-9]\d{9}$/.test(val),
      "请输入有效的手机号码"
    ),

  /** 联系邮箱 */
  contactEmail: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "请输入有效的邮箱地址"
    ),

  /** 公司网站 */
  website: z
    .string()
    .max(200, "网站地址不能超过 200 个字符")
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(val),
      "请输入有效的网站地址"
    ),

  /** 详细地址 */
  address: z
    .string()
    .max(300, "地址不能超过 300 个字符")
    .optional(),

  /** 省份 */
  province: z
    .string()
    .max(50, "省份不能超过 50 个字符")
    .optional(),

  /** 城市 */
  city: z
    .string()
    .max(50, "城市不能超过 50 个字符")
    .optional(),

  /** 区县 */
  district: z
    .string()
    .max(50, "区县不能超过 50 个字符")
    .optional(),

  /** 注册资本 */
  registeredCapital: z
    .number()
    .positive("注册资本必须为正数")
    .optional()
    .or(z.string().max(50)),

  /** 营业执照号 */
  businessLicense: z
    .string()
    .max(50, "营业执照号不能超过 50 个字符")
    .optional(),

  /** 统一社会信用代码 */
  unifiedCreditCode: z
    .string()
    .max(18, "统一社会信用代码不能超过 18 位")
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[1-9NXY][1-9NXY0-9]{17}$|^[1-9NXY][1-9NXY0-9]{14}$/.test(val),
      "请输入有效的统一社会信用代码"
    ),

  /** 年营收 */
  annualRevenue: z
    .number()
    .positive()
    .optional()
    .or(z.string().max(50)),

  /** 备注 */
  remark: z
    .string()
    .max(1000, "备注不能超过 1000 个字符")
    .optional(),

  /** 客户描述 */
  description: z
    .string()
    .max(2000, "客户描述不能超过 2000 个字符")
    .optional(),

  /** 状态：active | inactive */
  status: z
    .enum(["active", "inactive"])
    .default("active"),

  /** 传真 */
  fax: z
    .string()
    .optional(),

  /** 社交媒体 */
  socialMedia: z
    .string()
    .max(200, "社交媒体账号不能超过 200 个字符")
    .optional(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

// ============ Customer Create Schema ============

export const customerCreateSchema = customerSchema.extend({
  name: z.string().min(1, "客户名称不能为空"),
  type: z.enum(["enterprise", "individual"]).describe("请选择客户类型"),
})

export type CustomerCreateFormValues = z.infer<typeof customerCreateSchema>

// ============ Customer Update Schema ============

export const customerUpdateSchema = customerSchema.partial()

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>
