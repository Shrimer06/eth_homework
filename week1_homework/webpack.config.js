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
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
         }, 
         {
            test: /\.jsx?$/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: [
                     ['@babel/preset-env', {
                        modules: 'commonjs',
                        targets: {
                           browsers: ['> 1%', 'last 2 versions']
                        }
                     }],
                     ['@babel/preset-react', {
                        runtime: 'automatic'
                     }]
                  ],
                  plugins: [
                     '@babel/plugin-syntax-jsx'
                  ]
               }
            },
            exclude: /node_modules/
         }
      ]
   }
}
