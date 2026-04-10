/**
 * 404 页面组件
 * Not Found Page Component
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* 404 图标 */}
          <div className="mb-6">
            <div className="text-8xl font-bold text-muted-foreground/30">
              404
            </div>
          </div>
          
          {/* 标题 */}
          <h1 className="text-2xl font-semibold mb-2">
            页面不存在
          </h1>
          
          {/* 说明 */}
          <p className="text-muted-foreground mb-6">
            您访问的页面可能已被删除、移动或不存在。
            请检查 URL 是否正确，或返回首页。
          </p>
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回上一页
            </Button>
            
            <Button
              onClick={() => navigate('/workbench')}
            >
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </div>
          
          {/* 搜索建议 */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              您可能想要访问：
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { path: '/workbench', label: '工作台' },
                { path: '/customer/list', label: '客户列表' },
                { path: '/lead/list', label: '线索管理' },
                { path: '/dashboard', label: '仪表盘' },
              ].map(item => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound