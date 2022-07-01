# 生產模式介紹

生產模式是程式碼開發完成後，我們需要得到程式碼將來部署上线。

這個模式下我們主要對程式碼進行優化，讓其運行性能更好。

優化主要從兩個角度出發:

1. 優化程式碼運行性能
2. 優化程式碼打包速度

## 生產模式準備

我們分别準備兩個配置檔案來放不同的配置

### 1. 檔案目錄

```:no-line-numbers
├── webpack-test (專案根目錄)
    ├── config (Webpack配置檔案目錄)
    │    ├── webpack.dev.js(開發模式配置檔案)
    │    └── webpack.prod.js(生產模式配置檔案)
    ├── node_modules (下載包存放目錄)
    ├── src (專案原始碼目錄，除了 html 其他都在 src 裡面)
    │    └── 略
    ├── public (專案 html 檔案)
    │    └── index.html
    ├── .eslintrc.js(Eslint 配置檔案)
    ├── babel.config.js(Babel 配置檔案)
    └── package.json (包的依賴管理配置檔案)
```

### 2. 修改 webpack.dev.js

因為檔案目錄變了，所以所有絕對路徑需要回退一層目錄才能找到對應的檔案

```js{8,10,59,64}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined, // 開發模式沒有輸出，不需要指定輸出目錄
    filename: "static/js/main.js",
    // clean: true, // 開發模式沒有輸出，不需要清空輸出結果
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
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和原檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  // 其他省略
  devServer: {
    host: "localhost",
    port: "3000", 
    open: true, 
  },
  mode: "development",
};
```

運行開發模式的指令：

```:no-line-numbers
npx webpack serve --config ./config/webpack.dev.js
```

### 3. 修改 webpack.prod.js

```js{8,67-72}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
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
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和原檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  // devServer: {
  //   host: "localhost",
  //   port: "3000", 
  //   open: true, 
  // },
  mode: "production",
};
```

運行生產模式的指令：

```:no-line-numbers
npx webpack --config ./config/webpack.prod.js
```

### 4. 配置運行指令

為了方便運行不同模式的指令，我們將指令定義在 package.json 中 scripts 裡面

```json
// package.json
{
  // 其他省略
  "scripts": {
    "start": "npm run dev",
    "dev": "npx webpack serve --config ./config/webpack.dev.js",
    "build": "npx webpack --config ./config/webpack.prod.js"
  }
}
```

以後啟動指令：

- 開發模式：`npm start` 或 `npm run dev`
- 生產模式：`npm run build`
