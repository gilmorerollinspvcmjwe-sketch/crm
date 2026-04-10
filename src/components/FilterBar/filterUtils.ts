// FilterBar 工具函数

import type {
  Filter,
  FilterGroupNew,
  FilterState,
  FilterItem,
  FilterField,
  OperatorType,
  FilterCondition,
  FilterGroupLegacy,
} from './types';
import { FIELD_OPERATORS, createEmptyFilterGroup } from './types';

// Re-export createEmptyFilterGroup for backwards compatibility
export { createEmptyFilterGroup };

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建空的筛选组（新 FilterBar 使用）
 */
export function createEmptyGroup(): FilterGroupNew {
  return {
    id: generateId(),
    logic: 'AND',
    filters: [],
  };
}

/**
 * 创建空的筛选条件
 */
export function createEmptyFilter(fieldName?: string): Filter {
  return {
    id: generateId(),
    field: fieldName || '',
    operator: 'eq',
    value: null,
  };
}

/**
 * 根据字段名获取字段配置
 */
export function getFieldByName(
  fields: FilterItem[],
  name: string
): FilterItem | undefined {
  return fields.find((f) => f.name === name);
}

/**
 * 根据字段类型获取支持的操作符
 */
export function getOperatorsForField(field: FilterItem): OperatorType[] {
  return FIELD_OPERATORS[field.type] || [];
}

/**
 * 将 FilterItem 转换为 FilterField
 */
export function itemToField(item: FilterItem): FilterField {
  return {
    name: item.name,
    label: item.label,
    type: item.type,
    operators: getOperatorsForField(item),
    placeholder: item.placeholder,
    options: item.options,
  };
}

/**
 * 验证筛选条件是否完整
 */
export function isFilterValid(filter: Filter): boolean {
  if (!filter.field || !filter.operator) {
    return false;
  }
  if (filter.value === null || filter.value === undefined) {
    return false;
  }
  if (Array.isArray(filter.value) && filter.value.length === 0) {
    return false;
  }
  if (typeof filter.value === 'string' && filter.value.trim() === '') {
    return false;
  }
  return true;
}

/**
 * 验证筛选组是否有效
 */
export function isGroupValid(group: FilterGroupNew): boolean {
  if (!group.filters || group.filters.length === 0) {
    return false;
  }
  return group.filters.every((filter) => {
    if ('logic' in filter) {
      return isGroupValid(filter as FilterGroupNew);
    }
    return isFilterValid(filter as Filter);
  });
}

/**
 * 获取筛选组中所有筛选条件的数量
 */
export function countFilters(group: FilterGroupNew): number {
  return group.filters.reduce((count, filter) => {
    if ('logic' in filter) {
      return count + countFilters(filter as FilterGroupNew);
    }
    return count + 1;
  }, 0);
}

/**
 * 扁平化筛选组，获取所有筛选条件
 */
export function flattenFilters(group: FilterGroupNew): Filter[] {
  const result: Filter[] = [];
  group.filters.forEach((filter) => {
    if ('logic' in filter) {
      result.push(...flattenFilters(filter as FilterGroupNew));
    } else {
      result.push(filter as Filter);
    }
  });
  return result;
}

/**
 * 从筛选状态生成描述性标签
 */
export function generateFilterLabels(
  state: FilterState,
  fields: FilterItem[]
): string[] {
  const labels: string[] = [];

  state.groups.forEach((group) => {
    const groupLabels = generateGroupLabels(group, fields);
    if (groupLabels.length > 0) {
      labels.push(...groupLabels);
    }
  });

  return labels;
}

function generateGroupLabels(
  group: FilterGroupNew,
  fields: FilterItem[],
  parentLogic?: 'AND' | 'OR'
): string[] {
  const labels: string[] = [];

  group.filters.forEach((filter, index) => {
    if ('logic' in filter) {
      const subLabels = generateGroupLabels(
        filter as FilterGroupNew,
        fields,
        group.logic
      );
      labels.push(...subLabels);
    } else {
      const field = fields.find((f) => f.name === filter.field);
      if (field) {
        const valueLabel = formatFilterValue(filter.value, field.type);
        const logicPrefix =
          index > 0 ? (group.logic === 'AND' ? '且' : '或') : '';
        labels.push(`${logicPrefix}${field.label}: ${valueLabel}`);
      }
    }
  });

  return labels;
}

/**
 * 格式化筛选值为可读字符串
 */
export function formatFilterValue(
  value: Filter['value'],
  type: string
): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (type === 'dateRange' && value.length === 2) {
      const start = value[0] instanceof Date ? formatDate(value[0]) : value[0];
      const end = value[1] instanceof Date ? formatDate(value[1]) : value[1];
      return `${start} 至 ${end}`;
    }
    return value.join(', ');
  }

  if (value instanceof Date) {
    return formatDate(value);
  }

  return String(value);
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 深度克隆筛选状态
 */
export function cloneFilterState(state: FilterState): FilterState {
  return JSON.parse(JSON.stringify(state));
}

/**
 * 深度克隆筛选组
 */
export function cloneFilterGroup(group: FilterGroupNew): FilterGroupNew {
  return JSON.parse(JSON.stringify(group));
}

/**
 * 从筛选状态构建查询参数
 */
export function buildQueryParams(state: FilterState): Record<string, any> {
  const params: Record<string, any> = {};

  state.groups.forEach((group, groupIndex) => {
    const groupParams = buildGroupQueryParams(group, groupIndex);
    Object.assign(params, groupParams);
  });

  return params;
}

function buildGroupQueryParams(
  group: FilterGroupNew,
  groupIndex: number,
  prefix?: string
): Record<string, any> {
  const params: Record<string, any> = {};
  const groupPrefix = prefix || `group_${groupIndex}`;

  params[`${groupPrefix}_logic`] = group.logic;

  group.filters.forEach((filter, filterIndex) => {
    const filterPrefix = `${groupPrefix}_filter_${filterIndex}`;

    if ('logic' in filter) {
      const subParams = buildGroupQueryParams(
        filter as FilterGroupNew,
        filterIndex,
        filterPrefix
      );
      Object.assign(params, subParams);
    } else {
      params[`${filterPrefix}_field`] = filter.field;
      params[`${filterPrefix}_operator`] = filter.operator;
      params[`${filterPrefix}_value`] = serializeFilterValue(filter.value);
    }
  });

  return params;
}

/**
 * 序列化筛选值为字符串（用于 URL 参数）
 */
export function serializeFilterValue(value: Filter['value']): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((v) => (v instanceof Date ? v.toISOString() : String(v)))
      .join(',');
  }

  return String(value);
}

/**
 * 反序列化筛选值
 */
export function deserializeFilterValue(
  value: string,
  type: string
): Filter['value'] {
  if (!value) {
    return null;
  }

  if (type === 'dateRange') {
    const parts = value.split(',');
    if (parts.length === 2) {
      return [new Date(parts[0]), new Date(parts[1])];
    }
  }

  if (type === 'number') {
    const num = Number(value);
    if (!isNaN(num)) {
      return num;
    }
  }

  return value;
}

/**
 * 检查 between 条件
 */
function checkBetweenCondition(dataValue: unknown, filterValue: Filter['value']): boolean {
  if (!Array.isArray(filterValue) || filterValue.length !== 2) {
    return false;
  }
  // Type assertion to handle the complex union type
  const [v0, v1] = filterValue as [string | number, string | number];
  return Number(dataValue) >= Number(v0) && Number(dataValue) <= Number(v1);
}

/**
 * 检查筛选条件是否匹配数据项
 */
export function matchesFilter(
  data: Record<string, any>,
  filter: Filter
): boolean {
  const dataValue = data[filter.field];

  if (dataValue === null || dataValue === undefined) {
    return false;
  }

  const { operator, value } = filter;

  switch (operator) {
    case 'eq':
      return dataValue === value;
    case 'neq':
      return dataValue !== value;
    case 'contains':
      return String(dataValue).includes(String(value));
    case 'startsWith':
      return String(dataValue).startsWith(String(value));
    case 'endsWith':
      return String(dataValue).endsWith(String(value));
    case 'in': {
      const arrVal = Array.isArray(value) ? value : (value as unknown[]);
      return arrVal !== null && arrVal.includes(dataValue);
    }
    case 'notIn': {
      const arrVal = Array.isArray(value) ? value : (value as unknown[]);
      return arrVal !== null && !arrVal.includes(dataValue);
    }
    case 'gt':
      return Number(dataValue) > Number(value);
    case 'lt':
      return Number(dataValue) < Number(value);
    case 'gte':
      return Number(dataValue) >= Number(value);
    case 'lte':
      return Number(dataValue) <= Number(value);
    case 'between':
      return checkBetweenCondition(dataValue, value);
    default:
      return false;
  }
}

/**
 * 检查数据项是否匹配筛选组
 */
export function matchesFilterGroup(
  data: Record<string, any>,
  group: FilterGroupNew
): boolean {
  if (!group.filters || group.filters.length === 0) {
    return true;
  }

  const matches = group.filters.map((filter) => {
    if ('logic' in filter) {
      return matchesFilterGroup(data, filter as FilterGroupNew);
    }
    return matchesFilter(data, filter as Filter);
  });

  if (group.logic === 'AND') {
    return matches.every((m) => m);
  } else {
    return matches.some((m) => m);
  }
}

/**
 * 过滤数据
 */
export function filterData(
  data: Record<string, any>[],
  state: FilterState
): Record<string, any>[] {
  if (!state.groups || state.groups.length === 0) {
    return data;
  }

  return data.filter((item) => {
    return state.groups.every((group) => matchesFilterGroup(item, group));
  });
}

// ==================== FilterBuilder / Legacy API 相关函数 ====================

/**
 * 检查单个条件是否匹配数据项
 */
export function applyCondition(
  data: Record<string, any>,
  condition: FilterCondition,
  fields: FilterField[]
): boolean {
  const dataValue = data[condition.field];
  const field = fields.find((f) => f.name === condition.field);

  if (dataValue === null || dataValue === undefined) {
    return false;
  }

  const { operator, value, value2 } = condition;

  switch (operator) {
    case 'eq':
      return String(dataValue) === String(value);
    case 'neq':
      return String(dataValue) !== String(value);
    case 'contains':
      return String(dataValue).includes(String(value));
    case 'startsWith':
      return String(dataValue).startsWith(String(value));
    case 'endsWith':
      return String(dataValue).endsWith(String(value));
    case 'in':
      return Array.isArray(value) && value.includes(dataValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(dataValue);
    case 'gt':
      return Number(dataValue) > Number(value);
    case 'lt':
      return Number(dataValue) < Number(value);
    case 'gte':
      return Number(dataValue) >= Number(value);
    case 'lte':
      return Number(dataValue) <= Number(value);
    case 'between':
      if (value !== undefined && value2 !== undefined) {
        return (
          Number(dataValue) >= Number(value) &&
          Number(dataValue) <= Number(value2)
        );
      }
      return false;
    default:
      return false;
  }
}

/**
 * 检查筛选组是否有有效的条件
 */
export function hasValidConditions(group: FilterGroupLegacy): boolean {
  if (!group.conditions || group.conditions.length === 0) {
    return false;
  }

  for (const condition of group.conditions) {
    if ('operator' in condition && 'conditions' in condition) {
      // 嵌套组
      if (hasValidConditions(condition as FilterGroupLegacy)) {
        return true;
      }
    } else if ((condition as FilterCondition).field) {
      // 单个条件
      return true;
    }
  }

  return false;
}

/**
 * 获取筛选组中的条件数量
 */
export function getConditionCount(group: FilterGroupLegacy): number {
  if (!group.conditions || group.conditions.length === 0) {
    return 0;
  }

  return group.conditions.reduce((count, condition) => {
    if ('operator' in condition && 'conditions' in condition) {
      // 嵌套组
      return count + getConditionCount(condition as FilterGroupLegacy);
    }
    // 单个条件
    return count + 1;
  }, 0);
}

/**
 * 应用筛选组到数据数组
 */
export function applyFilterGroup<T extends Record<string, any>>(
  data: T[],
  group: FilterGroupLegacy,
  fields?: FilterField[]
): T[] {
  if (!group.conditions || group.conditions.length === 0) {
    return data;
  }

  return data.filter((item) => {
    const matches = group.conditions.map((condition) => {
      if ('operator' in condition && 'conditions' in condition) {
        // 嵌套组
        const nestedGroup = condition as FilterGroupLegacy;
        const nestedResults = applyFilterGroup([item], nestedGroup, fields);
        return nestedResults.length > 0;
      }
      // 单个条件
      return applyCondition(item, condition as FilterCondition, fields || []);
    });

    if (group.operator === 'AND') {
      return matches.every((m) => m);
    } else {
      return matches.some((m) => m);
    }
  });
}
