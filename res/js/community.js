// ==================== AI 数据管理 ====================
const AI配置弹窗 = document.getElementById('AI配置弹窗');
const AI配置名单 = document.getElementById('AI配置名单');
const AI配置列表区 = document.getElementById('AI配置列表区');
const AI配置状态 = document.getElementById('AI配置状态');
const AI配置名称 = document.getElementById('AI配置名称');
const AI模型名称 = document.getElementById('AI模型名称');
const AI地址输入 = document.getElementById('AI地址输入');
const AI密钥输入 = document.getElementById('AI密钥输入');
const AI选择模型 = document.getElementById('AI选择模型');
const AI对话区 = document.getElementById('AI对话区');
const AI输入框元素 = document.getElementById('AI输入框');
const AI抽屉内容 = document.querySelector('.AI抽屉内容');
const AI发送按钮 = document.getElementById('AI新对话按钮');
const AI状态提示 = document.getElementById('AI状态提示');
const AI工具栏 = document.querySelector('.AI底部工具栏');
let AI正在请求 = false;
let 当前请求控制器 = null;
let AI配置列表 = JSON.parse(localStorage.getItem('AI配置列表') || '[]');
let 当前编辑ID = null;

function 生成ID() {
    return 'ai_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

function 保存配置列表() {
    localStorage.setItem('AI配置列表', JSON.stringify(AI配置列表));
}

function 更新配置状态() {
    const 优先配置 = AI配置列表.find(c => c.优先级 === '优先');
    const 同时配置 = AI配置列表.filter(c => c.优先级 === '同时');
    if (优先配置) {
        AI配置状态.textContent = `当前：${优先配置.名称}（优先）`;
        AI配置状态.style.color = '#00ff88';
    } else if (同时配置.length > 0) {
        AI配置状态.textContent = `当前：${同时配置.length} 个配置并行`;
        AI配置状态.style.color = '#00ccff';
    } else {
        AI配置状态.textContent = '当前：未配置';
        AI配置状态.style.color = '#fff';
    }
    更新AI状态提示();
}

function 刷新配置列表UI() {
    if (!AI配置列表区) return;
    AI配置列表区.innerHTML = '';
    if (AI配置列表.length === 0) {
        AI配置列表区.innerHTML = '<div style="color:#fff;text-align:center;padding:20px;">暂无配置</div>';
        return;
    }
    AI配置列表.forEach(配置 => {
        const 项 = document.createElement('div');
        项.className = 'AI配置列表项';
        项.innerHTML = '<span>' + 配置.名称 + '</span><span class="优先级标签">' + 配置.优先级 + '</span><button class="AI列表编辑按钮" data-id="' + 配置.id + '" style="background:rgba(0,200,255,0.2);border:none;color:white;padding:4px 12px;border-radius:8px;cursor:pointer;font-size:12px;">编辑</button>';
        AI配置列表区.appendChild(项);
    });
    document.querySelectorAll('.AI列表编辑按钮').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            编辑配置(btn.dataset.id);
        });
    });
}

function 刷新选择器() {
    if (!AI选择模型) return;
    AI选择模型.innerHTML = '<option value="">— 从已保存配置中选择 —</option>';
    AI配置列表.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.名称 + ' (' + c.模型 + ')';
        AI选择模型.appendChild(opt);
    });
}

function 填充表单(配置) {
    AI配置名称.value = 配置.名称 || '';
    AI模型名称.value = 配置.模型 || '';
    AI地址输入.value = 配置.端口 || '';
    AI密钥输入.value = 配置.Key || '';
    当前编辑ID = 配置.id;
    const radio = document.querySelector('input[name="优先级"][value="' + (配置.优先级 || '优先') + '"]');
    if (radio) radio.checked = true;
}

function 清空表单() {
    AI配置名称.value = '';
    AI模型名称.value = '';
    AI地址输入.value = '';
    AI密钥输入.value = '';
    当前编辑ID = null;
    const radio = document.querySelector('input[name="优先级"][value="优先"]');
    if (radio) radio.checked = true;
}

// 点击配置
document.addEventListener('click', (e) => {
    if (e.target.id === '配置ai') {
        e.stopPropagation();
        清空表单();
        刷新选择器();
        更新配置状态();
        AI配置弹窗.classList.add('打开');
    }
});

AI配置弹窗.addEventListener('click', (e) => {
    if (e.target === AI配置弹窗) AI配置弹窗.classList.remove('打开');
});
AI配置名单.addEventListener('click', (e) => {
    if (e.target === AI配置名单) AI配置名单.classList.remove('打开');
});

document.getElementById('AI保存配置').addEventListener('click', () => {
    const 名称 = AI配置名称.value.trim();
    const 模型 = AI模型名称.value.trim();
    const 端口 = AI地址输入.value.trim();
    const Key = AI密钥输入.value.trim();
    const 优先级 = document.querySelector('input[name="优先级"]:checked')?.value || '优先';
    if (!名称 || !端口 || !Key) { alert('请填写配置名称、端口和 Key'); return; }
    if (当前编辑ID) {
        const 索引 = AI配置列表.findIndex(c => c.id === 当前编辑ID);
        if (索引 !== -1) AI配置列表[索引] = { ...AI配置列表[索引], 名称, 模型, 端口, Key, 优先级 };
    } else {
        AI配置列表.push({ id: 生成ID(), 名称, 模型, 端口, Key, 优先级, 创建时间: Date.now() });
    }
    saveKeyJS();
    保存配置列表();
    清空表单();
    刷新选择器();
    更新配置状态();
    AI配置弹窗.classList.remove('打开');
});

document.getElementById('AI删除配置').addEventListener('click', () => {
    if (!当前编辑ID) { alert('请先从配置列表中选择一个配置'); return; }
    显示确认弹窗('确定要删除这个配置吗？', (确认) => {
        if (确认) {
            AI配置列表 = AI配置列表.filter(c => c.id !== 当前编辑ID);
            saveKeyJS();
            保存配置列表();
            清空表单();
            刷新选择器();
            更新配置状态();
            AI配置弹窗.classList.remove('打开');
        }
    });
});

document.getElementById('AI配置列表按钮').addEventListener('click', () => {
    刷新配置列表UI();
    AI配置名单.classList.add('打开');
});
document.getElementById('AI关闭配置列表').addEventListener('click', () => {
    AI配置名单.classList.remove('打开');
});

function 编辑配置(id) {
    const 配置 = AI配置列表.find(c => c.id === id);
    if (配置) {
        填充表单(配置);
        刷新选择器();
        更新配置状态();
        AI配置名单.classList.remove('打开');
        AI配置弹窗.classList.add('打开');
    }
}

AI选择模型.addEventListener('change', () => {
    const id = AI选择模型.value;
    if (!id) return;
    const 配置 = AI配置列表.find(c => c.id === id);
    if (配置) 填充表单(配置);
});

function saveKeyJS() {
    const 内容 = '// Termux:Embellish AI 配置文件\n// 自动生成，请勿手动编辑\nconst AI配置列表 = ' + JSON.stringify(AI配置列表, null, 4) + ';\nexport default AI配置列表;\n';
    if (typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'save_file', path: 'res/js/key.js', content: 内容 }));
    }
    localStorage.setItem('AI配置列表', JSON.stringify(AI配置列表));
}

// ==================== AI 发送消息 ====================
function 发送消息() {
    const 内容 = AI输入框元素.value.trim();
    if (!内容) return;
    const 优先配置 = AI配置列表.find(c => c.优先级 === '优先');
    const 同时配置 = AI配置列表.filter(c => c.优先级 === '同时');
    const 可用配置 = 优先配置 ? [优先配置] : 同时配置;
    if (可用配置.length === 0) {
        const 用户消息 = document.createElement('div');
        用户消息.className = 'AI用户气泡';
        用户消息.textContent = 内容;
        AI对话区.appendChild(用户消息);
        AI输入框元素.value = '';
        setTimeout(() => {
            const AI行 = document.createElement('div');
            AI行.className = 'AI消息行';
            AI行.innerHTML = '<div class="AI头像">⌘</div><div class="AI纯文本">当前未连接 AI 服务，请配置以下信息开始使用：<br>① API 地址（服务商提供的接口链接）<br>② API密钥Key（您的身份验证密钥）<h3 id="配置ai" style="color:#00ccff;text-decoration:underline;cursor:pointer;">点击配置</h3></div>';
            AI对话区.appendChild(AI行);
            AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
        }, 600);
        return;
    }
    const 用户消息 = document.createElement('div');
    用户消息.className = 'AI用户气泡';
    用户消息.textContent = 内容;
    AI对话区.appendChild(用户消息);
    AI输入框元素.value = '';
    AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
    可用配置.forEach(配置 => { 请求AI(配置, 内容); });
}
async function 请求AI(配置, 用户输入) {
    AI正在请求 = true;
    当前请求控制器 = new AbortController();
    const 发送按钮 = document.getElementById('AI新对话按钮');
    
    // 切换为停止按钮
    if (发送按钮) {
        发送按钮.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.5"/>
            <rect x="8" y="8" width="8" height="8" rx="1" stroke="#fff" stroke-width="1.5"/>
        </svg>`;
        发送按钮.onclick = function(e) {
            e.stopPropagation();
            if (当前请求控制器) {
                当前请求控制器.abort();
                当前请求控制器 = null;
            }
        };
    }

    // 创建 AI 消息行
    const AI行 = document.createElement('div');
    AI行.className = 'AI消息行';
    const 内容区 = document.createElement('div');
    内容区.className = 'AI纯文本';
    内容区.style.color = '#fff';
    内容区.style.whiteSpace = 'pre-wrap';
    内容区.style.wordBreak = 'break-word';
    内容区.textContent = '思考中...';
    const 头像 = document.createElement('div');
    头像.className = 'AI头像';
    头像.textContent = '⌘';
    AI行.appendChild(头像);
    AI行.appendChild(内容区);
    AI对话区.appendChild(AI行);
    AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;

    try {
       let systemPrompt = '你是一个在termux:embellish v1.0.3版本中被调用的AI \n职责：你需要解决用户提出的问题，或帮助用户直接操作 Termux 终端。\n输出格式：\n1. 普通文本回复\n2. 你可以直接在用户的termux中执行bash命令，用 ```bash 代码块包裹，termux:embellish会将你发送的代码块发通至termux直接执行后，再将结果通过用户发送框返还给你\n3.询问用户是否有执行特定命令时，不要用```bash 代码块包裹，直接以文本形式输出\n4.每次输出，最多只能用两次```bash 代码块，剩下的会被termux:embellish拒绝发送\n5. 如需要了解termux:embellish，详情：https://github.com/siyecao-meng/termux-embellish';
        if (思考模式) {
            systemPrompt += '\n请将你的思考过程放在 <thinking>...</thinking> 标签中，然后再给出最终回答。';
        }

        const 响应 = await fetch(配置.端口, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + 配置.Key 
            },
            body: JSON.stringify({
                model: 配置.模型 || 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: 用户输入 }
                ],
                stream: true
            }),
            signal: 当前请求控制器.signal
        });

        if (!响应.ok) throw new Error('HTTP ' + 响应.status);
        
        const reader = 响应.body.getReader();
        const decoder = new TextDecoder();
        let 完整回复 = '';
        let 缓冲区 = '';
        let 思考内容缓冲区 = '';
        let 思考标签已输出 = false;
        
        // 清空"思考中..."
        内容区.innerHTML = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const 文本块 = decoder.decode(value, { stream: true });
            缓冲区 += 文本块;
            const 行数组 = 缓冲区.split('\n');
            缓冲区 = 行数组.pop() || '';
            
            for (const 行 of 行数组) {
                if (行.startsWith('data: ')) {
                    const 数据 = 行.slice(6);
                    if (数据 === '[DONE]') continue;
                    try {
                        const 解析 = JSON.parse(数据);
                        const 增量 = 解析.choices?.[0]?.delta?.content || '';
                        if (增量) {
                            完整回复 += 增量;
                            
                            // 处理思考模式
                            if (思考模式 && !思考标签已输出) {
                                思考内容缓冲区 += 增量;
                                if (思考内容缓冲区.includes('</thinking>')) {
                                    const match = 思考内容缓冲区.match(/<thinking>([\s\S]*?)<\/thinking>/);
                                    if (match && match[1]) {
                                        内容区.innerHTML = '<span style="color:#888;">思考过程：</span><br><span style="color:#aaa;">' + match[1].trim().replace(/\n/g, '<br>') + '</span><br><br><span style="color:#fff;">回答：</span><br><span style="color:#fff;">';
                                        思考标签已输出 = true;
                                        const 剩余 = 思考内容缓冲区.replace(/<thinking>[\s\S]*?<\/thinking>/, '');
                                        if (剩余) {
                                            内容区.innerHTML += 剩余.replace(/\n/g, '<br>');
                                        }
                                    } else {
                                        内容区.innerHTML = 思考内容缓冲区.replace(/\n/g, '<br>');
                                        思考标签已输出 = true;
                                    }
                                } else if (!思考内容缓冲区.includes('<thinking>')) {
                                    思考标签已输出 = true;
                                    内容区.innerHTML = 完整回复.replace(/\n/g, '<br>');
                                }
                            } else {
                                if (思考模式 && 思考标签已输出) {
                                    // 已显示思考内容，追加正文
                                    const 正文 = 完整回复.replace(/<thinking>[\s\S]*?<\/thinking>/, '');
                                    内容区.innerHTML = '<span style="color:#888;">思考过程：</span><br><span style="color:#aaa;">' + (思考内容缓冲区.match(/<thinking>([\s\S]*?)<\/thinking>/)?.[1] || '').trim().replace(/\n/g, '<br>') + '</span><br><br><span style="color:#fff;">回答：</span><br><span style="color:#fff;">' + 正文.replace(/\n/g, '<br>');
                                } else {
                                    内容区.innerHTML = 完整回复.replace(/\n/g, '<br>');
                                }
                            }
                            AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
                        }
                    } catch (e) {}
                }
            }
        }
        
        // 如果没有收到任何内容，显示提示
        if (!完整回复) {
            内容区.innerHTML = '没有收到回复，请检查 API 配置';
        } else if (思考模式 && !思考标签已输出) {
            // 没找到 thinking 标签，直接显示全部
            const 清理后 = 完整回复.replace(/<\/?thinking>/g, '');
            内容区.innerHTML = 清理后.replace(/\n/g, '<br>');
        }
        
        // 提取命令并处理权限
const 命令列表 = 提取命令(完整回复);
if (命令列表.length > 0) {
    const 模型名 = 配置.名称 || 'AI';
    const 允许命令 = [];
    const 询问命令 = [];
    const 禁用命令 = [];
    
    命令列表.forEach(cmd => {
        const 命令名 = cmd.trim().split(' ')[0];
        const 状态 = 命令状态表[命令名] || '询问';
        if (状态 === '允许') 允许命令.push(cmd);
        else if (状态 === '禁用') 禁用命令.push(cmd);
        else 询问命令.push(cmd);
    });
    
    // 显示禁用的命令
    if (禁用命令.length > 0) {
        const 禁用行 = document.createElement('div');
        禁用行.className = 'AI消息行';
        禁用行.innerHTML = '<div class="AI头像">⌘</div><div class="AI纯文本" style="color:#ff6666;">以下命令已被禁用，未执行：' + 禁用命令.join(', ') + '</div>';
        AI对话区.appendChild(禁用行);
        AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
    }
    
    // 处理允许的命令（直接执行）
    if (允许命令.length > 0 && typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN && 当前会话ID) {
        const 执行行 = document.createElement('div');
        执行行.className = 'AI消息行';
        执行行.innerHTML = '<div class="AI头像">⌘</div><div class="AI纯文本" style="color:#00ff88;">自动执行允许的命令：' + 允许命令.join(', ') + '</div>';
        AI对话区.appendChild(执行行);
        AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
        
        for (const cmd of 允许命令) {
            ws.send(JSON.stringify({ type: 'execute', sessionId: 当前会话ID, command: cmd }));
            if (日志级别 !== '不记录') 记录日志(cmd, '允许');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // 处理询问的命令（弹窗确认）
    if (询问命令.length > 0) {
        const 首个命令 = 询问命令[0].trim().split(' ')[0];
        显示确认弹窗(模型名 + '想要执行 ' + 首个命令 + ' 命令，您允许它执行吗？', async (确认) => {
            if (确认 && typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN && 当前会话ID) {
                for (const cmd of 询问命令) {
                    ws.send(JSON.stringify({ type: 'execute', sessionId: 当前会话ID, command: cmd }));
                    if (日志级别 !== '不记录') 记录日志(cmd, '询问');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else if (!确认) {
                const 拒绝行 = document.createElement('div');
                拒绝行.className = 'AI消息行';
                拒绝行.innerHTML = '<div class="AI头像">⌘</div><div class="AI纯文本" style="color:#ffaa00;">用户拒绝了执行：' + 询问命令.join(', ') + '</div>';
                AI对话区.appendChild(拒绝行);
                AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
            }
        });
    }
}
        
    } catch (错误) {
        console.error('AI请求错误:', 错误);
        if (错误.name === 'AbortError') {
            内容区.innerHTML = '请求已取消';
        } else {
            内容区.innerHTML = '请求失败：' + 错误.message;
        }
    } finally {
        AI正在请求 = false;
        当前请求控制器 = null;
        const 发送按钮恢复 = document.getElementById('AI新对话按钮');
        if (发送按钮恢复) {
            发送按钮恢复.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13" stroke="#fff" stroke-width="1.5"/>
                <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" stroke-width="1.5"/>
            </svg>`;
            发送按钮恢复.onclick = function(e) { e.stopPropagation(); 发送消息(); };
        }
        AI抽屉内容.scrollTop = AI抽屉内容.scrollHeight;
    }
}
function 提取命令(文本) {
    const 正则 = /```bash\n([\s\S]*?)```/g;
    const 命令列表 = [];
    let 匹配;
    while ((匹配 = 正则.exec(文本)) !== null) {
        命令列表.push(匹配[1].trim());
    }
    return 命令列表;
}



if (AI抽屉内容 && AI输入框元素) {
    AI抽屉内容.addEventListener('scroll', () => {
        const 滚动到底 = AI抽屉内容.scrollTop + AI抽屉内容.clientHeight >= AI抽屉内容.scrollHeight - 20;
        if (滚动到底) {
            AI输入框元素.style.bottom = '15px';
            if (AI工具栏) AI工具栏.style.bottom = '20px';
        } else {
            AI输入框元素.style.bottom = '-130px';
            if (AI工具栏) AI工具栏.style.bottom = '-80px';
        }
    });
}
// ==================== 自定义 JS 弹窗 ====================
const AI自定义JS弹窗 = document.getElementById('AI自定义JS弹窗');
const AI自定义JS输入 = document.getElementById('AI自定义JS输入');

document.getElementById('AI自定义JS').addEventListener('click', () => {
    const 现有JS = localStorage.getItem('AI自定义JS') || '// 自定义 AI 请求函数\n// 参数：用户输入, API地址, API密钥, 模型名称\n// 必须返回 AI 回复的文字内容\n\nasync function 自定义AI请求(用户输入, API地址, API密钥, 模型) {\n    const 响应 = await fetch(API地址, {\n        method: \'POST\',\n        headers: {\n            \'Content-Type\': \'application/json\',\n            \'Authorization\': \'Bearer \' + API密钥\n        },\n        body: JSON.stringify({\n            model: 模型,\n            messages: [\n                { role: \'system\', content: \'你是 Termux:Embellish 的 AI 助手\' },\n                { role: \'user\', content: 用户输入 }\n            ]\n        })\n    });\n    \n    if (!响应.ok) throw new Error(\'请求失败\');\n    const 数据 = await 响应.json();\n    return 数据.choices[0].message.content;\n}';
    AI自定义JS输入.value = 现有JS;
    AI自定义JS弹窗.classList.add('打开');
});

document.getElementById('AI保存自定义JS').addEventListener('click', () => {
    const 新代码 = AI自定义JS输入.value;
    localStorage.setItem('AI自定义JS', 新代码);
    if (typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'save_file', path: 'res/js/key.js', content: 新代码 }));
    }
    AI自定义JS弹窗.classList.remove('打开');
});
document.getElementById('AI取消自定义JS').addEventListener('click', () => { AI自定义JS弹窗.classList.remove('打开'); });
AI自定义JS弹窗.addEventListener('click', (e) => { if (e.target === AI自定义JS弹窗) AI自定义JS弹窗.classList.remove('打开'); });

// ==================== 设置面板 AI 按钮 ====================
const 打开AI配置按钮 = document.getElementById('打开AI配置');
if (打开AI配置按钮) {
    打开AI配置按钮.addEventListener('click', () => { 清空表单(); 刷新选择器(); 更新配置状态(); AI配置弹窗.classList.add('打开'); });
}
function 更新AI状态提示() {
    if (!AI状态提示) return;
    const 优先配置 = AI配置列表.find(c => c.优先级 === '优先');
    const 同时配置 = AI配置列表.filter(c => c.优先级 === '同时');
    if (优先配置) { AI状态提示.textContent = '已配置：' + 优先配置.名称; AI状态提示.style.color = '#00ff88'; }
    else if (同时配置.length > 0) { AI状态提示.textContent = '已配置：' + 同时配置.length + ' 个并行'; AI状态提示.style.color = '#00ccff'; }
    else { AI状态提示.textContent = '未配置'; AI状态提示.style.color = 'rgba(255,255,255,0.4)'; }
}

// ==================== 可执行命令弹窗 ====================
const AI命令弹窗 = document.getElementById('AI命令弹窗');
const AI命令列表 = document.getElementById('AI命令列表');
const AI命令搜索 = document.getElementById('AI命令搜索');
const 命令分类数据 = {
    '文件操作': ['ls', 'cd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'pwd', 'ln', 'lsblk'],
    '文本查看与编辑': ['cat', 'less', 'more', 'head', 'tail', 'grep', 'echo', 'printf', 'sort', 'uniq', 'wc', 'nano'],
    '权限与进程': ['chmod', 'chown', 'ps', 'kill', 'pkill', 'pgrep', 'top'],
    '网络工具': ['curl', 'wget', 'ping', 'netstat', 'ssh', 'scp'],
    '压缩解压': ['gzip', 'gunzip', 'tar', 'zip', 'unzip'],
    '系统信息': ['uname', 'whoami', 'id', 'df', 'du', 'free', 'date', 'uptime']
};
let 命令状态表 = JSON.parse(localStorage.getItem('AI命令状态') || '{}');
let 日志级别 = localStorage.getItem('AI日志级别') || '普通';
const 日志级别选项 = ['详细', '警告', '普通', '不记录'];

function 保存命令状态() { localStorage.setItem('AI命令状态', JSON.stringify(命令状态表)); }
function 获取命令状态(命令) { return 命令状态表[命令] || '询问'; }
function 切换命令状态(命令) {
    const 当前 = 获取命令状态(命令);
    命令状态表[命令] = 当前 === '询问' ? '允许' : (当前 === '允许' ? '禁用' : '询问');
    保存命令状态();
    渲染命令列表();
}

function 渲染命令列表(搜索词 = '') {
    if (!AI命令列表) return;
    AI命令列表.innerHTML = '';
    for (const [分类, 命令们] of Object.entries(命令分类数据)) {
        const 过滤后 = 搜索词 ? 命令们.filter(c => c.includes(搜索词)) : 命令们;
        if (过滤后.length === 0) continue;
        const 分类标题 = document.createElement('div');
        分类标题.className = 'AI命令分类 展开';
        分类标题.textContent = 分类 + ' (' + 过滤后.length + ')';
        const 子列表 = document.createElement('div');
        子列表.className = 'AI命令子列表 打开';
        分类标题.addEventListener('click', () => { 分类标题.classList.toggle('展开'); 子列表.classList.toggle('打开'); });
        过滤后.forEach(命令 => {
            const 状态 = 获取命令状态(命令);
            const 项 = document.createElement('div');
            项.className = 'AI命令项';
            项.innerHTML = '<span class="命令名">' + 命令 + '</span><span class="命令状态 ' + 状态 + '">' + 状态 + '</span>';
            项.querySelector('.命令状态').addEventListener('click', (e) => { e.stopPropagation(); 切换命令状态(命令); });
            子列表.appendChild(项);
        });
        AI命令列表.appendChild(分类标题);
        AI命令列表.appendChild(子列表);
    }
}

document.getElementById('打开可执行命令').addEventListener('click', () => { 渲染命令列表(); AI命令弹窗.classList.add('打开'); });
document.getElementById('AI关闭命令弹窗').addEventListener('click', () => { AI命令弹窗.classList.remove('打开'); });
AI命令弹窗.addEventListener('click', (e) => { if (e.target === AI命令弹窗) AI命令弹窗.classList.remove('打开'); });
document.getElementById('AI命令搜索确定').addEventListener('click', () => { 渲染命令列表(AI命令搜索.value.trim()); });
AI命令搜索.addEventListener('keydown', (e) => { if (e.key === 'Enter') 渲染命令列表(AI命令搜索.value.trim()); });

// 日志级别
const 日志级别按钮 = document.getElementById('AI执行日志级别');
function 更新日志级别按钮() { 日志级别按钮.textContent = '执行日志：' + 日志级别; }
日志级别按钮.addEventListener('click', () => {
    const 当前索引 = 日志级别选项.indexOf(日志级别);
    日志级别 = 日志级别选项[(当前索引 + 1) % 日志级别选项.length];
    localStorage.setItem('AI日志级别', 日志级别);
    更新日志级别按钮();
});
更新日志级别按钮();

function 记录日志(命令, 权限状态) {
    if (日志级别 === '详细' || (日志级别 === '警告' && 权限状态 === '询问')) {
        const log = '[' + new Date().toISOString() + '] ' + 权限状态 + ' | ' + 命令 + '\n';
        if (typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'append_file', path: 'res/ai_log.txt', content: log }));
        }
    } else if (日志级别 === '普通') {
        const log = '[' + new Date().toISOString() + '] ' + 命令 + '\n';
        if (typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'append_file', path: 'res/ai_log.txt', content: log }));
        }
    }
}

更新配置状态();
刷新选择器();
// ==================== AI 浮动工具栏 ====================
let 当前选中的用户气泡 = null;
let 当前选中的AI消息 = null;
let 当前显示的工具栏 = null; // 'user' 或 'ai'

// 隐藏所有浮动工具栏
function 隐藏所有浮动工具栏() {
    const 用户工具栏 = document.getElementById('AI用户浮动工具栏');
    const AI工具栏 = document.getElementById('AI消息浮动工具栏');
    if (用户工具栏) {
        用户工具栏.style.opacity = '0';
        用户工具栏.style.pointerEvents = 'none';
    }
    if (AI工具栏) {
        AI工具栏.style.opacity = '0';
        AI工具栏.style.pointerEvents = 'none';
    }
}

// 显示用户气泡的修改按钮（在气泡右下角）
function 显示用户工具栏(气泡元素) {
    隐藏所有浮动工具栏();
    let 工具栏 = document.getElementById('AI用户浮动工具栏');
    if (!工具栏) {
        const html = `
            <div id="AI用户浮动工具栏" style="position:fixed;opacity:0;pointer-events:none;transition:opacity 0.2s;z-index:10002;">
                <div id="用户修改按钮" style="cursor:pointer;padding:8px;border-radius:50%;background:transparent;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
                        <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
                    </svg>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        工具栏 = document.getElementById('AI用户浮动工具栏');
        
        // 绑定修改按钮事件
        const 修改按钮 = document.getElementById('用户修改按钮');
        if (修改按钮) {
            修改按钮.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!当前选中的用户气泡) return;
                
                const 原文本 = 当前选中的用户气泡.textContent;
                const 底部输入框 = document.getElementById('AI输入框');
                const 底部工具栏 = document.querySelector('.AI底部工具栏');
                if (底部输入框) 底部输入框.style.bottom = '-130px';
                if (底部工具栏) 底部工具栏.style.bottom = '-80px';
                
                const 输入框 = document.createElement('textarea');
                输入框.value = 原文本;
                输入框.style.cssText = 'width:80%;min-height:40px;background:rgba(0,180,255,0.25);border:1px solid rgba(0,180,255,0.5);border-radius:12px;color:white;font-size:13px;font-family:monospace;padding:10px;resize:vertical;outline:none;align-self:flex-end;';
                当前选中的用户气泡.replaceWith(输入框);
                输入框.focus();
                
                const 提交修改 = function() {
                    const 新文本 = 输入框.value.trim();
                    if (底部输入框) 底部输入框.style.bottom = '15px';
                    if (底部工具栏) 底部工具栏.style.bottom = '20px';
                    
                    if (!新文本) {
                        const 原气泡 = document.createElement('div');
                        原气泡.className = 'AI用户气泡';
                        原气泡.textContent = 原文本;
                        输入框.replaceWith(原气泡);
                        隐藏所有浮动工具栏();
                        return;
                    }
                    
                    const 新气泡 = document.createElement('div');
                    新气泡.className = 'AI用户气泡';
                    新气泡.textContent = 新文本;
                    输入框.replaceWith(新气泡);
                    当前选中的用户气泡 = 新气泡;
                    
                    const 优先配置 = AI配置列表.find(function(c) { return c.优先级 === '优先'; });
                    const 同时配置 = AI配置列表.filter(function(c) { return c.优先级 === '同时'; });
                    const 可用配置 = 优先配置 ? [优先配置] : 同时配置;
                    if (可用配置.length > 0) 请求AI(可用配置[0], 新文本);
                    
                    隐藏所有浮动工具栏();
                };
                
                输入框.addEventListener('keydown', function(ev) {
                    if (ev.key === 'Enter' && !ev.shiftKey) {
                        ev.preventDefault();
                        提交修改();
                    }
                });
                输入框.addEventListener('blur', 提交修改);
                隐藏所有浮动工具栏();
            });
        }
    }
    
    const rect = 气泡元素.getBoundingClientRect();
    工具栏.style.left = (rect.right - 30) + 'px';
    工具栏.style.top = (rect.bottom - 2) + 'px';
    工具栏.style.opacity = '1';
    工具栏.style.pointerEvents = 'auto';
}

// 显示 AI 消息的重新生成按钮（在消息右下角）
function 显示AI工具栏(AI消息元素) {
    隐藏所有浮动工具栏();
    let 工具栏 = document.getElementById('AI消息浮动工具栏');
    if (!工具栏) {
        const html = `
            <div id="AI消息浮动工具栏" style="position:fixed;opacity:0;pointer-events:none;transition:opacity 0.2s;z-index:10002;">
                <div id="AI重新生成按钮" style="cursor:pointer;padding:8px;border-radius:50%;background:transparent;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.9 1 6.7 2.8" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
                        <polyline points="21 3 21 9 15 9" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
                    </svg>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        工具栏 = document.getElementById('AI消息浮动工具栏');
        
        // 绑定重新生成按钮事件
        const 重生成按钮 = document.getElementById('AI重新生成按钮');
        if (重生成按钮) {
            重生成按钮.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!当前选中的AI消息) return;
                
                // 找当前 AI 消息上面最近的一条用户气泡
                const 所有消息 = Array.from(AI对话区.children);
                const 当前索引 = 所有消息.indexOf(当前选中的AI消息);
                let 上方的用户气泡 = null;
                for (let i = 当前索引 - 1; i >= 0; i--) {
                    if (所有消息[i].classList.contains('AI用户气泡')) {
                        上方的用户气泡 = 所有消息[i];
                        break;
                    }
                }
                
                const 用户输入 = 上方的用户气泡?.textContent?.trim();
                if (!用户输入) return;
                
                // 删除当前的 AI 消息
                当前选中的AI消息.remove();
                
                const 优先配置 = AI配置列表.find(function(c) { return c.优先级 === '优先'; });
                const 同时配置 = AI配置列表.filter(function(c) { return c.优先级 === '同时'; });
                const 可用配置 = 优先配置 ? [优先配置] : 同时配置;
                
                if (可用配置.length > 0) {
                    请求AI(可用配置[0], 用户输入);
                }
                
                隐藏所有浮动工具栏();
            });
        }
    }
    
    const rect = AI消息元素.getBoundingClientRect();
    工具栏.style.left = (rect.right - 45) + 'px';
    工具栏.style.top = (rect.bottom - 25 ) + 'px';
    工具栏.style.opacity = '1';
    工具栏.style.pointerEvents = 'auto';
}

// 监听点击事件
document.addEventListener('click', function(e) {
    // 查找被点击的蓝色气泡（用户消息）
    const 用户气泡 = e.target.closest('.AI用户气泡');
    if (用户气泡) {
        e.stopPropagation();
        当前选中的用户气泡 = 用户气泡;
        当前选中的AI消息 = null;
        显示用户工具栏(用户气泡);
        return;
    }
    
    // 查找被点击的 AI 消息
    const AI消息 = e.target.closest('.AI消息行');
    if (AI消息) {
        e.stopPropagation();
        当前选中的AI消息 = AI消息;
        当前选中的用户气泡 = null;
        显示AI工具栏(AI消息);
        return;
    }
    
    // 点击其他地方隐藏所有工具栏
    隐藏所有浮动工具栏();
});

// ==================== 思考与联网按钮 ====================
const 思考按钮 = document.querySelector('.AI操作按钮:nth-child(3)');
const 联网按钮 = document.querySelector('.AI操作按钮:nth-child(4)');

let 思考模式 = localStorage.getItem('AI思考模式') === null ? true : localStorage.getItem('AI思考模式') === 'true';
let 联网模式 = localStorage.getItem('AI联网模式') === null ? true : localStorage.getItem('AI联网模式') === 'true';

// 初始化按钮状态
function 更新思考联网按钮状态() {
    if (思考按钮) {
        if (思考模式) {
            思考按钮.style.background = 'rgba(0,180,255,0.3)';
            思考按钮.style.borderColor = 'rgba(0,180,255,0.6)';
            思考按钮.style.color = '#00ccff';
        } else {
            思考按钮.style.background = 'rgba(255,255,255,0.02)';
            思考按钮.style.borderColor = 'rgba(255,255,255,0.12)';
            思考按钮.style.color = 'white';
        }
    }
    if (联网按钮) {
        if (联网模式) {
            联网按钮.style.background = 'rgba(0,180,255,0.3)';
            联网按钮.style.borderColor = 'rgba(0,180,255,0.6)';
            联网按钮.style.color = '#00ccff';
        } else {
            联网按钮.style.background = 'rgba(255,255,255,0.02)';
            联网按钮.style.borderColor = 'rgba(255,255,255,0.12)';
            联网按钮.style.color = 'white';
        }
    }
}

if (思考按钮) {
    思考按钮.addEventListener('click', function(e) {
        e.stopPropagation();
        思考模式 = !思考模式;
        localStorage.setItem('AI思考模式', 思考模式);
        更新思考联网按钮状态();
    });
}

if (联网按钮) {
    联网按钮.addEventListener('click', function(e) {
        e.stopPropagation();
        联网模式 = !联网模式;
        localStorage.setItem('AI联网模式', 联网模式);
        更新思考联网按钮状态();
    });
}

// 页面加载时恢复状态
setTimeout(更新思考联网按钮状态, 300);
// ==================== 本地AI模型管理（完整版） ====================
setTimeout(function() {
    const 模型按钮 = document.getElementById('本地ai模型');
    const 模型弹窗 = document.getElementById('本地模型弹窗');
    const 模型列表 = document.getElementById('本地模型列表');
    const 模型搜索 = document.getElementById('本地模型搜索');
    const 拉取按钮 = document.getElementById('拉取模型按钮');
    const 已拉取按钮 = document.getElementById('已拉取模型按钮');
    const 关闭按钮 = document.getElementById('关闭本地模型弹窗');
    const 已拉取弹窗 = document.getElementById('已拉取模型弹窗');
    const 已拉取列表 = document.getElementById('已拉取模型列表');
    const 已拉取搜索 = document.getElementById('已拉取模型搜索');
    const 关闭已拉取按钮 = document.getElementById('关闭已拉取模型弹窗');
    const 全部同时按钮 = document.getElementById('全部同时按钮');
    const 全部等待按钮 = document.getElementById('全部等待按钮');
    
    if (!模型按钮 || !模型弹窗) return;
    
    let 模型数据 = [];
    let 已拉取数据 = [];
    
    async function 检查Ollama() {
        try { const r = await fetch('http://127.0.0.1:11434/api/tags'); return r.ok; }
        catch(e) { return false; }
    }
    
    function 读取优先级(name) {
        const saved = JSON.parse(localStorage.getItem('AI配置列表') || '[]');
        const found = saved.find(c => c.模型 === name);
        return found?.优先级 || '等待';
    }
    
    function 保存优先级(name, level) {
        let saved = JSON.parse(localStorage.getItem('AI配置列表') || '[]');
        const found = saved.find(c => c.模型 === name);
        if (found) {
            found.优先级 = level;
        } else {
            saved.push({
                id: 'ai_' + Date.now(),
                名称: name,
                模型: name,
                端口: 'http://127.0.0.1:11434/v1/chat/completions',
                Key: 'ollama',
                优先级: level,
                创建时间: Date.now()
            });
        }
        localStorage.setItem('AI配置列表', JSON.stringify(saved));
        
        AI配置列表 = JSON.parse(localStorage.getItem('AI配置列表') || '[]');
        刷新选择器();
        更新配置状态();
    }
    
    async function 获取模型() {
        模型列表.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">加载中...</div>';
        try {
            const r = await fetch('https://ollama.com/library');
            const h = await r.text();
            const re = /\/library\/([^"#\s]+)/g;
            const s = new Set();
            let m;
            while ((m = re.exec(h)) !== null) {
                const n = m[1].trim();
                if (n && !n.includes('/') && n.length < 30) s.add(n);
            }
            模型数据 = Array.from(s).sort();
            渲染可选列表(模型数据);
        } catch(e) {
            模型列表.innerHTML = '<div style="text-align:center;padding:20px;color:#ff8888;">网络错误</div>';
        }
    }
    
    function 渲染可选列表(data) {
        模型列表.innerHTML = '';
        if (data.length === 0) {
            模型列表.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">无模型</div>';
            return;
        }
        data.forEach(name => {
            const div = document.createElement('div');
            div.style.cssText = 'padding:8px 12px;margin:2px 0;background:rgba(255,255,255,0.05);border-radius:8px;font-size:12px;display:flex;justify-content:space-between;align-items:center;';
            div.innerHTML = '<span>' + name + '</span><span style="color:#00ccff;font-size:11px;cursor:pointer;">拉取</span>';
            div.querySelector('span:last-child').onclick = async function(e) {
                e.stopPropagation();
                if (!await 检查Ollama()) { 
                    window.alert('请先运行 model 命令'); 
                    return; 
                }
                var fullName = name.includes(':') ? name : name + ':latest';
                if (!confirm('拉取 ' + fullName + ' ？')) return;
                
                显示全局进度条(fullName);
                开始模拟进度();
                
                try {
                    var controller = new AbortController();
                    当前拉取任务 = controller;
                    
                    var response = await fetch('http://127.0.0.1:11434/api/pull', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({name: fullName, stream: false}),
                        signal: controller.signal
                    });
                    
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    完成进度();
                    setTimeout(function() { 
                        window.alert(fullName + ' 完成'); 
                    }, 500);
                } catch(ex) {
                    if (ex.name === 'AbortError') {
                        console.log('拉取已取消');
                    } else {
                        进度条失败(ex.message);
                        window.alert('拉取失败: ' + ex.message);
                    }
                } finally {
                    当前拉取任务 = null;
                }
            };
            模型列表.appendChild(div);
        });
    }
    
    async function 获取已拉取() {
        if (!await 检查Ollama()) { alert('请先运行 model 命令启动服务'); return; }
        已拉取列表.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">加载中...</div>';
        try {
            const r = await fetch('http://127.0.0.1:11434/api/tags');
            const d = await r.json();
            已拉取数据 = (d.models || []).map(m => ({
                name: m.name,
                优先级: 读取优先级(m.name)
            }));
            渲染已拉取列表(已拉取数据);
            已拉取弹窗.classList.add('打开');
        } catch(e) {
            已拉取列表.innerHTML = '<div style="text-align:center;padding:20px;color:#ff8888;">获取失败</div>';
        }
    }
    
    function 渲染已拉取列表(data) {
        已拉取列表.innerHTML = '';
        if (data.length === 0) {
            已拉取列表.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">无模型</div>';
            return;
        }
        data.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = 'padding:8px 12px;margin:2px 0;background:rgba(255,255,255,0.05);border-radius:8px;font-size:12px;display:flex;justify-content:space-between;align-items:center;';
            
            const 优先级颜色 = item.优先级 === '优先' ? '#00ff88' : item.优先级 === '同时' ? '#00ccff' : '#888';
            div.innerHTML = `
                <span>${item.name}</span>
                <div style="display:flex;gap:6px;align-items:center;">
                    <span class="优先级切换-btn" style="color:${优先级颜色};font-size:11px;cursor:pointer;">${item.优先级}</span>
                    <span style="color:#ff8888;font-size:11px;cursor:pointer;">删除</span>
                </div>`;
            
            div.querySelector('.优先级切换-btn').onclick = function(e) {
                e.stopPropagation();
                const levels = ['优先', '同时', '等待'];
                const idx = levels.indexOf(item.优先级);
                item.优先级 = levels[(idx + 1) % 3];
                保存优先级(item.name, item.优先级);
                渲染已拉取列表(已拉取数据);
            };
            
            div.querySelector('span:last-child').onclick = async function(e) {
                e.stopPropagation();
                if (!confirm('删除 ' + item.name + ' ？')) return;
                try {
                    await fetch('http://127.0.0.1:11434/api/delete', {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({name: item.name})
                    });
                    获取已拉取();
                } catch(ex) { alert('删除失败'); }
            };
            
            已拉取列表.appendChild(div);
        });
    }
    
    if (模型搜索) 模型搜索.oninput = function() {
        const kw = this.value.toLowerCase();
        渲染可选列表(模型数据.filter(n => n.toLowerCase().includes(kw)));
    };
    if (已拉取搜索) 已拉取搜索.oninput = function() {
        const kw = this.value.toLowerCase();
        渲染已拉取列表(已拉取数据.filter(n => n.name.toLowerCase().includes(kw)));
    };
    
    if (全部同时按钮) 全部同时按钮.onclick = function() {
        已拉取数据.forEach(item => { item.优先级 = '同时'; 保存优先级(item.name, '同时'); });
        渲染已拉取列表(已拉取数据);
        刷新选择器();
    };
    if (全部等待按钮) 全部等待按钮.onclick = function() {
        已拉取数据.forEach(item => { item.优先级 = '等待'; 保存优先级(item.name, '等待'); });
        渲染已拉取列表(已拉取数据);
        刷新选择器();
    };
    
    模型按钮.onclick = function() { 模型弹窗.classList.add('打开'); 获取模型(); };
    拉取按钮.onclick = 获取模型;
    已拉取按钮.onclick = 获取已拉取;
    关闭按钮.onclick = function() { 模型弹窗.classList.remove('打开'); };
    关闭已拉取按钮.onclick = function() { 已拉取弹窗.classList.remove('打开'); };
    模型弹窗.onclick = function(e) { if (e.target === 模型弹窗) 模型弹窗.classList.remove('打开'); };
    已拉取弹窗.onclick = function(e) { if (e.target === 已拉取弹窗) 已拉取弹窗.classList.remove('打开'); };
    
    console.log('本地AI模型管理已挂载');
}, 1500);
// ==================== 全局悬浮进度条 ====================
let 当前拉取任务 = null;
let 拉取暂停 = false;
let 拉取取消标志 = false;
let 当前进度条元素 = null;
let 当前进度填充 = null;
let 当前进度百分比 = null;
let 当前进度状态 = null;
let 当前进度动画 = null;
let 当前模拟进度 = 0;

// 创建全局进度条元素
function 创建全局进度条() {
    if (document.getElementById('全局进度条')) return;
    
    const html = `
        <div id="全局进度条" class="全局进度条">
            <div class="全局进度条内容">
                <div class="全局进度条左侧">
                    <div class="全局进度条图标">O</div>
                    <div class="全局进度条信息">
                   
                        <div class="全局进度条详情" id="全局进度条详情">准备就绪...</div>
                    </div>
                </div>
                <div class="全局进度条进度区域">
                    <div class="全局进度条进度条">
                        <div class="全局进度条进度填充" id="全局进度条进度填充"></div>
                    </div>
                    <div class="全局进度条百分比" id="全局进度条百分比">0%</div>
                </div>
                <div class="全局进度条状态" id="全局进度条状态">拉取中</div>
            </div>
        </div>
        <div id="进度条菜单弹窗" class="进度条菜单弹窗">
            <div class="进度条菜单项" id="进度条暂停继续">
                <span></span> <span>暂停</span>
            </div>
            <div class="进度条菜单项 取消中" id="进度条取消">
                <span></span> <span>取消</span>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    
    当前进度条元素 = document.getElementById('全局进度条');
    当前进度填充 = document.getElementById('全局进度条进度填充');
    当前进度百分比 = document.getElementById('全局进度条百分比');
    当前进度状态 = document.getElementById('全局进度条状态');
    
    // 点击进度条显示菜单
    当前进度条元素.addEventListener('click', function(e) {
        e.stopPropagation();
        var 菜单 = document.getElementById('进度条菜单弹窗');
        if (菜单) 菜单.classList.toggle('打开');
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', function() {
        var 菜单 = document.getElementById('进度条菜单弹窗');
        if (菜单) 菜单.classList.remove('打开');
    });
    
    // 暂停/继续按钮
    var 暂停继续按钮 = document.getElementById('进度条暂停继续');
    if (暂停继续按钮) {
        暂停继续按钮.addEventListener('click', function(e) {
            e.stopPropagation();
            拉取暂停 = !拉取暂停;
            var 菜单 = document.getElementById('进度条菜单弹窗');
            if (菜单) 菜单.classList.remove('打开');
            
            if (拉取暂停) {
                暂停继续按钮.innerHTML = '<span>></span> <span>继续</span>';
                暂停继续按钮.classList.add('暂停中');
                if (当前进度状态) 当前进度状态.textContent = '已暂停';
                var 详情 = document.getElementById('全局进度条详情');
                if (详情) 详情.textContent = '已暂停，点击继续';
            } else {
                暂停继续按钮.innerHTML = '<span></span> <span>暂停</span>';
                暂停继续按钮.classList.remove('暂停中');
                if (当前进度状态) 当前进度状态.textContent = '拉取中';
                var 详情 = document.getElementById('全局进度条详情');
                if (详情) 详情.textContent = '继续拉取中...';
                继续模拟进度();
            }
        });
    }
    
    // 取消按钮
    var 取消按钮 = document.getElementById('进度条取消');
    if (取消按钮) {
        取消按钮.addEventListener('click', function(e) {
            e.stopPropagation();
            拉取取消标志 = true;
            var 菜单 = document.getElementById('进度条菜单弹窗');
            if (菜单) 菜单.classList.remove('打开');
            隐藏全局进度条();
            if (当前拉取任务 && typeof 当前拉取任务.abort === 'function') {
                当前拉取任务.abort();
            }
            window.alert('拉取已取消');
        });
    }
}

function 显示全局进度条(模型名) {
    创建全局进度条();
    当前进度条元素 = document.getElementById('全局进度条');
    if (当前进度条元素) {
        当前进度条元素.classList.add('显示');
    }
    var 详情 = document.getElementById('全局进度条详情');
    if (详情) 详情.textContent = '正在拉取 ' + 模型名 + '...';
    当前模拟进度 = 0;
    拉取暂停 = false;
    拉取取消标志 = false;
    更新进度显示(0);
    if (当前进度状态) 当前进度状态.textContent = '拉取中';
    
    // 重置暂停按钮文字
    var 暂停继续按钮 = document.getElementById('进度条暂停继续');
    if (暂停继续按钮) {
        暂停继续按钮.innerHTML = '<span></span> <span>暂停</span>';
        暂停继续按钮.classList.remove('暂停中');
    }
}

function 隐藏全局进度条() {
    if (当前进度条元素) {
        当前进度条元素.classList.remove('显示');
    }
    if (当前进度动画) {
        clearInterval(当前进度动画);
        当前进度动画 = null;
    }
}

function 更新进度显示(百分比) {
    if (当前进度填充) 当前进度填充.style.width = 百分比 + '%';
    if (当前进度百分比) 当前进度百分比.textContent = Math.floor(百分比) + '%';
}

function 开始模拟进度() {
    if (当前进度动画) clearInterval(当前进度动画);
    当前进度动画 = setInterval(function() {
        if (拉取暂停) return;
        if (拉取取消标志) {
            clearInterval(当前进度动画);
            return;
        }
        if (当前模拟进度 < 90) {
            当前模拟进度 += Math.random() * 8;
            if (当前模拟进度 > 90) 当前模拟进度 = 90;
            更新进度显示(当前模拟进度);
        }
    }, 500);
}

function 继续模拟进度() {
    if (当前进度动画) clearInterval(当前进度动画);
    开始模拟进度();
}

function 完成进度() {
    if (当前进度动画) clearInterval(当前进度动画);
    当前模拟进度 = 100;
    更新进度显示(100);
    if (当前进度状态) 当前进度状态.textContent = '完成';
    var 详情 = document.getElementById('全局进度条详情');
    if (详情) 详情.textContent = '拉取完成！';
    setTimeout(function() {
        隐藏全局进度条();
    }, 2000);
}

function 进度条失败(错误信息) {
    if (当前进度动画) clearInterval(当前进度动画);
    if (当前进度状态) 当前进度状态.textContent = '失败';
    var 详情 = document.getElementById('全局进度条详情');
    if (详情) 详情.textContent = '失败：' + 错误信息;
    setTimeout(function() {
        隐藏全局进度条();
    }, 3000);
}
// 初始化发送按钮（使用 onclick，不要再用 addEventListener）
if (AI发送按钮) {
    AI发送按钮.onclick = function(e) {
        e.stopPropagation();
        发送消息();
    };
}