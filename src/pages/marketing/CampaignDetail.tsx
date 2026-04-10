"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Megaphone, Save, ArrowLeft, BarChart3, Users, Calendar, Tag, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  campaignSchema,
  type CampaignFormValues,
} from "@/schemas/marketingSchema"
import { useCampaign, useUpdateCampaign } from "@/hooks/api/useMarketing"
import { cn } from "@/lib/utils"

// ============ Campaign Detail Page ============

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  running: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-purple-100 text-purple-800 border-purple-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels: Record<string, string> = {
  draft: "草稿",
  scheduled: "已排期",
  running: "进行中",
  paused: "已暂停",
  completed: "已完成",
  cancelled: "已取消",
}

const typeLabels: Record<string, string> = {
  email: "邮件营销",
  sms: "短信营销",
  social: "社交媒体",
  event: "线下活动",
  webinar: "网络研讨会",
  other: "其他",
}

interface CampaignDetailPageProps {
  campaignId: string
  onBack?: () => void
}

export function CampaignDetailPage({ campaignId, onBack }: CampaignDetailPageProps) {
  const { data: campaign, isLoading } = useCampaign(campaignId)
  const updateCampaign = useUpdateCampaign()

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema) as any,
    defaultValues: {
      name: "",
      type: "email",
      status: "draft",
      objective: "",
      startDate: "",
      endDate: "",
      targetAudience: "",
      budget: undefined,
      expectedConversionRate: undefined,
      productId: "",
      tags: [],
      notes: "",
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        objective: campaign.objective || "",
        startDate: campaign.startDate || "",
        endDate: campaign.endDate || "",
        targetAudience: campaign.targetAudience || "",
        budget: campaign.budget,
        expectedConversionRate: campaign.expectedConversionRate,
        productId: campaign.productId || "",
        tags: campaign.tags,
        notes: campaign.notes || "",
      })
    }
  }, [campaign, form])

  const onSubmit = async (values: CampaignFormValues) => {
    try {
      await updateCampaign.mutateAsync({ 
        id: campaignId, 
        ...values,
        startDate: values.startDate ? String(values.startDate) : undefined,
        endDate: values.endDate ? String(values.endDate) : undefined
      } as any)
      console.log("Campaign updated successfully")
    } catch (error) {
      console.error("Failed to update campaign:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">活动不存在或已删除</p>
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
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Megaphone className="h-6 w-6 text-muted-foreground" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge className={statusColors[campaign.status]}>
              {statusLabels[campaign.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground">{typeLabels[campaign.type]}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">详细信息</TabsTrigger>
          <TabsTrigger value="stats">统计数据</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormGrid cols={2}>
                  <FormField
                    control={form.control}
                    name="name"
                    label="活动名称"
                    required
                    containerClassName="col-span-2"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入活动名称"
                        error={!!form.formState.errors.name}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="type"
                    label="活动类型"
                    required
                  >
                    {({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">邮件营销</SelectItem>
                          <SelectItem value="sms">短信营销</SelectItem>
                          <SelectItem value="social">社交媒体</SelectItem>
                          <SelectItem value="event">线下活动</SelectItem>
                          <SelectItem value="webinar">网络研讨会</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="status"
                    label="状态"
                  >
                    {({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">草稿</SelectItem>
                          <SelectItem value="scheduled">已排期</SelectItem>
                          <SelectItem value="running">进行中</SelectItem>
                          <SelectItem value="paused">已暂停</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                          <SelectItem value="cancelled">已取消</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="objective"
                    label="目标描述"
                    containerClassName="col-span-2"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入活动目标"
                        error={!!form.formState.errors.objective}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    label="目标受众"
                    containerClassName="col-span-2"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入目标受众描述"
                        error={!!form.formState.errors.targetAudience}
                      />
                    )}
                  </FormField>
                </FormGrid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  时间与预算
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormGrid cols={2}>
                  <FormField
                    control={form.control}
                    name="startDate"
                    label="开始时间"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        error={!!form.formState.errors.startDate}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="endDate"
                    label="结束时间"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        error={!!form.formState.errors.endDate}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="budget"
                    label="预算 (¥)"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="请输入预算金额"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={!!form.formState.errors.budget}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="expectedConversionRate"
                    label="预期转化率 (%)"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="请输入预期转化率"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={!!form.formState.errors.expectedConversionRate}
                      />
                    )}
                  </FormField>
                </FormGrid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  其他信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormGrid cols={2}>
                  <FormField
                    control={form.control}
                    name="productId"
                    label="关联产品"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入产品 ID"
                        error={!!form.formState.errors.productId}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="notes"
                    label="备注"
                    containerClassName="col-span-2"
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入备注信息"
                        error={!!form.formState.errors.notes}
                      />
                    )}
                  </FormField>
                </FormGrid>
              </CardContent>
            </Card>

            <FormActions>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || updateCampaign.isPending}
              >
                {form.formState.isSubmitting || updateCampaign.isPending ? (
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
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                活动统计
              </CardTitle>
              <CardDescription>查看活动的发送和转化数据</CardDescription>
            </CardHeader>
            <CardContent>
              {campaign.stats ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">发送数量</p>
                    <p className="text-xl font-bold">{campaign.stats.sentCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">送达数量</p>
                    <p className="text-xl font-bold">{campaign.stats.deliveredCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">打开数量</p>
                    <p className="text-xl font-bold">{campaign.stats.openedCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">点击数量</p>
                    <p className="text-xl font-bold">{campaign.stats.clickedCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">回复数量</p>
                    <p className="text-xl font-bold">{campaign.stats.repliedCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">转化数量</p>
                    <p className="text-xl font-bold">{campaign.stats.conversionCount}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  活动尚未开始，暂无统计数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>历史记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">活动创建</span>
                    <span className="text-xs text-muted-foreground">{campaign.createdAt}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">最后更新</span>
                    <span className="text-xs text-muted-foreground">{campaign.updatedAt}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CampaignDetailPage