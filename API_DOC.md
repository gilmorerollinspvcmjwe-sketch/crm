# CRM 系统 Phase 1 API 文档

> **版本**: 1.0.0  
> **更新日期**: 2026-03-13  
> **服务端口**: 3001  
> **基础路径**: `/api`

---

## 一、通用规范

### 1.1 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "total": 100
}
```

### 1.2 错误响应

```json
{
  "success": false,
  "message": "错误描述"
}
```

### 1.3 分页参数

列表接口统一使用以下分页参数：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| pageSize | number | 20 | 每页条数 |

---

## 二、客户管理 API

### 2.1 获取客户列表

**请求**
```
GET /api/customers
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 客户名称搜索 |
| industry | string | 否 | 行业筛选 |
| level | string | 否 | 等级筛选 (A/B/C/D) |
| status | string | 否 | 状态筛选 |
| region | string | 否 | 区域筛选 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

**响应示例**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "CUST20260312001",
        "name": "北京科技创新有限公司",
        "shortName": "北京科创",
        "industry": "互联网/软件/IT 服务",
        "level": "A",
        "status": "成交",
        "ownerId": "USER001",
        "ownerName": "李四",
        "createdAt": "2026-02-15 10:30:00"
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 20
  },
  "message": "查询成功",
  "total": 15
}
```

---

### 2.2 获取客户详情

**请求**
```
GET /api/customers/:id
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": "CUST20260312001",
    "name": "北京科技创新有限公司",
    "industry": "互联网/软件/IT 服务",
    "level": "A",
    "status": "成交",
    "contacts": [...],
    "activities": [...]
  },
  "message": "查询成功"
}
```

---

### 2.3 创建客户

**请求**
```
POST /api/customers
```

**请求体**
```json
{
  "name": "客户名称",
  "industry": "互联网/软件/IT 服务",
  "level": "A",
  "status": "潜在",
  "source": "市场活动",
  "region": "北京市/海淀区",
  "address": "详细地址",
  "phone": "010-88888888",
  "website": "https://example.com",
  "ownerId": "USER001",
  "ownerName": "李四",
  "remark": "备注"
}
```

**必填字段**: `name`

**响应示例**
```json
{
  "success": true,
  "data": {
    "id": "CUST20260313001",
    "name": "客户名称",
    "createdAt": "2026-03-13 10:00:00",
    "updatedAt": "2026-03-13 10:00:00"
  },
  "message": "客户创建成功"
}
```

---

### 2.4 更新客户

**请求**
```
PUT /api/customers/:id
```

**请求体**: 需要更新的字段

**响应示例**
```json
{
  "success": true,
  "data": { ... },
  "message": "客户更新成功"
}
```

---

### 2.5 删除客户

**请求**
```
DELETE /api/customers/:id
```

**响应示例**
```json
{
  "success": true,
  "message": "客户删除成功"
}
```

---

### 2.6 分配客户

**请求**
```
POST /api/customers/assign
```

**请求体**
```json
{
  "customerIds": ["CUST001", "CUST002"],
  "ownerId": "USER001",
  "ownerName": "李四"
}
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "updatedCount": 2
  },
  "message": "已分配 2 个客户"
}
```

---

### 2.7 转移客户

**请求**
```
POST /api/customers/transfer
```

**请求体**
```json
{
  "customerIds": ["CUST001", "CUST002"],
  "newOwnerId": "USER002",
  "newOwnerName": "张三"
}
```

---

### 2.8 导入客户

**请求**
```
POST /api/customers/import
```

**请求体**
```json
{
  "data": [
    { "name": "客户 1", "industry": "互联网", ... },
    { "name": "客户 2", "industry": "制造业", ... }
  ]
}
```

**响应示例**
```json
{
  "success": true,
  "data": {
    "successCount": 10,
    "failCount": 2
  },
  "message": "导入完成：成功 10 条，失败 2 条"
}
```

---

### 2.9 导出客户

**请求**
```
GET /api/customers/export
```

**响应**: 返回所有客户数据

---

## 三、联系人管理 API

### 3.1 获取联系人列表

**请求**
```
GET /api/contacts
```

**查询参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| name | string | 姓名搜索 |
| customerId | string | 所属客户 ID |
| position | string | 职位筛选 |
| mobile | string | 手机搜索 |
| page | number | 页码 |
| pageSize | number | 每页条数 |

---

### 3.2 获取联系人详情

**请求**
```
GET /api/contacts/:id
```

---

### 3.3 创建联系人

**请求**
```
POST /api/contacts
```

**请求体**
```json
{
  "name": "联系人姓名",
  "customerId": "CUST001",
  "customerName": "客户名称",
  "position": "职位",
  "mobile": "13800138000",
  "email": "email@example.com",
  "decisionRole": "决策者"
}
```

**必填字段**: `name`, `customerId`

---

### 3.4 更新联系人

**请求**
```
PUT /api/contacts/:id
```

---

### 3.5 删除联系人

**请求**
```
DELETE /api/contacts/:id
```

---

### 3.6 导入联系人

**请求**
```
POST /api/contacts/import
```

**请求体**
```json
{
  "data": [
    { "name": "联系人 1", "customerId": "CUST001", ... }
  ]
}
```

---

### 3.7 导出联系人

**请求**
```
GET /api/contacts/export
```

---

## 四、线索管理 API

### 4.1 获取线索列表

**请求**
```
GET /api/leads
```

**查询参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| name | string | 线索名称/联系人姓名 |
| source | string | 来源筛选 |
| status | string | 状态筛选 |
| ownerId | string | 负责人 ID |
| page | number | 页码 |
| pageSize | number | 每页条数 |

---

### 4.2 获取线索详情

**请求**
```
GET /api/leads/:id
```

---

### 4.3 创建线索

**请求**
```
POST /api/leads
```

**请求体**
```json
{
  "name": "线索名称",
  "contactName": "联系人姓名",
  "mobile": "13800138000",
  "email": "email@example.com",
  "companyName": "公司名称",
  "source": "市场活动",
  "status": "待跟进"
}
```

**必填字段**: `name`, `mobile`

---

### 4.4 更新线索

**请求**
```
PUT /api/leads/:id
```

---

### 4.5 删除线索

**请求**
```
DELETE /api/leads/:id
```

---

### 4.6 线索转化

**请求**
```
POST /api/leads/:id/convert
```

**响应**
```json
{
  "success": true,
  "data": {
    "customer": { "id": "CUST...", "name": "..." },
    "contact": { "id": "CONT...", "name": "..." },
    "lead": { "id": "LEAD...", "status": "已转化" }
  },
  "message": "线索转化成功"
}
```

**说明**: 自动创建客户和联系人，并更新线索状态

---

### 4.7 分配线索

**请求**
```
POST /api/leads/assign
```

**请求体**
```json
{
  "leadIds": ["LEAD001", "LEAD002"],
  "ownerId": "USER001",
  "ownerName": "李四"
}
```

---

### 4.8 导入线索

**请求**
```
POST /api/leads/import
```

**说明**: 自动去重（基于手机号）

---

### 4.9 导出线索

**请求**
```
GET /api/leads/export
```

---

## 五、跟进记录 API

### 5.1 获取跟进记录列表

**请求**
```
GET /api/activities
```

**查询参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| type | string | 跟进类型（电话/拜访/邮件/微信/会议） |
| relatedObjectType | string | 关联对象类型（客户/联系人/线索） |
| relatedObjectId | string | 关联对象 ID |
| dateFrom | string | 开始日期 |
| dateTo | string | 结束日期 |
| page | number | 页码 |
| pageSize | number | 每页条数 |

**响应示例**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "ACT20260312001",
        "type": "电话",
        "subject": "初次沟通需求",
        "content": "与客户沟通 CRM 系统需求...",
        "relatedObjectType": "线索",
        "relatedObjectId": "LEAD001",
        "activityTime": "2026-03-10 14:00:00",
        "duration": 30,
        "createdByName": "李四"
      }
    ],
    "total": 15
  }
}
```

---

### 5.2 获取跟进记录详情

**请求**
```
GET /api/activities/:id
```

---

### 5.3 创建跟进记录

**请求**
```
POST /api/activities
```

**请求体**
```json
{
  "type": "电话",
  "subject": "跟进主题",
  "content": "跟进内容",
  "relatedObjectType": "客户",
  "relatedObjectId": "CUST001",
  "relatedObjectName": "客户名称",
  "contactIds": ["CONT001"],
  "contactNames": ["联系人姓名"],
  "activityTime": "2026-03-13 10:00:00",
  "duration": 30,
  "method": "呼出",
  "nextFollowupTime": "2026-03-15 10:00:00",
  "nextFollowupContent": "下次跟进内容",
  "result": "有进展",
  "interestLevel": "高"
}
```

**必填字段**: `content`, `relatedObjectType`, `relatedObjectId`

---

### 5.4 更新跟进记录

**请求**
```
PUT /api/activities/:id
```

---

### 5.5 删除跟进记录

**请求**
```
DELETE /api/activities/:id
```

---

## 六、健康检查

### 6.1 服务状态

**请求**
```
GET /api/health
```

**响应**
```json
{
  "success": true,
  "data": {
    "status": "running",
    "timestamp": "2026-03-13 10:00:00",
    "version": "1.0.0"
  },
  "message": "服务运行正常"
}
```

---

## 七、数据模型

### 7.1 Customer（客户）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 客户 ID |
| name | string | 是 | 客户名称 |
| shortName | string | 否 | 客户简称 |
| industry | string | 否 | 行业 |
| companySize | string | 否 | 企业规模 |
| source | string | 否 | 来源 |
| level | string | 否 | 等级 (A/B/C/D) |
| status | string | 否 | 状态 |
| region | string | 否 | 区域 |
| address | string | 否 | 地址 |
| phone | string | 否 | 电话 |
| website | string | 否 | 官网 |
| ownerId | string | 否 | 负责人 ID |
| ownerName | string | 否 | 负责人姓名 |
| createdAt | string | 是 | 创建时间 |
| updatedAt | string | 是 | 更新时间 |

### 7.2 Contact（联系人）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 联系人 ID |
| name | string | 是 | 姓名 |
| customerId | string | 是 | 所属客户 ID |
| customerName | string | 否 | 所属客户名称 |
| position | string | 否 | 职位 |
| mobile | string | 否 | 手机 |
| email | string | 否 | 邮箱 |
| decisionRole | string | 否 | 决策角色 |

### 7.3 Lead（线索）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 线索 ID |
| name | string | 是 | 线索名称 |
| contactName | string | 否 | 联系人姓名 |
| mobile | string | 是 | 手机 |
| email | string | 否 | 邮箱 |
| companyName | string | 否 | 公司名称 |
| source | string | 否 | 来源 |
| status | string | 否 | 状态 |
| score | number | 否 | 线索评分 |
| ownerId | string | 否 | 负责人 ID |

### 7.4 Activity（跟进记录）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 跟进 ID |
| type | string | 是 | 类型 |
| subject | string | 否 | 主题 |
| content | string | 是 | 内容 |
| relatedObjectType | string | 是 | 关联对象类型 |
| relatedObjectId | string | 是 | 关联对象 ID |
| activityTime | string | 是 | 跟进时间 |
| duration | number | 否 | 时长（分钟） |
| nextFollowupTime | string | 否 | 下次跟进时间 |

---

## 八、启动说明

### 8.1 安装依赖

```bash
npm install
```

### 8.2 启动后端服务

```bash
npm run dev:server
```

### 8.3 同时启动前后端

```bash
npm run dev:all
```

### 8.4 使用 start.bat

```bash
start.bat
```

---

*文档结束*
