/**
 * Customer Import Parser
 * Handles Excel and CSV file parsing, field mapping, and data validation
 */

import * as XLSX from 'xlsx'
import type {
  RawCustomerRow,
  ValidatedCustomer,
  ImportError,
  ImportResult,
  FieldMapping,
  ImportFileType,
} from '@/types/customer'
import type {
  CustomerStatus,
  CustomerLevel,
  CustomerSource,
  CustomerScale,
} from '@/types/api'

// ============================================================
// Constants
// ============================================================

const VALID_STATUSES: CustomerStatus[] = ['潜在', '活跃', '沉默', '流失']
const VALID_LEVELS: CustomerLevel[] = ['A', 'B', 'C', 'D']
const VALID_SOURCES: CustomerSource[] = ['marketing', 'referral', 'partner', 'other']
const VALID_SCALES: CustomerScale[] = ['small', 'medium', 'large', 'enterprise']

const REQUIRED_FIELDS = ['name', 'company', 'email', 'phone']

// Chinese to English field mapping
const FIELD_ALIASES: Record<string, keyof FieldMapping> = {
  // 客户名称
  '客户名称': 'name',
  '客户名': 'name',
  '姓名': 'name',
  '名称': 'name',
  // 公司
  '公司': 'company',
  '公司名称': 'company',
  '企业': 'company',
  '单位': 'company',
  // 邮箱
  '邮箱': 'email',
  '电子邮件': 'email',
  '邮件': 'email',
  // 电话
  '电话': 'phone',
  '手机号': 'phone',
  '手机': 'phone',
  '联系方式': 'phone',
  // 行业
  '行业': 'industry',
  '所属行业': 'industry',
  // 规模
  '规模': 'scale',
  '公司规模': 'scale',
  '人数': 'scale',
  // 等级
  '等级': 'level',
  '客户等级': 'level',
  '级别': 'level',
  // 来源
  '来源': 'source',
  '客户来源': 'source',
  // 官网
  '官网': 'website',
  '网站': 'website',
  '网址': 'website',
  // 地址
  '地址': 'address',
  '详细地址': 'address',
  // 描述
  '描述': 'description',
  '备注': 'description',
  '说明': 'description',
  // 状态
  '状态': 'status',
  '客户状态': 'status',
  // 分数
  '分数': 'score',
  '得分': 'score',
  '评分': 'score',
  // 负责人
  '负责人': 'assignee',
  '销售': 'assignee',
  '跟进人': 'assignee',
}

// ============================================================
// File Detection
// ============================================================

/**
 * Detect file type from File object
 */
export function detectFileType(file: File): ImportFileType {
  const fileName = file.name.toLowerCase()
  if (fileName.endsWith('.csv')) {
    return 'csv'
  }
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return 'excel'
  }
  throw new Error('不支持的文件格式，请上传 Excel (.xlsx) 或 CSV 文件')
}

// ============================================================
// File Parsing
// ============================================================

/**
 * Parse Excel file to array of objects
 */
export async function parseExcelFile(file: File): Promise<RawCustomerRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('文件读取失败'))
          return
        }
        
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json<RawCustomerRow>(worksheet, {
          defval: '',
          raw: false,
        })
        
        if (jsonData.length === 0) {
          reject(new Error('文件中没有数据'))
          return
        }
        
        resolve(jsonData)
      } catch (error) {
        reject(new Error(`Excel 解析失败：${error instanceof Error ? error.message : '未知错误'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse CSV file to array of objects
 */
export async function parseCSVFile(file: File): Promise<RawCustomerRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (!text || typeof text !== 'string') {
          reject(new Error('文件读取失败'))
          return
        }
        
        const workbook = XLSX.read(text, { type: 'string' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json<RawCustomerRow>(worksheet, {
          defval: '',
          raw: false,
        })
        
        if (jsonData.length === 0) {
          reject(new Error('文件中没有数据'))
          return
        }
        
        resolve(jsonData)
      } catch (error) {
        reject(new Error(`CSV 解析失败：${error instanceof Error ? error.message : '未知错误'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Parse file based on type
 */
export async function parseFile(file: File): Promise<RawCustomerRow[]> {
  const fileType = detectFileType(file)
  if (fileType === 'excel') {
    return parseExcelFile(file)
  }
  return parseCSVFile(file)
}

// ============================================================
// Field Mapping
// ============================================================

/**
 * Auto-detect field mapping from headers
 */
export function autoDetectFieldMapping(headers: string[]): Partial<FieldMapping> {
  const mapping: Partial<FieldMapping> = {}
  
  headers.forEach((header) => {
    const trimmed = header.trim()
    const mappedField = FIELD_ALIASES[trimmed]
    
    if (mappedField && !mapping[mappedField]) {
      mapping[mappedField] = trimmed
    }
    
    // Also check English field names
    const englishField = trimmed.toLowerCase()
    if (englishField in FIELD_ALIASES && !mapping[FIELD_ALIASES[englishField]]) {
      mapping[FIELD_ALIASES[englishField]] = trimmed
    }
  })
  
  return mapping
}

/**
 * Normalize raw data using field mapping
 */
export function normalizeRow(
  row: RawCustomerRow,
  mapping: FieldMapping
): RawCustomerRow {
  const normalized: RawCustomerRow = {}
  
  Object.entries(mapping).forEach(([key, header]) => {
    if (header && row[header] !== undefined) {
      normalized[key] = row[header]
    }
  })
  
  return normalized
}

// ============================================================
// Data Validation
// ============================================================

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Chinese format)
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Validate and parse status
 */
function parseStatus(value: string | undefined): CustomerStatus | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (VALID_STATUSES.includes(trimmed as CustomerStatus)) {
    return trimmed as CustomerStatus
  }
  return undefined
}

/**
 * Validate and parse level
 */
function parseLevel(value: string | undefined): CustomerLevel | undefined {
  if (!value) return undefined
  const trimmed = value.trim().toUpperCase()
  if (VALID_LEVELS.includes(trimmed as CustomerLevel)) {
    return trimmed as CustomerLevel
  }
  return undefined
}

/**
 * Validate and parse source
 */
function parseSource(value: string | undefined): CustomerSource | undefined {
  if (!value) return undefined
  const trimmed = value.trim().toLowerCase()
  if (VALID_SOURCES.includes(trimmed as CustomerSource)) {
    return trimmed as CustomerSource
  }
  // Map Chinese sources
  const sourceMap: Record<string, CustomerSource> = {
    '市场': 'marketing',
    '营销': 'marketing',
    '推荐': 'referral',
    '转介绍': 'referral',
    '合作伙伴': 'partner',
    '渠道': 'partner',
    '其他': 'other',
    '其它': 'other',
  }
  return sourceMap[trimmed] || sourceMap[value.trim()] || undefined
}

/**
 * Validate and parse scale
 */
function parseScale(value: string | undefined): CustomerScale | undefined {
  if (!value) return undefined
  const trimmed = value.trim().toLowerCase()
  if (VALID_SCALES.includes(trimmed as CustomerScale)) {
    return trimmed as CustomerScale
  }
  // Map Chinese scales
  const scaleMap: Record<string, CustomerScale> = {
    '小': 'small',
    '小型': 'small',
    '中': 'medium',
    '中型': 'medium',
    '大': 'large',
    '大型': 'large',
    '企业': 'enterprise',
    '集团': 'enterprise',
  }
  return scaleMap[trimmed] || scaleMap[value.trim()] || undefined
}

/**
 * Parse score
 */
function parseScore(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  if (isNaN(num) || num < 0 || num > 100) return undefined
  return num
}

/**
 * Validate a single row
 */
export function validateRow(
  row: RawCustomerRow,
  rowIndex: number
): { validCustomer?: ValidatedCustomer; errors?: ImportError } {
  const errors: string[] = []
  
  // Check required fields
  REQUIRED_FIELDS.forEach((field) => {
    const value = row[field]?.toString().trim()
    if (!value) {
      errors.push(`缺少必填字段：${field}`)
    }
  })
  
  // Validate email
  if (row.email) {
    const email = row.email.toString().trim()
    if (!isValidEmail(email)) {
      errors.push('邮箱格式不正确')
    }
  }
  
  // Validate phone
  if (row.phone) {
    const phone = row.phone.toString().trim()
    if (!isValidPhone(phone)) {
      errors.push('手机号格式不正确（应为 11 位中国大陆手机号）')
    }
  }
  
  if (errors.length > 0) {
    return {
      errors: {
        row: rowIndex,
        errors,
        rawData: row,
      },
    }
  }
  
  // Build validated customer
  const validatedCustomer: ValidatedCustomer = {
    name: row.name?.toString().trim() || '',
    company: row.company?.toString().trim() || '',
    email: row.email?.toString().trim() || '',
    phone: row.phone?.toString().trim() || '',
    industry: row.industry?.toString().trim() || undefined,
    scale: parseScale(row.scale?.toString()),
    level: parseLevel(row.level?.toString()),
    source: parseSource(row.source?.toString()),
    website: row.website?.toString().trim() || undefined,
    address: row.address?.toString().trim() || undefined,
    description: row.description?.toString().trim() || undefined,
    status: parseStatus(row.status?.toString()),
    score: parseScore(row.score),
    assignee: row.assignee?.toString().trim() || undefined,
  }
  
  return { validCustomer: validatedCustomer }
}

// ============================================================
// Main Import Processing
// ============================================================

/**
 * Process imported data with validation
 */
export async function processImportData(
  file: File,
  existingCustomers?: Array<{ email: string; id: string }>
): Promise<ImportResult> {
  // Parse file
  const rawData = await parseFile(file)
  
  const validCustomers: ValidatedCustomer[] = []
  const errors: ImportError[] = []
  const duplicates: ImportResult['duplicates'] = []
  
  // Create email lookup for duplicate detection
  const emailMap = new Map<string, string>()
  existingCustomers?.forEach((customer) => {
    emailMap.set(customer.email.toLowerCase(), customer.id)
  })
  
  // Process each row
  rawData.forEach((row, index) => {
    const rowIndex = index + 2 // Excel row number (1-indexed + header)
    
    // Validate row
    const result = validateRow(row, rowIndex)
    
    if (result.errors) {
      errors.push(result.errors)
      return
    }
    
    if (result.validCustomer) {
      // Check for duplicates
      const email = result.validCustomer.email.toLowerCase()
      if (emailMap.has(email)) {
        duplicates.push({
          row: rowIndex,
          existingCustomerId: emailMap.get(email)!,
          data: row,
        })
        return
      }
      
      validCustomers.push(result.validCustomer)
    }
  })
  
  return {
    total: rawData.length,
    success: validCustomers.length,
    failed: errors.length + (duplicates?.length || 0),
    validCustomers,
    errors,
    duplicates,
  }
}

/**
 * Get headers from raw data
 */
export function getHeaders(data: RawCustomerRow[]): string[] {
  if (data.length === 0) return []
  return Object.keys(data[0])
}
