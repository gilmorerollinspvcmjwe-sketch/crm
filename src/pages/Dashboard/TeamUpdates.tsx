/**
 * 团队动态组件 (TeamUpdates)
 * 功能：团队成员动态、头像 + 昵称 + 时间
 */

import * as React from 'react'
import { Users, Award, TrendingUp, MessageSquare, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: string
  department: string
}

export interface TeamUpdateItem {
  id: string
  type: 'achievement' | 'activity' | 'milestone' | 'announcement'
  title: string
  description?: string
  member: TeamMember
  time: string
  timestamp: number
  metrics?: {
    label: string
    value: string | number
    change?: number
  }[]
  likes?: number
  comments?: number
}

interface TeamUpdatesProps {
  updates?: TeamUpdateItem[]
  members?: TeamMember[]
  onUpdateClick?: (update: TeamUpdateItem) => void
  viewMode?: 'all' | 'achievements' | 'activities'
  onViewModeChange?: (mode: 'all' | 'achievements' | 'activities') => void
  maxItems?: number
  className?: string
}

const typeConfig = {
  achievement: {
    icon: Award,
    color: 'text-yellow-500 bg-yellow-500/10',
    label: '成就',
  },
  activity: {
    icon: MessageSquare,
    color: 'text-blue-500 bg-blue-500/10',
    label: '活动',
  },
  milestone: {
    icon: TrendingUp,
    color: 'text-green-500 bg-green-500/10',
    label: '里程碑',
  },
  announcement: {
    icon: Calendar,
    color: 'text-purple-500 bg-purple-500/10',
    label: '公告',
  },
}

const defaultMembers: TeamMember[] = [
  { id: '1', name: '李明', avatar: '', role: '销售经理', department: '销售部' },
  { id: '2', name: '王芳', avatar: '', role: '高级销售', department: '销售部' },
  { id: '3', name: '陈静', avatar: '', role: '客户经理', department: '客户服务部' },
  { id: '4', name: '张伟', avatar: '', role: '销售顾问', department: '销售部' },
  { id: '5', name: '赵敏', avatar: '', role: '销售顾问', department: '销售部' },
]

const defaultUpdates: TeamUpdateItem[] = [
  {
    id: '1',
    type: 'achievement',
    title: '本月销售冠军',
    description: '李明以 ¥450,000 的业绩获得本月销售冠军',
    member: { id: '1', name: '李明', avatar: '', role: '销售经理', department: '销售部' },
    time: '10 分钟前',
    timestamp: Date.now() - 10 * 60 * 1000,
    metrics: [
      { label: '成交金额', value: '¥450,000' },
      { label: '成交单数', value: 15 },
      { label: '环比增长', value: '+12.5%', change: 12.5 },
    ],
    likes: 28,
    comments: 5,
  },
  {
    id: '2',
    type: 'milestone',
    title: '季度目标达成',
    description: '销售团队提前完成 Q2 营收目标的 80%',
    member: { id: '1', name: '李明', avatar: '', role: '销售经理', department: '销售部' },
    time: '1 小时前',
    timestamp: Date.now() - 60 * 60 * 1000,
    metrics: [
      { label: '目标完成', value: '80%' },
      { label: '剩余时间', value: '2 个月' },
    ],
    likes: 45,
    comments: 12,
  },
  {
    id: '3',
    type: 'activity',
    title: '客户拜访',
    description: '王芳完成了对上海贸易集团的拜访',
    member: { id: '2', name: '王芳', avatar: '', role: '高级销售', department: '销售部' },
    time: '2 小时前',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    metrics: [
      { label: '客户等级', value: 'A 类' },
      { label: '预计金额', value: '¥320,000' },
    ],
    likes: 15,
    comments: 3,
  },
  {
    id: '4',
    type: 'achievement',
    title: '新客户签约',
    description: '陈静成功签约南京信息技术',
    member: { id: '3', name: '陈静', avatar: '', role: '客户经理', department: '客户服务部' },
    time: '3 小时前',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    metrics: [
      { label: '合同金额', value: '¥180,000' },
      { label: '客户来源', value: '网站转化' },
    ],
    likes: 22,
    comments: 4,
  },
  {
    id: '5',
    type: 'announcement',
    title: '下周培训计划',
    description: '下周三将举行产品知识培训，请全体销售参加',
    member: { id: '1', name: '李明', avatar: '', role: '销售经理', department: '销售部' },
    time: '昨天',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    metrics: [
      { label: '时间', value: '周三 14:00' },
      { label: '地点', value: '会议室 A' },
    ],
    likes: 18,
    comments: 8,
  },
  {
    id: '6',
    type: 'milestone',
    title: '客户满意度新高',
    description: '本月 CSAT 评分达到 4.6 分，创历史新高',
    member: { id: '3', name: '陈静', avatar: '', role: '客户经理', department: '客户服务部' },
    time: '昨天',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    metrics: [
      { label: 'CSAT 评分', value: '4.6' },
      { label: '环比提升', value: '+0.2', change: 0.2 },
    ],
    likes: 35,
    comments: 9,
  },
]

export function TeamUpdates({
  updates = defaultUpdates,
  members = defaultMembers,
  onUpdateClick,
  viewMode = 'all',
  onViewModeChange,
  maxItems = 10,
  className,
}: TeamUpdatesProps) {
  const [selectedMode, setSelectedMode] = React.useState(viewMode)

  const handleModeChange = (value: string) => {
    const mode = value as 'all' | 'achievements' | 'activities'
    setSelectedMode(mode)
    onViewModeChange?.(mode)
  }

  const filteredUpdates = updates.filter((update) => {
    if (selectedMode === 'all') return true
    if (selectedMode === 'achievements')
      return update.type === 'achievement' || update.type === 'milestone'
    if (selectedMode === 'activities')
      return update.type === 'activity' || update.type === 'announcement'
    return true
  })

  const sortedUpdates = [...filteredUpdates].sort((a, b) => b.timestamp - a.timestamp)

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">团队动态</CardTitle>
          <Badge variant="secondary">{members.length} 人</Badge>
        </div>
        <Tabs value={selectedMode} onValueChange={handleModeChange}>
          <TabsList className="grid grid-cols-3 w-[180px]">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="achievements">成就</TabsTrigger>
            <TabsTrigger value="activities">活动</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px]">
          <div className="px-4 py-2 space-y-4">
            {sortedUpdates.slice(0, maxItems).map((update) => {
              const config = typeConfig[update.type]
              const Icon = config.icon

              return (
                <div
                  key={update.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onUpdateClick?.(update)}
                >
                  {/* 头部 */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{update.title}</p>
                      {update.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {update.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(update.timestamp)}
                    </span>
                  </div>

                  {/* 成员信息 */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={update.member.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(update.member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{update.member.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {update.member.role}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-4">
                      {config.label}
                    </Badge>
                  </div>

                  {/* 指标数据 */}
                  {update.metrics && update.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {update.metrics.map((metric, i) => (
                        <div
                          key={i}
                          className="bg-muted/50 rounded px-2 py-1.5 text-xs"
                        >
                          <span className="text-muted-foreground">{metric.label}: </span>
                          <span
                            className={`font-medium ${
                              metric.change !== undefined
                                ? metric.change >= 0
                                  ? 'text-green-500'
                                  : 'text-red-500'
                                : ''
                            }`}
                          >
                            {metric.value}
                            {metric.change !== undefined && (
                              <span className="ml-1">
                                {metric.change >= 0 ? '+' : ''}
                                {metric.change}%
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 互动数据 */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {update.likes !== undefined && (
                      <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                        <Award className="h-3 w-3" />
                        {update.likes}
                      </Button>
                    )}
                    {update.comments !== undefined && (
                      <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {update.comments}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}

            {sortedUpdates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无团队动态</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default TeamUpdates
