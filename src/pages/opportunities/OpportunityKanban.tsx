/**
 * OpportunityKanban Page
 * 商机看板页面
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KanbanBoard, type KanbanCardData, type KanbanColumnData } from '@/components/Kanban';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for opportunities
const mockOpportunities: KanbanCardData[] = [
  {
    id: '1',
    title: '企业 ERP 系统升级',
    description: '为 Acme Corp 提供全面的 ERP 系统升级方案',
    amount: 2400000,
    probability: 75,
    assignee: { name: '张三', avatar: '' },
    dueDate: '2026-04-30',
    comments: 5,
    attachments: 3,
    tags: ['企业客户', '高优先级'],
    priority: 'high',
  },
  {
    id: '2',
    title: 'CRM 实施项目',
    description: '为 TechStart 实施 CRM 系统',
    amount: 800000,
    probability: 60,
    assignee: { name: '李四', avatar: '' },
    dueDate: '2026-05-15',
    comments: 2,
    attachments: 1,
    tags: ['中小企业'],
    priority: 'medium',
  },
  {
    id: '3',
    title: '数据分析平台',
    description: '构建定制化数据分析平台',
    amount: 1500000,
    probability: 45,
    assignee: { name: '王五', avatar: '' },
    dueDate: '2026-06-01',
    comments: 8,
    attachments: 5,
    tags: ['数据分析', '定制开发'],
    priority: 'medium',
  },
  {
    id: '4',
    title: '云迁移服务',
    description: '帮助客户迁移到云平台',
    amount: 600000,
    probability: 90,
    assignee: { name: '赵六', avatar: '' },
    dueDate: '2026-04-20',
    comments: 1,
    attachments: 2,
    tags: ['云服务'],
    priority: 'high',
  },
  {
    id: '5',
    title: '自动化工作流',
    description: '实施自动化工作流解决方案',
    amount: 350000,
    probability: 30,
    assignee: { name: '钱七', avatar: '' },
    dueDate: '2026-07-01',
    comments: 0,
    attachments: 0,
    tags: ['自动化'],
    priority: 'low',
  },
];

const mockColumns: KanbanColumnData[] = [
  {
    id: 'lead_confirmation',
    title: '线索确认',
    color: '#1890ff',
    cards: [mockOpportunities[2]],
    totalAmount: 1500000,
  },
  {
    id: 'initial_contact',
    title: '初步接触',
    color: '#40a9ff',
    cards: [mockOpportunities[1]],
    totalAmount: 800000,
  },
  {
    id: 'requirement_confirmation',
    title: '需求确认',
    color: '#69c0ff',
    cards: [mockOpportunities[4]],
    totalAmount: 350000,
  },
  {
    id: 'proposal_quotation',
    title: '方案报价',
    color: '#91d5ff',
    cards: [mockOpportunities[0]],
    totalAmount: 2400000,
  },
  {
    id: 'negotiation_approval',
    title: '谈判审批',
    color: '#bae7ff',
    cards: [mockOpportunities[3]],
    totalAmount: 600000,
  },
  {
    id: 'closed_won',
    title: '成交',
    color: '#52c41a',
    cards: [],
    totalAmount: 0,
  },
  {
    id: 'closed_lost',
    title: '输单',
    color: '#ff4d4f',
    cards: [],
    totalAmount: 0,
  },
];

const OpportunityKanban: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<KanbanColumnData[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setColumns(mockColumns);
      setLoading(false);
    }, 800);
  }, []);

  const handleCardClick = (card: KanbanCardData) => {
    navigate(`/opportunities/${card.id}`);
  };

  const handleCardMove = (cardId: string, fromColumnId: string, toColumnId: string) => {
    // Update local state
    setColumns((prev) => {
      const fromColumn = prev.find((c) => c.id === fromColumnId);
      const toColumn = prev.find((c) => c.id === toColumnId);
      if (!fromColumn || !toColumn) return prev;

      const card = fromColumn.cards.find((c) => c.id === cardId);
      if (!card) return prev;

      return prev.map((c) => {
        if (c.id === fromColumnId) {
          return { ...c, cards: c.cards.filter((card) => card.id !== cardId) };
        }
        if (c.id === toColumnId) {
          return { ...c, cards: [...c.cards, card] };
        }
        return c;
      });
    });

    toast({
      title: '商机已移动',
      description: `已从"${fromColumnId}"移动到"${toColumnId}"`,
    });
  };

  const handleAddCard = (columnId: string) => {
    navigate(`/opportunities/new?stage=${columnId}`);
  };

  const handleSaveView = (viewName: string) => {
    toast({
      title: '视图已保存',
      description: `看板视图"${viewName}"已保存`,
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[600px] w-80 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">商机看板</h1>
        <p className="text-muted-foreground">
          拖拽卡片来更新商机阶段，实时查看销售管道状态
        </p>
      </div>
      <KanbanBoard
        columns={columns}
        onCardClick={handleCardClick}
        onCardMove={handleCardMove}
        onAddCard={handleAddCard}
        onSaveView={handleSaveView}
      />
    </div>
  );
};

export default OpportunityKanban;
