"use client"

import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm, type ProductFormValues } from "@/forms/ProductForm"
import { useToast } from "@/hooks/use-toast"

// ============ Mock Data ============

const mockProduct: ProductFormValues = {
  name: "服务器 A1",
  code: "PROD-A1",
  category: "硬件",
  description: "高性能企业级服务器，适用于数据中心和大型企业",
  unit: "台",
  brand: "Dell",
  model: "PowerEdge R740",
  spec: "2U 机架式",
  standardPrice: 15000,
  costPrice: 10000,
  minDiscount: 0.85,
  stock: 50,
  safetyStock: 10,
  weight: 25.5,
  isActive: true,
  isSellable: true,
}

// ============ Component ============

export function ProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [initialValues, setInitialValues] = React.useState<ProductFormValues | undefined>(undefined)

  const isEdit = !!id

  // Load product data for edit mode
  React.useEffect(() => {
    if (isEdit) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setInitialValues(mockProduct)
        setLoading(false)
      }, 500)
    }
  }, [id, isEdit])

  const handleSubmit = async (values: ProductFormValues) => {
    console.log(isEdit ? "更新产品:" : "创建产品:", values)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: isEdit ? "产品已更新" : "产品已创建",
      description: isEdit ? `产品 ${values.name} 已成功更新` : `产品 ${values.name} 已成功创建`,
    })
    
    navigate("/products")
  }

  const handleCancel = () => {
    navigate("/products")
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
              {isEdit ? "编辑产品" : "新建产品"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? "修改产品信息" : "创建新的产品"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "产品信息" : "创建新产品"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">加载中...</div>
              </div>
            ) : (
              <ProductForm
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

export default ProductFormPage
