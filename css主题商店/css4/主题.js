// ==================== 黑客主题 ====================
function 创建黑客背景(容器选择器) {
    const 容器 = document.querySelector(容器选择器);
    if (!容器) return;
    
    // 避免重复创建
    if (容器.querySelector('.黑客背景')) return;
    
    const 画布 = document.createElement('div');
    画布.className = '黑客背景';
    
    const 字符 = '01';
    const 列数 = Math.floor(容器.offsetWidth / 20) + 1;
    
    for (let i = 0; i < 列数; i++) {
        const 列 = document.createElement('div');
        列.className = '黑客列';
        列.style.left = (i * 20 + Math.random() * 10) + 'px';
        列.style.animationDuration = (3 + Math.random() * 5) + 's';
        列.style.animationDelay = Math.random() * 5 + 's';
        列.style.fontSize = (12 + Math.random() * 8) + 'px';
        
        // 随机生成 20-40 个字符
        let 内容 = '';
        const 长度 = 20 + Math.floor(Math.random() * 20);
        for (let j = 0; j < 长度; j++) {
            内容 += 字符[Math.floor(Math.random() * 2)];
        }
        列.textContent = 内容;
        
        画布.appendChild(列);
    }
    
    容器.appendChild(画布);
}

// 在需要的容器里启用
创建黑客背景('.设置面板');
创建黑客背景('.抽屉');
创建黑客背景('.键盘抽屉');
createHackerBackground('.设置内容'); // 这个是设置面板里面的滚动容器
