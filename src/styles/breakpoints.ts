/**
 * 响应式断点定义
 * 与 Design Token 中的断点保持一致
 */

export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

/** 媒体查询字符串 */
export const media = {
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
  xxl: `@media (max-width: ${breakpoints.xxl}px)`,
} as const;

/** 用于 JS 判断的断点检查函数 */
export const isMobile = (width: number): boolean => width < breakpoints.md;
export const isTablet = (width: number): boolean => width >= breakpoints.md && width < breakpoints.lg;
export const isDesktop = (width: number): boolean => width >= breakpoints.lg;

/** 侧边栏相关断点 */
export const sidebar = {
  /** 自动折叠断点 */
  autoCollapseWidth: breakpoints.lg,
  /** 移动端抽屉断点 */
  mobileDrawerWidth: breakpoints.md,
  /** 展开宽度 */
  expandedWidth: 240,
  /** 折叠宽度 */
  collapsedWidth: 64,
} as const;