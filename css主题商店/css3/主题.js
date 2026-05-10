// ==================== 兼容补丁提示 ====================
(function() {
    // 检测 Android 版本
    const ua = navigator.userAgent;
    const androidMatch = ua.match(/Android\s([0-9.]+)/);
    const androidVersion = androidMatch ? parseFloat(androidMatch[1]) : 0;
    
    // 获取用户之前是否已经看过提示（避免重复弹窗）
    const hasSeenPatchNotice = localStorage.getItem('patch_notice_seen');
    
    // 如果是 Android 11 或更高版本，且未看过提示，弹出警告
    if (androidVersion >= 11 && !hasSeenPatchNotice) {
        // 等待页面加载完成
        setTimeout(() => {
            // 创建自定义弹窗
            const 弹窗遮罩 = document.createElement('div');
            弹窗遮罩.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            const 弹窗内容 = document.createElement('div');
            弹窗内容.style.cssText = `
                max-width: 300px;
                background: #1a1a2e;
                border: 1px solid #ff8888;
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            `;
            
            弹窗内容.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
                <div style="font-size: 18px; font-weight: bold; color: #ff8888; margin-bottom: 12px;">提示</div>
                <div style="font-size: 14px; color: #ffffff; line-height: 1.5; margin-bottom: 20px;">
                    此补丁适用于 <strong>Android 10 及以下</strong> 版本。<br><br>
                    您的设备是 Android ${androidVersion}，<strong style="color: #ff8888;">不需要装载此补丁</strong>。<br><br>
                    请移步「主题商店」卸下该主题。
                </div>
                <button id="补丁提示确认" style="
                    background: #2a2a3e;
                    border: 1px solid #00ff88;
                    border-radius: 8px;
                    padding: 8px 20px;
                    color: #00ff88;
                    cursor: pointer;
                ">知道了</button>
            `;
            
            弹窗遮罩.appendChild(弹窗内容);
            document.body.appendChild(弹窗遮罩);
            
            // 记录已看过提示
            localStorage.setItem('patch_notice_seen', 'true');
            
            // 绑定确认按钮
            const 确认按钮 = document.getElementById('补丁提示确认');
            if (确认按钮) {
                确认按钮.onclick = () => {
                    document.body.removeChild(弹窗遮罩);
                };
            }
            
            // 点击遮罩也可关闭
            弹窗遮罩.onclick = (e) => {
                if (e.target === 弹窗遮罩) {
                    document.body.removeChild(弹窗遮罩);
                }
            };
        }, 500);
    }
    
    // 如果是 Android 10 及以下，也弹个提示，但只是告知补丁生效
    if (androidVersion > 0 && androidVersion <= 10) {
        const hasSeenPatchInfo = localStorage.getItem('patch_info_seen');
        if (!hasSeenPatchInfo) {
            setTimeout(() => {
                const 信息遮罩 = document.createElement('div');
                信息遮罩.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                const 信息内容 = document.createElement('div');
                信息内容.style.cssText = `
                    max-width: 280px;
                    background: #1a1a2e;
                    border: 1px solid #00ff88;
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                `;
                
                信息内容.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
                    <div style="font-size: 18px; font-weight: bold; color: #00ff88; margin-bottom: 12px;">补丁已生效</div>
                    <div style="font-size: 13px; color: #ffffff; line-height: 1.5; margin-bottom: 20px;">
                        您的设备是 Android ${androidVersion}。<br>
                        兼容补丁已装载，毛玻璃效果已替换为纯色背景。
                    </div>
                    <button id="补丁信息确认" style="
                        background: #2a2a3e;
                        border: 1px solid #00ff88;
                        border-radius: 8px;
                        padding: 8px 20px;
                        color: #00ff88;
                        cursor: pointer;
                    \">知道了</button>
                `;
                
                信息遮罩.appendChild(信息内容);
                document.body.appendChild(信息遮罩);
                
                localStorage.setItem('patch_info_seen', 'true');
                
                const 确认按钮 = document.getElementById('补丁信息确认');
                if (确认按钮) {
                    确认按钮.onclick = () => {
                        document.body.removeChild(信息遮罩);
                    };
                }
                
                信息遮罩.onclick = (e) => {
                    if (e.target === 信息遮罩) {
                        document.body.removeChild(信息遮罩);
                    }
                };
            }, 500);
        }
    }
})();
