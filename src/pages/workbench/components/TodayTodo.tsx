/**
 * 今日待办组件
 */
import React from 'react';
import { Card, List, Tag, Space, Button, Typography } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, MailOutlined, ClockCircleOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { TodoItem } from '../../../mock/workbench';

const { Text } = Typography;

interface TodayTodoProps {
  todos: TodoItem[];
  onViewAll?: () => void;
  onTodoClick?: (todo: TodoItem) => void;
  onPhoneCall?: (todo: TodoItem) => void;
  onComplete?: (todoId: string) => void;
  completedIds?: Set<string>;
}

const typeIcons: Record<string, React.ReactNode> = {
  followup: <PhoneOutlined />,
  approval: <MailOutlined />,
  payment: <EnvironmentOutlined />,
  meeting: <ClockCircleOutlined />,
};

const priorityColors: Record<string, string> = {
  high: '#f5222d',
  medium: '#faad14',
  low: '#52c41a',
};

const priorityTexts: Record<string, string> = {
  high: '紧急',
  medium: '重要',
  low: '普通',
};

const typeColors: Record<string, string> = {
  followup: '#1890ff',
  approval: '#faad14',
  payment: '#52c41a',
  meeting: '#722ed1',
};

const typeTexts: Record<string, string> = {
  followup: '待跟进',
  approval: '待审批',
  payment: '回款',
  meeting: '会议',
};

export const TodayTodo: React.FC<TodayTodoProps> = ({ todos, onViewAll, onTodoClick, onPhoneCall, onComplete, completedIds = new Set() }) => {
  const { t } = useTranslation();
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleTodoClick = (todo: TodoItem) => {
    if (onTodoClick) onTodoClick(todo);
  };

  const handlePhoneClick = (e: React.MouseEvent, todo: TodoItem) => {
    e.stopPropagation();
    if (onPhoneCall) onPhoneCall(todo);
  };

  const handleCompleteClick = (e: React.MouseEvent, todoId: string) => {
    e.stopPropagation();
    if (onComplete) onComplete(todoId);
  };

  return (
    <Card
      title={
        <Space>
          <span>🔔</span>
          <span>{t('workbench.todo.title')}</span>
          <Tag color="blue">{todos.length}</Tag>
        </Space>
      }
      bordered={false}
      extra={
        <Button type="link" onClick={onViewAll} style={{ padding: '4px 8px' }}>
          {t('workbench.todo.viewAll')} <RightOutlined />
        </Button>
      }
      bodyStyle={{ padding: '12px 16px' }}
    >
      <List
        dataSource={sortedTodos}
        renderItem={(todo) => {
          const isCompleted = completedIds.has(todo.id);
          return (
            <List.Item
              style={{ padding: '8px 0', cursor: 'pointer', transition: 'background 0.3s', borderBottom: '1px solid #f0f0f0', opacity: isCompleted ? 0.6 : 1 }}
              onClick={() => handleTodoClick(todo)}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Space style={{ width: '100%', flexWrap: 'nowrap' }} align="center">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: priorityColors[todo.priority], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, flexShrink: 0 }}>
                  {typeIcons[todo.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Space style={{ width: '100%' }} align="center">
                    <Text strong style={{ fontSize: 14, textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#999' : 'inherit' }} ellipsis>
                      {todo.time} {todo.customerName}-{todo.title}
                    </Text>
                    <Tag color={priorityColors[todo.priority]} style={{ fontSize: 11, margin: 0, padding: '0 6px', lineHeight: '18px', height: 18 }}>
                      {priorityTexts[todo.priority]}
                    </Tag>
                  </Space>
                </div>
                <Space size="small">
                  {todo.phone && (
                    <Button type="text" size="small" icon={<PhoneOutlined />} onClick={(e) => handlePhoneClick(e, todo)} style={{ padding: '4px' }} title={t('workbench.todo.call')} />
                  )}
                  <Button type="text" size="small" icon={isCompleted ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CheckOutlined />} onClick={(e) => handleCompleteClick(e, todo.id)} style={{ padding: '4px', color: isCompleted ? '#52c41a' : 'inherit' }} title={isCompleted ? t('workbench.todo.cancelComplete') : t('workbench.todo.markComplete')} />
                </Space>
              </Space>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default TodayTodo;