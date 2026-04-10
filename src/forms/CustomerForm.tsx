"use client"

import { useEffect, useCallback, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  customerSchema,
  type CustomerFormValues,
} from "@/schemas"
import { cn } from "@/lib/utils"

// ============ Draft Storage Key ============
const DRAFT_STORAGE_KEY = "customer_form_draft"

// ============ Customer Form Props ============
export interface CustomerFormProps {
  initialValues?: Partial<CustomerFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: CustomerFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
  enableAutoSave?: boolean // Enable auto-save draft feature
  draftKey?: string // Custom draft storage key
}

// ============ Default Values ============
const defaultValues: Partial<CustomerFormValues> = {
  status: "active",
  type: "enterprise",
}

// ============ Select Options ============
const customerSourceOptions = [
  { label: "市场推广", value: "marketing" },
  { label: "客户推荐", value: "referral" },
  { label: "合作伙伴", value: "partner" },
  { label: "其他", value: "other" },
]

const customerLevelOptions = [
  { label: "A (重要)", value: "A" },
  { label: "B (普通)", value: "B" },
  { label: "C (一般)", value: "C" },
  { label: "D (潜在)", value: "D" },
]

const industryOptions = [
  { label: "互联网/IT", value: "互联网/IT" },
  { label: "金融", value: "金融" },
  { label: "制造业", value: "制造业" },
  { label: "零售/电商", value: "零售/电商" },
  { label: "教育", value: "教育" },
  { label: "医疗", value: "医疗" },
  { label: "其他", value: "其他" },
]

const scaleOptions = [
  { label: "小型 (<50 人)", value: "small" },
  { label: "中型 (50-200 人)", value: "medium" },
  { label: "大型 (200-500 人)", value: "large" },
  { label: "集团 (>500 人)", value: "enterprise" },
]

const customerStatusOptions = [
  { label: "活跃", value: "active" },
  { label: "非活跃", value: "inactive" },
]

// ============ CustomerForm Component ============
export function CustomerForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
  enableAutoSave = true,
  draftKey,
}: CustomerFormProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedValuesRef = useRef<string>("")

  const storageKey = draftKey || `${DRAFT_STORAGE_KEY}_${mode}`

  const form = useForm<CustomerFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as CustomerFormValues,
    mode: "onBlur",
  })

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    getValues,
  } = form

  const customerType = watch("type")

  // Track if form has unsaved changes
  const hasUnsavedChanges = Object.keys(dirtyFields).length > 0

  // Load draft on mount (for create mode)
  useEffect(() => {
    if (mode === "create" && enableAutoSave) {
      const savedDraft = localStorage.getItem(storageKey)
      if (savedDraft) {
        try {
          const draftValues = JSON.parse(savedDraft)
          if (draftValues && Object.keys(draftValues).length > 0) {
            reset({ ...defaultValues, ...draftValues } as CustomerFormValues)
            toast({
              title: t("customer.draftLoaded", "已加载草稿"),
              description: t("customer.draftLoadedDesc", "之前的表单数据已恢复"),
              duration: 3000,
            })
          }
        } catch (e) {
          console.error("Failed to load draft:", e)
        }
      }
    }
  }, [mode, enableAutoSave, storageKey, reset, toast, t])

  // Reset form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues } as CustomerFormValues)
      lastSavedValuesRef.current = JSON.stringify(initialValues)
    }
  }, [initialValues, reset])

  // Auto-save draft function
  const saveDraft = useCallback(() => {
    if (!enableAutoSave || mode !== "create") return

    const currentValues = getValues()
    const valuesJson = JSON.stringify(currentValues)

    // Skip if same as last saved
    if (valuesJson === lastSavedValuesRef.current) return

    localStorage.setItem(storageKey, valuesJson)
    lastSavedValuesRef.current = valuesJson

    toast({
      title: t("customer.draftSaved", "草稿已保存"),
      duration: 2000,
    })
  }, [enableAutoSave, mode, getValues, storageKey, toast, t])

  // Auto-save on form changes (debounced)
  useEffect(() => {
    if (!enableAutoSave || mode !== "create" || !hasUnsavedChanges) return

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new timer (save after 3 seconds of no changes)
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft()
    }, 3000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [hasUnsavedChanges, enableAutoSave, mode, saveDraft])

  // Clear draft function
  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey)
    lastSavedValuesRef.current = ""
    reset(defaultValues as CustomerFormValues)
    toast({
      title: t("customer.draftCleared", "草稿已清除"),
    })
  }, [storageKey, reset, toast, t])

  // Submit handler
  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      // Clear draft on successful submit
      if (mode === "create" && enableAutoSave) {
        localStorage.removeItem(storageKey)
        lastSavedValuesRef.current = ""
      }
    } catch (error) {
      console.error("提交失败:", error)
    }
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleFormSubmit}
        className={cn("space-y-6", className)}
        noValidate
      >
        {/* Draft indicator */}
        {mode === "create" && enableAutoSave && hasUnsavedChanges && (
          <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Save className="h-4 w-4" />
              <span>{t("customer.autoSaveHint", "表单将自动保存草稿")}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDraft}
              className="h-7 text-xs"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              {t("customer.clearDraft", "清除草稿")}
            </Button>
          </div>
        )}

        {/* Basic Info */}
        <FormSection title={t("customer.sections.basic", "基本信息")}>
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="name"
              label={t("customer.fields.name", "客户名称")}
              required
              containerClassName="col-span-2"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.namePlaceholder", "请输入客户名称")}
                  error={!!errors.name}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="type"
              label={t("customer.fields.type", "客户类型")}
              required
              containerClassName="col-span-2"
            >
              {({ field }) => (
                <RadioGroup
                  value={field.value ?? defaultValues.type}
                  onValueChange={field.onChange}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enterprise" id="type-enterprise" />
                    <label htmlFor="type-enterprise" className="text-sm cursor-pointer">
                      {t("customer.type.enterprise", "企业客户")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="type-individual" />
                    <label htmlFor="type-individual" className="text-sm cursor-pointer">
                      {t("customer.type.individual", "个人客户")}
                    </label>
                  </div>
                </RadioGroup>
              )}
            </FormField>

            <FormField
              control={form.control}
              name="source"
              label={t("customer.fields.source", "客户来源")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t("customer.fields.sourcePlaceholder", "请选择客户来源")} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerSourceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField
              control={form.control}
              name="level"
              label={t("customer.fields.level", "客户等级")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t("customer.fields.levelPlaceholder", "请选择客户等级")} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerLevelOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            {customerType === "enterprise" && (
              <>
                <FormField
                  control={form.control}
                  name="industry"
                  label={t("customer.fields.industry", "行业")}
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={t("customer.fields.industryPlaceholder", "请选择所属行业")} />
                      </SelectTrigger>
                      <SelectContent>
                        {industryOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="scale"
                  label={t("customer.fields.scale", "企业规模")}
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={t("customer.fields.scalePlaceholder", "请选择企业规模")} />
                      </SelectTrigger>
                      <SelectContent>
                        {scaleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
              </>
            )}
          </FormGrid>
        </FormSection>

        {/* Contact Info */}
        <FormSection title={t("customer.sections.contact", "联系信息")}>
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="contactName"
              label={t("customer.fields.contactName", "联系人")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.contactNamePlaceholder", "请输入联系人姓名")}
                  error={!!errors.contactName}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="contactPhone"
              label={t("customer.fields.contactPhone", "联系电话")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  placeholder={t("customer.fields.contactPhonePlaceholder", "请输入手机号码")}
                  error={!!errors.contactPhone}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="contactEmail"
              label={t("customer.fields.contactEmail", "联系邮箱")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder={t("customer.fields.contactEmailPlaceholder", "请输入邮箱地址")}
                  error={!!errors.contactEmail}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="website"
              label={t("customer.fields.website", "公司网站")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.websitePlaceholder", "如：https://www.example.com")}
                  error={!!errors.website}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="province"
              label={t("customer.fields.province", "省份")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.provincePlaceholder", "如：北京市")}
                  error={!!errors.province}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="city"
              label={t("customer.fields.city", "城市")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.cityPlaceholder", "如：北京市")}
                  error={!!errors.city}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="district"
              label={t("customer.fields.district", "区县")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.districtPlaceholder", "如：朝阳区")}
                  error={!!errors.district}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="address"
              label={t("customer.fields.address", "详细地址")}
              containerClassName="col-span-2"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.addressPlaceholder", "请输入详细地址")}
                  error={!!errors.address}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="fax"
              label={t("customer.fields.fax", "传真")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.faxPlaceholder", "请输入传真号码")}
                  error={!!errors.fax}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="socialMedia"
              label={t("customer.fields.socialMedia", "社交媒体")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder={t("customer.fields.socialMediaPlaceholder", "如微信/微博账号")}
                  error={!!errors.socialMedia}
                />
              )}
            </FormField>
          </FormGrid>
        </FormSection>

        {/* Enterprise Info */}
        {customerType === "enterprise" && (
          <FormSection title={t("customer.sections.enterprise", "企业信息")}>
            <FormGrid cols={2}>
              <FormField
                control={form.control}
                name="registeredCapital"
                label={t("customer.fields.registeredCapital", "注册资本")}
                containerClassName="col-span-1"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder={t("customer.fields.registeredCapitalPlaceholder", "请输入注册资本")}
                    error={!!errors.registeredCapital}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === '' ? undefined : Number(val))
                    }}
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="businessLicense"
                label={t("customer.fields.businessLicense", "营业执照号")}
                containerClassName="col-span-1"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("customer.fields.businessLicensePlaceholder", "请输入营业执照号")}
                    error={!!errors.businessLicense}
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="unifiedCreditCode"
                label={t("customer.fields.unifiedCreditCode", "统一社会信用代码")}
                containerClassName="col-span-2"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("customer.fields.unifiedCreditCodePlaceholder", "请输入 18 位统一社会信用代码")}
                    error={!!errors.unifiedCreditCode}
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="annualRevenue"
                label={t("customer.fields.annualRevenue", "年营收")}
                containerClassName="col-span-1"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder={t("customer.fields.annualRevenuePlaceholder", "请输入年营收")}
                    error={!!errors.annualRevenue}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === '' ? undefined : Number(val))
                    }}
                  />
                )}
              </FormField>
            </FormGrid>
          </FormSection>
        )}

        {/* Other Info */}
        <FormSection title={t("customer.sections.other", "其他信息")}>
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="status"
              label={t("customer.fields.status", "客户状态")}
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Select
                  value={field.value ?? defaultValues.status}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t("customer.fields.statusPlaceholder", "请选择客户状态")} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerStatusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField
              control={form.control}
              name="description"
              label={t("customer.fields.description", "客户描述")}
              containerClassName="col-span-2"
            >
              {({ field }) => (
                <Textarea
                  {...field}
                  placeholder={t("customer.fields.descriptionPlaceholder", "请输入客户描述")}
                  error={!!errors.description}
                  rows={4}
                  className="resize-none"
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="remark"
              label={t("customer.fields.remark", "备注")}
              containerClassName="col-span-2"
            >
              {({ field }) => (
                <Textarea
                  {...field}
                  placeholder={t("customer.fields.remarkPlaceholder", "请输入备注信息")}
                  error={!!errors.remark}
                  rows={3}
                  className="resize-none"
                />
              )}
            </FormField>
          </FormGrid>
        </FormSection>

        {/* Actions */}
        <FormActions>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || loading}
            >
              {t("common.cancel", "取消")}
            </Button>
          )}

          {mode === "create" && enableAutoSave && (
            <Button
              type="button"
              variant="secondary"
              onClick={saveDraft}
              disabled={isSubmitting || loading || !hasUnsavedChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              {t("customer.saveDraft", "保存草稿")}
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
                {t("customer.submitting", "提交中...")}
              </>
            ) : mode === "create" ? (
              t("customer.create", "创建")
            ) : (
              t("customer.save", "保存")
            )}
          </Button>
        </FormActions>
      </form>
    </FormProvider>
  )
}

export type { CustomerFormValues }
