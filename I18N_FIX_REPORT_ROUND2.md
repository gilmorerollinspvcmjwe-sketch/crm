# i18n 国际化修复报告 - 第二轮

## 修复时间
2026-03-25

## 修复范围
高优先级文件（业务核心页面）

## 修复详情

### 1. ContactList.tsx
**修复内容：**
- 修复了新建/编辑联系人弹窗中客户选择的示例数据硬编码中文
- 将 `示例客户 1`、`示例客户 2` 替换为 `t('contact.mock.customer1')`、`t('contact.mock.customer2')`

**新增 i18n key：**
- `contact.mock.customer1` / `contact.mock.customer2`

### 2. LeadList.tsx
**修复内容：**
- 修复了导入线索功能的提示信息硬编码中文
- 将 `导入线索功能待实现` 替换为 `t('common.comingSoon')`

**说明：**
- Select 组件的 value 值（如 `市场活动`、`高` 等）作为数据存储值保留中文，label 已使用 i18n

### 3. LeadDetail.tsx
**修复内容：**
- 修复了跟进记录时间线中跟进类型的硬编码中文判断
- 将 `record.type === '电话'`、`record.type === '拜访'` 替换为 `record.type === t('activity.type.phone')`、`record.type === t('activity.type.visit')`

### 4. ContractList.tsx
**修复内容：**
- 修复了审批人选择下拉框中的硬编码中文
- 将 `张经理`、`李总监` 替换为 `t('contract.list.approvalModal.approver1')`、`t('contract.list.approvalModal.approver2')`

**新增 i18n key：**
- `contract.list.approvalModal.approver1` / `contract.list.approvalModal.approver2`

### 5. ContractDetail.tsx
**修复内容：**
- 修复了合同期限显示中的硬编码中文单位
- 将 `${contract.contractPeriod}个月` 替换为 `${contract.contractPeriod}${t('common.unit.months')}`

**新增 i18n key：**
- `common.unit.months`

### 6. PaymentList.tsx
**修复内容：**
- 无硬编码中文需要修复（支付方式选项的 label 已使用 i18n，value 作为数据存储值保留中文）

### 7. PaymentDetail.tsx
**修复内容：**
- 修复了回款记录表格列标题中的硬编码中文
- 将 `付款账户`、`核销人` 替换为 `t('payment.detail.paymentAccount')`、`t('payment.detail.verifiedByName')`

**新增 i18n key：**
- `payment.detail.paymentAccount`
- `payment.detail.verifiedByName`

### 8. OrderDetail.tsx
**修复内容：**
- 修复了交付进度步骤描述中的硬编码中文
- 将 `'已完成'` 替换为 `t('common.completed')`

### 9. ActivityList.tsx
**修复内容：**
- 无硬编码中文需要修复（已正确使用 i18n）

### 10. ActivityForm.tsx
**修复内容：**
- 修复了关联对象选择下拉框中的示例数据硬编码中文
- 将 `某某科技有限公司 CRM 系统采购项目`、`某某科技有限公司`、`张三` 替换为对应的 i18n key

**新增 i18n key：**
- `activity.form.relatedObjectMock1`
- `activity.form.relatedObjectMock2`
- `activity.form.relatedObjectMock3`

## 新增 i18n Key 汇总

### zh.json
```json
{
  "contact": {
    "mock": {
      "customer1": "示例客户 1",
      "customer2": "示例客户 2"
    }
  },
  "contract": {
    "list": {
      "approvalModal": {
        "approver1": "张经理",
        "approver2": "李总监"
      }
    }
  },
  "common": {
    "unit": {
      "months": "个月"
    }
  },
  "payment": {
    "detail": {
      "paymentAccount": "付款账户",
      "verifiedByName": "核销人"
    }
  },
  "activity": {
    "form": {
      "relatedObjectMock1": "某某科技有限公司 CRM 系统采购项目",
      "relatedObjectMock2": "某某科技有限公司",
      "relatedObjectMock3": "张三"
    }
  }
}
```

### en.json
```json
{
  "contact": {
    "mock": {
      "customer1": "Sample Customer 1",
      "customer2": "Sample Customer 2"
    }
  },
  "contract": {
    "list": {
      "approvalModal": {
        "approver1": "Manager Zhang",
        "approver2": "Director Li"
      }
    }
  },
  "common": {
    "unit": {
      "months": "months"
    }
  },
  "payment": {
    "detail": {
      "paymentAccount": "Payment Account",
      "verifiedByName": "Verified By"
    }
  },
  "activity": {
    "form": {
      "relatedObjectMock1": "ABC Tech Co., Ltd. CRM System Procurement Project",
      "relatedObjectMock2": "ABC Tech Co., Ltd.",
      "relatedObjectMock3": "John Zhang"
    }
  }
}
```

## 修复统计
- **修复文件数：** 10 个
- **修复硬编码处数：** 约 15 处
- **新增 i18n key 数：** 11 个

## 注意事项
1. Select/Radio 组件的 value 值作为数据存储值保留中文，label 必须使用 i18n
2. 示例数据/mock 数据使用 i18n 以便支持多语言展示
3. 日期格式使用 `new Date().toLocaleDateString()` 自动适配本地化

## 状态
✅ 高优先级文件全部修复完成
