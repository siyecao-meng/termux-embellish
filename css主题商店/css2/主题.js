(function() {
    // ==================== 猫爪特效 ====================
    
    // 创建猫爪元素
    function 创建猫爪(x, y) {
        const 猫爪 = document.createElement('div');
        猫爪.innerHTML = '🐾';
        猫爪.style.position = 'fixed';
        猫爪.style.left = (x - 10) + 'px';
        猫爪.style.top = (y - 10) + 'px';
        猫爪.style.fontSize = '24px';
        猫爪.style.opacity = '1';
        猫爪.style.pointerEvents = 'none';
        猫爪.style.zIndex = '99999';
        猫爪.style.transition = 'opacity 0.2s ease';
        猫爪.style.filter = 'drop-shadow(0 0 4px rgba(255,183,197,0.6))';
        猫爪.style.willChange = 'left, top, opacity';
        document.body.appendChild(猫爪);
        
        // 0.2秒后开始淡出，0.5秒后完全消失
        setTimeout(() => {
            猫爪.style.opacity = '0';
            setTimeout(() => {
                if (猫爪.parentNode) 猫爪.parentNode.removeChild(猫爪);
            }, 500);
        }, 200);
    }
    
    // 监听键盘点击事件（虚拟键盘）
    function 绑定键盘事件() {
        const 键盘按钮 = document.querySelectorAll('.键位');
        键盘按钮.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                创建猫爪(x, y);
            });
            // 触摸事件支持手机
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const rect = btn.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                创建猫爪(x, y);
                
                // 模拟按键触发
                const key = btn.dataset.key;
                if (key) {
                    // 触发原来的键盘处理函数
                    if (typeof 处理键盘按键 === 'function') {
                        处理键盘按键(key);
                    }
                }
            });
        });
    }
    
    // 监听物理键盘输入（电脑/外接键盘）
    function 监听物理键盘() {
        const 输出框 = document.getElementById('输出框');
        if (输出框) {
            输出框.addEventListener('keydown', function(e) {
                const rect = 输出框.getBoundingClientRect();
                // 随机在输出框范围内显示猫爪
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + rect.height - 20;
                创建猫爪(x, y);
            });
        }
    }
    
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            绑定键盘事件();
            监听物理键盘();
        });
    } else {
        绑定键盘事件();
        监听物理键盘();
    }
    
    // 添加一些额外的猫爪装饰（小爪印在底部栏）
    const style = document.createElement('style');
    style.textContent = `
        /* 猫爪光标效果 */
        #输出框 {
            caret-color: #ffb7c5;
        }
        
        /* 底部按钮栏装饰 */
        .底部按钮栏::before {
            content: '🐾';
            position: absolute;
            left: 10px;
            bottom: 8px;
            font-size: 14px;
            opacity: 0.5;
            pointer-events: none;
        }
        .底部按钮栏::after {
            content: '🐾';
            position: absolute;
            right: 10px;
            bottom: 8px;
            font-size: 14px;
            opacity: 0.5;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🐾 治愈粉主题 - 猫爪特效已加载');
})();
