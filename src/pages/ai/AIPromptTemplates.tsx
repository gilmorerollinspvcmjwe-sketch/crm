"use client"

import { useState } from "react"
import { Loader2, FileText, Plus, Pencil, Trash2, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  useAITemplates,
  useCreateAITemplate,
  useUpdateAITemplate,
  useDeleteAITemplate,
} from "@/hooks/api/useAI"
import type { AIPromptTemplate } from "@/hooks/api/useAI"

// ============ Template Dialog ============

function TemplateDialog({
  template,
  onClose,
}: {
  template?: AIPromptTemplate
  onClose: () => void
}) {
  const createTemplate = useCreateAITemplate()
  const updateTemplate = useUpdateAITemplate()

  const [name, setName] = useState(template?.name || "")
  const [type, setType] = useState(template?.type || "custom")
  const [content, setContent] = useState(template?.content || "")
  const [description, setDescription] = useState(template?.description || "")
  const [isDefault, setIsDefault] = useState(template?.isDefault || false)

  const handleSave = async () => {
    const data = {
      name,
      type,
      content,
      description,
      isDefault,
    }

    try {
      if (template) {
        await updateTemplate.mutateAsync({ id: template.id, ...data })
      } else {
        await createTemplate.mutateAsync(data)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save template:", error)
    }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{template ? "编辑模板" : "新建模板"}</DialogTitle>
        <DialogDescription>
          {template ? "修改提示词模板内容" : "创建新的 AI 提示词模板"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">模板名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入模板名称"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">模板类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3"
            >
              <option value="customer_analysis">客户分析</option>
              <option value="opportunity_prediction">商机预测</option>
              <option value="email_draft">邮件草稿</option>
              <option value="summary">内容摘要</option>
              <option value="custom">自定义</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">描述</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入模板描述"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">模板内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入提示词模板内容..."
            className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label className="text-sm">设为默认模板</label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={createTemplate.isPending || updateTemplate.isPending}
          >
            {createTemplate.isPending || updateTemplate.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {template ? "保存" : "创建"}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

// ============ AI Prompt Templates Page ============

const typeLabels: Record<string, string> = {
  customer_analysis: "客户分析",
  opportunity_prediction: "商机预测",
  email_draft: "邮件草稿",
  summary: "内容摘要",
  custom: "自定义",
}

export function AIPromptTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingTemplate, setEditingTemplate] = useState<AIPromptTemplate | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: templates, isLoading } = useAITemplates()
  const deleteTemplate = useDeleteAITemplate()

  const filteredTemplates = templates?.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除此模板吗？")) {
      try {
        await deleteTemplate.mutateAsync(id)
      } catch (error) {
        console.error("Failed to delete template:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">提示词模板</h1>
            <p className="text-muted-foreground">管理 AI 提示词模板库</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建模板
            </Button>
          </DialogTrigger>
          <TemplateDialog onClose={() => setDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="搜索模板..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates?.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="mr-1 h-3 w-3" />
                      默认
                    </Badge>
                  )}
                </div>
                <Badge variant="outline">{typeLabels[template.type]}</Badge>
              </div>
              {template.description && (
                <CardDescription className="line-clamp-1">
                  {template.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {template.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  更于：{template.updatedAt}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleteTemplate.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingTemplate && dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingTemplate(null)
        }}>
          <TemplateDialog
            template={editingTemplate}
            onClose={() => {
              setDialogOpen(false)
              setEditingTemplate(null)
            }}
          />
        </Dialog>
      )}

      {!filteredTemplates?.length && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无提示词模板</p>
            <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              创建第一个模板
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AIPromptTemplatesPage