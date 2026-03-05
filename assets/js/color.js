document.addEventListener('app-components-loaded', () => {
    const picker = document.getElementById('color-picker');
    const preview = document.getElementById('color-preview');
    const hexIn = document.getElementById('color-hex');
    const rgbIn = document.getElementById('color-rgb');
    const hslIn = document.getElementById('color-hsl');

    function hexToRgb(hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function updateFromHex(hex) {
        const rgb = hexToRgb(hex);
        if (rgb) {
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            rgbIn.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            hslIn.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            preview.style.background = hex;
            picker.value = hex;
        }
    }

    picker.addEventListener('input', (e) => {
        hexIn.value = e.target.value;
        updateFromHex(e.target.value);
    });

    hexIn.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/i.test(val) || /^#[0-9A-Fa-f]{3}$/i.test(val)) {
            updateFromHex(val);
        }
    });

    // TODO: support parsing back from RGB and HSL if needed
});
