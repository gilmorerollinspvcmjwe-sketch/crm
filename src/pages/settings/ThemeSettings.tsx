"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Palette, Save, RefreshCw, Sparkles, Square, Type, Layers, Move } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  themeSettingsSchema,
  type ThemeSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useThemeSettings,
  useUpdateThemeSettings,
} from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ ThemeSettings Page ============

const borderRadiusOptions = [
  { value: "none", label: "无圆角", preview: "rounded-none" },
  { value: "small", label: "小圆角", preview: "rounded-sm" },
  { value: "medium", label: "中等圆角", preview: "rounded-md" },
  { value: "large", label: "大圆角", preview: "rounded-lg" },
]

const fontSizeOptions = [
  { value: "small", label: "小号", description: "14px 基准" },
  { value: "medium", label: "标准", description: "16px 基准" },
  { value: "large", label: "大号", description: "18px 基准" },
]

const fontFamilyOptions = [
  { value: "system", label: "系统字体", preview: "font-sans" },
  { value: "inter", label: "Inter", preview: "font-['Inter']" },
  { value: "roboto", label: "Roboto", preview: "font-['Roboto']" },
  { value: "noto-sans-sc", label: "思源黑体", preview: "font-['Noto_Sans_SC']" },
]

const shadowOptions = [
  { value: "none", label: "无阴影", description: "扁平风格" },
  { value: "subtle", label: "轻微阴影", description: "现代简约" },
  { value: "medium", label: "中等阴影", description: "适中深度" },
  { value: "strong", label: "强烈阴影", description: "立体感强" },
]

const presetThemes = [
  {
    name: "默认蓝",
    primaryColor: "#3b82f6",
    accentColor: "#8b5cf6",
    successColor: "#22c55e",
    warningColor: "#f59e0b",
    dangerColor: "#ef4444",
  },
  {
    name: "科技紫",
    primaryColor: "#7c3aed",
    accentColor: "#2563eb",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dangerColor: "#ef4444",
  },
  {
    name: "商业绿",
    primaryColor: "#059669",
    accentColor: "#0891b2",
    successColor: "#22c55e",
    warningColor: "#f59e0b",
    dangerColor: "#ef4444",
  },
  {
    name: "热情红",
    primaryColor: "#dc2626",
    accentColor: "#f59e0b",
    successColor: "#22c55e",
    warningColor: "#f59e0b",
    dangerColor: "#b91c1c",
  },
]

export function ThemeSettingsPage() {
  const { data: theme, isLoading } = useThemeSettings()
  const updateTheme = useUpdateThemeSettings()

  const form = useForm<ThemeSettingsFormValues>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      accentColor: "#8b5cf6",
      successColor: "#22c55e",
      warningColor: "#f59e0b",
      dangerColor: "#ef4444",
      borderRadius: "medium",
      fontSizeBase: "medium",
      fontFamily: "system",
      shadowLevel: "subtle",
      animationEnabled: true,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (theme) {
      form.reset({
        primaryColor: theme.primaryColor,
        accentColor: theme.accentColor,
        successColor: theme.successColor,
        warningColor: theme.warningColor,
        dangerColor: theme.dangerColor,
        borderRadius: theme.borderRadius,
        fontSizeBase: theme.fontSizeBase,
        fontFamily: theme.fontFamily,
        shadowLevel: theme.shadowLevel,
        animationEnabled: theme.animationEnabled,
      })
    }
  }, [theme, form])

  const onSubmit = async (values: ThemeSettingsFormValues) => {
    try {
      await updateTheme.mutateAsync(values)
      console.log("Theme settings updated successfully")
    } catch (error) {
      console.error("Failed to update theme settings:", error)
    }
  }

  const applyPreset = (preset: typeof presetThemes[0]) => {
    form.setValue("primaryColor", preset.primaryColor)
    form.setValue("accentColor", preset.accentColor)
    form.setValue("successColor", preset.successColor)
    form.setValue("warningColor", preset.warningColor)
    form.setValue("dangerColor", preset.dangerColor)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const watchBorderRadius = form.watch("borderRadius")
  const watchFontSize = form.watch("fontSizeBase")
  const watchFontFamily = form.watch("fontFamily")
  const watchShadowLevel = form.watch("shadowLevel")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">主题设置</h1>
          <p className="text-muted-foreground">自定义系统的颜色、字体和视觉效果</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 预设主题 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              预设主题
            </CardTitle>
            <CardDescription>选择一个预设主题快速应用配色方案</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border transition-colors",
                    form.watch("primaryColor") === preset.primaryColor
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex gap-1">
                    {[preset.primaryColor, preset.accentColor, preset.successColor, preset.warningColor].map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 颜色设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              颜色设置
            </CardTitle>
            <CardDescription>自定义系统各部分的主题颜色</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* 主色调 */}
              <div className="space-y-4">
                <Label className="font-medium">主色调</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={form.watch("primaryColor")}
                    onChange={(e) => form.setValue("primaryColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.watch("primaryColor")}
                    onChange={(e) => form.setValue("primaryColor", e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">用于按钮、链接、高亮等主要元素</p>
              </div>

              {/* 强调色 */}
              <div className="space-y-4">
                <Label className="font-medium">强调色</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={form.watch("accentColor")}
                    onChange={(e) => form.setValue("accentColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.watch("accentColor")}
                    onChange={(e) => form.setValue("accentColor", e.target.value)}
                    placeholder="#8b5cf6"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">用于特殊强调和次要交互元素</p>
              </div>

              {/* 成功色 */}
              <div className="space-y-4">
                <Label className="font-medium">成功色</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={form.watch("successColor")}
                    onChange={(e) => form.setValue("successColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.watch("successColor")}
                    onChange={(e) => form.setValue("successColor", e.target.value)}
                    placeholder="#22c55e"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">用于成功状态和正向反馈</p>
              </div>

              {/* 警告色 */}
              <div className="space-y-4">
                <Label className="font-medium">警告色</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={form.watch("warningColor")}
                    onChange={(e) => form.setValue("warningColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.watch("warningColor")}
                    onChange={(e) => form.setValue("warningColor", e.target.value)}
                    placeholder="#f59e0b"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">用于警告提示和需要注意的状态</p>
              </div>

              {/* 错误色 */}
              <div className="space-y-4">
                <Label className="font-medium">错误色</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={form.watch("dangerColor")}
                    onChange={(e) => form.setValue("dangerColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.watch("dangerColor")}
                    onChange={(e) => form.setValue("dangerColor", e.target.value)}
                    placeholder="#ef4444"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">用于错误状态和危险操作</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 样式设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              样式设置
            </CardTitle>
            <CardDescription>调整界面元素的视觉效果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 圆角大小 */}
            <div className="space-y-4">
              <Label className="font-medium flex items-center gap-2">
                <Square className="h-4 w-4" />
                圆角大小
              </Label>
              <div className="grid grid-cols-4 gap-4">
                {borderRadiusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchBorderRadius === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("borderRadius", option.value as "none" | "small" | "medium" | "large")}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 bg-muted",
                        option.value === "none" && "rounded-none",
                        option.value === "small" && "rounded-sm",
                        option.value === "medium" && "rounded-md",
                        option.value === "large" && "rounded-lg"
                      )}
                    />
                    <span className="font-medium text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 阴影级别 */}
            <div className="space-y-4">
              <Label className="font-medium flex items-center gap-2">
                <Layers className="h-4 w-4" />
                阴影级别
              </Label>
              <div className="grid grid-cols-4 gap-4">
                {shadowOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchShadowLevel === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("shadowLevel", option.value as "none" | "strong" | "medium" | "subtle")}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 bg-white rounded-lg",
                        option.value === "none" && "shadow-none",
                        option.value === "subtle" && "shadow-sm",
                        option.value === "medium" && "shadow-md",
                        option.value === "strong" && "shadow-lg"
                      )}
                    />
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 动画效果 */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <Move className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="font-medium">启用动画效果</Label>
                  <p className="text-sm text-muted-foreground">界面切换和交互动画</p>
                </div>
              </div>
              <Checkbox
                checked={form.watch("animationEnabled")}
                onCheckedChange={(checked) =>
                  form.setValue("animationEnabled", checked as boolean)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 字体设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              字体设置
            </CardTitle>
            <CardDescription>配置系统的字体和大小</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 字体大小 */}
            <div className="space-y-4">
              <Label className="font-medium">字体大小基准</Label>
              <div className="grid grid-cols-3 gap-4">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchFontSize === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("fontSizeBase", option.value as "small" | "medium" | "large")}
                  >
                    <span
                      className={cn(
                        option.value === "small" && "text-sm",
                        option.value === "medium" && "text-base",
                        option.value === "large" && "text-lg"
                      )}
                    >
                      示例文本
                    </span>
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 字体族 */}
            <div className="space-y-4">
              <Label className="font-medium">字体族</Label>
              <Select
                value={watchFontFamily}
                onValueChange={(value) => form.setValue("fontFamily", value as "system" | "inter" | "roboto" | "noto-sans-sc")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择字体" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                选择 "系统字体" 将使用设备默认字体，确保最佳兼容性
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 主题预览 */}
        <Card>
          <CardHeader>
            <CardTitle>主题预览</CardTitle>
            <CardDescription>查看当前主题的效果示例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  style={{ backgroundColor: form.watch("primaryColor") }}
                >
                  主色调按钮
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  style={{ borderColor: form.watch("accentColor"), color: form.watch("accentColor") }}
                >
                  强调色按钮
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: form.watch("successColor") }}
                >
                  成功
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: form.watch("warningColor") }}
                >
                  警告
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: form.watch("dangerColor") }}
                >
                  删除
                </Button>
              </div>

              <div
                className={cn(
                  "p-4 bg-muted border",
                  watchBorderRadius === "none" && "rounded-none",
                  watchBorderRadius === "small" && "rounded-sm",
                  watchBorderRadius === "medium" && "rounded-md",
                  watchBorderRadius === "large" && "rounded-lg",
                  watchShadowLevel === "none" && "shadow-none",
                  watchShadowLevel === "subtle" && "shadow-sm",
                  watchShadowLevel === "medium" && "shadow-md",
                  watchShadowLevel === "strong" && "shadow-lg"
                )}
              >
                <p className={cn(
                  watchFontSize === "small" && "text-sm",
                  watchFontSize === "medium" && "text-base",
                  watchFontSize === "large" && "text-lg"
                )}>
                  这是一个示例卡片，展示当前主题设置的效果。您可以在这里预览圆角、阴影和字体大小的变化。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (theme) {
                form.reset({
                  primaryColor: theme.primaryColor,
                  accentColor: theme.accentColor,
                  successColor: theme.successColor,
                  warningColor: theme.warningColor,
                  dangerColor: theme.dangerColor,
                  borderRadius: theme.borderRadius,
                  fontSizeBase: theme.fontSizeBase,
                  fontFamily: theme.fontFamily,
                  shadowLevel: theme.shadowLevel,
                  animationEnabled: theme.animationEnabled,
                })
              }
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重置
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || updateTheme.isPending}
          >
            {form.formState.isSubmitting || updateTheme.isPending ? (
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

export default ThemeSettingsPage