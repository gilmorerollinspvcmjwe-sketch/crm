import * as React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Code,
  Undo,
  Redo,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

// ============ Toolbar Button ============

interface ToolbarButtonProps {
  editor: Editor
  action: () => boolean | void
  isActive?: boolean
  disabled?: boolean
  icon: React.ReactNode
  tooltip: string
  variant?: 'default' | 'outline' | 'ghost'
}

function ToolbarButton({
  editor,
  action,
  isActive,
  disabled,
  icon,
  tooltip,
  variant = 'ghost',
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            'h-8 w-8 p-0',
            isActive && 'bg-primary/10 text-primary'
          )}
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault()
            action()
          }}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// ============ Toolbar Component ============

interface EditorToolbarProps {
  editor: Editor
  showHeadings?: boolean
  showLists?: boolean
  showAlignment?: boolean
  showLink?: boolean
  showHighlight?: boolean
  showCode?: boolean
  showHistory?: boolean
  compact?: boolean
}

function EditorToolbar({
  editor,
  showHeadings = true,
  showLists = true,
  showAlignment = true,
  showLink = true,
  showHighlight = true,
  showCode = true,
  showHistory = true,
  compact = false,
}: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = React.useState('')
  const [linkPopoverOpen, setLinkPopoverOpen] = React.useState(false)

  const setLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .setLink({ href: linkUrl, target: '_blank' })
      .run()
    setLinkPopoverOpen(false)
    setLinkUrl('')
  }

  const isLinkActive = editor.isActive('link')

  React.useEffect(() => {
    if (linkPopoverOpen && isLinkActive) {
      const currentLink = editor.getAttributes('link').href
      setLinkUrl(currentLink || '')
    }
  }, [linkPopoverOpen, isLinkActive, editor])

  const buttonClass = compact ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5 p-2 border-b bg-muted/30 rounded-t-lg">
        {/* History */}
        {showHistory && (
          <>
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={<Undo className="h-4 w-4" />}
              tooltip="撤销"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={<Redo className="h-4 w-4" />}
              tooltip="重做"
            />
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Text Style */}
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold className="h-4 w-4" />}
          tooltip="粗体"
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic className="h-4 w-4" />}
          tooltip="斜体"
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<UnderlineIcon className="h-4 w-4" />}
          tooltip="下划线"
        />
        <ToolbarButton
          editor={editor}
          action={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<Strikethrough className="h-4 w-4" />}
          tooltip="删除线"
        />
        {showHighlight && (
          <ToolbarButton
            editor={editor}
            action={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            icon={<Highlighter className="h-4 w-4" />}
            tooltip="高亮"
          />
        )}
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        {showHeadings && (
          <>
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={<Heading1 className="h-4 w-4" />}
              tooltip="标题 1"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={<Heading2 className="h-4 w-4" />}
              tooltip="标题 2"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              icon={<Heading3 className="h-4 w-4" />}
              tooltip="标题 3"
            />
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Lists */}
        {showLists && (
          <>
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={<List className="h-4 w-4" />}
              tooltip="无序列表"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={<ListOrdered className="h-4 w-4" />}
              tooltip="有序列表"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive('taskList')}
              icon={<ListChecks className="h-4 w-4" />}
              tooltip="任务列表"
            />
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Alignment */}
        {showAlignment && (
          <>
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              icon={<AlignLeft className="h-4 w-4" />}
              tooltip="左对齐"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              icon={<AlignCenter className="h-4 w-4" />}
              tooltip="居中"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              icon={<AlignRight className="h-4 w-4" />}
              tooltip="右对齐"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              icon={<AlignJustify className="h-4 w-4" />}
              tooltip="两端对齐"
            />
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Link */}
        {showLink && (
          <>
            <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
              <PopoverTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        buttonClass,
                        isLinkActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{isLinkActive ? '编辑链接' : '添加链接'}</p>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="start">
                <div className="space-y-2">
                  <p className="text-sm font-medium">链接地址</p>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        setLink()
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={setLink}>
                      确定
                    </Button>
                    {isLinkActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          editor.chain().focus().unsetLink().run()
                          setLinkPopoverOpen(false)
                          setLinkUrl('')
                        }}
                      >
                        移除
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Code */}
        {showCode && (
          <>
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              icon={<Code className="h-4 w-4" />}
              tooltip="行内代码"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              icon={<Code className="h-4 w-4" />}
              tooltip="代码块"
            />
            <ToolbarButton
              editor={editor}
              action={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={<Quote className="h-4 w-4" />}
              tooltip="引用"
            />
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

// ============ RichTextEditor Component ============

interface RichTextEditorProps {
  /** Initial content */
  content?: string
  /** Placeholder text */
  placeholder?: string
  /** Change callback */
  onChange?: (content: string) => void
  /** Blur callback */
  onBlur?: (content: string) => void
  /** Editor height */
  height?: number | string
  /** Minimum height */
  minHeight?: number | string
  /** Maximum height */
  maxHeight?: number | string
  /** Whether editor is editable */
  editable?: boolean
  /** Editor variant */
  variant?: 'full' | 'compact' | 'minimal'
  /** Custom class name */
  className?: string
  /** Show toolbar */
  showToolbar?: boolean
  /** Autofocus on mount */
  autofocus?: boolean
}

export function RichTextEditor({
  content = '',
  placeholder = '开始输入内容...',
  onChange,
  onBlur,
  height,
  minHeight = 120,
  maxHeight = 400,
  editable = true,
  variant = 'full',
  className,
  showToolbar = true,
  autofocus = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
          class: 'bg-yellow-200 px-0.5',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable,
    autofocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    onBlur: ({ editor }) => {
      onBlur?.(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const toolbarProps = {
    editor,
    showHeadings: variant !== 'minimal',
    showLists: variant !== 'minimal',
    showAlignment: variant === 'full',
    showLink: variant !== 'minimal',
    showHighlight: variant === 'full',
    showCode: variant === 'full',
    showHistory: variant === 'full',
    compact: variant === 'compact',
  }

  return (
    <div
      className={cn(
        'rounded-lg border bg-card overflow-hidden',
        !editable && 'opacity-60',
        className
      )}
    >
      {showToolbar && variant !== 'minimal' && (
        <EditorToolbar {...toolbarProps} />
      )}

      <div
        className="prose prose-sm max-w-none p-3 overflow-auto"
        style={{
          height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
          minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }}
      >
        <EditorContent
          editor={editor}
          className="tiptap-editor-content focus:outline-none"
        />
      </div>
    </div>
  )
}

// ============ NoteEditor (Simple variant) ============

interface NoteEditorProps {
  content?: string
  placeholder?: string
  onChange?: (content: string) => void
  onSave?: (content: string) => void
  onCancel?: () => void
  className?: string
  showActions?: boolean
  saving?: boolean
}

export function NoteEditor({
  content = '',
  placeholder = '输入备注...',
  onChange,
  onSave,
  onCancel,
  className,
  showActions = true,
  saving = false,
}: NoteEditorProps) {
  const [localContent, setLocalContent] = React.useState(content)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content: localContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setLocalContent(html)
      onChange?.(html)
    },
  })

  React.useEffect(() => {
    if (editor && content !== localContent) {
      editor.commands.setContent(content)
      setLocalContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <RichTextEditor
        content={localContent}
        placeholder={placeholder}
        onChange={(html) => {
          setLocalContent(html)
          onChange?.(html)
        }}
        variant="compact"
        showToolbar
        minHeight={80}
        maxHeight={200}
      />
      {showActions && (
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={saving}
            >
              取消
            </Button>
          )}
          {onSave && (
            <Button
              size="sm"
              onClick={() => onSave(localContent)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============ EmailEditor ============

interface EmailEditorProps {
  subject?: string
  content?: string
  onSubjectChange?: (subject: string) => void
  onContentChange?: (content: string) => void
  onSend?: () => void
  onSaveDraft?: () => void
  sending?: boolean
  saving?: boolean
  className?: string
}

export function EmailEditor({
  subject = '',
  content = '',
  onSubjectChange,
  onContentChange,
  onSend,
  onSaveDraft,
  sending = false,
  saving = false,
  className,
}: EmailEditorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Subject */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">主题</label>
        <Input
          value={subject}
          onChange={(e) => onSubjectChange?.(e.target.value)}
          placeholder="邮件主题"
          className="w-full"
        />
      </div>

      {/* Content */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">内容</label>
        <RichTextEditor
          content={content}
          placeholder="输入邮件内容..."
          onChange={onContentChange}
          variant="full"
          showToolbar
          minHeight={200}
          maxHeight={500}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {onSaveDraft && (
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={saving || sending}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                保存中...
              </>
            ) : (
              '保存草稿'
            )}
          </Button>
        )}
        {onSend && (
          <Button onClick={onSend} disabled={sending || !subject}>
            {sending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                发送中...
              </>
            ) : (
              '发送'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default RichTextEditor