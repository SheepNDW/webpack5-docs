# 減少程式碼體積

## Tree Shaking

### 為什麼

開發時我們定義了一些工具函式庫，或者引用第三方工具函式庫或組件庫。

如果沒有特殊處理的話我們打包時會引入整個庫，但是實際上可能我們可能只用上極小部分的功能。

這樣將整個庫都打包進來，體積就太大了。

### 是什麼

`Tree Shaking` 是一個術語，通常用於描述移除 JavaScript 中的沒有使用上的程式碼。

**注意：它依賴 `ES Module`。**

### 怎麼用

Webpack 已經默認開啟了這個功能，無需其他配置。

## Babel

### 為什麼

Babel 為編譯的每個檔案都插入了輔助程式碼，使程式碼體積過大！

Babel 對一些公共方法使用了非常小的輔助程式碼，比如 `_extend`。默認情况下會被添加到每一個需要它的檔案中。

你可以將這些輔助程式碼作為一個獨立模組，來避免重複引入。

### 是什麼

`@babel/plugin-transform-runtime`: 禁用了 Babel 自動對每個檔案的 runtime 注入，而是引入 `@babel/plugin-transform-runtime` 並且使所有輔助程式碼從這裡引用。

### 怎麼用

1. 下載包

```
npm i @babel/plugin-transform-runtime -D
```

2. 配置

```js{90}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const threads = os.cpus().length;

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
            include: path.resolve(__dirname, "../src"),
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: threads,
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,
                  plugins: ["@babel/plugin-transform-runtime"], // 減少程式碼體積
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
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: threads,
      }),
    ]
  ],
  mode: "production",
  devtool: "source-map",
};
```

## Image Minimizer

### 為什麼

開發如果專案中引用了較多圖片，那麼圖片體積會比較大，將來請求速度比較慢。

我們可以對圖片進行壓縮，減少圖片體積。

**注意：如果專案中圖片都是線上連結，那麼就不需要了。本地專案靜態圖片才需要進行壓縮。**

### 是什麼

`image-minimizer-webpack-plugin`: 用來壓縮圖片的插件

### 怎麼用

1. 下載包

```
npm i image-minimizer-webpack-plugin imagemin -D
```

還有剩下包需要下載，有兩種模式：

- 無損壓縮

```
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

- 有損壓縮

```
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
```

> [有損/無損壓縮的區別](https://baike.baidu.com/item/%E6%97%A0%E6%8D%9F%E3%80%81%E6%9C%89%E6%8D%9F%E5%8E%8B%E7%BC%A9)

2. 配置

我們以無損壓縮配置為例：

```js{8,129-156}
const os = require("os");
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const threads = os.cpus().length;

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
            test: /\.(png|jpe?g|gif|svg)$/,
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
            include: path.resolve(__dirname, "../src"),
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: threads,
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  cacheCompression: false, 
                  plugins: ["@babel/plugin-transform-runtime"],
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
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads,
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
  },
  mode: "production",
  devtool: "source-map",
};
```

3. 如果打包時會出現報錯：

```
Error: Error with 'src\images\1.jpeg': '"C:\Users\86176\Desktop\webpack\webpack_code\node_modules\jpegtran-bin\vendor\jpegtran.exe"'
Error with 'src\images\3.gif': spawn C:\Users\86176\Desktop\webpack\webpack_code\node_modules\optipng-bin\vendor\optipng.exe ENOENT
```

我們需要安装兩個檔案到 node_modules 中才能解決, 檔案可以從課件中找到：

- jpegtran.exe

需要複製到 `node_modules\jpegtran-bin\vendor` 下面

> [jpegtran 官網](http://jpegclub.org/jpegtran/)

- optipng.exe

需要複製到 `node_modules\optipng-bin\vendor` 下面

> [OptiPNG 官網](http://optipng.sourceforge.net/)

