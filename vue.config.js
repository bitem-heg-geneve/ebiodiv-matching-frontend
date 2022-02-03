publicPath: process.env.NODE_ENV === 'production'
module.exports = {
 publicPath: process.env.NODE_ENV === 'production'? '/ebiodivgui/': '/',
 outputDir: process.env.NODE_ENV === 'production'
    ? 'ebiodivgui'
    : 'dist'
}