/**
 * CustomerReport - 客户分析报表
 * Customer Analysis Report Page with Recharts visualization
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable } from '@/components/DataTable/DataTable'
import {
  Users,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserCheck,
  Building,
  Download,
  RefreshCw,
  PieChart,
} from 'lucide-react'
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { ColumnDef } from '@tanstack/react-table'
import { useCustomerReport, useReportTimeRange, useExportReport, TimeRange } from '@/hooks/useReports'

// Time range options
const timeRangeOptions: { value: TimeRange; labelKey: string }[] = [
  { value: 'week', labelKey: 'reports.common.thisWeek' },
  { value: 'month', labelKey: 'reports.common.thisMonth' },
  { value: 'quarter', labelKey: 'reports.common.thisQuarter' },
  { value: 'year', labelKey: 'reports.common.thisYear' },
]

export function CustomerReportPage() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useReportTimeRange()
  const { data, isLoading, refetch } = useCustomerReport(timeRange)
  const { exportCSV } = useExportReport()

  // Prepare pie chart data for segments
  const segmentPieData = React.useMemo(() => {
    if (!data) return []
    return data.segments.map(segment => ({
      name: t(`reports.customer.segments.${segment.segmentKey}`),
      value: segment.count,
      percentage: segment.percentage,
      revenue: segment.revenue,
      fill: segment.color,
    }))
  }, [data, t])

  // Prepare pie chart data for industries
  const industryPieData = React.useMemo(() => {
    if (!data) return []
    return data.industries.map(industry => ({
      name: industry.industry,
      value: industry.count,
      percentage: industry.percentage,
      fill: industry.color,
    }))
  }, [data])

  // Prepare trend chart data
  const trendChartData = React.useMemo(() => {
    if (!data) return []
    return data.trends.map(trend => ({
      month: trend.month,
      newCustomers: trend.newCustomers,
      activeCustomers: trend.activeCustomers,
      churned: trend.churned,
    }))
  }, [data])

  // Industry table columns
  const industryColumns: ColumnDef<NonNullable<typeof data>['industries'][number]>[] = [
    {
      accessorKey: 'industry',
      header: t('reports.customer.table.industry'),
      cell: ({ row }) => <span className="font-medium">{row.original.industry}</span>,
    },
    {
      accessorKey: 'count',
      header: t('reports.customer.table.count'),
      cell: ({ row }) => <span className="font-medium">{row.original.count}</span>,
    },
    {
      accessorKey: 'percentage',
      header: t('reports.customer.table.percentage'),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.percentage}%</Badge>
      ),
    },
  ]

  // Export handler
  const handleExport = () => {
    if (!data) return
    const exportData = data.industries.map(industry => ({
      [t('reports.customer.table.industry')]: industry.industry,
      [t('reports.customer.table.count')]: industry.count,
      [t('reports.customer.table.percentage')]: `${industry.percentage}%`,
    }))
    exportCSV(exportData, `customer-analysis-${timeRange}`)
  }

  // Metrics cards
  const metrics = [
    {
      title: t('reports.customer.metrics.totalCustomers'),
      value: data?.metrics.totalCustomers.toString() ?? '-',
      change: '+68',
      trend: 'up',
      icon: Users,
    },
    {
      title: t('reports.customer.metrics.newCustomers'),
      value: data?.metrics.newCustomers.toString() ?? '-',
      change: '+23%',
      trend: 'up',
      icon: UserPlus,
    },
    {
      title: t('reports.customer.metrics.activeCustomers'),
      value: data?.metrics.activeCustomers.toString() ?? '-',
      change: '+72%',
      trend: 'up',
      icon: UserCheck,
    },
    {
      title: t('reports.customer.metrics.churnRate'),
      value: data ? `${data.metrics.churnRate}%` : '-',
      change: '-0.3%',
      trend: 'up',
      icon: TrendingDown,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.customer.title')}</h1>
            <p className="text-muted-foreground">{t('reports.customer.description')}</p>
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

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.customer.segments.title')}</CardTitle>
          <CardDescription>{t('reports.customer.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart */}
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={segmentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {segmentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              数量: <span className="font-medium">{data.value}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              占比: <span className="font-medium">{data.percentage}%</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              收入: <span className="font-medium">¥{(data.revenue / 10000).toFixed(0)}万</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            {/* Segment Cards */}
            <div className="grid gap-3 grid-cols-2">
              {data?.segments.map((segment) => (
                <div key={segment.segmentKey} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {t(`reports.customer.segments.${segment.segmentKey}`)}
                    </span>
                    <Badge variant="outline">{segment.count}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-xs text-muted-foreground">
                      {segment.percentage}% · ¥{(segment.revenue / 10000).toFixed(0)}万
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Distribution & Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {t('reports.customer.distribution.title')}
            </CardTitle>
            <CardDescription>{t('reports.customer.distribution.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryPieData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={70} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              数量: <span className="font-medium">{data.value}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              占比: <span className="font-medium">{data.percentage}%</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {industryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t('reports.customer.trends.title')}
            </CardTitle>
            <CardDescription>{t('reports.customer.trends.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.month}</p>
                            <p className="text-sm text-muted-foreground">
                              新增: <span className="font-medium text-green-600">{data.newCustomers}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              活跃: <span className="font-medium text-blue-600">{data.activeCustomers}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              流失: <span className="font-medium text-red-600">{data.churned}</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newCustomers"
                    name={t('reports.customer.trends.new')}
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeCustomers"
                    name={t('reports.customer.trends.active')}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="churned"
                    name={t('reports.customer.trends.churned')}
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.customer.distribution.title')}</CardTitle>
          <CardDescription>{t('reports.customer.distribution.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {data && (
            <DataTable
              columns={industryColumns}
              data={data.industries}
              showPagination={false}
              showSearch={false}
              showDensityToggle={false}
              loading={isLoading}
              emptyText={t('reports.common.noData')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerReportPage