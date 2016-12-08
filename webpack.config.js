var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client/app/index.jsx',
  output: { path: __dirname + '/client/public', filename: 'bundle.js' },
  watch: false,
  module: {
    loaders: [
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style-loader!css-loader" },
      { test: /\.useable\.css$/, loader: "style-loader/useable!css-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: 'babel_cache',
          presets: ['es2015', 'react']
        }
      }
    ],
  },
  resolveLoader: {
    root: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  resolve: {
    root: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),            // Dedupe similar code
    new webpack.optimize.UglifyJsPlugin(),          // Minify everything
    new webpack.optimize.AggressiveMergingPlugin()  // Merge chunks
  ]
};
