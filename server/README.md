# CRM 后端服务快速启动指南

## 一键启动

```bash
# 方式 1: 使用启动脚本（推荐）
start.bat
# 选择选项 3: 同时启动前后端

# 方式 2: 使用 npm 命令
npm run dev:all

# 方式 3: 仅启动后端
npm run dev:server
# 或
node server/index.js
```

## 服务地址

- **前端**: http://localhost:3000
- **后端**: http://localhost:3001
- **API 文档**: 查看 `API_DOC.md`

## API 测试

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取客户列表
curl http://localhost:3001/api/customers

# 获取线索列表
curl http://localhost:3001/api/leads

# 获取联系人列表
curl http://localhost:3001/api/contacts

# 获取跟进记录列表
curl http://localhost:3001/api/activities
```

## 项目结构

```
server/
├── index.js           # 主入口
├── data/              # 数据文件
│   ├── customers.json
│   ├── contacts.json
│   ├── leads.json
│   └── activities.json
├── routes/            # 路由（预留）
├── controllers/       # 控制器（预留）
└── models/            # 模型（预留）
```

## Mock 数据

- 客户：15 条
- 联系人：15 条
- 线索：15 条
- 跟进记录：15 条

## 技术栈

- Node.js v24.13.0
- Express.js 4.18.2
- JSON 文件存储（MVP 阶段）

## 注意事项

1. 首次运行需要安装依赖：`npm install`
2. 后端端口：3001（可在 `.env` 中配置 `SERVER_PORT`）
3. 数据存储在 `server/data/` 目录的 JSON 文件中
4. CORS 已启用，支持前端跨域调用

## 开发计划

- [ ] 前端 API 对接
- [ ] Excel 导入导出功能
- [ ] 文件上传功能
- [ ] 数据库迁移（SQLite/PostgreSQL）

---

详细文档请查看：
- [API 文档](./API_DOC.md)
- [Phase 1 后端开发报告](./PHASE1_BACKEND_REPORT.md)
