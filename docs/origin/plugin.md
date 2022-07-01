# Plugin 原理

## Plugin 的作用

通過插件我們可以擴展 webpack，加入自定的構建行為，使 webpack 可以執行更廣泛的任務，擁有更強的構建能力。

## Plugin 工作原理

> webpack 就像一條生產線，要經過一系列處理流程後才能將源檔案轉換成輸出結果。這條生產線上的每個處理流程的職責都是單一的，多個流程之間有存在依賴關係，只有完成當前處理後才能交給下一個流程去處理。
> 插件就像是一個插入到生產線中的一個功能，在特定的時機對生產線上的資源做處理。 webpack 通過 Tapable 來組織這條複雜的生產線。 webpack 在運行過程中會廣播事件，插件只需要監聽它所關心的事件，就能加入到這條生產線中，去改變生產線的運作。
> webpack 的事件流機制保證了插件的有序性，使得整個系統擴展性很好。
> ——「深入淺出 Webpack」

站在程式碼邏輯的角度就是：webpack 在編譯代碼過程中，會觸發一系列 `Tapable` 鉤子事件，插件所做的，就是找到相應的鉤子，往上面掛上自己的任務，也就是註冊事件，這樣，當 webpack 構建的時候，插件註冊的事件就會隨著鉤子的觸發而執行了。

## Webpack 内部的鉤子

### 什麼是鉤子

鉤子的本質就是：事件。為了方便我們直接介入和控制編譯過程，webpack 把編譯過程中觸發的各類關鍵事件封装成事件接口暴露了出來。這些接口被很形象地稱做：`hooks`（鉤子）。開發插件，離不開這些鉤子。

### Tapable

`Tapable` 為 webpack 提供了統一的插件接口（鉤子）類型定，它是 webpack 的核心功能库。webpack 中目前有十種 `hooks`，在 `Tapable` 原始碼中可以看到，他們是：

```js
// https://github.com/webpack/tapable/blob/master/lib/index.js
exports.SyncHook = require("./SyncHook");
exports.SyncBailHook = require("./SyncBailHook");
exports.SyncWaterfallHook = require("./SyncWaterfallHook");
exports.SyncLoopHook = require("./SyncLoopHook");
exports.AsyncParallelHook = require("./AsyncParallelHook");
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");
exports.AsyncSeriesHook = require("./AsyncSeriesHook");
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");
exports.AsyncSeriesLoopHook = require("./AsyncSeriesLoopHook");
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");
exports.HookMap = require("./HookMap");
exports.MultiHook = require("./MultiHook");
```

`Tapable` 還統一暴露了三個方法給插件，用於注入不同類型的自定構建行為：

- `tap`：可以註冊同步鉤子和異步鉤子。
- `tapAsync`：回調方式註冊異步鉤子。
- `tapPromise`：Promise 方式註冊異步鉤子。

## Plugin 建構物件

### Compiler

compiler 物件中保存著完整的 Webpack 環境配置，每次啟動 webpack 構建時它都是一個独一无二，仅仅會創建一次的物件。

這個物件會在首次啟動 Webpack 時創建，我們可以通過 compiler 物件上訪問到 Webapck 的主環境配置，比如 loader 、 plugin 等等配置信息。

它有以下主要屬性：

- `compiler.options` 可以訪問本次啟動 webpack 時候所有的配置檔案，包括但不限於 loaders 、 entry 、 output 、 plugin 等等完整配置信息。
- `compiler.inputFileSystem` 和 `compiler.outputFileSystem` 可以進行檔案操作，相當於 Nodejs 中 fs。
- `compiler.hooks` 可以註冊 tapable 的不同種類 Hook，從而可以在 compiler 生命週期中植入不同的邏輯。

> [compiler hooks 文檔](https://webpack.docschina.org/api/compiler-hooks/)

### Compilation

compilation 物件代表一次資源的構建，compilation 實例能夠訪問所有的模組和它們的依賴。

一個 compilation 物件會對構建依賴圖中所有模組，進行編譯。 在編譯階段，模組會被加载(load)、封存(seal)、優化(optimize)、 分塊(chunk)、哈希(hash)和重新創建(restore)。

它有以下主要屬性：

- `compilation.modules` 可以訪問所有模組，打包的每一個檔案都是一個模組。
- `compilation.chunks` chunk 即是多個 modules 组成而來的一個程式碼块。入口檔案引入的資源组成一個 chunk，通過程式碼分割的模組又是另外的 chunk。
- `compilation.assets` 可以訪問本次打包生成所有檔案的结果。
- `compilation.hooks` 可以註冊 tapable 的不同種類 Hook，用於在 compilation 編譯模組階段進行邏輯添加以及修改。

> [compilation hooks 文檔](https://webpack.docschina.org/api/compilation-hooks/)

### 生命週期简圖

![Webpack 插件生命週期](/imgs/source/plugin.jpg)

## 開發一個插件

### 最簡單的插件

- plugins/test-plugin.js

```js
class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor()");
  }
  // 1. webpack讀取配置時，new TestPlugin() ，會執行插件 constructor 方法
  // 2. webpack創建 compiler 物件
  // 3. 遍歷所有插件，調用插件的 apply 方法
  apply(compiler) {
    console.log("TestPlugin apply()");
  }
}

module.exports = TestPlugin;
```

### 註冊 hook

```js
class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor()");
  }
  // 1. webpack讀取配置時，new TestPlugin() ，會執行插件 constructor 方法
  // 2. webpack創建 compiler 物件
  // 3. 遍歷所有插件，調用插件的 apply 方法
  apply(compiler) {
    console.log("TestPlugin apply()");

    // 從文檔可知, compile hook 是 SyncHook, 也就是同步鉤子, 只能用tap註冊
    compiler.hooks.compile.tap("TestPlugin", (compilationParams) => {
      console.log("compiler.compile()");
    });

    // 從文檔可知, make 是 AsyncParallelHook, 也就是異步並行鉤子, 特點就是異步任務同時執行
    // 可以使用 tap、tapAsync、tapPromise 註冊。
    // 如果使用tap註冊的話，進行異步操作是不會等待異步操作執行完成的。
    compiler.hooks.make.tap("TestPlugin", (compilation) => {
      setTimeout(() => {
        console.log("compiler.make() 111");
      }, 2000);
    });

    // 使用tapAsync、tapPromise註冊，進行異步操作會等異步操作做完再繼續往下執行
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compiler.make() 222");
        // 必須調用
        callback();
      }, 1000);
    });

    compiler.hooks.make.tapPromise("TestPlugin", (compilation) => {
      console.log("compiler.make() 333");
      // 必須返回promise
      return new Promise((resolve) => {
        resolve();
      });
    });

    // 從文檔可知, emit 是 AsyncSeriesHook, 也就是異步串行鉤子，特點就是異步任務顺序執行
    compiler.hooks.emit.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compiler.emit() 111");
        callback();
      }, 3000);
    });

    compiler.hooks.emit.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compiler.emit() 222");
        callback();
      }, 2000);
    });

    compiler.hooks.emit.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compiler.emit() 333");
        callback();
      }, 1000);
    });
  }
}

module.exports = TestPlugin;
```

### 啟動調試

通過調試查看 `compiler` 和 `compilation` 物件數據情况。

1. package.json 配置指令

```json{5}
{
  "name": "source",
  "version": "1.0.0",
  "scripts": {
    "debug": "node --inspect-brk ./node_modules/webpack-cli/bin/cli.js"
  },
  "keywords": [],
  "author": "xiongjian",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.17.10",
    "@babel/preset-env": "^7.17.10",
    "css-loader": "^6.7.1",
    "loader-utils": "^3.2.0",
    "webpack": "^5.72.0",
    "webpack-cli": "^4.9.2"
  }
}
```

2. 運行指令

```
npm run debug
```

此時控制台輸出以下内容：

```
PS C:\Users\86176\Desktop\source> npm run debug

> source@1.0.0 debug
> node --inspect-brk ./node_modules/webpack-cli/bin/cli.js

Debugger listening on ws://127.0.0.1:9229/629ea097-7b52-4011-93a7-02f83c75c797
For help, see: https://nodejs.org/en/docs/inspecto
```

3. 打開 Chrome 瀏覽器，F12 打開瀏覽器調試控制台。

此時控制台會顯示一個綠色的圖標

![調試控制台](/imgs/source/debug.png)

4. 點擊綠色的圖標進入調試模式。

5. 在需要調試程式碼处用 `debugger` 打斷點，程式碼就會停止運行，從而調試查看數據情况。

## BannerWebpackPlugin

1. 作用：給打包輸出檔案添加註釋。

2. 開發思路:

- 需要打包輸出前添加註釋：需要使用 `compiler.hooks.emit` 鉤子, 它是打包輸出前觸發。
- 如何獲取打包輸出的資源？`compilation.assets` 可以獲取所有即將輸出的資源檔案。

3. 實現：

```js
// plugins/banner-webpack-plugin.js
class BannerWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // 需要處理檔案
    const extensions = ["js", "css"];

    // emit是異步串行鉤子
    compiler.hooks.emit.tapAsync("BannerWebpackPlugin", (compilation, callback) => {
      // compilation.assets包含所有即將輸出的資源
      // 通過 filter 只保留需要處理的檔案
      const assetPaths = Object.keys(compilation.assets).filter((path) => {
        const splitted = path.split(".");
        return extensions.includes(splitted[splitted.length - 1]);
      });

      assetPaths.forEach((assetPath) => {
        const asset = compilation.assets[assetPath];

        const source = `/*
* Author: ${this.options.author}
*/\n${asset.source()}`;

        // 覆蓋資源
        compilation.assets[assetPath] = {
          // 資源内容
          source() {
            return source;
          },
          // 資源大小
          size() {
            return source.length;
          },
        };
      });

      callback();
    });
  }
}

module.exports = BannerWebpackPlugin;
```

## CleanWebpackPlugin

1. 作用：在 webpack 打包輸出前將上次打包内容清空。

2. 開發思路：

- 如何在打包輸出前執行？需要使用 `compiler.hooks.emit` 鉤子, 它是打包輸出前觸發。
- 如何清空上次打包内容？
  - 獲取打包輸出目錄：通過 compiler 物件。
  - 通過檔案操作清空内容：通過 `compiler.outputFileSystem` 操作檔案。

3. 實現：

```js
// plugins/clean-webpack-plugin.js
class CleanWebpackPlugin {
  apply(compiler) {
    // 獲取操作檔案的物件
    const fs = compiler.outputFileSystem;
    // emit是異步串行鉤子
    compiler.hooks.emit.tapAsync("CleanWebpackPlugin", (compilation, callback) => {
      // 獲取輸出檔案目錄
      const outputPath = compiler.options.output.path;
      // 刪除目錄所有檔案
      const err = this.removeFiles(fs, outputPath);
      // 執行成功err為undefined，執行失敗err就是錯誤原因
      callback(err);
    });
  }

  removeFiles(fs, path) {
    try {
      // 讀取當前目錄下所有檔案
      const files = fs.readdirSync(path);

      // 遍歷檔案，刪除
      files.forEach((file) => {
        // 獲取檔案完整路径
        const filePath = `${path}/${file}`;
        // 分析檔案
        const fileStat = fs.statSync(filePath);
        // 判斷是否是資料夾
        if (fileStat.isDirectory()) {
          // 是資料夾需要递归遍歷刪除下面所有檔案
          this.removeFiles(fs, filePath);
        } else {
          // 不是資料夾就是檔案，直接刪除
          fs.unlinkSync(filePath);
        }
      });

      // 最後刪除當前目錄
      fs.rmdirSync(path);
    } catch (e) {
      // 將產生的錯誤返回出去
      return e;
    }
  }
}

module.exports = CleanWebpackPlugin;
```

## AnalyzeWebpackPlugin

1. 作用：分析 webpack 打包資源大小，並輸出分析檔案。
2. 開發思路:

- 在哪做? `compiler.hooks.emit`, 它是在打包輸出前觸發，我們需要分析資源大小同時添加上分析後的 md 檔案。

3. 實現：

```js
// plugins/analyze-webpack-plugin.js
class AnalyzeWebpackPlugin {
  apply(compiler) {
    // emit是異步串行鉤子
    compiler.hooks.emit.tap("AnalyzeWebpackPlugin", (compilation) => {
      // Object.entries將物件變成二維陣列。二維陣列中第一項值是key，第二項值是value
      const assets = Object.entries(compilation.assets);

      let source = "# 分析打包資源大小 \n| 名稱 | 大小 |\n| --- | --- |";

      assets.forEach(([filename, file]) => {
        source += `\n| ${filename} | ${file.size()} |`;
      });

      // 添加資源
      compilation.assets["analyze.md"] = {
        source() {
          return source;
        },
        size() {
          return source.length;
        },
      };
    });
  }
}

module.exports = AnalyzeWebpackPlugin;
```

## InlineChunkWebpackPlugin

1. 作用：webpack 打包生成的 runtime 檔案太小了，額外發送請求性能不好，所以需要將其内聯到 js 中，從而減少請求數量。
2. 開發思路:

- 我們需要借助 `html-webpack-plugin` 來實現
  - 在 `html-webpack-plugin` 輸出 index.html 前將内聯 runtime 注入進去
  - 刪除多餘的 runtime 檔案
- 如何操作 `html-webpack-plugin`？[官方文檔](https://github.com/jantimon/html-webpack-plugin/#afteremit-hook)

3. 實現：

```js
// plugins/inline-chunk-webpack-plugin.js
const HtmlWebpackPlugin = require("safe-require")("html-webpack-plugin");

class InlineChunkWebpackPlugin {
  constructor(tests) {
    this.tests = tests;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("InlineChunkWebpackPlugin", (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      hooks.alterAssetTagGroups.tap("InlineChunkWebpackPlugin", (assets) => {
        assets.headTags = this.getInlineTag(assets.headTags, compilation.assets);
        assets.bodyTags = this.getInlineTag(assets.bodyTags, compilation.assets);
      });

      hooks.afterEmit.tap("InlineChunkHtmlPlugin", () => {
        Object.keys(compilation.assets).forEach((assetName) => {
          if (this.tests.some((test) => assetName.match(test))) {
            delete compilation.assets[assetName];
          }
        });
      });
    });
  }

  getInlineTag(tags, assets) {
    return tags.map((tag) => {
      if (tag.tagName !== "script") return tag;

      const scriptName = tag.attributes.src;

      if (!this.tests.some((test) => scriptName.match(test))) return tag;

      return { tagName: "script", innerHTML: assets[scriptName].source(), closeTag: true };
    });
  }
}

module.exports = InlineChunkWebpackPlugin;
```
