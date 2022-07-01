# Loader 原理

## loader 概念

幫助 webpack 將不同類型的檔案轉換為 webpack 可識別的模組。

## loader 執行順序

1. 分類

- pre： 前置 loader
- normal： 普通 loader
- inline： 内聯 loader
- post： 後置 loader

2. 執行順序

- 4 類 loader 的執行優先級為：`pre > normal > inline > post` 。
- 相同優先級的 loader 執行順序為：`從右到左，從下到上`。

例如：

```js
// 此時loader執行順序：loader3 - loader2 - loader1
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "loader1",
    },
    {
      test: /\.js$/,
      loader: "loader2",
    },
    {
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
```

```js
// 此時loader執行順序：loader1 - loader2 - loader3
module: {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "loader1",
    },
    {
      // 沒有enforce就是normal
      test: /\.js$/,
      loader: "loader2",
    },
    {
      enforce: "post",
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
```

3. 使用 loader 的方式

- 配置方式：在 `webpack.config.js` 檔案中指定 loader。（pre、normal、post loader）
- 内聯方式：在每個 `import` 語句中顯式指定 loader。（inline loader）

4. inline loader

用法：`import Styles from 'style-loader!css-loader?modules!./styles.css';`

含義：

- 使用 `css-loader` 和 `style-loader` 處理 `styles.css` 檔案
- 通過 `!` 將資源中的 loader 分開

`inline loader` 可以通過添加不同前缀，跳過其他類型 loader。

- `!` 跳過 normal loader。

`import Styles from '!style-loader!css-loader?modules!./styles.css';`

- `-!` 跳過 pre 和 normal loader。

`import Styles from '-!style-loader!css-loader?modules!./styles.css';`

- `!!` 跳過 pre、 normal 和 post loader。

`import Styles from '!!style-loader!css-loader?modules!./styles.css';`

## 開發一個 loader

### 1. 最簡單的 loader

```js
// loaders/loader1.js
module.exports = function loader1(content) {
  console.log("hello loader");
  return content;
};
```

它接受要處理的源碼作為參數，輸出轉換後的 js 程式碼。

### 2. loader 接受的參數

- `content` 源檔案的内容
- `map` SourceMap 資料
- `meta` 資料，可以是任何内容

## loader 分類

### 1. 同步 loader

```js
module.exports = function (content, map, meta) {
  return content;
};
```

`this.callback` 方法則更靈活，因為它允許傳遞多個參數，而不僅僅是 `content`。

```js
module.exports = function (content, map, meta) {
  // 傳遞map，让source-map不中斷
  // 傳遞meta，让下一個loader接收到其他參數
  this.callback(null, content, map, meta);
  return; // 當調用 callback() 函式時，總是返回 undefined
};
```

### 2. 異步 loader

```js
module.exports = function (content, map, meta) {
  const callback = this.async();
  // 進行異步操作
  setTimeout(() => {
    callback(null, result, map, meta);
  }, 1000);
};
```

> 由於同步計算過於耗時，在 Node.js 這樣的單執行緒環境下進行此操作並不是好的方案，我們建議盡可能地使你的 loader 異步化。但如果計算量很小，同步 loader 也是可以的。

### 3. Raw Loader

默認情況下，資源檔案會被轉化為 UTF-8 字符串，然後傳给 loader。通過設置 raw 為 true，loader 可以接收原始的 Buffer。

```js
module.exports = function (content) {
  // content是一個Buffer資料
  return content;
};
module.exports.raw = true; // 開啟 Raw Loader
```

### 4. Pitching Loader

```js
module.exports = function (content) {
  return content;
};
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log("do somethings");
};
```

webpack 會先從左到右執行 loader 鏈中的每個 loader 上的 pitch 方法（如果有），然後再從右到左執行 loader 鏈中的每個 loader 上的普通 loader 方法。

![loader執行流程](/imgs/source/loader1.png)

在這個過程中如果任何 pitch 有返回值，則 loader 鏈被阻斷。webpack 會跳過後面所有的的 pitch 和 loader，直接進入上一個 loader 。

![loader執行流程](/imgs/source/loader2.png)

## loader API

| 方法名                  | 含義                                       | 用法                                           |
| ----------------------- | ------------------------------------------ | ---------------------------------------------- |
| this.async              | 異步回調 loader。返回 this.callback        | const callback = this.async()                  |
| this.callback           | 可以同步或者異步調用的並返回多個結果的函式 | this.callback(err, content, sourceMap?, meta?) |
| this.getOptions(schema) | 獲取 loader 的 options                     | this.getOptions(schema)                        |
| this.emitFile           | 產生一個檔案                               | this.emitFile(name, content, sourceMap)        |
| this.utils.contextify   | 返回一個相對路徑                           | this.utils.contextify(context, request)        |
| this.utils.absolutify   | 返回一個絕對路徑                           | this.utils.absolutify(context, request)        |

> 更多文檔，請查閱 [webpack 官方 loader api 文檔](https://webpack.docschina.org/api/loaders/#the-loader-context)

## 手寫 clean-log-loader

作用：用來清理 js 程式碼中的`console.log`

```js
// loaders/clean-log-loader.js
module.exports = function cleanLogLoader(content) {
  // 將console.log替換為空
  return content.replace(/console\.log\(.*\);?/g, "");
};
```

## 手寫 banner-loader

作用：给 js 程式碼添加文本註釋

- loaders/banner-loader/index.js

```js
const schema = require("./schema.json");

module.exports = function (content) {
  // 獲取loader的options，同時對options内容進行驗正
  // schema是options的驗正規則（符合 JSON schema 規則）
  const options = this.getOptions(schema);

  const prefix = `
    /*
    * Author: ${options.author}
    */
  `;

  return `${prefix} \n ${content}`;
};
```

- loaders/banner-loader/schema.json

```json
{
  "type": "object",
  "properties": {
    "author": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

## 手寫 babel-loader

作用：編譯 js 程式碼，將 ES6+語法編譯成 ES5-語法。

- 下載依赖

```
npm i @babel/core @babel/preset-env -D
```

- loaders/babel-loader/index.js

```js
const schema = require("./schema.json");
const babel = require("@babel/core");

module.exports = function (content) {
  const options = this.getOptions(schema);
  // 使用異步loader
  const callback = this.async();
  // 使用babel對js程式碼進行編譯
  babel.transform(content, options, function (err, result) {
    callback(err, result.code);
  });
};
```

- loaders/banner-loader/schema.json

```json
{
  "type": "object",
  "properties": {
    "presets": {
      "type": "array"
    }
  },
  "additionalProperties": true
}
```

## 手寫 file-loader

作用：將檔案原封不動輸出出去

- 下載包

```
npm i loader-utils -D
```

- loaders/file-loader.js

```js
const loaderUtils = require("loader-utils");

function fileLoader(content) {
  // 根據檔案内容生產一個新的檔案名稱
  const filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content,
  });
  // 輸出檔案
  this.emitFile(filename, content);
  // 暴露出去，给js引用。
  // 記得加上''
  return `export default '${filename}'`;
}

// loader 解決的是二進制的内容
// 圖片是 Buffer 資料
fileLoader.raw = true;

module.exports = fileLoader;
```

- loader 配置

```js
{
  test: /\.(png|jpe?g|gif)$/,
  loader: "./loaders/file-loader.js",
  type: "javascript/auto", // 解決圖片重複打包問題
},
```

## 手寫 style-loader

作用：動態創建 style 標籤，插入 js 中的樣式程式碼，使樣式生效。

- loaders/style-loader.js

```js
const styleLoader = () => {};

styleLoader.pitch = function (remainingRequest) {
  /*
    remainingRequest: C:\Users\86176\Desktop\source\node_modules\css-loader\dist\cjs.js!C:\Users\86176\Desktop\source\src\css\index.css
      這里是inline loader用法，代表後面还有一個css-loader等待處理

    最終我們需要將remainingRequest中的路徑轉化成相對路徑，webpack才能處理
      希望得到：../../node_modules/css-loader/dist/cjs.js!./index.css

    所以：需要將絕對路徑轉化成相對路徑
    要求：
      1. 必須是相對路徑
      2. 相對路徑必須以 ./ 或 ../ 開頭
      3. 相對路徑的路徑分隔符必須是 / ，不能是 \
  */
  const relativeRequest = remainingRequest
    .split("!")
    .map((part) => {
      // 將路徑轉化為相對路徑
      const relativePath = this.utils.contextify(this.context, part);
      return relativePath;
    })
    .join("!");

  /*
    !!${relativeRequest} 
      relativeRequest：../../node_modules/css-loader/dist/cjs.js!./index.css
      relativeRequest是inline loader用法，代表要處理的index.css資源, 使用css-loader處理
      !!代表禁用所有配置的loader，只使用inline loader。（也就是外面我們style-loader和css-loader）,它們被禁用了，只是用我們指定的inline loader，也就是css-loader

    import style from "!!${relativeRequest}"
      引入css-loader處理後的css檔案
      為什么需要css-loader處理css檔案，不是我們直接讀取css檔案使用呢？
      因為可能存在@import導入css語法，這些語法就要通過css-loader解析才能變成一個css檔案，否則我們引入的css資源會缺少
    const styleEl = document.createElement('style')
      動態創建style標籤
    styleEl.innerHTML = style
      將style標籤内容設置為處理後的css程式碼
    document.head.appendChild(styleEl)
      添加到head中生效
  */
  const script = `
    import style from "!!${relativeRequest}"
    const styleEl = document.createElement('style')
    styleEl.innerHTML = style
    document.head.appendChild(styleEl)
  `;

  // style-loader是第一個loader, 由於return導致熔斷，所以其他loader不執行了（不管是normal还是pitch）
  return script;
};

module.exports = styleLoader;
```
