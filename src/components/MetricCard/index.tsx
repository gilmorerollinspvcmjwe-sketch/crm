/**
 * MetricCard 指标卡组件
 * 用于仪表盘展示关键指标
 */
import React from 'react';
import { Card, Statistic, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { colors } from '../../styles/tokens';

export interface MetricCardProps {
  /** 标题 */
  title: string;
  /** 数值 */
  value: number | string;
  /** 趋势方向 */
  trend?: 'up' | 'down' | 'flat';
  /** 趋势值 */
  trendValue?: string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 颜色主题 */
  color?: 'primary' | 'success' | 'warning' | 'danger';
  /** 提示信息 */
  tooltip?: string;
  /** 前缀 */
  prefix?: string;
  /** 后缀 */
  suffix?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 点击回调 */
  onClick?: () => void;
}

const colorMap = {
  primary: colors.primary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

const trendColorMap = {
  up: colors.success,
  down: colors.danger,
  flat: colors.text.tertiary,
};

/**
 * MetricCard 指标卡组件
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendValue,
  icon,
  color = 'primary',
  tooltip,
  prefix,
  suffix,
  loading = false,
  onClick,
}) => {
  const renderTrend = () => {
    if (!trend || !trendValue) return null;

    const trendIcon = {
      up: <ArrowUpOutlined />,
      down: <ArrowDownOutlined />,
      flat: <MinusOutlined />,
    };

    return (
      <span style={{ 
        color: trendColorMap[trend], 
        fontSize: 12, 
        marginLeft: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}>
        {trendIcon[trend]}
        {trendValue}
      </span>
    );
  };

  return (
    <Card
      loading={loading}
      hoverable={!!onClick}
      onClick={onClick}
      styles={{
        body: { padding: 16 },
      }}
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            color: colors.text.secondary, 
            fontSize: 13, 
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            {title}
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined style={{ color: colors.text.tertiary, fontSize: 12 }} />
              </Tooltip>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <Statistic
              value={value}
              prefix={prefix}
              suffix={suffix}
              valueStyle={{
                fontSize: 24,
                fontWeight: 600,
                color: colorMap[color],
              }}
            />
            {renderTrend()}
          </div>
        </div>
        {icon && (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: `${colorMap[color]}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colorMap[color],
            fontSize: 24,
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;