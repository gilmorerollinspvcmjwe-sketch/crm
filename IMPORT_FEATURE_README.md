# 客户导入功能使用说明

## 功能概述

实现了完整的客户批量导入功能，支持 Excel (.xlsx, .xls) 和 CSV 格式文件。

## 创建的文件

### 1. 类型定义 - `src/types/customer.ts`

新增了导入相关的类型定义：

- `RawCustomerRow` - 原始导入数据行
- `ValidatedCustomer` - 验证后的客户数据
- `ImportError` - 导入错误信息
- `ImportResult` - 导入结果汇总
- `FieldMapping` - 字段映射配置
- `ImportProgress` - 导入进度状态
- `ImportFileType` - 支持的文件类型

### 2. 解析工具 - `src/utils/customerImportParser.ts`

提供文件解析和数据验证功能：

- `detectFileType()` - 检测文件类型
- `parseExcelFile()` - 解析 Excel 文件
- `parseCSVFile()` - 解析 CSV 文件
- `parseFile()` - 通用文件解析
- `autoDetectFieldMapping()` - 自动识别字段映射
- `normalizeRow()` - 标准化数据行
- `validateRow()` - 验证单行数据
- `processImportData()` - 处理完整导入流程

**主要特性：**

- ✅ 支持中英文字段名自动识别
- ✅ 邮箱格式验证
- ✅ 中国大陆手机号验证（11 位）
- ✅ 必填字段检查
- ✅ 重复数据检测
- ✅ 数据格式转换（状态、等级、来源、规模等）

### 3. 导入 Hook - `src/hooks/useCustomerImport.ts`

React Hook 提供导入状态管理：

```typescript
const {
  file,
  uploadFile,
  isParsing,
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
  importResult,
  reset,
} = useCustomerImport({
  existingCustomers: [...], // 现有客户用于重复检测
})
```

### 4. 导入对话框 - `src/components/CustomerImportDialog.tsx`

完整的 UI 组件，包含 4 个步骤：

1. **上传** - 拖拽或点击上传文件
2. **映射** - 配置字段映射
3. **预览** - 查看有效/无效数据
4. **结果** - 导入结果报告

## 使用方法

### 基本用法

```tsx
import { CustomerImportDialog } from '@/components/CustomerImportDialog'

function CustomersPage() {
  const [showImport, setShowImport] = useState(false)
  const [existingCustomers, setExistingCustomers] = useState([])

  return (
    <>
      <Button onClick={() => setShowImport(true)}>
        导入客户
      </Button>

      <CustomerImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        existingCustomers={existingCustomers}
        onImportComplete={(result) => {
          console.log('导入完成:', result)
          // 刷新客户列表
        }}
      />
    </>
  )
}
```

### 进阶用法 - 使用 Hook

```tsx
import { useCustomerImport } from '@/hooks/useCustomerImport'

function CustomImportUI() {
  const {
    file,
    uploadFile,
    fieldMapping,
    updateFieldMapping,
    validCount,
    startImport,
    importProgress,
  } = useCustomerImport({
    existingCustomers: customers.map(c => ({ email: c.email, id: c.id })),
    skipDuplicateCheck: false,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={handleFileChange}
      />
      
      {file && (
        <div>
          <p>文件：{file.name}</p>
          <p>有效数据：{validCount} 条</p>
          <Button
            onClick={startImport}
            disabled={!validCount}
          >
            开始导入
          </Button>
        </div>
      )}

      {importProgress && (
        <div>
          <p>{importProgress.message}</p>
          <Progress value={importProgress.current / importProgress.total * 100} />
        </div>
      )}
    </div>
  )
}
```

## Excel/CSV 模板格式

### 必填字段

| 字段 | 说明 | 示例 |
|------|------|------|
| 客户名称 | 客户联系人姓名 | 张三 |
| 公司名称 | 客户所在公司 | 北京科技有限公司 |
| 邮箱 | 联系邮箱（需有效格式） | zhangsan@example.com |
| 手机号 | 11 位大陆手机号 | 13800138000 |

### 可选字段

| 字段 | 说明 | 有效值示例 |
|------|------|------------|
| 行业 | 客户行业 | 互联网/软件、制造业、金融/保险等 |
| 规模 | 公司规模 | small/medium/large/enterprise 或 小型/中型/大型 |
| 等级 | 客户等级 | A/B/C/D |
| 来源 | 客户来源 | marketing/referral/partner/other 或 市场/推荐/合作伙伴 |
| 官网 | 公司网址 | https://example.com |
| 地址 | 详细地址 | 北京市朝阳区 xxx |
| 描述 | 客户描述 | 任何文本 |
| 状态 | 客户状态 | 潜在/活跃/沉默/流失 |
| 分数 | 客户评分 | 0-100 的数字 |
| 负责人 | 销售负责人 | 负责人姓名 |

### 示例数据

```csv
客户名称，公司名称，邮箱，手机号，行业，规模，等级，来源，官网，地址，状态，分数
张三，北京科技有限公司，zhangsan@example.com，13800138000，互联网/软件，中型，A，推荐，https://bjtech.com，北京市朝阳区，潜在，85
李四，上海贸易公司，lisi@shtrade.com，13900139000，零售/批发，小型，B，网站，https://shtrade.com，上海市浦东新区，活跃，70
```

## 字段自动映射

系统会自动识别以下中文字段：

- **客户名称**：客户名称、客户名、姓名、名称
- **公司**：公司、公司名称、企业、单位
- **邮箱**：邮箱、电子邮件、邮件
- **电话**：电话、手机号、手机、联系方式
- **行业**：行业、所属行业
- **规模**：规模、公司规模、人数
- **等级**：等级、客户等级、级别
- **来源**：来源、客户来源
- **官网**：官网、网站、网址
- **地址**：地址、详细地址
- **描述**：描述、备注、说明
- **状态**：状态、客户状态
- **分数**：分数、得分、评分
- **负责人**：负责人、销售、跟进人

## 数据验证规则

### 必填字段检查
- 客户名称、公司名称、邮箱、手机号不能为空

### 格式验证
- **邮箱**：必须符合标准邮箱格式
- **手机号**：必须是 11 位中国大陆号码（1 开头）

### 重复检测
- 同一文件中邮箱不能重复
- 与现有客户邮箱比对（如果提供了 existingCustomers）

### 数据转换
- **状态**：自动识别中文（潜在/活跃/沉默/流失）
- **等级**：自动转换为大写（A/B/C/D）
- **来源**：支持中英文映射
- **规模**：支持中英文映射
- **分数**：转换为 0-100 的数字

## 错误处理

导入失败时，会返回详细的错误信息：

```typescript
interface ImportError {
  row: number          // Excel 行号
  errors: string[]     // 错误列表
  rawData: RawCustomerRow  // 原始数据
}
```

常见错误：
- "缺少必填字段：xxx"
- "邮箱格式不正确"
- "手机号格式不正确（应为 11 位中国大陆手机号）"
- "邮箱重复"
- "该客户已存在"

## 性能优化

- **分批处理**：数据验证和导入都采用分批处理（100 条/批）
- **进度展示**：实时显示处理进度
- **大文件支持**：支持 1000+ 条数据导入
- **异步处理**：不阻塞 UI 渲染

## 依赖

已安装 `xlsx` 库用于文件解析：

```bash
npm install xlsx
```

## 下一步

1. 在客户列表页面添加导入按钮
2. 集成到现有的客户管理工作流
3. 添加导入历史记录功能
4. 支持自定义字段映射保存
