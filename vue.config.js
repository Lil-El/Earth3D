'use strict';
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false, // process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: 8080,
        open: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        before: require('./mock/mock-server.js'),
    },
    configureWebpack: {
        name: 'Earth3D', // 注入到index.html的title上
        resolve: {
            alias: {
                '@': resolve('src'),
            },
        },
    },
    chainWebpack(config) {
        // preload，提升首屏速度
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial',
            },
        ]);

        // 页面太多，会进行没必要的请求
        config.plugins.delete('prefetch');

        config.when(process.env.NODE_ENV !== 'development', config => {
            // config.plugin("analyzer").use(new BundleAnalyzerPlugin());

            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        // `runtime` must same as runtimeChunk name. default is `runtime`
                        inline: /runtime\..*\.js$/,
                    },
                ])
                .end();
            config.module
                .rule('json')
                .test(/areaData.json$/)
                .exclude.add(function() {
                    return ['public'];
                })
                .end();
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial', // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: 'chunk-elementUI',
                        priority: 20, // 权重必须大于libs和app，否则将打包到libs或app中
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                    },
                    mock: {
                        name: 'chunk-mock',
                        priority: 30,
                        test: /[\\/]node_modules[\\/]mockjs/,
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'),
                        minChunks: 3,
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            });
            // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
            config.optimization.runtimeChunk('single');
        });
    },
};
