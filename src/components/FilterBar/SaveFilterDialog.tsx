/**
 * SaveFilterDialog 保存筛选对话框
 * 将当前筛选条件保存到 localStorage
 */
import React, { useState, useCallback } from 'react';
import { Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { SaveFilterDialogProps, SavedFilter } from './types';

/**
 * SaveFilterDialog 组件
 */
export const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  open,
  onClose,
  onSave,
  filters,
  storageKey = 'crm_saved_filters',
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 提交保存
  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      toast({
        title: '请输入筛选名称',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // 生成唯一 ID
      const id = `filter_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      // 创建保存记录
      const now = new Date().toISOString();
      const savedFilter: SavedFilter = {
        id,
        name: name.trim(),
        description: description.trim() || undefined,
        createdAt: now,
        updatedAt: now,
        filters,
      };

      // 保存到 localStorage
      const existingFilters = getSavedFilters(storageKey);
      existingFilters.push(savedFilter);
      localStorage.setItem(storageKey, JSON.stringify(existingFilters));

      toast({
        title: '筛选条件已保存',
        description: `已保存为 "${name.trim()}"`,
      });
      onSave(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('保存筛选失败:', error);
      toast({
        title: '保存失败',
        description: '请重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [name, description, filters, storageKey, onSave, onClose, toast]);

  // 关闭时重置
  const handleClose = useCallback(() => {
    setName('');
    setDescription('');
    onClose();
  }, [onClose]);

  // 显示当前筛选条件
  const activeFilterEntries = Object.entries(filters).filter(([_, value]) => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>保存筛选条件</DialogTitle>
          <DialogDescription>
            将当前筛选条件保存以便下次快速使用
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 名称输入 */}
          <div className="space-y-2">
            <Label htmlFor="filter-name">筛选名称 *</Label>
            <Input
              id="filter-name"
              placeholder="例如：高价值客户筛选"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* 描述输入 */}
          <div className="space-y-2">
            <Label htmlFor="filter-description">描述（可选）</Label>
            <Input
              id="filter-description"
              placeholder="简要描述此筛选条件的作用"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* 显示当前筛选条件 */}
          <div className="space-y-2">
            <Label>当前筛选条件</Label>
            <div className="p-3 bg-muted rounded-md text-sm">
              {activeFilterEntries.length > 0
                ? activeFilterEntries.map(([key, value]) => (
                    <div key={key} className="mb-1 last:mb-0">
                      <span className="text-muted-foreground">{key}: </span>
                      <span className="text-blue-600">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))
                : '无筛选条件'}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** 从 localStorage 获取已保存的筛选 */
export const getSavedFilters = (storageKey: string): SavedFilter[] => {
  try {
    const data = localStorage.getItem(storageKey);
    if (data) {
      return JSON.parse(data) as SavedFilter[];
    }
    return [];
  } catch (error) {
    console.error('读取保存的筛选失败:', error);
    return [];
  }
};

/** 删除已保存的筛选 */
export const deleteSavedFilter = (storageKey: string, id: string): boolean => {
  try {
    const filters = getSavedFilters(storageKey);
    const updatedFilters = filters.filter(f => f.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updatedFilters));
    return true;
  } catch (error) {
    console.error('删除筛选失败:', error);
    return false;
  }
};

export default SaveFilterDialog;