/**
 * FilterBuilder - 高级筛选条件构建器
 * 支持 AND/OR 逻辑组合、嵌套条件组
 */
import { useCallback, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type {
  FilterBuilderProps,
  FilterCondition,
  FilterGroupLegacy,
  FilterField,
  FilterOperator,
} from './types';
import {
  createEmptyFilterGroup,
  createFilterCondition,
  getDefaultOperators,
  getOperatorLabel,
} from './types';

/** 判断是否为 FilterCondition */
function isFilterCondition(item: FilterCondition | FilterGroupLegacy): item is FilterCondition {
  return 'field' in item;
}

/**
 * 单个条件行组件
 */
interface ConditionRowProps {
  condition: FilterCondition;
  fields: FilterField[];
  onChange: (condition: FilterCondition) => void;
  onDelete: () => void;
}

function ConditionRow({ condition, fields, onChange, onDelete }: ConditionRowProps) {
  const selectedField = useMemo(() => {
    return fields.find(f => f.name === condition.field);
  }, [fields, condition.field]);

  const availableOperators = useMemo(() => {
    if (!selectedField) return [];
    return selectedField.operators || getDefaultOperators(selectedField.type);
  }, [selectedField]);

  const handleFieldChange = useCallback((field: string) => {
    const newField = fields.find(f => f.name === field);
    if (!newField) return;
    
    const newOperators = newField.operators || getDefaultOperators(newField.type);
    const defaultOperator = newOperators[0] || 'eq';
    
    onChange({
      ...condition,
      field,
      operator: defaultOperator,
      value: undefined,
      value2: undefined,
    });
  }, [condition, fields, onChange]);

  const handleOperatorChange = useCallback((operator: FilterOperator) => {
    onChange({
      ...condition,
      operator,
      value: operator === 'between' ? undefined : condition.value,
      value2: operator === 'between' ? undefined : undefined,
    });
  }, [condition, onChange]);

  const handleValueChange = useCallback((value: unknown) => {
    onChange({
      ...condition,
      value,
    });
  }, [condition, onChange]);

  const handleValue2Change = useCallback((value: unknown) => {
    onChange({
      ...condition,
      value2: value,
    });
  }, [condition, onChange]);

  /** 渲染值输入控件 */
  const renderValueInput = () => {
    if (!selectedField) return null;

    const { type, options, min, max, placeholder } = selectedField;

    // between 操作符需要两个值输入
    if (condition.operator === 'between') {
      if (type === 'number') {
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="最小值"
              value={condition.value as number ?? ''}
              onChange={(e) => handleValueChange(e.target.value === '' ? undefined : Number(e.target.value))}
              min={min}
              max={max}
              className="h-8 w-24"
            />
            <span className="text-muted-foreground text-sm">至</span>
            <Input
              type="number"
              placeholder="最大值"
              value={condition.value2 as number ?? ''}
              onChange={(e) => handleValue2Change(e.target.value === '' ? undefined : Number(e.target.value))}
              min={min}
              max={max}
              className="h-8 w-24"
            />
          </div>
        );
      }
      if (type === 'date' || type === 'dateRange') {
        return (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-8 justify-start text-left font-normal", !condition.value && "text-muted-foreground")}
                >
                  {condition.value ? format(new Date(condition.value as string), 'yyyy-MM-dd') : '开始日期'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={condition.value ? new Date(condition.value as string) : undefined}
                  onSelect={(date) => handleValueChange(date?.toISOString())}
                  locale={zhCN}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground text-sm">至</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("h-8 justify-start text-left font-normal", !condition.value2 && "text-muted-foreground")}
                >
                  {condition.value2 ? format(new Date(condition.value2 as string), 'yyyy-MM-dd') : '结束日期'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={condition.value2 ? new Date(condition.value2 as string) : undefined}
                  onSelect={(date) => handleValue2Change(date?.toISOString())}
                  locale={zhCN}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }
    }

    // in/notIn 操作符需要多选
    if (condition.operator === 'in' || condition.operator === 'notIn') {
      if (type === 'select' || type === 'multiSelect') {
        return (
          <Select
            value={(condition.value as string[])?.join(',') ?? ''}
            onValueChange={(val) => handleValueChange(val.split(','))}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder={placeholder || '选择值'} />
            </SelectTrigger>
            <SelectContent>
              {options?.map(opt => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    }

    // 根据类型渲染值输入
    switch (type) {
      case 'text':
        return (
          <Input
            placeholder={placeholder || '输入值'}
            value={condition.value as string ?? ''}
            onChange={(e) => handleValueChange(e.target.value)}
            className="h-8 w-[180px]"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder || '输入数值'}
            value={condition.value as number ?? ''}
            onChange={(e) => handleValueChange(e.target.value === '' ? undefined : Number(e.target.value))}
            min={min}
            max={max}
            className="h-8 w-[120px]"
          />
        );

      case 'select':
        return (
          <Select
            value={condition.value as string ?? ''}
            onValueChange={handleValueChange}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder={placeholder || '选择值'} />
            </SelectTrigger>
            <SelectContent>
              {options?.map(opt => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("h-8 justify-start text-left font-normal w-[180px]", !condition.value && "text-muted-foreground")}
              >
                {condition.value ? format(new Date(condition.value as string), 'yyyy-MM-dd') : (placeholder || '选择日期')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={condition.value ? new Date(condition.value as string) : undefined}
                onSelect={(date) => handleValueChange(date?.toISOString())}
                locale={zhCN}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group">
      {/* 字段选择 */}
      <Select
        value={condition.field}
        onValueChange={handleFieldChange}
      >
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue placeholder="选择字段" />
        </SelectTrigger>
        <SelectContent>
          {fields.map(field => (
            <SelectItem key={field.name} value={field.name}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 操作符选择 */}
      <Select
        value={condition.operator}
        onValueChange={(val) => handleOperatorChange(val as FilterOperator)}
      >
        <SelectTrigger className="h-8 w-[100px]">
          <SelectValue placeholder="操作符" />
        </SelectTrigger>
        <SelectContent>
          {availableOperators.map(op => (
            <SelectItem key={op} value={op}>
              {getOperatorLabel(op)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 值输入 */}
      {renderValueInput()}

      {/* 删除按钮 */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

/**
 * 条件组组件（支持嵌套）
 */
interface FilterGroupComponentProps {
  group: FilterGroupLegacy;
  fields: FilterField[];
  onChange: (group: FilterGroupLegacy) => void;
  onDelete?: () => void;
  depth: number;
  maxDepth: number;
}

function FilterGroupComponent({ group, fields, onChange, onDelete, depth, maxDepth }: FilterGroupComponentProps) {
  const canAddNestedGroup = depth < maxDepth;

  /** 切换组逻辑 */
  const handleOperatorToggle = useCallback(() => {
    onChange({
      ...group,
      operator: group.operator === 'AND' ? 'OR' : 'AND',
    });
  }, [group, onChange]);

  /** 添加条件 */
  const handleAddCondition = useCallback(() => {
    const newCondition = createFilterCondition(fields[0]?.name || '', 'eq', undefined);
    onChange({
      ...group,
      conditions: [...group.conditions, newCondition],
    });
  }, [group, fields, onChange]);

  /** 添加嵌套组 */
  const handleAddNestedGroup = useCallback(() => {
    const newGroup = createEmptyFilterGroup('AND');
    onChange({
      ...group,
      conditions: [...group.conditions, newGroup],
    });
  }, [group, onChange]);

  /** 更新条件 */
  const handleConditionChange = useCallback((index: number, updated: FilterCondition | FilterGroupLegacy) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;
    onChange({
      ...group,
      conditions: newConditions,
    });
  }, [group, onChange]);

  /** 删除条件 */
  const handleConditionDelete = useCallback((index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onChange({
      ...group,
      conditions: newConditions,
    });
  }, [group, onChange]);

  const operatorColor = group.operator === 'AND' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-orange-100 text-orange-800 border-orange-200';

  return (
    <div className={cn(
      "border rounded-lg p-3 space-y-2",
      depth === 0 ? "bg-white" : "bg-muted/20",
      depth > 0 && `ml-4 border-${group.operator === 'AND' ? 'blue' : 'orange'}-200`
    )}>
      {/* 组头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {depth > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
          <Badge
            variant="outline"
            className={cn("cursor-pointer hover:opacity-80 transition-opacity", operatorColor)}
            onClick={handleOperatorToggle}
          >
            {group.operator}
          </Badge>
          <span className="text-sm text-muted-foreground">
            ({group.conditions.length} 个条件)
          </span>
        </div>

        {/* 添加按钮 */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={handleAddCondition}
          >
            <Plus className="h-3 w-3 mr-1" />
            添加条件
          </Button>
          {canAddNestedGroup && (
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={handleAddNestedGroup}
            >
              <Plus className="h-3 w-3 mr-1" />
              添加组
            </Button>
          )}
        </div>
      </div>

      {/* 条件列表 */}
      <div className="space-y-2">
        {group.conditions.map((condition, index) => (
          isFilterCondition(condition) ? (
            <ConditionRow
              key={condition.id}
              condition={condition}
              fields={fields}
              onChange={(updated) => handleConditionChange(index, updated)}
              onDelete={() => handleConditionDelete(index)}
            />
          ) : (
            <FilterGroupComponent
              key={condition.id}
              group={condition}
              fields={fields}
              onChange={(updated) => handleConditionChange(index, updated)}
              onDelete={() => handleConditionDelete(index)}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          )
        ))}
      </div>

      {/* 空状态提示 */}
      {group.conditions.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          暂无筛选条件，点击上方按钮添加
        </div>
      )}
    </div>
  );
}

/**
 * FilterBuilder 主组件
 */
export function FilterBuilder({
  fields,
  value,
  onChange,
  maxDepth = 3,
}: FilterBuilderProps) {
  return (
    <FilterGroupComponent
      group={value}
      fields={fields}
      onChange={onChange}
      depth={0}
      maxDepth={maxDepth}
    />
  );
}

export default FilterBuilder;