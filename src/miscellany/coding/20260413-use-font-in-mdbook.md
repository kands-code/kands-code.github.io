# 在 mdBook 中使用自定义字体

<p class="archive-time">archive time: 2026-04-13</p>

<p class="sp-comment">还是有些太繁琐了</p>

## 缘起

不知道在哪次的更新后，mdBook 默认启用了 `hash-files` 功能

一开始还没什么问题，不过当我仔细查看代码部分的字体时，发现之前设置的字体无效了，
查看网络，发现对于字体的请求是 404，这很明显是路径问题

## 配置

在一番比对后，发现官方模板的 `fonts/fonts.css` 内的 `url` 格式改成了使用 `resource` 来引用，
所以解决方法还是比较简单的，那就是原本的路径改成正确的 `resource` 格式

我 `fonts` 目录的结构如下：

```plaintext
theme/fonts
├── fonts.css
├── MapleMono-Bold.ttf.woff2
├── MapleMono-BoldItalic.ttf.woff2
├── MapleMono-ExtraBold.ttf.woff2
├── MapleMono-ExtraBoldItalic.ttf.woff2
├── MapleMono-ExtraLight.ttf.woff2
├── MapleMono-ExtraLightItalic.ttf.woff2
├── MapleMono-Italic.ttf.woff2
├── MapleMono-Light.ttf.woff2
├── MapleMono-LightItalic.ttf.woff2
├── MapleMono-Medium.ttf.woff2
├── MapleMono-MediumItalic.ttf.woff2
├── MapleMono-Regular.ttf.woff2
├── MapleMono-SemiBold.ttf.woff2
├── MapleMono-SemiBoldItalic.ttf.woff2
├── MapleMono-Thin.ttf.woff2
└── MapleMono-ThinItalic.ttf.woff2
```

对应的，修复后的 `fonts.css` 内容如下：

```css
@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-Thin.ttf.woff2" }}') format("woff2");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-ThinItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 100;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-ExtraLight.ttf.woff2" }}')
    format("woff2");
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-ExtraLightItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-Light.ttf.woff2" }}') format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-LightItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 300;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-Regular.ttf.woff2" }}') format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-Italic.ttf.woff2" }}') format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-Medium.ttf.woff2" }}') format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-MediumItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 500;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-SemiBold.ttf.woff2" }}')
    format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Maple Mono";
  src: url('{{ resource "fonts/MapleMono-SemiBoldItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-Bold.ttf.woff2" }}') format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-BoldItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-ExtraBold.ttf.woff2" }}')
    format("woff2");
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono";
  src: url('{{ resource "fonts/MapleMono-ExtraBoldItalic.ttf.woff2" }}')
    format("woff2");
  font-weight: 800;
  font-style: italic;
  font-display: swap;
}
```

这些路径在编译后就变成了如下格式：

```css
@font-face {
  font-family: "MapleMono";
  src: url("../fonts/MapleMono-ThinItalic-5442aa01.ttf.woff2") format("woff2");
  font-weight: 100;
  font-style: italic;
  font-display: swap;
}
```

如此一来，字体文件和配置都可以正确被加载了

### 使用

加载好配置后，就可以在 `theme/css/variables.css` 中启用字体了，
即修改对应的 `*-font` 字体设置，例如我想要在等宽字体中使用自定义字体，可以这样：

```diff
:root {
  --sidebar-target-width: 300px;
  --sidebar-width: min(var(--sidebar-target-width), 80vw);
  --sidebar-resize-indicator-width: 8px;
  --sidebar-resize-indicator-space: 2px;
  --page-padding: 15px;
  --content-max-width: 750px;
  --menu-bar-height: 50px;
  --mono-font:
+    MapleMono, "Source Code Pro", Consolas, "Ubuntu Mono", Menlo,
    "DejaVu Sans Mono", monospace, monospace;
  --code-font-size: 0.875em; /* please adjust the ace font size accordingly in editor.js */
  --searchbar-margin-block-start: 5px;
}
```

## 后记

在配置过程中还出现了一个非常离谱的问题，那就是如果设置为：

```css
@font-face {
  font-family: "MapleMono";
  src: url("{{ resource 'fonts/MapleMono-Thin.ttf.woff2' }}") format("woff2");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
```

那么 mdBook 在编译过程中**并不会**替换其中的路径，因为 `resource` 后需要使用双引号

一开始我看到这个现象的时候，还以为官方的配置方法又改了，
在对比 GitHub 上的模板文件后我才发现了其中问题，还是有些太坑了
