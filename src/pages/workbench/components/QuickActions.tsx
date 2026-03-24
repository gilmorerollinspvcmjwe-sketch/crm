/**
 * 快捷操作组件
 */

import React from 'react';
import { Card, Button, Space, Grid } from 'antd';
import {
  UserAddOutlined,
  AimOutlined,
  PhoneOutlined,
  FileTextOutlined,
  FileOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { QuickAction } from '../../../mock/workbench';

const { useBreakpoint } = Grid;

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  user: <UserAddOutlined />,
  opportunity: <AimOutlined />,
  activity: <PhoneOutlined />,
  quote: <FileTextOutlined />,
  contract: <FileOutlined />,
  calendar: <CalendarOutlined />,
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
}) => {
  const screens = useBreakpoint();

  const handleClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <Card
      title={
        <Space>
          <span>⚡</span>
          <span>快捷操作</span>
        </Space>
      }
      bordered={false}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Space
        direction="horizontal"
        style={{ width: '100%', flexWrap: 'wrap', rowGap: 8 }}
        size={8}
      >
        {actions.map((action) => (
          <Button
            key={action.id}
            icon={iconMap[action.icon] || <UserAddOutlined />}
            onClick={() => handleClick(action)}
            style={{
              height: 36,
              padding: '0 12px',
              fontSize: 13,
              minWidth: 80,
              flex: '0 0 auto',
            }}
          >
            {action.label}
          </Button>
        ))}
      </Space>
    </Card>
  );
};
