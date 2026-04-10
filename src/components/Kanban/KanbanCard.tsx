/**
 * KanbanCard Component
 * 看板卡片组件
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, MessageSquare, Paperclip, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  probability?: number;
  stage?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  comments?: number;
  attachments?: number;
  tags?: string[];
  priority?: 'high' | 'medium' | 'low';
}

interface KanbanCardProps {
  card: KanbanCardData;
  onClick?: (card: KanbanCardData) => void;
  className?: string;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onClick, className }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow duration-200',
        className
      )}
      onClick={() => onClick?.(card)}
    >
      <CardContent className="p-3 space-y-2">
        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h4 className="font-medium text-sm line-clamp-2">{card.title}</h4>

        {/* Description */}
        {card.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Amount and Probability */}
        <div className="flex items-center justify-between">
          {card.amount !== undefined && (
            <span className="text-sm font-semibold text-primary">
              {formatCurrency(card.amount)}
            </span>
          )}
          {card.probability !== undefined && (
            <Badge variant="outline" className="text-xs">
              {card.probability}%
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {card.assignee && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={card.assignee.avatar} />
                <AvatarFallback className="text-[10px]">
                  {card.assignee.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}
            {card.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(card.dueDate), 'M/d', { locale: zhCN })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {card.comments !== undefined && card.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {card.comments}
              </div>
            )}
            {card.attachments !== undefined && card.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {card.attachments}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
