const webpack = require('webpack')
<<<<<<< HEAD
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

=======
const path = require('PATHS')
>>>>>>> develop

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
}

module.exports = {
  devtool: 'cheap-source-map',
<<<<<<< HEAD

  entry: path.resolve(PATHS.src, 'js/index.js'),
  output: {
    path: PATHS.dist,
    filename: 'index.js',
    publicPath: '/'
  },
=======
  entry: path.resolve(PATHS.src, 'js/index.js'),
  output: {
    path: PATHS.dist,
    filename: 'app.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 1987,
  },

>>>>>>> develop
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
<<<<<<< HEAD
        exclude: /node_modules/,
=======
>>>>>>> develop
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'expanded',
              sourceMapContents: true,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      },
      {
        test: /\.(otf|ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
        options: '[path][name].[ext]',
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader',
<<<<<<< HEAD
      },
      { test: /\.hbs$/, loader: 'handlebars-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/layouts/main.hbs',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
=======
      }
    ]
  }
>>>>>>> develop
}
