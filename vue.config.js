const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    publicPath: process.env.PUBLIC_PATH,
    outputDir: process.env.OUTPUT_DIR,
    configureWebpack: {
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: process.env.BACKEND_JSON, to: "backend.json" },
                ],
            })
        ]
    }
}