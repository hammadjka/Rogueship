const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        controller: './src/controller.js',

    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[name][ext][query]',
        clean: true,
    },
    devtool: 'inline-source-map',
    module: {
    rules: [
        {
            test: /.s?css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
            test: /\.(html)$/,
            use: ['html-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif|mp3|wav)$/i,
            type: 'asset/resource'
        },

    ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['controller']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].min.css', // Output minified CSS filename
        }),
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), // Minify CSS files
        ],
    },
    devServer: {
        static: './dist',
        watchFiles: ['./src/index.html'],
    },
};