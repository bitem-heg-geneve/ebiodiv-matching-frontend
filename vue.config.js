publicPath: process.env.NODE_ENV === 'production'
module.exports = {
 publicPath: process.env.NODE_ENV === 'production'? '/eBioDiv/demo/': '/',
 outputDir: process.env.NODE_ENV === 'production'
    ? 'demo'
    : 'dist'
}