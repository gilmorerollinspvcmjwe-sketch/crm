import { z } from 'zod';

// 自定义对象类型
export const objectTypeEnum = z.enum([
  'standard',
  'custom',
  'activity',
  'setting',
]);

// 关联关系类型
export const relationTypeEnum = z.enum([
  'oneToOne',
  'oneToMany',
  'manyToMany',
]);

// 字段定义 schema（简化版，完整版在 customFieldSchema）
const fieldDefinitionSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  searchable: z.boolean().default(true),
});

// 关联关系 schema
export const objectRelationSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, '关联名称不能为空')
    .max(50, '关联名称最多50个字符')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '关联名称必须以字母开头'),
  label: z.string().min(1, '关联标签不能为空').max(100, '关联标签最多100个字符'),
  type: relationTypeEnum,
  sourceObject: z.string(),
  targetObject: z.string(),
  sourceField: z.string().optional(),
  targetField: z.string().optional(),
  junctionObject: z.string().optional(),
  cascadeDelete: z.boolean().default(false),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type ObjectRelationFormData = z.infer<typeof objectRelationSchema>;

// 自定义对象 schema
export const customObjectSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, '对象名称至少2个字符')
    .max(50, '对象名称最多50个字符')
    .regex(/^[A-Z][a-zA-Z0-9]*$/, '对象名称必须以大写字母开头，使用驼峰命名'),
  label: z
    .string()
    .min(1, '对象标签不能为空')
    .max(100, '对象标签最多100个字符'),
  pluralLabel: z.string().max(100, '复数标签最多100个字符').optional(),
  description: z.string().max(500, '描述最多500个字符').optional(),
  type: objectTypeEnum.default('custom'),
  icon: z.string().default('Box'),
  color: z.string().default('#6366f1'),
  apiName: z
    .string()
    .min(2, 'API名称至少2个字符')
    .max(50, 'API名称最多50个字符')
    .regex(/^[a-z][a-z0-9_]*$/, 'API名称必须以小写字母开头，只能包含小写字母、数字和下划线'),
  fields: z.array(fieldDefinitionSchema).default([]),
  relations: z.array(objectRelationSchema).default([]),
  layouts: z.array(z.string()).default([]),
  validationRules: z.array(z.string()).default([]),
  triggers: z.array(z.string()).default([]),
  permissions: z.object({
    create: z.array(z.string()).default([]),
    read: z.array(z.string()).default([]),
    update: z.array(z.string()).default([]),
    delete: z.array(z.string()).default([]),
  }).default({
    create: [],
    read: [],
    update: [],
    delete: [],
  }),
  features: z.object({
    activities: z.boolean().default(true),
    notes: z.boolean().default(true),
    attachments: z.boolean().default(true),
    sharing: z.boolean().default(false),
    approval: z.boolean().default(false),
    reports: z.boolean().default(true),
  }).default({
    activities: true,
    notes: true,
    attachments: true,
    sharing: false,
    approval: false,
    reports: true,
  }),
  isSystem: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isSearchable: z.boolean().default(true),
  enableAudit: z.boolean().default(true),
});

export type CustomObjectFormData = z.infer<typeof customObjectSchema>;

// 布局配置 schema
export const layoutSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '布局名称不能为空'),
  type: z.enum(['list', 'detail', 'form', 'kanban']),
  objectType: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      columns: z.number().int().min(1).max(4),
      fields: z.array(
        z.object({
          fieldId: z.string(),
          colSpan: z.number().int().min(1).max(4).default(1),
          rowSpan: z.number().int().min(1).default(1),
        })
      ),
    })
  ),
  isDefault: z.boolean().default(false),
  profiles: z.array(z.string()).default([]),
});

export type LayoutFormData = z.infer<typeof layoutSchema>;

// 列表视图配置 schema
export const listViewSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '视图名称不能为空'),
  objectType: z.string(),
  fields: z.array(z.string()).min(1, '至少选择一个显示字段'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  filters: z.array(
    z.object({
      field: z.string(),
      operator: z.string(),
      value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
    })
  ).default([]),
  pageSize: z.number().int().min(10).max(200).default(20),
  isDefault: z.boolean().default(false),
  isShared: z.boolean().default(false),
  sharedWith: z.array(z.string()).default([]),
});

export type ListViewFormData = z.infer<typeof listViewSchema>;