/**
 * CPQ Components Barrel Export
 * Configure Price Quote 模块组件导出
 */

export { ProductSelector } from './ProductSelector'
export { QuoteCalculator } from './QuoteCalculator'
export type { QuoteCalculatorRef } from './QuoteCalculator'
export { QuotePreview, QuotePrintView } from './QuotePreview'

// 自定义对象相关组件
export { FieldBuilder } from './FieldBuilder'
export { FieldRenderer } from './FieldRenderer'
export { LayoutEditor } from './LayoutEditor'
export { ObjectCard, ObjectCardGrid } from './ObjectCard'
export type { ObjectCardProps, ObjectCardGridProps } from './ObjectCard'
export { RecordTable } from './RecordTable'
export type { RecordTableProps } from './RecordTable'

// 默认导出
export { ProductSelector as default } from './ProductSelector'
