import React, { useState, useMemo } from 'react';
import {
  FilterFieldProps,
  FilterItem,
  OperatorType,
  OPERATOR_LABELS,
  FIELD_OPERATORS,
} from './types';
import { generateId } from './filterUtils';

interface FieldInputProps {
  field: FilterItem;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
}

/**
 * 字段值输入组件
 */
const FieldInput: React.FC<FieldInputProps> = ({
  field,
  value,
  onChange,
  placeholder,
}) => {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          className="filter-field-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '请输入'}
          style={inputStyle}
        />
      );

    case 'select':
      return (
        <select
          className="filter-field-select"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        >
          <option value="">请选择</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'number':
      return (
        <input
          type="number"
          className="filter-field-input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder={placeholder || '0'}
          style={inputStyle}
        />
      );

    case 'dateRange':
      return (
        <div style={dateRangeStyle}>
          <input
            type="date"
            className="filter-field-date"
            value={formatDateForInput(value?.[0])}
            onChange={(e) => {
              const newStart = e.target.value ? new Date(e.target.value) : null;
              onChange([newStart, value?.[1] || null]);
            }}
            style={dateInputStyle}
          />
          <span style={dateSeparatorStyle}>至</span>
          <input
            type="date"
            className="filter-field-date"
            value={formatDateForInput(value?.[1])}
            onChange={(e) => {
              const newEnd = e.target.value ? new Date(e.target.value) : null;
              onChange([value?.[0] || null, newEnd]);
            }}
            style={dateInputStyle}
          />
        </div>
      );

    default:
      return null;
  }
};

/**
 * 格式化日期为输入框格式
 */
function formatDateForInput(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 多值输入组件（用于 in/notIn 操作符）
 */
const MultiValueInput: React.FC<{
  field: FilterItem;
  value: any[];
  onChange: (value: any[]) => void;
  placeholder?: string;
}> = ({ field, value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={multiValueContainerStyle}>
      <div style={tagsStyle}>
        {value.map((val, index) => (
          <span key={index} style={tagStyle}>
            {val}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={tagRemoveButtonStyle}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="filter-field-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || '输入后按回车添加'}
        style={{ ...inputStyle, flex: 1, minWidth: 100 }}
      />
      <button
        type="button"
        onClick={handleAdd}
        style={addButtonStyle}
        disabled={!inputValue.trim()}
      >
        添加
      </button>
    </div>
  );
};

/**
 * 筛选字段组件
 */
export const FilterField: React.FC<FilterFieldProps> = ({
  field,
  filter,
  onChange,
  onDelete,
  showOperators = true,
}) => {
  const [selectedField, setSelectedField] = useState<FilterItem>(field);
  const [selectedOperator, setSelectedOperator] = useState<OperatorType>(
    filter?.operator || FIELD_OPERATORS[field.type][0]
  );
  const [fieldValue, setFieldValue] = useState<any>(filter?.value || null);

  // 当字段变化时，重置操作符和值
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = field.options?.find(
      (_, idx) => idx === Number(e.target.value)
    )
      ? field
      : field; // 这里需要从父组件传入所有可用字段
    setSelectedField(newField);
    setSelectedOperator(FIELD_OPERATORS[newField.type][0]);
    setFieldValue(null);
  };

  // 当操作符变化时
  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperator(e.target.value as OperatorType);
  };

  // 当值变化时，通知父组件
  const handleValueChange = (newValue: any) => {
    setFieldValue(newValue);
    onChange({
      id: filter?.id || generateId(),
      field: selectedField.name,
      operator: selectedOperator,
      value: newValue,
    });
  };

  // 字段和操作符变化时也通知父组件
  React.useEffect(() => {
    if (selectedField && selectedOperator) {
      onChange({
        id: filter?.id || generateId(),
        field: selectedField.name,
        operator: selectedOperator,
        value: fieldValue,
      });
    }
  }, [selectedField, selectedOperator]);

  const availableOperators = useMemo(() => {
    return FIELD_OPERATORS[selectedField.type] || [];
  }, [selectedField.type]);

  const isMultiValueOperator =
    selectedOperator === 'in' || selectedOperator === 'notIn';

  return (
    <div style={filterFieldStyle}>
      <div style={filterFieldContentStyle}>
        {/* 字段选择 */}
        <select
          className="filter-field-selector"
          value={field.name}
          onChange={handleFieldChange}
          style={selectStyle}
          title={field.label}
        >
          <option value={field.name}>{field.label}</option>
        </select>

        {/* 操作符选择 */}
        {showOperators && availableOperators.length > 1 && (
          <select
            className="filter-operator-selector"
            value={selectedOperator}
            onChange={handleOperatorChange}
            style={selectStyle}
          >
            {availableOperators.map((op) => (
              <option key={op} value={op}>
                {OPERATOR_LABELS[op]}
              </option>
            ))}
          </select>
        )}

        {/* 值输入 */}
        {isMultiValueOperator ? (
          <MultiValueInput
            field={selectedField}
            value={Array.isArray(fieldValue) ? fieldValue : []}
            onChange={handleValueChange}
            placeholder={selectedField.placeholder}
          />
        ) : (
          <FieldInput
            field={selectedField}
            value={fieldValue}
            onChange={handleValueChange}
            placeholder={selectedField.placeholder}
          />
        )}
      </div>

      {/* 删除按钮 */}
      <button
        type="button"
        className="filter-field-delete"
        onClick={onDelete}
        style={deleteButtonStyle}
        title="删除此筛选条件"
      >
        ×
      </button>
    </div>
  );
};

// 样式
const filterFieldStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: '#f7f7f7',
  borderRadius: '6px',
  border: '1px solid #e0e0e0',
  marginBottom: '8px',
};

const filterFieldContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
};

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  backgroundColor: 'white',
  fontSize: '13px',
  cursor: 'pointer',
  outline: 'none',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  fontSize: '13px',
  outline: 'none',
  minWidth: '150px',
};

const dateRangeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const dateInputStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  fontSize: '13px',
  outline: 'none',
};

const dateSeparatorStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '13px',
};

const deleteButtonStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#ff4d4f',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'background-color 0.2s',
};

const multiValueContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  backgroundColor: 'white',
  minWidth: '200px',
};

const tagsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  flexWrap: 'wrap',
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  backgroundColor: '#e6f7ff',
  border: '1px solid #91d5ff',
  borderRadius: '4px',
  fontSize: '12px',
  color: '#1890ff',
};

const tagRemoveButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0',
  fontSize: '14px',
  color: '#1890ff',
  lineHeight: 1,
};

const addButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#1890ff',
  color: 'white',
  fontSize: '12px',
  cursor: 'pointer',
};

export default FilterField;
