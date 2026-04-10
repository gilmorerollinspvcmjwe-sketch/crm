"use client"

import { useState } from "react"
import { Loader2, BarChart3, TrendingUp, PieChart, LineChart, Calendar, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAIUsageStats, useAIHistory } from "@/hooks/api/useAI"

// ============ AI Analytics Page ============

export function AIAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("7days")
  const [analysisType, setAnalysisType] = useState<string>("all")
  
  const { data: usageStats, isLoading: statsLoading } = useAIUsageStats()
  const { data: history, isLoading: historyLoading } = useAIHistory(
    analysisType !== "all" ? { type: analysisType } : undefined
  )

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Calculate analytics
  const totalRequests = usageStats?.totalRequests || 0
  const totalTokens = usageStats?.totalTokensUsed || 0
  const avgTokens = usageStats?.avgTokensPerRequest || 0
  const requestsByType = usageStats?.requestsByType || {}
  const dailyRequests = usageStats?.dailyRequests || []

  // Type labels
  const typeLabels: Record<string, string> = {
    customer_analysis: "客户分析",
    opportunity_prediction: "商机预测",
    email_draft: "邮件草稿",
    summary: "内容摘要",
    custom: "自定义",
  }

  // Calculate efficiency metrics
  const successRate = 98.5 // Mock success rate
  const avgResponseTime = 1.2 // Mock response time in seconds

  // Daily trend analysis
  const maxDailyRequests = Math.max(...dailyRequests.map(d => d.count))
  const avgDailyRequests = dailyRequests.reduce((sum, d) => sum + d.count, 0) / dailyRequests.length
  const maxDailyTokens = Math.max(...dailyRequests.map(d => d.tokens))
  const avgDailyTokens = dailyRequests.reduce((sum, d) => sum + d.tokens, 0) / dailyRequests.length

  // History analysis
  const historyByType = history?.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI 分析</h1>
            <p className="text-muted-foreground">AI 使用数据深度分析与洞察</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">近 7 天</SelectItem>
              <SelectItem value="30days">近 30 天</SelectItem>
              <SelectItem value="90days">近 90 天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              成功率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">AI 请求成功率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              平均响应时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">请求平均耗时</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              最常用类型
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(requestsByType).sort((a, b) => b[1] - a[1])[0]?.[0] 
                ? typeLabels[Object.entries(requestsByType).sort((a, b) => b[1] - a[1])[0][0]]
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">请求最多的类型</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              日均请求
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDailyRequests.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">平均每日请求次数</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">使用分析</TabsTrigger>
          <TabsTrigger value="types">类型分布</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="efficiency">效率分析</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          {/* Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>使用概览</CardTitle>
              <CardDescription>AI 请求的整体使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">总请求次数</span>
                      <Badge variant="secondary">{totalRequests}</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">总 Tokens 消耗</span>
                      <Badge variant="secondary">{totalTokens.toLocaleString()}</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">平均 Tokens/请求</span>
                      <Badge variant="secondary">{avgTokens}</Badge>
                    </div>
                    <Progress value={avgTokens / 4000 * 100} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">峰值日请求</span>
                      <Badge variant="secondary">{maxDailyRequests}</Badge>
                    </div>
                    <Progress value={(maxDailyRequests / avgDailyRequests) * 50} className="h-2" />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">峰值日 Tokens</span>
                      <Badge variant="secondary">{maxDailyTokens.toLocaleString()}</Badge>
                    </div>
                    <Progress value={(maxDailyTokens / avgDailyTokens) * 50} className="h-2" />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">活跃天数</span>
                      <Badge variant="secondary">{dailyRequests.length}</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {/* Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                类型分布分析
              </CardTitle>
              <CardDescription>各类型 AI 请求的占比和详情</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(requestsByType).map(([type, count]) => {
                  const percentage = (count / totalRequests) * 100
                  const avgTokensForType = avgTokens // Simplified
                  return (
                    <div key={type} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className="w-[100px] justify-center">{typeLabels[type] || type}</Badge>
                          <span className="text-sm font-medium">{count} 次请求</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">平均 Tokens：</span>
                          <span className="font-medium ml-1">{avgTokensForType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">成功率：</span>
                          <span className="font-medium ml-1 text-green-600">98.5%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">平均耗时：</span>
                          <span className="font-medium ml-1">{avgResponseTime}s</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2 mt-4" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>日趋势分析</CardTitle>
              <CardDescription>每日请求量和 Tokens 消耗变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dailyRequests.map((day, index) => {
                  const prevDay = dailyRequests[index - 1]
                  const requestChange = prevDay ? ((day.count - prevDay.count) / prevDay.count * 100) : 0
                  const tokenChange = prevDay ? ((day.tokens - prevDay.tokens) / prevDay.tokens * 100) : 0
                  
                  return (
                    <div key={day.date} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-[120px]">
                        <span className="font-medium">{day.date}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{day.count} 次</Badge>
                          {requestChange !== 0 && (
                            <span className={`text-xs ${requestChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {requestChange > 0 ? '+' : ''}{requestChange.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{day.tokens.toLocaleString()} tokens</Badge>
                          {tokenChange !== 0 && (
                            <span className={`text-xs ${tokenChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {tokenChange > 0 ? '+' : ''}{tokenChange.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-[100px]">
                        <Progress value={(day.count / maxDailyRequests) * 100} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          {/* Efficiency Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>效率分析</CardTitle>
              <CardDescription>AI 系统运行效率评估</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">响应速度</span>
                      <Badge variant="default" className="bg-green-600">优秀</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      平均响应时间 {avgResponseTime} 秒，低于 2 秒阈值
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">成功率</span>
                      <Badge variant="default" className="bg-green-600">优秀</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      请求成功率 {successRate}%，高于 95% 阈值
                    </div>
                    <Progress value={successRate} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Token 效率</span>
                      <Badge variant="outline">良好</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      平均 {avgTokens} tokens/请求，符合预期范围
                    </div>
                    <Progress value={avgTokens / 4000 * 100} className="h-2" />
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">配额利用率</span>
                      <Badge variant="outline">中等</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      已使用 {(totalRequests / (totalRequests + (usageStats?.remainingRequests || 0)) * 100).toFixed(1)}% 配额
                    </div>
                    <Progress value={totalRequests / (totalRequests + (usageStats?.remainingRequests || 0)) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AIAnalyticsPage