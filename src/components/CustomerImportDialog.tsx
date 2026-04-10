"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Loader2, Map as MapIcon, Eye, Play } from "lucide-react"
import { Modal } from "@/components/modal/Dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useCustomerImport } from "@/hooks/useCustomerImport"
import type { RawCustomerRow, FieldMapping } from "@/types/customer"
import type { MockCustomer } from "@/mocks/customers"

// ============================================================
// Types
// ============================================================

interface CustomerImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingCustomers?: Array<{ email: string; id: string }>
  onImportComplete?: (result: { success: number; failed: number; total: number }) => void
}

// ============================================================
// Field Labels
// ============================================================

const FIELD_LABELS: Record<keyof FieldMapping, string> = {
  name: "客户名称 *",
  company: "公司名称 *",
  email: "邮箱 *",
  phone: "手机号 *",
  industry: "行业",
  scale: "规模",
  level: "等级",
  source: "来源",
  website: "官网",
  address: "地址",
  description: "描述",
  status: "状态",
  score: "分数",
  assignee: "负责人",
}

const REQUIRED_FIELDS: (keyof FieldMapping)[] = ["name", "company", "email", "phone"]

// ============================================================
// Component
// ============================================================

export function CustomerImportDialog({
  open,
  onOpenChange,
  existingCustomers = [],
  onImportComplete,
}: CustomerImportDialogProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = React.useState<"upload" | "mapping" | "preview" | "result">("upload")
  const [dragOver, setDragOver] = React.useState(false)

  const {
    file,
    setFile,
    uploadFile,
    isParsing,
    parseError,
    rawHeaders,
    autoMapping,
    fieldMapping,
    updateFieldMapping,
    previewData,
    validCount,
    invalidCount,
    validationErrors,
    importProgress,
    canImport,
    startImport,
    isImporting,
    importError,
    importResult,
    reset,
  } = useCustomerImport({
    existingCustomers,
  })

  // Handle file selection
  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        uploadFile(selectedFile)
        setActiveTab("mapping")
      }
    },
    [uploadFile]
  )

  // Handle drag and drop
  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls") || droppedFile.name.endsWith(".csv"))) {
        uploadFile(droppedFile)
        setActiveTab("mapping")
      }
    },
    [uploadFile]
  )

  // Handle import
  const handleImport = React.useCallback(async () => {
    try {
      const result = await startImport()
      setActiveTab("result")
      onImportComplete?.({
        success: result.success,
        failed: result.failed,
        total: result.total,
      })
    } catch (error) {
      // Error is handled in hook
    }
  }, [startImport, onImportComplete])

  // Handle close
  const handleClose = React.useCallback(() => {
    reset()
    setActiveTab("upload")
    onOpenChange(false)
  }, [reset, onOpenChange])

  // Render file upload area
  const renderUploadTab = () => (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            拖拽文件到此处，或点击上传
          </p>
          <p className="text-sm text-muted-foreground">
            支持 Excel (.xlsx, .xls) 和 CSV 格式
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            建议文件不超过 10MB，单次导入不超过 1000 条
          </p>
        </label>
      </div>

      {isParsing && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>正在解析文件...</span>
        </div>
      )}

      {parseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}

      {/* Template download */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">导入模板说明</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 必填字段：客户名称、公司名称、邮箱、手机号</li>
          <li>• 邮箱格式必须正确，且不能重复</li>
          <li>• 手机号应为 11 位中国大陆号码</li>
          <li>• 第一行应为表头（字段名）</li>
        </ul>
        <Button variant="outline" size="sm" className="mt-3">
          下载模板
        </Button>
      </div>
    </div>
  )

  // Render field mapping tab
  const renderMappingTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">字段映射</h4>
          <p className="text-sm text-muted-foreground">
            将文件中的列映射到系统字段
          </p>
        </div>
        {file && (
          <Badge variant="secondary">
            <FileSpreadsheet className="h-3 w-3 mr-1" />
            {file.name}
          </Badge>
        )}
      </div>

      {autoMapping && Object.keys(autoMapping).length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            已自动识别 {Object.keys(autoMapping).length} 个字段
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {Object.entries(FIELD_LABELS).map(([field, label]) => {
            const fieldKey = field as keyof FieldMapping
            const isRequired = REQUIRED_FIELDS.includes(fieldKey)
            const currentValue = fieldMapping[fieldKey]

            return (
              <div key={field} className="grid grid-cols-2 gap-4 items-center">
                <Label className={cn(isRequired && "text-destructive")}>
                  {label}
                  {isRequired && <span className="text-destructive"> *</span>}
                </Label>
                <Select
                  value={currentValue || ""}
                  onValueChange={(value) => updateFieldMapping(fieldKey, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择列" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">不适用</SelectItem>
                    {rawHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => setActiveTab("upload")}
        >
          上一步
        </Button>
        <Button
          onClick={() => setActiveTab("preview")}
          disabled={invalidCount > 0 && validCount === 0}
        >
          <Eye className="h-4 w-4 mr-2" />
          预览数据 ({validCount} 有效，{invalidCount} 无效)
        </Button>
      </div>
    </div>
  )

  // Render preview tab
  const renderPreviewTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">数据预览</h4>
          <p className="text-sm text-muted-foreground">
            检查数据是否正确
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={validCount > 0 ? "default" : "destructive"}>
            <CheckCircle className="h-3 w-3 mr-1" />
            有效：{validCount}
          </Badge>
          <Badge variant={invalidCount > 0 ? "destructive" : "default"}>
            <XCircle className="h-3 w-3 mr-1" />
            无效：{invalidCount}
          </Badge>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            发现 {validationErrors.length} 条数据存在问题，请检查
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="valid" className="w-full">
        <TabsList>
          <TabsTrigger value="valid">
            有效数据 ({validCount})
          </TabsTrigger>
          <TabsTrigger value="invalid" disabled={invalidCount === 0}>
            问题数据 ({invalidCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="valid" className="mt-0">
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户名称</TableHead>
                  <TableHead>公司</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>手机</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData
                  .slice(0, 10)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {row.name || "-"}
                      </TableCell>
                      <TableCell>{row.company || "-"}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell>{row.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {row.status || "潜在"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {previewData.length > 10 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                仅显示前 10 条，共 {validCount} 条有效数据
              </p>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="invalid" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {validationErrors.slice(0, 10).map((error, index) => (
                <div
                  key={index}
                  className="p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">第 {error.row} 行</span>
                  </div>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {error.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {validationErrors.length > 10 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                仅显示前 10 条，共 {invalidCount} 条问题数据
              </p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => setActiveTab("mapping")}
        >
          上一步
        </Button>
        <Button
          onClick={handleImport}
          disabled={!canImport}
          size="lg"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              导入中...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              开始导入 ({validCount} 条)
            </>
          )}
        </Button>
      </div>
    </div>
  )

  // Render result tab
  const renderResultTab = () => {
    if (!importResult) return null

    const successRate = Math.round((importResult.success / importResult.total) * 100)

    return (
      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">导入完成</h3>
          <p className="text-muted-foreground">
            成功导入 {importResult.success} 条，失败 {importResult.failed} 条
          </p>
        </div>

        {/* Progress stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{importResult.total}</p>
            <p className="text-sm text-muted-foreground">总计</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
            <p className="text-sm text-muted-foreground">成功</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
            <p className="text-sm text-muted-foreground">失败</p>
          </div>
        </div>

        {/* Success rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>成功率</span>
            <span>{successRate}%</span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        {/* Error details */}
        {importResult.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">失败原因</h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {importResult.errors.slice(0, 5).map((error, index) => (
                  <div
                    key={index}
                    className="p-2 bg-destructive/10 rounded text-sm"
                  >
                    <span className="font-medium">行 {error.row}:</span>{" "}
                    {error.errors.join(", ")}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            关闭
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              reset()
              setActiveTab("upload")
            }}
            className="flex-1"
          >
            导入其他文件
          </Button>
        </div>
      </div>
    )
  }

  // Render progress overlay
  const renderProgress = () => {
    if (!importProgress || importProgress.stage === "complete") return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">{importProgress.message}</span>
        </div>
        <Progress
          value={(importProgress.current / importProgress.total) * 100}
          className="h-2"
        />
      </div>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={t("customerImport.title", "导入客户")}
      width={700}
      footer={null}
    >
      <div className="space-y-4">
        {/* Progress indicator */}
        {renderProgress()}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="upload">上传</TabsTrigger>
            <TabsTrigger value="mapping" disabled={!file}>映射</TabsTrigger>
            <TabsTrigger value="preview" disabled={!file}>预览</TabsTrigger>
            <TabsTrigger value="result" disabled={!importResult}>结果</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {activeTab === "upload" && renderUploadTab()}
            {activeTab === "mapping" && renderMappingTab()}
            {activeTab === "preview" && renderPreviewTab()}
            {activeTab === "result" && renderResultTab()}
          </div>
        </Tabs>

        {/* Import error */}
        {importError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}
      </div>
    </Modal>
  )
}

export default CustomerImportDialog
