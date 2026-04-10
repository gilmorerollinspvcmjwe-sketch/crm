"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Bell, Save, User, Lightbulb, FileText, Mail, Settings, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  notificationSettingsSchema,
  type NotificationSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ NotificationSettings Page ============

interface NotificationModule {
  id: string
  module: string
  icon: React.ReactNode
  iconBgColor: string
  description: string
}

const notificationModules: NotificationModule[] = [
  {
    id: "lead",
    module: "线索管理",
    icon: <User className="h-5 w-5" />,
    iconBgColor: "bg-blue-100 text-blue-600",
    description: "新线索创建、线索分配、线索状态变更",
  },
  {
    id: "deal",
    module: "商机管理",
    icon: <Lightbulb className="h-5 w-5" />,
    iconBgColor: "bg-amber-100 text-amber-600",
    description: "商机创建、商机阶段变更、商机成交",
  },
  {
    id: "task",
    module: "任务提醒",
    icon: <FileText className="h-5 w-5" />,
    iconBgColor: "bg-cyan-100 text-cyan-600",
    description: "任务创建、任务到期提醒、任务完成",
  },
  {
    id: "email",
    module: "邮件通知",
    icon: <Mail className="h-5 w-5" />,
    iconBgColor: "bg-red-100 text-red-600",
    description: "重要邮件接收、邮件模板变更",
  },
  {
    id: "system",
    module: "系统公告",
    icon: <Settings className="h-5 w-5" />,
    iconBgColor: "bg-purple-100 text-purple-600",
    description: "系统更新、维护公告、功能上线",
  },
]

const channelOptions = [
  { value: "email", label: "邮件" },
  { value: "in-app", label: "站内通知" },
  { value: "both", label: "全部" },
  { value: "off", label: "关闭" },
]

export function NotificationSettingsPage() {
  const { data: notifications, isLoading } = useNotificationSettings()
  const updateNotifications = useUpdateNotificationSettings()

  // 表单状态
  const [moduleSettings, setModuleSettings] = React.useState<
    Record<string, { enabled: boolean; channel: string }>
  >({
    lead: { enabled: true, channel: "email" },
    deal: { enabled: true, channel: "both" },
    task: { enabled: true, channel: "in-app" },
    email: { enabled: false, channel: "off" },
    system: { enabled: true, channel: "email" },
  })

  React.useEffect(() => {
    if (notifications?.channels) {
      // channels is for email/push/sms preferences, not moduleSettings
      // We keep moduleSettings separate
    }
  }, [notifications])

  const form = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      notifyCustomerCreated: true,
      notifyOpportunityStatusChanged: true,
      notifyContractApproval: true,
      notifyTaskReminder: true,
      notifySystemAnnouncement: true,
      notifyAIAnalysisReport: false,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (notifications) {
      form.reset({
        notifyCustomerCreated: notifications.notifyCustomerCreated,
        notifyOpportunityStatusChanged: notifications.notifyOpportunityStatusChanged,
        notifyContractApproval: notifications.notifyContractApproval,
        notifyTaskReminder: notifications.notifyTaskReminder,
        notifySystemAnnouncement: notifications.notifySystemAnnouncement,
        notifyAIAnalysisReport: notifications.notifyAIAnalysisReport,
      })
    }
  }, [notifications, form])

  const updateModuleSetting = (moduleId: string, field: "enabled" | "channel", value: boolean | string) => {
    setModuleSettings(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [field]: value },
    }))
  }

  const onSubmit = async (values: NotificationSettingsFormValues) => {
    try {
      await updateNotifications.mutateAsync({
        ...values,
        channels: {
          email: true,
          push: true,
          sms: false,
        },
      })
      console.log("Notifications updated successfully")
    } catch (error) {
      console.error("Failed to update notifications:", error)
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
        <Bell className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">通知设置</h1>
          <p className="text-muted-foreground">配置系统通知的接收方式和范围</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 模块通知配置 */}
        <Card>
          <CardHeader>
            <CardTitle>模块通知配置</CardTitle>
            <CardDescription>按模块配置通知方式：邮件、站内通知或关闭</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 表头 */}
            <div className="flex items-center p-3 bg-muted/50 rounded-lg mb-2 text-sm font-medium text-muted-foreground">
              <div className="flex-1">通知模块</div>
              <div className="w-24 text-center">启用</div>
              <div className="w-32 text-center">通知渠道</div>
            </div>

            {/* 模块列表 */}
            <div className="space-y-0">
              {notificationModules.map((module, index) => (
                <div
                  key={module.id}
                  className={cn(
                    "flex items-center p-4",
                    index < notificationModules.length - 1 && "border-b"
                  )}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        module.iconBgColor
                      )}
                    >
                      {module.icon}
                    </div>
                    <div>
                      <p className="font-medium">{module.module}</p>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="w-24 flex justify-center">
                    <Checkbox
                      checked={moduleSettings[module.id]?.enabled}
                      onCheckedChange={(checked) =>
                        updateModuleSetting(module.id, "enabled", checked as boolean)
                      }
                    />
                  </div>
                  <div className="w-32 flex justify-center">
                    <Select
                      value={moduleSettings[module.id]?.channel}
                      onValueChange={(value) => updateModuleSetting(module.id, "channel", value)}
                      disabled={!moduleSettings[module.id]?.enabled}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {channelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 快捷通知开关 */}
        <Card>
          <CardHeader>
            <CardTitle>快捷通知开关</CardTitle>
            <CardDescription>一键开启或关闭特定类型的通知</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="font-medium">客户创建通知</Label>
                  <p className="text-sm text-muted-foreground">新客户创建时收到通知</p>
                </div>
                <Checkbox
                  checked={form.watch("notifyCustomerCreated")}
                  onCheckedChange={(checked) =>
                    form.setValue("notifyCustomerCreated", checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="font-medium">商机状态变更</Label>
                  <p className="text-sm text-muted-foreground">商机状态变更时收到通知</p>
                </div>
                <Checkbox
                  checked={form.watch("notifyOpportunityStatusChanged")}
                  onCheckedChange={(checked) =>
                    form.setValue("notifyOpportunityStatusChanged", checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="font-medium">合同审批通知</Label>
                  <p className="text-sm text-muted-foreground">合同审批流程通知</p>
                </div>
                <Checkbox
                  checked={form.watch("notifyContractApproval")}
                  onCheckedChange={(checked) =>
                    form.setValue("notifyContractApproval", checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="font-medium">任务提醒</Label>
                  <p className="text-sm text-muted-foreground">任务到期前收到提醒</p>
                </div>
                <Checkbox
                  checked={form.watch("notifyTaskReminder")}
                  onCheckedChange={(checked) =>
                    form.setValue("notifyTaskReminder", checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="font-medium">系统公告</Label>
                  <p className="text-sm text-muted-foreground">系统更新和公告通知</p>
                </div>
                <Checkbox
                  checked={form.watch("notifySystemAnnouncement")}
                  onCheckedChange={(checked) =>
                    form.setValue("notifySystemAnnouncement", checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="font-medium">AI 分析报告</Label>
                  <p className="text-sm text-muted-foreground">接收 AI 生成的分析报告</p>
                </div>
                <Checkbox
                  checked={form.watch("notifyAIAnalysisReport")}
                  onCheckedChange={(checked) =>
                    form.setValue("notifyAIAnalysisReport", checked as boolean)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <div className="p-4 bg-primary/10 rounded-lg text-sm text-muted-foreground">
          <p>
            💡 提示：关闭某些通知可能会影响您对重要业务的响应速度。建议保持关键通知开启。
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // channels is separate from moduleSettings
              form.reset()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重置
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || updateNotifications.isPending}
          >
            {form.formState.isSubmitting || updateNotifications.isPending ? (
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

export default NotificationSettingsPage