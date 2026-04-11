/**
 * KanbanColumn Component
 * 看板列组件
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KanbanCardData } from './KanbanCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface KanbanColumnData {
  id: string;
  title: string;
  color?: string;
  cards: KanbanCardData[];
  totalAmount?: number;
  limit?: number;
}

interface KanbanColumnProps {
  column: KanbanColumnData;
  onCardClick?: (card: KanbanCardData) => void;
  onAddCard?: (columnId: string) => void;
  className?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onCardClick,
  onAddCard,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount);
  };

  const totalAmount = column.cards.reduce((sum, card) => sum + (card.amount || 0), 0);

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.cards.length}
              {column.limit && `/${column.limit}`}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onAddCard?.(column.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>重命名</DropdownMenuItem>
                <DropdownMenuItem>设置限制</DropdownMenuItem>
                <DropdownMenuItem>归档列</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {totalAmount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            总计：{formatCurrency(totalAmount)}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-2 pt-0 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {column.cards.map((card) => (
            <div key={card.id} className="group relative">
              {/* Drag handle overlay - visible on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
              </div>
              <div className="pl-2">
                {React.cloneElement(
                  // @ts-ignore - KanbanCard is a component
                  <></>, // Placeholder - will be rendered by parent
                  {}
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
