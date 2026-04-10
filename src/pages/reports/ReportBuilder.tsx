/**
 * ReportBuilder Page - CRM Report Builder/Form
 * Migrated to shadcn/ui + Tailwind CSS + React Hook Form
 */

import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  FileText,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
  Save,
  Eye,
  Database,
  Clock,
  Bell,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react'
import { useCreateReport } from '@/hooks/api/useReports'
import type { ReportCategory, ReportType, ReportPeriod } from '@/types/report'

// ============================================================
// Form Schema
// ============================================================
const reportBuilderSchema = z.object({
  name: z.string().min(2, '报表名称至少2个字符').max(50, '报表名称最多50个字符'),
  description: z.string().max(200, '描述最多200个字符').optional(),
  category: z.enum(['sales', 'customer', 'activity', 'product', 'finance']),
  type: z.enum(['summary', 'detail', 'trend', 'comparison']),
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']),
  isPublic: z.boolean().default(false),
  scheduled: z.boolean().default(false),
  scheduleTime: z.string().optional(),
  scheduleDay: z.string().optional(),
  dataSources: z.array(z.string()).min(1, '请至少选择一个数据源'),
  charts: z.array(z.object({
    id: z.string(),
    type: z.enum(['line', 'bar', 'pie', 'area']),
    title: z.string(),
    dataSource: z.string(),
    xAxis: z.string().optional(),
    yAxis: z.string().optional(),
  })).optional(),
})

type ReportBuilderForm = z.infer<typeof reportBuilderSchema>

// ============================================================
// Mock Data for Preview
// ============================================================
const previewData = [
  { month: '1月', value: 85 },
  { month: '2月', value: 92 },
  { month: '3月', value: 108 },
  { month: '4月', value: 125 },
  { month: '5月', value: 142 },
]

// ============================================================
// Category & Type Config
// ============================================================
const categoryOptions: { value: ReportCategory; label: string; description: string }[] = [
  { value: 'sales', label: '销售报表', description: '销售业绩、商机转化等' },
  { value: 'customer', label: '客户报表', description: '客户分布、活跃度等' },
  { value: 'activity', label: '活动报表', description: '跟进活动、执行统计' },
  { value: 'product', label: '产品报表', description: '产品销量、库存等' },
  { value: 'finance', label: '财务报表', description: '收入、回款、利润等' },
]

const typeOptions: { value: ReportType; label: string; icon: React.ReactNode }[] = [
  { value: 'summary', label: '汇总报表', icon: <FileText className="h-4 w-4" /> },
  { value: 'detail', label: '明细报表', icon: <BarChart3 className="h-4 w-4" /> },
  { value: 'trend', label: '趋势报表', icon: <LineChartIcon className="h-4 w-4" /> },
  { value: 'comparison', label: '对比报表', icon: <PieChartIcon className="h-4 w-4" /> },
]

const periodOptions: { value: ReportPeriod; label: string }[] = [
  { value: 'daily', label: '日报' },
  { value: 'weekly', label: '周报' },
  { value: 'monthly', label: '月报' },
  { value: 'quarterly', label: '季报' },
  { value: 'yearly', label: '年报' },
  { value: 'custom', label: '自定义' },
]

const dataSourceOptions = [
  { id: 'opportunities', label: '商机数据' },
  { id: 'customers', label: '客户数据' },
  { id: 'activities', label: '活动数据' },
  { id: 'contracts', label: '合同数据' },
  { id: 'payments', label: '回款数据' },
  { id: 'products', label: '产品数据' },
  { id: 'leads', label: '线索数据' },
]

const chartTypeOptions: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'line', label: '折线图', icon: <LineChartIcon className="h-4 w-4" /> },
  { value: 'bar', label: '柱状图', icon: <BarChart3 className="h-4 w-4" /> },
  { value: 'pie', label: '饼图', icon: <PieChartIcon className="h-4 w-4" /> },
  { value: 'area', label: '面积图', icon: <AreaChartIcon className="h-4 w-4" /> },
]

// ============================================================
// Chart Preview Component
// ============================================================
function ChartPreview({ type }: { type: string }) {
  return (
    <div className="h-[200px] border rounded-lg bg-muted/30">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={previewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={previewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Pie
              data={previewData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
              label
            />
            <Tooltip />
          </PieChart>
        ) : (
          <AreaChart data={previewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

// ============================================================
// Chart Item Component
// ============================================================
interface ChartItemProps {
  id: string
  type: string
  title: string
  onRemove: (id: string) => void
}

function ChartItem({ id, type, title, onRemove }: ChartItemProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <Badge variant="outline" className="gap-1">
              {chartTypeOptions.find(c => c.value === type)?.icon}
              {chartTypeOptions.find(c => c.value === type)?.label}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onRemove(id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        <p className="font-medium mb-2">{title}</p>
        <ChartPreview type={type} />
      </CardContent>
    </Card>
  )
}

// ============================================================
// ReportBuilder Page Component
// ============================================================
export function ReportBuilder() {
  const navigate = useNavigate()
  const createReport = useCreateReport()
  
  const [activeTab, setActiveTab] = React.useState('basic')
  const [charts, setCharts] = React.useState<Array<{ id: string; type: string; title: string }>>([])
  
  const form = useForm<ReportBuilderForm>({
    resolver: zodResolver(reportBuilderSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      category: 'sales',
      type: 'summary',
      period: 'monthly',
      isPublic: false,
      scheduled: false,
      dataSources: [],
      charts: [],
    },
  })
  
  const watchedCategory = form.watch('category')
  const watchedType = form.watch('type')
  const watchedScheduled = form.watch('scheduled')
  
  // Add chart
  const addChart = () => {
    const newChart = {
      id: `chart-${Date.now()}`,
      type: 'bar',
      title: '新图表',
    }
    setCharts([...charts, newChart])
    form.setValue('charts', [...charts, newChart].map(c => ({
      id: c.id,
      type: c.type as 'line' | 'bar' | 'pie' | 'area',
      title: c.title,
      dataSource: 'default',
    })))
  }
  
  // Remove chart
  const removeChart = (id: string) => {
    const updated = charts.filter(c => c.id !== id)
    setCharts(updated)
    form.setValue('charts', updated.map(c => ({
      id: c.id,
      type: c.type as 'line' | 'bar' | 'pie' | 'area',
      title: c.title,
      dataSource: 'default',
    })))
  }
  
  // Submit form
  const onSubmit = async (data: ReportBuilderForm) => {
    try {
      await createReport.mutateAsync({
        ...data,
        createdBy: 'current-user',
      } as any)
      navigate('/report/list')
    } catch (error) {
      console.error('Failed to create report:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/report/list">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">创建报表</h1>
            <p className="text-muted-foreground">配置报表基本信息和数据源</p>
          </div>
        </div>

        {/* Form Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="gap-2">
              <FileText className="h-4 w-4" />
              基本信息
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Database className="h-4 w-4" />
              数据源
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              图表配置
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Clock className="h-4 w-4" />
              定时设置
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>报表的基本属性和分类</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>报表名称 *</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：销售业绩月报" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>描述</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="报表用途和数据说明..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>简要描述报表的内容和用途</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>报表类别 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择报表类别" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>报表类型 *</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {typeOptions.map(option => (
                              <Button
                                key={option.value}
                                type="button"
                                variant={field.value === option.value ? 'default' : 'outline'}
                                className="justify-start gap-2"
                                onClick={() => field.onChange(option.value)}
                              >
                                {option.icon}
                                {option.label}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Period */}
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>报表周期 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择报表周期" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {periodOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* IsPublic */}
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">公开报表</FormLabel>
                            <FormDescription>
                              其他用户可以查看此报表
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Source Tab */}
              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle>数据源配置</CardTitle>
                    <CardDescription>选择报表需要的数据来源</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dataSources"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>选择数据源 *</FormLabel>
                          <FormDescription>
                            选择报表需要的数据来源，至少选择一个
                          </FormDescription>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {dataSourceOptions.map(option => (
                              <FormItem
                                key={option.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value || [], option.id])
                                      } else {
                                        field.onChange(
                                          field.value?.filter(v => v !== option.id)
                                        )
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts">
                <Card>
                  <CardHeader>
                    <CardTitle>图表配置</CardTitle>
                    <CardDescription>添加和配置报表中的图表组件</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        已添加 {charts.length} 个图表
                      </p>
                      <Button variant="outline" size="sm" onClick={addChart} className="gap-2">
                        <Plus className="h-4 w-4" />
                        添加图表
                      </Button>
                    </div>

                    {charts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">暂无图表</p>
                        <p className="text-sm text-muted-foreground">点击上方按钮添加图表</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {charts.map(chart => (
                          <ChartItem
                            key={chart.id}
                            {...chart}
                            onRemove={removeChart}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>定时设置</CardTitle>
                    <CardDescription>配置报表自动生成时间</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="scheduled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              启用定时生成
                            </FormLabel>
                            <FormDescription>
                              系统将按设定时间自动生成报表
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {watchedScheduled && (
                      <div className="space-y-4 pl-4 border-l-2 border-primary">
                        <FormField
                          control={form.control}
                          name="scheduleDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>执行日期</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择执行日期" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">每天</SelectItem>
                                  <SelectItem value="monday">每周一</SelectItem>
                                  <SelectItem value="first">每月1日</SelectItem>
                                  <SelectItem value="last">每月最后一天</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="scheduleTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>执行时间</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormDescription>报表生成时间，建议选择非工作时间</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab(
                      activeTab === 'basic' ? 'basic' :
                      activeTab === 'data' ? 'basic' :
                      activeTab === 'charts' ? 'data' :
                      'charts'
                    )}
                    disabled={activeTab === 'basic'}
                  >
                    上一步
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab(
                      activeTab === 'basic' ? 'data' :
                      activeTab === 'data' ? 'charts' :
                      activeTab === 'charts' ? 'schedule' :
                      'schedule'
                    )}
                  >
                    下一步
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" type="button" className="gap-2">
                    <Eye className="h-4 w-4" />
                    预览
                  </Button>
                  <Button type="submit" className="gap-2" disabled={createReport.isPending}>
                    <Save className="h-4 w-4" />
                    {createReport.isPending ? '保存中...' : '保存报表'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  )
}

export default ReportBuilder