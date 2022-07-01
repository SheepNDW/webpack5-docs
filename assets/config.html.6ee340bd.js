import{_ as n,c as s}from"./app.623b0f40.js";const a={},p=s(`<h1 id="\u57FA\u672C\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u57FA\u672C\u914D\u7F6E" aria-hidden="true">#</a> \u57FA\u672C\u914D\u7F6E</h1><p>\u5728\u958B\u59CB\u4F7F\u7528 <code>Webpack</code> \u4E4B\u524D\uFF0C\u6211\u5011\u9700\u8981\u5C0D <code>Webpack</code> \u7684\u914D\u7F6E\u6709\u4E00\u5B9A\u7684\u8A8D\u8B58\u3002</p><h2 id="_5-\u5927\u6838\u5FC3\u6982\u5FF5" tabindex="-1"><a class="header-anchor" href="#_5-\u5927\u6838\u5FC3\u6982\u5FF5" aria-hidden="true">#</a> 5 \u5927\u6838\u5FC3\u6982\u5FF5</h2><ol><li>entry\uFF08\u5165\u53E3\uFF09</li></ol><p>\u6307\u793A Webpack \u5F9E\u54EA\u500B\u6A94\u6848\u958B\u59CB\u6253\u5305</p><ol start="2"><li>output\uFF08\u8F38\u51FA\uFF09</li></ol><p>\u6307\u793A Webpack \u6253\u5305\u5B8C\u7684\u6A94\u6848\u8F38\u51FA\u5230\u54EA\u88E1\u53BB\uFF0C\u5982\u4F55\u547D\u540D\u7B49</p><ol start="3"><li>loader\uFF08\u52A0\u8F09\u5668\uFF09</li></ol><p>webpack \u672C\u8EAB\u53EA\u80FD\u8655\u7406 js\u3001json \u7B49\u8CC7\u6E90\uFF0C\u5176\u4ED6\u8CC7\u6E90\u9700\u8981\u501F\u52A9 loader\uFF0CWebpack \u624D\u80FD\u89E3\u6790</p><ol start="4"><li>plugins\uFF08\u63D2\u4EF6\uFF09</li></ol><p>\u64F4\u5C55 Webpack \u7684\u529F\u80FD</p><ol start="5"><li>mode\uFF08\u6A21\u5F0F\uFF09</li></ol><p>\u4E3B\u8981\u7531\u5169\u7A2E\u6A21\u5F0F\uFF1A</p><ul><li>\u958B\u767C\u6A21\u5F0F\uFF1Adevelopment</li><li>\u751F\u7522\u6A21\u5F0F\uFF1Aproduction</li></ul><h2 id="\u6E96\u5099-webpack-\u914D\u7F6E\u6A94\u6848" tabindex="-1"><a class="header-anchor" href="#\u6E96\u5099-webpack-\u914D\u7F6E\u6A94\u6848" aria-hidden="true">#</a> \u6E96\u5099 Webpack \u914D\u7F6E\u6A94\u6848</h2><p>\u5728\u5C08\u6848\u6839\u76EE\u9304\u4E0B\u65B0\u5EFA\u6A94\u6848\uFF1A<code>webpack.config.js</code></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u5165\u53E3</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
  <span class="token comment">// \u8F38\u51FA</span>
  <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// \u52A0\u8F09\u5668</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// \u63D2\u4EF6</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// \u6A21\u5F0F</span>
  <span class="token literal-property property">mode</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Webpack \u662F\u57FA\u65BC Node.js \u904B\u884C\u7684\uFF0C\u6240\u4EE5\u63A1\u7528 CommonJS \u6A21\u7D44\u5316\u898F\u7BC4</p><h2 id="\u4FEE\u6539\u914D\u7F6E\u6A94\u6848" tabindex="-1"><a class="header-anchor" href="#\u4FEE\u6539\u914D\u7F6E\u6A94\u6848" aria-hidden="true">#</a> \u4FEE\u6539\u914D\u7F6E\u6A94\u6848</h2><ol><li>\u914D\u7F6E\u6A94\u6848</li></ol><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// Node.js\u7684\u6838\u5FC3\u6A21\u7D44\uFF0C\u5C08\u9580\u7528\u4F86\u8655\u7406\u6A94\u6848\u8DEF\u5F91</span>
<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;path&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u5165\u53E3</span>
  <span class="token comment">// \u76F8\u5C0D\u8DEF\u5F91\u548C\u7D55\u5C0D\u8DEF\u5F91\u90FD\u884C</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token string">&quot;./src/main.js&quot;</span><span class="token punctuation">,</span>
  <span class="token comment">// \u8F38\u51FA</span>
  <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// path: \u6A94\u6848\u8F38\u51FA\u76EE\u9304\uFF0C\u5FC5\u987B\u662F\u7D55\u5C0D\u8DEF\u5F91</span>
    <span class="token comment">// path.resolve()\u65B9\u6CD5\u8FD4\u56DE\u4E00\u4E2A\u7D55\u5C0D\u8DEF\u5F91</span>
    <span class="token comment">// __dirname \u7576\u524D\u6A94\u6848\u7684\u8CC7\u6599\u593E\u7D55\u5C0D\u8DEF\u5F91</span>
    <span class="token literal-property property">path</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&quot;dist&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// filename: \u8F38\u51FA\u6A94\u6848\u540D</span>
    <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">&quot;main.js&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// \u52A0\u8F09\u5668</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// \u63D2\u4EF6</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// \u6A21\u5F0F</span>
  <span class="token literal-property property">mode</span><span class="token operator">:</span> <span class="token string">&quot;development&quot;</span><span class="token punctuation">,</span> <span class="token comment">// \u958B\u767C\u6A21\u5F0F</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><ol start="2"><li>\u904B\u884C\u6307\u4EE4</li></ol><div class="language-text ext-text"><pre class="language-text"><code>npx webpack
</code></pre></div><p>\u6B64\u6642\u529F\u80FD\u548C\u4E4B\u524D\u4E00\u6A23\uFF0C\u4E5F\u4E0D\u80FD\u8655\u7406\u6A23\u5F0F\u8CC7\u6E90</p><h2 id="\u5C0F\u7D50" tabindex="-1"><a class="header-anchor" href="#\u5C0F\u7D50" aria-hidden="true">#</a> \u5C0F\u7D50</h2><p>Webpack \u5C07\u4F86\u90FD\u901A\u904E <code>webpack.config.js</code> \u6A94\u6848\u9032\u884C\u914D\u7F6E\uFF0C\u4F86\u589E\u5F37 Webpack \u7684\u529F\u80FD</p><p>\u6211\u5011\u5F8C\u9762\u6703\u4EE5\u5169\u500B\u6A21\u5F0F\u4F86\u5206\u522B\u642D\u5EFA Webpack \u7684\u914D\u7F6E\uFF0C\u5148\u9032\u884C\u958B\u767C\u6A21\u5F0F\uFF0C\u518D\u5B8C\u6210\u751F\u7522\u6A21\u5F0F</p>`,27);function e(t,o){return p}var c=n(a,[["render",e],["__file","config.html.vue"]]);export{c as default};