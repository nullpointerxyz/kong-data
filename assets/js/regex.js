document.addEventListener('app-components-loaded', () => {
    const pattern = document.getElementById('regex-pattern');
    const flags = document.getElementById('regex-flags');
    const text = document.getElementById('regex-text');
    const display = document.getElementById('regex-result-display');
    const list = document.getElementById('regex-match-list');

    function testRegex() {
        const pVal = pattern.value;
        const fVal = flags.value;
        const tVal = text.value;

        if (!pVal || !tVal) {
            display.innerHTML = '';
            list.innerHTML = '';
            return;
        }

        try {
            const regex = new RegExp(pVal, fVal);

            // Highlight display
            // To prevent XSS, first escape text
            const escapeHTML = str => str.replace(/[&<>'"]/g, tag => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            }[tag]));

            let highlighted = escapeHTML(tVal);
            const matches = [...tVal.matchAll(new RegExp(pVal, fVal.includes('g') ? fVal : fVal + 'g'))];

            list.innerHTML = '';
            if (matches.length > 0) {
                let listHtml = '';
                matches.forEach((m, i) => {
                    listHtml += `<li>Match ${i + 1}: <strong style="color:var(--primary-color);">${escapeHTML(m[0])}</strong> (Index: ${m.index})</li>`;
                });
                list.innerHTML = listHtml;
            } else {
                list.innerHTML = '<li>未找到匹配项。</li>';
            }

            // Highlighting trick: Replace matches with span
            highlighted = tVal.replace(regex, match => `<span class="regex-highlight">${escapeHTML(match)}</span>`);
            display.innerHTML = highlighted.replace(/\n/g, '<br>');

        } catch (e) {
            display.innerHTML = '<span style="color: var(--error-color);">无效的正则表达式：' + e.message + '</span>';
            list.innerHTML = '';
        }
    }

    pattern.addEventListener('input', testRegex);
    flags.addEventListener('input', testRegex);
    text.addEventListener('input', testRegex);
});
