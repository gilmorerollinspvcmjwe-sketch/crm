# CRM UI 交互元素扫描脚本
# 扫描所有页面文件中的按钮、链接、表单交互元素

$projectPath = "C:\Users\13609\Projects\crm-ui-upgrade"
$pagesPath = "$projectPath\src\pages"
$outputPath = "$projectPath\docs\全量按钮测试报告.md"

# 确保 docs 目录存在
if (!(Test-Path "$projectPath\docs")) {
    New-Item -ItemType Directory -Path "$projectPath\docs" -Force | Out-Null
}

# 路由白名单（从 routes/index.tsx 提取）
$validRoutes = @(
    "/", "/workbench", "/dashboard",
    "/customer/list", "/customer/:id",
    "/contact/list", "/contact/:id",
    "/lead/list", "/lead/:id",
    "/opportunity/list", "/opportunity/kanban", "/opportunity/:id",
    "/activity/list", "/activity/new", "/activity/:id",
    "/contract/list", "/contract/:id",
    "/payment/list", "/payment/:id",
    "/order/list", "/order/:id",
    "/products/list", "/products/:id",
    "/pricebooks/list", "/pricebooks/:id",
    "/report/list", "/report/dashboard", "/report/builder", "/report/schedule", "/report/export", "/report/:id",
    "/report/funnel", "/report/performance", "/report/customer", "/report/activity", "/report/lead-conversion", "/report/payment",
    "/ai/config", "/ai/history", "/ai/prompts", "/ai/assistant", "/ai/dashboard", "/ai/analytics", "/ai/models", "/ai/usage",
    "/ai/lead-assignment", "/ai/lead-scoring", "/ai/sales-forecast", "/ai/customer-segmentation", "/ai/churn-warning",
    "/ai/meeting-assistant", "/ai/predictive", "/ai/agents", "/ai/agents/:id",
    "/marketing/campaigns", "/marketing/campaign/:id", "/marketing/email-templates", "/marketing/email/:id", "/marketing/target-lists",
    "/automation/workflows", "/automation/logs",
    "/workflows", "/workflows/builder", "/workflows/executions", "/workflows/:id", "/workflows/:id/edit",
    "/integration/tickets", "/integration/knowledge", "/integration/callcenter",
    "/custom-objects", "/custom-objects/builder/:objectId", "/custom-objects/settings/:objectId",
    "/custom-objects/:objectId", "/custom-objects/:objectId/new", "/custom-objects/:objectId/:id", "/custom-objects/:objectId/:id/edit",
    "/quote/list", "/quote/new", "/quote/:id", "/quote/:id/edit", "/quote/:id/clone",
    "/settings", "/settings/profile", "/settings/security", "/settings/preferences", "/settings/notifications",
    "/settings/email", "/settings/integrations", "/settings/workflows", "/settings/fields", "/settings/layout", "/settings/theme",
    "/settings/roles", "/settings/users", "/settings/permissions", "/settings/audit-log", "/settings/login-log",
    "/404"
)

# 结果存储
$allResults = @{
    buttons = @()
    links = @()
    forms = @()
    emptyOnClick = @()
    emptyHref = @()
    hardCodedAlerts = @()
    invalidRoutes = @()
}

$pageCount = 0
$totalButtons = 0
$totalLinks = 0
$totalForms = 0

# 获取所有页面文件
$files = Get-ChildItem -Path $pagesPath -Include *.tsx,*.jsx -Recurse

Write-Host "开始扫描 $($files.Count) 个页面文件..."

foreach ($file in $files) {
    $pageCount++
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $lines = Get-Content -Path $file.FullName -Encoding UTF8
    $relativePath = $file.FullName.Replace("$projectPath\", "")
    
    # 1. 扫描按钮 onClick
    $buttonMatches = [regex]::Matches($content, '(?s)<button[^>]*onClick\s*=\s*\{([^}]*)\}[^>]*>')
    foreach ($match in $buttonMatches) {
        $totalButtons++
        $onClickValue = $match.Groups[1].Value.Trim()
        $lineNum = ($content.Substring(0, $match.Index) -split "`n").Count
        
        # 检查空 onClick
        if ($onClickValue -eq "" -or $onClickValue -eq "undefined" -or $onClickValue -match '^\(\)\s*=>\s*\{\s*\}$') {
            $allResults.emptyOnClick += @{
                file = $relativePath
                line = $lineNum
                type = "button"
                code = $match.Value.Substring(0, [Math]::Min(100, $match.Value.Length))
                issue = "空 onClick 处理"
            }
        }
        
        # 检查硬编码 alert/confirm
        if ($onClickValue -match 'alert\s*\(' -or $onClickValue -match 'confirm\s*\(') {
            $allResults.hardCodedAlerts += @{
                file = $relativePath
                line = $lineNum
                type = "button"
                code = $match.Value.Substring(0, [Math]::Min(100, $match.Value.Length))
                issue = "硬编码 alert/confirm"
            }
        }
    }
    
    # 2. 扫描 a 标签 href
    $linkMatches = [regex]::Matches($content, '(?s)<a[^>]*href\s*=\s*["'']([^"'']*)["''][^>]*>')
    foreach ($match in $linkMatches) {
        $totalLinks++
        $hrefValue = $match.Groups[1].Value.Trim()
        $lineNum = ($content.Substring(0, $match.Index) -split "`n").Count
        
        # 检查空 href
        if ($hrefValue -eq "" -or $hrefValue -eq "#") {
            $allResults.emptyHref += @{
                file = $relativePath
                line = $lineNum
                type = "a"
                code = $match.Value.Substring(0, [Math]::Min(100, $match.Value.Length))
                issue = "空 href ($hrefValue)"
            }
        }
    }
    
    # 3. 扫描 Link 组件 to 属性
    $linkToMatches = [regex]::Matches($content, '(?s)<Link[^>]*to\s*=\s*["'']([^"'']*)["''][^>]*>')
    foreach ($match in $linkToMatches) {
        $totalLinks++
        $toValue = $match.Groups[1].Value.Trim()
        $lineNum = ($content.Substring(0, $match.Index) -split "`n").Count
        
        # 检查空 to
        if ($toValue -eq "" -or $toValue -eq "#") {
            $allResults.emptyHref += @{
                file = $relativePath
                line = $lineNum
                type = "Link"
                code = $match.Value.Substring(0, [Math]::Min(100, $match.Value.Length))
                issue = "空 to 属性 ($toValue)"
            }
        } else {
            # 检查路由有效性（排除动态参数和外部链接）
            if ($toValue -notmatch '^(http|https|mailto|tel):' -and $toValue -notmatch '^\$' -and $toValue -notmatch '^\{') {
                # 简化路由路径用于匹配
                $normalizedRoute = $toValue -replace '/\d+', '/:id' -replace '/[a-f0-9-]{36}', '/:id'
                $isValid = $false
                foreach ($validRoute in $validRoutes) {
                    $pattern = $validRoute -replace ':\w+', '[^/]+'
                    if ($normalizedRoute -match "^$pattern$" -or $toValue -match "^$pattern$") {
                        $isValid = $true
                        break
                    }
                }
                if (!$isValid -and $toValue -notmatch '^\/$') {
                    $allResults.invalidRoutes += @{
                        file = $relativePath
                        line = $lineNum
                        type = "Link"
                        code = "to=`"$toValue`""
                        issue = "可能无效的路由"
                        route = $toValue
                    }
                }
            }
        }
    }
    
    # 4. 扫描 form onSubmit
    $formMatches = [regex]::Matches($content, '(?s)<form[^>]*onSubmit\s*=\s*\{([^}]*)\}[^>]*>')
    foreach ($match in $formMatches) {
        $totalForms++
        $onSubmitValue = $match.Groups[1].Value.Trim()
        $lineNum = ($content.Substring(0, $match.Index) -split "`n").Count
        
        if ($onSubmitValue -eq "" -or $onSubmitValue -eq "undefined" -or $onSubmitValue -match '^\(\)\s*=>\s*\{\s*\}$') {
            $allResults.forms += @{
                file = $relativePath
                line = $lineNum
                type = "form"
                code = $match.Value.Substring(0, [Math]::Min(100, $match.Value.Length))
                issue = "空 onSubmit 处理"
            }
        }
    }
    
    if ($pageCount % 20 -eq 0) {
        Write-Host "已扫描 $pageCount / $($files.Count) 个文件..."
    }
}

Write-Host "扫描完成！生成报告..."

# 生成 Markdown 报告
$report = @"
# CRM UI 全量按钮测试报告

**生成时间**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**项目路径**: $projectPath

---

## 📊 测试概况

| 指标 | 数量 |
|------|------|
| 扫描页面数 | $pageCount |
| 按钮总数 | $totalButtons |
| 链接总数 | $totalLinks |
| 表单总数 | $totalForms |

---

## ⚠️ 问题汇总

| 问题类型 | 数量 | 严重程度 |
|----------|------|----------|
| 空 onClick | $($allResults.emptyOnClick.Count) | 🔴 高 |
| 空 href/to | $($allResults.emptyHref.Count) | 🔴 高 |
| 硬编码 alert/confirm | $($allResults.hardCodedAlerts.Count) | 🟡 中 |
| 可能无效的路由 | $($allResults.invalidRoutes.Count) | 🟡 中 |
| 空 onSubmit | $($allResults.forms.Count) | 🔴 高 |

**总计问题数**: $($allResults.emptyOnClick.Count + $allResults.emptyHref.Count + $allResults.hardCodedAlerts.Count + $allResults.invalidRoutes.Count + $allResults.forms.Count)

---

## 🔴 高优先级问题

### 1. 空 onClick 处理

"@

if ($allResults.emptyOnClick.Count -eq 0) {
    $report += "✅ 未发现空 onClick 问题`n`n"
} else {
    $report += "| 文件路径 | 行号 | 代码片段 |`n"
    $report += "|----------|------|----------|`n"
    foreach ($item in $allResults.emptyOnClick) {
        $report += "| $($item.file) | $($item.line) | `"$($item.code)`" |`n"
    }
    $report += "`n**修复建议**: 为按钮添加有效的 onClick 事件处理函数，或禁用按钮。`n`n"
}

$report += @"

### 2. 空 href/to 属性

"@

if ($allResults.emptyHref.Count -eq 0) {
    $report += "✅ 未发现空 href/to 问题`n`n"
} else {
    $report += "| 文件路径 | 行号 | 类型 | 代码片段 |`n"
    $report += "|----------|------|------|----------|`n"
    foreach ($item in $allResults.emptyHref) {
        $report += "| $($item.file) | $($item.line) | $($item.type) | `"$($item.code)`" |`n"
    }
    $report += "`n**修复建议**: 为链接添加有效的 href/to 属性，或移除链接样式。`n`n"
}

$report += @"

### 3. 空 onSubmit 处理

"@

if ($allResults.forms.Count -eq 0) {
    $report += "✅ 未发现空 onSubmit 问题`n`n"
} else {
    $report += "| 文件路径 | 行号 | 代码片段 |`n"
    $report += "|----------|------|----------|`n"
    foreach ($item in $allResults.forms) {
        $report += "| $($item.file) | $($item.line) | `"$($item.code)`" |`n"
    }
    $report += "`n**修复建议**: 为表单添加有效的 onSubmit 事件处理函数。`n`n"
}

$report += @"

---

## 🟡 中优先级问题

### 1. 硬编码 alert/confirm

"@

if ($allResults.hardCodedAlerts.Count -eq 0) {
    $report += "✅ 未发现硬编码 alert/confirm`n`n"
} else {
    $report += "| 文件路径 | 行号 | 代码片段 |`n"
    $report += "|----------|------|----------|`n"
    foreach ($item in $allResults.hardCodedAlerts) {
        $report += "| $($item.file) | $($item.line) | `"$($item.code)`" |`n"
    }
    $report += "`n**修复建议**: 替换为 UI 组件库的 Modal/Dialog 组件。`n`n"
}

$report += @"

### 2. 可能无效的路由

"@

if ($allResults.invalidRoutes.Count -eq 0) {
    $report += "✅ 未发现可能无效的路由`n`n"
} else {
    $report += "| 文件路径 | 行号 | 路由 | 代码片段 |`n"
    $report += "|----------|------|------|----------|`n"
    foreach ($item in $allResults.invalidRoutes) {
        $report += "| $($item.file) | $($item.line) | $($item.route) | $($item.code) |`n"
    }
    $report += "`n**修复建议**: 检查路由是否在 routes/index.tsx 中定义，或添加缺失的路由配置。`n`n"
}

$report += @"

---

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
"@

# 保存报告
$report | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "报告已保存到：$outputPath"
Write-Host ""
Write-Host "=== 扫描摘要 ==="
Write-Host "页面数：$pageCount"
Write-Host "按钮数：$totalButtons"
Write-Host "链接数：$totalLinks"
Write-Host "表单数：$totalForms"
Write-Host "空 onClick: $($allResults.emptyOnClick.Count)"
Write-Host "空 href/to: $($allResults.emptyHref.Count)"
Write-Host "硬编码 alert: $($allResults.hardCodedAlerts.Count)"
Write-Host "无效路由：$($allResults.invalidRoutes.Count)"
Write-Host "空 onSubmit: $($allResults.forms.Count)"
