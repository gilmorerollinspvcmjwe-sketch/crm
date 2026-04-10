"use client"

import { useEffect, useState, useMemo } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Calculator, User, Building, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FormGrid, FormSection, FormActions, FormField } from "@/components/form"
import { opportunitySchema, type OpportunityFormValues } from "@/schemas"
import { useCustomers } from "@/hooks/api/useCustomers"
import type { Customer } from "@/types/api"
import { cn } from "@/lib/utils"

// ============ OpportunityForm Props ============

export interface OpportunityFormProps {
  initialValues?: Partial<OpportunityFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: OpportunityFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Stage Configuration ============

const STAGES = [
  { value: "初步接触", label: "初步接触", probability: 10, color: "bg-gray-500" },
  { value: "需求确认", label: "需求确认", probability: 30, color: "bg-blue-500" },
  { value: "方案报价", label: "方案报价", probability: 50, color: "bg-yellow-500" },
  { value: "合同谈判", label: "合同谈判", probability: 75, color: "bg-purple-500" },
  { value: "成交", label: "成交", probability: 100, color: "bg-green-500" },
  { value: "失败", label: "失败", probability: 0, color: "bg-red-500" },
]

const PRIORITIES = [
  { value: "低", label: "低", color: "bg-gray-100 text-gray-700" },
  { value: "中", label: "中", color: "bg-blue-100 text-blue-700" },
  { value: "高", label: "高", color: "bg-red-100 text-red-700" },
]

// ============ Default Values ============

const defaultValues: Partial<OpportunityFormValues> = {
  stage: "初步接触",
  priority: "中",
  amount: 0,
  probability: 10,
  discount: 0,
  actualAmount: undefined,
}

// ============ Customer Selector Component ============

interface CustomerSelectorProps {
  value?: string
  onChange: (value: string, customer?: Customer) => void
  customers?: Customer[]
  isLoading?: boolean
}

function CustomerSelector({ value, onChange, customers, isLoading }: CustomerSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  
  const selectedCustomer = customers?.find(c => c.id === value)
  
  const filteredCustomers = useMemo(() => {
    if (!customers) return []
    if (!search) return customers
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
    )
  }, [customers, search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px]"
        >
          {selectedCustomer ? (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">{selectedCustomer.name}</span>
                <span className="text-xs text-muted-foreground">{selectedCustomer.company}</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">选择客户...</span>
          )}
          <Search className="w-4 h-4 ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="搜索客户名称或公司..." 
            value={search || ""}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "加载中..." : "未找到匹配客户"}
            </CommandEmpty>
            <CommandGroup>
              {filteredCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={() => {
                    onChange(customer.id, customer)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Building className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-xs text-muted-foreground">{customer.company}</span>
                    </div>
                    {customer.id === value && (
                      <Badge variant="outline" className="ml-auto">已选择</Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============ Amount Calculator Component ============

interface AmountCalculatorProps {
  amount: number
  discount: number
  probability: number
  onChange: (field: string, value: number) => void
}

function AmountCalculator({ amount, discount, probability, onChange }: AmountCalculatorProps) {
  const discountAmount = amount * discount / 100
  const netAmount = amount - discountAmount
  const weightedAmount = netAmount * probability / 100

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calculator className="w-4 h-4" />
          金额计算
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">原始金额</p>
            <p className="font-semibold">{formatCurrency(amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">折扣比例</p>
            <p className="font-semibold">{discount}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">折扣金额</p>
            <p className="font-semibold text-red-500">-{formatCurrency(discountAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">净金额</p>
            <p className="font-semibold text-blue-600">{formatCurrency(netAmount)}</p>
          </div>
          <div className="col-span-2 pt-2 border-t">
            <p className="text-muted-foreground">加权金额 (概率 {probability}%)</p>
            <p className="font-bold text-lg text-primary">{formatCurrency(weightedAmount)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============ Helper Functions ============

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ============ OpportunityForm Component ============

export function OpportunityForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: OpportunityFormProps) {
  const form = useForm<OpportunityFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(opportunitySchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as OpportunityFormValues,
    mode: "onBlur",
  })

  const { data: customersData, isLoading: customersLoading } = useCustomers()

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const stage = watch("stage")
  const amount = watch("amount") || 0
  const discount = watch("discount") || 0
  const probability = watch("probability") || 0
  const customerId = watch("customerId")

  // 阶段变化时自动调整概率
  useEffect(() => {
    const stageConfig = STAGES.find(s => s.value === stage)
    if (stageConfig && stageConfig.probability !== probability) {
      setValue("probability", stageConfig.probability)
    }
  }, [stage, setValue, probability])

  // 重置表单
  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as OpportunityFormValues)
    }
  }, [initialValues, form])

  // 客户选择处理
  const handleCustomerChange = (value: string, customer?: Customer) => {
    setValue("customerId", value)
    if (customer) {
      // 可选：自动填充客户相关信息
      setValue("customerName", customer.name)
    }
  }

  // 快速设置概率
  const handleQuickProbability = (prob: number) => {
    setValue("probability", prob)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
        noValidate
      >
        {/* Basic Info */}
        <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="name"
            label="商机名称"
            required
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入商机名称，如：XX公司年度合作项目"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="customerId"
            label="关联客户"
            required
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <CustomerSelector
                value={field.value}
                onChange={handleCustomerChange}
                customers={customersData?.data}
                isLoading={customersLoading}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="stage"
            label="商机阶段"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择阶段" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", s.color)} />
                        <span>{s.label}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {s.probability}%
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={form.control}
            name="priority"
            label="优先级"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <Badge variant="outline" className={cn("text-xs", p.color)}>
                        {p.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Amount & Probability */}
      <FormSection title="金额与概率">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="amount"
            label="预计金额"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="请输入预计金额"
                error={!!errors.amount}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  field.onChange(value)
                  setValue("amount", value)
                }}
                className="text-right"
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="discount"
            label="折扣比例 (%)"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0"
                min={0}
                max={100}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  field.onChange(value)
                  setValue("discount", Math.min(100, Math.max(0, value)))
                }}
                className="text-right"
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="probability"
            label="成交概率"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <div className="space-y-2">
                <Input
                  {...field}
                  type="number"
                  placeholder="0-100"
                  min={0}
                  max={100}
                  error={!!errors.probability}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    field.onChange(Math.min(100, Math.max(0, value)))
                  }}
                  className="text-right"
                />
                {/* Quick probability buttons */}
                <div className="flex gap-2">
                  {[10, 25, 50, 75, 90, 100].map((prob) => (
                    <Button
                      key={prob}
                      type="button"
                      variant={probability === prob ? "default" : "outline"}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleQuickProbability(prob)}
                    >
                      {prob}%
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </FormField>

          {/* Amount Calculator */}
          <div className="col-span-2">
            <AmountCalculator
              amount={amount}
              discount={discount}
              probability={probability}
              onChange={(field, value) => setValue(field as any, value)}
            />
          </div>
        </FormGrid>
      </FormSection>

      {/* Timeline Info */}
      <FormSection title="时间信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="expectedCloseDate"
            label="预计成交日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.expectedCloseDate}
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
              <div className="relative">
                <Input
                  {...field}
                  placeholder="请输入负责人姓名"
                  error={!!errors.assignee}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* 成交信息 - 仅在成交或失败时显示 */}
      {(stage === "成交" || stage === "失败") && (
        <FormSection title="成交信息">
          <FormGrid cols={2}>
            <FormField
              control={form.control}
              name="actualCloseDate"
              label="实际成交日期"
              containerClassName="col-span-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  type="date"
                  error={!!errors.actualCloseDate}
                />
              )}
            </FormField>

            {stage === "成交" && (
              <FormField
                control={form.control}
                name="actualAmount"
                label="实际成交金额"
                containerClassName="col-span-1"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="请输入实际成交金额"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="text-right"
                  />
                )}
              </FormField>
            )}

            {stage === "失败" && (
              <FormField
                control={form.control}
                name="lostReason"
                label="失败原因"
                containerClassName="col-span-2"
              >
                {({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择失败原因" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="价格因素">价格因素</SelectItem>
                      <SelectItem value="竞争对手">竞争对手</SelectItem>
                      <SelectItem value="客户需求变更">客户需求变更</SelectItem>
                      <SelectItem value="客户预算不足">客户预算不足</SelectItem>
                      <SelectItem value="响应不及时">响应不及时</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            )}
          </FormGrid>
        </FormSection>
      )}

      {/* Notes */}
      <FormSection title="备注信息">
        <FormGrid cols={1}>
          <FormField
            control={form.control}
            name="notes"
            label="备注"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Textarea
                {...field}
                placeholder="请输入备注信息，如：客户特殊需求、谈判要点等"
                rows={4}
                error={!!errors.notes}
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
            "创建商机"
          ) : (
            "保存修改"
          )}
        </Button>
      </FormActions>
    </form>
    </FormProvider>
  )
}

export type { OpportunityFormValues }