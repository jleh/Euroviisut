var path = require('path');

module.exports = {
    entry: './script.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '.')
    },
    resolve: {
      alias: {
        'handlebars' : 'handlebars/dist/handlebars.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      ]
    },
    devtool: 'cheap-eval-source-map'
};
