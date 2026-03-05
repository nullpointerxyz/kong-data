(function () {
    const initUrlTools = () => {
        const input = document.getElementById('url-input');
        const parseBtn = document.getElementById('url-parse-btn');
        const rebuildBtn = document.getElementById('url-rebuild-btn');
        const baseOut = document.getElementById('url-base-out');
        const hashOut = document.getElementById('url-hash-out');
        const paramsContainer = document.getElementById('url-params-container');

        if (!parseBtn || !input) return;

        let currentUrlObj = null;

        const parseUrl = () => {
            const val = input.value.trim();
            if (!val) {
                paramsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">暂无参数解析</div>';
                baseOut.textContent = '-';
                hashOut.textContent = '-';
                currentUrlObj = null;
                return;
            }

            try {
                // 如果没有 protocol，默认补充 http:// 防止 URL 解析失败
                let urlStr = val;
                if (!/^https?:\/\//i.test(urlStr)) {
                    urlStr = 'http://' + urlStr;
                }
                const url = new URL(urlStr);
                currentUrlObj = url;

                baseOut.textContent = url.origin + url.pathname;
                hashOut.textContent = url.hash || '-';

                const searchParams = new URLSearchParams(url.search);
                paramsContainer.innerHTML = '';

                let paramCount = 0;
                for (const [key, value] of searchParams.entries()) {
                    paramCount++;
                    const row = document.createElement('div');
                    row.style.display = 'grid';
                    row.style.gridTemplateColumns = '120px 1fr 40px';
                    row.style.gap = '8px';
                    row.style.marginBottom = '8px';
                    row.style.alignItems = 'center';

                    const keyInput = document.createElement('input');
                    keyInput.type = 'text';
                    keyInput.className = 'inline-input';
                    keyInput.value = key;
                    keyInput.dataset.original = key;
                    keyInput.style.width = '100%';

                    const valInput = document.createElement('input');
                    valInput.type = 'text';
                    valInput.className = 'text-input';
                    valInput.style.padding = '0.4rem 0.6rem';
                    valInput.value = decodeURIComponent(value);

                    const delBtn = document.createElement('button');
                    delBtn.className = 'icon-btn';
                    delBtn.innerHTML = '✕';
                    delBtn.style.color = '#ff7675';
                    delBtn.onclick = () => {
                        row.remove();
                    };

                    row.appendChild(keyInput);
                    row.appendChild(valInput);
                    row.appendChild(delBtn);
                    paramsContainer.appendChild(row);
                }

                if (paramCount === 0) {
                    paramsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">无 Query 参数</div>';
                }

            } catch (err) {
                paramsContainer.innerHTML = `<div style="text-align: center; color: #ff7675; padding: 2rem;">URL 解析失败: ${err.message}</div>`;
                baseOut.textContent = '-';
                hashOut.textContent = '-';
            }
        };

        const rebuildUrl = () => {
            if (!currentUrlObj) return;

            // 获取所有当前页面上的参数重写到 URLSearchParams
            const newSearchParams = new URLSearchParams();
            const rows = paramsContainer.querySelectorAll('div[style*="grid-template-columns"]');

            rows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs.length === 2) {
                    const key = inputs[0].value.trim();
                    const val = inputs[1].value.trim();
                    if (key) {
                        newSearchParams.append(key, val); // URLSearchParams 内部会自动 encode 
                    }
                }
            });

            currentUrlObj.search = newSearchParams.toString();
            // 去除我们自己加的默认前缀
            let finalUrl = currentUrlObj.href;
            if (!input.value.trim().toLowerCase().startsWith('http')) {
                finalUrl = finalUrl.replace(/^https?:\/\//i, '');
            }
            input.value = finalUrl;

            // 简单提示
            rebuildBtn.innerHTML = '<span class="icon">✅</span> 已更新';
            rebuildBtn.style.color = 'var(--success-color)';
            setTimeout(() => {
                rebuildBtn.innerHTML = '<span class="icon">🔄</span> 更新 URL 修改';
                rebuildBtn.style.color = '';
            }, 1000);
        };

        parseBtn.addEventListener('click', parseUrl);
        rebuildBtn.addEventListener('click', rebuildUrl);
    };

    document.addEventListener('app-components-loaded', initUrlTools);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initUrlTools();
    }
})();
