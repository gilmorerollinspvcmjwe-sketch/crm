/**
 * KanbanBoard Component
 * 通用看板组件
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, Save } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { KanbanCardData } from './KanbanCard';
import type { KanbanColumnData } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  columns: KanbanColumnData[];
  onCardClick?: (card: KanbanCardData) => void;
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  onAddCard?: (columnId: string) => void;
  onSaveView?: (viewName: string) => void;
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onCardClick,
  onCardMove,
  onAddCard,
  onSaveView,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [viewName, setViewName] = useState('');

  // Filter cards
  const filterCards = useCallback((cards: KanbanCardData[]) => {
    return cards.filter((card) => {
      const matchesSearch =
        !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || card.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [searchQuery, filterPriority]);

  // Handle drag end
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const sourceColumnId = result.source.droppableId;
    const destColumnId = result.destination.droppableId;
    const cardId = result.draggableId;

    if (sourceColumnId !== destColumnId && onCardMove) {
      onCardMove(cardId, sourceColumnId, destColumnId);
    }
  }, [onCardMove]);

  // Handle save view
  const handleSaveView = () => {
    if (viewName.trim() && onSaveView) {
      onSaveView(viewName.trim());
      setViewName('');
    }
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索卡片..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as any)}>
          <SelectTrigger className="w-[120px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 ml-auto">
          <Input
            placeholder="视图名称"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            className="w-[150px]"
          />
          <Button variant="outline" size="sm" onClick={handleSaveView} disabled={!viewName.trim()}>
            <Save className="h-4 w-4 mr-1" />
            保存视图
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            新建卡片
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column, columnIndex) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-80 shrink-0"
                >
                  <div className="h-full">
                    <KanbanColumn
                      column={{
                        ...column,
                        cards: filterCards(column.cards),
                      }}
                      onCardClick={onCardClick}
                      onAddCard={onAddCard}
                    />
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
