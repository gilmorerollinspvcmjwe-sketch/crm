"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Palette, Save, Image, Globe, Type, Code, LayoutTemplate } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  customizationSettingsSchema,
  type CustomizationSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useCustomizationSettings,
  useUpdateCustomizationSettings,
} from "@/hooks/api/useSettings"

// ============ CustomizationSettings Page ============

export function CustomizationSettingsPage() {
  const { data: settings, isLoading } = useCustomizationSettings()
  const updateSettings = useUpdateCustomizationSettings()

  const form = useForm<CustomizationSettingsFormValues>({
    resolver: zodResolver(customizationSettingsSchema),
    defaultValues: {
      logoUrl: "",
      primaryColor: "#3b82f6",
      companyName: "",
      welcomeMessage: "",
      customCss: "",
      customJs: "",
      footerText: "",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        logoUrl: settings.logoUrl || "",
        primaryColor: settings.primaryColor,
        companyName: settings.companyName || "",
        welcomeMessage: settings.welcomeMessage || "",
        customCss: settings.customCss || "",
        customJs: settings.customJs || "",
        footerText: settings.footerText || "",
      })
    }
  }, [settings, form])

  const onSubmit = async (values: CustomizationSettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(values)
      console.log("Customization settings updated successfully")
    } catch (error) {
      console.error("Failed to update customization settings:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const colorPresets = [
    { name: "蓝色", value: "#3b82f6" },
    { name: "紫色", value: "#8b5cf6" },
    { name: "绿色", value: "#22c55e" },
    { name: "橙色", value: "#f59e0b" },
    { name: "红色", value: "#ef4444" },
    { name: "青色", value: "#06b6d4" },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">自定义设置</h1>
          <p className="text-muted-foreground">定制系统的外观和品牌元素</p>
        </div>
      </div>

      {/* Logo & Brand */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Logo 和品牌
          </CardTitle>
          <CardDescription>设置系统 Logo 和公司名称</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="品牌设置">
              <div className="flex items-center gap-6 mb-4">
                <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                  {settings?.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    上传 Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    支持 PNG、SVG，建议尺寸 200x200
                  </p>
                </div>
              </div>

              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="logoUrl"
                  label="Logo URL"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/logo.png"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="companyName"
                  label="公司名称"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="公司名称"
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="welcomeMessage"
                  label="欢迎语"
                  containerClassName="col-span-2"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="欢迎使用 CRM 系统"
                    />
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="主题颜色">
              <FormField
                control={form.control}
                name="primaryColor"
                label="主色调"
              >
                {({ field }) => (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        {...field}
                        type="color"
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="w-32"
                      />
                    </div>
                    <div className="flex gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          className={`h-10 w-10 rounded-lg border-2 transition-all ${
                            field.value === preset.value
                              ? "border-foreground scale-105"
                              : "border-transparent hover:border-foreground/50"
                          }`}
                          style={{ backgroundColor: preset.value }}
                          onClick={() => field.onChange(preset.value)}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </FormField>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg border bg-muted/30">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">按钮示例</p>
                  <Button style={{ backgroundColor: form.watch("primaryColor") }}>
                    主按钮
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">链接示例</p>
                  <p
                    className="text-sm underline"
                    style={{ color: form.watch("primaryColor") }}
                  >
                    示例链接
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">图标示例</p>
                  <Palette
                    className="h-6 w-6"
                    style={{ color: form.watch("primaryColor") }}
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

      {/* Custom Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            自定义代码
          </CardTitle>
          <CardDescription>添加自定义 CSS 和 JavaScript 代码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="自定义样式">
              <FormField
                control={form.control}
                name="customCss"
                label="自定义 CSS"
              >
                {({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="/* 添加自定义 CSS 样式 */"
                    rows={8}
                    className="font-mono text-sm"
                  />
                )}
              </FormField>
              <p className="text-sm text-muted-foreground">
                CSS 代码会注入到所有页面的 &lt;head&gt; 标签中
              </p>
            </FormSection>

            <FormSection title="自定义脚本">
              <FormField
                control={form.control}
                name="customJs"
                label="自定义 JavaScript"
              >
                {({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="// 添加自定义 JavaScript 代码"
                    rows={8}
                    className="font-mono text-sm"
                  />
                )}
              </FormField>
              <p className="text-sm text-muted-foreground">
                JavaScript 代码会在页面加载完成后执行
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
                    保存代码
                  </>
                )}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            页脚设置
          </CardTitle>
          <CardDescription>配置页面底部显示的文字</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="footerText"
              label="页脚文字"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="© 2025 Company Name. All rights reserved."
                />
              )}
            </FormField>

            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">预览效果</p>
              <p className="text-center text-sm mt-2">
                {form.watch("footerText") || "© 2025 CRM Pro. All rights reserved."}
              </p>
            </div>

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
                    保存页脚
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

export default CustomizationSettingsPage