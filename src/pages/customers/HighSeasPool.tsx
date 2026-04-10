"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, UserPlus, ArrowLeftToLine, MoreHorizontal, Search, Filter, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/DataTable"
import type { DataTableColumnMeta } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { CustomerExtended, CustomerRegion, CustomerIndustryDetail, CompanySize, PublicPoolStatus } from "@/types/customer"
import {
  REGION_CONFIG,
  INDUSTRY_DETAIL_CONFIG,
  COMPANY_SIZE_CONFIG,
  PUBLIC_POOL_STATUS_CONFIG,
  DEFAULT_PUBLIC_POOL_CONFIG,
} from "@/types/customer"

// ============ 状态配置 ============

const statusConfig: Record<PublicPoolStatus, { label: string; className: string }> = {
  "可领取": { label: "可领取", className: "bg-green-100 text-green-800 border-green-200" },
  "保护期中": { label: "保护期中", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "已领取": { label: "已领取", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "已退回": { label: "已退回", className: "bg-gray-100 text-gray-800 border-gray-200" },
}

function StatusBadge({ status }: { status: PublicPoolStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}

// ============ 评分徽章 ============

function ScoreBadge({ score }: { score: number }) {
  let className = "bg-gray-100 text-gray-800 border-gray-200"
  if (score >= 80) className = "bg-green-100 text-green-800 border-green-200"
  else if (score >= 60) className = "bg-blue-100 text-blue-800 border-blue-200"
  else if (score >= 40) className = "bg-yellow-100 text-yellow-800 border-yellow-200"
  else className = "bg-red-100 text-red-800 border-red-200"

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      className
    )}>
      {score}分
    </span>
  )
}

// ============ Mock 数据 ============

const mockPublicPoolCustomers: CustomerExtended[] = [
  {
    id: 'CUST-001',
    name: '张伟',
    company: '北京科技创新有限公司',
    email: 'zhangwei@bjtech.com',
    phone: '13800138001',
    status: '潜在',
    score: 95,
    createdAt: '2023-06-15T08:00:00Z',
    lastContact: '2024-02-10T14:30:00Z',
    assignee: '张三',
    shortName: '北京科技',
    annualRevenue: '1000-5000 万',
    region: '华北',
    companySize: '中型 (101-500 人)',
    industryDetail: '互联网/软件',
    isPublic: true,
    publicAt: '2024-03-01T09:00:00Z',
    publicReason: '超过 30 天未跟进',
    claimCount: 1,
    tags: ['VIP', '重点客户'],
    rating: 5,
  },
  {
    id: 'CUST-002',
    name: '李娜',
    company: '上海贸易发展集团',
    email: 'lina@shtrade.com',
    phone: '13900139002',
    status: '活跃',
    score: 88,
    createdAt: '2023-07-20T09:00:00Z',
    lastContact: '2024-02-15T10:00:00Z',
    assignee: '李四',
    shortName: '上海贸易',
    annualRevenue: '5000 万 -1 亿',
    region: '华东',
    companySize: '大型 (501-2000 人)',
    industryDetail: '零售/批发',
    isPublic: true,
    publicAt: '2024-03-05T10:00:00Z',
    publicReason: '销售主动退回',
    claimCount: 0,
    tags: ['长期合作'],
    rating: 5,
  },
  {
    id: 'CUST-003',
    name: '王强',
    company: '广州智能制造厂',
    email: 'wangqiang@gzmanufacturing.com',
    phone: '13700137003',
    status: '潜在',
    score: 72,
    createdAt: '2024-01-10T10:00:00Z',
    lastContact: '2024-02-20T16:00:00Z',
    assignee: '张三',
    shortName: '广州智造',
    annualRevenue: '500-1000 万',
    region: '华南',
    companySize: '中型 (101-500 人)',
    industryDetail: '制造业',
    isPublic: true,
    publicAt: '2024-03-08T11:00:00Z',
    publicReason: '超过 30 天未跟进',
    claimCount: 2,
    tags: ['新客户', '潜力客户'],
    rating: 4,
  },
  {
    id: 'CUST-004',
    name: '赵敏',
    company: '深圳金融服务公司',
    email: 'zhaomin@szfinance.com',
    phone: '13600136004',
    status: '活跃',
    score: 91,
    createdAt: '2023-05-05T08:30:00Z',
    lastContact: '2024-02-25T09:00:00Z',
    assignee: '王五',
    shortName: '深圳金融',
    annualRevenue: '1-5 亿',
    region: '华南',
    companySize: '大型 (501-2000 人)',
    industryDetail: '金融/保险',
    isPublic: true,
    publicAt: '2024-03-10T08:00:00Z',
    protectUntil: '2024-03-17T08:00:00Z',
    publicReason: '销售主动退回',
    claimCount: 0,
    tags: ['VIP', '金融行业'],
    rating: 5,
  },
  {
    id: 'CUST-005',
    name: '刘强',
    company: '杭州电子商务集团',
    email: 'liuqiang@hzecommerce.com',
    phone: '13500135005',
    status: '活跃',
    score: 85,
    createdAt: '2023-08-12T11:00:00Z',
    lastContact: '2024-02-18T15:30:00Z',
    assignee: '赵六',
    shortName: '杭州电商',
    annualRevenue: '10 亿以上',
    region: '华东',
    companySize: '超大型 (2000 人以上)',
    industryDetail: '互联网/软件',
    isPublic: true,
    publicAt: '2024-03-03T09:00:00Z',
    publicReason: '超过 30 天未跟进',
    claimCount: 1,
    tags: ['战略合作'],
    rating: 5,
  },
  {
    id: 'CUST-006',
    name: '陈静',
    company: '成都医疗健康集团',
    email: 'chenjing@cdhealthcare.com',
    phone: '13400134006',
    status: '潜在',
    score: 68,
    createdAt: '2024-02-01T09:00:00Z',
    lastContact: '2024-02-28T11:00:00Z',
    assignee: '张三',
    shortName: '成都医疗',
    annualRevenue: '1000-5000 万',
    region: '西南',
    companySize: '中型 (101-500 人)',
    industryDetail: '医疗/健康',
    isPublic: true,
    publicAt: '2024-03-12T10:00:00Z',
    publicReason: '销售主动退回',
    claimCount: 0,
    tags: ['医疗行业'],
    rating: 4,
  },
]

// ============ 列定义 ============

const columns: ColumnDef<CustomerExtended, string>[] = [
  {
    accessorKey: "id",
    header: "客户 ID",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
  },
  {
    accessorKey: "name",
    header: "姓名",
    meta: {
      width: 100,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "company",
    header: "公司",
    meta: {
      width: 180,
      sortable: true,
      filterable: true,
      filterType: "text",
    } as DataTableColumnMeta,
  },
  {
    accessorKey: "shortName",
    header: "简称",
    meta: { width: 100 } as DataTableColumnMeta,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("shortName") as string || "-"}</span>,
  },
  {
    accessorKey: "region",
    header: "区域",
    meta: { width: 80, sortable: true, filterable: true, filterType: "select", filterOptions: Object.keys(REGION_CONFIG).map(r => ({ label: REGION_CONFIG[r as CustomerRegion].label, value: r })) } as DataTableColumnMeta,
    cell: ({ row }) => {
      const region = row.getValue("region") as CustomerRegion
      if (!region) return <span className="text-muted-foreground">-</span>
      return <Badge variant="outline">{REGION_CONFIG[region]?.label || region}</Badge>
    },
  },
  {
    accessorKey: "industryDetail",
    header: "行业",
    meta: { width: 120, sortable: true, filterable: true, filterType: "select", filterOptions: Object.keys(INDUSTRY_DETAIL_CONFIG).map(i => ({ label: INDUSTRY_DETAIL_CONFIG[i as CustomerIndustryDetail].label, value: i })) } as DataTableColumnMeta,
    cell: ({ row }) => {
      const industry = row.getValue("industryDetail") as CustomerIndustryDetail
      if (!industry) return <span className="text-muted-foreground">-</span>
      return <span className="text-sm text-muted-foreground">{INDUSTRY_DETAIL_CONFIG[industry]?.label || industry}</span>
    },
  },
  {
    accessorKey: "companySize",
    header: "规模",
    meta: { width: 100, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const size = row.getValue("companySize") as CompanySize
      if (!size) return <span className="text-muted-foreground">-</span>
      return <span className="text-sm text-muted-foreground">{COMPANY_SIZE_CONFIG[size]?.label || size}</span>
    },
  },
  {
    accessorKey: "score",
    header: "评分",
    meta: { width: 80, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => <ScoreBadge score={Number(row.getValue("score"))} />,
  },
  {
    accessorKey: "publicAt",
    header: "进入公海时间",
    meta: { width: 140, sortable: true } as DataTableColumnMeta,
    cell: ({ row }) => {
      const date = row.getValue("publicAt") as string
      if (!date) return <span className="text-muted-foreground">-</span>
      return <span className="text-sm">{new Date(date).toLocaleDateString('zh-CN')}</span>
    },
  },
  {
    accessorKey: "publicReason",
    header: "进入原因",
    meta: { width: 140 } as DataTableColumnMeta,
    cell: ({ row }) => <span className="text-sm text-muted-foreground truncate max-w-[120px]">{row.getValue("publicReason") as string || "-"}</span>,
  },
  {
    id: "status",
    header: "状态",
    meta: { width: 80, filterable: true, filterType: "select", filterOptions: [
      { label: "可领取", value: "可领取" },
      { label: "保护期中", value: "保护期中" },
    ] } as DataTableColumnMeta,
    cell: ({ row }) => {
      const protectUntil = row.original.protectUntil
      const now = new Date()
      const status: PublicPoolStatus = protectUntil && new Date(protectUntil) > now ? "保护期中" : "可领取"
      return <StatusBadge status={status} />
    },
  },
]

// ============ 领取确认对话框 ============

interface ClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerExtended | null
  onConfirm: (assignee: string) => void
  loading: boolean
}

function ClaimDialog({ open, onOpenChange, customer, onConfirm, loading }: ClaimDialogProps) {
  const { t } = useTranslation()
  const [assignee, setAssignee] = React.useState("")
  
  const assignees = ["李明", "王芳", "陈静", "张三", "李四", "王五", "赵六"]
  
  React.useEffect(() => {
    if (open) {
      setAssignee("")
    }
  }, [open])
  
  const handleConfirm = () => {
    if (!assignee) return
    onConfirm(assignee)
  }
  
  if (!customer) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>领取客户</DialogTitle>
          <DialogDescription>
            将客户「{customer.name} - {customer.company}」领取为您的跟进客户
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="assignee">选择负责人</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="请选择负责人" />
              </SelectTrigger>
              <SelectContent>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-lg border bg-muted p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">保护期</span>
              <span>{DEFAULT_PUBLIC_POOL_CONFIG.protectionDays} 天</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">客户评分</span>
              <span className="font-medium">{customer.score}分</span>
            </div>
            {customer.publicReason && (
              <div className="text-sm">
                <span className="text-muted-foreground">进入原因：</span>
                <span>{customer.publicReason}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!assignee || loading}>
            {loading ? "领取中..." : "确认领取"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 退回确认对话框 ============

interface ReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerExtended | null
  onConfirm: (reason: string) => void
  loading: boolean
}

function ReturnDialog({ open, onOpenChange, customer, onConfirm, loading }: ReturnDialogProps) {
  const [reason, setReason] = React.useState("")
  
  const commonReasons = [
    "客户无需求",
    "客户预算不足",
    "客户已选择其他供应商",
    "暂时无法联系",
    "其他原因",
  ]
  
  React.useEffect(() => {
    if (open) {
      setReason("")
    }
  }, [open])
  
  const handleConfirm = () => {
    onConfirm(reason || "销售主动退回")
  }
  
  if (!customer) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>退回公海</DialogTitle>
          <DialogDescription>
            将客户「{customer.name} - {customer.company}」退回公海池
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">退回原因</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="请选择退回原因" />
              </SelectTrigger>
              <SelectContent>
                {commonReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason-detail">详细说明（可选）</Label>
            <Textarea
              id="reason-detail"
              placeholder="请输入详细说明..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="rounded-lg border bg-muted p-3 text-sm text-muted-foreground">
            <p>退回后，该客户将重新进入公海池，其他销售可以领取。</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? "退回中..." : "确认退回"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 公海池页面 ============

export function HighSeasPool() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // UI State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [regionFilter, setRegionFilter] = React.useState<string>("all")
  const [industryFilter, setIndustryFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Dialog State
  const [claimDialogOpen, setClaimDialogOpen] = React.useState(false)
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerExtended | null>(null)
  const [actionLoading, setActionLoading] = React.useState(false)
  
  // Mock data (replace with actual API call)
  const [data, setData] = React.useState<CustomerExtended[]>(mockPublicPoolCustomers)
  
  // Filtered data
  const filteredData = React.useMemo(() => {
    return data.filter((customer) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = customer.name.toLowerCase().includes(query)
        const matchCompany = customer.company?.toLowerCase().includes(query)
        const matchShortName = customer.shortName?.toLowerCase().includes(query)
        if (!matchName && !matchCompany && !matchShortName) return false
      }
      
      // Region filter
      if (regionFilter !== "all" && customer.region !== regionFilter) return false
      
      // Industry filter
      if (industryFilter !== "all" && customer.industryDetail !== industryFilter) return false
      
      // Status filter
      if (statusFilter !== "all") {
        const now = new Date()
        const isInProtection = customer.protectUntil && new Date(customer.protectUntil) > now
        const actualStatus = isInProtection ? "保护期中" : "可领取"
        if (actualStatus !== statusFilter) return false
      }
      
      return true
    })
  }, [data, searchQuery, regionFilter, industryFilter, statusFilter])
  
  // Handlers
  const handleClaim = (assignee: string) => {
    if (!selectedCustomer) return
    
    setActionLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setActionLoading(false)
      setClaimDialogOpen(false)
      
      // Update local data
      setData(prev => prev.filter(c => c.id !== selectedCustomer.id))
      
      toast({
        title: "领取成功",
        description: `客户「${selectedCustomer.name}」已分配给 ${assignee}`,
      })
      
      setSelectedCustomer(null)
    }, 1000)
  }
  
  const handleReturn = (reason: string) => {
    if (!selectedCustomer) return
    
    setActionLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setActionLoading(false)
      setReturnDialogOpen(false)
      
      toast({
        title: "退回成功",
        description: `客户「${selectedCustomer.name}」已退回公海池`,
      })
      
      setSelectedCustomer(null)
    }, 1000)
  }
  
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setData([...mockPublicPoolCustomers])
      setIsLoading(false)
      toast({
        title: "刷新成功",
        description: "公海池数据已更新",
      })
    }, 500)
  }
  
  // Columns with actions
  const columnsWithActions = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "操作",
        meta: { width: 80, fixed: "right" } as DataTableColumnMeta,
        cell: ({ row }: { row: { original: CustomerExtended } }) => {
          const customer = row.original
          const now = new Date()
          const isInProtection = !!customer.protectUntil && new Date(customer.protectUntil) > now
          
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/customers/${customer.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setClaimDialogOpen(true)
                  }}
                  disabled={isInProtection}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isInProtection ? "保护期中" : "领取"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  }, [navigate])
  
  // Stats
  const stats = React.useMemo(() => {
    const total = data.length
    const available = data.filter(c => !c.protectUntil || new Date(c.protectUntil) <= new Date()).length
    const inProtection = data.filter(c => c.protectUntil && new Date(c.protectUntil) > new Date()).length
    const highScore = data.filter(c => c.score >= 80).length
    
    return { total, available, inProtection, highScore }
  }, [data])
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">公海池</h1>
            <p className="text-muted-foreground text-sm">
              查看和领取公海客户，保护期 {DEFAULT_PUBLIC_POOL_CONFIG.protectionDays} 天
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            刷新
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">公海客户总数</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">可领取</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">保护期中</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inProtection}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">高评分客户 (≥80)</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.highScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索客户姓名、公司、简称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="区域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部区域</SelectItem>
              {Object.entries(REGION_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="行业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部行业</SelectItem>
              {Object.entries(INDUSTRY_DETAIL_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="可领取">可领取</SelectItem>
              <SelectItem value="保护期中">保护期中</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* DataTable */}
        <DataTable
          columns={columnsWithActions}
          data={filteredData}
          showBatchActions={false}
          showSearch={false}
          showDensityToggle={false}
          showPagination
          pageSizeOptions={[10, 20, 50]}
          defaultPageSize={10}
          emptyText="暂无公海客户数据"
          loading={isLoading}
          className="border rounded-lg"
        />
        
        {/* Claim Dialog */}
        <ClaimDialog
          open={claimDialogOpen}
          onOpenChange={setClaimDialogOpen}
          customer={selectedCustomer}
          onConfirm={handleClaim}
          loading={actionLoading}
        />
        
        {/* Return Dialog */}
        <ReturnDialog
          open={returnDialogOpen}
          onOpenChange={setReturnDialogOpen}
          customer={selectedCustomer}
          onConfirm={handleReturn}
          loading={actionLoading}
        />
      </div>
    </div>
  )
}

export default HighSeasPool
