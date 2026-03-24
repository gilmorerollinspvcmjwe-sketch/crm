/**
 * 组件统一导出
 */

// Phase 4 新增组件
export { MetricCard } from './MetricCard';
export type { MetricCardProps } from './MetricCard';

export { DataTable } from './DataTable';
export type { DataTableProps, TableDensity, ColumnConfig } from './DataTable';

export { FilterBar } from './FilterBar';
export type { FilterBarProps, FilterItem, FilterFieldType } from './FilterBar';

export { CollapseSection } from './CollapseSection';
export type { CollapseSectionProps } from './CollapseSection';

export { KanbanBoard } from './KanbanBoard';
export type { KanbanBoardProps, KanbanCard, KanbanColumn } from './KanbanBoard';

// Phase 5 组件
export {
  TableSkeleton,
  CardSkeleton,
  PageSkeleton,
  DetailSkeleton,
  DashboardSkeleton,
} from './Skeleton';
export type { TableSkeletonProps, CardSkeletonProps, PageSkeletonProps } from './Skeleton';

export {
  EmptyState,
  TableEmptyState,
  ErrorState,
} from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

// 布局组件
export { default as MainLayout } from './Layout/MainLayout';

// AI Components
export {
  CustomerSummaryAI,
  InteractionAnalysisAI,
  RelationshipChangeAI,
  SmartSuggestionsAI,
  RiskAlertAI,
  ContentGeneratorAI,
} from './AI';

// Language Switcher
export { LanguageSwitcher } from './LanguageSwitcher';