/**
 * 客户导入功能集成示例
 * 
 * 展示如何在客户列表页面集成导入对话框
 */

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CustomerImportDialog } from '@/components/CustomerImportDialog'
import { useToast } from '@/hooks/use-toast'
import { useCustomers } from '@/hooks/useCustomers'

interface CustomerListPageProps {
  // ... existing props
}

export function CustomerListPageExample({}: CustomerListPageProps) {
  const { toast } = useToast()
  const [showImportDialog, setShowImportDialog] = React.useState(false)
  
  // 获取现有客户用于重复检测
  const { data: customersData } = useCustomers({
    page: 1,
    pageSize: 1000, // 加载所有客户用于重复检测
  })
  
  // 转换为导入组件需要的格式
  const existingCustomers = React.useMemo(() => {
    return customersData?.data?.map(c => ({
      email: c.email,
      id: c.id,
    })) || []
  }, [customersData])

  const handleImportComplete = (result: {
    success: number
    failed: number
    total: number
  }) => {
    const successRate = Math.round((result.success / result.total) * 100)
    
    toast({
      title: result.success === result.total ? '导入成功' : '导入完成',
      description: `成功导入 ${result.success} 条，失败 ${result.failed} 条，成功率 ${successRate}%`,
      variant: result.success === result.total ? 'default' : 'destructive',
    })
  }

  return (
    <div className="p-6">
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">客户管理</h1>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImportDialog(true)}
          >
            📥 导入客户
          </Button>
          
          <Button variant="default">
            ➕ 新建客户
          </Button>
        </div>
      </div>

      {/* 客户列表 */}
      <div className="border rounded-lg">
        {/* ... 客户列表内容 ... */}
      </div>

      {/* 导入对话框 */}
      <CustomerImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        existingCustomers={existingCustomers}
        onImportComplete={handleImportComplete}
      />
    </div>
  )
}

export default CustomerListPageExample
