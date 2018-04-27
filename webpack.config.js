const path    = require("path");
const webpack = require("webpack");
const pkg     = require("./package.json");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {

    entry: ["./frontend/src/index.js"],

    output: {
        path: path.resolve(__dirname, "frontend/dist"),
        filename: "js/[name].js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },

    devServer: {
        contentBase: "./frontend/dist"
    },

    resolve: {
        extensions: [".js", ".jsx", ".less", ".css"]
    },

    optimization: {
        splitChunks: {
            chunks: "initial",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "vendor"
                }
            }
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(pkg.version),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "production")
        }),
        new BundleAnalyzerPlugin({
            analyzerMode     : "static",
            generateStatsFile: false,
            openAnalyzer     : false
        })
    ],
};