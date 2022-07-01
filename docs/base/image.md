# 處理圖片資源

過去在 Webpack4 时，我們處理圖片資源通過 `file-loader` 和 `url-loader` 進行處理

現在 Webpack5 已經將兩個 Loader 功能内置到 Webpack 裡了，我們只需要簡單配置即可處理圖片資源

## 1. 配置

```js{29-32}
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
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
      },
    ],
  },
  plugins: [],
  mode: "development",
};
```

## 2. 添加圖片資源

- src/images/1.jpeg
- src/images/2.png
- src/images/3.gif

## 3. 使用圖片資源

- src/less/index.less

```less
.box2 {
  width: 100px;
  height: 100px;
  background-image: url("../images/1.jpeg");
  background-size: cover;
}
```

- src/sass/index.sass

```sass
.box3
  width: 100px
  height: 100px
  background-image: url("../images/2.png")
  background-size: cover
```

- src/styl/index.styl

```styl
.box5
  width 100px
  height 100px
  background-image url("../images/3.gif")
  background-size cover
```

## 4. 運行指令

```:no-line-numbers
npx webpack
```

打開 index.html 頁面查看效果

## 5. 輸出資源情況

此時如果查看 dist 目錄的話，會發現多了三張圖片資源

因為 Webpack 會將所有打包好的資源輸出到 dist 目錄下

- 為什麼樣式資源沒有呢？

因為經過 `style-loader` 的處理，樣式資源打包到 main.js 裡面去了，所以沒有額外輸出出来

## 6. 對圖片資源進行優化

將小於某個大小的圖片轉化成 data URI 形式（Base64 格式）

```js{32-36}
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
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
            maxSize: 10 * 1024 // 小於 10kb 的圖片會被 base64 處理
          }
        }
      },
    ],
  },
  plugins: [],
  mode: "development",
};
```

- 優點：減少請求數量
- 缺點：體積變得更大

此時輸出的圖片檔案就只有兩張，有一張圖片以 data URI 形式内置到 js 中了
（注意：需要將上次打包生成的檔案清空，再重新打包才有效果）
