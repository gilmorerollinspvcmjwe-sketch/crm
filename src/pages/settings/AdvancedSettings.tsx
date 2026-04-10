"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Settings, Save, Bug, Activity, AlertTriangle, Database, Clock, Upload, Zap, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  advancedSettingsSchema,
  type AdvancedSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useAdvancedSettings,
  useUpdateAdvancedSettings,
  useClearCache,
} from "@/hooks/api/useSettings"

// ============ AdvancedSettings Page ============

export function AdvancedSettingsPage() {
  const { data: settings, isLoading } = useAdvancedSettings()
  const updateSettings = useUpdateAdvancedSettings()
  const clearCache = useClearCache()

  const form = useForm<AdvancedSettingsFormValues>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues: {
      debugMode: false,
      performanceMonitoring: true,
      errorReporting: true,
      cacheStrategy: "normal",
      logLevel: "info",
      maxUploadSize: 10,
      sessionTimeout: 60,
      concurrentRequests: 20,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        debugMode: settings.debugMode,
        performanceMonitoring: settings.performanceMonitoring,
        errorReporting: settings.errorReporting,
        cacheStrategy: settings.cacheStrategy,
        logLevel: settings.logLevel,
        maxUploadSize: settings.maxUploadSize,
        sessionTimeout: settings.sessionTimeout,
        concurrentRequests: settings.concurrentRequests,
      })
    }
  }, [settings, form])

  const onSubmit = async (values: AdvancedSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("Advanced settings updated successfully")
    } catch (error) {
      console.error("Failed to update advanced settings:", error)
    }
  }

  const handleClearCache = async () => {
    try {
      const result = await clearCache.mutateAsync()
      console.log("Cache cleared:", result)
    } catch (error) {
      console.error("Failed to clear cache:", error)
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
        <Settings className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">高级设置</h1>
          <p className="text-muted-foreground">配置系统的高级功能和性能参数</p>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          高级设置可能会影响系统性能和稳定性，请谨慎修改。如有疑问，请联系技术支持。
        </AlertDescription>
      </Alert>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            性能设置
          </CardTitle>
          <CardDescription>配置系统的性能监控和缓存策略</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="监控设置">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      <Label className="text-base">调试模式</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      启用调试信息输出，用于问题排查
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("debugMode")}
                    onCheckedChange={(checked) => form.setValue("debugMode", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <Label className="text-base">性能监控</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      收集系统性能数据用于优化分析
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("performanceMonitoring")}
                    onCheckedChange={(checked) => form.setValue("performanceMonitoring", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <Label className="text-base">错误报告</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      自动发送错误报告以便快速修复问题
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("errorReporting")}
                    onCheckedChange={(checked) => form.setValue("errorReporting", checked as boolean)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="缓存策略">
              <FormField
                control={form.control}
                name="cacheStrategy"
                label="缓存策略"
              >
                {({ field }) => (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "aggressive", label: "激进", desc: "最大化缓存，最快响应" },
                      { value: "normal", label: "正常", desc: "平衡缓存和实时性" },
                      { value: "minimal", label: "最小", desc: "最小缓存，最新数据" },
                    ].map((strategy) => (
                      <button
                        key={strategy.value}
                        type="button"
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                          field.value === strategy.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => field.onChange(strategy.value)}
                      >
                        <Database className="h-5 w-5" />
                        <span className="font-medium">{strategy.label}</span>
                        <span className="text-xs text-muted-foreground">{strategy.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
            </FormSection>

            <FormSection title="日志级别">
              <FormField
                control={form.control}
                name="logLevel"
                label="日志级别"
              >
                {({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择日志级别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug - 详细调试信息</SelectItem>
                      <SelectItem value="info">Info - 一般信息</SelectItem>
                      <SelectItem value="warn">Warn - 警告信息</SelectItem>
                      <SelectItem value="error">Error - 仅错误信息</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormField>
              <p className="text-sm text-muted-foreground">
                更低的级别会产生更多日志，可能影响性能
              </p>
            </FormSection>

            <FormActions>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || updateSettings.isPending}
              >
                {form.formState.isSubmitting || updateSettings.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存设置
                  </>
                )}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>

      {/* System Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            系统限制
          </CardTitle>
          <CardDescription>设置系统的资源使用限制</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="资源限制">
              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="maxUploadSize"
                  label="最大上传大小 (MB)"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      max={100}
                      placeholder="1-100 MB"
                    />
                  )}
                </FormField>

                <div className="space-y-2">
                  <Label>说明</Label>
                  <p className="text-sm text-muted-foreground">
                    单个文件上传的最大大小限制
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="sessionTimeout"
                  label="会话超时 (分钟)"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={5}
                      max={1440}
                      placeholder="5-1440 分钟"
                    />
                  )}
                </FormField>

                <div className="space-y-2">
                  <Label>说明</Label>
                  <p className="text-sm text-muted-foreground">
                    用户无操作后自动登出的时间
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="concurrentRequests"
                  label="并发请求限制"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={5}
                      max={100}
                      placeholder="5-100"
                    />
                  )}
                </FormField>

                <div className="space-y-2">
                  <Label>说明</Label>
                  <p className="text-sm text-muted-foreground">
                    单个用户可同时进行的 API 请求数
                  </p>
                </div>
              </FormGrid>
            </FormSection>

            <FormActions>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || updateSettings.isPending}
              >
                {form.formState.isSubmitting || updateSettings.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存限制设置
                  </>
                )}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            缓存管理
          </CardTitle>
          <CardDescription>管理系统缓存数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground">数据缓存</p>
                <p className="text-lg font-semibold">128 MB</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground">页面缓存</p>
                <p className="text-lg font-semibold">64 MB</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground">API 缓存</p>
                <p className="text-lg font-semibold">32 MB</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClearCache}
                disabled={clearCache.isPending}
              >
                {clearCache.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    清除中...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    清除所有缓存
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                清除数据缓存
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                清除页面缓存
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              清除缓存后，系统可能需要重新加载数据，首次访问可能较慢
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            系统诊断
          </CardTitle>
          <CardDescription>查看系统运行的关键指标</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "内存使用", value: "45%", status: "normal" },
              { name: "CPU 使用", value: "32%", status: "normal" },
              { name: "磁盘空间", value: "78%", status: "warning" },
              { name: "网络延迟", value: "50ms", status: "normal" },
              { name: "数据库连接", value: "正常", status: "normal" },
              { name: "缓存命中率", value: "95%", status: "normal" },
            ].map((metric) => (
              <div key={metric.name} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{metric.name}</span>
                  <Badge
                    variant={metric.status === "normal" ? "default" : "destructive"}
                    className={metric.status === "normal" ? "bg-green-500" : ""}
                  >
                    {metric.status === "normal" ? "正常" : "警告"}
                  </Badge>
                </div>
                <p className="text-lg font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedSettingsPage