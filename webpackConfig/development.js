const merge = require('webpack-merge');

const commonConfig = require('./common');

module.exports = merge.smart(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
});
