const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    // devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname),
    },
    entry: {
        index: './src/index.jsx',
        polyfill: 'babel-polyfill',
        vendor: ["jquery", "popper.js"]
    },
    mode: 'none',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "style/style-[name].css",
            chunkFilename: "style/style-[id].css"
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            chunks: ["polyfill","vendor","index"],
            chunksSortMode: "manual",
        })
    ],

    module: { //Обновлено
        rules: [
            // Правило для JS
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src"),
                ],
                exclude: /node_modules/,
                test: /\.jsx?$/,
                query: {
                    plugins: ['transform-runtime', 'transform-decorators-legacy'],
                    presets: ['es2015', 'stage-0', 'react'],
                }
            },
            // Правило ESLint
            // {
            //     test: /\.jsx?$/,
            //     enforce: "pre",
            //     loader: 'eslint-loader',
            //     include: [
            //         path.resolve(__dirname, "src"),
            //     ],
            //     exclude: /node_modules/
            // },
            // Правило для стилей (css, scss)
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './style'
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            }

        ]
    }
};