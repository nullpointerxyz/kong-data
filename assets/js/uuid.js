(function () {
    const initUuidTools = () => {
        const btn = document.getElementById('uuid-generate-btn');
        const output = document.getElementById('uuid-output');
        const info = document.getElementById('uuid-result-info');

        if (!btn || !output) return;

        // 生成标准 UUID v4
        const generateUUIDv4 = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            // 降级方案
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        btn.addEventListener('click', () => {
            const count = parseInt(document.getElementById('uuid-count').value) || 1;
            const keepHyphen = document.getElementById('uuid-hyphen').checked;
            const isUpper = document.getElementById('uuid-uppercase').checked;

            let results = [];
            for (let i = 0; i < count; i++) {
                let id = generateUUIDv4();

                if (!keepHyphen) {
                    id = id.replace(/-/g, '');
                }

                if (isUpper) {
                    id = id.toUpperCase();
                } else {
                    id = id.toLowerCase();
                }

                results.push(id);
            }

            output.value = results.join('\n');
            info.textContent = `已生成 ${count} 个`;
        });

        // 初次加载默认生成一份
        btn.click();
    };

    document.addEventListener('app-components-loaded', initUuidTools);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initUuidTools();
    }
})();
