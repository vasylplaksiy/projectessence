import { defineConfig } from 'vite';
import vituum from 'vituum';
import handlebars from '@vituum/vite-plugin-handlebars';
import postcss from '@vituum/vite-plugin-postcss';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// У dev CSS віддається за адресою /src/styles/*.scss, тому відносні url()
// у стилях шукають /src/styles/fonts/... Зводимо такі запити до кореня,
// де dev-сервер віддає вміст public/ — щоб шляхи в SCSS лишались як є.
const publicFallback = {
    name: 'public-fallback',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            const match = req.url.match(/\/(fonts|img|video)\/.+$/);
            if (match && !req.url.startsWith('/' + match[1] + '/')) {
                req.url = match[0];
            }
            next();
        });
    },
};

// Vite при збірці зрізає провідний ../ у відносних url() всередині CSS.
// Повертаємо шляхи рівно такими, як вони написані у SCSS.
const keepCssUrls = {
    name: 'keep-css-urls',
    enforce: 'post',
    generateBundle(options, bundle) {
        for (const file of Object.values(bundle)) {
            if (file.type !== 'asset' || !file.fileName.endsWith('.css')) {
                continue;
            }
            file.source = String(file.source).replace(
                /url\((['"]?)(?!\.{1,2}\/|\/|data:|https?:|#)(fonts\/)/g,
                'url($1../$2'
            );
        }
    },
};

export default defineConfig({
    plugins: [
        publicFallback,
        keepCssUrls,
        vituum({
            imports: {
                filenamePattern: {
                    'src/styles': '+.scss',
                },
            },
        }),
        handlebars({
            partials: {
                directory: './src/partials',
                extname: false, // Set to false to avoid adding the extension automatically
            },
        }),
        postcss({
            autoprefixer: {
                overrideBrowserslist: ['last 2 versions', '> 1%'], // Specify the browsers you want to support
            },
        }),
        ViteImageOptimizer({
            /* pass your config */
        }),
    ],
    server: {
        host: '0.0.0.0', // Listens on all local addresses
        port: 5173, // Or your preferred port
    },
});
