# 處理 Html 資源

## 1. 下載包

```:no-line-numbers
npm i html-webpack-plugin -D
```

## 2. 配置

- webpack.config.js

```js{3,68-72}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "static/js/main.js",
    clean: true,
  },
  module: {
    rules: [
      {
        // 用來匹配 .css 結尾的檔案
        test: /\.css$/,
        // use 陣列裡面 Loader 執行順序是從右到左
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, 
          },
        },
        generator: {
          // 將圖片檔輸出到 static/imgs 目錄中
          // 將圖片檔命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的檔案擴展名
          // [query]: 添加之前的 query 參數
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash:8][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules程式碼不編譯
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "src"),
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和原檔案一致 2. 自動引入打包生成的 js 等資源
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
  mode: "development",
};
```

## 3. 修改 index.html

去掉引入的 js 檔案，因為 HtmlWebpackPlugin 會自動引入

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack5</title>
  </head>
  <body>
    <h1>Hello Webpack5</h1>
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
    <div class="box4"></div>
    <div class="box5"></div>
    <i class="iconfont icon-arrow-down"></i>
    <i class="iconfont icon-ashbin"></i>
    <i class="iconfont icon-browse"></i>
  </body>
</html>
```

## 4. 運行指令

```:no-line-numbers
npx webpack
```

此時 dist 目錄就會輸出一個 index.html 檔案
