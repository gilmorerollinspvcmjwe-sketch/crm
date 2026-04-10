"use client"

import { useState } from "react"
import { Loader2, BarChart3, Calendar, Download, TrendingUp, TrendingDown, Zap, Clock, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAIUsageStats } from "@/hooks/api/useAI"

// ============ AI Usage Page ============

export function AIUsagePage() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("7days")
  const { data: usageStats, isLoading, refetch } = useAIUsageStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Extract data
  const totalRequests = usageStats?.totalRequests || 0
  const totalTokens = usageStats?.totalTokensUsed || 0
  const avgTokens = usageStats?.avgTokensPerRequest || 0
  const remainingRequests = usageStats?.remainingRequests || 0
  const requestsByType = usageStats?.requestsByType || {}
  const dailyRequests = usageStats?.dailyRequests || []

  // Calculate derived metrics
  const usageRate = (totalRequests / (totalRequests + remainingRequests)) * 100
  const maxDailyRequests = Math.max(...dailyRequests.map(d => d.count), 0)
  const avgDailyRequests = dailyRequests.length > 0 
    ? dailyRequests.reduce((sum, d) => sum + d.count, 0) / dailyRequests.length 
    : 0
  const avgDailyTokens = dailyRequests.length > 0
    ? dailyRequests.reduce((sum, d) => sum + d.tokens, 0) / dailyRequests.length
    : 0

  // Type labels
  const typeLabels: Record<string, string> = {
    customer_analysis: "客户分析",
    opportunity_prediction: "商机预测",
    email_draft: "邮件草稿",
    summary: "内容摘要",
    custom: "自定义",
  }

  // Cost estimation (mock rate: $0.01 per 1000 tokens)
  const estimatedCost = (totalTokens / 1000) * 0.01

  // Trend calculation
  const lastTwoDays = dailyRequests.slice(-2)
  const requestTrend = lastTwoDays.length === 2 
    ? ((lastTwoDays[1].count - lastTwoDays[0].count) / lastTwoDays[0].count) * 100 
    : 0
  const tokenTrend = lastTwoDays.length === 2 
    ? ((lastTwoDays[1].tokens - lastTwoDays[0].tokens) / lastTwoDays[0].tokens) * 100 
    : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">用量统计</h1>
            <p className="text-muted-foreground">AI 资源使用情况与配额管理</p>
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
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              总请求次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{totalRequests}</div>
              {requestTrend !== 0 && (
                <Badge variant={requestTrend > 0 ? "default" : "secondary"} 
                       className={requestTrend > 0 ? "bg-green-500" : "bg-red-500"}>
                  {requestTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(requestTrend).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">累计 AI 请求</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              总 Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
              {tokenTrend !== 0 && (
                <Badge variant={tokenTrend > 0 ? "default" : "secondary"}
                       className={tokenTrend > 0 ? "bg-green-500" : "bg-red-500"}>
                  {tokenTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(tokenTrend).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">累计消耗 Tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              剩余配额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{remainingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">今日剩余请求额度</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              预估费用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">基于使用量估算</p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            配额使用进度
            {usageRate > 80 && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                配额即将耗尽
              </Badge>
            )}
            {usageRate <= 80 && usageRate > 50 && (
              <Badge variant="secondary" className="ml-2 bg-yellow-500">
                使用量偏高
              </Badge>
            )}
            {usageRate <= 50 && (
              <Badge variant="secondary" className="ml-2 bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                配额充足
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            已使用 {usageRate.toFixed(1)}% 的每日请求配额
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{totalRequests}</span>
                <span className="text-sm text-muted-foreground">已使用</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{totalRequests + remainingRequests}</span>
                <span className="text-sm text-muted-foreground">总配额</span>
              </div>
            </div>
            <Progress value={usageRate} className={`h-3 ${usageRate > 80 ? '[&>div]:bg-red-500' : usageRate > 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>剩余 {remainingRequests} 次请求</span>
              <span>预计可用至 {new Date(Date.now() + (remainingRequests / avgDailyRequests) * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">每日用量</TabsTrigger>
          <TabsTrigger value="types">类型分布</TabsTrigger>
          <TabsTrigger value="metrics">详细指标</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>每日用量明细</CardTitle>
              <CardDescription>最近 7 天的请求量和 Tokens 消耗</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dailyRequests.map((day, index) => {
                  const prevDay = dailyRequests[index - 1]
                  const requestChange = prevDay 
                    ? ((day.count - prevDay.count) / prevDay.count * 100) 
                    : 0
                  const tokenChange = prevDay 
                    ? ((day.tokens - prevDay.tokens) / prevDay.tokens * 100) 
                    : 0

                  return (
                    <div key={day.date} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-[100px] font-medium">{day.date}</div>
                      <div className="flex-1 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{day.count} 次</Badge>
                          {requestChange !== 0 && (
                            <span className={`text-xs ${requestChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {requestChange > 0 ? '↑' : '↓'} {Math.abs(requestChange).toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{day.tokens.toLocaleString()} tokens</Badge>
                          {tokenChange !== 0 && (
                            <span className={`text-xs ${tokenChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {tokenChange > 0 ? '↑' : '↓'} {Math.abs(tokenChange).toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {(day.tokens / day.count).toFixed(0)} avg
                        </Badge>
                      </div>
                      <div className="w-[80px]">
                        <Progress value={(day.count / maxDailyRequests) * 100} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>请求类型分布</CardTitle>
              <CardDescription>各类型 AI 请求的用量占比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(requestsByType).map(([type, count]) => {
                  const percentage = (count / totalRequests) * 100
                  const estimatedTypeCost = (count * avgTokens / 1000) * 0.01

                  return (
                    <div key={type} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className="w-[100px] justify-center">{typeLabels[type] || type}</Badge>
                          <span className="font-medium">{count} 次请求</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                          <span className="text-sm font-medium">${estimatedTypeCost.toFixed(2)}</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">预估 Tokens：</span>
                          <span className="font-medium ml-1">{(count * avgTokens).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">占比：</span>
                          <span className="font-medium ml-1">{percentage.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">费用：</span>
                          <span className="font-medium ml-1">${estimatedTypeCost.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">总请求类型</span>
                    <Badge variant="outline">{Object.keys(requestsByType).length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    当前活跃 {Object.keys(requestsByType).length} 种 AI 功能类型
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">最常用类型</span>
                    <Badge variant="default">
                      {typeLabels[Object.entries(requestsByType).sort((a, b) => b[1] - a[1])[0]?.[0] || '-']}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    占总请求 {(Object.entries(requestsByType).sort((a, b) => b[1] - a[1])[0]?.[1] / totalRequests * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>详细用量指标</CardTitle>
              <CardDescription>全面的用量统计数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">平均每请求 Tokens</div>
                    <div className="text-xl font-bold">{avgTokens}</div>
                    <Progress value={(avgTokens / 4000) * 100} className="h-2 mt-2" />
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">日均请求量</div>
                    <div className="text-xl font-bold">{avgDailyRequests.toFixed(1)}</div>
                    <Progress value={(avgDailyRequests / maxDailyRequests) * 100} className="h-2 mt-2" />
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">峰值日请求</div>
                    <div className="text-xl font-bold">{maxDailyRequests}</div>
                    <Progress value={100} className="h-2 mt-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">日均 Tokens 消耗</div>
                    <div className="text-xl font-bold">{avgDailyTokens?.toLocaleString() || '-'}</div>
                    <Progress value={100} className="h-2 mt-2" />
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">配额剩余比例</div>
                    <div className="text-xl font-bold text-green-600">
                      {(remainingRequests / (totalRequests + remainingRequests) * 100).toFixed(1)}%
                    </div>
                    <Progress value={remainingRequests / (totalRequests + remainingRequests) * 100} className="h-2 mt-2 [&>div]:bg-green-500" />
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">预估总费用</div>
                    <div className="text-xl font-bold">${estimatedCost.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">基于 $0.01/1000 tokens 计算</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Summary */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">用量统计摘要</span>
                  <Badge variant="outline">最近 7 天</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">总请求：</span>
                    <span className="font-medium ml-1">{totalRequests}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">总 Tokens：</span>
                    <span className="font-medium ml-1">{totalTokens.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">平均/请求：</span>
                    <span className="font-medium ml-1">{avgTokens}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">剩余配额：</span>
                    <span className="font-medium ml-1 text-green-600">{remainingRequests}</span>
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

export default AIUsagePage