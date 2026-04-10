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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  contactPersonSchema,
  type ContactPersonFormValues,
  contactPersonDefaultValues,
} from "@/schemas/contactPerson"
import { cn } from "@/lib/utils"

// ============================================================
// Draft Storage Key
// ============================================================
const DRAFT_STORAGE_KEY = "contact_person_form_draft"

// ============================================================
// Select Options
// ============================================================
const genderOptions = [
  { label: "�?, value: "�? },
  { label: "�?, value: "�? },
  { label: "未知", value: "未知" },
]

const jobLevelOptions = [
  { label: "高管", value: "高管" },
  { label: "中层", value: "中层" },
  { label: "基层", value: "基层" },
  { label: "其他", value: "其他" },
]

const decisionRoleOptions = [
  { label: "决策�?, value: "决策�? },
  { label: "影响�?, value: "影响�? },
  { label: "使用�?, value: "使用�? },
  { label: "把关�?, value: "把关�? },
  { label: "其他", value: "其他" },
]

const educationOptions = [
  { label: "高中及以�?, value: "高中及以�? },
  { label: "大专", value: "大专" },
  { label: "本科", value: "本科" },
  { label: "硕士", value: "硕士" },
  { label: "博士", value: "博士" },
  { label: "其他", value: "其他" },
]

const statusOptions = [
  { label: "正常", value: "正常" },
  { label: "离职", value: "离职" },
  { label: "无效", value: "无效" },
]

// ============================================================
// ContactPersonForm Props
// ============================================================
export interface ContactPersonFormProps {
  initialValues?: Partial<ContactPersonFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: ContactPersonFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
  enableAutoSave?: boolean
  draftKey?: string
}

// ============================================================
// ContactPersonForm Component
// ============================================================
export function ContactPersonForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
  enableAutoSave = true,
  draftKey,
}: ContactPersonFormProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedValuesRef = useRef<string>("")

  const storageKey = draftKey || `${DRAFT_STORAGE_KEY}_${mode}`

  const form = useForm<ContactPersonFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactPersonSchema) as any,
    defaultValues: {
      ...contactPersonDefaultValues,
      ...initialValues,
    } as ContactPersonFormValues,
    mode: "onBlur",
  })

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    getValues,
  } = form

  const hasUnsavedChanges = Object.keys(dirtyFields).length > 0

  // Load draft on mount (for create mode)
  useEffect(() => {
    if (mode === "create" && enableAutoSave) {
      const savedDraft = localStorage.getItem(storageKey)
      if (savedDraft) {
        try {
          const draftValues = JSON.parse(savedDraft)
          if (draftValues && Object.keys(draftValues).length > 0) {
            reset({ ...contactPersonDefaultValues, ...draftValues } as ContactPersonFormValues)
            toast({
              title: "已加载草�?,
              description: "之前的表单数据已恢复",
              duration: 3000,
            })
          }
        } catch (e) {
          console.error("Failed to load draft:", e)
        }
      }
    }
  }, [mode, enableAutoSave, reset, storageKey, toast])

  // Auto-save draft
  const saveDraft = useCallback((values: Partial<ContactPersonFormValues>) => {
    if (mode === "edit" || !enableAutoSave) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(values))
    } catch (e) {
      console.error("Failed to save draft:", e)
    }
  }, [mode, enableAutoSave, storageKey])

  // Watch form changes for auto-save
  useEffect(() => {
    if (!enableAutoSave || mode === "edit") return

    const subscription = watch((values) => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
      autoSaveTimerRef.current = setTimeout(() => {
        const currentValues = getValues()
        const currentValueStr = JSON.stringify(currentValues)
        if (currentValueStr !== lastSavedValuesRef.current) {
          saveDraft(currentValues)
          lastSavedValuesRef.current = currentValueStr
        }
      }, 1000)
    })

    return () => {
      subscription.unsubscribe()
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [watch, saveDraft, enableAutoSave, mode, getValues])

  // Clear draft on successful submit
  useEffect(() => {
    if (!isSubmitting && !loading && mode === "create") {
      const savedDraft = localStorage.getItem(storageKey)
      if (savedDraft) {
        localStorage.removeItem(storageKey)
      }
    }
  }, [isSubmitting, loading, mode, storageKey])

  // Clear draft on cancel
  const handleCancel = useCallback(() => {
    if (mode === "create" && enableAutoSave) {
      localStorage.removeItem(storageKey)
    }
    onCancel?.()
  }, [mode, enableAutoSave, storageKey, onCancel])

  // Clear draft
  const handleClearDraft = useCallback(() => {
    localStorage.removeItem(storageKey)
    reset(contactPersonDefaultValues as ContactPersonFormValues)
    toast({
      title: "草稿已清�?,
      duration: 2000,
    })
  }, [storageKey, reset, toast])

  const onSubmitForm = handleSubmit(async (values) => {
    await onSubmit(values)
    if (mode === "create" && enableAutoSave) {
      localStorage.removeItem(storageKey)
    }
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmitForm} className={cn("space-y-6", className)}>
        {/* 基本信息 */}
        <FormSection title="基本信息">
          <FormGrid cols={2}>
            <FormField
              name="name"
              label="姓名"
              required
              error={errors.name}
            >
              <Input placeholder="请输入联系人姓名" />
            </FormField>

            <FormField
              name="gender"
              label="性别"
              error={errors.gender}
            >
              <RadioGroup>
                {genderOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                    <label
                      htmlFor={`gender-${option.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormField>

            <FormField
              name="position"
              label="职位"
              error={errors.position}
            >
              <Input placeholder="请输入职�? />
            </FormField>

            <FormField
              name="jobLevel"
              label="职级"
              error={errors.jobLevel}
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择职级" />
                </SelectTrigger>
                <SelectContent>
                  {jobLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              name="decisionRole"
              label="决策角色"
              error={errors.decisionRole}
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择决策角色" />
                </SelectTrigger>
                <SelectContent>
                  {decisionRoleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              name="status"
              label="状�?
              error={errors.status}
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择状�? />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              name="isPrimary"
              label="主要联系�?
              error={errors.isPrimary}
              className="col-span-2"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={watch("isPrimary")}
                  onCheckedChange={(checked) => {
                    form.setValue("isPrimary", checked === true)
                  }}
                />
                <label
                  htmlFor="isPrimary"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  设为主要联系�?                </label>
              </div>
            </FormField>
          </FormGrid>
        </FormSection>

        {/* 联系信息 */}
        <FormSection title="联系信息">
          <FormGrid cols={2}>
            <FormField
              name="mobile"
              label="手机号码"
              error={errors.mobile}
            >
              <Input placeholder="请输入手机号�? />
            </FormField>

            <FormField
              name="officePhone"
              label="办公电话"
              error={errors.officePhone}
            >
              <Input placeholder="请输入办公电�? />
            </FormField>

            <FormField
              name="email"
              label="邮箱"
              error={errors.email}
            >
              <Input type="email" placeholder="请输入邮箱地址" />
            </FormField>

            <FormField
              name="wechat"
              label="微信"
              error={errors.wechat}
            >
              <Input placeholder="请输入微信号" />
            </FormField>

            <FormField
              name="qq"
              label="QQ"
              error={errors.qq}
            >
              <Input placeholder="请输�?QQ �? />
            </FormField>

            <FormField
              name="address"
              label="办公地址"
              error={errors.address}
              className="col-span-2"
            >
              <Textarea placeholder="请输入办公地址" rows={2} />
            </FormField>
          </FormGrid>
        </FormSection>

        {/* 关联客户 */}
        <FormSection title="关联客户">
          <FormGrid cols={1}>
            <FormField
              name="customerId"
              label="关联客户"
              required
              error={errors.customerId}
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择关联客户" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer1">示例客户 1</SelectItem>
                  <SelectItem value="customer2">示例客户 2</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormGrid>
        </FormSection>

        {/* 个人信息 */}
        <FormSection title="个人信息">
          <FormGrid cols={2}>
            <FormField
              name="birthday"
              label="生日"
              error={errors.birthday}
            >
              <Input type="date" />
            </FormField>

            <FormField
              name="joinDate"
              label="入职时间"
              error={errors.joinDate}
            >
              <Input type="date" />
            </FormField>

            <FormField
              name="school"
              label="毕业院校"
              error={errors.school}
            >
              <Input placeholder="请输入毕业院�? />
            </FormField>

            <FormField
              name="education"
              label="学历"
              error={errors.education}
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择学历" />
                </SelectTrigger>
                <SelectContent>
                  {educationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              name="major"
              label="专业"
              error={errors.major}
            >
              <Input placeholder="请输入专�? />
            </FormField>

            <FormField
              name="hobbies"
              label="兴趣爱好"
              error={errors.hobbies}
              className="col-span-2"
            >
              <Textarea placeholder="请输入兴趣爱�? rows={2} />
            </FormField>
          </FormGrid>
        </FormSection>

        {/* 备注 */}
        <FormSection title="备注">
          <FormField
            name="remark"
            label=""
            error={errors.remark}
          >
            <Textarea placeholder="请输入备注信�? rows={4} />
          </FormField>
        </FormSection>

        {/* 表单操作 */}
        <FormActions>
          {mode === "create" && enableAutoSave && hasUnsavedChanges && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearDraft}
              className="mr-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              清除草稿
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading || isSubmitting}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading || isSubmitting}>
            {loading || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存�?..
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存
              </>
            )}
          </Button>
        </FormActions>
      </form>
    </FormProvider>
  )
}

export default ContactPersonForm
