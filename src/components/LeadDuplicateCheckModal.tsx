/**
 * 线索查重对话框组件
 * Lead Duplicate Check Modal - Check for duplicate leads before creation
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle, XCircle, Merge, SkipForward, Replace, Plus } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

import type { Lead } from '@/types/lead'
import type {
  DuplicateCheckResult,
  DuplicateCheckItem,
  DuplicateHandlingAction,
} from '@/types/lead'
import { useLeadDuplicateCheck } from '@/hooks/useLeadDuplicateCheck'

// ============================================
// 配置常量
// ============================================

const MATCH_TYPE_LABELS: Record<'phone' | 'email' | 'name', string> = {
  phone: '电话匹配',
  email: '邮箱匹配',
  name: '名称匹配',
}

const MATCH_TYPE_COLORS: Record<'phone' | 'email' | 'name', string> = {
  phone: 'bg-red-100 text-red-800',
  email: 'bg-blue-100 text-blue-800',
  name: 'bg-yellow-100 text-yellow-800',
}

const SIMILARITY_THRESHOLDS = {
  HIGH: 90,
  MEDIUM: 70,
  LOW: 50,
}

// ============================================
// 子组件：重复线索项
// ============================================

interface DuplicateLeadItemProps {
  duplicate: DuplicateCheckItem
  onSelect: (id: string) => void
  selectedId?: string
}

const DuplicateLeadItem: React.FC<DuplicateLeadItemProps> = ({
  duplicate,
  onSelect,
  selectedId,
}) => {
  const { t } = useTranslation()
  const isSelected = selectedId === duplicate.id

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= SIMILARITY_THRESHOLDS.HIGH) {
      return 'text-red-600 font-semibold'
    }
    if (similarity >= SIMILARITY_THRESHOLDS.MEDIUM) {
      return 'text-orange-600'
    }
    return 'text-yellow-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '新建':
        return 'bg-blue-100 text-blue-800'
      case '跟进中':
        return 'bg-green-100 text-green-800'
      case '已转化':
        return 'bg-purple-100 text-purple-800'
      case '已放弃':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary bg-primary/5'
      )}
      onClick={() => onSelect(duplicate.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-base">{duplicate.name}</h4>
              <Badge variant="secondary" className={getStatusColor(duplicate.status)}>
                {duplicate.status}
              </Badge>
            </div>

            {duplicate.company && (
              <p className="text-sm text-muted-foreground">{duplicate.company}</p>
            )}

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">📞 {duplicate.phone}</span>
              <span className="text-muted-foreground">✉️ {duplicate.email}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge className={MATCH_TYPE_COLORS[duplicate.matchType]}>
                {MATCH_TYPE_LABELS[duplicate.matchType]}
              </Badge>
              <span className={getSimilarityColor(duplicate.similarity)}>
                相似度：{duplicate.similarity}%
              </span>
            </div>
          </div>

          <div className="flex items-center">
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 主组件
// ============================================

interface LeadDuplicateCheckModalProps {
  /** 对话框是否打开 */
  open: boolean
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void
  /** 查重参数 */
  checkParams: {
    leadId?: string
    name?: string
    phone?: string
    email?: string
    company?: string
  }
  /** 查重完成回调 */
  onComplete: (action: DuplicateHandlingAction, selectedLeadId?: string) => void
  /** 取消回调 */
  onCancel?: () => void
}

export const LeadDuplicateCheckModal: React.FC<LeadDuplicateCheckModalProps> = ({
  open,
  onOpenChange,
  checkParams,
  onComplete,
  onCancel,
}) => {
  const { t } = useTranslation()
  const { checkDuplicatesWithMock, result, isChecking, reset } = useLeadDuplicateCheck()
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>()
  const [handlingAction, setHandlingAction] = useState<DuplicateHandlingAction>('create_new')

  // 对话框打开时自动执行查重
  useEffect(() => {
    if (open && (checkParams.phone || checkParams.email || checkParams.name)) {
      checkDuplicatesWithMock(checkParams)
      setSelectedLeadId(undefined)
      setHandlingAction('create_new')
    }
  }, [open, checkParams, checkDuplicatesWithMock])

  // 对话框关闭时重置
  useEffect(() => {
    if (!open) {
      reset()
      setSelectedLeadId(undefined)
    }
  }, [open, reset])

  const handleComplete = () => {
    onComplete(handlingAction, selectedLeadId)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const getAlertConfig = () => {
    if (!result) return null

    if (!result.hasDuplicates) {
      return {
        variant: 'success' as const,
        icon: CheckCircle,
        title: '未发现重复线索',
        description: '可以继续创建新线索',
      }
    }

    if (result.maxSimilarity >= SIMILARITY_THRESHOLDS.HIGH) {
      return {
        variant: 'destructive' as const,
        icon: AlertTriangle,
        title: '发现高度相似的线索',
        description: `发现 ${result.duplicates.length} 个重复线索，最高相似度 ${result.maxSimilarity}%`,
      }
    }

    if (result.maxSimilarity >= SIMILARITY_THRESHOLDS.MEDIUM) {
      return {
        variant: 'warning' as const,
        icon: AlertTriangle,
        title: '发现可能重复的线索',
        description: `发现 ${result.duplicates.length} 个可能重复的线索，建议检查`,
      }
    }

    return {
      variant: 'info' as const,
      icon: AlertTriangle,
      title: '发现相似线索',
      description: `发现 ${result.duplicates.length} 个相似线索，请确认是否继续`,
    }
  }

  const alertConfig = getAlertConfig()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            线索查重
          </DialogTitle>
          <DialogDescription>
            系统正在检查是否存在重复的线索...
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4">
            {/* 查重参数预览 */}
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">查重条件</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {checkParams.name && (
                    <div>
                      <span className="text-muted-foreground">名称：</span>
                      <span>{checkParams.name}</span>
                    </div>
                  )}
                  {checkParams.phone && (
                    <div>
                      <span className="text-muted-foreground">电话：</span>
                      <span>{checkParams.phone}</span>
                    </div>
                  )}
                  {checkParams.email && (
                    <div>
                      <span className="text-muted-foreground">邮箱：</span>
                      <span>{checkParams.email}</span>
                    </div>
                  )}
                  {checkParams.company && (
                    <div>
                      <span className="text-muted-foreground">公司：</span>
                      <span>{checkParams.company}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 加载状态 */}
            {isChecking && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="ml-2 text-muted-foreground">正在查重...</span>
              </div>
            )}

            {/* 查重结果 */}
            {!isChecking && alertConfig && result && (
              <>
                <Alert variant={alertConfig.variant}>
                  <alertConfig.icon className="h-4 w-4" />
                  <AlertTitle>{alertConfig.title}</AlertTitle>
                  <AlertDescription>{alertConfig.description}</AlertDescription>
                </Alert>

                {/* 匹配统计 */}
                {result.hasDuplicates && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-3">匹配统计</h4>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className={MATCH_TYPE_COLORS.phone}>
                            📞 {result.matchStats.phoneMatches}
                          </Badge>
                          <span className="text-muted-foreground">电话匹配</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={MATCH_TYPE_COLORS.email}>
                            ✉️ {result.matchStats.emailMatches}
                          </Badge>
                          <span className="text-muted-foreground">邮箱匹配</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={MATCH_TYPE_COLORS.name}>
                            👤 {result.matchStats.nameMatches}
                          </Badge>
                          <span className="text-muted-foreground">名称匹配</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 重复线索列表 */}
                {result.hasDuplicates && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">重复线索列表</h4>
                    {result.duplicates.map((duplicate) => (
                      <DuplicateLeadItem
                        key={duplicate.id}
                        duplicate={duplicate}
                        onSelect={setSelectedLeadId}
                        selectedId={selectedLeadId}
                      />
                    ))}
                  </div>
                )}

                {/* 处理方式选择 */}
                {result.hasDuplicates && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-3">处理方式</h4>
                      <RadioGroup
                        value={handlingAction}
                        onValueChange={(value) => setHandlingAction(value as DuplicateHandlingAction)}
                        className="space-y-2"
                      >
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="create_new" id="create_new" />
                          <Label htmlFor="create_new" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <div>
                                <div className="font-medium">创建新线索</div>
                                <div className="text-xs text-muted-foreground">
                                  忽略重复，继续创建新线索
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="merge" id="merge" />
                          <Label htmlFor="merge" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Merge className="h-4 w-4" />
                              <div>
                                <div className="font-medium">合并线索</div>
                                <div className="text-xs text-muted-foreground">
                                  将信息合并到选中的线索
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="skip" id="skip" />
                          <Label htmlFor="skip" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <SkipForward className="h-4 w-4" />
                              <div>
                                <div className="font-medium">跳过</div>
                                <div className="text-xs text-muted-foreground">
                                  放弃创建，使用现有线索
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="override" id="override" />
                          <Label htmlFor="override" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Replace className="h-4 w-4" />
                              <div>
                                <div className="font-medium">覆盖</div>
                                <div className="text-xs text-muted-foreground">
                                  用新信息覆盖现有线索
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* 无查重条件 */}
            {!isChecking && !result && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>无法执行查重</AlertTitle>
                <AlertDescription>
                  请至少提供电话、邮箱或名称其中之一
                </AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          {!result?.hasDuplicates ? (
            <Button onClick={handleComplete} disabled={isChecking}>
              继续创建
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isChecking}>
              确认处理
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeadDuplicateCheckModal
