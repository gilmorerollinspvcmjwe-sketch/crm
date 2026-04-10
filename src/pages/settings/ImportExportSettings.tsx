"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload, Download, Save, FileSpreadsheet, FileText, FileJson, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  importExportSettingsSchema,
  type ImportExportSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useImportExportSettings,
  useUpdateImportExportSettings,
} from "@/hooks/api/useSettings"

// ============ ImportExportSettings Page ============

export function ImportExportSettingsPage() {
  const { data: settings, isLoading } = useImportExportSettings()
  const updateSettings = useUpdateImportExportSettings()

  const form = useForm<ImportExportSettingsFormValues>({
    resolver: zodResolver(importExportSettingsSchema),
    defaultValues: {
      defaultExportFormat: "xlsx",
      includeHeaders: true,
      exportEncoding: "utf-8",
      batchSize: 1000,
      allowOverwrite: false,
      validateImport: true,
      notifyOnComplete: true,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        defaultExportFormat: settings.defaultExportFormat,
        includeHeaders: settings.includeHeaders,
        exportEncoding: settings.exportEncoding,
        batchSize: settings.batchSize,
        allowOverwrite: settings.allowOverwrite,
        validateImport: settings.validateImport,
        notifyOnComplete: settings.notifyOnComplete,
      })
    }
  }, [settings, form])

  const onSubmit = async (values: ImportExportSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("Import/Export settings updated successfully")
    } catch (error) {
      console.error("Failed to update settings:", error)
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
          <h1 className="text-2xl font-bold tracking-tight">导入导出</h1>
          <p className="text-muted-foreground">配置数据导入导出的格式和行为</p>
        </div>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4" />
            导出设置
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="mr-2 h-4 w-4" />
            导入设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                导出配置
              </CardTitle>
              <CardDescription>设置数据导出的默认格式和编码</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormSection title="导出格式">
                  <FormField
                    control={form.control}
                    name="defaultExportFormat"
                    label="默认导出格式"
                  >
                    {({ field }) => (
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "xlsx", label: "Excel", icon: FileSpreadsheet, desc: "适合数据分析" },
                          { value: "csv", label: "CSV", icon: FileText, desc: "通用数据格式" },
                          { value: "json", label: "JSON", icon: FileJson, desc: "适合程序处理" },
                        ].map((format) => (
                          <button
                            key={format.value}
                            type="button"
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                              field.value === format.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => field.onChange(format.value)}
                          >
                            <format.icon className="h-6 w-6" />
                            <span className="font-medium">{format.label}</span>
                            <span className="text-xs text-muted-foreground">{format.desc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="includeHeaders"
                      label="包含表头"
                      containerClassName="flex items-center justify-between p-4 rounded-lg border"
                    >
                      {({ field }) => (
                        <>
                          <div className="space-y-0.5">
                            <p className="text-base">包含表头行</p>
                            <p className="text-sm text-muted-foreground">导出时包含列标题行</p>
                          </div>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </>
                      )}
                    </FormField>

                    <FormField
                      control={form.control}
                      name="exportEncoding"
                      label="导出编码"
                    >
                      {({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择编码" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utf-8">UTF-8 (推荐)</SelectItem>
                            <SelectItem value="gbk">GBK (中文兼容)</SelectItem>
                            <SelectItem value="gb2312">GB2312 (老系统)</SelectItem>
                          </SelectContent>
                        </Select>
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
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                导入配置
              </CardTitle>
              <CardDescription>设置数据导入的行为和验证规则</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormSection title="导入选项">
                  <FormGrid cols={2}>
                    <FormField
                      control={form.control}
                      name="batchSize"
                      label="批量导入大小"
                    >
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min={100}
                          max={10000}
                          placeholder="100-10000"
                        />
                      )}
                    </FormField>

                    <div className="space-y-2">
                      <Label>导入说明</Label>
                      <p className="text-sm text-muted-foreground">
                        每批处理的最大记录数，过大会影响性能
                      </p>
                    </div>
                  </FormGrid>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label>允许覆盖现有数据</Label>
                        <p className="text-sm text-muted-foreground">
                          导入时允许更新已存在的记录
                        </p>
                      </div>
                      <Checkbox
                        checked={form.watch("allowOverwrite")}
                        onCheckedChange={(checked) => form.setValue("allowOverwrite", checked as boolean)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label>验证导入数据</Label>
                        <p className="text-sm text-muted-foreground">
                          导入前验证数据格式和完整性
                        </p>
                      </div>
                      <Checkbox
                        checked={form.watch("validateImport")}
                        onCheckedChange={(checked) => form.setValue("validateImport", checked as boolean)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label>完成后发送通知</Label>
                        <p className="text-sm text-muted-foreground">
                          导入完成后发送邮件通知
                        </p>
                      </div>
                      <Checkbox
                        checked={form.watch("notifyOnComplete")}
                        onCheckedChange={(checked) => form.setValue("notifyOnComplete", checked as boolean)}
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
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            最近操作记录
          </CardTitle>
          <CardDescription>查看最近的导入导出操作历史</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exports">
            <TabsList>
              <TabsTrigger value="exports">导出记录</TabsTrigger>
              <TabsTrigger value="imports">导入记录</TabsTrigger>
            </TabsList>
            <TabsContent value="exports" className="mt-4">
              <div className="space-y-2">
                {settings?.recentExports?.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Download className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.date} · {record.records} 条记录
                        </p>
                      </div>
                    </div>
                    <Badge variant={record.status === "success" ? "default" : "destructive"}>
                      {record.status === "success" ? "成功" : "失败"}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="imports" className="mt-4">
              <div className="space-y-2">
                {settings?.recentImports?.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.date} · {record.records} 条记录
                        </p>
                      </div>
                    </div>
                    <Badge variant={record.status === "success" ? "default" : "destructive"}>
                      {record.status === "success" ? "成功" : "失败"}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImportExportSettingsPage