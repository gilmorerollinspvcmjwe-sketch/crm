import React, { useState, useMemo, useCallback } from 'react';
import {
  FilterBarProps,
  FilterState,
  FilterGroupNew,
  FilterItem,
  SavedFilter,
} from './types';
import { FilterGroup } from './FilterGroup';
import {
  generateId,
  createEmptyGroup,
  cloneFilterState,
  generateFilterLabels,
} from './filterUtils';

/**
 * FilterBar 主组件
 * HubSpot 风格的高级筛选栏
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  fields,
  value,
  onChange,
  enableAdvanced = true,
  enableSaveLoad = true,
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  placeholder = '添加筛选条件...',
  className = '',
}) => {
  // 内部状态
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (value) {
      return cloneFilterState(value);
    }
    return { groups: [createEmptyGroup()] };
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSavedList, setShowSavedList] = useState(false);

  // 同步外部 value 变化
  React.useEffect(() => {
    if (value) {
      setFilterState(cloneFilterState(value));
    }
  }, [value]);

  // 处理筛选状态变化
  const handleStateChange = useCallback(
    (newState: FilterState) => {
      setFilterState(newState);
      onChange?.(newState);
    },
    [onChange]
  );

  // 处理组变化
  const handleGroupChange = useCallback(
    (index: number, newGroup: FilterGroupNew) => {
      const newGroups = [...filterState.groups];
      newGroups[index] = newGroup;
      const newState = { ...filterState, groups: newGroups };
      handleStateChange(newState);
    },
    [filterState, handleStateChange]
  );

  // 添加新组
  const handleAddGroup = () => {
    const newGroup = createEmptyGroup();
    const newState = {
      ...filterState,
      groups: [...filterState.groups, newGroup],
    };
    handleStateChange(newState);
  };

  // 删除组
  const handleDeleteGroup = (index: number) => {
    if (filterState.groups.length <= 1) {
      // 至少保留一个组
      const newGroup = createEmptyGroup();
      const newState = { ...filterState, groups: [newGroup] };
      handleStateChange(newState);
      return;
    }
    const newGroups = filterState.groups.filter((_, i) => i !== index);
    const newState = { ...filterState, groups: newGroups };
    handleStateChange(newState);
  };

  // 清除所有筛选
  const handleClearAll = () => {
    const newState = { groups: [createEmptyGroup()] };
    handleStateChange(newState);
  };

  // 保存筛选器
  const handleSaveFilter = () => {
    if (saveName.trim() && onSaveFilter) {
      onSaveFilter(saveName.trim(), filterState);
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  // 加载筛选器
  const handleLoadFilter = (filter: SavedFilter) => {
    onLoadFilter?.(filter);
    if (filter.state) {
      setFilterState(cloneFilterState(filter.state));
    }
    setShowSavedList(false);
  };

  // 删除已保存的筛选器
  const handleDeleteSavedFilter = (id: string) => {
    onDeleteFilter?.(id);
  };

  // 生成筛选标签
  const filterLabels = useMemo(
    () => generateFilterLabels(filterState, fields),
    [filterState, fields]
  );

  // 是否有有效筛选
  const hasActiveFilters = filterLabels.length > 0;

  // 筛选器数量
  const filterCount = filterState.groups.reduce(
    (count, group) => count + group.filters.length,
    0
  );

  return (
    <div className={`filter-bar ${className}`} style={filterBarStyle}>
      {/* 筛选标签区域 */}
      {hasActiveFilters && (
        <div style={tagsBarStyle}>
          <div style={tagsListStyle}>
            {filterLabels.map((label, index) => (
              <span key={index} style={tagStyle}>
                {label}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            style={clearButtonStyle}
          >
            清除全部
          </button>
        </div>
      )}

      {/* 主筛选栏 */}
      <div style={mainBarStyle}>
        {/* 搜索/添加按钮 */}
        {!isExpanded ? (
          <div style={collapsedBarStyle}>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              style={addFilterButtonStyle}
            >
              <span style={addIconStyle}>+</span>
              {hasActiveFilters ? '添加更多筛选' : placeholder}
            </button>

            {hasActiveFilters && (
              <>
                <span style={dividerStyle}>|</span>
                <span style={countStyle}>{filterCount} 个筛选条件</span>
              </>
            )}

            {/* 保存/加载按钮 */}
            {enableSaveLoad && hasActiveFilters && (
              <div style={saveLoadButtonsStyle}>
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(true)}
                  style={saveButtonStyle}
                  title="保存当前筛选"
                >
                  💾 保存
                </button>
                {savedFilters.length > 0 && (
                  <div style={savedFiltersDropdownStyle}>
                    <button
                      type="button"
                      onClick={() => setShowSavedList(!showSavedList)}
                      style={loadButtonStyle}
                    >
                      📂 已保存
                    </button>
                    {showSavedList && (
                      <div style={savedListDropdownStyle}>
                        {savedFilters.map((filter) => (
                          <div key={filter.id} style={savedItemStyle}>
                            <span
                              onClick={() => handleLoadFilter(filter)}
                              style={savedItemNameStyle}
                            >
                              {filter.name}
                            </span>
                            <button
                              onClick={() => handleDeleteSavedFilter(filter.id)}
                              style={savedItemDeleteStyle}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={expandedBarStyle}>
            <div style={expandedHeaderStyle}>
              <span style={expandedTitleStyle}>筛选</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                style={collapseButtonStyle}
              >
                完成
              </button>
            </div>

            {/* 筛选组列表 */}
            <div style={groupsContainerStyle}>
              {filterState.groups.map((group, index) => (
                <FilterGroup
                  key={group.id}
                  group={group}
                  fields={fields}
                  onChange={(newGroup) => handleGroupChange(index, newGroup)}
                  onDelete={() => handleDeleteGroup(index)}
                  enableAdvanced={enableAdvanced}
                  depth={0}
                />
              ))}
            </div>

            {/* 添加组按钮 */}
            {enableAdvanced && (
              <button
                type="button"
                onClick={handleAddGroup}
                style={addGroupButtonStyle}
              >
                + 添加条件组
              </button>
            )}
          </div>
        )}
      </div>

      {/* 保存筛选器对话框 */}
      {showSaveDialog && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={modalTitleStyle}>保存筛选器</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="输入筛选器名称"
              style={modalInputStyle}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveFilter();
                } else if (e.key === 'Escape') {
                  setShowSaveDialog(false);
                }
              }}
            />
            <div style={modalButtonsStyle}>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                style={modalCancelButtonStyle}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveFilter}
                style={modalSaveButtonStyle}
                disabled={!saveName.trim()}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 样式
const filterBarStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  marginBottom: '16px',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const tagsBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid #f0f0f0',
  backgroundColor: '#fafafa',
  borderRadius: '8px 8px 0 0',
};

const tagsListStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  flex: 1,
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  backgroundColor: '#e6f7ff',
  border: '1px solid #91d5ff',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#1890ff',
};

const clearButtonStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#ff4d4f',
  fontSize: '12px',
  cursor: 'pointer',
};

const mainBarStyle: React.CSSProperties = {
  padding: '12px 16px',
};

const collapsedBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const addFilterButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px dashed #d0d0d0',
  backgroundColor: 'white',
  color: '#666',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const addIconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: '#f0f0f0',
  fontSize: '12px',
  fontWeight: 'bold',
};

const dividerStyle: React.CSSProperties = {
  color: '#d0d0d0',
};

const countStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#999',
};

const saveLoadButtonsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginLeft: 'auto',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  backgroundColor: 'white',
  fontSize: '12px',
  cursor: 'pointer',
};

const loadButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  backgroundColor: 'white',
  fontSize: '12px',
  cursor: 'pointer',
};

const savedFiltersDropdownStyle: React.CSSProperties = {
  position: 'relative',
};

const savedListDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '4px',
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 1000,
  minWidth: '200px',
  maxHeight: '300px',
  overflowY: 'auto',
};

const savedItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderBottom: '1px solid #f0f0f0',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const savedItemNameStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '13px',
  color: '#333',
};

const savedItemDeleteStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#999',
  fontSize: '14px',
  cursor: 'pointer',
};

const expandedBarStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const expandedHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
};

const expandedTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
};

const collapseButtonStyle: React.CSSProperties = {
  padding: '6px 16px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#1890ff',
  color: 'white',
  fontSize: '13px',
  cursor: 'pointer',
};

const groupsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const addGroupButtonStyle: React.CSSProperties = {
  marginTop: '12px',
  padding: '8px 16px',
  borderRadius: '4px',
  border: '1px dashed #722ed1',
  backgroundColor: 'white',
  color: '#722ed1',
  fontSize: '13px',
  cursor: 'pointer',
  alignSelf: 'flex-start',
};

// 模态框样式
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '24px',
  minWidth: '320px',
  maxWidth: '400px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const modalTitleStyle: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#333',
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  fontSize: '14px',
  marginBottom: '16px',
  boxSizing: 'border-box',
};

const modalButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
};

const modalCancelButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: '1px solid #d0d0d0',
  backgroundColor: 'white',
  fontSize: '13px',
  cursor: 'pointer',
};

const modalSaveButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#1890ff',
  color: 'white',
  fontSize: '13px',
  cursor: 'pointer',
};

export default FilterBar;
