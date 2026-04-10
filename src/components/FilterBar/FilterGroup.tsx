import React, { useState } from 'react';
import {
  FilterGroupProps,
  FilterGroupNew,
  Filter,
  FilterItem,
} from './types';
import { FilterField } from './FilterField';
import { generateId, createEmptyFilter, cloneFilterGroup } from './filterUtils';

/**
 * 筛选组组件（支持 AND/OR 逻辑和嵌套）
 */
export const FilterGroup: React.FC<FilterGroupProps> = ({
  group,
  fields,
  onChange,
  onDelete,
  enableAdvanced = false,
  depth = 0,
}) => {
  const [localGroup, setLocalGroup] = useState<FilterGroupNew>(
    cloneFilterGroup(group)
  );

  // 添加筛选条件
  const handleAddFilter = () => {
    const newFilter = createEmptyFilter(fields[0]?.name);
    const newGroup = {
      ...localGroup,
      filters: [...localGroup.filters, newFilter],
    };
    setLocalGroup(newGroup);
    onChange(newGroup);
  };

  // 添加子组（嵌套）
  const handleAddSubGroup = () => {
    const newSubGroup: FilterGroupNew = {
      id: generateId(),
      logic: 'AND',
      filters: [],
    };
    const newGroup = {
      ...localGroup,
      filters: [...localGroup.filters, newSubGroup],
    };
    setLocalGroup(newGroup);
    onChange(newGroup);
  };

  // 更新筛选条件
  const handleFilterChange = (index: number, filter: Filter) => {
    const newFilters = [...localGroup.filters];
    newFilters[index] = filter;
    const newGroup = { ...localGroup, filters: newFilters };
    setLocalGroup(newGroup);
    onChange(newGroup);
  };

  // 删除筛选条件
  const handleFilterDelete = (index: number) => {
    const newFilters = localGroup.filters.filter((_, i) => i !== index);
    const newGroup = { ...localGroup, filters: newFilters };
    setLocalGroup(newGroup);
    onChange(newGroup);
  };

  // 更新子组
  const handleSubGroupChange = (index: number, subGroup: FilterGroupNew) => {
    const newFilters = [...localGroup.filters];
    newFilters[index] = subGroup;
    const newGroup = { ...localGroup, filters: newFilters };
    setLocalGroup(newGroup);
    onChange(newGroup);
  };

  // 删除子组
  const handleSubGroupDelete = (index: number) => {
    handleFilterDelete(index);
  };

  // 切换逻辑（AND/OR）
  const handleLogicToggle = () => {
    const newLogic: 'AND' | 'OR' = localGroup.logic === 'AND' ? 'OR' : 'AND';
    const newGroup: FilterGroupNew = { ...localGroup, logic: newLogic };
    setLocalGroup(newGroup);
    onChange(newGroup);
  };

  // 删除组
  const handleDelete = () => {
    onDelete();
  };

  const isRoot = depth === 0;
  const maxDepth = 5; // 最大嵌套深度

  return (
    <div
      style={{
        ...groupContainerStyle,
        ...(depth > 0 ? nestedGroupContainerStyle : {}),
      }}
    >
      {/* 组头部 */}
      <div style={groupHeaderStyle}>
        {enableAdvanced && !isRoot && (
          <button
            type="button"
            onClick={handleLogicToggle}
            style={logicButtonStyle}
            title="点击切换 AND/OR"
          >
            {localGroup.logic}
          </button>
        )}

        {enableAdvanced && isRoot && (
          <span style={logicLabelStyle}>
            所有条件需满足
            <button
              type="button"
              onClick={handleLogicToggle}
              style={logicToggleButtonStyle}
            >
              切换为"任一满足"
            </button>
          </span>
        )}

        {!isRoot && (
          <button
            type="button"
            onClick={handleDelete}
            style={groupDeleteButtonStyle}
            title="删除此组"
          >
            删除组
          </button>
        )}
      </div>

      {/* 筛选条件列表 */}
      <div style={filtersListStyle}>
        {localGroup.filters.map((filter, index) => {
          if ('logic' in filter) {
            // 子组
            if (!enableAdvanced) {
              return null;
            }
            return (
              <FilterGroup
                key={filter.id}
                group={filter as FilterGroupNew}
                fields={fields}
                onChange={(subGroup) => handleSubGroupChange(index, subGroup)}
                onDelete={() => handleSubGroupDelete(index)}
                enableAdvanced={enableAdvanced}
                depth={depth + 1}
              />
            );
          } else {
            // 筛选字段
            const field = fields.find((f) => f.name === filter.field) || fields[0];
            return (
              <FilterField
                key={filter.id}
                field={field}
                filter={filter as Filter}
                onChange={(newFilter) => handleFilterChange(index, newFilter)}
                onDelete={() => handleFilterDelete(index)}
                showOperators={enableAdvanced}
              />
            );
          }
        })}
      </div>

      {/* 添加按钮 */}
      <div style={addButtonsStyle}>
        <button
          type="button"
          onClick={handleAddFilter}
          style={addFilterButtonStyle}
        >
          + 添加筛选条件
        </button>

        {enableAdvanced && depth < maxDepth && (
          <button
            type="button"
            onClick={handleAddSubGroup}
            style={addGroupButtonStyle}
          >
            + 添加条件组
          </button>
        )}
      </div>
    </div>
  );
};

// 样式
const groupContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  padding: '16px',
  marginBottom: '12px',
};

const nestedGroupContainerStyle: React.CSSProperties = {
  backgroundColor: '#fafafa',
  marginLeft: '20px',
  marginTop: '8px',
  border: '1px dashed #d0d0d0',
};

const groupHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
  paddingBottom: '8px',
  borderBottom: '1px solid #f0f0f0',
};

const logicButtonStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '4px',
  border: '1px solid #1890ff',
  backgroundColor: '#e6f7ff',
  color: '#1890ff',
  fontWeight: 'bold',
  fontSize: '12px',
  cursor: 'pointer',
};

const logicLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const logicToggleButtonStyle: React.CSSProperties = {
  padding: '2px 8px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  backgroundColor: 'white',
  fontSize: '11px',
  cursor: 'pointer',
};

const groupDeleteButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#ffccc7',
  color: '#ff4d4f',
  fontSize: '12px',
  cursor: 'pointer',
};

const filtersListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const addButtonsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid #f0f0f0',
};

const addFilterButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px dashed #1890ff',
  backgroundColor: 'white',
  color: '#1890ff',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const addGroupButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px dashed #722ed1',
  backgroundColor: 'white',
  color: '#722ed1',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export default FilterGroup;
