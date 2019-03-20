const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './src/index.tsx'],
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                include: [
                    path.resolve(__dirname, '../src'),
                ],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    'postcss-loader',
                ],
                include: [
                    path.resolve(__dirname, '../src'),
                ],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                    'postcss-loader',
                ],
                include: [
                    path.resolve(__dirname, '../node_modules'),
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: '/assets',
                            outputPath: '../assets',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(
            'build',
            { root: path.resolve(__dirname , '..') },
        ),
        new CopyWebpackPlugin([
            { from: 'public/', to: './' },
        ], { debug: 'warning' }),
    ],
};
