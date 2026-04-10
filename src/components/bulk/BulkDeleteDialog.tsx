"use client"

import { useTranslation } from "react-i18next"
import { AlertTriangle } from "lucide-react"
import { Modal } from "@/components/modal/Dialog"
import { Button } from "@/components/ui/button"

interface BulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: () => Promise<void>
  loading?: boolean
  title?: string
  description?: string
  itemName?: string
}

export function BulkDeleteDialog({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
  loading = false,
  title,
  description,
  itemName = "记录",
}: BulkDeleteDialogProps) {
  const { t } = useTranslation()

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title || t("bulkDelete.title", "批量删除确认")}
      width={400}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">
              {t("bulkDelete.warning", "警告：此操作不可恢复")}
            </p>
            <p className="text-sm text-muted-foreground">
              {description || t(
                "bulkDelete.description",
                `您即将删除 ${selectedCount} 条${itemName}，删除后数据将无法恢复。`
              )}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("bulkDelete.confirmHint", "请确认是否继续执行此操作。")}
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel", "取消")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={loading}
          >
            {t("bulkDelete.confirm", "确认删除")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkDeleteDialog