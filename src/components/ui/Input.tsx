/**
 * Input 组件 - 出海 CRM 设计系统
 * 输入框、搜索框、带后缀装饰的输入框
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input as AntInput } from 'antd';
import './Input.css';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'onChange' | 'onInput'> {
  /** 输入框尺寸 */
  size?: InputSize;
  /** 标签文本 */
  label?: string;
  /** 标签位置 */
  labelPosition?: 'top' | 'left';
  /** 错误提示 */
  error?: string;
  /** 前缀装饰 */
  prefix?: React.ReactNode;
  /** 后缀装饰 */
  suffix?: React.ReactNode;
  /** 是否必填 */
  required?: boolean;
  /** 帮助文本 */
  helperText?: string;
  /** 是否显示清除按钮 */
  allowClear?: boolean;
  /** 前置标签 */
  addonBefore?: React.ReactNode;
  /** 后置标签 */
  addonAfter?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 输入回调 */
  onInput?: (value: string) => void;
  /** 搜索回调 */
  onSearch?: (value: string) => void;
  /** 清除回调 */
  onClear?: () => void;
  /** 焦点回调 */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** 失焦回调 */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** 防抖延迟（毫秒） */
  debounceDelay?: number;
}

/**
 * Input 组件
 * 
 * @example
 * // 基础输入框
 * <Input placeholder="请输入姓名" />
 * 
 * // 带标签的输入框
 * <Input label="姓名" placeholder="请输入姓名" required />
 * 
 * // 搜索框
 * <Input type="search" placeholder="搜索..." suffix={<kbd>⌘K</kbd>} />
 * 
 * // 带前缀图标
 * <Input prefix={<SearchIcon />} placeholder="搜索" />
 * 
 * // 错误状态
 * <Input label="邮箱" error="邮箱格式不正确" />
 */
export const Input: React.FC<InputProps> = ({
  size = 'md',
  label,
  labelPosition = 'top',
  error,
  prefix,
  suffix,
  required = false,
  helperText,
  allowClear = false,
  addonBefore,
  addonAfter,
  disabled = false,
  readonly = false,
  loading = false,
  className = '',
  style,
  value,
  defaultValue,
  onChange,
  onInput,
  onSearch,
  onClear,
  onFocus,
  onBlur,
  debounceDelay = 0,
  type = 'text',
  id,
  name,
  placeholder,
  maxLength,
  autoComplete,
  autoFocus,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  
  const [internalValue, setInternalValue] = useState(defaultValue?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);
  
  const currentValue = value !== undefined ? value.toString() : internalValue;
  const inputId = id || name || `input-${Math.random().toString(36).slice(2, 9)}`;
  
  // 清除防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    if (debounceDelay > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        onChange?.(newValue);
        onInput?.(newValue);
      }, debounceDelay);
    } else {
      onChange?.(newValue);
      onInput?.(newValue);
    }
  }, [value, onChange, onInput, debounceDelay]);
  
  // 处理焦点
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);
  
  // 处理失焦
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);
  
  // 清除内容
  const handleClear = useCallback(() => {
    if (value === undefined) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [value, onChange, onClear]);
  
  // 搜索（回车或点击搜索按钮）
  const handleSearch = useCallback(() => {
    onSearch?.(currentValue);
  }, [currentValue, onSearch]);
  
  // 按键处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && type === 'search') {
      handleSearch();
    }
  }, [type, handleSearch]);
  
  // 渲染容器类名
  const containerClasses = [
    'crm-input-container',
    `crm-input-label-${labelPosition}`,
    error && 'crm-input-error',
    disabled && 'crm-input-disabled',
    readonly && 'crm-input-readonly',
    isFocused && 'crm-input-focused',
    className,
  ].filter(Boolean).join(' ');
  
  // 渲染输入框类名
  const inputWrapperClasses = [
    'crm-input-wrapper',
    `crm-input-${size}`,
    addonBefore && 'crm-input-has-addon-before',
    addonAfter && 'crm-input-has-addon-after',
    prefix && 'crm-input-has-prefix',
    (suffix || allowClear || loading) && 'crm-input-has-suffix',
    error && 'crm-input-wrapper-error',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses} style={style}>
      {/* 标签 */}
      {label && (
        <label className="crm-input-label" htmlFor={inputId}>
          {label}
          {required && <span className="crm-input-required">*</span>}
        </label>
      )}
      
      {/* 输入框区域 */}
      <div className={inputWrapperClasses}>
        {/* 前置标签 */}
        {addonBefore && <span className="crm-input-addon-before">{addonBefore}</span>}
        
        {/* 前缀图标 */}
        {prefix && <span className="crm-input-prefix">{prefix}</span>}
        
        {/* 输入框 */}
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={type}
          className="crm-input"
          value={currentValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          aria-required={required}
          {...props}
        />
        
        {/* 加载状态 */}
        {loading && (
          <span className="crm-input-loading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
            </svg>
          </span>
        )}
        
        {/* 清除按钮 */}
        {allowClear && currentValue && !disabled && !loading && (
          <button
            className="crm-input-clear"
            onClick={handleClear}
            type="button"
            aria-label="清除内容"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
        
        {/* 后缀装饰 */}
        {suffix && !loading && <span className="crm-input-suffix">{suffix}</span>}
        
        {/* 后置标签 */}
        {addonAfter && <span className="crm-input-addon-after">{addonAfter}</span>}
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div id={`${inputId}-error`} className="crm-input-error-text" role="alert">
          {error}
        </div>
      )}
      
      {/* 帮助文本 */}
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="crm-input-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

// 创建带有 TextArea 的复合组件
const InputComponent = Input as React.FC<InputProps> & {
  TextArea: typeof AntInput.TextArea;
};

InputComponent.TextArea = AntInput.TextArea;

export default InputComponent;