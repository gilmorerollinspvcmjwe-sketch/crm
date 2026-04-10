"use client"

import React from "react"
import { Loader2, Zap, Plus, Edit, Trash2, Play, Pause, History, CheckCircle, Clock, FileText, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useWorkflowSettingsList,
  useCreateWorkflowSettingsEntry,
  useUpdateWorkflowSettingsEntry,
  useDeleteWorkflowSettingsEntry,
} from "@/hooks/api/useSettings"
import { cn } from "@/lib/utils"

// ============ WorkflowSettings Page ============

const triggerTypeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  record_created: { label: "记录创建", icon: <Plus className="h-4 w-4" /> },
  record_updated: { label: "记录更新", icon: <Edit className="h-4 w-4" /> },
  field_changed: { label: "字段变更", icon: <Zap className="h-4 w-4" /> },
  scheduled: { label: "定时触发", icon: <Clock className="h-4 w-4" /> },
  manual: { label: "手动触发", icon: <Play className="h-4 w-4" /> },
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  draft: "bg-amber-100 text-amber-700",
}

export function WorkflowSettingsPage() {
  const { data: workflows, isLoading } = useWorkflowSettingsList()
  const createWorkflow = useCreateWorkflowSettingsEntry()
  const updateWorkflow = useUpdateWorkflowSettingsEntry()
  const deleteWorkflow = useDeleteWorkflowSettingsEntry()

  const [searchText, setSearchText] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [filterTrigger, setFilterTrigger] = React.useState("all")

  // 筛选工作流
  const filteredWorkflows = React.useMemo(() => {
    if (!workflows) return []
    return workflows.filter((wf) => {
      if (filterStatus !== "all" && !wf.enabled && filterStatus !== "inactive") return false
      if (filterStatus === "active" && !wf.enabled) return false
      if (filterStatus === "inactive" && wf.enabled) return false
      if (filterTrigger !== "all" && wf.triggerType !== filterTrigger) return false
      if (searchText && !wf.name.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
  }, [workflows, filterStatus, filterTrigger, searchText])

  const handleToggleEnabled = async (workflow: any) => {
    try {
      await updateWorkflow.mutateAsync({
        id: workflow.name, // Using name as id for mock
        data: { enabled: !workflow.enabled },
      })
    } catch (error) {
      console.error("Failed to toggle workflow:", error)
    }
  }

  const handleDelete = async (workflow: any) => {
    try {
      await deleteWorkflow.mutateAsync(workflow.name)
    } catch (error) {
      console.error("Failed to delete workflow:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工作流设置</h1>
          <p className="text-muted-foreground">管理自动化工作流和业务规则</p>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">总工作流</p>
                <p className="text-2xl font-bold">{workflows?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">已启用</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows?.filter(w => w.enabled).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Pause className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">已禁用</p>
                <p className="text-2xl font-bold text-gray-600">
                  {workflows?.filter(w => !w.enabled).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">定时触发</p>
                <p className="text-2xl font-bold text-amber-600">
                  {workflows?.filter(w => w.triggerType === 'scheduled').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选工具栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="搜索工作流..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">已启用</SelectItem>
                <SelectItem value="inactive">已禁用</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTrigger} onValueChange={setFilterTrigger}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="触发类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="record_created">记录创建</SelectItem>
                <SelectItem value="record_updated">记录更新</SelectItem>
                <SelectItem value="field_changed">字段变更</SelectItem>
                <SelectItem value="scheduled">定时触发</SelectItem>
                <SelectItem value="manual">手动触发</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto">
              <History className="mr-2 h-4 w-4" />
              执行日志
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              创建工作流
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 工作流列表 */}
      <Card>
        <CardHeader>
          <CardTitle>工作流列表</CardTitle>
          <CardDescription>管理所有自动化工作流规则</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">状态</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>目标对象</TableHead>
                <TableHead>触发类型</TableHead>
                <TableHead>动作数量</TableHead>
                <TableHead className="w-12">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.name}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        workflow.enabled
                          ? statusColors.active
                          : statusColors.inactive
                      )}
                    >
                      {workflow.enabled ? "启用" : "禁用"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {workflow.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{workflow.targetObject}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {triggerTypeLabels[workflow.triggerType]?.icon}
                      <span>{triggerTypeLabels[workflow.triggerType]?.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>{workflow.actions.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4" />
                          查看日志
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleEnabled(workflow)}>
                          {workflow.enabled ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              禁用
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              启用
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(workflow)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredWorkflows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">暂无工作流数据</p>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        创建第一个工作流
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">工作流说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium text-foreground">触发类型：</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>记录创建</strong> - 新记录创建时触发</li>
                <li><strong>记录更新</strong> - 记录字段更新时触发</li>
                <li><strong>字段变更</strong> - 特定字段值变更时触发</li>
                <li><strong>定时触发</strong> - 按时间计划自动执行</li>
                <li><strong>手动触发</strong> - 用户手动执行</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">执行动作：</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>发送邮件</strong> - 自动发送邮件通知</li>
                <li><strong>创建任务</strong> - 自动创建待办任务</li>
                <li><strong>更新字段</strong> - 自动更新记录字段</li>
                <li><strong>发送通知</strong> - 系统内部通知推送</li>
                <li><strong>调用 API</strong> - 调用外部 API 接口</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkflowSettingsPage