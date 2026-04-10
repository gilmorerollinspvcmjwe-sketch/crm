/**
 * FilterTags 筛选标签组件
 * 显示当前激活的筛选条件
 */
import React, { useMemo } from 'react';
import { X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FilterTagsProps, FilterItem } from './types';
import { cn } from '@/lib/utils';

/** 获取筛选标签显示值 */
const getFilterDisplayValue = (
  name: string,
  value: unknown,
  filters: FilterItem[]
): string => {
  const filter = filters.find(f => f.name === name);
  if (!filter) return String(value);

  // 处理 select 类型
  if (filter.type === 'select' && filter.options) {
    if (Array.isArray(value)) {
      return value
        .map(v => filter.options?.find(o => o.value === v)?.label || v)
        .join(', ');
    }
    return (
      filter.options.find(o => o.value === value)?.label || String(value)
    );
  }

  // 处理日期范围
  if (filter.type === 'dateRange' && Array.isArray(value)) {
    const [start, end] = value as [Date | string, Date | string];
    if (start && end) {
      return `${formatDate(start)} ~ ${formatDate(end)}`;
    }
    return start ? formatDate(start) : (end ? formatDate(end) : '');
  }

  // 处理日期
  if (filter.type === 'date' && value) {
    return formatDate(value as Date | string);
  }

  return String(value ?? '');
};

/** 格式化日期 */
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * FilterTags 组件
 * 显示当前激活的筛选条件标签
 */
export const FilterTags: React.FC<FilterTagsProps> = ({
  activeFilters,
  filters,
  onRemove,
  onClearAll,
  className = '',
}) => {
  // 计算活动筛选的数量
  const activeCount = useMemo(() => {
    return Object.keys(activeFilters).filter(key => {
      const value = activeFilters[key];
      if (value === undefined || value === null || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }).length;
  }, [activeFilters]);

  // 没有活动筛选时不显示
  if (activeCount === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg border",
        "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200",
        className
      )}
    >
      {/* 筛选图标和计数 */}
      <div className="flex items-center gap-1.5 text-blue-600 text-sm font-medium">
        <Filter className="h-3.5 w-3.5" />
        <span>当前筛选</span>
        <Badge variant="default" className="h-5 px-1.5 text-xs bg-blue-500">
          {activeCount}
        </Badge>
      </div>

      {/* 分隔线 */}
      <div className="w-px h-4 bg-blue-200 mx-1" />

      {/* 筛选标签列表 */}
      {Object.entries(activeFilters).map(([name, value]) => {
        // 过滤空值
        if (value === undefined || value === null || value === '') return null;
        if (Array.isArray(value) && value.length === 0) return null;

        const filter = filters.find(f => f.name === name);
        const displayValue = getFilterDisplayValue(name, value, filters);

        return (
          <div
            key={name}
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-md",
              "bg-white border border-gray-200 text-sm",
              "transition-all hover:border-blue-300"
            )}
          >
            {/* 字段名 */}
            <span className="text-gray-500">{filter?.label || name}:</span>
            {/* 值 */}
            <span className="text-blue-600 font-medium">
              {displayValue}
            </span>
            {/* 移除按钮 */}
            <button
              type="button"
              onClick={() => onRemove(name)}
              className={cn(
                "flex items-center justify-center w-4 h-4 p-0",
                "border-none bg-transparent text-gray-400",
                "rounded-full cursor-pointer transition-all",
                "hover:bg-red-500 hover:text-white"
              )}
              title="移除此筛选"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}

      {/* 清除全部按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="ml-auto text-gray-500 text-sm h-auto py-1 px-2"
      >
        清除全部
      </Button>
    </div>
  );
};

export default FilterTags;