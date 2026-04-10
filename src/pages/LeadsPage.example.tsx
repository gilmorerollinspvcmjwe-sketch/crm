/**
 * 线索管理页面示例
 * 演示如何使用线索查重和转化功能
 * 
 * 注意：这是示例文件，展示组件用法
 */

import * as React from 'react'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, MoreHorizontal, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'

import type { Lead } from '@/types/lead'
import { LeadDuplicateCheckModal } from '@/components/LeadDuplicateCheckModal'
import { LeadConversionDialog } from '@/components/LeadConversionDialog'
import { mockLeads } from '@/mocks/leads'

// ============================================
// 示例：线索列表页面
// ============================================

export const LeadsPageExample: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [checkModalOpen, setCheckModalOpen] = useState(false)
  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [checkParams, setCheckParams] = useState({})

  // 模拟获取线索列表
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => mockLeads,
  })

  // 模拟创建线索
  const createLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      // TODO: 替换为实际 API 调用
      console.log('Creating lead:', data)
      return { id: `LEAD-${Date.now()}`, ...data }
    },
    onSuccess: () => {
      toast({
        title: '创建成功',
        description: '线索已成功创建',
      })
    },
  })

  // 处理查重完成
  const handleCheckComplete = (
    action: 'merge' | 'skip' | 'override' | 'create_new',
    selectedLeadId?: string
  ) => {
    console.log('查重处理:', action, selectedLeadId)

    if (action === 'create_new') {
      // 创建新线索
      createLeadMutation.mutate({
        name: (checkParams as any).name,
        phone: (checkParams as any).phone,
        email: (checkParams as any).email,
        company: (checkParams as any).company,
      })
    } else if (action === 'merge') {
      toast({
        title: '合并线索',
        description: `将合并到线索 ${selectedLeadId}`,
      })
    } else if (action === 'skip') {
      toast({
        title: '跳过创建',
        description: '使用现有线索',
      })
    } else if (action === 'override') {
      toast({
        title: '覆盖线索',
        description: `将覆盖线索 ${selectedLeadId}`,
      })
    }

    setCheckModalOpen(false)
  }

  // 处理转化成功
  const handleConvertSuccess = (result: any) => {
    console.log('转化结果:', result)
    toast({
      title: '转化成功',
      description: '线索已成功转化为客户/联系人/商机',
    })
    setConvertDialogOpen(false)
  }

  // 打开查重对话框（创建线索时）
  const handleCreateLead = () => {
    setCheckParams({
      name: '示例用户',
      phone: '13800138000',
      email: 'example@test.com',
      company: '示例公司',
    })
    setCheckModalOpen(true)
  }

  // 打开转化对话框
  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead)
    setConvertDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">线索管理</h1>
        <Button onClick={handleCreateLead}>
          <Plus className="h-4 w-4 mr-2" />
          创建线索
        </Button>
      </div>

      {/* 线索列表 */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">名称</th>
              <th className="p-3 text-left">公司</th>
              <th className="p-3 text-left">电话</th>
              <th className="p-3 text-left">邮箱</th>
              <th className="p-3 text-left">状态</th>
              <th className="p-3 text-left">级别</th>
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-t hover:bg-muted/50">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.company || '-'}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {lead.status}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lead.level === '高'
                        ? 'bg-red-100 text-red-800'
                        : lead.level === '中'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {lead.level || '-'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>查看详情</DropdownMenuItem>
                      <DropdownMenuItem>编辑</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleConvertLead(lead)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        转化线索
                      </DropdownMenuItem>
                      <DropdownMenuItem>删除</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 查重对话框 */}
      <LeadDuplicateCheckModal
        open={checkModalOpen}
        onOpenChange={setCheckModalOpen}
        checkParams={checkParams}
        onComplete={handleCheckComplete}
      />

      {/* 转化对话框 */}
      {selectedLead && (
        <LeadConversionDialog
          open={convertDialogOpen}
          onOpenChange={setConvertDialogOpen}
          lead={selectedLead}
          onSuccess={handleConvertSuccess}
        />
      )}
    </div>
  )
}

// ============================================
// 示例：线索表单组件（带自动查重）
// ============================================

interface LeadFormProps {
  onSubmit: (data: Partial<Lead>) => void
  onCancel: () => void
}

export const LeadFormExample: React.FC<LeadFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
  })
  const [checkModalOpen, setCheckModalOpen] = useState(false)
  const [checkParams, setCheckParams] = useState({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 提交前先查重
    setCheckParams(formData)
    setCheckModalOpen(true)
  }

  const handleCheckComplete = (
    action: 'merge' | 'skip' | 'override' | 'create_new'
  ) => {
    if (action === 'create_new') {
      onSubmit(formData)
    }
    setCheckModalOpen(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">姓名 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">电话 *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">邮箱 *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">公司</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">
            创建线索
          </Button>
        </div>
      </form>

      <LeadDuplicateCheckModal
        open={checkModalOpen}
        onOpenChange={setCheckModalOpen}
        checkParams={checkParams}
        onComplete={handleCheckComplete}
      />
    </>
  )
}

export default LeadsPageExample
