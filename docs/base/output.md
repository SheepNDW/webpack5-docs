# 修改輸出資源的名稱和路徑

## 1. 配置

```js{7,37-44}
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "static/js/main.js", // 將 js 檔案輸出到 static/js 目錄中
  },
  module: {
    rules: [
      {
        // 用來匹配 .css 結尾的檔案
        test: /\.css$/,
        // use 陣列里面 Loader 執行順序是從右到左
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
            maxSize: 10 * 1024, // 小於10kb的圖片會被 base64 處理
          },
        },
        generator: {
          // 將圖片檔案輸出到 static/imgs 目錄中
          // 將圖片檔案命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的檔案擴展名
          // [query]: 添加之前的 query 參數
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
    ],
  },
  plugins: [],
  mode: "development",
};
```

## 2. 修改 index.html

```html{17}
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
    <!-- 修改 js 資源路徑 -->
    <script src="../dist/static/js/main.js"></script>
  </body>
</html>
```

## 3. 運行指令

```:no-line-numbers
npx webpack
```

- 此時輸出檔案目錄：

（注意：需要將上次打包生成的檔案清空，再重新打包才有效果）

```
├── dist
    └── static
         ├── imgs
         │    └── 7003350e.png
         └── js
              └── main.js
```
