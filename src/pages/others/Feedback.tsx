/**
 * Feedback Page - 反馈页面
 * Features: Feedback form, Type selection, Priority
 */

import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  MessageCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  Star,
  Send,
  ArrowLeft,
  CheckCircle,
  Clock,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react'

// ============================================================
// Feedback Types
// ============================================================
type FeedbackType = 'bug' | 'suggestion' | 'question' | 'praise'
type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent'

interface FeedbackFormData {
  type: FeedbackType
  priority: FeedbackPriority
  title: string
  description: string
  email: string
  attachments: string[]
}

const feedbackTypes: { value: FeedbackType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'bug', label: '问题报告', icon: <Bug className="h-5 w-5" />, color: 'text-red-500' },
  { value: 'suggestion', label: '功能建议', icon: <Lightbulb className="h-5 w-5" />, color: 'text-blue-500' },
  { value: 'question', label: '使用疑问', icon: <HelpCircle className="h-5 w-5" />, color: 'text-yellow-500' },
  { value: 'praise', label: '好评反馈', icon: <Star className="h-5 w-5" />, color: 'text-green-500' },
]

const priorityLevels: { value: FeedbackPriority; label: string; color: string }[] = [
  { value: 'low', label: '低', color: 'bg-gray-100' },
  { value: 'medium', label: '中', color: 'bg-yellow-100' },
  { value: 'high', label: '高', color: 'bg-orange-100' },
  { value: 'urgent', label: '紧急', color: 'bg-red-100' },
]

// ============================================================
// Recent Feedback List (Mock)
// ============================================================
const recentFeedbacks = [
  {
    id: 'FB001',
    type: 'bug',
    title: '客户列表导出时部分字段丢失',
    status: '处理中',
    updateTime: '2小时前',
  },
  {
    id: 'FB002',
    type: 'suggestion',
    title: '希望增加批量发送邮件功能',
    status: '已采纳',
    updateTime: '1天前',
  },
  {
    id: 'FB003',
    type: 'question',
    title: '如何设置自动化的客户跟进提醒',
    status: '已回复',
    updateTime: '3天前',
  },
]

// ============================================================
// Feedback Page Component
// ============================================================
export function Feedback() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'suggestion',
    priority: 'medium',
    title: '',
    description: '',
    email: '',
    attachments: [],
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = '请填写标题'
    }
    if (!formData.description.trim()) {
      newErrors.description = '请填写详细描述'
    }
    if (formData.description.length < 20) {
      newErrors.description = '描述内容至少20个字符'
    }
    if (!formData.email.trim()) {
      newErrors.email = '请填写联系邮箱'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = () => {
    if (validate()) {
      // Submit logic would be here
      setSubmitted(true)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'suggestion',
      priority: 'medium',
      title: '',
      description: '',
      email: '',
      attachments: [],
    })
    setSubmitted(false)
    setErrors({})
  }

  // Success view
  if (submitted) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">反馈已提交</h2>
              <p className="text-muted-foreground mb-4">
                感谢您的反馈！我们会尽快处理，并通过邮件通知您处理结果。
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                反馈编号: FB-{Date.now().toString().slice(-6)}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetForm}>
                  继续提交
                </Button>
                <Button onClick={() => navigate('/help-center')}>
                  返回帮助中心
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">提交反馈</h1>
            <p className="text-muted-foreground">告诉我们您的问题、建议或想法</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  反馈内容
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label>反馈类型</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {feedbackTypes.map(ft => (
                      <div
                        key={ft.value}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.type === ft.value
                            ? 'border-primary bg-primary/10'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, type: ft.value }))}
                      >
                        <span className={ft.color}>{ft.icon}</span>
                        <span className="text-sm">{ft.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>优先级</Label>
                  <div className="flex gap-2">
                    {priorityLevels.map(pl => (
                      <Badge
                        key={pl.value}
                        variant={formData.priority === pl.value ? 'default' : 'outline'}
                        className={`cursor-pointer ${formData.priority === pl.value ? pl.color : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, priority: pl.value }))}
                      >
                        {pl.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">标题 *</Label>
                  <Input
                    id="title"
                    placeholder="简要描述您的问题或建议"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">详细描述 *</Label>
                  <Textarea
                    id="description"
                    placeholder="请详细描述您的反馈内容，包括问题现象、期望效果等..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={5}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>附件（可选）</Label>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      <span>上传截图或相关文件（最大10MB）</span>
                    </div>
                    {formData.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.attachments.map((file, idx) => (
                          <Badge variant="secondary" className="gap-1">
                            {file}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                attachments: prev.attachments.filter((_, i) => i !== idx)
                              }))}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">联系邮箱 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="用于接收处理结果通知"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button className="w-full" onClick={handleSubmit}>
                  <Send className="h-4 w-4 mr-2" />
                  提交反馈
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">提交建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• 请尽量详细描述问题或建议</p>
                <p>• 提供截图或具体操作步骤有助于我们更快定位问题</p>
                <p>• 建议类反馈会被纳入产品规划评估</p>
                <p>• 问题类反馈通常在24小时内响应</p>
              </CardContent>
            </Card>

            {/* Recent Feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  近期反馈
                </CardTitle>
                <CardDescription>查看您的提交历史</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentFeedbacks.map(fb => {
                  const typeInfo = feedbackTypes.find(t => t.value === fb.type)
                  return (
                    <div key={fb.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span className={typeInfo?.color}>{typeInfo?.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{fb.title}</p>
                        <p className="text-xs text-muted-foreground">{fb.updateTime}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{fb.status}</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback