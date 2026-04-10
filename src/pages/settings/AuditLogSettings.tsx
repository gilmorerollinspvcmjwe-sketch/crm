"use client"

import React, { useState, useMemo, useCallback } from 'react'
import {
  Scroll,
  Eye,
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
  FileText,
  ChevronDown,
  ChevronUp,
  BarChart3,
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

import {
  mockAuditLogs,
  calculateAuditStats,
  filterAuditLogs,
} from '@/mock/auditLogData'
import type { AuditLogEntry, AuditLogFilter } from '@/types/auditLog'
import { AUDIT_ACTION_MAP, AUDIT_MODULE_MAP, AuditAction, AuditModule } from '@/types/auditLog'

// 审计日志查看页面
export function AuditLogSettingsPage() {
  // 状态
  const [filters, setFilters] = useState<AuditLogFilter>({
    page: 1,
    pageSize: 20,
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  // 计算统计数据
  const stats = useMemo(() => calculateAuditStats(mockAuditLogs), [])

  // 筛选后的数据
  const filteredData = useMemo(() => {
    return filterAuditLogs(mockAuditLogs, filters)
  }, [filters])

  // 分页信息
  const totalPages = Math.ceil(filteredData.total / (filters.pageSize || 20))

  // 处理搜索
  const handleSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }))
  }, [searchInput])

  // 处理筛选变化
  const handleFilterChange = useCallback((key: keyof AuditLogFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }))
  }, [])

  // 处理日期范围
  const handleDateRangeChange = useCallback((range: { from?: string; to?: string }) => {
    setFilters(prev => ({
      ...prev,
      startDate: range.from,
      endDate: range.to,
      page: 1
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
  const handleViewDetail = useCallback((log: AuditLogEntry) => {
    setSelectedLog(log)
    setDetailVisible(true)
  }, [])

  // 导出
  const handleExport = useCallback(() => {
    const csvContent = filteredData.data.map(log => [
      new Date(log.timestamp).toLocaleString('zh-CN'),
      log.userName,
      AUDIT_ACTION_MAP[log.action]?.label || log.action,
      AUDIT_MODULE_MAP[log.module] || log.module,
      log.recordName || '',
      log.ipAddress,
      log.result || '',
      log.description,
    ].join(',')).join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredData.data])

  // 获取操作类型颜色
  const getActionBadgeVariant = (action: AuditAction) => {
    const config = AUDIT_ACTION_MAP[action]
    switch (config?.color) {
      case 'green': return 'success'
      case 'blue': return 'info'
      case 'red': return 'destructive'
      case 'purple': return 'secondary'
      case 'cyan': return 'info'
      case 'orange': return 'warning'
      case 'gold': return 'warning'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scroll className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">审计日志</h1>
            <p className="text-muted-foreground text-sm">查看系统操作记录和用户活动</p>
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
                <p className="text-sm text-muted-foreground">总日志数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日操作</p>
                <p className="text-2xl font-bold">{stats.todayTotal}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">成功操作</p>
                <p className="text-2xl font-bold">
                  {filteredData.data.filter(l => l.result === 'success').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">失败操作</p>
                <p className="text-2xl font-bold">
                  {filteredData.data.filter(l => l.result === 'failure').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-500/10">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作类型分布 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            操作类型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AuditAction).map(([key, action]) => {
              const count = stats.byAction[action] || 0
              const config = AUDIT_ACTION_MAP[action]
              if (count === 0) return null
              return (
                <Badge
                  key={key}
                  variant={getActionBadgeVariant(action)}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => handleFilterChange('action', action)}
                >
                  {config?.label || action} ({count})
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="pt-4">
          {/* 搜索和筛选切换 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索操作描述、对象名称..."
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
              {/* 操作类型 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">操作类型</Label>
                <Select
                  value={filters.action || 'all'}
                  onValueChange={(v) => handleFilterChange('action', v === 'all' ? undefined : (v as AuditAction))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="全部操作" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部操作</SelectItem>
                    {Object.entries(AuditAction).map(([key, action]) => (
                      <SelectItem key={key} value={action}>
                        {AUDIT_ACTION_MAP[action]?.label || action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 模块类型 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">模块</Label>
                <Select
                  value={filters.module || 'all'}
                  onValueChange={(v) => handleFilterChange('module', v === 'all' ? undefined : (v as AuditModule))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="全部模块" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部模块</SelectItem>
                    {Object.entries(AuditModule).map(([key, module]) => (
                      <SelectItem key={key} value={module}>
                        {AUDIT_MODULE_MAP[module] || module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 用户 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">操作用户</Label>
                <Input
                  placeholder="输入用户名"
                  value={filters.operator || ''}
                  onChange={(e) => handleFilterChange('operator', e.target.value)}
                  className="h-9"
                />
              </div>

              {/* 结果 */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">操作结果</Label>
                <Select
                  value={filters.result || 'all'}
                  onValueChange={(v) => handleFilterChange('result', v === 'all' ? undefined : (v as 'success' | 'failure'))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="全部结果" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部结果</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="failure">失败</SelectItem>
                  </SelectContent>
                </Select>
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
              <FileText className="w-4 h-4" />
              操作日志
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (共 {filteredData.total} 条记录)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">时间</TableHead>
                  <TableHead className="w-[100px]">操作用户</TableHead>
                  <TableHead className="w-[100px]">操作类型</TableHead>
                  <TableHead className="w-[100px]">模块</TableHead>
                  <TableHead className="w-[140px]">对象名称</TableHead>
                  <TableHead className="w-[80px]">结果</TableHead>
                  <TableHead className="w-[120px]">IP地址</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.data.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span>{log.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                          {AUDIT_ACTION_MAP[log.action]?.label || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {AUDIT_MODULE_MAP[log.module] || log.module}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate" title={log.recordName}>
                        {log.recordName || '-'}
                      </TableCell>
                      <TableCell>
                        {log.result === 'success' ? (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            成功
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            <XCircle className="w-3 h-3 mr-1" />
                            失败
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(log)}
                          className="h-8 px-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
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
          {filteredData.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                显示 {(filters.page! - 1) * (filters.pageSize || 20) + 1}-
                {Math.min(filters.page! * (filters.pageSize || 20), filteredData.total)} 条，
                共 {filteredData.total} 条
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
                    第 {filters.page} / {totalPages} 页
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
              <FileText className="w-5 h-5" />
              日志详情
            </DialogTitle>
            <DialogDescription>
              查看操作日志的完整信息
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">时间</p>
                  <p className="text-sm font-mono">
                    {new Date(selectedLog.timestamp).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">操作用户</p>
                  <p className="text-sm flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {selectedLog.userName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">操作类型</p>
                  <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                    {AUDIT_ACTION_MAP[selectedLog.action]?.label || selectedLog.action}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">模块</p>
                  <p className="text-sm">
                    {AUDIT_MODULE_MAP[selectedLog.module] || selectedLog.module}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">对象名称</p>
                  <p className="text-sm">{selectedLog.recordName || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">操作结果</p>
                  {selectedLog.result === 'success' ? (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      成功
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      失败
                    </Badge>
                  )}
                </div>
              </div>

              {/* IP 和 UserAgent */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Monitor className="w-3 h-3" />
                    IP 地址
                  </p>
                  <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                    {selectedLog.ipAddress}
                  </p>
                </div>
                {selectedLog.userAgent && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">User Agent</p>
                    <p className="text-xs font-mono bg-muted/50 p-2 rounded break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                )}
              </div>

              {/* 操作描述 */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">操作描述</p>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {selectedLog.description}
                </p>
              </div>

              {/* 字段变更 */}
              {selectedLog.details && selectedLog.details.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">字段变更详情</p>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>字段</TableHead>
                          <TableHead>旧值</TableHead>
                          <TableHead>新值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLog.details.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {detail.fieldLabel || detail.field}
                            </TableCell>
                            <TableCell className="text-red-500">
                              {detail.oldValue || '-'}
                            </TableCell>
                            <TableCell className="text-green-500">
                              {detail.newValue || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* 原始数据 */}
              {selectedLog.oldValue && selectedLog.newValue && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">旧值 (JSON)</p>
                    <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(selectedLog.oldValue, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">新值 (JSON)</p>
                    <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(selectedLog.newValue, null, 2)}
                    </pre>
                  </div>
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

export default AuditLogSettingsPage
