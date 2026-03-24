@echo off
chcp 65001 >nul
cd /d %~dp0
echo ========================================
echo    CRM 系统 - Phase 1 启动脚本
echo ========================================
echo.

echo 请选择启动模式:
echo   1. 仅启动前端 (端口 3000)
echo   2. 仅启动后端 (端口 3001)
echo   3. 同时启动前后端
echo   4. 安装依赖后启动
echo.
set /p mode=请输入选项 (1-4): 

if "%mode%"=="1" goto FRONTEND_ONLY
if "%mode%"=="2" goto SERVER_ONLY
if "%mode%"=="3" goto BOTH
if "%mode%"=="4" goto INSTALL_AND_START

echo 无效选项
pause
exit /b

:INSTALL_AND_START
echo.
echo [1/2] 安装依赖...
call npm install
if errorlevel 1 (
    echo 依赖安装失败
    pause
    exit /b 1
)

:BOTH
echo.
echo ========================================
echo   启动前后端服务
echo   前端：http://localhost:3000
echo   后端：http://localhost:3001
echo ========================================
echo.
start "CRM 后端服务" cmd /k "node server/index.js"
timeout /t 2 /nobreak >nul
call npm run dev
pause
exit /b

:FRONTEND_ONLY
echo.
echo ========================================
echo   启动前端服务
echo   地址：http://localhost:3000
echo ========================================
echo.
call npm run dev
pause
exit /b

:SERVER_ONLY
echo.
echo ========================================
echo   启动后端服务
echo   端口：3001
echo ========================================
echo.
node server/index.js
pause
exit /b
