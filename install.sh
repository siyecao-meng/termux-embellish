#!/data/data/com.termux/files/usr/bin/bash

# ======================================================
# Termux:Embellish v1.0.3 服务安装脚本
# 作者: 四叶草
# ======================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

SERVER_DIR="$HOME/termux-server"
SERVER_FILE="$SERVER_DIR/server.js"
KEEPER_FILE="$SERVER_DIR/keeper.sh"
BOOT_FILE="$HOME/.termux/boot/start-server"
SHORTCUT_DIR="$HOME/.shortcuts"
CF_INSTALL="$HOME/install-cloudflare-tunnel.sh"
MODEL_SCRIPT="$PREFIX/bin/model"
LOG_FILE="$SERVER_DIR/install.log"

log() {
    echo "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"
}

# ==================== 协议声明 ====================
show_license() {
    clear
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}   Termux:Embellish v1.0.3 服务安装脚本${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo -e "作者: ${GREEN}四叶草${NC}"
    echo -e "小红书: ${GREEN}5331041368${NC}"
    echo -e "B站 UID: ${GREEN}3706970185927059${NC}"
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo ""
    echo -e "本项目基于 ${GREEN}MIT 开源许可协议${NC}发布。"
    echo ""
    echo "你可以自由地："
    echo "  · 使用、复制、修改、分发、再授权本软件"
    echo "  · 将本软件用于个人用途或商业用途"
    echo "  · 将本软件合并到其他项目中（包括闭源项目）"
    echo ""
    echo "只需遵守："
    echo "  · 保留原始版权声明和 MIT 许可声明"
    echo ""
    echo "完整协议: https://opensource.org/licenses/MIT"
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo ""
    echo -e "${RED}免责声明：${NC}"
    echo ""
    echo "本软件仅供学习交流使用。"
    echo ""
    echo "  1. 使用本软件产生的任何后果（包括但不限于"
    echo "     数据丢失、系统损坏、设备异常）由使用者"
    echo "     自行承担。"
    echo ""
    echo "  2. 远程连接功能涉及网络安全，请自行做好"
    echo "     访问控制和密码保护，作者不对因远程暴露"
    echo "     导致的安全问题负责。"
    echo ""
    echo "  3. 本软件不收集、不存储、不上传任何用户"
    echo "     数据，所有会话数据仅保存在本地。"
    echo ""
    echo "  4. 禁止将本软件用于任何违法违规用途。"
    echo ""
    echo "  5. 本软件中的背景示例图片均为AI生成，"
    echo "     如涉及侵权请联系删除。"
    echo ""
    echo "  6. 商用、二次创作、二次转载需标明原作者。"
    echo ""
    echo "  7. 作者保留对以上条款的最终解释权。"
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo ""
    echo "本软件依赖以下开源项目（版权归原作者所有）："
    echo "  · Node.js        (MIT 许可)"
    echo "  · ws 模块        (MIT 许可)"
    echo "  · Cloudflared    (Apache 2.0 许可)"
    echo "  · Shizuku        (MIT 许可)"
    echo "  · Termux 系列    (GPL-3.0 许可)"
    echo "  · Ollama         (MIT 许可)"
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo ""
    echo -ne "请输入 ${GREEN}y${NC} 确认同意以上协议，输入 ${RED}n${NC} 退出安装: "
    read agree

    if [ "$agree" != "y" ] && [ "$agree" != "Y" ]; then
        echo ""
        echo -e "${RED}已取消安装。${NC}"
        exit 0
    fi
}

# ==================== AI 免责声明 ====================
show_ai_disclaimer() {
    clear
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}         AI 服务免责声明${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo -e "1. 本工具仅提供 AI 服务的接入功能，"
    echo -e "   所有 AI 模型及 API 均由用户自行配置。"
    echo ""
    echo -e "2. 对话内容由第三方服务商（如 DeepSeek、"
    echo -e "   OpenAI、硅基流动、七牛云等）或用户本地的"
    echo -e "   Ollama 模型生成，与 Termux:Embellish"
    echo -e "   开发者无关。"
    echo ""
    echo -e "3. 开发者不对以下事项承担责任："
    echo -e "   • AI 生成内容的准确性、完整性、合法性"
    echo -e "   • 因使用 AI 服务产生的任何直接或间接损失"
    echo -e "   • 第三方服务商的数据收集与隐私政策"
    echo ""
    echo -e "4. 用户应自行："
    echo -e "   • 遵守各 AI 服务商的使用条款"
    echo -e "   • 确保 API Key 的安全存储"
    echo -e "   • 对 AI 执行的命令进行审核确认"
    echo ""
    echo -e "5. 本地 Ollama 模型完全离线运行，"
    echo -e "   数据不会上传至任何服务器。"
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${YELLOW}使用本工具的 AI 功能即表示您已知悉并同意以上条款${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo -ne "按 ${GREEN}回车键${NC} 继续安装..."
    read
}

# ==================== 检查并安装依赖 ====================
check_dependencies() {
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}   检查依赖环境${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    
    local need_update=false
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}  Node.js 未安装，正在安装...${NC}"
        need_update=true
    else
        echo -e "  ${GREEN}✓ Node.js 已安装: $(node --version)${NC}"
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${YELLOW}  npm 未安装，正在安装...${NC}"
        need_update=true
    else
        echo -e "  ${GREEN}✓ npm 已安装: $(npm --version)${NC}"
    fi
    
    # 如果需要更新，先更新包列表
    if [ "$need_update" = true ]; then
        echo ""
        echo -e "${YELLOW}正在更新包列表并安装依赖...${NC}"
        pkg update -y && pkg upgrade -y
        pkg install nodejs-lts -y
    fi
    
    # 安装 ws 模块
    echo ""
    echo -e "${YELLOW}检查 WebSocket 模块...${NC}"
    if [ ! -d "$HOME/termux-server/node_modules/ws" ]; then
        echo -e "  ${YELLOW}正在安装 ws 模块...${NC}"
        mkdir -p "$SERVER_DIR"
        cd "$SERVER_DIR"
        npm init -y > /dev/null 2>&1
        npm install ws --save > /dev/null 2>&1
        echo -e "  ${GREEN}✓ ws 模块安装完成${NC}"
    else
        echo -e "  ${GREEN}✓ ws 模块已存在${NC}"
    fi
    
    # 验证安装
    echo ""
    if command -v node &> /dev/null; then
        echo -e "  ${GREEN}✓ 环境检查通过${NC}"
        log "依赖安装完成"
    else
        echo -e "  ${RED}✗ Node.js 安装失败，请手动执行: pkg install nodejs-lts${NC}"
        exit 1
    fi
}

# ==================== 安装 model 命令（本地AI模型脚本） ====================
install_model_command() {
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}   安装本地AI模型命令${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    
    if [ -f "$MODEL_SCRIPT" ]; then
        echo -e "${YELLOW}  model 命令已存在，跳过安装${NC}"
        return
    fi
    
    cat > "$MODEL_SCRIPT" << 'MODELEOF'
#!/data/data/com.termux/files/usr/bin/bash

# ======================================================
# Termux:Embellish 本地AI模型服务脚本
# 快捷命令: model
# ======================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# 清除屏幕并显示标题
clear
echo ""
echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN}   本地AI模型服务${NC}"
echo -e "${CYAN}==========================================${NC}"
echo ""

# 检查并安装 Ollama
if ! command -v ollama &> /dev/null; then
    echo -e "${YELLOW}正在安装 Ollama...${NC}"
    pkg update -y && pkg install ollama -y
    echo -e "${GREEN}✓ Ollama 安装完成${NC}"
else
    echo -e "${GREEN}✓ Ollama 已安装${NC}"
fi

# 停止已有的 Ollama 进程
if pgrep -x ollama > /dev/null 2>&1; then
    echo -e "${YELLOW}正在停止旧的 Ollama 进程...${NC}"
    pkill ollama
    sleep 2
fi

# 启动 ollama serve（前台运行，输出直接显示）
echo -e "${YELLOW}正在启动 Ollama 服务...${NC}"
echo ""

# 创建临时文件记录日志
TEMP_LOG=$(mktemp)

# 启动 ollama serve，同时输出到屏幕和临时文件
ollama serve 2>&1 | tee "$TEMP_LOG" &
OLLAMA_PID=$!

# 等待服务完全启动（连续2秒没有新输出）
LAST_SIZE=0
SLEEP_COUNT=0
while true; do
    sleep 1
    CURRENT_SIZE=$(stat -c%s "$TEMP_LOG" 2>/dev/null || echo 0)
    if [ "$CURRENT_SIZE" -eq "$LAST_SIZE" ]; then
        SLEEP_COUNT=$((SLEEP_COUNT + 1))
        # 连续2秒日志大小没变化，认为启动完成
        if [ "$SLEEP_COUNT" -ge 2 ]; then
            break
        fi
    else
        SLEEP_COUNT=0
        LAST_SIZE=$CURRENT_SIZE
    fi
done

# 输出空行分隔
echo ""

# 显示服务状态信息
echo -e "${CYAN}==========================================${NC}"
echo -e "${GREEN}  本地AI服务已启用${NC}"
echo -e "${CYAN}==========================================${NC}"
echo ""
echo -e "  模型: ${GREEN}deepseek-r1:1.5b${NC}"
echo -e "  地址: ${GREEN}http://127.0.0.1:11434${NC}"
echo ""
echo -e "${CYAN}==========================================${NC}"
echo ""
echo -e "${YELLOW}提示: 按 Ctrl+C 停止服务${NC}"

# 清理临时文件
rm -f "$TEMP_LOG"

# 等待 ollama 进程结束
wait $OLLAMA_PID
MODELEOF
    
    chmod +x "$MODEL_SCRIPT"
    echo -e "  ${GREEN}✓ model 命令安装完成${NC}"
    echo -e "  使用方式: 输入 ${CYAN}model${NC} 启动本地AI服务"
    log "model 命令安装完成"
}

# ==================== 安装主服务 ====================
install_main_server() {
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}   [1/3] 安装主服务脚本${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""

    mkdir -p "$SERVER_DIR"
    log "创建目录: $SERVER_DIR"

    if [ -f "$SERVER_FILE" ]; then
        echo -e "${YELLOW}  server.js 已存在${NC}"
        echo -ne "是否覆盖重新安装? [y/N]: "
        read overwrite
        if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
            echo -e "  ${GREEN}✓ 保留现有 server.js${NC}"
            log "保留现有 server.js"
            return
        fi
        cp "$SERVER_FILE" "${SERVER_FILE}.bak"
        echo -e "  ${YELLOW}已备份为 server.js.bak${NC}"
        log "备份 server.js"
    fi

    cat > "$SERVER_FILE" << 'SERVEREOF'
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

const PORT = 8081;
const SESSIONS_FILE = path.join(process.env.HOME, '.termux_sessions.json');

let sessions = {};
let nextSessionId = 1;
const activeProcesses = {};

const TERMUX_WELCOME = `Welcome to Termux!

Docs:       https://termux.dev/docs
Donate:     https://termux.dev/donate
Community:  https://termux.dev/community

Working with packages:

 - Search:  pkg search <query>
 - Install: pkg install <package>
 - Upgrade: pkg upgrade

Subscribing to additional repositories:

 - Root:    pkg install root-repo
 - X11:     pkg install x11-repo

For fixing any repository issues,
try 'termux-change-repo' command.

Report issues at https://termux.dev/issues
~ $ `;

function loadSessions() {
    try {
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
            const saved = JSON.parse(data);
            sessions = saved.sessions || {};
            nextSessionId = saved.nextSessionId || 1;
            console.log('已加载 ' + Object.keys(sessions).length + ' 个会话');
        }
    } catch (e) { console.log('加载会话文件失败:', e.message); }

    if (Object.keys(sessions).length === 0) {
        sessions[1] = { id: 1, name: '会话 1', history: [{ command: '', output: TERMUX_WELCOME, timestamp: new Date().toLocaleTimeString() }] };
        nextSessionId = 2;
        saveSessions();
    }
}

function saveSessions() {
    try {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions, nextSessionId }, null, 2));
    } catch (e) { console.log('保存会话失败:', e.message); }
}

function createSession(name) {
    const id = nextSessionId++;
    sessions[id] = { id, name: name || '会话 ' + id, history: [{ command: '', output: TERMUX_WELCOME, timestamp: new Date().toLocaleTimeString() }] };
    saveSessions();
    return sessions[id];
}

function deleteSession(id) {
    if (sessions[id]) {
        if (activeProcesses[id]) { activeProcesses[id].kill(); delete activeProcesses[id]; }
        delete sessions[id];
        saveSessions();
        return true;
    }
    return false;
}

function executeCommand(sessionId, command, callback) {
    const fullCmd = 'bash -l -c "' + command.replace(/"/g, '\\"') + '"';
    exec(fullCmd, { timeout: 30000, cwd: process.env.HOME, env: process.env }, (error, stdout, stderr) => {
        let output = '';
        if (stdout) output += stdout;
        if (stderr) output += stderr;
        if (error && error.code !== 127) output += '\n[错误] ' + error.message;
        if (!output) output = '[无输出]';
        if (sessions[sessionId]) { sessions[sessionId].history.push({ command: command, output: output, timestamp: new Date().toLocaleTimeString() }); saveSessions(); }
        callback(output);
    });
}

loadSessions();
const wss = new WebSocket.Server({ port: PORT });
console.log('[Termux:Embellish] 服务器已启动: ws://127.0.0.1:' + PORT);

wss.on('connection', (ws) => {
    let currentSessionId = parseInt(Object.keys(sessions)[0]) || 1;

    function sendSessionList() {
        ws.send(JSON.stringify({ type: 'session_list', sessions: Object.values(sessions).map(s => ({ id: s.id, name: s.name })), currentSessionId: currentSessionId }));
    }

    function sendSessionHistory(sessionId) {
        const session = sessions[sessionId];
        if (session) {
            const welcomeEntry = session.history[0];
            if (welcomeEntry && welcomeEntry.command === '' && welcomeEntry.output) ws.send(JSON.stringify({ type: 'terminal_output', sessionId: sessionId, output: welcomeEntry.output }));
            ws.send(JSON.stringify({ type: 'session_history', sessionId: sessionId, history: session.history || [] }));
        }
    }

    sendSessionHistory(currentSessionId);
    sendSessionList();

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            switch (msg.type) {
                case 'get_sessions': sendSessionList(); break;
                case 'switch_session': currentSessionId = parseInt(msg.sessionId); sendSessionHistory(currentSessionId); break;
                case 'create_session': createSession(msg.name); sendSessionList(); break;
                case 'delete_session':
                    if (deleteSession(parseInt(msg.sessionId))) {
                        sendSessionList();
                        if (currentSessionId === parseInt(msg.sessionId)) { const first = Object.values(sessions)[0]; if (first) { currentSessionId = first.id; sendSessionHistory(currentSessionId); } }
                    }
                    break;
                case 'key_input': if (activeProcesses[currentSessionId] && activeProcesses[currentSessionId].stdin) activeProcesses[currentSessionId].stdin.write(msg.key); break;
                case 'execute':
                    if (currentSessionId && msg.command) {
                        if (activeProcesses[currentSessionId] && activeProcesses[currentSessionId].stdin) activeProcesses[currentSessionId].stdin.write(msg.command + '\n');
                        executeCommand(currentSessionId, msg.command, (output) => { ws.send(JSON.stringify({ type: 'terminal_output', sessionId: currentSessionId, output: '\n' + output + '\n' })); sendSessionList(); });
                    }
                    break;
                case 'reset_server':
                    try {
                        sessions = {}; sessions[1] = { id: 1, name: '会话 1', history: [{ command: '', output: TERMUX_WELCOME, timestamp: new Date().toLocaleTimeString() }] }; nextSessionId = 2;
                        for (const sid in activeProcesses) { if (activeProcesses[sid]) { activeProcesses[sid].kill(); delete activeProcesses[sid]; } }
                        saveSessions();
                        ws.send(JSON.stringify({ type: 'reset_success' }));
                        setTimeout(() => process.exit(0), 1000);
                    } catch (e) { ws.send(JSON.stringify({ type: 'reset_failed', error: e.message })); }
                    break;
                case 'ping': ws.send(JSON.stringify({ type: 'pong' })); break;
            }
        } catch (e) { ws.send(JSON.stringify({ type: 'error', message: e.message })); }
    });

    ws.on('close', () => { for (const sid in activeProcesses) { if (activeProcesses[sid]) { activeProcesses[sid].kill(); delete activeProcesses[sid]; } } });
});

process.on('SIGINT', () => { for (const sid in activeProcesses) { if (activeProcesses[sid]) activeProcesses[sid].kill(); } wss.close(); process.exit(0); });
process.on('SIGTERM', () => { for (const sid in activeProcesses) { if (activeProcesses[sid]) activeProcesses[sid].kill(); } wss.close(); process.exit(0); });
console.log('服务器运行中，按 Ctrl+C 停止');
SERVEREOF

    chmod +x "$SERVER_FILE"
    echo -e "  ${GREEN}✓ server.js 安装完成${NC}"
    log "server.js 安装完成"
}

# ==================== 预装选项 ====================
install_options() {
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}   [2/3] 预装选项${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo "以下为可选安装项，将逐一询问："
    echo ""

    # --- 1. Shizuku 保活 ---
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo -e "选项 1/4: ${GREEN}Shizuku 保活服务${NC}"
    echo "  功能: 通过 Shizuku 防止系统杀掉 Termux 进程"
    echo "  快捷命令: ${CYAN}shish${NC}"
    echo ""
    echo -ne "是否安装? [y/N]: "
    read keepalive

    if [ "$keepalive" = "y" ] || [ "$keepalive" = "Y" ]; then
        if [ -f "$KEEPER_FILE" ]; then
            echo -e "  ${YELLOW}keeper.sh 已存在，跳过${NC}"
        else
            cat > "$KEEPER_FILE" << 'KEEPEOF'
#!/data/data/com.termux/files/usr/bin/bash
SERVER_SCRIPT="$HOME/termux-server/server.js"
LOG_FILE="$HOME/termux-server/keeper.log"
log() { echo "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"; }

if [ "$1" = "--cron" ]; then
    if ! pgrep -f "node.*server.js" > /dev/null 2>&1; then
        cd "$HOME/termux-server"
        nohup node server.js > /dev/null 2>&1 &
    fi
    exit 0
fi

check_and_start_server() {
    if [ ! -f "$SERVER_SCRIPT" ]; then return 1; fi
    if pgrep -f "node.*server.js" > /dev/null 2>&1; then return 0; fi
    cd "$HOME/termux-server"
    nohup node server.js > /dev/null 2>&1 &
    sleep 2
    pgrep -f "node.*server.js" > /dev/null 2>&1 && return 0 || return 1
}

if [ "$1" = "--daemon" ]; then
    while true; do
        check_and_start_server
        sleep 30
    done
fi

crontab -l 2>/dev/null | grep -v "keeper.sh" | crontab - 2>/dev/null
(crontab -l 2>/dev/null; echo "*/5 * * * * $HOME/termux-server/keeper.sh --cron >> $LOG_FILE 2>&1") | crontab -
echo "保活已设置（每5分钟检查）"
check_and_start_server
KEEPEOF
            chmod +x "$KEEPER_FILE"
            echo -e "  ${GREEN}✓ keeper.sh 安装完成${NC}"
            log "keeper.sh 安装完成"
        fi
    else
        echo -e "  ${YELLOW}跳过 Shizuku 保活${NC}"
    fi

    # --- 2. Boot 开机自启 ---
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo -e "选项 2/4: ${GREEN}Boot 开机自启服务${NC}"
    echo "  功能: 手机开机后自动启动 Termux 服务器"
    echo "  快捷命令: ${CYAN}bootsh${NC}"
    echo ""
    echo -ne "是否安装? [y/N]: "
    read autostart

    if [ "$autostart" = "y" ] || [ "$autostart" = "Y" ]; then
        if [ -f "$BOOT_FILE" ]; then
            echo -e "  ${YELLOW}start-server 已存在，跳过${NC}"
        else
            mkdir -p "$HOME/.termux/boot"
            cat > "$BOOT_FILE" << 'BOOTEOF'
#!/data/data/com.termux/files/usr/bin/bash
sleep 15
LOG="$HOME/termux-server/boot.log"
echo "[$(date)] 开机自启开始" >> "$LOG"
cd "$HOME/termux-server"
nohup node server.js >> "$LOG" 2>&1 &
echo "[$(date)] 服务器已启动" >> "$LOG"
if [ -f "$HOME/termux-server/keeper.sh" ]; then
    nohup "$HOME/termux-server/keeper.sh" --daemon >> "$LOG" 2>&1 &
fi
echo "[$(date)] 开机自启完成" >> "$LOG"
BOOTEOF
            chmod +x "$BOOT_FILE"
            echo -e "  ${GREEN}✓ 开机自启脚本安装完成${NC}"
            log "开机自启脚本安装完成"
        fi
    else
        echo -e "  ${YELLOW}跳过开机自启${NC}"
    fi

    # --- 3. 桌面快捷方式 ---
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo -e "选项 3/4: ${GREEN}桌面快捷方式${NC}"
    echo "  功能: 在桌面添加启动/停止/重启快捷方式"
    echo "  快捷命令: ${CYAN}widsh${NC}"
    echo ""
    echo -ne "是否安装? [y/N]: "
    read shortcut

    if [ "$shortcut" = "y" ] || [ "$shortcut" = "Y" ]; then
        mkdir -p "$SHORTCUT_DIR"

        if [ ! -f "$SHORTCUT_DIR/启动Termux服务器" ]; then
            cat > "$SHORTCUT_DIR/启动Termux服务器" << 'SHORTEOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/termux-server
if pgrep -f "node.*server.js" > /dev/null 2>&1; then
    echo "服务器已在运行中"
else
    nohup node server.js > /dev/null 2>&1 &
    sleep 2
    pgrep -f "node.*server.js" > /dev/null 2>&1 && echo "启动成功" || echo "启动失败"
fi
SHORTEOF
            chmod +x "$SHORTCUT_DIR/启动Termux服务器"
        fi

        if [ ! -f "$SHORTCUT_DIR/停止Termux服务器" ]; then
            cat > "$SHORTCUT_DIR/停止Termux服务器" << 'SHORTEOF'
#!/data/data/com.termux/files/usr/bin/bash
pkill -f "node.*server.js" && echo "已停止" || echo "未在运行"
SHORTEOF
            chmod +x "$SHORTCUT_DIR/停止Termux服务器"
        fi

        if [ ! -f "$SHORTCUT_DIR/重启Termux服务器" ]; then
            cat > "$SHORTCUT_DIR/重启Termux服务器" << 'SHORTEOF'
#!/data/data/com.termux/files/usr/bin/bash
pkill -f "node.*server.js"
sleep 1
cd ~/termux-server
nohup node server.js > /dev/null 2>&1 &
echo "已重启"
SHORTEOF
            chmod +x "$SHORTCUT_DIR/重启Termux服务器"
        fi

        echo -e "  ${GREEN}✓ 桌面快捷方式安装完成${NC}"
        log "桌面快捷方式安装完成"
    else
        echo -e "  ${YELLOW}跳过桌面快捷方式${NC}"
    fi

    # --- 4. Cloudflare Tunnel 快速模式 ---
    echo ""
    echo -e "${YELLOW}------------------------------------------${NC}"
    echo -e "选项 4/4: ${GREEN}远程连接（快速隧道）${NC}"
    echo "  功能: 生成临时 HTTPS 公网地址，自动提取显示"
    echo "  优点: 无需登录、无需域名"
    echo "  快捷命令: ${CYAN}closh${NC}"
    echo ""
    echo -ne "是否安装? [y/N]: "
    read remote

    if [ "$remote" = "y" ] || [ "$remote" = "Y" ]; then
        if [ ! -f "$CF_INSTALL" ]; then
            echo -e "  ${GREEN}创建远程连接脚本...${NC}"
            cat > "$CF_INSTALL" << 'CFEOF'
#!/data/data/com.termux/files/usr/bin/bash

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   Cloudflare Tunnel 快速远程连接${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}正在安装 cloudflared...${NC}"
    pkg install cloudflared -y
fi

cd ~/termux-server
if ! pgrep -f "node.*server.js" > /dev/null 2>&1; then
    echo -e "${YELLOW}正在启动服务器...${NC}"
    nohup node server.js > /dev/null 2>&1 &
    sleep 2
fi

echo -e "${GREEN}正在创建临时隧道...${NC}"
echo ""

cloudflared tunnel --url http://localhost:8081 2>&1 | while IFS= read -r line; do
    echo "$line"
    if echo "$line" | grep -q "trycloudflare.com"; then
        ADDR=$(echo "$line" | grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' | head -1)
        if [ -n "$ADDR" ]; then
            echo ""
            echo -e "${CYAN}========================================${NC}"
            echo -e "${CYAN}========================================${NC}"
            echo ""
            echo -e "  ${GREEN}✓ 远程服务配置完成！${NC}"
            echo ""
            echo -e "  ${YELLOW}请将以下地址复制至前端的:${NC}"
            echo -e "  ${YELLOW}高级设置 → 远程连接地址 → 粘贴 → 连接${NC}"
            echo ""
            echo -e "  ${GREEN}${ADDR}${NC}"
            echo ""
            echo -e "${CYAN}========================================${NC}"
            echo -e "${CYAN}========================================${NC}"
            echo ""
            echo "按 Ctrl+C 可停止远程连接"
        fi
    fi
done
CFEOF
            chmod +x "$CF_INSTALL"
        fi

        mkdir -p ~/.shortcuts
        cat > ~/.shortcuts/启动远程连接 << 'STEOF'
#!/data/data/com.termux/files/usr/bin/bash
bash ~/install-cloudflare-tunnel.sh
STEOF
        chmod +x ~/.shortcuts/启动远程连接

        cat > ~/.shortcuts/停止远程连接 << 'STEOF'
#!/data/data/com.termux/files/usr/bin/bash
pkill -f "cloudflared.*tunnel" && echo "隧道已停止" || echo "隧道未在运行"
STEOF
        chmod +x ~/.shortcuts/停止远程连接

        echo -e "  ${GREEN}✓ 远程连接脚本已创建${NC}"
        
        echo -ne "${YELLOW}是否立即启动远程连接? [y/N]: ${NC}"
        read start_cf
        if [ "$start_cf" = "y" ] || [ "$start_cf" = "Y" ]; then
            bash "$CF_INSTALL"
        else
            echo -e "  稍后可通过 ${CYAN}closh${NC} 命令启动"
        fi
    else
        echo -e "  ${YELLOW}跳过远程连接${NC}"
    fi
}

# ==================== 安装完成 ====================
finish_install() {
    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}   [3/3] 安装完成！${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo -e "${GREEN}已安装组件:${NC}"
    echo "  ✓ 主服务 (server.js)"
    [ -f "$KEEPER_FILE" ] && echo "  ✓ Shizuku 保活 (shish)"
    [ -f "$BOOT_FILE" ] && echo "  ✓ 开机自启 (bootsh)"
    [ -f "$SHORTCUT_DIR/启动Termux服务器" ] && echo "  ✓ 桌面快捷方式 (widsh)"
    [ -f "$CF_INSTALL" ] && echo "  ✓ 远程连接脚本 (closh)"
    [ -f "$MODEL_SCRIPT" ] && echo "  ✓ 本地AI模型 (model)"
    echo ""
    echo -e "${GREEN}快捷命令:${NC}"
    echo -e "  ${CYAN}embellish${NC}  - 一键启动主服务"
    echo -e "  ${CYAN}model${NC}      - 启动本地AI模型服务"
    echo -e "  ${CYAN}closh${NC}      - 启动远程连接"
    echo -e "  ${CYAN}shish${NC}      - 保活脚本"
    echo -e "  ${CYAN}bootsh${NC}     - 编辑开机自启脚本"
    echo -e "  ${CYAN}widsh${NC}      - 查看桌面快捷方式"
    echo -e "  ${CYAN}xiezai${NC}     - 卸载"
    echo ""
    echo -e "${GREEN}启动服务:${NC}"
    echo "  embellish"
    echo ""

    # 备份原有 .bashrc
    if [ -f "$HOME/.bashrc" ]; then
        cp "$HOME/.bashrc" "$HOME/.bashrc.bak"
    fi

    # 添加别名（不重复）
    if ! grep -q "alias embellish=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias embellish='cd ~/termux-server && if pgrep -f \"node.*server.js\" > /dev/null 2>&1; then echo \"✓ 服务器已在运行中\"; else nohup node server.js > /dev/null 2>&1 & sleep 2; if pgrep -f \"node.*server.js\" > /dev/null 2>&1; then echo \"✓ 服务器已启动\"; else echo \"✗ 启动失败，请检查 node 是否安装\"; fi; fi'" >> "$HOME/.bashrc"
    fi
    if ! grep -q "alias model=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias model='bash $PREFIX/bin/model'" >> "$HOME/.bashrc"
    fi
    if ! grep -q "alias xiezai=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias xiezai='bash ~/uninstall.sh'" >> "$HOME/.bashrc"
    fi
    if ! grep -q "alias shish=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias shish='bash ~/termux-server/keeper.sh'" >> "$HOME/.bashrc"
    fi
    if ! grep -q "alias bootsh=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias bootsh='nano ~/.termux/boot/start-server'" >> "$HOME/.bashrc"
    fi
    if ! grep -q "alias widsh=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias widsh='ls -la ~/.shortcuts/'" >> "$HOME/.bashrc"
    fi
    if ! grep -q "alias closh=" "$HOME/.bashrc" 2>/dev/null; then
        echo "alias closh='bash ~/install-cloudflare-tunnel.sh'" >> "$HOME/.bashrc"
    fi

    echo -e "${GREEN}✓ 快捷命令已写入 .bashrc${NC}"

    echo -ne "${YELLOW}是否立即启动服务器? [y/N]: ${NC}"
    read startnow
    if [ "$startnow" = "y" ] || [ "$startnow" = "Y" ]; then
        cd "$SERVER_DIR"
        if pgrep -f "node.*server.js" > /dev/null 2>&1; then
            echo -e "${GREEN}服务器已在运行中${NC}"
        else
            nohup node server.js > /dev/null 2>&1 &
            sleep 2
            if pgrep -f "node.*server.js" > /dev/null 2>&1; then
                echo -e "${GREEN}✓ 服务器已启动${NC}"
            else
                echo -e "${RED}✗ 启动失败，请检查 node 是否安装${NC}"
            fi
        fi
    fi

    # 创建卸载脚本
    cat > "$HOME/uninstall.sh" << 'UNEOF'
#!/data/data/com.termux/files/usr/bin/bash
echo "=========================================="
echo " Termux:Embellish 卸载脚本"
echo "=========================================="
echo ""
echo "将删除以下内容:"
echo "  · ~/termux-server/"
echo "  · ~/.termux/boot/start-server"
echo "  · ~/.shortcuts/ 相关脚本"
echo "  · ~/.termux_sessions.json"
echo "  · crontab 保活任务"
echo "  · ~/.bashrc 别名"
echo "  · ~/install-cloudflare-tunnel.sh"
echo "  · $PREFIX/bin/model"
echo "  · ~/uninstall.sh"
echo ""
echo -ne "确认卸载? 输入 yes 继续: "
read confirm

if [ "$confirm" != "yes" ]; then
    echo "已取消"
    exit 0
fi

pkill -f "node.*server.js" 2>/dev/null
pkill -f "keeper.sh" 2>/dev/null
pkill -f "cloudflared.*tunnel" 2>/dev/null

rm -rf ~/termux-server
rm -f ~/.termux/boot/start-server
rm -f ~/.shortcuts/启动Termux服务器
rm -f ~/.shortcuts/停止Termux服务器
rm -f ~/.shortcuts/重启Termux服务器
rm -f ~/.shortcuts/启动远程连接
rm -f ~/.shortcuts/停止远程连接
rm -f ~/.termux_sessions.json
rm -f ~/install-cloudflare-tunnel.sh
rm -f $PREFIX/bin/model
rm -f ~/uninstall.sh

crontab -l 2>/dev/null | grep -v "keeper.sh" | crontab - 2>/dev/null

# 删除别名
if [ -f "$HOME/.bashrc" ]; then
    sed -i '/alias embellish=/d' "$HOME/.bashrc" 2>/dev/null
    sed -i '/alias model=/d' "$HOME/.bashrc" 2>/dev/null
    sed -i '/alias xiezai=/d' "$HOME/.bashrc" 2>/dev/null
    sed -i '/alias shish=/d' "$HOME/.bashrc" 2>/dev/null
    sed -i '/alias bootsh=/d' "$HOME/.bashrc" 2>/dev/null
    sed -i '/alias widsh=/d' "$HOME/.bashrc" 2>/dev/null
    sed -i '/alias closh=/d' "$HOME/.bashrc" 2>/dev/null
fi

echo ""
echo "卸载完成。依赖包（nodejs、cloudflared、ollama 等）未删除。"
UNEOF
    chmod +x "$HOME/uninstall.sh"
    log "卸载脚本已创建"
}

main() {
    show_license
    show_ai_disclaimer    # 总声明同意后，显示 AI 免责声明
    check_dependencies
    install_model_command  # 新增：安装 model 命令
    install_main_server
    install_options
    finish_install
    echo ""
    echo -e "${GREEN}请重启 Termux 或执行 'source ~/.bashrc' 使命令生效${NC}"
    echo -e "${GREEN}本地AI模型服务请执行 'model' 命令启动${NC}"
}

main "$@"