"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Info, Save, Server, Database, HardDrive, Clock, Globe, Shield, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  systemInfoSettingsSchema,
  type SystemInfoSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useSystemInfoSettings,
  useUpdateSystemInfoSettings,
} from "@/hooks/api/useSettings"

// ============ SystemInfo Page ============

export function SystemInfoSettingsPage() {
  const { data: systemInfo, isLoading } = useSystemInfoSettings()
  const updateSettings = useUpdateSystemInfoSettings()

  const form = useForm<SystemInfoSettingsFormValues>({
    resolver: zodResolver(systemInfoSettingsSchema),
    defaultValues: {
      systemName: "CRM System",
      systemDescription: "",
      adminEmail: "",
      timezone: "Asia/Shanghai",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (systemInfo) {
      form.reset({
        systemName: systemInfo.systemName,
        systemDescription: systemInfo.systemDescription || "",
        adminEmail: systemInfo.adminEmail || "",
        timezone: systemInfo.timezone,
      })
    }
  }, [systemInfo, form])

  const onSubmit = async (values: SystemInfoSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("System info updated successfully")
    } catch (error) {
      console.error("Failed to update system info:", error)
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
        <Info className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">系统信息</h1>
          <p className="text-muted-foreground">查看和配置系统的基本信息</p>
        </div>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            系统概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">系统版本</p>
              <p className="text-lg font-semibold">{systemInfo?.version || "未知"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">运行环境</p>
              <Badge variant="default">{systemInfo?.environment || "production"}</Badge>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">运行时间</p>
              <p className="text-lg font-semibold">{systemInfo?.uptime || "未知"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">最后备份</p>
              <p className="text-lg font-semibold">{systemInfo?.lastBackup || "无"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            存储信息
          </CardTitle>
          <CardDescription>数据库和文件存储的使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">数据库</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">占用空间</span>
                  <span className="font-semibold">{systemInfo?.databaseSize || "0 GB"}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">文件存储</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">占用空间</span>
                  <span className="font-semibold">{systemInfo?.storageUsed || "0 GB"}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "30%" }} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            系统配置
          </CardTitle>
          <CardDescription>配置系统名称和管理员信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="基本信息">
              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="systemName"
                  label="系统名称"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="CRM 系统"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="adminEmail"
                  label="管理员邮箱"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="admin@example.com"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="systemDescription"
                  label="系统描述"
                  containerClassName="col-span-2"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="企业级客户关系管理系统"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="timezone"
                  label="系统时区"
                >
                  {({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
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
                  )}
                </FormField>
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
                    保存设置
                  </>
                )}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            技术详情
          </CardTitle>
          <CardDescription>系统运行的技术参数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">前端框架</p>
              <p className="font-medium">React 18 + Next.js</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">UI 库</p>
              <p className="font-medium">Shadcn/UI + Tailwind</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">数据库</p>
              <p className="font-medium">PostgreSQL 15</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">缓存</p>
              <p className="font-medium">Redis 7</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">API 架构</p>
              <p className="font-medium">REST + GraphQL</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">消息队列</p>
              <p className="font-medium">RabbitMQ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            健康检查
          </CardTitle>
          <CardDescription>各服务组件的运行状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "API 服务", status: "running", latency: "50ms" },
              { name: "数据库", status: "running", latency: "20ms" },
              { name: "缓存服务", status: "running", latency: "5ms" },
              { name: "文件存储", status: "running", latency: "100ms" },
              { name: "消息队列", status: "running", latency: "15ms" },
              { name: "定时任务", status: "running", latency: "N/A" },
            ].map((service) => (
              <div key={service.name} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{service.name}</span>
                  <Badge variant="default" className="bg-green-500">
                    运行中
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  响应延迟: {service.latency}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SystemInfoSettingsPage