/** ********** WEBPACK CONFIG FILE 1/3 ********** **/

const webpack = require('webpack');
const path = require('path');
const WebpackMd5Hash = require('webpack-md5-hash');

/* Special Note:
   For some reason, webpack.common.js cannot be a function that export a config
   The console will return  "Configuration file found but no entry configured"
   Hence we have to leave global variables out here
*/

/** List of external packages that are 'required' */
const vendorPackages = [
    'react',
    'react-dom'
];

/** List of external packages that are requested via CDN */
const vendorCDNPackages = {

};

// Loader constants
const imgLoaderSizeLimit = 1024 * 10;  // 10kb

/** The main configuration */
module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js',
        chat: './src/chat.js',
        vendor: vendorPackages
    },

    externals: vendorCDNPackages,

    output: {
        path: path.join(__dirname, 'dist/static'),
    },

    module: {
        // Loaders config for various file types
        rules: [
            // .css - Implemented differently for prod and dev. Please refer to these configs.

            // .js
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },

            // Images (PNG | JPG | GIF) - Implemented differently for prod and dev. Please refer to these configs.

            // Images (SVG)
            {
                test: /\.(svg)$/,
                use: {
                    loader: 'svg-url-loader',
                    options: {
                        limit: imgLoaderSizeLimit,
                        noquotes: true  // Remove quotes around the encoded URL
                    }
                },
                exclude: /node_modules/
            },

            // Images compression
            // image-webpack-loader must work in pair with url-loader / svg-url-loader
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: {
                    loader: 'image-webpack-loader',
                },
                // enforce: 'pre' is a webpack option that forces this loader to load first
                // (in this case, before other image loader)
                enforce: 'pre',
                exclude: /node_modules/
            },

            // JSONs
            {
                test: /\.(json|geojson)$/,
                use: 'json-loader',
                exclude: /node_modules/
            },

            // Texts (raw files)
            {
                test: /\.txt$/,
                use: 'raw-loader',
                exclude: /node_modules/
            },
        ]
    },

    plugins: [
        // The below CommonsChunk should be included in .html files in reverse order
        // e.g. 'manifest' should appear before 'vendor'

        // vendor CommonsChunk
        new webpack.optimize.CommonsChunkPlugin({
            names: vendorPackages,
            name: 'vendor',  // The common bundle's name
            minChunks: Infinity
        }),

        // Extracting webpack's boilerplate and manifest (a.k.a. runtime) which can change with every build.
        // By specifying a name not mentioned in the entry configuration, the plugin will
        // automatically extract these into a separate bundle.
        // This bit must come after the vendor CommonsChunk because webpack includes these into the last chunk.
        // Also note that there's an extra step to this - adding either NamedModulesPlugin
        // or HashedModuleIdsPlugin. See webpack.dev.js and webpack.prod.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'  // The name for webpack's boilerplate and manifest
        }),

        // Due to an issue in Webpack, chunkhash isn’t deterministic.
        // To ensure hashes are generated based on the file contents,
        // use webpack-md5-hash plugin.
        new WebpackMd5Hash(),
    ]
};