document.addEventListener('app-components-loaded', () => {
    const input = document.getElementById('format-input');
    const output = document.getElementById('format-output');
    const sourceType = document.getElementById('format-source-type');
    const targetType = document.getElementById('format-target-type');
    const convertBtn = document.getElementById('format-convert-btn');
    const copyBtn = document.getElementById('format-copy-btn');

    function convert() {
        const val = input.value.trim();
        if (!val) {
            output.value = '';
            return;
        }

        try {
            let obj;
            // Parse Source
            if (sourceType.value === 'json') {
                obj = JSON.parse(val);
            } else if (sourceType.value === 'yaml') {
                obj = jsyaml.load(val);
            }

            // Stringify Target
            if (targetType.value === 'json') {
                output.value = JSON.stringify(obj, null, 2);
            } else if (targetType.value === 'yaml') {
                output.value = jsyaml.dump(obj);
            }

        } catch (e) {
            output.value = '格式转换错误：\n' + e.message;
        }
    }

    convertBtn.addEventListener('click', convert);

    copyBtn.addEventListener('click', async () => {
        if (!output.value) return;
        try {
            await navigator.clipboard.writeText(output.value);
            const originalTooltip = copyBtn.getAttribute('data-tooltip');
            copyBtn.setAttribute('data-tooltip', '已复制!');
            setTimeout(() => copyBtn.setAttribute('data-tooltip', originalTooltip), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    });

    sourceType.addEventListener('change', () => {
        if (sourceType.value === targetType.value) {
            targetType.value = sourceType.value === 'json' ? 'yaml' : 'json';
        }
    });

    targetType.addEventListener('change', () => {
        if (sourceType.value === targetType.value) {
            sourceType.value = targetType.value === 'json' ? 'yaml' : 'json';
        }
    });
});
