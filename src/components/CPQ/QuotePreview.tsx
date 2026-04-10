/**
 * 报价预览组件
 * Quote Preview Component - 用于实时预览报价单内容和格式
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Printer, Download, Calendar, User, Building2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import { QuoteItem, QuoteStatus, QuoteStatusLabels } from '@/types/cpq'

interface QuotePreviewProps {
  quoteNumber?: string
  customerName?: string
  contactName?: string
  validUntil?: string
  status?: QuoteStatus
  products?: QuoteItem[]
  items?: QuoteItem[]  // 兼容旧代码
  subtotal: number
  totalDiscount: number
  totalTax: number
  grandTotal: number
  notes?: string
  terms?: string
  showActions?: boolean
  onExportPdf?: () => void
  onPrint?: () => void
}

/** 报价单状态徽章颜色映射 */
const statusColorMap: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-700 border-gray-200',
  [QuoteStatus.SENT]: 'bg-blue-100 text-blue-700 border-blue-200',
  [QuoteStatus.ACCEPTED]: 'bg-green-100 text-green-700 border-green-200',
  [QuoteStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
  [QuoteStatus.EXPIRED]: 'bg-orange-100 text-orange-700 border-orange-200',
  [QuoteStatus.REVISED]: 'bg-purple-100 text-purple-700 border-purple-200',
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({
  quoteNumber,
  customerName,
  contactName,
  validUntil,
  status,
  products,
  items,
  subtotal,
  totalDiscount,
  totalTax,
  grandTotal,
  notes,
  terms,
  showActions = true,
  onExportPdf,
  onPrint,
}) => {
  // 兼容 items 和 products props
  const quoteItems = items || products || []
  const { t } = useTranslation()

  /** 打印报价单 */
  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      // 默认打印行为
      window.print()
    }
  }

  /** 导出 PDF */
  const handleExportPdf = () => {
    if (onExportPdf) {
      onExportPdf()
    } else {
      // 默认导出提示
      console.log('Export PDF functionality to be implemented')
    }
  }

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            报价单预览
          </CardTitle>
          {showActions && (
            <div className="flex items-center gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                打印
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <Download className="h-4 w-4 mr-2" />
                导出 PDF
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 报价单头部信息 */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-4 bg-muted/30 rounded-lg print:bg-white">
          {/* 报价单号 */}
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">报价单号：</span>
            <span className="font-medium">
              {quoteNumber || '待生成'}
            </span>
          </div>

          {/* 状态 */}
          {status && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">状态：</span>
              <Badge className={statusColorMap[status]}>
                {QuoteStatusLabels[status]}
              </Badge>
            </div>
          )}

          {/* 客户名称 */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">客户：</span>
            <span className="font-medium">
              {customerName || '未选择'}
            </span>
          </div>

          {/* 联系人 */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">联系人：</span>
            <span className="font-medium">
              {contactName || '未选择'}
            </span>
          </div>

          {/* 有效期 */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">有效期至：</span>
            <span className="font-medium">
              {validUntil || '未设置'}
            </span>
          </div>

          {/* 创建日期 */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">创建日期：</span>
            <span className="font-medium">
              {new Date().toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>

        <Separator />

        {/* 产品明细表格 */}
        <div>
          <h3 className="text-base font-semibold mb-3">产品明细</h3>
          <ScrollArea className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 print:bg-gray-100">
                  <TableHead className="w-[250px]">产品名称</TableHead>
                  <TableHead className="w-[80px] text-right">数量</TableHead>
                  <TableHead className="w-[120px] text-right">单价</TableHead>
                  <TableHead className="w-[80px] text-right">折扣</TableHead>
                  <TableHead className="w-[120px] text-right">小计</TableHead>
                  <TableHead className="w-[100px] text-right">税费</TableHead>
                  <TableHead className="w-[120px] text-right">合计</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quoteItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-16 text-center text-muted-foreground">
                      暂无产品
                    </TableCell>
                  </TableRow>
                ) : (
                  quoteItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.productName}</span>
                          {item.productSku && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {item.productSku}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ¥{item.unitPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.discount > 0 ? `${item.discount}%` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{item.subtotal.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ¥{item.tax.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ¥{item.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* 价格汇总 */}
        <div className="p-4 bg-muted/30 rounded-lg print:bg-white">
          <div className="flex justify-end">
            <div className="w-[300px] space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">小计：</span>
                <span className="font-medium">¥{subtotal.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">折扣：</span>
                <span className="text-red-600 font-medium">
                  -¥{totalDiscount.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">税费 (13%)：</span>
                <span className="font-medium">¥{totalTax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">总计：</span>
                <span className="text-2xl font-bold text-primary">
                  ¥{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* 备注和条款 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-semibold mb-2">备注</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {notes || '无'}
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">条款和条件</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {terms || '无'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/** 报价预览打印样式组件 */
export const QuotePrintView: React.FC<QuotePreviewProps> = (props) => {
  return (
    <div className="print:block hidden">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div className="print-area">
        <QuotePreview {...props} showActions={false} />
      </div>
    </div>
  )
}

export default QuotePreview