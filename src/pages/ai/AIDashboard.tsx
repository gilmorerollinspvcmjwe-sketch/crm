"use client"

import { useState } from "react"
import { Loader2, LayoutDashboard, TrendingUp, Users, BarChart3, MessageSquare, BrainCircuit, Clock, Zap, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAIUsageStats, useAIHistory } from "@/hooks/api/useAI"

// ============ AI Dashboard Page ============

export function AIDashboardPage() {
  const { data: usageStats, isLoading: statsLoading } = useAIUsageStats()
  const { data: history, isLoading: historyLoading } = useAIHistory()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Calculate metrics
  const totalRequests = usageStats?.totalRequests || 0
  const totalTokens = usageStats?.totalTokensUsed || 0
  const avgTokens = usageStats?.avgTokensPerRequest || 0
  const remainingRequests = usageStats?.remainingRequests || 0
  const dailyRequests = usageStats?.dailyRequests || []

  // Requests by type
  const requestsByType = usageStats?.requestsByType || {}
  const typeLabels: Record<string, string> = {
    customer_analysis: "客户分析",
    opportunity_prediction: "商机预测",
    email_draft: "邮件草稿",
    summary: "内容摘要",
  }

  // Recent activity
  const recentHistory = history?.slice(0, 5) || []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI 仪表盘</h1>
            <p className="text-muted-foreground">AI 系统概览与实时监控</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新数据
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              总请求次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">累计 AI 请求</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              总 Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">累计消耗 Tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              平均 Tokens/请求
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTokens}</div>
            <p className="text-xs text-muted-foreground mt-1">单次平均消耗</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              剩余请求额度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{remainingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">今日剩余额度</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="types">请求类型</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="recent">最近活动</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Usage Progress */}
          <Card>
            <CardHeader>
              <CardTitle>今日使用进度</CardTitle>
              <CardDescription>请求额度使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">已使用</span>
                  <span className="text-sm font-medium">{totalRequests} / {totalRequests + remainingRequests}</span>
                </div>
                <Progress 
                  value={(totalRequests / (totalRequests + remainingRequests)) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  今日已使用 {((totalRequests / (totalRequests + remainingRequests)) * 100).toFixed(1)}% 的请求额度
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  客户分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{requestsByType.customer_analysis || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">客户分析请求次数</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  商机预测
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{requestsByType.opportunity_prediction || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">商机预测请求次数</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>请求类型分布</CardTitle>
              <CardDescription>各类型 AI 请求占比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(requestsByType).map(([type, count]) => {
                  const percentage = (count / totalRequests) * 100
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{typeLabels[type] || type}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7 天请求趋势</CardTitle>
              <CardDescription>最近 7 天的请求量和 Tokens 消耗</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyRequests.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{day.date}</p>
                      <p className="text-xs text-muted-foreground">{day.tokens.toLocaleString()} tokens</p>
                    </div>
                    <Badge variant="secondary">{day.count} 次请求</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                最近活动
              </CardTitle>
              <CardDescription>最近 5 条 AI 请求记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHistory.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <BrainCircuit className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {item.type === "customer_analysis" ? "客户分析" : 
                           item.type === "opportunity_prediction" ? "商机预测" : 
                           item.type === "email_draft" ? "邮件草稿" : 
                           item.type === "summary" ? "内容摘要" : "自定义"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                      </div>
                      <p className="text-sm line-clamp-1">{item.prompt}</p>
                    </div>
                    <Badge variant="secondary">{item.tokensUsed} tokens</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AIDashboardPage