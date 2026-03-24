/**
 * 待办事项 Dashlet 组件
 */

import React from 'react';
import { Card, List, Tag, Space, Badge } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, MailOutlined, WechatOutlined } from '@ant-design/icons';

interface TodoItem {
  id: string;
  type: 'followup' | 'approval' | 'payment';
  title: string;
  customer?: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

interface TodoDashletProps {
  data: {
    followUps: TodoItem[];
    approvals: TodoItem[];
    payments: TodoItem[];
  };
}

const typeIcons: Record<string, React.ReactNode> = {
  followup: <PhoneOutlined />,
  approval: <Badge count={0} />,
  payment: <EnvironmentOutlined />,
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

export const TodoDashlet: React.FC<TodoDashletProps> = ({ data }) => {
  const allTodos = [
    ...data.followUps.map((item) => ({ ...item, category: 'followup' })),
    ...data.approvals.map((item) => ({ ...item, category: 'approval' })),
    ...data.payments.map((item) => ({ ...item, category: 'payment' })),
  ].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'followup':
        return <PhoneOutlined style={{ color: '#1890ff' }} />;
      case 'approval':
        return <MailOutlined style={{ color: '#faad14' }} />;
      case 'payment':
        return <EnvironmentOutlined style={{ color: '#52c41a' }} />;
      default:
        return null;
    }
  };

  const renderCategoryTag = (category: string) => {
    const config: Record<string, { color: string; text: string }> = {
      followup: { color: '#1890ff', text: '待跟进' },
      approval: { color: '#faad14', text: '待审批' },
      payment: { color: '#52c41a', text: '回款' },
    };
    const { color, text } = config[category] || config.followup;
    return <Tag color={color} style={{ fontSize: 12 }}>{text}</Tag>;
  };

  return (
    <Card
      title="待办事项"
      bordered={false}
      size="small"
      style={{ height: '100%' }}
      extra={
        <Space size="small">
          <Badge count={data.followUps.length} style={{ backgroundColor: '#1890ff' }}>
            <span style={{ fontSize: 12 }}>跟进</span>
          </Badge>
          <Badge count={data.approvals.length} style={{ backgroundColor: '#faad14' }}>
            <span style={{ fontSize: 12 }}>审批</span>
          </Badge>
          <Badge count={data.payments.length} style={{ backgroundColor: '#52c41a' }}>
            <span style={{ fontSize: 12 }}>回款</span>
          </Badge>
        </Space>
      }
    >
      <List
        dataSource={allTodos.slice(0, 8)}
        renderItem={(item: any) => (
          <List.Item
            style={{ padding: '8px 0' }}
          >
            <List.Item.Meta
              avatar={
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: priorityColors[item.priority],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                }}>
                  {renderIcon(item.type)}
                </div>
              }
              title={
                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{item.title}</span>
                    <Tag color={priorityColors[item.priority]} style={{ fontSize: 12 }}>
                      {priorityTexts[item.priority]}
                    </Tag>
                  </div>
                  {item.customer && (
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {item.customer}
                    </div>
                  )}
                </Space>
              }
              description={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#999' }}>{item.time}</span>
                  {renderCategoryTag(item.category)}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
