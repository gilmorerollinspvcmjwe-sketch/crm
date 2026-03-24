/**
 * FilterBar 筛选栏组件
 * 独立的筛选器容器
 */
import React, { useState, useCallback } from 'react';
import { Form, Input, Select, DatePicker, Space, Button, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { colors } from '../../styles/tokens';

const { RangePicker } = DatePicker;

/** 筛选字段类型 */
export type FilterFieldType = 'text' | 'select' | 'date' | 'dateRange' | 'number';

/** 筛选项配置 */
export interface FilterItem {
  /** 字段名 */
  name: string;
  /** 标签 */
  label: string;
  /** 类型 */
  type: FilterFieldType;
  /** 占位符 */
  placeholder?: string;
  /** 选项（select 类型） */
  options?: { label: string; value: string | number }[];
  /** 是否支持多选 */
  mode?: 'multiple' | 'tags';
  /** 默认值 */
  defaultValue?: any;
  /** 是否默认展开显示 */
  showByDefault?: boolean;
}

export interface FilterBarProps {
  /** 筛选项配置 */
  filters: FilterItem[];
  /** 筛选变化回调 */
  onFilterChange: (values: Record<string, any>) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示展开/收起按钮 */
  showCollapse?: boolean;
  /** 默认显示筛选项数量 */
  defaultShowCount?: number;
}

/**
 * FilterBar 筛选栏组件
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  loading = false,
  showCollapse = true,
  defaultShowCount = 3,
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  /** 渲染筛选控件 */
  const renderFilterItem = (filter: FilterItem) => {
    const { name, type, placeholder, options, mode } = filter;

    switch (type) {
      case 'text':
        return (
          <Input
            placeholder={placeholder || `请输入${filter.label}`}
            allowClear
          />
        );

      case 'select':
        return (
          <Select
            placeholder={placeholder || `请选择${filter.label}`}
            allowClear
            mode={mode}
            options={options}
            style={{ minWidth: 120 }}
          />
        );

      case 'date':
        return (
          <DatePicker
            placeholder={placeholder || `请选择${filter.label}`}
            style={{ width: '100%' }}
          />
        );

      case 'dateRange':
        return (
          <RangePicker style={{ width: '100%' }} />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder || `请输入${filter.label}`}
            allowClear
          />
        );

      default:
        return null;
    }
  };

  /** 处理搜索 */
  const handleSearch = useCallback(() => {
    const values = form.getFieldsValue();
    // 过滤空值
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        if (value === undefined || value === null || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );
    setActiveFilters(filteredValues);
    onFilterChange(filteredValues);
  }, [form, onFilterChange]);

  /** 处理重置 */
  const handleReset = useCallback(() => {
    form.resetFields();
    setActiveFilters({});
    onReset?.();
    onFilterChange({});
  }, [form, onFilterChange, onReset]);

  /** 移除单个筛选条件 */
  const handleRemoveFilter = (name: string) => {
    form.setFieldValue(name, undefined);
    const newFilters = { ...activeFilters };
    delete newFilters[name];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  /** 获取筛选标签显示值 */
  const getFilterDisplayValue = (name: string, value: any): string => {
    const filter = filters.find(f => f.name === name);
    if (!filter) return String(value);

    if (filter.type === 'select' && filter.options) {
      if (Array.isArray(value)) {
        return value.map(v => filter.options?.find(o => o.value === v)?.label || v).join(', ');
      }
      return filter.options.find(o => o.value === value)?.label || String(value);
    }

    if (filter.type === 'dateRange' && Array.isArray(value)) {
      return value.map(d => d?.format?.('YYYY-MM-DD') || '').join(' ~ ');
    }

    return String(value);
  };

  // 显示的筛选项
  const visibleFilters = expanded ? filters : filters.slice(0, defaultShowCount);
  const hasMoreFilters = filters.length > defaultShowCount;

  return (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline">
        {visibleFilters.map((filter) => (
          <Form.Item
            key={filter.name}
            name={filter.name}
            label={filter.label}
            style={{ marginBottom: 8 }}
          >
            {renderFilterItem(filter)}
          </Form.Item>
        ))}
        <Form.Item style={{ marginBottom: 8 }}>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
            >
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            {showCollapse && hasMoreFilters && (
              <Button
                type="text"
                onClick={() => setExpanded(!expanded)}
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
              >
                {expanded ? '收起' : '展开'}
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>

      {/* 活动筛选条件标签 */}
      {Object.keys(activeFilters).length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          padding: '8px 12px',
          background: colors.primarySubtle,
          borderRadius: 4,
          marginTop: 8,
        }}>
          <span style={{ color: colors.text.secondary, fontSize: 13 }}>
            当前筛选：
          </span>
          {Object.entries(activeFilters).map(([name, value]) => (
            <Tag
              key={name}
              closable
              onClose={() => handleRemoveFilter(name)}
              style={{ margin: 0 }}
            >
              {filters.find(f => f.name === name)?.label}: {getFilterDisplayValue(name, value)}
            </Tag>
          ))}
          <Button
            type="link"
            size="small"
            onClick={handleReset}
            style={{ padding: 0 }}
          >
            清除全部
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;