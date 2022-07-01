# 提升打包編譯速度

## HotModuleReplacement

### 為什麼

開發時我們修改了其中一個模組程式碼，Webpack 預設會將所有模組全部重新打包編譯，速度很慢。

所以我們需要做到修改某個模組程式碼，就只有這個模組程式碼需要重新打包編譯，其他模組不變，這樣打包速度就能很快。

### 是什麼

HotModuleReplacement（HMR/熱模組替換）：在程序運行中，替換、添加或刪除模組，而無需重新加載整個頁面。

### 怎麼用

1. 基本配置

```js
module.exports = {
  // 其他省略
  devServer: {
    host: "localhost", // 啟動服務器域名
    port: "3000", // 啟動服務器端口號
    open: true, // 是否自動打開瀏覽器
    hot: true, // 開啟 HMR 功能（只能用於開發環境，生產環境不需要了）
  },
};
```

此時 css 樣式經過 style-loader 處理，已經具備 HMR 功能了。
但是 js 還不行。

2. JS 配置

```js{17-28}
// main.js
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

// 判斷是否支持 HMR 功能
if (module.hot) {
  module.hot.accept("./js/count.js", function (count) {
    const result1 = count(2, 1);
    console.log(result1);
  });

  module.hot.accept("./js/sum.js", function (sum) {
    const result2 = sum(1, 2, 3, 4);
    console.log(result2);
  });
}
```

上面這樣寫會很麻煩，所以實際開發我們會使用其他 loader 來解決。

比如：[vue-loader](https://github.com/vuejs/vue-loader), [react-hot-loader](https://github.com/gaearon/react-hot-loader)。

## OneOf

### 為什麼

打包時每個檔案都會經過所有 loader 處理，雖然因為 `test` 正則原因實際沒有處理上，但是都要過一遍。比較慢。

### 是什麼

顧名思義就是只能匹配上一個 loader, 剩下的就不匹配了。

### 怎麼用

```js{14}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined, 
    filename: "static/js/main.js",
  },
  module: {
    rules: [
      {
        oneOf: [
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
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
    hot: true,
  },
  mode: "development",
  devtool: "cheap-module-source-map",
};
```

生產模式也是如此配置。

## Include/Exclude

### 為什麼

開發時我們需要使用第三方的庫或套件，所有檔案都下載到 node_modules 中了。而這些檔案是不需要編譯可以直接使用的。

所以我們在對 js 檔案處理時，要排除 node_modules 下面的檔案。

### 是什麼

- include

包含，只處理 xxx 檔案

- exclude

排除，除了 xxx 檔案以外其他檔案都處理

### 怎麼用

```js{53-54,64}
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
        oneOf: [
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
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用 include
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 預設值
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
    hot: true,
  },
  mode: "development",
  devtool: "cheap-module-source-map",
};
```

生產模式也是如此配置。

## Cache

### 為什麼

每次打包時 js 檔案都要經過 Eslint 檢查 和 Babel 編譯，速度比較慢。

我們可以緩存之前的 Eslint 檢查 和 Babel 編譯結果，這樣第二次打包時速度就會更快了。

### 是什麼

對 Eslint 檢查 和 Babel 編譯結果進行緩存。

### 怎麼用

```js{55-58,69-74}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined,
    filename: "static/js/main.js",
  },
  module: {
    rules: [
      {
        oneOf: [
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
            // exclude: /node_modules/, // 排除node_modules程式碼不編譯
            include: path.resolve(__dirname, "../src"), // 也可以用 include
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 開啟babel編譯緩存
              cacheCompression: false, // 緩存檔案不要壓縮
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 預設值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
    hot: true,
  },
  mode: "development",
  devtool: "cheap-module-source-map",
};
```

## Thead

### 為什麼

當專案越來越龐大時，打包速度越來越慢，甚至於需要一個下午才能打包出來程式碼。這個速度是比較慢的。

我們想要繼續提升打包速度，其實就是要提升 js 的打包速度，因為其他檔案都比較少。

而對 js 檔案處理主要就是 eslint 、babel、Terser 三個工具，所以我們要提升它們的運行速度。

我們可以開啟多進程同時處理 js 檔案，這樣速度就比之前的單進程打包更快了。

### 是什麼

多進程打包：開啟電腦的多個進程同時幹一件事，速度更快。

**需要注意：請僅在特别耗時的操作中使用，因為每個進程啟動就有大約為 600ms 左右開銷。**

### 怎麼用

我們啟動進程的數量就是我們 CPU 的核心數。

1. 如何獲取 CPU 的核心數，因為每個電腦都不一樣。

```js
// nodejs核心模組，直接使用
const os = require("os");
// cpu核心數
const threads = os.cpus().length;
```

2. 下載包

```
npm i thread-loader -D
```

3. 使用

```js{1,7,9-10,81-94,111,120,122-132}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

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
            "postcss-preset-env",
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
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js",
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
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
      exclude: "node_modules", // 預設值
      cache: true, // 開啟緩存
      // 緩存目錄
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 開啟多進程
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    // css壓縮
    // new CssMinimizerPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // css壓縮也可以寫到optimization.minimizer裡面，效果一樣的
      new CssMinimizerPlugin(),
      // 當生產模式會預設開啟TerserPlugin，但是我們需要進行其他配置，就要重新寫了
      new TerserPlugin({
        parallel: threads // 開啟多進程
      })
    ],
  },
  mode: "production",
  devtool: "source-map",
};
```

我們目前打包的内容都很少，所以因為啟動進程開銷原因，使用多進程打包實際上會顯著的讓我們打包時間變得很長。
