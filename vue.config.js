module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-snake-game/'
    : '/',
  outputDir: 'docs',
  productionSourceMap: false,
};
