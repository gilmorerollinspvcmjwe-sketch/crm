# 快速启动指南

## 环境要求

- Node.js >= 18.x
- npm >= 9.x

## 一键启动（Windows）

1. 双击 `start.bat` 文件
2. 等待依赖安装完成
3. 浏览器会自动打开 http://localhost:5174

## 手动启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:5174

## 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 常见问题

### 端口被占用

如果 5174 端口被占用，可以修改 `vite.config.ts` 中的端口号。

### 依赖安装失败

尝试清除缓存后重新安装：

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 错误

确保 TypeScript 版本 >= 5.3.3：

```bash
npm install -D typescript@latest
```
