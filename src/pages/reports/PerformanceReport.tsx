/**
 * PerformanceReport - 业绩统计报表
 * Performance Statistics Report Page with Recharts visualization
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Trophy,
  Medal,
  Award,
  Download,
  RefreshCw,
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
  Area,
  AreaChart,
} from 'recharts'
import { ColumnDef } from '@tanstack/react-table'
import { usePerformanceReport, useReportTimeRange, useExportReport, TimeRange } from '@/hooks/useReports'

// Time range options
const timeRangeOptions: { value: TimeRange; labelKey: string }[] = [
  { value: 'week', labelKey: 'reports.common.thisWeek' },
  { value: 'month', labelKey: 'reports.common.thisMonth' },
  { value: 'quarter', labelKey: 'reports.common.thisQuarter' },
  { value: 'year', labelKey: 'reports.common.thisYear' },
]

export function PerformanceReportPage() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useReportTimeRange()
  const { data, isLoading, refetch } = usePerformanceReport(timeRange)
  const { exportCSV } = useExportReport()
  const [viewType, setViewType] = React.useState('personal')

  // Prepare trend chart data
  const trendChartData = React.useMemo(() => {
    if (!data) return []
    return data.trend.map(item => ({
      month: item.month,
      value: item.value / 10000,
    }))
  }, [data])

  // Personal ranking columns
  const personalColumns: ColumnDef<NonNullable<typeof data>['personal'][number]>[] = [
    {
      accessorKey: 'rank',
      header: t('reports.performance.table.rank'),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
          {row.original.rank === 1 ? (
            <Trophy className="h-5 w-5 text-yellow-500" />
          ) : row.original.rank === 2 ? (
            <Medal className="h-5 w-5 text-gray-400" />
          ) : row.original.rank === 3 ? (
            <Award className="h-5 w-5 text-amber-600" />
          ) : (
            <span className="text-sm font-medium">{row.original.rank}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: t('reports.performance.table.name'),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.team}</div>
        </div>
      ),
    },
    {
      accessorKey: 'target',
      header: t('reports.performance.table.target'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{(row.original.target / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'actual',
      header: t('reports.performance.table.actual'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{(row.original.actual / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'rate',
      header: t('reports.performance.table.completionRate'),
      cell: ({ row }) => (
        <Badge variant={row.original.rate >= 100 ? 'default' : 'secondary'}>
          {row.original.rate}%
        </Badge>
      ),
    },
  ]

  // Team ranking columns
  const teamColumns: ColumnDef<NonNullable<typeof data>['teams'][number]>[] = [
    {
      accessorKey: 'team',
      header: t('reports.performance.table.team'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{row.original.team}</Badge>
          <span className="text-sm text-muted-foreground">{row.original.members}人</span>
        </div>
      ),
    },
    {
      accessorKey: 'target',
      header: t('reports.performance.table.target'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{(row.original.target / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'actual',
      header: t('reports.performance.table.actual'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{(row.original.actual / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'gap',
      header: t('reports.performance.table.gap'),
      cell: ({ row }) => (
        <span className={`font-medium ${row.original.actual >= row.original.target ? 'text-green-600' : 'text-red-600'}`}>
          ¥{((row.original.actual - row.original.target) / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'rate',
      header: t('reports.performance.table.completionRate'),
      cell: ({ row }) => (
        <Badge variant={row.original.rate >= 100 ? 'default' : 'secondary'}>
          {row.original.rate}%
        </Badge>
      ),
    },
  ]

  // Export handler
  const handleExport = () => {
    if (!data) return
    if (viewType === 'personal') {
      const exportData = data.personal.map(item => ({
        [t('reports.performance.table.rank')]: item.rank,
        [t('reports.performance.table.name')]: item.name,
        [t('reports.performance.table.team')]: item.team,
        [t('reports.performance.table.target')]: item.target,
        [t('reports.performance.table.actual')]: item.actual,
        [t('reports.performance.table.completionRate')]: `${item.rate}%`,
      }))
      exportCSV(exportData, `performance-personal-${timeRange}`)
    } else {
      const exportData = data.teams.map(item => ({
        [t('reports.performance.table.team')]: item.team,
        [t('reports.performance.table.target')]: item.target,
        [t('reports.performance.table.actual')]: item.actual,
        [t('reports.performance.table.gap')]: item.actual - item.target,
        [t('reports.performance.table.completionRate')]: `${item.rate}%`,
      }))
      exportCSV(exportData, `performance-team-${timeRange}`)
    }
  }

  // Metrics cards
  const metrics = [
    {
      title: t('reports.performance.metrics.totalSales'),
      value: data ? `¥${(data.metrics.totalSales / 10000).toFixed(0)}${t('common.unit.tenThousand')}` : '-',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: t('reports.performance.metrics.targetCompletion'),
      value: data ? `${data.metrics.targetCompletion}%` : '-',
      change: '+5.2%',
      trend: 'up',
      icon: Target,
    },
    {
      title: t('reports.performance.metrics.avgDealSize'),
      value: data ? `¥${(data.metrics.avgDealSize / 10000).toFixed(1)}${t('common.unit.tenThousand')}` : '-',
      change: '+8.3%',
      trend: 'up',
      icon: BarChart3,
    },
    {
      title: t('reports.performance.metrics.activeSalespeople'),
      value: data ? `${data.metrics.activeSalespeople}人` : '-',
      change: '+3人',
      trend: 'up',
      icon: Users,
    },
  ]

  // Prepare team bar chart data
  const teamBarData = React.useMemo(() => {
    if (!data) return []
    return data.teams.map(team => ({
      name: team.team,
      target: team.target / 10000,
      actual: team.actual / 10000,
      rate: team.rate,
    }))
  }, [data])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.performance.title')}</h1>
            <p className="text-muted-foreground">{t('reports.performance.description')}</p>
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

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.performance.trendChart')}</CardTitle>
          <CardDescription>{t('reports.performance.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value as number
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{payload[0].payload.month}</p>
                          <p className="text-sm text-muted-foreground">
                            业绩: <span className="font-medium">¥{value.toFixed(0)}{t('common.unit.tenThousand')}</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList>
          <TabsTrigger value="personal">{t('reports.performance.tabs.personal')}</TabsTrigger>
          <TabsTrigger value="team">{t('reports.performance.tabs.team')}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.performance.ranking')}</CardTitle>
              <CardDescription>{t('reports.performance.monthlyRanking')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={personalColumns}
                  data={data.personal}
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

        <TabsContent value="team" className="space-y-4">
          {/* Team Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.performance.teamPerformance')}</CardTitle>
              <CardDescription>{t('reports.performance.teamSummary')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                目标: <span className="font-medium">¥{data.target.toFixed(0)}{t('common.unit.tenThousand')}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                实际: <span className="font-medium">¥{data.actual.toFixed(0)}{t('common.unit.tenThousand')}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                完成率: <span className="font-medium">{data.rate}%</span>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="target" name="目标" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="实际" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Team Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.performance.teamPerformance')}</CardTitle>
              <CardDescription>{t('reports.performance.teamSummary')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={teamColumns}
                  data={data.teams}
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

export default PerformanceReportPage