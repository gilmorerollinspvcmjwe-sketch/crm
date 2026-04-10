/**
 * SalesFunnelReport - 销售漏斗报表
 * Sales Funnel Report Page with Recharts visualization
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
  Funnel as FunnelIcon,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  FunnelChart,
  Funnel as RechartsFunnel,
  LabelList,
} from 'recharts'
import { ColumnDef } from '@tanstack/react-table'
import { useSalesFunnelReport, useReportTimeRange, useExportReport, TimeRange } from '@/hooks/useReports'

// Time range options
const timeRangeOptions: { value: TimeRange; labelKey: string }[] = [
  { value: 'week', labelKey: 'reports.common.thisWeek' },
  { value: 'month', labelKey: 'reports.common.thisMonth' },
  { value: 'quarter', labelKey: 'reports.common.thisQuarter' },
  { value: 'year', labelKey: 'reports.common.thisYear' },
]

export function SalesFunnelReportPage() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useReportTimeRange()
  const { data, isLoading, refetch } = useSalesFunnelReport(timeRange)
  const { exportCSV } = useExportReport()

  // Prepare funnel chart data
  const funnelChartData = React.useMemo(() => {
    if (!data) return []
    return data.stages.map(stage => ({
      name: t(`reports.salesFunnel.stages.${stage.stageKey}`),
      value: stage.count,
      fill: stage.color,
      conversionRate: stage.conversionRate,
    }))
  }, [data, t])

  // Prepare bar chart data for stage comparison
  const barChartData = React.useMemo(() => {
    if (!data) return []
    return data.stages.map(stage => ({
      name: t(`reports.salesFunnel.stages.${stage.stageKey}`),
      count: stage.count,
      amount: stage.value / 10000,
      conversionRate: stage.conversionRate,
    }))
  }, [data, t])

  // Table columns
  const columns: ColumnDef<NonNullable<typeof data>['stages'][number]>[] = [
    {
      accessorKey: 'stage',
      header: t('reports.salesFunnel.table.stage'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`reports.salesFunnel.stages.${row.original.stageKey}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'count',
      header: t('reports.salesFunnel.table.count'),
      cell: ({ row }) => <span className="font-medium">{row.original.count}</span>,
    },
    {
      accessorKey: 'value',
      header: t('reports.salesFunnel.table.amount'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{row.original.value.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'conversionRate',
      header: t('reports.salesFunnel.table.conversionRate'),
      cell: ({ row }) => (
        <Badge variant={row.original.conversionRate > 20 ? 'default' : 'secondary'}>
          {row.original.conversionRate}%
        </Badge>
      ),
    },
  ]

  // Export handler
  const handleExport = () => {
    if (!data) return
    const exportData = data.stages.map(stage => ({
      [t('reports.salesFunnel.table.stage')]: t(`reports.salesFunnel.stages.${stage.stageKey}`),
      [t('reports.salesFunnel.table.count')]: stage.count,
      [t('reports.salesFunnel.table.amount')]: stage.value,
      [t('reports.salesFunnel.table.conversionRate')]: `${stage.conversionRate}%`,
    }))
    exportCSV(exportData, `sales-funnel-${timeRange}`)
  }

  // Metrics cards
  const metrics = [
    {
      title: t('reports.salesFunnel.metrics.totalLeads'),
      value: data?.metrics.totalLeads.toLocaleString() ?? '-',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: t('reports.salesFunnel.metrics.conversionRate'),
      value: data ? `${data.metrics.conversionRate}%` : '-',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
    },
    {
      title: t('reports.salesFunnel.metrics.avgDealCycle'),
      value: data ? `${data.metrics.avgDealCycle}${t('common.unit.days')}` : '-',
      change: `-3${t('common.unit.days')}`,
      trend: 'up',
      icon: Calendar,
    },
    {
      title: t('reports.salesFunnel.metrics.forecastAmount'),
      value: data ? `¥${(data.metrics.forecastAmount / 10000).toFixed(0)}${t('common.unit.tenThousand')}` : '-',
      change: '+15.2%',
      trend: 'up',
      icon: DollarSign,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FunnelIcon className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.salesFunnel.title')}</h1>
            <p className="text-muted-foreground">{t('reports.salesFunnel.description')}</p>
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

      {/* Metrics Cards */}
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

      {/* Funnel Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('reports.salesFunnel.funnelChart')}</CardTitle>
              <CardDescription>{t('reports.salesFunnel.table.count')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('reports.common.filter')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
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
                            转化率: <span className="font-medium">{data.conversionRate}%</span>
                          </p>
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
        </CardContent>
      </Card>

      {/* Bar Chart & Conversion Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.salesFunnel.funnelChart')}</CardTitle>
            <CardDescription>{t('reports.salesFunnel.table.count')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              商机数: <span className="font-medium">{data.count}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              金额: <span className="font-medium">¥{data.amount}万</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              转化率: <span className="font-medium">{data.conversionRate}%</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {barChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={data?.stages[index]?.color || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.salesFunnel.stageConversion')}</CardTitle>
            <CardDescription>{t('reports.salesFunnel.conversionBetween')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.stages.slice(0, -1).map((stage, index) => {
                const nextStage = data.stages[index + 1]
                const conversion = ((nextStage.count / stage.count) * 100).toFixed(1)
                return (
                  <div key={stage.stageKey} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {t(`reports.salesFunnel.stages.${stage.stageKey}`)}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline">
                        {t(`reports.salesFunnel.stages.${nextStage.stageKey}`)}
                      </Badge>
                    </div>
                    <Badge variant={parseFloat(conversion) > 50 ? 'default' : 'secondary'}>
                      {conversion}%
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.salesFunnel.prediction')}</CardTitle>
            <CardDescription>{t('reports.salesFunnel.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">{t('reports.salesFunnel.predictedDeals')}</span>
                <span className="font-bold text-green-600">
                  {data?.predictions.predictedDeals} {t('common.unit.count')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">{t('reports.salesFunnel.predictedAmount')}</span>
                <span className="font-bold text-green-600">
                  ¥{(data?.predictions.predictedAmount || 0) / 10000}{t('common.unit.tenThousand')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">{t('reports.salesFunnel.targetProbability')}</span>
                <span className="font-bold text-blue-600">
                  {data?.predictions.targetProbability}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.salesFunnel.funnelChart')}</CardTitle>
            <CardDescription>{t('reports.salesFunnel.table.stage')}</CardDescription>
          </CardHeader>
          <CardContent>
            {data && (
              <DataTable
                columns={columns}
                data={data.stages}
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
    </div>
  )
}

export default SalesFunnelReportPage