# HubSpot CRM 改造方案 — 海外客户管理 360° 全景视图 + AI 能力 + 多语言

> 版本：v1.0 | 日期：2026-03-24 | 参考：HubSpot Breeze AI + Canvas Design System

---

## 1. HubSpot 分析

### 1.1 七张截图详细分析

| 截图 | 内容描述 | 设计亮点 |
|------|---------|---------|
| img_001 | CRM 左侧导航 + 顶部栏 | 左侧 CRM 模块与营销模块分离；顶部搜索 + 通知 + 用户头像 |
| img_002 | 客户列表页 | 紧凑表格 + 独立筛选器栏 + 批量操作浮动栏 |
| img_003 | 客户 360° 全景视图 — 三栏布局 | **左侧**操作区（编辑/删除/分配）；**中间**AI 分析区（客户概览、交互、关系变化）；**右侧**关联信息（公司、交易、工单） |
| img_004 | 客户概览 AI 面板 | AI 自动生成客户摘要，关键信息一目了然 |
| img_005 | 最近交互分析 | 时间线展示 + AI 分析交互内容趋势 |
| img_006 | 关系变化检测 | AI 检测客户活跃度变化，提示风险或机会 |
| img_007 | 活动信息整合 | 中间栏整合所有活动记录（邮件、会议、聊天） |

### 1.2 HubSpot 设计亮点总结

1. **三栏布局（Record Page）**：信息分层极清晰，决策效率高
2. **AI Native 设计**：每个面板都有 AI 加持，不是附加功能而是核心组成
3. **智能筛选器**：支持保存预设、一键切换高级筛选
4. **关联数据即时可见**：右侧栏无需跳转即可查看关联公司/交易/工单
5. **活动时间线统一**：邮件、会议、聊天记录统一时间线呈现

### 1.3 现有设计差距分析

| 维度 | 现有设计 | HubSpot | 差距 |
|------|---------|---------|------|
| **布局** | Tabs 切换，信息分组折叠 | 三栏布局，左/中/右各司其职 | ❌ 缺少 AI 分析栏；右侧关联信息未独立 |
| **AI 功能** | 无 | 客户概览、交互分析、关系变化、智能建议 | ❌ 完全缺失 |
| **活动信息** | 独立 Tab（跟进记录） | 整合在中间栏时间线 | ❌ 分散在 Tab 中，查看效率低 |
| **快捷操作** | 右侧卡片（6个按钮） | 左侧栏固定操作集 | ⚠️ 有但不集中/不完整 |
| **多语言** | 无 | 完整 i18n，支持 40+ 语言 | ❌ 未规划 |
| **时区/货币** | 中国市场设计 | 海外市场原生支持 | ❌ 硬编码人民币格式 |
| **隐私合规** | 无 | GDPR/CCPA 等合规机制 | ❌ 未规划 |

---

## 2. 客户 360° 视图改造方案

### 2.1 整体布局 — 三栏结构

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ← 返回  |  [客户名称]  [等级标签] [状态标签]                    [编辑] [分配] [···]  │
├───────────┬───────────────────────────────────────────────────────────┬─────────────────┤
│           │                                                           │                 │
│  操作区   │              AI 分析 + 活动时间线                         │   关联信息      │
│  (240px)  │              (flex: 1)                                    │   (320px)       │
│           │                                                           │                 │
│  编辑     │  ┌──────────────────────────────────────────────────────┐  │  公司信息       │
│  分配     │  │  🔮 客户概览 AI                    [刷新] [展开]     │  │  ├─ 公司名     │
│  删除     │  │  "该客户是深圳市大型互联网企业，近3个月活跃度下降..." │  │  ├─ 行业       │
│  ──────   │  └──────────────────────────────────────────────────────┘  │  └─ 规模        │
│  新建商机  │                                                           │                 │
│  新建联系人│  ┌──────────────────────────────────────────────────────┐  │  交易 (3)       │
│  新建跟进  │  │  最近交互                    [筛选: 全部 ▾]         │  │  ├─ ERP系统    │
│  ──────   │  │  ──────────────────────────────────────────────────  │  │  ├─ 办公系统   │
│  加入公海  │  │  📧 3月10日 发送报价方案    zhang@tencent.com      │  │  └─ 客服系统   │
│  导出      │  │  📞 3月8日   来电咨询        138xxxx                 │  │                 │
│           │  │  📅 3月1日   方案演示        李四                     │  │  工单 (2)      │
│           │  └──────────────────────────────────────────────────────┘  │  ├─ 系统故障   │
│           │                                                           │  └─ 功能咨询   │
│           │  ┌──────────────────────────────────────────────────────┐  │                 │
│           │  │  ⚡ 关系变化                         🔴 活跃度下降   │  │  联系人 (5)    │
│           │  │  • 连续 45 天无有效互动                                 │  │  ├─ 张总 CEO  │
│           │  │  • 商机阶段停滞 30 天                                   │  │  └─ ...       │
│           │  │  💡 建议：主动发送季度回顾邮件                          │  │                 │
│           │  └──────────────────────────────────────────────────────┘  │                 │
│           │                                                           │                 │
│           │  ┌──────────────────────────────────────────────────────┐  │                 │
│           │  │  💬 智能建议                                          │  │                 │
│           │  │  1. 本周内发送跟进邮件                                 │  │                 │
│           │  │  2. 预约下周产品演示                                   │  │                 │
│           │  │  3. 邀请参加线上活动                                   │  │                 │
│           │  └──────────────────────────────────────────────────────┘  │                 │
└───────────┴───────────────────────────────────────────────────────────┴─────────────────┘
```

### 2.2 左侧栏 — 操作按钮设计

| 按钮 | 图标 | 行为 | 权限 |
|------|------|------|------|
| 编辑客户 | EditOutlined | 打开编辑抽屉 | 编辑权限 |
| 分配客户 | UserSwitchOutlined | 弹出分配 Modal | 管理员 |
| 删除客户 | DeleteOutlined | 确认弹窗后删除 | 管理员 |
| —（分隔线）— | | | |
| 新建商机 | PlusOutlined | 跳转新建商机页 | 业务员 |
| 新建联系人 | PlusOutlined | 打开联系人表单 | 业务员 |
| 新建跟进 | PlusOutlined | 打开跟进记录表单 | 业务员 |
| —（分隔线）— | | | |
| 加入公海 | CloudUploadOutlined | 确认后移动 | 管理员 |
| 导出客户 | ExportOutlined | 下载 CSV/Excel | 所有人 |

**状态设计：**
- 无权限时：按钮置灰，hover 显示"无权限"
- 操作中：按钮显示 loading spinner
- 操作后：成功 toast 提示

### 2.3 中间栏 — AI 分析 + 活动时间线

#### 2.3.1 客户概览 AI 面板（Customer Overview AI）

```
┌─────────────────────────────────────────┐
│  🔮 客户概览 AI              [刷新] [⚙️] │
├─────────────────────────────────────────┤
│                                         │
│  "深圳市腾讯科技是一家大型互联网企业，   │
│   成立于2005年，主要业务涵盖社交、游戏、   │
│   金融科技等领域。该客户为A级客户，近3个  │
│   月活跃度下降，上次联系为45天前。当前    │
│   有一个ERP商机在谈判阶段（¥80万）。      │
│   建议尽快安排季度回顾，维护客户关系。"   │
│                                         │
│  ─────────────────────────────────────  │
│  📊 关键指标：                           │
│  • 客户价值：¥500万（5年累计）            │
│  • 商机数量：3个（总计¥150万）            │
│  • 最后联系：45天前                      │
│  • 联系人：5人（核心决策人：张总）        │
└─────────────────────────────────────────┘
```

**实现方式：**
- 首次加载：调用 LLM API 生成摘要（缓存 24 小时）
- 刷新：重新调用 LLM
- 数据来源：客户基本信息 + 最新 10 条活动记录 + 关联商机/联系人

#### 2.3.2 最近交互时间线（Recent Interactions）

- **数据源**：邮件、拨打电话、会议、聊天记录、跟进备注
- **筛选器**：全部 / 邮件 / 电话 / 会议 / 聊天
- **每条记录显示**：类型图标 + 时间 + 摘要 + 负责人
- **交互式**：点击展开详情，hover 显示快速操作（回复/拨打电话）

#### 2.3.3 关系变化检测（Relationship Changes）

**AI 检测逻辑：**

| 变化类型 | 触发条件 | 展示样式 |
|---------|---------|---------|
| 🔴 活跃度下降 | 30天无互动 | 红色警告卡 |
| 🟡 阶段停滞 | 商机阶段超过45天无变化 | 黄色提示卡 |
| 🟢 机会增加 | 新增商机/合同 | 绿色正向卡 |
| 🔵 关键联系人变动 | 决策人变更/离职 | 蓝色信息卡 |

**卡片结构：**
```
┌─────────────────────────────────────────┐
│  ⚡ 关系变化                   [查看历史] │
├─────────────────────────────────────────┤
│  🔴 活跃度下降                            │
│  该客户已连续 45 天无有效互动              │
│  上次联系：2026-02-08  李四               │
│  💡 建议：发送季度回顾邮件或预约回访       │
│  [立即跟进] [稍后提醒]                    │
│                                         │
│  🟡 商机停滞                              │
│  "企业ERP系统" 商机关闭阶段已 32 天       │
│  💡 建议：了解客户当前预算情况             │
└─────────────────────────────────────────┘
```

#### 2.3.4 智能建议（Smart Recommendations）

**建议类型：**

| 类型 | 内容 | 优先级 |
|------|------|--------|
| 跟进提醒 | "该客户已 45 天未跟进，建议本周内联系" | P0 |
| 商机机会 | "客户最近有采购计划，建议推进 ERP 商机" | P1 |
| 内容推荐 | "根据客户行业，推送相关案例研究" | P2 |
| 异常预警 | "客户活跃度连续下降，可能存在流失风险" | P0 |

**交互：**
- 每条建议可执行（点击跳转对应操作）
- 可一键生成跟进话术（调用 AI 内容生成）

### 2.4 右侧栏 — 关联信息

| 模块 | 内容 | 展示方式 |
|------|------|---------|
| 公司信息 | 公司名称、行业、规模、区域 | 卡片 |
| 交易 (3) | 商机名称、金额、阶段、概率 | 可折叠列表 |
| 工单 (2) | 工单标题、状态、创建时间 | 可折叠列表 |
| 联系人 (5) | 姓名、职位、手机、邮箱 | 可折叠列表 |

**交互：**
- 点击关联项 → 右侧抽屉预览（不跳转页面）
- hover 显示快速操作（编辑/拨打电话/发邮件）

---

## 3. AI 功能详细设计

### 3.1 客户概览 AI（Customer Overview AI）

**目标：** 5 秒内让销售人员了解任意客户的关键信息

**Prompt 设计：**
```
你是一个专业的 CRM 客户分析师。请根据以下客户数据，生成一段 150-200 字的中文客户概览：

客户基本信息：
- 公司名称：{name}
- 所属行业：{industry}
- 客户等级：{level}
- 企业规模：{companySize}
- 最近联系：{lastContactDate}
- 负责人：{ownerName}

最近活动记录：
{activities.map(a => `- ${a.date} ${a.type}: ${a.summary}`).join('\n')}

关联商机：
{opportunities.map(o => `- ${o.name} (¥${o.amount}万) 阶段: ${o.stage}`).join('\n')}

请在概览中包含：
1. 公司一句话定位
2. 客户价值和重要性
3. 当前跟进状态
4. 关键风险或机会
5. 行动建议

语言风格：专业、简洁、数据驱动
```

**技术实现：**
- 前端：调用 `/api/ai/customer-summary` 接口
- 后端：调用 LLM API，缓存结果 24 小时
- 防抖：用户滚动页面时暂停刷新请求

### 3.2 交互分析 AI（Interaction Analysis）

**目标：** 分析客户沟通记录，提取关键信息

**功能点：**

| 功能 | 描述 | 技术方案 |
|------|------|---------|
| 邮件主题提取 | 从邮件中提取关键讨论话题 | NLP 关键词提取 |
| 情感分析 | 判断客户对产品的态度 | LLM 情感分类 |
| 需求挖掘 | 从沟通记录中发现客户需求 | LLM 信息抽取 |
| 承诺追踪 | 记录客户承诺（如预算、决策时间） | 正则 + LLM |

**API 设计：**
```
POST /api/ai/analyze-interactions
Body: {
  customerId: string,
  interactionIds: string[],  // 可选，分析指定记录
  analysisType: 'summary' | 'sentiment' | 'needs' | 'commitments'
}
Response: {
  summary: string,
  sentiment: 'positive' | 'neutral' | 'negative',
  needs: string[],
  commitments: { content: string, dueDate?: string }[]
}
```

### 3.3 关系变化检测（Relationship Change Detection）

**检测算法：**

```typescript
interface RelationshipSignal {
  type: 'active_decline' | 'stage_stall' | 'opportunity_up' | 'contact_change';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
  detectedAt: Date;
}

// 检测活跃度下降
function detectActiveDecline(customer: Customer, activities: Activity[]): RelationshipSignal | null {
  const lastActivity = activities[0];
  const daysSinceLastActivity = differenceInDays(new Date(), new Date(lastActivity.date));
  
  if (daysSinceLastActivity > 30) {
    return {
      type: 'active_decline',
      severity: daysSinceLastActivity > 60 ? 'critical' : 'warning',
      message: `该客户已连续 ${daysSinceLastActivity} 天无有效互动`,
      suggestion: `建议 ${daysSinceLastActivity > 45 ? '立即' : '本周内'} 发送季度回顾邮件`,
    };
  }
  return null;
}

// 检测商机阶段停滞
function detectStageStall(opportunity: Opportunity): RelationshipSignal | null {
  const daysInStage = differenceInDays(new Date(), new Date(opportunity.stageChangedAt));
  
  if (daysInStage > 45) {
    return {
      type: 'stage_stall',
      severity: daysInStage > 60 ? 'critical' : 'warning',
      message: `"${opportunity.name}" 商机会在"${opportunity.stage}"阶段已停留 ${daysInStage} 天`,
      suggestion: '建议联系客户了解当前状态和预算情况',
    };
  }
  return null;
}
```

### 3.4 智能建议系统（Smart Recommendations Engine）

**建议生成逻辑：**

```typescript
interface Recommendation {
  id: string;
  type: 'follow_up' | 'opportunity' | 'content' | 'risk_alert';
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  description: string;
  actionLabel: string;
  actionTarget: string;  // 跳转路径或操作类型
  generatedAt: Date;
}

// 建议生成服务
async function generateRecommendations(customerId: string): Promise<Recommendation[]> {
  const signals = await detectRelationshipSignals(customerId);
  const recommendations: Recommendation[] = [];
  
  for (const signal of signals) {
    if (signal.type === 'active_decline' && signal.severity === 'critical') {
      recommendations.push({
        id: uuid(),
        type: 'risk_alert',
        priority: 'P0',
        title: '客户可能流失',
        description: signal.message,
        actionLabel: '立即跟进',
        actionTarget: `/customer/${customerId}/followup?urgent=true`,
        generatedAt: new Date(),
      });
    }
  }
  
  return recommendations.sort((a, b) => {
    const order = { P0: 0, P1: 1, P2: 2 };
    return order[a.priority] - order[b.priority];
  });
}
```

### 3.5 风险预警（Risk Alerting）

**预警场景：**

| 场景 | 触发条件 | 预警级别 | 通知方式 |
|------|---------|---------|---------|
| 客户流失风险 | 60天无互动 + 无活跃商机 | 🔴 严重 | 弹窗 + 邮件 |
| 商机失败风险 | 商机停滞45天 + 客户无响应 | 🟡 中等 | 应用内通知 |
| 合同到期预警 | 合同到期前30天 | 🟡 中等 | 应用内通知 |
| 决策人离职 | 关键联系人标记为"已离职" | 🔴 严重 | 弹窗 + 邮件 |
| 商机金额下降 | 客户关联商机总金额环比下降50% | 🟡 中等 | 应用内通知 |

### 3.6 内容生成（AI Content Generation）

**应用场景：**

| 场景 | 功能 | Prompt 示例 |
|------|------|------------|
| 邮件生成 | 根据模板 + 客户信息生成个性化邮件 | "为客户 {name} 生成一封季度回顾邮件，突出 {keyPoints}" |
| 跟进话术 | 根据客户历史生成下次跟进建议话术 | "基于与 {name} 的历史沟通，生成下次电话跟进要点" |
| 会议摘要 | 自动生成会议记录摘要 | "总结以下会议记录的关键结论和待办事项" |
| 回复建议 | 智能推荐客户邮件的回复内容 | "根据客户邮件内容，推荐3种不同风格的回复" |

**技术实现：**
- 统一接口：`POST /api/ai/generate-content`
- 流式输出：支持打字机效果（streaming）
- 模板管理：支持预设模板 + 自定义模板

---

## 4. 多语言方案

### 4.1 i18n 架构设计

**技术选型：react-i18next + i18next**

```
src/
├── locales/
│   ├── en/
│   │   ├── common.json      # 通用文案
│   │   ├── customer.json    # 客户模块
│   │   ├── opportunity.json # 商机模块
│   │   └── ai.json          # AI 功能
│   ├── zh/
│   │   ├── common.json
│   │   ├── customer.json
│   │   ├── opportunity.json
│   │   └── ai.json
│   └── i18n.ts              # i18next 配置
```

### 4.2 翻译文案结构规范

```json
{
  "customer": {
    "list": {
      "title": "客户列表",
      "columns": {
        "name": "客户名称",
        "industry": "行业",
        "level": "等级",
        "status": "状态"
      },
      "actions": {
        "create": "新建客户",
        "edit": "编辑",
        "delete": "删除",
        "assign": "分配"
      }
    },
    "detail": {
      "title": "客户详情",
      "tabs": {
        "overview": "概览",
        "contacts": "联系人",
        "opportunities": "商机"
      }
    }
  },
  "ai": {
    "overview": {
      "title": "客户概览 AI",
      "refreshing": "正在生成摘要...",
      "error": "生成失败，请重试"
    },
    "suggestions": {
      "title": "智能建议",
      "priority": {
        "P0": "紧急",
        "P1": "重要",
        "P2": "一般"
      }
    }
  }
}
```

### 4.3 多语言切换组件

```tsx
// LanguageSwitcher 组件
export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <Dropdown menu={{
      items: languages.map(lang => ({
        key: lang.code,
        label: (
          <Space>
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </Space>
        ),
        onClick: () => i18n.changeLanguage(lang.code),
      }))
    }}>
      <Button type="text">
        <Space>
          <GlobalOutlined />
          <span>{languages.find(l => l.code === i18n.language)?.label}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};
```

### 4.4 日期/货币/语言格式化

**工具库：Intl API + dayjs**

```typescript
// src/utils/format.ts
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';

// 日期格式化
export const formatDate = (date: string | Date, locale: string = 'en'): string => {
  return dayjs(date).locale(locale).format('MMM D, YYYY');
};

// 时间格式化
export const formatDateTime = (date: string | Date, locale: string = 'en'): string => {
  return dayjs(date).locale(locale).format('MMM D, YYYY h:mm A');
};

// 货币格式化
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// 数字格式化
export const formatNumber = (num: number, locale: string = 'en'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

// 时区处理
export const formatWithTimezone = (date: string | Date, timezone: string): string => {
  return dayjs(date).tz(timezone).format('MMM D, YYYY h:mm A z');
};
```

### 4.5 多语言支持的功能点清单

| 功能点 | 实现方案 | 优先级 |
|--------|---------|--------|
| 所有页面文案 | i18next 翻译文件 | P0 |
| 按钮/标签/提示语 | useTranslation Hook | P0 |
| 日期格式 | 跟随 locale 自动切换 | P0 |
| 数字格式 | Intl.NumberFormat | P0 |
| 货币格式 | Intl.NumberFormat | P0 |
| 错误提示文案 | i18next | P0 |
| AI 生成内容语言 | 根据用户 locale 生成 | P0 |
| 邮件模板多语言 | 翻译文件 + locale 参数 | P1 |
| PDF/Excel 导出 | 跟随 locale | P1 |
| 语音/时区 | 用户设置时区 | P1 |

---

## 5. 海外 CRM 特殊需求

### 5.1 时区支持

- **存储**：所有日期时间以 UTC 存储
- **显示**：转换为用户当前时区（从浏览器获取或用户设置）
- **时区选择器**：支持用户手动设置偏好时区

### 5.2 隐私合规（GDPR/CCPA）

| 合规要求 | 实现方案 |
|---------|---------|
| 数据删除权 | 客户删除时，保留匿名化数据（用于统计分析） |
| 数据导出权 | 提供"导出我的数据"功能（JSON/CSV） |
| 隐私政策 | 用户注册时展示隐私政策弹窗 |
| Cookie 同意 | 首次访问显示 Cookie 同意横幅 |
| 数据保留期 | 自动清理 3 年以上的无效客户数据 |

### 5.3 国际化为英文优先

- 所有翻译文件以英文为基准语言（`locales/en/`）
- 中文作为追加语言包（`locales/zh/`）
- 新功能开发必须同时提交中英文翻译

---

## 6. 实施计划

### Phase 1：360° 视图改造（第 1-2 周）

| 任务 | 负责人 | 验收标准 |
|------|--------|---------|
| 重构 CustomerDetail 为三栏布局 | 前端 | 布局符合设计稿 |
| 实现左侧操作栏组件 | 前端 | 操作按钮功能完整 |
| 实现右侧关联信息组件 | 前端 | 支持公司/商机/工单/联系人 |
| 重构活动时间线组件 | 前端 | 支持筛选/展开 |
| 后端：客户详情接口扩展 | 后端 | 返回关联数据 |

### Phase 2：AI 功能开发（第 3-5 周）

| 任务 | 负责人 | 验收标准 |
|------|--------|---------|
| AI 客户概览生成服务 | 后端 + AI | 摘要准确率 > 85% |
| AI 概览面板前端集成 | 前端 | 加载 < 3s，有加载态 |
| 关系变化检测服务 | 后端 | 检测准确率 > 80% |
| 关系变化卡片组件 | 前端 | 分类展示、优先级排序 |
| 智能建议服务 | 后端 + AI | 建议相关性 > 70% |
| 智能建议面板组件 | 前端 | 建议可执行、可忽略 |
| 风险预警通知系统 | 前端 + 后端 | 预警准时送达 |

### Phase 3：多语言支持（第 4-6 周）

| 任务 | 负责人 | 验收标准 |
|------|--------|---------|
| i18next 基础设施搭建 | 前端 | 切换无白屏 |
| 英文翻译文件生成 | PM + 翻译 | 覆盖 100% 文案 |
| 中文翻译文件生成 | PM + 翻译 | 覆盖 100% 文案 |
| 多语言切换组件 | 前端 | 下拉选择 + 持久化 |
| 日期/货币格式化工具 | 前端 | 跟随 locale |
| AI 生成内容多语言 | AI | 生成内容语言匹配 |

### Phase 4：细节打磨（第 7-8 周）

| 任务 | 负责人 | 验收标准 |
|------|--------|---------|
| 快捷键支持（J/K 上下选择） | 前端 | 键盘导航流畅 |
| 性能优化（AI 面板懒加载） | 前端 | 首屏 < 1.5s |
| 响应式适配（平板/手机） | 前端 | 三栏 → 单栏 |
| GDPR 合规检查 | 全员 | 无合规漏洞 |
| 灰度发布 + 监控 | DevOps | 线上稳定 |

---

## 7. 技术架构总览

```
┌─────────────────────────────────────────────────────────────────┐
│                         前端（React）                          │
├──────────────┬──────────────┬───────────────┬──────────────────┤
│  MainLayout  │ Customer360  │  AI Panels    │ LanguageSwitcher │
│  (三栏布局)  │  (详情页)    │  (AI 功能)    │  (多语言)        │
├──────────────┴──────────────┴───────────────┴──────────────────┤
│                      i18next (多语言)                           │
├─────────────────────────────────────────────────────────────────┤
│                      AI Service Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Summary  │ │ Sentiment│ │ Suggest  │ │ Risk     │           │
│  │ Generator │ │ Analyzer │ │ Engine   │ │ Detector │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       └────────────┴────────────┴────────────┘                  │
│                         LLM API (OpenAI / Claude)               │
├─────────────────────────────────────────────────────────────────┤
│                    Backend API (Node.js)                        │
│  /api/customer/:id  /api/ai/*  /api/contacts  /api/opportunities│
└─────────────────────────────────────────────────────────────────┘
```

---

*文档由 AI 产品设计助手生成，基于 HubSpot Breeze AI + Canvas Design System*
