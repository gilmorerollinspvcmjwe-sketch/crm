# 线索查重和转化功能实现文档

## 📋 功能概述

本次实现了线索管理模块的两个核心功能：
1. **线索查重** - 在创建或编辑线索时自动检测重复
2. **线索转化** - 将线索转化为客户、联系人和商机

## 📁 创建的文件

### 1. 类型定义
**路径**: `src/types/lead.ts`

包含以下类型：
- `Lead` - 增强线索接口（包含 level、intentionProduct、conversionResult）
- `IntentionProduct` - 意向产品信息
- `DuplicateCheckResult` - 查重结果
- `DuplicateCheckItem` - 重复线索项
- `ConversionResult` - 转化结果
- `FieldMapping` - 字段映射配置
- `ConversionConfig` - 转化配置
- 相关请求参数和 API 响应类型

### 2. 查重 Hook
**路径**: `src/hooks/useLeadDuplicateCheck.ts`

提供功能：
- `useLeadDuplicateCheck()` - 查重 Hook
- `calculateSimilarity()` - 字符串相似度计算（Levenshtein 距离）
- `isPhoneMatch()` - 电话匹配（完全匹配）
- `isEmailMatch()` - 邮箱匹配（完全匹配）
- `isNameMatch()` - 名称匹配（模糊匹配，阈值 70%）
- `performDuplicateCheck()` - 执行查重逻辑

使用示例：
```tsx
const { checkDuplicates, result, isChecking } = useLeadDuplicateCheck()

await checkDuplicates({
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com'
})

if (result?.hasDuplicates) {
  console.log('发现重复线索:', result.duplicates)
}
```

### 3. 查重对话框组件
**路径**: `src/components/LeadDuplicateCheckModal.tsx`

功能特性：
- ✅ 自动查重（电话/邮箱/名称）
- ✅ 重复线索列表展示
- ✅ 相似度百分比显示
- ✅ 匹配类型标识（电话/邮箱/名称）
- ✅ 处理方式选择：
  - 创建新线索
  - 合并线索
  - 跳过
  - 覆盖
- ✅ 匹配统计信息
- ✅ 颜色编码的相似度提示

使用示例：
```tsx
import { LeadDuplicateCheckModal } from '@/components/LeadDuplicateCheckModal'

function LeadForm() {
  const [checkOpen, setCheckOpen] = useState(false)
  const [checkParams, setCheckParams] = useState({})
  
  const handleCheckComplete = (action, selectedLeadId) => {
    if (action === 'create_new') {
      // 创建新线索
    } else if (action === 'merge') {
      // 合并到选中的线索
    }
  }
  
  return (
    <>
      <Button onClick={() => setCheckOpen(true)}>创建线索</Button>
      
      <LeadDuplicateCheckModal
        open={checkOpen}
        onOpenChange={setCheckOpen}
        checkParams={checkParams}
        onComplete={handleCheckComplete}
      />
    </>
  )
}
```

### 4. 转化对话框组件
**路径**: `src/components/LeadConversionDialog.tsx`

功能特性：
- ✅ 选择创建内容（客户/联系人/商机）
- ✅ 字段映射预览
- ✅ 自动字段映射
- ✅ 转化结果展示
- ✅ 转化成功提示

使用示例：
```tsx
import { LeadConversionDialog } from '@/components/LeadConversionDialog'

function LeadDetail({ lead }) {
  const [convertOpen, setConvertOpen] = useState(false)
  
  const handleConvertSuccess = (result) => {
    if (result.customerId) {
      // 跳转到客户详情
    }
  }
  
  return (
    <>
      <Button onClick={() => setConvertOpen(true)}>转化线索</Button>
      
      <LeadConversionDialog
        open={convertOpen}
        onOpenChange={setConvertOpen}
        lead={lead}
        onSuccess={handleConvertSuccess}
      />
    </>
  )
}
```

### 5. Mock 数据
**路径**: `src/mocks/leads.ts`

提供：
- `mockLeads` - 示例线索数据（8 条）
- `LEAD_STATUS_CONFIG` - 状态配置
- `LEAD_SOURCE_CONFIG` - 来源配置
- `LEAD_LEVEL_CONFIG` - 级别配置
- `getLeads()` - 获取线索列表
- `getLeadById()` - 获取线索详情
- `getLeadStats()` - 获取统计信息

### 6. 类型导出
**更新**: `src/types/index.ts`

添加了线索相关类型的导出：
```typescript
export {
  Lead,
  LeadBasic,
  LeadStatus,
  LeadSource,
  LeadLevel,
  // ... 其他类型
} from "./lead"
```

## 🔍 查重逻辑

### 匹配规则
1. **电话匹配** - 完全匹配（移除所有非数字字符后比较）
2. **邮箱匹配** - 完全匹配（忽略大小写）
3. **名称匹配** - 模糊匹配（Levenshtein 距离，阈值 70%）

### 相似度计算
使用 Levenshtein 编辑距离算法：
- 100% - 完全相同
- 90%+ - 高度相似
- 70%+ - 中度相似
- 50%+ - 低度相似

### 查重流程
```
1. 用户输入线索信息
2. 调用 useLeadDuplicateCheck.checkDuplicates()
3. 系统检查电话、邮箱、名称
4. 返回重复线索列表和相似度
5. 用户选择处理方式
6. 根据选择执行相应操作
```

## 🔄 转化配置

### 字段映射

#### 线索 → 客户
| 线索字段 | 客户字段 | 说明 |
|---------|---------|------|
| company | name | 客户名称 |
| phone | phone | 联系电话 |
| email | email | 邮箱 |
| remark | description | 备注 |

#### 线索 → 联系人
| 线索字段 | 联系人字段 | 说明 |
|---------|-----------|------|
| name | name | 姓名 |
| phone | mobile | 手机号 |
| email | email | 邮箱 |
| company | company | 公司 |

#### 线索 → 商机
| 线索字段 | 商机字段 | 说明 |
|---------|---------|------|
| name | name | 商机名称 |
| company | customerName | 客户名称 |
| budget | amount | 预计金额 |
| purchaseTimeframe | expectedCloseDate | 预计关闭日期 |

### 转化流程
```
1. 用户点击"转化线索"
2. 选择创建目标（客户/联系人/商机）
3. 预览字段映射
4. 确认转化
5. 更新线索状态为"已转化"
6. 创建目标对象
7. 返回转化结果
```

## 🎨 UI 组件

使用的 shadcn/ui 组件：
- Dialog - 对话框
- Card - 卡片
- Badge - 徽章
- Button - 按钮
- Checkbox - 复选框
- RadioGroup - 单选组
- Alert - 提示框
- Separator - 分隔线
- ScrollArea - 滚动区域
- Label - 标签

## 📝 使用场景

### 场景 1：创建线索时查重
```tsx
function CreateLeadModal() {
  const [formData, setFormData] = useState({})
  const [checkOpen, setCheckOpen] = useState(false)
  
  const handleSubmit = () => {
    // 先打开查重对话框
    setCheckParams({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company,
    })
    setCheckOpen(true)
  }
  
  const handleCheckComplete = (action) => {
    if (action === 'create_new') {
      // 创建新线索
      createLead(formData)
    }
  }
}
```

### 场景 2：线索详情页转化
```tsx
function LeadDetail({ leadId }) {
  const { data: lead } = useLead(leadId)
  const [convertOpen, setConvertOpen] = useState(false)
  
  return (
    <Page>
      <LeadInfo lead={lead} />
      <Button onClick={() => setConvertOpen(true)}>
        转化线索
      </Button>
      
      <LeadConversionDialog
        open={convertOpen}
        onOpenChange={setConvertOpen}
        lead={lead}
        onSuccess={(result) => {
          // 跳转到创建的客户/商机
        }}
      />
    </Page>
  )
}
```

### 场景 3：批量导入前查重
```tsx
function ImportLeads() {
  const [leads, setLeads] = useState([])
  const { checkDuplicatesWithMock, result } = useLeadDuplicateCheck()
  
  const handleImport = async () => {
    // 对每个线索进行查重
    for (const lead of leads) {
      await checkDuplicatesWithMock({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
      })
      
      if (result?.hasDuplicates) {
        // 跳过或处理重复
      } else {
        // 创建线索
      }
    }
  }
}
```

## 🔧 技术实现细节

### 相似度算法
```typescript
function calculateSimilarity(str1: string, str2: string): number {
  // Levenshtein 距离算法
  // 返回 0-100 的相似度百分比
}
```

### 电话匹配
```typescript
function isPhoneMatch(phone1: string, phone2: string): boolean {
  // 移除所有非数字字符
  const p1 = phone1.replace(/\D/g, '')
  const p2 = phone2.replace(/\D/g, '')
  return p1 === p2 && p1.length > 0
}
```

### 邮箱匹配
```typescript
function isEmailMatch(email1: string, email2: string): boolean {
  return email1.toLowerCase().trim() === email2.toLowerCase().trim()
}
```

## 🚀 后续优化建议

1. **API 集成** - 将 mock 数据替换为真实 API 调用
2. **性能优化** - 对大量数据进行防抖处理
3. **自定义阈值** - 允许用户配置相似度阈值
4. **合并策略** - 实现更智能的字段合并逻辑
5. **历史记录** - 记录查重和转化历史
6. **批量操作** - 支持批量查重和转化

## 📊 测试建议

1. **单元测试**
   - 相似度计算函数
   - 电话/邮箱/名称匹配函数
   - 查重逻辑

2. **集成测试**
   - 查重对话框交互
   - 转化对话框流程
   - API 调用模拟

3. **E2E 测试**
   - 完整创建线索流程
   - 完整转化流程
   - 边界情况处理

## ✅ 完成清单

- [x] 创建线索类型定义 (`src/types/lead.ts`)
- [x] 创建查重 Hook (`src/hooks/useLeadDuplicateCheck.ts`)
- [x] 创建查重对话框组件 (`src/components/LeadDuplicateCheckModal.tsx`)
- [x] 创建转化对话框组件 (`src/components/LeadConversionDialog.tsx`)
- [x] 创建线索 Mock 数据 (`src/mocks/leads.ts`)
- [x] 更新类型导出 (`src/types/index.ts`)
- [x] 实现电话完全匹配
- [x] 实现邮箱完全匹配
- [x] 实现名称模糊匹配
- [x] 实现相似度计算
- [x] 实现字段映射预览
- [x] 使用 shadcn/ui 组件
- [x] 完整的 TypeScript 类型

---

**实现时间**: 2024-01-20  
**实现者**: AI Assistant  
**项目**: crm-ui-upgrade
