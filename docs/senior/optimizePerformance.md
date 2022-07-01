# 優化程式碼運行效能

## Code Split

### 為什麼

打包程式碼時會將所有 js 檔案打包到一個檔案中，體積太大了。我們如果只要渲染首頁，就應該只加載首頁的 js 檔案，其他檔案不應該加載。

所以我們需要將打包生成的檔案進行程式碼分割，生成多個 js 檔案，渲染哪個頁面就只加載某個 js 檔案，這樣加載的資源就少，速度就更快。

### 是什麼

程式碼分割（Code Split）主要做了兩件事：

1.  分割檔案：將打包生成的檔案進行分割，生成多個 js 檔案。
2.  按需加載：需要哪個檔案就加載哪個檔案。

### 怎麼用

程式碼分割實現方式有不同的方式，為了更加方便體現它們之間的差異，我們會分别創建新的檔案來演示

##### 1. 多入口

1. 檔案目錄

```
├── public
├── src
|   ├── app.js
|   └── main.js
├── package.json
└── webpack.config.js
```

2. 下載包

```
npm i webpack webpack-cli html-webpack-plugin -D
```

3. 新建檔案

内容無關緊要，主要觀察打包輸出的結果

- app.js

```js
console.log("hello app");
```

- main.js

```js
console.log("hello main");
```

4. 配置

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 單入口
  // entry: './src/main.js',
  // 多入口
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    // [name]是webpack命名規則，使用chunk的name作為輸出的檔案名。
    // 什麼是chunk？打包的資源就是chunk，輸出出去叫bundle。
    // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和檔案名無關。
    // 為什麼需要這樣命名呢？如果還是之前寫法main.js，那麼打包生成兩個js檔案都會叫做main.js會發生覆蓋。(實際上會直接報錯的)
    filename: "js/[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  mode: "production",
};
```

5. 運行指令

```
npx webpack
```

此時在 dist 目錄我們能看到輸出了兩個 js 檔案。

總結：配置了幾個入口，至少輸出幾個 js 檔案。

##### 2. 提取重複程式碼

如果多入口檔案中都引用了同一份程式碼，我們不希望這份程式碼被打包到兩個檔案中，導致程式碼重複，體積更大。

我們需要提取多入口的重複程式碼，只打包生成一個 js 檔案，其他檔案引用它就好。

1. 修改檔案

- app.js

```js
import { sum } from "./math";

console.log("hello app");
console.log(sum(1, 2, 3, 4));
```

- main.js

```js
import { sum } from "./math";

console.log("hello main");
console.log(sum(1, 2, 3, 4, 5));
```

- math.js

```js
export const sum = (...args) => {
  return args.reduce((p, c) => p + c, 0);
};
```

2. 修改配置檔案

```js{28-67}
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 單入口
  // entry: './src/main.js',
  // 多入口
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    // [name]是webpack命名規則，使用chunk的name作為輸出的檔案名。
    // 什麼是chunk？打包的資源就是chunk，輸出出去叫bundle。
    // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和檔案名無關。
    // 為什麼需要這樣命名呢？如果還是之前寫法main.js，那麼打包生成兩個js檔案都會叫做main.js會發生覆蓋。(實際上會直接報錯的)
    filename: "js/[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  mode: "production",
  optimization: {
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 以下是默認值
      // minSize: 20000, // 分割程式碼最小的大小
      // minRemainingSize: 0, // 類似於minSize，最後確保提取的檔案大小不能為0
      // minChunks: 1, // 至少被引用的次數，滿足條件才會程式碼分割
      // maxAsyncRequests: 30, // 按需加載時並行加載的檔案的最大數量
      // maxInitialRequests: 30, // 入口js檔案最大並行請求數量
      // enforceSizeThreshold: 50000, // 超過50kb一定會單獨打包（此時會忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 組，哪些模組要打包到一個組
      //   defaultVendors: { // 組名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模組
      //     priority: -10, // 權重（越大越高）
      //     reuseExistingChunk: true, // 如果當前 chunk 包含已從主 bundle 中拆分出的模組，則它將被重用，而不是生成新的模組
      //   },
      //   default: { // 其他沒有寫的配置會使用上面的默認值
      //     minChunks: 2, // 這裡的minChunks權重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
      // 修改配置
      cacheGroups: {
        // 組，哪些模組要打包到一個組
        // defaultVendors: { // 組名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模組
        //   priority: -10, // 權重（越大越高）
        //   reuseExistingChunk: true, // 如果當前 chunk 包含已從主 bundle 中拆分出的模組，則它將被重用，而不是生成新的模組
        // },
        default: {
          // 其他沒有寫的配置會使用上面的默認值
          minSize: 0, // 我們定義的檔案體積太小了，所以要改打包的最小檔案體積
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

3. 運行指令

```
npx webpack
```

此時我們會發現生成 3 個 js 檔案，其中有一個就是提取的公共模組。

##### 3. 按需加載，動態導入

想要實現按需加載，動態導入模組。還需要額外配置：

1. 修改檔案

- main.js

```js
console.log("hello main");

document.getElementById("btn").onclick = function () {
  // 動態導入 --> 實現按需加載
  // 即使只被引用了一次，也會程式碼分割
  import("./math.js").then(({ sum }) => {
    alert(sum(1, 2, 3, 4, 5));
  });
};
```

- app.js

```js
console.log("hello app");
```

- public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Split</title>
  </head>
  <body>
    <h1>hello webpack</h1>
    <button id="btn">計算</button>
  </body>
</html>
```

2. 運行指令

```
npx webpack
```

我們可以發現，一旦通過 import 動態導入語法導入模組，模組就被程式碼分割，同時也能按需加載了。

##### 4. 單入口

開發時我們可能是單頁面應用（SPA），只有一個入口（單入口）。那麼我們需要這樣配置：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 單入口
  entry: "./src/main.js",
  // 多入口
  // entry: {
  //   main: "./src/main.js",
  //   app: "./src/app.js",
  // },
  output: {
    path: path.resolve(__dirname, "./dist"),
    // [name]是webpack命名規則，使用chunk的name作為輸出的檔案名。
    // 什麼是chunk？打包的資源就是chunk，輸出出去叫bundle。
    // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和檔案名無關。
    // 為什麼需要這樣命名呢？如果還是之前寫法main.js，那麼打包生成兩個js檔案都會叫做main.js會發生覆蓋。(實際上會直接報錯的)
    filename: "js/[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  mode: "production",
  optimization: {
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 以下是默認值
      // minSize: 20000, // 分割程式碼最小的大小
      // minRemainingSize: 0, // 類似於minSize，最後確保提取的檔案大小不能為0
      // minChunks: 1, // 至少被引用的次數，滿足條件才會程式碼分割
      // maxAsyncRequests: 30, // 按需加載時並行加載的檔案的最大數量
      // maxInitialRequests: 30, // 入口js檔案最大並行請求數量
      // enforceSizeThreshold: 50000, // 超過50kb一定會單獨打包（此時會忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 組，哪些模組要打包到一個組
      //   defaultVendors: { // 組名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模組
      //     priority: -10, // 權重（越大越高）
      //     reuseExistingChunk: true, // 如果當前 chunk 包含已從主 bundle 中拆分出的模組，則它將被重用，而不是生成新的模組
      //   },
      //   default: { // 其他沒有寫的配置會使用上面的默認值
      //     minChunks: 2, // 這裡的minChunks權重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
  },
};
```

###### 5. 更新配置

最終我們會使用單入口+程式碼分割+動態導入方式來進行配置。更新之前的配置檔案。

```js{174-178}
// webpack.prod.js
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// cpu核數
const threads = os.cpus().length;

// 獲取處理樣式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解決大多數樣式兼容性問題
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
    filename: "static/js/main.js", // 將 js 檔案輸出到 static/js 目錄中
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用來匹配 .css 結尾的檔案
            test: /\.css$/,
            // use 陣列裡面 Loader 執行順序是從右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, 
              },
            },
            generator: {
              // 將圖片檔案輸出到 static/imgs 目錄中
              // 將圖片檔案命名 [hash:8][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的檔案擴展名
              // [query]: 添加之前的query參數
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
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 開啟多進程
                options: {
                  workers: threads, // 數量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 開啟babel編譯緩存
                  cacheCompression: false, // 緩存檔案不要壓縮
                  plugins: ["@babel/plugin-transform-runtime"], // 减少程式碼體積
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默認值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和源檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/main.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
  ],
  optimization: {
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會默認開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads, // 開啟多進程
      }),
      // 壓縮圖片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 其他内容用默認配置即可
    },
  },
  // devServer: {
  //   host: "localhost", // 啟動服務器域名
  //   port: "3000", // 啟動服務器端口号
  //   open: true, // 是否自動打開瀏覽器
  // },
  mode: "production",
  devtool: "source-map",
};
```

##### 6. 给動態導入檔案取名稱

1. 修改檔案

- main.js

```js
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

const result2 = sum(1, 2, 3, 4);
console.log(result2);

// 以下程式碼生產模式下會删除
if (module.hot) {
  module.hot.accept("./js/sum.js", function (sum) {
    const result2 = sum(1, 2, 3, 4);
    console.log(result2);
  });
}

document.getElementById("btn").onClick = function () {
  // eslint會對動態導入語法報錯，需要修改eslint配置檔案
  // webpackChunkName: "math"：這是webpack動態導入模組命名的方式
  // "math"將來就會作為[name]的值顯示。
  import(/* webpackChunkName: "math" */ "./js/math.js").then(({ count }) => {
    console.log(count(2, 1));
  });
};
```

2. eslint 配置

- 下載包

```
npm i eslint-plugin-import -D
```

- 配置

```js{9,17-19}
// .eslintrc.js
module.exports = {
  // 繼承 Eslint 規則
  extends: ["eslint:recommended"],
  env: {
    node: true, // 啟用node中全域變數
    browser: true, // 啟用瀏覽器中全域變數
  },
  plugins: ["import"], // 解決動態導入import語法報錯問題 --> 實際使用eslint-plugin-import的規則解決的
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    "no-var": 2, // 不能使用 var 定義變數
  },
  // 如果有 'import' and 'export' may only appear at the top level 報錯問題
  // 可以安裝 babel-eslint (最高安裝到 8 版本)
  parser: 'babel-eslint',
};
```

1. 統一命名配置

```js{36-38,71-78,83-85,132-134}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// cpu核數
const threads = os.cpus().length;

// 獲取處理樣式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解決大多數樣式兼容性問題
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
    filename: "static/js/[name].js", // 入口檔案打包輸出資源命名方式
    chunkFilename: "static/js/[name].chunk.js", // 動態導入輸出資源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 圖片、字體等資源命名方式（注意用hash）
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用來匹配 .css 結尾的檔案
            test: /\.css$/,
            // use 陣列裡面 Loader 執行順序是從右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, 
              },
            },
            // generator: {
            //   // 將圖片檔案輸出到 static/imgs 目錄中
            //   // 將圖片檔案命名 [hash:8][ext][query]
            //   // [hash:8]: hash值取8位
            //   // [ext]: 使用之前的檔案擴展名
            //   // [query]: 添加之前的query參數
            //   filename: "static/imgs/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 開啟多進程
                options: {
                  workers: threads, // 數量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 開啟babel編譯緩存
                  cacheCompression: false, // 緩存檔案不要壓縮
                  plugins: ["@babel/plugin-transform-runtime"], // 减少程式碼體積
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默認值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和源檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/[name].css",
      chunkFilename: "static/css/[name].chunk.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
  ],
  optimization: {
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會默認開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads, // 開啟多進程
      }),
      // 壓縮圖片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 其他内容用默認配置即可
    },
  },
  mode: "production",
  devtool: "source-map",
};
```

3. 運行指令

```
npx webpack
```

觀察打包輸出 js 檔案名稱。

## Preload / Prefetch

### 為什麼

我們前面已经做了程式碼分割，同時會使用 import 動態導入語法來進行程式碼按需加載（我們也叫懶加載，比如路由懶加載就是這樣實現的）。

但是加載速度還不夠好，比如：是用戶點擊按鈕時才加載這個資源的，如果資源體積很大，那麼用戶會感覺到明顯卡頓效果。

我們想在瀏覽器空閒時間，加載後續需要使用的資源。我們就需要用上 `Preload` 或 `Prefetch` 技術。

### 是什麼

- `Preload`：告訴瀏覽器立即加載資源。

- `Prefetch`：告訴瀏覽器在空閒時才開始加載資源。

它們共同點：

- 都只會加載資源，並不執行。
- 都有緩存。

它們區别：

- `Preload`加載優先級高，`Prefetch`加載優先級低。
- `Preload`只能加載當前頁面需要使用的資源，`Prefetch`可以加載當前頁面資源，也可以加載下一個頁面需要使用的資源。

總結：

- 當前頁面優先級高的資源用 `Preload` 加載。
- 下一個頁面需要使用的資源用 `Prefetch` 加載。

它們的問題：兼容性較差。

- 我們可以去 [Can I Use](https://caniuse.com/) 網站查詢 API 的兼容性問題。
- `Preload` 相對於 `Prefetch` 兼容性好一點。

### 怎麼用

1. 下載包

```
npm i @vue/preload-webpack-plugin -D
```

2. 配置 webpack.prod.js

```js{9,139-143}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

// cpu核數
const threads = os.cpus().length;

// 獲取處理樣式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解決大多數樣式兼容性問題
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
    filename: "static/js/[name].js", // 入口檔案打包輸出資源命名方式
    chunkFilename: "static/js/[name].chunk.js", // 動態導入輸出資源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 圖片、字體等資源命名方式（注意用hash）
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用來匹配 .css 結尾的檔案
            test: /\.css$/,
            // use 陣列裡面 Loader 執行順序是從右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, 
              },
            },
            // generator: {
            //   // 將圖片檔案輸出到 static/imgs 目錄中
            //   // 將圖片檔案命名 [hash:8][ext][query]
            //   // [hash:8]: hash值取8位
            //   // [ext]: 使用之前的檔案擴展名
            //   // [query]: 添加之前的query參數
            //   filename: "static/imgs/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 開啟多進程
                options: {
                  workers: threads, // 數量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 開啟babel編譯緩存
                  cacheCompression: false, // 緩存檔案不要壓縮
                  plugins: ["@babel/plugin-transform-runtime"], // 减少程式碼體積
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默認值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和源檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/[name].css",
      chunkFilename: "static/css/[name].chunk.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
    new PreloadWebpackPlugin({
      rel: "preload", // preload兼容性更好
      as: "script",
      // rel: 'prefetch' // prefetch兼容性更差
    }),
  ],
  optimization: {
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會默認開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads, // 開啟多進程
      }),
      // 壓縮圖片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 其他内容用默認配置即可
    },
  },
  mode: "production",
  devtool: "source-map",
};
```

## Network Cache

### 為什麼

將來開發時我們對静态資源會使用緩存來優化，這樣瀏覽器第二次請求資源就能讀取緩存了，速度很快。

但是這樣的話就會有一個問題, 因為前後輸出的檔案名是一樣的，都叫 main.js，一旦將來發布新版本，因為檔案名沒有變化導致瀏覽器會直接讀取緩存，不會加載新資源，專案也就沒法更新了。

所以我們從檔案名入手，確保更新前後檔案名不一樣，這樣就可以做緩存了。

### 是什麼

它們都會生成一個唯一的 hash 值。

- fullhash（webpack4 是 hash）

每次修改任何一個檔案，所有檔案名的 hash 至都將改變。所以一旦修改了任何一個檔案，整個專案的檔案緩存都將失效。

- chunkhash

根據不同的入口檔案(Entry)進行依賴檔案解析、構建對應的 chunk，生成對應的哈希值。我們 js 和 css 是同一個引入，會共享一個 hash 值。

- contenthash

根據檔案内容生成 hash 值，只有檔案内容變化了，hash 值才會變化。所有檔案 hash 值是獨享且不同的。

### 怎麼用

```js{37-39,135-136}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

// cpu核數
const threads = os.cpus().length;

// 獲取處理樣式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解決大多數樣式兼容性問題
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
    // [contenthash:8] 使用 contenthash，取8位長度
    filename: "static/js/[name].[contenthash:8].js", // 入口檔案打包輸出資源命名方式
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 動態導入輸出資源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 圖片、字體等資源命名方式（注意用hash）
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用來匹配 .css 結尾的檔案
            test: /\.css$/,
            // use 陣列裡面 Loader 執行順序是從右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, 
              },
            },
            // generator: {
            //   // 將圖片檔案輸出到 static/imgs 目錄中
            //   // 將圖片檔案命名 [hash:8][ext][query]
            //   // [hash:8]: hash值取8位
            //   // [ext]: 使用之前的檔案擴展名
            //   // [query]: 添加之前的query參數
            //   filename: "static/imgs/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 開啟多進程
                options: {
                  workers: threads, // 數量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 開啟babel編譯緩存
                  cacheCompression: false, // 緩存檔案不要壓縮
                  plugins: ["@babel/plugin-transform-runtime"], // 减少程式碼體積
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默認值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和源檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
    new PreloadWebpackPlugin({
      rel: "preload", // preload兼容性更好
      as: "script",
      // rel: 'prefetch' // prefetch兼容性更差
    }),
  ],
  optimization: {
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會默認開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads, // 開啟多進程
      }),
      // 壓縮圖片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 其他内容用默認配置即可
    },
  },
  mode: "production",
  devtool: "source-map",
};
```

- 問題：

當我們修改 math.js 檔案再重新打包的時候，因為 contenthash 原因，math.js 檔案 hash 值發生了變化（這是正常的）。

但是 main.js 檔案的 hash 值也發生了變化，這會導致 main.js 的緩存失效。明明我們只修改 math.js, 為什麼 main.js 也會變身變化呢？

- 原因：

  - 更新前：math.xxx.js, main.js 引用的 math.xxx.js
  - 更新後：math.yyy.js, main.js 引用的 math.yyy.js, 檔案名發生了變化，間接導致 main.js 也發生了變化

- 解決：

將 hash 值單獨保管在一個 runtime 檔案中。

我們最終輸出三個檔案：main、math、runtime。當 math 檔案發送變化，變化的是 math 和 runtime 檔案，main 不變。

runtime 檔案只保存檔案的 hash 值和它們與檔案關係，整個檔案體積就比較小，所以變化重新請求的代價也小。

```js{188-191}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

// cpu核數
const threads = os.cpus().length;

// 獲取處理樣式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解決大多數樣式兼容性問題
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
    // [contenthash:8]使用contenthash，取8位長度
    filename: "static/js/[name].[contenthash:8].js", // 入口檔案打包輸出資源命名方式
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 動態導入輸出資源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 圖片、字體等資源命名方式（注意用hash）
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用來匹配 .css 結尾的檔案
            test: /\.css$/,
            // use 陣列裡面 Loader 執行順序是從右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, 
              },
            },
            // generator: {
            //   // 將圖片檔案輸出到 static/imgs 目錄中
            //   // 將圖片檔案命名 [hash:8][ext][query]
            //   // [hash:8]: hash值取8位
            //   // [ext]: 使用之前的檔案擴展名
            //   // [query]: 添加之前的query參數
            //   filename: "static/imgs/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 開啟多進程
                options: {
                  workers: threads, // 數量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 開啟babel編譯緩存
                  cacheCompression: false, // 緩存檔案不要壓縮
                  plugins: ["@babel/plugin-transform-runtime"], // 减少程式碼體積
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默認值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和源檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
    new PreloadWebpackPlugin({
      rel: "preload", // preload兼容性更好
      as: "script",
      // rel: 'prefetch' // prefetch兼容性更差
    }),
  ],
  optimization: {
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會默認開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads, // 開啟多進程
      }),
      // 壓縮圖片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 其他内容用默認配置即可
    },
    // 提取runtime檔案
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime檔案命名規則
    },
  },
  mode: "production",
  devtool: "source-map",
};
```

## Core-js

### 為什麼

過去我們使用 babel 對 js 程式碼進行了兼容性處理，其中使用@babel/preset-env 智能預設來處理兼容性問題。

它能將 ES6 的一些語法進行編譯轉換，比如箭頭函式、點點點運算子等。但是如果是 async 函數、promise 物件、陣列的一些方法（includes）等，它沒辦法處理。

所以此時我們 js 程式碼仍然存在兼容性問題，一旦遇到低版本瀏覽器會直接報錯。所以我們想要將 js 兼容性問題徹底解決

### 是什麼

`core-js` 是專門用來做 ES6 以及以上 API 的 `polyfill`。

`polyfill`翻譯過來叫做墊片/補丁。就是用社區上提供的一段程式碼，讓我們在不兼容某些新特性的瀏覽器上，使用該新特性。

### 怎麼用

1. 修改 main.js

```js{15-19}
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);
// 添加promise程式碼
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});
```

此時 Eslint 會對 Promise 報錯。

2. 修改配置檔案

- 下載包

```
npm i @babel/eslint-parser -D
```

- .eslintrc.js

```js{4}
module.exports = {
  // 繼承 Eslint 規則
  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser", // 支持最新的最終 ECMAScript 標準
  env: {
    node: true, // 啟用node中全域變數
    browser: true, // 啟用瀏覽器中全域變數
  },
  plugins: ["import"], // 解決動態導入import語法報錯問題 --> 實際使用eslint-plugin-import的規則解決的
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: "module", // es module
  },
  rules: {
    "no-var": 2, // 不能使用 var 定義變數
  },
};
```

3. 運行指令

```
npm run build
```

此時觀察打包輸出的 js 檔案，我們發現 Promise 語法並沒有編譯轉換，所以我們需要使用 `core-js` 來進行 `polyfill`。

4. 使用`core-js`

- 下載包

```
npm i core-js
```

- 手動全部引入

```js{1}
import "core-js";
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);
// 添加promise程式碼
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});
```

這樣引入會將所有兼容性程式碼全部引入，體積太大了。我們只想引入 promise 的 `polyfill`。

- 手動按需引入

```js{1}
import "core-js/es/promise";
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);
// 添加promise程式碼
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});
```

只引入打包 promise 的 `polyfill`，打包體積更小。但是將來如果還想使用其他語法，我需要手動引入庫很麻煩。

- 自動按需引入

  - main.js

  ```js
  import count from "./js/count";
  import sum from "./js/sum";
  // 引入資源，Webpack才會對其打包
  import "./css/iconfont.css";
  import "./css/index.css";
  import "./less/index.less";
  import "./sass/index.sass";
  import "./sass/index.scss";
  import "./styl/index.styl";

  const result1 = count(2, 1);
  console.log(result1);
  const result2 = sum(1, 2, 3, 4);
  console.log(result2);
  // 添加promise程式碼
  const promise = Promise.resolve();
  promise.then(() => {
    console.log("hello promise");
  });
  ```

  - babel.config.js

  ```js
  module.exports = {
    // 智能預設：能夠編譯ES6語法
    presets: [
      [
        "@babel/preset-env",
        // 按需加載core-js的polyfill
        { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
      ],
    ],
  };
  ```

此時就會自動根據我們程式碼中使用的語法，來按需加載相應的 `polyfill` 了。

## PWA

### 為什麼

開發 Web App 專案，專案一旦處於網路離線情況，就沒法訪問了。

我們希望给專案提供離線體驗。

### 是什麼

漸進式網路應用程序(progressive web application - PWA)：是一種可以提供類似於 native app(原生應用程序) 體驗的 Web App 的技術。

其中最重要的是，在 **離線(offline)** 時應用程序能夠繼續運行功能。

内部通過 Service Workers 技術實現的。

### 怎麼用

1. 下載包

```
npm i workbox-webpack-plugin -D
```

2. 修改配置檔案

```js{10,146-151}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

// cpu核數
const threads = os.cpus().length;

// 獲取處理樣式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解決大多數樣式兼容性問題
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生產模式需要輸出
    // [contenthash:8]使用contenthash，取8位長度
    filename: "static/js/[name].[contenthash:8].js", // 入口檔案打包輸出資源命名方式
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 動態導入輸出資源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 圖片、字體等資源命名方式（注意用hash）
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用來匹配 .css 結尾的檔案
            test: /\.css$/,
            // use 陣列裡面 Loader 執行順序是從右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, 
              },
            },
            // generator: {
            //   // 將圖片檔案輸出到 static/imgs 目錄中
            //   // 將圖片檔案命名 [hash:8][ext][query]
            //   // [hash:8]: hash值取8位
            //   // [ext]: 使用之前的檔案擴展名
            //   // [query]: 添加之前的query參數
            //   filename: "static/imgs/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 開啟多進程
                options: {
                  workers: threads, // 數量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 開啟babel編譯緩存
                  cacheCompression: false, // 緩存檔案不要壓縮
                  plugins: ["@babel/plugin-transform-runtime"], // 减少程式碼體積
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默認值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 為模板創建檔案
      // 新的html檔案有兩個特點：1. 内容和源檔案一致 2. 自動引入打包生成的js等資源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
    new PreloadWebpackPlugin({
      rel: "preload", // preload兼容性更好
      as: "script",
      // rel: 'prefetch' // prefetch兼容性更差
    }),
    new WorkboxPlugin.GenerateSW({
      // 這些選項幫助快速啟用 ServiceWorkers
      // 不允許遺留任何“舊的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  optimization: {
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會默認開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads, // 開啟多進程
      }),
      // 壓縮圖片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 程式碼分割配置
    splitChunks: {
      chunks: "all", // 對所有模組都進行分割
      // 其他内容用默認配置即可
    },
  },
  mode: "production",
  devtool: "source-map",
};
```

3. 修改 main.js

```js{24-35}
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);
// 添加promise程式碼
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});

const arr = [1, 2, 3, 4, 5];
console.log(arr.includes(5));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
```

4. 運行指令

```
npm run build
```

此時如果直接通過 VSCode 訪問打包後頁面，在瀏覽器控制台會發現 `SW registration failed`。

因為我們打開的訪問路徑是：`http://127.0.0.1:5500/dist/index.html`。此時頁面會去請求 `service-worker.js` 檔案，請求路徑是：`http://127.0.0.1:5500/service-worker.js`，這樣找不到會 404。

實際 `service-worker.js` 檔案路徑是：`http://127.0.0.1:5500/dist/service-worker.js`。

5. 解決路徑問題

- 下載包

```
npm i serve -g
```

serve 也是用來啟動開發服務器來部署程式碼查看效果的。

- 運行指令

```
serve dist
```

此時通過 serve 啟動的服務器我們 service-worker 就能註冊成功了。
