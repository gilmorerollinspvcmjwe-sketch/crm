/**
 * Customer Import Hook
 * Handles file upload, parsing, validation, and batch import
 */

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { File as FileType } from 'buffer'
import {
  processImportData,
  parseFile,
  autoDetectFieldMapping,
  normalizeRow,
  getHeaders,
} from '@/utils/customerImportParser'
import type {
  RawCustomerRow,
  ValidatedCustomer,
  ImportResult,
  ImportProgress,
  FieldMapping,
  ImportError,
} from '@/types/customer'
import type { MockCustomer } from '@/mocks/customers'
import { useImportCustomers } from '@/hooks/useCustomers'

// ============================================================
// Types
// ============================================================

interface UseCustomerImportOptions {
  /**
   * Existing customers for duplicate detection
   */
  existingCustomers?: Array<{ email: string; id: string }>
  /**
   * Custom field mapping
   */
  customMapping?: Partial<FieldMapping>
  /**
   * Skip duplicate check
   */
  skipDuplicateCheck?: boolean
}

interface UseCustomerImportReturn {
  // File handling
  file: File | null
  setFile: (file: File | null) => void
  uploadFile: (file: File) => Promise<void>
  
  // Parsing state
  isParsing: boolean
  parseError: string | null
  rawHeaders: string[]
  autoMapping: Partial<FieldMapping>
  
  // Field mapping
  fieldMapping: FieldMapping
  updateFieldMapping: (field: keyof FieldMapping, header: string) => void
  
  // Preview data
  previewData: RawCustomerRow[]
  validCount: number
  invalidCount: number
  
  // Validation
  validationErrors: ImportError[]
  
  // Import progress
  importProgress: ImportProgress | null
  
  // Import execution
  canImport: boolean
  startImport: () => Promise<ImportResult>
  isImporting: boolean
  importError: string | null
  importResult: ImportResult | null
  
  // Reset
  reset: () => void
}

// ============================================================
// Hook Implementation
// ============================================================

export function useCustomerImport(
  options: UseCustomerImportOptions = {}
): UseCustomerImportReturn {
  const {
    existingCustomers = [],
    customMapping = {},
    skipDuplicateCheck = false,
  } = options

  // File state
  const [file, setFileState] = useState<File | null>(null)
  const [rawData, setRawData] = useState<RawCustomerRow[]>([])
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  
  // Parsing state
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  
  // Field mapping
  const [autoMapping, setAutoMapping] = useState<Partial<FieldMapping>>({})
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: '',
    scale: '',
    level: '',
    source: '',
    website: '',
    address: '',
    description: '',
    status: '',
    score: '',
    assignee: '',
  })
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ImportError[]>([])
  const [validatedCustomers, setValidatedCustomers] = useState<ValidatedCustomer[]>([])
  
  // Import state
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  
  // Import mutation
  const importMutation = useImportCustomers()

  /**
   * Upload and parse file
   */
  const uploadFile = useCallback(async (uploadedFile: File) => {
    setIsParsing(true)
    setParseError(null)
    setImportResult(null)
    setImportError(null)
    setValidationErrors([])
    setValidatedCustomers([])
    setImportProgress(null)
    
    try {
      // Parse file
      const data = await parseFile(uploadedFile)
      setRawData(data)
      setFileState(uploadedFile)
      
      // Extract headers
      const headers = getHeaders(data)
      setRawHeaders(headers)
      
      // Auto-detect field mapping
      const detected = autoDetectFieldMapping(headers)
      setAutoMapping(detected)
      
      // Apply auto-mapping and custom mapping
      const mergedMapping = {
        ...fieldMapping,
        ...detected,
        ...customMapping,
      } as FieldMapping
      
      setFieldMapping(mergedMapping)
      
      // Validate data
      await validateData(data, mergedMapping)
      
    } catch (error) {
      const message = error instanceof Error ? error.message : '解析失败'
      setParseError(message)
      setFileState(null)
    } finally {
      setIsParsing(false)
    }
  }, [customMapping])

  /**
   * Validate parsed data
   */
  const validateData = useCallback(async (
    data: RawCustomerRow[],
    mapping: FieldMapping
  ) => {
    setImportProgress({
      stage: 'validating',
      current: 0,
      total: data.length,
      message: '正在验证数据...',
    })
    
    const errors: ImportError[] = []
    const valid: ValidatedCustomer[] = []
    const emailSet = new Map<string, number>()
    
    // Build email lookup for existing customers
    const existingEmailMap = new Map<string, string>()
    existingCustomers.forEach((customer) => {
      existingEmailMap.set(customer.email.toLowerCase(), customer.id)
    })
    
    // Process in chunks to avoid blocking
    const CHUNK_SIZE = 100
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE)
      
      chunk.forEach((row, chunkIndex) => {
        const rowIndex = i + chunkIndex + 2 // Excel row number
        
        // Normalize row using mapping
        const normalized = normalizeRow(row, mapping)
        
        // Validate required fields
        const rowErrors: string[] = []
        const requiredFields: (keyof FieldMapping)[] = ['name', 'company', 'email', 'phone']
        
        requiredFields.forEach((field) => {
          const value = normalized[field]?.toString().trim()
          if (!value) {
            rowErrors.push(`缺少必填字段：${field}`)
          }
        })
        
        // Validate email format
        if (normalized.email) {
          const email = normalized.email.toString().trim()
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
            rowErrors.push('邮箱格式不正确')
          }
          
          // Check for duplicates in file
          const emailLower = email.toLowerCase()
          if (emailSet.has(emailLower)) {
            rowErrors.push('邮箱重复')
          } else {
            emailSet.set(emailLower, rowIndex)
          }
          
          // Check against existing customers
          if (!skipDuplicateCheck && existingEmailMap.has(emailLower)) {
            rowErrors.push('该客户已存在')
          }
        }
        
        // Validate phone format
        if (normalized.phone) {
          const phone = normalized.phone.toString().trim()
          const phoneRegex = /^1[3-9]\d{9}$/
          if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            rowErrors.push('手机号格式不正确')
          }
        }
        
        if (rowErrors.length > 0) {
          errors.push({
            row: rowIndex,
            errors: rowErrors,
            rawData: row,
          })
        } else {
          // Build validated customer
          valid.push({
            name: normalized.name?.toString().trim() || '',
            company: normalized.company?.toString().trim() || '',
            email: normalized.email?.toString().trim() || '',
            phone: normalized.phone?.toString().trim() || '',
            industry: normalized.industry?.toString().trim(),
            scale: normalized.scale as any,
            level: normalized.level as any,
            source: normalized.source as any,
            website: normalized.website?.toString().trim(),
            address: normalized.address?.toString().trim(),
            description: normalized.description?.toString().trim(),
            status: normalized.status as any,
            score: typeof normalized.score === 'string' 
              ? parseInt(normalized.score, 10) 
              : normalized.score,
            assignee: normalized.assignee?.toString().trim(),
          })
        }
      })
      
      // Update progress
      setImportProgress({
        stage: 'validating',
        current: Math.min(i + CHUNK_SIZE, data.length),
        total: data.length,
        message: `已验证 ${Math.min(i + CHUNK_SIZE, data.length)} / ${data.length} 条`,
      })
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    setValidationErrors(errors)
    setValidatedCustomers(valid)
    setImportProgress(null)
  }, [existingCustomers, skipDuplicateCheck])

  /**
   * Update field mapping
   */
  const updateFieldMapping = useCallback((field: keyof FieldMapping, header: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [field]: header,
    }))
    
    // Re-validate with new mapping
    if (rawData.length > 0) {
      const newMapping = { ...fieldMapping, [field]: header }
      validateData(rawData, newMapping)
    }
  }, [rawData, fieldMapping, validateData])

  /**
   * Start import process
   */
  const startImport = useCallback(async (): Promise<ImportResult> => {
    if (validatedCustomers.length === 0) {
      throw new Error('没有可导入的有效数据')
    }
    
    setImportError(null)
    setImportProgress({
      stage: 'importing',
      current: 0,
      total: validatedCustomers.length,
      message: '正在导入...',
    })
    
    try {
      // Import in batches
      const BATCH_SIZE = 50
      const importedCustomers: MockCustomer[] = []
      
      for (let i = 0; i < validatedCustomers.length; i += BATCH_SIZE) {
        const batch = validatedCustomers.slice(i, i + BATCH_SIZE)
        
        // Convert to MockCustomer format
        const batchToImport = batch.map((customer) => ({
          ...customer,
          type: '企业' as const,
          industry: customer.industry as any || '其他',
          scale: customer.scale as any || '微型 (1-20 人)',
          source: customer.source as any || '其他',
          status: customer.status || '潜在',
        }))
        
        const result = await importMutation.mutateAsync(batchToImport)
        importedCustomers.push(...result)
        
        // Update progress
        setImportProgress({
          stage: 'importing',
          current: Math.min(i + BATCH_SIZE, validatedCustomers.length),
          total: validatedCustomers.length,
          message: `已导入 ${Math.min(i + BATCH_SIZE, validatedCustomers.length)} / ${validatedCustomers.length} 条`,
        })
        
        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      
      const result: ImportResult = {
        total: rawData.length,
        success: importedCustomers.length,
        failed: validationErrors.length,
        validCustomers: validatedCustomers,
        errors: validationErrors,
      }
      
      setImportResult(result)
      setImportProgress({
        stage: 'complete',
        current: importedCustomers.length,
        total: validatedCustomers.length,
        message: '导入完成',
      })
      
      return result
      
    } catch (error) {
      const message = error instanceof Error ? error.message : '导入失败'
      setImportError(message)
      setImportProgress({
        stage: 'error',
        current: 0,
        total: validatedCustomers.length,
        message: message,
      })
      throw error
    }
  }, [validatedCustomers, rawData.length, validationErrors, importMutation])

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setFileState(null)
    setRawData([])
    setRawHeaders([])
    setParseError(null)
    setAutoMapping({})
    setFieldMapping({
      name: '',
      company: '',
      email: '',
      phone: '',
      industry: '',
      scale: '',
      level: '',
      source: '',
      website: '',
      address: '',
      description: '',
      status: '',
      score: '',
      assignee: '',
    })
    setValidationErrors([])
    setValidatedCustomers([])
    setImportProgress(null)
    setImportResult(null)
    setImportError(null)
  }, [])

  // Calculate counts
  const validCount = validatedCustomers.length
  const invalidCount = validationErrors.length
  const canImport = validCount > 0 && !isParsing && !importProgress

  return {
    // File handling
    file,
    setFile: setFileState,
    uploadFile,
    
    // Parsing state
    isParsing,
    parseError,
    rawHeaders,
    autoMapping,
    
    // Field mapping
    fieldMapping,
    updateFieldMapping,
    
    // Preview data
    previewData: rawData,
    validCount,
    invalidCount,
    
    // Validation
    validationErrors,
    
    // Import progress
    importProgress,
    
    // Import execution
    canImport,
    startImport,
    isImporting: importProgress?.stage === 'importing',
    importError,
    importResult,
    
    // Reset
    reset,
  }
}

export default useCustomerImport
