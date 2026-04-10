// FilterBar 类型定义

export type FilterType = 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'multiSelect';

export type OperatorType =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'between';

export interface FilterItem {
  name: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: { label: string; value: string; disabled?: boolean }[];
  defaultValue?: unknown;
  min?: number;
  max?: number;
}

export interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  operators: OperatorType[];
  placeholder?: string;
  options?: { label: string; value: string; disabled?: boolean }[];
  defaultValue?: unknown;
  min?: number;
  max?: number;
}

export interface FilterValue {
  field: string;
  operator: OperatorType;
  value: string | number | string[] | number[] | Date | [Date, Date] | null;
}

export interface Filter {
  id: string;
  field: string;
  operator: OperatorType;
  value: string | number | string[] | number[] | Date | [Date, Date] | null;
}

// 新 FilterBar 使用的类型（FilterBar.tsx, FilterGroup.tsx, FilterField.tsx）
export interface FilterGroupNew {
  id: string;
  logic: 'AND' | 'OR';
  filters: (Filter | FilterGroupNew)[];
}

export interface FilterState {
  groups: FilterGroupNew[];
}

// 原有 FilterBuilder 使用的类型（保持向后兼容）
// 已重命名为 FilterGroupLegacy 以避免与 FilterGroup 组件冲突
export interface FilterGroupLegacy {
  id: string;
  operator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroupLegacy)[];
}

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  state?: FilterState;
  createdAt: string;
  updatedAt: string;
  // Legacy properties for backwards compatibility
  type?: 'simple' | 'advanced';
  filters?: Record<string, unknown>;
  advancedFilter?: FilterGroupLegacy;
}

export interface FilterBarProps {
  /** 可用的筛选字段配置 */
  fields: FilterItem[];
  /** 当前筛选状态 */
  value?: FilterState;
  /** 筛选状态变化回调 */
  onChange?: (state: FilterState) => void;
  /** 是否显示高级筛选（逻辑组）功能 */
  enableAdvanced?: boolean;
  /** 是否显示保存/加载筛选器功能 */
  enableSaveLoad?: boolean;
  /** 已保存的筛选器列表 */
  savedFilters?: SavedFilter[];
  /** 保存筛选器回调 */
  onSaveFilter?: (name: string, state: FilterState) => void;
  /** 加载筛选器回调 */
  onLoadFilter?: (filter: SavedFilter) => void;
  /** 删除筛选器回调 */
  onDeleteFilter?: (id: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
}

export interface FilterFieldProps {
  /** 字段配置 */
  field: FilterItem;
  /** 当前筛选值 */
  filter?: Filter;
  /** 值变化回调 */
  onChange: (filter: Filter) => void;
  /** 删除回调 */
  onDelete: () => void;
  /** 是否显示操作符选择 */
  showOperators?: boolean;
}

export interface FilterGroupProps {
  /** 组配置 */
  group: FilterGroupNew;
  /** 可用字段 */
  fields: FilterItem[];
  /** 组变化回调 */
  onChange: (group: FilterGroupNew) => void;
  /** 删除回调 */
  onDelete: () => void;
  /** 是否显示高级功能 */
  enableAdvanced?: boolean;
  /** 嵌套深度 */
  depth?: number;
}

export interface FilterTagsProps {
  /** 活动筛选条件 */
  activeFilters: Record<string, unknown>;
  /** 可用筛选项配置 */
  filters: FilterItem[];
  /** 移除单个筛选回调 */
  onRemove: (name: string) => void;
  /** 清除全部筛选回调 */
  onClearAll: () => void;
  /** 自定义类名 */
  className?: string;
}

// 操作符标签映射
export const OPERATOR_LABELS: Record<OperatorType, string> = {
  eq: '等于',
  neq: '不等于',
  contains: '包含',
  startsWith: '开始于',
  endsWith: '结束于',
  in: '在...中',
  notIn: '不在...中',
  gt: '大于',
  lt: '小于',
  gte: '大于等于',
  lte: '小于等于',
  between: '之间',
};

// 字段类型支持的操作符
export const FIELD_OPERATORS: Record<FilterType, OperatorType[]> = {
  text: ['eq', 'neq', 'contains', 'startsWith', 'endsWith'],
  select: ['eq', 'neq', 'in', 'notIn'],
  number: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between'],
  date: ['eq', 'gte', 'lte', 'between'],
  dateRange: ['eq', 'gte', 'lte', 'between'],
  multiSelect: ['in', 'notIn'],
};

// ==================== FilterBuilder 相关类型 ====================

export type FilterOperator = OperatorType;

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value?: unknown;
  value2?: unknown; // 用于 between 操作符的第二个值
}

export interface FilterBuilderProps {
  /** 可用的筛选字段 */
  fields: FilterField[];
  /** 当前筛选组 */
  value: FilterGroupLegacy;
  /** 筛选组变化回调 */
  onChange: (group: FilterGroupLegacy) => void;
  /** 最大嵌套深度 */
  maxDepth?: number;
}

export interface FilterBarLegacyProps {
  /** 筛选字段配置 */
  filters: FilterItem[];
  /** 筛选变化回调 */
  onFilterChange?: (filters: Record<string, unknown>) => void;
  /** 高级筛选变化回调 */
  onAdvancedFilterChange?: (group: FilterGroupLegacy) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否显示收起按钮 */
  showCollapse?: boolean;
  /** 默认显示数量 */
  defaultShowCount?: number;
  /** 是否显示筛选标签 */
  showFilterTags?: boolean;
  /** 是否启用保存功能 */
  enableSave?: boolean;
  /** 本地存储 key */
  storageKey?: string;
  /** 自定义类名 */
  className?: string;
  /** 是否启用高级筛选 */
  enableAdvancedFilter?: boolean;
  /** 高级筛选字段配置 */
  advancedFilterFields?: FilterField[];
}

// 操作符标签映射（别名）
export const OPERATOR_LABELS_ALIAS: Record<FilterOperator, string> = OPERATOR_LABELS;

/** 获取操作符标签 */
export function getOperatorLabel(operator: FilterOperator): string {
  return OPERATOR_LABELS[operator] || operator;
}

/** 获取字段类型默认操作符 */
export function getDefaultOperators(type: FilterType): FilterOperator[] {
  return FIELD_OPERATORS[type] || ['eq'];
}

/** 生成唯一 ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** 创建空筛选组 */
export function createEmptyFilterGroup(operator: 'AND' | 'OR' = 'AND'): FilterGroupLegacy {
  return {
    id: generateId(),
    operator,
    conditions: [],
  };
}

/** 创建筛选条件 */
export function createFilterCondition(field?: string, operator?: FilterOperator, value?: unknown): FilterCondition {
  return {
    id: generateId(),
    field: field || '',
    operator: operator || 'eq',
    value: value,
  };
}

/** 验证筛选组是否有有效条件 */
export function hasValidConditions(group: FilterGroupLegacy): boolean {
  if (!group.conditions || group.conditions.length === 0) {
    return false;
  }
  return group.conditions.every((condition) => {
    if ('operator' in condition && 'conditions' in condition) {
      return hasValidConditions(condition as FilterGroupLegacy);
    }
    const cond = condition as FilterCondition;
    return cond.field && cond.operator && cond.value !== undefined;
  });
}

/** 获取筛选条件数量 */
export function getConditionCount(group: FilterGroupLegacy): number {
  return group.conditions.reduce((count, condition) => {
    if ('operator' in condition && 'conditions' in condition) {
      return count + getConditionCount(condition as FilterGroupLegacy);
    }
    return count + 1;
  }, 0);
}

// ==================== Dialog Props ====================

export interface SaveFilterDialogProps {
  /** 对话框是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 保存回调 */
  onSave: (name: string, description?: string) => void;
  /** 当前筛选条件 */
  filters: Record<string, unknown>;
  /** localStorage key */
  storageKey?: string;
}

export interface LoadFilterDialogProps {
  /** 对话框是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 加载筛选回调 */
  onLoad: (filter: SavedFilter) => void;
  /** 删除筛选回调 */
  onDelete?: (id: string) => void;
  /** localStorage key */
  storageKey?: string;
}
