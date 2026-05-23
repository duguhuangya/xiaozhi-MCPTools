@echo off
chcp 65001 > nul
echo ========================================
echo     小智 MCP 连接器 - Web UI
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python，请先安装 Python 3.10 或更高版本！
    echo.
    pause
    exit /b 1
)

echo [信息] 检测到 Python 环境
echo.

REM 检查是否已安装依赖
if not exist "venv" (
    echo [信息] 正在安装依赖...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [错误] 依赖安装失败！
        pause
        exit /b 1
    )
    echo [成功] 依赖安装完成！
    echo.
)

echo [信息] 正在启动 Web UI 服务...
echo.
echo ========================================
echo   服务启动后请在浏览器访问:
echo   http://localhost:5000
echo ========================================
echo.
echo 按 Ctrl+C 可停止服务
echo.

python app.py

pause
