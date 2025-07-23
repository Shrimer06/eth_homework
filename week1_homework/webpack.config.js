const path = require('path')

module.exports = {
   mode: 'development',
   entry: path.join(__dirname, 'src/js', 'index.js'),
   output: {
      path: path.join(__dirname, 'dist'),
      filename: 'build.js'
   },
   resolve: {
      extensions: ['.js', '.jsx', '.json']
   },
   module: {
      rules: [{
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
         include: /src/
      }, {
         test: /\.jsx?$/,
         use: 'babel-loader',
         exclude: /node_modules/
      }]
   }
}