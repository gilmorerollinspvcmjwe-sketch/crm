"use client"

import { useState } from "react"
import { Loader2, Mail, Plus, Search, Send, Clock, Eye, MousePointer, Reply, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { useEmails, useSendEmail, useDeleteEmail } from "@/hooks/api/useMarketing"
import type { Email } from "@/hooks/api/useMarketing"
import { cn } from "@/lib/utils"

// ============ Email List Page ============

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  sending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  sent: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels: Record<string, string> = {
  draft: "草稿",
  scheduled: "已排期",
  sending: "发送中",
  sent: "已发送",
  failed: "发送失败",
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-50 text-gray-600",
  normal: "bg-blue-50 text-blue-600",
  high: "bg-red-50 text-red-600",
}

const priorityLabels: Record<string, string> = {
  low: "低",
  normal: "普通",
  high: "高",
}

export function EmailListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { data: emails, isLoading } = useEmails(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  )
  const sendEmail = useSendEmail()
  const deleteEmail = useDeleteEmail()

  const handleSend = async (id: string) => {
    if (confirm("确定要立即发送此邮件吗？")) {
      try {
        await sendEmail.mutateAsync(id)
      } catch (error) {
        console.error("Failed to send email:", error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除此邮件吗？")) {
      try {
        await deleteEmail.mutateAsync(id)
      } catch (error) {
        console.error("Failed to delete email:", error)
      }
    }
  }

  const columns: ColumnDef<Email>[] = [
    {
      accessorKey: "subject",
      header: "邮件主题",
      meta: { width: 250, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("subject")}</span>
        </div>
      ),
    },
    {
      accessorKey: "recipientCount",
      header: "收件人数",
      meta: { width: 80, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("recipientCount")} 人</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "状态",
      meta: {
        width: 80,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { label: "草稿", value: "draft" },
          { label: "已排期", value: "scheduled" },
          { label: "发送中", value: "sending" },
          { label: "已发送", value: "sent" },
          { label: "发送失败", value: "failed" },
        ],
      } as DataTableColumnMeta,
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", statusColors[status])}>
            {statusLabels[status]}
          </span>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "优先级",
      meta: { width: 80 } as DataTableColumnMeta,
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        return (
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs", priorityColors[priority])}>
            {priorityLabels[priority]}
          </span>
        )
      },
    },
    {
      accessorKey: "scheduledAt",
      header: "排期时间",
      meta: { width: 120, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const scheduledAt = row.getValue("scheduledAt") as string | undefined
        return scheduledAt || "-"
      },
    },
    {
      accessorKey: "sentAt",
      header: "发送时间",
      meta: { width: 120, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const sentAt = row.getValue("sentAt") as string | undefined
        return sentAt || "-"
      },
    },
    {
      accessorKey: "stats",
      header: "统计",
      meta: { width: 200 } as DataTableColumnMeta,
      cell: ({ row }) => {
        const stats = row.original.stats
        if (!stats) return "-"
        return (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span>{stats.opened}</span>
            </div>
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3 text-muted-foreground" />
              <span>{stats.clicked}</span>
            </div>
            <div className="flex items-center gap-1">
              <Reply className="h-3 w-3 text-muted-foreground" />
              <span>{stats.replied}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "操作",
      meta: { width: 120 } as DataTableColumnMeta,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className="flex items-center gap-2">
            {status === "draft" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSend(row.original.id)}
                disabled={sendEmail.isPending}
              >
                <Send className="mr-1 h-3 w-3" />
                发送
              </Button>
            )}
            {(status === "draft" || status === "scheduled") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(row.original.id)}
                disabled={deleteEmail.isPending}
              >
                <Loader2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">邮件管理</h1>
            <p className="text-muted-foreground">管理营销邮件的创建和发送</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新建邮件
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input placeholder="搜索邮件..." className="max-w-sm" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="scheduled">已排期</SelectItem>
            <SelectItem value="sending">发送中</SelectItem>
            <SelectItem value="sent">已发送</SelectItem>
            <SelectItem value="failed">发送失败</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={emails || []}
        showSearch
        searchPlaceholder="搜索邮件主题..."
        showPagination
        pageSizeOptions={[10, 20, 50]}
        defaultPageSize={10}
        emptyText="暂无邮件记录"
        className="border rounded-lg"
      />
    </div>
  )
}

export default EmailListPage