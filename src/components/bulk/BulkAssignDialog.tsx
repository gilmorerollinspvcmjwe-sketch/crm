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

// Mock users data - in real app, this would come from a users API
const mockUsers = [
  { id: "1", name: "李明", department: "销售部" },
  { id: "2", name: "王芳", department: "销售部" },
  { id: "3", name: "陈静", department: "市场部" },
  { id: "4", name: "张伟", department: "客服部" },
  { id: "5", name: "刘洋", department: "销售部" },
]

interface BulkAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (assignee: string) => Promise<void>
  loading?: boolean
  title?: string
  description?: string
  users?: { id: string; name: string; department?: string }[]
}

export function BulkAssignDialog({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
  loading = false,
  title,
  description,
  users = mockUsers,
}: BulkAssignDialogProps) {
  const { t } = useTranslation()
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("")

  const handleConfirm = async () => {
    if (!selectedAssignee) return
    await onConfirm(selectedAssignee)
    setSelectedAssignee("")
  }

  const handleClose = () => {
    setSelectedAssignee("")
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title || t("bulkAssign.title", "批量分配")}
      width={400}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description || t(
            "bulkAssign.description",
            `您已选择 ${selectedCount} 条记录，请选择要分配的负责人。`
          )}
        </p>

        <div className="space-y-2">
          <Label htmlFor="assignee">
            {t("bulkAssign.assigneeLabel", "负责人")}
          </Label>
          <Select
            value={selectedAssignee}
            onValueChange={setSelectedAssignee}
          >
            <SelectTrigger id="assignee">
              <SelectValue placeholder={t("bulkAssign.selectPlaceholder", "选择负责人")} />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.name}>
                  <div className="flex items-center gap-2">
                    <span>{user.name}</span>
                    {user.department && (
                      <span className="text-xs text-muted-foreground">
                        ({user.department})
                      </span>
                    )}
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
            disabled={!selectedAssignee || loading}
            loading={loading}
          >
            {t("bulkAssign.confirm", "确认分配")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkAssignDialog