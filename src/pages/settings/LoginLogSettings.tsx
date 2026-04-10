"use client"

import React, { useState, useMemo, useCallback } from 'react'
import {
  Shield,
  Download,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  User,
  Monitor,
  LogIn,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Smartphone,
  Globe,
  Lock,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

import { useLoginLogs, useLoginLogStats } from '@/hooks/api/useLoginLogs'
import type { LoginLogEntry, LoginLogFilter, LoginStatus, LoginType } from '@/types/loginLog'
import { LoginStatus as LS, LoginType as LT, loginStatusMap, loginMethodMap } from '@/types/loginLog'

// 登录日志设置页面
export function LoginLogSettingsPage() {
  // 状态
  const [filters, setFilters] = useState<Partial<LoginLogFilter>>({
    page: 1,
    pageSize: 20,
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedLog, setSelectedLog] = useState<LoginLogEntry | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  // 数据
  const { data: statsData } = useLoginLogStats()
  const { data: logsData, isLoading } = useLoginLogs(filters as LoginLogFilter)

  // 处理搜索
  const handleSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }))
  }, [searchInput])

  // 处理筛选变化
  const handleFilterChange = useCallback((key: keyof LoginLogFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }))
  }, [])

  // 处理日期范围
  const handleDateRangeChange = useCallback((range: { from?: string; to?: string }) => {
    setFilters(prev => ({
      ...prev,
      startDate: range.from,
      endDate: range.to,
      page: 1,
    }))
  }, [])

  // 处理分页
  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }, [])

  // 处理重置
  const handleReset = useCallback(() => {
    setFilters({ page: 1, pageSize: 20 })
    setSearchInput('')
  }, [])

  // 查看详情
  const handleViewDetail = useCallback((log: LoginLogEntry) => {
    setSelectedLog(log)
    setDetailVisible(true)
  }, [])

  // 导出
  const handleExport = useCallback(() => {
    const dataToExport = logsData?.data || []
    const csvContent = dataToExport.map(log => [
      new Date(log.timestamp).toLocaleString('zh-CN'),
      log.userDisplayName,
      log.userName,
      loginStatusMap[log.status]?.label || log.status,
      loginMethodMap[log.loginType]?.label || log.loginType,
      log.ipAddress,
      log.location || '',
      log.device || '',
      log.failureReason || '',
    ].join(',')).join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `login-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [logsData])

  // 获取状态徽章变体
  const getStatusBadgeVariant = (status: LoginStatus) => {
    const config = loginStatusMap[status]
    switch (config?.color) {
      case 'success': return 'success'
      case 'destructive': return 'destructive'
      case 'warning': return 'warning'
      case 'secondary': return 'secondary'
      default: return 'secondary'
    }
  }

  // 获取登录方式徽章变体
  const getMethodBadgeVariant = (method: LoginType) => {
    const config = loginMethodMap[method]
    switch (config?.color) {
      case 'blue': return 'info'
      case 'purple': return 'secondary'
      case 'cyan': return 'info'
      case 'orange': return 'warning'
      default: return 'secondary'
    }
  }

  const totalPages = Math.ceil((logsData?.total || 0) / (filters.pageSize || 20))
  const logs = logsData?.data || []
  const stats = statsData

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">登录日志</h1>
            <p className="text-muted-foreground text-sm">查看用户登录记录和安全事件</p>
          </div>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          导出日志
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总登录次数</p>
                <p className="text-2xl font-bold">{stats?.total ?? '-'}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">成功登录</p>
                <p className="text-2xl font-bold text-green-600">{stats?.success ?? '-'}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">失败登录</p>
                <p className="text-2xl font-bold text-red-600">{stats?.failed ?? '-'}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500/10">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">登录成功率</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.successRate !== undefined ? `${stats.successRate}%` : '-'}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今日活跃用户 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            今日活跃用户
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {stats?.todayActiveUsers ?? '-'} 人
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="pt-4">
          {/* 搜索和筛选切换 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、邮箱、IP地址..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary" size="sm">
              搜索
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              筛选
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
            <Button onClick={handleReset} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" />
              重置
            </Button>
          </div>

          {/* 高级筛选 */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-muted/30 rounded-lg">
              {/* 登录状态 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">登录状态</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(v) => handleFilterChange('status', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    {Object.values(LS).map((status) => (
                      <SelectItem key={status} value={status}>
                        {loginStatusMap[status]?.label || status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 登录方式 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">登录方式</Label>
                <Select
                  value={filters.loginType || 'all'}
                  onValueChange={(v) => handleFilterChange('loginType', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="全部方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部方式</SelectItem>
                    {Object.values(LT).map((type) => (
                      <SelectItem key={type} value={type}>
                        {loginMethodMap[type]?.label || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 用户名 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">用户名</Label>
                <Input
                  placeholder="输入用户名"
                  value={filters.userId || ''}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  className="h-9"
                />
              </div>

              {/* 开始日期 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">开始日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !filters.startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.startDate ? filters.startDate : '选择日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.startDate ? new Date(filters.startDate) : undefined}
                      onSelect={(date) => handleDateRangeChange({
                        from: date?.toISOString().split('T')[0],
                        to: filters.endDate,
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 结束日期 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">结束日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !filters.endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.endDate ? filters.endDate : '选择日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.endDate ? new Date(filters.endDate) : undefined}
                      onSelect={(date) => handleDateRangeChange({
                        from: filters.startDate,
                        to: date?.toISOString().split('T')[0],
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 日志列表 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              登录记录
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (共 {logsData?.total ?? 0} 条记录)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">登录时间</TableHead>
                  <TableHead className="w-[120px]">用户</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[80px]">方式</TableHead>
                  <TableHead className="w-[130px]">IP地址</TableHead>
                  <TableHead className="w-[120px]">位置</TableHead>
                  <TableHead className="w-[160px]">设备</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.userDisplayName}</span>
                          <span className="text-xs text-muted-foreground">{log.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(log.status)} className="text-xs">
                          {loginStatusMap[log.status]?.label || log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getMethodBadgeVariant(log.loginType)} className="text-xs">
                          {loginMethodMap[log.loginType]?.label || log.loginType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {log.location || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs max-w-[160px] truncate" title={log.device}>
                        <div className="flex items-center gap-1">
                          {log.device?.includes('iOS') || log.device?.includes('Android') ? (
                            <Smartphone className="w-3 h-3 text-muted-foreground shrink-0" />
                          ) : (
                            <Monitor className="w-3 h-3 text-muted-foreground shrink-0" />
                          )}
                          <span className="truncate">{log.device || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(log)}
                          className="h-8 px-2"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {(logsData?.total ?? 0) > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                显示 {((filters.page || 1) - 1) * (filters.pageSize || 20) + 1}-
                {Math.min((filters.page || 1) * (filters.pageSize || 20), logsData?.total || 0)} 条，
                共 {logsData?.total || 0} 条
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={String(filters.pageSize || 20)}
                  onValueChange={(v) => setFilters(prev => ({ ...prev, pageSize: Number(v), page: 1 }))}
                >
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 条/页</SelectItem>
                    <SelectItem value="20">20 条/页</SelectItem>
                    <SelectItem value="50">50 条/页</SelectItem>
                    <SelectItem value="100">100 条/页</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={filters.page === 1}
                  >
                    首页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    disabled={filters.page === 1}
                  >
                    上一页
                  </Button>
                  <span className="px-3 text-sm">
                    第 {filters.page || 1} / {totalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    disabled={filters.page === totalPages}
                  >
                    下一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={filters.page === totalPages}
                  >
                    末页
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 详情弹窗 */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              登录详情
            </DialogTitle>
            <DialogDescription>
              查看登录记录的完整信息
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">登录时间</p>
                  <p className="text-sm font-mono">
                    {new Date(selectedLog.timestamp).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">登录状态</p>
                  <Badge variant={getStatusBadgeVariant(selectedLog.status)}>
                    {loginStatusMap[selectedLog.status]?.label || selectedLog.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">用户</p>
                  <p className="text-sm flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {selectedLog.userDisplayName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">用户名</p>
                  <p className="text-sm">{selectedLog.userName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">邮箱</p>
                  <p className="text-sm">{selectedLog.userEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">登录方式</p>
                  <Badge variant={getMethodBadgeVariant(selectedLog.loginType)}>
                    {loginMethodMap[selectedLog.loginType]?.label || selectedLog.loginType}
                  </Badge>
                </div>
              </div>

              {/* 失败原因 */}
              {selectedLog.failureReason && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">失败原因</p>
                    <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                      {selectedLog.failureReason}
                    </p>
                  </div>
                </div>
              )}

              {/* IP 和位置 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    IP 地址
                  </p>
                  <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                    {selectedLog.ipAddress}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    地理位置
                  </p>
                  <p className="text-sm bg-muted/50 p-2 rounded">
                    {selectedLog.location || '-'}
                  </p>
                </div>
              </div>

              {/* 设备信息 */}
              <div className="space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  设备信息
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">设备</p>
                    <p className="text-sm">{selectedLog.device || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">操作系统</p>
                    <p className="text-sm">{selectedLog.os || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">浏览器</p>
                    <p className="text-sm">{selectedLog.browser || '-'}</p>
                  </div>
                </div>
              </div>

              {/* User Agent */}
              {selectedLog.userAgent && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User Agent</p>
                  <p className="text-xs font-mono bg-muted/50 p-2 rounded break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailVisible(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoginLogSettingsPage
