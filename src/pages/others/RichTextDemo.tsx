import * as React from 'react'
import { RichTextEditor, NoteEditor } from '@/components/RichText'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Save, Send, FileText, Mail } from 'lucide-react'

/**
 * Demo page showcasing Rich Text Editor capabilities
 * - Email Editor
 * - Note Editor
 * - Full Editor
 */
export function RichTextDemo() {
  const { toast } = useToast()
  const [emailSubject, setEmailSubject] = React.useState('')
  const [emailContent, setEmailContent] = React.useState('')
  const [noteContent, setNoteContent] = React.useState('')
  const [fullContent, setFullContent] = React.useState('')

  const handleSendEmail = () => {
    toast({
      title: '邮件发送成功',
      description: `主题: ${emailSubject}`,
    })
  }

  const handleSaveNote = (content: string) => {
    setNoteContent(content)
    toast({
      title: '备注保存成功',
    })
  }

  const handleSaveFull = () => {
    toast({
      title: '内容保存成功',
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">富文本编辑器演示</h1>
        <p className="text-muted-foreground">
          基于 TipTap 的富文本编辑器组件，支持邮件编辑、备注编辑等多种场景
        </p>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            邮件编辑器
          </TabsTrigger>
          <TabsTrigger value="note">
            <FileText className="w-4 h-4 mr-2" />
            备注编辑器
          </TabsTrigger>
          <TabsTrigger value="full">
            <FileText className="w-4 h-4 mr-2" />
            完整编辑器
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>邮件编辑器</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                placeholder="输入邮件内容..."
                content={emailContent}
                onChange={setEmailContent}
                variant="compact"
                minHeight={200}
                maxHeight={400}
              />
              <div className="mt-4 flex gap-2">
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  保存草稿
                </Button>
                <Button onClick={handleSendEmail} disabled={!emailContent}>
                  <Send className="w-4 h-4 mr-2" />
                  发送邮件
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="note">
          <Card>
            <CardHeader>
              <CardTitle>备注编辑器</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteEditor
                content={noteContent}
                placeholder="输入备注内容..."
                onChange={setNoteContent}
                onSave={handleSaveNote}
                showActions
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full">
          <Card>
            <CardHeader>
              <CardTitle>完整富文本编辑器</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={fullContent}
                placeholder="支持完整的富文本编辑功能..."
                onChange={setFullContent}
                variant="full"
                minHeight={300}
                maxHeight={600}
              />
              <div className="mt-4">
                <Button onClick={handleSaveFull}>
                  <Save className="w-4 h-4 mr-2" />
                  保存内容
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature List */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>编辑器功能</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">文本样式</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>粗体、斜体、下划线</li>
                    <li>删除线</li>
                    <li>高亮标记</li>
                    <li>行内代码</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">标题与段落</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>H1-H3 标题</li>
                    <li>段落对齐</li>
                    <li>引用块</li>
                    <li>代码块</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">列表</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>无序列表</li>
                    <li>有序列表</li>
                    <li>任务列表</li>
                    <li>嵌套列表</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">链接</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>添加链接</li>
                    <li>编辑链接</li>
                    <li>移除链接</li>
                    <li>自动打开链接</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">历史</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>撤销操作</li>
                    <li>重做操作</li>
                    <li>操作历史</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">编辑模式</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>完整模式 (full)</li>
                    <li>紧凑模式 (compact)</li>
                    <li>最小模式 (minimal)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RichTextDemo