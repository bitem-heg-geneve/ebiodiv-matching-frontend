publicPath: process.env.NODE_ENV === 'production'
module.exports = {
 publicPath: process.env.NODE_ENV === 'production'? '/eBioDiv/demo/': '/eBioDiv/dev/',
 outputDir: process.env.NODE_ENV === 'production'
    ? 'demo'
    : 'dev'
}