# 提升開發體驗

## SourceMap

### 為什麼

開發時我們運行的程式碼是經過 webpack 編譯後的，例如下面這個樣子：

```js
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/less/index.less":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/less/index.less ***!
  \**********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \".box2 {\\n  width: 100px;\\n  height: 100px;\\n  background-color: deeppink;\\n}\\n\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://webpack5/./src/less/index.less?./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js");

/***/ }),
// 其他省略
```

所有 css 和 js 合併成了一支檔案，並且多了其他程式碼。此時如果程式碼運行出錯那麼提示程式碼錯誤位置我們是看不懂的。一旦將來開發程式碼檔案很多，那麼很難去發現錯誤出現在哪裡。

所以我們需要更加準確的錯誤提示，來幫助我們更好的開發程式碼。

### 是什麼

SourceMap（原始碼映射）是一個用來生成原始碼與編譯後程式碼一一映射的檔案的方案。

它會生成一個 xxx.map 檔案，裡面包含原始碼和編譯後程式碼每一行、每一列的映射關係。當編譯後程式碼出錯了，會通過 xxx.map 檔案，從編譯後程式碼出錯位置找到映射後原始碼出錯位置，從而讓瀏覽器提示原始碼檔案出錯位置，幫助我們更快的找到錯誤根源。

### 怎麼用

通過查看[Webpack DevTool 文檔](https://webpack.docschina.org/configuration/devtool/)可知，SourceMap 的值有很多種情況.

但實際開發時我們只需要關注兩種情況即可：

- 開發模式：`cheap-module-source-map`

  - 優點：打包編譯速度快，只包含行映射
  - 缺點：沒有列映射

```js
module.exports = {
  // 其他省略
  mode: "development",
  devtool: "cheap-module-source-map",
};
```

- 生產模式：`source-map`
  - 優點：包含行/列映射
  - 缺點：打包編譯速度更慢

```js
module.exports = {
  // 其他省略
  mode: "production",
  devtool: "source-map",
};
```


