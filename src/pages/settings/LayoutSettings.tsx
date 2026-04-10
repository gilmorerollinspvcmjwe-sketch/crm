"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Layout, Save, PanelLeft, PanelRight, PanelTop, Navigation, Maximize, Minimize, Table, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  layoutSettingsSchema,
  type LayoutSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useLayoutSettings,
  useUpdateLayoutSettings,
} from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ LayoutSettings Page ============

const widthOptions = [
  { value: "compact", label: "紧凑", description: "最小化侧边栏宽度" },
  { value: "default", label: "默认", description: "标准侧边栏宽度" },
  { value: "wide", label: "宽", description: "最大化侧边栏宽度" },
]

const heightOptions = [
  { value: "compact", label: "紧凑", description: "最小化头部高度" },
  { value: "default", label: "默认", description: "标准头部高度" },
  { value: "tall", label: "高", description: "最大化头部高度" },
]

const spacingOptions = [
  { value: "compact", label: "紧凑", description: "最小化卡片间距" },
  { value: "default", label: "默认", description: "标准卡片间距" },
  { value: "relaxed", label: "宽松", description: "最大化卡片间距" },
]

const densityOptions = [
  { value: "compact", label: "紧凑", description: "最小化表格行高" },
  { value: "default", label: "默认", description: "标准表格行高" },
  { value: "comfortable", label: "宽松", description: "最大化表格行高" },
]

export function LayoutSettingsPage() {
  const { data: layout, isLoading } = useLayoutSettings()
  const updateLayout = useUpdateLayoutSettings()

  const form = useForm<LayoutSettingsFormValues>({
    resolver: zodResolver(layoutSettingsSchema),
    defaultValues: {
      sidebarPosition: "left",
      sidebarWidth: "default",
      sidebarCollapsible: true,
      headerHeight: "default",
      showBreadcrumb: true,
      showFooter: false,
      contentWidth: "fluid",
      cardSpacing: "default",
      tableDensity: "default",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (layout) {
      form.reset({
        sidebarPosition: layout.sidebarPosition,
        sidebarWidth: layout.sidebarWidth,
        sidebarCollapsible: layout.sidebarCollapsible,
        headerHeight: layout.headerHeight,
        showBreadcrumb: layout.showBreadcrumb,
        showFooter: layout.showFooter,
        contentWidth: layout.contentWidth,
        cardSpacing: layout.cardSpacing,
        tableDensity: layout.tableDensity,
      })
    }
  }, [layout, form])

  const onSubmit = async (values: LayoutSettingsFormValues) => {
    try {
      await updateLayout.mutateAsync(values)
      console.log("Layout settings updated successfully")
    } catch (error) {
      console.error("Failed to update layout settings:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const watchSidebarPosition = form.watch("sidebarPosition")
  const watchSidebarWidth = form.watch("sidebarWidth")
  const watchHeaderHeight = form.watch("headerHeight")
  const watchCardSpacing = form.watch("cardSpacing")
  const watchTableDensity = form.watch("tableDensity")
  const watchContentWidth = form.watch("contentWidth")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Layout className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">布局设置</h1>
          <p className="text-muted-foreground">自定义系统界面的整体布局和结构</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 侧边栏设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PanelLeft className="h-5 w-5" />
              侧边栏设置
            </CardTitle>
            <CardDescription>配置侧边栏的位置、宽度和行为</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 侧边栏位置 */}
            <div className="space-y-4">
              <Label className="text-base">侧边栏位置</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                    watchSidebarPosition === "left"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => form.setValue("sidebarPosition", "left")}
                >
                  <PanelLeft className="h-6 w-6" />
                  <div>
                    <p className="font-medium">左侧</p>
                    <p className="text-sm text-muted-foreground">侧边栏位于左侧</p>
                  </div>
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                    watchSidebarPosition === "right"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => form.setValue("sidebarPosition", "right")}
                >
                  <PanelRight className="h-6 w-6" />
                  <div>
                    <p className="font-medium">右侧</p>
                    <p className="text-sm text-muted-foreground">侧边栏位于右侧</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 侧边栏宽度 */}
            <div className="space-y-4">
              <Label className="text-base">侧边栏宽度</Label>
              <div className="grid grid-cols-3 gap-4">
                {widthOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchSidebarWidth === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("sidebarWidth", option.value as "default" | "compact" | "wide")}
                  >
                    {option.value === "compact" && <Minimize className="h-5 w-5" />}
                    {option.value === "default" && <PanelLeft className="h-5 w-5" />}
                    {option.value === "wide" && <Maximize className="h-5 w-5" />}
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 侧边栏可折叠 */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="font-medium">允许折叠侧边栏</Label>
                <p className="text-sm text-muted-foreground">用户可以折叠侧边栏以获得更多工作空间</p>
              </div>
              <Checkbox
                checked={form.watch("sidebarCollapsible")}
                onCheckedChange={(checked) =>
                  form.setValue("sidebarCollapsible", checked as boolean)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 头部设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PanelTop className="h-5 w-5" />
              头部设置
            </CardTitle>
            <CardDescription>配置顶部导航栏的高度和元素</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头部高度 */}
            <div className="space-y-4">
              <Label className="text-base">头部高度</Label>
              <div className="grid grid-cols-3 gap-4">
                {heightOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchHeaderHeight === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("headerHeight", option.value as "default" | "compact" | "tall")}
                  >
                    {option.value === "compact" && <Minimize className="h-5 w-5" />}
                    {option.value === "default" && <PanelTop className="h-5 w-5" />}
                    {option.value === "tall" && <Maximize className="h-5 w-5" />}
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 面包屑 */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <Navigation className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="font-medium">显示面包屑导航</Label>
                  <p className="text-sm text-muted-foreground">在头部显示当前位置的路径导航</p>
                </div>
              </div>
              <Checkbox
                checked={form.watch("showBreadcrumb")}
                onCheckedChange={(checked) =>
                  form.setValue("showBreadcrumb", checked as boolean)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 内容区域设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Maximize className="h-5 w-5" />
              内容区域设置
            </CardTitle>
            <CardDescription>配置主内容区域的显示方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 内容宽度 */}
            <div className="space-y-4">
              <Label className="text-base">内容宽度</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                    watchContentWidth === "fixed"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => form.setValue("contentWidth", "fixed")}
                >
                  <Minimize className="h-6 w-6" />
                  <div>
                    <p className="font-medium">固定宽度</p>
                    <p className="text-sm text-muted-foreground">内容区域有最大宽度限制</p>
                  </div>
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                    watchContentWidth === "fluid"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => form.setValue("contentWidth", "fluid")}
                >
                  <Maximize className="h-6 w-6" />
                  <div>
                    <p className="font-medium">全宽</p>
                    <p className="text-sm text-muted-foreground">内容区域占满整个宽度</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 卡片间距 */}
            <div className="space-y-4">
              <Label className="text-base">卡片间距</Label>
              <div className="grid grid-cols-3 gap-4">
                {spacingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchCardSpacing === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("cardSpacing", option.value as "default" | "compact" | "relaxed")}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 表格密度 */}
            <div className="space-y-4">
              <Label className="text-base">表格密度</Label>
              <div className="grid grid-cols-3 gap-4">
                {densityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
                      watchTableDensity === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => form.setValue("tableDensity", option.value as "default" | "compact" | "comfortable")}
                  >
                    <Table className="h-5 w-5" />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 页脚 */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <Layout className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="font-medium">显示页脚</Label>
                  <p className="text-sm text-muted-foreground">在页面底部显示版权信息等</p>
                </div>
              </div>
              <Checkbox
                checked={form.watch("showFooter")}
                onCheckedChange={(checked) =>
                  form.setValue("showFooter", checked as boolean)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (layout) {
                form.reset({
                  sidebarPosition: layout.sidebarPosition,
                  sidebarWidth: layout.sidebarWidth,
                  sidebarCollapsible: layout.sidebarCollapsible,
                  headerHeight: layout.headerHeight,
                  showBreadcrumb: layout.showBreadcrumb,
                  showFooter: layout.showFooter,
                  contentWidth: layout.contentWidth,
                  cardSpacing: layout.cardSpacing,
                  tableDensity: layout.tableDensity,
                })
              }
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重置
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || updateLayout.isPending}
          >
            {form.formState.isSubmitting || updateLayout.isPending ? (
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

export default LayoutSettingsPage