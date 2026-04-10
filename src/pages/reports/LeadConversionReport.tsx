/**
 * LeadConversionReport - 线索转化报表
 * Lead Conversion Report Page with Recharts visualization
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
  Target,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserCheck,
  Clock,
  Download,
  RefreshCw,
  ArrowRight,
  Zap,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel as RechartsFunnel,
  LabelList,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { ColumnDef } from '@tanstack/react-table'
import { useLeadConversionReport, useReportTimeRange, useExportReport, TimeRange } from '@/hooks/useReports'

// Time range options
const timeRangeOptions: { value: TimeRange; labelKey: string }[] = [
  { value: 'week', labelKey: 'reports.common.thisWeek' },
  { value: 'month', labelKey: 'reports.common.thisMonth' },
  { value: 'quarter', labelKey: 'reports.common.thisQuarter' },
  { value: 'year', labelKey: 'reports.common.thisYear' },
]

const STAGE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#22c55e']
const SOURCE_COLORS: Record<string, string> = {
  website: '#3b82f6',
  campaign: '#22c55e',
  referral: '#8b5cf6',
  social: '#ec4899',
  other: '#6b7280',
}

export function LeadConversionReportPage() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useReportTimeRange()
  const { data, isLoading, refetch } = useLeadConversionReport(timeRange)
  const { exportCSV } = useExportReport()

  // Prepare funnel chart data
  const funnelChartData = React.useMemo(() => {
    if (!data) return []
    return data.stages.map((stage, index) => ({
      name: t(`reports.leadConversion.stages.${stage.stageKey}`),
      value: stage.count,
      fill: STAGE_COLORS[index],
      rate: stage.rate,
      avgDays: stage.avgDays,
    }))
  }, [data, t])

  // Prepare trend chart data
  const trendChartData = React.useMemo(() => {
    if (!data) return []
    return data.trends.map(trend => ({
      month: trend.month,
      leads: trend.leads,
      converted: trend.converted,
      rate: trend.rate,
    }))
  }, [data])

  // Prepare source bar chart data
  const sourceBarData = React.useMemo(() => {
    if (!data) return []
    return data.sources.map(source => ({
      name: t(`reports.leadConversion.sources.${source.sourceKey}`),
      leads: source.leads,
      converted: source.converted,
      rate: source.rate,
      fill: SOURCE_COLORS[source.sourceKey],
    }))
  }, [data, t])

  // Source table columns
  const sourceColumns: ColumnDef<NonNullable<typeof data>['sources'][number]>[] = [
    {
      accessorKey: 'source',
      header: t('reports.leadConversion.table.source'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`reports.leadConversion.sources.${row.original.sourceKey}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'leads',
      header: t('reports.leadConversion.table.leads'),
      cell: ({ row }) => <span className="font-medium">{row.original.leads}</span>,
    },
    {
      accessorKey: 'converted',
      header: t('reports.leadConversion.table.converted'),
      cell: ({ row }) => (
        <span className="font-medium text-green-600">{row.original.converted}</span>
      ),
    },
    {
      accessorKey: 'rate',
      header: t('reports.leadConversion.table.rate'),
      cell: ({ row }) => (
        <Badge variant={row.original.rate >= 25 ? 'default' : 'secondary'}>
          {row.original.rate}%
        </Badge>
      ),
    },
  ]

  // Export handler
  const handleExport = () => {
    if (!data) return
    const exportData = data.sources.map(source => ({
      [t('reports.leadConversion.table.source')]: t(`reports.leadConversion.sources.${source.sourceKey}`),
      [t('reports.leadConversion.table.leads')]: source.leads,
      [t('reports.leadConversion.table.converted')]: source.converted,
      [t('reports.leadConversion.table.rate')]: `${source.rate}%`,
    }))
    exportCSV(exportData, `lead-conversion-${timeRange}`)
  }

  // Metrics cards
  const metrics = [
    {
      title: t('reports.leadConversion.metrics.totalLeads'),
      value: data?.metrics.totalLeads.toString() ?? '-',
      change: '+30',
      trend: 'up',
      icon: UserPlus,
    },
    {
      title: t('reports.leadConversion.metrics.convertedLeads'),
      value: data?.metrics.convertedLeads.toString() ?? '-',
      change: '+15',
      trend: 'up',
      icon: UserCheck,
    },
    {
      title: t('reports.leadConversion.metrics.conversionRate'),
      value: data ? `${data.metrics.conversionRate}%` : '-',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
    },
    {
      title: t('reports.leadConversion.metrics.avgConversionCycle'),
      value: data ? `${data.metrics.avgConversionCycle}${t('common.unit.days')}` : '-',
      change: `-1.5${t('common.unit.days')}`,
      trend: 'up',
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.leadConversion.title')}</h1>
            <p className="text-muted-foreground">{t('reports.leadConversion.description')}</p>
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

      {/* Conversion Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('reports.leadConversion.pipeline.title')}
          </CardTitle>
          <CardDescription>{t('reports.leadConversion.pipeline.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Funnel Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{d.name}</p>
                            <p className="text-sm text-muted-foreground">
                              数量: <span className="font-medium">{d.value}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              转化率: <span className="font-medium">{d.rate}%</span>
                            </p>
                            {d.avgDays > 0 && (
                              <p className="text-sm text-muted-foreground">
                                平均天数: <span className="font-medium">{d.avgDays}</span>
                              </p>
                            )}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <RechartsFunnel
                    dataKey="value"
                    data={funnelChartData}
                    isAnimationActive
                  >
                    <LabelList
                      position="right"
                      fill="#000"
                      stroke="none"
                      dataKey="name"
                    />
                    {funnelChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RechartsFunnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Pipeline Cards */}
            <div className="flex items-center justify-between gap-2">
              {data?.stages.map((stage, index) => (
                <div key={stage.stageKey} className="flex-1">
                  <div className="p-4 border rounded-lg text-center relative">
                    <Badge variant="outline" className="mb-2">
                      {t(`reports.leadConversion.stages.${stage.stageKey}`)}
                    </Badge>
                    <div className="text-2xl font-bold mb-1">{stage.count}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {stage.rate}% {t('reports.salesFunnel.table.conversionRate')}
                    </div>
                    {stage.avgDays > 0 && (
                      <div className="text-xs text-muted-foreground">
                        平均 {stage.avgDays} {t('common.unit.days')}
                      </div>
                    )}
                    {index < data.stages.length - 1 && (
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source Analysis & Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Source Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.leadConversion.sourceAnalysis.title')}</CardTitle>
            <CardDescription>{t('reports.leadConversion.sourceAnalysis.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{d.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('reports.leadConversion.sourceAnalysis.leads')}: <span className="font-medium">{d.leads}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('reports.leadConversion.sourceAnalysis.converted')}: <span className="font-medium text-green-600">{d.converted}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('reports.leadConversion.table.rate')}: <span className="font-medium">{d.rate}%</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="leads" name={t('reports.leadConversion.sourceAnalysis.leads')} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" name={t('reports.leadConversion.sourceAnalysis.converted')} fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Source Table */}
            <div className="mt-4">
              {data && (
                <DataTable
                  columns={sourceColumns}
                  data={data.sources}
                  showPagination={false}
                  showSearch={false}
                  showDensityToggle={false}
                  loading={isLoading}
                  emptyText={t('reports.common.noData')}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Trends */}
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.leadConversion.trends.title')}</CardTitle>
            <CardDescription>{t('reports.leadConversion.trends.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{d.month}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('reports.leadConversion.table.leads')}: <span className="font-medium">{d.leads}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('reports.leadConversion.table.converted')}: <span className="font-medium text-green-600">{d.converted}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('reports.leadConversion.table.rate')}: <span className="font-medium text-blue-600">{d.rate}%</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="leads"
                    name={t('reports.leadConversion.table.leads')}
                    stroke="#94a3b8"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="converted"
                    name={t('reports.leadConversion.table.converted')}
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rate"
                    name={t('reports.leadConversion.table.rate')}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LeadConversionReportPage