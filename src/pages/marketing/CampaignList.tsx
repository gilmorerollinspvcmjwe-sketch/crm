"use client"

import { useState } from "react"
import { Loader2, Megaphone, Plus, Search, Play, Pause, BarChart3, Mail, Smartphone, Calendar, Users, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import {
  useCampaigns,
  useStartCampaign,
  usePauseCampaign,
  useDeleteCampaign,
  useMarketingStats,
} from "@/hooks/api/useMarketing"
import type { Campaign } from "@/hooks/api/useMarketing"
import { cn } from "@/lib/utils"

// ============ Campaign List Page ============

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  running: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-purple-100 text-purple-800 border-purple-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels: Record<string, string> = {
  draft: "草稿",
  scheduled: "已排期",
  running: "进行中",
  paused: "已暂停",
  completed: "已完成",
  cancelled: "已取消",
}

const typeIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sms: <Smartphone className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />,
  webinar: <ExternalLink className="h-4 w-4" />,
  other: <Megaphone className="h-4 w-4" />,
}

const typeLabels: Record<string, string> = {
  email: "邮件",
  sms: "短信",
  social: "社交媒体",
  event: "活动",
  webinar: "网络研讨会",
  other: "其他",
}

export function CampaignListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { data: campaigns, isLoading } = useCampaigns(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  )
  const { data: stats } = useMarketingStats()
  const startCampaign = useStartCampaign()
  const pauseCampaign = usePauseCampaign()
  const deleteCampaign = useDeleteCampaign()

  const handleStart = async (id: string) => {
    try {
      await startCampaign.mutateAsync(id)
    } catch (error) {
      console.error("Failed to start campaign:", error)
    }
  }

  const handlePause = async (id: string) => {
    try {
      await pauseCampaign.mutateAsync(id)
    } catch (error) {
      console.error("Failed to pause campaign:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除此活动吗？")) {
      try {
        await deleteCampaign.mutateAsync(id)
      } catch (error) {
        console.error("Failed to delete campaign:", error)
      }
    }
  }

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: "活动名称",
      meta: { width: 200, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-muted/50">
            {typeIcons[row.original.type]}
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "类型",
      meta: { width: 80 } as DataTableColumnMeta,
      cell: ({ row }) => (
        <Badge variant="outline">{typeLabels[row.getValue("type") as string]}</Badge>
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
          { label: "进行中", value: "running" },
          { label: "已暂停", value: "paused" },
          { label: "已完成", value: "completed" },
          { label: "已取消", value: "cancelled" },
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
      accessorKey: "startDate",
      header: "开始时间",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
    },
    {
      accessorKey: "endDate",
      header: "结束时间",
      meta: { width: 100, sortable: true } as DataTableColumnMeta,
    },
    {
      accessorKey: "targetAudience",
      header: "目标受众",
      meta: { width: 120 } as DataTableColumnMeta,
    },
    {
      accessorKey: "budget",
      header: "预算",
      meta: { width: 80, sortable: true } as DataTableColumnMeta,
      cell: ({ row }) => {
        const budget = row.getValue("budget") as number | undefined
        return budget ? `¥${budget.toLocaleString()}` : "-"
      },
    },
    {
      accessorKey: "stats",
      header: "统计数据",
      meta: { width: 200 } as DataTableColumnMeta,
      cell: ({ row }) => {
        const stats = row.original.stats
        if (!stats) return "-"
        return (
          <div className="flex items-center gap-2 text-xs">
            <span>发送: {stats.sentCount}</span>
            <span>打开: {stats.openedCount}</span>
            <span>点击: {stats.clickedCount}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "操作",
      meta: { width: 100 } as DataTableColumnMeta,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className="flex items-center gap-2">
            {status === "draft" || status === "paused" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStart(row.original.id)}
                disabled={startCampaign.isPending}
              >
                <Play className="h-4 w-4" />
              </Button>
            ) : status === "running" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePause(row.original.id)}
                disabled={pauseCampaign.isPending}
              >
                <Pause className="h-4 w-4" />
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteCampaign.isPending}
            >
              <Loader2 className="h-4 w-4" />
            </Button>
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
          <Megaphone className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">营销活动</h1>
            <p className="text-muted-foreground">管理和监控营销活动</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新建活动
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">总活动数</p>
                  <p className="text-xl font-bold">{stats.totalCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">进行中</p>
                  <p className="text-xl font-bold">{stats.activeCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">本月邮件</p>
                  <p className="text-xl font-bold">{stats.emailsSentThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">平均打开率</p>
                  <p className="text-xl font-bold">{stats.avgOpenRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input placeholder="搜索活动..." className="max-w-sm" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="scheduled">已排期</SelectItem>
            <SelectItem value="running">进行中</SelectItem>
            <SelectItem value="paused">已暂停</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
            <SelectItem value="cancelled">已取消</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={campaigns || []}
        showSearch
        searchPlaceholder="搜索活动..."
        showPagination
        pageSizeOptions={[10, 20, 50]}
        defaultPageSize={10}
        emptyText="暂无营销活动"
        className="border rounded-lg"
      />
    </div>
  )
}

export default CampaignListPage