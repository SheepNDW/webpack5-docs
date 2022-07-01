# 基本使用

**`Webpack` 是一個靜態資源打包工具。**

它會以一個或多個檔案作為打包的入口，將我們整個專案所有檔案編譯組合成一個或多個檔案輸出出去。

輸出的檔案就是編譯好的檔案，就可以在瀏覽器端運行了。

我們將 `Webpack` 輸出的檔案叫做 `bundle`。

## 功能介绍

Webpack 本身功能是有限的:

- 開發模式：僅能編譯 JS 中的 `ES Module` 語法
- 生產模式：能編譯 JS 中的 `ES Module` 語法，還能壓縮 JS 程式碼

## 開始使用

### 1. 資源目錄

```
webpack_code # 專案根目錄（所有指令必须在這個目錄運行）
    └── src # 專案源碼目錄
        ├── js # js檔案目錄
        │   ├── count.js
        │   └── sum.js
        └── main.js # 專案主檔案
```

### 2. 創建檔案

- count.js

```js
export default function count(x, y) {
  return x - y;
}
```

- sum.js

```js
export default function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}
```

- main.js

```js
import count from "./js/count";
import sum from "./js/sum";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));
```

### 3. 下載依賴

打開終端，來到專案根目錄。運行以下指令：

- 初始化`package.json`

```
npm init -y
```

此時會生成一個基礎的 `package.json` 檔案。

**需要注意的是 `package.json` 中 `name` 字段不能叫做 `webpack`, 否则下一步會報錯**

- 下載依賴

```
npm i webpack webpack-cli -D
```

### 4. 啟用 Webpack

- 開發模式

```
npx webpack ./src/main.js --mode=development
```

- 生產模式

```
npx webpack ./src/main.js --mode=production
```

`npx webpack`: 是用來運行本地安裝 `Webpack` 包的。

`./src/main.js`: 指定 `Webpack` 從 `main.js` 檔案開始打包，不但會打包 `main.js`，還會將其依賴也一起打包進來。

`--mode=xxx`：指定模式（環境）。

### 5. 觀察輸出檔案

預設 `Webpack` 會將檔案打包輸出到 `dist` 目錄下，我們查看 `dist` 目錄下檔案情況就好了

## 小結

`Webpack` 本身功能比較少，只能處理 `js` 資源，一旦遇到 `css` 等其他資源就會報錯。

所以我們學習 `Webpack`，就是主要學習如何處理其他資源。
