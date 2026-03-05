document.addEventListener('app-components-loaded', () => {
    const input = document.getElementById('jts-input');
    const output = document.getElementById('jts-output');
    const convertBtn = document.getElementById('jts-convert-btn');
    const copyBtn = document.getElementById('jts-copy-btn');

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getType(val) {
        if (Array.isArray(val)) {
            if (val.length > 0) {
                return `List<${getType(val[0])}>`;
            } else {
                return 'List<Object>';
            }
        } else if (val === null) {
            return 'Object';
        } else if (typeof val === 'number') {
            return Number.isInteger(val) ? 'Integer' : 'Double';
        } else if (typeof val === 'boolean') {
            return 'Boolean';
        } else if (typeof val === 'object') {
            return 'Object'; // 简化处理内部类
        } else {
            return 'String';
        }
    }

    function generateJava(jsonObj, className = 'MyClass') {
        let code = `import lombok.Data;\nimport java.util.List;\n\n@Data\npublic class ${className} {\n\n`;

        for (const [key, val] of Object.entries(jsonObj)) {
            const fieldType = getType(val);
            code += `    private ${fieldType} ${key};\n`;
        }

        code += `}\n`;
        return code;
    }

    convertBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) {
            output.value = '';
            return;
        }

        try {
            const obj = JSON.parse(val);
            output.value = generateJava(obj, 'RootEntity');
        } catch (e) {
            output.value = '解析 JSON 失败：\n' + e.message;
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
