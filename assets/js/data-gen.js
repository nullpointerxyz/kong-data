(function () {
    const initDataGen = () => {
        const btn = document.getElementById('dg-generate-btn');
        if (!btn) return;

        const output = document.getElementById('dg-output');
        const separatorSelect = document.getElementById('dg-separator');
        const customSeparatorInput = document.getElementById('dg-custom-separator');
        const resultInfo = document.getElementById('dg-result-info');

        // 处理自定义分隔符显示
        separatorSelect.addEventListener('change', () => {
            if (separatorSelect.value === 'custom') {
                customSeparatorInput.style.display = 'inline-block';
            } else {
                customSeparatorInput.style.display = 'none';
            }
        });

        btn.addEventListener('click', () => {
            const length = parseInt(document.getElementById('dg-length').value) || 8;
            const count = parseInt(document.getElementById('dg-count').value) || 10;

            const useDigit = document.getElementById('dg-digit').checked;
            const useUpper = document.getElementById('dg-upper').checked;
            const useLower = document.getElementById('dg-lower').checked;
            const useSymbol = document.getElementById('dg-symbol').checked;

            let charSet = '';
            if (useDigit) charSet += '0123456789';
            if (useUpper) charSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (useLower) charSet += 'abcdefghijklmnopqrstuvwxyz';
            if (useSymbol) charSet += '!@#$%^&*()_+-=[]{}|;:,.<>?';

            if (charSet === '') {
                alert('请至少选择一种字符类型！');
                return;
            }

            let separator = separatorSelect.value;
            if (separator === 'custom') {
                separator = customSeparatorInput.value;
            } else if (separator === '\\n') {
                separator = '\n';
            }

            btn.disabled = true;
            btn.innerHTML = '<span class="icon">⏳</span> 正在生成...';

            // 使用 setTimeout 避免阻塞 UI
            setTimeout(() => {
                try {
                    const results = [];
                    const charSetLength = charSet.length;

                    for (let i = 0; i < count; i++) {
                        let singleData = '';
                        for (let j = 0; j < length; j++) {
                            const randomIndex = Math.floor(Math.random() * charSetLength);
                            singleData += charSet[randomIndex];
                        }
                        results.push(singleData);
                    }

                    output.value = results.join(separator);
                    resultInfo.textContent = `已生成 ${count} 条数据`;
                    resultInfo.className = 'badge success';
                } catch (e) {
                    console.error(e);
                    alert('生成失败，可能是数量过大导致内存溢出。');
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = '<span class="icon">⚡</span> 立即生成';
                }
            }, 50);
        });
    };

    // 监听组件加载完成事件
    document.addEventListener('app-components-loaded', initDataGen);
    // 如果已经加载完了，直接初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initDataGen();
    }
})();
