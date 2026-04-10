"use client"

import { useState } from "react"
import { Loader2, BrainCircuit, Plus, Settings, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock, Zap, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// ============ Types ============

interface AIModel {
  id: string
  name: string
  provider: string
  type: "chat" | "embedding" | "vision" | "audio"
  status: "active" | "inactive" | "error" | "loading"
  capabilities: string[]
  maxTokens: number
  costPerToken: number
  avgResponseTime: number
  successRate: number
  totalCalls: number
  lastUsed?: string
  isDefault: boolean
  endpoint?: string
}

// ============ Mock Data ============

const mockModels: AIModel[] = [
  {
    id: "M001",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    type: "chat",
    status: "active",
    capabilities: ["文本生成", "代码生成", "分析推理", "翻译"],
    maxTokens: 4096,
    costPerToken: 0.01,
    avgResponseTime: 1.2,
    successRate: 98.5,
    totalCalls: 156,
    lastUsed: "2025-04-03 14:30",
    isDefault: true,
  },
  {
    id: "M002",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    type: "chat",
    status: "active",
    capabilities: ["文本生成", "简单问答", "翻译"],
    maxTokens: 2048,
    costPerToken: 0.002,
    avgResponseTime: 0.8,
    successRate: 99.2,
    totalCalls: 45,
    lastUsed: "2025-04-02 10:15",
    isDefault: false,
  },
  {
    id: "M003",
    name: "Claude 3",
    provider: "Anthropic",
    type: "chat",
    status: "active",
    capabilities: ["文本生成", "分析推理", "长文本处理"],
    maxTokens: 8192,
    costPerToken: 0.015,
    avgResponseTime: 1.5,
    successRate: 97.8,
    totalCalls: 28,
    lastUsed: "2025-04-01 16:45",
    isDefault: false,
  },
  {
    id: "M004",
    name: "Embedding Model",
    provider: "OpenAI",
    type: "embedding",
    status: "active",
    capabilities: ["文本向量化", "语义搜索"],
    maxTokens: 512,
    costPerToken: 0.0001,
    avgResponseTime: 0.3,
    successRate: 99.9,
    totalCalls: 1200,
    lastUsed: "2025-04-03 12:00",
    isDefault: false,
  },
  {
    id: "M005",
    name: "自定义模型",
    provider: "Custom",
    type: "chat",
    status: "inactive",
    capabilities: ["文本生成"],
    maxTokens: 2048,
    costPerToken: 0,
    avgResponseTime: 2.0,
    successRate: 95.0,
    totalCalls: 0,
    isDefault: false,
    endpoint: "https://api.custom.com/v1",
  },
]

// ============ Status Badge ============

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "运行中", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
  inactive: { label: "已停用", color: "bg-gray-400", icon: <AlertCircle className="h-4 w-4" /> },
  error: { label: "异常", color: "bg-red-500", icon: <AlertCircle className="h-4 w-4" /> },
  loading: { label: "加载中", color: "bg-blue-500", icon: <Loader2 className="h-4 w-4 animate-spin" /> },
}

const typeLabels: Record<string, string> = {
  chat: "对话模型",
  embedding: "向量模型",
  vision: "视觉模型",
  audio: "音频模型",
}

// ============ AI Models Page ============

export function AIModelsPage() {
  const [models, setModels] = useState<AIModel[]>(mockModels)
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Filter models
  const filteredModels = models.filter((model) => {
    if (filterType !== "all" && model.type !== filterType) return false
    if (filterStatus !== "all" && model.status !== filterStatus) return false
    return true
  })

  // Toggle model status
  const toggleModelStatus = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    )
  }

  // Set default model
  const setDefaultModel = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === modelId }))
    )
  }

  // Delete model
  const deleteModel = (modelId: string) => {
    if (confirm("确定要删除此模型吗？")) {
      setModels((prev) => prev.filter((m) => m.id !== modelId))
    }
  }

  // Add new model (mock)
  const handleAddModel = () => {
    const newModel: AIModel = {
      id: `M${Date.now()}`,
      name: "新模型",
      provider: "Custom",
      type: "chat",
      status: "inactive",
      capabilities: ["文本生成"],
      maxTokens: 2048,
      costPerToken: 0,
      avgResponseTime: 2.0,
      successRate: 95.0,
      totalCalls: 0,
      isDefault: false,
    }
    setModels((prev) => [...prev, newModel])
    setAddDialogOpen(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">模型管理</h1>
            <p className="text-muted-foreground">管理 AI 模型配置和状态</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新状态
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加模型
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新模型</DialogTitle>
                <DialogDescription>配置新的 AI 模型接入</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>模型名称</Label>
                    <Input placeholder="输入模型名称" />
                  </div>
                  <div className="space-y-2">
                    <Label>提供商</Label>
                    <Select defaultValue="openai">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="custom">自定义</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>模型类型</Label>
                  <Select defaultValue="chat">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">对话模型</SelectItem>
                      <SelectItem value="embedding">向量模型</SelectItem>
                      <SelectItem value="vision">视觉模型</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Endpoint（可选）</Label>
                  <Input placeholder="https://api.example.com/v1" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleAddModel}>添加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="模型类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="chat">对话模型</SelectItem>
            <SelectItem value="embedding">向量模型</SelectItem>
            <SelectItem value="vision">视觉模型</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="运行状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">运行中</SelectItem>
            <SelectItem value="inactive">已停用</SelectItem>
            <SelectItem value="error">异常</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">
          共 {filteredModels.length} 个模型
        </Badge>
      </div>

      {/* Models Grid */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">卡片视图</TabsTrigger>
          <TabsTrigger value="table">列表视图</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredModels.map((model) => {
              const status = statusConfig[model.status]
              return (
                <Card key={model.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        {model.isDefault && (
                          <Badge variant="default">默认</Badge>
                        )}
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        {status.icon}
                        <span className="ml-1">{status.label}</span>
                      </Badge>
                    </div>
                    <CardDescription>
                      {model.provider} · {typeLabels[model.type]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.slice(0, 3).map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {model.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{model.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">响应：</span>
                        <span className="font-medium">{model.avgResponseTime}s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">成功率：</span>
                        <span className="font-medium">{model.successRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">最大：</span>
                        <span className="font-medium">{model.maxTokens}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">调用：</span>
                        <span className="font-medium">{model.totalCalls}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={model.status === "active"}
                          onCheckedChange={() => toggleModelStatus(model.id)}
                        />
                        <Label className="text-xs">启用</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedModel(model)
                            setDialogOpen(true)
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        {!model.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteModel(model.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredModels.map((model) => {
                  const status = statusConfig[model.status]
                  return (
                    <div
                      key={model.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 w-[200px]">
                        <BrainCircuit className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{model.name}</span>
                          {model.isDefault && (
                            <Badge variant="default" className="ml-2 text-xs">默认</Badge>
                          )}
                        </div>
                      </div>
                      <div className="w-[100px]">
                        <Badge variant="outline">{model.provider}</Badge>
                      </div>
                      <div className="w-[100px]">
                        <Badge variant="secondary">{typeLabels[model.type]}</Badge>
                      </div>
                      <div className="w-[100px]">
                        <Badge className={`${status.color} text-white`}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex-1 flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">响应：</span>
                        <span className="font-medium">{model.avgResponseTime}s</span>
                        <span className="text-muted-foreground">成功率：</span>
                        <span className="font-medium text-green-600">{model.successRate}%</span>
                        <span className="text-muted-foreground">调用：</span>
                        <span className="font-medium">{model.totalCalls}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={model.status === "active"}
                          onCheckedChange={() => toggleModelStatus(model.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultModel(model.id)}
                          disabled={model.isDefault}
                        >
                          设为默认
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Model Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedModel?.name} 配置</DialogTitle>
            <DialogDescription>查看和修改模型详细配置</DialogDescription>
          </DialogHeader>
          {selectedModel && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>模型 ID</Label>
                  <Input value={selectedModel.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label>提供商</Label>
                  <Input value={selectedModel.provider} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>最大 Tokens</Label>
                <Input value={selectedModel.maxTokens} disabled />
              </div>
              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <Input
                  value={selectedModel.endpoint || "使用系统默认"}
                  disabled
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>能力标签</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline">{cap}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AIModelsPage