# 處理 js 資源

有人可能會問，js 資源 Webpack 不能已經處理了嗎，為什麼我們還要處理呢？

原因是 Webpack 對 js 處理是有限的，只能編譯 js 中 ES 模組化語法，不能編譯其他語法，導致 js 不能在 IE 等瀏覽器運行，所以我們希望做一些兼容性處理。

其次開發中，團隊對程式碼格式是有嚴格要求的，我們不能由肉眼去檢測程式碼格式，需要使用專業的工具來檢測。

- 針對 js 兼容性處理，我們使用 Babel 來完成
- 針對程式碼格式，我們使用 Eslint 來完成

我們先完成 Eslint，檢測程式碼格式無誤後，再由 Babel 做程式碼兼容性處理

## Eslint

可組裝的 JavaScript 和 JSX 檢查工具。

這句話意思就是：它是用來檢測 js 和 jsx 語法的工具，可以配置各項功能

我們使用 Eslint，關鍵是寫 Eslint 配置文件，裡面寫上各種 rules 規則，將來運行 Eslint 時就會以寫的規則對程式碼進行檢查

### 1. 設定檔

設定檔由很多種寫法：

- `.eslintrc.*`：新建檔案，位於項目根目錄
  - `.eslintrc`
  - `.eslintrc.js`
  - `.eslintrc.json`
  - 區别在於配置格式不一樣
- `package.json` 中 `eslintConfig`：不需要創建檔案，在原有檔案基礎上寫

ESLint 會查找和自動讀取它們，所以以上設定檔只需要存在一個即可

### 2. 具體配置

我們以 `.eslintrc.js` 設定檔為例：

```js
module.exports = {
  // 解析選項
  parserOptions: {},
  // 具體檢查規則
  rules: {},
  // 繼承其他規則
  extends: [],
  // ...
  // 其他規則詳見：https://eslint.bootcss.com/docs/user-guide/configuring
};
```

1. parserOptions 解析選項

```js
parserOptions: {
  ecmaVersion: 6, // ES 語法版本
  sourceType: "module", // ES 模組
  ecmaFeatures: { // ES 其他特性
    jsx: true // 如果是 React 項目，就需要開啟 jsx 語法
  }
}
```

2. rules 具體規則

- `"off"` 或 `0` - 關閉規則
- `"warn"` 或 `1` - 開啟規則，使用警告級別的錯誤：`warn` (不會導致程序退出)
- `"error"` 或 `2` - 開啟規則，使用錯誤級別的錯誤：`error` (當被觸發的時候，程序會退出)

```js
rules: {
  semi: "error", // 禁止使用分號
  'array-callback-return': 'warn', // 強制陣列方法的回調函式中有 return 語句，否則警告
  'default-case': [
    'warn', // 要求 switch 語句中有 default 分支，否則警告
    { commentPattern: '^no default$' } // 允許在最後註釋 no default, 就不會有警告了
  ],
  eqeqeq: [
    'warn', // 強制使用 === 和 !==，否則警告
    'smart' // https://eslint.bootcss.com/docs/rules/eqeqeq#smart 除了少數情況下不會有警告
  ],
}
```

更多規則詳見：[規則文檔](https://eslint.bootcss.com/docs/rules/)

3. extends 繼承

開發中一點點寫 rules 規則太費勁了，所以有更好的辦法，繼承現有的規則。

現有以下較為有名的規則：

- [Eslint 官方的規則](https://eslint.bootcss.com/docs/rules/)：`eslint:recommended`
- [Vue Cli 官方的規則](https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-plugin-eslint)：`plugin:vue/essential`
- [React Cli 官方的規則](https://github.com/facebook/create-react-app/tree/main/packages/eslint-config-react-app)：`react-app`

```js
// 例如在React項目中，我們可以這樣寫配置
module.exports = {
  extends: ["react-app"],
  rules: {
    // 我們的規則會覆蓋掉 react-app 的規則
    // 所以想要修改規則直接改就是了
    eqeqeq: ["warn", "smart"],
  },
};
```

### 3. 在 Webpack 中使用

1. 下載包

```:no-line-numbers
npm i eslint-webpack-plugin eslint -D
```

2. 定義 Eslint 設定檔

- .eslintrc.js

```js
module.exports = {
  // 繼承 Eslint 規則
  extends: ["eslint:recommended"],
  env: {
    node: true, // 啟用 node 中全域變數
    browser: true, // 啟用瀏覽器中全域變數
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    "no-var": 2, // 不能使用 var 定義變數
  },
};
```

3. 修改 js 檔案程式碼

- main.js

```js{11-14}
import count from "./js/count";
import sum from "./js/sum";
// 引入資源，Webpack才會對其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

var result1 = count(2, 1);
console.log(result1);
var result2 = sum(1, 2, 3, 4);
console.log(result2);
```

1. 配置

- webpack.config.js

```js{2,58-61}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "static/js/main.js", // 將 js 檔案輸出到 static/js 目錄中
    clean: true, // 自動將上次打包目錄資源清空
  },
  module: {
    rules: [
      {
        // 用來匹配 .css 结尾的檔案
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
            maxSize: 10 * 1024, // 小於 10kb 的圖片會被 base64 處理
          },
        },
        generator: {
          // 將圖片檔輸出到 static/imgs 目錄中
          // 將圖片檔命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的檔案擴展名
          // [query]: 添加之前的 query 參數
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
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查檔案的根目錄
      context: path.resolve(__dirname, "src"),
    }),
  ],
  mode: "development",
};
```

5. 運行指令

```:no-line-numbers
npx webpack
```

在控制台查看 Eslint 檢查效果

### 4. VSCode Eslint 套件

打開 VSCode，下載 Eslint 套件，即可不用編譯就能看到錯誤，可以提前解决

但是此時就會對項目所有檔案默認進行 Eslint 檢查了，我們 dist 目錄下的打包後檔案就會報錯。但是我們只需要檢查 src 下面的檔案，不需要檢查 dist 下面的檔案。

所以可以使用 Eslint 忽略檔案解决。在項目根目錄新建下面檔案:

- `.eslintignore`

```
# 忽略dist目錄下所有檔案
dist
```

## Babel

JavaScript 編譯器。

主要用於將 ES6 語法编寫的程式碼轉換為向後兼容的 JavaScript 語法，以便能够運行在當前和舊版本的瀏覽器或其他環境中

### 1. 設定檔

設定檔由很多種寫法：

- `babel.config.*`：新建檔案，位於項目根目錄
  - `babel.config.js`
  - `babel.config.json`
- `.babelrc.*`：新建檔案，位於項目根目錄
  - `.babelrc`
  - `.babelrc.js`
  - `.babelrc.json`
- `package.json` 中 `babel`：不需要創建檔案，在原有檔案基礎上寫

Babel 會查找和自動讀取它們，所以以上設定檔只需要存在一個即可

### 2. 具體配置

我們以 `babel.config.js` 設定檔為例：

```js
module.exports = {
  // 預設
  presets: [],
};
```

1. presets 預設

簡單理解：就是一組 Babel 插件, 擴展 Babel 功能

- `@babel/preset-env`: 一個智能預設，允許您使用最新的 JavaScript。
- `@babel/preset-react`：一個用來編譯 React jsx 語法的預設
- `@babel/preset-typescript`：一個用來編譯 TypeScript 語法的預設

### 3. 在 Webpack 中使用

1. 下載包

```:no-line-numbers
npm i babel-loader @babel/core @babel/preset-env -D
```

2. 定義 Babel 設定檔

- babel.config.js

```js
module.exports = {
  presets: ["@babel/preset-env"],
};
```

3. 修改 js 檔案程式碼

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
```

4. 配置

- webpack.config.js

```js{55-59}
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "static/js/main.js", 
    clean: true,
  },
  module: {
    rules: [
      {
        // 用來匹配 .css 结尾的檔案
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
            maxSize: 10 * 1024, // 小於 10kb 的圖片會被 base64 處理
          },
        },
        generator: {
          // 將圖片檔輸出到 static/imgs 目錄中
          // 將圖片檔命名 [hash:8][ext][query]
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
        exclude: /node_modules/, // 排除node_modules程式碼不編譯
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定檢查文件的根目錄
      context: path.resolve(__dirname, "src"),
    }),
  ],
  mode: "development",
};
```

5. 運行指令

```:no-line-numbers
npx webpack
```

打開打包後的 `dist/static/js/main.js` 檔案查看，會發現箭頭函式等 ES6 語法已經轉換了
