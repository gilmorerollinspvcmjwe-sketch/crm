"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail, Save, Server, ShieldCheck, User, Send, RefreshCw, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
  FormProvider,
} from "@/components/form"
import {
  emailSettingsSchema,
  type EmailSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useEmailSettings,
  useUpdateEmailSettings,
  useTestEmailConnection,
} from "@/hooks/api/useSettings"

// ============ EmailSettings Page ============

export function EmailSettingsPage() {
  const { data: email, isLoading } = useEmailSettings()
  const updateEmail = useUpdateEmailSettings()
  const testEmail = useTestEmailConnection()

  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      senderEmail: "",
      senderName: "",
      enableSSL: true,
      emailSignature: "",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (email) {
      form.reset({
        smtpServer: email.smtpServer,
        smtpPort: email.smtpPort,
        smtpUsername: email.smtpUsername,
        smtpPassword: email.smtpPassword || "",
        senderEmail: email.senderEmail,
        senderName: email.senderName || "",
        enableSSL: email.enableSSL,
        emailSignature: email.emailSignature || "",
      })
    }
  }, [email, form])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (values: EmailSettingsFormValues) => {
    try {
      await updateEmail.mutateAsync(values)
      console.log("Email settings updated successfully")
    } catch (error) {
      console.error("Failed to update email settings:", error)
    }
  }

  const handleTestConnection = async () => {
    try {
      const result = await testEmail.mutateAsync()
      console.log("Test result:", result)
    } catch (error) {
      console.error("Failed to test email connection:", error)
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
    <FormProvider form={form}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">邮件设置</h1>
            <p className="text-muted-foreground">配置系统邮件服务器和发送设置</p>
          </div>
        </div>

        {/* SMTP 配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              SMTP 服务器配置
            </CardTitle>
            <CardDescription>设置邮件发送服务器的连接参数</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="服务器信息">
              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="smtpServer"
                  label="SMTP 服务器地址"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="smtp.example.com"
                      error={!!errors.smtpServer}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="smtpPort"
                  label="SMTP 端口"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="587"
                      error={!!errors.smtpPort}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="smtpUsername"
                  label="SMTP 用户名"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="username@example.com"
                      error={!!errors.smtpUsername}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="smtpPassword"
                  label="SMTP 密码"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="请输入 SMTP 密码"
                      error={!!errors.smtpPassword}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="enableSSL"
                  label="启用 SSL/TLS"
                  containerClassName="col-span-2"
                >
                  {({ field }) => (
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label className="font-normal">
                        使用 SSL/TLS 加密连接（推荐）
                      </Label>
                    </div>
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="发件人信息">
              <FormGrid cols={2}>
                <FormField
                  control={form.control}
                  name="senderEmail"
                  label="发件人邮箱"
                  required
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="noreply@example.com"
                      error={!!errors.senderEmail}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="senderName"
                  label="发件人名称"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="CRM 系统"
                      error={!!errors.senderName}
                    />
                  )}
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="邮件签名">
              <FormField
                control={form.control}
                name="emailSignature"
                label="邮件签名"
                containerClassName="w-full"
              >
                {({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="感谢您的关注！\nCRM 系统团队"
                    rows={4}
                    error={!!errors.emailSignature}
                  />
                )}
              </FormField>
            </FormSection>

            <FormActions>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (email) {
                    form.reset({
                      smtpServer: email.smtpServer,
                      smtpPort: email.smtpPort,
                      smtpUsername: email.smtpUsername,
                      smtpPassword: "",
                      senderEmail: email.senderEmail,
                      senderName: email.senderName || "",
                      enableSSL: email.enableSSL,
                      emailSignature: email.emailSignature || "",
                    })
                  }
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重置
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestConnection}
                disabled={testEmail.isPending}
              >
                {testEmail.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    测试中...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    测试连接
                  </>
                )}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || updateEmail.isPending}
              >
                {isSubmitting || updateEmail.isPending ? (
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
            </FormActions>
            </form>
          </CardContent>
        </Card>

        {/* 连接状态 */}
        {testEmail.data && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className={`h-5 w-5 ${testEmail.data.success ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="font-medium">
                    {testEmail.data.success ? '连接成功' : '连接失败'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testEmail.data.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              配置说明
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium text-foreground">常用 SMTP 端口：</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>25</strong> - 标准 SMTP 端口（不加密）</li>
                <li><strong>465</strong> - SMTPS（SSL 加密）</li>
                <li><strong>587</strong> - SMTP with STARTTLS（推荐）</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">安全建议：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>始终启用 SSL/TLS 加密</li>
                <li>使用专门的发件邮箱，而非个人邮箱</li>
                <li>定期更换 SMTP 密码</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
}

export default EmailSettingsPage