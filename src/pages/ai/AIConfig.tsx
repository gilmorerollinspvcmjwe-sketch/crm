"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, BrainCircuit, Save, Settings2, Sparkles, BarChart3, MessageSquareText, Users, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  aiConfigSchema,
  type AIConfigFormValues,
} from "@/schemas/aiSchema"
import { useAIConfig, useUpdateAIConfig, useAIUsageStats } from "@/hooks/api/useAI"

// ============ AI Config Page ============

export function AIConfigPage() {
  const { data: config, isLoading } = useAIConfig()
  const { data: usageStats } = useAIUsageStats()
  const updateConfig = useUpdateAIConfig()

  const form = useForm<AIConfigFormValues>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      model: "gpt-4-turbo",
      apiKey: "",
      customEndpoint: "",
      maxTokens: 2000,
      temperature: 0.7,
      enableAISuggestions: true,
      enableAutoSummary: true,
      enableSmartReply: false,
      enableCustomerAnalysis: true,
      enableOpportunityPrediction: false,
      dailyRequestLimit: 1000,
      enableRequestLog: true,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (config) {
      form.reset({
        model: config.model as "custom" | "gpt-4" | "gpt-4-turbo" | "gpt-3.5-turbo" | "claude-3" | undefined,
        apiKey: config.apiKey || "",
        customEndpoint: config.customEndpoint || "",
        maxTokens: config.maxTokens ?? 2000,
        temperature: config.temperature ?? 0.7,
        enableAISuggestions: config.enableAISuggestions,
        enableAutoSummary: config.enableAutoSummary,
        enableSmartReply: config.enableSmartReply,
        enableCustomerAnalysis: config.enableCustomerAnalysis,
        enableOpportunityPrediction: config.enableOpportunityPrediction,
        dailyRequestLimit: config.dailyRequestLimit ?? 1000,
        enableRequestLog: config.enableRequestLog,
      })
    }
  }, [config, form])

  const onSubmit = async (values: AIConfigFormValues) => {
    try {
      await updateConfig.mutateAsync(values)
      console.log("AI config updated successfully")
    } catch (error) {
      console.error("Failed to update AI config:", error)
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
      <div className="flex items-center gap-3">
        <BrainCircuit className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI 配置</h1>
          <p className="text-muted-foreground">配置 AI 模型和功能设置</p>
        </div>
      </div>

      {/* Usage Stats */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              使用统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">总请求次数</p>
                <p className="text-2xl font-bold">{usageStats.totalRequests}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">总 Tokens</p>
                <p className="text-2xl font-bold">{usageStats.totalTokensUsed.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">平均 Tokens/请求</p>
                <p className="text-2xl font-bold">{usageStats.avgTokensPerRequest}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">剩余请求额度</p>
                <p className="text-2xl font-bold">{usageStats.remainingRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Model Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              模型配置
            </CardTitle>
            <CardDescription>选择 AI 模型和配置参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">模型选择</Label>
                <Select
                  value={form.watch("model")}
                  onValueChange={(value) => form.setValue("model", value as any)}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="custom">自定义模型</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyRequestLimit">每日请求限额</Label>
                <Input
                  id="dailyRequestLimit"
                  type="number"
                  value={form.watch("dailyRequestLimit")}
                  onChange={(e) => form.setValue("dailyRequestLimit", Number(e.target.value))}
                  placeholder="1000"
                />
              </div>
            </div>

            {form.watch("model") === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customEndpoint">自定义 API 地址</Label>
                  <Input
                    id="customEndpoint"
                    value={form.watch("customEndpoint")}
                    onChange={(e) => form.setValue("customEndpoint", e.target.value)}
                    placeholder="https://api.example.com/v1"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key（可选）</Label>
              <Input
                id="apiKey"
                type="password"
                value={form.watch("apiKey")}
                onChange={(e) => form.setValue("apiKey", e.target.value)}
                placeholder="留空使用系统默认配置"
              />
              <p className="text-xs text-muted-foreground">
                API Key 用于访问 AI 模型，留空则使用系统配置
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>最大 Tokens: {form.watch("maxTokens")}</Label>
                <Slider
                  value={[form.watch("maxTokens") ?? 2000]}
                  onValueChange={(value) => form.setValue("maxTokens", value[0] ?? 2000)}
                  min={100}
                  max={4000}
                  step={100}
                />
                <p className="text-xs text-muted-foreground">
                  控制每次请求返回的最大文本长度
                </p>
              </div>

              <div className="space-y-2">
                <Label>温度参数: {form.watch("temperature")}</Label>
                <Slider
                  value={[form.watch("temperature") ?? 0.7]}
                  onValueChange={(value) => form.setValue("temperature", value[0] ?? 0.7)}
                  min={0}
                  max={2}
                  step={0.1}
                />
                <p className="text-xs text-muted-foreground">
                  较低的值产生更确定的结果，较高的值产生更多变化
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI 功能
            </CardTitle>
            <CardDescription>启用或禁用各种 AI 辅助功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquareText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>AI 建议</Label>
                    <p className="text-sm text-muted-foreground">在操作中提供智能建议</p>
                  </div>
                </div>
                <Switch
                  checked={form.watch("enableAISuggestions")}
                  onCheckedChange={(checked) => form.setValue("enableAISuggestions", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>自动摘要</Label>
                    <p className="text-sm text-muted-foreground">自动生成内容摘要</p>
                  </div>
                </div>
                <Switch
                  checked={form.watch("enableAutoSummary")}
                  onCheckedChange={(checked) => form.setValue("enableAutoSummary", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquareText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>智能回复</Label>
                    <p className="text-sm text-muted-foreground">生成客户沟通回复建议</p>
                  </div>
                </div>
                <Switch
                  checked={form.watch("enableSmartReply")}
                  onCheckedChange={(checked) => form.setValue("enableSmartReply", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>客户分析</Label>
                    <p className="text-sm text-muted-foreground">自动分析客户特征</p>
                  </div>
                </div>
                <Switch
                  checked={form.watch("enableCustomerAnalysis")}
                  onCheckedChange={(checked) => form.setValue("enableCustomerAnalysis", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>商机预测</Label>
                    <p className="text-sm text-muted-foreground">预测商机成交概率</p>
                  </div>
                </div>
                <Switch
                  checked={form.watch("enableOpportunityPrediction")}
                  onCheckedChange={(checked) => form.setValue("enableOpportunityPrediction", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>请求日志</Label>
                    <p className="text-sm text-muted-foreground">记录所有 AI 请求</p>
                  </div>
                </div>
                <Switch
                  checked={form.watch("enableRequestLog")}
                  onCheckedChange={(checked) => form.setValue("enableRequestLog", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || updateConfig.isPending}
          >
            {form.formState.isSubmitting || updateConfig.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存配置
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AIConfigPage