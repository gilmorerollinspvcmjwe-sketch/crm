/**
 * 待办事项组件 (TodoList)
 * 功能：任务列表展示、新建/完成/删除任务、截止日期显示
 */

import * as React from 'react'
import { Plus, Trash2, CheckCircle, Circle, Calendar, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface TodoItem {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
  category: 'followup' | 'approval' | 'payment' | 'task'
  customer?: string
  createdAt: string
}

interface TodoListProps {
  todos?: TodoItem[]
  onAddTodo?: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void
  onCompleteTodo?: (id: string) => void
  onDeleteTodo?: (id: string) => void
  maxItems?: number
}

const priorityConfig: Record<TodoItem['priority'], { color: string; label: string }> = {
  high: { color: 'text-red-500 bg-red-500/10', label: '高' },
  medium: { color: 'text-yellow-500 bg-yellow-500/10', label: '中' },
  low: { color: 'text-green-500 bg-green-500/10', label: '低' },
}

const categoryConfig: Record<TodoItem['category'], { color: string; label: string }> = {
  followup: { color: 'bg-blue-500', label: '跟进' },
  approval: { color: 'bg-orange-500', label: '审批' },
  payment: { color: 'bg-green-500', label: '回款' },
  task: { color: 'bg-purple-500', label: '任务' },
}

export function TodoList({
  todos: propTodos,
  onAddTodo,
  onCompleteTodo,
  onDeleteTodo,
  maxItems = 10,
}: TodoListProps) {
  const [todos, setTodos] = React.useState<TodoItem[]>(propTodos || [])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newTodo, setNewTodo] = React.useState<{
    title: string
    description: string
    dueDate: string
    priority: 'high' | 'medium' | 'low'
    category: 'followup' | 'approval' | 'payment' | 'task'
    customer: string
  }>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: 'task',
    customer: '',
  })

  React.useEffect(() => {
    if (propTodos) {
      setTodos(propTodos)
    }
  }, [propTodos])

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return

    const todo: Omit<TodoItem, 'id' | 'createdAt'> = {
      title: newTodo.title,
      description: newTodo.description,
      dueDate: newTodo.dueDate,
      priority: newTodo.priority,
      status: 'pending',
      category: newTodo.category,
      customer: newTodo.customer,
    }

    if (onAddTodo) {
      onAddTodo(todo)
    } else {
      setTodos((prev) => [
        ...prev,
        {
          ...todo,
          id: `todo-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ])
    }

    setNewTodo({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      category: 'task',
      customer: '',
    })
    setDialogOpen(false)
  }

  const handleCompleteTodo = (id: string) => {
    if (onCompleteTodo) {
      onCompleteTodo(id)
    } else {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, status: 'completed' as const } : todo
        )
      )
    }
  }

  const handleDeleteTodo = (id: string) => {
    if (onDeleteTodo) {
      onDeleteTodo(id)
    } else {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1
    if (a.status !== 'completed' && b.status === 'completed') return -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const pendingTodos = sortedTodos.filter((t) => t.status === 'pending')
  const completedTodos = sortedTodos.filter((t) => t.status === 'completed')

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return '今天'
    if (date.toDateString() === tomorrow.toDateString()) return '明天'

    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">待办事项</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {pendingTodos.length}
          </Badge>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          新建
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-2">
            {sortedTodos.slice(0, maxItems).map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  todo.status === 'completed'
                    ? 'bg-muted/50 opacity-60'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                <button
                  onClick={() => handleCompleteTodo(todo.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {todo.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          todo.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.customer && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {todo.customer}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge className={priorityConfig[todo.priority].color}>
                        {priorityConfig[todo.priority].label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        isOverdue(todo.dueDate) && todo.status !== 'completed'
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      {formatDate(todo.dueDate)}
                      {isOverdue(todo.dueDate) && todo.status !== 'completed' && (
                        <AlertCircle className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${categoryConfig[todo.category].color}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {categoryConfig[todo.category].label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sortedTodos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无待办事项</p>
                <p className="text-xs mt-1">点击右上角新建任务</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* 新建任务对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建待办事项</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">标题</label>
              <Input
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                placeholder="输入任务标题"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">描述</label>
              <Input
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                placeholder="输入任务描述（可选）"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">截止日期</label>
                <Input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">优先级</label>
                <Select
                  value={newTodo.priority}
                  onValueChange={(value: 'high' | 'medium' | 'low') =>
                    setNewTodo({ ...newTodo, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">类别</label>
                <Select
                  value={newTodo.category}
                  onValueChange={(value: 'followup' | 'approval' | 'payment' | 'task') =>
                    setNewTodo({ ...newTodo, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="followup">跟进</SelectItem>
                    <SelectItem value="approval">审批</SelectItem>
                    <SelectItem value="payment">回款</SelectItem>
                    <SelectItem value="task">任务</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">客户</label>
                <Input
                  value={newTodo.customer}
                  onChange={(e) => setNewTodo({ ...newTodo, customer: e.target.value })}
                  placeholder="关联客户（可选）"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddTodo} disabled={!newTodo.title.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default TodoList
