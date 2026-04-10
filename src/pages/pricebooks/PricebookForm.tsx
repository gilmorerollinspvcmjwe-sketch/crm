"use client"

import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PricebookForm as PricebookFormComponent, type PricebookFormValues } from "@/forms/PricebookForm"
import { useToast } from "@/hooks/use-toast"

// ============ Mock Data ============

const mockPricebook: PricebookFormValues = {
  name: "2024 年标准价格手册",
  code: "PRICE-STD-2024",
  description: "适用于所有客户的 2024 年度标准价格",
  currency: "CNY",
  discountType: "percentage",
  defaultDiscount: 0.95,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  isDefault: true,
  isActive: true,
  applicableLevels: ["A", "B", "C", "D"],
}

// ============ Component ============

export function PricebookFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [initialValues, setInitialValues] = React.useState<PricebookFormValues | undefined>(undefined)

  const isEdit = !!id

  // Load pricebook data for edit mode
  React.useEffect(() => {
    if (isEdit) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setInitialValues(mockPricebook)
        setLoading(false)
      }, 500)
    }
  }, [id, isEdit])

  const handleSubmit = async (values: PricebookFormValues) => {
    console.log(isEdit ? "更新价格手册:" : "创建价格手册:", values)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: isEdit ? "价格手册已更新" : "价格手册已创建",
      description: isEdit ? `价格手册 ${values.name} 已成功更新` : `价格手册 ${values.name} 已成功创建`,
    })
    
    navigate("/pricebooks")
  }

  const handleCancel = () => {
    navigate("/pricebooks")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {isEdit ? "编辑价格手册" : "新建价格手册"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? "修改价格手册信息" : "创建新的价格手册"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "价格手册信息" : "创建新价格手册"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">加载中...</div>
              </div>
            ) : (
              <PricebookFormComponent
                mode={isEdit ? "edit" : "create"}
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PricebookFormPage
