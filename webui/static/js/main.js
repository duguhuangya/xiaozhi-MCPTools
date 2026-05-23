// 全局变量
let allTools = {};
let currentCategory = 'all';
let programPresets = {};
let commandPresets = {};

// 工具类别图标
const categoryIcons = {
    system: '🖥️',
    wechat: '💬',
    api: '🌐',
    control: '🎮',
    music: '🎵'
};

// 工具类别名称
const categoryNames = {
    system: '系统控制',
    wechat: '微信自动化',
    api: 'API 工具',
    control: '第三方控制',
    music: '音乐控制'
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTheme();
    loadTools();
    loadPresets();
});

// 导航功能
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 切换内容区域
            document.querySelectorAll('.section').forEach(sec => {
                sec.classList.remove('active');
            });
            document.getElementById(section).classList.add('active');
            
            // 更新页面标题
            const titles = {
                dashboard: '控制面板',
                tools: '工具管理',
                presets: '预设配置'
            };
            document.getElementById('pageTitle').textContent = titles[section] || '控制面板';
        });
    });
}

// 主题切换
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.querySelector('.theme-icon').textContent = '🌙';
        }
        
        localStorage.setItem('theme', newTheme);
    });
}

// 加载工具列表
async function loadTools() {
    try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        
        if (data.success) {
            allTools = data.tools;
            renderTools();
            
            // 更新统计数据
            document.getElementById('systemToolsCount').textContent = (allTools.system?.length || 0) + '+';
            document.getElementById('apiToolsCount').textContent = (allTools.api?.length || 0) + '+';
            document.getElementById('autoToolsCount').textContent = 
                ((allTools.wechat?.length || 0) + (allTools.control?.length || 0) + (allTools.music?.length || 0)) + '+';
        }
    } catch (error) {
        console.error('加载工具失败:', error);
    }
}

// 渲染工具列表
function renderTools(searchQuery = '') {
    const toolsGrid = document.getElementById('toolsGrid');
    toolsGrid.innerHTML = '';
    
    let toolsToRender = [];
    
    if (currentCategory === 'all') {
        for (const [category, tools] of Object.entries(allTools)) {
            for (const tool of tools) {
                toolsToRender.push({ name: tool, category });
            }
        }
    } else {
        const tools = allTools[currentCategory] || [];
        for (const tool of tools) {
            toolsToRender.push({ name: tool, category: currentCategory });
        }
    }
    
    // 搜索过滤
    if (searchQuery) {
        toolsToRender = toolsToRender.filter(tool => 
            tool.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    toolsToRender.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-card-icon">${categoryIcons[tool.category] || '🔧'}</div>
            <div class="tool-card-name">${tool.name}</div>
            <div class="tool-card-category">${categoryNames[tool.category] || tool.category}</div>
        `;
        toolCard.addEventListener('click', () => {
            showNotification(`已选择工具: ${tool.name}`, 'info');
        });
        toolsGrid.appendChild(toolCard);
    });
    
    // 绑定类别按钮事件
    const categoryBtns = document.querySelectorAll('.tool-category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderTools(document.getElementById('toolSearch').value);
        });
    });
}

// 搜索工具
document.getElementById('toolSearch')?.addEventListener('input', function(e) {
    renderTools(e.target.value);
});

// 加载预设
async function loadPresets() {
    try {
        const response = await fetch('/api/presets');
        const data = await response.json();
        
        if (data.success) {
            programPresets = data.programs || {};
            commandPresets = data.commands || {};
            renderProgramPresets();
            renderCommandPresets();
        }
    } catch (error) {
        console.error('加载预设失败:', error);
    }
}

// 渲染程序预设
function renderProgramPresets() {
    const container = document.getElementById('programPresets');
    container.innerHTML = '';
    
    for (const [name, path] of Object.entries(programPresets)) {
        const presetItem = createPresetItem('program', name, path);
        container.appendChild(presetItem);
    }
}

// 渲染命令预设
function renderCommandPresets() {
    const container = document.getElementById('commandPresets');
    container.innerHTML = '';
    
    for (const [name, command] of Object.entries(commandPresets)) {
        const presetItem = createPresetItem('command', name, command);
        container.appendChild(presetItem);
    }
}

// 创建预设项
function createPresetItem(type, name, value) {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML = `
        <input type="text" class="preset-input" placeholder="名称" value="${escapeHtml(name)}" data-type="${type}" data-field="name">
        <input type="text" class="preset-input" placeholder="${type === 'program' ? '程序路径' : '命令'}" value="${escapeHtml(value)}" data-type="${type}" data-field="value">
        <button class="preset-delete" onclick="deletePreset('${type}', '${escapeHtml(name)}')">×</button>
    `;
    
    const inputs = item.querySelectorAll('.preset-input');
    inputs.forEach(input => {
        input.addEventListener('input', updatePresetsFromDOM);
    });
    
    return item;
}

// 从DOM更新预设
function updatePresetsFromDOM() {
    const programItems = document.querySelectorAll('#programPresets .preset-item');
    programPresets = {};
    programItems.forEach(item => {
        const inputs = item.querySelectorAll('.preset-input');
        const name = inputs[0].value;
        const value = inputs[1].value;
        if (name) {
            programPresets[name] = value;
        }
    });
    
    const commandItems = document.querySelectorAll('#commandPresets .preset-item');
    commandPresets = {};
    commandItems.forEach(item => {
        const inputs = item.querySelectorAll('.preset-input');
        const name = inputs[0].value;
        const value = inputs[1].value;
        if (name) {
            commandPresets[name] = value;
        }
    });
}

// 添加程序预设
function addProgramPreset() {
    const container = document.getElementById('programPresets');
    const item = createPresetItem('program', '', '');
    container.appendChild(item);
}

// 添加命令预设
function addCommandPreset() {
    const container = document.getElementById('commandPresets');
    const item = createPresetItem('command', '', '');
    container.appendChild(item);
}

// 删除预设
function deletePreset(type, name) {
    if (type === 'program') {
        delete programPresets[name];
        renderProgramPresets();
    } else {
        delete commandPresets[name];
        renderCommandPresets();
    }
    showNotification('已删除预设', 'success');
}

// 保存预设
async function savePresets() {
    updatePresetsFromDOM();
    
    try {
        const response = await fetch('/api/presets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                programs: programPresets,
                commands: commandPresets
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('预设保存成功!', 'success');
        } else {
            showNotification('保存失败: ' + (data.error || '未知错误'), 'error');
        }
    } catch (error) {
        showNotification('保存失败: ' + error.message, 'error');
    }
}

// 启动MCP服务器
async function startMCP(type) {
    try {
        const response = await fetch('/api/mcp/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message || 'MCP 服务器启动中...', 'success');
        } else {
            showNotification('启动失败: ' + (data.error || '未知错误'), 'error');
        }
    } catch (error) {
        showNotification('启动失败: ' + error.message, 'error');
    }
}

// 显示通知
function showNotification(text, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notificationIcon');
    const textEl = document.getElementById('notificationText');
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    icon.textContent = icons[type] || icons.success;
    textEl.textContent = text;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
