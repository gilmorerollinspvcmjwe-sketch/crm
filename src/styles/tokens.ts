/**
 * Design Token - CRM 设计系统核心变量
 * 基于 HubSpot Canvas Design System
 */

// 颜色系统
export const colors = {
  // 主色
  primary: '#2359A2',
  primaryHover: '#1E4A8A',
  primaryActive: '#18407A',
  primarySubtle: '#EBF2FA',

  // 辅助色
  secondary: '#6B7785',
  secondaryHover: '#5A6675',

  // 状态色
  success: '#2E7D32',
  warning: '#ED6C02',
  danger: '#D32F2F',
  info: '#0288D1',

  // 中性色
  neutral: {
    50: '#F7F8FA',
    100: '#E5E8EB',
    200: '#D1D5DB',
    300: '#9CA3AF',
    400: '#6B7280',
    500: '#4B5563',
    600: '#374151',
    700: '#1F2937',
    800: '#111827',
    900: '#0A0F1A',
  },

  // 文字色
  text: {
    primary: '#212B36',
    secondary: '#637381',
    tertiary: '#919EAB',
    disabled: '#919EAB',
    inverse: '#FFFFFF',
  },

  // 背景色
  background: {
    default: '#F4F5F7',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
    hover: '#F5F6F8',
  },

  // 边框色
  border: {
    default: '#DFE3E8',
    light: '#F0F2F5',
    strong: '#D1D5DB',
  },

  // 客户等级色
  grade: {
    A: {
      fg: '#D32F2F',
      bg: '#FFEBEE',
    },
    B: {
      fg: '#ED6C02',
      bg: '#FFF3E0',
    },
    C: {
      fg: '#0288D1',
      bg: '#E1F5FE',
    },
    D: {
      fg: '#637381',
      bg: '#F5F5F5',
    },
  },
};

// 字体系统
export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
  
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    heading1: 1.4,
    heading2: 1.5,
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// 间距系统（4px 基准网格）
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

// 圆角系统
export const borderRadius = {
  sm: '4px',
  base: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};

// 阴影系统
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 2px 4px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.12)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.16)',
  card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
};

// 动画时长
export const transitions = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

// 控件高度
export const controlHeight = {
  sm: 28,
  base: 32,
  lg: 40,
};

// 断点
export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

// z-index 层级
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};