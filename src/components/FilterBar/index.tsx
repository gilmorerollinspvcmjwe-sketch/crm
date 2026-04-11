/**
 * FilterBar 筛选栏组件 - HubSpot 风格
 * 支持多种筛选类型、展开/收起、筛选标签、保存/加载筛选
 * 支持高级筛选 AND/OR 逻辑
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Search, RotateCcw, ChevronDown, ChevronUp, Save, FolderOpen, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import { FilterTags } from './FilterTags';
import { SaveFilterDialog } from './SaveFilterDialog';
import { LoadFilterDialog } from './LoadFilterDialog';
import { FilterBuilder } from './FilterBuilder';
import type { 
  FilterBarLegacyProps as FilterBarProps, 
  FilterItem, 
  SavedFilter, 
  FilterGroupLegacy,
} from './types';
import { 
  createEmptyFilterGroup, 
  hasValidConditions,
  getConditionCount,
} from './filterUtils';
import { cn } from '@/lib/utils';

/**
 * FilterBar 筛选栏组件
 * HubSpot 风格设计，支持多种筛选类型
 * 支持高级筛选 AND/OR 逻辑
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onAdvancedFilterChange,
  onReset,
  loading = false,
  showCollapse = true,
  defaultShowCount = 3,
  showFilterTags = true,
  enableSave = false,
  storageKey = 'crm_saved_filters',
  className = '',
  enableAdvancedFilter = false,
  advancedFilterFields,
}) => {
  const { control, reset, getValues, setValue } = useForm();
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // 高级筛选状态
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedFilterGroup, setAdvancedFilterGroup] = useState<FilterGroupLegacy>(() => 
    createEmptyFilterGroup('AND')
  );
  const [advancedFilterExpanded, setAdvancedFilterExpanded] = useState(false);

  // 计算显示的筛选项
  const visibleFilters = useMemo(() => {
    return expanded ? filters : filters.slice(0, defaultShowCount);
  }, [expanded, filters, defaultShowCount]);

  // 是否有更多筛选项
  const hasMoreFilters = useMemo(() => {
    return filters.length > defaultShowCount;
  }, [filters, defaultShowCount]);

  // 高级筛选条件数量
  const advancedConditionCount = useMemo(() => {
    return getConditionCount(advancedFilterGroup);
  }, [advancedFilterGroup]);

  // 初始化默认值
  useEffect(() => {
    const defaultValues: Record<string, unknown> = {};
    filters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        defaultValues[filter.name] = filter.defaultValue;
      }
    });
    reset(defaultValues);
  }, [filters, reset]);

  /** 处理搜索 */
  const handleSearch = useCallback(() => {
    const values = getValues();
    // 过滤空值
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        if (value === undefined || value === null || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (value instanceof Date) return true;
        return true;
      })
    );
    setActiveFilters(filteredValues);
    onFilterChange?.(filteredValues);
  }, [getValues, onFilterChange]);

  /** 处理重置 */
  const handleReset = useCallback(() => {
    // 重置简单筛选
    reset();
    setActiveFilters({});
    // 重置高级筛选
    setAdvancedFilterGroup(createEmptyFilterGroup('AND'));
    setAdvancedFilterExpanded(false);
    // 触发回调
    onReset?.();
    onFilterChange?.({});
    onAdvancedFilterChange?.(createEmptyFilterGroup('AND'));
    toast({
      title: '筛选条件已重置',
    });
  }, [reset, onFilterChange, onAdvancedFilterChange, onReset, toast]);

  /** 切换高级筛选模式 */
  const handleToggleAdvancedMode = useCallback(() => {
    if (!advancedMode && advancedFilterFields && advancedFilterFields.length > 0) {
      // 进入高级模式时，初始化筛选组
      setAdvancedFilterGroup(createEmptyFilterGroup('AND'));
      setAdvancedFilterExpanded(true);
    }
    setAdvancedMode(!advancedMode);
  }, [advancedMode, advancedFilterFields]);

  /** 处理高级筛选变化 */
  const handleAdvancedFilterChange = useCallback((group: FilterGroupLegacy) => {
    setAdvancedFilterGroup(group);
    onAdvancedFilterChange?.(group);
  }, [onAdvancedFilterChange]);

  /** 应用高级筛选 */
  const handleApplyAdvancedFilter = useCallback(() => {
    if (hasValidConditions(advancedFilterGroup)) {
      onAdvancedFilterChange?.(advancedFilterGroup);
      setAdvancedFilterExpanded(false);
      toast({
        title: '高级筛选已应用',
        description: `共 ${advancedConditionCount} 个筛选条件`,
      });
    } else {
      toast({
        title: '请添加筛选条件',
        variant: 'destructive',
      });
    }
  }, [advancedFilterGroup, advancedConditionCount, onAdvancedFilterChange, toast]);

  /** 移除单个筛选条件 */
  const handleRemoveFilter = useCallback(
    (name: string) => {
      setValue(name, undefined);
      const newFilters = { ...activeFilters };
      delete newFilters[name];
      setActiveFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [setValue, activeFilters, onFilterChange]
  );

  /** 清除全部筛选 */
  const handleClearAll = useCallback(() => {
    handleReset();
  }, [handleReset]);

  /** 保存筛选 */
  const handleSaveFilter = useCallback(
    (name: string, description?: string) => {
      console.log('保存筛选:', name, description);
      setSaveDialogOpen(false);
      toast({
        title: '筛选已保存',
        description: `筛选「${name}」已保存`,
      });
    },
    [toast]
  );

  /** 加载筛选 */
  const handleLoadFilter = useCallback(
    (savedFilter: SavedFilter) => {
      if (savedFilter.type === 'advanced' && savedFilter.advancedFilter) {
        // 加载高级筛选
        setAdvancedMode(true);
        setAdvancedFilterGroup(savedFilter.advancedFilter);
        onAdvancedFilterChange?.(savedFilter.advancedFilter);
      } else if (savedFilter.filters) {
        // 加载简单筛选
        reset(savedFilter.filters);
        setActiveFilters(savedFilter.filters);
        onFilterChange?.(savedFilter.filters);
      }
      setLoadDialogOpen(false);
    },
    [reset, onFilterChange, onAdvancedFilterChange]
  );

  /** 删除已保存的筛选 */
  const handleDeleteSavedFilter = useCallback((_id: string) => {
    // LoadFilterDialog 内部已经删除
  }, []);

  /** 渲染筛选控件 */
  const renderFilterItem = useCallback((filter: FilterItem) => {
    const { name, type, placeholder, options, min, max } = filter;

    switch (type) {
      case 'text':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={filter.defaultValue ?? ''}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={placeholder || `请输入${filter.label}`}
                className="h-9"
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={filter.defaultValue ?? ''}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder={placeholder || `请选择${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map(option => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={filter.defaultValue}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(field.value instanceof Date ? field.value : new Date(field.value), 'yyyy-MM-dd')
                        : placeholder || `请选择${filter.label}`}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    locale={zhCN}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );

      case 'dateRange':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={filter.defaultValue}
            render={({ field }) => {
              const value = field.value as [Date | undefined, Date | undefined] | undefined;
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !value?.[0] && !value?.[1] && "text-muted-foreground"
                      )}
                    >
                      {value?.[0] && value?.[1]
                        ? `${format(value[0], 'yyyy-MM-dd')} ~ ${format(value[1], 'yyyy-MM-dd')}`
                        : value?.[0]
                          ? format(value[0], 'yyyy-MM-dd')
                          : placeholder || '选择日期范围'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: value?.[0],
                        to: value?.[1],
                      }}
                      onSelect={(range) => {
                        field.onChange([range?.from, range?.to]);
                      }}
                      locale={zhCN}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        );

      case 'number':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={filter.defaultValue ?? ''}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder={placeholder || `请输入${filter.label}`}
                min={min}
                max={max}
                className="h-9"
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
              />
            )}
          />
        );

      default:
        return null;
    }
  }, [control]);

  // 高级筛选模式下不显示简单筛选
  const showSimpleFilters = !advancedMode || !enableAdvancedFilter;

  return (
    <div className={cn("space-y-3", className)}>
      {/* 筛选表单 */}
      <div className="flex flex-wrap items-end gap-3 p-4 bg-card border rounded-lg shadow-sm">
        {/* 简单筛选项（仅在非高级模式显示） */}
        {showSimpleFilters && visibleFilters.map((filter) => (
          <div key={filter.name} className="flex flex-col gap-1.5 min-w-[160px]">
            <Label className="text-xs font-medium text-muted-foreground">
              {filter.label}
            </Label>
            {renderFilterItem(filter)}
          </div>
        ))}

        {/* 高级筛选模式指示 */}
        {advancedMode && enableAdvancedFilter && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              高级筛选模式
            </Badge>
            {advancedConditionCount > 0 && (
              <Badge variant="secondary">
                {advancedConditionCount} 个条件
              </Badge>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 ml-auto">
          {/* 高级筛选按钮 */}
          {enableAdvancedFilter && advancedFilterFields && advancedFilterFields.length > 0 && (
            <Button
              variant={advancedMode ? "default" : "outline"}
              onClick={handleToggleAdvancedMode}
              className="h-9"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              {advancedMode ? '简单筛选' : '高级筛选'}
            </Button>
          )}

          {/* 搜索按钮（简单模式） */}
          {showSimpleFilters && (
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-9 shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" />
              {loading ? '搜索中...' : '搜索'}
            </Button>
          )}

          {/* 应用高级筛选按钮（高级模式） */}
          {advancedMode && enableAdvancedFilter && (
            <Button
              onClick={handleApplyAdvancedFilter}
              disabled={loading || !hasValidConditions(advancedFilterGroup)}
              className="h-9 shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" />
              {loading ? '应用中...' : '应用筛选'}
            </Button>
          )}

          {/* 重置按钮 */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-9"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            重置
          </Button>

          {/* 保存筛选按钮 */}
          {enableSave && (
            <Button
              variant="ghost"
              onClick={() => setSaveDialogOpen(true)}
              disabled={(!advancedMode && Object.keys(activeFilters).length === 0) || 
                        (advancedMode && !hasValidConditions(advancedFilterGroup))}
              className="h-9"
            >
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          )}

          {/* 加载筛选按钮 */}
          {enableSave && (
            <Button
              variant="ghost"
              onClick={() => setLoadDialogOpen(true)}
              className="h-9"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              加载
            </Button>
          )}

          {/* 展开/收起按钮（简单模式） */}
          {showSimpleFilters && showCollapse && hasMoreFilters && (
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="h-9"
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  展开 ({filters.length - defaultShowCount})
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 高级筛选构建器（可展开） */}
      {advancedMode && enableAdvancedFilter && advancedFilterFields && (
        <div className="border rounded-lg overflow-hidden">
          {/* 高级筛选标题栏 */}
          <div 
            className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer"
            onClick={() => setAdvancedFilterExpanded(!advancedFilterExpanded)}
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">筛选条件构建器</span>
              <Badge variant="outline" className={cn(
                advancedFilterGroup.operator === 'AND' 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-orange-100 text-orange-800"
              )}>
                {advancedFilterGroup.operator}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {advancedConditionCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {advancedConditionCount} 个有效条件
                </span>
              )}
              {advancedFilterExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
          
          {/* 高级筛选内容 */}
          {advancedFilterExpanded && (
            <div className="p-4 bg-white">
              <FilterBuilder
                fields={advancedFilterFields}
                value={advancedFilterGroup}
                onChange={handleAdvancedFilterChange}
                maxDepth={3}
              />
            </div>
          )}
        </div>
      )}

      {/* 简单筛选标签 */}
      {showSimpleFilters && showFilterTags && (
        <FilterTags
          activeFilters={activeFilters}
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      )}

      {/* 保存筛选对话框 */}
      {enableSave && (
        <SaveFilterDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          onSave={handleSaveFilter}
          filters={activeFilters}
          storageKey={storageKey}
        />
      )}

      {/* 加载筛选对话框 */}
      {enableSave && (
        <LoadFilterDialog
          open={loadDialogOpen}
          onClose={() => setLoadDialogOpen(false)}
          onLoad={handleLoadFilter}
          onDelete={handleDeleteSavedFilter}
          storageKey={storageKey}
        />
      )}
    </div>
  );
};

// 导出类型
export * from './types';

// 导出原有组件（保持向后兼容）
export { FilterTags } from './FilterTags';
export { SaveFilterDialog } from './SaveFilterDialog';
export { LoadFilterDialog } from './LoadFilterDialog';
export { FilterBuilder } from './FilterBuilder';

// 导出新组件（HubSpot 风格高级筛选）
export { FilterBar as FilterBarNew } from './FilterBar';
export { FilterField as FilterFieldComponent } from './FilterField';
export { FilterGroup as FilterGroupComponent } from './FilterGroup';

// 导出工具函数
export { 
  applyFilterGroup, 
  applyCondition,
  hasValidConditions,
  getConditionCount,
  // 新工具函数
  generateId,
  createEmptyGroup,
  createEmptyFilter,
  getFieldByName,
  getOperatorsForField,
  itemToField,
  isFilterValid,
  isGroupValid,
  countFilters,
  flattenFilters,
  generateFilterLabels,
  formatFilterValue,
  formatDate,
  cloneFilterState,
  cloneFilterGroup,
  buildQueryParams,
  serializeFilterValue,
  deserializeFilterValue,
  matchesFilter,
  matchesFilterGroup,
  filterData,
} from './filterUtils';

export default FilterBar;