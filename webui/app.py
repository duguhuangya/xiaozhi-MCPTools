from flask import Flask, render_template, jsonify, request
import subprocess
import os
import sys
import json
from pathlib import Path

app = Flask(__name__)

# 获取项目根目录
PROJECT_ROOT = Path(__file__).parent.parent
MCP_WINDOWS_DIR = PROJECT_ROOT / "MCP_Windows"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status', methods=['GET'])
def get_status():
    """获取系统状态"""
    return jsonify({
        'success': True,
        'status': 'running',
        'project_root': str(PROJECT_ROOT)
    })

@app.route('/api/mcp/start', methods=['POST'])
def start_mcp():
    """启动 MCP 服务器"""
    try:
        data = request.get_json()
        server_type = data.get('type', 'basic')  # basic, openapi, alapi
        
        if server_type == 'basic':
            script = 'Windows.py'
        elif server_type == 'openapi':
            script = 'Windows+OPEN_API.py'
        elif server_type == 'alapi':
            script = 'Windows+AL_API.py'
        else:
            return jsonify({'success': False, 'error': '无效的服务器类型'})
        
        script_path = MCP_WINDOWS_DIR / script
        if not script_path.exists():
            return jsonify({'success': False, 'error': f'找不到 {script}'})
        
        # 在新进程中启动（仅作为示例，实际生产中需要更好的进程管理）
        return jsonify({'success': True, 'message': f'准备启动 {script}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/presets', methods=['GET', 'POST'])
def manage_presets():
    """管理预设配置"""
    presets_dir = MCP_WINDOWS_DIR / "预设"
    presets_dir.mkdir(exist_ok=True)
    
    if request.method == 'GET':
        # 获取预设
        programs = {}
        commands = {}
        
        programs_file = presets_dir / "程序预设.txt"
        commands_file = presets_dir / "命令预设.txt"
        
        if programs_file.exists():
            with open(programs_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and '=' in line:
                        key, value = line.split('=', 1)
                        programs[key] = value
        
        if commands_file.exists():
            with open(commands_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and '=' in line:
                        key, value = line.split('=', 1)
                        commands[key] = value
        
        return jsonify({
            'success': True,
            'programs': programs,
            'commands': commands
        })
    else:
        # 保存预设
        try:
            data = request.get_json()
            
            if 'programs' in data:
                programs_file = presets_dir / "程序预设.txt"
                with open(programs_file, 'w', encoding='utf-8') as f:
                    for key, value in data['programs'].items():
                        f.write(f"{key}={value}\n")
            
            if 'commands' in data:
                commands_file = presets_dir / "命令预设.txt"
                with open(commands_file, 'w', encoding='utf-8') as f:
                    for key, value in data['commands'].items():
                        f.write(f"{key}={value}\n")
            
            return jsonify({'success': True, 'message': '预设已保存'})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})

@app.route('/api/tools', methods=['GET'])
def get_tools():
    """获取所有可用工具列表"""
    # 从项目中解析工具列表
    tools = {
        'system': [
            '计算器', '运行电脑端预设软件文件或程序', '在电脑上打开URL网址',
            '在电脑上运行CMD命令', '在电脑上创建文件与写入内容', '读取复制内容',
            '填入写入一段内容', '回车发送', '撤销操作', '锁定电脑',
            '电脑关机计划', '设置主人电脑系统的音量', '调用系统截图工具',
            '显示电脑桌面', '查看系统资源使用情况', '查看电脑配置信息',
            '获取桌面完整路径', '设置主人电脑系统深浅色主题', '更换桌面壁纸',
            '自动搜索并打开软件程序'
        ],
        'wechat': [
            '向微信指定联系人发送内容', '向微信联系人发送指定文件',
            '向微信指定联系人发送复制的内容'
        ],
        'api': [
            '获取心灵毒鸡汤', '查询抖音热榜', '获取随机一言', '获取舔狗日记',
            '查询星座运势', '运势抽签', '查询三大平台热点', '获取名人名言',
            '获取每日一句', '获取绕口令', '查询油价', '获取新年祝福语',
            '获取今日电影票房', '获取脑筋急转弯', '每日早报', '今天吃什么',
            '搜索百度百科', '获取历史上的今天', '获取万年历', '获取深证成指',
            '查询个股行情', '查询公司基本面', '查询高铁票', '获取回声洞',
            '推送巴法消息'
        ],
        'control': [
            '让豆包Ai做某事', '让KimiAi做某事', 'PPT_上一页或上一步',
            'PPT_下一页或下一步', 'PPT_结束放映', 'PPT_从当页开始放映',
            'PPT_从头放映', '在文档上查找内容'
        ],
        'music': [
            '洛雪音乐_搜索并播放音乐', '洛雪音乐_暂停或继续播放音乐',
            '洛雪音乐_上一首音乐', '洛雪音乐_下一首音乐'
        ]
    }
    return jsonify({'success': True, 'tools': tools})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
