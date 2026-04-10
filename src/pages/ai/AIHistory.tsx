"use client"

import { useState } from "react"
import { Loader2, History, BrainCircuit, Trash2, ChevronRight, Users, TrendingUp, MessageSquareText, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAIHistory, useClearAIHistory } from "@/hooks/api/useAI"

// ============ AI History Page ============

const typeIcons: Record<string, React.ReactNode> = {
  customer_analysis: <Users className="h-4 w-4" />,
  opportunity_prediction: <TrendingUp className="h-4 w-4" />,
  email_draft: <MessageSquareText className="h-4 w-4" />,
  summary: <FileText className="h-4 w-4" />,
  custom: <BrainCircuit className="h-4 w-4" />,
}

const typeLabels: Record<string, string> = {
  customer_analysis: "客户分析",
  opportunity_prediction: "商机预测",
  email_draft: "邮件草稿",
  summary: "内容摘要",
  custom: "自定义",
}

export function AIHistoryPage() {
  const [filterType, setFilterType] = useState<string>("all")
  const { data: history, isLoading } = useAIHistory(
    filterType !== "all" ? { type: filterType } : undefined
  )
  const clearHistory = useClearAIHistory()

  const handleClearHistory = async () => {
    if (confirm("确定要清除所有 AI 请求历史吗？")) {
      try {
        await clearHistory.mutateAsync()
        console.log("History cleared")
      } catch (error) {
        console.error("Failed to clear history:", error)
      }
    }
  }

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
          <History className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI 请求历史</h1>
            <p className="text-muted-foreground">查看和管理 AI 请求记录</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleClearHistory}
          disabled={clearHistory.isPending}
        >
          {clearHistory.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          清除历史
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="搜索历史记录..."
            className="max-w-sm"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="customer_analysis">客户分析</SelectItem>
            <SelectItem value="opportunity_prediction">商机预测</SelectItem>
            <SelectItem value="email_draft">邮件草稿</SelectItem>
            <SelectItem value="summary">内容摘要</SelectItem>
            <SelectItem value="custom">自定义</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {history?.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted/50">
                    {typeIcons[item.type]}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {typeLabels[item.type] || item.type}
                      </Badge>
                      <Badge variant="outline">
                        {item.model}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.createdAt}
                      </span>
                    </div>
                    <p className="font-medium line-clamp-1">{item.prompt}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.response}
                    </p>
                    {item.relatedEntity && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>关联：</span>
                        <Badge variant="outline" className="text-xs">
                          {item.relatedEntity.type === "customer" ? "客户" : 
                           item.relatedEntity.type === "opportunity" ? "商机" : "联系人"}
                        </Badge>
                        <span>{item.relatedEntity.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>Tokens:</span>
                    <span className="font-medium">{item.tokensUsed}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!history?.length && (
          <Card>
            <CardContent className="p-8 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">暂无 AI 请求历史记录</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AIHistoryPage