# 基本配置

在開始使用 `Webpack` 之前，我們需要對 `Webpack` 的配置有一定的認識。

## 5 大核心概念

1. entry（入口）

指示 Webpack 從哪個檔案開始打包

2. output（輸出）

指示 Webpack 打包完的檔案輸出到哪裡去，如何命名等

3. loader（加載器）

webpack 本身只能處理 js、json 等資源，其他資源需要借助 loader，Webpack 才能解析

4. plugins（插件）

擴展 Webpack 的功能

5. mode（模式）

主要由兩種模式：

- 開發模式：development
- 生產模式：production

## 準備 Webpack 配置檔案

在專案根目錄下新建檔案：`webpack.config.js`

```js
module.exports = {
  // 入口
  entry: "",
  // 輸出
  output: {},
  // 加載器
  module: {
    rules: [],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "",
};
```

Webpack 是基於 Node.js 運行的，所以採用 CommonJS 模組化規範

## 修改配置檔案

1. 配置檔案

```js
// Node.js的核心模組，專門用來處理檔案路徑
const path = require("path");

module.exports = {
  // 入口
  // 相對路徑和絕對路徑都行
  entry: "./src/main.js",
  // 輸出
  output: {
    // path: 檔案輸出目錄，必须是絕對路徑
    // path.resolve()方法返回一个絕對路徑
    // __dirname 當前檔案的資料夾絕對路徑
    path: path.resolve(__dirname, "dist"),
    // filename: 輸出檔案名
    filename: "main.js",
  },
  // 加載器
  module: {
    rules: [],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "development", // 開發模式
};
```

2. 運行指令

```:no-line-numbers
npx webpack
```

此時功能和之前一樣，也不能處理樣式資源

## 小結

Webpack 將來都通過 `webpack.config.js` 檔案進行配置，來增強 Webpack 的功能

我們後面會以兩個模式來分别搭建 Webpack 的配置，先進行開發模式，再完成生產模式
