/**
 * 工单卡片组件
 * 用于展示工单摘要信息
 */
import React from 'react';
import { Card, Tag, Space, Typography, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { Ticket, TicketStatus, TicketPriority } from '../../types/ticket';

const { Title, Text } = Typography;

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

/**
 * 工单卡片组件
 */
export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const { t } = useTranslation();

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

  /** 状态文本映射 */
  const statusTextMap: Record<TicketStatus, string> = {
    [TicketStatus.OPEN]: t('integration.tickets.statusOpen'),
    [TicketStatus.IN_PROGRESS]: t('integration.tickets.statusInProgress'),
    [TicketStatus.PENDING]: t('integration.tickets.statusPending'),
    [TicketStatus.RESOLVED]: t('integration.tickets.statusResolved'),
    [TicketStatus.CLOSED]: t('integration.tickets.statusClosed'),
  };

  /** 优先级文本映射 */
  const priorityTextMap: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: t('integration.tickets.priorityLow'),
    [TicketPriority.MEDIUM]: t('integration.tickets.priorityMedium'),
    [TicketPriority.HIGH]: t('integration.tickets.priorityHigh'),
    [TicketPriority.URGENT]: t('integration.tickets.priorityUrgent'),
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: 16, cursor: onClick ? 'pointer' : 'default' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space>
          <Title level={5} style={{ margin: 0, flex: 1 }}>{ticket.title}</Title>
          <Tag color={statusColorMap[ticket.status]}>{statusTextMap[ticket.status]}</Tag>
          <Tag color={priorityColorMap[ticket.priority]}>{priorityTextMap[ticket.priority]}</Tag>
        </Space>

        <Text type="secondary" ellipsis>{ticket.description}</Text>

        <Space split={<span>|</span>} size="small" wrap>
          <Tooltip title={t('integration.tickets.columnTicketNumber')}>
            <Text type="secondary">{ticket.ticketNumber}</Text>
          </Tooltip>
          {ticket.customerName && (
            <Tooltip title={t('integration.tickets.columnCustomer')}>
              <Text type="secondary">{ticket.customerName}</Text>
            </Tooltip>
          )}
          {ticket.assigneeName && (
            <Tooltip title={t('integration.tickets.columnAssignee')}>
              <Text type="secondary">👤 {ticket.assigneeName}</Text>
            </Tooltip>
          )}
          <Tooltip title={t('integration.tickets.columnCreatedAt')}>
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