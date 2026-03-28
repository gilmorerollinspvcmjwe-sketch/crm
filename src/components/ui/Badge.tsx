/**
 * Badge 组件 - 出海 CRM 设计系统
 * 状态徽章、标签、计数徽章
 */
import React from 'react';
import './Badge.css';

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor = 
  | 'brand' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'neutral';

interface BadgeProps {
  /** 徽章颜色 */
  color?: BadgeColor;
  /** 徽章变体 */
  variant?: BadgeVariant;
  /** 徽章尺寸 */
  size?: BadgeSize;
  /** 徽章内容 */
  children?: React.ReactNode;
  /** 是否显示圆点 */
  dot?: boolean;
  /** 计数 */
  count?: number;
  /** 最大计数 */
  maxCount?: number;
  /** 是否独立徽章（无父元素） */
  standalone?: boolean;
  /** 是否可点击 */
  onClick?: () => void;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 图标 */
  icon?: React.ReactNode;
  /** 类名 */
  className?: string;
  /** 样式 */
  style?: React.CSSProperties;
}

/**
 * Badge 组件
 * 
 * @example
 * // 状态徽章
 * <Badge color="success" variant="soft">活跃</Badge>
 * 
 * // 计数徽章
 * <Badge count={5} color="danger" />
 * 
 * // 圆点徽章
 * <Badge dot color="warning" />
 * 
 * // 带图标徽章
 * <Badge icon={<StarIcon />} color="brand">VIP</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  color = 'neutral',
  variant = 'soft',
  size = 'md',
  children,
  dot = false,
  count,
  maxCount = 99,
  standalone = false,
  onClick,
  closable = false,
  onClose,
  icon,
  className = '',
  style,
}) => {
  // 计数显示
  const displayCount = count !== undefined
    ? count > maxCount ? `${maxCount}+` : count
    : null;
  
  // 判断是否是计数徽章（小红点类型）
  const isCountBadge = count !== undefined || dot;
  
  // 容器类名
  const containerClasses = [
    'crm-badge',
    isCountBadge && 'crm-badge-count',
    !isCountBadge && `crm-badge-${variant}`,
    `crm-badge-${color}`,
    !isCountBadge && `crm-badge-${size}`,
    standalone && 'crm-badge-standalone',
    onClick && 'crm-badge-clickable',
    className,
  ].filter(Boolean).join(' ');
  
  // 渲染计数徽章
  if (isCountBadge) {
    return (
      <span className={containerClasses} style={style}>
        {dot ? null : displayCount}
      </span>
    );
  }
  
  // 渲染标签徽章
  return (
    <span className={containerClasses} style={style} onClick={onClick}>
      {icon && <span className="crm-badge-icon">{icon}</span>}
      {children && <span className="crm-badge-text">{children}</span>}
      {closable && (
        <button
          className="crm-badge-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          type="button"
          aria-label="关闭"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </span>
  );
};

/**
 * 状态徽章颜色映射
 */
export const getStatusColor = (status: string): BadgeColor => {
  const statusColorMap: Record<string, BadgeColor> = {
    // 通用状态
    'active': 'success',
    'inactive': 'neutral',
    'pending': 'warning',
    'draft': 'neutral',
    
    // 联系人状态
    '活跃': 'success',
    '不活跃': 'neutral',
    '待跟进': 'warning',
    
    // 客户状态
    '潜在客户': 'info',
    '意向客户': 'warning',
    '签约客户': 'success',
    '流失客户': 'danger',
    
    // 商机状态
    '初步接触': 'info',
    '需求确认': 'warning',
    '方案报价': 'brand',
    '商务谈判': 'warning',
    '成交': 'success',
    '失败': 'danger',
    
    // 合同状态
    '待审批': 'warning',
    '已审批': 'success',
    '执行中': 'brand',
    '已完成': 'success',
    '已取消': 'danger',
    
    // Lead 状态
    'new': 'info',
    'contacted': 'warning',
    'qualified': 'brand',
    'converted': 'success',
    'unqualified': 'danger',
    
    // 优先级
    'high': 'danger',
    'medium': 'warning',
    'low': 'info',
    
    // 决策角色
    '决策者': 'danger',
    '影响者': 'warning',
    '使用者': 'success',
    '把关者': 'info',
  };
  
  return statusColorMap[status] || 'neutral';
};

export default Badge;