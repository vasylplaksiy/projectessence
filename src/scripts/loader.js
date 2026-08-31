const MIN_DURATION = 1200; // мінімальний час показу лоадера, мс
const FADE_DURATION = 600; // має збігатись з transition у _loading.scss

export default function initLoader() {
    const loader = document.querySelector('.loader');
    const bar = loader?.querySelector('.loader__progress span');

    if (!loader) return;

    const startedAt = performance.now();

    let target = 0; // реальний прогрес завантаження, 0..1
    let shown = 0; // згладжене значення, яке малюємо
    let done = false;

    const assets = collectAssets();
    let loaded = 0;

    const total = assets.length + 1; // +1 на document.fonts

    const bump = () => {
        loaded += 1;
        target = Math.min(loaded / total, 1);
    };

    assets.forEach((promise) => promise.then(bump));
    fontsReady().then(bump);

    // анімація: shown плавно наздоганяє target, тому смужка ніколи не стрибає
    const tick = () => {
        // поки реальні ассети не догрузились — повзе повільно вперед,
        // щоб було видно рух навіть на швидкому з'єднанні
        const elapsed = performance.now() - startedAt;
        const timeFloor = Math.min(elapsed / MIN_DURATION, 1) * 0.9;
        const goal = Math.max(target, timeFloor);

        shown += (goal - shown) * 0.08;

        if (bar) bar.style.width = `${(shown * 100).toFixed(2)}%`;

        const ready = target >= 1 && elapsed >= MIN_DURATION;

        if (ready && shown > 0.995) {
            if (!done) finish();
            return;
        }

        requestAnimationFrame(tick);
    };

    const finish = () => {
        done = true;
        if (bar) bar.style.width = '100%';

        loader.classList.add('is-hidden');
        document.body.classList.remove('loading');

        setTimeout(() => loader.remove(), FADE_DURATION);
    };

    requestAnimationFrame(tick);

    // страховка: якщо якийсь ассет ніколи не віддасть подію
    setTimeout(() => {
        target = 1;
    }, 10000);
}

function collectAssets() {
    const images = [...document.images].map(imageReady);
    const backgrounds = collectBackgrounds().map(preload);
    const media = [...document.querySelectorAll('video, audio')].map(mediaReady);

    return [...images, ...backgrounds, ...media];
}

function imageReady(img) {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();

    return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
    });
}

function mediaReady(el) {
    if (el.readyState >= 3) return Promise.resolve();

    return new Promise((resolve) => {
        el.addEventListener('canplaythrough', resolve, { once: true });
        el.addEventListener('error', resolve, { once: true });
    });
}

function collectBackgrounds() {
    const urls = new Set();

    document.querySelectorAll('*').forEach((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        if (!bg || bg === 'none') return;

        for (const match of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
            if (match[1] && !match[1].startsWith('data:')) urls.add(match[1]);
        }
    });

    return [...urls];
}

function preload(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = url;
    });
}

function fontsReady() {
    return document.fonts ? document.fonts.ready : Promise.resolve();
}
