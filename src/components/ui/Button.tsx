/**
 * Button 组件 - 出海 CRM 设计系统
 * 5 种按钮类型：primary, secondary, text, danger, icon
 * 效率优先，克制的高级感
 */
import React from 'react';
import './Button.css';

export type ButtonType = 'primary' | 'secondary' | 'text' | 'danger' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按钮类型 */
  type?: ButtonType;
  /** HTML button type (button, submit, reset) */
  htmlType?: 'button' | 'submit' | 'reset';
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 加载状态 */
  loading?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
  /** 子元素 */
  children?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否块级按钮 */
  block?: boolean;
  /** href 属性，使按钮变成链接 */
  href?: string;
  /** 链接目标 */
  target?: string;
}

/**
 * Button 组件
 * 
 * @example
 * // 主按钮
 * <Button type="primary">新建联系人</Button>
 * 
 * // 次要按钮
 * <Button type="secondary" icon={<FilterIcon />}>筛选</Button>
 * 
 * // 文字按钮
 * <Button type="text" size="sm">查看</Button>
 * 
 * // 图标按钮
 * <Button type="icon" icon={<EditIcon />} />
 * 
 * // 危险按钮
 * <Button type="danger">删除</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  block = false,
  href,
  target,
  htmlType,
  onClick,
  ...props
}) => {
  const classes = [
    'crm-btn',
    `crm-btn-${type}`,
    `crm-btn-${size}`,
    loading && 'crm-btn-loading',
    disabled && 'crm-btn-disabled',
    block && 'crm-btn-block',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  // 渲染内容
  const renderContent = () => (
    <>
      {loading && (
        <span className="crm-btn-spinner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
          </svg>
        </span>
      )}
      {icon && !loading && <span className="crm-btn-icon">{icon}</span>}
      {children && <span className="crm-btn-text">{children}</span>}
    </>
  );

  // 链接按钮
  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        onClick={handleClick}
        role="button"
        aria-disabled={disabled || loading}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      type={htmlType || 'button'}
      aria-busy={loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;