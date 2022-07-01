# 處理樣式資源

本章節我們學習使用 Webpack 如何處理 Css、Less、Sass、Scss、Stylus 樣式資源

## 介紹

Webpack 本身是不能識別樣式資源的，所以我們需要藉助 Loader 來幫助 Webpack 解析樣式資源

我們找 Loader 都應該去官方文檔中找到對應的 Loader，然後使用 

官方文檔找不到的話，可以從社區 Github 中搜索查詢

[Webpack 官方 Loader 文檔](https://webpack.docschina.org/loaders/)

## 處理 Css 資源

### 1. 下載包

```:no-line-numbers
npm i css-loader style-loader -D
```

注意：需要下載兩個 loader

### 2. 功能介绍

- `css-loader`：負責將 Css 檔案編譯成 Webpack 能識別的模組
- `style-loader`：會動態創建一個 Style 標籤，裡面放置 Webpack 中 Css 模組內容

此時樣式就會以 Style 標籤的形式在頁面上生效

### 3. 配置

```js{11-16}
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
    ],
  },
  plugins: [],
  mode: "development",
};
```

### 4. 添加 Css 資源

- src/css/index.css

```css
.box1 {
  width: 100px;
  height: 100px;
  background-color: pink;
}
```

- src/main.js

```js{3-4}
import count from "./js/count";
import sum from "./js/sum";
// 引入 Css 資源，Webpack才會對其打包
import "./css/index.css";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));
```

- public/index.html

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
    <!-- 準備一個使用樣式的 DOM 容器 -->
    <div class="box1"></div>
    <!-- 引入打包後的js檔，才能看到效果 -->
    <script src="../dist/main.js"></script>
  </body>
</html>
```

### 5. 運行指令

```:no-line-numbers
npx webpack
```

打開 index.html 頁面查看效果

## 處理 Less 資源

### 1. 下載包

```:no-line-numbers
npm i less-loader less -D
```

### 2. 功能介绍

- `less-loader`：負責將 Less 檔案編譯成 Css 檔案

### 3. 配置

```js{17-20}
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
    ],
  },
  plugins: [],
  mode: "development",
};
```

### 4. 添加 Less 資源

- src/less/index.less

```css
.box2 {
  width: 100px;
  height: 100px;
  background-color: deeppink;
}
```

- src/main.js

```js{5}
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/index.css";
import "./less/index.less";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));
```

- public/index.html

```html{12}
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
    <script src="../dist/main.js"></script>
  </body>
</html>
```

### 5. 運行指令

```:no-line-numbers
npx webpack
```

打開 index.html 頁面查看效果

## 處理 Sass 和 Scss 資源

### 1. 下載包

```:no-line-numbers
npm i sass-loader sass -D
```

注意：需要下載兩個

### 2. 功能介绍

- `sass-loader`：負責將 Sass 文件編譯成 css 文件
- `sass`：`sass-loader` 依賴 `sass` 進行編譯

### 3. 配置

```js{21-24}
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
    ],
  },
  plugins: [],
  mode: "development",
};
```

### 4. 添加 Sass 資源

- src/sass/index.sass

```sass
/* 可以省略大括號和分號 */
.box3
  width: 100px
  height: 100px
  background-color: hotpink
```

- src/sass/index.scss

```scss
.box4 {
  width: 100px;
  height: 100px;
  background-color: lightpink;
}
```

- src/main.js

```js{6-7}
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));
```

- public/index.html

```html{13-14}
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
    <script src="../dist/main.js"></script>
  </body>
</html>
```

### 5. 運行指令

```:no-line-numbers
npx webpack
```

打開 index.html 頁面查看效果

## 處理 Styl 資源

### 1. 下載包

```:no-line-numbers
npm i stylus-loader -D
```

### 2. 功能介绍

- `stylus-loader`：負責將 Styl 文件編譯成 Css 文件

### 3. 配置

```js{25-28}
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
    ],
  },
  plugins: [],
  mode: "development",
};
```

### 4. 添加 Styl 資源

- src/styl/index.styl

```styl
/* 可以省略大括號、分號、冒號 */
.box 
  width 100px 
  height 100px 
  background-color pink
```

- src/main.js

```js{9}
import { add } from "./math";
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));
```

- public/index.html

```html{16}
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
    <!-- 準備一個使用樣式的 DOM 容器 -->
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
    <div class="box4"></div>
    <div class="box5"></div>
    <script src="../dist/main.js"></script>
  </body>
</html>
```

### 5. 運行指令

```:no-line-numbers
npx webpack
```

打開 index.html 頁面查看效果
