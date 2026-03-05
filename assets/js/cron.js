document.addEventListener('app-components-loaded', () => {
    const input = document.getElementById('cron-input');
    const parseBtn = document.getElementById('cron-parse-btn');
    const clearBtn = document.getElementById('cron-clear-btn');
    const meaningDiv = document.getElementById('cron-meaning');
    const nextList = document.getElementById('cron-next-list');
    const tags = document.querySelectorAll('.cron-examples .tag');

    function parseCron() {
        const value = input.value.trim();
        if (!value) return;

        try {
            // cronstrue parse
            const meaning = cronstrue.toString(value, { locale: 'zh_CN' });
            meaningDiv.textContent = meaning;

            // Optional: calculate next 5 times, but cronstrue is just translate
            // Without a full cron library, we just show meaning.
            nextList.innerHTML = '<li>⚠️ 本地轻量版本暂不支持计算未来时间，只提供语义翻译。</li>';

        } catch (e) {
            meaningDiv.textContent = '解析失败：' + e.message;
            meaningDiv.style.color = 'var(--error-color)';
            nextList.innerHTML = '';
        }
    }

    parseBtn.addEventListener('click', parseCron);
    input.addEventListener('input', () => {
        meaningDiv.style.color = 'var(--primary-color)';
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        meaningDiv.textContent = '请点击解析或输入表达式';
        nextList.innerHTML = '';
    });

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            input.value = tag.getAttribute('data-cron');
            parseCron();
        });
    });
});
