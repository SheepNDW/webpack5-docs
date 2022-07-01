# Css 處理

## 提取 Css 成單獨檔案

Css 檔案目前被打包到 js 檔案中，當 js 檔案加載時，會創建一個 style 標籤來生成樣式

這樣對於網站來說，會出現螢幕閃爍現象，用戶體驗不好

我們應該是單獨的 Css 檔案，通過 link 標籤加載性能才好

### 1. 下載包

```:no-line-numbers
npm i mini-css-extract-plugin -D
```

### 2. 配置

- webpack.prod.js

```js{4,17,21,25,29,64-68}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
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
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/main.css",
    }),
  ],
  mode: "production",
};
```

### 3. 運行指令

```:no-line-numbers
npm run build
```

## Css 兼容性處理

### 1. 下載包

```:no-line-numbers
npm i postcss-loader postcss postcss-preset-env -D
```

### 2. 配置

- webpack.prod.js

```js{20-29,37-46,55-64,73-82}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        test: /\.css$/,
        use: [
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
        ],
      },
      {
        test: /\.less$/,
        use: [
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
          "less-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
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
          "sass-loader",
        ],
      },
      {
        test: /\.styl$/,
        use: [
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
          "stylus-loader",
        ],
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
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/main.css",
    }),
  ],
  mode: "production",
};
```

### 3. 控制兼容性

我們可以在 `package.json` 檔案中添加 `browserslist` 來控制樣式的兼容性做到什麼程度。

```json
{
  // 其他省略
  "browserslist": ["ie >= 8"]
}
```

想要知道更多的 `browserslist` 配置，查看[browserslist 文檔](https://github.com/browserslist/browserslist)

以上為了測試兼容性所以設置兼容瀏覽器 ie8 以上。

實際開發中我們一般不考慮舊版本瀏覽器了，所以我們可以這樣設置：

```json
{
  // 其他省略
  "browserslist": ["last 2 version", "> 1%", "not dead"]
}
```

### 4. 合併配置

- webpack.prod.js

```js{6-23,36,40,44,48}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
    path: path.resolve(__dirname, "../dist"), 
    filename: "static/js/main.js",
    clean: true,
  },
  module: {
    rules: [
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
        exclude: /node_modules/, 
        loader: "babel-loader",
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
    // 提取css成單獨檔案
    new MiniCssExtractPlugin({
      // 定義輸出檔案名和目錄
      filename: "static/css/main.css",
    }),
  ],
  mode: "production",
};
```

### 5. 運行指令

```:no-line-numbers
npm run build
```

## Css 壓縮

### 1. 下載包

```:no-line-numbers
npm i css-minimizer-webpack-plugin -D
```

### 2. 配置

- webpack.prod.js

```js{5,87-88}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
    path: path.resolve(__dirname, "../dist"), 
    filename: "static/js/main.js",
    clean: true,
  },
  module: {
    rules: [
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
        exclude: /node_modules/, 
        loader: "babel-loader",
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
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    // css壓縮
    new CssMinimizerPlugin(),
  ],
  mode: "production",
};
```

### 3. 運行指令

```:no-line-numbers
npm run build
```
