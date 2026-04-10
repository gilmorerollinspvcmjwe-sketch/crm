"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Key, Save, Globe, Clock, Shield, AlertCircle, Copy, RefreshCw, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  apiSettingsSchema,
  type ApiSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useApiSettings,
  useUpdateApiSettings,
  useRegenerateApiKey,
  useTestApiConnection,
} from "@/hooks/api/useSettings"

// ============ APISettings Page ============

export function APISettingsPage() {
  const { data: settings, isLoading } = useApiSettings()
  const updateSettings = useUpdateApiSettings()
  const regenerateKey = useRegenerateApiKey()
  const testConnection = useTestApiConnection()

  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const form = useForm<ApiSettingsFormValues>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      apiEnabled: true,
      apiKey: "",
      rateLimit: 1000,
      ipWhitelist: [],
      timeoutSeconds: 30,
      logApiCalls: true,
      corsEnabled: true,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        apiEnabled: settings.apiEnabled,
        apiKey: settings.apiKey || "",
        rateLimit: settings.rateLimit,
        ipWhitelist: settings.ipWhitelist,
        timeoutSeconds: settings.timeoutSeconds,
        logApiCalls: settings.logApiCalls,
        corsEnabled: settings.corsEnabled,
      })
    }
  }, [settings, form])

  const onSubmit = async (values: ApiSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("API settings updated successfully")
    } catch (error) {
      console.error("Failed to update API settings:", error)
    }
  }

  const handleCopyApiKey = () => {
    if (settings?.apiKey) {
      navigator.clipboard.writeText(settings.apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRegenerateKey = async () => {
    try {
      await regenerateKey.mutateAsync()
      console.log("API key regenerated")
    } catch (error) {
      console.error("Failed to regenerate API key:", error)
    }
  }

  const handleTestConnection = async () => {
    try {
      const result = await testConnection.mutateAsync()
      console.log("API test result:", result)
    } catch (error) {
      console.error("Failed to test API connection:", error)
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
        <Key className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API 设置</h1>
          <p className="text-muted-foreground">配置 API 访问密钥和安全策略</p>
        </div>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API 状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">状态</p>
              <Badge variant={settings?.apiEnabled ? "default" : "secondary"}>
                {settings?.apiEnabled ? "已启用" : "已禁用"}
              </Badge>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">今日调用</p>
              <p className="text-lg font-semibold">{settings?.callsToday || 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">总调用次数</p>
              <p className="text-lg font-semibold">{settings?.totalCalls || 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">最后调用</p>
              <p className="text-lg font-semibold">{settings?.lastCall || "无"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API 密钥
          </CardTitle>
          <CardDescription>管理您的 API 访问密钥</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              请妥善保管 API 密钥，不要分享给他人或在客户端代码中暴露
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>API 密钥</Label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 rounded-lg border bg-muted/30 font-mono text-sm">
                {showApiKey 
                  ? (settings?.apiKey || "无密钥")
                  : (settings?.apiKey ? `${settings.apiKey.slice(0, 12)}...${settings.apiKey.slice(-8)}` : "无密钥")
                }
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <Shield className="h-4 w-4" /> : <Key className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyApiKey}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRegenerateKey}
              disabled={regenerateKey.isPending}
            >
              {regenerateKey.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重新生成密钥
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testConnection.isPending}
            >
              {testConnection.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            API 配置
          </CardTitle>
          <CardDescription>设置 API 访问限制和安全策略</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="基本设置">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-base">启用 API</Label>
                  <p className="text-sm text-muted-foreground">允许外部程序通过 API 访问系统数据</p>
                </div>
                <Checkbox
                  checked={form.watch("apiEnabled")}
                  onCheckedChange={(checked) => form.setValue("apiEnabled", checked as boolean)}
                />
              </div>

              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="rateLimit"
                  label="请求频率限制"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={100}
                      max={100000}
                      placeholder="每小时最大请求数"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="timeoutSeconds"
                  label="超时时间（秒）"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={5}
                      max={300}
                      placeholder="API 请求超时时间"
                    />
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="安全设置">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>记录 API 日志</Label>
                    <p className="text-sm text-muted-foreground">记录所有 API 请求以便审计和分析</p>
                  </div>
                  <Checkbox
                    checked={form.watch("logApiCalls")}
                    onCheckedChange={(checked) => form.setValue("logApiCalls", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>允许跨域请求</Label>
                    <p className="text-sm text-muted-foreground">允许来自不同域名的 API 请求</p>
                  </div>
                  <Checkbox
                    checked={form.watch("corsEnabled")}
                    onCheckedChange={(checked) => form.setValue("corsEnabled", checked as boolean)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="IP 白名单">
              <FormField
                control={form.control}
                name="ipWhitelist"
                label="允许的 IP 地址"
              >
                {({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value?.join("\n") || ""}
                    onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                    placeholder="每行一个 IP 地址或 CIDR 范围，例如：&#10;192.168.1.0/24&#10;10.0.0.0/8"
                    rows={4}
                    className="font-mono"
                  />
                )}
              </FormField>
              <p className="text-sm text-muted-foreground">
                只有白名单中的 IP 地址才能访问 API，为空表示不限制
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
    </div>
  )
}

export default APISettingsPage