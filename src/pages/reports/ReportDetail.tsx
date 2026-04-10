/**
 * ReportDetail Page - CRM Report Detail View
 * Migrated from Ant Design to shadcn/ui + Tailwind CSS + Recharts
 */

import * as React from 'react'
import { useParams } from 'react-router-dom'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Share2,
  Calendar,
  Clock,
  FileText,
  Printer,
  Bell,
} from 'lucide-react'
import { useReport, useReportData } from '@/hooks/api/useReports'
import type { ReportCategory } from '@/types/report'

// ============================================================
// Chart Colors
// ============================================================
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

// ============================================================
// Category Colors
// ============================================================
const categoryColors: Record<ReportCategory, string> = {
  sales: 'bg-blue-100 text-blue-700 border-blue-200',
  customer: 'bg-purple-100 text-purple-700 border-purple-200',
  activity: 'bg-orange-100 text-orange-700 border-orange-200',
  product: 'bg-teal-100 text-teal-700 border-teal-200',
  finance: 'bg-green-100 text-green-700 border-green-200',
}

const categoryLabels: Record<ReportCategory, string> = {
  sales: '销售报表',
  customer: '客户报表',
  activity: '活动报表',
  product: '产品报表',
  finance: '财务报表',
}

// ============================================================
// Mock Chart Data Generator
// ============================================================
const generateMockChartData = (category: ReportCategory) => {
  switch (category) {
    case 'sales':
      return {
        line: [
          { month: '1月', value: 85000, target: 90000 },
          { month: '2月', value: 92000, target: 90000 },
          { month: '3月', value: 108000, target: 100000 },
          { month: '4月', value: 125000, target: 120000 },
          { month: '5月', value: 142000, target: 140000 },
        ],
        bar: [
          { name: '李明', value: 45000 },
          { name: '王芳', value: 38000 },
          { name: '陈静', value: 32000 },
          { name: '张伟', value: 28000 },
        ],
        pie: [
          { name: '电话销售', value: 35 },
          { name: '网站转化', value: 25 },
          { name: '客户推荐', value: 20 },
          { name: '渠道合作', value: 15 },
          { name: '其他', value: 5 },
        ],
      }
    case 'customer':
      return {
        line: [
          { month: '1月', active: 85, new: 8, churn: 2 },
          { month: '2月', active: 90, new: 12, churn: 3 },
          { month: '3月', active: 98, new: 15, churn: 2 },
          { month: '4月', active: 105, new: 18, churn: 4 },
        ],
        bar: [
          { name: '北京', value: 45 },
          { name: '上海', value: 38 },
          { name: '深圳', value: 25 },
          { name: '广州', value: 20 },
        ],
        pie: [
          { name: '活跃', value: 65 },
          { name: '潜在', value: 20 },
          { name: '沉默', value: 10 },
          { name: '流失', value: 5 },
        ],
      }
    case 'activity':
      return {
        bar: [
          { type: '电话', count: 40, completed: 35 },
          { type: '会议', count: 25, completed: 20 },
          { type: '邮件', count: 30, completed: 28 },
          { type: '任务', count: 15, completed: 12 },
        ],
        line: [
          { week: 'W1', total: 30, completed: 25 },
          { week: 'W2', total: 35, completed: 30 },
          { week: 'W3', total: 28, completed: 24 },
          { week: 'W4', total: 32, completed: 28 },
        ],
      }
    case 'finance':
      return {
        area: [
          { quarter: 'Q1', revenue: 300000, cost: 180000, profit: 120000 },
          { quarter: 'Q2', revenue: 350000, cost: 210000, profit: 140000 },
          { quarter: 'Q3', revenue: 320000, cost: 190000, profit: 130000 },
          { quarter: 'Q4', revenue: 280000, cost: 170000, profit: 110000 },
        ],
        bar: [
          { name: '销售费用', value: 250000 },
          { name: '管理费用', value: 180000 },
          { name: '研发费用', value: 150000 },
          { name: '其他', value: 70000 },
        ],
      }
    default:
      return {}
  }
}

// ============================================================
// Report Header
// ============================================================
function ReportHeader({ report }: { report: ReturnType<typeof useReport>['data'] }) {
  if (!report) return null

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${categoryColors[report.category]}`}>
          <FileText className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{report.name}</h1>
            <Badge variant="outline" className={categoryColors[report.category]}>
              {categoryLabels[report.category]}
            </Badge>
            {report.scheduled && (
              <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
                <Bell className="h-3 w-3" />
                定时生成
              </Badge>
            )}
          </div>
          {report.description && (
            <p className="text-muted-foreground">{report.description}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          刷新数据
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          导出
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          打印
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          分享
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Sales Report Content
// ============================================================
function SalesReportContent({ data }: { data: ReturnType<typeof useReportData>['data'] }) {
  const chartData = generateMockChartData('sales')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>月度营收趋势</CardTitle>
          <CardDescription>实际营收与目标对比</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.line as any}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" name="实际" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Line type="monotone" dataKey="target" name="目标" stroke="#f59e0b" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>销售业绩排行</CardTitle>
          <CardDescription>团队成员业绩对比</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.bar as any}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" name="业绩(万)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales Source */}
      <Card>
        <CardHeader>
          <CardTitle>销售来源分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={(chartData.pie ?? []) as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {chartData.pie && chartData.pie.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>关键指标</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">总营收</p>
              <p className="text-2xl font-bold">¥125万</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">目标完成率</p>
              <p className="text-2xl font-bold text-green-600">83.3%</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">成交数</p>
              <p className="text-2xl font-bold">22单</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">平均客单价</p>
              <p className="text-2xl font-bold">¥5.68万</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// Activity Report Content
// ============================================================
function ActivityReportContent({ data }: { data: ReturnType<typeof useReportData>['data'] }) {
  const chartData = generateMockChartData('activity')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Activity by Type */}
      <Card>
        <CardHeader>
          <CardTitle>活动类型分布</CardTitle>
          <CardDescription>各类型活动数量与完成率</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.bar as any}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="type" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="计划" fill="#f59e0b" />
              <Bar dataKey="completed" name="完成" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>周度趋势</CardTitle>
          <CardDescription>近四周活动量变化</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.line as any}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="计划数" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" name="完成数" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// Loading Skeleton
// ============================================================
function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}

// ============================================================
// ReportDetail Page Component
// ============================================================
export function ReportDetail() {
  const params = useParams()
  const reportId = params.id as string
  const { data: report, isLoading: reportLoading } = useReport(reportId)
  const { data: reportData, isLoading: dataLoading } = useReportData(reportId)

  const isLoading = reportLoading || dataLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-24 mb-6" />
          <ReportSkeleton />
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">报表不存在或已被删除</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Button>

        {/* Header */}
        <ReportHeader report={report} />

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            周期: {report.period}
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            更新: {report.updatedAt}
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span>创建人: {report.createdBy}</span>
        </div>

        {/* Content */}
        {report.category === 'sales' && <SalesReportContent data={reportData} />}
        {report.category === 'activity' && <ActivityReportContent data={reportData} />}
        {report.category === 'customer' && <SalesReportContent data={reportData} />}
        {report.category === 'finance' && <SalesReportContent data={reportData} />}
        {report.category === 'product' && <SalesReportContent data={reportData} />}
      </div>
    </div>
  )
}

export default ReportDetail