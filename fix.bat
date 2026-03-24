@echo off
echo ========================================
echo    CRM 前端 - 自动修复脚本
echo ========================================
echo.

echo [1/5] 修复 activityData.ts 缺少 attachments...
powershell -Command "(Get-Content src\mock\activityData.ts) -replace \"createdAt: '([^']+)'(\s*)\r?\n(\s*)\},(\s*)\r?\n(\s*)\{\", \"createdAt: '\$1'\$2,\$3attachments: []\$4},\$5\r?\n\$6{\" | Set-Content src\mock\activityData.ts"

echo [2/5] 创建 Charts 目录...
if not exist "src\components\Charts" mkdir src\components\Charts

echo [3/5] 创建简化图表组件...
echo // 简化漏斗图
echo import React from 'react';
echo export const FunnelChart: React.FC<any> = (props) => ^<div^>漏斗图^</div^>;
> src\components\Charts\FunnelChart.tsx

echo // 简化折线图
echo import React from 'react';
echo export const LineChart: React.FC<any> = (props) => ^<div^>折线图^</div^>;
> src\components\Charts\LineChart.tsx

echo // 简化饼图
echo import React from 'react';
echo export const PieChart: React.FC<any> = (props) => ^<div^>饼图^</div^>;
> src\components\Charts\PieChart.tsx

echo // 简化柱状图
echo import React from 'react';
echo export const BarChart: React.FC<any> = (props) => ^<div^>柱状图^</div^>;
> src\components\Charts\BarChart.tsx

echo [4/5] 修复 OpportunityDetail.tsx...
powershell -Command "(Get-Content src\pages\OpportunityDetail.tsx) -replace 'Descriptions.Meta', 'Descriptions' | Set-Content src\pages\OpportunityDetail.tsx"

echo [5/5] 完成！
echo.
echo 请运行 npm run dev 启动项目
pause
