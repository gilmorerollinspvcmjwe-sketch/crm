/**
 * LoadFilterDialog 加载筛选对话框
 * 从 localStorage 加载已保存的筛选条件
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Check, Trash2, FolderOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { LoadFilterDialogProps, SavedFilter } from './types';
import { getSavedFilters, deleteSavedFilter } from './SaveFilterDialog';
import { cn } from '@/lib/utils';

/**
 * LoadFilterDialog 组件
 */
export const LoadFilterDialog: React.FC<LoadFilterDialogProps> = ({
  open,
  onClose,
  onLoad,
  onDelete,
  storageKey = 'crm_saved_filters',
}) => {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  // 加载已保存的筛选
  useEffect(() => {
    if (open) {
      const filters = getSavedFilters(storageKey);
      setSavedFilters(filters);
    }
  }, [open, storageKey]);

  // 删除筛选
  const handleDelete = useCallback(
    (id: string, name: string) => {
      const success = deleteSavedFilter(storageKey, id);
      if (success) {
        setSavedFilters(prev => prev.filter(f => f.id !== id));
        toast({
          title: '筛选已删除',
          description: `已删除 "${name}"`,
        });
        onDelete?.(id);
      } else {
        toast({
          title: '删除失败',
          variant: 'destructive',
        });
      }
    },
    [storageKey, onDelete, toast]
  );

  // 加载筛选
  const handleLoad = useCallback(
    (filter: SavedFilter) => {
      onLoad(filter);
      toast({
        title: '筛选已加载',
        description: `已应用 "${filter.name}"`,
      });
      onClose();
    },
    [onLoad, onClose, toast]
  );

  // 格式化日期
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>加载已保存的筛选</DialogTitle>
          <DialogDescription>
            选择一个已保存的筛选条件快速应用
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {savedFilters.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all",
                      "border",
                      selectedId === filter.id
                        ? "bg-blue-50 border-blue-300"
                        : "bg-muted hover:bg-muted/80 border-transparent hover:border-gray-200"
                    )}
                    onClick={() => setSelectedId(filter.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {filter.name}
                        </div>
                        {filter.description && (
                          <div className="text-xs text-muted-foreground">
                            {filter.description}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(filter.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoad(filter);
                          }}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          应用
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(filter.id, filter.name);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <div className="text-muted-foreground mb-2">
                暂无已保存的筛选条件
              </div>
              <div className="text-sm text-muted-foreground">
                先设置筛选条件后点击"保存"按钮
              </div>
              <Button variant="outline" className="mt-4" onClick={onClose}>
                返回
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadFilterDialog;