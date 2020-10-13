const path = require('path');
const HTMLWevpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const loader = require('sass-loader');


const isDev = process.env.NODE_ENV === 'development'; // defining the mode type: if "true" then dev
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const outputDirectoru = 'docs';

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
    },
    output:  {
        filename: filename('js'),
        path: path.resolve(__dirname, outputDirectoru)
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        contentBase: './'+outputDirectoru,
        hot: isDev,
    },
    plugins: [
        new HTMLWevpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(
            {
                filename: filename('css')
            }
        )
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: 
                [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          hmr: isDev,
                          reloadAll: true
                        },
                    },
                    'css-loader',
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: 
                [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          hmr: isDev,
                          reloadAll: true
                        },
                    },
                    
                    'css-loader',
                    'sass-loader',
                ]
            }
            ,
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
        ]
    }
}