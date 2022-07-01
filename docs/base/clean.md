# 自動清空上次打包資源

## 1. 配置

```js{8}
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "static/js/main.js",
    clean: true, // 自動將上次打包目錄資源清空
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
            maxSize: 40 * 1024,
          },
        },
        generator: {
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
    ],
  },
  plugins: [],
  mode: "development",
};
```

## 2. 運行指令

```:no-line-numbers
npx webpack
```

觀察 dist 目錄資源情況
