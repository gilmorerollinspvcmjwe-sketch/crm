/**
 * ActivityForm Page - CRM Activity Create/Edit Form
 * Migrated from Ant Design to React Hook Form + Zod + Tailwind CSS
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Bell,
  MapPin,
  User,
  Building,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Zod Schema
// ============================================================
const activitySchema = z.object({
  type: z.enum(['call', 'meeting', 'email', 'task', 'note', 'visit']).describe('请选择活动类型'),
  subject: z.string().min(2, '主题至少2个字符').max(100, '主题最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  startTime: z.string().min(1, '请选择开始时间'),
  endTime: z.string().optional(),
  location: z.string().max(100, '地点最多100个字符').optional(),
  customerId: z.string().optional(),
  contactId: z.string().optional(),
  assignee: z.string().min(1, '请选择负责人'),
  priority: z.enum(['high', 'medium', 'low']).describe('请选择优先级'),
  reminder: z.boolean().default(false),
  reminderTime: z.string().optional(),
})

type ActivityFormValues = z.infer<typeof activitySchema>

// ============================================================
// Type Options
// ============================================================
const typeOptions = [
  { value: 'call', label: '电话', icon: '📞' },
  { value: 'meeting', label: '会议', icon: '👥' },
  { value: 'email', label: '邮件', icon: '📧' },
  { value: 'task', label: '任务', icon: '📋' },
  { value: 'note', label: '备注', icon: '📝' },
  { value: 'visit', label: '拜访', icon: '📍' },
]

const priorityOptions = [
  { value: 'high', label: '高优先级', color: 'text-red-600' },
  { value: 'medium', label: '中优先级', color: 'text-yellow-600' },
  { value: 'low', label: '低优先级', color: 'text-green-600' },
]

const assigneeOptions = ['李明', '王芳', '陈静']

const reminderTimeOptions = [
  { value: '5min', label: '5分钟前' },
  { value: '15min', label: '15分钟前' },
  { value: '30min', label: '30分钟前' },
  { value: '1hour', label: '1小时前' },
  { value: '1day', label: '1天前' },
]

// ============================================================
// ActivityForm Component
// ============================================================
interface ActivityFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<ActivityFormValues>
  onSubmit?: (values: ActivityFormValues) => Promise<void>
  onCancel?: () => void
  loading?: boolean
}

export function ActivityForm({
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
  loading,
}: ActivityFormProps) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema) as any,
    defaultValues: {
      type: initialValues?.type || 'call',
      subject: initialValues?.subject || '',
      description: initialValues?.description || '',
      startTime: initialValues?.startTime || '',
      endTime: initialValues?.endTime || '',
      location: initialValues?.location || '',
      customerId: initialValues?.customerId || '',
      contactId: initialValues?.contactId || '',
      assignee: initialValues?.assignee || '',
      priority: initialValues?.priority || 'medium',
      reminder: initialValues?.reminder || false,
      reminderTime: initialValues?.reminderTime || '15min',
    },
  })

  const handleSubmit = async (values: ActivityFormValues) => {
    try {
      await onSubmit?.(values)
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? '新建活动' : '编辑活动'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' ? '创建新的客户跟进活动' : '修改活动信息'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                基本信息
              </CardTitle>
              <CardDescription>设置活动的基本属性</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">活动类型 *</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as ActivityFormValues['type'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择活动类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">主题 *</Label>
                <Input
                  id="subject"
                  placeholder="活动主题"
                  {...form.register('subject')}
                  className={cn(form.formState.errors.subject && 'border-red-500')}
                />
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-500">{form.formState.errors.subject.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  placeholder="活动详细描述..."
                  rows={4}
                  {...form.register('description')}
                  className={cn(form.formState.errors.description && 'border-red-500')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">优先级 *</Label>
                <Select
                  value={form.watch('priority')}
                  onValueChange={(value) => form.setValue('priority', value as ActivityFormValues['priority'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.priority && (
                  <p className="text-sm text-red-500">{form.formState.errors.priority.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Time & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                时间安排
              </CardTitle>
              <CardDescription>设置活动的时间和地点</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="space-y-2">
                  <Label htmlFor="startTime">开始时间 *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    {...form.register('startTime')}
                    className={cn(form.formState.errors.startTime && 'border-red-500')}
                  />
                  {form.formState.errors.startTime && (
                    <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
                  )}
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <Label htmlFor="endTime">结束时间</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    {...form.register('endTime')}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  地点
                </Label>
                <Input
                  id="location"
                  placeholder="会议地点或拜访地址"
                  {...form.register('location')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                关联信息
              </CardTitle>
              <CardDescription>关联客户和联系人</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div className="space-y-2">
                  <Label htmlFor="customerId">关联客户</Label>
                  <Select
                    value={form.watch('customerId')}
                    onValueChange={(value) => form.setValue('customerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择客户" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C001">北京科技有限公司</SelectItem>
                      <SelectItem value="C002">上海贸易集团</SelectItem>
                      <SelectItem value="C003">深圳创新科技</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <Label htmlFor="contactId">关联联系人</Label>
                  <Select
                    value={form.watch('contactId')}
                    onValueChange={(value) => form.setValue('contactId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择联系人" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CO001">张伟</SelectItem>
                      <SelectItem value="CO002">李娜</SelectItem>
                      <SelectItem value="CO003">王强</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignee & Reminder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                负责人 & 提醒
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assignee */}
              <div className="space-y-2">
                <Label htmlFor="assignee">负责人 *</Label>
                <Select
                  value={form.watch('assignee')}
                  onValueChange={(value) => form.setValue('assignee', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择负责人" />
                  </SelectTrigger>
                  <SelectContent>
                    {assigneeOptions.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.assignee && (
                  <p className="text-sm text-red-500">{form.formState.errors.assignee.message}</p>
                )}
              </div>

              <Separator />

              {/* Reminder */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="reminder"
                    checked={form.watch('reminder')}
                    onCheckedChange={(checked) => form.setValue('reminder', checked as boolean)}
                  />
                  <Label htmlFor="reminder" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    设置提醒
                  </Label>
                </div>

                {form.watch('reminder') && (
                  <Select
                    value={form.watch('reminderTime')}
                    onValueChange={(value) => form.setValue('reminderTime', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActivityForm