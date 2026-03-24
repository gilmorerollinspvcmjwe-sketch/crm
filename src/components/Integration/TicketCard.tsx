/**
 * 工单卡片组件
 * 用于展示工单摘要信息
 */
import React from 'react';
import { Card, Tag, Space, Typography, Tooltip } from 'antd';
import { Ticket, TicketStatus, TicketPriority } from '../../types/ticket';

const { Title, Text } = Typography;

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

/** 状态标签颜色映射 */
const statusColorMap: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'red',
  [TicketStatus.IN_PROGRESS]: 'blue',
  [TicketStatus.PENDING]: 'orange',
  [TicketStatus.RESOLVED]: 'green',
  [TicketStatus.CLOSED]: 'default',
};

/** 优先级标签颜色映射 */
const priorityColorMap: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'default',
  [TicketPriority.MEDIUM]: 'blue',
  [TicketPriority.HIGH]: 'orange',
  [TicketPriority.URGENT]: 'red',
};

/**
 * 工单卡片组件
 */
export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: 16, cursor: onClick ? 'pointer' : 'default' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space>
          <Title level={5} style={{ margin: 0, flex: 1 }}>{ticket.title}</Title>
          <Tag color={statusColorMap[ticket.status]}>{ticket.status}</Tag>
          <Tag color={priorityColorMap[ticket.priority]}>{ticket.priority}</Tag>
        </Space>

        <Text type="secondary" ellipsis>{ticket.description}</Text>

        <Space split={<span>|</span>} size="small" wrap>
          <Tooltip title="工单号">
            <Text type="secondary">{ticket.ticketNumber}</Text>
          </Tooltip>
          {ticket.customerName && (
            <Tooltip title="客户">
              <Text type="secondary">{ticket.customerName}</Text>
            </Tooltip>
          )}
          {ticket.assigneeName && (
            <Tooltip title="处理人">
              <Text type="secondary">👤 {ticket.assigneeName}</Text>
            </Tooltip>
          )}
          <Tooltip title="创建时间">
            <Text type="secondary">{ticket.createdAt}</Text>
          </Tooltip>
        </Space>

        {ticket.tags.length > 0 && (
          <Space wrap size="small">
            {ticket.tags.map(tag => (
              <Tag key={tag} color="purple">{tag}</Tag>
            ))}
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default TicketCard;
