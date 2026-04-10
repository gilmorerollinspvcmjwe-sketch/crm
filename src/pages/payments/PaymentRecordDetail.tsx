"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, CheckCircle, RotateCcw, FileText, User, Calendar, DollarSign, Building, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PaymentRecord, ReconciliationStatus } from "@/types/paymentRecord"
import { paymentRecordData } from "@/mock/paymentRecordData"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// ============ Status Badge ============

const statusConfig: Record<ReconciliationStatus, { label: string; className: string }> = {
  "待核销": { label: "待核销", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "已核销": { label: "已核销", className: "bg-green-100 text-green-800 border-green-200" },
  "已驳回": { label: "已驳回", className: "bg-red-100 text-red-800 border-red-200" },
  "部分核销": { label: "部分核销", className: "bg-blue-100 text-blue-800 border-blue-200" },
}

function StatusBadge({ status }: { status: ReconciliationStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

// ============ Format Currency ============

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ============ Component ============

export function PaymentRecordDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [showVerifyModal, setShowVerifyModal] = React.useState(false)
  const [showRejectModal, setShowRejectModal] = React.useState(false)
  const [record, setRecord] = React.useState<PaymentRecord | null>(null)

  // Find record by ID
  React.useEffect(() => {
    if (id) {
      const found = paymentRecordData.find(r => r.id === id)
      if (found) {
        setRecord(found)
      }
    }
  }, [id])

  const handleVerify = (values: any) => {
    console.log("核销回款:", values)
    setRecord(prev => prev ? { 
      ...prev, 
      reconciliationStatus: "已核销",
      paidAmount: prev.amount,
      paidDate: new Date().toISOString().split('T')[0],
    } : null)
    setShowVerifyModal(false)
    toast({ title: "回款已核销" })
  }

  const handleReject = (reason: string) => {
    console.log("驳回回款:", reason)
    setRecord(prev => prev ? { 
      ...prev, 
      reconciliationStatus: "已驳回",
    } : null)
    setShowRejectModal(false)
    toast({ title: "回款已驳回", variant: "destructive" })
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">回款记录不存在</p>
        </div>
      </div>
    )
  }

  const reconciliationStatus = record.reconciliationStatus || "待核销"

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{record.code}</h1>
              <p className="text-muted-foreground">{record.contractName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={reconciliationStatus} />
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">回款编号</label>
              <p className="font-medium">{record.code}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" /> 合同名称
              </label>
              <p className="font-medium">{record.contractName || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" /> 客户
              </label>
              <p className="font-medium">{record.customerName}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> 负责人
              </label>
              <p className="font-medium">{record.assignee}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">支付方式</label>
              <p className="font-medium">{record.method}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">核销状态</label>
              <StatusBadge status={reconciliationStatus} />
            </div>
          </CardContent>
        </Card>

        {/* Amount Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              金额信息
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> 计划金额
              </label>
              <p className="text-xl font-bold">{formatCurrency(record.amount)}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> 已核销金额
              </label>
              <p className="text-xl font-bold text-green-600">{formatCurrency(record.paidAmount || 0)}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">待核销金额</label>
              <p className={cn(
                "text-xl font-bold",
                record.amount - (record.paidAmount || 0) > 0 ? "text-yellow-600" : "text-green-600"
              )}>
                {formatCurrency(record.amount - (record.paidAmount || 0))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              收款信息
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {record.bankAccount && (
              <div>
                <label className="text-sm text-muted-foreground">银行账号</label>
                <p className="font-medium">{record.bankAccount}</p>
              </div>
            )}
            {record.receiptNo && (
              <div>
                <label className="text-sm text-muted-foreground">票据号码</label>
                <p className="font-medium">{record.receiptNo}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              日期信息
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> 应付日期
              </label>
              <p className="font-medium">{record.dueDate}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> 实付日期
              </label>
              <p className="font-medium">{record.paidDate || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Remark */}
        {record.remark && (
          <Card>
            <CardHeader>
              <CardTitle>备注</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{record.remark}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {reconciliationStatus === "待核销" && (
                <>
                  <Button onClick={() => setShowVerifyModal(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    核销
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectModal(true)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    驳回
                  </Button>
                </>
              )}
              {reconciliationStatus === "部分核销" && (
                <>
                  <Button onClick={() => setShowVerifyModal(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    继续核销
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectModal(true)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    驳回
                  </Button>
                </>
              )}
              {reconciliationStatus === "已驳回" && (
                <Button variant="outline" onClick={() => setShowEditModal(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  重新提交
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>编辑回款记录</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">编辑功能开发中...</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>取消</Button>
              <Button onClick={() => setShowEditModal(false)}>保存</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Verify Modal */}
        <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>核销回款</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">计划金额</label>
                <p className="font-medium">{formatCurrency(record.amount)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">待核销金额</label>
                <p className="font-medium">{formatCurrency(record.amount - (record.paidAmount || 0))}</p>
              </div>
              <Button onClick={() => handleVerify({ remark: "核销完成" })}>
                确认核销
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>驳回回款</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">请输入驳回原因：</p>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="请输入驳回原因..."
              />
              <Button 
                variant="destructive" 
                onClick={() => handleReject("用户输入的驳回原因")}
              >
                确认驳回
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default PaymentRecordDetail
