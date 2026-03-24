/**
 * Ant Design 主题配置
 * 使用 Design Token 覆盖 Ant Design 默认主题
 */
import type { ThemeConfig } from 'antd';
import { colors, typography, borderRadius, spacing, shadows, controlHeight } from './tokens';

export const antdTheme: ThemeConfig = {
  token: {
    // 颜色
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.danger,
    colorInfo: colors.info,
    
    // 文字颜色
    colorTextBase: colors.text.primary,
    colorTextSecondary: colors.text.secondary,
    colorTextTertiary: colors.text.tertiary,
    colorTextDisabled: colors.text.disabled,
    
    // 边框
    colorBorder: colors.border.default,
    colorBorderSecondary: colors.border.light,
    
    // 背景
    colorBgContainer: colors.background.paper,
    colorBgElevated: colors.background.elevated,
    colorBgLayout: colors.background.default,
    colorBgSpotlight: colors.background.hover,
    
    // 字体
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontSizeHeading1: 20,
    fontSizeHeading2: 16,
    fontSizeHeading3: 14,
    fontSizeHeading4: 13,
    fontSizeHeading5: 12,
    lineHeight: 1.57,
    lineHeightHeading1: 1.4,
    lineHeightHeading2: 1.5,
    
    // 圆角
    borderRadius: Number(borderRadius.base.replace('px', '')),
    borderRadiusLG: Number(borderRadius.lg.replace('px', '')),
    borderRadiusSM: Number(borderRadius.sm.replace('px', '')),
    borderRadiusXS: 2,
    
    // 控件高度
    controlHeight: controlHeight.base,
    controlHeightSM: controlHeight.sm,
    controlHeightLG: controlHeight.lg,
    
    // 间距
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    
    // 阴影
    boxShadow: shadows.md,
    boxShadowSecondary: shadows.lg,
    
    // 动画
    motionDurationFast: '0.15s',
    motionDurationMid: '0.3s',
    motionDurationSlow: '0.5s',
    
    // 链接
    colorLink: colors.primary,
    colorLinkHover: colors.primaryHover,
    colorLinkActive: colors.primaryActive,
  },
  
  components: {
    // 按钮配置
    Button: {
      controlHeight: 32,
      fontSize: 13,
      fontWeight: 500,
      borderRadius: 4,
      paddingInline: 16,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
      defaultBg: colors.background.paper,
      defaultBorderColor: colors.border.default,
      defaultColor: colors.text.primary,
      defaultHoverBg: colors.background.hover,
      defaultHoverBorderColor: colors.secondary,
      defaultHoverColor: colors.text.primary,
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
    },
    
    // 输入框配置
    Input: {
      controlHeight: 32,
      paddingInline: 12,
      borderRadius: 4,
      colorBorder: colors.border.default,
      colorPrimary: colors.primary,
      activeShadow: `0 0 0 2px ${colors.primarySubtle}`,
      hoverBorderColor: colors.secondary,
      colorBgContainer: colors.background.paper,
    },
    
    // 选择器配置
    Select: {
      controlHeight: 32,
      borderRadius: 4,
      optionSelectedBg: colors.primarySubtle,
    },
    
    // 表格配置
    Table: {
      headerBg: colors.background.default,
      headerColor: colors.text.secondary,
      headerSortActiveBg: '#EAECEF',
      headerSortHoverBg: '#EAECEF',
      rowHoverBg: colors.background.hover,
      borderColor: colors.border.default,
      cellPaddingBlock: 12,
      cellPaddingInline: 12,
      fontSize: 13,
      borderRadiusLG: 0,
      headerBorderRadius: 0,
    },
    
    // 卡片配置
    Card: {
      paddingLG: 20,
      borderRadiusLG: 6,
      colorBgContainer: colors.background.paper,
      colorBorderSecondary: colors.border.default,
      boxShadowTertiary: shadows.card,
    },
    
    // 菜单配置
    Menu: {
      itemHeight: 40,
      itemMarginInline: 8,
      itemBorderRadius: 4,
      itemSelectedBg: colors.primarySubtle,
      itemSelectedColor: colors.primary,
      itemHoverBg: colors.background.hover,
      itemHoverColor: colors.text.primary,
      iconSize: 16,
      iconMarginInlineEnd: 8,
      groupTitleFontSize: 11,
      groupTitleColor: colors.text.tertiary,
      colorItemText: colors.text.primary,
      colorItemTextHover: colors.text.primary,
      colorItemTextSelected: colors.primary,
    },
    
    // 标签页配置
    Tabs: {
      itemColor: colors.text.secondary,
      itemSelectedColor: colors.primary,
      itemHoverColor: colors.text.primary,
      inkBarColor: colors.primary,
      horizontalItemPadding: '12px 0',
      horizontalMargin: '0 0 0 0',
      titleFontSize: 14,
      titleFontSizeSM: 13,
    },
    
    // 标签配置
    Tag: {
      borderRadiusSM: 4,
      defaultBg: colors.background.default,
      defaultColor: colors.text.secondary,
    },
    
    // 模态框配置
    Modal: {
      borderRadiusLG: 8,
      paddingMD: 24,
      paddingContentHorizontalLG: 24,
    },
    
    // 抽屉配置
    Drawer: {
      paddingLG: 24,
    },
    
    // 弹出框配置
    Popover: {
      borderRadiusLG: 6,
    },
    
    // 工具提示配置
    Tooltip: {
      borderRadius: 4,
    },
    
    // 消息提示配置
    Message: {
      borderRadiusLG: 6,
    },
    
    // 通知配置
    Notification: {
      borderRadiusLG: 6,
    },
    
    // 分页配置
    Pagination: {
      controlHeight: 32,
      borderRadius: 4,
      itemActiveBg: colors.primary,
    },
    
    // 表单配置
    Form: {
      labelColor: colors.text.primary,
      labelFontSize: 13,
      labelHeight: 32,
      verticalLabelPadding: '0 0 8px',
    },
    
    // 日期选择器配置
    DatePicker: {
      controlHeight: 32,
      borderRadius: 4,
    },
    
    // 面包屑配置
    Breadcrumb: {
      fontSize: 13,
      itemColor: colors.text.secondary,
      lastItemColor: colors.text.primary,
      linkColor: colors.primary,
      linkHoverColor: colors.primaryHover,
    },
    
    // 头像配置
    Avatar: {
      borderRadius: 4,
    },
    
    // 描述列表配置
    Descriptions: {
      labelBg: colors.background.default,
      titleMarginBottom: 12,
    },
    
    // 徽标配置
    Badge: {
      dotSize: 8,
    },
    
    // 警告提示配置
    Alert: {
      borderRadiusLG: 6,
    },
    
    // 空状态配置
    Empty: {
      colorText: colors.text.tertiary,
      colorTextDisabled: colors.text.disabled,
    },
    
    // 步骤条配置
    Steps: {
      iconSize: 32,
      dotCurrentSize: 10,
      dotSize: 8,
    },
    
    // 进度条配置
    Progress: {
      circleTextFontSize: '1em',
    },
  },
};

export default antdTheme;