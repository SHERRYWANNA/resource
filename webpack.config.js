const webpack = require('webpack');
const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        flexible: path.resolve(__dirname, 'src/js/flexible.js'),
        layernative: path.resolve(__dirname, 'src/js/layernative.js'),
        util: path.resolve(__dirname, 'src/js/util.js')
    }, //入口文件
    output: {
        path: path.resolve(__dirname), 
        filename: 'dist/js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: [
                    'babel-loader'
                ],
                include: path.resolve(__dirname, 'src/js'),
                exclude: path.resolve(__dirname, '/node_modules/')
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader', 
                    'css-loader'
                ],
                include: path.resolve(__dirname, 'src/css'),
                exclude: path.resolve(__dirname, '/node_modules/')
            },
            {
                test: /\.(png|jpg)$/,
                loaders: [
                    'url-loader'
                ],
                exclude: path.resolve(__dirname, '/node_modules/')
            }
        ]
    },
    //插件
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new uglify(),
        // new ExtractTextPlugin('styles.css'),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { 
                safe: true, 
                discardComments: { 
                    removeAll: true 
                } 
            },
            canPrint: true
        })
    ],
    optimization: {
        minimizer: [new OptimizeCssAssetsPlugin({})]
    } 

};
