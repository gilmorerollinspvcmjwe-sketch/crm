/**
 * 线索转化对话框组件
 * Lead Conversion Dialog - Convert leads to customers/contacts/opportunities
 */

import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  User,
  Briefcase,
  ArrowRight,
  Check,
  AlertTriangle,
  Loader2,
  Map,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'

import type {
  Lead,
  ConversionConfig,
  FieldMapping,
  ConversionTargetType,
  ConversionResult,
} from '@/types/lead'

// ============================================
// 配置常量
// ============================================

const TARGET_TYPE_CONFIG: Record<
  ConversionTargetType,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    description: string
    color: string
  }
> = {
  customer: {
    icon: Building2,
    label: '客户',
    description: '创建客户档案，记录公司信息',
    color: 'bg-blue-500',
  },
  contact: {
    icon: User,
    label: '联系人',
    description: '创建联系人，记录个人信息',
    color: 'bg-green-500',
  },
  opportunity: {
    icon: Briefcase,
    label: '商机',
    description: '创建商机，跟踪销售机会',
    color: 'bg-purple-500',
  },
}

// ============================================
// 字段映射配置
// ============================================

const FIELD_MAPPINGS: Record<ConversionTargetType, FieldMapping[]> = {
  customer: [
    {
      sourceField: 'company',
      targetField: 'name',
      label: '客户名称',
    },
    {
      sourceField: 'phone',
      targetField: 'phone',
      label: '联系电话',
    },
    {
      sourceField: 'email',
      targetField: 'email',
      label: '邮箱',
    },
    {
      sourceField: 'remark',
      targetField: 'description',
      label: '备注',
    },
  ],
  contact: [
    {
      sourceField: 'name',
      targetField: 'name',
      label: '姓名',
    },
    {
      sourceField: 'phone',
      targetField: 'mobile',
      label: '手机号',
    },
    {
      sourceField: 'email',
      targetField: 'email',
      label: '邮箱',
    },
    {
      sourceField: 'company',
      targetField: 'company',
      label: '公司',
    },
  ],
  opportunity: [
    {
      sourceField: 'name',
      targetField: 'name',
      label: '商机名称',
    },
    {
      sourceField: 'company',
      targetField: 'customerName',
      label: '客户名称',
    },
    {
      sourceField: 'budget',
      targetField: 'amount',
      label: '预计金额',
    },
    {
      sourceField: 'purchaseTimeframe',
      targetField: 'expectedCloseDate',
      label: '预计关闭日期',
    },
  ],
}

// ============================================
// 子组件：转化目标选择卡片
// ============================================

interface ConversionTargetCardProps {
  type: ConversionTargetType
  selected: boolean
  onToggle: (type: ConversionTargetType) => void
}

const ConversionTargetCard: React.FC<ConversionTargetCardProps> = ({
  type,
  selected,
  onToggle,
}) => {
  const { t } = useTranslation()
  const config = TARGET_TYPE_CONFIG[type]
  const Icon = config.icon

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary bg-primary/5'
      )}
      onClick={() => onToggle(type)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={selected} onCheckedChange={() => onToggle(type)} />
          <div
            className={cn(
              'rounded-full p-2',
              config.color,
              'text-white'
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{config.label}</div>
            <div className="text-xs text-muted-foreground">
              {config.description}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 子组件：字段映射预览行
// ============================================

interface FieldMappingRowProps {
  mapping: FieldMapping
  lead: Lead
}

const FieldMappingRow: React.FC<FieldMappingRowProps> = ({ mapping, lead }) => {
  const sourceValue = useMemo(() => {
    const value = (lead as unknown as Record<string, unknown>)[mapping.sourceField]
    return value ? String(value) : '-'
  }, [lead, mapping.sourceField])

  return (
    <div className="flex items-center gap-2 text-sm py-2">
      <div className="flex-1 text-muted-foreground">{mapping.label}</div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 font-medium truncate" title={sourceValue}>
        {sourceValue}
      </div>
    </div>
  )
}

// ============================================
// 主组件
// ============================================

interface LeadConversionDialogProps {
  /** 对话框是否打开 */
  open: boolean
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void
  /** 待转化的线索 */
  lead: Lead | null
  /** 转化成功回调 */
  onSuccess?: (result: ConversionResult) => void
  /** 取消回调 */
  onCancel?: () => void
}

export const LeadConversionDialog: React.FC<LeadConversionDialogProps> = ({
  open,
  onOpenChange,
  lead,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation()
  const [selectedTargets, setSelectedTargets] = useState<ConversionTargetType[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)

  // 构建转化配置
  const config: ConversionConfig = useMemo(() => {
    const fieldMappings: FieldMapping[] = []

    selectedTargets.forEach((targetType) => {
      const mappings = FIELD_MAPPINGS[targetType]
      fieldMappings.push(...mappings)
    })

    return {
      createCustomer: selectedTargets.includes('customer'),
      createContact: selectedTargets.includes('contact'),
      createOpportunity: selectedTargets.includes('opportunity'),
      fieldMappings,
    }
  }, [selectedTargets])

  // 重置状态
  useEffect(() => {
    if (open) {
      setSelectedTargets(['customer', 'contact']) // 默认选择客户和联系人
      setConversionResult(null)
    }
  }, [open])

  const handleToggleTarget = (type: ConversionTargetType) => {
    setSelectedTargets((prev) => {
      if (prev.includes(type)) {
        // 如果取消，确保至少保留一个
        if (prev.length > 1) {
          return prev.filter((t) => t !== type)
        }
        return prev
      }
      return [...prev, type]
    })
  }

  const handleConvert = async () => {
    if (!lead) return

    setIsConverting(true)

    try {
      // TODO: 替换为实际 API 调用
      // const response = await api.post('/leads/convert', {
      //   leadId: lead.id,
      //   config,
      // })
      // const result = response.data.data as ConversionResult

      // 模拟转化
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result: ConversionResult = {
        success: true,
        leadId: lead.id,
        convertedAt: new Date().toISOString(),
        customerId: config.createCustomer ? `CUST-${Date.now()}` : undefined,
        contactId: config.createContact ? `CONTACT-${Date.now()}` : undefined,
        opportunityId: config.createOpportunity ? `OPP-${Date.now()}` : undefined,
        message: '转化成功',
      }

      setConversionResult(result)

      toast({
        title: '转化成功',
        description: '线索已成功转化为客户/联系人/商机',
      })

      onSuccess?.(result)
    } catch (error) {
      toast({
        title: '转化失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  if (!lead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            线索转化
          </DialogTitle>
          <DialogDescription>
            将线索转化为客户、联系人和商机
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6">
            {/* 线索信息预览 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">线索信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">名称：</span>
                    <span className="font-medium">{lead.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">公司：</span>
                    <span className="font-medium">{lead.company || '-'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">电话：</span>
                    <span className="font-medium">{lead.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">邮箱：</span>
                    <span className="font-medium">{lead.email}</span>
                  </div>
                  {lead.budget && (
                    <div>
                      <span className="text-muted-foreground">预算：</span>
                      <span className="font-medium">{lead.budget}</span>
                    </div>
                  )}
                  {lead.source && (
                    <div>
                      <span className="text-muted-foreground">来源：</span>
                      <Badge variant="secondary">{lead.source}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 转化目标选择 */}
            <div>
              <h4 className="text-sm font-medium mb-3">选择创建内容</h4>
              <div className="grid gap-3">
                {(['customer', 'contact', 'opportunity'] as ConversionTargetType[]).map(
                  (type) => (
                    <ConversionTargetCard
                      key={type}
                      type={type}
                      selected={selectedTargets.includes(type)}
                      onToggle={handleToggleTarget}
                    />
                  )
                )}
              </div>
            </div>

            {/* 字段映射预览 */}
            {config.fieldMappings.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    字段映射预览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {config.fieldMappings.map((mapping, index) => (
                      <React.Fragment key={`${mapping.sourceField}-${index}`}>
                        <FieldMappingRow mapping={mapping} lead={lead} />
                        {index < config.fieldMappings.length - 1 && (
                          <Separator className="my-1" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 转化结果 */}
            {conversionResult && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">转化成功</AlertTitle>
                <AlertDescription className="text-green-700">
                  <div className="space-y-1 mt-2">
                    {conversionResult.customerId && (
                      <div>✅ 客户 ID: {conversionResult.customerId}</div>
                    )}
                    {conversionResult.contactId && (
                      <div>✅ 联系人 ID: {conversionResult.contactId}</div>
                    )}
                    {conversionResult.opportunityId && (
                      <div>✅ 商机 ID: {conversionResult.opportunityId}</div>
                    )}
                    <div className="text-xs mt-2">
                      转化时间：{new Date(conversionResult.convertedAt).toLocaleString()}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 提示信息 */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>注意事项</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>转化后线索状态将变更为"已转化"</li>
                  <li>可以根据需要选择创建一个或多个目标</li>
                  <li>字段会自动映射到对应的目标对象</li>
                  <li>转化操作不可撤销，请谨慎操作</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isConverting}>
            {conversionResult ? '关闭' : '取消'}
          </Button>
          {!conversionResult && (
            <Button onClick={handleConvert} disabled={isConverting || selectedTargets.length === 0}>
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  转化中...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  确认转化
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeadConversionDialog
