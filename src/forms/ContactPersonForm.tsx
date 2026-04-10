"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FormGrid, FormSection, FormActions, FormField } from "@/components/form"
import { useToast } from "@/hooks/use-toast"
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
  { label: "男", value: "男" },
  { label: "女", value: "女" },
  { label: "未知", value: "未知" },
]

const jobLevelOptions = [
  { label: "高管", value: "高管" },
  { label: "中层", value: "中层" },
  { label: "基层", value: "基层" },
  { label: "其他", value: "其他" },
]

const decisionRoleOptions = [
  { label: "决策者", value: "决策者" },
  { label: "影响者", value: "影响者" },
  { label: "使用者", value: "使用者" },
  { label: "把关者", value: "把关者" },
  { label: "其他", value: "其他" },
]

const educationOptions = [
  { label: "高中及以下", value: "高中及以下" },
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
}: ContactPersonFormProps) {
  const { toast } = useToast()
  const { t } = useTranslation()

  const form = useForm<ContactPersonFormValues>({
    resolver: zodResolver(contactPersonSchema),
    defaultValues: {
      ...contactPersonDefaultValues,
      ...initialValues,
    } as ContactPersonFormValues,
    mode: "onBlur",
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = form

  // 同步表单数据
  useEffect(() => {
    if (initialValues) {
      reset({ ...contactPersonDefaultValues, ...initialValues } as ContactPersonFormValues)
    }
  }, [initialValues, reset])

  // 处理提交
  const handleOnSubmit = async (values: ContactPersonFormValues) => {
    try {
      await onSubmit(values)
      toast({
        title: mode === "create" ? "创建成功" : "更新成功",
        description: "联系人信息已保存",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className={cn("space-y-6", className)}>
        {/* 基本信息 */}
        <FormSection title="基本信息">
          <FormGrid columns={2}>
            <FormField label="姓名" error={errors.name?.message} required>
              <Input
                {...form.register("name")}
                placeholder="请输入姓名"
                disabled={loading || isSubmitting}
              />
            </FormField>

            <FormField label="性别" error={errors.gender?.message}>
              <RadioGroup
                {...form.register("gender")}
                defaultValue={contactPersonDefaultValues.gender}
                className="flex gap-4"
                disabled={loading || isSubmitting}
              >
                {genderOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value={option.value} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </FormField>

            <FormField label="职位" error={errors.jobTitle?.message}>
              <Input
                {...form.register("jobTitle")}
                placeholder="请输入职位"
                disabled={loading || isSubmitting}
              />
            </FormField>

            <FormField label="部门" error={errors.department?.message}>
              <Input
                {...form.register("department")}
                placeholder="请输入部门"
                disabled={loading || isSubmitting}
              />
            </FormField>

            <FormField label="职级" error={errors.jobLevel?.message}>
              <Select
                {...form.register("jobLevel")}
                defaultValue={contactPersonDefaultValues.jobLevel}
                disabled={loading || isSubmitting}
              >
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

            <FormField label="决策角色" error={errors.decisionRole?.message}>
              <Select
                {...form.register("decisionRole")}
                defaultValue={contactPersonDefaultValues.decisionRole}
                disabled={loading || isSubmitting}
              >
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

            <FormField label="学历" error={errors.education?.message}>
              <Select
                {...form.register("education")}
                defaultValue={contactPersonDefaultValues.education}
                disabled={loading || isSubmitting}
              >
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

            <FormField label="状态" error={errors.status?.message}>
              <Select
                {...form.register("status")}
                defaultValue={contactPersonDefaultValues.status}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
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
          </FormGrid>
        </FormSection>

        {/* 联系方式 */}
        <FormSection title="联系方式">
          <FormGrid columns={2}>
            <FormField label="手机" error={errors.mobile?.message}>
              <Input
                {...form.register("mobile")}
                placeholder="请输入手机号"
                type="tel"
                disabled={loading || isSubmitting}
              />
            </FormField>

            <FormField label="电话" error={errors.phone?.message}>
              <Input
                {...form.register("phone")}
                placeholder="请输入电话"
                type="tel"
                disabled={loading || isSubmitting}
              />
            </FormField>

            <FormField label="邮箱" error={errors.email?.message}>
              <Input
                {...form.register("email")}
                placeholder="请输入邮箱"
                type="email"
                disabled={loading || isSubmitting}
              />
            </FormField>

            <FormField label="微信" error={errors.wechat?.message}>
              <Input
                {...form.register("wechat")}
                placeholder="请输入微信号"
                disabled={loading || isSubmitting}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        {/* 备注 */}
        <FormSection title="备注">
          <FormField error={errors.note?.message}>
            <Textarea
              {...form.register("note")}
              placeholder="请输入备注信息"
              rows={4}
              disabled={loading || isSubmitting}
            />
          </FormField>
        </FormSection>

        {/* 操作按钮 */}
        <FormActions>
          <Button type="submit" disabled={loading || isSubmitting}>
            {loading || isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === "create" ? "创建" : "保存"}
              </>
            )}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading || isSubmitting}>
              <RotateCcw className="w-4 h-4 mr-2" />
              取消
            </Button>
          )}
        </FormActions>
      </form>
    </FormProvider>
  )
}

export default ContactPersonForm
