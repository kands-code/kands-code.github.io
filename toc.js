// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item "><a href="init.html">Init</a></li><li class="chapter-item "><a href="about.html">About</a></li><li class="chapter-item affix "><li class="part-title">Notes</li><li class="chapter-item "><a href="notes/haskell/index.html">Haskell</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="notes/haskell/20241030-haskell-99-questions-0x01.html">Haskell 99 Questions :: 0x01</a></li><li class="chapter-item "><a href="notes/haskell/20241031-haskell-99-questions-0x02.html">Haskell 99 Questions :: 0x02</a></li><li class="chapter-item "><a href="notes/haskell/20241104-haskell-99-questions-0x03.html">Haskell 99 Questions :: 0x03</a></li><li class="chapter-item "><a href="notes/haskell/20241208-haskell-99-questions-0x04.html">Haskell 99 Questions :: 0x03</a></li></ol></li><li class="chapter-item "><a href="notes/rust/index.html">Rust</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="notes/rust/20240727-rust-fuction-and-clousure.html">Rust 中的函数与闭包</a></li><li class="chapter-item "><a href="notes/rust/20241102-sicp-notes-0x01.html">SICP 笔记 - 0x01</a></li><li class="chapter-item "><a href="notes/rust/20241105-sicp-notes-0x02.html">SICP 笔记 - 0x02</a></li></ol></li><li class="chapter-item "><a href="notes/sagemath/index.html">SageMath</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="notes/sagemath/20240829-sagemath-0x00.html">安装 SageMath</a></li><li class="chapter-item "><a href="notes/sagemath/20240830-sagemath-0x01.html">SageMath 基本运算与函数</a></li><li class="chapter-item "><a href="notes/sagemath/20240831-sagemath-0x02.html">SageMath 基本语法</a></li><li class="chapter-item "><a href="notes/sagemath/20240831-sagemath-0x03.html">SageMath 代数初步</a></li><li class="chapter-item "><a href="notes/sagemath/20240901-sagemath-0x04.html">SageMath 基本作图</a></li><li class="chapter-item "><a href="notes/sagemath/20240905-sagemath-0x05.html">SageMath 基本代数</a></li><li class="chapter-item "><a href="notes/sagemath/20240906-sagemath-0x06.html">SageMath 多项式</a></li></ol></li><li class="chapter-item "><li class="part-title">Miscellany</li><li class="chapter-item "><a href="miscellany/coding/index.html">Coding</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="miscellany/coding/20210604-scope-of-if-statement.html">if 语句的作用域</a></li><li class="chapter-item "><a href="miscellany/coding/20221026-parse-math-in-c.html">C 语言数学解析器</a></li><li class="chapter-item "><a href="miscellany/coding/20231107-clash-system-agent.html">C𝜆ash 系统代理</a></li><li class="chapter-item "><a href="miscellany/coding/20240228-use-giscus-in-mdbook.html">在 mdBook 中使用 giscus 服务</a></li><li class="chapter-item "><a href="miscellany/coding/20240727-use-steam-install-windows-applications.html">使用 Steam 安装 Windows 应用</a></li><li class="chapter-item "><a href="miscellany/coding/20241122-meson-for-cpp.html">使用 Meson 构建 Cpp 项目</a></li></ol></li><li class="chapter-item "><a href="miscellany/study/index.html">Study</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="miscellany/study/20221108-qiskit-linear-algebra.html">qiskit 线性代数</a></li><li class="chapter-item "><a href="miscellany/study/20221111-qiskit-Deutsch-Jozsa-algorithm.html">qiskit Deutsch-Jozsa 算法</a></li></ol></li><li class="chapter-item "><a href="miscellany/life/index.html">Life</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="miscellany/life/20230411-about-life.html">说说以后的打算罢</a></li><li class="chapter-item "><a href="miscellany/life/20230715-about-job.html">谈谈最近的工作状态</a></li><li class="chapter-item "><a href="miscellany/life/20230915-end-of-summer.html">暑假结束了</a></li><li class="chapter-item "><a href="miscellany/life/20231020-new-life.html">新的生活</a></li><li class="chapter-item "><a href="miscellany/life/20240120-busy-life.html">忙忙碌碌</a></li><li class="chapter-item "><a href="miscellany/life/20240404-decadent-life.html">颓废生活</a></li><li class="chapter-item "><a href="miscellany/life/20240721-home-life.html">居家生活</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
