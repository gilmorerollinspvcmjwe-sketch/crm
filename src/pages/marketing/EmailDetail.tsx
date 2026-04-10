"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail, Save, ArrowLeft, Eye, MousePointer, Reply, AlertCircle, Send, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  emailSchema,
  type EmailFormValues,
} from "@/schemas/marketingSchema"
import { useEmail, useUpdateEmail, useSendEmail, useScheduleEmail } from "@/hooks/api/useMarketing"
import { cn } from "@/lib/utils"

// ============ Email Detail Page ============

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  sending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  sent: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels: Record<string, string> = {
  draft: "草稿",
  scheduled: "已排期",
  sending: "发送中",
  sent: "已发送",
  failed: "发送失败",
}

const recipientTypeLabels: Record<string, string> = {
  all: "所有客户",
  segment: "客户分群",
  individual: "指定客户",
  campaign: "营销活动",
}

interface EmailDetailPageProps {
  emailId: string
  onBack?: () => void
}

export function EmailDetailPage({ emailId, onBack }: EmailDetailPageProps) {
  const { data: email, isLoading } = useEmail(emailId)
  const updateEmail = useUpdateEmail()
  const sendEmail = useSendEmail()
  const scheduleEmail = useScheduleEmail()

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema) as any,
    defaultValues: {
      subject: "",
      senderName: "",
      replyTo: "",
      recipientType: "segment",
      recipientIds: [],
      templateId: "",
      content: "",
      scheduledAt: "",
      priority: "normal",
      enableTracking: true,
      trackOpens: true,
      trackClicks: true,
      trackReplies: false,
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (email) {
      form.reset({
        subject: email.subject,
        senderName: email.senderName || "",
        replyTo: email.replyTo || "",
        recipientType: email.recipientType,
        recipientIds: [],
        templateId: email.templateId || "",
        content: email.content,
        scheduledAt: email.scheduledAt || "",
        priority: email.priority,
        enableTracking: email.enableTracking,
        trackOpens: email.trackOpens,
        trackClicks: email.trackClicks,
        trackReplies: email.trackReplies,
      })
    }
  }, [email, form])

  const onSubmit = async (values: EmailFormValues) => {
    try {
      await updateEmail.mutateAsync({ 
        id: emailId, 
        ...values,
        scheduledAt: values.scheduledAt ? String(values.scheduledAt) : undefined
      } as any)
      console.log("Email updated successfully")
    } catch (error) {
      console.error("Failed to update email:", error)
    }
  }

  const handleSend = async () => {
    if (confirm("确定要立即发送此邮件吗？")) {
      try {
        await sendEmail.mutateAsync(emailId)
      } catch (error) {
        console.error("Failed to send email:", error)
      }
    }
  }

  const handleSchedule = async () => {
    const scheduledAt = form.watch("scheduledAt")
    if (!scheduledAt) {
      alert("请先设置排期时间")
      return
    }
    try {
      await scheduleEmail.mutateAsync({ id: emailId, scheduledAt: String(scheduledAt) })
    } catch (error) {
      console.error("Failed to schedule email:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!email) {
    return (
      <div className="p-6 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">邮件不存在或已删除</p>
        {onBack && (
          <Button variant="outline" className="mt-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Mail className="h-6 w-6 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{email.subject}</h1>
              <Badge className={statusColors[email.status]}>
                {statusLabels[email.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              收件人: {email.recipientCount} 人 · {recipientTypeLabels[email.recipientType]}
            </p>
          </div>
        </div>
        {email.status === "draft" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSchedule}>
              <Clock className="mr-2 h-4 w-4" />
              排期发送
            </Button>
            <Button onClick={handleSend} disabled={sendEmail.isPending}>
              {sendEmail.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              立即发送
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">邮件内容</TabsTrigger>
          <TabsTrigger value="stats">发送统计</TabsTrigger>
          <TabsTrigger value="tracking">追踪设置</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGrid cols={2}>
                  <FormField
                    control={form.control}
                    name="subject"
                    label="邮件主题"
                    required
                    containerClassName="col-span-2"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入邮件主题"
                        error={!!form.formState.errors.subject}
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
                        placeholder="请输入发件人名称"
                        error={!!form.formState.errors.senderName}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="replyTo"
                    label="回复邮箱"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="请输入回复邮箱地址"
                        error={!!form.formState.errors.replyTo}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="recipientType"
                    label="收件人类型"
                  >
                    {({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择收件人类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有客户</SelectItem>
                          <SelectItem value="segment">客户分群</SelectItem>
                          <SelectItem value="individual">指定客户</SelectItem>
                          <SelectItem value="campaign">营销活动</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="priority"
                    label="优先级"
                  >
                    {({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择优先级" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="normal">普通</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>
                </FormGrid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>邮件内容</CardTitle>
                <CardDescription>编辑邮件正文内容</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  label="邮件正文"
                  containerClassName="col-span-2"
                >
                  {({ field }) => (
                    <textarea
                      {...field}
                      placeholder="请输入邮件内容..."
                      className="w-full min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  )}
                </FormField>
              </CardContent>
            </Card>

            {email.status === "draft" && (
              <FormActions>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || updateEmail.isPending}
                >
                  {form.formState.isSubmitting || updateEmail.isPending ? (
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
            )}
          </form>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>发送统计</CardTitle>
              <CardDescription>查看邮件的发送和交互数据</CardDescription>
            </CardHeader>
            <CardContent>
              {email.stats ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">送达数量</p>
                    </div>
                    <p className="text-xl font-bold">{email.stats.delivered}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">打开数量</p>
                    </div>
                    <p className="text-xl font-bold">{email.stats.opened}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">点击数量</p>
                    </div>
                    <p className="text-xl font-bold">{email.stats.clicked}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Reply className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">回复数量</p>
                    </div>
                    <p className="text-xl font-bold">{email.stats.replied}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">退信数量</p>
                    </div>
                    <p className="text-xl font-bold">{email.stats.bounced}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  邮件尚未发送，暂无统计数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>追踪设置</CardTitle>
              <CardDescription>配置邮件的追踪选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用追踪</Label>
                  <p className="text-sm text-muted-foreground">追踪邮件的发送和交互情况</p>
                </div>
                <Checkbox checked={email.enableTracking} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>打开追踪</Label>
                  <p className="text-sm text-muted-foreground">记录邮件被打开的次数</p>
                </div>
                <Checkbox checked={email.trackOpens} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>点击追踪</Label>
                  <p className="text-sm text-muted-foreground">记录邮件内链接的点击情况</p>
                </div>
                <Checkbox checked={email.trackClicks} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>回复追踪</Label>
                  <p className="text-sm text-muted-foreground">记录客户回复邮件的情况</p>
                </div>
                <Checkbox checked={email.trackReplies} disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmailDetailPage