/**
 * KanbanBoard 看板组件
 * 支持拖拽排序、阶段分列显示
 */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Tag, Dropdown, Menu, Modal, Select, Input, Button, Space, message, Typography, Tooltip } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  DragOutlined,
} from '@ant-design/icons';
import { colors } from '../../styles/tokens';

const { Text, Paragraph } = Typography;

/** 看板卡片数据 */
export interface KanbanCard {
  id: string;
  title: string;
  amount?: number;
  customer?: string;
  owner?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  [key: string]: any;
}

/** 看板列配置 */
export interface KanbanColumn {
  key: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  /** 列配置 */
  columns: KanbanColumn[];
  /** 卡片点击回调 */
  onCardClick?: (card: KanbanCard, column: KanbanColumn) => void;
  /** 卡片编辑回调 */
  onCardEdit?: (card: KanbanCard) => void;
  /** 卡片删除回调 */
  onCardDelete?: (card: KanbanCard) => void;
  /** 卡片移动回调 */
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
  /** 新建卡片回调 */
  onCardCreate?: (columnKey: string) => void;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 是否显示金额汇总 */
  showAmountSummary?: boolean;
}

const priorityColors = {
  high: colors.danger,
  medium: colors.warning,
  low: colors.info,
};

/**
 * KanbanBoard 看板组件
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onCardClick,
  onCardEdit,
  onCardDelete,
  onCardMove,
  onCardCreate,
  draggable = true,
  showAmountSummary = true,
}) => {
  const { t } = useTranslation();
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; fromColumn: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // 计算列金额汇总
  const getColumnAmount = (column: KanbanColumn): number => {
    return column.cards.reduce((sum, card) => sum + (card.amount || 0), 0);
  };

  // 拖拽开始
  const handleDragStart = useCallback((card: KanbanCard, columnKey: string) => {
    if (!draggable) return;
    setDraggedCard({ card, fromColumn: columnKey });
  }, [draggable]);

  // 拖拽进入列
  const handleDragEnter = useCallback((columnKey: string) => {
    if (draggedCard) {
      setDragOverColumn(columnKey);
    }
  }, [draggedCard]);

  // 拖拽离开列
  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  // 放下
  const handleDrop = useCallback((toColumn: string) => {
    if (draggedCard && draggedCard.fromColumn !== toColumn) {
      onCardMove?.(draggedCard.card.id, draggedCard.fromColumn, toColumn);
    }
    setDraggedCard(null);
    setDragOverColumn(null);
  }, [draggedCard, onCardMove]);

  // 渲染卡片操作菜单
  const renderCardMenu = (card: KanbanCard) => (
    <Menu
      items={[
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: t('components.kanban.edit'),
          onClick: () => onCardEdit?.(card),
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: t('components.kanban.delete'),
          danger: true,
          onClick: () => {
            Modal.confirm({
              title: t('components.kanban.confirmDelete'),
              content: t('components.kanban.confirmDeleteMessage', { title: card.title }),
              okText: t('components.kanban.delete'),
              cancelText: t('common.cancel'),
              okType: 'danger',
              onOk: () => onCardDelete?.(card),
            });
          },
        },
      ]}
    />
  );

  // 渲染单个卡片
  const renderCard = (card: KanbanCard, columnKey: string) => (
    <Card
      key={card.id}
      size="small"
      hoverable
      draggable={draggable}
      onDragStart={() => handleDragStart(card, columnKey)}
      onClick={() => onCardClick?.(card, columns.find(c => c.key === columnKey)!)}
      style={{
        marginBottom: 8,
        cursor: draggable ? 'grab' : 'pointer',
        border: `1px solid ${colors.border.default}`,
        transition: 'all 0.2s',
      }}
      styles={{
        body: { padding: 12 },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ margin: 0, fontSize: 13, fontWeight: 500, flex: 1 }}
        >
          {card.title}
        </Paragraph>
        <Dropdown overlay={renderCardMenu(card)} trigger={['click']}>
          <MoreOutlined
            style={{ fontSize: 14, color: colors.text.tertiary, cursor: 'pointer' }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>

      {card.amount !== undefined && (
        <div style={{ marginTop: 8, fontWeight: 600, color: colors.primary }}>
          ¥{(card.amount / 10000).toFixed(0)}万
        </div>
      )}

      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {card.tags?.map((tag, index) => (
          <Tag key={index} style={{ margin: 0, fontSize: 11 }}>
            {tag}
          </Tag>
        ))}
        {card.priority && (
          <Tag
            color={priorityColors[card.priority]}
            style={{ margin: 0, fontSize: 11 }}
          >
            {card.priority === 'high' ? t('components.kanban.high') : card.priority === 'medium' ? t('components.kanban.medium') : t('components.kanban.low')}
          </Tag>
        )}
      </div>

      <div style={{
        marginTop: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: colors.text.secondary,
        fontSize: 12,
      }}>
        {card.owner && (
          <span>
            <UserOutlined style={{ marginRight: 4 }} />
            {card.owner}
          </span>
        )}
        {card.dueDate && (
          <span>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {card.dueDate}
          </span>
        )}
      </div>
    </Card>
  );

  // 渲染单列
  const renderColumn = (column: KanbanColumn) => {
    const isDragOver = dragOverColumn === column.key;
    const columnAmount = getColumnAmount(column);

    return (
      <div
        key={column.key}
        onDragEnter={() => handleDragEnter(column.key)}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(column.key)}
        style={{
          flex: 1,
          minWidth: 260,
          maxWidth: 320,
          background: isDragOver ? colors.primarySubtle : colors.background.default,
          borderRadius: 8,
          padding: 12,
          transition: 'background 0.2s',
        }}
      >
        {/* 列标题 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '8px 4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 4,
              height: 16,
              borderRadius: 2,
              background: column.color || colors.primary,
            }} />
            <Text strong style={{ fontSize: 14 }}>{column.title}</Text>
            <Tag style={{ marginLeft: 4 }}>{column.cards.length}</Tag>
          </div>
          {showAmountSummary && columnAmount > 0 && (
            <Text style={{ fontSize: 13, color: colors.text.secondary }}>
              ¥{(columnAmount / 10000).toFixed(0)}万
            </Text>
          )}
        </div>

        {/* 卡片列表 */}
        <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
          {column.cards.map(card => renderCard(card, column.key))}
        </div>

        {/* 新建按钮 */}
        {onCardCreate && (
          <Button
            type="dashed"
            block
            icon={<span style={{ fontSize: 16 }}>+</span>}
            onClick={() => onCardCreate(column.key)}
            style={{ marginTop: 8 }}
          >
            {t('components.kanban.newButton')}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      gap: 16,
      overflowX: 'auto',
      padding: '4px 0',
    }}>
      {columns.map(renderColumn)}
    </div>
  );
};

export default KanbanBoard;