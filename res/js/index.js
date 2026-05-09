// ==================== 高级设置功能 ====================

// 帮助弹窗
const 帮助弹窗 = document.getElementById('帮助弹窗');
const 帮助弹窗标题 = document.getElementById('帮助弹窗标题');
const 帮助弹窗正文 = document.getElementById('帮助弹窗正文');

// 帮助说明内容
const 帮助内容库 = {
    'remote-addr': {
        标题: '远程连接地址',
        正文: `<strong>功能说明：</strong><br><br>
远程连接功能让你在任何地方、任何设备上操控你的 Termux 终端。<br><br>
<strong>通俗理解：</strong><br>
就像用电脑远程控制另一台电脑一样，这里是用手机浏览器（或者其他设备）远程操控你手机上正在运行的 Termux，执行命令、查看文件、管理服务器，所有操作实时同步。<br><br>
<strong>典型场景：</strong><br>
• 躺在沙发上用平板敲代码，手机在充电<br>
• 分享一个临时地址给朋友演示你的项目<br>
• 在公司电脑上连接家里的 Termux 服务器<br>
• 上课时手机运行程序，用电脑大屏查看结果<br><br>
<strong>如何获取地址：</strong><br>
1. 运行 <code>closh</code> 命令启动 Cloudflare 快速隧道<br>
2. 隧道启动后会显示一个 https://xxx.trycloudflare.com 地址<br>
3. 将该地址粘贴到此处 → 点击「连接」即可<br><br>
<strong>支持格式：</strong><br>
• ws://192.168.1.5:8081 （局域网）<br>
• wss://你的域名.com （公网）<br>
• https://xxx.trycloudflare.com （自动转换）<br><br>
<strong>安全提醒：</strong><br>
临时隧道地址每次启动都会变化，停止后立即失效。建议仅分享给可信任的人。`
    },
    'reset': {
        标题: '服务器脚本重置',
        正文: `<strong>功能说明：</strong><br><br>
删除所有会话历史记录和服务端配置，恢复初始状态。<br><br>
<strong>会清除：</strong><br>
• 所有会话记录<br>
• 自定义的会话名称<br>
• 历史命令缓存<br><br>
<strong>不会清除：</strong><br>
• 你的 Termux 系统文件<br>
• 个人数据和软件包<br><br>
<strong>使用场景：</strong>想清理干净重新开始。`
    },
    'keepalive': {
        标题: '本地服务保活',
        正文: `<strong>功能说明：</strong><br><br>
防止 Android 系统杀掉 Termux 后台进程，保证服务器一直运行。<br><br>
<strong>操作步骤：</strong><br>
1. 打开系统「设置」<br>
2. 进入「应用」→「Termux」<br>
3. 点击「电池」→ 选择<strong>「无限制」</strong><br>
4. 返回应用设置，开启「自启动」权限<br><br>
<strong>进阶方案：</strong><br>
可用shizuku实现后台保活`
    },
    'remote-connect': {
        标题: '远程服务连接',
        正文: `<strong>功能说明：</strong><br><br>
让其他设备通过网络连接到你手机的 Termux 终端。<br><br>
<strong>局域网连接：</strong><br>
1. 查看服务地址（如 ws://192.168.1.5:8081）<br>
2. 另一设备浏览器打开前端页面<br>
3. 在高级设置中输入服务端地址<br><br>
<strong>公网连接：</strong><br>
需要内网穿透工具（frp/nps/Cloudflare Tunnel）。<br><br>
<strong>安全提醒：</strong>公网暴露有风险，建议使用Cloudflare Tunnel加密。`
    },
    'autostart': {
        标题: '开机自启服务',
        正文: `<strong>功能说明：</strong><br><br>
让 Termux 服务器在手机开机后自动启动。<br><br>
<strong>方法一（推荐）：</strong><br>
1. 安装 Termux:Boot 插件（F-Droid）<br>
2. 创建启动脚本：<br>
<code>mkdir -p ~/.termux/boot/</code><br>
<code>echo 'node ~/termux-server/server.js &' > ~/.termux/boot/start.sh</code><br><br>
<strong>方法二：</strong><br>
使用 MacroDroid / Tasker 自动化工具，监听开机广播后执行 Termux 命令。`
    }
};

// 显示帮助弹窗
function 显示帮助弹窗(key) {
    const info = 帮助内容库[key];
    if (info) {
        帮助弹窗标题.innerText = info.标题;
        帮助弹窗正文.innerHTML = info.正文;
        帮助弹窗.classList.add('打开');
    }
}

// 关闭帮助弹窗
document.getElementById('关闭帮助弹窗').onclick = () => {
    帮助弹窗.classList.remove('打开');
};
帮助弹窗.onclick = (e) => {
    if (e.target === 帮助弹窗) 帮助弹窗.classList.remove('打开');
};

// 绑定所有 [?] 帮助按钮
document.querySelectorAll('.高级选项帮助').forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        const helpKey = btn.dataset.help;
        显示帮助弹窗(helpKey);
    };
});

// ==================== 远程地址连接 ====================
const 远程地址输入 = document.getElementById('远程地址输入');
const 当前服务地址显示 = document.getElementById('当前服务地址');

document.getElementById('应用远程地址').onclick = () => {
    let 新地址 = 远程地址输入.value.trim();
    
    if (!新地址) {
        alert('请输入地址');
        return;
    }
    
    if (新地址.startsWith('https://')) {
        新地址 = 新地址.replace('https://', 'wss://');
    } else if (新地址.startsWith('http://')) {
        新地址 = 新地址.replace('http://', 'ws://');
    }
    
    新地址 = 新地址.replace(/\/+$/, '');
    
    if (!新地址.startsWith('ws://') && !新地址.startsWith('wss://')) {
        alert('地址格式不正确。');
        return;
    }
    
    当前服务地址显示.textContent = 新地址;
    连接服务器地址(新地址);
};

let 自动重连定时器 = null;
let 重连次数 = 0;
let 当前连接地址 = 'ws://127.0.0.1:8081';

function 连接服务器() {
    连接服务器地址('ws://127.0.0.1:8081');
}

function 连接服务器地址(地址) {
    if (自动重连定时器) {
        clearTimeout(自动重连定时器);
        自动重连定时器 = null;
    }
    
    当前连接地址 = 地址;
    
    if (ws) {
        try { ws.close(); } catch(e) {}
        ws = null;
    }
    
    输出框.value += '[系统] 正在连接 ' + 地址 + '...\n';
    
    ws = new WebSocket(地址);
    
    ws.onopen = () => { 
        输出框.value += '[系统] 已连接到 ' + 地址 + '\n'; 
        当前服务地址显示.textContent = 地址;
        重连次数 = 0;
        显示欢迎弹窗();
        刷新会话列表(); 
    };
    
    ws.onmessage = (e) => {
        const 消息 = JSON.parse(e.data);
        switch (消息.type) {
            case 'session_list':
                更新会话列表UI(消息.sessions, 消息.currentSessionId);
                break;
            case 'session_history':
                加载会话历史(消息.history);
                break;
            case 'terminal_output':
                输出框.value += 消息.output;
                输出框容器.scrollTop = 输出框容器.scrollHeight;
                break;
            case 'command_result':
                输出框.value += '\n[' + 消息.timestamp + '] $ ' + 消息.command + '\n' + 消息.output + '\n';
                输出框容器.scrollTop = 输出框容器.scrollHeight;
                break;
        }
    };
    
    ws.onclose = () => { 
        输出框.value += '[系统] 连接断开\n';
        if (重连次数 < 10) {
            重连次数++;
            输出框.value += '[系统] 将在3秒后自动重连...(' + 重连次数 + '/10)\n';
            自动重连定时器 = setTimeout(() => {
                连接服务器地址(当前连接地址);
            }, 3000);
        } else {
            输出框.value += '[系统] 重连次数已达上限，请手动点击连接\n';
        }
    };
    
    ws.onerror = () => { 
        输出框.value += '[系统] 连接失败，请确保服务器已启动\n';
    };
}

// ==================== 重置脚本功能 ====================
const 重置脚本按钮 = document.getElementById('重置脚本按钮');
const 重置按钮文字 = document.querySelector('.重置按钮文字');
const 重置按钮图标 = document.querySelector('.重置按钮图标');
let 重置超时定时器 = null;
let 重置恢复定时器 = null;

if (重置脚本按钮) {
    重置脚本按钮.onclick = () => {
        if (重置脚本按钮.classList.contains('禁用')) return;
        
        重置脚本按钮.classList.add('禁用');
        重置按钮文字.textContent = '重置中';
        重置按钮图标.className = '重置按钮图标 加载中';
        重置按钮图标.style.display = 'inline-block';
        
        let 请求成功 = false;
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'reset_server' }));
            
            const 响应处理 = (e) => {
                const 消息 = JSON.parse(e.data);
                if (消息.type === 'reset_success') {
                    请求成功 = true;
                    重置成功();
                    ws.removeEventListener('message', 响应处理);
                } else if (消息.type === 'reset_failed') {
                    重置失败();
                    ws.removeEventListener('message', 响应处理);
                }
            };
            
            ws.addEventListener('message', 响应处理);
            
            重置超时定时器 = setTimeout(() => {
                if (!请求成功) {
                    ws.removeEventListener('message', 响应处理);
                    重置失败();
                }
            }, 5000);
        } else {
            setTimeout(() => 重置失败(), 800);
        }
    };
}

function 重置成功() {
    clearTimeout(重置超时定时器);
    重置按钮文字.textContent = '已重置';
    重置按钮图标.className = '重置按钮图标 成功';
    重置按钮图标.style.display = 'inline-block';
    重置按钮文字.style.color = '#00ff88';
    输出框.value = '';
    输出框.value += '[系统] 服务器已重置，连接已断开...\n';
    if (ws) { try { ws.close(); } catch(e) {} ws = null; }
    setTimeout(() => { 恢复重置按钮(); 连接服务器(); }, 3000);
}

function 重置失败() {
    clearTimeout(重置超时定时器);
    重置按钮文字.textContent = '超时';
    重置按钮图标.className = '重置按钮图标 失败';
    重置按钮图标.style.display = 'inline-block';
    重置按钮文字.style.color = '#ff4444';
    重置恢复定时器 = setTimeout(() => { 恢复重置按钮(); }, 2000);
}

function 恢复重置按钮() {
    clearTimeout(重置恢复定时器);
    重置按钮文字.textContent = '重置';
    重置按钮文字.style.color = '#ff8888';
    重置按钮图标.style.display = 'none';
    重置按钮图标.className = '重置按钮图标';
    重置脚本按钮.classList.remove('禁用');
}

// 教程链接
document.getElementById('保活教程').onclick = () => 显示帮助弹窗('keepalive');
document.getElementById('远程教程').onclick = () => 显示帮助弹窗('remote-connect');
document.getElementById('自启教程').onclick = () => 显示帮助弹窗('autostart');

// ==================== 自定义确认弹窗 ==================
const 确认弹窗 = document.getElementById('确认弹窗');
const 确认弹窗消息 = document.getElementById('确认弹窗消息');
const 确认弹窗确认 = document.getElementById('确认弹窗确认');
const 确认弹窗取消 = document.getElementById('确认弹窗取消');

let 确认弹窗回调 = null;

function 显示确认弹窗(消息, 确认回调) {
    确认弹窗消息.innerText = 消息;
    确认弹窗回调 = 确认回调;
    确认弹窗.classList.add('打开');
}

function 关闭确认弹窗(是否确认) {
    确认弹窗.classList.remove('打开');
    if (确认弹窗回调) {
        确认弹窗回调(是否确认);
        确认弹窗回调 = null;
    }
}

if (确认弹窗确认) 确认弹窗确认.onclick = () => 关闭确认弹窗(true);
if (确认弹窗取消) 确认弹窗取消.onclick = () => 关闭确认弹窗(false);
if (确认弹窗) 确认弹窗.onclick = (e) => { if (e.target === 确认弹窗) 关闭确认弹窗(false); };

// ==================== 弹窗控制 ====================
const 欢迎弹窗 = document.getElementById('欢迎弹窗');
const 高级弹窗 = document.getElementById('高级弹窗');
const 关于弹窗 = document.getElementById('关于弹窗');
const 高级按钮 = document.getElementById('高级按钮');
const 关于按钮 = document.getElementById('关于按钮');

let 欢迎弹窗已显示 = false;

function 显示欢迎弹窗() {
    if (欢迎弹窗已显示) return;
    欢迎弹窗.classList.add('打开');
    欢迎弹窗已显示 = true;
    欢迎弹窗.onclick = (e) => { if (e.target === 欢迎弹窗) 欢迎弹窗.classList.remove('打开'); };
    setTimeout(() => { 欢迎弹窗.classList.remove('打开'); }, 8000);
}

if (高级按钮) 高级按钮.onclick = () => 高级弹窗.classList.add('打开');
if (关于按钮) 关于按钮.onclick = () => 关于弹窗.classList.add('打开');

const 关闭高级弹窗 = document.getElementById('关闭高级弹窗');
if (关闭高级弹窗) {
    关闭高级弹窗.onclick = () => 高级弹窗.classList.remove('打开');
    高级弹窗.onclick = (e) => { if (e.target === 高级弹窗) 高级弹窗.classList.remove('打开'); };
}

const 关闭关于弹窗 = document.getElementById('关闭关于弹窗');
if (关闭关于弹窗) {
    关闭关于弹窗.onclick = () => 关于弹窗.classList.remove('打开');
    关于弹窗.onclick = (e) => { if (e.target === 关于弹窗) 关于弹窗.classList.remove('打开'); };
}

// ==================== 底部按钮栏 ====================
const 底部按钮栏 = document.querySelector('.底部按钮栏');
const 输入框 = document.getElementById('输出框');

if (输入框 && 底部按钮栏) {
    底部按钮栏.classList.remove('隐藏');
    
    if (window.visualViewport) {
        const 初始高度 = window.visualViewport.height;
        window.visualViewport.addEventListener('resize', () => {
            const 当前高度 = window.visualViewport.height;
            if (当前高度 < 初始高度 - 150) {
                底部按钮栏.classList.add('隐藏');
                输入框.style.height = '85vh';
            } else {
                底部按钮栏.classList.remove('隐藏');
                输入框.style.height = '100vh';
            }
        });
    }
    
    输入框.addEventListener('focus', () => setTimeout(() => 底部按钮栏.classList.add('隐藏'), 100));
    输入框.addEventListener('blur', () => setTimeout(() => 底部按钮栏.classList.remove('隐藏'), 100));
}

// ==================== 获取元素 ====================
const 抽屉 = document.getElementById('抽屉');
const 遮罩层 = document.getElementById('遮罩层');
const 键盘按钮 = document.getElementById('键盘按钮');
const 会话按钮 = document.getElementById('会话');
const 设置按钮 = document.getElementById('设置');
const 设置面板 = document.getElementById('设置面板');
const 输出框 = document.getElementById('输出框');
const 输出框容器 = document.getElementById('输出框容器');
const 背景图片元素 = document.getElementById('背景图片');
const 键盘抽屉 = document.getElementById('键盘抽屉');
const 键盘遮罩 = document.getElementById('键盘遮罩');

// ==================== 键盘抽屉功能 ====================
let 键盘修饰键状态 = { Ctrl: false, Alt: false };
let 键盘已打开 = false;

function 打开键盘() {
    if (键盘已打开) return;
    键盘抽屉.classList.add('打开');
    键盘遮罩.classList.add('显示');
    底部按钮栏.classList.add('隐藏');
    键盘已打开 = true;
    
    // 清屏
    输出框.value = '';
    
    // 弹出键盘时自动在底部创建空行
    键盘弹出空行();
}

function 关闭键盘() {
    键盘抽屉.classList.remove('打开');
    键盘遮罩.classList.remove('显示');
    底部按钮栏.classList.remove('隐藏');
    键盘已打开 = false;
    键盘修饰键状态.Ctrl = false;
    键盘修饰键状态.Alt = false;
    document.querySelectorAll('.键位.修饰键').forEach(btn => btn.classList.remove('激活'));
// 关闭键盘时清理多余空行
    键盘关闭清理();
}

document.querySelectorAll('.键位').forEach(键位 => {
    键位.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });
    键位.addEventListener('touchstart', (e) => {
        e.preventDefault(); e.stopPropagation();
        处理键盘按键(键位.dataset.key);
    });
    键位.addEventListener('mousedown', (e) => {
        e.preventDefault(); e.stopPropagation();
        处理键盘按键(键位.dataset.key);
    });
});

function 处理键盘按键(key) {
    switch(key) {
        case 'CTRL':
            键盘修饰键状态.Ctrl = !键盘修饰键状态.Ctrl;
            const ctrlBtn = document.querySelector('[data-key="CTRL"]');
            if (ctrlBtn) ctrlBtn.classList.toggle('激活', 键盘修饰键状态.Ctrl);
            break;
        case 'ALT':
            键盘修饰键状态.Alt = !键盘修饰键状态.Alt;
            const altBtn = document.querySelector('[data-key="ALT"]');
            if (altBtn) altBtn.classList.toggle('激活', 键盘修饰键状态.Alt);
            break;
        case 'TAB': 发送按键('\t'); break;
        case 'ENTER': 发送按键('\n'); 执行当前行命令(); break;
        case 'BACKSPACE': 发送按键('\b'); break;
        case 'ESC': 发送按键('\x1b'); break;
        case 'UP': 发送按键('\x1b[A'); break;
        case 'DOWN': 发送按键('\x1b[B'); break;
        case 'LEFT': 发送按键('\x1b[D'); break;
        case 'RIGHT': 发送按键('\x1b[C'); break;
        case 'HOME': 发送按键('\x1b[H'); break;
        case 'END': 发送按键('\x1b[F'); break;
        case 'HIDE': 关闭键盘(); break;
        default:
            if (键盘修饰键状态.Ctrl) {
                const ctrlMap = {a:'\x01',b:'\x02',c:'\x03',d:'\x04',e:'\x05',f:'\x06',g:'\x07',h:'\x08',i:'\t',j:'\n',k:'\x0b',l:'\x0c',m:'\r',n:'\x0e',o:'\x0f',p:'\x10',q:'\x11',r:'\x12',s:'\x13',t:'\x14',u:'\x15',v:'\x16',w:'\x17',x:'\x18',y:'\x19',z:'\x1a'};
                const ctrlChar = ctrlMap[key.toLowerCase()];
                if (ctrlChar) 发送按键(ctrlChar);
            } else if (键盘修饰键状态.Alt) {
                发送按键('\x1b' + key);
            } else {
                发送按键(key);
            }
    }
}

function 发送按键(key) {
    if (ws && ws.readyState === WebSocket.OPEN && 当前会话ID) {
        ws.send(JSON.stringify({type: 'key_input', sessionId: 当前会话ID, key: key}));
    }
    if (key === '\b') {
        const pos = 输出框.selectionStart;
        if (pos > 0) {
            输出框.value = 输出框.value.slice(0, pos - 1) + 输出框.value.slice(输出框.selectionEnd);
            输出框.selectionStart = 输出框.selectionEnd = pos - 1;
        }
    } else if (key === '\n' || key === '\r') {
        const pos = 输出框.selectionStart;
        输出框.value = 输出框.value.slice(0, pos) + '\n' + 输出框.value.slice(输出框.selectionEnd);
        输出框.selectionStart = 输出框.selectionEnd = pos + 1;
    } else if (key.length === 1 && key.charCodeAt(0) >= 32) {
        const pos = 输出框.selectionStart;
        输出框.value = 输出框.value.slice(0, pos) + key + 输出框.value.slice(输出框.selectionEnd);
        输出框.selectionStart = 输出框.selectionEnd = pos + 1;
    }
    输出框容器.scrollTop = 输出框容器.scrollHeight;
}

function 执行当前行命令() {
    const 当前值 = 输出框.value;
    const 行列表 = 当前值.split('\n');
    let 最后行 = 行列表[行列表.length - 1];
    if (!最后行.trim() && 行列表.length > 1) 最后行 = 行列表[行列表.length - 2];
    let 命令 = 最后行.replace(/^.*[~$]\s*/, '').trim();
    if (命令) 发送命令(命令);
}

if (键盘遮罩) {
    键盘遮罩.addEventListener('touchstart', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.target === 键盘遮罩) 关闭键盘();
    });
    键盘遮罩.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target === 键盘遮罩) 关闭键盘();
    });
}

if (键盘抽屉) {
    键盘抽屉.addEventListener('touchstart', (e) => e.stopPropagation());
    键盘抽屉.addEventListener('click', (e) => e.stopPropagation());
}

// ==================== 设置功能 ====================
const 背景图片路径输入 = document.getElementById('背景图片路径');
const 应用背景图片按钮 = document.getElementById('应用背景图片');
const 重置背景图片按钮 = document.getElementById('重置背景图片');

if (应用背景图片按钮) 应用背景图片按钮.onclick = () => { if (背景图片路径输入.value) 背景图片元素.src = 背景图片路径输入.value; };
if (重置背景图片按钮) 重置背景图片按钮.onclick = () => { 背景图片路径输入.value = 'res/2.jpg'; 背景图片元素.src = 'res/2.jpg'; };

// ==================== 颜色/字体弹窗 ====================
const 预设颜色列表 = ['#000000', '#ffffff', '#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0088ff', '#8800ff', '#ff00ff'];
const 预设图片列表 = ['res/1.jpg','res/2.jpg','res/3.jpg','res/4.jpg','res/5.jpg','res/6.jpg','res/7.jpg','res/8.jpg'];
const 预设字体列表 = [
    { name: '等宽(默认)', value: 'monospace', preview: 'ABCD 0123' },
    { name: '思源黑体', value: "'Noto Sans SC', sans-serif", preview: 'ABCD 0123' },
    { name: 'Roboto Mono', value: "'Roboto Mono', monospace", preview: 'ABCD 0123' },
    { name: '像素风格', value: "'Press Start 2P', cursive", preview: 'ABCD 0123' },
    { name: 'Courier New', value: "'Courier New', monospace", preview: 'ABCD 0123' }
];

let 当前选择的背景 = '#000000';
let 当前选择的字体颜色 = '#ffffff';
let 当前选择的字体 = 'monospace';

const 背景弹窗 = document.getElementById('背景颜色弹窗');
const 字体弹窗颜色 = document.getElementById('字体颜色弹窗');
const 字体弹窗 = document.getElementById('字体弹窗');
const 十六进制输入 = document.getElementById('十六进制输入');
const 字体十六进制输入 = document.getElementById('字体十六进制输入');
const 自定义字体输入 = document.getElementById('自定义字体输入');
const 关闭字体弹窗按钮 = document.getElementById('关闭字体弹窗');

function 生成颜色网格(容器id, 是背景) {
    const 容器 = document.getElementById(容器id);
    if (!容器) return;
    容器.innerHTML = '';
    预设颜色列表.forEach(颜色 => {
        const 颜色块 = document.createElement('div');
        颜色块.className = '颜色块';
        颜色块.style.backgroundColor = 颜色;
        颜色块.onclick = () => {
            容器.querySelectorAll('.颜色块').forEach(el => el.classList.remove('选中'));
            颜色块.classList.add('选中');
            if (是背景) { 当前选择的背景 = 颜色; 十六进制输入.value = 颜色; }
            else { 当前选择的字体颜色 = 颜色; 字体十六进制输入.value = 颜色; }
        };
        容器.appendChild(颜色块);
    });
}

function 生成图片网格() {
    const 容器 = document.getElementById('预设图片网格');
    if (!容器) return;
    容器.innerHTML = '';
    预设图片列表.forEach(图片路径 => {
        const 图片块 = document.createElement('img');
        图片块.className = '图片块'; 图片块.src = 图片路径;
        图片块.onclick = () => {
            容器.querySelectorAll('.图片块').forEach(el => el.classList.remove('选中'));
            图片块.classList.add('选中');
            当前选择的背景 = 图片路径; 十六进制输入.value = '';
        };
        容器.appendChild(图片块);
    });
}

function 生成字体列表() {
    const 容器 = document.getElementById('预设字体列表');
    if (!容器) return;
    容器.innerHTML = '';
    预设字体列表.forEach(字体 => {
        const 字体卡片 = document.createElement('div');
        字体卡片.className = '字体卡片';
        字体卡片.innerHTML = '<div class="字体名称" style="font-family: ' + 字体.value + ';">' + 字体.name + '</div><div class="字体预览" style="font-family: ' + 字体.value + ';">' + 字体.preview + '</div>';
        字体卡片.onclick = () => {
            容器.querySelectorAll('.字体卡片').forEach(el => el.classList.remove('选中'));
            字体卡片.classList.add('选中');
            当前选择的字体 = 字体.value; 自定义字体输入.value = 字体.value;
            输出框.style.fontFamily = 当前选择的字体;
        };
        容器.appendChild(字体卡片);
    });
}

document.getElementById('打开背景颜色选择器').onclick = () => { 生成颜色网格('预设颜色网格', true); 生成图片网格(); 背景弹窗.classList.add('打开'); };
document.getElementById('打开字体颜色选择器').onclick = () => { 生成颜色网格('字体预设颜色网格', false); 字体弹窗颜色.classList.add('打开'); };
document.getElementById('打开字体选择器').onclick = () => { 生成字体列表(); 字体弹窗.classList.add('打开'); };
if (关闭字体弹窗按钮) 关闭字体弹窗按钮.onclick = () => 字体弹窗.classList.remove('打开');

document.getElementById('应用自定义字体').onclick = () => {
    let 字体值 = 自定义字体输入.value.trim();
    if (字体值) {
        if (字体值.startsWith('http') && 字体值.includes('fonts.googleapis.com')) {
            const 新链接 = document.createElement('link');
            新链接.rel = 'stylesheet'; 新链接.href = 字体值;
            document.head.appendChild(新链接);
            const 匹配 = 字体值.match(/family=([^:&]+)/);
            if (匹配) {
                let 字体名 = decodeURIComponent(匹配[1].replace(/\+/g, ' '));
                当前选择的字体 = "'" + 字体名 + "', cursive";
            }
        } else { 当前选择的字体 = 字体值; }
        输出框.style.fontFamily = 当前选择的字体;
    }
    字体弹窗.classList.remove('打开');
};

[背景弹窗, 字体弹窗颜色, 字体弹窗].forEach(弹窗 => {
    if (弹窗) 弹窗.onclick = (e) => { if (e.target === 弹窗) 弹窗.classList.remove('打开'); }
});

document.getElementById('确认背景颜色').onclick = () => {
    if (十六进制输入.value && /^#[0-9A-Fa-f]{6}$/.test(十六进制输入.value)) 当前选择的背景 = 十六进制输入.value;
    背景弹窗.classList.remove('打开');
};

document.getElementById('确认字体颜色').onclick = () => {
    if (字体十六进制输入.value && /^#[0-9A-Fa-f]{6}$/.test(字体十六进制输入.value)) 当前选择的字体颜色 = 字体十六进制输入.value;
    字体弹窗颜色.classList.remove('打开');
};

document.getElementById('应用主题').onclick = () => {
    if (当前选择的背景.startsWith('#')) {
        输出框.style.backgroundColor = 当前选择的背景; 输出框.style.backgroundImage = 'none';
    } else {
        输出框.style.backgroundColor = 'transparent';
        输出框.style.backgroundImage = 'url(' + 当前选择的背景 + ')';
        输出框.style.backgroundSize = 'cover'; 输出框.style.backgroundPosition = 'center';
    }
    输出框.style.color = 当前选择的字体颜色;
    输出框.style.caretColor = 当前选择的字体颜色;
    输出框.style.fontFamily = 当前选择的字体;
};

document.getElementById('重置主题').onclick = () => {
    当前选择的背景 = '#000000'; 当前选择的字体颜色 = '#ffffff'; 当前选择的字体 = 'monospace';
    输出框.style.backgroundColor = 'transparent'; 输出框.style.backgroundImage = 'none';
    输出框.style.color = 'white'; 输出框.style.caretColor = 'white'; 输出框.style.fontFamily = 'monospace';
    十六进制输入.value = ''; 字体十六进制输入.value = ''; 自定义字体输入.value = '';
};

// ==================== 双指缩放 ====================
let 初始距离 = 0, 初始字体大小 = 8;
输出框.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        初始距离 = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        初始字体大小 = parseInt(输出框.style.fontSize) || 8;
    }
});
输出框.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        let 新距离 = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        let 新字体大小 = 初始字体大小 * (新距离 / 初始距离);
        新字体大小 = Math.min(32, Math.max(8, 新字体大小));
        输出框.style.fontSize = 新字体大小 + 'px';
    }
});

// ==================== 自定义输入弹窗 ==================
const 输入弹窗 = document.getElementById('输入弹窗');
const 输入弹窗标题 = document.getElementById('输入弹窗标题');
const 输入弹窗输入框 = document.getElementById('输入弹窗输入框');
const 输入弹窗确认 = document.getElementById('输入弹窗确认');
const 输入弹窗取消 = document.getElementById('输入弹窗取消');

let 输入弹窗回调 = null;

function 显示输入弹窗(标题, 默认值, 回调) {
    输入弹窗标题.innerText = 标题;
    输入弹窗输入框.value = 默认值 || '';
    输入弹窗回调 = 回调;
    输入弹窗.classList.add('打开');
    输入弹窗输入框.focus();
    const 回车处理 = (e) => { if (e.key === 'Enter') { 输入弹窗输入框.removeEventListener('keydown', 回车处理); 关闭输入弹窗(true); } };
    输入弹窗输入框.addEventListener('keydown', 回车处理);
}

function 关闭输入弹窗(是否确认) {
    输入弹窗.classList.remove('打开');
    if (输入弹窗回调) { 输入弹窗回调(是否确认 ? 输入弹窗输入框.value : null); 输入弹窗回调 = null; }
}

if (输入弹窗确认) 输入弹窗确认.onclick = () => 关闭输入弹窗(true);
if (输入弹窗取消) 输入弹窗取消.onclick = () => 关闭输入弹窗(false);
if (输入弹窗) 输入弹窗.onclick = (e) => { if (e.target === 输入弹窗) 关闭输入弹窗(false); };

// ==================== WebSocket 会话管理 ====================
let ws = null;
let 当前会话ID = null;

const 会话列表容器 = document.getElementById('会话列表');
const 会话数量显示 = document.getElementById('会话数量');

function 刷新会话列表() { 
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'get_sessions' })); 
}

function 切换会话(id) { 
    if (ws && ws.readyState === WebSocket.OPEN) { 
        当前会话ID = parseInt(id); 
        ws.send(JSON.stringify({ type: 'switch_session', sessionId: parseInt(id) })); 
    } 
}

function 创建会话(名称) { 
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'create_session', name: 名称 })); 
}

function 删除会话(id) { 
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'delete_session', sessionId: parseInt(id) })); 
}

function 发送命令(命令) { 
    if (ws && ws.readyState === WebSocket.OPEN && 当前会话ID) {
        ws.send(JSON.stringify({ type: 'execute', sessionId: 当前会话ID, command: 命令 })); 
    } else if (!当前会话ID) {
        输出框.value += '\n[错误] 请先选择一个会话\n';
    }
}

function 更新会话列表UI(会话列表, 当前ID) {
    if (!会话列表容器) return;
    会话列表容器.innerHTML = '';
    if (会话数量显示) 会话数量显示.innerText = 会话列表.length;
    
    会话列表.forEach(会话 => {
        const li = document.createElement('li');
        const isCurrent = (会话.id === 当前ID);
        li.style.background = isCurrent ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)';
        li.style.borderLeft = isCurrent ? '3px solid #00ff00' : 'none';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.innerHTML = '<span class="会话名称" data-id="' + 会话.id + '" style="flex:1; cursor:pointer;">' + 会话.name + '</span><button class="删除会话按钮" data-id="' + 会话.id + '" style="background:rgba(0,0,0,0.2); border:none; border-radius:8px; padding:4px 12px; color:white; cursor:pointer; font-size:12px;">删除</button>';
        会话列表容器.appendChild(li);
    });
    
    document.querySelectorAll('.删除会话按钮').forEach(btn => {
        btn.onclick = (e) => { 
            e.stopPropagation(); 
            显示确认弹窗('确定要删除这个会话吗？', (确认) => { if (确认) 删除会话(parseInt(btn.dataset.id)); });
        };
    });
    
    document.querySelectorAll('.会话名称').forEach(name => {
        name.onclick = (e) => { e.stopPropagation(); 切换会话(parseInt(name.dataset.id)); };
    });
    
    当前会话ID = 当前ID;
}

function 加载会话历史(历史记录) {
    if (历史记录.length === 0) {
        输出框.value = '[会话为空] 输入命令后按回车开始\n';
    } else {
        历史记录.forEach(记录 => {
            if (记录.command === '' && 记录.output) 输出框.value += 记录.output;
            else if (记录.command) 输出框.value += '[' + 记录.timestamp + '] $ ' + 记录.command + '\n' + 记录.output + '\n';
        });
    }
    输出框容器.scrollTop = 输出框容器.scrollHeight;
}

const 添加会话抽屉按钮 = document.getElementById('添加会话按钮');
if (添加会话抽屉按钮) {
    添加会话抽屉按钮.onclick = () => { 
        显示输入弹窗('添加会话', '新会话', (结果) => {
            if (结果 && 结果.trim()) 创建会话(结果.trim());
            else if (结果 === '') 创建会话('新会话');
        });
    };
}

// 回车发送命令
输出框.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        
        // ---- 新增：执行前，先清理所有无用的尾部空行 ----
        // 正则 \n+$ 匹配文本最末尾一个或多个连续的换行符，全部删掉
        输出框.value = 输出框.value.replace(/\n+$/, '');
        // ------------------------------------------------

        const 当前值 = 输出框.value;
        const 光标位置 = 输出框.selectionStart;
        const 行开始 = 当前值.lastIndexOf('\n', 光标位置 - 1) + 1;
        let 命令 = 当前值.substring(行开始, 光标位置).trim();
        
        命令 = 命令.replace(/^[~$]\s*/, '').replace(/^\$\s*/, '');
        if (命令) 发送命令(命令);
        
        // 发送命令后加一个换行确认
        输出框.value += '\n';
        
        // 让滚动条自动滚到底部
        输出框.scrollTop = 输出框.scrollHeight;
    }
});

// ==================== 输出框滚动优化 ====================
// 强制始终可滚动（即使内容不足一屏也能向上滚出空白）
输出框.style.overflowY = 'scroll';
输出框.style['-webkit-overflow-scrolling'] = 'touch';

// ==================== 原有UI功能 ====================
document.querySelectorAll('#设置面板 input, #设置面板 button, #设置面板 label, #设置面板 .设置选项').forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
    el.addEventListener('touchstart', (e) => e.stopPropagation());
});

function 打开抽屉() { 
    抽屉.classList.add('打开'); 
    遮罩层.classList.add('显示'); 
    遮罩层.style.zIndex = '9999';
    抽屉.style.zIndex = '10000';
    刷新会话列表(); 
}

function 关闭抽屉() { 抽屉.classList.remove('打开'); 遮罩层.classList.remove('显示'); }
function 打开设置() { 设置面板.classList.add('打开'); }
function 关闭设置() { 设置面板.classList.remove('打开'); }

if (设置按钮) 设置按钮.onclick = (e) => { e.stopPropagation(); 打开设置(); };
if (键盘按钮) 键盘按钮.onclick = (e) => { e.stopPropagation(); 打开键盘(); };
if (会话按钮) 会话按钮.onclick = (e) => { e.stopPropagation(); 打开抽屉(); };

// 滑动打开抽屉
let 滑动起始X = 0, 滑动起始Y = 0;
if (底部按钮栏) {
    底部按钮栏.addEventListener('touchstart', (e) => {
        滑动起始X = e.touches[0].clientX; 滑动起始Y = e.touches[0].clientY;
    });
    底部按钮栏.addEventListener('touchend', (e) => {
        const 结束X = e.changedTouches[0].clientX;
        const 结束Y = e.changedTouches[0].clientY;
        if ((结束X - 滑动起始X) > 50 && Math.abs(结束Y - 滑动起始Y) < 30) 打开抽屉();
    });
}

if (设置面板) 设置面板.onclick = 关闭设置;
if (遮罩层) 遮罩层.onclick = (e) => { if (e.target === 遮罩层) 关闭抽屉(); };

document.onkeydown = (e) => {
    if (e.key === 'Escape') {
        if (欢迎弹窗 && 欢迎弹窗.classList.contains('打开')) 欢迎弹窗.classList.remove('打开');
        else if (背景弹窗 && 背景弹窗.classList.contains('打开')) 背景弹窗.classList.remove('打开');
        else if (字体弹窗颜色 && 字体弹窗颜色.classList.contains('打开')) 字体弹窗颜色.classList.remove('打开');
        else if (字体弹窗 && 字体弹窗.classList.contains('打开')) 字体弹窗.classList.remove('打开');
        else if (高级弹窗 && 高级弹窗.classList.contains('打开')) 高级弹窗.classList.remove('打开');
        else if (关于弹窗 && 关于弹窗.classList.contains('打开')) 关于弹窗.classList.remove('打开');
        else if (键盘抽屉 && 键盘抽屉.classList.contains('打开')) 关闭键盘();
        else if (设置面板 && 设置面板.classList.contains('打开')) 关闭设置();
        else if (抽屉 && 抽屉.classList.contains('打开')) 关闭抽屉();
    }
};
// ==================== 输出框底部自动填充空行 ====================
const 最大空行数 = 8;
let 用户正在手动滚动 = false;
let 滚动定时器 = null;

// 用户触摸 → 标记为手动
输出框.addEventListener('touchstart', () => {
    用户正在手动滚动 = true;
    clearTimeout(滚动定时器);
});

// 手指离开屏幕 → 立即检查是否需要填充
输出框.addEventListener('touchend', () => {
    滚动定时器 = setTimeout(() => {
        用户正在手动滚动 = false;
        执行自动填充();
    }, 150); // 150ms 等惯性滚动停止
});

// 鼠标滚轮 → 标记手动
输出框.addEventListener('wheel', () => {
    用户正在手动滚动 = true;
    clearTimeout(滚动定时器);
    滚动定时器 = setTimeout(() => {
        用户正在手动滚动 = false;
        执行自动填充();
    }, 150);
});

function 执行自动填充() {
    const 当前滚动位置 = 输出框.scrollTop;
    const 最大滚动 = 输出框.scrollHeight - 输出框.clientHeight;
    
    if (当前滚动位置 >= 最大滚动 - 10 && 最大滚动 > 0) {
        const 光标位置 = 输出框.selectionStart;
        const 光标在末尾 = (光标位置 === 输出框.value.length);
        
        const 内容 = 输出框.value;
        let 末尾空行数 = 0;
        for (let i = 内容.length - 1; i >= 0; i--) {
            if (内容[i] === '\n') { 末尾空行数++; }
            else { break; }
        }
        
        if (末尾空行数 < 最大空行数) {
            const 去掉空行 = 内容.replace(/\n+$/, '');
            if (去掉空行.length > 0) {
                const 需要添加 = 最大空行数 - 末尾空行数;
                输出框.value += '\n'.repeat(需要添加);
                
                if (光标在末尾) {
                    输出框.selectionStart = 输出框.value.length;
                    输出框.selectionEnd = 输出框.value.length;
                } else {
                    输出框.selectionStart = 光标位置;
                    输出框.selectionEnd = 光标位置;
                }
            }
        }
    }
}

// 初始填充
setTimeout(() => {
    输出框.scrollTop = 输出框.scrollHeight;
    执行自动填充();
}, 500);

// ==================== 回车后删除多余空行 ====================
输出框.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        setTimeout(() => {
            if (输出框.value.trim().length > 0) {
                输出框.value = 输出框.value.replace(/\n{2,}$/, '\n');
                输出框.selectionStart = 输出框.value.length;
                输出框.selectionEnd = 输出框.value.length;
            }
        }, 50);
    }
});
// ==================== 全局版本号 ====================
const 当前版本号 = '1.0.2';  // 每次发布新版本时修改这里

// ==================== 更新日志功能 ====================
let 更新日志缓存 = null;
let 更新日志缓存时间 = 0;

const 更新日志弹窗 = document.getElementById('更新日志弹窗');
const 更新日志弹窗正文 = document.getElementById('更新日志弹窗正文');
const 更新日志按钮 = document.getElementById('更新日志按钮');

async function 获取更新日志() {
    // 检查缓存
    if (更新日志缓存 && 缓存间隔秒 > 0) {
        const 现在 = Date.now();
        if (现在 - 更新日志缓存时间 < 缓存间隔秒 * 1000) {
            console.log('使用更新日志缓存');
            更新日志弹窗正文.innerHTML = 更新日志缓存;
            更新日志弹窗.classList.add('打开');
            return;
        }
    }
    
    if (!可以发送请求()) {
        更新日志弹窗正文.innerHTML = '<div class="更新日志弹窗加载中" style="color:#ff8888;">请求次数已达上限<br>请在服务请求中配置 Token 或等待重置</div>';
        更新日志弹窗.classList.add('打开');
        return;
    }
    
    更新日志弹窗正文.innerHTML = '<div class="更新日志弹窗加载中">加载中...</div>';
    更新日志弹窗.classList.add('打开');
    
    try {
        const 响应 = await fetch('https://api.github.com/repos/siyecao-meng/termux-embellish/contents/Update');
        
        if (!响应.ok) throw new Error('获取文件列表失败');
        
        // 请求成功后才记录次数
        if (!用户Token && 请求上限 > 0) {
            当前周期请求数++;
            localStorage.setItem('当前周期请求数', 当前周期请求数);
            更新UI统计();
        }
        
        const 文件列表 = await 响应.json();
        
        let 版本列表 = [];
        文件列表.forEach(文件 => {
            const 文件名 = 文件.name;
            if (文件名 !== 'Update-log.txt' && 文件名 !== 'Not-updated.txt' && /^\d+\.\d+\.\d+$/.test(文件名)) {
                版本列表.push(文件名);
            }
        });
        
        版本列表.sort(比较版本号函数);
        const 最新版本 = 版本列表[版本列表.length - 1] || '1.0.0';
        
        let 日志文件 = '';
        if (比较版本号函数(当前版本号, 最新版本) >= 0) {
            日志文件 = 'Update-log.txt';
        } else {
            日志文件 = 'Not-updated.txt';
        }
        
        let 日志内容响应;
        try {
            日志内容响应 = await fetch(`https://raw.githubusercontent.com/siyecao-meng/termux-embellish/main/Update/${日志文件}`);
            
            if (!用户Token && 请求上限 > 0) {
                当前周期请求数++;
                localStorage.setItem('当前周期请求数', 当前周期请求数);
                更新UI统计();
            }
            
            if (!日志内容响应.ok) throw new Error('文件不存在');
        } catch (e) {
            日志内容响应 = await fetch(`https://raw.githubusercontent.com/siyecao-meng/termux-embellish/main/${日志文件}`);
            
            if (!用户Token && 请求上限 > 0) {
                当前周期请求数++;
                localStorage.setItem('当前周期请求数', 当前周期请求数);
                更新UI统计();
            }
        }
        
        if (!日志内容响应.ok) throw new Error('获取日志内容失败');
        
        let 日志内容 = await 日志内容响应.text();
        
        let 最终内容;
        if (日志内容.trim().startsWith('<')) {
            最终内容 = 日志内容;
        } else {
            日志内容 = 日志内容.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            日志内容 = 日志内容.replace(/\n/g, '<br>');
            最终内容 = `<div style="white-space: pre-wrap;">${日志内容}</div>`;
        }
        
        // 保存缓存
        更新日志缓存 = 最终内容;
        更新日志缓存时间 = Date.now();
        
        更新日志弹窗正文.innerHTML = 最终内容;
        
    } catch (error) {
        console.error('获取更新日志失败:', error);
        更新日志弹窗正文.innerHTML = `<div class="更新日志弹窗加载中" style="color: #ff8888;">加载失败<br>请检查网络连接</div>`;
    }
}

function 比较版本号函数(a, b) {
    const 版本A = a.split('.').map(Number);
    const 版本B = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if ((版本A[i] || 0) > (版本B[i] || 0)) return 1;
        if ((版本A[i] || 0) < (版本B[i] || 0)) return -1;
    }
    return 0;
}

// 绑定更新日志按钮
if (更新日志按钮) {
    更新日志按钮.onclick = () => {
        获取更新日志();
    };
}

// 关闭更新日志弹窗
const 关闭更新日志弹窗 = document.getElementById('关闭更新日志弹窗');
if (关闭更新日志弹窗) {
    关闭更新日志弹窗.onclick = () => {
        更新日志弹窗.classList.remove('打开');
    };
    更新日志弹窗.onclick = (e) => {
        if (e.target === 更新日志弹窗) 更新日志弹窗.classList.remove('打开');
    };
}

// ==================== 版本检查 ====================
let 版本检查缓存 = false;
let 版本检查缓存时间 = 0;
let 版本检查缓存结果 = null;

const 检查更新状态 = document.getElementById('检查更新状态');

if (检查更新状态) {
    const 关于按钮检测 = document.getElementById('关于按钮');
    if (关于按钮检测) {
        const 原始点击 = 关于按钮检测.onclick;
        关于按钮检测.onclick = () => {
            if (原始点击) 原始点击();
            检查版本更新();
        };
    }

    const 关于弹窗检测 = document.getElementById('关于弹窗');
    if (关于弹窗检测) {
        const 观察器 = new MutationObserver(() => {
            if (关于弹窗检测.classList.contains('打开')) {
                检查版本更新();
            }
        });
        观察器.observe(关于弹窗检测, { attributes: true, attributeFilter: ['class'] });
    }
}

async function 检查版本更新() {
    // 检查缓存
    if (版本检查缓存 && 缓存间隔秒 > 0) {
        const 现在 = Date.now();
        if (现在 - 版本检查缓存时间 < 缓存间隔秒 * 1000) {
            console.log('使用版本检查缓存');
            if (版本检查缓存结果) {
                检查更新状态.textContent = 版本检查缓存结果.text;
                检查更新状态.style.color = 版本检查缓存结果.color;
            }
            return;
        }
    }
    
    if (!可以发送请求()) {
        检查更新状态.textContent = '已达上限';
        检查更新状态.style.color = '#ff8888';
        return;
    }
    
    检查更新状态.textContent = '检测中...';
    检查更新状态.style.color = '#888';
    
    try {
        const 响应 = await fetch('https://api.github.com/repos/siyecao-meng/termux-embellish/contents/Update');
        
        if (!响应.ok) throw new Error('请求失败');
        
        // 请求成功后才记录次数
        if (!用户Token && 请求上限 > 0) {
            当前周期请求数++;
            localStorage.setItem('当前周期请求数', 当前周期请求数);
            更新UI统计();
            console.log(`版本检查实际请求: ${当前周期请求数}/${请求上限}`);
        }
        
        const 文件列表 = await 响应.json();
        
        let 最大版本 = '1.0.0';
        文件列表.forEach(文件 => {
            const 版本号 = 文件.name;
            if (比较版本号函数(版本号, 最大版本) > 0) {
                最大版本 = 版本号;
            }
        });
        
        let 结果文本, 结果颜色;
        if (比较版本号函数(最大版本, 当前版本号) > 0) {
            结果文本 = '请更新 v' + 最大版本;
            结果颜色 = '#ff8888';
        } else {
            结果文本 = '已是最新版本';
            结果颜色 = '#00ff88';
        }
        
        版本检查缓存 = true;
        版本检查缓存结果 = { text: 结果文本, color: 结果颜色 };
        版本检查缓存时间 = Date.now();
        
        检查更新状态.textContent = 结果文本;
        检查更新状态.style.color = 结果颜色;
        
    } catch(e) {
        console.error('版本检查失败:', e);
        检查更新状态.textContent = '检测失败';
        检查更新状态.style.color = '#888';
    }
}

// ==================== 自定义毛玻璃弹窗（替换 alert） ====================
function 自定义弹窗(消息, 回调) {
    const 遮罩 = document.createElement('div');
    遮罩.className = '通用弹窗 打开';
    遮罩.innerHTML = '<div class="通用弹窗内容" style="text-align:center;"><div class="通用弹窗正文" style="text-align:center;margin-bottom:20px;">' + 消息 + '</div><button class="通用弹窗关闭" style="width:100%;">确定</button></div>';
    
    document.body.appendChild(遮罩);
    
    const 关闭 = () => {
        遮罩.classList.remove('打开');
        setTimeout(() => {
            if (遮罩.parentNode) 遮罩.parentNode.removeChild(遮罩);
            if (回调) 回调();
        }, 200);
    };
    
    遮罩.onclick = (e) => { if (e.target === 遮罩) 关闭(); };
    遮罩.querySelector('.通用弹窗关闭').onclick = 关闭;
}

// 全局替换 alert
window.alert = function(消息) {
    自定义弹窗(消息);
};

// ==================== 主题商店功能 ====================
const 主题商店弹窗 = document.getElementById('主题商店弹窗');
const 主题列表容器 = document.getElementById('主题列表容器');
const 主题商店按钮 = document.getElementById('主题商店');
const 关闭主题商店弹窗 = document.getElementById('关闭主题商店弹窗');

// 存储主题信息
let 主题列表数据 = [];
let 已装载主题 = localStorage.getItem('loadedTheme') || null;

// GitHub 仓库原始内容地址
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/siyecao-meng/termux-embellish/main';
const GITHUB_API_BASE = 'https://api.github.com/repos/siyecao-meng/termux-embellish/contents';

// 获取所有主题文件夹
let 主题缓存数据 = null;
let 上次请求时间 = 0;

async function 获取主题列表(强制刷新 = false) {
    // 检查缓存
    if (!强制刷新 && 主题缓存数据 && 缓存间隔秒 > 0) {
        const 现在 = Date.now();
        if (现在 - 上次请求时间 < 缓存间隔秒 * 1000) {
            console.log(`使用主题缓存，距上次请求: ${Math.round((现在 - 上次请求时间)/1000)}秒`);
            主题列表数据 = JSON.parse(JSON.stringify(主题缓存数据));
            if (已装载主题) {
                const 已装载主题数据 = 主题列表数据.find(t => t.id === 已装载主题);
                if (已装载主题数据) {
                    已装载主题数据.compatible = `v${当前版本号}~v${当前版本号}`;
                }
            }
            渲染主题列表();
            return;
        }
    }
    
    // 检查是否可以发送请求
    if (!可以发送请求()) {
        if (主题缓存数据) {
            console.log('请求受限，使用过期缓存');
            主题列表数据 = JSON.parse(JSON.stringify(主题缓存数据));
            if (已装载主题) {
                const 已装载主题数据 = 主题列表数据.find(t => t.id === 已装载主题);
                if (已装载主题数据) {
                    已装载主题数据.compatible = `v${当前版本号}~v${当前版本号}`;
                }
            }
            渲染主题列表();
        } else if (请求上限 === 0) {
            主题列表容器.innerHTML = '<div class="正在加载中" style="color:#ff8888;">请求已被禁用 (上限设为 0)<br>请在服务请求中修改上限或配置 Token</div>';
        } else {
            const 剩余秒 = Math.max(0, Math.ceil((上次重置时间 + 重置周期秒 * 1000 - Date.now()) / 1000));
            主题列表容器.innerHTML = `<div class="正在加载中" style="color:#ff8888;">请求次数已达上限 (${当前周期请求数}/${请求上限} 次)<br>剩余 ${剩余秒} 秒后重置<br>请在服务请求中配置 Token 或等待重置</div>`;
        }
        return;
    }
    
    try {
        console.log('发起 GitHub API 请求...');
        const 响应 = await fetch(`${GITHUB_API_BASE}/css主题商店`);
        
        if (!响应.ok) throw new Error(`HTTP ${响应.status}: 获取主题列表失败`);
        
        // 请求成功后才记录次数
        if (!用户Token && 请求上限 > 0) {
            当前周期请求数++;
            localStorage.setItem('当前周期请求数', 当前周期请求数);
            更新UI统计();
            console.log(`当前周期请求次数: ${当前周期请求数}/${请求上限}`);
        }
        
        const 文件列表 = await 响应.json();
        
        let 文件夹列表 = 文件列表.filter(item => item.type === 'dir');
        文件夹列表.sort((a, b) => {
            const numA = parseInt(a.name.match(/\d+$/)?.[0] || 0);
            const numB = parseInt(b.name.match(/\d+$/)?.[0] || 0);
            return numA - numB;
        });
        
        let 新主题列表 = [];
        
        for (let 文件夹 of 文件夹列表) {
            const 主题信息 = await 获取主题信息(文件夹.name);
            if (主题信息) {
                新主题列表.push({
                    id: 文件夹.name,
                    ...主题信息
                });
            }
        }
        
        主题缓存数据 = JSON.parse(JSON.stringify(新主题列表));
        上次请求时间 = Date.now();
        主题列表数据 = 新主题列表;
        
        if (已装载主题) {
            const 已装载主题数据 = 主题列表数据.find(t => t.id === 已装载主题);
            if (已装载主题数据) {
                已装载主题数据.compatible = `v${当前版本号}~v${当前版本号}`;
            }
        }
        
        渲染主题列表();
        
    } catch (error) {
        console.error('获取主题列表失败:', error);
        if (主题缓存数据) {
            console.log('请求失败，使用缓存数据');
            主题列表数据 = JSON.parse(JSON.stringify(主题缓存数据));
            渲染主题列表();
        } else {
            主题列表容器.innerHTML = `<div class="正在加载中" style="color:#ff8888;">加载失败: ${error.message}<br>请检查网络连接</div>`;
        }
    }
}

// 获取单个主题的 JSON 信息
async function 获取主题信息(文件夹名) {
    try {
        const jsonUrl = `${GITHUB_RAW_BASE}/css主题商店/${文件夹名}/主题.json`;
        const 响应 = await fetch(jsonUrl);
        
        if (!响应.ok) return null;
        
        const 数据 = await 响应.json();
        
        // 检查是否存在 JS 文件
        let hasJs = false;
        try {
            const jsUrl = `${GITHUB_RAW_BASE}/css主题商店/${文件夹名}/主题.js`;
            const js响应 = await fetch(jsUrl, { method: 'HEAD' });
            hasJs = js响应.ok;
        } catch(e) {
            hasJs = false;
        }
        
        return {
            name: 数据.name || 文件夹名,
            version: 数据.version || '0.0.0',
            author: 数据.author || '未知',
            date: 数据.date || '未知',
            type: 数据.type || '社区',
            description: 数据.description || '',
            compatible: 数据.compatible || '',
            hasJs: hasJs
        };
    } catch (error) {
        console.error(`获取主题 ${文件夹名} 信息失败:`, error);
        return null;
    }
}

// 检查版本兼容性
function 检查版本兼容性(compatibleStr) {
    if (!compatibleStr) return true;
    const match = compatibleStr.match(/v?(\d+\.\d+\.\d+)\s*~\s*v?(\d+\.\d+\.\d+)/);
    if (!match) return true;
    const minVersion = match[1];
    const maxVersion = match[2];
    return (比较版本号函数(当前版本号, minVersion) >= 0 && 比较版本号函数(当前版本号, maxVersion) <= 0);
}

// 渲染主题列表
function 渲染主题列表() {
    if (!主题列表容器) return;
    
    if (主题列表数据.length === 0) {
        主题列表容器.innerHTML = '<div class="正在加载中">暂无主题</div>';
        return;
    }
    
    主题列表容器.innerHTML = '';
    
    主题列表数据.forEach(主题 => {
        const isLoaded = (已装载主题 === 主题.id);
        const isCompatible = 检查版本兼容性(主题.compatible);
        const 兼容标签 = isCompatible ? '兼容' : '不兼容';
        const 兼容标签样式 = isCompatible ? '标签兼容' : '标签不兼容';
        
        const 卡片 = document.createElement('div');
        卡片.className = '主题卡片';
        卡片.dataset.id = 主题.id;
        
        let 按钮区域HTML = '';
        
        if (isLoaded) {
            按钮区域HTML = `<button class="主题操作按钮 已装载" data-action="unload">卸下</button>`;
        } else if (!isCompatible) {
            按钮区域HTML = `
                <div class="主题不兼容提示">
                    <div class="不兼容文字">该主题仅兼容 ${主题.compatible} 版本</div>
                    <span class="强制装载链接" data-theme-id="${主题.id}">点击强制装载</span>
                </div>
            `;
        } else {
            按钮区域HTML = `<button class="主题操作按钮" data-action="load">装载</button>`;
        }
        
        卡片.innerHTML = `
            <div class="主题卡片-头部">
                <span class="主题名称">${escapeHtml(主题.name)}</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    ${主题.hasJs ? '<span class="主题-js标记" style="font-size: 10px; background: rgba(255,165,0,0.2); border: 1px solid rgba(255,165,0,0.5); border-radius: 10px; padding: 2px 6px; color: #ffaa44;">JS</span>' : ''}
                    <span class="主题版本">v${escapeHtml(主题.version)}</span>
                </div>
            </div>
            <div class="主题-元信息">
                <span class="主题-类型">${escapeHtml(主题.type)}</span>
                <span class="主题-作者">${escapeHtml(主题.author)}</span>
                <span class="主题-日期">${escapeHtml(主题.date)}</span>
            </div>
            <div class="主题-底部栏">
                <span class="主题-兼容标签 ${兼容标签样式}">${兼容标签}</span>
                ${按钮区域HTML}
            </div>
            <div class="进度条容器" data-progress-container style="display:none;">
                <div class="进度条"><div class="进度条填充"></div></div>
                <div class="进度条文字">正在下载...</div>
            </div>
        `;
        
        if (isLoaded) {
            const 卸下按钮 = 卡片.querySelector('.主题操作按钮');
            if (卸下按钮) {
                卸下按钮.onclick = async (e) => {
                    e.stopPropagation();
                    卸下主题(卡片);
                };
            }
        } else if (isCompatible) {
            const 装载按钮 = 卡片.querySelector('.主题操作按钮');
            if (装载按钮) {
                装载按钮.onclick = async (e) => {
                    e.stopPropagation();
                    await 装载主题(主题.id, 卡片);
                };
            }
        } else {
            const 强制链接 = 卡片.querySelector('.强制装载链接');
            if (强制链接) {
                强制链接.onclick = async (e) => {
                    e.stopPropagation();
                    await 装载主题(主题.id, 卡片);
                };
            }
        }
        
        主题列表容器.appendChild(卡片);
    });
}

// 应用主题 CSS
function 应用主题CSS(css内容, 主题ID) {
    const 旧样式 = document.getElementById('dynamic-theme-style');
    if (旧样式) 旧样式.remove();
    
    const 样式 = document.createElement('style');
    样式.id = 'dynamic-theme-style';
    样式.setAttribute('data-theme-id', 主题ID);
    样式.textContent = css内容;
    document.head.appendChild(样式);
    console.log(`已应用主题 CSS: ${主题ID}`);
}

// 应用主题 JS
function 应用主题JS(js内容, 主题ID) {
    const 旧脚本 = document.getElementById('dynamic-theme-script');
    if (旧脚本) 旧脚本.remove();
    
    const 脚本 = document.createElement('script');
    脚本.id = 'dynamic-theme-script';
    脚本.setAttribute('data-theme-id', 主题ID);
    脚本.textContent = `(function() { ${js内容} })();`;
    document.head.appendChild(脚本);
    console.log(`已应用主题 JS: ${主题ID}`);
}

// 装载主题
async function 装载主题(主题ID, 卡片) {
    const 进度条容器 = 卡片.querySelector('[data-progress-container]');
    let 操作按钮 = 卡片.querySelector('.主题操作按钮');
    const 不兼容提示 = 卡片.querySelector('.主题不兼容提示');
    
    if (操作按钮) 操作按钮.style.display = 'none';
    if (不兼容提示) 不兼容提示.style.display = 'none';
    
    进度条容器.style.display = 'block';
    卡片.classList.add('加载中');
    
    try {
        const cssUrl = `${GITHUB_RAW_BASE}/css主题商店/${主题ID}/主题.css`;
        const jsUrl = `${GITHUB_RAW_BASE}/css主题商店/${主题ID}/主题.js`;
        
        let 进度 = 0;
        const 进度填充 = 卡片.querySelector('.进度条填充');
        const 进度间隔 = setInterval(() => {
            进度 += 10;
            if (进度 <= 90) {
                进度填充.style.width = 进度 + '%';
            }
        }, 50);
        
        const css响应 = await fetch(cssUrl);
        if (!css响应.ok) throw new Error('下载CSS失败');
        const css内容 = await css响应.text();
        
        // 下载 JS（可选）
        let js内容 = null;
        try {
            const js响应 = await fetch(jsUrl);
            if (js响应.ok) {
                js内容 = await js响应.text();
            }
        } catch(e) {
            console.log('主题没有 JS 文件');
        }
        
        clearInterval(进度间隔);
        进度填充.style.width = '100%';
        await new Promise(resolve => setTimeout(resolve, 300));
        
        应用主题CSS(css内容, 主题ID);
        if (js内容) {
            应用主题JS(js内容, 主题ID);
        }
        
        已装载主题 = 主题ID;
        localStorage.setItem('loadedTheme', 主题ID);
        
        const 当前主题 = 主题列表数据.find(t => t.id === 主题ID);
        if (当前主题) {
            当前主题.compatible = `v${当前版本号}~v${当前版本号}`;
            
            const 兼容标签Span = 卡片.querySelector('.主题-兼容标签');
            const 底部栏 = 卡片.querySelector('.主题-底部栏');
            if (兼容标签Span) {
                兼容标签Span.className = '主题-兼容标签 标签兼容';
                兼容标签Span.textContent = '兼容';
            }
            if (底部栏) {
                底部栏.innerHTML = `
                    <span class="主题-兼容标签 标签兼容">兼容</span>
                    <button class="主题操作按钮 已装载" data-action="unload">卸下</button>
                `;
                const 新卸下按钮 = 底部栏.querySelector('.主题操作按钮');
                if (新卸下按钮) {
                    新卸下按钮.onclick = async (e) => {
                        e.stopPropagation();
                        卸下主题(卡片);
                    };
                }
            }
        }
        
        进度条容器.style.display = 'none';
        卡片.classList.remove('加载中');
        console.log(`✅ 主题 "${主题ID}" 已装载成功`);
        
    } catch (error) {
        console.error('装载主题失败:', error);
        进度条容器.style.display = 'none';
        if (操作按钮) {
            操作按钮.style.display = 'block';
            操作按钮.innerHTML = '重试';
            操作按钮.style.background = 'rgba(255,80,80,0.3)';
            setTimeout(() => {
                if (操作按钮.innerHTML === '重试') {
                    操作按钮.innerHTML = '装载';
                    操作按钮.style.background = '';
                }
            }, 2000);
        } else if (不兼容提示) {
            不兼容提示.style.display = 'flex';
        }
        自定义弹窗(`❌ 装载失败: ${error.message}`);
    }
}

// 卸下主题
function 卸下主题(卡片) {
    const 主题样式 = document.getElementById('dynamic-theme-style');
    if (主题样式) 主题样式.remove();
    
    const 主题脚本 = document.getElementById('dynamic-theme-script');
    if (主题脚本) 主题脚本.remove();
    
    已装载主题 = null;
    localStorage.removeItem('loadedTheme');
    
    获取主题列表();
    
    console.log('🎨 主题已卸下，恢复默认样式');
}

// 页面加载时恢复已装载的主题
async function 恢复已装载主题() {
    const 保存的主题 = localStorage.getItem('loadedTheme');
    if (保存的主题) {
        try {
            const cssUrl = `${GITHUB_RAW_BASE}/css主题商店/${保存的主题}/主题.css`;
            const css响应 = await fetch(cssUrl);
            if (css响应.ok) {
                const css内容 = await css响应.text();
                应用主题CSS(css内容, 保存的主题);
                
                const jsUrl = `${GITHUB_RAW_BASE}/css主题商店/${保存的主题}/主题.js`;
                const js响应 = await fetch(jsUrl);
                if (js响应.ok) {
                    const js内容 = await js响应.text();
                    应用主题JS(js内容, 保存的主题);
                }
                
                已装载主题 = 保存的主题;
                console.log(`已恢复主题: ${保存的主题}`);
            } else {
                localStorage.removeItem('loadedTheme');
            }
        } catch (error) {
            console.error('恢复主题失败:', error);
            localStorage.removeItem('loadedTheme');
        }
    }
}

// 转义 HTML 防止 XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 打开主题商店
if (主题商店按钮) {
    主题商店按钮.onclick = () => {
        获取主题列表();
        主题商店弹窗.classList.add('打开');
    };
}

// 关闭主题商店
if (关闭主题商店弹窗) {
    关闭主题商店弹窗.onclick = () => {
        主题商店弹窗.classList.remove('打开');
    };
    主题商店弹窗.onclick = (e) => {
        if (e.target === 主题商店弹窗) 主题商店弹窗.classList.remove('打开');
    };
}

// 页面启动时恢复已装载的主题
恢复已装载主题();

// ==================== 服务请求设置 ====================
const 服务请求按钮 = document.getElementById('服务请求设置');
const 服务请求弹窗 = document.getElementById('服务请求弹窗');
const 关闭服务请求弹窗 = document.getElementById('关闭服务请求弹窗');

// 缓存控制变量（秒为单位）
let 缓存间隔秒 = parseInt(localStorage.getItem('缓存间隔秒') || '600');
let 重置周期秒 = parseInt(localStorage.getItem('重置周期秒') || '3600');
let 请求上限 = parseInt(localStorage.getItem('请求上限') || '60');

// 请求计数
let 当前周期请求数 = parseInt(localStorage.getItem('当前周期请求数') || '0');
let 上次重置时间 = parseInt(localStorage.getItem('上次重置时间') || Date.now());
let 用户Token = localStorage.getItem('github_token') || null;

// 检查是否需要重置计数
function 检查重置计数() {
    if (重置周期秒 === 0) return;
    const 现在 = Date.now();
    const 周期毫秒 = 重置周期秒 * 1000;
    if (现在 - 上次重置时间 >= 周期毫秒) {
        当前周期请求数 = 0;
        上次重置时间 = 现在;
        localStorage.setItem('当前周期请求数', '0');
        localStorage.setItem('上次重置时间', 上次重置时间);
        更新UI统计();
    }
}

// 检查是否可以发送请求
function 可以发送请求() {
    if (用户Token) return true;
    if (请求上限 === 0) return false;
    检查重置计数();
    return 当前周期请求数 < 请求上限;
}

function 更新UI统计() {
    const 当前请求次数Span = document.getElementById('当前请求次数');
    if (当前请求次数Span) 当前请求次数Span.textContent = 当前周期请求数;
    
    const 缓存间隔输入 = document.getElementById('缓存间隔秒');
    if (缓存间隔输入) 缓存间隔输入.value = 缓存间隔秒;
    
    const 重置周期输入 = document.getElementById('重置周期秒');
    if (重置周期输入) 重置周期输入.value = 重置周期秒;
    
    const 请求上限输入 = document.getElementById('请求上限');
    if (请求上限输入) 请求上限输入.value = 请求上限;
    
    const Token状态标签 = document.getElementById('Token状态标签');
    const Token提示 = document.getElementById('Token状态提示');
    if (Token状态标签) {
        if (用户Token) {
            Token状态标签.innerHTML = '已配置 ✓';
            Token状态标签.style.color = '#00ff88';
            Token提示.innerHTML = 'Token 已配置，无请求限制';
            Token提示.style.color = '#00ff88';
        } else {
            Token状态标签.innerHTML = '未配置';
            Token状态标签.style.color = '#ff8888';
            if (请求上限 === 0) {
                Token提示.innerHTML = '未配置 Token，请求上限已设为 0，无法发送任何请求';
                Token提示.style.color = '#ff8888';
            } else {
                Token提示.innerHTML = `未配置 Token，当前限制 ${请求上限} 次/${重置周期秒}秒，已使用 ${当前周期请求数} 次`;
                Token提示.style.color = '#ff8888';
            }
        }
    }
}

function 保存配置() {
    const 新缓存间隔 = parseInt(document.getElementById('缓存间隔秒').value);
    const 新重置周期 = parseInt(document.getElementById('重置周期秒').value);
    const 新请求上限 = parseInt(document.getElementById('请求上限').value);
    
    if (!isNaN(新缓存间隔)) 缓存间隔秒 = Math.min(14000000, Math.max(0, 新缓存间隔));
    if (!isNaN(新重置周期)) 重置周期秒 = Math.min(14000000, Math.max(0, 新重置周期));
    if (!isNaN(新请求上限)) 请求上限 = Math.min(5000, Math.max(0, 新请求上限));
    
    localStorage.setItem('缓存间隔秒', 缓存间隔秒);
    localStorage.setItem('重置周期秒', 重置周期秒);
    localStorage.setItem('请求上限', 请求上限);
    
    更新UI统计();
}

// Token 配置
const 配置Token按钮 = document.getElementById('配置Token按钮');
const Token输入区域 = document.getElementById('Token输入区域');
const Token输入框 = document.getElementById('Token输入框');
const 保存Token按钮 = document.getElementById('保存Token按钮');
const 清除Token按钮 = document.getElementById('清除Token按钮');

if (配置Token按钮) {
    配置Token按钮.onclick = () => {
        Token输入区域.style.display = Token输入区域.style.display === 'none' ? 'block' : 'none';
    };
}

if (保存Token按钮) {
    保存Token按钮.onclick = () => {
        const token = Token输入框.value.trim();
        if (token) {
            用户Token = token;
            localStorage.setItem('github_token', token);
            更新UI统计();
            Token输入框.value = '';
            Token输入区域.style.display = 'none';
            自定义弹窗('Token 已保存，请求限制已解除');
        }
    };
}

if (清除Token按钮) {
    清除Token按钮.onclick = () => {
        用户Token = null;
        localStorage.removeItem('github_token');
        更新UI统计();
        自定义弹窗('Token 已清除，恢复次数限制');
    };
}

// 重置为默认
const 重置请求设置 = document.getElementById('重置请求设置');
if (重置请求设置) {
    重置请求设置.onclick = () => {
        缓存间隔秒 = 600;
        重置周期秒 = 3600;
        请求上限 = 60;
        用户Token = null;
        localStorage.removeItem('github_token');
        localStorage.setItem('缓存间隔秒', 缓存间隔秒);
        localStorage.setItem('重置周期秒', 重置周期秒);
        localStorage.setItem('请求上限', 请求上限);
        当前周期请求数 = 0;
        上次重置时间 = Date.now();
        localStorage.setItem('当前周期请求数', '0');
        localStorage.setItem('上次重置时间', 上次重置时间);
        更新UI统计();
        自定义弹窗('已重置为默认配置');
    };
}

// 打开弹窗
if (服务请求按钮) {
    服务请求按钮.onclick = () => {
        检查重置计数();
        更新UI统计();
        服务请求弹窗.classList.add('打开');
    };
}

// 关闭弹窗
if (关闭服务请求弹窗) {
    关闭服务请求弹窗.onclick = () => {
        保存配置();
        服务请求弹窗.classList.remove('打开');
    };
    服务请求弹窗.onclick = (e) => {
        if (e.target === 服务请求弹窗) {
            保存配置();
            服务请求弹窗.classList.remove('打开');
        }
    };
}

// 帮助弹窗（Token）
document.querySelectorAll('[data-help-token]').forEach(btn => {
    btn.onclick = () => {
        显示自定义确认弹窗(
            'Token 配置说明',
            '1. 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)\n\n2. 点击 Generate new token\n\n3. 勾选 repo 权限\n\n4. 生成后复制 token 粘贴即可\n\n配置后无请求限制',
            () => {}
        );
    };
});

// 初始化
更新UI统计();
// 启动
// ==================== 通用弹窗关闭管理器 ====================
// 强制关闭所有弹窗的函数
function 强制关闭弹窗(弹窗ID) {
    const 弹窗 = document.getElementById(弹窗ID);
    if (弹窗) {
        弹窗.classList.remove('打开');
        console.log(`强制关闭弹窗: ${弹窗ID}`);
    }
}

// 为所有带 '关闭' 文字的按钮绑定强制关闭事件
document.querySelectorAll('[id*="关闭"], [class*="关闭"]').forEach(btn => {
    // 只处理按钮元素
    if (btn.tagName === 'BUTTON' || btn.classList.contains('服务请求弹窗按钮')) {
        // 保存原始点击事件（如果有）
        const 原始事件 = btn.onclick;
        
        // 重新绑定：先执行原始事件，再强制关闭对应弹窗
        btn.onclick = function(e) {
            e.stopPropagation();
            
            // 查找这个按钮所属的弹窗
            let 父弹窗 = btn.closest('[class*="弹窗"]');
            if (父弹窗 && 父弹窗.id) {
                // 先执行原始事件（如果存在）
                if (原始事件) {
                    try { 原始事件.call(btn, e); } catch(err) { console.log(err); }
                }
                // 强制关闭
                父弹窗.classList.remove('打开');
                console.log(`通过按钮 "${btn.id || btn.innerText}" 强制关闭弹窗: ${父弹窗.id}`);
            }
        };
    }
});

// 专门处理服务请求弹窗的关闭按钮（防止遗漏）
const 服务关闭按钮 = document.getElementById('关闭服务请求弹窗');
if (服务关闭按钮) {
    服务关闭按钮.onclick = function(e) {
        e.stopPropagation();
        const 服务弹窗 = document.getElementById('服务请求弹窗');
        if (服务弹窗) {
            服务弹窗.classList.remove('打开');
            console.log('通过专用按钮关闭服务请求弹窗');
        }
        // 如果有保存配置函数，调用它
        if (typeof 保存配置 === 'function') {
            try { 保存配置(); } catch(err) { console.log(err); }
        }
    };
}

// 点击弹窗背景遮罩也关闭
document.querySelectorAll('[class*="弹窗"]').forEach(弹窗 => {
    弹窗.addEventListener('click', function(e) {
        if (e.target === 弹窗) {
            弹窗.classList.remove('打开');
            console.log(`点击遮罩关闭弹窗: ${弹窗.id}`);
        }
    });
});

console.log('通用弹窗关闭管理器已启动');
连接服务器();
console.log('Termux:Embellish 已启动');