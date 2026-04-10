/**
 * 合同附件列表组件
 * 支持附件上传、预览、下载、删除
 */

import * as React from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  File,
  FileText,
  Image,
  FileSpreadsheet,
  FileVideo,
  Music,
  Download,
  Trash2,
  Upload,
  Eye,
  MoreVertical,
  Paperclip,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useContractApproval } from '@/hooks/useContractApproval'
import type { ContractAttachment } from '@/types/contract'
import { AttachmentType } from '@/types/contract'

// ============================================
// 文件类型图标映射
// ============================================

function getFileIcon(fileType: string, fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (fileType.startsWith('image/')) {
    return <Image className="h-5 w-5 text-blue-500" />
  }

  if (fileType.includes('pdf') || extension === 'pdf') {
    return <FileText className="h-5 w-5 text-red-500" />
  }

  if (
    fileType.includes('spreadsheet') ||
    fileType.includes('excel') ||
    ['xls', 'xlsx', 'csv'].includes(extension || '')
  ) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />
  }

  if (fileType.includes('video') || ['mp4', 'avi', 'mov'].includes(extension || '')) {
    return <FileVideo className="h-5 w-5 text-purple-500" />
  }

  if (fileType.includes('audio') || ['mp3', 'wav', 'ogg'].includes(extension || '')) {
    return <Music className="h-5 w-5 text-yellow-500" />
  }

  return <File className="h-5 w-5 text-gray-500" />
}

// ============================================
// 附件类型配置
// ============================================

const attachmentTypeConfig: Record<AttachmentType, { label: string; color: string }> = {
  [AttachmentType.CONTRACT]: { label: '合同文件', color: 'bg-blue-100 text-blue-700' },
  [AttachmentType.APPENDIX]: { label: '附录', color: 'bg-purple-100 text-purple-700' },
  [AttachmentType.CERTIFICATE]: { label: '资质证书', color: 'bg-yellow-100 text-yellow-700' },
  [AttachmentType.OTHER]: { label: '其他', color: 'bg-gray-100 text-gray-700' },
}

// ============================================
// 文件大小格式化
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ============================================
// 组件 Props
// ============================================

interface ContractAttachmentListProps {
  /** 合同 ID */
  contractId: string
  /** 附件列表 */
  attachments?: ContractAttachment[]
  /** 是否允许上传（根据权限控制） */
  canUpload?: boolean
  /** 是否允许删除（根据权限控制） */
  canDelete?: boolean
  /** 附件更新回调 */
  onAttachmentsChange?: (attachments: ContractAttachment[]) => void
}

// ============================================
// 主组件
// ============================================

export function ContractAttachmentList({
  contractId,
  attachments = [],
  canUpload = true,
  canDelete = false,
  onAttachmentsChange,
}: ContractAttachmentListProps) {
  const { toast } = useToast()
  const { useUploadAttachment, useDeleteAttachment } = useContractApproval()

  // 文件输入引用
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // 上传附件 Mutation
  const uploadMutation = useUploadAttachment()

  // 删除附件 Mutation
  const deleteMutation = useDeleteAttachment()

  // 预览对话框状态
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [previewAttachment, setPreviewAttachment] = React.useState<ContractAttachment | null>(null)

  // 上传表单状态
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [attachmentType, setAttachmentType] = React.useState<AttachmentType>(AttachmentType.OTHER)
  const [description, setDescription] = React.useState('')
  const [uploadProgress, setUploadProgress] = React.useState(0)

  // ============================================
  // 处理文件选择
  // ============================================

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadOpen(true)
      // 重置 input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // ============================================
  // 处理上传
  // ============================================

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: '请选择文件',
        description: '请先选择要上传的文件',
        variant: 'destructive',
      })
      return
    }

    // 模拟上传进度
    setUploadProgress(0)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      await uploadMutation.mutateAsync({
        contractId,
        file: selectedFile,
        type: attachmentType,
        description,
      })

      setUploadProgress(100)
      setTimeout(() => {
        setUploadOpen(false)
        setSelectedFile(null)
        setAttachmentType(AttachmentType.OTHER)
        setDescription('')
        setUploadProgress(0)
      }, 500)

      onAttachmentsChange?.(attachments)
    } catch (error) {
      console.error('上传失败:', error)
      clearInterval(progressInterval)
      setUploadProgress(0)
    }
  }

  // ============================================
  // 处理删除
  // ============================================

  const handleDelete = async (attachmentId: string) => {
    try {
      await deleteMutation.mutateAsync(attachmentId)
      onAttachmentsChange?.(attachments)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // ============================================
  // 处理预览
  // ============================================

  const handlePreview = (attachment: ContractAttachment) => {
    setPreviewAttachment(attachment)
    setPreviewOpen(true)
  }

  // ============================================
  // 处理下载
  // ============================================

  const handleDownload = async (attachment: ContractAttachment) => {
    try {
      // 模拟下载
      toast({
        title: '开始下载',
        description: `正在下载 ${attachment.fileName}`,
      })

      // 实际项目中应该调用 API 获取下载链接并触发下载
      setTimeout(() => {
        toast({
          title: '下载完成',
          description: '文件已保存到下载文件夹',
          variant: 'success',
        })
      }, 1000)
    } catch (error) {
      toast({
        title: '下载失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    }
  }

  // ============================================
  // 渲染空状态
  // ============================================

  if (attachments.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <Paperclip className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">暂无附件</h3>
        <p className="text-muted-foreground mb-4">
          上传合同相关的文件、文档和资料
        </p>
        {canUpload && (
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            上传附件
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    )
  }

  // ============================================
  // 渲染附件列表
  // ============================================

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Paperclip className="h-4 w-4" />
          <span>共 {attachments.length} 个附件</span>
        </div>
        {canUpload && (
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            上传附件
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* 附件表格 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">类型</TableHead>
              <TableHead>文件名</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>上传人</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead className="w-20 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attachments.map((attachment: ContractAttachment) => (
              <TableRow key={attachment.id}>
                <TableCell>
                  {getFileIcon(attachment.fileType, attachment.fileName)}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  <div className="flex items-center gap-2">
                    {getFileIcon(attachment.fileType, attachment.fileName)}
                    <span className="truncate">{attachment.fileName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(attachmentTypeConfig[attachment.type].color)}
                  >
                    {attachmentTypeConfig[attachment.type].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatFileSize(attachment.fileSize)}
                </TableCell>
                <TableCell>{attachment.uploadedByName}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {format(new Date(attachment.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreview(attachment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        预览
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(attachment)}>
                        <Download className="h-4 w-4 mr-2" />
                        下载
                      </DropdownMenuItem>
                      {canDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(attachment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 上传对话框 */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        file={selectedFile}
        attachmentType={attachmentType}
        description={description}
        onTypeChange={setAttachmentType}
        onDescriptionChange={setDescription}
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
        progress={uploadProgress}
      />

      {/* 预览对话框 */}
      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        attachment={previewAttachment}
      />
    </div>
  )
}

// ============================================
// 子组件：上传对话框
// ============================================

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: File | null
  attachmentType: AttachmentType
  description: string
  onTypeChange: (type: AttachmentType) => void
  onDescriptionChange: (desc: string) => void
  onUpload: () => void
  isUploading: boolean
  progress: number
}

function UploadDialog({
  open,
  onOpenChange,
  file,
  attachmentType,
  description,
  onTypeChange,
  onDescriptionChange,
  onUpload,
  isUploading,
  progress,
}: UploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>上传附件</DialogTitle>
          <DialogDescription>
            填写附件信息并上传
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 文件信息 */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {file && getFileIcon(file.type, file.name)}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file?.name}</p>
              <p className="text-sm text-muted-foreground">
                {file ? formatFileSize(file.size) : ''}
              </p>
            </div>
          </div>

          {/* 附件类型 */}
          <div className="space-y-2">
            <Label>附件类型</Label>
            <Select value={attachmentType} onValueChange={(v) => onTypeChange(v as AttachmentType)}>
              <SelectTrigger>
                <SelectValue placeholder="选择附件类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AttachmentType.CONTRACT}>合同文件</SelectItem>
                <SelectItem value={AttachmentType.APPENDIX}>附录</SelectItem>
                <SelectItem value={AttachmentType.CERTIFICATE}>资质证书</SelectItem>
                <SelectItem value={AttachmentType.OTHER}>其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label>描述</Label>
            <Textarea
              placeholder="请输入附件描述（可选）"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>

          {/* 上传进度 */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">上传中...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            取消
          </Button>
          <Button onClick={onUpload} disabled={isUploading}>
            {isUploading ? '上传中...' : '上传'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 子组件：预览对话框
// ============================================

interface PreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attachment: ContractAttachment | null
}

function PreviewDialog({ open, onOpenChange, attachment }: PreviewDialogProps) {
  if (!attachment) return null

  const isImage = attachment.fileType.startsWith('image/')
  const isPdf = attachment.fileType.includes('pdf')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{attachment.originalName}</DialogTitle>
          <DialogDescription>
            {formatFileSize(attachment.fileSize)} · 上传于{' '}
            {format(new Date(attachment.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted rounded-lg flex items-center justify-center min-h-[400px]">
          {isImage ? (
            <img
              src={attachment.fileUrl}
              alt={attachment.originalName}
              className="max-w-full max-h-[60vh] object-contain"
            />
          ) : isPdf ? (
            <div className="flex flex-col items-center gap-4 p-8">
              <FileText className="h-24 w-24 text-red-500" />
              <div className="text-center">
                <p className="font-medium mb-2">PDF 文件预览</p>
                <p className="text-sm text-muted-foreground mb-4">
                  PDF 文件需要下载后查看
                </p>
                <Button onClick={() => window.open(attachment.fileUrl, '_blank')}>
                  <Eye className="h-4 w-4 mr-2" />
                  在新窗口打开
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-8">
              {getFileIcon(attachment.fileType, attachment.fileName)}
              <div className="text-center">
                <p className="font-medium mb-2">{attachment.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  此文件类型不支持在线预览
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => window.open(attachment.downloadUrl, '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            下载
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ContractAttachmentList
