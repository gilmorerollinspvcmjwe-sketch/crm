"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormGrid, FormSection, FormActions, FormField } from "@/components/form"
import { leadSchema, type LeadFormValues } from "@/schemas"
import { cn } from "@/lib/utils"
import { useLeadFormStore } from "@/store"
import { useToast } from "@/hooks/use-toast"

// ============ LeadForm Props ============

export interface LeadFormProps {
  initialValues?: Partial<LeadFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: LeadFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<LeadFormValues> = {
  source: "官网",
  status: "新建",
  score: 0,
}

// ============ LeadForm Component ============

export function LeadForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: LeadFormProps) {
  const { toast } = useToast()
  const {
    formData: storeFormData,
    setFormData,
    clearFormData,
    isDirty,
    setIsDirty,
    savedDraft,
    saveDraft,
    loadDraft,
    clearDraft,
  } = useLeadFormStore()

  const form = useForm<LeadFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      ...storeFormData,
    } as LeadFormValues,
    mode: "onBlur",
  })

  // 同步表单数据到 store
  useEffect(() => {
    const subscription = form.watch((values) => {
      setFormData(values as Record<string, unknown>)
    })
    return () => subscription.unsubscribe()
  }, [form.watch, setFormData])

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as LeadFormValues)
      setFormData(initialValues as Record<string, unknown>)
    }
  }, [initialValues, form, setFormData])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  // 处理草稿
  const handleSaveDraft = () => {
    saveDraft()
    toast({
      title: "草稿已保存",
      description: "下次打开时可以恢复此草稿",
    })
  }

  const handleLoadDraft = () => {
    if (savedDraft) {
      loadDraft()
      form.reset({ ...defaultValues, ...savedDraft } as LeadFormValues)
      toast({
        title: "草稿已恢复",
      })
    }
  }

  const handleClearDraft = () => {
    clearDraft()
    clearFormData()
    form.reset({ ...defaultValues, ...initialValues } as LeadFormValues)
    toast({
      title: "草稿已清除",
    })
  }

  // 提交后清除状态
  const handleFormSubmit = async (values: LeadFormValues) => {
    await onSubmit(values)
    clearFormData()
    clearDraft()
    setIsDirty(false)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn("space-y-6", className)}
        noValidate
      >
        {/* Basic Info */}
        <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="name"
            label="线索名称"
            required
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入线索名称"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="company"
            label="公司名称"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入公司名称"
                error={!!errors.company}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="source"
            label="线索来源"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择线索来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="官网">官网</SelectItem>
                  <SelectItem value="展会">展会</SelectItem>
                  <SelectItem value="推荐">推荐</SelectItem>
                  <SelectItem value="广告">广告</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={form.control}
            name="status"
            label="线索状态"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="新建">新建</SelectItem>
                  <SelectItem value="跟进中">跟进中</SelectItem>
                  <SelectItem value="已转化">已转化</SelectItem>
                  <SelectItem value="已放弃">已放弃</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={form.control}
            name="score"
            label="评分"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0-100"
                error={!!errors.score}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="assignee"
            label="负责人"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入负责人"
                error={!!errors.assignee}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Contact Info */}
      <FormSection title="联系信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="email"
            label="邮箱"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="请输入邮箱地址"
                error={!!errors.email}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="phone"
            label="手机号"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="tel"
                placeholder="请输入手机号码"
                error={!!errors.phone}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Other Info */}
      <FormSection title="其他信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="remark"
            label="备注"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入备注信息"
                error={!!errors.remark}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Actions */}
      <FormActions>
        {/* 草稿操作 */}
        {mode === "create" && (
          <div className="flex items-center gap-2 mr-auto">
            {savedDraft && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadDraft}
                  disabled={isSubmitting || loading}
                >
                  恢复草稿
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDraft}
                  disabled={isSubmitting || loading}
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  清除草稿
                </Button>
              </>
            )}
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSubmitting || loading}
              >
                <Save className="mr-1 h-3 w-3" />
                保存草稿
              </Button>
            )}
          </div>
        )}
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            取消
          </Button>
        )}
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提交中...
            </>
          ) : mode === "create" ? (
            "创建"
          ) : (
            "保存"
          )}
        </Button>
      </FormActions>
    </form>
    </FormProvider>
  )
}

export type { LeadFormValues }