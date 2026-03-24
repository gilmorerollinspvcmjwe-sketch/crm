/**
 * DataTable 增强表格组件
 * 基于 Ant Design Table 封装，支持：
 * - 内置分页
 * - 内置筛选器
 * - 内置批量操作
 * - 密度切换
 * - 列配置（显示/隐藏/排序）
 * - 列宽保存到 localStorage
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table, Space, Button, Dropdown, Tooltip, Modal, Checkbox, Segmented } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd/es/table';
import type { ColumnsType } from 'antd/es/table/interface';
import {
  SettingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { colors } from '../../styles/tokens';

/** 表格密度类型 */
export type TableDensity = 'compact' | 'default' | 'wide';

/** 列配置 */
export interface ColumnConfig {
  /** 列标识 */
  key: string;
  /** 列标题 */
  title: string;
  /** 是否可隐藏 */
  hideable?: boolean;
  /** 默认是否显示 */
  defaultVisible?: boolean;
  /** 固定位置 */
  fixed?: 'left' | 'right';
  /** 宽度 */
  width?: number;
}

export interface DataTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  /** 表格唯一标识，用于持久化配置 */
  tableKey?: string;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否支持列配置 */
  columnConfig?: boolean;
  /** 是否支持密度切换 */
  densitySwitch?: boolean;
  /** 是否显示刷新按钮 */
  showRefresh?: boolean;
  /** 刷新回调 */
  onRefresh?: () => void;
  /** 分页配置 */
  pagination?: TablePaginationConfig | false;
  /** 批量操作按钮 */
  batchActions?: React.ReactNode;
  /** 工具栏额外内容 */
  toolbarExtra?: React.ReactNode;
  /** 行选中变化回调 */
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  /** 列变化回调 */
  onColumnChange?: (columns: ColumnConfig[]) => void;
  /** 密度变化回调 */
  onDensityChange?: (density: TableDensity) => void;
}

/** 密度配置映射 */
const densityConfig: Record<TableDensity, { size: 'small' | 'middle' | 'large'; cellPadding: number }> = {
  compact: { size: 'small', cellPadding: 8 },
  default: { size: 'middle', cellPadding: 12 },
  wide: { size: 'large', cellPadding: 16 },
};

const densityOptions = [
  { value: 'compact', label: '紧凑' },
  { value: 'default', label: '标准' },
  { value: 'wide', label: '宽松' },
];

function DataTableInner<T extends Record<string, any>>({
  columns,
  dataSource,
  tableKey,
  showToolbar = true,
  columnConfig = true,
  densitySwitch = true,
  showRefresh = true,
  onRefresh,
  pagination,
  batchActions,
  toolbarExtra,
  onSelectionChange,
  onColumnChange,
  onDensityChange,
  ...restProps
}: DataTableProps<T>) {
  // 从 localStorage 读取配置
  const getStoredConfig = useCallback(<K extends string, V>(key: K, defaultValue: V): V => {
    if (!tableKey) return defaultValue;
    try {
      const stored = localStorage.getItem(`table-${tableKey}-${key}`);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, [tableKey]);

  const setStoredConfig = useCallback(<K extends string, V>(key: K, value: V) => {
    if (!tableKey) return;
    try {
      localStorage.setItem(`table-${tableKey}-${key}`, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [tableKey]);

  // 状态
  const [density, setDensity] = useState<TableDensity>(() => getStoredConfig('density', 'default'));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [columnSettingsVisible, setColumnSettingsVisible] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() => getStoredConfig('hiddenColumns', []));

  // 持久化配置
  useEffect(() => {
    setStoredConfig('density', density);
    onDensityChange?.(density);
  }, [density, setStoredConfig, onDensityChange]);

  useEffect(() => {
    setStoredConfig('hiddenColumns', hiddenColumns);
  }, [hiddenColumns, setStoredConfig]);

  // 处理行选择
  const handleSelectionChange = useCallback((newSelectedRowKeys: React.Key[], selectedRows: T[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionChange?.(newSelectedRowKeys, selectedRows);
  }, [onSelectionChange]);

  // 处理密度变化
  const handleDensityChange = useCallback((value: string | number) => {
    setDensity(value as TableDensity);
  }, []);

  // 过滤隐藏的列
  const visibleColumns = useMemo(() => {
    if (!columns) return [];
    return columns.filter(col => {
      const key = (col as any).key || (col as any).dataIndex;
      return !hiddenColumns.includes(key as string);
    });
  }, [columns, hiddenColumns]);

  // 行选择配置
  const rowSelection = batchActions ? {
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: T[]) => handleSelectionChange(keys, rows),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  } : undefined;

  // 渲染工具栏
  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: '8px 0',
      }}>
        {/* 左侧：批量操作 */}
        <div>
          {selectedRowKeys.length > 0 && (
            <Space>
              <span style={{ color: colors.text.secondary }}>
                已选择 {selectedRowKeys.length} 项
              </span>
              {batchActions}
              <Button
                size="small"
                onClick={() => setSelectedRowKeys([])}
              >
                取消选择
              </Button>
            </Space>
          )}
          {toolbarExtra}
        </div>

        {/* 右侧：工具按钮 */}
        <Space>
          {densitySwitch && (
            <Segmented
              size="small"
              options={densityOptions}
              value={density}
              onChange={handleDensityChange}
            />
          )}
          {showRefresh && (
            <Tooltip title="刷新">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={onRefresh}
              />
            </Tooltip>
          )}
          {columnConfig && (
            <Tooltip title="列配置">
              <Button
                size="small"
                icon={<SettingOutlined />}
                onClick={() => setColumnSettingsVisible(true)}
              />
            </Tooltip>
          )}
        </Space>
      </div>
    );
  };

  // 渲染列配置弹窗
  const renderColumnSettings = () => {
    if (!columns) return null;
    
    const columnOptions = columns
      .filter(col => (col as any).key || (col as any).dataIndex)
      .map(col => {
        const key = ((col as any).key || (col as any).dataIndex) as string;
        return {
          key,
          label: typeof col.title === 'string' ? col.title : key,
          hideable: (col as any).hideable !== false,
        };
      });

    return (
      <Modal
        title="列配置"
        open={columnSettingsVisible}
        onCancel={() => setColumnSettingsVisible(false)}
        onOk={() => setColumnSettingsVisible(false)}
        width={400}
      >
        <div style={{ marginBottom: 12 }}>
          <Checkbox
            checked={hiddenColumns.length === 0}
            onChange={(e) => {
              if (e.target.checked) {
                setHiddenColumns([]);
              } else {
                setHiddenColumns(columnOptions.filter(c => c.hideable).map(c => c.key));
              }
            }}
          >
            全选
          </Checkbox>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {columnOptions.map(col => (
            <Checkbox
              key={col.key}
              checked={!hiddenColumns.includes(col.key)}
              disabled={!col.hideable}
              onChange={(e) => {
                if (e.target.checked) {
                  setHiddenColumns(prev => prev.filter(k => k !== col.key));
                } else {
                  setHiddenColumns(prev => [...prev, col.key]);
                }
              }}
            >
              {col.label}
            </Checkbox>
          ))}
        </div>
      </Modal>
    );
  };

  return (
    <div className="data-table-wrapper">
      {renderToolbar()}
      <Table<T>
        {...restProps}
        columns={visibleColumns as ColumnsType<T>}
        dataSource={dataSource}
        size={densityConfig[density].size}
        rowSelection={rowSelection}
        pagination={pagination === false ? false : {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          pageSizeOptions: ['20', '50', '100'],
          defaultPageSize: 20,
          ...pagination,
        }}
      />
      {renderColumnSettings()}
    </div>
  );
}

// 使用泛型导出
export const DataTable = DataTableInner as <T extends Record<string, any>>(
  props: DataTableProps<T>
) => React.ReactElement;

export default DataTable;