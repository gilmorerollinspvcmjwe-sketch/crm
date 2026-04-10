"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Webhook, Save, Plus, Trash2, Edit, Play, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  webhookSettingsSchema,
  type WebhookSettingsFormValues,
} from "@/schemas/settingsSchema"
import {
  useWebhooks,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
  useTestWebhook,
} from "@/hooks/api/useSettings"
import type { WebhookSettings } from "@/hooks/api/useSettings"

// ============ WebhookSettings Page ============

export function WebhookSettingsPage() {
  const { data: webhooks, isLoading } = useWebhooks()
  const createWebhook = useCreateWebhook()
  const updateWebhook = useUpdateWebhook()
  const deleteWebhook = useDeleteWebhook()
  const testWebhook = useTestWebhook()

  const [editingWebhook, setEditingWebhook] = useState<WebhookSettings | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const form = useForm<WebhookSettingsFormValues>({
    resolver: zodResolver(webhookSettingsSchema),
    defaultValues: {
      url: "",
      secret: "",
      events: [],
      enabled: true,
      timeoutSeconds: 10,
      retryCount: 3,
    },
    mode: "onBlur",
  })

  const handleCreate = async (values: WebhookSettingsFormValues) => {
    try {
      await createWebhook.mutateAsync({
        name: "新 Webhook",
        url: values.url,
        secret: values.secret,
        events: values.events ?? [],
        enabled: values.enabled ?? true,
        timeoutSeconds: values.timeoutSeconds ?? 10,
        retryCount: values.retryCount ?? 3,
      })
      setShowCreateModal(false)
      form.reset()
      console.log("Webhook created successfully")
    } catch (error) {
      console.error("Failed to create webhook:", error)
    }
  }

  const handleUpdate = async (values: WebhookSettingsFormValues) => {
    if (!editingWebhook?.id) return
    try {
      await updateWebhook.mutateAsync({
        id: editingWebhook.id,
        data: {
          url: values.url,
          secret: values.secret,
          events: values.events ?? [],
          enabled: values.enabled ?? true,
          timeoutSeconds: values.timeoutSeconds ?? 10,
          retryCount: values.retryCount ?? 3,
        },
      })
      setEditingWebhook(null)
      form.reset()
      console.log("Webhook updated successfully")
    } catch (error) {
      console.error("Failed to update webhook:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteWebhook.mutateAsync(id)
      console.log("Webhook deleted successfully")
    } catch (error) {
      console.error("Failed to delete webhook:", error)
    }
  }

  const handleTest = async (id: string) => {
    try {
      const result = await testWebhook.mutateAsync(id)
      console.log("Webhook test result:", result)
    } catch (error) {
      console.error("Failed to test webhook:", error)
    }
  }

  const openEditModal = (webhook: WebhookSettings) => {
    setEditingWebhook(webhook)
    form.reset({
      url: webhook.url,
      secret: webhook.secret || "",
      events: webhook.events,
      enabled: webhook.enabled,
      timeoutSeconds: webhook.timeoutSeconds,
      retryCount: webhook.retryCount,
    })
  }

  const eventOptions = [
    { value: "customer.created", label: "客户创建" },
    { value: "customer.updated", label: "客户更新" },
    { value: "customer.deleted", label: "客户删除" },
    { value: "opportunity.created", label: "商机创建" },
    { value: "opportunity.status_changed", label: "商机状态变更" },
    { value: "contract.created", label: "合同创建" },
    { value: "contract.approved", label: "合同审批" },
    { value: "order.created", label: "订单创建" },
    { value: "payment.completed", label: "付款完成" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const WebhookForm = ({ onSubmit, submitLabel }: { onSubmit: (values: WebhookSettingsFormValues) => void; submitLabel: string }) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="url"
        label="Webhook URL"
        required
      >
        {({ field }) => (
          <Input
            {...field}
            type="url"
            placeholder="https://example.com/webhook"
          />
        )}
      </FormField>

      <FormField
        control={form.control}
        name="secret"
        label="密钥（可选）"
      >
        {({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="用于验证请求来源"
          />
        )}
      </FormField>

      <FormField
        control={form.control}
        name="events"
        label="触发事件"
      >
        {({ field }) => (
          <div className="space-y-2">
            {eventOptions.map((event) => (
              <div key={event.value} className="flex items-center gap-2">
                <Checkbox
                  checked={field.value?.includes(event.value)}
                  onCheckedChange={(checked) => {
                    const current = field.value || []
                    if (checked) {
                      field.onChange([...current, event.value])
                    } else {
                      field.onChange(current.filter((e: string) => e !== event.value))
                    }
                  }}
                />
                <Label>{event.label}</Label>
              </div>
            ))}
          </div>
        )}
      </FormField>

      <FormGrid cols={2}>
        <FormField
          control={form.control}
          name="timeoutSeconds"
          label="超时时间（秒）"
        >
          {({ field }) => (
            <Input
              {...field}
              type="number"
              min={5}
              max={60}
            />
          )}
        </FormField>

        <FormField
          control={form.control}
          name="retryCount"
          label="重试次数"
        >
          {({ field }) => (
            <Input
              {...field}
              type="number"
              min={0}
              max={5}
            />
          )}
        </FormField>
      </FormGrid>

      <div className="flex items-center justify-between">
        <Label>启用状态</Label>
        <Checkbox
          checked={form.watch("enabled")}
          onCheckedChange={(checked) => form.setValue("enabled", checked as boolean)}
        />
      </div>

      <FormActions>
        <Button type="submit" disabled={createWebhook.isPending || updateWebhook.isPending}>
          {createWebhook.isPending || updateWebhook.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </FormActions>
    </form>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Webhook className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Webhook 设置</h1>
            <p className="text-muted-foreground">配置外部系统的回调通知</p>
          </div>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建 Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建 Webhook</DialogTitle>
              <DialogDescription>
                配置一个新的 Webhook 以接收系统事件通知
              </DialogDescription>
            </DialogHeader>
            <WebhookForm onSubmit={handleCreate} submitLabel="创建" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhook List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook 列表
          </CardTitle>
          <CardDescription>管理已配置的 Webhook</CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无 Webhook 配置</p>
              <p className="text-sm mt-2">点击上方按钮创建新的 Webhook</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks?.map((webhook) => (
                <div
                  key={webhook.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Webhook className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{webhook.name}</p>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.enabled ? "default" : "secondary"}>
                        {webhook.enabled ? "已启用" : "已禁用"}
                      </Badge>
                      <Badge variant={webhook.status === "active" ? "default" : webhook.status === "failed" ? "destructive" : "secondary"}>
                        {webhook.status === "active" ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            正常
                          </>
                        ) : webhook.status === "failed" ? (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            失败
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-1 h-3 w-3" />
                            待验证
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      最后触发: {webhook.lastTriggered || "无"}
                    </div>
                    <div>成功率: {webhook.successRate || 0}%</div>
                    <div>事件数: {webhook.events.length}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(webhook.id!)}
                      disabled={testWebhook.isPending}
                    >
                      {testWebhook.isPending ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-3 w-3" />
                      )}
                      测试
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(webhook)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(webhook.id!)}
                      disabled={deleteWebhook.isPending}
                    >
                      {deleteWebhook.isPending ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-3 w-3" />
                      )}
                      删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={!!editingWebhook} onOpenChange={(open) => !open && setEditingWebhook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑 Webhook</DialogTitle>
            <DialogDescription>
              修改 Webhook 的配置信息
            </DialogDescription>
          </DialogHeader>
          <WebhookForm onSubmit={handleUpdate} submitLabel="保存" />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WebhookSettingsPage