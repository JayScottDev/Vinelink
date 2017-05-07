const webpack = require('webpack')
const path = require('PATHS')

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
}

module.exports = {
  devtool: 'cheap-source-map',
  
  entry: path.resolve(PATHS.src, 'js/index.js'),
  output: {
    path: PATHS.dist,
    filename: 'app.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
      }
    ]
  }
}
