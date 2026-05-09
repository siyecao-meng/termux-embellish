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
    
    const 双指缩放提示 = document.querySelector('.设置选项:nth-child(3) .终端操作提示');
    if (双指缩放提示) 双指缩放提示.textContent = t('双指缩放提示');
    else {
        const 提示 = document.querySelector('.设置选项:nth-child(3) div');
        if (提示) 提示.textContent = t('双指缩放提示');
    }
    
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