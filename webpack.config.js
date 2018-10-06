const path = require('path');
const VueHtmlWebpackPlugin = require('vue-html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: {
        app: './src/app.ts',
        type_traits: './src/type_traits/type_traits.ts',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
        ]
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new VueHtmlWebpackPlugin({
            title: 'wtfcpp type traits',
            vue: true
        }),
        new VueLoaderPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }
};
