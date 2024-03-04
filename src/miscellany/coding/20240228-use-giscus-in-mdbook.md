# 在 mdBook 中使用 giscus 服务

<p class="archive-time">archive time: 2024-02-28</p>

<p class="sp-comment">把博客从 Hugo 迁移到了 mdBook</p>

[[toc]]

## 缘起

之前我是用 Hugo + MemE 主题作为我博客的配置，基本还算可以，要什么功能基本都有

那我为什么要换到这个基本手动的 mdBook 呢？

主要还是 Hugo 依赖于 Go 语言，而且其主题配置太复杂

Hugo 的主题没有默认，但自己徒手写一个不现实，用别人的不踏实

特别是自己需要用上一些特殊的东西，还需要找各种办法来修改主题

如果哪里出现了一些 Bug，连排错的思路都没有，只能一个文件一个文件的翻，猜测其作用

相比之下，mdBook 虽然简陋，但是基本款就能用，配置也简单，一个 `book.toml` 就解决了

需要特殊功能就自己加到 `theme/index.hbs` 文件即可，最多再附上一个 `.css` 或者 `.js`

一些常见的功能也已经有第三方作者实现，例如支持 KaTeX，可以使用 `mdbook-katex`

基于上述原因，我最后迁移到了 mdBook 上了

## 什么是 giscus

giscus 是一个轻量的评论系统，基于 GitHub 的 Discussions 系统

giscus 借鉴了其前辈 utterances，一个基于 GitHub 的 issues 系统的评论系统

总之，如果你的仓库启用了 Discussions 功能，那么你就可以使用 giscus 来实现评论功能

### 为什么不选用 utterances

在 giscus 出来之前，我就在用 utterances

但是 utterances 使用的是 issues，没有 Discussions 那样方便的追评功能

而且 issues 本身也并不是日常讨论区[^1]，所以我在 giscus 出来之后就立马替换掉了 utterances

## 如何配置

主要修改了三个地方，添加了 `theme/giscus.js` 文件，用于 giscus 相关功能维护，包括自动切换颜色

另两个地方就是修改了 `theme/index.hbs` 和 `theme/book.js`

对于 `theme/index.hbs`，只要找到 `{{{ content }}}` 这个内容即可

我在下面添加了一个 `<div>` 用于管理 giscus

```html
<main>
  {{{content}}}
  <!-- Giscus -->
  <div class="comments" style="width: 96%;"></div>
</main>
```

对于 `theme/book.js` 只需要找到 `localStorage.setItem("mdbook-theme", theme);` 即可

```javascript
if (store) {
  try {
    localStorage.setItem("mdbook-theme", theme);
    setGiscusTheme();
  } catch (e) {}
}
```

而新增的 `theme/giscus.js` 文件内容如下：

```javascript
const getStoredTheme = () => {
  const mbt = localStorage.getItem("mdbook-theme");
  if (
    mbt === null &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark_tritanopia";
  }
  return ["coal", "navy", "ayu"].includes(mbt)
    ? "dark_tritanopia"
    : "light_tritanopia";
};

const setGiscusTheme = () => {
  const sendMessage = (message) => {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow.postMessage(
        { giscus: message },
        "https://giscus.app"
      );
    }
  };
  sendMessage({ setConfig: { theme: getStoredTheme() } });
};

document.addEventListener("DOMContentLoaded", () => {
  const giscusAttributes = {
    // ...
    // 这一部分是 giscus 配置
    // 根据自己实际情况修改
    src: "https://giscus.app/client.js",
    "data-repo": "github/repo/path",
    "data-repo-id": "repo id",
    "data-category": "category",
    "data-category-id": "category id",
    "data-mapping": "pathname",
    "data-strict": "0",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": getStoredTheme(),
    "data-lang": "zh-CN",
    "data-loading": "lazy",
    crossorigin: "anonymous",
    async: "",
  };
  const giscusScript = document.createElement("script");
  Object.entries(giscusAttributes).forEach(([key, value]) =>
    giscusScript.setAttribute(key, value)
  );
  document.querySelector(".comments").appendChild(giscusScript);
});
```

最后不要忘记修改 `book.toml`

```toml
[output.html]
# ...
additional-js = ["theme/giscus.js"]
```

完成如上步骤之后，就可以在 mdBook 中用上 giscus 了

## 后记

giscus 方便是方便，用的是 Discussions，可以追评，基本评论系统功能都有

但是 giscus 是使用 CDN 导入的，也就是说对于国内大部分人来说，加载速度实在是太慢了

不过国内也确实没有可用的替代品，所以只能这样了，总比没有好

---

[^1]: 虽然有部分网友不这么认为
