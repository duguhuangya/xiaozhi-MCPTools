# 小智 MCP 连接器 - Web UI

这是小智 MCP 连接器的现代化 Web 界面，提供了友好的图形化管理界面。

## 功能特性

### 1. 控制面板
- 系统状态概览
- 快速启动 MCP 服务器（基础版/开放API版/ALAPI版）
- 最近使用工具列表

### 2. 工具管理
- 按类别浏览所有可用工具
- 工具搜索功能
- 工具卡片展示

### 3. 预设配置
- 管理程序预设
- 管理命令预设
- 可视化编辑界面

### 4. 主题支持
- 浅色主题
- 深色主题

## 快速开始

### 1. 安装依赖

```bash
cd webui
pip install -r requirements.txt
```

### 2. 启动服务

```bash
python app.py
```

### 3. 访问界面

打开浏览器访问: http://localhost:5000

## 项目结构

```
webui/
├── app.py                  # Flask 后端应用
├── requirements.txt        # Python 依赖
├── README.md              # 使用说明
├── templates/             # HTML 模板
│   └── index.html        # 主页面
└── static/               # 静态资源
    ├── css/
    │   └── style.css    # 样式文件
    └── js/
        └── main.js      # 交互脚本
```

## API 接口

### 获取系统状态
```
GET /api/status
```

### 获取工具列表
```
GET /api/tools
```

### 获取/保存预设
```
GET /api/presets
POST /api/presets
```

### 启动 MCP 服务器
```
POST /api/mcp/start
```

## 开发说明

### 添加新工具类别

在 `app.py` 的 `get_tools()` 函数中添加新的工具类别。

### 自定义样式

编辑 `static/css/style.css` 来自定义界面样式。

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari

## 技术栈

- **后端**: Flask (Python)
- **前端**: 原生 HTML + CSS + JavaScript
- **设计**: 响应式布局, 深色/浅色主题

## 许可证

与主项目相同的许可证。
