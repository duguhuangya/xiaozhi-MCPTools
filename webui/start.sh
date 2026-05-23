#!/bin/bash

echo "========================================"
echo "    小智 MCP 连接器 - Web UI"
echo "========================================"
echo ""

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到 Python3，请先安装 Python 3.10 或更高版本！"
    echo ""
    exit 1
fi

echo "[信息] 检测到 Python 环境"
echo ""

# 检查是否已安装依赖
echo "[信息] 正在安装依赖..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[错误] 依赖安装失败！"
    exit 1
fi
echo "[成功] 依赖安装完成！"
echo ""

echo "[信息] 正在启动 Web UI 服务..."
echo ""
echo "========================================"
echo "  服务启动后请在浏览器访问:"
echo "  http://localhost:5000"
echo "========================================"
echo ""
echo "按 Ctrl+C 可停止服务"
echo ""

python3 app.py
