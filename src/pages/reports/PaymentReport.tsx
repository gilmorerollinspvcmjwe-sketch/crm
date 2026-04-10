/**
 * PaymentReport - 回款分析报表
 * Payment Analysis Report Page with Recharts visualization
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Clock,
  Download,
  RefreshCw,
  PieChart,
  AlertCircle,
} from 'lucide-react'
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Bar,
  Line,
} from 'recharts'
import { ColumnDef } from '@tanstack/react-table'
import { usePaymentReport, useReportTimeRange, useExportReport, TimeRange } from '@/hooks/useReports'

// Time range options
const timeRangeOptions: { value: TimeRange; labelKey: string }[] = [
  { value: 'week', labelKey: 'reports.common.thisWeek' },
  { value: 'month', labelKey: 'reports.common.thisMonth' },
  { value: 'quarter', labelKey: 'reports.common.thisQuarter' },
  { value: 'year', labelKey: 'reports.common.thisYear' },
]

const OVERDUE_LEVEL_COLORS: Record<string, string> = {
  severe: '#ef4444',
  medium: '#f97316',
  minor: '#eab308',
}

export function PaymentReportPage() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useReportTimeRange()
  const { data, isLoading, refetch } = usePaymentReport(timeRange)
  const { exportCSV } = useExportReport()
  const [viewType, setViewType] = React.useState('overview')

  // Prepare pie chart data for payment status
  const statusPieData = React.useMemo(() => {
    if (!data) return []
    return data.status.map(status => ({
      name: t(`reports.payment.status.${status.statusKey}`),
      value: status.amount / 10000,
      count: status.count,
      percentage: status.percentage,
      fill: status.color,
    }))
  }, [data, t])

  // Prepare trend chart data
  const trendChartData = React.useMemo(() => {
    if (!data) return []
    return data.trends.map(trend => ({
      month: trend.month,
      plan: trend.plan / 10000,
      actual: trend.actual / 10000,
      rate: trend.rate,
    }))
  }, [data])

  // Prepare overdue table data
  const overdueTableData = React.useMemo(() => {
    if (!data) return []
    return data.overdue.map(item => ({
      ...item,
      levelColor: OVERDUE_LEVEL_COLORS[item.statusKey],
    }))
  }, [data])

  // Trend table columns
  const trendColumns: ColumnDef<NonNullable<typeof data>['trends'][number]>[] = [
    {
      accessorKey: 'month',
      header: t('reports.payment.table.month'),
      cell: ({ row }) => <span className="font-medium">{row.original.month}</span>,
    },
    {
      accessorKey: 'plan',
      header: t('reports.payment.table.plan'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{(row.original.plan / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'actual',
      header: t('reports.payment.table.actual'),
      cell: ({ row }) => (
        <span className="font-medium">
          ¥{(row.original.actual / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'rate',
      header: t('reports.payment.table.completion'),
      cell: ({ row }) => (
        <Badge variant={row.original.rate >= 100 ? 'default' : row.original.rate >= 95 ? 'secondary' : 'destructive'}>
          {row.original.rate}%
        </Badge>
      ),
    },
  ]

  // Overdue columns
  const overdueColumns: ColumnDef<typeof overdueTableData[0]>[] = [
    {
      accessorKey: 'customer',
      header: '客户',
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.customer}</span>
          <span className="text-sm text-muted-foreground ml-2">{row.original.contract}</span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: '金额',
      cell: ({ row }) => (
        <span className="font-bold text-red-600">
          ¥{(row.original.amount / 10000).toFixed(0)}{t('common.unit.tenThousand')}
        </span>
      ),
    },
    {
      accessorKey: 'overdueDays',
      header: '逾期天数',
      cell: ({ row }) => (
        <Badge variant={
          row.original.overdueDays > 30 ? 'destructive' :
          row.original.overdueDays > 15 ? 'secondary' : 'outline'
        }>
          {row.original.overdueDays}{t('common.unit.days')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: '严重程度',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="border-current"
          style={{ color: row.original.levelColor }}
        >
          {t(`reports.payment.overdueLevel.${row.original.statusKey}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: t('common.actions'),
      cell: () => (
        <Button size="sm" variant="outline">
          {t('reports.payment.followUp')}
        </Button>
      ),
    },
  ]

  // Export handler
  const handleExport = () => {
    if (!data) return
    if (viewType === 'overdue') {
      const exportData = data.overdue.map(item => ({
        '客户': item.customer,
        '合同号': item.contract,
        '金额': item.amount,
        '逾期天数': item.overdueDays,
        '严重程度': t(`reports.payment.overdueLevel.${item.statusKey}`),
      }))
      exportCSV(exportData, `payment-overdue-${timeRange}`)
    } else {
      const exportData = data.trends.map(trend => ({
        [t('reports.payment.table.month')]: trend.month,
        [t('reports.payment.table.plan')]: trend.plan,
        [t('reports.payment.table.actual')]: trend.actual,
        [t('reports.payment.table.completion')]: `${trend.rate}%`,
      }))
      exportCSV(exportData, `payment-trends-${timeRange}`)
    }
  }

  // Metrics cards
  const metrics = [
    {
      title: t('reports.payment.metrics.totalPayment'),
      value: data ? `¥${(data.metrics.totalPayment / 10000).toFixed(0)}${t('common.unit.tenThousand')}` : '-',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: t('reports.payment.metrics.completionRate'),
      value: data ? `${data.metrics.completionRate}%` : '-',
      change: '+2.3%',
      trend: 'up',
      icon: CreditCard,
    },
    {
      title: t('reports.payment.metrics.avgCycle'),
      value: data ? `${data.metrics.avgCycle}${t('common.unit.days')}` : '-',
      change: `-5${t('common.unit.days')}`,
      trend: 'up',
      icon: Clock,
    },
    {
      title: t('reports.payment.metrics.overdueAmount'),
      value: data ? `¥${(data.metrics.overdueAmount / 10000).toFixed(0)}${t('common.unit.tenThousand')}` : '-',
      change: '-8.2%',
      trend: 'up',
      icon: AlertCircle,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('reports.payment.title')}</h1>
            <p className="text-muted-foreground">{t('reports.payment.description')}</p>
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

      {/* Payment Tabs */}
      <Tabs value={viewType} onValueChange={setViewType}>
        <TabsList>
          <TabsTrigger value="overview">{t('reports.payment.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="trends">{t('reports.payment.tabs.trends')}</TabsTrigger>
          <TabsTrigger value="overdue">{t('reports.payment.tabs.overdue')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {t('reports.payment.statusDistribution')}
              </CardTitle>
              <CardDescription>{t('reports.payment.statusDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart */}
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3">
                                <p className="font-medium">{d.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  金额: <span className="font-medium">¥{d.value.toFixed(0)}{t('common.unit.tenThousand')}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  笔数: <span className="font-medium">{d.count}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  占比: <span className="font-medium">{d.percentage}%</span>
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

                {/* Status Cards */}
                <div className="grid gap-3">
                  {data?.status.map((item) => (
                    <div key={item.statusKey} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-medium">
                            {t(`reports.payment.status.${item.statusKey}`)}
                          </span>
                        </div>
                        <Badge variant={
                          item.statusKey === 'paid' ? 'default' :
                          item.statusKey === 'partial' ? 'secondary' : 'destructive'
                        }>
                          {item.count}{t('common.unit.record')}
                        </Badge>
                      </div>
                      <div className="text-xl font-bold mb-2">
                        ¥{(item.amount / 10000).toFixed(0)}{t('common.unit.tenThousand')}
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {item.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.payment.monthlyTrend')}</CardTitle>
              <CardDescription>{t('reports.payment.monthlyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{d.month}</p>
                              <p className="text-sm text-muted-foreground">
                                {t('reports.payment.table.plan')}: <span className="font-medium">¥{d.plan.toFixed(0)}{t('common.unit.tenThousand')}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t('reports.payment.table.actual')}: <span className="font-medium">¥{d.actual.toFixed(0)}{t('common.unit.tenThousand')}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t('reports.payment.table.completion')}: <span className="font-medium text-blue-600">{d.rate}%</span>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="plan" name={t('reports.payment.table.plan')} fill="#94a3b8" yAxisId="left" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name={t('reports.payment.table.actual')} fill="#22c55e" yAxisId="left" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="rate" name={t('reports.payment.table.completion')} stroke="#3b82f6" strokeWidth={2} yAxisId="right" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.payment.monthlyTrend')}</CardTitle>
              <CardDescription>{t('reports.payment.monthlyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={trendColumns}
                  data={data.trends}
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

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                {t('reports.payment.overdueWarning')}
              </CardTitle>
              <CardDescription>{t('reports.payment.overdueDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={overdueColumns}
                  data={overdueTableData}
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

export default PaymentReportPage