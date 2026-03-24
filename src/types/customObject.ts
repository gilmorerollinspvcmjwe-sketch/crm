/**
 * 自定义对象类型定义
 */

/**
 * 属性类型枚举
 */
export enum PropertyType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DECIMAL = 'decimal',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  PHONE = 'phone',
  EMAIL = 'email',
  URL = 'url',
  USER = 'user',
  DEPARTMENT = 'department',
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
  RICHTEXT = 'richtext',
  FORMULA = 'formula',
  ROLLUP = 'rollup',
  RELATION = 'relation',
  ADDRESS = 'address',
  RATING = 'rating',
}

/**
 * 属性验证规则
 */
export interface PropertyValidation {
  unique?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  precision?: number;
  pattern?: string;
  patternMessage?: string;
  maxSize?: number;
  allowedTypes?: string[];
  errorMessage?: string;
}

/**
 * 属性选项
 */
export interface PropertyOption {
  value: string;
  label: string;
  color?: string;
  sortOrder: number;
  enabled: boolean;
}

/**
 * 对象属性定义
 */
export interface ObjectProperty {
  id: string;
  objectId: string;
  /** 属性名称（API 用） */
  name: string;
  /** 显示标签 */
  label: string;
  /** 内部类型 */
  internalType: PropertyType;
  /** 是否为主要属性 */
  isPrimary: boolean;
  /** 是否为次要属性 */
  isSecondary: boolean;
  /** 字段分组 */
  group?: string;
  /** 帮助文本 */
  description?: string;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 是否必填 */
  required: boolean;
  /** 是否在列表中显示 */
  listVisible: boolean;
  /** 是否在详情中显示 */
  detailVisible: boolean;
  /** 是否可搜索 */
  searchable: boolean;
  /** 是否可排序 */
  sortable: boolean;
  /** 是否可批量编辑 */
  bulkEditable: boolean;
  /** 验证规则 */
  validation?: PropertyValidation;
  /** 下拉/多选选项 */
  options?: PropertyOption[];
  /** 选项集 ID */
  optionsSetId?: string;
  /** 关联目标对象 ID */
  targetObjectId?: string;
  /** 是否多选（关联字段） */
  multiple?: boolean;
  /** 排序权重 */
  sortOrder: number;
  /** 是否启用 */
  enabled: boolean;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
}

/**
 * 对象关系类型
 */
export type RelationType = 'one_to_many' | 'many_to_one' | 'many_to_many' | 'self';

/**
 * 级联删除类型
 */
export type CascadeDeleteType = 'none' | 'cascade' | 'clear' | 'restricted';

/**
 * 显示类型
 */
export type DisplayType = 'card' | 'list' | 'count';

/**
 * 对象关系定义
 */
export interface ObjectRelation {
  id: string;
  /** 关系名称 */
  name: string;
  /** 源对象 ID */
  sourceObjectId: string;
  /** 目标对象 ID */
  targetObjectId: string;
  /** 关系类型 */
  type: RelationType;
  /** 源对象显示名称 */
  sourceLabel: string;
  /** 目标对象显示名称 */
  targetLabel: string;
  /** 是否在源对象详情页显示 */
  sourceDisplay: boolean;
  /** 是否在目标对象详情页显示 */
  targetDisplay: boolean;
  /** 源对象显示方式 */
  sourceDisplayType: DisplayType;
  /** 目标对象显示方式 */
  targetDisplayType: DisplayType;
  /** 级联删除行为 */
  deleteCascade: CascadeDeleteType;
  /** 是否启用 */
  enabled: boolean;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
}

/**
 * 表单条件操作符
 */
export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'greater_than' 
  | 'less_than' 
  | 'is_empty' 
  | 'is_not_empty';

/**
 * 表单条件
 */
export interface FormCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  combinator?: 'and' | 'or';
}

/**
 * 表单区块
 */
export interface FormSection {
  id: string;
  title?: string;
  fields: string[];
  conditions?: FormCondition[];
  collapsible?: boolean;
  collapsed?: boolean;
  sortOrder: number;
}

/**
 * 表单布局
 */
export interface FormLayout {
  type: 'single_column' | 'two_column' | 'tabs' | 'accordion';
  sections: FormSection[];
}

/**
 * 表单类型
 */
export type FormType = 'create' | 'edit' | 'detail' | 'filter' | 'bulk_edit';

/**
 * 表单定义
 */
export interface ObjectForm {
  id: string;
  objectId: string;
  name: string;
  label: string;
  type: FormType;
  layout: FormLayout;
  isDefault: boolean;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * 自定义对象定义
 */
export interface CustomObject {
  id: string;
  /** 对象标识名（用于 API） */
  name: string;
  /** 单数名称 */
  singularName: string;
  /** 复数名称 */
  pluralName: string;
  /** 对象描述 */
  description?: string;
  /** 对象图标 */
  icon?: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 主要属性 ID */
  primaryProperty: string;
  /** 次要属性 ID 列表 */
  secondaryProperties: string[];
  /** 是否启用 */
  enabled: boolean;
  /** 是否为系统对象 */
  isSystem: boolean;
  /** 排序权重 */
  sortOrder: number;
  /** 是否在导航中显示 */
  showInNavigation: boolean;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新人 */
  updatedBy?: string;
  /** 更新时间 */
  updatedAt?: string;
}

/**
 * 对象记录（数据）
 */
export interface ObjectRecord {
  id: string;
  objectId: string;
  data: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * 完整的对象定义（包含属性、关系、表单）
 */
export interface CustomObjectDefinition extends CustomObject {
  properties: ObjectProperty[];
  relationships: ObjectRelation[];
  forms: ObjectForm[];
}