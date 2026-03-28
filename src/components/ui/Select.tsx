/**
 * Select 组件 - 出海 CRM 设计系统
 * 选择框组件，支持单选、多选、搜索
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Select.css';

export type SelectSize = 'sm' | 'md' | 'lg';
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  /** 选择框尺寸 */
  size?: SelectSize;
  /** 选项列表 */
  options: SelectOption[];
  /** 当前值 */
  value?: string | string[];
  /** 默认值 */
  defaultValue?: string | string[];
  /** 是否多选 */
  multiple?: boolean;
  /** 标签文本 */
  label?: string;
  /** 标签位置 */
  labelPosition?: 'top' | 'left';
  /** 占位符 */
  placeholder?: string;
  /** 错误提示 */
  error?: string;
  /** 帮助文本 */
  helperText?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 是否可清除 */
  allowClear?: boolean;
  /** 最大标签数量（多选） */
  maxTagCount?: number;
  /** 值变化回调 */
  onChange?: (value: string | string[]) => void;
  /** 搜索回调 */
  onSearch?: (value: string) => void;
  /** 清除回调 */
  onClear?: () => void;
  /** 焦点回调 */
  onFocus?: () => void;
  /** 失焦回调 */
  onBlur?: () => void;
  /** 类名 */
  className?: string;
  /** 样式 */
  style?: React.CSSProperties;
  /** 宽度 */
  width?: number | string;
  /** id */
  id?: string;
  /** name */
  name?: string;
}

/**
 * Select 组件
 * 
 * @example
 * // 基础选择框
 * <Select
 *   label="学历"
 *   options={[
 *     { value: 'high', label: '高中' },
 *     { value: 'college', label: '大专' },
 *     { value: 'bachelor', label: '本科' },
 *   ]}
 *   placeholder="请选择学历"
 * />
 * 
 * // 可搜索选择框
 * <Select searchable placeholder="搜索客户..." options={customerOptions} />
 */
export const Select: React.FC<SelectProps> = ({
  size = 'md',
  options,
  value,
  defaultValue,
  multiple = false,
  label,
  labelPosition = 'top',
  placeholder = '请选择',
  error,
  helperText,
  required = false,
  disabled = false,
  searchable = false,
  allowClear = false,
  maxTagCount = 3,
  onChange,
  onSearch,
  onClear,
  onFocus,
  onBlur,
  className = '',
  style,
  width,
  id,
  name,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue || (multiple ? [] : '')
  );
  const [isFocused, setIsFocused] = useState(false);
  
  const currentValue = value !== undefined ? value : internalValue;
  const selectId = id || name || `select-${Math.random().toString(36).slice(2, 9)}`;
  
  // 获取选中项的标签
  const getSelectedLabels = useCallback(() => {
    if (!currentValue) return [];
    
    const values = Array.isArray(currentValue) ? currentValue : [currentValue];
    return values.map(v => {
      const option = options.find(o => o.value === v);
      return option?.label || v;
    });
  }, [currentValue, options]);
  
  // 过滤选项
  const filteredOptions = searchable
    ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;
  
  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        onBlur?.();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onBlur]);
  
  // 打开下拉框时聚焦搜索框
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  // 选择选项
  const handleSelect = useCallback((optionValue: string) => {
    let newValue: string | string[];
    
    if (multiple) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      newValue = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
    } else {
      newValue = optionValue;
      setIsOpen(false);
    }
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    setSearchQuery('');
  }, [currentValue, multiple, value, onChange]);
  
  // 清除选择
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = multiple ? [] : '';
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onClear?.();
  }, [multiple, value, onChange, onClear]);
  
  // 搜索变化
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  }, [onSearch]);
  
  // 打开/关闭下拉框
  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFocused(true);
      onFocus?.();
    }
  }, [disabled, isOpen, onFocus]);
  
  // 按键处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case 'Space':
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setIsFocused(false);
        onBlur?.();
        break;
      case 'ArrowDown':
        if (isOpen) {
          // TODO: 选中下一个选项
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          // TODO: 选中上一个选项
        }
        break;
    }
  }, [disabled, isOpen, onBlur]);
  
  // 容器类名
  const containerClasses = [
    'crm-select-container',
    `crm-select-label-${labelPosition}`,
    error && 'crm-select-error',
    disabled && 'crm-select-disabled',
    isFocused && 'crm-select-focused',
    className,
  ].filter(Boolean).join(' ');
  
  // 选择框类名
  const selectClasses = [
    'crm-select',
    `crm-select-${size}`,
    isOpen && 'crm-select-open',
    disabled && 'crm-select-disabled',
    searchable && 'crm-select-searchable',
  ].filter(Boolean).join(' ');
  
  const selectedLabels = getSelectedLabels();
  
  return (
    <div className={containerClasses} style={{ ...style, width }} ref={selectRef}>
      {/* 标签 */}
      {label && (
        <label className="crm-select-label" htmlFor={selectId}>
          {label}
          {required && <span className="crm-select-required">*</span>}
        </label>
      )}
      
      {/* 选择框 */}
      <div
        className={selectClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        aria-labelledby={`${selectId}-label`}
        id={selectId}
      >
        {/* 搜索输入框 */}
        {searchable && isOpen ? (
          <input
            ref={searchInputRef}
            className="crm-select-search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索..."
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          /* 显示值 */
          <div className="crm-select-value">
            {multiple && selectedLabels.length > 0 ? (
              <div className="crm-select-tags">
                {selectedLabels.slice(0, maxTagCount).map((label, index) => (
                  <span key={index} className="crm-select-tag">
                    {label}
                  </span>
                ))}
                {selectedLabels.length > maxTagCount && (
                  <span className="crm-select-tag-count">
                    +{selectedLabels.length - maxTagCount}
                  </span>
                )}
              </div>
            ) : selectedLabels.length > 0 ? (
              <span className="crm-select-single-value">{selectedLabels[0]}</span>
            ) : (
              <span className="crm-select-placeholder">{placeholder}</span>
            )}
          </div>
        )}
        
        {/* 后缀图标 */}
        <div className="crm-select-arrow">
          {allowClear && selectedLabels.length > 0 && !disabled ? (
            <button
              className="crm-select-clear"
              onClick={handleClear}
              type="button"
              aria-label="清除选择"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="crm-select-arrow-icon">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          )}
        </div>
      </div>
      
      {/* 下拉列表 */}
      {isOpen && (
        <div className="crm-select-dropdown" role="listbox">
          <div className="crm-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = multiple
                  ? (currentValue as string[]).includes(option.value)
                  : currentValue === option.value;
                
                return (
                  <div
                    key={option.value}
                    className={[
                      'crm-select-option',
                      isSelected && 'crm-select-option-selected',
                      option.disabled && 'crm-select-option-disabled',
                    ].filter(Boolean).join(' ')}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                  >
                    {option.icon && <span className="crm-select-option-icon">{option.icon}</span>}
                    <span className="crm-select-option-label">{option.label}</span>
                    {option.description && (
                      <span className="crm-select-option-description">{option.description}</span>
                    )}
                    {isSelected && (
                      <span className="crm-select-option-check">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="crm-select-empty">
                {searchQuery ? '无匹配结果' : '暂无选项'}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 错误提示 */}
      {error && (
        <div id={`${selectId}-error`} className="crm-select-error-text" role="alert">
          {error}
        </div>
      )}
      
      {/* 帮助文本 */}
      {helperText && !error && (
        <div id={`${selectId}-helper`} className="crm-select-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Select;