// ==================== 三语言切换功能 ====================
const 语言切换按钮 = document.getElementById('语言切换按钮');
let 当前语言 = 'zh';  // zh, en, ja

// 语言文本库
const 语言文本 = {
    zh: {
        切换按钮: '中文',
        设置面板标题: '设置',
        背景图片路径: '背景图片路径',
        应用: '应用',
        重置: '重置',
        自定义主题: '自定义主题',
        背景颜色: '背景颜色',
        字体颜色: '字体颜色',
        字体选择: '字体选择',
        应用主题: '应用主题',
        重置默认: '重置默认',
        终端操作: '终端操作',
        双指缩放提示: '双指缩放可调整终端字体大小',
        关于: '关于',
        高级: '高级',
        终端: '终端',
        会话: '会话',
        键盘: '键盘',
        会话列表: '会话列表',
        添加会话: '添加会话',
        共X个会话: (n) => `共 ${n} 个会话`,
        确定: '确定',
        取消: '取消',
        关闭: '关闭',
        连接: '连接',
        重置中: '重置中',
        已重置: '已重置',
        超时: '超时',
        请求失败: '请求失败',
        请输入地址: '请输入地址',
        地址格式不正确: '地址格式不正确',
        会话名称: '会话名称',
        例如我的会话: '例如: 我的会话',
        确认删除: '确认删除',
        删除会话确认: '确定要删除这个会话吗？',
        添加会话标题: '添加会话',
        新会话: '新会话',
        正在连接: '正在连接',
        连接失败: '连接失败',
        连接断开: '连接断开',
        服务器已重置: '服务器已重置',
        请先选择一个会话: '请先选择一个会话'
    },
    en: {
        切换按钮: 'English',
        设置面板标题: 'Settings',
        背景图片路径: 'Background Image Path',
        应用: 'Apply',
        重置: 'Reset',
        自定义主题: 'Custom Theme',
        背景颜色: 'Background Color',
        字体颜色: 'Font Color',
        字体选择: 'Font Family',
        应用主题: 'Apply Theme',
        重置默认: 'Reset Default',
        终端操作: 'Terminal',
        双指缩放提示: 'Pinch to zoom font size',
        关于: 'About',
        高级: 'Advanced',
        终端: 'Terminal',
        会话: 'Sessions',
        键盘: 'Keyboard',
        会话列表: 'Session List',
        添加会话: 'Add Session',
        共X个会话: (n) => `${n} session${n !== 1 ? 's' : ''}`,
        确定: 'OK',
        取消: 'Cancel',
        关闭: 'Close',
        连接: 'Connect',
        重置中: 'Resetting',
        已重置: 'Reset',
        超时: 'Timeout',
        请求失败: 'Request Failed',
        请输入地址: 'Please enter address',
        地址格式不正确: 'Invalid address format',
        会话名称: 'Session Name',
        例如我的会话: 'e.g. My Session',
        确认删除: 'Confirm Delete',
        删除会话确认: 'Are you sure you want to delete this session?',
        添加会话标题: 'Add Session',
        新会话: 'New Session',
        正在连接: 'Connecting',
        连接失败: 'Connection failed',
        连接断开: 'Disconnected',
        服务器已重置: 'Server reset',
        请先选择一个会话: 'Please select a session first'
    },
    ja: {
        切换按钮: 'にちご',
        设置面板标题: '設定',
        背景图片路径: '背景画像パス',
        应用: '適用',
        重置: 'リセット',
        自定义主题: 'カスタムテーマ',
        背景颜色: '背景色',
        字体颜色: '文字色',
        字体选择: 'フォント',
        应用主题: 'テーマ適用',
        重置默认: 'デフォルトに戻す',
        终端操作: 'ターミナル',
        双指缩放提示: 'ピンチでフォントサイズ調整',
        关于: 'について',
        高级: '詳細',
        终端: 'ターミナル',
        会话: 'セッション',
        键盘: 'キーボード',
        会话列表: 'セッション一覧',
        添加会话: 'セッション追加',
        共X个会话: (n) => `合計 ${n} セッション`,
        确定: '決定',
        取消: 'キャンセル',
        关闭: '閉じる',
        连接: '接続',
        重置中: 'リセット中',
        已重置: 'リセット済',
        超时: 'タイムアウト',
        请求失败: 'リクエスト失敗',
        请输入地址: 'アドレスを入力してください',
        地址格式不正确: 'アドレス形式が正しくありません',
        会话名称: 'セッション名',
        例如我的会话: '例: マイセッション',
        确认删除: '削除確認',
        删除会话确认: 'このセッションを削除しますか？',
        添加会话标题: 'セッション追加',
        新会话: '新セッション',
        正在连接: '接続中',
        连接失败: '接続失敗',
        连接断开: '切断されました',
        服务器已重置: 'サーバーリセット',
        请先选择一个会话: '先にセッションを選択してください'
    }
};

// 获取翻译
function t(key, param = null) {
    let text = 语言文本[当前语言][key] || 语言文本['zh'][key] || key;
    if (param !== null && typeof text === 'function') {
        text = text(param);
    }
    return text;
}

// 更新所有界面文本
function 更新界面语言() {
    // 更新切换按钮本身
    语言切换按钮.textContent = t('切换按钮');
    
    // 更新设置面板标题
    const 设置选项标题 = document.querySelectorAll('.设置选项 > span');
    if (设置选项标题[0]) 设置选项标题[0].textContent = t('背景图片路径');
    if (设置选项标题[1]) 设置选项标题[1].textContent = t('自定义主题');
    if (设置选项标题[2]) 设置选项标题[2].textContent = t('终端操作');
    
    // 更新关于区域标题
    const 关于标题 = document.querySelectorAll('.设置选项 > span')[3];
    if (关于标题) 关于标题.textContent = t('关于');
    
    // 更新按钮文字
    const 应用背景按钮 = document.getElementById('应用背景图片');
    if (应用背景按钮) 应用背景按钮.textContent = t('应用');
    
    const 重置背景按钮 = document.getElementById('重置背景图片');
    if (重置背景按钮) 重置背景按钮.textContent = t('重置');
    
    const 背景颜色按钮 = document.getElementById('打开背景颜色选择器');
    if (背景颜色按钮) 背景颜色按钮.textContent = t('背景颜色');
    
    const 字体颜色按钮 = document.getElementById('打开字体颜色选择器');
    if (字体颜色按钮) 字体颜色按钮.textContent = t('字体颜色');
    
    const 字体选择按钮 = document.getElementById('打开字体选择器');
    if (字体选择按钮) 字体选择按钮.textContent = t('字体选择');
    
    const 应用主题按钮 = document.getElementById('应用主题');
    if (应用主题按钮) 应用主题按钮.textContent = t('应用主题');
    
    const 重置主题按钮 = document.getElementById('重置主题');
    if (重置主题按钮) 重置主题按钮.textContent = t('重置默认');
    
    // 底部按钮栏
    const 会话按钮 = document.getElementById('会话');
    if (会话按钮) 会话按钮.textContent = t('会话');
    
    const 键盘按钮底部 = document.getElementById('键盘按钮');
    if (键盘按钮底部) 键盘按钮底部.textContent = t('键盘');
    
    // 高级和关于按钮
    const 高级按钮 = document.getElementById('高级按钮');
    if (高级按钮) 高级按钮.textContent = t('高级');
    
    const 关于按钮 = document.getElementById('关于按钮');
    if (关于按钮) 关于按钮.textContent = t('关于');
    
    // 抽屉标题
    const 抽屉标题 = document.querySelector('.抽屉标题');
    if (抽屉标题) 抽屉标题.textContent = t('会话列表');
    
    const 添加会话按钮 = document.getElementById('添加会话按钮');
    if (添加会话按钮) 添加会话按钮.textContent = t('添加会话');
}

// 语言切换事件
if (语言切换按钮) {
    语言切换按钮.onclick = () => {
        if (当前语言 === 'zh') {
            当前语言 = 'en';
        } else if (当前语言 === 'en') {
            当前语言 = 'ja';
        } else {
            当前语言 = 'zh';
        }
        更新界面语言();
        // 保存语言选择到 localStorage
        localStorage.setItem('termux_language', 当前语言);
        // 显示切换提示
        const 提示 = document.createElement('div');
        提示.textContent = t('切换按钮');
        提示.style.position = 'fixed';
        提示.style.bottom = '80px';
        提示.style.left = '50%';
        提示.style.transform = 'translateX(-50%)';
        提示.style.background = 'rgba(0,0,0,0.6)';
        提示.style.backdropFilter = 'blur(10px)';
        提示.style.padding = '8px 16px';
        提示.style.borderRadius = '20px';
        提示.style.color = 'white';
        提示.style.fontSize = '14px';
        提示.style.zIndex = '99999';
        提示.style.opacity = '0';
        提示.style.transition = 'opacity 0.3s';
        document.body.appendChild(提示);
        setTimeout(() => { 提示.style.opacity = '1'; }, 10);
        setTimeout(() => {
            提示.style.opacity = '0';
            setTimeout(() => 提示.remove(), 300);
        }, 1500);
    };
}

// 恢复保存的语言
const 保存的语言 = localStorage.getItem('termux_language');
if (保存的语言 && ['zh', 'en', 'ja'].includes(保存的语言)) {
    当前语言 = 保存的语言;
}
// 延迟更新以确保 DOM 已加载
setTimeout(() => 更新界面语言(), 100);

// ==================== 支持作者弹窗（长按加速旋转版） ====================
(function() {
    const 支持弹窗HTML = `
<div id="支持作者弹窗" class="通用弹窗" style="z-index:50011;">
    <div class="通用弹窗内容" style="text-align:center;">
        <h2 style="color: #00ffff;">支持作者</h2>
        <div class="通用弹窗正文" style="text-align:center;margin-bottom:16px;">
            关于 Termux:Embellish<br>
            一个能让 Termux 更好用的工具<br>
            由一位 15 岁的开发者用心完成<br>
            <br>
            🌟 喜欢的话点个 Star，我会开心到起飞↓
            <div id="eagle" style="font-size: 80px; margin-top: 10px; display: inline-block; cursor: pointer; position: relative; transition: transform 0.05s ease;">🦅
            </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
            <span style="color:rgba(255,255,255,0.5);font-size:12px;">B站：四叶草_meng</span>
            <span style="color:rgba(255,255,255,0.5);font-size:12px;">小红书：四叶草 5331041348</span>
        </div>
        <button class="通用弹窗关闭" style="width:100%;">关闭</button>
    </div>
</div>`;

    const 目标元素 = document.querySelector('#AI服务标题 svg');
    if (!目标元素) return;

    let 点击锁定 = false;
    
    function 初始化旋转弹窗() {
        const 弹窗 = document.getElementById('支持作者弹窗');
        if (!弹窗) return;
        
        const 老鹰 = document.getElementById('eagle');
        if (!老鹰) return;
        
        // 创建右下角伽马值显示
        // 创建伽马值显示（放在弹窗内部，老鹰右下角）
let 伽马显示 = document.getElementById('gammaValueDisplay');
if (!伽马显示) {
    const 伽马容器 = document.createElement('div');
    伽马容器.id = 'gammaValueDisplay';
    伽马容器.style.cssText = 'margin-top: 10px; color: rgba(255,255,255,0.4); font-family: monospace; font-size: 11px; text-align: center;';
    伽马容器.innerHTML = '⚡ 伽马值: <span id="gammaValueNum">0.00</span><br><span style="font-size: 9px; opacity: 0.6;">长按老鹰充电</span>';
    
    const 老鹰 = document.getElementById('eagle');
    if (老鹰 && 老鹰.parentNode) {
        老鹰.parentNode.appendChild(伽马容器);
    }
    伽马显示 = document.getElementById('gammaValueNum');
}
        
        let 长按开始时间 = null;
        let 长按定时器 = null;
        let 当前转速 = 0;  // 转/秒
        let 当前角度 = 0;
        let 动画帧Id = null;
        let 上次时间戳 = 0;
        let 爆炸已触发 = false;
        let 长按中 = false;
        
        // 更新伽马值显示
     function 更新伽马显示(秒数) {
    let 伽马值 = 秒数;
    if (伽马值 < 1) 伽马值 = 伽马值.toFixed(2);
    else if (伽马值 < 10) 伽马值 = 伽马值.toFixed(1);
    else 伽马值 = Math.floor(伽马值);
    伽马显示.textContent = 秒数.toFixed(2);
    
    // 根据长按时间改变老鹰颜色（伽马值达到9以上变红）
    if (秒数 >= 6) {
        老鹰.style.color = '#ff0000';
        老鹰.style.textShadow = '0 0 30px red';
    } else if (秒数 >= 4) {
        老鹰.style.color = '#ff4400';
        老鹰.style.textShadow = '0 0 15px #ff4400';
    } else if (秒数 >= 2) {
        老鹰.style.color = '#ff8800';
        老鹰.style.textShadow = '0 0 10px #ff8800';
    } else if (秒数 >= 0) {
        老鹰.style.color = '#ffcc00';
    } else {
        老鹰.style.color = '';
        老鹰.style.textShadow = '';
    }
}
        
        // 计算转速：长按第10秒时 100转/秒，第20秒时 1000转/秒
        function 计算转速(秒数) {
            if (秒数 <= 0) return 0;
            // 公式：转速 = 10^(秒数/5) 左右
            // 第5秒: 10转/秒, 第10秒: 100转/秒, 第15秒: 316转/秒, 第20秒: 1000转/秒
            let 转速 = Math.pow(10, 秒数 / 5);
            return Math.min(转速, 5000); // 限制最大5000转/秒
        }
        
        // 旋转动画
        function 更新旋转(当前时间) {
            if (!上次时间戳) {
                上次时间戳 = 当前时间;
                requestAnimationFrame(更新旋转);
                return;
            }
            
            const 时间差 = Math.min(0.05, (当前时间 - 上次时间戳) / 1000);
            if (时间差 > 0 && 当前转速 > 0 && !爆炸已触发) {
                // 转速 = 转/秒，每秒钟转 currentSpeed 圈
                // 每圈360度，所以每秒转 currentSpeed * 360 度
                const 角度增量 = 当前转速 * 360 * 时间差;
                当前角度 += 角度增量;
                当前角度 %= 360;
                老鹰.style.transform = 'rotate(' + 当前角度 + 'deg)';
            }
            
            上次时间戳 = 当前时间;
            动画帧Id = requestAnimationFrame(更新旋转);
        }
        
        // 长按开始
        function 长按开始(e) {
            e.preventDefault();
            if (爆炸已触发) return;
            if (长按中) return;
            长按中 = true;
            长按开始时间 = Date.now();
            
            // 脉冲反馈
            老鹰.style.transform = 'scale(1.2)';
            setTimeout(() => {
                if (老鹰 && !爆炸已触发) 老鹰.style.transform = 'rotate(' + 当前角度 + 'deg) scale(1)';
            }, 150);
            
            长按定时器 = setInterval(() => {
                if (!长按中 || 爆炸已触发) return;
                const 当前秒数 = (Date.now() - 长按开始时间) / 1000;
                更新伽马显示(当前秒数);
                当前转速 = 计算转速(当前秒数);
                
                
                if (当前转速 >= 10 && !爆炸已触发) {
                    触发爆炸();
                }
                
                // 转速越高，脉冲越快
                const 脉冲间隔 = Math.max(50, 500 / (当前转速 + 1));
                if (长按定时器) {
                    clearInterval(长按定时器);
                    长按定时器 = setInterval(() => {
                        if (!长按中 || 爆炸已触发) return;
                        const 秒数 = (Date.now() - 长按开始时间) / 1000;
                        更新伽马显示(秒数);
                        当前转速 = 计算转速(秒数);
                        if (当前转速 >= 10 && !爆炸已触发) 触发爆炸();
                        
                        // 脉冲效果
                        老鹰.style.transform = 'scale(1.3) rotate(' + 当前角度 + 'deg)';
                        setTimeout(() => {
                            if (老鹰 && !爆炸已触发) 老鹰.style.transform = 'rotate(' + 当前角度 + 'deg) scale(1)';
                        }, 50);
                    }, 脉冲间隔);
                }
            }, 100);
        }
        
        // 长按结束
        function 长按结束() {
            长按中 = false;
            if (长按定时器) {
                clearInterval(长按定时器);
                长按定时器 = null;
            }
            // 转速归零，老鹰停止旋转
            当前转速 = 0;
            更新伽马显示(0);
            老鹰.style.color = '';
            老鹰.style.textShadow = '';
        }
        
        // 爆炸效果
        function 触发爆炸() {
            爆炸已触发 = true;
            长按中 = false;
            if (长按定时器) clearInterval(长按定时器);
            
            const 原内容 = 老鹰.innerHTML;
            const 原字号 = 老鹰.style.fontSize;
            
            当前转速 = 0;
            老鹰.style.transition = 'all 0.1s ease';
            老鹰.style.fontSize = '120px';
            老鹰.style.color = 'red';
            老鹰.style.textShadow = '0 0 30px red, 0 0 60px orange';
            老鹰.innerHTML = '💥';
            
            const 大字 = document.createElement('div');
            大字.textContent = '爆 炸 ！';
            大字.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:60px;font-weight:bold;color:red;text-shadow:0 0 20px orange,0 0 40px yellow;z-index:50030;white-space:nowrap;animation:爆炸动画 0.5s ease-out forwards;pointer-events:none;';
            document.body.appendChild(大字);
            
            if (!document.getElementById('爆炸动画样式')) {
                const 样式 = document.createElement('style');
                样式.id = '爆炸动画样式';
                样式.textContent = '@keyframes 爆炸动画{0%{transform:translate(-50%,-50%) scale(0.5);opacity:1;}100%{transform:translate(-50%,-50%) scale(3);opacity:0;}}';
                document.head.appendChild(样式);
            }
            
            setTimeout(() => {
                老鹰.style.fontSize = 原字号;
                老鹰.innerHTML = 原内容;
                老鹰.style.color = '';
                老鹰.style.textShadow = '';
                老鹰.style.transition = '';
                大字.remove();
                
                // 重置状态
                爆炸已触发 = false;
                当前角度 = 0;
                当前转速 = 0;
                老鹰.style.transform = '';
                更新伽马显示(0);
            }, 2000);
        }
        
        // 绑定事件
        const 长按区域 = 弹窗.querySelector('.通用弹窗内容');
        if (长按区域) {
            长按区域.addEventListener('touchstart', 长按开始, { passive: false });
            长按区域.addEventListener('touchend', 长按结束);
            长按区域.addEventListener('touchcancel', 长按结束);
            长按区域.addEventListener('mousedown', 长按开始);
            长按区域.addEventListener('mouseup', 长按结束);
            document.addEventListener('mouseup', 长按结束);
        }
        
        // 关闭按钮
        const 关闭按钮 = 弹窗.querySelector('.通用弹窗关闭');
        if (关闭按钮) {
            关闭按钮.addEventListener('mousedown', (e) => e.stopPropagation());
            关闭按钮.addEventListener('touchstart', (e) => e.stopPropagation());
            const 原关闭 = 关闭按钮.onclick;
            关闭按钮.onclick = function(e) {
                if (动画帧Id) cancelAnimationFrame(动画帧Id);
                const 伽马容器 = document.getElementById('gammaValueDisplay');
                if (伽马容器) 伽马容器.remove();
                弹窗.classList.remove('打开');
                setTimeout(() => 弹窗.remove(), 200);
                if (原关闭) 原关闭.call(this, e);
                点击锁定 = false;
            };
        }
        
        // 启动旋转动画
        更新旋转();
        
        // 点击背景关闭
        弹窗.onclick = function(e) {
            if (e.target === 弹窗) {
                if (动画帧Id) cancelAnimationFrame(动画帧Id);
                const 伽马容器 = document.getElementById('gammaValueDisplay');
                if (伽马容器) 伽马容器.remove();
                弹窗.classList.remove('打开');
                setTimeout(() => 弹窗.remove(), 200);
                点击锁定 = false;
            }
        };
    }
    
    // 绑定点击事件
    目标元素.addEventListener('click', function(e) {
        if (点击锁定) return;
        点击锁定 = true;
        if (!document.getElementById('支持作者弹窗')) {
            document.body.insertAdjacentHTML('beforeend', 支持弹窗HTML);
            const 弹窗 = document.getElementById('支持作者弹窗');
            弹窗.classList.add('打开');
            初始化旋转弹窗();
        }
    });
})();