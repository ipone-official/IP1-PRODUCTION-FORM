const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack'); 

module.exports = {
  devtool: false,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/, // รองรับไฟล์ฟอนต์ต่าง ๆ
        type: 'asset/resource',  // จัดการฟอนต์เป็น resource
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // สำหรับไฟล์ภาพและไอคอน SVG
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.vue'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico' // ระบุไฟล์ favicon
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // กำหนดตัวแปร process.env
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // ใช้ `static` แทน `contentBase`
    },
    compress: true,
    port: 8080,
    hot: true
  }
};
