document.addEventListener('app-components-loaded', () => {
    const input = document.getElementById('hash-input');
    const output = document.getElementById('hash-output');
    const algo = document.getElementById('hash-algo');
    const calcBtn = document.getElementById('hash-calculate-btn');

    function calculate() {
        const val = input.value;
        if (!val) {
            output.value = '';
            return;
        }

        try {
            let result = '';
            switch (algo.value) {
                case 'md5':
                    result = CryptoJS.MD5(val).toString();
                    break;
                case 'sha1':
                    result = CryptoJS.SHA1(val).toString();
                    break;
                case 'sha256':
                    result = CryptoJS.SHA256(val).toString();
                    break;
                case 'sha512':
                    result = CryptoJS.SHA512(val).toString();
                    break;
                case 'base64-encode':
                    result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(val));
                    break;
                case 'base64-decode':
                    result = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(val));
                    break;
            }
            output.value = result;
        } catch (e) {
            output.value = '计算错误: ' + e.message;
        }
    }

    calcBtn.addEventListener('click', calculate);
    algo.addEventListener('change', calculate);
});
