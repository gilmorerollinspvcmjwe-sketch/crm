/**
 * CollapseSection 可折叠区块组件
 * 支持状态持久化
 */
import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { colors } from '../../styles/tokens';

const { Text } = Typography;

export interface CollapseSectionProps {
  /** 标题 */
  title: string;
  /** 默认是否展开 */
  defaultExpanded?: boolean;
  /** 子内容 */
  children: React.ReactNode;
  /** 唯一标识，用于持久化状态 */
  storageKey?: string;
  /** 额外操作按钮 */
  extra?: React.ReactNode;
  /** 是否禁用折叠 */
  disabled?: boolean;
}

/**
 * CollapseSection 可折叠区块组件
 */
export const CollapseSection: React.FC<CollapseSectionProps> = ({
  title,
  defaultExpanded = true,
  children,
  storageKey,
  extra,
  disabled = false,
}) => {
  // 从 localStorage 读取持久化状态
  const getStoredExpanded = (): boolean => {
    if (!storageKey) return defaultExpanded;
    try {
      const stored = localStorage.getItem(`collapse-${storageKey}`);
      return stored !== null ? stored === 'true' : defaultExpanded;
    } catch {
      return defaultExpanded;
    }
  };

  const [expanded, setExpanded] = useState<boolean>(getStoredExpanded);

  // 状态变化时持久化
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(`collapse-${storageKey}`, String(expanded));
      } catch {
        // ignore storage errors
      }
    }
  }, [expanded, storageKey]);

  if (disabled) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: `1px solid ${colors.border.default}`,
          marginBottom: 16,
        }}>
          <Text strong style={{ fontSize: 14 }}>{title}</Text>
          {extra}
        </div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <Collapse
        activeKey={expanded ? ['1'] : []}
        onChange={(keys) => setExpanded(keys.includes('1'))}
        ghost
        expandIcon={({ isActive }) => (
          <RightOutlined
            rotate={isActive ? 90 : 0}
            style={{ fontSize: 12, color: colors.text.tertiary }}
          />
        )}
        expandIconPosition="start"
        items={[
          {
            key: '1',
            label: (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                paddingRight: 16,
              }}>
                <Text strong style={{ fontSize: 14 }}>{title}</Text>
                {extra && <span onClick={(e) => e.stopPropagation()}>{extra}</span>}
              </div>
            ),
            children: children,
            style: {
              border: 'none',
              background: 'transparent',
            },
          },
        ]}
        style={{
          marginBottom: 16,
        }}
      />
    </div>
  );
};

export default CollapseSection;