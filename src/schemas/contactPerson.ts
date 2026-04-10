/**
 * 联系人表单验证 Schema
 * 使用 Zod 进行表单验证
 */

import { z } from 'zod'

// ============================================================
// Schema 定义
// ============================================================

export const contactPersonSchema = z.object({
  // 基本信息
  name: z.string().min(1, { message: '请输入联系人姓名' }),
  gender: z.enum(['男', '女', '未知']).optional(),
  position: z.string().optional(),
  jobLevel: z.enum(['高管', '中层', '基层', '其他']).optional(),
  decisionRole: z.enum(['决策者', '影响者', '使用者', '把关者', '其他']).optional(),
  
  // 关联客户
  customerId: z.string().min(1, { message: '请选择关联客户' }),
  customerName: z.string().optional(),
  
  // 联系信息
  mobile: z.string().optional(),
  officePhone: z.string().optional(),
  email: z.string().email({ message: '请输入有效的邮箱地址' }).optional().or(z.literal('')),
  wechat: z.string().optional(),
  qq: z.string().optional(),
  address: z.string().optional(),
  
  // 个人信息
  birthday: z.string().optional(),
  joinDate: z.string().optional(),
  school: z.string().optional(),
  education: z.enum(['高中及以下', '大专', '本科', '硕士', '博士', '其他']).optional(),
  major: z.string().optional(),
  hobbies: z.string().optional(),
  
  // 其他
  remark: z.string().optional(),
  isPrimary: z.boolean().optional(),
  status: z.enum(['正常', '离职', '无效']).optional(),
})

// ============================================================
// 类型推断
// ============================================================

export type ContactPersonFormValues = z.infer<typeof contactPersonSchema>

// ============================================================
// 默认值
// ============================================================

export const contactPersonDefaultValues: Partial<ContactPersonFormValues> = {
  gender: '未知',
  jobLevel: '其他',
  decisionRole: '其他',
  education: '其他',
  isPrimary: false,
  status: '正常',
}
