"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Database, Save, Clock, HardDrive, Shield, RefreshCw, Archive, Cloud, Server } from "lucide-react"

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
  dataBackupSettingsSchema,
  type DataBackupSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useDataBackupSettings,
  useUpdateDataBackupSettings,
  useCreateBackup,
  useRestoreBackup,
} from "@/hooks/api/useSettings"

// ============ DataBackupSettings Page ============

export function DataBackupSettingsPage() {
  const { data: backupSettings, isLoading } = useDataBackupSettings()
  const updateSettings = useUpdateDataBackupSettings()
  const createBackup = useCreateBackup()
  const restoreBackup = useRestoreBackup()

  const [showRestoreModal, setShowRestoreModal] = useState(false)

  const form = useForm<DataBackupSettingsFormValues>({
    resolver: zodResolver(dataBackupSettingsSchema),
    defaultValues: {
      autoBackup: false,
      backupFrequency: "daily",
      backupTime: "02:00",
      retentionDays: 30,
      storageLocation: "local",
      includeAttachments: true,
      compressBackup: true,
      encryptBackup: false,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (backupSettings) {
      form.reset({
        autoBackup: backupSettings.autoBackup,
        backupFrequency: backupSettings.backupFrequency,
        backupTime: backupSettings.backupTime,
        retentionDays: backupSettings.retentionDays,
        storageLocation: backupSettings.storageLocation,
        includeAttachments: backupSettings.includeAttachments,
        compressBackup: backupSettings.compressBackup,
        encryptBackup: backupSettings.encryptBackup,
      })
    }
  }, [backupSettings, form])

  const onSubmit = async (values: DataBackupSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("Backup settings updated successfully")
    } catch (error) {
      console.error("Failed to update backup settings:", error)
    }
  }

  const handleCreateBackup = async () => {
    try {
      const result = await createBackup.mutateAsync()
      console.log("Backup created:", result)
    } catch (error) {
      console.error("Failed to create backup:", error)
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
        <Database className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">数据备份</h1>
          <p className="text-muted-foreground">配置系统数据备份和恢复策略</p>
        </div>
      </div>

      {/* Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            备份状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">最后备份时间</p>
              <p className="text-lg font-semibold">{backupSettings?.lastBackup || "无"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">备份大小</p>
              <p className="text-lg font-semibold">{backupSettings?.backupSize || "0 MB"}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">备份频率</p>
              <p className="text-lg font-semibold">
                {backupSettings?.backupFrequency === "daily" ? "每日" : 
                 backupSettings?.backupFrequency === "weekly" ? "每周" : "每月"}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground">自动备份</p>
              <Badge variant={backupSettings?.autoBackup ? "default" : "secondary"}>
                {backupSettings?.autoBackup ? "已启用" : "已禁用"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            备份配置
          </CardTitle>
          <CardDescription>设置自动备份的时间、频率和保留策略</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="自动备份">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-base">启用自动备份</Label>
                  <p className="text-sm text-muted-foreground">系统将按照设定的频率自动执行备份</p>
                </div>
                <Checkbox
                  checked={form.watch("autoBackup")}
                  onCheckedChange={(checked) => form.setValue("autoBackup", checked as boolean)}
                />
              </div>

              <FormGrid cols={3}>
                <FormField
                  control={form.control}
                  name="backupFrequency"
                  label="备份频率"
                >
                  {({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="backupTime"
                  label="备份时间"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      placeholder="例如: 02:00"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="retentionDays"
                  label="保留天数"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min={7}
                      max={365}
                      placeholder="7-365 天"
                    />
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="存储位置">
              <FormField
                control={form.control}
                name="storageLocation"
                label="备份存储位置"
              >
                {({ field }) => (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "local", label: "本地存储", icon: Server },
                      { value: "cloud", label: "云端存储", icon: Cloud },
                      { value: "both", label: "双重备份", icon: HardDrive },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                          field.value === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <option.icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
            </FormSection>

            <FormSection title="备份选项">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>包含附件</Label>
                    <p className="text-sm text-muted-foreground">备份系统中上传的所有附件文件</p>
                  </div>
                  <Checkbox
                    checked={form.watch("includeAttachments")}
                    onCheckedChange={(checked) => form.setValue("includeAttachments", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>压缩备份</Label>
                    <p className="text-sm text-muted-foreground">压缩备份文件以节省存储空间</p>
                  </div>
                  <Checkbox
                    checked={form.watch("compressBackup")}
                    onCheckedChange={(checked) => form.setValue("compressBackup", checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>加密备份</Label>
                    <p className="text-sm text-muted-foreground">使用 AES-256 加密保护备份文件</p>
                  </div>
                  <Checkbox
                    checked={form.watch("encryptBackup")}
                    onCheckedChange={(checked) => form.setValue("encryptBackup", checked as boolean)}
                  />
                </div>
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

      {/* Manual Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            手动备份
          </CardTitle>
          <CardDescription>立即创建数据备份或从备份恢复数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={handleCreateBackup}
              disabled={createBackup.isPending}
            >
              {createBackup.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  备份中...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  立即备份
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRestoreModal(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              恢复数据
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            备份历史
          </CardTitle>
          <CardDescription>最近执行的备份记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {backupSettings?.backupHistory?.map((backup, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{backup.date}</p>
                    <p className="text-sm text-muted-foreground">大小: {backup.size}</p>
                  </div>
                </div>
                <Badge variant={backup.status === "success" ? "default" : "destructive"}>
                  {backup.status === "success" ? "成功" : "失败"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataBackupSettingsPage