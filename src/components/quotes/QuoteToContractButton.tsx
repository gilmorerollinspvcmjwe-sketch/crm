/**
 * 报价转合同按钮组件
 * Quote to Contract Button Component
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useQuoteToContract } from '@/hooks/api/useQuoteToContract'
import type { Quote } from '@/types/cpq'

export interface QuoteToContractButtonProps {
  /** 报价单数据 */
  quote: Quote
  /** 转换成功后的回调 */
  onSuccess?: (contractId: string) => void
  /** 按钮变体 */
  variant?: 'default' | 'outline' | 'ghost'
  /** 按钮尺寸 */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义按钮文本 */
  buttonText?: string
}

/**
 * 报价转合同按钮组件
 * 点击后将报价单转换为合同草稿并跳转到合同编辑页
 */
export function QuoteToContractButton({
  quote,
  onSuccess,
  variant = 'default',
  size = 'default',
  disabled = false,
  showIcon = true,
  buttonText,
}: QuoteToContractButtonProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isConverting, convertToContract } = useQuoteToContract()
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)

  /**
   * 处理转换确认
   */
  const handleConfirmConvert = React.useCallback(async () => {
    setShowConfirmDialog(false)
    
    const result = await convertToContract(quote)
    
    if (result) {
      // 调用成功回调
      onSuccess?.(result.quoteId)
      
      // 跳转到合同列表页或合同编辑页
      // 这里跳转到合同列表，实际项目中可以跳转到新合同编辑页并传入草稿数据
      toast({
        title: '转换成功',
        description: '即将跳转到合同列表',
      })
      
      // 延迟跳转，让用户看到提示
      setTimeout(() => {
        navigate('/contracts')
      }, 1000)
    }
  }, [quote, convertToContract, onSuccess, navigate, toast])

  /**
   * 处理按钮点击
   */
  const handleClick = React.useCallback(() => {
    // 显示确认对话框
    setShowConfirmDialog(true)
  }, [])

  /**
   * 检查报价单是否可以转换
   */
  const canConvert = React.useMemo(() => {
    // 只有已接受的报价单才能转合同
    return quote.status === 'accepted' || quote.status === 'sent'
  }, [quote.status])

  // 如果报价单状态不允许转换，不显示按钮
  if (!canConvert && !disabled) {
    return null
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled || isConverting || !canConvert}
        className="gap-2"
      >
        {isConverting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : showIcon ? (
          <FileText className="h-4 w-4" />
        ) : null}
        {buttonText || '转合同'}
      </Button>

      {/* 确认转换对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认转换</DialogTitle>
            <DialogDescription>
              将把报价单 <span className="font-medium text-foreground">{quote.quoteNumber}</span>{' '}
              转换为合同草稿。
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">报价单号</span>
                <span className="font-medium">{quote.quoteNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">客户名称</span>
                <span className="font-medium">{quote.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">合同金额</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                    minimumFractionDigits: 2,
                  }).format(quote.total || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">产品数量</span>
                <span className="font-medium">{quote.items?.length || 0} 项</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              转换后，报价单的产品明细、金额、客户信息等将自动填充到合同中。
              您可以在合同编辑页进一步修改和完善合同内容。
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isConverting}>
              取消
            </Button>
            <Button onClick={handleConfirmConvert} disabled={isConverting}>
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  转换中...
                </>
              ) : (
                '确认转换'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default QuoteToContractButton
