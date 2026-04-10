/**
 * ActivityReport - 活动报表
 * Activity Report Page with Recharts visualization
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable } from '@/components/DataTable/DataTable'
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  Calendar,
  Users,
  Download,
  RefreshCw,
  MessageSquare,
  Video,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts'
import { ColumnDef } from '@tanstack/react-table'
import { useActivityReport, useReportTimeRange, useExportReport, TimeRange } from '@/hooks/useReports'

// Time range options
const timeRangeOptions: { value: TimeRange; labelKey: string }[] = [
  { value: 'week', labelKey: 'reports.common.thisWeek' },
  { value: 'month', labelKey: 'reports.common.thisMonth' },
  { value: 'quarter', labelKey: 'reports.common.thisQuarter' },
  { value: 'year', labelKey: 'reports.common.thisYear' },
]

const TYPE_COLORS: Record<string, string> = {
  call: '#3b82f6',
  email: '#22c55e',
  meeting: '#8b5cf6',
  visit: '#f97316',
  message: '#ec4899',
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Video,
  visit: Users,
  message: MessageSquare,
}

export function ActivityReportPage() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useReportTimeRange()
  const { data, isLoading, refetch } = useActivityReport(timeRange)
  const { exportCSV } = useExportReport()
  const [viewType, setViewType] = React.useState('overview')

  // Prepare bar chart data for activity types
  const typeBarData = React.useMemo(() => {
    if (!data) return []
    return data.types.map(type => ({
      name: t(`reports.activity.types.${type.typeKey}`),
      value: type.count,
      fill: type.color,
      typeKey: type.typeKey,
    }))
  }, [data, t])

  // Prepare radar chart data
  const radarData = React.useMemo(() => {
    if (!data) return []
    return data.types.map(type => ({
      type: t(`reports.activity.types.${type.typeKey}`),
      count: type.count,
    }))
  }, [data, t])

  // Prepare weekly stacked bar data
  const weeklyBarData = React.useMemo(() => {
    if (!data) return []
    return data.weekly.map(item => ({
      day: item.day,
      calls: item.calls,
      emails: item.emails,
      meetings: item.meetings,
      visits: item.visits,
    }))
  }, [data])

  // Weekly activity columns
  const weeklyColumns: ColumnDef<NonNullable<typeof data>['weekly'][number]>[] = [
    {
      accessorKey: 'day',
      header: t('reports.activity.table.day'),
      cell: ({ row }) => <span className="font-medium">{row.original.day}</span>,
    },
    {
      accessorKey: 'calls',
      header: t('reports.activity.table.calls'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          <span>{row.original.calls}</span>
        </div>
      ),
    },
    {
      accessorKey: 'emails',
      header: t('reports.activity.table.emails'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-green-500" />
          <span>{row.original.emails}</span>
        </div>
      ),
    },
    {
      accessorKey: 'meetings',
      header: t('reports.activity.table.meetings'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-purple-500" />
          <span>{row.original.meetings}</span>
        </div>
      ),
    },
    {
      accessorKey: 'visits',
      header: t('reports.activity.table.visits'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-orange-500" />
          <span>{row.original.visits}</span>
        </div>
      ),
    },
  ]

  // Performer columns
  const performerColumns: ColumnDef<NonNullable<typeof data>['performers'][number]>[] = [
    {
      accessorKey: 'name',
      header: t('reports.performance.table.name'),
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'activities',
      header: '总活动',
      cell: ({ row }) => (
        <Badge variant="default">{row.original.activities}</Badge>
      ),
    },
    {
      accessorKey: 'calls',
      header: t('reports.activity.types.call'),
      cell: ({ row }) => <span>{row.original.calls}</span>,
    },
    {
      accessorKey: 'emails',
      header: t('reports.activity.types.email'),
      cell: ({ row }) => <span>{row.original.emails}</span>,
    },
    {
      accessorKey: 'meetings',
      header: t('reports.activity.types.meeting'),
      cell: ({ row }) => <span>{row.original.meetings}</span>,
    },
  ]

  // Export handler
  const handleExport = () => {
    if (!data) return
    if (viewType === 'weekly') {
      const exportData = data.weekly.map(item => ({
        [t('reports.activity.table.day')]: item.day,
        [t('reports.activity.table.calls')]: item.calls,
        [t('reports.activity.table.emails')]: item.emails,
        [t('reports.activity.table.meetings')]: item.meetings,
        [t('reports.activity.table.visits')]: item.visits,
      }))
      exportCSV(exportData, `activity-weekly-${timeRange}`)
    } else if (viewType === 'performers') {
      const exportData = data.performers.map(item => ({
        [t('reports.performance.table.name')]: item.name,
        '总活动': item.activities,
        [t('reports.activity.types.call')]: item.calls,
        [t('reports.activity.types.email')]: item.emails,
        [t('reports.activity.types.meeting')]: item.meetings,
      }))
      exportCSV(exportData, `activity-performers-${timeRange}`)
    } else {
      const exportData = data.types.map(item => ({
        '活动类型': t(`reports.activity.types.${item.typeKey}`),
        '数量': item.count,
      }))
      exportCSV(exportData, `activity-types-${timeRange}`)
    }
  }

  // Metrics cards
  const metrics = [
    {
      title: t('reports.activity.metrics.totalActivities'),
      value: data?.metrics.totalActivities.toLocaleString() ?? '-',
      change: '+15.2%',
      trend: 'up',
      icon: Activity,
    },
    {
      title: t('reports.activity.metrics.dailyAvg'),
      value: data?.metrics.dailyAvg.toString() ?? '-',
      change: '+8',
      trend: 'up',
      icon: Calendar,
    },
    {
      title: t('reports.activity.metrics.avgResponseTime'),
      value: data ? `${data.metrics.avgResponseTime}h` : '-',
      change: '-0.5h',
      trend: 'up',
      icon: TrendingDown,
    },
    {
      title: t('reports.activity.metrics.conversionRate'),
      value: data ? `${data.metrics.conversionRate}%` : '-',
      change: '+2.3%',
      trend: 'up',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.activity.title')}</h1>
            <p className="text-muted-foreground">{t('reports.activity.description')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('reports.common.timeRange')} />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t('reports.common.export')}
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metric.change}
                </span>
                <span>{t('reports.common.comparedToLastPeriod')}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList>
          <TabsTrigger value="overview">{t('reports.activity.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="weekly">{t('reports.activity.tabs.weekly')}</TabsTrigger>
          <TabsTrigger value="performers">{t('reports.activity.tabs.performers')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Activity Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.activity.typeDistribution')}</CardTitle>
              <CardDescription>{t('reports.activity.typeDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Bar Chart */}
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  数量: <span className="font-medium">{item.value}</span>
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {typeBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Radar Chart */}
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="type" />
                      <PolarRadiusAxis />
                      <Radar
                        name="活动数量"
                        dataKey="count"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Type Cards */}
              <div className="grid gap-4 mt-4 md:grid-cols-5">
                {data?.types.map((item) => {
                  const IconComponent = TYPE_ICONS[item.typeKey]
                  return (
                    <div key={item.typeKey} className="p-4 border rounded-lg text-center">
                      {IconComponent && (
                        <span style={{ color: item.color }}>
                          <IconComponent className="h-8 w-8 mx-auto mb-2" />
                        </span>
                      )}
                      <div className="text-2xl font-bold">{item.count}</div>
                      <div className="text-sm text-muted-foreground">
                        {t(`reports.activity.types.${item.typeKey}`)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          {/* Weekly Stacked Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.activity.weeklyDetail')}</CardTitle>
              <CardDescription>{t('reports.activity.weeklyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{data.day}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3 text-blue-500" />
                                电话: <span className="font-medium">{data.calls}</span>
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3 text-green-500" />
                                邮件: <span className="font-medium">{data.emails}</span>
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Video className="h-3 w-3 text-purple-500" />
                                会议: <span className="font-medium">{data.meetings}</span>
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3 text-orange-500" />
                                拜访: <span className="font-medium">{data.visits}</span>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="calls" name={t('reports.activity.types.call')} stackId="a" fill={TYPE_COLORS.call} />
                    <Bar dataKey="emails" name={t('reports.activity.types.email')} stackId="a" fill={TYPE_COLORS.email} />
                    <Bar dataKey="meetings" name={t('reports.activity.types.meeting')} stackId="a" fill={TYPE_COLORS.meeting} />
                    <Bar dataKey="visits" name={t('reports.activity.types.visit')} stackId="a" fill={TYPE_COLORS.visit} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.activity.weeklyDetail')}</CardTitle>
              <CardDescription>{t('reports.activity.weeklyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={weeklyColumns}
                  data={data.weekly}
                  showPagination={false}
                  showSearch={false}
                  showDensityToggle={false}
                  loading={isLoading}
                  emptyText={t('reports.common.noData')}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performers" className="space-y-4">
          {/* Performer Ranking */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.activity.performerRanking')}</CardTitle>
              <CardDescription>{t('reports.activity.performerDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={performerColumns}
                  data={data.performers}
                  showPagination={false}
                  showSearch={false}
                  showDensityToggle={false}
                  loading={isLoading}
                  emptyText={t('reports.common.noData')}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ActivityReportPage