// CRM UI 交互元素扫描脚本
const fs = require('fs');
const path = require('path');

const projectPath = 'C:\\Users\\13609\\Projects\\crm-ui-upgrade';
const pagesPath = path.join(projectPath, 'src', 'pages');
const outputPath = path.join(projectPath, 'docs', '全量按钮测试报告.md');

// 确保 docs 目录存在
if (!fs.existsSync(path.join(projectPath, 'docs'))) {
    fs.mkdirSync(path.join(projectPath, 'docs'), { recursive: true });
}

// 路由白名单
const validRoutes = [
    '/', '/workbench', '/dashboard',
    '/customer/list', '/customer/:id',
    '/contact/list', '/contact/:id',
    '/lead/list', '/lead/:id',
    '/opportunity/list', '/opportunity/kanban', '/opportunity/:id',
    '/activity/list', '/activity/new', '/activity/:id',
    '/contract/list', '/contract/:id',
    '/payment/list', '/payment/:id',
    '/order/list', '/order/:id',
    '/products/list', '/products/:id',
    '/pricebooks/list', '/pricebooks/:id',
    '/report/list', '/report/dashboard', '/report/builder', '/report/schedule', '/report/export', '/report/:id',
    '/report/funnel', '/report/performance', '/report/customer', '/report/activity', '/report/lead-conversion', '/report/payment',
    '/ai/config', '/ai/history', '/ai/prompts', '/ai/assistant', '/ai/dashboard', '/ai/analytics', '/ai/models', '/ai/usage',
    '/ai/lead-assignment', '/ai/lead-scoring', '/ai/sales-forecast', '/ai/customer-segmentation', '/ai/churn-warning',
    '/ai/meeting-assistant', '/ai/predictive', '/ai/agents', '/ai/agents/:id',
    '/marketing/campaigns', '/marketing/campaign/:id', '/marketing/email-templates', '/marketing/email/:id', '/marketing/target-lists',
    '/automation/workflows', '/automation/logs',
    '/workflows', '/workflows/builder', '/workflows/executions', '/workflows/:id', '/workflows/:id/edit',
    '/integration/tickets', '/integration/knowledge', '/integration/callcenter',
    '/custom-objects', '/custom-objects/builder/:objectId', '/custom-objects/settings/:objectId',
    '/custom-objects/:objectId', '/custom-objects/:objectId/new', '/custom-objects/:objectId/:id', '/custom-objects/:objectId/:id/edit',
    '/quote/list', '/quote/new', '/quote/:id', '/quote/:id/edit', '/quote/:id/clone',
    '/settings', '/settings/profile', '/settings/security', '/settings/preferences', '/settings/notifications',
    '/settings/email', '/settings/integrations', '/settings/workflows', '/settings/fields', '/settings/layout', '/settings/theme',
    '/settings/roles', '/settings/users', '/settings/permissions', '/settings/audit-log', '/settings/login-log',
    '/404'
];

// 结果存储
const results = {
    emptyOnClick: [],
    emptyHref: [],
    hardCodedAlerts: [],
    invalidRoutes: [],
    emptyOnSubmit: []
};

let pageCount = 0;
let totalButtons = 0;
let totalLinks = 0;
let totalForms = 0;

// 递归获取所有 tsx/jsx 文件
function getFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files.push(...getFiles(fullPath));
        } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
            files.push(fullPath);
        }
    }
    return files;
}

// 计算行号
function getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
}

// 检查路由是否有效
function isValidRoute(route) {
    if (!route || route.startsWith('http') || route.startsWith('mailto') || route.startsWith('tel')) {
        return true; // 外部链接
    }
    if (route.startsWith('$') || route.startsWith('{')) {
        return true; // 动态变量
    }
    
    // 规范化路由（将动态参数替换为 :id）
    const normalized = route.replace(/\/\d+/g, '/:id').replace(/\/[a-f0-9-]{36}/g, '/:id');
    
    for (const validRoute of validRoutes) {
        const pattern = validRoute.replace(/:\w+/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        if (route.match(regex) || normalized.match(regex)) {
            return true;
        }
    }
    return false;
}

// 获取所有页面文件
const files = getFiles(pagesPath);
console.log(`开始扫描 ${files.length} 个页面文件...`);

for (const file of files) {
    pageCount++;
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(projectPath, file);
    
    // 1. 扫描按钮 onClick
    const buttonRegex = /<button[^>]*onClick\s*=\s*\{([^}]*)\}/g;
    let match;
    while ((match = buttonRegex.exec(content)) !== null) {
        totalButtons++;
        const onClickValue = match[1].trim();
        const lineNum = getLineNumber(content, match.index);
        
        // 检查空 onClick
        if (onClickValue === '' || onClickValue === 'undefined' || onClickValue.match(/^\(\)\s*=>\s*\{\s*\}$/)) {
            results.emptyOnClick.push({
                file: relativePath,
                line: lineNum,
                type: 'button',
                code: match[0].substring(0, Math.min(100, match[0].length)),
                issue: '空 onClick 处理'
            });
        }
        
        // 检查硬编码 alert/confirm
        if (onClickValue.match(/alert\s*\(/) || onClickValue.match(/confirm\s*\(/)) {
            results.hardCodedAlerts.push({
                file: relativePath,
                line: lineNum,
                type: 'button',
                code: match[0].substring(0, Math.min(100, match[0].length)),
                issue: '硬编码 alert/confirm'
            });
        }
    }
    
    // 2. 扫描 a 标签 href
    const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*)["']/g;
    while ((match = linkRegex.exec(content)) !== null) {
        totalLinks++;
        const hrefValue = match[1].trim();
        const lineNum = getLineNumber(content, match.index);
        
        if (hrefValue === '' || hrefValue === '#') {
            results.emptyHref.push({
                file: relativePath,
                line: lineNum,
                type: 'a',
                code: match[0].substring(0, Math.min(100, match[0].length)),
                issue: `空 href (${hrefValue})`
            });
        }
    }
    
    // 3. 扫描 Link 组件 to 属性
    const linkToRegex = /<Link[^>]*to\s*=\s*["']([^"']*)["']/g;
    while ((match = linkToRegex.exec(content)) !== null) {
        totalLinks++;
        const toValue = match[1].trim();
        const lineNum = getLineNumber(content, match.index);
        
        if (toValue === '' || toValue === '#') {
            results.emptyHref.push({
                file: relativePath,
                line: lineNum,
                type: 'Link',
                code: match[0].substring(0, Math.min(100, match[0].length)),
                issue: `空 to 属性 (${toValue})`
            });
        } else if (!isValidRoute(toValue)) {
            results.invalidRoutes.push({
                file: relativePath,
                line: lineNum,
                type: 'Link',
                code: `to="${toValue}"`,
                issue: '可能无效的路由',
                route: toValue
            });
        }
    }
    
    // 4. 扫描 form onSubmit
    const formRegex = /<form[^>]*onSubmit\s*=\s*\{([^}]*)\}/g;
    while ((match = formRegex.exec(content)) !== null) {
        totalForms++;
        const onSubmitValue = match[1].trim();
        const lineNum = getLineNumber(content, match.index);
        
        if (onSubmitValue === '' || onSubmitValue === 'undefined' || onSubmitValue.match(/^\(\)\s*=>\s*\{\s*\}$/)) {
            results.emptyOnSubmit.push({
                file: relativePath,
                line: lineNum,
                type: 'form',
                code: match[0].substring(0, Math.min(100, match[0].length)),
                issue: '空 onSubmit 处理'
            });
        }
    }
    
    if (pageCount % 20 === 0) {
        console.log(`已扫描 ${pageCount} / ${files.length} 个文件...`);
    }
}

console.log('扫描完成！生成报告...');

// 生成 Markdown 报告
const totalIssues = results.emptyOnClick.length + results.emptyHref.length + 
                    results.hardCodedAlerts.length + results.invalidRoutes.length + 
                    results.emptyOnSubmit.length;

let report = `# CRM UI 全量按钮测试报告

**生成时间**: ${new Date().toLocaleString('zh-CN')}
**项目路径**: ${projectPath}

---

## 📊 测试概况

| 指标 | 数量 |
|------|------|
| 扫描页面数 | ${pageCount} |
| 按钮总数 | ${totalButtons} |
| 链接总数 | ${totalLinks} |
| 表单总数 | ${totalForms} |

---

## ⚠️ 问题汇总

| 问题类型 | 数量 | 严重程度 |
|----------|------|----------|
| 空 onClick | ${results.emptyOnClick.length} | 🔴 高 |
| 空 href/to | ${results.emptyHref.length} | 🔴 高 |
| 硬编码 alert/confirm | ${results.hardCodedAlerts.length} | 🟡 中 |
| 可能无效的路由 | ${results.invalidRoutes.length} | 🟡 中 |
| 空 onSubmit | ${results.emptyOnSubmit.length} | 🔴 高 |

**总计问题数**: ${totalIssues}

---

## 🔴 高优先级问题

### 1. 空 onClick 处理

`;

if (results.emptyOnClick.length === 0) {
    report += '✅ 未发现空 onClick 问题\n\n';
} else {
    report += '| 文件路径 | 行号 | 代码片段 |\n';
    report += '|----------|------|----------|\n';
    for (const item of results.emptyOnClick) {
        report += `| ${item.file} | ${item.line} | \`${item.code}\` |\n`;
    }
    report += '\n**修复建议**: 为按钮添加有效的 onClick 事件处理函数，或禁用按钮。\n\n';
}

report += `### 2. 空 href/to 属性

`;

if (results.emptyHref.length === 0) {
    report += '✅ 未发现空 href/to 问题\n\n';
} else {
    report += '| 文件路径 | 行号 | 类型 | 代码片段 |\n';
    report += '|----------|------|------|----------|\n';
    for (const item of results.emptyHref) {
        report += `| ${item.file} | ${item.line} | ${item.type} | \`${item.code}\` |\n`;
    }
    report += '\n**修复建议**: 为链接添加有效的 href/to 属性，或移除链接样式。\n\n';
}

report += `### 3. 空 onSubmit 处理

`;

if (results.emptyOnSubmit.length === 0) {
    report += '✅ 未发现空 onSubmit 问题\n\n';
} else {
    report += '| 文件路径 | 行号 | 代码片段 |\n';
    report += '|----------|------|----------|\n';
    for (const item of results.emptyOnSubmit) {
        report += `| ${item.file} | ${item.line} | \`${item.code}\` |\n`;
    }
    report += '\n**修复建议**: 为表单添加有效的 onSubmit 事件处理函数。\n\n';
}

report += `---

## 🟡 中优先级问题

### 1. 硬编码 alert/confirm

`;

if (results.hardCodedAlerts.length === 0) {
    report += '✅ 未发现硬编码 alert/confirm\n\n';
} else {
    report += '| 文件路径 | 行号 | 代码片段 |\n';
    report += '|----------|------|----------|\n';
    for (const item of results.hardCodedAlerts) {
        report += `| ${item.file} | ${item.line} | \`${item.code}\` |\n`;
    }
    report += '\n**修复建议**: 替换为 UI 组件库的 Modal/Dialog 组件。\n\n';
}

report += `### 2. 可能无效的路由

`;

if (results.invalidRoutes.length === 0) {
    report += '✅ 未发现可能无效的路由\n\n';
} else {
    report += '| 文件路径 | 行号 | 路由 | 代码片段 |\n';
    report += '|----------|------|------|----------|\n';
    for (const item of results.invalidRoutes) {
        report += `| ${item.file} | ${item.line} | ${item.route} | ${item.code} |\n`;
    }
    report += '\n**修复建议**: 检查路由是否在 routes/index.tsx 中定义，或添加缺失的路由配置。\n\n';
}

report += `---

## 📝 修复建议总结

### 高优先级（立即修复）
1. **空 onClick**: 添加实际的事件处理逻辑或禁用按钮
2. **空 href/to**: 添加有效的链接目标或移除链接样式
3. **空 onSubmit**: 添加表单提交处理逻辑

### 中优先级（尽快修复）
1. **硬编码 alert/confirm**: 使用 UI 组件库的 Modal/Dialog
2. **无效路由**: 检查并补充缺失的路由配置

---

*报告由自动化扫描脚本生成*
`;

// 保存报告
fs.writeFileSync(outputPath, report, 'utf8');

console.log(`报告已保存到：${outputPath}`);
console.log('');
console.log('=== 扫描摘要 ===');
console.log(`页面数：${pageCount}`);
console.log(`按钮数：${totalButtons}`);
console.log(`链接数：${totalLinks}`);
console.log(`表单数：${totalForms}`);
console.log(`空 onClick: ${results.emptyOnClick.length}`);
console.log(`空 href/to: ${results.emptyHref.length}`);
console.log(`硬编码 alert: ${results.hardCodedAlerts.length}`);
console.log(`无效路由：${results.invalidRoutes.length}`);
console.log(`空 onSubmit: ${results.emptyOnSubmit.length}`);
