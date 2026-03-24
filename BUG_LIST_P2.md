# CRM 项目 Bug 清单（第二轮 P2）

**测试版本**: Phase 1-4 全量测试  
**发现日期**: 2026-03-13  
**测试人员**: AI Assistant  
**测试环境**: Windows 11 / Chrome 120 / Node.js v20  

---

## Bug 汇总

| Bug ID | 模块 | 标题 | 级别 | 状态 | 发现日期 |
|--------|------|------|------|------|----------|
| BUG-001 | AI 功能 | 智能线索分配页面无法加载 - 模块导入错误 | P1 | Open | 2026-03-13 |
| BUG-002 | AI 功能 | 线索评分 AI 页面无法加载 - 模块导入错误 | P1 | Open | 2026-03-13 |
| BUG-003 | AI 功能 | 多个 AI 功能页面共享相同的导入路径问题 | P1 | Open | 2026-03-13 |

---

## Bug 详情

### BUG-001: 智能线索分配页面无法加载

| 字段 | 内容 |
|------|------|
| **Bug ID** | BUG-001 |
| **模块** | AI 功能 - 智能线索分配 |
| **标题** | 智能线索分配页面无法加载 - 模块导入错误 |
| **级别** | P1 - 严重 |
| **状态** | Open |
| **发现日期** | 2026-03-13 |
| **发现人** | AI Assistant |
| **测试环境** | Chrome 120 / Windows 11 / Node.js v20 |

**复现步骤**:
1. 登录系统
2. 点击左侧菜单 "AI 功能"
3. 点击 "智能线索分配" 或直接访问 `/ai/lead-assignment`

**预期结果**:
- 页面正常加载，显示待分配线索列表和 AI 推荐分配结果

**实际结果**:
- 页面显示错误："Failed to fetch dynamically imported module"
- 控制台错误：`Failed to resolve import "../../mock/aiData" from "src/pages/LeadAssignment.tsx"`

**错误详情**:
```
TypeError: Failed to fetch dynamically imported module: http://localhost:3000/src/pages/LeadAssignment.tsx
[plugin:vite:import-analysis] Failed to resolve import "../../mock/aiData" from "src/pages/LeadAssignment.tsx". Does the file exist?
```

**影响**:
- 用户无法使用智能线索分配功能
- Phase 4 AI 功能核心功能不可用

**建议修复**:
1. 检查 `src/mock/aiData.ts` 文件是否正确导出 `leadsToAssign` 和 `salesTeam`
2. 检查导入路径是否正确（相对于 `src/pages/LeadAssignment.tsx`，`../../mock/aiData` 应该指向 `src/mock/aiData.ts`）
3. 清除 Vite 缓存并重启开发服务器

---

### BUG-002: 线索评分 AI 页面无法加载

| 字段 | 内容 |
|------|------|
| **Bug ID** | BUG-002 |
| **模块** | AI 功能 - 线索评分 |
| **标题** | 线索评分 AI 页面无法加载 - 模块导入错误 |
| **级别** | P1 - 严重 |
| **状态** | Open |
| **发现日期** | 2026-03-13 |
| **发现人** | AI Assistant |
| **测试环境** | Chrome 120 / Windows 11 / Node.js v20 |

**复现步骤**:
1. 登录系统
2. 访问 `/ai/lead-scoring`

**预期结果**:
- 页面正常加载，显示线索评分列表和评分详情

**实际结果**:
- 页面显示错误："Failed to fetch dynamically imported module"
- 控制台错误：`Failed to resolve import "../../mock/aiData" from "src/pages/LeadScoring.tsx"`

**影响**:
- 用户无法查看线索 AI 评分
- Phase 4 AI 功能核心功能不可用

**建议修复**:
- 同 BUG-001

---

### BUG-003: 多个 AI 功能页面共享导入路径问题

| 字段 | 内容 |
|------|------|
| **Bug ID** | BUG-003 |
| **模块** | AI 功能 |
| **标题** | 多个 AI 功能页面共享相同的导入路径问题 |
| **级别** | P1 - 严重 |
| **状态** | Open |
| **发现日期** | 2026-03-13 |
| **发现人** | AI Assistant |
| **测试环境** | Chrome 120 / Windows 11 / Node.js v20 |

**受影响页面**:
- `/ai/lead-assignment` - 智能线索分配
- `/ai/lead-scoring` - 线索评分 AI
- 可能还有其他 AI 功能页面

**问题分析**:
- 多个页面都从 `../../mock/aiData` 导入数据
- 该文件存在 (`src/mock/aiData.ts`) 且包含正确的导出
- 可能是 Vite 模块解析或缓存问题

**建议修复**:
1. 重启开发服务器清除缓存
2. 检查 `src/mock/aiData.ts` 的导出语句
3. 考虑使用绝对路径导入（如 `src/mock/aiData`）

---

## Bug 统计

### 按级别分布

| 级别 | 数量 | 百分比 |
|------|------|--------|
| P0 - 致命 | 0 | 0% |
| P1 - 严重 | 3 | 100% |
| P2 - 一般 | 0 | 0% |
| P3 - 轻微 | 0 | 0% |
| **总计** | **3** | **100%** |

### 按模块分布

| 模块 | P0 | P1 | P2 | P3 | 合计 |
|------|----|----|----|----|------|
| AI 功能 | 0 | 3 | 0 | 0 | 3 |
| 客户管理 | 0 | 0 | 0 | 0 | 0 |
| 线索管理 | 0 | 0 | 0 | 0 | 0 |
| 商机管理 | 0 | 0 | 0 | 0 | 0 |
| 合同管理 | 0 | 0 | 0 | 0 | 0 |
| 回款管理 | 0 | 0 | 0 | 0 | 0 |
| 报表中心 | 0 | 0 | 0 | 0 | 0 |
| 仪表盘 | 0 | 0 | 0 | 0 | 0 |
| 权限管理 | 0 | 0 | 0 | 0 | 0 |
| **总计** | **0** | **3** | **0** | **0** | **3** |

---

## 修复建议

### 优先级

1. **立即修复** (P1):
   - BUG-001, BUG-002, BUG-003: AI 功能模块导入错误
   - 影响 Phase 4 核心功能可用性

### 修复步骤

1. 检查 `src/mock/aiData.ts` 文件导出
2. 检查所有引用该文件的页面导入路径
3. 清除 Vite 缓存：`rm -r -fo node_modules/.vite`
4. 重启开发服务器
5. 验证修复

---

**文档结束**
