"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, MessageSquare, Send, Bot, User, Sparkles, FileText, Users, TrendingUp, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// ============ Types ============

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  action?: "customer" | "opportunity" | "contract" | "todo" | "performance"
  timestamp: Date
}

// ============ Quick Commands ============

const quickCommands = [
  { label: "创建客户", command: "创建客户", icon: Users, action: "customer" },
  { label: "创建商机", command: "创建商机", icon: TrendingUp, action: "opportunity" },
  { label: "创建合同", command: "创建合同", icon: Briefcase, action: "contract" },
  { label: "查看待办", command: "查看我的待办", icon: FileText, action: "todo" },
  { label: "本月业绩", command: "本月业绩", icon: Sparkles, action: "performance" },
]

const commandResponses: Record<string, { text: string; action?: string }> = {
  "创建客户": { text: "好的，我来帮您创建一个新客户记录。请提供客户的基本信息，如姓名、公司、联系方式等。", action: "customer" },
  "创建商机": { text: "我来帮您创建一个新的商机。请告诉我商机名称、预计金额、客户信息等。", action: "opportunity" },
  "创建合同": { text: "好的，我来帮您创建新合同。请提供合同编号、金额、签约日期等信息。", action: "contract" },
  "查看我的待办": { text: "正在为您打开待办事项列表...", action: "todo" },
  "本月业绩": { text: "正在为您展示本月业绩数据...", action: "performance" },
}

// ============ AI Assistant Page ============

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "您好！我是您的 AI 助手。我可以帮助您管理客户、商机、合同等业务数据，也可以回答您的问题。请选择下方快捷命令，或直接输入您的问题。",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const matchedCommand = Object.keys(commandResponses).find((cmd) =>
        content.trim().includes(cmd)
      )

      let assistantMessage: Message
      if (matchedCommand) {
        const response = commandResponses[matchedCommand]
        assistantMessage = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: response.text,
          action: response.action as any,
          timestamp: new Date(),
        }
      } else {
        assistantMessage = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: `我理解您的问题是关于"${content.trim()}"。让我为您查询相关信息...`,
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 800)
  }

  const handleQuickCommand = (command: string) => {
    handleSendMessage(command)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-6 p-6 h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bot className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI 助手</h1>
          <p className="text-muted-foreground">智能对话助手，帮助您高效处理业务</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <Card className="h-[calc(100%-100px)]">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Quick Commands */}
          <div className="p-4 border-b">
            <p className="text-sm text-muted-foreground mb-3">快捷命令：</p>
            <div className="flex flex-wrap gap-2">
              {quickCommands.map((cmd) => (
                <Button
                  key={cmd.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickCommand(cmd.command)}
                  className="rounded-full"
                >
                  <cmd.icon className="h-4 w-4 mr-1" />
                  {cmd.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-muted/30">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                      {msg.action && (
                        <Badge variant="secondary" className="text-xs">
                          {msg.action === "customer" ? "客户" : 
                           msg.action === "opportunity" ? "商机" : 
                           msg.action === "contract" ? "合同" : 
                           msg.action === "todo" ? "待办" : "业绩"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {msg.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-background shadow-sm rounded-2xl p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <Separator />
          <div className="p-4 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="输入您的问题或指令..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4 mr-2" />
                发送
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIAssistantPage