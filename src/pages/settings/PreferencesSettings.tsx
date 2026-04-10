"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Settings, Save, Globe, Moon, Bell, LayoutList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  preferencesSettingsSchema,
  type PreferencesSettingsFormValues,
} from "@/schemas/settingsSchema"
import { usePreferencesSettings, useUpdatePreferencesSettings } from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ PreferencesSettings Page ============

export function PreferencesSettingsPage() {
  const { data: preferences, isLoading } = usePreferencesSettings()
  const updatePreferences = useUpdatePreferencesSettings()

  const form = useForm<PreferencesSettingsFormValues>({
    resolver: zodResolver(preferencesSettingsSchema),
    defaultValues: {
      language: "zh-CN",
      theme: "system",
      timezone: "Asia/Shanghai",
      dateFormat: "YYYY-MM-DD",
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReportEmail: true,
      listDensity: "default",
      defaultPageSize: 20,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (preferences) {
      form.reset({
        language: preferences.language,
        theme: preferences.theme,
        timezone: preferences.timezone,
        dateFormat: preferences.dateFormat,
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
        smsNotifications: preferences.smsNotifications,
        weeklyReportEmail: preferences.weeklyReportEmail,
        listDensity: preferences.listDensity,
        defaultPageSize: preferences.defaultPageSize,
      })
    }
  }, [preferences, form])

  const onSubmit = async (values: PreferencesSettingsFormValues) => {
    try {
      await updatePreferences.mutateAsync(values)
      console.log("Preferences updated successfully")
    } catch (error) {
      console.error("Failed to update preferences:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const watchTheme = form.watch("theme")
  const watchListDensity = form.watch("listDensity")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">偏好设置</h1>
          <p className="text-muted-foreground">自定义您的系统偏好和显示设置</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              区域设置
            </CardTitle>
            <CardDescription>设置语言、时区和日期格式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">语言</Label>
                <Select
                  value={form.watch("language")}
                  onValueChange={(value) => form.setValue("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="ja-JP">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">时区</Label>
                <Select
                  value={form.watch("timezone")}
                  onValueChange={(value) => form.setValue("timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="选择时区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                    <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                    <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                    <SelectItem value="America/Los_Angeles">美国太平洋时间 (UTC-8)</SelectItem>
                    <SelectItem value="Europe/London">英国时间 (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">日期格式</Label>
                <Select
                  value={form.watch("dateFormat")}
                  onValueChange={(value) => form.setValue("dateFormat", value)}
                >
                  <SelectTrigger id="dateFormat">
                    <SelectValue placeholder="选择日期格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">2025-04-03</SelectItem>
                    <SelectItem value="MM/DD/YYYY">04/03/2025</SelectItem>
                    <SelectItem value="DD/MM/YYYY">03/04/2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              主题设置
            </CardTitle>
            <CardDescription>选择系统的显示主题</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "light", label: "浅色", icon: "☀️" },
                { value: "dark", label: "深色", icon: "🌙" },
                { value: "system", label: "跟随系统", icon: "💻" },
              ].map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                    watchTheme === theme.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => form.setValue("theme", theme.value)}
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知设置
            </CardTitle>
            <CardDescription>配置系统通知的接收方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>邮件通知</Label>
                  <p className="text-sm text-muted-foreground">接收重要事件的邮件通知</p>
                </div>
                <Checkbox
                  checked={form.watch("emailNotifications")}
                  onCheckedChange={(checked) => form.setValue("emailNotifications", checked as boolean)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>推送通知</Label>
                  <p className="text-sm text-muted-foreground">接收浏览器的推送通知</p>
                </div>
                <Checkbox
                  checked={form.watch("pushNotifications")}
                  onCheckedChange={(checked) => form.setValue("pushNotifications", checked as boolean)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>短信通知</Label>
                  <p className="text-sm text-muted-foreground">接收重要事件的短信通知</p>
                </div>
                <Checkbox
                  checked={form.watch("smsNotifications")}
                  onCheckedChange={(checked) => form.setValue("smsNotifications", checked as boolean)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>每周报告邮件</Label>
                  <p className="text-sm text-muted-foreground">每周收到业务数据汇总报告</p>
                </div>
                <Checkbox
                  checked={form.watch("weeklyReportEmail")}
                  onCheckedChange={(checked) => form.setValue("weeklyReportEmail", checked as boolean)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutList className="h-5 w-5" />
              显示设置
            </CardTitle>
            <CardDescription>配置列表和表格的默认显示方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>列表密度</Label>
                <Select
                  value={form.watch("listDensity")}
                  onValueChange={(value) => form.setValue("listDensity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择密度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">紧凑</SelectItem>
                    <SelectItem value="default">默认</SelectItem>
                    <SelectItem value="comfortable">宽松</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>默认每页条数</Label>
                <Select
                  value={String(form.watch("defaultPageSize"))}
                  onValueChange={(value) => form.setValue("defaultPageSize", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择条数" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 条</SelectItem>
                    <SelectItem value="20">20 条</SelectItem>
                    <SelectItem value="50">50 条</SelectItem>
                    <SelectItem value="100">100 条</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || updatePreferences.isPending}
          >
            {form.formState.isSubmitting || updatePreferences.isPending ? (
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

export default PreferencesSettingsPage