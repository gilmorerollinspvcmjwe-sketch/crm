/**
 * Changelog Page - 更新日志
 * Features: Version history, Updates timeline
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  History,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Zap,
  Bug,
  Shield,
  Sparkles,
  Wrench,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react'

// ============================================================
// Version Data Structure
// ============================================================
interface VersionUpdate {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  highlights?: string[]
  changes: ChangeItem[]
}

interface ChangeItem {
  type: 'feature' | 'fix' | 'security' | 'improvement' | 'refactor'
  description: string
  module?: string
}

// ============================================================
// Mock Changelog Data
// ============================================================
const changelogData: VersionUpdate[] = [
  {
    version: 'v2.1.0',
    date: '2026-04-03',
    type: 'minor',
    highlights: ['AI助手增强', '报表导出优化'],
    changes: [
      { type: 'feature', description: '新增AI话术生成功能，支持多行业模板', module: 'AI' },
      { type: 'feature', description: '报表支持PDF/Excel/CSV多种格式导出', module: '报表' },
      { type: 'feature', description: '客户列表新增批量标签管理', module: '客户' },
      { type: 'improvement', description: '优化商机详情页面加载速度', module: '商机' },
      { type: 'improvement', description: '改进销售管道阶段的拖拽交互', module: '商机' },
      { type: 'fix', description: '修复客户导入时部分字段格式错误问题', module: '数据' },
      { type: 'fix', description: '修复活动提醒时间不准确的问题', module: '活动' },
    ],
  },
  {
    version: 'v2.0.0',
    date: '2026-03-20',
    type: 'major',
    highlights: ['UI全新升级', '性能大幅提升'],
    changes: [
      { type: 'feature', description: '全新UI设计，采用现代化设计语言', module: '全局' },
      { type: 'feature', description: '新增工作台页面，集成快捷操作入口', module: '工作台' },
      { type: 'feature', description: '新增智能仪表盘，支持自定义图表', module: '仪表盘' },
      { type: 'feature', description: '新增自定义字段功能，支持多种类型', module: '设置' },
      { type: 'feature', description: '新增自动化工作流引擎', module: '自动化' },
      { type: 'improvement', description: '整体性能提升50%，页面加载更快速', module: '全局' },
      { type: 'improvement', description: '优化移动端适配体验', module: '全局' },
      { type: 'security', description: '增强数据加密传输安全性', module: '安全' },
      { type: 'security', description: '新增操作日志审计功能', module: '安全' },
    ],
  },
  {
    version: 'v1.5.0',
    date: '2026-02-15',
    type: 'minor',
    highlights: ['AI功能上线'],
    changes: [
      { type: 'feature', description: '首次上线AI助手功能', module: 'AI' },
      { type: 'feature', description: '新增客户智能评分模型', module: 'AI' },
      { type: 'feature', description: '新增销售预测分析', module: 'AI' },
      { type: 'improvement', description: '优化客户详情页面布局', module: '客户' },
      { type: 'improvement', description: '改进线索转化流程', module: '线索' },
      { type: 'fix', description: '修复合同到期提醒失效问题', module: '合同' },
    ],
  },
  {
    version: 'v1.4.2',
    date: '2026-01-28',
    type: 'patch',
    changes: [
      { type: 'fix', description: '修复用户权限设置不生效问题', module: '权限' },
      { type: 'fix', description: '修复邮件通知发送失败问题', module: '通知' },
      { type: 'fix', description: '修复商机阶段概率计算错误', module: '商机' },
      { type: 'security', description: '修复潜在的安全漏洞', module: '安全' },
    ],
  },
  {
    version: 'v1.4.0',
    date: '2026-01-15',
    type: 'minor',
    highlights: ['报表功能增强'],
    changes: [
      { type: 'feature', description: '新增自定义报表构建器', module: '报表' },
      { type: 'feature', description: '新增报表定时发送功能', module: '报表' },
      { type: 'feature', description: '新增销售漏斗分析图', module: '报表' },
      { type: 'improvement', description: '优化报表渲染性能', module: '报表' },
      { type: 'fix', description: '修复数据导出时编码问题', module: '数据' },
    ],
  },
  {
    version: 'v1.3.0',
    date: '2025-12-20',
    type: 'minor',
    highlights: ['合同管理模块'],
    changes: [
      { type: 'feature', description: '新增合同管理模块', module: '合同' },
      { type: 'feature', description: '新增合同模板功能', module: '合同' },
      { type: 'feature', description: '新增合同审批流程', module: '合同' },
      { type: 'improvement', description: '优化产品价格计算逻辑', module: 'CPQ' },
      { type: 'fix', description: '修复订单金额汇总错误', module: '订单' },
    ],
  },
]

// ============================================================
// Change Type Badge Component
// ============================================================
interface ChangeBadgeProps {
  type: ChangeItem['type']
}

function ChangeBadge({ type }: ChangeBadgeProps) {
  const config = {
    feature: { icon: <Sparkles className="h-3 w-3" />, label: '新功能', color: 'bg-green-100 text-green-700' },
    fix: { icon: <Bug className="h-3 w-3" />, label: '修复', color: 'bg-red-100 text-red-700' },
    security: { icon: <Shield className="h-3 w-3" />, label: '安全', color: 'bg-purple-100 text-purple-700' },
    improvement: { icon: <Zap className="h-3 w-3" />, label: '优化', color: 'bg-blue-100 text-blue-700' },
    refactor: { icon: <Wrench className="h-3 w-3" />, label: '重构', color: 'bg-gray-100 text-gray-700' },
  }
  
  const c = config[type]
  
  return (
    <Badge variant="outline" className={`gap-1 ${c.color}`}>
      {c.icon}
      {c.label}
    </Badge>
  )
}

// ============================================================
// Version Card Component
// ============================================================
interface VersionCardProps {
  version: VersionUpdate
  expanded: boolean
  onToggle: () => void
}

function VersionCard({ version, expanded, onToggle }: VersionCardProps) {
  const versionColor = {
    major: 'bg-red-500',
    minor: 'bg-blue-500',
    patch: 'bg-green-500',
  }
  
  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={versionColor[version.type]}>
              {version.type === 'major' ? '重大' : version.type === 'minor' ? '功能' : '修复'}
            </Badge>
            <div>
              <CardTitle className="text-base">{version.version}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {version.date}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0">
          {/* Highlights */}
          {version.highlights && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">亮点更新</p>
              <div className="flex flex-wrap gap-2">
                {version.highlights.map(h => (
                  <Badge key={h} variant="secondary" className="bg-primary/10">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="mb-4" />
          
          {/* Change List */}
          <div className="space-y-2">
            {version.changes.map((change, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1">
                <ChangeBadge type={change.type} />
                <span className="flex-1 text-sm">{change.description}</span>
                {change.module && (
                  <Badge variant="outline" className="text-xs">{change.module}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// ============================================================
// Changelog Page Component
// ============================================================
export function Changelog() {
  const navigate = useNavigate()
  const [expandedVersion, setExpandedVersion] = useState<string>(changelogData[0].version)
  const [filterType, setFilterType] = useState<string>('全部')
  const [filterModule, setFilterModule] = useState<string>('全部')

  // Get unique modules
  const modules = useMemo(() => {
    const allModules = changelogData.flatMap(v => v.changes.map(c => c.module))
    return ['全部', ...new Set(allModules.filter((m): m is string => Boolean(m)))]
  }, [])

  // Filter changes
  const filteredData = useMemo(() => {
    return changelogData.map(version => ({
      ...version,
      changes: version.changes.filter(change => {
        const matchesType = filterType === '全部' ||
          (filterType === '新功能' && change.type === 'feature') ||
          (filterType === '修复' && change.type === 'fix') ||
          (filterType === '优化' && change.type === 'improvement') ||
          (filterType === '安全' && change.type === 'security')
        
        const matchesModule = filterModule === '全部' || change.module === filterModule
        
        return matchesType && matchesModule
      }),
    })).filter(version => version.changes.length > 0 || version.type !== 'patch')
  }, [filterType, filterModule])

  // Stats
  const stats = useMemo(() => {
    const allChanges = changelogData.flatMap(v => v.changes)
    return {
      features: allChanges.filter(c => c.type === 'feature').length,
      fixes: allChanges.filter(c => c.type === 'fix').length,
      improvements: allChanges.filter(c => c.type === 'improvement').length,
      security: allChanges.filter(c => c.type === 'security').length,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">更新日志</h1>
              <p className="text-muted-foreground">产品版本历史与功能更新记录</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            当前版本 {changelogData[0].version}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-green-600">新功能</p>
                <p className="text-xl font-bold text-green-700">{stats.features}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-4 flex items-center gap-3">
              <Bug className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-sm text-red-600">问题修复</p>
                <p className="text-xl font-bold text-red-700">{stats.fixes}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">性能优化</p>
                <p className="text-xl font-bold text-blue-700">{stats.improvements}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">安全更新</p>
                <p className="text-xl font-bold text-purple-700">{stats.security}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">类型:</span>
              <div className="flex gap-1">
                {['全部', '新功能', '修复', '优化', '安全'].map(t => (
                  <Badge
                    key={t}
                    variant={filterType === t ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilterType(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">模块:</span>
              <div className="flex gap-1">
                {modules.slice(0, 6).map(m => (
                  <Badge
                    key={m}
                    variant={filterModule === m ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilterModule(m)}
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version List */}
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">
              <History className="h-4 w-4 mr-2" />
              时间线视图
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" />
              列表视图
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4 mt-4">
            {filteredData.map(version => (
              <VersionCard
                key={version.version}
                version={version}
                expanded={expandedVersion === version.version}
                onToggle={() => setExpandedVersion(
                  expandedVersion === version.version ? '' : version.version
                )}
              />
            ))}
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {filteredData.map(version => (
                    <div key={version.version} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Badge className={version.type === 'major' ? 'bg-red-500' : version.type === 'minor' ? 'bg-blue-500' : 'bg-green-500'}>
                          {version.version}
                        </Badge>
                        <span className="text-sm">{version.date}</span>
                        <span className="text-sm text-muted-foreground">{version.changes.length}项更新</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedVersion(version.version)}
                      >
                        查看详情
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Changelog