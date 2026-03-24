/**
 * 自定义字段类型定义
 * @description 支持 12 种字段类型
 */
export enum FieldType {
  /** 单行文本 */
  TEXT = 'text',
  /** 多行文本 */
  TEXTAREA = 'textarea',
  /** 数字 */
  NUMBER = 'number',
  /** 日期 */
  DATE = 'date',
  /** 日期时间 */
  DATETIME = 'datetime',
  /** 单选 */
  SELECT = 'select',
  /** 多选 */
  MULTISELECT = 'multiselect',
  /** 开关 */
  SWITCH = 'switch',
  /** 人员 */
  USER = 'user',
  /** 部门 */
  DEPARTMENT = 'department',
  /** 关联 */
  RELATION = 'relation',
  /** 附件 */
  FILE = 'file',
}

/**
 * 模块类型枚举
 * @description 支持 9 个业务模块
 */
export enum ModuleType {
  /** 客户管理 */
  CUSTOMER = 'customer',
  /** 联系人 */
  CONTACT = 'contact',
  /** 线索管理 */
  LEAD = 'lead',
  /** 商机管理 */
  OPPORTUNITY = 'opportunity',
  /** 合同管理 */
  CONTRACT = 'contract',
  /** 产品库 */
  PRODUCT = 'product',
  /** 报价单 */
  QUOTE = 'quote',
  /** 工单系统 */
  TICKET = 'ticket',
  /** 活动管理 */
  CAMPAIGN = 'campaign',
}

/**
 * 字段验证规则
 */
export interface FieldValidation {
  /** 唯一性 */
  unique?: boolean;
  /** 最小长度 */
  minLength?: number;
  /** 最大长度 */
  maxLength?: number;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 正则表达式 */
  pattern?: string;
  /** 自定义错误消息 */
  errorMessage?: string;
}

/**
 * 自定义字段定义接口
 */
export interface CustomField {
  /** 字段 ID - 唯一标识 */
  id: string;
  /** 字段名称 - 用于 API，字母数字下划线 */
  name: string;
  /** 显示标签 - 用于 UI 展示 */
  label: string;
  /** 字段类型 */
  type: FieldType;
  /** 绑定模块 - 模块标识数组 */
  modules: ModuleType[];
  /** 是否必填 */
  required: boolean;
  /** 选项列表 - 单选/多选时使用 */
  options?: string[];
  /** 选项集 ID - 关联选项集管理 */
  optionsSetId?: string;
  /** 验证规则 */
  validation?: FieldValidation;
  /** 默认值 */
  defaultValue?: any;
  /** 占位符 */
  placeholder?: string;
  /** 排序序号 */
  sortOrder: number;
  /** 是否在列表中显示 */
  listVisible: boolean;
  /** 是否在详情中显示 */
  detailVisible: boolean;
  /** 是否启用 */
  enabled: boolean;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
  /** 最后修改人 */
  updatedBy?: string;
  /** 最后修改时间 */
  updatedAt?: string;
}

/**
 * 自定义字段值接口
 */
export interface CustomFieldValue {
  /** 记录 ID */
  recordId: string;
  /** 模块类型 */
  module: ModuleType;
  /** 字段值集合 - key 为字段名称，value 为字段值 */
  values: Record<string, any>;
  /** 最后更新时间 */
  updatedAt?: string;
  /** 最后更新人 */
  updatedBy?: string;
}

/**
 * 选项项接口
 */
export interface OptionItem {
  /** 选项值 */
  value: string;
  /** 显示标签 */
  label: string;
  /** 排序序号 */
  sortOrder: number;
}

/**
 * 选项集接口
 */
export interface OptionsSet {
  /** 选项集 ID */
  id: string;
  /** 选项集名称 */
  name: string;
  /** 选项列表 */
  options: OptionItem[];
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
}
