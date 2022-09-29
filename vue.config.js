const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    publicPath: process.env.PUBLIC_PATH,
    outputDir: process.env.OUTPUT_DIR,
    configureWebpack: {
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: process.env.VUE_APP_BACKEND_JSON, to: "backend.json" },
                    { from: process.env.VUE_APP_ORCID_JSON, to: "orcid.json" },
                ],
            })
        ]
    }
}