(function () {
    const initJwtTools = () => {
        const input = document.getElementById('jwt-input');
        const btn = document.getElementById('jwt-decode-btn');
        const headerOut = document.getElementById('jwt-header-output');
        const payloadOut = document.getElementById('jwt-payload-output');
        const statusOut = document.getElementById('jwt-status');

        if (!btn || !input) return;

        const b64DecodeUnicode = (str) => {
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        };

        const parseJwt = (token) => {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('无效的 JWT 格式（必须包含三个部分被点号分隔）');
            }

            const header = JSON.parse(b64DecodeUnicode(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(b64DecodeUnicode(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            return { header, payload };
        };

        const handleDecode = () => {
            const token = input.value.trim();
            if (!token) {
                statusOut.textContent = '请先输入 JWT 字符串';
                statusOut.style.color = 'var(--text-muted)';
                headerOut.value = '';
                payloadOut.value = '';
                return;
            }

            try {
                const { header, payload } = parseJwt(token);
                headerOut.value = JSON.stringify(header, null, 2);
                payloadOut.value = JSON.stringify(payload, null, 2);

                let statusText = '解析成功';
                if (payload.exp) {
                    const expDate = new Date(payload.exp * 1000);
                    const now = new Date();
                    const isExpired = expDate < now;
                    statusText += ` | 过期时间: ${expDate.toLocaleString()}`;
                    if (isExpired) {
                        statusText += ' (已过期 ❌)';
                        statusOut.style.color = '#ff7675';
                    } else {
                        statusText += ' (有效 ✅)';
                        statusOut.style.color = '#00b894';
                    }
                } else {
                    statusOut.style.color = '#00b894';
                }

                if (payload.iat) {
                    statusText += ` | 签发时间: ${new Date(payload.iat * 1000).toLocaleString()}`;
                }

                statusOut.textContent = statusText;

            } catch (err) {
                statusOut.textContent = '解析失败: ' + err.message;
                statusOut.style.color = '#ff7675';
                headerOut.value = '';
                payloadOut.value = '';
            }
        };

        btn.addEventListener('click', handleDecode);
        // 自动解析
        input.addEventListener('input', () => {
            if (input.value.trim().length > 20) {
                handleDecode();
            }
        });
    };

    document.addEventListener('app-components-loaded', initJwtTools);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initJwtTools();
    }
})();
