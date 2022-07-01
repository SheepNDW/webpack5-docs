# 開發服務器(DevServer)&自動化

每次寫完程式碼都需要手動輸入指令才能編譯程式碼，太麻煩了，我們希望一切自動化

## 1. 下載包

```:no-line-numbers
npm i webpack-dev-server -D
```

## 2. 配置

- webpack.config.js

```js{64-69}
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
        test: /\.css$/,
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
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
  // 開發服務器
  devServer: {
    host: "localhost", // 啟動服務器域名
    port: "3000", // 啟動服務器端口號
    open: true, // 是否自動打開瀏覽器
  },
  mode: "development",
};
```

## 3. 運行指令

```:no-line-numbers
npx webpack serve
```

**注意運行指令發生了變化**

並且當你使用開發服務器時，所有程式碼都會在内存中編譯打包，並不會輸出到 dist 目錄下。

開發時我們只關心程式碼能運行，有效果即可，至於程式碼被編譯成什麼樣子，我們並不需要知道。
