/**
 * 自定义对象类型定义
 * Custom Object Type Definitions
 *
 * 提供自定义对象系统的完整类型定义，包括：
 * - 枚举类型（状态、字段类型、关系类型等）
 * - 核心接口（字段、对象、记录、布局等）
 * - 列表和查询参数类型
 */

// ============================================
// 枚举类型
// ============================================

/**
 * 自定义对象状态（字符串联合类型）
 */
export type CustomObjectStatus = 'draft' | 'active' | 'archived'

/**
 * 字段类型（字符串联合类型，兼容字符串字面量）
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'picklist'
  | 'multipicklist'
  | 'lookup'
  | 'file'
  // 兼容旧代码的扩展类型
  | 'textarea'
  | 'decimal'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'currency'
  | 'percent'
  | 'phone'
  | 'email'
  | 'url'
  | 'user'
  | 'department'
  | 'image'
  | 'video'
  | 'richtext'
  | 'formula'
  | 'rollup'
  | 'relation'
  | 'address'
  | 'rating'

/**
 * 对象关系类型
 */
export enum RelationType {
  ONE_TO_MANY = 'one_to_many',
  MANY_TO_ONE = 'many_to_one',
  MANY_TO_MANY = 'many_to_many',
  SELF = 'self',
}

/**
 * 级联删除类型
 */
export enum CascadeDeleteType {
  NONE = 'none',
  CASCADE = 'cascade',
  CLEAR = 'clear',
  RESTRICTED = 'restricted',
}

/**
 * 显示类型
 */
export enum DisplayType {
  CARD = 'card',
  LIST = 'list',
  COUNT = 'count',
}

/**
 * 表单类型
 */
export enum FormType {
  CREATE = 'create',
  EDIT = 'edit',
  DETAIL = 'detail',
  FILTER = 'filter',
  BULK_EDIT = 'bulk_edit',
}

/**
 * 表单条件操作符
 */
export enum FormConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
}

// ============================================
// 字段定义
// ============================================

/**
 * 字段验证规则
 */
export interface FieldValidation {
  unique?: boolean
  hidden?: boolean
  readOnly?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  precision?: number
  pattern?: string
  patternMessage?: string
  maxSize?: number
  allowedTypes?: string[]
  errorMessage?: string
}

/**
 * 字段选项（用于 Picklist/Multipicklist）
 */
export interface FieldOption {
  value: string
  label: string
  color?: string
  sortOrder: number
  enabled: boolean
}

/** @deprecated 使用 FieldOption 代替 */
export type PropertyOption = FieldOption

/**
 * 自定义字段定义
 */
export interface CustomField {
  id: string
  /** 字段名称（API 用） */
  name: string
  /** 显示标签 */
  label: string
  /** 字段类型 */
  type: FieldType
  /** 是否必填 */
  required: boolean
  /** 是否唯一 */
  unique: boolean
  /** 默认值 */
  defaultValue?: unknown
  /** 下拉选项 */
  picklistOptions?: string[]
  /** 关联对象名 */
  lookupObject?: string
  /** 验证规则 */
  validationRule?: string
  /** 帮助文本 */
  description?: string
  /** 占位符 */
  placeholder?: string
  /** 是否在列表中显示 */
  listVisible: boolean
  /** 是否在详情中显示 */
  detailVisible: boolean
  /** 是否可搜索 */
  searchable: boolean
  /** 是否可排序 */
  sortable: boolean
  /** 是否可批量编辑 */
  bulkEditable: boolean
  /** 排序权重 */
  sortOrder: number
  /** 是否启用 */
  enabled: boolean
  // 兼容旧代码的属性
  /** 内部类型 */
  internalType?: string
  /** 字段分组 */
  group?: string
  /** 是否为主字段 */
  isPrimary?: boolean
  /** 是否为次字段 */
  isSecondary?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 验证规则对象 */
  validation?: FieldValidation
  /** 选项列表 */
  options?: FieldOption[]
  /** 关联对象 ID */
  targetObjectId?: string
  /** 所属对象 ID */
  objectId?: string
  /** 创建人 */
  createdBy?: string
  /** 创建时间 */
  createdAt?: string
}

// ============================================
// 记录屏幕布局
// ============================================

/**
 * 布局区块
 */
export interface LayoutSection {
  id: string
  title?: string
  fields: string[]
  collapsed: boolean
  sortOrder: number
}

/**
 * 记录屏幕布局
 */
export interface RecordScreenLayout {
  sections: LayoutSection[]
}

// ============================================
// 自定义对象定义
// ============================================

/**
 * 自定义对象基础定义
 */
export interface CustomObject {
  id: string
  /** 对象标识名（用于 API） */
  name: string
  /** 单数名称 */
  label: string
  /** 复数名称 */
  pluralLabel: string
  /** 对象描述 */
  description?: string
  /** 对象图标 */
  icon?: string
  /** 图标颜色 */
  iconColor?: string
  /** 对象状态 */
  status: CustomObjectStatus
  /** 是否为系统对象 */
  isSystem: boolean
  /** 排序权重 */
  sortOrder: number
  /** 是否在导航中显示 */
  showInNavigation: boolean
  /** 创建人 */
  createdBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新人 */
  updatedBy?: string
  /** 更新时间 */
  updatedAt?: string
  /** 是否启用 */
  enabled?: boolean
  /** 单数名称（别名） */
  singularName?: string
  /** 复数名称（别名） */
  pluralName?: string
  /** 次要属性列表 */
  secondaryProperties?: string[]
}

/**
 * 自定义对象完整定义（包含字段）
 */
export interface CustomObjectDefinition extends CustomObject {
  fields: CustomField[]
  properties?: ObjectProperty[]
  relationships?: ObjectRelation[]
  forms?: ObjectForm[]
  recordScreenLayout?: RecordScreenLayout
  listViewFields?: string[]
}

// ============================================
// 对象关系
// ============================================

/**
 * 对象关系定义
 */
export interface ObjectRelation {
  id: string
  /** 关系名称 */
  name: string
  /** 源对象 ID */
  sourceObjectId: string
  /** 目标对象 ID */
  targetObjectId: string
  /** 关系类型 */
  type: RelationType
  /** 源对象显示名称 */
  sourceLabel: string
  /** 目标对象显示名称 */
  targetLabel: string
  /** 是否在源对象详情页显示 */
  sourceDisplay: boolean
  /** 是否在目标对象详情页显示 */
  targetDisplay: boolean
  /** 源对象显示方式 */
  sourceDisplayType: DisplayType
  /** 目标对象显示方式 */
  targetDisplayType: DisplayType
  /** 级联删除行为 */
  deleteCascade: CascadeDeleteType
  /** 是否启用 */
  enabled: boolean
  /** 创建人 */
  createdBy: string
  /** 创建时间 */
  createdAt: string
}

// ============================================
// 表单布局
// ============================================

/**
 * 表单条件
 */
export interface FormCondition {
  field: string
  operator: FormConditionOperator
  value: unknown
  combinator?: 'and' | 'or'
}

/**
 * 表单区块
 */
export interface FormSection {
  id: string
  title?: string
  fields: string[]
  conditions?: FormCondition[]
  collapsible?: boolean
  collapsed?: boolean
  sortOrder: number
}

/**
 * 表单布局
 */
export interface FormLayout {
  type: 'single_column' | 'two_column' | 'tabs' | 'accordion'
  sections: FormSection[]
}

/**
 * 表单定义
 */
export interface ObjectForm {
  id: string
  objectId: string
  name: string
  label: string
  type: FormType
  layout: FormLayout
  isDefault: boolean
  enabled: boolean
  createdBy: string
  createdAt: string
}

// ============================================
// 自定义对象记录
// ============================================

/**
 * 自定义对象记录
 */
export interface CustomObjectRecord {
  id: string
  /** 对象名称（用于 API） */
  objectName: string
  /** 对象 ID（兼容旧代码） */
  objectId?: string
  /** 记录数据 */
  data: Record<string, unknown>
  /** 创建人 */
  createdBy?: string
  /** 创建时间 */
  createdAt: string
  /** 更新人 */
  updatedBy?: string
  /** 更新时间 */
  updatedAt?: string
}

// ============================================
// 类型别名（兼容旧代码）
// ============================================

/** @deprecated 使用 CustomField 代替 */
export type ObjectProperty = CustomField

/** @deprecated 使用 FieldType 代替 */
export type PropertyType = FieldType

/** @deprecated 使用 CustomObjectRecord 代替 */
export type ObjectRecord = CustomObjectRecord

// ============================================
// 筛选条件
// ============================================

/**
 * 自定义对象筛选条件
 */
export interface CustomObjectFilter {
  objectName?: string
  status?: CustomObjectStatus
  search?: string
}

// ============================================
// 列表参数
// ============================================

/**
 * 自定义对象列表参数
 */
export interface CustomObjectListParams {
  search?: string
  status?: CustomObjectStatus
  enabled?: boolean
  isSystem?: boolean
}

/**
 * 对象记录列表参数
 */
export interface ObjectRecordListParams {
  objectId: string
  objectName?: string
  search?: string
  page?: number
  pageSize?: number
}

// ============================================
// API 响应类型
// ============================================

/**
 * 自定义对象列表响应
 */
export interface CustomObjectListResponse {
  items: CustomObject[]
  total: number
  page: number
  pageSize: number
}

/**
 * 对象记录列表响应
 */
export interface ObjectRecordListResponse {
  items: CustomObjectRecord[]
  total: number
  page: number
  pageSize: number
}
