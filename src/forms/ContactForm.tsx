"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormGrid, FormSection, FormActions, FormField } from "@/components/form"
import { contactSchema, type ContactFormValues } from "@/schemas"
import { cn } from "@/lib/utils"
import { useContactFormStore } from "@/store"
import { useToast } from "@/hooks/use-toast"

// ============ ContactForm Props ============

export interface ContactFormProps {
  initialValues?: Partial<ContactFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: ContactFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<ContactFormValues> = {
  isPrimary: false,
}

// ============ ContactForm Component ============

export function ContactForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: ContactFormProps) {
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
  } = useContactFormStore()

  const form = useForm<ContactFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      ...storeFormData,
    } as ContactFormValues,
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
      form.reset({ ...defaultValues, ...initialValues } as ContactFormValues)
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
      form.reset({ ...defaultValues, ...savedDraft } as ContactFormValues)
      toast({
        title: "草稿已恢复",
      })
    }
  }

  const handleClearDraft = () => {
    clearDraft()
    clearFormData()
    form.reset({ ...defaultValues, ...initialValues } as ContactFormValues)
    toast({
      title: "草稿已清除",
    })
  }

  // 提交后清除状态
  const handleFormSubmit = async (values: ContactFormValues) => {
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
        {/* Basic Info Section */}
        <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="name"
            label="姓名"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入联系人姓名"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="customerId"
            label="关联客户"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择客户"
                error={!!errors.customerId}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="title"
            label="职位"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：销售经理"
                error={!!errors.title}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="department"
            label="部门"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：销售部"
                error={!!errors.department}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Contact Info Section */}
      <FormSection title="联系方式">
        <FormGrid cols={2}>
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

          <FormField
            control={form.control}
            name="telephone"
            label="固定电话"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="tel"
                placeholder="如：010-12345678"
                error={!!errors.telephone}
              />
            )}
          </FormField>

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
            name="wechat"
            label="微信号"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入微信号"
                error={!!errors.wechat}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="qq"
            label="QQ号"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入QQ号"
                error={!!errors.qq}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="address"
            label="地址"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入详细地址"
                error={!!errors.address}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Other Info Section */}
      <FormSection title="其他信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="birthday"
            label="生日"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.birthday}
              />
            )}
          </FormField>

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

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="isPrimary"
              label="设为主要联系人"
            >
              {({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    id="isPrimary"
                  />
                  <label
                    htmlFor="isPrimary"
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    将此联系人设为主要联系人
                  </label>
                </div>
              )}
            </FormField>
          </div>
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

export type { ContactFormValues }
