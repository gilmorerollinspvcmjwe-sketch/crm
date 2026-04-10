/**
 * ReportDashboard Page - CRM Report Overview Dashboard
 * Migrated to shadcn/ui + Tailwind CSS + Recharts
 */

import * as React from 'react'
import { Link } from 'react-router-dom'
import {
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
  Line,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Package,
  FileText,
  Clock,
  Calendar,
  Plus,
  ArrowRight,
  RefreshCw,
  Download,
  Bell,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { useReports } from '@/hooks/api/useReports'
import type { ReportCategory } from '@/types/report'

// ============================================================
// Chart Colors (reserved for future use)
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

// ============================================================
// Mock Chart Data
// ============================================================
const categoryStatsData = [
  { name: '销售报表', count: 5, scheduled: 2, color: '#3b82f6' },
  { name: '客户报表', count: 4, scheduled: 1, color: '#8b5cf6' },
  { name: '活动报表', count: 3, scheduled: 0, color: '#f59e0b' },
  { name: '财务报表', count: 2, scheduled: 2, color: '#10b981' },
  { name: '产品报表', count: 2, scheduled: 0, color: '#06b6d4' },
]

const reportTrendData = [
  { month: '1月', created: 3, viewed: 45, exported: 12 },
  { month: '2月', created: 5, viewed: 52, exported: 18 },
  { month: '3月', created: 4, viewed: 68, exported: 22 },
  { month: '4月', created: 6, viewed: 85, exported: 28 },
]

const scheduleStatusData = [
  { name: '正常执行', value: 12, color: '#10b981' },
  { name: '等待执行', value: 3, color: '#f59e0b' },
  { name: '执行失败', value: 1, color: '#ef4444' },
]

const recentReportsData = [
  { id: 'R001', name: '销售业绩月报', category: 'sales', updatedAt: '2026-04-01', status: 'success' },
  { id: 'R002', name: '客户活跃度分析', category: 'customer', updatedAt: '2026-04-02', status: 'success' },
  { id: 'R003', name: '财务收入报表', category: 'finance', updatedAt: '2026-04-01', status: 'pending' },
  { id: 'R004', name: '活动执行统计', category: 'activity', updatedAt: '2026-04-03', status: 'success' },
  { id: 'R005', name: '产品销售排行', category: 'product', updatedAt: '2026-04-02', status: 'error' },
]

// ============================================================
// Category Icons & Colors
// ============================================================
const categoryConfig: Record<ReportCategory, { icon: React.ReactNode; color: string; label: string }> = {
  sales: { icon: <DollarSign className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700 border-blue-200', label: '销售' },
  customer: { icon: <Users className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700 border-purple-200', label: '客户' },
  activity: { icon: <Activity className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700 border-orange-200', label: '活动' },
  product: { icon: <Package className="h-4 w-4" />, color: 'bg-teal-100 text-teal-700 border-teal-200', label: '产品' },
  finance: { icon: <TrendingUp className="h-4 w-4" />, color: 'bg-green-100 text-green-700 border-green-200', label: '财务' },
}

// ============================================================
// Stats Card Component
// ============================================================
interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  description?: string
  color?: string
}

function StatsCard({ title, value, change, icon, description, color }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold" style={color ? { color } : undefined}>{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+{change}%</span>
                <span className="text-xs text-muted-foreground">vs上月</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Recent Report Item
// ============================================================
function RecentReportItem({ report }: { report: typeof recentReportsData[0] }) {
  const config = categoryConfig[report.category as ReportCategory]
  
  return (
    <Link
      to={`/report/${report.id}`}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.color}`}>
          {config.icon}
        </div>
        <div>
          <p className="font-medium">{report.name}</p>
          <p className="text-xs text-muted-foreground">{report.updatedAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {report.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
        {report.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
        {report.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}

// ============================================================
// ReportDashboard Page Component
// ============================================================
export function ReportDashboard() {
  const { data: reportsData } = useReports()
  
  // Calculate stats from reports
  const totalReports = reportsData?.total || 16
  const scheduledReports = 4
  const recentExports = 28
  const activeUsers = 12
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">报表仪表盘</h1>
            <p className="text-muted-foreground">报表系统概览与数据分析</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              2026年4月
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              刷新
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              新建报表
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="报表总数"
            value={totalReports}
            change={15}
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            description="本月新增3个"
          />
          <StatsCard
            title="定时报表"
            value={scheduledReports}
            icon={<Bell className="h-5 w-5 text-primary" />}
            description="2个正常运行"
          />
          <StatsCard
            title="本月导出"
            value={recentExports}
            change={25}
            icon={<Download className="h-5 w-5 text-primary" />}
            color="#10b981"
          />
          <StatsCard
            title="活跃用户"
            value={activeUsers}
            icon={<Users className="h-5 w-5 text-primary" />}
            description="查看报表"
          />
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">报表概览</TabsTrigger>
            <TabsTrigger value="category">分类统计</TabsTrigger>
            <TabsTrigger value="schedule">定时任务</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Report Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>报表使用趋势</CardTitle>
                  <CardDescription>近四个月报表创建与查看情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="created" name="新建" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      <Line type="monotone" dataKey="viewed" name="查看" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="exported" name="导出" stroke="#f59e0b" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>最近报表</CardTitle>
                  <CardDescription>最近生成和更新的报表</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentReportsData.map(report => (
                    <RecentReportItem key={report.id} report={report} />
                  ))}
                  <Link
                    to="/report/list"
                    className="flex items-center justify-center gap-2 p-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    查看全部报表
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="category" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>报表分类分布</CardTitle>
                  <CardDescription>各类型报表数量统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryStatsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="报表数" fill="#3b82f6" />
                      <Bar dataKey="scheduled" name="定时数" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Cards */}
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(categoryConfig) as ReportCategory[]).map(category => {
                  const config = categoryConfig[category]
                  const count = categoryStatsData.find(d => d.name.includes(config.label))?.count || 0
                  
                  return (
                    <Link key={category} to={`/report/list?category=${category}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${config.color}`}>
                              {config.icon}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{count}</p>
                              <p className="text-xs text-muted-foreground">{config.label}报表</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Schedule Status */}
              <Card>
                <CardHeader>
                  <CardTitle>定时任务状态</CardTitle>
                  <CardDescription>定时报表执行情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={scheduleStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {scheduleStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {scheduleStatusData.map(item => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>快捷操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/report/list">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText className="h-4 w-4" />
                      查看所有报表
                    </Button>
                  </Link>
                  <Link to="/report/schedule">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Bell className="h-4 w-4" />
                      管理定时任务
                    </Button>
                  </Link>
                  <Link to="/report/export">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      导出记录
                    </Button>
                  </Link>
                  <Link to="/report/builder">
                    <Button className="w-full justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      创建新报表
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ReportDashboard