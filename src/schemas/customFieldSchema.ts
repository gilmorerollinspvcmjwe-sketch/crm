import { z } from 'zod';

// 字段类型枚举
export const fieldTypeEnum = z.enum([
  'text',
  'textarea',
  'number',
  'email',
  'phone',
  'url',
  'date',
  'datetime',
  'select',
  'multiSelect',
  'checkbox',
  'radio',
  'file',
  'image',
  'currency',
  'percent',
  'rating',
  'richText',
  'lookup',
]);

// 字段验证规则 schema
export const fieldValidationSchema = z.object({
  required: z.boolean().default(false),
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  pattern: z.string().optional(),
  patternMessage: z.string().optional(),
  unique: z.boolean().default(false),
});

// 选项值 schema
export const fieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// 自定义字段 schema
export const customFieldSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, '字段名称不能为空')
    .max(50, '字段名称最多50个字符')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '字段名称必须以字母开头，只能包含字母、数字和下划线'),
  label: z
    .string()
    .min(1, '字段标签不能为空')
    .max(100, '字段标签最多100个字符'),
  type: fieldTypeEnum,
  placeholder: z.string().max(200, '占位符最多200个字符').optional(),
  description: z.string().max(500, '描述最多500个字符').optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  options: z.array(fieldOptionSchema).optional(),
  validation: fieldValidationSchema.optional(),
  objectType: z.string().min(1, '请选择关联对象'),
  groupId: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isSystem: z.boolean().default(false),
  isSearchable: z.boolean().default(true),
  isSortable: z.boolean().default(true),
  showInList: z.boolean().default(true),
  showInDetail: z.boolean().default(true),
  showInFilter: z.boolean().default(true),
  width: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('md'),
});

export type CustomFieldFormData = z.infer<typeof customFieldSchema>;
export type FieldValidation = z.infer<typeof fieldValidationSchema>;
export type FieldOption = z.infer<typeof fieldOptionSchema>;

// 字段分组 schema
export const fieldGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '分组名称不能为空').max(50, '分组名称最多50个字符'),
  label: z.string().min(1, '分组标签不能为空').max(100, '分组标签最多100个字符'),
  objectType: z.string().min(1, '请选择关联对象'),
  sortOrder: z.number().int().default(0),
  isCollapsed: z.boolean().default(false),
  columns: z.number().int().min(1).max(4).default(2),
});

export type FieldGroupFormData = z.infer<typeof fieldGroupSchema>;

// 批量更新字段顺序 schema
export const updateFieldOrderSchema = z.object({
  objectType: z.string(),
  fieldOrders: z.array(
    z.object({
      fieldId: z.string(),
      sortOrder: z.number(),
      groupId: z.string().optional(),
    })
  ),
});

export type UpdateFieldOrderFormData = z.infer<typeof updateFieldOrderSchema>;