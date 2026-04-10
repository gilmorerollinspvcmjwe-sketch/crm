"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "@/components/modal/Dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface BulkStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (status: string) => Promise<void>
  loading?: boolean
  title?: string
  description?: string
  statusOptions: { label: string; value: string; color?: string }[]
}

export function BulkStatusDialog({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
  loading = false,
  title,
  description,
  statusOptions,
}: BulkStatusDialogProps) {
  const { t } = useTranslation()
  const [selectedStatus, setSelectedStatus] = React.useState<string>("")

  const handleConfirm = async () => {
    if (!selectedStatus) return
    await onConfirm(selectedStatus)
    setSelectedStatus("")
  }

  const handleClose = () => {
    setSelectedStatus("")
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title || t("bulkStatus.title", "批量更新状态")}
      width={400}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description || t(
            "bulkStatus.description",
            `您已选择 ${selectedCount} 条记录，请选择要更新为的状态。`
          )}
        </p>

        <div className="space-y-2">
          <Label htmlFor="status">
            {t("bulkStatus.statusLabel", "状态")}
          </Label>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder={t("bulkStatus.selectPlaceholder", "选择状态")} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <span
                        className={cn(
                          "inline-flex h-2 w-2 rounded-full",
                          option.color
                        )}
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel", "取消")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedStatus || loading}
            loading={loading}
          >
            {t("bulkStatus.confirm", "确认更新")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkStatusDialog