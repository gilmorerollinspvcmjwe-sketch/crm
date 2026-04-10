"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Smartphone, Save, Bell, Wifi, WifiOff, RefreshCw, Moon, Sun, Type } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  mobileSettingsSchema,
  type MobileSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useMobileSettings,
  useUpdateMobileSettings,
} from "@/hooks/api/useSettings"

// ============ MobileSettings Page ============

export function MobileSettingsPage() {
  const { data: settings, isLoading } = useMobileSettings()
  const updateSettings = useUpdateMobileSettings()

  const form = useForm<MobileSettingsFormValues>({
    resolver: zodResolver(mobileSettingsSchema),
    defaultValues: {
      mobileEnabled: true,
      pushNotifications: true,
      offlineMode: false,
      autoSync: true,
      syncInterval: 15,
      mobileTheme: "system",
      fontSize: "medium",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        mobileEnabled: settings.mobileEnabled,
        pushNotifications: settings.pushNotifications,
        offlineMode: settings.offlineMode,
        autoSync: settings.autoSync,
        syncInterval: settings.syncInterval,
        mobileTheme: settings.mobileTheme,
        fontSize: settings.fontSize,
      })
    }
  }, [settings, form])

  const onSubmit = async (values: MobileSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("Mobile settings updated successfully")
    } catch (error) {
      console.error("Failed to update mobile settings:", error)
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
        <Smartphone className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">移动端设置</h1>
          <p className="text-muted-foreground">配置移动端应用的功能和行为</p>
        </div>
      </div>

      {/* Mobile Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            移动端状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">移动端状态</p>
              <Badge variant={settings?.mobileEnabled ? "default" : "secondary"}>
                {settings?.mobileEnabled ? "已启用" : "已禁用"}
              </Badge>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">活跃设备数</p>
              <p className="text-lg font-semibold">{settings?.activeDevices || 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">推送通知</p>
              <Badge variant={settings?.pushNotifications ? "default" : "secondary"}>
                {settings?.pushNotifications ? "已启用" : "已禁用"}
              </Badge>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">离线模式</p>
              <Badge variant={settings?.offlineMode ? "default" : "secondary"}>
                {settings?.offlineMode ? "已启用" : "已禁用"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            移动端配置
          </CardTitle>
          <CardDescription>设置移动端的基本功能和同步策略</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="基本设置">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base">启用移动端</Label>
                    <p className="text-sm text-muted-foreground">
                      允许用户通过移动端 App 访问系统
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("mobileEnabled")}
                    onCheckedChange={(checked) => form.setValue("mobileEnabled", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label>推送通知</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      向移动端发送推送通知提醒
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("pushNotifications")}
                    onCheckedChange={(checked) => form.setValue("pushNotifications", checked as boolean)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="数据同步">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <Label>离线模式</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      允许在没有网络时使用本地缓存数据
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("offlineMode")}
                    onCheckedChange={(checked) => form.setValue("offlineMode", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      <Label>自动同步</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      自动将本地数据同步到服务器
                    </p>
                  </div>
                  <Checkbox
                    checked={form.watch("autoSync")}
                    onCheckedChange={(checked) => form.setValue("autoSync", checked as boolean)}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="syncInterval"
                  label="同步频率（分钟）"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={5}
                      max={60}
                      placeholder="5-60 分钟"
                    />
                  )}
                </FormField>
              </div>
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

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            显示设置
          </CardTitle>
          <CardDescription>配置移动端的显示主题和字体大小</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="主题设置">
              <FormField
                control={form.control}
                name="mobileTheme"
                label="移动端主题"
              >
                {({ field }) => (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "light", label: "浅色", icon: Sun },
                      { value: "dark", label: "深色", icon: Moon },
                      { value: "system", label: "跟随系统", icon: Smartphone },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                          field.value === theme.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => field.onChange(theme.value)}
                      >
                        <theme.icon className="h-5 w-5" />
                        <span className="font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
            </FormSection>

            <FormSection title="字体大小">
              <FormField
                control={form.control}
                name="fontSize"
                label="字体大小"
              >
                {({ field }) => (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "small", label: "小", desc: "紧凑显示" },
                      { value: "medium", label: "中", desc: "默认大小" },
                      { value: "large", label: "大", desc: "易于阅读" },
                    ].map((size) => (
                      <button
                        key={size.value}
                        type="button"
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                          field.value === size.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => field.onChange(size.value)}
                      >
                        <Type className="h-4 w-4" />
                        <span className="font-medium">{size.label}</span>
                        <span className="text-xs text-muted-foreground">{size.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
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
                    保存显示设置
                  </>
                )}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>

      {/* Device Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            设备管理
          </CardTitle>
          <CardDescription>查看和管理已登录的移动设备</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { id: 1, name: "iPhone 14 Pro", user: "张三", lastActive: "2025-04-03 18:00", status: "active" },
              { id: 2, name: "Samsung Galaxy S23", user: "李四", lastActive: "2025-04-03 15:30", status: "active" },
              { id: 3, name: "iPad Pro", user: "王五", lastActive: "2025-04-02 10:00", status: "inactive" },
            ].map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.user} · 最后活跃: {device.lastActive}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={device.status === "active" ? "default" : "secondary"}>
                    {device.status === "active" ? "活跃" : "离线"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    注销
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MobileSettingsPage