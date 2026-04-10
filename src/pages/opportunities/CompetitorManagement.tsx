import React, { useState, useCallback, useMemo } from 'react'
import { Competitor, ThreatLevel, CompetitorStatus } from '@/types/competitor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit2, Trash2, Search, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// 常量配置
// ============================================================

/** 威胁程度配置 */
const THREAT_CONFIG: Record<ThreatLevel, { label: string; color: string; icon: React.ReactNode }> = {
  '高': {
    label: '高威胁',
    color: 'bg-red-500 hover:bg-red-600',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  '中': {
    label: '中威胁',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    icon: <Minus className="h-4 w-4" />,
  },
  '低': {
    label: '低威胁',
    color: 'bg-green-500 hover:bg-green-600',
    icon: <TrendingDown className="h-4 w-4" />,
  },
}

/** 竞争状态配置 */
const STATUS_CONFIG: Record<CompetitorStatus, { label: string; color: string }> = {
  '活跃': { label: '活跃竞争', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  '潜在': { label: '潜在威胁', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  '已淘汰': { label: '已淘汰', color: 'bg-gray-100 text-gray-800 border-gray-300' },
}

// ============================================================
// 组件 Props
// ============================================================

interface CompetitorManagementProps {
  /** 关联的商机 ID */
  opportunityId: string
  
  /** 竞争对手列表 */
  competitors?: Competitor[]
  
  /** 变更回调 */
  onChange?: (competitors: Competitor[]) => void
  
  /** 是否只读 */
  readOnly?: boolean
  
  /** 自定义类名 */
  className?: string
}

// ============================================================
// 竞争对手管理组件
// ============================================================

/**
 * 竞争对手管理页面组件
 * 用于管理商机中的竞争对手信息和分析
 */
export const CompetitorManagement: React.FC<CompetitorManagementProps> = ({
  opportunityId,
  competitors = [],
  onChange,
  readOnly = false,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterThreat, setFilterThreat] = useState<ThreatLevel | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<CompetitorStatus | 'all'>('all')

  // 处理添加/编辑竞争对手
  const handleSaveCompetitor = useCallback((competitor: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const now = new Date().toISOString()
    
    if (editingCompetitor) {
      // 编辑模式
      const updated = competitors.map((c) =>
        c.id === editingCompetitor.id
          ? { ...c, ...competitor, updatedAt: now }
          : c
      )
      onChange?.(updated)
    } else {
      // 新增模式
      const newCompetitor: Competitor = {
        ...competitor,
        id: `competitor-${Date.now()}`,
        opportunityId,
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user', // TODO: 从用户上下文获取
      }
      onChange?.([...competitors, newCompetitor])
    }
    
    setIsDialogOpen(false)
    setEditingCompetitor(null)
  }, [competitors, onChange, opportunityId, editingCompetitor])

  // 处理删除竞争对手
  const handleDeleteCompetitor = useCallback((id: string) => {
    const updated = competitors.filter((c) => c.id !== id)
    onChange?.(updated)
  }, [competitors, onChange])

  // 处理编辑竞争对手
  const handleEditCompetitor = useCallback((competitor: Competitor) => {
    setEditingCompetitor(competitor)
    setIsDialogOpen(true)
  }, [])

  // 过滤竞争对手列表
  const filteredCompetitors = useMemo(() => {
    return competitors.filter((competitor) => {
      const matchSearch = competitor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (competitor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      
      const matchThreat = filterThreat === 'all' || competitor.threatLevel === filterThreat
      const matchStatus = filterStatus === 'all' || competitor.status === filterStatus
      
      return matchSearch && matchThreat && matchStatus
    })
  }, [competitors, searchTerm, filterThreat, filterStatus])

  // 统计信息
  const stats = useMemo(() => {
    const total = competitors.length
    const highThreat = competitors.filter((c) => c.threatLevel === '高').length
    const active = competitors.filter((c) => c.status === '活跃').length
    
    return { total, highThreat, active }
  }, [competitors])

  return (
    <div className={cn('space-y-6', className)}>
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">竞争对手总数</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} 个活跃竞争
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高威胁对手</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highThreat}</div>
            <p className="text-xs text-muted-foreground">
              需要重点关注
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃竞争</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              正在跟进中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主内容区 */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">竞争对手列表</TabsTrigger>
          <TabsTrigger value="analysis">优劣势分析</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {/* 工具栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索公司名称或联系人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              
              <Select value={filterThreat} onValueChange={(v) => setFilterThreat(v as ThreatLevel | 'all')}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="威胁程度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部威胁程度</SelectItem>
                  <SelectItem value="高">高威胁</SelectItem>
                  <SelectItem value="中">中威胁</SelectItem>
                  <SelectItem value="低">低威胁</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as CompetitorStatus | 'all')}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="竞争状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="活跃">活跃</SelectItem>
                  <SelectItem value="潜在">潜在</SelectItem>
                  <SelectItem value="已淘汰">已淘汰</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!readOnly && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCompetitor(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加竞争对手
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <CompetitorForm
                    initialData={editingCompetitor}
                    onSave={handleSaveCompetitor}
                    onCancel={() => {
                      setIsDialogOpen(false)
                      setEditingCompetitor(null)
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* 竞争对手列表 */}
          <Card>
            <CardContent className="p-0">
              {filteredCompetitors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {competitors.length === 0 ? '暂无竞争对手' : '没有符合条件的竞争对手'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>公司名称</TableHead>
                      <TableHead>联系人</TableHead>
                      <TableHead>威胁程度</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="hidden md:table-cell">优势</TableHead>
                      <TableHead className="hidden md:table-cell">劣势</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompetitors.map((competitor) => (
                      <CompetitorRow
                        key={competitor.id}
                        competitor={competitor}
                        readOnly={readOnly}
                        onEdit={() => handleEditCompetitor(competitor)}
                        onDelete={() => handleDeleteCompetitor(competitor.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <CompetitorAnalysis
            competitors={competitors}
            readOnly={readOnly}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ============================================================
// 竞争对手表单
// ============================================================

interface CompetitorFormProps {
  initialData?: Competitor | null
  onSave: (data: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void
  onCancel: () => void
}

const CompetitorForm: React.FC<CompetitorFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [companyName, setCompanyName] = useState(initialData?.companyName || '')
  const [contactName, setContactName] = useState(initialData?.contactName || '')
  const [contactPosition, setContactPosition] = useState(initialData?.contactPosition || '')
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '')
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || '')
  const [strengths, setStrengths] = useState(initialData?.strengths || '')
  const [weaknesses, setWeaknesses] = useState(initialData?.weaknesses || '')
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>(initialData?.threatLevel || '中')
  const [strategy, setStrategy] = useState(initialData?.strategy || '')
  const [status, setStatus] = useState<CompetitorStatus>(initialData?.status || '活跃')
  const [remark, setRemark] = useState(initialData?.remark || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSave({
      opportunityId: initialData?.opportunityId || '',
      companyName,
      contactName: contactName || undefined,
      contactPosition: contactPosition || undefined,
      contactPhone: contactPhone || undefined,
      contactEmail: contactEmail || undefined,
      strengths,
      weaknesses,
      threatLevel,
      strategy,
      status,
      remark: remark || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {initialData ? '编辑竞争对手' : '添加竞争对手'}
        </DialogTitle>
        <DialogDescription>
          记录竞争对手信息并进行优劣势分析
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        {/* 基本信息 */}
        <div className="grid gap-2">
          <Label htmlFor="companyName">公司名称 *</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="输入竞争对手公司名称"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contactName">联系人</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="姓名"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contactPosition">职位</Label>
            <Input
              id="contactPosition"
              value={contactPosition}
              onChange={(e) => setContactPosition(e.target.value)}
              placeholder="职位"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="电话"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">邮箱</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="邮箱"
            />
          </div>
        </div>

        {/* 威胁程度和状态 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="threatLevel">威胁程度</Label>
            <Select value={threatLevel} onValueChange={(v) => setThreatLevel(v as ThreatLevel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="高">高威胁</SelectItem>
                <SelectItem value="中">中威胁</SelectItem>
                <SelectItem value="低">低威胁</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">竞争状态</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as CompetitorStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="活跃">活跃</SelectItem>
                <SelectItem value="潜在">潜在</SelectItem>
                <SelectItem value="已淘汰">已淘汰</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 优劣势分析 */}
        <div className="grid gap-2">
          <Label htmlFor="strengths">优势分析 *</Label>
          <Textarea
            id="strengths"
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="竞争对手的优势点，如：价格低、技术强、关系好等"
            rows={3}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="weaknesses">劣势分析 *</Label>
          <Textarea
            id="weaknesses"
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            placeholder="竞争对手的劣势点，如：服务差、交付慢、口碑一般等"
            rows={3}
            required
          />
        </div>

        {/* 应对策略 */}
        <div className="grid gap-2">
          <Label htmlFor="strategy">应对策略 *</Label>
          <Textarea
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            placeholder="针对该竞争对手的应对方案和策略"
            rows={3}
            required
          />
        </div>

        {/* 备注 */}
        <div className="grid gap-2">
          <Label htmlFor="remark">备注</Label>
          <Textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="其他备注信息"
            rows={2}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {initialData ? '保存修改' : '添加竞争对手'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// ============================================================
// 竞争对手列表行
// ============================================================

interface CompetitorRowProps {
  competitor: Competitor
  readOnly?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const CompetitorRow: React.FC<CompetitorRowProps> = ({
  competitor,
  readOnly = false,
  onEdit,
  onDelete,
}) => {
  const threatConfig = THREAT_CONFIG[competitor.threatLevel]
  const statusConfig = STATUS_CONFIG[competitor.status]

  return (
    <TableRow>
      <TableCell className="font-medium">{competitor.companyName}</TableCell>
      <TableCell>
        {competitor.contactName ? (
          <div>
            <div>{competitor.contactName}</div>
            {competitor.contactPosition && (
              <div className="text-sm text-muted-foreground">
                {competitor.contactPosition}
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <Badge className={cn('text-white', threatConfig.color)}>
          {threatConfig.icon}
          <span className="ml-1">{threatConfig.label}</span>
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusConfig.color}>
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
        {competitor.strengths}
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
        {competitor.weaknesses}
      </TableCell>
      <TableCell className="text-right">
        {!readOnly && (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

// ============================================================
// 竞争对手分析
// ============================================================

interface CompetitorAnalysisProps {
  competitors: Competitor[]
  readOnly?: boolean
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
  competitors,
  readOnly = false,
}) => {
  if (competitors.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          暂无竞争对手数据
        </CardContent>
      </Card>
    )
  }

  // 按威胁程度排序
  const sortedByThreat = [...competitors].sort((a, b) => {
    const threatOrder = { '高': 0, '中': 1, '低': 2 }
    return threatOrder[a.threatLevel] - threatOrder[b.threatLevel]
  })

  return (
    <div className="space-y-4">
      {/* 高威胁对手 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <TrendingUp className="h-5 w-5" />
            高威胁竞争对手
          </CardTitle>
          <CardDescription>
            需要重点关注和制定应对策略的对手
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedByThreat
            .filter((c) => c.threatLevel === '高')
            .map((competitor) => (
              <AnalysisCard key={competitor.id} competitor={competitor} variant="high" />
            ))}
          {sortedByThreat.filter((c) => c.threatLevel === '高').length === 0 && (
            <p className="text-sm text-muted-foreground">暂无高威胁对手</p>
          )}
        </CardContent>
      </Card>

      {/* 中等威胁对手 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <Minus className="h-5 w-5" />
            中等威胁竞争对手
          </CardTitle>
          <CardDescription>
            需要保持关注的对手
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedByThreat
            .filter((c) => c.threatLevel === '中')
            .map((competitor) => (
              <AnalysisCard key={competitor.id} competitor={competitor} variant="medium" />
            ))}
          {sortedByThreat.filter((c) => c.threatLevel === '中').length === 0 && (
            <p className="text-sm text-muted-foreground">暂无中等威胁对手</p>
          )}
        </CardContent>
      </Card>

      {/* 低威胁对手 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <TrendingDown className="h-5 w-5" />
            低威胁竞争对手
          </CardTitle>
          <CardDescription>
            当前威胁较小的对手
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedByThreat
            .filter((c) => c.threatLevel === '低')
            .map((competitor) => (
              <AnalysisCard key={competitor.id} competitor={competitor} variant="low" />
            ))}
          {sortedByThreat.filter((c) => c.threatLevel === '低').length === 0 && (
            <p className="text-sm text-muted-foreground">暂无低威胁对手</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface AnalysisCardProps {
  competitor: Competitor
  variant: 'high' | 'medium' | 'low'
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ competitor, variant }) => {
  const variantClasses = {
    high: 'border-l-4 border-l-red-500',
    medium: 'border-l-4 border-l-yellow-500',
    low: 'border-l-4 border-l-green-500',
  }

  return (
    <div className={cn('p-4 mb-4 rounded-lg border bg-card', variantClasses[variant])}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{competitor.companyName}</h4>
        {competitor.contactName && (
          <span className="text-sm text-muted-foreground">
            联系人：{competitor.contactName}
            {competitor.contactPosition && ` (${competitor.contactPosition})`}
          </span>
        )}
      </div>
      
      <div className="grid gap-3 mt-3">
        <div>
          <div className="text-sm font-medium text-red-600 mb-1">优势分析</div>
          <p className="text-sm text-muted-foreground">{competitor.strengths}</p>
        </div>
        
        <div>
          <div className="text-sm font-medium text-green-600 mb-1">劣势分析</div>
          <p className="text-sm text-muted-foreground">{competitor.weaknesses}</p>
        </div>
        
        <div>
          <div className="text-sm font-medium text-blue-600 mb-1">应对策略</div>
          <p className="text-sm text-muted-foreground">{competitor.strategy}</p>
        </div>
      </div>
      
      {competitor.remark && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">{competitor.remark}</p>
        </div>
      )}
    </div>
  )
}

export default CompetitorManagement
