document.addEventListener('app-components-loaded', () => {
    const input = document.getElementById('j2js-input');
    const output = document.getElementById('j2js-output');
    const defaultValSelect = document.getElementById('j2js-default-val');
    const convertBtn = document.getElementById('j2js-convert-btn');
    const copyBtn = document.getElementById('j2js-copy-btn');

    function transform(obj, defaultValue, indent = 2, currentIndent = 2) {
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            let res = '[\n';
            for (let i = 0; i < obj.length; i++) {
                res += ' '.repeat(currentIndent) + transform(obj[i], defaultValue, indent, currentIndent + indent);
                if (i < obj.length - 1) res += ',';
                res += '\n';
            }
            res += ' '.repeat(currentIndent - indent) + ']';
            return res;
        } else if (obj !== null && typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '{}';

            let res = '{\n';
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                // Remove quotes around key unless it requires quotes (e.g. contains spaces, dash, etc)
                // But normally JS objects can just have unquoted standard keys
                const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;

                res += ' '.repeat(currentIndent) + safeKey + ': ' + transform(obj[k], defaultValue, indent, currentIndent + indent);
                if (i < keys.length - 1) res += ',';
                res += '\n';
            }
            res += ' '.repeat(currentIndent - indent) + '}';
            return res;
        } else {
            // It's a primitive value (string, number, boolean, null)
            // Replace with the chosen default value
            return defaultValue === 'null' ? 'null' : '""';
        }
    }

    convertBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) {
            output.value = '';
            return;
        }
        try {
            const parsed = JSON.parse(val);
            output.value = transform(parsed, defaultValSelect.value);
        } catch (e) {
            output.value = '解析 JSON 失败:\n' + e.message;
        }
    });

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
});
