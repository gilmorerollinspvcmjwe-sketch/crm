/**
 * CustomerSkeleton - 客户模块骨架屏组件
 * 
 * 提供以下变体：
 * - CustomerTableSkeleton: 表格骨架屏
 * - CustomerCardSkeleton: 卡片骨架屏
 * - CustomerFormSkeleton: 表单骨架屏
 * - CustomerDetailSkeleton: 详情骨架屏
 * 
 * @version 1.0.0
 * @created 2025-03-27
 */

import React from 'react';
import '@/styles/effects.css';
import '@/styles/customer-effects.css';

/* ========== 基础骨架组件 ========== */

interface SkeletonBaseProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/* ========== 表格骨架屏 ========== */

interface TableSkeletonProps extends SkeletonBaseProps {
  /** 行数 */
  rows?: number;
  /** 列数 */
  columns?: number;
}

export const CustomerTableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 9,
  className = '',
  style,
}) => (
  <div className={`customer-table-skeleton ${className}`} style={style}>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div 
        key={rowIdx} 
        className="skeleton-table-row"
        style={{ borderBottom: '1px solid var(--color-border-secondary)' }}
      >
        <div className="skeleton skeleton-cell" style={{ width: '5%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '18%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '12%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '10%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '8%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '8%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '10%' }} />
        <div className="skeleton skeleton-cell" style={{ width: '12%' }} />
        <div className="skeleton skeleton-button" style={{ width: '15%' }} />
      </div>
    ))}
  </div>
);

/* ========== 卡片骨架屏 ========== */

interface CardSkeletonProps extends SkeletonBaseProps {
  /** 卡片数量 */
  count?: number;
}

export const CustomerCardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  className = '',
  style,
}) => (
  <div style={{ display: 'grid', gap: 16, ...style }} className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="customer-card-skeleton shadow-dp2">
        <div className="customer-card-skeleton__header">
          <div className="skeleton skeleton-avatar skeleton-avatar--lg" />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-title" style={{ marginBottom: 8 }} />
            <div className="skeleton skeleton-text skeleton-text--short" />
          </div>
        </div>
        <div className="customer-card-skeleton__content">
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text skeleton-text--medium" />
          <div className="skeleton skeleton-text skeleton-text--short" />
        </div>
        <div className="customer-card-skeleton__footer">
          <div className="skeleton skeleton-button" style={{ width: 60 }} />
          <div className="skeleton skeleton-button" style={{ width: 40 }} />
        </div>
      </div>
    ))}
  </div>
);

/* ========== 表单骨架屏 ========== */

export const CustomerFormSkeleton: React.FC<SkeletonBaseProps> = ({
  className = '',
  style,
}) => (
  <div className={`customer-form-skeleton ${className}`} style={style}>
    {/* 基本信息骨架 */}
    <div className="skeleton-form-item">
      <div className="skeleton skeleton-form-label" />
      <div className="skeleton skeleton-input" />
    </div>
    
    {/* 双列布局 */}
    <div style={{ display: 'flex', gap: 16 }}>
      <div className="skeleton-form-item" style={{ flex: 1 }}>
        <div className="skeleton skeleton-form-label" />
        <div className="skeleton skeleton-input" />
      </div>
      <div className="skeleton-form-item" style={{ flex: 1 }}>
        <div className="skeleton skeleton-form-label" />
        <div className="skeleton skeleton-input" />
      </div>
    </div>
    
    {/* 更多字段 */}
    <div className="skeleton-form-item">
      <div className="skeleton skeleton-form-label" />
      <div className="skeleton skeleton-input" />
    </div>
    
    <div style={{ display: 'flex', gap: 16 }}>
      <div className="skeleton-form-item" style={{ flex: 1 }}>
        <div className="skeleton skeleton-form-label" />
        <div className="skeleton skeleton-input" />
      </div>
      <div className="skeleton-form-item" style={{ flex: 1 }}>
        <div className="skeleton skeleton-form-label" />
        <div className="skeleton skeleton-input" />
      </div>
    </div>
    
    <div className="skeleton-form-item">
      <div className="skeleton skeleton-form-label" />
      <div className="skeleton skeleton-input" />
    </div>
    
    <div className="skeleton-form-item">
      <div className="skeleton skeleton-form-label" />
      <div className="skeleton skeleton-input" />
    </div>
    
    {/* 备注（多行） */}
    <div className="skeleton-form-item">
      <div className="skeleton skeleton-form-label" style={{ width: 60 }} />
      <div className="skeleton skeleton-input" style={{ height: 80 }} />
    </div>
    
    {/* 操作按钮 */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
      <div className="skeleton skeleton-button" style={{ width: 80 }} />
      <div className="skeleton skeleton-button" style={{ width: 100 }} />
    </div>
  </div>
);

/* ========== 详情骨架屏 ========== */

export const CustomerDetailSkeleton: React.FC<SkeletonBaseProps> = ({
  className = '',
  style,
}) => (
  <div className={`skeleton-detail ${className}`} style={style}>
    {/* 头部 */}
    <div className="skeleton-detail-header">
      <div className="skeleton skeleton-avatar skeleton-avatar--lg" />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: 8 }} />
        <div className="skeleton skeleton-text skeleton-text--short" />
      </div>
      <div className="skeleton skeleton-button" style={{ width: 100 }} />
    </div>
    
    {/* 内容区域 */}
    <div className="skeleton-detail-content">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-detail-row">
          <div className="skeleton skeleton-text skeleton-text--short" />
          <div className="skeleton skeleton-text skeleton-text--medium" />
        </div>
      ))}
    </div>
    
    {/* 标签 */}
    <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton skeleton-button" style={{ width: 60, height: 24 }} />
      ))}
    </div>
  </div>
);

/* ========== 列表骨架屏 ========== */

interface ListSkeletonProps extends SkeletonBaseProps {
  /** 项数 */
  count?: number;
}

export const CustomerListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  className = '',
  style,
}) => (
  <div style={{ ...style }} className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-list-item" style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
        <div className="skeleton skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text" style={{ marginBottom: 4 }} />
          <div className="skeleton skeleton-text skeleton-text--short" />
        </div>
      </div>
    ))}
  </div>
);

/* ========== 组合骨架屏组件 ========== */

interface CustomerSkeletonProps extends SkeletonBaseProps {
  /** 骨架屏类型 */
  variant: 'table' | 'card' | 'form' | 'detail' | 'list';
  /** 数量（仅适用于 card 和 list） */
  count?: number;
}

export const CustomerSkeleton: React.FC<CustomerSkeletonProps> = ({
  variant,
  count,
  className,
  style,
}) => {
  switch (variant) {
    case 'table':
      return <CustomerTableSkeleton rows={count} className={className} style={style} />;
    case 'card':
      return <CustomerCardSkeleton count={count} className={className} style={style} />;
    case 'form':
      return <CustomerFormSkeleton className={className} style={style} />;
    case 'detail':
      return <CustomerDetailSkeleton className={className} style={style} />;
    case 'list':
      return <CustomerListSkeleton count={count} className={className} style={style} />;
    default:
      return <CustomerTableSkeleton className={className} style={style} />;
  }
};

export default CustomerSkeleton;


/* ========== 使用示例 ========== */
/**
 * import { 
 *   CustomerSkeleton, 
 *   CustomerTableSkeleton, 
 *   CustomerCardSkeleton,
 *   CustomerFormSkeleton 
 * } from '@/components/skeleton/CustomerSkeleton';
 * 
 * // 使用组合组件
 * const CustomerPage = ({ loading }) => {
 *   if (loading) {
 *     return <CustomerSkeleton variant="table" count={10} />;
 *   }
 *   return <CustomerList />;
 * };
 * 
 * // 使用独立组件
 * const CustomerCardGrid = ({ loading }) => {
 *   if (loading) {
 *     return <CustomerCardSkeleton count={6} />;
 *   }
 *   return <CustomerCardList />;
 * };
 */