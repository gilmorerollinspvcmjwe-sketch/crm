"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plug, Save, MessageCircle, MessageSquare, Zap, CheckCircle, XCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  FormGrid,
  FormField,
} from "@/components/form"
import {
  integrationSettingsSchema,
  type IntegrationSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useIntegrationSettings,
  useUpdateIntegrationSettings,
  useTestIntegration,
} from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ IntegrationSettings Page ============

interface IntegrationCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  iconBgColor: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children: React.ReactNode
  status?: 'connected' | 'disconnected' | 'error'
  onTest?: () => void
  isTesting?: boolean
  testResult?: { success: boolean; message: string }
}

function IntegrationCard({
  id,
  title,
  description,
  icon,
  iconBgColor,
  enabled,
  onToggle,
  children,
  status,
  onTest,
  isTesting,
  testResult,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <Badge variant={status === 'connected' ? 'default' : 'secondary'}>
                {status === 'connected' ? '已连接' : status === 'error' ? '连接错误' : '未连接'}
              </Badge>
            )}
            <Checkbox
              checked={enabled}
              onCheckedChange={(checked) => onToggle(checked as boolean)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled && children}
        
        {enabled && onTest && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onTest}
              disabled={isTesting}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>
            
            {testResult && (
              <div className="flex items-center gap-2 text-sm">
                {testResult.success ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">{testResult.message}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">{testResult.message}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function IntegrationSettingsPage() {
  const { data: integration, isLoading } = useIntegrationSettings()
  const updateIntegration = useUpdateIntegrationSettings()
  const testIntegration = useTestIntegration()

  const [testResults, setTestResults] = React.useState<Record<string, { success: boolean; message: string }>>({})

  const form = useForm<IntegrationSettingsFormValues>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: {
      wechatEnabled: false,
      wechatAppId: "",
      wechatAppSecret: "",
      dingtalkEnabled: false,
      dingtalkAppKey: "",
      dingtalkAppSecret: "",
      slackEnabled: false,
      slackWebhookUrl: "",
      zapierEnabled: false,
      zapierApiKey: "",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (integration) {
      form.reset({
        wechatEnabled: integration.wechatEnabled,
        wechatAppId: integration.wechatAppId || "",
        wechatAppSecret: integration.wechatAppSecret || "",
        dingtalkEnabled: integration.dingtalkEnabled,
        dingtalkAppKey: integration.dingtalkAppKey || "",
        dingtalkAppSecret: integration.dingtalkAppSecret || "",
        slackEnabled: integration.slackEnabled,
        slackWebhookUrl: integration.slackWebhookUrl || "",
        zapierEnabled: integration.zapierEnabled,
        zapierApiKey: integration.zapierApiKey || "",
      })
    }
  }, [integration, form])

  const onSubmit = async (values: IntegrationSettingsFormValues) => {
    try {
      await updateIntegration.mutateAsync(values)
      console.log("Integration settings updated successfully")
    } catch (error) {
      console.error("Failed to update integration settings:", error)
    }
  }

  const handleTestIntegration = async (type: string) => {
    try {
      const result = await testIntegration.mutateAsync(type)
      setTestResults(prev => ({ ...prev, [type]: result }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [type]: { success: false, message: '连接测试失败' }
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const watchWechatEnabled = form.watch("wechatEnabled")
  const watchDingtalkEnabled = form.watch("dingtalkEnabled")
  const watchSlackEnabled = form.watch("slackEnabled")
  const watchZapierEnabled = form.watch("zapierEnabled")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Plug className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">集成设置</h1>
          <p className="text-muted-foreground">配置第三方应用和服务的集成连接</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 微信集成 */}
        <IntegrationCard
          id="wechat"
          title="微信企业号"
          description="连接微信企业号，实现消息推送和客户互动"
          icon={<MessageCircle className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
          enabled={watchWechatEnabled ?? false}
          onToggle={(enabled) => form.setValue("wechatEnabled", enabled)}
          status={watchWechatEnabled && testResults.wechat?.success ? 'connected' : 'disconnected'}
          onTest={() => handleTestIntegration('wechat')}
          isTesting={testIntegration.isPending}
          testResult={testResults.wechat}
        >
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="wechatAppId"
              label="App ID"
              required
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入微信企业号 App ID"
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="wechatAppSecret"
              label="App Secret"
              required
            >
              {({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="请输入微信企业号 App Secret"
                />
              )}
            </FormField>
          </FormGrid>
        </IntegrationCard>

        {/* 钉钉集成 */}
        <IntegrationCard
          id="dingtalk"
          title="钉钉"
          description="连接钉钉，实现工作通知和审批流程同步"
          icon={<MessageCircle className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          enabled={watchDingtalkEnabled ?? false}
          onToggle={(enabled) => form.setValue("dingtalkEnabled", enabled)}
          status={watchDingtalkEnabled && testResults.dingtalk?.success ? 'connected' : 'disconnected'}
          onTest={() => handleTestIntegration('dingtalk')}
          isTesting={testIntegration.isPending}
          testResult={testResults.dingtalk}
        >
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="dingtalkAppKey"
              label="App Key"
              required
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入钉钉 App Key"
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="dingtalkAppSecret"
              label="App Secret"
              required
            >
              {({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="请输入钉钉 App Secret"
                />
              )}
            </FormField>
          </FormGrid>
        </IntegrationCard>

        {/* Slack 集成 */}
        <IntegrationCard
          id="slack"
          title="Slack"
          description="连接 Slack，实现团队协作和消息同步"
          icon={<MessageSquare className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
          enabled={watchSlackEnabled ?? false}
          onToggle={(enabled) => form.setValue("slackEnabled", enabled)}
          status={watchSlackEnabled && testResults.slack?.success ? 'connected' : 'disconnected'}
          onTest={() => handleTestIntegration('slack')}
          isTesting={testIntegration.isPending}
          testResult={testResults.slack}
        >
          <FormField
            control={form.control}
            name="slackWebhookUrl"
            label="Webhook URL"
            required
            containerClassName="w-full"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="https://hooks.slack.com/services/..."
              />
            )}
          </FormField>
        </IntegrationCard>

        {/* Zapier 集成 */}
        <IntegrationCard
          id="zapier"
          title="Zapier"
          description="连接 Zapier，实现自动化工作流集成"
          icon={<Zap className="h-6 w-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
          enabled={watchZapierEnabled ?? false}
          onToggle={(enabled) => form.setValue("zapierEnabled", enabled)}
          status={watchZapierEnabled && testResults.zapier?.success ? 'connected' : 'disconnected'}
          onTest={() => handleTestIntegration('zapier')}
          isTesting={testIntegration.isPending}
          testResult={testResults.zapier}
        >
          <FormField
            control={form.control}
            name="zapierApiKey"
            label="API Key"
            required
            containerClassName="w-full"
          >
            {({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="请输入 Zapier API Key"
              />
            )}
          </FormField>
        </IntegrationCard>

        {/* 更多集成 */}
        <Card>
          <CardHeader>
            <CardTitle>更多集成</CardTitle>
            <CardDescription>即将支持更多第三方服务集成</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: "飞书", icon: "📚", status: "即将推出" },
                { name: "企业微信", icon: "💬", status: "即将推出" },
                { name: "Jira", icon: "📋", status: "即将推出" },
                { name: "Notion", icon: "📝", status: "即将推出" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (integration) {
                form.reset({
                  wechatEnabled: integration.wechatEnabled,
                  wechatAppId: integration.wechatAppId || "",
                  wechatAppSecret: "",
                  dingtalkEnabled: integration.dingtalkEnabled,
                  dingtalkAppKey: integration.dingtalkAppKey || "",
                  dingtalkAppSecret: "",
                  slackEnabled: integration.slackEnabled,
                  slackWebhookUrl: integration.slackWebhookUrl || "",
                  zapierEnabled: integration.zapierEnabled,
                  zapierApiKey: "",
                })
              }
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重置
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || updateIntegration.isPending}
          >
            {form.formState.isSubmitting || updateIntegration.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存更改
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default IntegrationSettingsPage