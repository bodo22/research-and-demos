const path = require('path');

module.exports = [
  {
    entry: './components/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'mirador.min.js',
    },
    resolve: { extensions: ['.js'] },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        }],
    },
  },
];
